// START OF LEVEL SPECIFIC SETTINGS

let ORDER;

// END OF LEVEL SPECIFIC SETTINGS

function checkExistingLoop(current, e, mutation = t(':BeweegInLijn:')) {
  const substack = current?.input?.SUBSTACK;

  e.group
    .test(t(':Titel_Lus:'))
    .feedback({
      correct: t(':L_TP_LusJuist:'),
      wrong: t(':L_TP_LusFout:'),
    })
    .expect(substack)
    .toMatch(B.procedureCall(mutation));

  return current?.input?.CONDITION;
}

function checkPrepare(current, e, procedure, sprite) {
  e.group
    .test(t(':Titel_ZetKlaar:'))
    .feedback({
      correct: t(':L_TP_KlaarzettenJuist:', sprite),
      wrong: t(':L_TP_KlaarzettenFout:', sprite),
    })
    .expect(current)
    .toMatch(B.procedureCall(procedure));
}

// HACK, fix later
let laser;

/**
 * Check that the original sprites were not changed.
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} e - The output manager.
 */
function beforeExecution(e) {
  ORDER = [
    [t(':GroeneSpiegel:'), t(':SchietenNaarGroeneSpiegel:')],
    [t(':BlauweSpiegel:'), t(':SchietenNaarBlauweSpiegel:')],
    [t(':RodeSpiegel:'), t(':SchietenNaarRodeSpiegel:')],
    [t(':Finish:'), t(':SchietenNaarFinish:')],
  ];

  const { whenIReceive, stack } = B;

  Itch.checkPredefinedBlocks(
    {
      spriteConfig: {
        [t(':Laser:')]: stack(whenIReceive(t(':Level5:'))),
      },
      debug: false,
    },
    e,
  );
  laser = e.log.submission.sprite(t(':Laser:'));
}

function checkPrepareAndLoop(e, current, target) {
  const mutation = target[1];
  target = target[0];
  checkPrepare(current, e, mutation, target);

  current = current?.next;
  let loopMutation;
  if (target === t(':Finish:')) {
    loopMutation = t(':SchietOpFinish:');
  }

  const condition = current?.input?.CONDITION;

  e.group
    .test(t(':Titel_Beweegt:'))
    .feedback({
      correct: t(':L_TP_SchietenJuist:', target),
      wrong: t(':L_TP_SchietenFout:', target),
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
    .sendBroadcast(t(':StartLaser:'))
    .wait(Itch.broadcast(t(':Succes:'), 2000))
    .timedOut(() => true)
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const merged = Itch.mergeLines(e.log.renderer.lines);
  const root = laser.findScript(B.whenIReceive(t(':Level5:')));
  let current = root?.next;

  for (let i = 0; i < ORDER.length; i++) {
    const line = merged[i] || { end: { x: 1000, y: 1000 } };
    const element = ORDER[i];

    e.group.group(element[0], () => {
      current = checkPrepareAndLoop(e, current, element);
      const sprite = e.log.last.sprite(element[0]);
      const touches = sprite.touchesPosition(line.end, 15);

      e.group
        .test(t(':Titel_CorrectTarget:'))
        .feedback({
          correct: t(':L_TP_SchietEnRaaktJuist:', element[0]),
          wrong: t(':L_TP_SchietEnRaaktFout:', element[0]),
        })
        .expect(touches)
        .toBe(true);
    });
  }
}
