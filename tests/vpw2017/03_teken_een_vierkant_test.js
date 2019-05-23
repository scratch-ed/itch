function duringExecution() {
    
    scratch.eventScheduling
        .greenFlag()
        .end();

    scratch.start();
}

function afterExecution() {

    // Er mag maximum 1 vierkant getekend worden
    addTest('Aantal vierkanten', 1, log.getSquares().length, 'Er werd meer of minder dan exact 1 vierkant getekend');

    // Elke zijde heeft lengte 200
    let lines = log.getMergedLines();
    for (let line of lines) {
        console.log(log.getLineLength(line));
        addCase('Zijde heeft lengte 200', 200 === log.getLineLength(line), 'Elke zijde heeft lengte 200')
    }

    // Gebruik best een lus om het vierkant te tekenen
    addCase('Gebruik van een lus', log.blocks.containsBlock('control_repeat'), 'Er werd geen herhalingslus gebruikt');

    // De code in de lus wordt minstens 2 keer herhaald
    addCase('Correcte gebruik van de lus', log.blocks.numberOfExecutions('control_repeat') > 2, 'De code in de lus werd minder dan 2 keer herhaald');

    // Er werd gebruik gemaakt van de pen
    addCase('De pen werd gebruikt', log.blocks.containsBlock('pen_penDown'), 'Het blok pen_down werd niet gebruikt in de code');
}
