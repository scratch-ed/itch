/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.answers = ['Louise'];

  e.scheduler.greenFlag().end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Controleer de tekst van de drie tekstballonnen
  e.test('Devin stelt zich voor', (l) => {
    l.expect(e.log.renderer.responses[0]).toBe('Hallo, ik ben Devin.');
  });
  e.test('Devin vraagt je naam', (l) => {
    l.expect(e.log.renderer.responses[1]).toBe('Wat is jouw naam?');
  });
  e.test('Devin zegt hallo', (l) => {
    l.expect(e.log.renderer.responses[2]).toBe(`Hallo, ${e.answers[0]}`);
  });

  // Controleer of de eerste tekstballon 2 seconden wordt weergegeven
  e.test('Devin stelt zich minstens 2 seconden lang voor', (l) => {
    l.expect(e.log.getSkinDuration('Hallo, ik ben Devin.') >= 2000)
      .withError('De eerste tekstballon moet minimum 2 seconden getoond worden.')
      .toBe(true);
  });
}
