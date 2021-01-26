const { runTest, testStatuses } = require('./integration-runner');

jest.setTimeout(1000000);

test('01.space_mission', () => {
  return runTest(`status/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});

// Very slow
test('02.pico_desert', () => {
  return runTest(`status/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});

test('03.space_mission_iterations', () => {
  return runTest(`status/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).exactStatus('correct', 46);
      expect(testStatuses(result)).exactStatus('wrong', 1);
    });
});