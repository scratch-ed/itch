import { ResultManager } from '../src/output/index.ts';

test('normal usage', () => {
  const results = [];
  const manager = new ResultManager((r) => results.push(r));

  manager.startJudgement();
  manager.startGroup('Groep 1', 'show', 'test-sprite');
  manager.startTest('Hallo one test...');
  manager.appendMessage('Hallo');
  manager.appendDiff('expected', 'actual');
  manager.closeTest('wrong', 'Wrong');
  manager.closeGroup('A nice summary');
  manager.closeJudgement();

  expect(results).toMatchSnapshot();
});
