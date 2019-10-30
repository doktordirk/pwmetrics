"use strict";
// Copyright 2018 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const lighthouse = require('lighthouse/lighthouse-core');
const parseChromeFlags = require('lighthouse/lighthouse-cli/run').parseChromeFlags;
const chrome_launcher_1 = require("chrome-launcher");
const logger_1 = require("./utils/logger");
const messages_1 = require("./utils/messages");
const perfConfig = require('./perf-config');
const MAX_LIGHTHOUSE_TRIES = 2;
class LHRunner {
    //@todo improve FeatureFlags -> LHFlags
    constructor(url, flags) {
        this.url = url;
        this.flags = flags;
        this.tryLighthouseCounter = 0;
        this.logger = logger_1.Logger.getInstance({ showOutput: this.flags.showOutput });
    }
    async run() {
        try {
            let lhResults;
            if (this.flags.launchChrome) {
                await this.launchChrome();
            }
            if (process.env.CI) {
                // handling CRI_TIMEOUT issue - https://github.com/GoogleChrome/lighthouse/issues/833
                this.tryLighthouseCounter = 0;
                lhResults = await this.runLighthouseOnCI().then((lhResults) => {
                    // fix for https://github.com/paulirish/pwmetrics/issues/63
                    return new Promise(resolve => {
                        this.logger.log(messages_1.getMessage('WAITING'));
                        setTimeout(_ => {
                            return resolve(lhResults);
                        }, 2000);
                    });
                });
            }
            else {
                lhResults = await lighthouse(this.url, this.flags, this.flags.config || perfConfig);
            }
            await this.killLauncher();
            return lhResults;
        }
        catch (error) {
            await this.killLauncher();
            throw error;
        }
    }
    async killLauncher() {
        if (typeof this.launcher !== 'undefined') {
            await this.launcher.kill();
        }
    }
    async runLighthouseOnCI() {
        try {
            return await lighthouse(this.url, this.flags, perfConfig);
        }
        catch (error) {
            if (error.code === 'CRI_TIMEOUT' && this.tryLighthouseCounter <= MAX_LIGHTHOUSE_TRIES) {
                return await this.retryLighthouseOnCI();
            }
            if (this.tryLighthouseCounter > MAX_LIGHTHOUSE_TRIES) {
                throw new Error(messages_1.getMessage('CRI_TIMEOUT_REJECT'));
            }
        }
    }
    async retryLighthouseOnCI() {
        this.tryLighthouseCounter++;
        this.logger.log(messages_1.getMessage('CRI_TIMEOUT_RELAUNCH'));
        try {
            return await this.runLighthouseOnCI();
        }
        catch (error) {
            this.logger.error(error.message);
            this.logger.error(messages_1.getMessage('CLOSING_CHROME'));
            await this.killLauncher();
        }
    }
    async launchChrome() {
        try {
            this.logger.log(messages_1.getMessage('LAUNCHING_CHROME'));
            this.launcher = await chrome_launcher_1.launch({
                port: this.flags.port,
                chromeFlags: parseChromeFlags(this.flags.chromeFlags),
                chromePath: this.flags.chromePath
            });
            this.flags.port = this.launcher.port;
            return this.launcher;
        }
        catch (error) {
            this.logger.error(error);
            await this.killLauncher();
            return error;
        }
    }
}
exports.LHRunner = LHRunner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGgtcnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGgtcnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUU5RCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN6RCxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO0FBQ25GLHFEQUF1RDtBQUN2RCwyQ0FBc0M7QUFFdEMsK0NBQTRDO0FBRTVDLE1BQU0sVUFBVSxHQUFRLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNqRCxNQUFNLG9CQUFvQixHQUFHLENBQUMsQ0FBQztBQUUvQixNQUFhLFFBQVE7SUFLbkIsdUNBQXVDO0lBQ3ZDLFlBQW1CLEdBQVcsRUFBUyxLQUFtQjtRQUF2QyxRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUN4RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHO1FBQ1AsSUFBSTtZQUNGLElBQUksU0FBMEIsQ0FBQztZQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO2dCQUMzQixNQUFNLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzthQUMzQjtZQUVELElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xCLHFGQUFxRjtnQkFDckYsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUMsQ0FBQztnQkFDOUIsU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFD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