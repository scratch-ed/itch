/**
 * EDIT THIS CODE
 * prepare() :the code that needs to be executed before greenFlag() is called, this can be empty.
 * evaluate() :tests the result of the evaluation. See the API for which tests are available.
 *
 * scratch is the handle for the scratch judge.
 */
function prepare() {

    scratch.simulation
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
    tests.add(
        scratch.sprites.getCostume('Hoofd') === 'rood',
        "Correct: na 5 keer klikken is het hoofd van de goblin rood",
        `Fout: het hoofd moest rood zijn maar was ${scratch.sprites.getCostume('Hoofd')}`);
    tests.add(
        scratch.blocks.containsBlock('looks_nextcostume'),
        "Correct: het blok 'volgend kostuum' wordt gebruikt",
        "Fout: het blok 'volgend kostuum' werd niet gebruikt");
}
