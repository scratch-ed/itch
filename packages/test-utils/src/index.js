// Require for side-effects
require('./matchers.js');
const { runOnPage } = require('@ftrprf/judge-runner');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch({
    ...(process.env.PUPPETEER_BROWSER_PATH && {
      executablePath: process.env.PUPPETEER_BROWSER_PATH,
    }),
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--allow-file-access-from-files',
      '--allow-file-access',
    ],
  });
});

afterAll(async () => {
  await browser.close();
});

/**
 * Execute a test plan for a certain exercise.
 *
 * @param {string} template - Path to the template sb3 file.
 * @param {string} submission - Path to the solution sb3 file.
 * @param {string} testplan - Path to the testplan.
 * @param {Object} options - Optional options.
 *
 * @return {Promise<Object[]>} A promise which resolves to an array of output objects.
 */
async function executePlan(template, submission, testplan, options = {}) {
  const results = [];
  const collector = (output) => results.push(output);

  if (options.debug) {
    await browser.close();
    browser = await puppeteer.launch({
      ...(process.env.PUPPETEER_BROWSER_PATH && {
        executablePath: process.env.PUPPETEER_BROWSER_PATH,
      }),
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-file-access-from-files',
        '--allow-file-access',
      ],
      headless: false,
      devtools: options.debug,
    });
  }

  const page = await browser.newPage();

  let translations;
  if (!options.skipTranslations) {
    const expectedPath = path.resolve(__dirname, '../../../exercises/translations.json');
    translations = fs.readFileSync(expectedPath);
    translations = JSON.parse(translations);
  }

  const data = fs.readFileSync(testplan).toString();

  await runOnPage(page, {
    template: template,
    testplanData: data,
    submission: submission,
    isLocalFile: true,
    language: 'nl',
    translations: translations,
    outputHandler: collector,
    pause: options.debug,
  });

  if (options.debug) {
    await page.evaluate(() => {
      // eslint-disable-next-line no-debugger
      debugger;
    });
  } else {
    await page.close();
  }

  return results;
}

function run(dir, solutionName, level, planLevel = level) {
  const template = path.resolve(
    dir,
    level ? `projects/${level}-template-NL.sb3` : `projects/template-NL.sb3`,
  );
  const plan = path.resolve(dir, planLevel ? `plan-${planLevel}.js` : 'plan.js');
  const solution = path.resolve(
    dir,
    level
      ? `projects/${level}-${solutionName}-NL.sb3`
      : `projects/${solutionName}-NL.sb3`,
  );

  return executePlan(template, solution, plan, {
    debug: false,
  });
}

function execute(dir, templateName, submissionName, planName = 'plan') {
  const template = path.resolve(dir, `projects/${templateName}-NL.sb3`);
  const plan = path.resolve(dir, `${planName}.js`);
  const solution = path.resolve(dir, `projects/${submissionName}-NL.sb3`);

  return executePlan(template, solution, plan, {
    debug: false,
  });
}

module.exports = {
  executePlan,
  run,
  execute,
};
