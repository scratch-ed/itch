/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */

function beforeExecution(template, submission, output) {
  output.startTestTab("Basiscontroles");
  output.addTest('Niet geprutst met andere sprites',
    false,
    template.hasAddedSprites(submission) || template.hasRemovedSprites(submission),
    'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
  );
  output.closeTestTab();
}

/**
 * @param {Object} data 
 * @param {Evaluation} e
 * @param {ScheduledEvent} events
 */
function testSprite(events, data, e) {
  const { name, up, down } = data;
  let originalPosition;
  let latestPosition;
  // First do the checks on the Roy sprite.
  return events
    .log(() => {
      e.output.startTestTab(`Testen voor ${name}`)
      const sprite = e.log.current.getSprite(name);
      originalPosition = {
        x: sprite.x,
        y: sprite.y
      };
      latestPosition = originalPosition;
    })
    .useKey(down)
    .log(() => {
      const sprite = e.log.current.getSprite(name);
      // We can't know how many steps will be set.
      e.output.startTestCase(`${name} beweegt omlaag`);
      console.log("Found", sprite);
      console.log("Expected", originalPosition);
      e.output.addOneTest(
        true,
        sprite.y < originalPosition.y,
        `Als op ${down} gedrukt wordt, moet ${name} 10 stappen omlaag zetten.`
      );
      e.output.addOneTest(
        originalPosition.x,
        sprite.x,
        `${name} mag niet horizontaal bewegen.`
      );
      e.output.closeTestCase();
      latestPosition = {
        x: sprite.x,
        y: sprite.y
      };
    })
    .useKey(up)
    .log(() => {
      const sprite = e.log.current.getSprite(name);
      // We can't know how many steps will be set.
      e.output.startTestCase(`${name} beweegt omhoog`);
      e.output.addOneTest(
        true,
        sprite.y > latestPosition.y,
        `Als op ${up} gedrukt wordt, moet ${name} 10 stappen omhoog zetten.`
      );
      e.output.addOneTest(
        originalPosition.y,
        sprite.y,
        `${name} moet even snel omhoog als naar beneden gaan.`
      );
      e.output.addOneTest(
        originalPosition.x,
        sprite.x,
        `${name} mag niet horizontaal bewegen.`
      );
      e.output.closeTestCase();
      e.output.closeTestTab();
    });
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 30000;
  // e.acceleration = 10;
  // e.eventAcceleration = 1;
  
  let events = e.scheduler
    .greenFlag(false)
    .wait(5000); // Wait on start of the game.
  
  // We cannot do these concurrently, since the key presses will be mixed then.
  events = testSprite(events,{ name: 'Roy', up: 'q', down: 'w' }, e);
  events = testSprite(events, { name: 'Rob', up: 'j', down: 'n' }, e);
  
  
  events.end();
}