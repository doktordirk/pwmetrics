"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("./utils/messages");
exports.getTestSuite = (testName, url, testDuration, metricsData, expectationMetrics) => {
    let failureCount = 0;
    let testCount = 0;
    const testcaseXMLLines = [];
    metricsData.forEach(metric => {
        const metricName = metric.id;
        const expectationValue = expectationMetrics[metricName];
        const metricValue = metric.timing;
        if (!expectationValue)
            return;
        testCount += 1;
        const testDesc = `Time till ${metricName} should stay bellow ${expectationValue.warn} ms`;
        let type;
        if (metricValue >= expectationValue.error) {
            type = 'ERROR';
            failureCount++;
            const msg = messages_1.getJUnitAssertionMessage(type, metricName, expectationValue.error, metricValue);
            testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}">`);
            testcaseXMLLines.push(`<failure message="${msg}" type="${type}">${type} ${msg}</failure>`);
            testcaseXMLLines.push('</testcase>');
        }
        else if (metricValue >= expectationValue.warn && metricValue < expectationValue.error) {
            type = 'WARNING';
            const msg = messages_1.getJUnitAssertionMessage(type, metricName, expectationValue.warn, metricValue);
            testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}">`);
            testcaseXMLLines.push(`<failure message="${msg}" type="${type}">${type} ${msg}</failure>`);
            testcaseXMLLines.push('</testcase>');
        }
        else {
            testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}"/>`);
        }
    });
    const testsuiteXML = [
        `<testsuite id="0" name="${testName}" tests="${testCount}" failures="${failureCount}" errors="0" skipped="0" time="${testDuration / 1000}" hostname="${url}" timestamp="${(new Date()).toISOString()}">`,
        ...testcaseXMLLines,
        '</testsuite>'
    ].join('\n');
    return testsuiteXML;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVuaXRSZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqdW5pdFJlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUEwRDtBQUc3QyxRQUFBLFlBQVksR0FBRyxDQUFDLFFBQWdCLEVBQUUsR0FBVyxFQUFFLFlBQW9CLEVBQUUsV0FBcUIsRUFBRSxrQkFBZ0QsRUFBVSxFQUFFO0lBQ25LLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDbEIsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFFNUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUMzQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUVsQyxJQUFJLENBQUMsZ0JBQWdCO1lBQUUsT0FBTztRQUU5QixTQUFTLElBQUksQ0FBQyxDQUFDO1FBQ2YsTUFBTSxRQUFRLEdBQUcsYUFBYSxVQUFVLHVCQUF1QixnQkFBZ0IsQ0FBQyxJQUFJLEtBQUssQ0FBQTtRQUN6RixJQUFJLElBQXFDLENBQUM7UUFFMUMsSUFBSSxXQUFXLElBQUksZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1lBQ3pDLElBQUksR0FBRyxPQUFPLENBQUM7WUFDZixZQUFZLEVBQUUsQ0FBQztZQUNmLE1BQU0sR0FBRyxHQUFHLG1DQUF3QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzVGLGdCQUFnQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsUUFBUSxnQkFBZ0IsUUFBUSxXQUFXLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQzVHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxXQUFXLElBQUksS0FBSyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQztZQUMzRixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdEM7YUFBTSxJQUFJLFdBQVcsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksV0FBVyxHQUFHLGdCQUFnQixDQUFDLEtBQUssRUFBRTtZQUN2RixJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ2pCLE1BQU0sR0FBRyxHQUFHLG1DQUF3QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzNGLGdCQUFnQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsUUFBUSxnQkFBZ0IsUUFBUSxXQUFXLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQzVHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxXQUFXLElBQUksS0FBSyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQztZQUMzRixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDdEM7YUFBTTtZQUNMLGdCQUFnQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsUUFBUSxnQkFBZ0IsUUFBUSxXQUFXLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDO1NBQzlHO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxNQUFNLFlBQVksR0FBRztRQUNuQiwyQkFBMkIsUUFBUSxZQUFZLFNBQVMsZUFBZSxZQUFZLGtDQUFrQyxZQUFZLEdBQUcsSUFBSSxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJO1FBQ3hNLEdBQUcsZ0JBQWdCO1FBQ25CLGNBQWM7S0FDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUViLE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUMsQ0FBQyJ9