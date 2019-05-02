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
    let click = log.events.filter({type:'click'})[0];
    let stillframes = log.frames.filter({before: click.time});
    let minX = scratch.sprites.getMinX('Papegaai', stillframes);
    let maxX = scratch.sprites.getMaxX('Papegaai', stillframes);
    let minY = scratch.sprites.getMinY('Papegaai', stillframes);
    let maxY = scratch.sprites.getMaxY('Papegaai', stillframes);
    addCase('Papegaai voor eerste klik', (minX === maxX && minY === maxY), 'De papegaai mag niet bewegen voor de eerste klik');

    let isTouchingEdge = false;
    for (let frame of log.frames.list) {
        if(frame.getSprite('Papegaai').isTouchingEdge) {
            isTouchingEdge = true;
        }
    }

    // De papegaai moet minstens beide muren geraakt hebben
    let directions = log.getDirections('Papegaai');
    addCase('De papegaai ', directions.length > 2, `De papegaai moet minstens beide randen een keer geraakt hebben, maar heeft maar ${directions.length} randen geraakt`);

    // De papegaai vliegt horizontaal (directions 90 en -90)
    addCase('De papegaai vliegt horizontaal', log.isHorizontal('Papegaai'), 'De papegaai vliegt van links naar rechts en omgekeerd.');

    // De papegaai verandert van richting van 90 naar -90 en van -90 naar 90.
    addCase('De richting van de papegaai', log.bouncesHorizontal('Papegaai'), 'De Papegaai draait 180 graden bij het botsen op een muur');

    // De y-coordinaat van de papegaai blijft constant
    let x = log.getMaxY('Papegaai') === log.getMinY('Papegaai');
    addCase('De y-coordinaat is constant', x, 'De y-coordinaat van de Papegaai blijft constant');

    // De papegaai verandert van kostuum
    let costumeChanges = log.getCostumeChanges('Papegaai');
    addCase('Papegaai klappert met vleugels', costumeChanges.length > 30, 'De Papegaai wisselt constant tussen de kostuums VleugelsOmhoog en VleugelsOmlaag');

    // Het is beter om het blok 'looks_nextcostume' te gebruiken.
    addCase('Juiste blokken gebruikt', log.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');

}
