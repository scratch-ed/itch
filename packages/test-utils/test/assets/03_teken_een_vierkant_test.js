/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.enableAdvancedProfiler();
  e.scheduler.greenFlag().end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const vierkanten = Itch.findSquares(e.log.renderer.lines);
  // Er moet exact 1 vierkant getekend worden
  e.group
    .test('Aantal vierkanten')
    .feedback({
      correct: 'Er is één vierkant getekend',
      wrong: 'Er werd niet exact 1 vierkant getekend',
    })
    .expect(vierkanten.length)
    .toBe(1);

  // Elke zijde van het vierkant heeft lengte 200
  e.group
    .test('Zijdes hebben lengte 200')
    .feedback({
      correct: 'De zijdes hebben lengte 200',
      wrong: 'De zijdes van het vierkant hebben niet lengte 200',
    })
    .expect(vierkanten[0].length)
    .toBe(200);

  // Er werd gebruik gemaakt van de pen
  e.group
    .test('De pen werd gebruikt')
    .feedback({
      wrong: 'Het blok pen_down werd niet gebruikt in de code',
      correct: 'De pen wordt gebruikt',
    })
    .acceptIf(
      e.log.events.some(
        (e) => e.type === 'block_execution' && e.data.node().opcode === 'pen_penDown',
      ),
    );

  const loopBlocks = ['control_repeat', 'control_forever'];
  const containsLoop = e.log.events.some(
    (e) => e.type === 'block_execution' && loopBlocks.includes(e.data.node().opcode),
  );

  if (!containsLoop) {
    e.groupedOutput.appendMessage(
      'Je kan je oplossing verbeteren door gebruik te maken van het "herhaal-blok"',
    );
  }
}
