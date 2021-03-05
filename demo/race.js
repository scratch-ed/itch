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
    .wait(sprite(name).toTouch('Gras'))
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
    // Go down until we are off the gras.
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
  console.log(e);
  
  e.describe("Richtingen", l => {
    l.test('Omlaag werkt', l => {
      const event = e.log.events.find(ev => {
        return ev.type === 'useKey' && ev.data.key === 'Down';
      });
      const before = event.previousFrame.getSprite('Mini Geel');
      const after = event.nextFrame.getSprite('Mini Geel');
      l.expect(after.x).toBe(before.x);
      l.expect(after.y < before.y).toBe(true);
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
}