/**
 * Check that the original sprites were not changed.
 *
 * @param {Project} template
 * @param {Project} submission
 */
function beforeExecution(template, submission) {
  // Check that all grid squares have not been changed.
  const squares = Array(36).fill().map(i => `Vakje${i}`);

  for (const square of squares) {
    addTest(`Niet geprutst met ${square}`,
      false,
      template.hasChangedSprite(submission, square, (a, b) => a !== b),
      'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
    );
  }

  addTest('Niet geprutst met andere sprites',
    false,
    template.hasAddedSprites(submission) || template.hasRemovedSprites(submission),
    'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
  );
}

function duringExecution() {
  scratch.eventScheduling
    .greenFlag() // We don't need to test the start position, as this should be good.
    .wait(1000)
    .test('Het ruimteschip staat klaar', 'Het ruimteschip mag niet bewegen voor er op 1 gedrukt wordt.',
      (log) => { !log.hasSpriteMoved('Ruimteschip'); }
    )
    .pre;

}