/* Copyright (C) 2019 Ghent University - All Rights Reserved */

const path = require('path');
const fs = require('fs');
const { Judge } = require('./judge.js');

// parse JSON with configuration settings from stdin
const data = fs.readFileSync('./runconfig.json');
const config = JSON.parse(data);

// extract configuration settings
const resourcesDir = config.resources;
const sourceFile = config.source;
const templateFile = config.template;
const timeLimit = config.time_limit;
const memoryLimit = config.memory_limit;
const naturalLanguage = config.natural_language;
const programmingLanguage = config.programming_language;

// process tests
const judge = new Judge(
  path.join(resourcesDir, config.plan),
  {
    // convert time limit from seconds to millisecond and only consume
    // 90% of the available time in order to have some spare time to
    // generate the feedback on stdout
    time_limit: Math.floor(timeLimit * 900),
    memory_limit: memoryLimit,
    natural_language: naturalLanguage,
    programming_language: programmingLanguage,
    debug: config.debug
  }
);

// evaluate tests and output result to stdout
judge.run(templateFile, sourceFile);
