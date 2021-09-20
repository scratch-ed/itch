import { GroupLevel } from '../src/hierarchy';
import { GroupedResultManager } from '../src/grouped-output';

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
