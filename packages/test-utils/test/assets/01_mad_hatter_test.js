/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * Controleer op welke manier de leerling het startproject heeft aangepast
 *
 * @param {Evaluation} e - The evaluation.
 */
function beforeExecution(e) {
  Itch.checkPredefinedBlocks(
    {
      hats: {
        Hat: (_b) => true,
      },
    },
    e,
  );
}

/** @param {Evaluation} e */
function duringExecution(e) {
  let firstHat = null;

  e.scheduler
    .log(() => {
      firstHat = e.log.last.sprite('Hat');
    })
    .clickSprite('Hat')
    .log(() => {
      e.groupedOutput.startGroup('Testen voor de Hoed');
      const secondHat = e.log.last.sprite('Hat');
      e.group
        .test('Hoed verandert bij klikken')
        .expect(firstHat.costume)
        .toNotBe(secondHat.costume);
    })
    .forEach(
      [
        'Hat',
        'Stage',
        'Nori',
        'Hat',
        'Hat',
        'Hat',
        'Hat',
        'Stage',
        'Nori',
        'Nori',
        'Hat',
        'Hat',
        'Hat',
      ],
      (event, hat) => event.clickSprite(hat),
    )
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const costumes = new Set();
  for (const snapshot of e.log.snapshots) {
    const sprite = snapshot.sprite('Hat');
    costumes.add(sprite.costume);
  }

  const g = e.group;

  g.test('Kostuums van de hoed')
    .feedback({
      wrong: 'De hoed moet meer dan 1 kostuum hebben.',
    })
    .acceptIf(costumes.size > 1);

  const clicks = e.log.events.filter((e) => e.type === 'click');
  for (const click of clicks) {
    const costumeNrBefore = click.previous.target(click.data.target).currentCostume;
    const costumeNrAfter = click.next.target(click.data.target).currentCostume;

    // Indien er op de hoed wordt geklikt
    if (click.data.target === 'Hat') {
      const correctCostumeNr = (costumeNrBefore + 1) % costumes.size;
      g.test('Klikken op de hoed')
        .feedback({
          wrong:
            "Na 1 klik op de sprite met naam 'Hat' moet het volgende kostuum getoond worden.",
        })
        .expect(costumeNrAfter)
        .toBe(correctCostumeNr);
    }
    // Indien er op een andere sprite wordt geklikt
    else {
      g.test('Klikken op de hoed')
        .feedback({
          wrong:
            "Na 1 klik niet op de sprite met naam 'Hat' moet het kostuum gelijk blijven.",
        })
        .expect(costumeNrAfter)
        .toBe(costumeNrBefore);
    }
  }

  const hatBlocks = e.log.events
    .filter((e) => e.type === 'block_execution' && e.data.target === 'Hat')
    .map((e) => e.data.block().opcode);

  g.test('Correcte blokken')
    .feedback({
      wrong:
        'Gebruik het blok looks_nextcostume om gemakkelijk het volgende kostuum van de sprite weer te geven.',
    })
    .acceptIf(hatBlocks.includes('looks_nextcostume'));

  e.groupedOutput.closeGroup();
}
