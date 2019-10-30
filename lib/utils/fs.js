"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const promisify = require("micro-promisify");
const messages_1 = require("./messages");
const logger_1 = require("./logger");
const logger = logger_1.Logger.getInstance();
function getConfigFromFile(fileName = 'package.json') {
    let resolved;
    try {
        resolved = require.resolve(`./${fileName}`);
    }
    catch (e) {
        const cwdPath = path.resolve(process.cwd(), fileName);
        resolved = require.resolve(cwdPath);
    }
    const config = require(resolved);
    if (config !== null && typeof config === 'object') {
        if (resolved.endsWith('package.json'))
            return config.pwmetrics || {};
        else
            return config;
    }
    else
        throw new Error(`Invalid config from ${fileName}`);
}
exports.getConfigFromFile = getConfigFromFile;
function writeToDisk(fileName, data) {
    return new Promise(async (resolve, reject) => {
        const filePath = path.join(process.cwd(), fileName);
        try {
            await promisify(fs.writeFile)(filePath, data);
        }
        catch (err) {
            reject(err);
        }
        logger.log(messages_1.getMessageWithPrefix('SUCCESS', 'SAVED_TO_JSON', filePath));
        resolve();
    });
}
exports.writeToDisk = writeToDisk;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsa0RBQWtEO0FBQ2xELDhEQUE4RDs7QUFFOUQsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6Qiw2Q0FBNkM7QUFFN0MseUNBQWdEO0FBQ2hELHFDQUFnQztBQUVoQyxNQUFNLE1BQU0sR0FBRyxlQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7QUFHcEMsU0FBZ0IsaUJBQWlCLENBQUMsV0FBbUIsY0FBYztJQUNqRSxJQUFJLFFBQWdCLENBQUM7SUFDckIsSUFBSTtRQUNGLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFLENBQUMsQ0FBQztLQUM3QztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEQsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDckM7SUFDRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakMsSUFBRyxNQUFNLEtBQUssSUFBSSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUNoRCxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ25DLE9BQU8sTUFBTSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7O1lBQzNCLE9BQU8sTUFBTSxDQUFDO0tBQ3BCOztRQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFNUQsQ0FBQztBQWZELDhDQWVDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLFFBQWdCLEVBQUUsSUFBWTtJQUN4RCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDM0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFcEQsSUFBSTtZQUNGLE1BQU0sU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDL0M7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNiO1FBRUQsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBb0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDdkUsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFiRCxrQ0FhQyJ9