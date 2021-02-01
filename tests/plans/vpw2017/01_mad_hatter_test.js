/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * Controleer op welke manier de leerling het startproject heeft aangepast
 *
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  if (template.hasAddedSprites(submission)) {
    output.addError('Er zijn sprites toegevoegd aan het startproject!');
  }

  if (template.hasRemovedSprites(submission)) {
    output.addError('Er zijn sprites verwijderd uit het startproject!');
  }

  for (const target of submission.sprites()) {
    if (template.hasChangedCostumes(submission, target.name)) {
      output.addError(`De kostuums van de sprite met naam ${target.name} zijn gewijzigd!`);
    }

    // Controleer of er geen code-blokken toegevoegd zijn aan Nori (indien vermeld in de opgave)
    if (target.name === 'Nori') {
      if (!_.isEmpty(target.blocks)) {
        output.addError('De code blokken werden toegevoegd aan Nori en niet aan de hoed!');
      }
    }
  }
}

/** @param {Evaluation} e */
function duringExecution(e) {
  let firstHat = null;
  
  e.scheduler
    .log(() => { firstHat = e.log.sprites.getSprite('Hat') })
    .clickSprite('Hat')
    .log(() => {
      const secondHat = e.log.sprites.getSprite('Hat');
      e.output.addTest('Hoed verandert bij klikken',
        firstHat.currentCostume === secondHat.currentCostume,
        false,
        'De hoed moet veranderen wanneer er op geklikt wordt')
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
