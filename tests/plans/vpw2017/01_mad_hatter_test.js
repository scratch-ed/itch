/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * Controleer op welke manier de leerling het startproject heeft aangepast
 *
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  output.describe("Controle op sprites", l => {
    l.test('Toegevoegde sprites', l => {
      l.expect(template.hasAddedSprites(submission)).toBe(false);
    });
    l.test('Verwijderde sprites', l => {
      l.expect(template.hasRemovedSprites(submission)).toBe(false);
    });
    l.test('Gewijzigde costumes', l => {
      for (const target of submission.sprites()) {
        l.expect(template.hasChangedCostumes(submission, target.name)).toBe(false);
      }
    });
    l.test('Code van Nori', l => {
      const nori = submission.sprite('Nori');
      l.expect(_.isEmpty(nori.blocks))
        .withError('De codeblokken werden toegevoegd aan Nori en niet aan de hoed!')
        .toBe(true);
    });
  });
}

/** @param {Evaluation} e */
function duringExecution(e) {
  let firstHat = null;
  
  e.scheduler
    .log(() => { firstHat = e.log.sprites.getSprite('Hat') })
    .clickSprite('Hat')
    .log(() => {
      const secondHat = e.log.sprites.getSprite('Hat');
      e.test('Hoed verandert bij klikken', l => {
        l.expect(firstHat.currentCostume).toNotBe(secondHat.currentCostume);
      });
    })
    .forEach(
      ['Hat', 'Stage', 'Nori', 'Hat', 'Hat', 'Hat', 'Hat', 'Stage', 'Nori', 'Nori', 'Hat', 'Hat', 'Hat'],
      (event, hat) => event.clickSprite(hat)
    )
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const numberOfCostumes = e.log.getNumberOfCostumes('Hat');

  // De sprite 'Hat' moet meer dan 1 kostuum bevatten.
  const hasMoreThanOneCostume = (numberOfCostumes > 1);
  if (!hasMoreThanOneCostume) {
    e.output.addCase('Kostuums van de hoed', hasMoreThanOneCostume, 'De hoed moet meer dan 1 kostuum hebben');
    return;
  }

  // De hoed mag enkel van kostuum veranderen als er op de hoed geklikt wordt.
  const clicks = e.log.events.filter({ type: 'click' });
  for (const click of clicks) {
    const costumeNrBefore = click.getPreviousFrame().getSprite(click.data.target).currentCostume;
    const costumeNrAfter = click.getNextFrame().getSprite(click.data.target).currentCostume;

    // Indien er op de hoed wordt geklikt
    if (click.data.target === 'Hat') {
      const correctCostumeNr = (costumeNrBefore + 1) % numberOfCostumes;
      e.output.addTest('Kostuum na 1 klik', correctCostumeNr, costumeNrAfter, 'Na 1 klik op de sprite met naam \'Hat\' moet het volgende kostuum getoond worden.');
    }
    // Indien er op een andere sprite wordt geklikt
    else {
      e.output.addTest('Kostuum na 1 klik', costumeNrBefore, costumeNrAfter, 'Na 1 klik niet op de sprite met naam \'Hat\' moet het kostuum gelijk blijven.');
    }
  }

  // Het gebruik van het blok 'looks_costume' is aan te raden.
  e.output.addCase('De correcte blokken werden gebruikt', e.log.blocks.containsBlock('looks_nextcostume'), 'Gebruik het blok looks_nextcostume om gemakkelijk het volgende kostuum van de sprite weer te geven.');
}
