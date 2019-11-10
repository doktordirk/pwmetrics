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
const junitReport_1 = require("./junitReport");
const upload_1 = require("./upload");
const fs_1 = require("./utils/fs");
const messages_1 = require("./utils/messages");
const chart_1 = require("./chart/chart");
const { prepareAssets } = require('lighthouse/lighthouse-core/lib/asset-saver');
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
        this.testName = opts.testName || 'pwmetrics';
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
        const startTime = Date.now();
        for (let runIndex of runs) {
            try {
                const lhRunner = new lh_runner_1.LHRunner(this.url, this.flags);
                const lhTrace = await lhRunner.run();
                const filePath = (ext) => path.join(this.flags.junitReporterOutputPath, `${this.testName}.${ext}`);
                const report = Array.isArray(lhTrace.report) ? lhTrace.report[0] : lhTrace.report;
                await fs_1.mkdir(this.flags.junitReporterOutputPath);
                await fs_1.writeToDisk(filePath('html'), report);
                const assets = await prepareAssets(lhTrace.artifacts);
                const trace = assets.map(data => {
                    return data.traceData;
                });
                await fs_1.writeToDisk(filePath('json'), JSON.stringify(trace[0]));
                metricsResults[runIndex] = await this.recordLighthouseTrace(lhTrace);
                this.logger.log(messages_1.getMessageWithPrefix('SUCCESS', 'SUCCESS_RUN', runIndex, runs.length));
            }
            catch (error) {
                metricsResults[runIndex] = error;
                this.logger.error(messages_1.getMessageWithPrefix('ERROR', 'FAILED_RUN', runIndex, runs.length, error.message));
            }
        }
        const testDuration = Date.now() - startTime;
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
            if (this.flags.junitReporterOutputPath) {
                const testsuiteXML = junitReport_1.getTestSuite(this.testName, this.url, testDuration, resultsToCompare, this.normalizedExpectations);
                const filePath = path.join(this.flags.junitReporterOutputPath, `${this.testName}.xml`);
                await fs_1.mkdir(this.flags.junitReporterOutputPath);
                await fs_1.writeToDisk(filePath, testsuiteXML);
                this.logger.log(messages_1.getMessageWithPrefix('SUCCESS', 'SAVED_TO_XML', filePath));
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsa0RBQWtEO0FBQ2xELDhEQUE4RDtBQVM5RCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUc3QiwrQ0FBMEM7QUFDMUMsMkNBQXNDO0FBQ3RDLDJDQUFxQztBQUNyQyxxQ0FBZ0M7QUFDaEMsK0RBQTJEO0FBQzNELGlEQUErRjtBQUMvRiwrQ0FBMkM7QUFDM0MscUNBQWdDO0FBQ2hDLG1DQUE4QztBQUM5QywrQ0FBa0U7QUFDbEUseUNBQXdDO0FBQ3hDLE1BQU0sRUFBQyxhQUFhLEVBQUMsR0FBRyxPQUFPLENBQUMsNENBQTRDLENBQUMsQ0FBQztBQWM5RSxNQUFNLG9CQUFvQixHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQywwR0FBMEcsRUFBRSxvQkFBb0IsQ0FBQztBQUU5SyxNQUFNLFNBQVM7SUFxQmIsWUFBbUIsR0FBVyxFQUFFLElBQWlCO1FBQTlCLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFwQjlCLFVBQUssR0FBaUI7WUFDcEIsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsS0FBSztZQUNiLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsS0FBSztZQUNuQixJQUFJLEVBQUUsS0FBSztZQUNYLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFdBQVcsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLElBQUk7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsVUFBVSxFQUFFLFFBQVE7U0FDckIsQ0FBQztRQVNBLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxF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