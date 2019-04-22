/**
 * EDIT THIS CODE
 * prepare() :give certain events that happen before testing (greenFlag call, clicks, keypresses, etc)
 * evaluate() :tests the result of the evaluation. See the API for which tests are available.
 *
 * scratch is the handle for the scratch judge.
 */

function prepare() {

    actionTimeout = 10000;

    scratch.events
        .greenFlag({sync: false, delay: 3000})
        .greenFlag({sync: false, delay: 3000})
        .greenFlag({sync: true, delay: 3000})
        .wait(1000)
        .end();

    scratch.start();
}

function evaluate() {

    let test1 = (scratch.playground.squares.length >= 1);
    addTest('squares', 1, scratch.playground.squares.length, 'vierkant test', test1);

}
