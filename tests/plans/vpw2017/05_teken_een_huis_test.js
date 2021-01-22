/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 2000;

  e.eventScheduling
    .greenFlag()
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Er werkt gebruik gemaakt van de pen
  e.output.addCase('De pen werkt gebruikt',
    e.log.blocks.containsBlock('pen_penDown'),
    'Het blok pen_Down werd niet gebruikt in de code'
  );
}
