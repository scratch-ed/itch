function prepare() {

    actionTimeout = 7000;

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



    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');

    console.log('max x is ', scratch.sprites.getMaxX('Papegaai'));
    console.log('min x is ', scratch.sprites.getMinX('Papegaai'));

    console.log(scratch.sprites.inBounds('Papegaai'));

    addTest('Grenzen', true, scratch.sprites.inBounds('Papegaai'), 'Papegaai bleef binnen de grenzen van het venster');


}
