// Check if the student modified the start sprites
function check() {
    //todo
    return false;
}

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


    let numberOfCostumes = log.getNumberOfCostumes('Hat');

    // De sprite 'Hat' moet meer dan 1 kostuum bevatten:
    let hasMoreThanOneCostume = (numberOfCostumes > 1);
    if (!hasMoreThanOneCostume) {
        addTest('De hoed heeft verschillende kostuums', true, hasMoreThanOneCostume, 'De hoed moet meer dan 1 kostuum hebben');
        return;
    }

    // De hoed moet enkel van kostuum veranderen als er op de hoed geklikt wordt.
    let clicks = log.events.filter({type:'click'});
    for (let click of clicks) {
        let costumeNrBefore = click.getPreviousFrame().getSprite(click.data.target).currentCostume;
        let costumeNrAfter = click.getNextFrame().getSprite(click.data.target).currentCostume;
        // Indien er op de hoed wordt geklikt

        if (click.data.target === 'Hat') {
            let correctCostumeNr = (costumeNrBefore + 1) % numberOfCostumes;
            addTest('Kostuum na 1 klik', correctCostumeNr, costumeNrAfter, 'Na 1 klik op -Hat- moet het volgende kostuum getoond worden.');
        }
        // Indien er op een andere sprite wordt geklikt
        else {
            addTest('Kostuum na 1 klik', costumeNrBefore, costumeNrAfter, 'Na 1 klik NIET op -Hat- moet het kostuum gelijk blijven.');
        }
    }

    // Het gebruik van het blok 'looks_costume' is aan te raden.
    addTest('Juiste blok gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Gebruik het blok looks_nextcostume om gemakkelijk naar het volgende kostuum te gaan.');

}
