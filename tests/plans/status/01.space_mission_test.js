/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  // Check that all grid squares have not been changed.
  const squares = Array.from(Array(36).keys()).map(i => `Vakje${i}`);

  output.describe('Controle op vakjes', l => {
    for (const square of squares) {
      const gen = template.hasChangedSprite(submission, square, (a, b) => {
        return !a.equals(b);
      });
      l.test(`${square} is niet veranderd`, l => {
        l.expect(gen).toBe(false);
      });
    }
  });

  output.describe('Andere vakjes', l => {
    l.test('Niet geprutst met andere sprites', l => {
      l.expect(template.hasAddedSprites(submission) || template.hasRemovedSprites(submission)).toBe(false);
    });
  });
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
      e.output.startContext("Startpositie ruimteschip");
      e.test('Het ruimteschip staat klaar', l => {
        l.expect(e.log.hasSpriteMoved('Ruimteschip'))
          .withError('Het ruimteschip mag niet bewegen voor er op 1 gedrukt wordt.')
          .toBe(false);
      });
    });
  // We now fork the schedule:
  // One track presses the key and waits for it to end,
  // While the other does tests.
  event.pressKey('1')
    .end();
  event.wait(sprite('Ruimteschip').toMove(1000))
    .log(() => {
      e.test('Ruimteschip bewoog', l => {
        l.accept();
      });
      e.output.closeContext();
    });
}

/** @param {Evaluation} e */
function afterExecution(e) {

  const sprites = e.log.sprites;

  // Check that the crates are on the correct positions.

  // Sprites that need 'kogels'
  e.describe('Controle op kogels', l => {
    const kogelSprites = ['Vakje8', 'Vakje9', 'Vakje10', 'Vakje11'].map(n => sprites.getSprite(n));
    for (const kogelSprite of kogelSprites) {
      l.test(`${kogelSprite.name} bevat kogels`, l => {
        l.expect(kogelSprite.costume)
          .withError(`${kogelSprite.name} moet kogels bevatten`)
          .toBe('kogels');
      });
    }
  });

  e.describe('Controle op brandstof', l => {
    const fuelTiles = ['Vakje20', 'Vakje21', 'Vakje22', 'Vakje23'].map(n => sprites.getSprite(n));
    for (const fuelTile of fuelTiles) {
      l.test(`${fuelTile.name} bevat brandstof`, l => {
        l.expect(fuelTile.costume)
          .withError(`${fuelTile.name} moet brandstof bevatten`)
          .toBe('brandstof');
      });
    }
  });

  e.describe('Kwaliteit van de code', l => {
    l.test('Je gebruikt een lus', l => {
      l.expect(e.log.blocks.containsLoop())
        .withError('Je code is niet verkeerd, maar je gebruikt meerdere malen hetzelfde blokje. Gebruik hiervoor een lus.')
        .toBe(true);
    });
  });
}