

function prepare() {

    actionTimeout = 3000;

    //scratch.captureData('x', 'y', 'direction');

    scratch.simulation
        .clickSprite('Papegaai')
        .end();

    scratch.start();
}

function evaluate() {

    addTest('Kostuumnaam', 'VleugelsOmhoog', scratch.sprites.getCostume('Papegaai'), 'kostuum test');

    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');

}
