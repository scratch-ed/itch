/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/**
 * @param {Project} template
 * @param {Project} submission
 * @param {ResultManager} output
 */
function beforeExecution(template, submission, output) {
  // Controleer of het ingediende project van de leerling een sprite heeft met als naam 'Heks'
  if (!submission.containsSprite('Heks')) {
    output.addError('De sprite met als naam Heks werd niet teruggevonden in het project');
  }
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 7000; // Indien een actie langer dan 7 seconden duurt, geef een timeout error.

  const heksPositie = {}; // We slaan de positie van de heks op om op te testen tijdens de uitvoering

  e.eventScheduling
    .log((log) => {
      heksPositie.x = log.sprites.getSprite('Heks').x; // De eerste positie van de heks wordt opgeslagen.
      heksPositie.y = log.sprites.getSprite('Heks').y;
    })
    .wait(500)
    .test('De Heks beweegt niet voor de klik', 'De heks bewoog nog voor er op geklikt werd', (log) => {
      const minX = log.getMinX('Heks');
      const maxX = log.getMaxX('Heks');
      const minY = log.getMinY('Heks');
      const maxY = log.getMaxY('Heks');
      return minX === maxX && minY === maxY;
    })
    .clickSprite({ spriteName: 'Heks', sync: false }) // De eerste klik laat heks starten met bewegen.
    .wait(100)
    .test('De heks is veranderd van positie', 'De heks is niet van positie veranderd na de klik', (log) => {
      const heks = log.sprites.getSprite('Heks');
      const heeftBewogen = heks.x !== heksPositie.x || heks.y !== heksPositie.y;
      heksPositie.x = heks.x;
      heksPositie.y = heks.y;
      return heeftBewogen;
    })
    .wait(1000) // wacht een seconde voor de volgende positie
    .test('De heks is veranderd van positie', 'De heks is niet van positie veranderd na een seconde na de klik', (log) => {
      const heks = log.sprites.getSprite('Heks');
      const heeftBewogen = heks.x !== heksPositie.x || heks.y !== heksPositie.y;
      heksPositie.x = heks.x;
      heksPositie.y = heks.y;
      return heeftBewogen;
    })
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Gebruik best een lus om elke seconde de heks te verplaatsen
  e.output.addCase('Gebruik van een lus',
    e.log.blocks.containsBlock('control_forever'),
    'Er werd geen herhalingslus gebruikt');

  // De code in de lus wordt minstens 2 keer herhaald
  e.output.addCase('Correcte gebruik van de lus',
    e.log.blocks.numberOfExecutions('control_forever') >= 2,
    'De code in de lus werd minder dan 2 keer herhaald');
}
