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
    if (sprite.name.startsWith("Hooibaal")) {
      hooibalen.push(sprite.name);
    }
  }
  
  output.startTestCase("Hooibalen zijn zichtbaar.");
  
  // Check that every hooibaal is visible.
  for (const found of hooibalen) {
    output.startTest(true);
    const sprite = submission.sprite(found);
    let status;
    if (sprite.visible) {
      output.addMessage('Er is iets veranderd aan de ingebouwde sprites, waar je niets mag aan veranderen.');
      status = {enum: "wrong", human: "Verkeerd"}
    } else {
      status = {enum: "correct", human: "Juist"}
    }
    output.closeTest(sprite.visible, status);
  }
  
  output.closeTestCase();
}

/** @param {Evaluation} e */
function duringExecution(e) {
  
  let lastX = 0;
  let lastY = 0;
  e.eventScheduling
    .wait(1000)
    .test('No movement without key press', 'The paddle cannot move when not pressing keys', (log) => {
      return !log.hasSpriteMoved('Paddle');
    })
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
    });
}