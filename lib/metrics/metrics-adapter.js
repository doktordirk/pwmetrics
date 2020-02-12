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
    const metricsValues = auditResults;
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
        scores: Object.values(res.categories).map(value => {
            return value.score;
        }),
        timings,
        generatedTime: res.fetchTime,
        lighthouseVersion: res.lighthouseVersion,
        requestedUrl: res.requestedUrl,
        finalUrl: res.finalUrl,
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljcy1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibWV0cmljcy1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUc5RCxnREFBNkM7QUFDN0MsNENBQXVDO0FBQ3ZDLHVDQUFrQztBQUVsQyxNQUFNLE1BQU0sR0FBRyxlQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7QUFFcEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxPQUF3QyxFQUFFLEVBQUU7SUFDaEUsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztJQUMxQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztJQUNoRCxJQUFJLFlBQVk7UUFDZCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxPQUFPLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRTtJQUNsQyxJQUFJO1FBQ0YsT0FBTyxxQkFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLEVBQUUsQ0FBQztLQUNYO0FBQ0gsQ0FBQyxDQUFDO0FBRVcsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLEdBQWMsRUFBa0IsRUFBRTtJQUNqRSxNQUFNLFlBQVksR0FBbUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUVoRSw0Q0FBNEM7SUFDNUMsTUFBTSxZQUFZLEdBQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQztJQUM5QyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSztRQUN2RSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFckMsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDO0lBRW5DLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUUzQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUM7SUFDekIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQztJQUUzQixNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFFN0Isa0NBQWtDO0lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQUUsT0FBTztRQUV4RCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsTUFBTSxjQUFjLEdBQVc7WUFDN0IsS0FBSyxFQUFFLFdBQVc7WUFDbEIsRUFBRSxFQUFFLFNBQVM7WUFDYixNQUFNLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQztZQUNoQyxLQUFLLEVBQUUsV0FBVztTQUNuQixDQUFDO1FBRUYsUUFBUSxTQUFTLEVBQUU7WUFDakIsS0FBSyxpQkFBTyxDQUFDLEtBQUssQ0FBQztZQUNuQixLQUFLLGlCQUFPLENBQUMsS0FBSztnQkFDaEIsY0FBYyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7Z0JBQy9CLE1BQU07WUFDUixLQUFLLGlCQUFPLENBQUMsVUFBVSxDQUFDO1lBQ3hCLEtBQUssaUJBQU8sQ0FBQyxHQUFHO2dCQUNkLGNBQWMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO2dCQUMvQixNQUFNO1NBQ1Q7UUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTztRQUNMLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDaEQsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3JCLENBQUMsQ0FBQztRQUNGLE9BQU87UUFDUCxhQUFhLEVBQUUsR0FBRyxDQUFDLFNBQVM7UUFDNUIsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLGlCQUFpQjtRQUN4QyxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVk7UUFDOUIsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO0tBQ3ZCLENBQUM7QUFDSixDQUFDLENBQUMifQ==