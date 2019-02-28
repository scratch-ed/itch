
/**
  DO NOT EDIT THIS CODE
*/
import {Tests} from './lib/tests.js';

let scratch;
let tests = new Tests();

export async function run(_scratch) {
  scratch = _scratch;
  tests = new Tests();
  prepare();
  await execute();
  evaluate();
  return tests;
}

async function execute() {
  return scratch.clickGreenFlag();
}

/**
 * EDIT THIS CODE
 * prepare() :the code that needs to be executed before greenFlag() is called, this can be empty.
 * evaluate() :tests the result of the evaluation. See the API for which tests are available.
 */

function prepare() {

  scratch.simulation
    .foreach(
      ['Hoofd', 'Stage', 'Goblin', 'Hoofd', 'Hoofd', 'Hoofd', 'Hoofd'],
      (index, target, anchor) => {
        return anchor
          .clickTarget(target, 300)
      }
    )
    .end();

  scratch.setSimulation();
}

function evaluate() {
  tests.add(
    scratch.sprites.getCostume('Hoofd') === 'rood',
    "Correct: na 5 keer klikken is het hoofd van de goblin rood",
    `Fout: het hoofd moest rood zijn maar was ${scratch.sprites.getCostume('Hoofd')}`);
  tests.add(
    scratch.allBlocks.containsBlock('looks_nextcostume'),
    "Correct: het blok 'volgend kostuum' wordt gebruikt",
    "Fout: het blok 'volgend kostuum' werd niet gebruikt");
}
