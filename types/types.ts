// Copyright 2016 Google Inc. All Rights Reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE

export interface SheetsConfig {
  type: string;
  options: {
    spreadsheetId: string;
    tableName: string;
    clientSecret: AuthorizeCredentials;
    uploadMedian?: boolean;
  };
}

export interface MainOptions {
  testName?: string,
  flags?: Partial<FeatureFlags>;
  sheets?: SheetsConfig;
  expectations?: ExpectationMetrics;
  clientSecret?: AuthorizeCredentials;
}

export interface FeatureFlags {
  runs: number;
  submit: Boolean;
  upload: Boolean;
  view: Boolean;
  expectations: Boolean;
  json: Boolean;
  launchChrome: Boolean,
  chromeFlags: string;
  config?: LH.SharedFlagsSettings,
  chromePath?: string;
  port?: number;
  showOutput: Boolean;
  failOnError: Boolean;
  outputPath: string;
  junitReporterOutputPath?: string;
}

export interface MetricsResults {
  scores: number[],
  timings: Timing[];
  generatedTime: string;
  lighthouseVersion: string;
  requestedUrl: string;
  finalUrl: string;
}

export interface PWMetricsResults {
  runs: MetricsResults[];
  median?: MetricsResults;
}

export interface Timing {
  title: string;
  id: string;
  timing: LH.Audit.Result;
  color: string;
}

export interface AuthorizeCredentials {
  installed: {
    client_secret: number;
    client_id: number;
    redirect_uris: Array<any>;
  }
}

export interface Oauth2Client {
  generateAuthUrl: Function;
  getToken: Function;
  credentials: any;
}

export interface GSheetsValuesToAppend {
  [index: number]: string | number;
}

export interface GSheetsAppendResultsOptions {
  spreadsheetId: string;
  tableName: string;
}

export interface ExpectationMetrics {
  [key: string]: {
    warn: string;
    error: string;
  }
}

export interface NormalizedExpectationMetrics {
  [key: string]: {
    warn: number;
    error: number;
  }
}

export interface DriveResponse {
  id: string
}

export interface PreparedAssets {
  traceData: Array<any>
}

export interface ChartOptions {
  width: number;
  xlabel: string;
  xmin: number;
  xmax: number;
  lmargin: number;
}

export interface LoggerOptions {
  showOutput: Boolean;
}

export interface LHFlags extends LH.Flags {
  chromePath: string;
}
