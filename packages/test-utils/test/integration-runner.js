/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const path = require('path');
const { executePlan } = require('../src/index.js');

const defaultConfig = {
  debug: false,
};

/**
 * Run the testplan for the given project, and
 * return the resulting output.
 *
 * @param projectName
 * @param testName
 * @param config
 */
async function runTest(
  projectName = expect.getState().currentTestName,
  testName = null,
  config = {},
) {
  const sourceFile = path.resolve(__dirname, `assets/${projectName}.sb3`);
  const planFile = path.resolve(__dirname, `assets/${testName || projectName}_test.js`);

  const merged = { ...defaultConfig, ...config };

  return executePlan(sourceFile, sourceFile, planFile, merged);
}

async function executeTest(template, solution, plan, config = {}) {
  const templatePath = path.resolve(__dirname, `assets/${template}.sb3`);
  const solutionPath = path.resolve(__dirname, `assets/${solution}.sb3`);
  const planPath = path.resolve(__dirname, `assets/${plan}.js`);

  const merged = { ...defaultConfig, ...config };

  return executePlan(templatePath, solutionPath, planPath, merged);
}

module.exports = {
  runTest,
  executeTest,
};
