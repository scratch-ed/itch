/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const { Judge } = require('../judge');

const defaultConfig = {
  resources: 'tests/',
  timeLimit: 10000,
  memoryLimit: 5000000,
  natural_language: 'nl',
  programming_language: 'scratch',
  debug: false
};

/**
 * Run the testplan for the given project, and
 * return the resulting output.
 *
 * @param projectName
 * @param testName
 * @param configuration
 */
async function runTest(projectName, testName = null, configuration = {}) {
  const config = { ...configuration, ...defaultConfig };
  const sourceFile = `${config.resources}/projects/${projectName}.sb3`;
  const planFile = `${config.resources}/plans/${testName || projectName}_test.js`;

  const results = [];
  const collector = output => results.push(output);

  const judge = new Judge(planFile, {
    ...config,
    source: sourceFile
  }, collector);

  await judge.run(sourceFile, sourceFile);

  return results;
}

function testStatuses(result) {
  return result.filter(obj => obj.command === 'close-test')
    .map(obj => obj.status.enum);
}

expect.extend({
  allStatusesAre(statusses, expected) {
    const correct = statusses.every(s => s === expected) && statusses.length >= 1;
    return {
      message: () => `expected all test statuses (>= 1) to be ${expected}, got ${statusses}`,
      pass: correct
    };
  },
  onlyStatusesIs(statusses, expected) {
    const correct = statusses.every(s => s === expected);
    return {
      message: () => `expected all test statuses (>= 1) to be ${expected}, got ${statusses}`,
      pass: correct
    };
  },
  minimumCommands(result, command, amount) {
    const am = result
      .filter(obj => obj.command === command)
      .length;
    return {
      message: () => `expected >= ${amount} commands of type ${command}, got ${am}`,
      pass: am >= amount
    };
  }
});

module.exports = {
  runTest, testStatuses
};
