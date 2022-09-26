/* Copyright (C) 2020 Ghent University - All Rights Reserved */
const { runTest: originalRunner } = require('./integration-runner.js');

function runTest(projectName = undefined, testName = undefined) {
  return originalRunner(projectName, testName, { skipTranslations: true, debug: false });
}

jest.setTimeout(50000);

test('01_mad_hatter', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 29);
    expect(result).toMatchSnapshot();
  });
});

test('03_teken_een_vierkant', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 3);
    expect(result).toMatchSnapshot();
  });
});

test('04_teken_een_driehoek', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 2);
    expect(result).toMatchSnapshot();
  });
});

test('06_voetballende_kat', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 2);
    expect(result).toMatchSnapshot();
  });
});

test('07_heksenjacht', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 4);
    expect(result).toMatchSnapshot();
  });
});

test('07_heksenjacht_eenvoudig', () => {
  return runTest('07_heksenjacht', '07_heksenjacht_eenvoudig').then((result) => {
    expect(result).exactStatuses('correct', 6);
    expect(result).toMatchSnapshot();
  });
});

test('08_op_bezoek_bij_devin', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 4);
    expect(result).toMatchSnapshot();
  });
});

test('09_flauw_mopje', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 10);
    expect(result).toMatchSnapshot();
  });
});

test('11_vang_de_appels', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 7);
    expect(result).toMatchSnapshot();
  });
});

test('13_cijfersom', () => {
  return runTest().then((result) => {
    expect(result).exactStatuses('correct', 3);
    expect(result).toMatchSnapshot();
  });
});
