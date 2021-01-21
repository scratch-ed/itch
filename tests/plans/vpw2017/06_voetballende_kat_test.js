/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function duringExecution() {
  scratch.eventScheduling
    .pressKey({ key: ' ', sync: true })
    .end();

  scratch.start();
}

function afterExecution() {
  // De kat raakt de voetbal in de laatste frame
  addCase('De kat raakt de voetbal', log.sprites.isTouching('Kat', 'Voetbal'), 'Op het einde van de uitvoer raakt de kat de voetbal niet');

  // De afstand van de kat naar de bal verkleint over tijd
  const distances = log.getDistancesToSprite('Kat', 'Voetbal');
  let oldDistance = distances[0];
  let test = true;
  for (const distance of distances) {
    if (distance > oldDistance) {
      test = false;
    }
    oldDistance = distance;
  }
  addCase('Afstand van kat tot voetbal wordt kleiner', test, 'De afstand van de kat naar de voetbal verkleint niet over de tijd');
}
