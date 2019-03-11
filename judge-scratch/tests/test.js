

function prepare() {

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

function evaluate(tests) {

    console.log('dodona', 'some dodona format test here');

    tests.add(
        scratch.sprites.getCostume('Hoofd') === 'blauw',
        "Correct: na 5 keer klikken is het hoofd van de goblin rood",
        `Fout: het hoofd moest rood zijn maar was ${scratch.sprites.getCostume('Hoofd')}`);
    tests.add(
        scratch.blocks.containsBlock('looks_nextcostume'),
        "Correct: het blok 'volgend kostuum' wordt gebruikt",
        "Fout: het blok 'volgend kostuum' werd niet gebruikt");
}
