/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const { runTest, testStatuses } = require('./integration-runner');

jest.setTimeout(20000);

test('01_mad_hatter', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});

test('02_papegaai', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).onlyStatusesIs('correct');
      expect(result).minimumCommands('close-testcase', 20);
    });
});

test('03_teken_een_vierkant', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});

test('04_teken_een_driehoek', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).onlyStatusesIs('correct');
      expect(result).minimumCommands('close-testcase', 2);
    });
});

test('05_teken_een_huis', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).onlyStatusesIs('correct');
      expect(result).minimumCommands('close-testcase', 1);
    });
});

test('06_voetballende_kat', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).onlyStatusesIs('correct');
      expect(result).minimumCommands('close-testcase', 3);
    });
});

test('07_heksenjacht_eenvoudig', () => {
  return runTest('vpw2017/07_heksenjacht', `vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).onlyStatusesIs('correct');
      expect(result).minimumCommands('close-testcase', 6);
    });
});

test('07_heksenjacht', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).onlyStatusesIs('correct');
      expect(result).minimumCommands('close-testcase', 9);
    });
});

test('08_op_bezoek_bij_devin', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});

test('09_flauw_mopje', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});

// TODO: no tests at the moment
// test("10_oppervlakte_van_een_cirkel", () => {
//     return runTest(`vpw2017/${expect.getState().currentTestName}`)
//         .then(result => expect(result).toMatchSnapshot());
// })

// TODO: no assertions at the moment
// test("11_vang_de_appels", () => {
//     return runTest(`vpw2017/${expect.getState().currentTestName}`)
//         .then(result => expect(result).toMatchSnapshot());
// })

// TODO: no tests at the moment
// There is currently no test code for this exercise.
// test("12_woord_herhalen", () => {
//     return runTest(`vpw2017/${expect.getState().currentTestName}`)
//         .then(result => expect(result).toMatchSnapshot());
// })

test('13_cijfersom', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});

test('draw_a_square', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`)
    .then(result => expect(result).toMatchSnapshot());
});