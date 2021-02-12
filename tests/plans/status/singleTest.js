function beforeExecution(template, submission, output) {
  // Check that all grid squares have not been changed.
  const squares = Array.from(Array(36).keys()).map((i) => `Vakje${i}`);

  output.startTestTab('Controle op vakjes');
  for (const square of squares) {
    const gen = template.hasChangedSprite(submission, square, (a, b) => {
      return !a.equals(b);
    });
    output.addTest(
      `${square} is niet veranderd`,
      false,
      gen,
      'Er is iets veranderd aan de ingebouwde sprites, waar je niets mag aan veranderen.',
    );
  }
  output.closeTestTab();
}
