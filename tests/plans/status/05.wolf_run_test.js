// Currently no tests, as the way the keys are implemented makes it hard
// to test currently.
// Additionally, take a look at what should exactly be tested here.

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 95000;

  // For now, manually do each level.
  e.scheduler
    .greenFlag(false) // Async, since it only ends when the thing is done.
    .waitForBroadcast('start')
    .useKey('o', 50)
    .useKey('a', 50)
    .forEach(_.range(1, 50), e => {
      return e.useKey('o', 10)
    })
    .end();
}