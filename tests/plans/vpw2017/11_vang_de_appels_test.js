/* Copyright (C) 2019 Ghent University - All Rights Reserved */
let spriteName = '';
let variableName = '';

function beforeExecution(templateJSON, submission) {
  // Controleer of het ingediende project van de leerling een sprite heeft met als naam 'Heks'
  if (!submission.containsSprite('Appel')) {
    addError('De sprite met als naam Appel werd niet teruggevonden in het project');
  }
  if (!submission.containsSprite('Kom')) {
    addError('De sprite met als naam Kom werd niet teruggevonden in het project');
  }

  // Check if a variable exists
  let i = 0;
  for (const target of submission.targets) {
    for (const property in target.variables) {
      if (target.variables.hasOwnProperty(property)) {
        i++;
        spriteName = target.name;
        variableName = target.variables[property][0];
      }
    }
  }

  if (i !== 1) {
    addError('Er moet exact 1 variabele bestaan');
  }
}

function duringExecution() {
  actionTimeout = 10000;

  const mouse = { x: 0, y: 0 };

  // TODO: would it be better to not set timings, but attach to the apple somehow.

  scratch.eventScheduling
    .greenFlag({ sync: false })
    .range(0, 4000, 200, (index, anchor) => {
      console.log('Mouse will be', mouse);
      return anchor
        .useMouse(mouse)
        .wait(200)
        .log((log) => {
          mouse.x = log.sprites.getSprite('Appel').x;
        });
    })
    .range(0, 3000, 200, (index, anchor) => {
      console.log('Mouse will be', mouse);
      return anchor
        .useMouse(mouse)
        .wait(200)
        .log((log) => {
          mouse.x = log.sprites.getSprite('Appel').x + 200;
        });
    })
    .end();

  scratch.start();
}

function afterExecution() {
  let oldScore = 0;
  let newScore = 0;
  let oldFrame = log.frames.list[0];
  for (const frame of log.frames.list) {
    newScore = log.getVariableValue(variableName, spriteName, frame);
    if (newScore > oldScore) {
      // De score is verhoogd, controleer of sprites elkaar raakten in de vorige frame
      console.log(oldFrame, frame);
      oldScore = newScore;
    }
    oldFrame = frame;
  }
  console.log('---');
  for (const frame of log.frames.list) {
    if (log.doSpritesOverlap('Appel', 'Kom', frame)) {
      console.log(frame);
    }
  }
}
