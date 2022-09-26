/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 2000;

  e.scheduler.greenFlag().end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Er moet minimum 1 driehoek getekend worden
  e.group
    .test('')
    .feedback({
      correct: 'Er werd minstens 1 driehoek getekend.',
      wrong: 'Er minder dan 1 driehoek getekend',
    })
    .acceptIf(Itch.findTriangles(e.log.renderer.lines).length >= 1);

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
}
