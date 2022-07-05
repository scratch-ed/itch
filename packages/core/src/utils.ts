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

const Delta = {
  VALUE_CREATED: 'created',
  VALUE_UPDATED: 'updated',
  VALUE_DELETED: 'deleted',
  VALUE_UNCHANGED: 'unchanged',
};

export function deepDiff(obj1: unknown, obj2: unknown) {
  function compareValues(value1: unknown, value2: unknown) {
    if (value1 === value2) {
      return Delta.VALUE_UNCHANGED;
    }
    if (value1 === undefined) {
      return Delta.VALUE_CREATED;
    }
    if (value2 === undefined) {
      return Delta.VALUE_DELETED;
    }
    return Delta.VALUE_UPDATED;
  }

  function isFunction(x: unknown) {
    return typeof x === 'function';
  }

  function isArray(x: unknown) {
    return Array.isArray(x);
  }

  function isObject(x: unknown) {
    return typeof x === 'object';
  }

  function isValue(x: unknown) {
    return !isObject(x) && !isArray(x);
  }

  if (isValue(obj1) || isValue(obj2)) {
    return {
      type: compareValues(obj1, obj2),
      data: obj1 === undefined ? obj2 : obj1,
    };
  }

  if ((!obj1 && obj2) || (obj1 && !obj2)) {
    return {
      type: compareValues(obj1, obj2),
      data: obj1 === undefined ? obj2 : obj1,
    };
  }

  assertType<Record<string, unknown>>(obj1);
  assertType<Record<string, unknown>>(obj2);

  const diff: Record<string, unknown> = {};
  for (const key in obj1) {
    if (isFunction(obj1[key])) {
      continue;
    }

    let value2 = undefined;
    if (obj2[key] !== undefined) {
      value2 = obj2[key];
    }

    diff[key] = deepDiff(obj1[key], value2);
  }
  for (const key in obj2) {
    if (isFunction(obj2[key]) || diff[key] !== undefined) {
      continue;
    }

    diff[key] = deepDiff(undefined, obj2[key]);
  }

  return diff;
}

/**
 * Memoize a function without parameters.
 *
 * The result is a function with the same arguments as the original, but the
 * result will only be computed once.
 * Afterwards, the saved value is used.
 *
 * @param fn The function to memoize.
 */
export function memoize<R>(fn: () => R): () => R {
  let result: R | undefined = undefined;

  return (...args) => {
    if (result === undefined) {
      result = fn(...args);
    }

    return result;
  };
}
