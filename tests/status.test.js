const { runTest, testStatuses } = require('./integration-runner');

jest.setTimeout(20000);

test('01.space_mission', () => {
  return runTest(`status/${expect.getState().currentTestName}`)
    .then(result => {
      expect(result).toMatchSnapshot();
      expect(testStatuses(result)).allStatusesAre('correct');
    });
});