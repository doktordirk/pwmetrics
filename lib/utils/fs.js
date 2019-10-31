"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const promisify = require("micro-promisify");
const mkdirp = require("mkdirp");
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
function mkdir(path) {
    return new Promise(async (resolve, reject) => {
        try {
            await promisify(mkdirp)(path);
        }
        catch (err) {
            reject(err);
        }
        resolve();
    });
}
exports.mkdir = mkdir;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsa0RBQWtEO0FBQ2xELDhEQUE4RDs7QUFFOUQsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUN6Qiw2Q0FBNkM7QUFDN0MsaUNBQWlDO0FBRWpDLHlDQUFnRDtBQUNoRCxxQ0FBZ0M7QUFFaEMsTUFBTSxNQUFNLEdBQUcsZUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBR3BDLFNBQWdCLGlCQUFpQixDQUFDLFdBQW1CLGNBQWM7SUFDakUsSUFBSSxRQUFnQixDQUFDO0lBQ3JCLElBQUk7UUFDRixRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDN0M7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RELFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLElBQUcsTUFBTSxLQUFLLElBQUksSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7UUFDaEQsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUNuQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDOztZQUMzQixPQUFPLE1BQU0sQ0FBQztLQUNwQjs7UUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRTVELENBQUM7QUFmRCw4Q0FlQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxRQUFnQixFQUFFLElBQVk7SUFDeEQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQzNDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXBELElBQUk7WUFDRixNQUFNLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDYjtRQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQW9CLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsa0NBYUM7QUFFRCxTQUFnQixLQUFLLENBQUMsSUFBWTtJQUNoQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDM0MsSUFBSTtZQUNGLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9CO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDYjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBVkQsc0JBVUM7QUFBQSxDQUFDIn0=