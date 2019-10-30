"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const google = require('googleapis');
const promisify = require('micro-promisify');
const logger_1 = require("../utils/logger");
const GoogleOauth = require('../oauth/google-oauth');
const messages = require('../utils/messages');
const logger = logger_1.Logger.getInstance();
class GDrive {
    constructor(clientSecret) {
        this.clientSecret = clientSecret;
    }
    async getOauth() {
        try {
            if (this.oauth)
                return this.oauth;
            const googleOauth = new GoogleOauth();
            return this.oauth = await googleOauth.authenticate(this.clientSecret);
        }
        catch (error) {
            throw error;
        }
    }
    async uploadToDrive(data, fileName) {
        try {
            logger.log(messages.getMessage('G_DRIVE_UPLOADING'));
            const drive = google.drive({
                version: 'v3',
                auth: await this.getOauth()
            });
            const body = {
                resource: {
                    name: fileName,
                    mimeType: 'application/json',
                },
                media: {
                    mimeType: 'application/json',
                    body: JSON.stringify(data)
                }
            };
            const driveResponse = await promisify(drive.files.create)(body);
            await this.setSharingPermissions(driveResponse.id);
            logger.log(messages.getMessage('G_DRIVE_UPLOADED'));
            return driveResponse;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async setSharingPermissions(fileId) {
        try {
            const drive = google.drive({
                version: 'v3',
                auth: await this.getOauth()
            });
            const body = {
                resource: {
                    'type': 'anyone',
                    'role': 'writer'
                },
                fileId: fileId
            };
            return await promisify(drive.permissions.create)(body);
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
module.exports = GDrive;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2RyaXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2RyaXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUU5RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckMsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFHN0MsNENBQXlDO0FBQ3pDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUVwQyxNQUFNLE1BQU07SUFHVixZQUFtQixZQUFrQztRQUFsQyxpQkFBWSxHQUFaLFlBQVksQ0FBc0I7SUFBRyxDQUFDO0lBRXpELEtBQUssQ0FBQyxRQUFRO1FBQ1osSUFBSTtZQUNGLElBQUksSUFBSSxDQUFDLEtBQUs7Z0JBQUUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBRWxDLE1BQU0sV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7WUFDdEMsT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDdkU7UUFBQSxPQUFPLEtBQUssRUFBRTtZQUNiLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFTLEVBQUUsUUFBZ0I7UUFDN0MsSUFBSTtZQUNGLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7WUFDckQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDekIsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsSUFBSSxFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTthQUM1QixDQUFDLENBQUM7WUFFSCxNQUFNLElBQUksR0FBRztnQkFDWCxRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsUUFBUSxFQUFFLGtCQUFrQjtpQkFDN0I7Z0JBQ0QsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztpQkFDM0I7YUFDRixDQUFDO1lBRUYsTUFBTSxhQUFhLEdBQWtCLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0UsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7WUFDcEQsT0FBTyxhQUFhLENBQUM7U0FDdEI7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQWM7UUFDeEMsSUFBSTtZQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ3pCLE9BQU8sRUFBRSxJQUFJO2dCQUNiLElBQUksRUFBRSxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUU7YUFDNUIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxJQUFJLEdBQUc7Z0JBQ1gsUUFBUSxFQUFFO29CQUNSLE1BQU0sRUFBRSxRQUFRO29CQUNoQixNQUFNLEVBQUUsUUFBUTtpQkFDakI7Z0JBQ0QsTUFBTSxFQUFFLE1BQU07YUFDZixDQUFDO1lBRUYsT0FBTyxNQUFNLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMifQ==