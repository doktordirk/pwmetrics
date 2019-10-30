"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
const opn = require('open');
const os = require('os');
const path = require('path');
const metrics_1 = require("./metrics/metrics");
const logger_1 = require("./utils/logger");
const lh_runner_1 = require("./lh-runner");
const sheets_1 = require("./sheets");
const metrics_adapter_1 = require("./metrics/metrics-adapter");
const expectations_1 = require("./expectations");
const upload_1 = require("./upload");
const fs_1 = require("./utils/fs");
const messages_1 = require("./utils/messages");
const chart_1 = require("./chart/chart");
const getTimelineViewerUrl = (id) => `https://chromedevtools.github.io/timeline-viewer/?loadTimelineFromURL=https://drive.google.com/file/d//${id}/view?usp=drivesdk`;
class PWMetrics {
    constructor(url, opts) {
        this.url = url;
        this.flags = {
            runs: 1,
            submit: false,
            upload: false,
            view: false,
            expectations: false,
            json: false,
            launchChrome: true,
            chromeFlags: '',
            showOutput: true,
            failOnError: false,
            outputPath: 'stdout',
        };
        this.flags = Object.assign({}, this.flags, opts.flags);
        this.runs = this.flags.runs;
        this.sheets = opts.sheets;
        this.clientSecret = opts.clientSecret;
        const expectations = opts.expectations;
        // normalize path if provided
        if (this.flags.chromePath) {
            this.flags.chromePath = path.normalize(this.flags.chromePath);
        }
        if (this.flags.expectations) {
            if (expectations) {
                expectations_1.validateMetrics(expectations);
                this.normalizedExpectations = expectations_1.normalizeExpectationMetrics(expectations);
            }
            else
                throw new Error(messages_1.getMessageWithPrefix('ERROR', 'NO_EXPECTATIONS_FOUND'));
        }
        this.logger = logger_1.Logger.getInstance({ showOutput: this.flags.showOutput });
    }
    async start() {
        const runs = Array.apply(null, { length: +this.runs }).map(Number.call, Number);
        let metricsResults = [];
        for (let runIndex of runs) {
            try {
                const lhRunner = new lh_runner_1.LHRunner(this.url, this.flags);
                const lhTrace = await lhRunner.run();
                metricsResults[runIndex] = await this.recordLighthouseTrace(lhTrace);
                this.logger.log(messages_1.getMessageWithPrefix('SUCCESS', 'SUCCESS_RUN', runIndex, runs.length));
            }
            catch (error) {
                metricsResults[runIndex] = error;
                this.logger.error(messages_1.getMessageWithPrefix('ERROR', 'FAILED_RUN', runIndex, runs.length, error.message));
            }
        }
        const results = { runs: metricsResults.filter(r => !(r instanceof Error)) };
        if (this.runs > 1 && !this.flags.submit) {
            results.median = this.findMedianRun(results.runs);
            this.logger.log(messages_1.getMessage('MEDIAN_RUN'));
            this.displayOutput(results.median);
        }
        else if (this.flags.submit) {
            const sheets = new sheets_1.Sheets(this.sheets, this.clientSecret);
            if (this.sheets.options.uploadMedian) {
                results.median = this.findMedianRun(results.runs);
                await sheets.appendResults([results.median]);
            }
            else {
                await sheets.appendResults(results.runs);
            }
        }
        await this.outputData(results);
        if (this.flags.expectations) {
            const resultsToCompare = this.runs > 1 ? results.median.timings : results.runs[0].timings;
            const hasExpectationsWarnings = this.resultHasExpectationIssues(resultsToCompare, 'warn');
            const hasExpectationsErrors = this.resultHasExpectationIssues(resultsToCompare, 'error');
            if (hasExpectationsWarnings || hasExpectationsErrors) {
                expectations_1.checkExpectations(resultsToCompare, this.normalizedExpectations);
                if (hasExpectationsErrors && this.flags.failOnError) {
                    throw new Error(messages_1.getMessage('HAS_EXPECTATION_ERRORS'));
                }
                else {
                    this.logger.warn(messages_1.getMessage('HAS_EXPECTATION_ERRORS'));
                }
            }
        }
        return results;
    }
    resultHasExpectationIssues(timings, issueType) {
        return timings.some((timing) => {
            const expectation = this.normalizedExpectations[timing.id];
            if (!expectation) {
                return false;
            }
            const expectedLimit = expectation[issueType];
            return expectedLimit !== undefined && timing.timing >= expectedLimit;
        });
    }
    async recordLighthouseTrace(data) {
        try {
            const preparedData = metrics_adapter_1.adaptMetricsData(data.lhr);
            if (this.flags.upload) {
                const driveResponse = await upload_1.upload(data, this.clientSecret);
                this.view(driveResponse.id);
            }
            if (!this.flags.submit && this.runs <= 1) {
                this.displayOutput(preparedData);
            }
            return preparedData;
        }
        catch (error) {
            throw error;
        }
    }
    displayOutput(data) {
        if (!this.flags.json)
            this.showChart(data);
        return data;
    }
    showChart(data) {
        // reverse to preserve the order, because cli-chart.
        let timings = data.timings;
        timings = timings.filter(r => {
            // filter out metrics that failed to record
            if (r.timing === undefined || isNaN(r.timing)) {
                this.logger.error(messages_1.getMessageWithPrefix('ERROR', 'METRIC_IS_UNAVAILABLE', r.title));
                return false;
            }
            else {
                return true;
            }
        });
        const fullWidthInMs = Math.max(...timings.map(result => result.timing));
        const maxLabelWidth = Math.max(...timings.map(result => result.title.length));
        const terminalWidth = +process.stdout.columns || 90;
        chart_1.drawChart(timings, {
            // 90% of terminal width to give some right margin
            width: terminalWidth * 0.9 - maxLabelWidth,
            xlabel: 'Time (ms) since navigation start',
            xmin: 0,
            // nearest second
            xmax: Math.ceil(fullWidthInMs / 1000) * 1000,
            lmargin: maxLabelWidth + 1,
        });
        return data;
    }
    findMedianRun(results) {
        const TTFCPUIDLEValues = results.map(r => r.timings.find(timing => timing.id === metrics_1.METRICS.TTFCPUIDLE).timing);
        const medianTTFCPUIDLE = this.median(TTFCPUIDLEValues);
        // in the case of duplicate runs having the exact same TTFI, we naively pick the first
        // @fixme, but any for now...
        return results.find((result) => result.timings.find((timing) => timing.id === metrics_1.METRICS.TTFCPUIDLE && timing.timing === medianTTFCPUIDLE));
    }
    median(values) {
        if (values.length === 1)
            return values[0];
        values.sort((a, b) => a - b);
        const half = Math.floor(values.length / 2);
        return values[half];
    }
    view(id) {
        if (this.flags.view) {
            opn(getTimelineViewerUrl(id));
        }
    }
    outputData(data) {
        if (this.flags.json) {
            // serialize accordingly
            const formattedData = JSON.stringify(data, null, 2) + os.EOL;
            // output to file.
            if (this.flags.outputPath !== 'stdout') {
                return fs_1.writeToDisk(this.flags.outputPath, formattedData);
                // output to stdout
            }
            else if (formattedData) {
                return Promise.resolve(process.stdout.write(formattedData));
            }
        }
    }
}
module.exports = PWMetrics;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsa0RBQWtEO0FBQ2xELDhEQUE4RDtBQVM5RCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUc3QiwrQ0FBMEM7QUFDMUMsMkNBQXNDO0FBQ3RDLDJDQUFxQztBQUNyQyxxQ0FBZ0M7QUFDaEMsK0RBQTJEO0FBQzNELGlEQUErRjtBQUMvRixxQ0FBZ0M7QUFDaEMsbUNBQXVDO0FBQ3ZDLCtDQUFrRTtBQUNsRSx5Q0FBd0M7QUFjeEMsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsMEdBQTBHLEVBQUUsb0JBQW9CLENBQUM7QUFFOUssTUFBTSxTQUFTO0lBb0JiLFlBQW1CLEdBQVcsRUFBRSxJQUFpQjtRQUE5QixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBbkI5QixVQUFLLEdBQWlCO1lBQ3BCLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxFQUFFLEtBQUs7WUFDYixNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEtBQUs7WUFDbkIsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsSUFBSTtZQUNsQixXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFVBQVUsRUFBRSxRQUFRO1NBQ3JCLENBQUM7UUFRQSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxJ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