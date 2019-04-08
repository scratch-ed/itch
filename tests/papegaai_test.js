

function prepare() {

    actionTimeout = 5000;

    //scratch.captureData('x', 'y', 'direction');

    scratch.events
        .greenFlag(2000)
        .clickSprite('Papegaai', 3000)
        .end();

    scratch.start();
}

function evaluate() {

    addTest('Kostuumnaam', 'VleugelsOmhoog', scratch.sprites.getCostume('Papegaai'), 'kostuum test');

    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');

}
