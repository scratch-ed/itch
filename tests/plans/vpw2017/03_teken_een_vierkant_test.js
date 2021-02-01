/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.scheduler
    .greenFlag()
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const vierkanten = e.log.getSquares();
  // Er moet exact 1 vierkant getekend worden
  e.output.addTest('Aantal vierkanten', 1, vierkanten.length, 'Er werd niet exact 1 vierkant getekend');

  if (vierkanten.length === 0) {
    e.output.addError('Er werden geen vierkanten gedetecteerd op het speelveld!');
  }

  // Elke zijde van het vierkant heeft lengte 200
  const correct = numericEquals(200, vierkanten[0].length);
  e.output.addCase('Zijdes hebben lengte 200', correct, 'De zijdes van het vierkant hebben niet lengte 200');

  // Er werd gebruik gemaakt van de pen
  e.output.addCase('De pen werd gebruikt', e.log.blocks.containsBlock('pen_penDown'), 'Het blok pen_down werd niet gebruikt in de code');

  if (!e.log.blocks.containsLoop()) {
    e.output.addMessage('Je kan je oplossing verbeteren door gebruik te maken van het "herhaal-blok"');
  }
}
