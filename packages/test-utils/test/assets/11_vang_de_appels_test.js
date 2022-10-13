/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e - The output manager. */
function beforeExecution(e) {
  e.group.group('Andere vakjes', () => {
    // Controleer of er aan de sprites geprutst is.
    e.group
      .test('Niet geprutst met andere sprites')
      .expect(e.log.template.sprites.map((s) => s.name).sort())
      .toBe(e.log.submission.sprites.map((s) => s.name).sort());

    // Controleer of de variable 'score' bestaat.
    const scoreVariable = e.log.submission.targets.map((s) => s.variable('Score'))[0];
    e.group
      .test('De variable Score moet bestaan')
      .feedback({
        wrong: 'Er moet een variable Score zijn.',
        correct: 'Er is een variabele met de naam Score.',
      })
      .acceptIf(!!scoreVariable);
  });
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 10000;
  e.acceleration = 10;

  const mouse = { x: 0, y: 0 };

  function mousePosition() {
    const appel = e.log.last.sprite('Appel').x;
    if (appel + 200 >= 240) {
      return appel - 200;
    } else {
      return appel + 200;
    }
  }

  e.scheduler
    .greenFlag(false)
    .wait(Itch.sprite('Appel').toMove())
    .log(() => {
      // After the apple has moved, the score should have been set to zero.
      e.group
        .test('Score moet starten op 0')
        .expect(
          e.log.last.targets.find((s) => s.variable('Score'))?.variable('Score').value,
        )
        .toBe('0');
      const sprite = e.log.last.sprite('Kom');
      e.group
        .test('Kom moet starten op 0, -150')
        .expect([sprite.x, sprite.y])
        .toBe([0, -150]);
    })
    .log(() => {
      mouse.x = e.log.last.sprite('Appel').x;
    })
    .forEach(_.range(0, 10), (ev) => {
      return ev
        .useMouse(mouse)
        .wait(Itch.sprite('Appel').toTouch('Kom'))
        .log(() => {
          mouse.x = e.log.last.sprite('Appel').x;
        });
    })
    .log(() => {
      mouse.x = mousePosition();
    })
    .forEach(_.range(0, 10), (ev) => {
      // We need to move the bowl out of the way.
      return ev
        .useMouse(mouse)
        .wait(Itch.sprite('Appel').toReach({ x: null, y: 120 }))
        .log(() => {
          mouse.x = mousePosition();
        });
    })
    .end();
}

function getSpritePositions(sprite, snapshots) {
  return snapshots
    .map((snapshots) => snapshots.sprite(sprite))
    .map((sprite) => {
      return { x: sprite.x, y: sprite.y };
    })
    .filter((item, pos, arr) => {
      return pos === 0 || !_.isEqual(item, arr[pos - 1]);
    });
}

function getVariables(variableName, logs) {
  return logs
    .map((log) => log.target('Stage'))
    .map((sprite) => sprite.variable(variableName).value)
    .filter((item, pos, arr) => {
      return pos === 0 || !_.isEqual(item, arr[pos - 1]);
    });
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Check that the apples spawn on top, and in a random position.
  // We need 20 positions with y = 180, and at least 18 different x positions.
  // TODO: is 15 too lax?
  const locations = getSpritePositions('Appel', e.log.snapshots);
  const top = locations.filter((location) => location.y === 180).length;

  e.group
    .test('Appels komen bovenaan tevoorschijn')
    .feedback({
      correct: 'Appels komen bovenaan tevoorschijn',
      wrong: 'Appels moeten bovenaan tevoorschijn komen',
    })
    .acceptIf(top >= 10);

  const random = new Set(locations.map((location) => location.x)).size;

  e.group.test('Appels komen op willekeurige positie').acceptIf(random >= 18);

  // Check end score.
  const end = e.log.last.target('Stage').variable('Score');
  e.group
    .test('Eindscore')
    .feedback({
      correct: 'De score eindigt op 10',
      wrong: 'De score moet eindigen op 10',
    })
    .acceptIf(end.value >= 10);

  const variables = getVariables('Score', e.log.snapshots);
  const increases = variables.every((e, i, a) => {
    if (i > 0) {
      return e > a[i - 1];
    } else {
      return true;
    }
  });

  e.group
    .test('Score stijgt')
    .feedback({
      wrong: 'De score moet stijgen met één',
      correct: 'De score stijgt met één',
    })
    .acceptIf(increases);
}
