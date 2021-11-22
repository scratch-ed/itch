import { GroupLevel } from '../src/testplan/hierarchy';
import { GroupedResultManager } from '../src/grouped-output';
import { TabLevel } from '../src/testplan';

test('new flow works', () => {
  const results = [];
  const output = new GroupedResultManager((r) => results.push(r));
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

test('old flow works', () => {
  const results = [];
  const output = new GroupedResultManager((r) => results.push(r));
  const g = new TabLevel(output);

  g.tab('Groep 1', (l) => {
    l.describe('Groep 2', (l) => {
      l.test('Test 1', (l) => {
        l.expect('No')
          .with({
            correct: 'Hallo',
            wrong: 'No correct at all!',
          })
          .toBe('Hallo');
      });
    });
  });

  expect(results).toMatchSnapshot();
});

test('old flow is equivalent to new flow', () => {
  const oldResults = [];
  const output = new GroupedResultManager((r) => oldResults.push(r));
  const t = new TabLevel(output);

  t.tab('Groep 1', (l) => {
    l.describe('Groep 2', (l) => {
      l.test('Test 1', (l) => {
        l.expect('No')
          .with({
            correct: 'Hallo',
            wrong: 'No correct at all!',
          })
          .toBe('Hallo');
      });
    });
  });

  const newResults = [];
  const newOutput = new GroupedResultManager((r) => newResults.push(r));
  const g = new GroupLevel(newOutput);

  g.group('Groep 1', () => {
    g.group('Groep 2', () => {
      g.test('Test 1')
        .feedback({
          correct: 'Hallo',
          wrong: 'No correct at all!',
        })
        .diff()
        .expect('No')
        .toBe('Hallo');
    });
  });

  expect(oldResults).toStrictEqual(newResults);
});
