/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const { Judge } = require('../src/judge');
const path = require('path');
const { testStatuses } = require('itch-test-utils');

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
async function runTest(projectName, testName = null) {
  const sourceFile = path.resolve(__dirname, `assets/${projectName}.sb3`);
  const planFile = path.resolve(
    __dirname,
    `assets/${testName || projectName}_test.js`,
  );

  const results = [];
  const collector = (output) => results.push(output);

  const judge = new Judge(
    planFile,
    {
      ...defaultConfig,
      source: sourceFile,
    },
    collector,
  );

  await judge.run(sourceFile, sourceFile);

  return results;
}

module.exports = {
  runTest,
  testStatuses,
};
