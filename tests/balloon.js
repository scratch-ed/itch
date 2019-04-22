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
        .greenFlag({sync: false, timeout: 2000})
        .wait(1000)
        .clickSprite({spriteName: 'Balloon', sync: true, timeout: 1000})
        .wait(1200)
        .clickSprite({spriteName: 'Balloon', sync: true})
        .clickSprite({spriteName: 'Balloon', sync: true})
        .clickSprite({spriteName: 'Balloon', sync: true})
        .end();

    scratch.start();
}

function evaluate() {

    let test1 = (scratch.sprites.getVariableValue('score', 'Balloon') === 4);
    console.log('score is', scratch.sprites.getVariableValue('score', 'Balloon'));
    //addTest('score', 4, scratch.sprites.getVariableValue('score', 'Balloon'), 'score test', test1);

}
