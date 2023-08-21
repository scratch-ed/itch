/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function duringExecution() {

    actionTimeout = 7000;

    scratch.eventScheduling
        .wait(500)
        .test('De Heks beweegt niet voor de klik', 'De heks bewoog nog voor er op geklikt werd', (log) => {
            // De heks mag nog maar op 1 locatie geweest zijn
            return log.getSpriteLocations('Heks') <= 1;
        })
        .clickSprite({spriteName: 'Heks', sync: false}) // De eerste klik laat heks starten met bewegen.
        .range(0, 4000, 50, (index, anchor) => { // Manueel elke 50 ms, 4000 ms lang, de sprites loggen.
            return anchor
                .wait(50)
                .log()
        })
        .end();

    scratch.start();
}

function afterExecution() {

    let places = log.getSpriteLocations('Heks');

    //Test of de heks minstens 1-malig verplaatst is na een klik
    addCase('De heks heeft bewogen', places.length > 1, 'Na een klik moet de heks van positie veranderen');

    //Test of de heks meermalig verplaatst is van positie
    addCase('De heks heeft bewogen', places.length > 2, 'Na een klik moet de heks van positie veranderen en elke seconde opnieuw veranderen van positie');

    let clickTime = log.events.filter({type: 'click'})[0].time;

    //Na clickTime moet de positie van de heks veranderd zijn en daarna constant blijven voor een seconde
    let frames1 = log.frames.filter({after: clickTime + 200, before: clickTime + 800});
    let frames2 = log.frames.filter({after: clickTime + 1200, before: clickTime + 1800});
    let frames3 = log.frames.filter({after: clickTime + 2200, before: clickTime + 2800});
    let heks1 = frames1[0].getSprite('Heks');
    let heks2 = frames2[0].getSprite('Heks');
    let heks3 = frames3[0].getSprite('Heks');

    // Controleer of de heks elke seconde een andere positie heeft
    addCase('na 1 seconde', (heks1.x !== heks2.x || heks1.y !== heks2.y), 'De heks is na 1 seconde nog niet veranderd van positie');
    addCase('na 2 secondes', (heks2.x !== heks3.x || heks2.y !== heks3.y), 'De heks is na nog 1 seconde nog niet veranderd van positie');

    // Controleer of de heks niet van positie verandert in voor een seconde:
    let place1 = log.getSpriteLocations('Heks', frames1);
    let place2 = log.getSpriteLocations('Heks', frames2);
    let place3 = log.getSpriteLocations('Heks', frames3);

    addCase('tijdens een seconde', place1.length === 1, 'De heks mag maar eenmalig veranderen van positie elke seconde');
    addCase('tijdens een seconde', place2.length === 1, 'De heks mag maar eenmalig veranderen van positie elke seconde');
    addCase('tijdens een seconde', place3.length === 1, 'De heks mag maar eenmalig veranderen van positie elke seconde');
}
