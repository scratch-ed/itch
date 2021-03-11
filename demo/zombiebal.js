/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} e - The output manager.
 */

function beforeExecution(template, submission, e) {
  e.describe('Basiscontroles', l => {
    l.test('Niet geprutst met andere sprites', l => {
      l.expect(template.hasAddedSprites(submission)).toBe(false);
      l.expect(template.hasRemovedSprites(submission)).toBe(false);
    });
  });
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
      e.output.startTestContext(`Testen voor ${name}`);
      const sprite = e.log.current.getSprite(name);
      originalPosition = {
        x: sprite.x,
        y: sprite.y
      };
      latestPosition = originalPosition;
      e.test(`Oneindige lus gebruikt bij ${name}`, l => {
        l.expect(sprite.hasBlock('control_forever'))
          .withError(`Bij ${name} moet je het blokje 'oneindige lus' gebruiken`)
          .toBe(true);
      });
    })
    .useKey(down)
    .log(() => {
      const sprite = e.log.current.getSprite(name);
      // We can't know how many steps will be set.
      e.test(`${name} moet omlaag gericht zijn`, l => {
        l.expect(sprite.direction)
          .withError(`Als op ${down} gedrukt wordt, moet ${name} zich omlaag richten.`)
          .toBe(180);
      });
      e.test(`${name} beweegt omlaag`, l => {
        l.expect(sprite.y < originalPosition.y)
          .withError(`Als op ${down} gedrukt wordt, moet ${name} 10 stappen omlaag zetten.`)
          .toBe(true);
        l.expect(sprite.x)
          .withError(`${name} mag niet horizontaal bewegen.`)
          .toBe(originalPosition.x);
      });
      latestPosition = {
        x: sprite.x,
        y: sprite.y
      };
    })
    .useKey(up)
    .log(() => {
      const sprite = e.log.current.getSprite(name);
      // We can't know how many steps will be set.
      e.test(`${name} beweegt omhoog`, l => {
        l.expect(sprite.y > latestPosition.y)
          .withError(`Als op ${up} gedrukt wordt, moet ${name} 10 stappen omhoog zetten.`)
          .toBe(true);
        l.expect(sprite.direction)
          .withError(`Als op ${up} gedrukt wordt, moet ${name} zich omhoog richten.`)
          .toBe(0);
        l.expect(sprite.x)
          .withError(`${name} mag niet horizontaal bewegen.`)
          .toBe(originalPosition.x);
      });
      e.output.closeTestContext();
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
  return events
    .log(() => {
      e.vm.runtime.getSpriteTargetByName('Ton').setXY(0, 0);
      e.output.startTestContext('Testen voor ton');
      e.output.startTestCase('De ton gaat naar één van de spelers');
    })
    .wait(sprite('Ton').toReach(
      (x, _y) => x > 60 || x < -60,
      2000,
      'De ton moet een van de spelers raken.'
    )).log(() => {
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
      e.output.startTestCase(`De ton raakt ${touchedSprite}`);
    })
    .wait(sprite('Ton').toTouch(
      () => touchedSprite,
      1000,
      () => `Ton moet ${touchedSprite} raken`)
    )
    .log(() => {
      e.output.startTestCase('De ton gaat naar de overkant');
    })
    .wait(sprite('Ton').toReach(
      (x, y) => limit(x, y),
      1000,
      'De ton moet naar de overkant gaan'
    ))
    .log(() => {
      const ton = e.vm.runtime.getSpriteTargetByName('Ton');
      const sprite = e.vm.runtime.getSpriteTargetByName(secondSprite);
      sprite.setXY(sprite.x, ton.y);
      e.output.startTestCase(`Ton raakt ${secondSprite}`);
    })
    .wait(sprite('Ton').toTouch(
      () => secondSprite,
      1000,
      () => `De ton moet ${secondSprite} raken`
    ))
    .log(() => {
      e.output.startTestCase(`Ton gaat naar ${touchedSprite}`);
    })
    .forEach(_.range(4), (ev) => {
      // Wait until we get to the next one.
      return ev.wait(sprite('Ton').toReach(
        (x, y) => limitSecond(x, y),
        1000,
        () => `De ton moet naar ${touchedSprite} gaan`
      ))
        .log(() => {
          const ton = e.vm.runtime.getSpriteTargetByName('Ton');
          const sprite = e.vm.runtime.getSpriteTargetByName(touchedSprite);
          sprite.setXY(sprite.x, ton.y);
          e.output.startTestCase(`Ton raakt ${touchedSprite}`);
        })
        .wait(sprite('Ton').toTouch(() => touchedSprite))
        .log(() => {
          [secondSprite, touchedSprite] = [touchedSprite, secondSprite];
          [limitSecond, limit] = [limit, limitSecond];
        });
    })
    .log(() => {
      e.output.startTestCase(`Ton gaat naar doel van ${touchedSprite}`);
    })
    .wait(sprite('Ton').toReach(
      (x, y) => limitSecond(x, y),
      1000,
      () => `De ton moet naar het doel van ${touchedSprite} gaan`
    ))
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
      e.output.startTestCase(`Ton gaat naar ${loser}'s Doel`);
    })
    .wait(sprite('Ton').toTouch(
      () => `${loser}'s Doel`,
      1000,
      () => `De ton moet ${loser}'s Doel raken`
    ))
    .wait(2000);
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 5000;
  e.acceleration = 10;
  e.eventAcceleration = 1;
  e.timeAcceleration = 1;

  // The events are as follows:
  // 1. start an async green flag
  // 2. At the same time:
  // 3. Wait 5 s for the ton
  // 4. do the sprite tests
  // 5. join and do the ton tests
  const events = e.scheduler
    .track('Rob')
    .track('Roy')
    .greenFlag(false);
  const waitEvent = events.wait(5000);
  const spriteEvents = events
    .wait(10) // Ensure the green flag is done.
    .pipe(ev => testSprite(ev, { name: 'Roy', up: 'q', down: 'w' }, e))
    .pipe(ev => testSprite(ev, { name: 'Rob', up: 'j', down: 'n' }, e));

  waitEvent.join([spriteEvents])
    .pipe(ev => testTon(ev, e))
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const sayEvents = e.log.events.filter({ type: 'say' });
  console.log(sayEvents);
  const data = _.last(sayEvents).data;
  e.test(`De ton zegt ${winner} scoort!`, l => {
    l.expect(data.text)
      .withError(`De ton zegt niet wie wint.`)
      .toBe(`${winner} scoort!`);
  });

  e.output.closeTestContext();
}