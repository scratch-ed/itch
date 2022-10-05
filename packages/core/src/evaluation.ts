// Neede for https://github.com/LLK/scratch-gui/issues/5025
import 'regenerator-runtime/runtime';

import seed from 'seed-random';
import { anyOrder, checkBlocks } from './matcher/differ';
import { nodeMatchesPattern, subTreeMatchesScript } from './matcher/node-matcher';
import { numericEquals, format } from './utils';
import { Context } from './context';
import { ScheduledEvent } from './scheduler/scheduled-event';
import { broadcast, delay, sprite } from './scheduler/wait';
import { asRange, ignoreWaitInProcedureFor } from './testplan';
import { ResultManager, OutputHandler } from './output';
import type VirtualMachine from '@ftrprf/judge-scratch-vm-types';
import { angle, distSq, findSquares, findTriangles, mergeLines } from './lines';
import { checkPredefinedBlocks } from './testplan/predefined-blocks';
import { GroupLevel } from './testplan/hierarchy';
import { Log } from './log';
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
  playSound,
  stopAllSounds,
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
  pointTowards,
  pointInDirection,
  equals,
  forever,
  ifThenElse,
  isTouching,
  pickRandom,
  repeat,
  procedureCall,
  stringNumberArgument,
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
  script,
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
  object.ignoreWaitInProcedureFor = ignoreWaitInProcedureFor;
  object.asRange = asRange;
  object.angle = angle;
  object.mergeLines = mergeLines;
  object.distSq = distSq;
  object.Itch = {
    checkPredefinedBlocks: checkPredefinedBlocks,
    distSq: distSq,
    numericEquals: numericEquals,
    broadcast: broadcast,
    sprite: sprite,
    delay: delay,
    asRange: asRange,
    mergeLines: mergeLines,
    findSquares: findSquares,
    findTriangles: findTriangles,
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
    playSound,
    stopAllSounds,
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
    stack: script,
    script,
    equals,
    forever,
    ifThenElse,
    isTouching,
    pickRandom,
    repeat,
    procedureCall,
    stringNumberArgument,
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
    subTreeMatchesStack: subTreeMatchesScript,
    subTreeMatchesScript,
    checkBlocks,
    anyOrder,
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
 * Main entry point for the testplan to interact with the judge.
 *
 * This class provides access to all relevant information and allows
 * setting various options.
 *
 * All documented properties and methods (that are not internal or private) are
 * part of the testplan API and can safely be used.
 */
export class Evaluation {
  /** @internal */
  public stage: EvaluationStage;
  private context: Context;

  /** @internal */
  constructor(context: Context) {
    this.context = context;
    this.stage = EvaluationStage.notStarted;
  }

  /**
   * Get the log instance.
   *
   * Note that how filled the log will be depends on which phase the test is in.
   */
  get log(): Log {
    return this.context.log;
  }

  /**
   * Get access to the Scratch VM itself.
   *
   * In most cases, you should avoid manipulating the VM directly.
   *
   * For reading data, it is preferred to use the {@link log}, however, direct
   * access to the VM can be useful in the _during execution_ phase.
   *
   * Writing data should not be done.
   * This might result in an unstable VM.
   */
  get vm(): VirtualMachine {
    return this.context.vm!;
  }

  /**
   * Get the array of answers.
   */
  get answers(): string[] {
    return this.context.answers;
  }

  /**
   * Set the array of answers to provide to the submission.
   *
   * These will be used if the Scratch project asks for input from the user.
   */
  set answers(answers: string[]) {
    this.context.answers = answers;
  }

  /**
   * @deprecated Use the {@link output} property.
   */
  get groupedOutput(): ResultManager {
    return this.out.resultManager;
  }

  /**
   * @deprecated Use {@link out.resultManager}.
   */
  get output(): ResultManager {
    return this.out.resultManager;
  }

  /**
   * @deprecated Use the {@link out} property.
   */
  get group(): GroupLevel {
    return this.out;
  }

  /**
   * Get the convenience functions to create groups and tests.
   */
  get out(): GroupLevel {
    return new GroupLevel(this.context.groupedOutput);
  }

  /**
   * Get the event scheduler.
   *
   * In most cases, this is useless outside the _during execution_ phase.
   */
  get scheduler(): ScheduledEvent {
    return this.context.event;
  }

  /**
   * Set the action timeout for the scheduler.
   *
   * When waiting for some event to occur or for some action to complete,
   * this is the maximal waiting time.
   * If the event does not occur or the action does not complete,
   * the judge will error with a timeout error.
   *
   * Once execution of the Scratch project has begun,
   * you can no longer change this value.
   *
   * This value is affected by the {@link acceleration}.
   *
   * @param timeout The timeout in milliseconds.
   */
  set actionTimeout(timeout: number) {
    this.assertBefore(EvaluationStage.scheduling, 'actionTimeout');
    this.context.actionTimeout = timeout;
  }

  /**
   * Set the acceleration factor.
   *
   * The Scratch VM will run at 60 FPS by default.
   * This means every 16 or so ms a new step is taken.
   * This factor allows changing this with a certain factor.
   *
   * This will adjust all time-related parameters with the same factor.
   * For example, timeouts will also be affected by the factor.
   * If you don't want this, you can use the {@link eventAcceleration} and
   * {@link timeAcceleration} properties to override this.
   *
   * Note that the factor is applied on a best-efforts basis, meaning it cannot
   * do magic.
   * The VM cannot run faster than the time needed to calculate in each step.
   * For example, if a step takes 8ms to run, any factor above 2 will have no
   * additional speedup.
   *
   * Once execution of the Scratch project has begun,
   * you can no longer change this value.
   *
   * @param factor - The factor, e.g. 2 will double the speed.
   */
  set acceleration(factor: number) {
    this.assertBefore(EvaluationStage.scheduling, 'acceleration');
    this.context.accelerationFactor = {
      factor: factor,
    };
  }

  /**
   * Override the acceleration factor for the Scratch waiting times.
   *
   * By default, waiting times in Scratch (e.g. wait for blocks) are affected
   * by the {@link acceleration}.
   * This property allows you to override this.
   *
   * The same caveats apply as for the {@link acceleration} property.
   * Additionally, this should not be set higher than the {@link acceleration},
   * as this can create weird situations.
   *
   * Once execution of the Scratch project has begun,
   * you can no longer change this value.
   *
   * @param {number} factor - The factor, e.g. 2 will double the speed.
   */
  set timeAcceleration(factor: number) {
    this.assertBefore(EvaluationStage.scheduling, 'timeAcceleration');
    this.context.accelerationFactor.time = factor;
  }

  /**
   * Override the acceleration factor for the Scratch waiting times.
   *
   * By default, waiting times in the scheduler are affected by the
   * {@link acceleration}.
   * This property allows you to override this.
   *
   * The same caveats apply as for the {@link acceleration} property.
   * Additionally, this should not be set higher than the {@link acceleration},
   * as this can create weird situations.
   *
   * This will be used to set the timeouts for the scheduled events.
   *
   * @param {number} factor - The factor, e.g. 2 will double the speed.
   */
  set eventAcceleration(factor: number) {
    this.assertBefore(EvaluationStage.scheduling, 'eventAcceleration');
    this.context.accelerationFactor.event = factor;
  }

  /**
   * Enables or disabled turbo mode.
   *
   * This uses the built-in Scratch turbo mode.
   * If an exercise supports it, you should probably enable this,
   * as it can result in significant speedups.
   */
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

    // Run the tests before the execution.
    beforeExecution(judge);

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
