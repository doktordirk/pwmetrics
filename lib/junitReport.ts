import {getJUnitAssertionMessage} from './utils/messages';
import {Timing, NormalizedExpectationMetrics} from '../types/types';

export const getTestSuite = (testName: string, url: string, testDuration: number, metricsData: Timing[], expectationMetrics: NormalizedExpectationMetrics): string => {
  let failureCount = 0;
  let testCount = 0;
  const testcaseXMLLines = [];

  metricsData.forEach(metric => {
    const metricName = metric.id;
    const expectationValue = expectationMetrics[metricName];
    const metricValue = metric.timing;

    if (!expectationValue) return;

    testCount =+ 1;
    const testDesc = `${metricName} should stay bellow ${expectationValue.warn} ms`
    let type: 'ERROR' | 'WARNING' | 'SUCCESS';

    if (metricValue >= expectationValue.error) {
      type = 'ERROR';
      failureCount++;
      const msg = getJUnitAssertionMessage(type, metricName, expectationValue.error, metricValue);
      testcaseXMLLines.push(`<testcase id="${metricName}" name="${testDesc}" time="${metricValue}">`);
      testcaseXMLLines.push(`<failure message="${testDesc}" type="${type}">${type} ${msg}</failure>`);
      testcaseXMLLines.push('</testcase>');
    } else if (metricValue >= expectationValue.warn && metricValue < expectationValue.error) {
      type = 'WARNING';
      const msg = getJUnitAssertionMessage(type, metricName, expectationValue.warn, metricValue);
      testcaseXMLLines.push(`<testcase id="${metricName}" name="${testDesc}" time="${metricValue}">`);
      testcaseXMLLines.push(`<failure message="${testDesc}" type="${type}">${type} ${msg}</failure>`);
      testcaseXMLLines.push('</testcase>');
    } else {
      type = 'SUCCESS';
      testcaseXMLLines.push(`<testcase id="${metricName}" name="${testDesc}" time="${metricValue}"/>`);
    }
  });

  const testsuiteXML = [
    `<testsuite id="${testName}" name="Testing metrics for ${url}" tests="${testCount}" failures="${failureCount}" time="${testDuration / 1000}">`,
    ...testcaseXMLLines,
    '</testsuite>'
  ].join('\n');

  return testsuiteXML;
};


