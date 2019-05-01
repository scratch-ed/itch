function prepare() {

    actionTimeout = 5000;

    scratch.eventScheduling
        .wait(1000)
        .clickSprite({spriteName: 'Papegaai', sync: false}) // De eerste klik laat de papegaai starten met bewegen.
        .wait(500)
        .clickSprite({spriteName: 'Papegaai', sync: false}) // Deze klik doet helemaal niets.
        .wait(2000)
        .end();

    scratch.start();
}

function evaluate() {

    // De papegaai beweegt niet voor de eerste klik.
    let click = scratch.events.getEventsByType('click')[0];
    let frames = scratch.log.getFrames({before: click.time, after: ...});
    let minX = scratch.sprites.getMinX('Papegaai', frames);
    let maxX = scratch.sprites.getMaxX('Papegaai', frames);
    let minY = scratch.sprites.getMinY('Papegaai', frames);
    let maxY = scratch.sprites.getMaxY('Papegaai', frames);
    addTest('Papegaai voor eerste klik', true, (minX === maxX && minY === maxY), 'De papegaai beweegt niet voor de eerste klik');

    let frames = log.frames.filter({spriteName: 'Papegaai', variables: {isTouchingEdge: true, x: 0}})
    let isTouchingEdge = false;
    for (let frame of log.frames) {
        if(frame.getSprite('Papegaai').isTouchingEdge) {
            isTouchingEdge = true;
        }
    }
    // voor opnieuw verandert moet direction veranderd zijn


    // De papegaai moet minstens beide muren geraakt hebben
    let directions = scratch.sprites.getDirections('Papegaai');
    addTest('De papegaai ', '>2', directions.length, 'De papegaai moet minstens beide randen een keer geraakt hebben', directions.length > 2);

    // De papegaai vliegt horizontaal (directions 90 en -90)
    addTest('De papegaai vliegt horizontaal', true, scratch.sprites.isHorizontal('Papegaai'), 'De papegaai vliegt van links naar rechts en omgekeerd.');

    // De papegaai verandert van richting van 90 naar -90 en van -90 naar 90.
    addTest('De richting van de papegaai', true, scratch.sprites.bouncesHorizontal('Papegaai'), 'De Papegaai draait 180 graden bij het botsen op een muur');

    // De y-coordinaat van de papegaai blijft constant
    let x = scratch.sprites.getMaxY('Papegaai') === scratch.sprites.getMinY('Papegaai');
    addTest('De y-coordinaat is constant', true, x, 'De y-coordinaat van de Papegaai blijft constant');

    // De papegaai verandert van kostuum
    let costumeChanges = scratch.sprites.getCostumeChanges('Papegaai');
    addTest('Papegaai klappert met vleugels', true, costumeChanges.length > 30, 'De Papegaai wisselt constant tussen de kostuums VleugelsOmhoog en VleugelsOmlaag');

    // Het is beter om het blok 'looks_nextcostume' te gebruiken.
    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');

}
