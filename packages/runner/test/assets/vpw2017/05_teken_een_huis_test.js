/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 2000;

  e.scheduler.greenFlag().end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Er werkt gebruik gemaakt van de pen
  // Er werd gebruik gemaakt van de pen
  e.test('De pen werd gebruikt', (l) => {
    l.expect(e.log.blocks.containsBlock('pen_penDown'))
      .withError('Het blok pen_down werd niet gebruikt in de code')
      .toBe(true);
  });
}
