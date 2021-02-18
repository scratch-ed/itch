/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */

function beforeExecution(template, submission, output) {
  // Check that all grid squares have not been changed.
  const squares = Array.from(Array(36).keys()).map(i => `Vakje${i}`);

  output.startTestTab("Controle op vakjes");
  for (const square of squares) {
    const gen = template.hasChangedSprite(submission, square, (a, b) => {
      return !a.equals(b); 
    });
    output.addTest(`${square} is niet veranderd`, 
      false, 
      gen, 
      'Er is iets veranderd aan de ingebouwde sprites, waar je niets mag aan veranderen.'
    )
  }
  output.closeTestTab();

  output.startTestTab("Andere vakjes");
  output.addTest('Niet geprutst met andere sprites',
    false,
    template.hasAddedSprites(submission) || template.hasRemovedSprites(submission),
    'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
  );
  output.closeTestTab();
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 30000;
  e.acceleration = 10;
  e.eventAcceleration = 1;
  const event = e.scheduler
    .greenFlag(false)
    .wait(1000)
    .log(() => {
      e.output.addTest(
        'Het ruimteschip staat klaar',
        false,
        e.log.hasSpriteMoved('Ruimteschip'),
        'Het ruimteschip mag niet bewegen voor er op 1 gedrukt wordt.'
      )
    });
  // We now fork the schedule:
  // One track presses the key and waits for it to end,
  // While the other does tests.
  event.pressKey('1')
    .end();
  event.wait(sprite('Ruimteschip').toMove(1000))
    .log(() => {
      // The spaceship must have moved, so add a correct test.
      e.output.addTest('Ruimteschip bewoog', true, true, 'Het ruimteschip heeft bewogen.')
    })
}

/** @param {Evaluation} e */
function afterExecution(e) {
  
  const sprites = e.log.sprites;
  
  // Check that the crates are on the correct positions.
  
  // Sprites that need 'kogels'
  e.output.startTestTab("Controle op kogels")
  const kogelSprites = ['Vakje8', 'Vakje9', 'Vakje10', 'Vakje11'].map(n => sprites.getSprite(n));
  for (const kogelSprite of kogelSprites) {
    e.output.addTest(`${kogelSprite.name} bevat kogels`,
      'kogels', kogelSprite.costume,
      `${kogelSprite.name} moet kogels bevatten`
      )
  }
  e.output.closeTestTab();
  
  e.output.startTestTab("Controle op brandstof")
  const fuelTiles = ['Vakje20', 'Vakje21', 'Vakje22', 'Vakje23'].map(n => sprites.getSprite(n));
  for (const fuelTile of fuelTiles) {
    e.output.addTest(`${fuelTile.name} bevat brandstof`,
      'brandstof', fuelTile.costume,
      `${fuelTile.name} moet brandstof bevatten`
      )
  }
  e.output.closeTestTab();
  
  // Check the "code quality"
  e.output.startTestTab("Kwaliteit van de code");
  e.output.addTest(
    "Je gebruikt een lus",
    true,
    e.log.blocks.containsLoop(),
    "Je code is niet verkeerd, maar je gebruikt meerdere malen hetzelfde blokje. Gebruik hiervoor een lus."
    )
  e.output.closeTestTab();
}