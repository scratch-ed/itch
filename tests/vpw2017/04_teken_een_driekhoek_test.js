function duringExecution() {

    actionTimeout = 2000;

    scratch.eventScheduling
        .greenFlag({sync: true})
        .end();

    scratch.start();
}

function afterExecution() {

    // Er mag maximum 1 driehoek getekend worden
    addTest('Aantal driehoeken', 1, log.getTriangles().length, 'Er werd meer of minder dan exact 1 driehoek getekend');

    // Elke zijde heeft lengte 200
    let lines = log.getMergedLines();
    for (let line of lines) {
        console.log(log.getLineLength(line));
        addCase('Zijde heeft lengte 200', 200 === log.getLineLength(line), 'Elke zijde heeft lengte 200')
    }

    // Er werd gebruik gemaakt van de pen
    addCase('De pen werd gebruikt', log.blocks.containsBlock('pen_penDown'), 'Het blok pen_down werd niet gebruikt in de code');
}
