/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 7000;

  e.eventScheduling
    .wait(500)
    .test('De Heks beweegt niet voor de klik', 'De heks bewoog nog voor er op geklikt werd', (log) => {
      // De heks mag nog maar op 1 locatie geweest zijn
      return log.getSpriteLocations('Heks') <= 1;
    })
    .clickSprite({ spriteName: 'Heks', sync: false }) // De eerste klik laat heks starten met bewegen.
    .range(0, 4000, 50, (index, anchor) => { // Manueel elke 50 ms, 4000 ms lang, de sprites loggen.
      return anchor
        .wait(50)
        .log();
    })
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const places = e.log.getSpriteLocations('Heks');

  // Test of de heks minstens 1-malig verplaatst is na een klik
  e.output.addCase('De heks heeft bewogen', places.length > 1, 'Na een klik moet de heks van positie veranderen');

  // Test of de heks meermalig verplaatst is van positie
  e.output.addCase('De heks heeft bewogen', places.length > 2, 'Na een klik moet de heks van positie veranderen en elke seconde opnieuw veranderen van positie');

  /** @type {number} */
  const clickTime = e.log.events.filter({ type: 'click' })[0].time;

  // Na clickTime moet de positie van de heks veranderd zijn en daarna constant blijven voor een seconde
  const frames1 = searchFrames(e.log.frames, { after: clickTime + 200, before: clickTime + 800 });
  const frames2 = searchFrames(e.log.frames, { after: clickTime + 1200, before: clickTime + 1800 });
  const frames3 = searchFrames(e.log.frames, { after: clickTime + 2200, before: clickTime + 2800 });
  const heks1 = frames1[0].getSprite('Heks');
  const heks2 = frames2[0].getSprite('Heks');
  const heks3 = frames3[0].getSprite('Heks');

  // Controleer of de heks elke seconde een andere positie heeft
  e.output.addCase('na 1 seconde', (heks1.x !== heks2.x || heks1.y !== heks2.y), 'De heks is na 1 seconde nog niet veranderd van positie');
  e.output.addCase('na 2 secondes', (heks2.x !== heks3.x || heks2.y !== heks3.y), 'De heks is na nog 1 seconde nog niet veranderd van positie');

  // Controleer of de heks niet van positie verandert in voor een seconde:
  const place1 = e.log.getSpriteLocations('Heks', frames1);
  const place2 = e.log.getSpriteLocations('Heks', frames2);
  const place3 = e.log.getSpriteLocations('Heks', frames3);

  e.output.addCase('tijdens een seconde', place1.length === 1, 'De heks mag maar eenmalig veranderen van positie elke seconde');
  e.output.addCase('tijdens een seconde', place2.length === 1, 'De heks mag maar eenmalig veranderen van positie elke seconde');
  e.output.addCase('tijdens een seconde', place3.length === 1, 'De heks mag maar eenmalig veranderen van positie elke seconde');
}
