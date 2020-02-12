"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestSuite = (testName, url, testDuration, metricsData, expectationMetrics) => {
    return '';
    // let failureCount = 0;
    // let testCount = 0;
    // const testcaseXMLLines = [];
    // metricsData.forEach(metric => {
    //   const metricName = metric.id;
    //   const expectationValue = expectationMetrics[metricName];
    //   const metricValue = metric.timing;
    //   if (!expectationValue) return;
    //   testCount += 1;
    //   const testDesc = `Time till ${metricName} should stay bellow ${expectationValue.error} ms`
    //   let type: 'ERROR' | 'WARNING' | 'SUCCESS';
    //   if (metricValue >= expectationValue.error) {
    //     type = 'ERROR';
    //     failureCount++;
    //     const msg = getJUnitAssertionMessage(type, metricName, expectationValue.error, metricValue);
    //     testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}">`);
    //     testcaseXMLLines.push(`<failure message="${msg}" type="${type}">${type} - ${url}: ${msg}</failure>`);
    //     testcaseXMLLines.push('</testcase>');
    //   } else if (metricValue >= expectationValue.warn && metricValue < expectationValue.error) {
    //     type = 'WARNING';
    //     const msg = getJUnitAssertionMessage(type, metricName, expectationValue.warn, metricValue);
    //     testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}">`);
    //     testcaseXMLLines.push(`<failure message="${msg}" type="${type}">${type}- ${url}: ${msg}</failure>`);
    //     testcaseXMLLines.push('</testcase>');
    //   } else {
    //     testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}"/>`);
    //   }
    // });
    // const testsuiteXML = [
    //   `<testsuite id="0" name="${testName}" tests="${testCount}" failures="${failureCount}" errors="0" skipped="0" time="${testDuration / 1000}" hostname="${url}" timestamp="${(new Date()).toISOString()}">`,
    //   ...testcaseXMLLines,
    //   '</testsuite>'
    // ].join('\n');
    // return testsuiteXML;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVuaXRSZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqdW5pdFJlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdhLFFBQUEsWUFBWSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxHQUFXLEVBQUUsWUFBb0IsRUFBRSxXQUFxQixFQUFFLGtCQUFnRCxFQUFVLEVBQUU7SUFDbkssT0FBUSxFQUFFLENBQUM7SUFFWCx3QkFBd0I7SUFDeEIscUJBQXFCO0lBQ3JCLCtCQUErQjtJQUUvQixrQ0FBa0M7SUFDbEMsa0NBQWtDO0lBQ2xDLDZEQUE2RDtJQUM3RCx1Q0FBdUM7SUFFdkMsbUNBQW1DO0lBRW5DLG9CQUFvQjtJQUNwQiwrRkFBK0Y7SUFDL0YsK0NBQStDO0lBRS9DLGlEQUFpRDtJQUNqRCxzQkFBc0I7SUFDdEIsc0JBQXNCO0lBQ3RCLG1HQUFtRztJQUNuRyxtSEFBbUg7SUFDbkgsNEdBQTRHO0lBQzVHLDRDQUE0QztJQUM1QywrRkFBK0Y7SUFDL0Ysd0JBQXdCO0lBQ3hCLGtHQUFrRztJQUNsRyxtSEFBbUg7SUFDbkgsMkdBQTJHO0lBQzNHLDRDQUE0QztJQUM1QyxhQUFhO0lBQ2Isb0hBQW9IO0lBQ3BILE1BQU07SUFDTixNQUFNO0lBRU4seUJBQXlCO0lBQ3pCLDhNQUE4TTtJQUM5TSx5QkFBeUI7SUFDekIsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUVoQix1QkFBdUI7QUFDekIsQ0FBQyxDQUFDIn0=