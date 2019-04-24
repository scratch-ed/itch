

function prepare() {

    scratch.eventScheduling
        .foreach(
            ['Hat', 'Stage', 'Nori', 'Hat', 'Hat', 'Hat', 'Hat'],
            (index, target, anchor) => {
                return anchor
                    .clickSprite({spriteName: target, sync: true})
            }
        )
        .end();

    scratch.start();
}

function evaluate() {

    let clicks = scratch.events.getEventsByType('click');
    let numberOfCostumes = scratch.sprites.getNumberOfCostumes('Hat');

    // De sprite 'Hat' moet meer dan 1 kostuum bevatten:
    let hasMoreThanOneCostume = (numberOfCostumes > 1);
    addTest('De hoed heeft verschillende kostuums', true, hasMoreThanOneCostume, 'De hoed moet meer dan 1 kostuum hebben');

    // De hoed moet enkel van kostuum veranderen als er op de hoed geklikt wordt.
    for (let click of clicks) {
        // Indien er op de hoed wordt geklikt
        if (click.data.target === 'Hat') {

            //todo vraag in meeting of dit bij events of bij sprites hoort.
            let costumeNrBefore = scratch.events.getSpriteBeforeEvent(click, 'Hat').currentCostume;
            let costumeNrAfter = scratch.events.getSpriteAfterEvent(click, 'Hat').currentCostume;

            let correctCostumeNr = (costumeNrBefore + 1) % numberOfCostumes;

            addTest('Kostuum na 1 klik', correctCostumeNr, costumeNrAfter, 'Na 1 klik op -Hat- moet het volgende kostuum getoond worden.');
        }
        // Indien er op een andere sprite wordt geklikt
        else {
            let costumeNrBefore = scratch.events.getSpriteBeforeEvent(click, click.data.target).currentCostume;
            let costumeNrAfter = scratch.events.getSpriteAfterEvent(click, click.data.target).currentCostume;

            addTest('Kostuum na 1 klik', costumeNrBefore, costumeNrAfter, 'Na 1 klik NIET op -Hat- moet het kostuum gelijk blijven.');
        }
    }

    // Het gebruik van het blok 'looks_costume' is aan te raden.
    addTest('Juiste blok gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Gebruik het blok looks_nextcostume om gemakkelijk naar het volgende kostuum te gaan.');

}
