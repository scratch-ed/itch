import { OutputCollector } from '../src/output/collector.ts';
import source from './partial.json';

test('Collector works correctly', () => {
  const collector = new OutputCollector();
  source.forEach((update) => collector.handle(update));
  expect(collector.judgement).toMatchSnapshot();
});
