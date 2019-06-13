function beforeExecution(templateJSON, testJSON) {
    if (!containsSprite(testJSON, 'Papegaai')) {
        addError('Er moet een sprite met de naam Papegaai bestaan in het project!');
    }
}

function duringExecution() {

    actionTimeout = 8000;

    scratch.eventScheduling
        .wait(1000)
        .test('De papegaai heeft nog niet bewogen', 'De papegaai mag niet bewegen voor er op geklikt wordt', (log) => {
            return !log.hasSpriteMoved('Papegaai');
        })
        .clickSprite({spriteName: 'Papegaai', sync: false}) // De eerste klik laat de papegaai starten met bewegen.
        .wait(3000)
        .end();

    scratch.start();
}

function afterExecution() {

    // Test of de papegaai nooit verticaal beweegt:
    addCase('De papegaai beweegt niet verticaal', log.getMaxY('Papegaai') === log.getMinY('Papegaai'), 'De y-coordinaat van de Papegaai blijft niet constant');

    // De papegaai moet (horizontaal) van richting veranderen, maar enkel als de papegaai zich bij rand van het speelveld bevindt.

    // We beschouwen enkel de frames na de klik
    let klikEvent = log.events.filter({type: 'click'})[0];
    let frames = log.frames.filter({after: klikEvent.time});
    let directions = []; // We slaan de richting van de papegaai op bij elke verandering van richting.
    let previousFrame = frames[0];
    let oldDirection = previousFrame.getSprite('Papegaai').direction;

    for (let frame of frames) {
        let sprite = frame.getSprite('Papegaai');
        if (oldDirection !== sprite.direction) { // De richting van de sprite is veranderd
            directions.push(sprite.direction);
            oldDirection = sprite.direction;
            // Test of de papegaai de rand raakt
            let papegaai = previousFrame.getSprite('Papegaai');
            let raaktRand = (papegaai.x + papegaai.bounds.width / 2 > 230) || (papegaai.x - papegaai.bounds.width / 2 < -230);
            addCase('De papegaai raakt de rand bij het veranderen van richting', raaktRand, 'De papegaai is veranderd van richting zonder de rand te raken van het speelveld');
            // Test of de papegaai altijd van links naar rechts en omgekeerd beweegt
            let vliegtHorizontaal = (sprite.direction === 90 || sprite.direction === -90);
            addCase('De papegaai vliegt horizontaal', vliegtHorizontaal, 'De richting van de papegaai is niet 90 of -90, de papegaai vliegt niet horizontaal.');
        }
        previousFrame = frame;
    }

    addCase('De papegaai veranderde van richting', directions.length > 2, `De papegaai moet minstens twee veranderen van richting, maar is maar ${directions.length} keer veranderd`);

    // De papegaai verandert van kostuum tijdens het vliegen
    let costumeChanges = log.getCostumeChanges('Papegaai');
    addCase('Papegaai klappert met vleugels', costumeChanges.length > 30, `De Papegaai moet constant wisselen tussen de kostuums 'VleugelsOmhoog' en 'VleugelsOmlaag'`);

    // Gebruik best een lus de papegaai te bewegen en van kostuum te veranderen.
    addCase('Gebruik van een lus', log.blocks.containsLoop(), 'Er werd geen herhalingslus gebruikt');

    // De code in de lus wordt minstens 2 keer herhaald
    addCase('Correcte gebruik van de lus', log.blocks.numberOfExecutions('control_forever') > 2, 'De code in de lus werd minder dan 2 keer herhaald');
}
