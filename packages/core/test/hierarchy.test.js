import { GroupLevel } from '../src/testplan/hierarchy';
import { ResultManager } from '../src/output/index.ts';

test('new flow works', () => {
  const results = [];
  const output = new ResultManager((r) => results.push(r));
  const g = new GroupLevel(output);

  g.group('Groep 1', { sprite: 'Test', visibility: 'show' }, () => {
    g.group('Groep 2', () => {
      g.test('Test 1')
        .feedback({
          correct: 'Hallo',
          wrong: 'No correct at all!',
        })
        .expect('No')
        .toBe('Hallo');
    });
  });

  expect(results).toMatchSnapshot();
});

describe('Should ignore groups with wrong tests', () => {
  test('Correct tests pass through', () => {
    const newResults = [];
    const newOutput = new ResultManager((r) => newResults.push(r));
    const g = new GroupLevel(newOutput);

    g.group('Group 1', { ignoreWrong: true }, () => {
      g.group('Group 2', () => {
        g.test('Hallo').acceptIf(true);
      });
    });

    expect(newResults).toStrictEqual([
      { command: 'start-judgement', version: 2 },
      {
        command: 'start-group',
        name: 'Group 1',
        sprite: undefined,
        tags: [],
        visibility: 'show',
      },
      {
        command: 'start-group',
        name: 'Group 2',
        sprite: undefined,
        tags: [],
        visibility: 'show',
      },
      { command: 'start-test', name: 'Hallo', tags: [] },
      {
        command: 'close-test',
        feedback: undefined,
        status: 'correct',
      },
      { command: 'close-group', summary: undefined },
      { command: 'close-group', summary: undefined },
    ]);
  });

  test('Incorrect tests do not pass', () => {
    const newResults = [];
    const newOutput = new ResultManager((r) => newResults.push(r));
    const g = new GroupLevel(newOutput);

    g.group('Group 1', { ignoreWrong: true }, () => {
      g.group('Group 2', () => {
        g.test('Hallo').acceptIf(false);
      });
    });

    expect(newResults).toStrictEqual([{ command: 'start-judgement', version: 2 }]);
  });
});
