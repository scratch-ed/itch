/**
 * EDIT THIS CODE
 * prepare() :the code that needs to be executed before greenFlag() is called, this can be empty.
 * evaluate() :tests the result of the evaluation. See the API for which tests are available.
 *
 * scratch is the handle for the scratch judge.
 */

function prepare() {
    scratch.events
        .greenFlag()
        .end();

    scratch.start();
}

function evaluate() {

    console.log(scratch.playground);

    addTest('squares', 1, scratch.playground.squares.length, 'vierkant test');

}
