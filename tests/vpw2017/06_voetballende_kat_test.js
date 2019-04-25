function prepare() {

    actionTimeout = 5000;

    scratch.eventScheduling
        .pressKey({key: ' ', sync: true})
        .end();

    scratch.start();
}

function evaluate() {

    // De kat raakt de voetbal in de laatste frame
    let touches = scratch.sprites.isTouchingSprite('Kat', 'Voetbal', scratch.log.currentFrame);
    addTest('Raakt de voetbal', true, touches, 'Op het einde van de uitvoer moet de kat de voetbal raken');

}
