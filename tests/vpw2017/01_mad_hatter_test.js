

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

    for (let click of clicks) {
        if (click.data.target === 'Hat') {

            //todo vraag in meeting of dit bij events of bij sprites hoort.
            let costumeNrBefore = scratch.events.getSpriteBeforeEvent(click, 'Hat').currentCostume;
            let costumeNrAfter = scratch.events.getSpriteAfterEvent(click, 'Hat').currentCostume;

            let correctCostumeNr = (costumeNrBefore + 1) % numberOfCostumes;

            addTest('Kostuum na 1 klik', correctCostumeNr, costumeNrAfter, 'Na 1 klik moet het volgende kostuum getoond worden.');
        }
    }

}
