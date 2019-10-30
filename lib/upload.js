"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const { prepareAssets } = require('lighthouse/lighthouse-core/lib/asset-saver');
const GDrive = require('./drive/gdrive');
exports.upload = async function (metricsData, clientSecret) {
    try {
        const assets = await prepareAssets(metricsData.artifacts, metricsData.lhr.audits);
        const trace = assets.map(data => {
            return data.traceData;
        });
        const fileName = `lighthouse-results-${Date.now()}.json`;
        const gDrive = new GDrive(clientSecret);
        return await gDrive.uploadToDrive(trace[0], fileName);
    }
    catch (error) {
        throw error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXBsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUU5RCxNQUFNLEVBQUMsYUFBYSxFQUFDLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFHOUUsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFNUIsUUFBQSxNQUFNLEdBQUcsS0FBSyxXQUFVLFdBQTRCLEVBQUUsWUFBa0M7SUFDbkcsSUFBSTtRQUNGLE1BQU0sTUFBTSxHQUFxQixNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEcsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxzQkFBc0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUM7UUFDekQsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDeEMsT0FBTyxNQUFNLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZEO0lBQUMsT0FBTSxLQUFLLEVBQUU7UUFDYixNQUFNLEtBQUssQ0FBQztLQUNiO0FBQ0gsQ0FBQyxDQUFDIn0=