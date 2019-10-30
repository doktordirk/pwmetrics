"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
const metrics_1 = require("../metrics/metrics");
const GREEN = '\x1B[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1B[31m';
const RESET = '\x1B[0m';
const BOLD = '\x1b[1m';
const greenify = (str) => `${GREEN}${str}${RESET}`;
const redify = (str) => `${RED}${str}${RESET}`;
const yellowify = (str) => `${YELLOW}${str}${RESET}`;
const boldify = (str) => `${BOLD}${str}${RESET}`;
const GREEN_CHECK = greenify('✓');
const YELLOW_FLAG = yellowify('⚑');
const RED_X = redify('✘');
const getErrorPrefix = () => `  ${RED_X} Error: ${RED}`;
const getWarningPrefix = () => `  ${YELLOW_FLAG} Warning: ${YELLOW}`;
const getSuccessPrefix = () => `  ${GREEN_CHECK} Success: ${GREEN}`;
exports.getMessage = function (messageType, ...args) {
    switch (messageType) {
        case 'NO_URL':
            return 'No url entered.';
        case 'LAUNCHING_CHROME':
            return 'Launching Chrome';
        case 'WAITING':
            return 'Waiting...';
        case 'CLOSING_CHROME':
            return '\nClosing Chrome';
        case 'CRI_TIMEOUT_RELAUNCH':
            return 'CRI_TIMEOUT error. Running Lighthouse one more time ...';
        case 'CRI_TIMEOUT_REJECT':
            return 'CRI_TIMEOUT error. Giving up running Lighthouse';
        case 'MEDIAN_RUN':
            return '        ☆  Median run  ☆';
        case 'SAVED_TO_JSON':
            return `Data was saved into file ${args[0]}`;
        case 'NO_METRICS':
            return 'No expectation metrics were found';
        case 'NO_EXPECTATION_ERROR':
            return `Metric ${args[0]} has to have warn and error values`;
        case 'NO_EXPECTATIONS_FOUND':
            return 'expectation flag set but no expectations found on config file';
        case 'NO_SHEET_TYPE':
            return `Sheet type ${args[0]} is not available.`;
        case 'NO_GOOGLE_SHEET_OPTIONS':
            return 'Some of options for submitting data to Google Sheets are absent';
        case 'NO_MESSAGE_PREFIX_TYPE':
            return `No matching message prefix: ${args[0]}`;
        case 'METRIC_IS_UNAVAILABLE':
            return `Sorry, ${args[0]} metric is unavailable`;
        case metrics_1.METRICS.TTFCP:
            return 'First Contentful Paint';
        case metrics_1.METRICS.TTFMP:
            return 'First Meaningful Paint';
        case metrics_1.METRICS.SI:
            return 'Speed Index';
        case metrics_1.METRICS.TTFCPUIDLE:
            return 'First CPU Idle';
        case metrics_1.METRICS.TTI:
            return 'Time to Interactive';
        case 'SUCCESS_RUN':
            return `Run ${args[0] + 1} of ${args[1]} finished successfully`;
        case 'FAILED_RUN':
            return `Unable to complete run ${args[0] + 1} of ${args[1]} due to ${args[2]}`;
        case 'G_OAUTH_ACCESS_ERROR':
            return `Error while trying to retrieve access token, ${args[0]}`;
        case 'G_OAUTH_ENTER_CODE':
            return `Authorize this app by visiting this url: ${args[0]}\nEnter the code from that page here: `;
        case 'G_OAUTH_STORED_TOKEN':
            return `Token stored to ${args[0]}`;
        case 'G_SHEETS_APPENDING':
            return `Appending...\n${args[0]}`;
        case 'G_SHEETS_APPENDED':
            return `Appended\n${args[0]}`;
        case 'G_SHEETS_API_ERROR':
            return `The API returned an error: ${args[0]}`;
        case 'G_DRIVE_UPLOADING':
            return 'Uploading trace to Google Drive...';
        case 'G_DRIVE_UPLOADED':
            return 'Trace uploaded to Google Drive...';
        case 'HAS_EXPECTATION_ERRORS':
            return 'Expectation with errors.';
        default:
            throw new Error(`No matching message ID: ${messageType}`);
    }
};
exports.getAssertionMessage = function (assertionLevel, messageType, expectedValue, actualValue) {
    const message = exports.getMessageWithPrefix(assertionLevel, messageType);
    const colorizer = assertionLevel === 'ERROR' ? redify : yellowify;
    const expectedStr = boldify(`${expectedValue} ms`);
    const actualStr = boldify(colorizer(`${actualValue} ms`));
    return `${message} Expected ${expectedStr}, but found ${actualStr}.`;
};
exports.getMessageWithPrefix = function (assertionLevel, messageType, ...args) {
    let prefix;
    const message = exports.getMessage(messageType, ...args);
    switch (assertionLevel) {
        case 'ERROR':
            prefix = getErrorPrefix();
            break;
        case 'WARNING':
            prefix = getWarningPrefix();
            break;
        case 'SUCCESS':
            prefix = getSuccessPrefix();
            break;
        default:
            throw new Error(exports.getMessage(messageType, assertionLevel));
    }
    return `${prefix}${message}.${RESET}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUFrRDtBQUNsRCw4REFBOEQ7QUFDOUQsZ0RBQTJDO0FBRTNDLE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQztBQUN6QixNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUM7QUFDMUIsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDO0FBQ3ZCLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQztBQUN4QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUM7QUFFdkIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQztBQUMzRCxNQUFNLE1BQU0sR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEtBQUssRUFBRSxDQUFDO0FBQ3ZELE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDN0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQztBQUV6RCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMxQixNQUFNLGNBQWMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLEtBQUssV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN4RCxNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssV0FBVyxhQUFhLE1BQU0s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