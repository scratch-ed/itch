

function prepare() {

    addTab('Resultaat');

    scratch.simulation
        .clickSprite('Hoofd', 300)
        .testCostume('Hoofd', 'blauw')
        .clickSprite('Stage', 300)
        .testCostume('Hoofd', 'blauw')
        .clickSprite('Hoofd', 300)
        .testCostume('Hoofd', 'rood')
        .clickSprite('Goblin', 300)
        .testCostume('Hoofd', 'rood')
        .clickSprite('Hoofd', 300)
        .testCostume('Hoofd', 'geel')
        .clickSprite('Hoofd', 300)
        .testCostume('Hoofd', 'blauw')
        .end();

    scratch.setSimulation();
}

function evaluate() {

    addTest('Kleur van kostuum', 'blauw', scratch.sprites.getCostume('Hoofd'), 'Na 4 keer klikken op het hoofd van de goblin is het hoofd blauw');
    endTab();

    addTab('Code');
    addTest('Juiste blokken gebruikt', true, scratch.blocks.containsBlock('looks_nextcostume'), 'Het blok volgend_kostuum wordt gebruikt');
    endTab();


}
