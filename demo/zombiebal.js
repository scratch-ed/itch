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

  e.describe('Statische controles op blokjes', l => {
    l.test('Oneindige lus gebruikt bij Rob', l => {
      l.expect(submission.sprite('Rob').hasBlock('control_forever'))
        .withError('Bij Rob moet je het blokje \'oneindige lus\' gebruiken')
        .toBe(true);
    });
    l.test('Oneindige lus gebruikt bij Roy', l => {
      l.expect(submission.sprite('Roy').hasBlock('control_forever'))
        .withError('Bij Roy moet je het blokje \'oneindige lus\' gebruiken')
        .toBe(true);
    });

    // Check the ton.
    const ton = submission.sprite('Ton');
    const callIndex = ton.blocks.findIndex(block => {
      return block.opcode === 'procedures_call' && block.calledProcedureName === 'Richt naar Roy of Rob';
    });
    const loopIndex = ton.blocks.findIndex(block => {
      return block.opcode === 'control_repeat_until';
    });

    l.test('Ton richt naar spelers', l => {
      l.expect(callIndex < loopIndex || !loopIndex)
        .withError('De ton moet zich eerst naar één van de spelers richten voor ze beweegt.')
        .toBe(true);
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
      e.output.startTestContext('Testen voor ton');
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
    })
    // TODO: this should also be a test somehow.
    .wait(sprite('Ton').toTouch(() => touchedSprite))
    .log(() => {
      e.test(`Ton raakt ${touchedSprite}`, l => {
        l.accept();
      });
    })
    .wait(sprite('Ton').toReach((x, y) => limit(x, y)))
    .log(() => {
      const ton = e.vm.runtime.getSpriteTargetByName('Ton');
      const sprite = e.vm.runtime.getSpriteTargetByName(secondSprite);
      sprite.setXY(sprite.x, ton.y);
    })
    .wait(sprite('Ton').toTouch(() => secondSprite))
    .log(() => {
      e.test(`Ton raakt ${secondSprite}`, l => {
        l.accept();
      });
    })
    .forEach(_.range(4), (ev) => {
      // Wait until we get to the next one.
      return ev.wait(sprite('Ton').toReach(
        (x, y) => limitSecond(x, y),
        2000, 'De ton moet een van de spelers raken.'
      ))
        .log(() => {
          const ton = e.vm.runtime.getSpriteTargetByName('Ton');
          const sprite = e.vm.runtime.getSpriteTargetByName(touchedSprite);
          sprite.setXY(sprite.x, ton.y);
        })
        .wait(sprite('Ton').toTouch(() => touchedSprite))
        .log(() => {
          e.test(`Ton raakt ${touchedSprite}`, l => {
            l.accept();
          });
          [secondSprite, touchedSprite] = [touchedSprite, secondSprite];
          [limitSecond, limit] = [limit, limitSecond];
        });
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
      e.output.closeTestContext();
    })
    .wait(sprite('Ton').toTouch(() => `${loser}'s Doel`))
    .wait(2000);
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 5000;
  e.acceleration = 10;
  e.eventAcceleration = 1;
  e.timeAcceleration = 1;

  e.scheduler
    .greenFlag(false)
    .wait(5000)
    // We cannot do these concurrently, since the key presses will be mixed then.
    .pipe(ev => testSprite(ev, { name: 'Roy', up: 'q', down: 'w' }, e))
    .pipe(ev => testSprite(ev, { name: 'Rob', up: 'j', down: 'n' }, e))
    .pipe(ev => testTon(ev, e))
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  console.log(e.runError);
  const sayEvents = e.log.events.filter({ type: 'say' });
  const data = _.last(sayEvents).data;
  e.test(`De ton zegt ${winner} scoort!`, l => {
    l.expect(data.text)
      .withError(`De ton zegt niet wie wint.`)
      .toBe(`${winner} scoort!`);
  });
}