/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function duringExecution() {
  scratch.eventScheduling
    .greenFlag()
    .end();

  scratch.start();
}

function afterExecution() {
  const squares = log.getSquares();

  addCase('Squares were detected', squares.length >= 1, 'No squares were detected on the stage.');

  if (squares.length === 0) {
    addError('No squares were detected on the stage. Further tests are not evaluated!');
    return;
  }

  for (const square of squares) {
    addTest('Sides have length 200', 200, square.length, 'The detected square does not have sides with length 200.');
  }

  addCase('the Pen extension is used', log.blocks.containsBlock('pen_penDown'), 'The Pen extension was not used in this exercise.');

  if (!log.blocks.containsLoop()) {
    addMessage('You could improve your solution by using a "repeat"-block.');
  }
}
