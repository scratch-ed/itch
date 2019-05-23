function duringExecution() {

    scratch.eventScheduling
        .greenFlag()
        .end();

    scratch.start();
}

function afterExecution() {

    let vierkanten = log.getSquares();
    // Er mag maximum 1 vierkant getekend worden
    addTest('Aantal vierkanten', 1, vierkanten.length, `Er mag maar 1 vierkant getekend worden`);

    // Elke zijde van het vierkant heeft lengte 200
    let vierkant = vierkanten[0];
    let punt = vierkant[0];
    for (let i = 1; i < 4; i++) {
        let line = {start: punt, end: vierkant[i]};
        addCase('Zijde heeft lengte 200', 200 === log.getLineLength(line), 'Elke zijde heeft lengte 200');
        punt = vierkant[i];
    }

    // Er werd gebruik gemaakt van de pen
    addCase('De pen werd gebruikt', log.blocks.containsBlock('pen_penDown'), 'Het blok pen_down werd niet gebruikt in de code');
}
