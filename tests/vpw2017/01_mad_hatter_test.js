// Controleer op welke manier de leerling het startproject heeft aangepast
function beforeExecution(templateJSON, testJSON) {

    if (hasAddedSprites(templateJSON, testJSON)) {
        addError('Er zijn sprites toegevoegd aan het startproject!');
    }

    if (hasRemovedSprites(templateJSON, testJSON)) {
        addError('Er zijn sprites verwijderd uit het startproject!');
    }

    for (let target of testJSON.targets) {
        if (hasChangedCostumes(templateJSON, testJSON, target.name)) {
            addError(`De kostuums van de sprite met naam ${target.name} zijn gewijzigd!`);
        }

        //Controleer of er geen code-blokken toegevoegd zijn aan Nori (indien vermeld in de opgave)
        if (target.name === 'Nori') {
            if (!objectIsEmpty(target.blocks)){
                addError(`De code blokken werden toegevoegd aan Nori en niet aan de hoed!`);
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
        .clickSprite({spriteName: 'Hat', sync: true})
        .test('Na 1 klik op de hoed', 'De hoed moet veranderen wanneer er op geklikt wordt', (log) => {
            let secondHat = log.sprites.getSprite('Hat');
            return firstHat.currentCostume !== secondHat.currentCostume;
        })
        .foreach(
            ['Hat', 'Stage', 'Nori', 'Hat', 'Hat', 'Hat', 'Hat', 'Stage', 'Nori', 'Nori', 'Hat', 'Hat', 'Hat'],
            (index, target, anchor) => {
                return anchor
                    .clickSprite({spriteName: target, sync: true})
            }
        )
        .end();

    scratch.start();
}

function afterExecution() {

    let numberOfCostumes = log.getNumberOfCostumes('Hat');

    // De sprite 'Hat' moet meer dan 1 kostuum bevatten.
    let hasMoreThanOneCostume = (numberOfCostumes > 1);
    if (!hasMoreThanOneCostume) {
        addCase('Kostuums van de hoed', hasMoreThanOneCostume, 'De hoed moet meer dan 1 kostuum hebben');
        return;
    }

    // De hoed mag enkel van kostuum veranderen als er op de hoed geklikt wordt.
    let clicks = log.events.filter({type:'click'});
    for (let click of clicks) {
        let costumeNrBefore = click.getPreviousFrame().getSprite(click.data.target).currentCostume;
        let costumeNrAfter = click.getNextFrame().getSprite(click.data.target).currentCostume;

        // Indien er op de hoed wordt geklikt
        if (click.data.target === 'Hat') {
            let correctCostumeNr = (costumeNrBefore + 1) % numberOfCostumes;
            addTest('Kostuum na 1 klik', correctCostumeNr, costumeNrAfter, `Na 1 klik op de sprite met naam 'Hat' moet het volgende kostuum getoond worden.`);
        }
        // Indien er op een andere sprite wordt geklikt
        else {
            addTest('Kostuum na 1 klik', costumeNrBefore, costumeNrAfter, `Na 1 klik niet op de sprite met naam 'Hat' moet het kostuum gelijk blijven.`);
        }
    }

    // Het gebruik van het blok 'looks_costume' is aan te raden.
    addCase('De correcte blokken werden gebruikt', log.blocks.containsBlock('looks_nextcostume'), 'Gebruik het blok looks_nextcostume om gemakkelijk het volgende kostuum van de sprite weer te geven.');
}
