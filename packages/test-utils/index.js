// Require for side-effects
require('./matchers.js');
const { runJudge } = require('itch-runner');
const puppeteer = require('puppeteer');

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
  if (browser) {
    page = await browser.newPage();
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

module.exports = {
  executePlan,
};
