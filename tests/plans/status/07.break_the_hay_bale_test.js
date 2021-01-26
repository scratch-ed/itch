/*
Tests that are not implemented yet:
- all ball related tests
- tests for "hooibaal" that they disappear when touched by the ball.
 */
/**
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  // Find all "hooibalen".
  const hooibalen = [];
  for (const sprite of template.sprites()) {
    if (sprite.name.startsWith("Hooi")) {
      hooibalen.push(sprite.name);
    }
  }
  
  output.startTestTab("Hooibalen zijn zichtbaar.");
  
  // Check that every hooibaal is visible.
  for (const found of hooibalen) {
    const sprite = submission.sprite(found);
    output.addTest(`${found} moet zichtbaar zijn`,
      true,
      sprite.visible,
      `De sprite ${found} moet zichtbaar zijn aan het begin van het spel.`);
  }
  
  output.closeTestTab();
}

/** @param {Evaluation} e */
function duringExecution(e) {
  
  e.actionTimeout = 15000;
  let lastX = 0;
  let lastY = 0;
  e.eventScheduling
    .greenFlag({sync: false})
    // .wait(1000)
    // .test('No movement without key press', 'The paddle cannot move when not pressing keys', (log) => {
    //   return !log.hasSpriteMoved('Paddle');
    // })
    .wait(8000)
    .pressKey({ key: 'Left', sync: true })
    .test('Paddle moves to left', 'The paddle must move to the left when the left key is pressed.', (log) => {
      const minX = log.getMinX('Paddle');
      const minY = log.getMinY('Paddle');
      const maxX = log.getMaxX('Paddle');
      const maxY = log.getMaxY('Paddle');
      
      // Also save the position for later.
      const spr = log.sprites.getSprite('Paddle');
      lastX = spr.x;
      lastY = spr.y;
      
      return minX < maxX && numericEquals(minY, maxY);
    })
    .pressKey({ key: 'Right', sync: true })
    .test('Paddle moves to right', 'The paddle must move to the right when the right key is pressed.', (log) => {
      const spr = log.sprites.getSprite('Paddle');
      return lastX < spr.x && numericEquals(lastY, spr.y);
    })
    .end();
}