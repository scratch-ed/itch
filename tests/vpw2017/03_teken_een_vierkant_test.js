function duringExecution() {

    scratch.eventScheduling
        .greenFlag()
        .end();

    scratch.start();
}

function afterExecution() {

    let vierkanten = log.getSquares();
    // Er moet exact 1 vierkant getekend worden
    addTest('Aantal vierkanten', 1, vierkanten.length, `Er werd niet exact 1 vierkant getekend`);

    if (vierkanten.length === 0) {
        addError('Er werden geen vierkanten gedetecteerd op het speelveld!');
    }

    // Elke zijde van het vierkant heeft lengte 200
    addCase('Zijdes hebben lengte 200', 200 === vierkanten[0].length, 'De zijdes van het vierkant hebben niet lengte 200');

    // Er werd gebruik gemaakt van de pen
    addCase('De pen werd gebruikt', log.blocks.containsBlock('pen_penDown'), 'Het blok pen_down werd niet gebruikt in de code');
}
