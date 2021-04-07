/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.scheduler.greenFlag().end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const vierkanten = e.log.getSquares();
  // Er moet exact 1 vierkant getekend worden
  e.test('Aantal vierkanten', (l) => {
    l.expect(vierkanten.length)
      .withError('Er werd niet exact 1 vierkant getekend')
      .toBe(1);
  });

  // Elke zijde van het vierkant heeft lengte 200
  e.test('Zijdes hebben lengte 200', (l) => {
    l.expect(numericEquals(200, vierkanten[0].length))
      .withError('De zijdes van het vierkant hebben niet lengte 200')
      .toBe(true);
  });

  // Er werd gebruik gemaakt van de pen
  e.test('De pen werd gebruikt', (l) => {
    l.expect(e.log.blocks.containsBlock('pen_penDown'))
      .withError('Het blok pen_down werd niet gebruikt in de code')
      .toBe(true);
  });

  if (!e.log.blocks.containsLoop()) {
    e.output.appendMessage(
      'Je kan je oplossing verbeteren door gebruik te maken van het "herhaal-blok"',
    );
  }
}
