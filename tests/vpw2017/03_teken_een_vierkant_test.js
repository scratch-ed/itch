/**
 * EDIT THIS CODE
 * prepare() :give certain events that happen before testing (greenFlag call, clicks, keypresses, etc)
 * evaluate() :tests the result of the evaluation. See the API for which tests are available.
 *
 * scratch is the handle for the scratch judge.
 */

function prepare() {

    actionTimeout = 2000;

    scratch.eventScheduling
        .greenFlag({sync: true})
        .end();

    scratch.start();
}

function evaluate() {

    // Er mag maximum 1 vierkant getekend worden
    addTest('Aantal vierkanten', 1, scratch.playground.squares.length, 'Er werd precies 1 vierkant getekend');

    // Elke zijde heeft lengte 200
    let lines = scratch.playground.mergedLines;
    for (let line of lines) {
        console.log(scratch.playground.getLineLength(line));
        addTest('Zijde heeft lengte 200', 200, scratch.playground.getLineLength(line), 'Elke zijde heeft lengte 200')
    }


    // Gebruik best een lus om het vierkant te tekenen
    addTest('Gebruik van een lus', true, scratch.blocks.containsBlock('control_repeat'), 'Er werd een herhalingslus gebruikt');

    // De code in de lus wordt minstens 2 keer herhaald
    addTest('Correcte lus', true, scratch.blocks.numberOfExecutions('control_repeat') > 2, 'De code in de lus werd minstens 2 keer herhaald');

    // Er werkt gebruik gemaakt van de pen
    addTest('De pen werkt gebruikt', true, scratch.blocks.containsBlock('pen_penDown'), 'Het blok pen_Down werkt gebruikt in de code');
}
