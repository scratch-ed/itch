// Neede for https://github.com/LLK/scratch-gui/issues/5025
import 'regenerator-runtime/runtime';

import seed from 'seed-random';
import { Log, searchFrames } from './log';
import { numericEquals, format } from './utils';
import { Context } from './context';
import { Project } from './project';
import { ScheduledEvent } from './scheduler/scheduled-event';
import { broadcast, delay, sprite } from './scheduler/wait';
import {
  asRange,
  FatalErrorException,
  generatePositionMessage,
  ignoreWaitInProcedureFor,
  OneHatAllowedTest,
  TabLevel,
} from './testplan';
import { ResultManager } from './output';
// import { distSq } from './lines.js';

import type VirtualMachine from '@ftrprf/judge-scratch-vm-types';
import { angle, distSq, mergeLines } from './lines';
import { initialiseTranslations, LanguageData, t } from './i18n';

declare global {
  interface Window {
    numericEquals: typeof numericEquals;
    searchFrames: typeof searchFrames;
    sprite: typeof sprite;
    broadcast: typeof broadcast;
    delay: typeof delay;
    OneHatAllowedTest: typeof OneHatAllowedTest;
    ignoreWaitInProcedureFor: typeof ignoreWaitInProcedureFor;
    generatePositionMessage: typeof generatePositionMessage;
    asRange: typeof asRange;
    angle: typeof angle;
    mergeLines: typeof mergeLines;
    distSq: typeof distSq;
    format: typeof format;

    beforeExecution?: BeforeExecution;
    duringExecution?: DuringExecution;
    afterExecution?: AfterExecution;

    run: typeof run;
    t: typeof t;
  }

  function t(key: string, ...values: string[]): string;
}

const object: Window = window;

/**
 * Expose the some API in the global namespace.
 *
 * TODO: move these elsewhere.
 */
function expose() {
  object.numericEquals = numericEquals;
  object.searchFrames = searchFrames;
  object.sprite = sprite;
  object.broadcast = broadcast;
  object.delay = delay;
  // object.distSq = distSq;
  object.OneHatAllowedTest = OneHatAllowedTest;
  object.ignoreWaitInProcedureFor = ignoreWaitInProcedureFor;
  object.generatePositionMessage = generatePositionMessage;
  object.asRange = asRange;
  object.angle = angle;
  object.mergeLines = mergeLines;
  object.distSq = distSq;
  object.format = format;
  object.t = t;
}

export interface EvalConfig {
  /**
   * The submission sb3 data.
   */
  submission: string | ArrayBuffer;
  /**
   * The template sb3 file.
   */
  template: string | ArrayBuffer;
  /**
   * The canvas for the renderer.
   */
  canvas: HTMLCanvasElement;
  /**
   * The language of the exercise.
   */
  language: string;

  translations?: LanguageData;
}

enum EvaluationStage {
  notStarted,
  before,
  scheduling,
  executing,
  after,
}

/**
 * Entry point for the test plan API.
 *
 * When writing tests, you should limit interaction with Scratch and
 * the judge to this class, if at all possible.
 *
 * While possible, you should limit yourself to the function
 */
export class Evaluation extends TabLevel {
  public stage: EvaluationStage;

  constructor(context: Context) {
    super(context);
    /**
     * Used to track the stage internally.
     * @type {number}
     * @protected
     */
    this.stage = EvaluationStage.notStarted;
  }

  /**
   * Get access to the log.
   */
  get log(): Log {
    return this.context.log;
  }

  /**
   * Get access to the scratch VM. This should be considered read-only.
   * If you modify the VM, there are no guarantees it will keep working.
   */
  get vm(): VirtualMachine {
    return this.context.vm!;
  }

  /**
   * Get the array of answers provided previously.
   */
  get answers(): string[] {
    return this.context.answers;
  }

  /**
   * Set the array of answers to provide to the submission.
   */
  set answers(answers: string[]) {
    this.context.answers = answers;
  }

  /**
   * Get the output manager.
   */
  get output(): ResultManager {
    return this.context.output;
  }

  /**
   * Get the event scheduler.
   */
  get scheduler(): ScheduledEvent {
    return this.context.event;
  }

  set actionTimeout(timeout: number) {
    this.assertBefore(EvaluationStage.scheduling, 'actionTimeout');
    this.context.actionTimeout = timeout;
  }

  get actionTimeout(): number {
    return this.context.actionTimeout;
  }

  /**
   * Set the acceleration factor for the test.
   * @param factor - The factor, e.g. 2 will double the speed.
   */
  set acceleration(factor: number) {
    this.assertBefore(EvaluationStage.scheduling, 'acceleration');
    this.context.accelerationFactor = {
      factor: factor,
    };
  }

  get acceleration(): number {
    return this.context.accelerationFactor.factor;
  }

  /**
   * Set the acceleration factor for the test's times.
   * This will be used to set the timeouts for the scheduled events.
   *
   * @param {number} factor - The factor, e.g. 2 will double the speed.
   */
  set timeAcceleration(factor: number) {
    this.assertBefore(EvaluationStage.scheduling, 'timeAcceleration');
    this.context.accelerationFactor.time = factor;
  }

  get timeAcceleration(): number {
    return this.context.accelerationFactor.time || 1;
  }

  /**
   * Set the acceleration factor for the event times.
   * This will be used to set the timeouts for the scheduled events.
   *
   * @param {number} factor - The factor, e.g. 2 will double the speed.
   */
  set eventAcceleration(factor: number) {
    this.assertBefore(EvaluationStage.scheduling, 'eventAcceleration');
    this.context.accelerationFactor.event = factor;
  }

  get eventAcceleration(): number {
    return this.context.accelerationFactor.event || 1;
  }

  /**
   * Enables or disabled turbo mode.
   */
  // eslint-disable-next-line accessor-pairs
  set turboMode(enabled: boolean) {
    this.context.vm!.setTurboMode(enabled);
  }

  /**
   * Check that we are before or on a given stage.
   */
  private assertBefore(stage: EvaluationStage, func: string) {
    if (this.stage > stage) {
      throw new Error(
        `The function ${func} cannot be used at this stage: it must be used earlier.`,
      );
    }
  }
}

/**
 * Function that runs before the project is started. This can be used to
 * run static checks on the submitted project. For your convenience, the
 * template project is also provided. One example where this can be used
 * is to check if there were no sprites removed in the submission.
 */
interface BeforeExecution {
  /**
   * @param template - The template project.
   * @param submission - The submission project.
   * @param e - Evaluation object.
   */
  (template: Project, submission: Project, e: Evaluation): void;
}

/**
 * Function that is run just before the project is executed, allowing to
 * schedule events, inputs and tests for during the execution. While you
 * have full access to the log in this stage, it might not be properly
 * filled. It is recommend to put tests using the log in the afterExecution
 * step.
 */
interface DuringExecution {
  /**
   * @param e - Evaluation object.
   */
  (e: Evaluation): void;
}

/**
 * Function that is run after the project has been executed. At this
 * point the log is filled, and available for inspection. Mosts tests
 * in this stage are in the category of checking the end state of the
 * execution: checking how the project reacted to the instructions
 * scheduled in the "duringExecution" step.
 */
interface AfterExecution {
  /**
   * @param e - Evaluation object.
   */
  (e: Evaluation): void;
}

/**
 * Run the judge.
 *
 * @param config - The config with the inputs for the judge.
 */
export async function run(config: EvalConfig): Promise<void> {
  // Seed random data.
  seed('itch-judge', { global: true });

  // Set language from parameters.
  initialiseTranslations(config.language as 'nl' | 'en', config.translations);

  const context = new Context();
  const templateJson = await context.getProjectJson(config);
  const submissionJson = await context.prepareVm(config);
  const beforeExecution = window.beforeExecution || (() => {});
  const duringExecution = window.duringExecution || ((e) => e.scheduler.end());
  const afterExecution = window.afterExecution || (() => {});

  context.output.startJudgement();

  const judge = new Evaluation(context);
  judge.stage = EvaluationStage.before;

  try {
    expose();

    // Run the tests before the execution.
    beforeExecution(new Project(templateJson), new Project(submissionJson), judge);

    await context.vmLoaded.promise;
    judge.stage = EvaluationStage.scheduling;

    // Schedule the commands for the duration.
    duringExecution(judge);

    judge.stage = EvaluationStage.executing;
    // Prepare the context for execution.
    context.prepareAndRunVm();

    // Run the events.
    await context.event.run(context);
    await context.simulationEnd.promise;

    judge.stage = EvaluationStage.after;

    // Do post-mortem tests.
    afterExecution(judge);
  } catch (e) {
    if (!(e instanceof FatalErrorException)) {
      throw e;
    } else {
      console.warn('Stopping tests due to fatal test not passing.');
      console.warn(e);
    }
  }

  context.output.closeJudgement();
  seed.resetGlobal();
  console.log('--- END OF EVALUATION ---');
}

// Main function in the judge.
object.run = run;
