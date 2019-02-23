
let scratch;
let result;
//run with scratch environment
export async function run(_scratch) {
  scratch = _scratch;
  await prepare();
  await execute();
  await evaluate();
  return result;
}

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

async function execute() {
  return scratch.clickGreenFlag();
}

async function evaluate() {
  if(scratch.sprites.getCostume('Hoofd') === 2) {
    result = "Correct";
  }
  else {
    result = "Fout";
  }
}
