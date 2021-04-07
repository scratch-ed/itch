/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * @fileOverview Runs puppeteer on the command line.
 */

const path = require('path');
const config = require('../../../config.json');
require('dotenv').config();

const { Judge } = require('./judge.js');

const {
  source: sourceFile,
  template: templateFile,
  time_limit: timeLimit,
  memory_limit: memoryLimit,
  natural_language: naturalLanguage,
  programming_language: programmingLanguage,
} = config;

const plan = path.resolve(__dirname, config.plan);

// process tests
const judge = new Judge(plan, {
  // convert time limit from seconds to millisecond and only consume
  // 90% of the available time in order to have some spare time to
  // generate the feedback on stdout
  time_limit: Math.floor(timeLimit * 900),
  memory_limit: memoryLimit,
  natural_language: naturalLanguage,
  programming_language: programmingLanguage,
  debug: config.debug,
});

// evaluate tests and output result to stdout
judge.run(
  path.resolve(__dirname, templateFile),
  path.resolve(__dirname, sourceFile),
);
