/**
 * Starts a new judgement.
 */
export interface StartJudgement {
  readonly command: 'start-judgement';
  /**
   * A version number for the output format.
   */
  readonly version: 2;
}

/**
 * The visibility of a group.
 *
 * - Show means display this group and all it's children (non-nested).
 * - Collapse means display this group, but hide children,  unless an
 *   error occurs.
 * - Hide means do not display this group, unless an error occurs.
 */
export type Visibility = 'show' | 'collapse' | 'hide';

/**
 * Start a new group in the output.
 */
export interface StartGroup {
  readonly command: 'start-group';
  /** Human-visible name of the group of tests. */
  name: string;
  /** Visibility of the group. */
  visibility: Visibility;
  /** Optionally link this group to a certain sprite. */
  sprite?: string;
}

export interface StartTest {
  readonly command: 'start-test';
  /** Name of the test, shown if no messages were received. */
  name: string;
}

export type Message = string;

/**
 * Append a message to the open object.
 */
export interface AppendMessage {
  readonly command: 'append-message';
  message: Message;
}

/**
 * Append a diff to the open object.
 */
export interface AppendDiff {
  readonly command: 'append-diff';
  expected: string;
  actual: string;
}

export type Status =
  | 'internal error'
  | 'testplan error'
  | 'time limit exceeded'
  | 'wrong'
  | 'correct';

/**
 * Change the global status for the worse.
 */
export interface EscalateStatus {
  readonly command: 'escalate-status';
  status: Status;
}

/**
 * Close a test with a certain status.
 */
export interface CloseTest {
  readonly command: 'close-test';
  status: Status;
  feedback: string;
}

/**
 * Close a group of tests. The status of the group is
 * the worst test status.
 */
export interface CloseGroup {
  readonly command: 'close-group';
  /**
   * Optional summary. If added and correct,
   * the group should only show the summary.
   */
  summary?: string;
}

export interface CloseJudgement {
  readonly command: 'close-judgement';
}

export type Update =
  | StartJudgement
  | StartGroup
  | StartTest
  | AppendMessage
  | AppendDiff
  | EscalateStatus
  | CloseTest
  | CloseGroup
  | CloseJudgement;
