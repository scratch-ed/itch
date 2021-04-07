/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const { Judge } = require('../src/judge');
const path = require('path');

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

function testStatuses(result) {
  return result
    .filter((obj) => obj.command === 'close-test')
    .map((obj) => obj.status.enum);
}

expect.extend({
  allStatusesAre(statusses, expected) {
    const correct =
      statusses.every((s) => s === expected) && statusses.length >= 1;
    return {
      message: () =>
        `expected all test statuses (>= 1) to be ${expected}, got ${statusses}`,
      pass: correct,
    };
  },
  onlyStatusesIs(statusses, expected) {
    const correct = statusses.every((s) => s === expected);
    return {
      message: () =>
        `expected all test statuses (>= 1) to be ${expected}, got ${statusses}`,
      pass: correct,
    };
  },
  exactStatus(statusses, expected, amount) {
    const counted = statusses.filter((s) => s === expected).length;
    return {
      message: () =>
        `expected ${amount} statusses of ${expected}, but got ${counted}`,
      pass: counted === amount,
    };
  },
  minimumCommands(result, command, amount) {
    const am = result.filter((obj) => obj.command === command).length;
    return {
      message: () =>
        `expected >= ${amount} commands of type ${command}, got ${am}`,
      pass: am >= amount,
    };
  },
});

module.exports = {
  runTest,
  testStatuses,
};
