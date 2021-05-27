/* Copyright (C) 2019 Ghent University - All Rights Reserved */
const path = require('path');
const puppeteer = require('puppeteer');

// Path to the HTML to run.
const url = path.resolve(__dirname, 'environment.html');

/**
 * Default output handler - writes to stdout in de JSON Lines format.
 */
function toStdOut(output) {
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

/**
 * The testplan is either an URL or a string.
 *
 * @typedef {Object} TestplanOption
 * @property {string} [content] - The testplan as a string.
 * @property {string} [url] - URL to the testplan.
 */

/**
 * The options for the judge.
 *
 * @typedef {Object} JudgeOptions
 * @property {TestplanOption} testplan - The testplan to run.
 * @property {string} template - Path to template sb3 file.
 * @property {string} solution - Path to solution sb3 file.
 * @property {Page} [page] - Optional page to use. If not given, the judge will open a new puppeteer instance.
 * @property {boolean} [debug] - If debug mode should be use.
 * @property {"debug"|"cli"|"normal"} [mode] - Start paused, implied by debug.
 * @property {function(Object):void} [out] - The output handle.
 */

/**
 * Run the judge.
 *
 * @param {JudgeOptions} options
 */
async function runJudge(options) {
  let browser;

  let mode = 'normal';
  if (options?.mode) {
    mode = options.mode;
  } else if (options?.debug) {
    mode = 'debug';
  }

  try {
    if (!options.page) {
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
        headless: mode === 'normal',
        devtools: mode === 'debug',
      });
    }

    /** @type {Page} */
    const page = options.page || (await browser.newPage());

    await page.setCacheEnabled(false);

    if (mode === 'debug') {
      page.on('console', (msg) => console.debug('PAGE LOG:', msg.text()));
    }

    await page.evaluateOnNewDocument(() => {
      window.isPuppeteer = true;
    });

    await page.goto(`file://${url}`);

    // Hook up the test output to stdout.
    await page.exposeFunction('handleOut', options.out || toStdOut);
    await page.exposeFunction('visualise', () => this.visualise);

    await page.addScriptTag(options.testplan);

    const fileHandle = await page.$('#file');
    await fileHandle.uploadFile(options.solution);
    const templateHandle = await page.$('#template');
    await templateHandle.uploadFile(options.template);

    await page.setViewport({ height: 1080, width: 960 });
    await page.waitForTimeout(50);

    if (mode === 'debug') {
      await page.evaluate(() => {
        // eslint-disable-next-line no-debugger
        debugger;
      });
    }

    await page.evaluate(() => {
      return runTests();
    });
  } finally {
    if (browser && mode === 'debug') {
      console.log('Closing browser...');
      const pages = await browser.pages();
      await Promise.all(pages.map((page) => page.close()));
      await browser.close();
    }
  }
}

module.exports = {
  runJudge,
};
