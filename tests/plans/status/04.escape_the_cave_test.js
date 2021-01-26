/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 */
function beforeExecution(template, submission, output) {
  
  // Check that the sprites have blocks.
  const sprites = ['Hindernis 1', 'Hindernis 2', 'Hindernis 3', 'Hindernis 4', 'Rots'];
  for (const name of sprites) {
    const sprite = submission.sprite(name);
    output.addTest(`${name} heeft code`,
      true,
      Object.keys(sprite.blocks).length >= 3,
      `De sprite ${name} moet blokken hebben.`
      );
  }
  
  // Static checks are done here.
  const sprite1 = submission.sprite('Hindernis 1');
  // Find loop block.

  // TODO: check if effectively repeat.
  const repeat = sprite1.getFirst('control_repeat');
  const repeatUntil = sprite1.getFirst('control_repeat_until');
  
  output.addTest("Hindernis 1 gebruikt de juiste soort lus",
    true,
    repeat !== null || repeatUntil !== null,
    "Hindernis 1 moet de juiste lus gebruiken."
    );
  
  const sprite2 = submission.sprite('Hindernis 2');
  const repeatForever = sprite2.getFirst('control_forever');
  output.addTest("Hindernis 2 gebruikt de juiste lus",
    true,
    repeatForever !== null,
    "Hindernis 2 moet een oneindige lus gebruiken"
    );
  
  const sprite3 = submission.sprite('Hindernis 3');
  const repeatForever3 = sprite3.getFirst('control_forever');
  output.addTest("Hindernis 3 gebruikt de juiste lus",
    true,
    repeatForever3 !== null,
    "Hindernis 3 moet een oneindige lus gebruiken"
  );
}

// TODO: add dynamic tests.
// Also think about how we can improve this.