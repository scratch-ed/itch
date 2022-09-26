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
  const sizeFinder = [stack(whenIReceive('Start'), setSizeTo(anything()))];
  const showFinder = [stack(whenIReceive('Start'), show())];

  Itch.checkPredefinedBlocks(
    {
      spriteConfig: {
        ['Planeet']: showFinder,
        ['Vijand 1']: sizeFinder,
        ['Vijand 2']: sizeFinder,
        ['Voedsel 1']: sizeFinder,
        ['Voedsel 2']: sizeFinder,
        ['Voedsel 3']: sizeFinder,
        ['Voedsel 4']: sizeFinder,
      },
      debug: false,
    },
    e,
  );

  e.group.group({ sprite: 'Planeet' }, () => {
    const planet = e.log.submission.sprite('Planeet');
    const ourRoot = planet.findScript(whenIReceive('Start'), show());
    let current = ourRoot?.next?.next?.next;

    // This is an experimental function, allowing to describe the expected
    // block structure in a more declarative way, including the expected
    // feedback when a node of the expected block tree is not correct.
    B.checkBlocks(e, current, [
      {
        pattern: forever(anything()),
        feedback: {
          correct: 'De planeet kan oneindig lang bewegen.',
          wrong: 'Planeet moet oneindig lang bewegen.',
        },
        subgroup: false,
        name: 'Juiste lus',
        substack: [
          {
            name: 'Naar muis richten',
            pattern: pointTowards('_mouse_'),
            feedback: {
              correct: 'De planeet richt zich naar de muis.',
              wrong: 'De planeet moet zich eerst naar de muis richten.',
            },
          },
          {
            name: 'Bewegen',
            pattern: moveXSteps(5),
            feedback: {
              correct: 'De planeet zet 5 stappen.',
              wrong: 'Nadien moet de planeet 5 stappen nemen.',
            },
          },
          B.anyOrder([
            {
              name: 'Snelheid veranderen',
              pattern: procedureCall('Verander snelheid volgens grootte'),
              feedback: {
                correct: 'De planeet verandert zijn snelheid.',
                wrong: 'De planeet moet zijn snelheid veranderen.',
              },
            },
            {
              name: 'Grootte veranderen',
              pattern: procedureCall('Maak me groter of kleiner wanneer ik object raak'),
              feedback: {
                correct: 'De planeet verandert zijn grootte.',
                wrong: 'De planeet moet zijn grootte veranderen.',
              },
            },
          ]),
        ],
      },
    ]);
  });

  for (const name of ['Vijand 1', 'Vijand 2']) {
    e.group.group({ sprite: name }, () => {
      const enemy = e.log.submission.sprite(name);
      const ourRoot = enemy.findScript(whenIReceive('Start'));
      let current = ourRoot?.next?.next?.next;

      checkBlocks(e, current, [
        {
          name: 'Juiste lus',
          feedback: {
            correct: 'De planeet kan oneindig lang bewegen.',
            wrong: `${name} moet oneindig lang bewegen.`,
          },
          subgroup: false,
          pattern: forever(anything()),
          substack: [
            {
              name: 'Naar muis richten',
              feedback: {
                correct: `${name} beweegt zich binnen de 5 seconden naar een willekeurige positie.`,
                wrong: `${name} moet zich binnen de 5 seconden naar een willekeurige positie verplaatsen.`,
              },
              pattern: glideZSecsToX(5, '_random_'),
            },
          ],
        },
      ]);
    });
  }

  for (const name of ['Voedsel 1', 'Voedsel 2', 'Voedsel 3', 'Voedsel 4']) {
    e.group.group({ sprite: name }, () => {
      const enemy = e.log.submission.sprite(name);
      const trees = enemy.blockTree();
      // TODO: we cannot yet have negation (e.g. not).
      const ourRoot = Array.from(trees).find(
        (s) =>
          B.nodeMatchesPattern(s, whenIReceive('Start')) &&
          s.next?.opcode !== 'data_setvariableto',
      );
      let current = ourRoot?.next?.next;

      checkBlocks(e, current, [
        {
          name: 'Juiste lus',
          feedback: {
            correct: 'De planeet kan oneindig lang bewegen.',
            wrong: `${name} moet oneindig lang bewegen.`,
          },
          pattern: forever(anything()),
          substack: [
            {
              feedback: {
                correct: `${name} begint onzichtbaar.`,
                wrong: `${name} moet onzichtbaar beginnen.`,
              },
              pattern: hide(),
            },
            {
              feedback: {
                correct: `${name} wacht één seconde.`,
                wrong: `${name} moet één seconde wachten.`,
              },
              pattern: wait(1),
            },
            {
              feedback: {
                correct: `${name} gaat naar een willekeurige positie.`,
                wrong: `${name} moet naar een willekeurige positie gaan.`,
              },
              pattern: goTo('_random_'),
            },
            {
              feedback: {
                correct: `${name} verschijnt.`,
                wrong: `${name} moet zichtbaar worden.`,
              },
              pattern: show(),
            },
            {
              feedback: {
                correct: `${name} beweegt in een willekeurige richting tot het de planeet raakt.`,
                wrong: `${name} moet in een willekeurige richting bewegen tot het de planeet raakt.`,
              },
              pattern: procedureCall(
                'Beweeg in een willekeurige richting tot je de planeet raakt',
              ),
            },
          ],
        },
      ]);
    });
  }
}
