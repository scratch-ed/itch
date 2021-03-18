/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} e - The output manager.
 */

function beforeExecution(template, submission, e) {
  e.describe('Controle op bestaande code', l => {
    l.test('Mini Geel', l => {
      const fromTemplate = template.sprite('Mini Geel');
      const fromSubmission = submission.sprite('Mini Geel');
      // Check hat
      const templateStartIndex = fromTemplate.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
      const submissionStartIndex = fromSubmission.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
      const templateBlocks = fromTemplate.blocks.slice(templateStartIndex, templateStartIndex + 6);
      const submissionBlocks = fromTemplate.blocks.slice(submissionStartIndex, submissionStartIndex + 6);
      l.expect(submissionBlocks).toBe(templateBlocks);
      // Check function definition
      const templateStartIndex2 = fromTemplate.blocks.findIndex(b => b.opcode === 'procedures_definition');
      const submissionStartIndex2 = fromSubmission.blocks.findIndex(b => b.opcode === 'procedures_definition');
      const templateBlocks2 = fromTemplate.blocks.slice(templateStartIndex2, templateStartIndex2 + 6);
      const submissionBlocks2 = fromTemplate.blocks.slice(submissionStartIndex2, submissionStartIndex2 + 6);
      l.expect(submissionBlocks2).toBe(templateBlocks2);
    });
    l.test('Mini Blauw', l => {
      const fromTemplate = template.sprite('Mini Blauw');
      const fromSubmission = submission.sprite('Mini Blauw');
      // Check hat
      const templateStartIndex = fromTemplate.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
      const submissionStartIndex = fromSubmission.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
      const templateBlocks = fromTemplate.blocks.slice(templateStartIndex, templateStartIndex + 6);
      const submissionBlocks = fromTemplate.blocks.slice(submissionStartIndex, submissionStartIndex + 6);
      l.expect(submissionBlocks).toBe(templateBlocks);
      // Check function definition
      const templateStartIndex2 = fromTemplate.blocks.findIndex(b => b.opcode === 'procedures_definition');
      const submissionStartIndex2 = fromSubmission.blocks.findIndex(b => b.opcode === 'procedures_definition');
      const templateBlocks2 = fromTemplate.blocks.slice(templateStartIndex2, templateStartIndex2 + 6);
      const submissionBlocks2 = fromTemplate.blocks.slice(submissionStartIndex2, submissionStartIndex2 + 6);
      l.expect(submissionBlocks2).toBe(templateBlocks2);
    });
    l.test('Boom', l => {
      l.expect(submission.sprite('Boom').blocks).toBe(template.sprite('Boom').blocks);
    });
    l.test('Rots', l => {
      l.expect(submission.sprite('Rots').blocks).toBe(template.sprite('Rots').blocks);
    });
    l.test('Bliksem', l => {
      const fromTemplate = template.sprite('Bliksem');
      const fromSubmission = submission.sprite('Bliksem');
      // Check hat
      const templateStartIndex = fromTemplate.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
      const submissionStartIndex = fromSubmission.blocks.findIndex(b => b.opcode === 'event_whenflagclicked');
      const templateBlocks = fromTemplate.blocks.slice(templateStartIndex, templateStartIndex + 4);
      const submissionBlocks = fromTemplate.blocks.slice(submissionStartIndex, submissionStartIndex + 4);
      l.expect(submissionBlocks).toBe(templateBlocks);
    });
    l.test('Vat', l => {
      l.expect(submission.sprite('Vat').blocks).toBe(template.sprite('Vat').blocks);
    });
    l.test('Eindmeet', l => {
      l.expect(submission.sprite('Eindmeet').blocks).toBe(template.sprite('Eindmeet').blocks);
    });
    l.test('Schaap', l => {
      l.expect(submission.sprite('Schaap').blocks).toBe(template.sprite('Schaap').blocks);
    });
    l.test('Gras', l => {
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
 * @param {ScheduledEvent} e
 * @param {Evaluation} evaluation
 * @param {string} name
 * @param {{down:string,up:string,left:string,right:string}} keys
 * */
function yellowCar(evaluation, e, keys, name) {
  // Go down, up, right, left during one second.
  return e
    .track(name)
    .track('Bliksem')
    .useKey(keys.down, 500)
    .useKey(keys.up, 500)
    .useKey(keys.right, 500)
    .useKey(keys.left, 500)
    .useKey(keys.down, true)
    // Go down until we are off the gras.
    .wait(sprite(name).toNotTouch('Gras'))
    // Go until we touch the grass again
    .wait(sprite(name).toTouch('Gras'))
    // Stop after we are off the grass again.
    .useKey(keys.down, true)
    .wait(sprite(name).toNotTouch('Gras'))
    .wait(sprite(name).toReach((_x, y) => y < -130))
    .useKey(keys.down, false)
    .useKey(keys.up, true)
    .wait(sprite(name).toNotTouch('Gras'))
    .useKey(keys.up, false)
    // Drive to the end of the track.
    .useKey(keys.right, true)
    .wait(sprite(name).toReach((x, _y) => x >= 170))
    .useKey(keys.right, false)
    .useKey(keys.up, true)
    .wait(sprite(name).toReach((_x, y) => y >= -10))
    .useKey(keys.up, false)
    .useKey(keys.left, true)
    .wait(sprite(name).toReach((x, _y) => x <= 15))
    .useKey(keys.left, false)
    .useKey(keys.up, true)
    .wait(sprite(name).toReach((_x, y) => y >= 100))
    .useKey(keys.up, false)
    .useKey(keys.right, true)
    .wait(sprite(name).toReach((x, _y) => x >= 30))
    .useKey(keys.right, false)
    .useKey(keys.up, true)
    .wait(sprite(name).toReach((_x, y) => y >= 120))
    .useKey(keys.up, false)
    .useKey(keys.right, true)
    .wait(sprite(name).toTouch('Eindmeet'))
    .useKey(keys.right, false)
    // Reset to start position
    .greenFlag(false)
    .useKey(keys.down, true)
    .wait(sprite(name).toReach((_x, y) => y < 70))
    .useKey(keys.right, true)
    .wait(sprite(name).toReach((x, y) => x >= -105 && y <= 25))
    .useKey(keys.right, false)
    .wait(sprite(name).toReach((_x, y) => y <= -110))
    .useKey(keys.down, false)
    .useKey(keys.right, true)
    .wait(sprite(name).toTouch('Rots'))
    .useKey(keys.right, false)
    .wait(1000)
    .useKey(keys.down, true)
    // Go down until we are off the gras.
    .wait(sprite(name).toReach((_x, y) => y < 70))
    .useKey(keys.right, true)
    .wait(sprite(name).toReach((x, y) => x >= -105 && y <= 25))
    .useKey(keys.right, false)
    .wait(sprite(name).toReach((_x, y) => y <= -70))
    .useKey(keys.down, false)
    .useKey(keys.right, true)
    .wait(sprite(name).toTouch('Bliksem'))
    .useKey(keys.right, false)
    .wait(1000) // Give it some time.
    .log(() => {
      // Move the car manually, since we don't know where it will have ended up.
      const car = evaluation.context.vm.runtime.getSpriteTargetByName(name);
      car.setXY(90, 150);
    })
    .useKey(keys.right, true)
    .wait(sprite(name).toTouch('Eindmeet'))
    .useKey(keys.right, false)
    // Reset to start position
    .greenFlag(false)
    // Drive to ton
    .useKey(keys.down, true)
    .wait(sprite(name).toReach((_x, y) => y < 70))
    .useKey(keys.right, true)
    .wait(sprite(name).toReach((x, y) => x >= -105 && y <= 25))
    .useKey(keys.right, false)
    .wait(sprite(name).toReach((_x, y) => y <= -130))
    .useKey(keys.down, false)
    .useKey(keys.right, true)
    .wait(sprite(name).toReach((x, _y) => x >= 170))
    .useKey(keys.right, false)
    .useKey(keys.up, true)
    .wait(sprite(name).toReach((_x, y) => y >= -10))
    .useKey(keys.up, false)
    .useKey(keys.left, true)
    .wait(sprite(name).toReach((x, _y) => x <= 15))
    .useKey(keys.left, false)
    .useKey(keys.up, true)
    .wait(sprite(name).toTouch('Vat'))
    .useKey(keys.up, false)
    .wait(1000);
}

let blueStart = 0;

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 300000;
  e.acceleration = 10;

  const green = e.scheduler
    .greenFlag(false);
  const yellow = yellowCar(e, green, YELLOW, 'Mini Geel')
    .log(() => {
      blueStart = e.context.timestamp();
    });
  const blue = yellowCar(e, yellow, BLUE, 'Mini Blauw');

  // blue.join([yellow])
  //   .end();
  blue.end();
}

/**
 * @param {Evaluation} e
 * @param {string} car
 * @param {number} start
 * @param {{down:string,up:string,left:string,right:string}} keys
 */
function checkCar(e, car, start, keys) {
  e.output.startTab(`Testen voor ${car}`);
  e.describe('Bewegen', l => {
    l.test('Omlaag werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.time > start && ev.type === 'useKey' && ev.data.key === keys.down;
      });
      const before = event.previousFrame.getSprite(car);
      const after = event.nextFrame.getSprite(car);
      l.expect(after.x).toBe(before.x);
      l.expect(after.y < before.y).toBe(true);
    });
    l.test('Omhoog werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.time > start && ev.type === 'useKey' && ev.data.key === keys.up;
      });
      const before = event.previousFrame.getSprite(car);
      const after = event.nextFrame.getSprite(car);
      l.expect(after.x).toBe(before.x);
      l.expect(after.y > before.y).toBe(true);
    });
    l.test('Rechts werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.time > start && ev.type === 'useKey' && ev.data.key === keys.right;
      });
      const before = event.previousFrame.getSprite(car);
      const after = event.nextFrame.getSprite(car);
      l.expect(after.y).toBe(before.y);
      l.expect(after.x > before.x).toBe(true);
    });
    l.test('Links werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.time > start && ev.type === 'useKey' && ev.data.key === keys.left;
      });
      const before = event.previousFrame.getSprite(car);
      const after = event.nextFrame.getSprite(car);
      l.expect(after.y).toBe(before.y);
      l.expect(after.x < before.x).toBe(true);
    });
  });
  e.describe('Gras', l => {
    l.test('Trager op gras', l => {
      const normalStartFrame = e.log.events
        .find(ev => ev.time > start && ev.type === 'waitForSpriteNotTouch' && ev.data.sprite === car)
        .nextFrame;
      const switchIndex = e.log.events.findIndex(ev => ev.time > start && ev.type === 'waitForSpriteTouch' && ev.data.sprite === car);
      const switchFrame = e.log.events.list[switchIndex].nextFrame;
      const grassEndFrame = e.log.events
        .find((ev, ind) => ev.time > start && ev.type === 'waitForSpriteNotTouch' && ev.data.sprite === car && ind > switchIndex)
        .nextFrame;
      const normalStartSprite = normalStartFrame.getSprite(car);
      const switchSprite = switchFrame.getSprite(car);
      const grassEndSprite = grassEndFrame.getSprite(car);

      const normalDistance = Math.abs(switchSprite.y - normalStartSprite.y);
      const normalTime = (switchFrame.time - normalStartFrame.time) / e.acceleration;

      const grassDistance = Math.abs(grassEndSprite.y - switchSprite.y);
      const grassTime = (grassEndFrame.time - switchFrame.time) / e.acceleration;

      const normalSpeed = normalDistance / normalTime;
      const grassSpeed = grassDistance / grassTime;
      l.expect(normalSpeed > grassSpeed).toBe(true);
    });
  });
  e.describe('Rots werkt', l => {
    l.test('Rots verplaatst terug naar start', l => {
      const events = e.log.events.list.filter(ev => ev.time > start && ev.type === 'waitForSpriteTouch' && ev.data.sprite === car);
      const event = events.find(ev => ev.data.targets[0] === 'Rots');
      // The car must wait a bit, so in one of the next frames (0.5s), we must be moved to the start position.
      const moveFrame = e.log.frames
        .filter(f => f.time > event.nextFrame.time && f.time < event.nextFrame.time + e.context.accelerateEvent(500) && f.block === `update_${car}`)
        .find(f => {
          const sprite = f.getSprite(car);
          return sprite.x > -200 && sprite.x < -150 && sprite.y > 150; 
        });
      l.expect(moveFrame)
        .with({
          wrong: `Na het aanraken van de rots moet ${car} terug naar de startpositie`
        })
        .toNotBe(undefined);
    });
  });
  e.describe('Bliksem werkt', l => {
    const events = e.log.events.list.filter(ev => ev.time > start && ev.type === 'waitForSpriteTouch' && ev.data.sprite === car);
    const event = events.find(ev => ev.data.targets[0] === 'Bliksem');
    const frames = e.log.frames.filter(f => f.time > event.nextFrame.time - e.context.accelerateEvent(50)
      && f.time < event.nextFrame.time + e.context.accelerateEvent(800)
      && f.block === `update_${car}`);
    l.test('Bliksem verplaatst naar ergens anders', l => {
      // First hide the car, then put it somewhere else.
      // The somewhere else is defined as not within a certain distance to the lightning.
      const lightPosition = frames[0].getSprite('Bliksem');
      const afterPosition = frames[frames.length - 1].getSprite( car);
      const distance = Math.sqrt(distSq({ x: lightPosition.x, y: lightPosition.y }, { x: afterPosition.x, y: afterPosition.y }));
      l.expect(distance > 50)
        .with({
          wrong: `${car} moet verder van de bliksem komen`
        })
        .toBe(true);
    });
    // The lightning must hide soon
    const lightningFrames = e.log.frames.filter(f => f.time > event.nextFrame.time && f.time < event.nextFrame.time + e.context.accelerateEvent(1000));
    const visibilities = e.log.getSprites('Bliksem', lightningFrames, s => s.visible);
    l.test('Bliksem gaat weg', l => {
      l.expect(visibilities.length > 1 && visibilities.includes(false))
        .toBe(true);
    });
  });
  e.describe('Vat werkt', l => {
    const events = e.log.events.list.filter(ev => ev.time > start && ev.type === 'waitForSpriteTouch' && ev.data.sprite === car);
    const event = events.find(ev => ev.data.targets[0] === 'Vat');
    const frames = e.log.frames.filter(f => f.time > event.nextFrame.time && f.block === `update_${car}`);
    const positions = e.log.getSpritePositions(car, frames);
    l.test(`${car} gaat naar willekeurige posities`, l => {
      l.expect(positions.length > 1)
        .toBe(true);
    });
  });
  e.output.closeTab();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  
  checkCar(e, 'Mini Geel', 0, YELLOW);
  checkCar(e, 'Mini Blauw', blueStart, BLUE);
}