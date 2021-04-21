/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.scheduler.greenFlag().end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const squares = e.log.getSquares();

  e.test('Squares were detected', (l) => {
    l.expect(squares.length >= 1)
      .withError('No squares were detected on the stage.')
      .toBe(true);
  });

  if (squares.length === 0) {
    e.output.escalateStatus({ human: 'Verkeerd', enum: 'wrong' });
    e.output.closeJudgement(false);
    return;
  }

  for (const square of squares) {
    e.test('Sides have length 200', (l) => {
      l.expect(square.length)
        .withError('The detected square does not have sides with length 200.')
        .toBe(200);
    });
  }

  e.test('The Pen extension is used', (l) => {
    l.expect(e.log.blocks.containsBlock('pen_penDown'))
      .withError('The Pen extension was not used in this exercise.')
      .toBe(true);
  });

  if (!e.log.blocks.containsLoop()) {
    e.output.appendMessage(
      'You could improve your solution by using a "repeat"-block.',
    );
  }
}
