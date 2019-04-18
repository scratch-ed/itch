function prepare() {

    actionTimeout = 5000;

    //scratch.captureData('x', 'y', 'direction');

    // clickAndExecute -> teruggeven nadat click klaar is
    // click -> direct teruggeven


    scratch.events
        .fork([
            anchor => anchor.greenFlag(),
            anchor => anchor.wait()
        ])
        .greenFlag({sync: true})
        .wait(2000)
        .clickSprite({spriteName: 'Papegaai', delay: 0, timeout: 3000})
        .wait(1000)
        .clickSprite({spriteName: 'Papegaai', delay: 0, timeout: 3000})
        .end();

    scratch.start();
}

function evaluate() {

    addTest('Kostuumnaam', 'VleugelsOmhoog', scratch.sprites.getCostume('Papegaai'), 'kostuum test');

    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');

    console.log('max x is ', scratch.sprites.getMaxX('Papegaai'));
    console.log('min x is ', scratch.sprites.getMinX('Papegaai'));

    addTest('Grenzen', true, scratch.sprites.inBounds('Papegaai'), 'Papegaai bleef binnen de grenzen van het venster');


}
