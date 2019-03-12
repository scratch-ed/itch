

function prepare() {

    window.startTab('Resultaat');

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
    let status;

    // Test kostuum na uitvoering
    window.startTestcase('juiste kostuum');
    window.startTest('blauw');
    window.appendMessage("Na 5 keer klikken op het hoofd van de goblin is het hoofd blauw");

    if (scratch.sprites.getCostume('Hoofd') === 'blauw') {
        status = {enum: 'correct', human: 'Correct'};
    } else {
        status = {enum: 'wrong', human: 'Fout'};
    }
    window.closeTest(scratch.sprites.getCostume('Hoofd'), status);
    window.closeTestcase();


    window.closeTab();
    window.startTab('Code');
    window.startContext();

    window.startTestcase('Juiste blokken gebruikt');
    window.startTest('true');
    window.appendMessage("Het blok 'volgend kostuum' wordt gebruikt");

    if (scratch.blocks.containsBlock('looks_nextcostume')) {
        status = {enum: 'correct', human: 'Correct'};
    } else {
        status = {enum: 'wrong', human: 'Fout'};
    }
    window.closeTest(scratch.blocks.containsBlock('looks_nextcostume'), status);
    window.closeTestcase();
}
