/* Copyright (C) 2019 Ghent University - All Rights Reserved */
const path = require('path');
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');

// puppeteer
const puppeteer = require('puppeteer');

function toStdOut(output) {
  process.stdout.write(JSON.stringify(output));
}

/**
 * @typedef {Object} FrameAddScriptTagOptions
 * @property {string} [url]
 * @property {string} [content]
 */

class Judge {
  /**
   * Create a judge class.
   *
   * @param {FrameAddScriptTagOptions} testplan
   * @param {object} options
   * @param {function(object):void} outputStream
   */
  constructor(testplan, options = {}, outputStream = toStdOut) {
    // extract options
    this.time_limit = options.time_limit || 10000;

    this.testplan = testplan;

    this.out = outputStream;

    this.debug = options.debug;
    this.visualise = options.visualise;
  }

  async run(templateFile, submissionFile) {
    let browser;
    if (this.debug) {
      browser = await puppeteer.launch({
        ...(process.env.PUPPETEER_BROWSER_PATH && {
          executablePath: process.env.PUPPETEER_BROWSER_PATH,
        }),
        headless: false,
        devtools: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
        ],
      });
    } else {
      browser = await puppeteer.launch({
        ...(process.env.PUPPETEER_BROWSER_PATH && {
          executablePath: process.env.PUPPETEER_BROWSER_PATH,
        }),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
        ],
      });
    }

    /** @type {Page} */
    const page = await browser.newPage();

    if (this.debug) {
      page.on('console', (msg) => console.debug('PAGE LOG:', msg.text()));
    }

    await page.goto(`file://${url}`);

    // Hook up the test output to stdout.
    await page.exposeFunction('handleOut', this.out);
    await page.exposeFunction('visualise', () => this.visualise);

    await page.addScriptTag({
      ...(this.fromApi ? { content: this.test_file } : { url: this.test_file }),
    });

    const sourceFileTemplate = this.fromApi
      ? submissionFile
      : path.resolve(__dirname, submissionFile);
    const templateFileTemplate = this.fromApi
      ? templateFile
      : path.resolve(__dirname, templateFile);

    // START JUDGE
    this.out({ command: 'start-judgement' });

    /** @type {ElementHandle} */
    const fileHandle = await page.$('#file');
    await fileHandle.uploadFile(sourceFileTemplate);
    const templateHandle = await page.$('#template');
    await templateHandle.uploadFile(templateFileTemplate);

    await page.setViewport({ height: 1080, width: 960 });
    await page.waitForTimeout(50);

    if (this.debug) {
      await page.evaluate(() => {
        // eslint-disable-next-line no-debugger
        debugger;
      });
    }

    await page.evaluate(() => {
      return runTests();
    });

    if (!this.debug) {
      await browser.close();
    }

    // END JUDGE
    this.out({ command: 'close-judgement' });
  }
}

module.exports = {
  Judge,
};
