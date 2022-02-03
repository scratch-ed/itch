/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/** @param {Evaluation} e */
function beforeExecution(e) {
  const g = e.group;
  e.groupedOutput.startGroup('Testen voor de Papegaai');
  g.test('Papegaai bestaat')
    .feedback({
      wrong: 'Er moet een sprite met de naam Papegaai bestaan in het project!',
    })
    .expect(e.log.submission.findSprite('Papegaai'))
    .toNotBe(undefined);
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 8000;
  // e.acceleration = 10;

  e.scheduler
    .wait(1000)
    .log(() => {
      // De papegaai mag niet bewegen voor er op geklikt wordt.
      const positions = new Set();
      for (const snapshot of e.log.snapshots) {
        const sprite = snapshot.sprite('Papegaai');
        positions.add({ x: sprite.x, y: sprite.y });
      }
      e.group
        .test('Papegaai beweegt niet')
        .feedback({
          wrong: 'De papegaai mag niet bewegen voor er op geklikt wordt',
        })
        .expect(positions.size)
        .toBe(1);
    })
    .clickSprite('Papegaai', false)
    .wait(3000)
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Only check snapshots after the clock.
  const clickEvent = e.log.events.find((e) => e.type === 'click');
  const snaps = e.log.snapshots
    .filter((s) => s.timestamp >= clickEvent.timestamp)
    .map((s) => s.sprite('Papegaai'));
  const directions = []; // We slaan de richting van de papegaai op bij elke verandering van richting.
  let previousSnapshot = snaps[0];
  let oldDirection = previousSnapshot.direction;

  // Collect all positions
  const yPositions = snaps.map((s) => s.y);
  const maxY = Math.max(...yPositions);
  const minY = Math.min(...yPositions);

  e.group
    .test('Papegaai vliegt enkel horizontaal')
    .feedback({
      wrong: 'De y-coördinaat van de Papegaai blijft niet constant',
    })
    .expect(minY)
    .toBe(maxY);

  // De papegaai moet (horizontaal) van richting veranderen, maar enkel als de papegaai zich bij rand van het speelveld bevindt.
  for (const sprite of snaps) {
    if (oldDirection !== sprite.direction) {
      // De richting van de sprite is veranderd
      directions.push(sprite.direction);
      oldDirection = sprite.direction;
      // Test of de papegaai de rand raakt
      const raaktRand =
        previousSnapshot.bounds.right > 220 || previousSnapshot.bounds.left < -220;
      e.group
        .test()
        .feedback({
          correct: 'De papegaai raakt de rand bij het veranderen van richting.',
          wrong:
            'De papegaai is veranderd van richting zonder de rand te raken van het speelveld.',
        })
        .acceptIf(raaktRand);
      // Test of de papegaai altijd van links naar rechts en omgekeerd beweegt
      e.group
        .test()
        .feedback({
          correct: 'De papegaai vliegt horizontaal.',
          wrong:
            'De richting van de papegaai is niet 90 of -90, de papegaai vliegt niet horizontaal.',
        })
        .acceptIf(sprite.direction === 90 || sprite.direction === -90);
    }
    previousSnapshot = sprite;
  }

  e.group
    .test()
    .feedback({
      correct: 'De papegaai veranderde minimum 2 keer van richting.',
      wrong: `De papegaai moet minstens twee veranderen van richting, maar is maar ${directions.length} keer veranderd.`,
    })
    .acceptIf(directions.length > 2);

  // Calculate how many costume changes there are.
  const costumeChanges = [];
  let oldCostume = '';
  for (const sprite of snaps) {
    if (oldCostume !== sprite.costume) {
      costumeChanges.push(sprite.costume);
      oldCostume = sprite.costume;
    }
  }

  e.group
    .test()
    .feedback({
      correct: 'De Papegaai klappert met vleugels.',
      wrong:
        "De Papegaai moet constant wisselen tussen de kostuums 'VleugelsOmhoog' en 'VleugelsOmlaag'",
    })
    .acceptIf(costumeChanges.length > 4);

  e.groupedOutput.closeGroup();

  e.group.group('Blokjes', () => {
    const blocks = e.log.events
      .filter((e) => e.type === 'block_execution')
      .map((b) => b.data.block());

    e.group
      .test()
      .feedback({
        correct: 'Gebruik van een lus',
        wrong: 'Er werd geen herhalingslus gebruikt',
      })
      .acceptIf(
        blocks.some((b) => ['control_repeat', 'control_forever'].includes(b.opcode)),
      );

    const counted = blocks.filter((b) => b.opcode === 'control_forever');
    // De code in de lus wordt minstens 2 keer herhaald
    e.group
      .test()
      .feedback({
        correct: 'Correcte gebruik van de lus',
        wrong: 'De code in de lus werd minder dan 2 keer herhaald',
      })
      .acceptIf(counted.length > 2);
  });
}
