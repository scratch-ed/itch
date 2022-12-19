const { execute } = require('@ftrprf/judge-test-utils');

jest.setTimeout(60000);

describe.each([
  ['agario', 'Starter'],
  ['alien-claw'],
  ['alientje-klop'],
  // ['battle-royale'],
  ['bouw-de-raket', 'Start V2'],
  ['breng-de-groep-veilig'],
  ['catch-the-aliens'],
  ['chaos-in-de-raket', 'Starter V2'],
  ['cosmos-flight'],
  ['crewdans'],
  ['dinner-time', 'Level 1', 'Level 1 oplossing'],
  ['dinner-time', 'Level 2', 'Level 2 oplossing'],
  ['dinner-time', 'Level 3', 'Level 3 oplossing'],
  ['dinner-time', 'Level 4', 'Level 4 oplossing'],
  ['dinner-time', 'Level 5', 'Level 5 oplossing'],
  ['dinner-time', 'Level 6', 'Level 6 oplossing'],
  ['dinner-time', 'Level 7', 'Level 7 oplossing'],
  ['dinner-time', 'Level 8', 'Level 8 oplossing'],
  ['dinner-time', 'Level 9', 'Level 9 oplossing'],
  ['dinner-time', 'Level 10', 'Level 10 oplossing'],
  ['dinner-time', 'extra-Level 1', 'extra-Level 1 oplossing'],
  ['dinner-time', 'extra-Level 2', 'extra-Level 2 oplossing'],
  ['dinner-time', 'extra-Level 3', 'extra-Level 3 oplossing'],
  ['dinner-time', 'extra-Level 4', 'extra-Level 4 oplossing'],
  ['dinner-time', 'extra-Level 5', 'extra-Level 5 oplossing'],
  ['dokter-david-training'],
  ['eerste-testvlucht', 'Starter'],
  ['feverswitch'],
  ['geld-inzamelen', 'Level 1', 'Level 1 oplossing', 'plan-1'],
  ['geld-inzamelen', 'Level 2', 'Level 2 oplossing', 'plan-2'],
  ['geld-inzamelen', 'Level 3', 'Level 3 oplossing', 'plan-3'],
  ['geld-inzamelen', 'Level 4', 'Level 4 oplossing', 'plan-4'],
  ['geld-inzamelen', 'Level 5', 'Level 5 oplossing', 'plan-5'],
  // ['help-dokter-david', 'Level 1', 'Level 1 oplossing', 'plan-1'],
  // ['help-dokter-david', 'Level 2', 'Level 2 oplossing', 'plan-2'],
  // ['help-dokter-david', 'Level 3', 'Level 3 oplossing', 'plan-3'],
  // ['help-dokter-david', 'Level 4', 'Level 4 oplossing', 'plan-4'],
  // ['help-dokter-david', 'Level 5', 'Level 5 oplossing', 'plan-5'],
  // ['help-dokter-david', 'Level 6', 'Level 6 oplossing', 'plan-6'],
  // ['help-dokter-david', 'extra-Level 1', 'extra-Level 1 oplossing', 'plan-extra1'],
  // ['help-dokter-david', 'extra-Level 2', 'extra-Level 2 oplossing', 'plan-extra2'],
  // ['help-dokter-david', 'extra-Level 3', 'extra-Level 3 oplossing', 'plan-extra3'],
  // ['herverdeel-de-stroom', 'Starter'],
  ['introductie'],
  ['jetpack', 'Starter'],
  // ['koppel-motoren-los', 'Starter'],
  // ['laserjets', 'Level 1', 'Level 1 oplossing', 'plan-1'],
  ['laserjets', 'Level 2', 'Level 2 oplossing', 'plan-2'],
  ['laserjets', 'Level 3', 'Level 3 oplossing', 'plan-3'],
  // ['laserjets', 'Level 4', 'Level 4 oplossing', 'plan-4'],
  ['laserjets', 'Level 5', 'Level 5 oplossing', 'plan-5'],
  ['laserjets', 'Level 6', 'Level 6 oplossing', 'plan-6'],
  ['laserjets', 'Level 7', 'Level 7 oplossing', 'plan-7'],
  ['laserjets', 'Level 8', 'Level 8 oplossing', 'plan-8'],
  ['laserjets', 'Level 9', 'Level 9 oplossing', 'plan-9'],
  ['laserjets', 'Level 10', 'Level 10 oplossing', 'plan-10'],
  ['laserjets', 'extra-Level 1', 'extra-Oplossing level 1', 'plan-extra1'],
  ['laserjets', 'extra-Level 2', 'extra-Oplossing level 2', 'plan-extra2'],
  // ['laserjets', 'extra-Level 3', 'extra-Oplossing level 3', 'plan-extra3'],
  // ['laserjets', 'extra-Level 4', 'extra-Oplossing level 4', 'plan-extra4'],
  // ['laserjets', 'extra-Level 5', 'extra-Oplossing level 5', 'plan-extra5'],
  ['maanbal', 'Starter'],
  ['methodes'],
  ['methodes-met-parameters'],
  ['navigeer-rommel', 'Level 1', 'Level 1 oplossing', 'plan-1'],
  ['navigeer-rommel', 'Level 2', 'Level 2 oplossing', 'plan-2'],
  ['navigeer-rommel', 'Level 3', 'Level 3 oplossing', 'plan-3'],
  ['navigeer-rommel', 'Level 4', 'Level 4 oplossing', 'plan-4'],
  ['navigeer-rommel', 'Level 5', 'Level 5 oplossing', 'plan-5'],
  // ['navigeer-rommel', 'Level 6', 'Level 6 oplossing', 'plan-6'],
  // ['navigeer-rommel', 'Level 10', 'Level 10 oplossing', 'plan-10'],
  ['navigeer-rommel', 'extra-Level 1', 'extra-Level 1 oplossing', 'plan-extra1'],
  ['navigeer-rommel', 'extra-Level 2', 'extra-Level 2 oplossing', 'plan-extra2'],
  ['navigeer-rommel', 'extra-Level 3', 'extra-Level 3 oplossing', 'plan-extra3'],
  ['parameters'],
  // ['plant-de-vlag', 'Starter'],
  // ['r0nn-op-avontuur'],
  ['red-light-green-light', 'Level 1', 'Level 1 oplossing', 'plan-1'],
  ['red-light-green-light', 'Level 2', 'Level 2 oplossing', 'plan-2'],
  ['red-light-green-light', 'Level 3', 'Level 3 oplossing', 'plan-3'],
  ['richt-de-raket', 'Start'],
  ['rommelruimend', 'Level 1 V2', 'Level 1 oplossing V2', 'plan-1'],
  ['rommelruimend', 'Level 2 V2', 'Level 2 oplossing V2', 'plan-2'],
  ['sloopbal'],
  // These are just broken...
  // ['vang-de-items', 'Opgave', 'Oplossing Basis'],
  // ['vang-de-items', 'Opgave', 'Oplossing Medium'],
  // ['vang-de-items', 'Opgave', 'Oplossing Extra'],
  ['vernietig-de-asteroiden', 'Starter'],
  ['verzamel-de-grondstoffen'],
  // ['vliegtest', 'Level 1', 'Level 1 oplossing'],
  // ['vliegtest', 'Level 2', 'Level 2 oplossing'],
  // ['vliegtest', 'Level 3', 'Level 3 oplossing'],
  // ['vliegtest', 'Level 4', 'Level 4 oplossing'],
  // ['vliegtest', 'Level 5', 'Level 5 oplossing'],
  // ['vliegtest', 'Level 6', 'Level 6 oplossing'],
  // ['vliegtest', 'Level 7', 'Level 7 oplossing'],
  // ['vliegtest', 'Level 8', 'Level 8 oplossing'],
  // ['vliegtest', 'extra-Level 1', 'extra-Level 1 oplossing'],
  // ['vliegtest', 'extra-Level 2', 'extra-Level 2 oplossing'],
  // ['vliegtest', 'extra-Level 3', 'extra-Level 3 oplossing'],
  // ['vliegtest', 'extra-Level 4', 'extra-Level 4 oplossing'],
  ['zet-de-lasers-uit', 'Starter'],
  ['julia-op-pad'],
  // ['deliverice', 'Level 1 opgave', 'Level 1 oplossing', 'plan-1'],
  // ['deliverice', 'Level 2 opgave', 'Level 2 oplossing', 'plan-2'],
  // ['deliverice', 'Level 3 opgave', 'Level 3 oplossing', 'plan-3'],
  // ['deliverice', 'Level 4 opgave', 'Level 4 oplossing', 'plan-4'],
  // ['deliverice', 'Level 5 opgave', 'Level 5 oplossing', 'plan-5'],
  // ['deliverice', 'Level 6 opgave', 'Level 6 oplossing', 'plan-6'],
  // ['deliverice', 'Level 7 opgave', 'Level 7 oplossing', 'plan-7'],
  // ['deliverice', 'Level 8 opgave', 'Level 8 oplossing', 'plan-8'],
  // ['rijexamen', 'Opgave Level 1', 'Oplossing Level 1'],
  // ['rijexamen', 'Opgave Level 2', 'Oplossing Level 2'],
  // ['rijexamen', 'Opgave Level 3', 'Oplossing Level 3'],
  // ['rijexamen', 'Opgave Level 4', 'Oplossing level 4'],
  // ['rijexamen', 'Opgave Level 5', 'Oplossing Level 5'],
  // ['rijexamen', 'Opgave Level 6', 'Oplossing Level 6'],
  ['save-the-icecream', 'STARTER', 'SOLUTION'],
  ['color-connect', 'Starter', 'Solution'],
  ['beat-the-monsters', 'Opgave', 'Oplossing'],
  ['agario-lager-onderwijs', 'Opgave', 'Oplossing'],
  ['vang-de-ijsjes', 'Opgave', 'Oplossing'],
  ['pong', 'Opgave', 'Oplossing'],
  ['maze-al', 'Opgave', 'Oplossing'],
  ['spacegems', 'Opgave', 'Oplossing'],
  ['police-pursuit', 'Starter', 'Solution'],
  ['meteorenslag', 'STARTER', 'SOLUTION'],
  // Flake somehow?
  // ['survival-of-the-fittest', 'Level 1 Opgave', 'Level 1 Oplossing'],
  // ['survival-of-the-fittest', 'Level 2 Opgave', 'Level 2 Oplossing'],
  // ['survival-of-the-fittest', 'Level 3 Opgave', 'Level 3 Oplossing'],
  // ['survival-of-the-fittest', 'Level 4 Opgave', 'Level 4 Oplossing'],
  // ['survival-of-the-fittest', 'Level 5 Opgave', 'Level 5 Oplossing'],
  // ['survival-of-the-fittest', 'Level 6 Opgave', 'Level 6 Oplossing'],
  // ['survival-of-the-fittest', 'Level 7 Opgave', 'Level 7 Oplossing'],
  // ['survival-of-the-fittest', 'Level 8 Opgave', 'Level 8 Oplossing'],
  ['spacegems-zoek-de-bug', 'STARTER', 'SOLUTION'],
  ['meteorenslag-zoek-de-bug', 'STARTER', 'SOLUTION'],
  ['bomberman-zoek-de-bug', 'STARTER', 'SOLUTION'],
])(
  '%s %s %s',
  (name, template = 'Opgave', solution = 'Oplossing', plan = 'plan', only = false) => {
    if (only) {
      return;
    }
    const path = `./exercises/${name}`;
    test.concurrent('Correct solution is accepted', () => {
      return execute(path, template, solution, plan).then((result) => {
        expect(result).atLeastStatuses('correct', 1);
        expect(result).everyStatusToBe('correct');
      });
    });

    test.concurrent('Template is rejected', () => {
      return execute(path, template, template, plan).then((result) => {
        expect(result).atLeastStatuses('wrong', 1);
      });
    });
  },
);
