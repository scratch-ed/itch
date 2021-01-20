/* Copyright (C) 2019 Ghent University - All Rights Reserved */

const path = require('path');

const { Judge } = require('./judge.js');

// parse JSON with configuration settings from stdin
const config = require('./runconfig.js');

const {
  resources: resourcesDir,
  source: sourceFile,
  template: templateFile,
  time_limit: timeLimit,
  memory_limit: memoryLimit,
  natural_language: naturalLanguage,
  programming_language: programmingLanguage,
} = config;

// process tests
const judge = new Judge(path.join(resourcesDir, config.plan), {
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
judge.run(templateFile, sourceFile);
