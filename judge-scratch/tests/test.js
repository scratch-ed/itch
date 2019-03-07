/**
 * EDIT THIS CODE
 * prepare() :the code that needs to be executed before greenFlag() is called, this can be empty.
 * evaluate() :tests the result of the evaluation. See the API for which tests are available.
 */

function prepare() {
    // No preparation needed
}

function evaluate() {
    tests.add(
        scratch.playground.squares.length === 1,
        "Correct: Er is exact 1 vierkant getekend",
        `Fout: Er werden ${scratch.playground.squares.length} vierkant(en) getekend`);
    tests.add(
        scratch.blocks.containsLoop(),
        "Correct: Er wordt een herhalingslus gebruikt",
        "Fout: Er wordt geen herhalingslus gebruikt");
    tests.add(
        scratch.blocks.numberOfExecutions('control_repeat') > 2,
        "Correct: De code in de herhalingslus wordt minstens 2 keer herhaald",
        `Fout: De code in de herhalingslus wordt ${scratch.blocks.numberOfExecutions('control_repeat')} keer herhaald`);
    tests.add(
        scratch.blocks.containsBlock('pen_penDown'),
        "Correct: Er wordt een pen_down blok gebruikt",
        "Fout: Er wordt geen pen_down blok gebruikt");
}
