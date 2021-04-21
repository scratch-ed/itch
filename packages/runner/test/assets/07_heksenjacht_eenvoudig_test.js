/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/**
 * @param {Project} template
 * @param {Project} submission
 * @param {Evaluation} e
 */
function beforeExecution(template, submission, e) {
  // Controleer of het ingediende project van de leerling een sprite heeft met als naam 'Heks'
  e.test('Heks bestaat', (l) => {
    l.expect(submission.containsSprite('Heks'))
      .withError(
        'De sprite met als naam Heks werd niet teruggevonden in het project',
      )
      .toBe(true);
  });
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 7000; // Indien een actie langer dan 7 seconden duurt, geef een timeout error.

  const heksPositie = {}; // We slaan de positie van de heks op om op te testen tijdens de uitvoering

  e.scheduler
    .log(() => {
      heksPositie.x = e.log.sprites.getSprite('Heks').x; // De eerste positie van de heks wordt opgeslagen.
      heksPositie.y = e.log.sprites.getSprite('Heks').y;
    })
    .wait(500)
    .log(() => {
      e.test('De Heks beweegt niet voor de klik', (l) => {
        l.expect(e.log.hasSpriteMoved('Heks'))
          .withError('De heks bewoog nog voor er op geklikt werd')
          .toBe(false);
      });
    })
    .clickSprite('Heks', false) // De eerste klik laat heks starten met bewegen.
    .wait(100)
    .log(() => {
      const heks = e.log.sprites.getSprite('Heks');
      const heeftBewogen = heks.x !== heksPositie.x || heks.y !== heksPositie.y;
      heksPositie.x = heks.x;
      heksPositie.y = heks.y;
      e.test('De heks is veranderd van positie', (l) => {
        l.expect(heeftBewogen)
          .withError('De heks is niet van positie veranderd na de klik')
          .toBe(true);
      });
    })
    .wait(1000) // wacht een seconde voor de volgende positie
    .log(() => {
      const heks = e.log.sprites.getSprite('Heks');
      const heeftBewogen = heks.x !== heksPositie.x || heks.y !== heksPositie.y;
      heksPositie.x = heks.x;
      heksPositie.y = heks.y;
      e.test('De heks is veranderd van positie', (l) => {
        l.expect(heeftBewogen)
          .withError('De heks is niet van positie veranderd na de klik')
          .toBe(true);
      });
    })
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Gebruik best een lus om elke seconde de heks te verplaatsen
  e.describe('Blokjes', (l) => {
    l.test('Gebruik van een lus', (l) => {
      // Gebruik best een lus de papegaai te bewegen en van kostuum te veranderen.
      l.expect(e.log.blocks.containsLoop())
        .withError('Er werd geen herhalingslus gebruikt')
        .toBe(true);
    });
    // De code in de lus wordt minstens 2 keer herhaald
    l.test('Correcte gebruik van de lus', (l) => {
      l.expect(e.log.blocks.numberOfExecutions('control_forever') >= 2)
        .withError('De code in de lus werd minder dan 2 keer herhaald')
        .toBe(true);
    });
  });
}
