// Neede for https://github.com/LLK/scratch-gui/issues/5025
import 'regenerator-runtime/runtime';

import seed from 'seed-random';
import { checkBlocks } from './matcher/differ';
import { nodeMatchesPattern, subTreeMatchesStack } from './matcher/node-matcher';
import { numericEquals, format } from './utils';
import { Context } from './context';
import { Project } from './project';
import { ScheduledEvent } from './scheduler/scheduled-event';
import { broadcast, delay, sprite } from './scheduler/wait';
import {
  asRange,
  generatePositionMessage,
  ignoreWaitInProcedureFor,
  OneHatAllowedTest,
  TabLevel,
} from './testplan';
import { ResultManager, GroupedResultManager, OutputHandler } from './output';
import type VirtualMachine from '@ftrprf/judge-scratch-vm-types';
import { angle, distSq, mergeLines } from './lines';
import { checkPredefinedBlocks } from './testplan/predefined-blocks';
import { GroupLevel } from './testplan/hierarchy';
import { NewLog } from './new-log';
import { initialiseTranslations, LanguageData, t } from './i18n';
import { OutputCollector } from './output/collector';
import { Judgement } from './output/full-schema';
import { Update } from './output/partial-schema';
import { createContext } from './vm';
import {
  anything,
  backdrop,
  changeEffectBy,
  changeSizeBy,
  changeXBy,
  changeYBy,
  clearGraphicsEffects,
  costume,
  customBlock,
  direction,
  glideZSecsToX,
  glideZSecsToXY,
  goLayers,
  goTo,
  goToLayer,
  goToXY,
  greenFlag,
  hide,
  ifOnEdgeBounce,
  moveXSteps,
  nextBackdrop,
  nextCostume,
  say,
  sayForXSeconds,
  setEffectTo,
  setRotationStyle,
  setSizeTo,
  setXTo,
  setYTo,
  show,
  size,
  switchBackdropTo,
  switchBackdropToAndWait,
  switchCostumeTo,
  think,
  thinkForXSeconds,
  turnLeftXDegrees,
  turnRightXDegrees,
  whenBackdropSwitchedTo,
  whenIReceive,
  whenKeyPressed,
  whenSpriteClicked,
  whenStageClicked,
  whenXGreaterThanY,
  xPosition,
  yPosition,
  broadcast as bBroadcast,
  broadcastAndWait,
  whenIStartAsClone,
  wait as bWait,
  nothing,
  stack,
  pointTowards,
  pointInDirection,
  equals,
  forever,
  ifThenElse,
  isTouching,
  pickRandom,
  repeat,
  procedureCall,
  procedureDefinition,
  repeatUntil,
  setXtoY,
  add,
  subtract,
  transparent,
  waitUntil,
  loudness,
  createCloneOf,
  ifThen,
  isMouseDown,
  deleteThisClone,
  resetTimer,
  setDragMode,
  askAndWait,
  isTouchingColor,
  colorIsTouching,
  isKeyPressed,
  distanceTo,
  answer,
  mouseX,
  mouseY,
  timer,
  senseXOfY,
  currentX,
  divide,
  multiply,
  daysSince2000,
  round,
  username,
  isLessThan,
  isGreaterThan,
  and,
  or,
  contains,
  not,
  letterOf,
  mod,
  operatorOf,
  showVariable,
  hideVariable,
  variable,
  addXtoList,
  deleteAllFromList,
  replaceInList,
  showList,
  list,
  join,
  lengthOf,
  changeXbyY,
  deleteXfromList,
  insertAt,
  indexOf,
  hideList,
  itemOfList,
  lengthOfList,
  listContains,
  stop,
} from './matcher/patterns';

const object: Window = window;

interface ModuleTestplanSource {
  url: string;
}

interface StringTestplanSource {
  data: string;
}

/**
 * Allows importing a testplan as an ES6 module.
 * The provided url will be dynamically imported by the judge.
 *
 * Note that while the module must be ES6, and export the 3 required functions,
 * the testplan itself is not allowed to import additional modules; it must be
 * without dependencies.
 *
 * A module must export three functions:
 *
 * - `beforeExecution`, see BeforeExecution
 * - `duringExecution`, see DuringExecution
 * - `afterExecution`, see AfterExecution
 *
 * If passing a string with code, the string will be base64'd and imported as
 * a data uri.
 */
type TestplanSource = ModuleTestplanSource | StringTestplanSource;

/**
 * Expose the some API in the global namespace.
 *
 * TODO: move these elsewhere.
 */
function expose() {
  object.numericEquals = numericEquals;
  object.sprite = sprite;
  object.broadcast = broadcast;
  object.delay = delay;
  object.OneHatAllowedTest = OneHatAllowedTest;
  object.ignoreWaitInProcedureFor = ignoreWaitInProcedureFor;
  object.generatePositionMessage = generatePositionMessage;
  object.asRange = asRange;
  object.angle = angle;
  object.mergeLines = mergeLines;
  object.distSq = distSq;
  object.Itch = {
    checkPredefinedBlocks: checkPredefinedBlocks,
    distSq: distSq,
  };
  object.format = format;
  object.t = t;

  object.B = {
    anything,
    backdrop,
    changeEffectBy,
    changeSizeBy,
    changeXBy,
    changeYBy,
    clearGraphicsEffects,
    costume,
    customBlock,
    direction,
    glideZSecsToX,
    glideZSecsToXY,
    goLayers,
    goTo,
    goToLayer,
    goToXY,
    greenFlag,
    hide,
    ifOnEdgeBounce,
    moveXSteps,
    nextBackdrop,
    nextCostume,
    pointInDirection,
    pointTowards,
    say,
    sayForXSeconds,
    setEffectTo,
    setRotationStyle,
    setSizeTo,
    setXTo,
    setYTo,
    show,
    size,
    switchBackdropTo,
    switchBackdropToAndWait,
    switchCostumeTo,
    think,
    thinkForXSeconds,
    turnLeftXDegrees,
    turnRightXDegrees,
    whenBackdropSwitchedTo,
    whenIReceive,
    whenKeyPressed,
    whenSpriteClicked,
    whenStageClicked,
    whenXGreaterThanY,
    xPosition,
    yPosition,
    broadcast: bBroadcast,
    broadcastAndWait,
    whenIStartAsClone,
    wait: bWait,
    nothing,
    stack,
    equals,
    forever,
    ifThenElse,
    isTouching,
    pickRandom,
    repeat,
    procedureCall,
    procedureDefinition,
    repeatUntil,
    setXtoY,
    add,
    subtract,
    transparent,
    waitUntil,
    loudness,
    createCloneOf,
    ifThen,
    isMouseDown,
    deleteThisClone,
    resetTimer,
    setDragMode,
    askAndWait,
    isTouchingColor,
    colorIsTouching,
    isKeyPressed,
    distanceTo,
    answer,
    mouseX,
    mouseY,
    timer,
    senseXOfY,
    currentX,
    divide,
    multiply,
    daysSince2000,
    round,
    username,
    isLessThan,
    isGreaterThan,
    and,
    or,
    contains,
    not,
    letterOf,
    mod,
    operatorOf,
    showVariable,
    hideVariable,
    variable,
    addXtoList,
    deleteAllFromList,
    replaceInList,
    showList,
    list,
    join,
    lengthOf,
    changeXbyY,
    deleteXfromList,
    insertAt,
    indexOf,
    hideList,
    itemOfList,
    lengthOfList,
    listContains,
    stop,
    nodeMatchesPattern,
    subTreeMatchesStack,
    checkBlocks,
  };
}

export interface EvalConfig {
  /**
   * The submission sb3 data.
   */
  submission: ArrayBuffer;
  /**
   * The template sb3 file.
   */
  template: ArrayBuffer;
  /**
   * If the output should be partial or full. If using the partial
   * output, the callback will be called for each output. If using
   * the full format, the callback will not be called; the result
   * will be returned instead.
   */
  fullFormat: boolean;
  /**
   * The canvas for the renderer.
   */
  canvas: HTMLCanvasElement;
  /**
   * Pass the testplan to the judge. This is possible in two ways:
   *
   * - A string, which is equivalent to the module system.
   * - An object, see the object docs for details.
   */
  testplan: string | TestplanSource;
  /**
   * Optional callback for the results of the judge. This function will
   * be called each time a result is available.
   */
  callback?: OutputHandler;
  /**
   * The language of the exercise.
   */
  language: 'nl' | 'en';

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
  context: Context;

  constructor(context: Context) {
    super(context.groupedOutput);
    this.context = context;
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
  get log(): NewLog {
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

  /** @deprecated */
  get output(): ResultManager {
    return new ResultManager(this.context.groupedOutput);
  }

  get groupedOutput(): GroupedResultManager {
    return this.context.groupedOutput;
  }

  get group(): GroupLevel {
    return new GroupLevel(this.groupedOutput);
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
 * Run the judge.
 *
 * @param config - The config with the inputs for the judge.
 */
export async function run(config: EvalConfig): Promise<void | Judgement> {
  // Seed random data.
  seed('itch-judge', { global: true });

  // Set language from parameters.
  initialiseTranslations(config.language, config.translations);

  let handler: OutputCollector;
  if (config.fullFormat) {
    handler = new OutputCollector();
    config.callback = (update: Update) => {
      // Output partial updates for debug purposes.
      console.debug(update);
      handler.handle(update);
    };
  }

  const beforeExecution = window.beforeExecution || (() => {});
  const duringExecution = window.duringExecution || ((e) => e.scheduler.end());
  const afterExecution = window.afterExecution || (() => {});

  const context = await createContext(config);

  context.groupedOutput.startJudgement();

  const judge = new Evaluation(context);
  judge.stage = EvaluationStage.before;

  try {
    expose();

    if (beforeExecution.length > 1) {
      // Run the tests before the execution.
      beforeExecution(
        // @ts-ignore
        new Project(context.templateJson),
        new Project(context.submissionJson),
        judge,
      );
    } else {
      // @ts-ignore
      beforeExecution(judge);
    }

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
    // @ts-ignore
    if (e.type !== 'FatalErrorException') {
      throw e;
    } else {
      console.warn('Stopping tests due to fatal test not passing.');
      console.warn(e);
    }
  }

  context.groupedOutput.closeJudgement();
  seed.resetGlobal();
  console.log('--- END OF EVALUATION ---');

  if (config.fullFormat) {
    return handler!.judgement;
  }
}

// Main function in the judge.
object.run = run;
