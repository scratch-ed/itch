/** @param {Evaluation} e */
function beforeExecution(e) {
  const { anything, forever } = B;
  const block = e.log.submission.sprite('Sprite1').blockTreeList()[0];

  e.out.test('Herhaal').expect(block).toMatch(forever(anything()));
}
