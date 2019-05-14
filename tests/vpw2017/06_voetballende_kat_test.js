function duringExecution() {

    actionTimeout = 5000;

    scratch.eventScheduling
        .pressKey({key: ' ', sync: true})
        .end();

    scratch.start();
}

function afterExecution() {

    // De kat raakt de voetbal in de laatste frame
    let touches = log.sprites.isTouchingSprite('Kat', 'Voetbal');
    addTest('Raakt de voetbal', true, touches, 'Op het einde van de uitvoer moet de kat de voetbal raken');

    // De afstand van de kat naar de bal verkleint over tijd
    let distances = log.getDistancesToSprite('Kat', 'Voetbal');
    let oldDistance = distances[0];
    let test = true;
    for (let distance of distances) {
        if (distance > oldDistance) {
            test = false;
        }
        oldDistance = distance;
    }
    addCase('Afstand van Kat tot Voetbal', test, 'De afstand van de kat naar de voetbal moet verkleinen over de tijd');

}
