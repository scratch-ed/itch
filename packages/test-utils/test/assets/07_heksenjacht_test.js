/* Copyright (C) 2019 Ghent University - All Rights Reserved */

const acceleration = 5;

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 7000;
  e.acceleration = acceleration;

  e.scheduler
    .wait(500)
    .log(() => {
      const positions = new Set();
      for (const snapshot of e.log.snapshots) {
        const sprite = snapshot.sprite('Heks');
        positions.add({ x: sprite.x, y: sprite.y });
      }
      e.group
        .test()
        .feedback({
          correct: 'De Heks beweegt niet voor de klik',
          wrong: 'De heks bewoog nog voor er op geklikt werd',
        })
        .expect(positions.size)
        .toBe(1);
    })
    // De eerste klik laat heks starten met bewegen.
    .clickSprite('Heks', false)
    // Manueel elke 50 ms, 4000 ms lang, de sprites loggen.
    .forEach(_.range(0, 4000, 50), (event) =>
      event.wait(50).log(() => {
        console.log('Saving sprite... at ' + e.log.timestamp());
      }),
    )
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const positions = new Set();
  for (const snapshot of e.log.snapshots) {
    const sprite = snapshot.sprite('Heks');
    positions.add({ x: sprite.x, y: sprite.y });
  }

  e.group
    .test()
    .feedback({
      correct: 'De heks heeft bewogen',
      wrong:
        'Na een klik moet de heks van positie veranderen en elke seconde opnieuw veranderen van positie',
    })
    .acceptIf(positions.size > 2);

  const clickTime = e.log.events.find((e) => e.type === 'click').timestamp;

  // Na clickTime moet de positie van de heks veranderd zijn en daarna constant blijven voor een seconde
  const frames1 = e.log.snapshots.filter(
    (s) =>
      clickTime + 200 / acceleration < s.timestamp &&
      s.timestamp < clickTime + 800 / acceleration,
  );
  const frames2 = e.log.snapshots.filter(
    (s) =>
      clickTime + 1200 / acceleration < s.timestamp &&
      s.timestamp < clickTime + 1800 / acceleration,
  );
  const frames3 = e.log.snapshots.filter(
    (s) =>
      clickTime + 2200 / acceleration < s.timestamp &&
      s.timestamp < clickTime + 2800 / acceleration,
  );
  const heks1 = frames1[0].sprite('Heks');
  const heks2 = frames2[0].sprite('Heks');
  const heks3 = frames3[0].sprite('Heks');

  // Controleer of de heks elke seconde een andere positie heeft
  e.group
    .test('na 1 seconde')
    .feedback({
      wrong: 'De heks is na 1 seconde nog niet veranderd van positie',
    })
    .acceptIf(heks1.x !== heks2.x || heks1.y !== heks2.y);

  e.group
    .test('na 2 seconden')
    .feedback({
      wrong: 'De heks is na nog 1 seconde nog niet veranderd van positie',
    })
    .acceptIf(heks2.x !== heks3.x || heks2.y !== heks3.y);

  // Controleer of de heks niet van positie verandert in voor een seconde:
  const place1 = new Set(frames1.map((s) => s.sprite('Heks').position));
  const place2 = new Set(frames2.map((s) => s.sprite('Heks').position));
  const place3 = new Set(frames3.map((s) => s.sprite('Heks').position));

  e.group
    .test('tijdens een seconde')
    .feedback({
      wrong: 'De heks mag maar eenmalig veranderen van positie elke seconde',
    })
    .expect(place1.size)
    .toBe(1);
  e.group
    .test('tijdens een seconde')
    .feedback({
      wrong: 'De heks mag maar eenmalig veranderen van positie elke seconde',
    })
    .expect(place2.size)
    .toBe(1);
  e.group
    .test('tijdens een seconde')
    .feedback({
      wrong: 'De heks mag maar eenmalig veranderen van positie elke seconde',
    })
    .expect(place3.size)
    .toBe(1);
}
