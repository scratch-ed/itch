/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  // Check that all grid squares have not been changed.
  const squares = Array.from(Array(36).keys()).map(i => `Vakje${i}`);

  output.startTestCase("Niet geprutst aan vakjes")
  for (const square of squares) {
    output.startTest(false);
    let status;
    const gen = template.hasChangedSprite(submission, square, (a, b) => a !== b);
    if (gen) {
      output.addMessage('Er is iets veranderd aan de ingebouwde sprites, waar je niets mag aan veranderen.');
      status = {enum: "wrong", human: "Verkeerd"}
    } else {
      status = {enum: "correct", human: "Juist"}
    }
    output.closeTest(gen, status);
  }

  output.addTest('Niet geprutst met andere sprites',
    false,
    template.hasAddedSprites(submission) || template.hasRemovedSprites(submission),
    'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
  );
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 30000;
  e.eventScheduling
    .greenFlag({sync: false})
    .wait(1000)
    .test('Het ruimteschip staat klaar', 'Het ruimteschip mag niet bewegen voor er op 1 gedrukt wordt.',
      (log) => {
      console.log("Doing test!");
      return !log.hasSpriteMoved('Ruimteschip'); 
    })
    .pressKey({ key: '1'})
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  
  const sprites = e.log.sprites;
  
  // TODO: what is the actual problem statement here, ie. what should be tested?
  // Check that the crates are on the correct positions.
  
  // Sprites that need 'kogels'
  console.log(sprites);
  const kogelSprites = ['Vakje8', 'Vakje9', 'Vakje10', 'Vakje11'].map(n => sprites.getSprite(n));
  for (const kogelSprite of kogelSprites) {
    e.output.addTest(`${kogelSprite.name} bevat kogels`,
      'kogels', kogelSprite.costume,
      `${kogelSprite.name} moet kogels bevatten`
      )
  }
  
  const fuelTiles = ['Vakje20', 'Vakje21', 'Vakje22', 'Vakje23'].map(n => sprites.getSprite(n));
  for (const fuelTile of fuelTiles) {
    e.output.addTest(`${fuelTile.name} bevat brandstof`,
      'brandstof', fuelTile.costume,
      `${fuelTile.name} moet brandstof bevatten`
      )
  }
  
  e.output.closeTestContext();
}