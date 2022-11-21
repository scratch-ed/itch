/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/**
 * @param {Evaluation} e
 */
function beforeExecution(e) {
  // Controleer of het ingediende project van de leerling een sprite heeft met als naam 'Heks'
  e.group
    .test('Heks bestaat')
    .feedback({
      wrong: 'De sprite met als naam Heks werd niet teruggevonden in het project',
    })
    .acceptIf(e.log.submission.findSprite('Heks') !== undefined);
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 7000; // Indien een actie langer dan 7 seconden duurt, geef een timeout error.
  e.enableAdvancedProfiler();

  const heksPositie = {}; // We slaan de positie van de heks op om op te testen tijdens de uitvoering

  e.scheduler
    .log(() => {
      heksPositie.x = e.log.last.sprite('Heks').x; // De eerste positie van de heks wordt opgeslagen.
      heksPositie.y = e.log.last.sprite('Heks').y;
    })
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
    .clickSprite('Heks', false) // De eerste klik laat heks starten met bewegen.
    .wait(100)
    .log(() => {
      const heks = e.log.last.sprite('Heks');
      const heeftBewogen = heks.x !== heksPositie.x || heks.y !== heksPositie.y;
      heksPositie.x = heks.x;
      heksPositie.y = heks.y;
      e.group
        .test()
        .feedback({
          correct: 'De heks is veranderd van positie.',
          wrong: 'De heks is niet van positie veranderd na de klik',
        })
        .acceptIf(heeftBewogen);
    })
    .wait(1000) // wacht een seconde voor de volgende positie
    .log(() => {
      const heks = e.log.last.sprite('Heks');
      const heeftBewogen = heks.x !== heksPositie.x || heks.y !== heksPositie.y;
      heksPositie.x = heks.x;
      heksPositie.y = heks.y;
      e.group
        .test()
        .feedback({
          correct: 'De heks is veranderd van positie.',
          wrong: 'De heks is niet van positie veranderd na de klik',
        })
        .acceptIf(heeftBewogen);
    })
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Gebruik best een lus om elke seconde de heks te verplaatsen
  e.group.group('Blokjes', () => {
    const blocks = e.log.events
      .filter((e) => e.type === 'block_execution')
      .map((b) => b.data.block());

    e.group
      .test()
      .feedback({
        correct: 'Gebruik van een lus',
        wrong: 'Er werd geen herhalingslus gebruikt',
      })
      .acceptIf(
        blocks.some((b) => ['control_repeat', 'control_forever'].includes(b.opcode)),
      );

    const counted = blocks.filter((b) => b.opcode === 'control_forever');
    // De code in de lus wordt minstens 2 keer herhaald
    e.group
      .test()
      .feedback({
        correct: 'Correcte gebruik van de lus',
        wrong: 'De code in de lus werd minder dan 2 keer herhaald',
      })
      .acceptIf(counted.length >= 2);
  });
}
