function beforeExecution(templateJSON, testJSON) {
    // Controleer of het ingediende project van de leerling een sprite heeft met als naam 'Heks'
    addCase('De sprite Heks is niet hernoemd', containsSprite(testJSON, 'Heks'), 'De sprite met als naam Heks werd niet teruggevonden in het project')
}

function duringExecution() {
    actionTimeout = 7000; //Indien een actie langer dan 7 seconden duurt, geef een timeout error.

    let heksPositie = {}; //We slaan de positie van de heks op om op te testen tijdens de uitvoering

    scratch.eventScheduling
        .log((log) => {
            heksPositie['x'] = log.sprites.getSprite('Heks').x; // De eerste positie van de heks wordt opgeslagen.
            heksPositie['y'] = log.sprites.getSprite('Heks').y;
        })
        .wait(500)
        .test('De Heks beweegt niet voor de klik', 'De heks bewoog nog voor er op geklikt werd', (log) => {
            let minX = log.getMinX('Heks');
            let maxX = log.getMaxX('Heks');
            let minY = log.getMinY('Heks');
            let maxY = log.getMaxY('Heks');
            return !(minX === maxX && minY === maxY);
        })
        .clickSprite({spriteName: 'Heks', sync: false}) // De eerste klik laat heks starten met bewegen.
        .wait(100)
        .test('De heks is veranderd van positie', 'De heks is niet van positie veranderd na de klik', (log) => {
            let heks = log.sprites.getSprite('Heks');
            let heeftBewogen = heks.x !== heksPositie['x'] || heks.y !== heksPositie['y'];
            heksPositie['x'] = heks.x;
            heksPositie['y'] = heks.y;
            return heeftBewogen;
        })
        .wait(1000) // wacht een seconde voor de volgende positie
        .test('De heks is veranderd van positie', 'De heks is niet van positie veranderd na een seconde na de klik', (log) => {
            let heks = log.sprites.getSprite('Heks');
            let heeftBewogen = heks.x !== heksPositie['x'] || heks.y !== heksPositie['y'];
            heksPositie['x'] = heks.x;
            heksPositie['y'] = heks.y;
            return heeftBewogen;
        })
        .end();

    scratch.start();
}

function afterExecution() {
    // Gebruik best een lus om elke seconde de heks te verplaatsen
    addCase('Gebruik van een lus', log.blocks.containsBlock('control_repeat'), 'Er werd geen herhalingslus gebruikt');

    // De code in de lus wordt minstens 2 keer herhaald
    addCase('Correcte gebruik van de lus', log.blocks.numberOfExecutions('control_repeat') > 2, 'De code in de lus werd minder dan 2 keer herhaald');
}

