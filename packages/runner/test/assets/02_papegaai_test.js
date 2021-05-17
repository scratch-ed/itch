/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  output.describe('Testen voor Papegaai', (l) => {
    l.test('Papegaai bestaat', (l) => {
      l.expect(submission.containsSprite('Papegaai'))
        .withError('Er moet een sprite met de naam Papegaai bestaan in het project!')
        .toBe(true);
    });
  });
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 8000;
  // e.acceleration = 10;

  e.scheduler
    .wait(1000)
    .log(() => {
      e.test('Papegaai beweegt niet', (l) => {
        l.expect(e.log.hasSpriteMoved('Papegaai'))
          .withError('De papegaai mag niet bewegen voor er op geklikt wordt')
          .toBe(false);
      });
    })
    .clickSprite('Papegaai', false)
    .wait(3000)
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  e.describe('Testen voor papegaai', (l) => {
    // We beschouwen enkel de frames na de klik
    const klikEvent = e.log.events.filter({ type: 'click' })[0];
    const frames = searchFrames(e.log.frames, { after: klikEvent.time });
    const directions = []; // We slaan de richting van de papegaai op bij elke verandering van richting.
    let previousFrame = frames[0];
    let oldDirection = previousFrame.getSprite('Papegaai').direction;

    l.test('Papegaai vliegt enkel horizontaal', (l) => {
      l.expect(numericEquals(e.log.getMaxY('Papegaai'), e.log.getMinY('Papegaai')))
        .withError('De y-coördinaat van de Papegaai blijft niet constant')
        .toBe(true);
    });

    // De papegaai moet (horizontaal) van richting veranderen, maar enkel als de papegaai zich bij rand van het speelveld bevindt.
    for (const frame of frames) {
      const sprite = frame.getSprite('Papegaai');
      if (oldDirection !== sprite.direction) {
        // De richting van de sprite is veranderd
        directions.push(sprite.direction);
        oldDirection = sprite.direction;
        // Test of de papegaai de rand raakt
        const papegaai = previousFrame.getSprite('Papegaai');
        const raaktRand = papegaai.bounds.right > 220 || papegaai.bounds.left < -220;
        l.test('De papegaai raakt de rand bij het veranderen van richting', (l) => {
          l.expect(raaktRand)
            .withError(
              'De papegaai is veranderd van richting zonder de rand te raken van het speelveld',
            )
            .toBe(true);
        });
        l.test('De papegaai vliegt horizontaal', (l) => {
          // Test of de papegaai altijd van links naar rechts en omgekeerd beweegt
          l.expect(sprite.direction === 90 || sprite.direction === -90)
            .withError(
              'De richting van de papegaai is niet 90 of -90, de papegaai vliegt niet horizontaal.',
            )
            .toBe(true);
        });
      }
      previousFrame = frame;
    }

    l.test('De papegaai veranderde minimum 2 keer van richting', (l) => {
      l.expect(directions.length > 2)
        .withError(
          `De papegaai moet minstens twee veranderen van richting, maar is maar ${directions.length} keer veranderd`,
        )
        .toBe(true);
    });

    // De papegaai verandert van kostuum tijdens het vliegen
    l.test('Papegaai klappert met vleugels', (l) => {
      // De papegaai verandert van kostuum tijdens het vliegen
      const costumeChanges = e.log.getCostumeChanges('Papegaai');
      l.expect(costumeChanges.length > 4)
        .withError(
          `De Papegaai moet constant wisselen tussen de kostuums 'VleugelsOmhoog' en 'VleugelsOmlaag'`,
        )
        .toBe(true);
    });
  });

  e.describe('Blokjes', (l) => {
    l.test('Gebruik van een lus', (l) => {
      // Gebruik best een lus de papegaai te bewegen en van kostuum te veranderen.
      l.expect(e.log.blocks.containsLoop())
        .withError('Er werd geen herhalingslus gebruikt')
        .toBe(true);
    });
    // De code in de lus wordt minstens 2 keer herhaald
    l.test('Correcte gebruik van de lus', (l) => {
      l.expect(e.log.blocks.numberOfExecutions('control_forever') > 2)
        .withError('De code in de lus werd minder dan 2 keer herhaald')
        .toBe(true);
    });
  });
}
