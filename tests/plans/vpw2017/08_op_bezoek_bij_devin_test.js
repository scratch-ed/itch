/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.answers = ['Louise'];

  e.scheduler
    .greenFlag()
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Controleer de tekst van de drie tekstballonnen
  e.output.addTest('Devin stelt zich voor', 'Hallo, ik ben Devin.', e.log.renderer.responses[0], 'Er wordt foute tekst weergegeven in de tekstballon');
  e.output.addTest('Devin vraagt je naam', 'Wat is jouw naam?', e.log.renderer.responses[1], 'Er wordt foute tekst weergegeven in de tekstballon');
  e.output.addTest('Devin zegt hallo', `Hallo, ${e.answers[0]}`, e.log.renderer.responses[2], 'Er wordt foute tekst weergegeven in de tekstballon');

  // Controleer of de eerste tekstballon 2 seconden wordt weergegeven
  e.output.addCase('Devin stelt zich minstens 2 seconden lang voor', e.log.getSkinDuration('Hallo, ik ben Devin.') >= 2000, 'De eerste tekstballon moet minimum 2 seconden getoond worden.');
}
