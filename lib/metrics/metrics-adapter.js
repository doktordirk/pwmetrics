"use strict";
// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../utils/messages");
const logger_1 = require("../utils/logger");
const metrics_1 = require("./metrics");
const logger = logger_1.Logger.getInstance();
const checkMetrics = (metrics) => {
    const errorMessage = metrics.errorMessage;
    const explanation = metrics.details.explanation;
    if (errorMessage)
        logger.log(`${errorMessage} \n ${explanation}`);
};
const getMetricTitle = (metricId) => {
    try {
        return messages_1.getMessage(metricId);
    }
    catch (e) {
        return '';
    }
};
exports.adaptMetricsData = (res) => {
    const auditResults = res.audits;
    // has to be Record<string, LH.Audit.Result>
    const metricsAudit = auditResults.metrics;
    if (!metricsAudit || !metricsAudit.details || !metricsAudit.details.items)
        throw new Error('No metrics data');
    const metricsValues = metricsAudit.details.items[0];
    checkMetrics(metricsAudit);
    const colorP0 = 'yellow';
    const colorP2 = 'green';
    const colorVisual = 'blue';
    const timings = [];
    // @todo improve to Object.entries
    Object.keys(metricsValues).forEach(metricKey => {
        if (!Object.values(metrics_1.METRICS).includes(metricKey))
            return;
        const metricTitle = getMetricTitle(metricKey);
        const resolvedMetric = {
            title: metricTitle,
            id: metricKey,
            timing: metricsValues[metricKey],
            color: colorVisual
        };
        switch (metricKey) {
            case metrics_1.METRICS.TTFCP:
            case metrics_1.METRICS.TTFMP:
                resolvedMetric.color = colorP2;
                break;
            case metrics_1.METRICS.TTFCPUIDLE:
            case metrics_1.METRICS.TTI:
                resolvedMetric.color = colorP0;
                break;
        }
        timings.push(resolvedMetric);
    });
    return {
        timings,
        generatedTime: res.fetchTime,
        lighthouseVersion: res.lighthouseVersion,
        requestedUrl: res.requestedUrl,
        finalUrl: res.finalUrl,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWV0cmljcy1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUc5RCxnREFBNkM7QUFDN0MsNENBQXVDO0FBQ3ZDLHVDQUFrQztBQUVsQyxNQUFNLE1BQU0sR0FBRyxlQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7QUFFcEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxPQUF3QyxFQUFFLEVBQUU7SUFDaEUsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUMxQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxJQUFJLFlBQVk7UUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxPQUFPLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtJQUNsQyxJQUFJO1FBQ0YsT0FBTyxxQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLEVBQUUsQ0FBQztLQUNYO0FBQ0gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLEdBQWMsRUFBa0IsRUFBRTtJQUNqRSxNQUFNLFlBQVksR0FBbUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUVoRSw0Q0FBNEM7SUFDNUMsTUFBTSxZQUFZLEdBQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQztJQUM5QyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSztRQUN2RSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFckMsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFcEQsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTNCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztJQUN6QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDeEIsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDO0lBRTNCLE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUU3QixrQ0FBa0M7SUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsaUJBQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFBRSxPQUFPO1FBRXhELE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxNQUFNLGNBQWMsR0FBVztZQUM3QixLQUFLLEVBQUUsV0FBVztZQUNsQixFQUFFLEVBQUUsU0FBUztZQUNiLE1BQU0sRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDO1lBQ2hDLEtBQUssRUFBRSxXQUFXO1NBQ25CLENBQUM7UUFFRixRQUFRLFNBQVMsRUFBRTtZQUNqQixLQUFLLGlCQUFPLENBQUMsS0FBSyxDQUFDO1lBQ25CLEtBQUssaUJBQU8sQ0FBQyxLQUFLO2dCQUNoQixjQUFjLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztnQkFDL0IsTUFBTTtZQUNSLEtBQUssaUJBQU8sQ0FBQyxVQUFVLENBQUM7WUFDeEIsS0FBSyxpQkFBTyxDQUFDLEdBQUc7Z0JBQ2QsY0FBYyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7Z0JBQy9CLE1BQU07U0FDVDtRQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPO1FBQ0wsT0FBTztRQUNQLGFBQWEsRUFBRSxHQUFHLENBQUMsU0FBUztRQUM1QixpQkFBaUIsRUFBRSxHQUFHLENBQUMsaUJBQWlCO1FBQ3hDLFlBQVksRUFBRSxHQUFHLENBQUMsWUFBWTtRQUM5QixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7S0FDdkIsQ0FBQztBQUNKLENBQUMsQ0FBQyJ9