import {getJUnitAssertionMessage} from './utils/messages';
import {Timing, NormalizedExpectationMetrics} from '../types/types';

export const getTestSuite = (testName: string, url: string, testDuration: number, metricsData: Timing[], expectationMetrics: NormalizedExpectationMetrics): string => {
  return  '';

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


