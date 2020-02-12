"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
const opn = require('open');
const os = require('os');
const path = require('path');
const logger_1 = require("./utils/logger");
const lh_runner_1 = require("./lh-runner");
const sheets_1 = require("./sheets");
const metrics_adapter_1 = require("./metrics/metrics-adapter");
const expectations_1 = require("./expectations");
const junitReport_1 = require("./junitReport");
const upload_1 = require("./upload");
const fs_1 = require("./utils/fs");
const messages_1 = require("./utils/messages");
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
        this.sheets = Object.assign({}, opts.sheets);
        this.sheets.options.tableName = opts.testName;
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
            // results.median = this.findMedianRun(results.runs);
            // this.logger.log(getMessage('MEDIAN_RUN'));
            // this.displayOutput(results.median);
        }
        else if (this.flags.submit) {
            const sheets = new sheets_1.Sheets(this.sheets, this.clientSecret);
            if (this.sheets.options.uploadMedian) {
                // results.median = this.findMedianRun(results.runs);
                // await sheets.appendResults([results.median]);
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
        return false;
        // return timings.some((timing: Timing) => {
        //   const expectation = this.normalizedExpectations[timing.id];
        //   if (!expectation) {
        //     return false;
        //   }
        //   const expectedLimit = expectation[issueType];
        //   return expectedLimit !== undefined && timing.timing >= expectedLimit;
        // });
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
        // let timings = data.timings;
        // timings = timings.filter(r => {
        //   // filter out metrics that failed to record
        //   if (r.timing === undefined || isNaN(r.timing)) {
        //     this.logger.error(getMessageWithPrefix('ERROR', 'METRIC_IS_UNAVAILABLE', r.title));
        //     return false;
        //   } else {
        //     return true;
        //   }
        // });
        // const fullWidthInMs = Math.max(...timings.map(result => result.timing));
        // const maxLabelWidth = Math.max(...timings.map(result => result.title.length));
        // const terminalWidth = +process.stdout.columns || 90;
        // drawChart(timings, {
        //   // 90% of terminal width to give some right margin
        //   width: terminalWidth * 0.9 - maxLabelWidth,
        //   xlabel: 'Time (ms) since navigation start',
        //   xmin: 0,
        //   // nearest second
        //   xmax: Math.ceil(fullWidthInMs / 1000) * 1000,
        //   lmargin: maxLabelWidth + 1,
        // });
        return data;
    }
    // findMedianRun(results: MetricsResults[]): MetricsResults {
    //   const TTFCPUIDLEValues = results.map(r => r.timings.find(timing => timing.id === METRICS.TTFCPUIDLE).timing);
    //   const medianTTFCPUIDLE = this.median(TTFCPUIDLEValues);
    //   // in the case of duplicate runs having the exact same TTFI, we naively pick the first
    //   // @fixme, but any for now...
    //   return results.find((result: any) => result.timings.find((timing: any) =>
    //     timing.id === METRICS.TTFCPUIDLE && timing.timing === medianTTFCPUIDLE
    //     )
    //   );
    // }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsa0RBQWtEO0FBQ2xELDhEQUE4RDtBQVM5RCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUk3QiwyQ0FBc0M7QUFDdEMsMkNBQXFDO0FBQ3JDLHFDQUFnQztBQUNoQywrREFBMkQ7QUFDM0QsaURBQStGO0FBQy9GLCtDQUEyQztBQUMzQyxxQ0FBZ0M7QUFDaEMsbUNBQThDO0FBQzlDLCtDQUFrRTtBQUVsRSxNQUFNLEVBQUMsYUFBYSxFQUFDLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFjOUUsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsMEdBQTBHLEVBQUUsb0JBQW9CLENBQUM7QUFFOUssTUFBTSxTQUFTO0lBcUJiLFlBQW1CLEdBQVcsRUFBRSxJQUFpQjtRQUE5QixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBcEI5QixVQUFLLEdBQWlCO1lBQ3BCLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxFQUFFLEtBQUs7WUFDYixNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxLQUFLO1lBQ1gsWUFBWSxFQUFFLEtBQUs7WUFDbkIsSUFBSSxFQUFFLEtBQUs7WUFDWCxZQUFZLEVBQUUsSUFBSTtZQUNsQixXQUFXLEVBQUUsRUFBRTtZQUNmLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFVBQVUsRUFBRSxRQUFRO1NBQ3JCLENBQUM7UUFTQSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVB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