/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.eventScheduling
    .pressKey({ key: ' ', sync: true })
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // De kat raakt de voetbal in de laatste frame
  e.output.addCase('De kat raakt de voetbal', 
    e.log.sprites.areTouching('Kat', 'Voetbal'), 
    'Op het einde van de uitvoer raakt de kat de voetbal niet');

  // De afstand van de kat naar de bal verkleint over tijd
  const distances = e.log.getDistancesToSprite('Kat', 'Voetbal');
  let oldDistance = distances[0];
  let test = true;
  for (const distance of distances) {
    if (distance > oldDistance) {
      test = false;
    }
    oldDistance = distance;
  }
  e.output.addCase('Afstand van kat tot voetbal wordt kleiner', test, 'De afstand van de kat naar de voetbal verkleint niet over de tijd');
}
