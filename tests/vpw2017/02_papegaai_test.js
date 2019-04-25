function prepare() {

    actionTimeout = 5000;

    scratch.eventScheduling
        .greenFlag({sync: false})
        .wait(1000)
        .clickSprite({spriteName: 'Papegaai'}) // De eerste klik laat de papegaai starten met bewegen.
        .wait(1000)
        .clickSprite({spriteName: 'Papegaai'}) // Deze klik doet helemaal niets.
        .wait(1000)
        .end();

    scratch.start();
}

function evaluate() {


    // De papegaai blijft binnen het venster
    addTest('Grenzen', true, scratch.sprites.inBounds('Papegaai'), 'Papegaai bleef binnen de grenzen van het venster');

    // De papegaai moet minstends beide muren geraakt hebben
    let directions = scratch.sprites.getDirections('Papegaai');
    addTest('De papegaai raakt de randen', '>2', directions.length, 'De papegaai moet minstens beide randen een keer geraakt hebben', directions.length > 2);

    // De papegaai vliegt horizontaal (directions 90 en -90)
    addTest('De papegaai vliegt horizontaal', true, scratch.sprites.isHorizontal('Papegaai'), 'De papegaai vliegt van links naar rechts en omgekeerd.');

    // De papegaai verandert van richting van 90 naar -90 en van -90 naar 90.
    addTest('De richting van de papegaai', true, scratch.sprites.bouncesHorizontal('Papegaai'), 'De Papegaai draait 180 graden bij het botsen op een muur');

    // De y-coordinaat van de papegaai blijft constant
    console.log(scratch.sprites.getMaxY('Papegaai'));
    console.log(scratch.sprites.getMinY('Papegaai'));
    let x = scratch.sprites.getMaxY('Papegaai') === scratch.sprites.getMinY('Papegaai');
    addTest('De y-coordinaat is constant', true, x, 'De y-coordinaat van de Papegaai blijft constant');

    // De papegaai verandert van kostuum
    let costumeChanges = scratch.sprites.getCostumeChanges('Papegaai');
    addTest('Papegaai klappert met vleugels', true, costumeChanges.length > 30, 'De Papegaai wisselt constant tussen de kostuums VleugelsOmhoog en VleugelsOmlaag');

    // Het is beter om het blok 'looks_nextcostume' te gebruiken.
    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');

}
