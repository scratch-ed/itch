// Check if the student modified the start sprites
function check(templateJSON, testJSON) {
    console.log(templateJSON);
    console.log(testJSON);

    // functie hiervoor

    //Check if the names of all sprites of the template code also appear in the submitted code
    let names = [];
    let i = 0;
    for (let target of templateJSON.targets) {
        names.push(target.name);
        i++;
    }
    for (let target of testJSON.targets) {
        if (!names.includes(target.name)) {
            return true;
        }
        i--;
    }

    //Check if no new sprites were added or removed
    if (i !== 0) {
        return true;
    }

    //Check if no costumes were added or removed from sprite 'Hat'
    for (let target of templateJSON.targets) {
        if (target.name === 'Hat') {
            i = target.costumes.length;
        }
    }
    for (let target of testJSON.targets) {
        if (target.name === 'Hat') {
            if (i !== target.costumes.length) {
                return true;
            }
        }
    }

    //Other checks

    //All checks passed
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

    //let log = scratch.log;

    let numberOfCostumes = log.getNumberOfCostumes('Hat');

    // De sprite 'Hat' moet meer dan 1 kostuum bevatten:
    let hasMoreThanOneCostume = (numberOfCostumes > 1);
    if (!hasMoreThanOneCostume) {
        addCase('De hoed heeft verschillende kostuums', hasMoreThanOneCostume, 'De hoed moet meer dan 1 kostuum hebben');
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
    addCase('De correcte blokken werden gebruikt', log.blocks.containsBlock('looks_nextcostume'), 'Gebruik het blok looks_nextcostume om gemakkelijk naar het volgende kostuum te gaan.');

}
