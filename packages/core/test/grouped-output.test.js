import { GroupedResultManager, Status } from '../src/grouped-output';

test('normal usage', () => {
  const results = [];
  const manager = new GroupedResultManager((r) => results.push(r));

  manager.startJudgement();
  manager.startGroup('Groep 1', 'test-sprite');
  manager.startTest('Hallo one test...');
  manager.appendMessage('Hallo');
  manager.appendDiff('expected', 'actual');
  manager.closeTest(Status.Wrong, 'Wrong');
  manager.closeGroup('A nice summary');
  manager.closeJudgement();

  expect(results).toMatchSnapshot();
});
