/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.scheduler.pressKey(' ').end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // De kat raakt de voetbal in de laatste frame
  // e.test('De kat raakt de voetbal', (l) => {
  //   l.expect(e.log.sprites.areTouching('Kat', 'Voetbal'))
  //     .withError('Op het einde van de uitvoer raakt de kat de voetbal niet')
  //     .toBe(true);
  // });

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
  e.test('Afstand van kat tot voetbal wordt kleiner', (l) => {
    l.expect(test)
      .withError('De afstand van de kat naar de voetbal verkleint niet over de tijd')
      .toBe(true);
  });
}
