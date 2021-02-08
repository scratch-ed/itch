/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  output.addTest('Niet geprutst met ingebouwde sprites',
    false,
    template.hasAddedSprites(submission) || template.hasRemovedSprites(submission),
    'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
  );
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 95000;
  
  // For now, manually do each level.
  // e.eventScheduling
  //   .greenFlag({sync: true}) // Wait until the intro is done.
  //   .wait(1000) // TODO: not needed?
  //   .pressKeySecond({key: ' ', sync: true}) // Load first level
  //   .wait(100) // Wait for now, since keySecond is not sync yet...
  //   .log(log => {
  //     console.log("AFTER PRESS...")
  //   })
  //   .pressKeySecond({key: 's', sync: true}) // This keeps pressing the button apparently.
  //   .wait(90000)
  //   .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const value = e.log.getVariableValue("Level");
  e.output.addTest("Laatste level is bereikt", 7, value, "Laatste level is niet bereikt")
}