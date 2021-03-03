/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  if (!submission.containsSprite('Papegaai')) {
    output.addError('Er moet een sprite met de naam Papegaai bestaan in het project!');
  }
  
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 8000;

  e.scheduler
    .wait(1000)
    .log(() => {
      e.output.addTest('De papegaai heeft nog niet bewogen',
        false,
        e.log.hasSpriteMoved('Papegaai'),
        'De papegaai mag niet bewegen voor er op geklikt wordt'
      );
    })
    .clickSprite('Papegaai', false)
    .wait(3000)
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Test of de papegaai nooit verticaal beweegt:
  const correct = numericEquals(e.log.getMaxY('Papegaai'), e.log.getMinY('Papegaai'));
  e.output.addTest('De papegaai beweegt niet verticaal', true, correct,
    'De y-coördinaat van de Papegaai blijft niet constant');

  console.log('Max y is', e.log.getMaxY('Papegaai'));
  console.log('Min y is ', e.log.getMinY('Papegaai'));

  // De papegaai moet (horizontaal) van richting veranderen, maar enkel als de papegaai zich bij rand van het speelveld bevindt.

  // We beschouwen enkel de frames na de klik
  const klikEvent = e.log.events.filter({ type: 'click' })[0];
  const frames = searchFrames(e.log.frames, { after: klikEvent.time });
  const directions = []; // We slaan de richting van de papegaai op bij elke verandering van richting.
  let previousFrame = frames[0];
  let oldDirection = previousFrame.getSprite('Papegaai').direction;

  e.output.startTestCase('De papegaai vliegt juist');
  for (const frame of frames) {
    const sprite = frame.getSprite('Papegaai');
    if (oldDirection !== sprite.direction) { // De richting van de sprite is veranderd
      directions.push(sprite.direction);
      oldDirection = sprite.direction;
      // Test of de papegaai de rand raakt
      const papegaai = previousFrame.getSprite('Papegaai');
      const raaktRand = (papegaai.bounds.right > 220) || (papegaai.bounds.left < -220);
      e.output.addTest('De papegaai raakt de rand bij het veranderen van richting', true, raaktRand,
        'De papegaai is veranderd van richting zonder de rand te raken van het speelveld');
      // Test of de papegaai altijd van links naar rechts en omgekeerd beweegt
      const vliegtHorizontaal = (sprite.direction === 90 || sprite.direction === -90);
      e.output.addTest('De papegaai vliegt horizontaal', true, vliegtHorizontaal,
        'De richting van de papegaai is niet 90 of -90, de papegaai vliegt niet horizontaal.');
    }
    previousFrame = frame;
  }
  e.output.closeTestCase();

  e.output.addTest('De papegaai veranderde minimum 2 keer van richting', true, directions.length > 2,
    `De papegaai moet minstens twee veranderen van richting, maar is maar ${directions.length} keer veranderd`);

  // De papegaai verandert van kostuum tijdens het vliegen
  const costumeChanges = e.log.getCostumeChanges('Papegaai');
  e.output.addTest('Papegaai klappert met vleugels', true, costumeChanges.length > 4,
    `De Papegaai moet constant wisselen tussen de kostuums 'VleugelsOmhoog' en 'VleugelsOmlaag'`);

  // Gebruik best een lus de papegaai te bewegen en van kostuum te veranderen.
  e.output.addTest('Gebruik van een lus', true, e.log.blocks.containsLoop(), 'Er werd geen herhalingslus gebruikt');

  // De code in de lus wordt minstens 2 keer herhaald
  e.output.addTest('Correcte gebruik van de lus', true, e.log.blocks.numberOfExecutions('control_forever') > 2,
    'De code in de lus werd minder dan 2 keer herhaald');
}
