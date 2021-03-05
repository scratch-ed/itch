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
 * */
function yellowCar(evaluation, e, keys, name) {
  
  // Go down, up, right, left during one second.
  return e
    .track(name)
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
    .wait(sprite(name).toTouch('Eindmeet'))
    .useKey(keys.right, false);
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 300000;
  e.acceleration = 10;

  const green = e.scheduler
    .greenFlag(false);
  const yellow = yellowCar(e, green, YELLOW, 'Mini Geel');
  
  // blue.join([yellow])
  //   .end();
  yellow.end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  
  e.describe("Bewegen", l => {
    l.test('Omlaag werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.type === 'useKey' && ev.data.key === 'Down';
      });
      const before = event.previousFrame.getSprite('Mini Geel');
      const after = event.nextFrame.getSprite('Mini Geel');
      l.expect(after.x).toBe(before.x);
      l.expect(after.y < before.y).toBe(true);
      
      // Check the direction.
      // First, get all frames that happened here.
      // let frames = e.log.frames.filter(f => event.previousFrame.time <= f.time && f.time <= event.nextFrame.time && f.block === 'update_Mini Geel');
      // // There might be too many frames, so only start when we actually pressed the key.
      // const startIndex = frames.findIndex(f => f.block === 'sensing_keypressed');
      // debugger;
    });
    l.test('Omhoog werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.type === 'useKey' && ev.data.key === 'Up';
      });
      const before = event.previousFrame.getSprite('Mini Geel');
      const after = event.nextFrame.getSprite('Mini Geel');
      l.expect(after.x).toBe(before.x);
      l.expect(after.y > before.y).toBe(true);
    });
    l.test('Rechts werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.type === 'useKey' && ev.data.key === 'Right';
      });
      const before = event.previousFrame.getSprite('Mini Geel');
      const after = event.nextFrame.getSprite('Mini Geel');
      l.expect(after.y).toBe(before.y);
      l.expect(after.x > before.x).toBe(true);
    });
    l.test('Links werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.type === 'useKey' && ev.data.key === 'Left';
      });
      const before = event.previousFrame.getSprite('Mini Geel');
      const after = event.nextFrame.getSprite('Mini Geel');
      l.expect(after.y).toBe(before.y);
      l.expect(after.x < before.x).toBe(true);
    });
  });
  e.describe("Gras", l => {
    l.test("Trager op gras", l => {
      
      const normalStartFrame = e.log.events
        .find(ev => ev.type === 'waitForSpriteNotTouch' && ev.data.sprite === 'Mini Geel')
        .nextFrame;
      const switchIndex = e.log.events.findIndex(ev => ev.type === 'waitForSpriteTouch' && ev.data.sprite === 'Mini Geel');
      const switchFrame = e.log.events.list[switchIndex].nextFrame;
      const grassEndFrame = e.log.events
        .find((ev, ind) => ev.type === 'waitForSpriteNotTouch' && ev.data.sprite === 'Mini Geel' && ind > switchIndex)
        .nextFrame;
      const normalStartSprite = normalStartFrame.getSprite('Mini Geel');
      const switchSprite = switchFrame.getSprite('Mini Geel');
      const grassEndSprite = grassEndFrame.getSprite('Mini Geel');
      
      const normalDistance = Math.abs(switchSprite.y - normalStartSprite.y);
      const normalTime = (switchFrame.time - normalStartFrame.time) / e.acceleration;
      
      const grassDistance = Math.abs(grassEndSprite.y - switchSprite.y);
      const grassTime = (grassEndFrame.time - switchFrame.time) / e.acceleration;

      const normalSpeed = normalDistance / normalTime;
      const grassSpeed = grassDistance / grassTime;
      const relative = normalSpeed / grassSpeed;
      l.expect(normalSpeed > grassSpeed).toBe(true);
    });
  });
}