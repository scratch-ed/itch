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
  e.output.addCase('Aantal driehoeken',
    e.log.getTriangles().length <= 1,
    'Er minder dan 1 driehoek getekend');

  // Er werd gebruik gemaakt van de pen
  e.output.addCase('De pen werd gebruikt',
    e.log.blocks.containsBlock('pen_penDown'),
    'Het blok pen_down werd niet gebruikt in de code');
}
