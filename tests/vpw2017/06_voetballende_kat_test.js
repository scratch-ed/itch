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

    // De afstand van de kat naar de bal verkleint over tijd
    let distances = scratch.sprites.getDistancesToSprite('Kat', 'Voetbal');
    let oldDistance = distances[0];
    let test = true;
    for (let distance of distances) {
        if (distance > oldDistance) {
            test = false;
        }
        oldDistance = distance;
    }
    addTest('Afstand van Kat tot Voetbal', true, test, 'De afstand van de kat naar de voetbal moet verkleinen over de tijd');

}
