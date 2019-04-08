

function prepare() {

    scratch.events
        .foreach(
            ['Hoofd', 'Stage', 'Goblin', 'Hoofd', 'Hoofd', 'Hoofd', 'Hoofd'],
            (index, target, anchor) => {
                return anchor
                    .clickTarget(target, 300)
            }
        )
        .end();

    scratch.setSimulation();
}

function evaluate(tests) {

    console.log('dodona', 'some dodona format test here');

    tests.add(
        scratch.sprites.getCostume('Hoofd') === 'rood',
        "Correct: na 5 keer klikken is het hoofd van de goblin rood",
        `Fout: het hoofd moest rood zijn maar was ${scratch.sprites.getCostume('Hoofd')}`);
    tests.add(
        scratch.blocks.containsBlock('looks_nextcostume'),
        "Correct: het blok 'volgend kostuum' wordt gebruikt",
        "Fout: het blok 'volgend kostuum' werd niet gebruikt");
}
