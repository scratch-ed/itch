/* Copyright (C) 2019 Ghent University - All Rights Reserved */
const path = require('path');

// Path to the HTML to run.
const url = path.resolve(__dirname, 'environment/page.html');

/**
 * @param {Page} page
 * @param {string} moduleName
 * @param {string} [internalPath]
 * @returns {Promise<void>}
 */
async function loadModuleInPage(page, moduleName, internalPath) {
  let fullPath = require.resolve(moduleName);
  // This is an ugly hack, but it works.
  fullPath = fullPath.replace('/node/', '/web/');
  if (internalPath) {
    const root = path.dirname(fullPath);
    fullPath = path.resolve(root, internalPath);
  }
  await page.addScriptTag({ path: fullPath });
}

/**
 * Run the tests on an existing page from puppeteer.
 *
 * This function does not manage puppeteer.
 *
 * @param {Page} page
 * @param {JudgeOptions | {outputHandler: function(Update): void, pause: boolean}} options
 *
 * @returns {Promise<void|Judgement>} The result of the judge.
 */
async function runOnPage(page, options) {
  await page.evaluateOnNewDocument(() => {
    window.isPuppeteer = true;
  });

  await page.setCacheEnabled(false);
  await page.setViewport({ height: 1080, width: 960 });

  // Handle page errors: crash the judge instead of ignoring them.
  page.on('pageerror', (err) => {
    console.error('An error occurred on the puppeteer page', err);
    throw err;
  });

  // Load the testplan and other options.
  await page.goto(`file://${url}`);

  // Insert the dependencies.
  await loadModuleInPage(page, 'scratch-storage');
  await loadModuleInPage(page, 'scratch-render');
  await loadModuleInPage(
    page,
    'scratch-svg-renderer',
    '../dist/web/scratch-svg-renderer.js',
  );
  await loadModuleInPage(page, 'scratch-vm');
  await loadModuleInPage(page, 'lodash', 'lodash.min.js');
  await loadModuleInPage(page, 'itch-core');

  if (options.testplanData) {
    await page.addScriptTag({ content: options.testplanData });
  } else {
    await page.addScriptTag({ url: options.testplan });
  }

  // Load the data if needed.
  if (options.isLocalFile) {
    await page.evaluate(() => {
      registerFileUploads();
    });
    const templateHandle = await page.waitForSelector('#template');
    await templateHandle.uploadFile(options.template);
    const submissionHandle = await page.waitForSelector('#submission');
    await submissionHandle.uploadFile(options.submission);
  }

  if (options.outputHandler) {
    await page.exposeFunction('handleOut', options.outputHandler);
  }

  // Capture logs.
  page.on('console', (msg) => console.debug('PAGE LOG:', msg.text()));

  await page.waitForTimeout(50);
  console.info('Page is loaded, starting the tests...');

  if (options.pause) {
    await page.evaluate(() => {
      // eslint-disable-next-line no-debugger
      debugger;
    });
  }

  const result = await page.evaluate(async (config) => {
    return await runTests(config);
  }, options);

  console.info('Tests have completed.');
  return result;
}

/**
 * Run the tests on an existing page from puppeteer.
 *
 * This function does not manage puppeteer.
 *
 * @param {Page} page
 * @param {JudgeOptions | {testplanData: string}} options
 *
 * @returns {Promise<Judgement>} The result of the judge.
 */
async function runFullJudgement(page, options) {
  return await runOnPage(page, {
    ...options,
    fullFormat: true,
  });
}

module.exports = {
  runOnPage,
  runFullJudgement,
};
