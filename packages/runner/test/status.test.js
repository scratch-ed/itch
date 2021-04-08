const { runTest } = require('./integration-runner');

jest.setTimeout(50000);

test('01.space_mission', () => {
  return runTest(`status/${expect.getState().currentTestName}`).then(
    (result) => {
      expect(result).toMatchSnapshot();
      expect(result).everyStatusToBe('correct');
    },
  );
});
