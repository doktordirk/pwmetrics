"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleOauth = require('../oauth/google-oauth');
const gsheets = require("./gsheets");
// @todo add 'import' after moving all stuff to typescript
const { getMessage } = require('../utils/messages');
const { METRICS } = require('../metrics/metrics');
const SHEET_TYPES = {
    'GOOGLE_SHEETS': 'GOOGLE_SHEETS'
};
class Sheets {
    constructor(config, clientSecret) {
        this.config = config;
        this.clientSecret = clientSecret;
        this.validateOptions(config, clientSecret);
    }
    validateOptions(config, clientSecret) {
        if (!config || !Object.keys(config).length)
            throw new Error(getMessage('NO_GOOGLE_SHEET_OPTIONS'));
        const sheetType = config.type;
        if (!Object.keys(SHEET_TYPES).includes(sheetType)) {
            throw new Error(getMessage('NO_SHEET_TYPE', sheetType));
        }
        switch (sheetType) {
            case SHEET_TYPES.GOOGLE_SHEETS:
                if (!config.options.spreadsheetId || !config.options.tableName || !clientSecret)
                    throw new Error(getMessage('NO_GOOGLE_SHEET_OPTIONS'));
                break;
            default:
                throw new Error(getMessage('NO_GOOGLE_SHEET_OPTIONS'));
        }
    }
    appendResults(results) {
        switch (this.config.type) {
            case SHEET_TYPES.GOOGLE_SHEETS:
                return this.appendResultsToGSheets(results);
        }
    }
    async appendResultsToGSheets(results) {
        let valuesToAppend = [];
        results.forEach(data => {
            const getTiming = (key) => data.timings.find(t => t.id === key).timing;
            const dateObj = new Date(data.generatedTime);
            // order matters
            valuesToAppend.push([
                data.lighthouseVersion,
                data.requestedUrl,
                `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`,
                getTiming(METRICS.TTFCP),
                getTiming(METRICS.TTFMP),
                getTiming(METRICS.SI),
                getTiming(METRICS.TTFCPUIDLE),
                getTiming(METRICS.TTI),
            ]);
        });
        try {
            const googleOauth = new GoogleOauth();
            const oauth = await googleOauth.authenticate(this.clientSecret);
            await gsheets.appendResults(oauth, valuesToAppend, this.config.options);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Sheets = Sheets;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsa0RBQWtEO0FBQ2xELDhEQUE4RDs7QUFJOUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDckQscUNBQXNDO0FBRXRDLDBEQUEwRDtBQUMxRCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDcEQsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBRWxELE1BQU0sV0FBVyxHQUFHO0lBQ2xCLGVBQWUsRUFBRSxlQUFlO0NBQ2pDLENBQUM7QUFFRixNQUFhLE1BQU07SUFDakIsWUFBbUIsTUFBb0IsRUFBUyxZQUFrQztRQUEvRCxXQUFNLEdBQU4sTUFBTSxDQUFjO1FBQVMsaUJBQVksR0FBWixZQUFZLENBQXNCO1FBQ2hGLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxlQUFlLENBQUMsTUFBb0IsRUFBRSxZQUFrQztRQUN0RSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNO1lBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQztRQUV6RCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUN6RDtRQUVELFFBQVEsU0FBUyxFQUFFO1lBQ2pCLEtBQUssV0FBVyxDQUFDLGFBQWE7Z0JBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsWUFBWTtvQkFDN0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxPQUE4QjtRQUMxQyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQ3hCLEtBQUssV0FBVyxDQUFDLGFBQWE7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxPQUE4QjtRQUN6RCxJQUFJLGNBQWMsR0FBaUMsRUFBRSxDQUFDO1FBQ3RELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDL0UsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdDLGdCQUFnQjtZQUNoQixjQUFjLENBQUMsSUFBSSxDQUFDO2dCQUNsQixJQUFJLENBQUMsaUJBQWlCO2dCQUN0QixJQUFJLENBQUMsWUFBWTtnQkFDakIsR0FBRyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDakUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Z0JBQ3hCLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUN4QixTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDckIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7Z0JBQzdCLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO2FBQ3ZCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSTtZQUNGLE1BQU0sV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDdEMsTUFBTSxLQUFLLEdBQWlCLE1BQU0sV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDOUUsTUFBTSxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6RTtRQUFDLE9BQU0sS0FBSyxFQUFFO1lBQ2IsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUM7Q0FDRjtBQXpERCx3QkF5REMifQ==