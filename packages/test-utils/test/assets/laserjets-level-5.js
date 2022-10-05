// START OF LEVEL SPECIFIC SETTINGS

const ORDER = [
  ['Groene spiegel', 'Zet klaar voor schieten op groene spiegel'],
  ['Blauwe spiegel', 'Zet klaar voor schieten op blauwe spiegel'],
  ['RodeSpiegel', 'Zet klaar voor schieten op rode spiegel'],
  ['Finish', 'Zet klaar voor schieten op finish'],
];

// END OF LEVEL SPECIFIC SETTINGS

function checkExistingLoop(current, e, mutation = 'Beweeg in een lijn') {
  const substack = current?.input?.SUBSTACK;

  e.group
    .test('Lus')
    .feedback({
      correct: 'De laser blijft schieten tot hij zijn doel raakt.',
      wrong: 'De laser moet blijven schieten tot hij zijn doel raakt.',
    })
    .expect(substack)
    .toMatch(B.procedureCall(mutation));

  return current?.input?.CONDITION;
}

function checkPrepare(current, e, procedure, sprite) {
  e.group
    .test('Klaarzetten')
    .feedback({
      correct: `Goed zo! Je zet de laser klaar voor je schiet op ${sprite}.`,
      wrong: `Je moet de laser eerst klaarzetten, voor je kan schieten op ${sprite}.`,
    })
    .expect(current)
    .toMatch(B.procedureCall(procedure));
}

// HACK, fix later
let laser;

/**
 * @param {Evaluation} e - The output manager.
 */
function beforeExecution(e) {
  const { whenIReceive, stack } = B;

  Itch.checkPredefinedBlocks(
    {
      spriteConfig: {
        Laser: stack(whenIReceive('Level 5')),
      },
      debug: false,
    },
    e,
  );
  laser = e.log.submission.sprite('Laser');
}

function checkPrepareAndLoop(e, current, target) {
  const mutation = target[1];
  target = target[0];
  checkPrepare(current, e, mutation, target);

  current = current?.next;
  let loopMutation;
  if (target === 'Finish') {
    loopMutation = 'Schiet op finish';
  }

  const condition = current?.input?.CONDITION;

  e.group
    .test('Bewegen')
    .feedback({
      correct: `Als de laser wordt klaargezet om te schieten op de ${target}, dan blijft de laser bewegen tot hij deze raakt.`,
      wrong: `Als de laser wordt klaargezet om te schieten op de ${target}, dan moet hij blijven bewegen tot hij deze raakt.`,
    })
    .expect(condition)
    .toMatch(B.isTouching(target));

  checkExistingLoop(current, e, loopMutation);

  current = current?.next;
  return current;
}

/**
 * @param {Evaluation} e
 */
function duringExecution(e) {
  e.actionTimeout = 5000;
  e.turboMode = true;
  e.scheduler
    .greenFlag()
    .sendBroadcast('StartLaser')
    .wait(Itch.broadcast('Succes', 2000))
    .timedOut(() => true)
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const merged = Itch.mergeLines(e.log.renderer.lines);
  const root = laser.findScript(B.whenIReceive('Level 5'));
  let current = root?.next;

  for (let i = 0; i < ORDER.length; i++) {
    const line = merged[i] || { end: { x: 1000, y: 1000 } };
    const element = ORDER[i];

    e.group.group(element[0], () => {
      current = checkPrepareAndLoop(e, current, element);
      const sprite = e.log.last.sprite(element[0]);
      const touches = sprite.touchesPosition(line.end, 15);

      e.group
        .test('Doel geraakt')
        .feedback({
          correct: `De laser schiet en raakt ${element[0]}.`,
          wrong: `De laser moet schieten naar ${element[0]}.`,
        })
        .acceptIf(touches);
    });
  }
}
