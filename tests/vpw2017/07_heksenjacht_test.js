function duringExecution() {

    actionTimeout = 5000;

    scratch.eventScheduling
        .wait(500)
        .test('De Heks beweegt niet voor de klik', 'De heks bewoog nog voor er op geklikt werd', (log) => {
            let minX = log.getMinX('Heks');
            let maxX = log.getMaxX('Heks');
            let minY = log.getMinY('Heks');
            let maxY = log.getMaxY('Heks');
            return (minX === maxX && minY === maxY);
        })
        .clickSprite({spriteName: 'Heks'}) // De eerste klik laat heks starten met bewegen.
        .wait(1100)
        .wait(1000)
        .wait(1000)
        .end();

    scratch.start();
}

function afterExecution() {

    let places = [];
    let lastX = 0;
    let lastY = 0;
    for (let frame in log.frames.list) {
        let sprite = frame.getSprite('Heks');
        if (lastX !== sprite.x || lastY !== sprite.y) {
            lastX = sprite.x;
            lastY = sprite.y;
            places.push({x: lastX, y: lastY});
        }
    }
    //Test of de heks minstens 1-malig verplaatst is na een klik
    addCase('De heks heeft bewogen', places.length > 1, 'Na een klik moet de heks van positie veranderen');

    //Test of de heks meermalig verplaatst is van positie
    addCase('De heks heeft bewogen', places.length > 2, 'Na een klik moet de heks van positie veranderen en elke seconde opnieuw veranderen van positie');

    let clickTime = log.events.filter({type: 'click'})[0].time;

    //1 seconde na clickTime moet de positie van de heks veranderd zijn

    let frames1 = log.frames.filter({after: clickTime + 200, before: clickTime + 800});
    let frames2 = log.frames.filter({after: clickTime + 1200, before: clickTime + 1800});
    let frames3 = log.frames.filter({after: clickTime + 2200, before: clickTime + 2800});

    let heks1 = frames1[0].getSprite('Heks');
    let heks2 = frames2[0].getSprite('Heks');
    let heks3 = frames3[0].getSprite('Heks');

    addCase('na 1 seconde', (heks1.x !== heks2.x || heks1.y !== heks2.y), 'De heks is na 1 seconde nog niet veranderd van positie');
    addCase('na 2 secondes', (heks2.x !== heks3.x || heks2.y !== heks3.y), 'De heks is na nog 1 seconde nog niet veranderd van positie');

}
