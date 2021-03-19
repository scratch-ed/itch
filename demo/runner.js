const { Judge } = require('../judge');
const path = require('path');

const defaultConfig = {
  resources: '.',
  timeLimit: 10000,
  memoryLimit: 5000000,
  natural_language: 'nl',
  programming_language: 'scratch',
  debug: false
};
const fs = require('fs');

async function run(solution, configuration = {}) {
  const config = { ...configuration, ...defaultConfig };
  const sourceFile = path.resolve(__dirname, `./zombiebal/${solution}`);
  const templateFile = path.resolve(__dirname, './Zombiebal-template.sb3');
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

  const files = fs.readdirSync('zombiebal');

  for (const file of files) {
    if (!file.endsWith('.sb3')) {
      continue; // Skip invalid file.
    }
    console.log(`checking ${file}...`);
    const result = await run(file);
    fs.writeFileSync(`zombiebal/${file}.result.json`, JSON.stringify(result));
    if (testStatuses(result).filter(t => t !== 'correct').length > 0) {
      wrong++;
      console.log(`${file}: WRONG`);
    } else {
      correct++;
      console.log(`${file}: CORRECT`);
    }
  }

  console.log(`Correct: ${correct}, wrong: ${wrong}`);
  // 1 correct, 62 not.
}


doIt();

