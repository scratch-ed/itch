// Require for side-effects
require('./matchers.js');
const { runOnPage } = require('itch-runner');
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

  page.on('pageerror', (err) => {
    console.error('An error occurred on the puppeteer page', err);
    throw err;
  });

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

function expectCorrect(
  dir,
  template = 'Opgave',
  solution = 'Oplossing',
  plan = undefined,
) {
  return execute(dir, solution, template, plan).then((result) => {
    expect(result).atLeastStatuses('correct', 1);
    expect(result).everyStatusToBe('correct');
  });
}

/**
 * Test a default project set-up.
 *
 * This function will execute two tests:
 *
 * - The solution project must have at least one test, and every test must pass.
 * - The template project has at least one failing test.
 *
 * @param dir The directory of the exercise.
 * @param template The name of the template project, without the file extension.
 * @param solution The name of the solution project, without the file extension.
 * @param plan The name of the test plan to use, without the file extension.
 */
function testProject(dir, template = 'Opgave', solution = 'Oplossing', plan = undefined) {
  test('Correct solution is accepted', () => {
    return execute(dir, template, solution, plan).then((result) => {
      expect(result).atLeastStatuses('correct', 1);
      expect(result).everyStatusToBe('correct');
    });
  });

  test('Template is rejected', () => {
    return execute(dir, template, template, plan).then((result) => {
      expect(result).atLeastStatuses('wrong', 1);
    });
  });
}

/**
 * Test that a project is successful.
 *
 * This function will execute a test, expecting the given solution to have at least
 * one test and that all tests pass.
 *
 * @param dir The directory of the exercise.
 * @param template The name of the template project, without the file extension.
 * @param solution The name of the solution project, without the file extension.
 * @param plan The name of the test plan to use, without the file extension.
 */
function testCorrect(dir, template, solution, plan = undefined) {
  test(`${solution} is correct`, () => {
    return execute(dir, template, template, plan).then((result) => {
      expect(result).atLeastStatuses('correct', 1);
      expect(result).everyStatusToBe('correct');
    });
  });
}

module.exports = {
  executePlan,
  run,
  execute,
  testProject,
  testCorrect,
  expectCorrect,
};
