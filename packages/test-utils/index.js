// Require for side-effects
require('./matchers.js');
const { runJudge } = require('itch-runner');

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

  await runJudge({
    testplan: { url: testplan },
    template: template,
    solution: solution,
    out: collector,
    ...options,
  });

  return results;
}

module.exports = {
  executePlan,
};
