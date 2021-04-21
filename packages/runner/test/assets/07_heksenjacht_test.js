/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 7000;

  e.scheduler
    .wait(500)
    .log(() => {
      e.test('De Heks beweegt niet voor de klik', (l) => {
        l.expect(e.log.hasSpriteMoved('Heks'))
          .withError('De heks bewoog nog voor er op geklikt werd')
          .toBe(false);
      });
    })
    .clickSprite('Heks', false) // De eerste klik laat heks starten met bewegen.
    .forEach(_.range(0, 4000, 50), (event) => event.wait(50).log()) // Manueel elke 50 ms, 4000 ms lang, de sprites loggen.
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const places = e.log.getSpritePositions('Heks');

  e.test('De heks heeft bewogen', (l) => {
    l.expect(places.length > 2)
      .withError(
        'Na een klik moet de heks van positie veranderen en elke seconde opnieuw veranderen van positie',
      )
      .toBe(true);
  });

  /** @type {number} */
  const clickTime = e.log.events.filter({ type: 'click' })[0].time;

  // Na clickTime moet de positie van de heks veranderd zijn en daarna constant blijven voor een seconde
  const frames1 = searchFrames(e.log.frames, {
    after: clickTime + 200,
    before: clickTime + 800,
  });
  const frames2 = searchFrames(e.log.frames, {
    after: clickTime + 1200,
    before: clickTime + 1800,
  });
  const frames3 = searchFrames(e.log.frames, {
    after: clickTime + 2200,
    before: clickTime + 2800,
  });
  const heks1 = frames1[0].getSprite('Heks');
  const heks2 = frames2[0].getSprite('Heks');
  const heks3 = frames3[0].getSprite('Heks');

  // Controleer of de heks elke seconde een andere positie heeft
  e.test('na 1 seconde', (l) => {
    l.expect(heks1.x !== heks2.x || heks1.y !== heks2.y)
      .withError('De heks is na 1 seconde nog niet veranderd van positie')
      .toBe(true);
  });
  e.test('na 2 seconden', (l) => {
    l.expect(heks2.x !== heks3.x || heks2.y !== heks3.y)
      .withError('De heks is na nog 1 seconde nog niet veranderd van positie')
      .toBe(true);
  });

  // Controleer of de heks niet van positie verandert in voor een seconde:
  const place1 = e.log.getSpritePositions('Heks', frames1);
  const place2 = e.log.getSpritePositions('Heks', frames2);
  const place3 = e.log.getSpritePositions('Heks', frames3);

  e.test('tijdens een seconde', (l) => {
    l.expect(place1.length)
      .withError(
        'De heks mag maar eenmalig veranderen van positie elke seconde',
      )
      .toBe(1);
  });
  e.test('tijdens een seconde', (l) => {
    l.expect(place2.length)
      .withError(
        'De heks mag maar eenmalig veranderen van positie elke seconde',
      )
      .toBe(1);
  });
  e.test('tijdens een seconde', (l) => {
    l.expect(place3.length)
      .withError(
        'De heks mag maar eenmalig veranderen van positie elke seconde',
      )
      .toBe(1);
  });
}
