/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * @fileOverview Runs puppeteer on the command line.
 */

const path = require('path');
const config = require('../../../config.json');
require('dotenv').config();

const { runJudge } = require('./judge.js');

// noinspection JSIgnoredPromiseFromCall
runJudge({
  testplan: { url: path.resolve(__dirname, config.plan) },
  template: path.resolve(__dirname, config.template),
  solution: path.resolve(__dirname, config.source),
  debug: config.debug,
});
