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
        const testDesc = `Time till ${metricName} should stay bellow ${expectationValue.error} ms`;
        let type;
        if (metricValue >= expectationValue.error) {
            type = 'ERROR';
            failureCount++;
            const msg = messages_1.getJUnitAssertionMessage(type, metricName, expectationValue.error, metricValue);
            testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}">`);
            testcaseXMLLines.push(`<failure message="${msg}" type="${type}">${type} - ${url}: ${msg}</failure>`);
            testcaseXMLLines.push('</testcase>');
        }
        else if (metricValue >= expectationValue.warn && metricValue < expectationValue.error) {
            type = 'WARNING';
            const msg = messages_1.getJUnitAssertionMessage(type, metricName, expectationValue.warn, metricValue);
            testcaseXMLLines.push(`<testcase name="${testDesc}" classname="${testName}" time="${metricValue / 1000}">`);
            testcaseXMLLines.push(`<failure message="${msg}" type="${type}">${type}- ${url}: ${msg}</failure>`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVuaXRSZXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqdW5pdFJlcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtDQUEwRDtBQUc3QyxRQUFBLFlBQVksR0FBRyxDQUFDLFFBQWdCLEVBQUUsR0FBVyxFQUFFLFlBQW9CLEVBQUUsV0FBcUIsRUFBRSxrQkFBZ0QsRUFBVSxFQUFFO0lBQ25LLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDbEIsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFFNUIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUMzQixNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQzdCLE1BQU0sZ0JBQWdCLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUVsQyxJQUFJLENBQUMsZ0JBQWdCO1lBQUUsT0FBTztRQUU5QixTQUFTLElBQUksQ0FBQyxDQUFDO1FBQ2YsTUFBTSxRQUFRLEdBQUcsYUFBYSxVQUFVLHVCQUF1QixnQkFBZ0IsQ0FBQyxLQUFLLEtBQUssQ0FBQTtRQUMxRixJQUFJLElBQXFDLENBQUM7UUFFMUMsSUFBSSxXQUFXLElBQUksZ0JBQWdCLENBQUMsS0FBSyxFQUFFO1lBQ3pDLElBQUksR0FBRyxPQUFPLENBQUM7WUFDZixZQUFZLEVBQUUsQ0FBQztZQUNmLE1BQU0sR0FBRyxHQUFHLG1DQUF3QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzVGLGdCQUFnQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsUUFBUSxnQkFBZ0IsUUFBUSxXQUFXLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQzVHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxXQUFXLElBQUksS0FBSyxJQUFJLE1BQU0sR0FBRyxLQUFLLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDckcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3RDO2FBQU0sSUFBSSxXQUFXLElBQUksZ0JBQWdCLENBQUMsSUFBSSxJQUFJLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUU7WUFDdkYsSUFBSSxHQUFHLFNBQVMsQ0FBQztZQUNqQixNQUFNLEdBQUcsR0FBRyxtQ0FBd0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztZQUMzRixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLFFBQVEsZ0JBQWdCLFFBQVEsV0FBVyxXQUFXLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUM1RyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsV0FBVyxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLFlBQVksQ0FBQyxDQUFDO1lBQ3BHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUN0QzthQUFNO1lBQ0wsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixRQUFRLGdCQUFnQixRQUFRLFdBQVcsV0FBVyxHQUFHLElBQUksS0FBSyxDQUFDLENBQUM7U0FDOUc7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sWUFBWSxHQUFHO1FBQ25CLDJCQUEyQixRQUFRLFlBQVksU0FBUyxlQUFlLFlBQVksa0NBQWtDLFlBQVksR0FBRyxJQUFJLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUk7UUFDeE0sR0FBRyxnQkFBZ0I7UUFDbkIsY0FBYztLQUNmLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWIsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQyxDQUFDIn0=