/**
 * Check that the original sprites were not changed.
 * @param {Evaluation} e - The output manager.
 */
function beforeExecution(e) {
  const {
    stack,
    wait,
    hide,
    whenIReceive,
    show,
    anything,
    setSizeTo,
    goTo,
    forever,
    pointTowards,
    moveXSteps,
    procedureCall,
    glideZSecsToX,
    checkBlocks,
  } = B;
  const sizeFinder = [stack(whenIReceive(t(':Start:')), setSizeTo(anything()))];
  const showFinder = [stack(whenIReceive(t(':Start:')), show())];

  Itch.checkPredefinedBlocks(
    {
      spriteConfig: {
        [t(':Planeet:')]: showFinder,
        [t(':Vijand:') + ' 1']: sizeFinder,
        [t(':Vijand:') + ' 2']: sizeFinder,
        [t(':Voedsel:') + ' 1']: sizeFinder,
        [t(':Voedsel:') + ' 2']: sizeFinder,
        [t(':Voedsel:') + ' 3']: sizeFinder,
        [t(':Voedsel:') + ' 4']: sizeFinder,
      },
      debug: false,
    },
    e,
  );

  e.group.group({ sprite: t(':Planeet:') }, () => {
    const planet = e.log.submission.sprite(t(':Planeet:'));
    const ourRoot = planet.findScript(whenIReceive(t(':Start:')), show());
    let current = ourRoot?.next?.next?.next;

    // This is an experimental function, allowing to describe the expected
    // block structure in a more declarative way, including the expected
    // feedback when a node of the expected block tree is not correct.
    checkBlocks(e, current, [
      {
        pattern: forever(anything()),
        feedback: {
          correct: t(':AIO_TP_BeweegLusJuist:', t(':Planeet:')),
          wrong: t(':AIO_TP_BeweegLusFout:', t(':Planeet:')),
        },
        subgroup: false,
        name: t(':AIO_Titel_JuisteLus:'),
        substack: [
          {
            name: t(':Titel_RichtNaarMuis:'),
            pattern: pointTowards('_mouse_'),
            feedback: {
              correct: t(':AIO_TP_BeweegMuisJuist:'),
              wrong: t(':AIO_TP_BeweegMuisFout:'),
            },
          },
          {
            name: t(':Titel_Beweegt:'),
            feedback: {
              correct: t(':AIO_TP_BeweegStappenJuist:'),
              wrong: t(':AIO_TP_BeweegStappenFout:'),
            },
            pattern: moveXSteps(5),
          },
        ],
      },
    ]);

    // TODO: a choice, like below, is currently not possible with the block DSL.
    current = current?.input?.SUBSTACK || current;
    current = current?.next;

    // The next two blocks can be switched around.
    function testSizeChange(current) {
      e.group
        .test(t(':Titel_VeranderGrootte:'))
        .feedback({
          correct: t(':AIO_TP_GrootteJuist:'),
          wrong: t(':AIO_TP_GrootteFout:'),
        })
        .expect(current)
        .toMatch(procedureCall(t(':GroterKleiner:')));
    }

    function testSpeedChange(current) {
      e.group
        .test(t(':Titel_VeranderSnelheid:'))
        .feedback({
          correct: t(':AIO_TP_SnelheidJuist:'),
          wrong: t(':AIO_TP_SnelheidFout:'),
        })
        .expect(current)
        .toMatch(procedureCall(t(':SnelheidAanpassenGrootte:')));
    }

    current = current?.next;
    if (B.nodeMatchesPattern(current, procedureCall(t(':GroterKleiner:')))) {
      // Changing size is first.
      testSizeChange(current);
      current = current?.next;
      testSpeedChange(current);
    } else {
      // Speed change is first
      testSpeedChange(current);
      current = current?.next;
      testSizeChange(current);
    }
  });

  for (const name of [t(':Vijand:') + ' 1', t(':Vijand:') + ' 2']) {
    e.group.group({ sprite: name }, () => {
      const enemy = e.log.submission.sprite(name);
      const ourRoot = enemy.findScript(whenIReceive(t(':Start:')));
      let current = ourRoot?.next?.next?.next;

      checkBlocks(e, current, [
        {
          name: t(':Titel_JuisteLus:'),
          feedback: {
            correct: t(':AIO_TP_BeweegLusJuist:', name),
            wrong: t(':AIO_TP_BeweegLusFout:', name),
          },
          subgroup: false,
          pattern: forever(anything()),
          substack: [
            {
              name: t(':Titel_RichtNaarMuis:'),
              feedback: {
                correct: t(':AIO_TP_BewegenJuist:', name),
                wrong: t(':AIO_TP_BewegenFout:', name),
              },
              pattern: glideZSecsToX(5, '_random_'),
            },
          ],
        },
      ]);
    });
  }

  for (const name of [
    t(':Voedsel:') + ' 1',
    t(':Voedsel:') + ' 2',
    t(':Voedsel:') + ' 3',
    t(':Voedsel:') + ' 4',
  ]) {
    e.group.group({ sprite: name }, () => {
      const enemy = e.log.submission.sprite(name);
      const trees = enemy.blockTree();
      // TODO: we cannot yet have negation (e.g. not).
      const ourRoot = Array.from(trees).find(
        (s) =>
          B.nodeMatchesPattern(s, whenIReceive(t(':Start:'))) &&
          s.next?.opcode !== 'data_setvariableto',
      );
      let current = ourRoot?.next?.next;

      checkBlocks(e, current, [
        {
          name: t(':Titel_JuisteLus:'),
          feedback: {
            correct: t(':AIO_TP_BeweegLusJuist:', name),
            wrong: t(':AIO_TP_BeweegLusFout:', name),
          },
          pattern: forever(anything()),
          substack: [
            {
              feedback: {
                correct: t(':AIO_TP_VerdwijntJuist:', name),
                wrong: t(':AIO_TP_VerdwijntFout:', name),
              },
              pattern: hide(),
            },
            {
              feedback: {
                correct: t(':AIO_TP_WaitCorrect:', name),
                wrong: t(':AIO_TP_WaitFout:', name),
              },
              pattern: wait(1),
            },
            {
              feedback: {
                correct: t(':AIO_TP_WillekeurigJuist:', name),
                wrong: t(':AIO_TP_WillekeurigFout:', name),
              },
              pattern: goTo('_random_'),
            },
            {
              feedback: {
                correct: t(':AIO_TP_VerschijntJuist:', name),
                wrong: t(':AIO_TP_VerschijntFout:', name),
              },
              pattern: show(),
            },
            {
              feedback: {
                correct: t(':AIO_TP_BeweegWillekeurigJuist:', name),
                wrong: t(':AIO_TP_BeweegWillekeurigFout:', name),
              },
              pattern: procedureCall(t(':BeweegWillekeurigeRichtingPlaneet:')),
            },
          ],
        },
      ]);
    });
  }
}
