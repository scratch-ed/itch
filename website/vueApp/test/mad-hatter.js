
/**
  DO NOT EDIT THIS CODE
*/
let scratch;
let result;

export async function run(_scratch) {
  scratch = _scratch;
  await prepare();
  await execute();
  await evaluate();
  return result;
}

async function execute() {
  return scratch.clickGreenFlag();
}

/**
 * EDIT THIS CODE
 * prepare() :the code that needs to be executed before greenFlag() is called, this can be empty.
 * evaluate() :tests the result of the evaluation. See the API for which tests are available.
 */

async function prepare() {

  scratch.simulation
    .foreach(
      ['Stage', 'Hoofd', 'Hoofd', 'Goblin', 'Hoofd', 'Hoofd', 'Stage', 'Goblin', 'Hoofd', 'Goblin'],
      (index, target, anchor) => {
        return anchor
          .clickTarget(target, 300)
      }
    )
    .next(() => {
      console.log("Finished simulation");
      Scratch.simulationEnd.resolve();
    },0);

  return scratch.setSimulation();
}

async function evaluate() {
  if(scratch.sprites.getCostume('Hoofd') === 2) {
    result = "Correct";
  }
  else {
    result = "Fout";
  }
}
