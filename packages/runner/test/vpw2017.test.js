/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const { runTest: originalRunner } = require('./integration-runner');

function runTest() {
  return originalRunner(undefined, null, { skipTranslations: true });
}

jest.setTimeout(50000);

test('01_mad_hatter', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('02_papegaai', () => {
  return runTest().then((result) => {
    expect(result).everyStatusToBe('correct');
    expect(result).toMatchSnapshot();
  });
});

test.skip('03_teken_een_vierkant', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('04_teken_een_driehoek', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
    expect(result).atLeastCommands('close-testcase', 2);
  });
});

test.skip('05_teken_een_huis', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
    expect(result).atLeastCommands('close-testcase', 1);
  });
});

test('06_voetballende_kat', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('07_heksenjacht', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('08_op_bezoek_bij_devin', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('09_flauw_mopje', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('11_vang_de_appels', () => {
  return runTest().then((result) => {
    expect(result).atLeastCommands('close-test', 8);
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('13_cijfersom', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
    expect(result).everyStatusToBe('correct');
  });
});

test.skip('draw_a_square', () => {
  return runTest().then((result) => {
    expect(result).toMatchSnapshot();
  });
});
