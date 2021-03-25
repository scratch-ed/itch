/**
 * @param {string} sprite
 * @param {Project} template
 * @param {Project} submission
 * @param {ExpectLevel} l
 */
function checkStartCarConditions(sprite, template, submission, l) {
  const fromTemplate = template.sprite(sprite);
  const fromSubmission = submission.sprite(sprite);
  l.expect(fromSubmission).toNotBe(null);
  // Check hat
  const templateStartIndex = fromTemplate.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
  const submissionStartIndex = fromSubmission.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
  const templateBlocks = fromTemplate.blocks.slice(templateStartIndex, templateStartIndex + 6);
  const submissionBlocks = fromTemplate.blocks.slice(submissionStartIndex, submissionStartIndex + 6);
  l.expect(submissionBlocks).toBe(templateBlocks);
}

/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} e - The output manager.
 */
function beforeExecution(template, submission, e) {
  e.describe('Controle op bestaande code', l => {
    l.test('Mini Geel', l => {
      checkStartCarConditions('Mini Geel', template, submission, l);
    });
    l.test('Mini Blauw', l => {
      checkStartCarConditions('Mini Blauw', template, submission, l);
    });
    l.test('Boom', l => {
      l.expect(submission.sprite('Boom')).toNotBe(null);
      l.expect(submission.sprite('Boom')?.blocks).toBe(template.sprite('Boom').blocks);
    });
    l.test('Rots', l => {
      l.expect(submission.sprite('Rots')).toNotBe(null);
      l.expect(submission.sprite('Rots')?.blocks).toBe(template.sprite('Rots').blocks);
    });
    l.test('Bliksem', l => {
      l.expect(submission.sprite('Bliksem')).toNotBe(null);
      const fromTemplate = template.sprite('Bliksem');
      const fromSubmission = submission.sprite('Bliksem');
      l.expect(fromSubmission).toNotBe(null);
      // Check hat
      const templateStartIndex = fromTemplate.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
      const submissionStartIndex = fromSubmission?.blocks?.findIndex(b => b.opcode === 'event_whenflagclicked');
      const templateBlocks = fromTemplate.blocks.slice(templateStartIndex, templateStartIndex + 4);
      const submissionBlocks = fromTemplate.blocks.slice(submissionStartIndex, submissionStartIndex + 4);
      l.expect(submissionBlocks).toBe(templateBlocks);
    });
    l.test('Vat', l => {
      l.expect(submission.sprite('Vat')).toNotBe(null);
      l.expect(submission.sprite('Vat').blocks).toBe(template.sprite('Vat').blocks);
    });
    l.test('Eindmeet', l => {
      l.expect(submission.sprite('Eindmeet')).toNotBe(null);
      l.expect(submission.sprite('Eindmeet').blocks).toBe(template.sprite('Eindmeet').blocks);
    });
    l.test('Schaap', l => {
      l.expect(submission.sprite('Schaap')).toNotBe(null);
      l.expect(submission.sprite('Schaap').blocks).toBe(template.sprite('Schaap').blocks);
    });
    l.test('Gras', l => {
      l.expect(submission.sprite('Gras')).toNotBe(null);
      l.expect(submission.sprite('Gras').blocks).toBe(template.sprite('Gras').blocks);
    });
  });
}

const YELLOW = {
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right'
};

const BLUE = {
  up: 'z',
  down: 'w',
  left: 'q',
  right: 'd'
};

/**
 * @param {ScheduledEvent} event
 * @param {Evaluation} e
 * @param {string} name
 * @param {{down:string,up:string,left:string,right:string}} keys
 * */
function testCar(e, event, keys, name) {
  // Save a time for later user.
  let start = null;
  let lightningPosition = null;
  // Go down, up, right, left during one second.
  return event
    .track(name)
    .log(() => {
      e.output.startContext(`Testen voor ${name}`);
      const sprite = e.vm.runtime.getSpriteTargetByName('Bliksem');
      lightningPosition = {
        x: sprite.x,
        y: sprite.y
      };
      start = e.context.timestamp();
    })
    .useKey(keys.down, 500)
    .log(() => {
      e.test(`${name} kan omlaag bewegen`, l => {
        const event = e.log.events.list.find(ev => {
          return ev.time >= start && ev.type === 'useKey' && ev.data.key === keys.down;
        });
        const before = event.previousFrame.getSprite(name);
        const after = event.nextFrame.getSprite(name);
        l.expect(after.y < before.y && numericEquals(after.x, before.x))
          .toBe(true);
      });
    })
    .useKey(keys.up, 500)
    .log(() => {
      e.test(`${name} kan omhoog bewegen`, l => {
        const event = e.log.events.list.find(ev => {
          return ev.time > start && ev.type === 'useKey' && ev.data.key === keys.up;
        });
        const before = event.previousFrame.getSprite(name);
        const after = event.nextFrame.getSprite(name);
        l.expect(after.y > before.y && numericEquals(after.x, before.x))
          .toBe(true);
      });
    })
    .useKey(keys.right, 500)
    .log(() => {
      e.test(`${name} kan naar rechts bewegen`, l => {
        const event = e.log.events.list.find(ev => {
          return ev.time > start && ev.type === 'useKey' && ev.data.key === keys.right;
        });
        const before = event.previousFrame.getSprite(name);
        const after = event.nextFrame.getSprite(name);
        l.expect(after.x > before.x && numericEquals(after.y, before.y))
          .toBe(true);
      });
    })
    .useKey(keys.left, 500)
    .log(() => {
      e.test(`${name} kan naar links werkt`, l => {
        const event = e.log.events.list.find(ev => {
          return ev.time > start && ev.type === 'useKey' && ev.data.key === keys.left;
        });
        const before = event.previousFrame.getSprite(name);
        const after = event.nextFrame.getSprite(name);
        l.expect(after.x < before.x && numericEquals(after.y, before.y))
          .toBe(true);
      });
    })
    .log(() => {
      start = e.context.timestamp();
    })
    .useKey(keys.down, true)
    .wait(sprite(name).toReach((_x, y) => y < 90))
    // Go until we touch the grass
    .wait(sprite(name).toTouch('Gras'))
    // Go further until we are off the grass.
    .wait(sprite(name).toNotTouch('Gras'))
    .log(() => {
      e.test(`${name} rijdt trager op het gras`, l => {
        // Get the frame from when we started to go down.
        const normalStartFrame = e.log.events.list
          .find(ev => ev.time >= start && ev.type === 'useKey' && ev.data.key === keys.down)
          .previousFrame;
        const touchGrassFrame = e.log.events.list
          .find(ev => ev.time > start && ev.type === 'waitForSpriteTouch' && ev.data.sprite === name)
          .nextFrame;
        const offGrassFrame = e.log.events.list
          .find(ev => ev.time > start && ev.type === 'waitForSpriteNotTouch' && ev.data.sprite === name)
          .nextFrame;

        const normalStartSprite = normalStartFrame.getSprite(name);
        const switchSprite = touchGrassFrame.getSprite(name);
        const grassEndSprite = offGrassFrame.getSprite(name);

        const normalDistance = Math.abs(switchSprite.y - normalStartSprite.y);
        const normalTime = (touchGrassFrame.time - normalStartFrame.time) / e.acceleration;

        const grassDistance = Math.abs(grassEndSprite.y - switchSprite.y);
        const grassTime = (offGrassFrame.time - touchGrassFrame.time) / e.acceleration;

        const normalSpeed = normalDistance / normalTime;
        const grassSpeed = grassDistance / grassTime;
        l.expect(normalSpeed > grassSpeed).toBe(true);
      });
    })
    // Drive the rest of the track.
    .wait(sprite(name).toReach((_x, y) => y < -130))
    .useKey(keys.down, false)
    .useKey(keys.right, true)
    .wait(sprite(name).toReach((x, _y) => x >= 195))
    .useKey(keys.right, false)
    .useKey(keys.up, true)
    .wait(sprite(name).toTouch('Boom'))
    .useKey(keys.up, false)
    .wait(3000) // Should be 3s
    .log(() => {
      const sprite = e.vm.runtime.getSpriteTargetByName(name);
      // Check that we waited ~3s, and then moved -5 down.
      
      e.test(`${name} moet 3s wachten bij het botsen met de boom`, l => {
        const touchFrame = e.log.events.list
          .find(ev => ev.type === 'waitForSpriteTouch' && ev.data.targets[0] === 'Boom' && ev.data.sprite === name)
          .nextFrame;
        const touchSprite = touchFrame.getSprite(name);
        const moveFrames = e.log.frames.filter(fr => fr.time > touchFrame.time && fr.block === `update_${name}`);
        const firstMoved = moveFrames.find(fr => {
          const sp = fr.getSprite(name);
          return sp.x !== touchSprite.x || sp.y !== touchSprite.y;
        });
        const time = firstMoved.time - touchFrame.time;
        const expected = e.context.accelerateEvent(3000);
        l.expect(expected - (expected / 2) <= time && time <= expected + (expected / 2))
          .toBe(true);
      });
      e.test(`${name} moet achteruit bewegen na het botsen met de boom`, l => {
        l.expect(sprite.isTouchingSprite('Boom'))
          .toBe(false);
      });
      // Move along...
      sprite.setXY(125, 130);
    })
    .useKey(keys.right, true)
    .log(() => {
      start = e.context.timestamp();
    })
    .wait(sprite(name).toTouch('Eindmeet'))
    .useKey(keys.right, false)
    // Wait a bit to allow message to show.
    .wait(100)
    .log(() => {
      e.test(`${name} zegt iets als de eindmeet bereikt wordt`, l => {
        const event = e.log.events.list.find(ev => ev.type === 'say' && ev.time > start && ev.data.sprite === name);
        l.expect(event)
          .toNotBe(undefined);
      });
    })
    // Reset to start position
    .greenFlag(false)
    // Drive into rock
    // Set the car to before the rock.
    .log(() => {
      const sprite = e.vm.runtime.getSpriteTargetByName(name);
      sprite.setXY(10, -110);
    })
    .useKey(keys.right, true)
    .wait(sprite(name).toTouch('Rots'))
    .useKey(keys.right, false)
    .wait(1000) // Should be 1000 in the future
    .log(() => {
      e.test(`${name} blijft een seconde staan na botsing met de rots`, l => {
        // Check that the car waits 1000ms before moving.
        const touchFrame = e.log.events.list
          .find(ev => ev.type === 'waitForSpriteTouch' && ev.data.targets[0] === 'Rots' && ev.data.sprite === name)
          .nextFrame;
        const touchSprite = touchFrame.getSprite(name);
        const moveFrames = e.log.frames.filter(fr => fr.time > touchFrame.time && fr.block === `update_${name}`);
        const firstMoved = moveFrames.find(fr => {
          const sp = fr.getSprite(name);
          return sp.x !== touchSprite.x || sp.y !== touchSprite.y;
        });
        const time = firstMoved.time - touchFrame.time;
        const expected = e.context.accelerateEvent(1000);
        // Check that we are within range.
        l.expect(expected - (expected / 2) <= time && time <= expected + (expected / 2))
          .toBe(true);
      });
      e.test(`${name} gaat terug naar start bij botsing met rots`, l => {
        const sprite = e.vm.runtime.getSpriteTargetByName(name);
        l.expect(sprite.x > -200 && sprite.x < -150 && sprite.y > 150)
          .toBe(true);
      });
    })
    .log(() => {
      const sprite = e.vm.runtime.getSpriteTargetByName(name);
      sprite.setXY(-100, -60);
    })
    .useKey(keys.right, true)
    .log(() => {
      start = e.context.timestamp();
    })
    .wait(sprite(name).toTouch('Bliksem'))
    .useKey(keys.right, false)
    .wait(500) // Give it some time.
    .log(() => {
      const sprite = e.vm.runtime.getSpriteTargetByName(name);
      e.test(`Bliksem verplaatst ${name} naar ergens anders`, l => {
        // First hide the car, then put it somewhere else.
        // The somewhere else is defined as not within a certain distance to the lightning.
        const distance = Math.sqrt(distSq(lightningPosition, {
          x: sprite.x,
          y: sprite.y
        }));
        l.expect(distance > 50)
          .toBe(true);
      });
      e.test(`Bliksem gaat weg nadat ${name} er tegen rijdt`, l => {
        const sprite = e.vm.runtime.getSpriteTargetByName('Bliksem');
        l.expect(sprite.visible)
          .toBe(false);
      });
    })
    // Reset to start position
    .greenFlag(false)
    // Drive to ton
    .log(() => {
      // Instead of driving to the ton, just move the car to it.
      // This is much faster.
      const sprite = e.vm.runtime.getSpriteTargetByName(name);
      sprite.setXY(-5, 100);
    })
    .useKey(keys.up, true)
    .log(() => {
      start = e.context.timestamp();
    })
    .wait(sprite(name).toTouch('Vat'))
    .useKey(keys.up, false)
    .wait(1000) // Give it some time
    .log(() => {
      e.test(`${name} gaat naar willekeurige posities na het aanraken van de bliksem`, l => {
        const frames = e.log.frames.filter(ev => ev.time >= start && ev.block === `update_${name}`);
        const positions = e.log.getSpritePositions(name, frames);
        l.expect(positions.length >= 2)
          .toBe(true);
      });
    });
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 300000;
  e.acceleration = 10;

  e.scheduler
    .greenFlag(false)
    .pipe(ev => testCar(e, ev, YELLOW, 'Mini Geel'))
    .pipe(ev => testCar(e, ev, BLUE, 'Mini Blauw'))
    .end();
}
