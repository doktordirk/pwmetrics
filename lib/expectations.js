"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./utils/logger");
const messages_1 = require("./utils/messages");
const logger = logger_1.Logger.getInstance();
exports.validateMetrics = (metrics) => {
    const metricsKeys = Object.keys(metrics);
    if (!metrics || !metricsKeys.length) {
        logger.error(messages_1.getMessageWithPrefix('ERROR', 'NO_METRICS'));
        process.exit(1);
    }
    metricsKeys.forEach(key => {
        if (!metrics[key] || !metrics[key].warn || !metrics[key].error) {
            logger.error(messages_1.getMessageWithPrefix('ERROR', 'NO_EXPECTATION_ERROR', key));
            process.exit(1);
        }
    });
};
exports.normalizeExpectationMetrics = (metrics) => {
    let normalizedMetrics = {};
    Object.keys(metrics).forEach(key => {
        normalizedMetrics[key] = {
            warn: parseInt(metrics[key].warn.replace('>=', ''), 10),
            error: parseInt(metrics[key].error.replace('>=', ''), 10)
        };
    });
    return normalizedMetrics;
};
exports.checkExpectations = (metricsData, expectationMetrics) => {
    metricsData.forEach(metric => {
        const metricName = metric.id;
        const expectationValue = expectationMetrics[metricName];
        const metricValue = metric.timing;
        let msg;
        if (!expectationValue)
            return;
        if (metricValue >= expectationValue.error) {
            msg = messages_1.getAssertionMessage('ERROR', metricName, expectationValue.error, metricValue);
        }
        else if (metricValue >= expectationValue.warn && metricValue < expectationValue.error) {
            msg = messages_1.getAssertionMessage('WARNING', metricName, expectationValue.warn, metricValue);
        }
        if (msg) {
            logger.log(msg);
        }
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwZWN0YXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhwZWN0YXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUU5RCwyQ0FBc0M7QUFDdEMsK0NBQTJFO0FBRzNFLE1BQU0sTUFBTSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUV2QixRQUFBLGVBQWUsR0FBRyxDQUFDLE9BQTJCLEVBQUUsRUFBRTtJQUM3RCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXpDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQW9CLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDMUQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtJQUVELFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQzlELE1BQU0sQ0FBQyxLQUFLLENBQUMsK0JBQW9CLENBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDekUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRVcsUUFBQSwyQkFBMkIsR0FBRyxDQUFDLE9BQTJCLEVBQWdDLEVBQUU7SUFDdkcsSUFBSSxpQkFBaUIsR0FBaUMsRUFBRSxDQUFDO0lBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ2pDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxHQUFHO1lBQ3ZCLElBQUksRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN2RCxLQUFLLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDMUQsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxpQkFBaUIsQ0FBQztBQUMzQixDQUFDLENBQUM7QUFFVyxRQUFBLGlCQUFpQixHQUFHLENBQUMsV0FBcUIsRUFBRSxrQkFBZ0QsRUFBRSxFQUFFO0lBQzNHLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDM0IsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUM3QixNQUFNLGdCQUFnQixHQUFHLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEMsSUFBSSxHQUFHLENBQUM7UUFFUixJQUFJLENBQUMsZ0JBQWdCO1lBQUUsT0FBTztRQUU5QixJQUFJLFdBQVcsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7WUFDekMsR0FBRyxHQUFHLDhCQUFtQixDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3JGO2FBQU0sSUFBSSxXQUFXLElBQUksZ0JBQWdCLENBQUMsSUFBSSxJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7WUFDdkYsR0FBRyxHQUFHLDhCQUFtQixDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3RGO1FBRUQsSUFBSSxHQUFHLEVBQUU7WUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2pCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMifQ==