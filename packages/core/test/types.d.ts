import { BlockStack } from '../src/matcher/patterns';
import type { PatternBlock } from '../src/matcher/patterns';

// Needed for editor
declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchPattern(pattern: PatternBlock | BlockStack): R;
    }
  }
}
