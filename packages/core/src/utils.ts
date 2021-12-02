/**
 * Check if two floating points are equal, considering
 * the given epsilon.
 */
export function numericEquals(float1: number, float2: number, epsilon = 0.0001): boolean {
  return Math.abs(float1 - float2) < epsilon;
}

/**
 * Convert a value or function to a function.
 *
 * If the argument is a function, return it.
 * Otherwise, returns a function that returns the value.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function castCallback<F extends (..._args: any) => any>(
  functionOrObject: F | ReturnType<F>,
): F {
  if (typeof functionOrObject === 'function') {
    return functionOrObject;
  } else {
    return (() => functionOrObject) as F;
  }
}

export function ensure<T>(
  argument: T | undefined | null,
  message = 'This value was promised to be there.',
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }

  return argument;
}

interface CorrectMessage {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  correct: string | ((..._args: any[]) => string);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrong?: string | ((..._args: any[]) => string);
}

interface WrongMessage {
  correct?: string | (() => string);
  wrong: string | (() => string);
}

export type MessageData = CorrectMessage | WrongMessage;

export function format(source: string, ...args: string[]): string {
  return source.replace(/{{|}}|{(\d+)}/g, (m, n) => {
    if (m === '{{') {
      return '{';
    }
    if (m === '}}') {
      return '}';
    }
    const index = parseInt(n);
    if (index >= args.length) {
      throw new Error(
        `You have not provided enough formatting values. Expected at least ${index}, got ${args.length}`,
      );
    }
    return args[n];
  });
}

export function stringify(value: unknown): string {
  if (typeof value === 'object' && typeof value?.toString === 'function') {
    return value.toString();
  } else {
    return String(value);
  }
}

/**
 * A strictly type check, as the function itself does nothing.
 * @param value
 */
export function assertType<T>(value: unknown): asserts value is T {
  // Do nothing, this is a type check only.
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
