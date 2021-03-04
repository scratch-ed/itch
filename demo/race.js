const OPPOSITES = {
  'Up': 'Down',
  'Down': 'Up',
  'Left': 'Right',
  'Right': 'Left'
};

/** 
 * @param {ScheduledEvent} e 
 * @param {Evaluation} evaluation
 * */
function yellowCar(evaluation, e) {
  
  // Go down, up, right, left during one second.
  return e
    .useKey('Down', 500)
    .useKey('Up', 500)
    .useKey('Right', 500)
    .useKey('Left', 500)
    .useKey('Down', true)
    // Go down until we are off the gras.
    .wait(sprite('Mini Geel').toNotTouch('Gras'))
    // Go until we touch the grass again
    .wait(sprite('Mini Geel').toTouch('Gras'))
    // Stop after we are off the grass again.
    .useKey('Down', true)
    .wait(sprite('Mini Geel').toNotTouch('Gras'))
    .wait(sprite('Mini Geel').toTouch('Gras'))
    .useKey('Down', false)
    .useKey('Up', true)
    .wait(sprite('Mini Geel').toNotTouch('Gras'))
    .useKey('Up', false)
    // Drive to the end of the track.
    .useKey('Right', true)
    .wait(sprite('Mini Geel').toReach((x, _y) => x >= 170))
    .useKey('Right', false)
    .useKey('Up', true)
    .wait(sprite('Mini Geel').toReach((_x, y) => y >= -10))
    .useKey('Up', false)
    .useKey('Left', true)
    .wait(sprite('Mini Geel').toReach((x, _y) => x <= 15))
    .useKey('Left', false)
    .useKey('Up', true)
    .wait(sprite('Mini Geel').toReach((_x, y) => y >= 100))
    .useKey('Up', false)
    .useKey('Right', true)
    .wait(sprite('Mini Geel').toReach((x, _y) => x >= 30))
    .useKey('Right', false)
    .useKey('Up', true)
    .wait(sprite('Mini Geel').toReach((_x, y) => y >= 120))
    .useKey('Up', false)
    .useKey('Right', true)
    .wait(sprite('Mini Geel').toTouch('Eindmeet'))
    .useKey('Right', false);
}

function blueCar(evaluation, e) {

  // Go down, up, right, left during one second.
  return e
    .useKey('w', true)
    // Go down until we are off the gras.
    .wait(sprite('Mini Blauw').toReach((_x, y) => y < 70))
    .useKey('d', true)
    .wait(sprite('Mini Blauw').toReach((x, y) => x >= -105 && y <= 25))
    .useKey('d', false)
    .wait(sprite('Mini Blauw').toReach((_x, y) => y <= -110))
    .useKey('w', false)
    .useKey('d', true)
    .wait(sprite('Mini Blauw').toTouch('Rots'))
    .useKey('d', false)
    .useKey('w', true)
    // Go down until we are off the gras.
    .wait(sprite('Mini Blauw').toReach((_x, y) => y < 70))
    .useKey('d', true)
    .wait(sprite('Mini Blauw').toReach((x, y) => x >= -105 && y <= 25))
    .useKey('d', false)
    .wait(sprite('Mini Blauw').toReach((_x, y) => y <= -70))
    .useKey('w', false)
    .useKey('d', true)
    .wait(sprite('Mini Blauw').toTouch('Bliksem'))
    .wait(sprite('Mini Geel').toTouch('Eindmeet'))
    .useKey('d', false);
}

/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 300000;

  const green = e.scheduler
    .greenFlag(false);
  const yellow = yellowCar(e, green);
  const blue = blueCar(e, green);
  
  yellow.end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  //
}