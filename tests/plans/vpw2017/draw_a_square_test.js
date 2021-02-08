/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.scheduler
    .greenFlag()
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const squares = e.log.getSquares();

  e.output.addCase('Squares were detected', squares.length >= 1, 'No squares were detected on the stage.');

  if (squares.length === 0) {
    e.output.addError('No squares were detected on the stage. Further tests are not evaluated!');
    return;
  }

  for (const square of squares) {
    e.output.addTest('Sides have length 200', 200, square.length, 'The detected square does not have sides with length 200.');
  }

  e.output.addCase('the Pen extension is used', e.log.blocks.containsBlock('pen_penDown'), 'The Pen extension was not used in this exercise.');

  if (!e.log.blocks.containsLoop()) {
    e.output.addMessage('You could improve your solution by using a "repeat"-block.');
  }
}
