/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const path = require('path');
const { executePlan } = require('@ftrprf/judge-test-utils');

const defaultConfig = {
  debug: false,
};

/**
 * Run the testplan for the given project, and
 * return the resulting output.
 *
 * @param projectName
 * @param testName
 * @param configuration
 */
async function runTest(projectName = expect.getState().currentTestName, testName = null) {
  const sourceFile = path.resolve(__dirname, `assets/${projectName}.sb3`);
  const planFile = path.resolve(__dirname, `assets/${testName || projectName}_test.js`);

  return executePlan(sourceFile, sourceFile, planFile, defaultConfig);
}

module.exports = {
  runTest,
};
