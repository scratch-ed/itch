const { Judge } = require('../judge');
const path = require('path');
const {
  performance
} = require('perf_hooks');

const defaultConfig = {
  resources: '.',
  timeLimit: 10000,
  memoryLimit: 5000000,
  natural_language: 'nl',
  programming_language: 'scratch',
  debug: false
};
const fs = require('fs');

async function run(configuration = {}) {
  const config = { ...configuration, ...defaultConfig };
  const sourceFile = path.resolve(__dirname, './Zombiebal-solution.sb3');
  const templateFile = path.resolve(__dirname, './Zombiebal-solution.sb3');
  const planFile = path.resolve(__dirname, `./zombiebal.js`);

  const results = [];
  const collector = output => results.push(output);

  const judge = new Judge(planFile, config, collector);

  await judge.run(templateFile, sourceFile);

  return results;
}

function testStatuses(result) {
  return result.filter(obj => obj.command === 'close-test')
    .map(obj => obj.status.enum);
}

async function doIt() {
  let correct = 0;
  let wrong = 0;

  const t00 = performance.now();
  for (let i = 0; i < 100; i++) {
    const t0 = performance.now();
    console.log(`${i}...`);
    const result = await run();
    fs.writeFileSync(`zombietest/${i}.result.json`, JSON.stringify(result));
    const t1 = performance.now();
    if (testStatuses(result).filter(t => t !== 'correct').length > 0) {
      wrong++;
      console.log(`${i}: WRONG with ${t1 - t0} ms`);
    } else {
      correct++;
      console.log(`${i}: CORRECT ${t1 - t0} ms`);
    }
  }
  const t10 = performance.now();

  console.log(`Correct: ${correct}, wrong: ${wrong}, took: ${t10 - t00} ms`);
  // 1 correct, 62 not.
}

doIt();

