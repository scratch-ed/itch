/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/**
 * Controleer op welke manier de leerling het startproject heeft aangepast
 *
 * @param {Project} template
 * @param {Project} submission
 */
function beforeExecution(template, submission) {
  if (template.hasAddedSprites(submission)) {
    addError('Er zijn sprites toegevoegd aan het startproject!');
  }

  if (template.hasRemovedSprites(submission)) {
    addError('Er zijn sprites verwijderd uit het startproject!');
  }

  for (const target of submission.sprites()) {
    if (template.hasChangedCostumes(submission, target.name)) {
      addError(`De kostuums van de sprite met naam ${target.name} zijn gewijzigd!`);
    }

    // Controleer of er geen code-blokken toegevoegd zijn aan Nori (indien vermeld in de opgave)
    if (target.name === 'Nori') {
      if (!_.isEmpty(target.blocks)) {
        addError('De code blokken werden toegevoegd aan Nori en niet aan de hoed!');
      }
    }
  }
}

function duringExecution() {
  let firstHat = null;

  scratch.eventScheduling
    .log((log) => {
      firstHat = log.sprites.getSprite('Hat');
    })
    .clickSprite({ spriteName: 'Hat', sync: true })
    .test('Na 1 klik op de hoed', 'De hoed moet veranderen wanneer er op geklikt wordt', (log) => {
      const secondHat = log.sprites.getSprite('Hat');
      return firstHat.currentCostume !== secondHat.currentCostume;
    })
    .foreach(
      ['Hat', 'Stage', 'Nori', 'Hat', 'Hat', 'Hat', 'Hat', 'Stage', 'Nori', 'Nori', 'Hat', 'Hat', 'Hat'],
      (index, target, anchor) => {
        return anchor
          .clickSprite({ spriteName: target, sync: true });
      }
    )
    .end();
  debugger;

  scratch.start();
}

function afterExecution() {
  const numberOfCostumes = log.getNumberOfCostumes('Hat');

  // De sprite 'Hat' moet meer dan 1 kostuum bevatten.
  const hasMoreThanOneCostume = (numberOfCostumes > 1);
  if (!hasMoreThanOneCostume) {
    addCase('Kostuums van de hoed', hasMoreThanOneCostume, 'De hoed moet meer dan 1 kostuum hebben');
    return;
  }

  // De hoed mag enkel van kostuum veranderen als er op de hoed geklikt wordt.
  const clicks = log.events.filter({ type: 'click' });
  for (const click of clicks) {
    const costumeNrBefore = click.getPreviousFrame().getSprite(click.data.target).currentCostume;
    const costumeNrAfter = click.getNextFrame().getSprite(click.data.target).currentCostume;

    // Indien er op de hoed wordt geklikt
    if (click.data.target === 'Hat') {
      const correctCostumeNr = (costumeNrBefore + 1) % numberOfCostumes;
      addTest('Kostuum na 1 klik', correctCostumeNr, costumeNrAfter, 'Na 1 klik op de sprite met naam \'Hat\' moet het volgende kostuum getoond worden.');
    }
    // Indien er op een andere sprite wordt geklikt
    else {
      addTest('Kostuum na 1 klik', costumeNrBefore, costumeNrAfter, 'Na 1 klik niet op de sprite met naam \'Hat\' moet het kostuum gelijk blijven.');
    }
  }

  // Het gebruik van het blok 'looks_costume' is aan te raden.
  addCase('De correcte blokken werden gebruikt', log.blocks.containsBlock('looks_nextcostume'), 'Gebruik het blok looks_nextcostume om gemakkelijk het volgende kostuum van de sprite weer te geven.');
}
