"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const google = require('googleapis');
const promisify = require('micro-promisify');
const { getMessage } = require('../utils/messages');
const logger_1 = require("../utils/logger");
const logger = logger_1.Logger.getInstance();
async function getRange(auth, range, spreadsheetId) {
    try {
        const sheets = google.sheets('v4');
        const response = await promisify(sheets.spreadsheets.values.get)({
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: range
        });
        return response.values;
    }
    catch (error) {
        logger.error(getMessage('G_SHEETS_API_ERROR', error));
        throw new Error(error);
    }
}
const formatValues = (values) => {
    let newValues = values.slice();
    return newValues.reduce((result, value) => {
        return result.concat(value.slice(3).join('\t')).concat('\n');
    }, []).join('');
};
async function appendResults(auth, valuesToAppend, options) {
    try {
        const sheets = google.sheets('v4');
        // clone values to append
        const values = Object.assign([], valuesToAppend);
        logger.log(getMessage('G_SHEETS_APPENDING', formatValues(valuesToAppend)));
        const response = await promisify(sheets.spreadsheets.values.append)({
            auth: auth,
            spreadsheetId: options.spreadsheetId,
            range: `${options.tableName}!A1:C1`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values,
            },
        });
        const rangeValues = await getRange(auth, response.updates.updatedRange, options.spreadsheetId);
        logger.log(getMessage('G_SHEETS_APPENDED', formatValues(rangeValues)));
    }
    catch (error) {
        logger.error(getMessage('G_SHEETS_API_ERROR', error));
        throw new Error(error);
    }
}
exports.appendResults = appendResults;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3NoZWV0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdzaGVldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtEQUFrRDtBQUNsRCw4REFBOEQ7O0FBRTlELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNyQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUU3QyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFHcEQsNENBQXlDO0FBQ3pDLE1BQU0sTUFBTSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUVwQyxLQUFLLFVBQVUsUUFBUSxDQUFDLElBQWtCLEVBQUUsS0FBYSxFQUFFLGFBQXFCO0lBQzlFLElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9ELElBQUksRUFBRSxJQUFJO1lBQ1YsYUFBYSxFQUFFLGFBQWE7WUFDNUIsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQUM7UUFDSCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUM7S0FDeEI7SUFBQyxPQUFNLEtBQUssRUFBRTtRQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtBQUNILENBQUM7QUFFRCxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQW9DLEVBQUUsRUFBRTtJQUM1RCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDL0IsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBVyxFQUFFLEtBQVUsRUFBRSxFQUFFO1FBQ2xELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVGLEtBQUssVUFBVSxhQUFhLENBQUMsSUFBa0IsRUFBRSxjQUE0QyxFQUFFLE9BQW1DO0lBQ2hJLElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLHlCQUF5QjtRQUN6QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUNqRCxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNFLE1BQU0sUUFBUSxHQUFHLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xFLElBQUksRUFBRSxJQUFJO1lBQ1YsYUFBYSxFQUFFLE9BQU8sQ0FBQyxhQUFhO1lBQ3BDLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLFFBQVE7WUFDbkMsZ0JBQWdCLEVBQUUsY0FBYztZQUNoQyxRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGLENBQUMsQ0FBQztRQUNILE1BQU0sV0FBVyxHQUFpQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdILE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEU7SUFBQyxPQUFNLEtBQUssRUFBRTtRQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4QjtBQUNILENBQUM7QUFHQyxzQ0FBYSJ9