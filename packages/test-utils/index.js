// Require for side-effects
require('./matchers.js');
const { runJudge } = require('itch-runner');
const puppeteer = require('puppeteer');
const path = require('path');

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
 * @param {string} solution - Path to the solution sb3 file.
 * @param {string} testplan - Path to the testplan.
 * @param {Object} options - Optional options.
 *
 * @return {Promise<Object[]>} A promise which resolves to an array of output objects.
 */
async function executePlan(template, solution, testplan, options = {}) {
  const results = [];
  const collector = (output) => results.push(output);

  let page;
  if (browser && !options?.debug) {
    page = await browser.newPage();
    await page.setCacheEnabled(false);
  }

  await runJudge({
    testplan: { url: testplan },
    template: template,
    solution: solution,
    out: collector,
    page: page,
    ...options,
  });

  if (page) {
    await page.close();
  }

  return results;
}

function run(dir, solutionName, level, planLevel = level) {
  const template = path.resolve(
    dir,
    level ? `projects/${level}-template.sb3` : 'projects/template.sb3',
  );
  const plan = path.resolve(dir, planLevel ? `plan-${planLevel}.js` : 'plan-1.js');
  const solution = path.resolve(
    dir,
    level ? `projects/${level}-${solutionName}.sb3` : `projects/${solutionName}.sb3`,
  );
  // console.debug("Used paths are", template, solution, plan);
  return executePlan(template, solution, plan, {
    debug: false,
  });
}

module.exports = {
  executePlan,
  run,
};
