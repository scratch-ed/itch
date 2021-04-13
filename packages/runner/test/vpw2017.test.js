/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const { runTest } = require('./integration-runner');

jest.setTimeout(50000);

test('01_mad_hatter', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
    },
  );
});

test('02_papegaai', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).everyStatusToBe('correct');
      expect(result).atLeastCommands('close-testcase', 10);
    },
  );
});

test('03_teken_een_vierkant', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
    },
  );
});

test('04_teken_een_driehoek', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
      expect(result).atLeastCommands('close-testcase', 2);
    },
  );
});

test('05_teken_een_huis', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
      expect(result).atLeastCommands('close-testcase', 1);
    },
  );
});

test('06_voetballende_kat', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
      expect(result).atLeastCommands('close-testcase', 2);
    },
  );
});

test('07_heksenjacht_eenvoudig', () => {
  return runTest(
    'vpw2017/07_heksenjacht',
    `vpw2017/${expect.getState().currentTestName}`,
  ).then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
    expect(result).atLeastCommands('close-testcase', 5);
  });
});

test('07_heksenjacht', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
      expect(result).atLeastCommands('close-testcase', 7);
    },
  );
});

test('08_op_bezoek_bij_devin', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
    },
  );
});

test('09_flauw_mopje', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
    },
  );
});

test('11_vang_de_appels', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).atLeastCommands('close-test', 8);
      expect(result).everyStatusToBe('correct');
    },
  );
});

test('13_cijfersom', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
    },
  );
});

test('draw_a_square', () => {
  return runTest(`vpw2017/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
    },
  );
});