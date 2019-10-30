"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const GoogleAuth = require('google-auth-library');
const readlineSync = require('readline-sync');
const { getMessage } = require('../utils/messages');
const logger_1 = require("../utils/logger");
const logger = logger_1.Logger.getInstance();
/* improve the bad polyfill that devtools-frontend did */
//@todo remove after https://github.com/GoogleChrome/lighthouse/issues/1535 will be closed
const globalAny = global;
const self = globalAny.self || this;
self.setImmediate = function (callback) {
    Promise.resolve().then(_ => callback.apply(null, [...arguments].slice(1)));
    return 0;
};
// If modifying these this.scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-pwmetrics.json
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
];
const EEXIST = 'EEXIST';
class GoogleOauth {
    constructor() {
        this.tokenDir = path.join((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE), '/.credentials/');
        this.tokenPath = path.join(this.tokenDir, 'sheets.googleapis.com-nodejs-pwmetrics.json');
    }
    async authenticate(clientSecret) {
        try {
            return await this.authorize(clientSecret);
        }
        catch (error) {
            throw error;
        }
    }
    async authorize(credentials) {
        const clientSecret = credentials.installed.client_secret;
        const clientId = credentials.installed.client_id;
        const redirectUrl = credentials.installed.redirect_uris[0];
        const auth = new GoogleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        try {
            const token = this.getToken();
            oauth2Client.credentials = typeof token === 'string' ? JSON.parse(token) : token;
            return oauth2Client;
        }
        catch (error) {
            return await this.getNewToken(oauth2Client);
        }
    }
    getToken() {
        return fs.readFileSync(this.tokenPath, 'utf8');
    }
    async getNewToken(oauth2Client) {
        try {
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });
            const code = this.readline(authUrl);
            const token = await this.getOauth2ClientToken(oauth2Client, code);
            oauth2Client.credentials = token;
            this.storeToken(token);
            return oauth2Client;
        }
        catch (error) {
            throw new Error(getMessage('G_OAUTH_ACCESS_ERROR', error.message));
        }
    }
    readline(authUrl) {
        return readlineSync.question(getMessage('G_OAUTH_ENTER_CODE', authUrl), {
            hideEchoBack: true
        });
    }
    getOauth2ClientToken(oauth2Client, code) {
        return new Promise((resolve, reject) => {
            oauth2Client.getToken(code, (error, token) => {
                if (error)
                    return reject(error);
                else
                    return resolve(token);
            });
        });
    }
    storeToken(token) {
        try {
            fs.mkdirSync(this.tokenDir);
        }
        catch (error) {
            if (error.code !== EEXIST) {
                throw error;
            }
        }
        fs.writeFileSync(this.tokenPath, JSON.stringify(token));
        logger.log(getMessage('G_OAUTH_STORED_TOKEN', this.tokenPath));
    }
}
module.exports = GoogleOauth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW9hdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ29vZ2xlLW9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUU5RCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBRTdCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUU5QyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFHcEQsNENBQXVDO0FBQ3ZDLE1BQU0sTUFBTSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUVwQyx5REFBeUQ7QUFDekQsMEZBQTBGO0FBQzFGLE1BQU0sU0FBUyxHQUFRLE1BQU0sQ0FBQztBQUM5QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQztBQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVMsUUFBWTtJQUN2QyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDLENBQUM7QUFFRiwyRUFBMkU7QUFDM0UsZ0VBQWdFO0FBQ2hFLE1BQU0sTUFBTSxHQUFHO0lBQ2IsOENBQThDO0lBQzlDLHVDQUF1QztJQUN2Qyw0Q0FBNEM7Q0FDN0MsQ0FBQztBQUNGLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUV4QixNQUFNLFdBQVc7SUFBakI7UUFDVSxhQUFRLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxH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