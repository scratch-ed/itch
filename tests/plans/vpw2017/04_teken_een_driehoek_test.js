/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 2000;

  e.scheduler
    .greenFlag()
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Er moet minimum 1 driehoek getekend worden
  e.test('Aantal driehoeken', l => {
    l.expect(e.log.getTriangles().length >= 1)
      .withError('Er minder dan 1 driehoek getekend')
      .toBe(true);
  });

  // Er werd gebruik gemaakt van de pen
  e.test('De pen werd gebruikt', l => {
    l.expect(e.log.blocks.containsBlock('pen_penDown'))
      .withError('Het blok pen_down werd niet gebruikt in de code')
      .toBe(true);
  });
}
