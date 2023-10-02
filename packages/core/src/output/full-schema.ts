import { Status, Visibility } from './partial-schema';

/**
 * Includes an expected and actual value. Can be used to display the difference
 * between the two in case a test is wrong - it might help users to know what
 * failed (e.g. with two strings).
 */
export class Diff {
  /**
   * @param expected - The value that the test plan expected.
   * @param actual - The actual value produced by the submission under test.
   */
  constructor(
    public readonly expected: string,
    public readonly actual: string,
  ) {}
}

/**
 * A test, actually checking if a condition holds for the submission under test.
 */
export class Test {
  /**
   * @param name - Internal name of the test. Only for debugging/identification
   * purposes. Students should not see it.
   * @param status - The status of the test. See the docs for more info.
   * @param feedback - The feedback on the test. This is intended for students.
   * @param messages - Optional additional messages.
   * @param diff - Optional diff.
   */
  constructor(
    public readonly name: string,
    public readonly status: Status,
    public readonly messages: string[],
    public readonly feedback?: string,
    public readonly diff?: Diff,
  ) {}
}

export class Group {
  /**
   * @param name - Name of the group. This is visible to students.
   * @param visibility - Visibility of the group. See the docs.
   * @param messages - Optional additional messages.
   * @param children - Tests and subgroups.
   * @param sprite - If this group is linked to a sprite, its name is included
   * here. This might be useful to include an image of the sprite or something.
   * @param status - Optional status override.
   * @param summary - Optional summary to display. Especially usefull when
   * the group is collapsed.
   */
  constructor(
    public readonly name: string,
    public readonly visibility: Visibility,
    public readonly children: Array<Group | Test>,
    public readonly messages: string[],
    public readonly sprite?: string,
    public readonly status?: Status,
    public readonly summary?: string,
  ) {}
}

export class Meta {
  constructor(
    public totalTests = 0,
    public correctTests = 0,
  ) {}
}

/**
 * Top level object, containing a number of groups.
 */
export class Judgement {
  /**
   * Version of the format.
   */
  public readonly version = 2;

  /**
   * @param children - The groups or tests in this judgement.
   * @param messages - Optional additional messages.
   * @param meta - Metadata about the judgement.
   * @param status - Optional status override.
   */
  constructor(
    public readonly children: Array<Group | Test>,
    public readonly messages: string[],
    public readonly meta: Meta,
    public readonly status?: Status,
  ) {}
}
