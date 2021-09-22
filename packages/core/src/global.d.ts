import { searchFrames } from './log';
import { format, numericEquals } from './utils';
import { broadcast, delay, sprite } from './scheduler/wait';
import {
  asRange,
  generatePositionMessage,
  ignoreWaitInProcedureFor,
  OneHatAllowedTest,
} from './testplan';
import { angle, distSq, mergeLines } from './lines';
import { checkPredefinedBlocks } from './testplan/predefined-blocks';
import { Project } from './project';
import { Evaluation, run } from './evaluation';

declare interface Itch {
  checkPredefinedBlocks: typeof checkPredefinedBlocks;
}

/**
 * @param template - The template project.
 * @param submission - The submission project.
 * @param e - Evaluation object.
 */
declare function beforeExecution(
  template: Project,
  submission: Project,
  e: Evaluation,
): void;

/**
 * Function that is run just before the project is executed, allowing to
 * schedule events, inputs and tests for during the execution. While you
 * have full access to the log in this stage, it might not be properly
 * filled. It is recommend to put tests using the log in the afterExecution
 * step.
 *
 * @param e - Evaluation object.
 */
declare function duringExecution(e: Evaluation): void;

/**
 * Function that is run after the project has been executed. At this
 * point the log is filled, and available for inspection. Mosts tests
 * in this stage are in the category of checking the end state of the
 * execution: checking how the project reacted to the instructions
 * scheduled in the "duringExecution" step.
 *
 * @param e - Evaluation object.
 */
declare function afterExecution(e: Evaluation): void;

// Old stuff.
declare global {
  interface Window {
    /** @deprecated */
    numericEquals: typeof numericEquals;
    /** @deprecated */
    searchFrames: typeof searchFrames;
    /** @deprecated */
    sprite: typeof sprite;
    /** @deprecated */
    broadcast: typeof broadcast;
    /** @deprecated */
    delay: typeof delay;
    /** @deprecated */
    OneHatAllowedTest: typeof OneHatAllowedTest;
    /** @deprecated */
    ignoreWaitInProcedureFor: typeof ignoreWaitInProcedureFor;
    /** @deprecated */
    generatePositionMessage: typeof generatePositionMessage;
    /** @deprecated */
    asRange: typeof asRange;
    /** @deprecated */
    angle: typeof angle;
    /** @deprecated */
    mergeLines: typeof mergeLines;
    /** @deprecated */
    distSq: typeof distSq;

    beforeExecution?: typeof beforeExecution;
    duringExecution?: typeof duringExecution;
    afterExecution?: typeof afterExecution;

    run: typeof run;
    format: typeof format;
    Itch: Itch;
  }
}
