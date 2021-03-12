/* Copyright (C) 2019 Ghent University - All Rights Reserved */

let scoreVariable = null;

/**
 * Controleer op welke manier de leerling het startproject heeft aangepast
 *
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} e - The output manager.
 */
function beforeExecution(template, submission, e) {
  e.describe('Andere vakjes', l => {
    // Controleer of er aan de sprites geprutst is.
    l.test('Niet geprutst met andere sprites', l => {
      l.expect(template.hasAddedSprites(submission) || template.hasRemovedSprites(submission)).toBe(false);
    });

    // Controleer of de variable 'score' bestaat.
    scoreVariable = submission.getVariable('Score');
    l.test('De variable Score moet bestaan', l => {
      l.expect(scoreVariable)
        .withError('Er moet één variable Score zijn.')
        .toNotBe(null);
    });
  });
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
      e.test('Score moet starten op 0', l => {
        l.expect(e.log.getVariableValue(scoreVariable.variable.name, scoreVariable.target.name))
          .toBe('0');
      });
      const sprite = e.log.sprites.getSprite('Kom');
      e.test('Kom moet starten op 0, -150', l => {
        l.expect([sprite.x, sprite.y])
          .toBe([0, -150]);
      });
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
        .wait(sprite('Appel').toReach({x: null, y: 120}))
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

  e.test('Appels komen bovenaan tevoorschijn', l => {
    l.expect(top)
      .withError('Appels komen bovenaan tevoorschijn')
      .toBe(22);
  });

  const random = new Set(locations.map(location => location.x)).size;

  e.test('Appels komen op willekeurige positie', l => {
    l.expect(random >= 18)
      .toBe(true);
  });
  
  // Check the speed of the apples.
  // For every position, either the y is 180 or it is 5 less than the previous frame.
  const speed = locations.every((value, index, arr) => {
    if (value.y === 180 || index === 0) {
      return true;
    }
    return value.y === arr[index - 1].y - 5;
  });
  e.test('Appelsnelheid', l => {
    l.expect(speed)
      .toBe(true);
  });

  // Check end score.
  const end = e.log.current.getSprite('Stage').getVariable('Score');
  e.test('Eindscore', l => {
    l.expect(end.value)
      .withError('De score moet eindigen op 10')
      .toBe(10);
  });

  const variables = e.log.getVariables('Score');
  const increases = variables.every((e, i, a) => {
    if (i > 0) { 
      return e > a[i - 1]; 
    } else { 
      return true; 
    }
  });
  
  e.test('Score stijgt', l => {
    l.expect(increases)
      .withError("De score moet stijgen met één")
      .toBe(true);
  });
}
