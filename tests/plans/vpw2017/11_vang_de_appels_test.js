/* Copyright (C) 2019 Ghent University - All Rights Reserved */

let scoreVariable = null;

/**
 * Controleer op welke manier de leerling het startproject heeft aangepast
 *
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  // Controleer of er aan de sprites geprutst is.
  output.addTest('Niet geprutst met ingebouwde sprites',
    false,
    template.hasAddedSprites(submission) || template.hasRemovedSprites(submission),
    'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
  );

  // Controleer of de variable 'score' bestaat.
  scoreVariable = submission.getVariable('Score');

  output.addTest('De variable Score moet bestaan',
    true,
    scoreVariable !== null,
    'Er moet één variable Score zijn.'
  );
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 10000;
  e.acceleration = 10;

  const mouse = { x: 0, y: 0 };

  function mousePosition() {
    const appel = e.log.sprites.getSprite('Appel').x;
    if (appel + 200 >= 240) {
      return appel - 200;
    } else {
      return appel + 200;
    }
  }

  e.scheduler
    .greenFlag(false)
    .wait(sprite('Appel').toMove())
    .log(() => {
      // After the apple has moved, the score should have been set to zero.
      e.output.addTest(
        'Score moet starten op 0',
        '0',
        e.log.getVariableValue(scoreVariable.variable.name, scoreVariable.target.name),
        'De score moet beginnen op 0.'
      );
      const sprite = e.log.sprites.getSprite('Kom');
      e.output.addTest(
        'Kom moet starten op 0, -150',
        [0, -150],
        [sprite.x, sprite.y],
        'De score moet beginnen op 0.'
      );
    })
    .log(() => {
      mouse.x = e.log.sprites.getSprite('Appel').x;
    })
    .forEach(_.range(0, 10), (ev) => {
      return ev
        .useMouse(mouse)
        .wait(sprite('Appel').toTouch('Kom'))
        .log(() => {
          mouse.x = e.log.sprites.getSprite('Appel').x;
        });
    })
    .log(() => {
      mouse.x = mousePosition();
    })
    .forEach(_.range(0, 10), (ev) => {
      // We need to move the bowl out of the way.
      return ev.useMouse(mouse)
        .wait(sprite('Appel').toReach(null, 120))
        .log(() => {
          mouse.x = mousePosition();
        });
    })
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {

  // Check that the apples spawn on top, and in a random position.
  // We need 20 positions with y = 180, and at least 18 different x positions.
  // TODO: is 15 too lax?
  const locations = e.log.getSpritePositions('Appel');
  const top = locations.filter(location => location.y === 180).length;
  e.output.addTest(
    'Appels komen bovenaan tevoorschijn',
    19,
    top
  );

  const random = new Set(locations.map(location => location.x)).size;
  e.output.addTest('Appels komen op willekeurige positie',
    true,
    random >= 18
  );
  
  // Check the speed of the apples.
  // For every position, either the y is 180 or it is 5 less than the previous frame.
  const speed = locations.every((value, index, arr) => {
    if (value.y === 180 || index === 0) {
      return true;
    };
    return value.y === arr[index - 1].y - 5;
  });
  e.output.addTest(
    'Appelsnelheid',
    true,
    speed,
    'De snelheid van de appel is 5',
  );

  // Check end score.
  const end = e.log.current.getSprite('Stage').getVariable('Score');
  e.output.addTest(
    'Eindscore',
    10,
    end.value,
    'De score moet eindigen op 20',
  );

  const variables = e.log.getVariables('Score');
  const increases = variables.every((e, i, a) => {
    if (i > 0) { 
      return e > a[i - 1]; 
    } else { 
      return true; 
    }
  });
  
  e.output.addTest(
    'Score stijgt',
    true,
    increases,
    "De score moet stijgen met één"
  );
}
