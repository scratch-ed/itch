/* Copyright (C) 2019 Ghent University - All Rights Reserved */

/** @param {Evaluation} e */
function duringExecution(e) {
  e.scheduler.pressKey(' ').end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // De kat raakt de voetbal in de laatste frame
  e.group
    .test('De kat raakt de voetbal')
    .feedback({
      wrong: 'Op het einde van de uitvoer raakt de kat de voetbal niet.',
      correct: 'Op het einde van de uitvoer raakt de kat de voetbal.',
    })
    .acceptIf(e.log.last.areTouching('Kat', 'Voetbal'));

  // De afstand van de kat naar de bal verkleint over tijd
  const distances = [];
  for (const frame of e.log.snapshots) {
    const sprite = frame.sprite('Kat');
    const target = frame.sprite('Voetbal');
    distances.push(Math.sqrt(Itch.distSq(sprite, target)));
  }
  let oldDistance = distances[0];
  let test = true;
  for (const distance of distances) {
    if (distance > oldDistance) {
      test = false;
    }
    oldDistance = distance;
  }
  e.group
    .test()
    .feedback({
      correct: 'Afstand van kat tot voetbal wordt kleiner',
      wrong: 'De afstand van de kat naar de voetbal verkleint niet over de tijd',
    })
    .acceptIf(test);
}
