function duringExecution() {

    actionTimeout = 2000;

    scratch.eventScheduling
        .greenFlag({sync: true})
        .end();

    scratch.start();
}

function afterExecution() {

    // Er moet maximum 1 vierkant getekend worden
    addCase('Aantal vierkanten', scratch.playground.squares.length >= 1, `Er moet minimum 1 vierkant getekend worden`);

    // Er moet maximum 1 driehoek getekend worden
    addCase('Aantal driehoeken', scratch.playground.triangles.length >= 1, 'Er moet minimum 1 driehoek getekend worden');

    // Gebruik best een lus om het vierkant te tekenen
    addCase('Gebruik van een lus', scratch.blocks.containsBlock('control_repeat'), 'Er werd geen herhalingslus gebruikt');

    // De code in de lus wordt minstens 2 keer herhaald
    addCase('Correcte lus', scratch.blocks.numberOfExecutions('control_repeat') > 2, 'De code in de lus moet minstens 2 keer herhaald worden');

    // Er werkt gebruik gemaakt van de pen
    addCase('De pen werkt gebruikt', scratch.blocks.containsBlock('pen_penDown'), 'Het blok pen_Down werd niet gebruikt in de code');

}
