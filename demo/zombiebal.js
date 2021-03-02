/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */

function beforeExecution(template, submission, output) {
  output.startTestTab('Basiscontroles');
  output.addTest('Niet geprutst met andere sprites',
    false,
    template.hasAddedSprites(submission) || template.hasRemovedSprites(submission),
    'Er is iets veranderd aan de ingebouwde sprites, waar je niets moet aan veranderen.'
  );
  output.closeTestTab();
  
  output.startTestTab("Controle op blokjes");
  output.addTest(
    'Oneindige lus gebruikt bij Rob',
    true,
    submission.sprite('Rob').hasBlock('control_forever')
  );
  output.addTest(
    'Oneindige lus gebruikt bij Roy',
    true,
    submission.sprite('Roy').hasBlock('control_forever')
  );
  
  // Check the ton.
  const ton = submission.sprite('Ton');
  const callIndex = ton.blocks.findIndex(block => { 
    return block.opcode === 'procedures_call' && block.calledProcedureName === 'Richt naar Roy of Rob'; 
  });
  const loopIndex = ton.blocks.findIndex(block =>{
    return block.opcode === 'control_repeat_until'
  });
  output.addTest(
    'Ton richt naar spelers',
    true,
    callIndex < loopIndex,
    'De ton moet eerst naar Roy of Rob gericht worden.'
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
      e.output.startTestTab(`Testen voor ${name}`);
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
      e.output.addOneTest(
        180,
        sprite.direction,
        `${name} moet omlaag gericht zijn.`
      )
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
        0,
        sprite.direction,
        `${name} moet omhoog gericht zijn.`
      )
      e.output.addOneTest(
        originalPosition.x,
        sprite.x,
        `${name} mag niet horizontaal bewegen.`
      );
      e.output.closeTestCase();
      e.output.closeTestTab();
    });
}

let loser;
let winner;

/**
 * @param {Evaluation} e
 * @param {ScheduledEvent} events
 */
function testTon(events, e) {
  let touchedSprite;
  let secondSprite;
  let limit;
  let limitSecond;
  
  // Wait until the ton is at the right position, and then
  // move the sprite to that position.
  events.wait(sprite('Ton').toReach((x, _y) => x > 60 || x < -60))
    .log(() => {
      const ton = e.vm.runtime.getSpriteTargetByName('Ton');
      let sprite;
      if (ton.x < 0) {
        sprite = e.vm.runtime.getSpriteTargetByName('Roy');
        touchedSprite = 'Roy';
        secondSprite = 'Rob';
        limit = (x, _y) => x > 60;
        limitSecond = (x, _y) => x < -60;
      } else {
        sprite = e.vm.runtime.getSpriteTargetByName('Rob');
        touchedSprite = 'Rob';
        secondSprite = 'Roy';
        limit = (x, _y) => x < -60;
        limitSecond = (x, _y) => x > 60;
      }
      if (!sprite) {
        throw new Error(`Could not find target Ton`);
      }
      sprite.setXY(sprite.x, ton.y);
    })
    // TODO: this should also be a test somehow.
    .wait(sprite('Ton').toTouch(() => touchedSprite))
    .log(() => {
      e.output.startTestTab("Testen voor ton")
      e.output.addTest(`Ton raakt ${touchedSprite}`, true, true);
    })
    .wait(sprite('Ton').toReach((x, y) => limit(x, y)))
    .log(() => {
      const ton = e.vm.runtime.getSpriteTargetByName('Ton');
      const sprite = e.vm.runtime.getSpriteTargetByName(secondSprite);
      sprite.setXY(sprite.x, ton.y);
    })
    .wait(sprite('Ton').toTouch(() => secondSprite))
    .log(() => {
      e.output.addTest(`Ton raakt ${secondSprite}`, true, true);
    })
    .forEach(_.range(4), (ev) => {
      // Wait until we get to the next one.
      return ev.wait(sprite('Ton').toReach((x, y) => limitSecond(x, y)))
        .log(() => {
          const ton = e.vm.runtime.getSpriteTargetByName('Ton');
          const sprite = e.vm.runtime.getSpriteTargetByName(touchedSprite);
          sprite.setXY(sprite.x, ton.y);
        })
        .wait(sprite('Ton').toTouch(() => touchedSprite))
        .log(() => {
          e.output.addTest(`Ton raakt ${touchedSprite}`, true, true);
          [secondSprite, touchedSprite] = [touchedSprite, secondSprite];
          [limitSecond, limit] = [limit, limitSecond];
        })
    })
    .wait(sprite('Ton').toReach((x, y) => limitSecond(x, y)))
    .log(() => {
      // Move the sprite away from the ton to make the game stop.
      const ton = e.vm.runtime.getSpriteTargetByName('Ton');
      const sprite = e.vm.runtime.getSpriteTargetByName(touchedSprite);
      let newY;
      if (ton.y > 70) {
        newY = ton.y - 150;
      } else {
        newY = ton.y + 150;
      }
      sprite.setXY(sprite.x, newY);
      loser = touchedSprite;
      winner = secondSprite;
      e.output.closeTestTab();
    })
    .wait(sprite('Ton').toTouch(() => `${loser}'s Doel`))
    .wait(2000)
    .end();
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 300000;
  e.acceleration = 1;
  // e.eventAcceleration = 1;

  const originalEvents = e.scheduler
    .greenFlag(false)
    .wait(5000); // Wait on start of the game.

  // We cannot do these concurrently, since the key presses will be mixed then.
  const events = testSprite(originalEvents, { name: 'Roy', up: 'q', down: 'w' }, e);
  testSprite(events, { name: 'Rob', up: 'j', down: 'n' }, e);

  testTon(originalEvents, e);
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const sayEvents = e.log.events.filter({ type: 'say' });
  const data = _.last(sayEvents).data;
  e.output.addTest(
    `De ton zegt ${winner} scoort!`,
    `${winner} scoort!`,
    data.text,
    "De ton kondigt de score aan."
  )
}