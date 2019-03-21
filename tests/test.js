

function prepare() {

    actionTimeout = 3000;

    scratch.simulation
        .clickSprite('Hoofd')
        .testCostume('Hoofd', 'blauw')
        .clickSprite('Stage')
        .clickSprite('Goblin')
        .testCostume('Hoofd', 'blauw')
        .clickSprite('Hoofd')
        .testCostume('Hoofd', 'rood')
        .clickSprite('Goblin')
        .testCostume('Hoofd', 'rood')
        .clickSprite('Hoofd')
        .testCostume('Hoofd', 'geel')
        .clickSprite('Hoofd')
        .testCostume('Hoofd', 'blauw')
        .end();

    scratch.setSimulation();
}

function evaluate() {

    addTest('Kleur van kostuum', 'blauw', scratch.sprites.getCostume('Hoofd'), 'Na 4 keer klikken op het hoofd van de goblin is het hoofd blauw');

    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');


}
