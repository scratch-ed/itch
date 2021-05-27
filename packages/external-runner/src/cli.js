/**
 * @fileOverview Runs puppeteer on the command line.
 */

const path = require('path');
const fs = require('fs');
const { runJudge } = require('itch-runner');
const { program, Option } = require('commander');

const exercisePath = path.resolve(__dirname, '../../../exercises');

// Get a list of available exercises.
const exercises = fs.readdirSync(exercisePath);

function getPlan(options) {
  if (options.level) {
    return `plan-${options.level}.js`;
  } else {
    return 'plan.js';
  }
}

function getTemplate(options) {
  if (options.level) {
    return `template-${options.level}.sb3`;
  } else {
    return 'template.sb3';
  }
}

program
  .addOption(
    new Option('-e, --exercise <exercise>', 'internal exercise name')
      .makeOptionMandatory(true)
      .choices(exercises),
  )
  .option('-l, --level <level>', 'optional level of the exercise')
  .arguments('<solution>')
  .description('itch', {
    solution: 'path to the solution sb3 file to test',
  })
  .action(async (solution, options) => {
    const plan = path.resolve(
      __dirname,
      `../../../exercises/${options.exercise}/${getPlan(options)}`,
    );
    const template = path.resolve(
      __dirname,
      `../../../exercises/${options.exercise}/projects/${getTemplate(options)}`,
    );
    if (!fs.existsSync(solution)) {
      throw new Error(`"${solution}" is not a valid path!`);
    }
    await runJudge({
      testplan: { url: plan },
      template: template,
      solution: solution,
      mode: 'cli',
    });
  });

program.parseAsync(process.argv).then(() => console.log('Done'));
