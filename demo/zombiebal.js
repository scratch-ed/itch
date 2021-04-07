/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} e - The output manager.
 */

function beforeExecution(template, submission, e) {
  e.describe('Basiscontroles', (l) => {
    l.test('Niet geprutst met andere sprites', (l) => {
      const sprites = template.sprites().map((s) => s.name);
      l.expect(template.hasRemovedSprites(submission))
        .with({
          wrong: `Oei, er zijn sprites verwijderd van het project. Er moeten volgende sprites zijn: ${sprites.join(
            ', ',
          )}.`,
        })
        .fatal()
        .toBe(false);
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
      e.output.startContext(`Testen voor ${name}`);
      const sprite = e.log.current.getSprite(name);
      originalPosition = {
        x: sprite.x,
        y: sprite.y,
      };
      latestPosition = originalPosition;
      e.test(`Oneindige lus gebruikt bij ${name}`, (l) => {
        l.expect(sprite.hasBlock('control_forever'))
          .with({
            correct: `Goed bezig! ${name} kan al heel het spelletje lang code uitvoeren.`,
            wrong: `${name} kan nog niet heel het spelletje lang bewegen, zorg ervoor dat je een oneindige lus gebruikt.`,
          })
          .toBe(true);
      });
      const realSprite = e.vm.runtime.getSpriteTargetByName(name);
      realSprite.setDirection(90);
    })
    .useKey(up)
    .log(() => {
      const sprite = e.log.current.getSprite(name);
      // We can't know how many steps will be set.
      e.test(`${name} moet omhoog gericht zijn`, (l) => {
        l.expect(sprite.direction)
          .with({
            correct: `Goed zo! ${name} richt zich naar omhoog wanneer je op ‘${up}’ drukt.`,
            wrong: `Als op ${up} gedrukt wordt, dan moet ${name} zich naar omhoog richten.`,
          })
          .toBe(0);
      });

      // We can't know how many steps will be set.
      e.test(`${name} beweegt omhoog`, (l) => {
        l.expect(sprite.y > originalPosition.y)
          .with({
            correct: `Joepie! ${name} kan naar boven bewegen`,
            wrong: `Als op ${up} gedrukt wordt, dan moet ${name} 10 stappen omhoog zetten.`,
          })
          .toBe(true);
        l.expect(sprite.x)
          .with({
            wrong: `Als op ${up} gedrukt wordt, dan moet ${name} 10 stappen omhoog zetten, maar niet horizontaal verplaatsen.`,
          })
          .toBe(originalPosition.x);
      });
      latestPosition = {
        x: sprite.x,
        y: sprite.y,
      };
      const realSprite = e.vm.runtime.getSpriteTargetByName(name);
      realSprite.setDirection(90);
    })
    .useKey(down)
    .log(() => {
      const sprite = e.log.current.getSprite(name);
      // We can't know how many steps will be set.
      e.test(`${name} moet omlaag gericht zijn`, (l) => {
        l.expect(sprite.direction)
          .with({
            correct: `Goed zo! ${name} richt zich naar omlaag wanneer je op ‘${down}’ drukt.`,
            wrong: `Als op ${down} gedrukt wordt, dan moet ${name} zich naar omlaag richten.`,
          })
          .toBe(180);
      });
      e.test(`${name} beweegt omlaag`, (l) => {
        l.expect(sprite.y < latestPosition.y)
          .with({
            correct: `Joepie! ${name} kan naar beneden bewegen`,
            wrong: `Als op ${down} gedrukt wordt, dan moet ${name} 10 stappen omlaag zetten.`,
          })
          .toBe(true);
        l.expect(sprite.x)
          .with({
            wrong: `Als op ${down} gedrukt wordt, dan moet ${name} 10 stappen omlaag zetten, maar niet horizontaal verplaatsen.`,
          })
          .toBe(originalPosition.x);
      });
      e.output.closeContext();
    });
}

let loser;
let winner;
let tonTime;

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
      e.output.startContext('Testen voor ton');
    })
    .wait(sprite('Ton').toMove(4000))
    .asTest({
      correct: 'Super! De ton kan bewegen.',
      wrong:
        'De ton moet eerst naar Roy of Rob richten. Nadien moet hij 5 stappen blijven nemen tot hij Rob’s doel of Roy’s doel raakt.',
    })
    .log(() => {
      tonTime = e.context.timestamp();
      e.vm.runtime.getSpriteTargetByName('Ton').setXY(0, 0);
      e.output.startTestcase('De ton gaat naar één van de spelers');
    })
    .wait(sprite('Ton').toReach((x, _y) => x > 60 || x < -60, 2000))
    .asTest({
      correct: 'Super! De ton gaat naar Roy of Rob.',
      wrong:
        'De ton moet eerst naar Roy of Rob richten. Nadien moet hij 5 stappen blijven nemen tot hij Rob’s doel of Roy’s doel raakt.',
    })
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
      e.output.startTestcase(`De ton raakt ${touchedSprite}`);
    })
    .wait(sprite('Ton').toTouch(() => touchedSprite, 2000))
    .asTest({
      correct: () => `Super! De ton beweegt tot bij ${touchedSprite}.`,
      wrong: () =>
        `De ton moet bewegen tot hij ${touchedSprite} raakt, waarna ${touchedSprite} tegen de ton moet schoppen.`,
    })
    .wait(100)
    .log(() => {
      e.test('De ton wordt teruggeschopt', (l) => {
        const frames = e.log.frames.filter((f) => f.time > tonTime);
        const maxX = e.log.getMaxX('Ton', frames);
        const minX = e.log.getMinX('Ton', frames);
        // eslint-disable-next-line yoda
        l.expect(-120 < minX && maxX < 120)
          .with({
            correct: () => `Super! ${touchedSprite} schopt tegen de ton.`,
            wrong: () =>
              `Als de ton ${touchedSprite} raakt, moet ${touchedSprite} tegen de ton schoppen.`,
          })
          .fatal()
          .toBe(true);
      });

      e.output.startTestcase('De ton gaat naar de overkant');
    })
    .wait(sprite('Ton').toReach((x, y) => limit(x, y), 2000))
    .asTest({
      correct: () => `Super! De ton beweegt tot bij ${secondSprite}.`,
      wrong: () =>
        `Nadat ${touchedSprite} tegen de ton schopt, moet de ton omkeren.`,
    })
    .log(() => {
      const ton = e.vm.runtime.getSpriteTargetByName('Ton');
      const sprite = e.vm.runtime.getSpriteTargetByName(secondSprite);
      sprite.setXY(sprite.x, ton.y);
      e.output.startTestcase(`Ton raakt ${secondSprite}`);
    })
    .wait(sprite('Ton').toTouch(() => secondSprite, 2000))
    .asTest({
      correct: () => `Super! De ton raakt ${secondSprite}.`,
      wrong: () =>
        `Nadat ${touchedSprite} tegen de ton schopt, moet de ton omkeren.`,
    })
    .wait(100)
    .log(() => {
      e.test('De ton wordt teruggeschopt', (l) => {
        const frames = e.log.frames.filter((f) => f.time > tonTime);
        const maxX = e.log.getMaxX('Ton', frames);
        const minX = e.log.getMinX('Ton', frames);
        // eslint-disable-next-line yoda
        l.expect(-120 < minX && maxX < 120)
          .with({
            correct: () => `Super! ${secondSprite} schopt tegen de ton.`,
            wrong: () =>
              `Als de ton ${secondSprite} raakt, moet ${secondSprite} tegen de ton schoppen.`,
          })
          .fatal()
          .toBe(true);
      });

      e.output.startTestcase(`Ton gaat naar ${touchedSprite}`);
    })
    .forEach(_.range(1), (ev) => {
      // Wait until we get to the next one.
      return ev
        .wait(sprite('Ton').toReach((x, y) => limitSecond(x, y), 2000))
        .asTest({
          correct: () => `Goed bezig! De ton weerkaatst naar ${touchedSprite}`,
          wrong: () => `De ton moet weerkaatsen naar ${touchedSprite}`,
        })
        .log(() => {
          const ton = e.vm.runtime.getSpriteTargetByName('Ton');
          const sprite = e.vm.runtime.getSpriteTargetByName(touchedSprite);
          sprite.setXY(sprite.x, ton.y);
          e.output.startTestcase(`Ton raakt ${touchedSprite}`);
        })
        .wait(sprite('Ton').toTouch(() => touchedSprite))
        .log(() => {
          [secondSprite, touchedSprite] = [touchedSprite, secondSprite];
          [limitSecond, limit] = [limit, limitSecond];
        });
    })
    .log(() => {
      e.output.startTestcase(`Ton gaat naar doel van ${touchedSprite}`);
      /** @type {RenderedTarget} */
      const sprite = e.vm.runtime.getSpriteTargetByName(touchedSprite);
      sprite.setVisible(false);
    })
    .wait(sprite('Ton').toReach((x, y) => limitSecond(x, y), 2000))
    .asTest({
      correct: () =>
        `Goed bezig! De ton kan bewegen naar het doel van ${touchedSprite}.`,
      wrong: () => `De ton moet naar het doel van ${touchedSprite} gaan.`,
    })
    .log(() => {
      loser = touchedSprite;
      winner = secondSprite;
      e.output.startTestcase(`Ton gaat naar ${loser}'s Doel`);
    })
    .wait(sprite('Ton').toTouch(() => `${loser}'s Doel`, 2000))
    .asTest({
      correct: () => `Goed bezig! De ton kan het doel van ${loser} raken.`,
      wrong: () => `De ton moet het doel van ${loser} raken.`,
    })
    .wait(1000);
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 10000;
  e.acceleration = 10;
  e.eventAcceleration = 1;

  // The events are as follows:
  // 1. start an async green flag
  // 2. At the same time:
  // 3. Wait 5 s for the ton
  // 4. do the sprite tests
  // 5. join and do the ton tests
  const events = e.scheduler.track('Rob').track('Roy').greenFlag(false);
  const spriteEvents = events
    .wait(10) // Ensure the green flag is done.
    .pipe((ev) => testSprite(ev, { name: 'Roy', up: 'q', down: 'w' }, e))
    .pipe((ev) => testSprite(ev, { name: 'Rob', up: 'j', down: 'n' }, e));

  events
    .join([spriteEvents])
    .pipe((ev) => testTon(ev, e))
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const sayEvent = e.log.events.list.find(
    (ev) => ev.type === 'say' && ev.data.sprite === 'Ton' && ev.time > tonTime,
  );
  const data = sayEvent?.data;
  e.test(`De ton zegt ${winner} scoort!`, (l) => {
    let wrong;
    if (data?.text) {
      wrong = `De ton zegt "${data.text}", maar als de ton Rob's doel raakt, dan moet de ton "Roy scoort!" zeggen, en anders zegt hij dat "Rob scoort!".`;
    } else {
      wrong =
        'Als de ton Rob’s doel raakt, dan zegt de ton dat "Roy scoort!" anders zegt hij dat "Rob scoort!".';
    }
    l.expect(data?.text)
      .with({
        correct: 'Proficiat! De ton zegt wie er wint.',
        wrong: wrong,
      })
      .toBe(`${winner} scoort!`);
  });

  e.output.closeContext();
}
