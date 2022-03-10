import { searchFrames } from './log';
import { format, numericEquals } from './utils';
import { broadcast, delay, sprite } from './scheduler/wait';
import {
  asRange,
  generatePositionMessage,
  ignoreWaitInProcedureFor,
  OneHatAllowedTest as AllowedTest,
} from './testplan';
import { angle, distSq, mergeLines } from './lines';
import { checkPredefinedBlocks } from './testplan/predefined-blocks';
import { Project } from './project';
import { Evaluation, run } from './evaluation';
import { t as translate } from './i18n';
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
  broadcast as bBroadcast,
  broadcastAndWait,
  whenIStartAsClone,
  wait as bWait,
  nothing,
  stack,
} from './matcher/patterns';

declare interface Itch {
  checkPredefinedBlocks: typeof checkPredefinedBlocks;
  distSq: typeof distSq;
}

declare interface BlockMatch {
  nothing: typeof nothing;
  stack: typeof stack;
  anything: typeof anything;
  moveXSteps: typeof moveXSteps;
  turnRightXDegrees: typeof turnRightXDegrees;
  turnLeftXDegrees: typeof turnLeftXDegrees;
  pointInDirection: typeof pointInDirection;
  pointTowards: typeof pointTowards;
  goToXY: typeof goToXY;
  goTo: typeof goTo;
  glideZSecsToXY: typeof glideZSecsToXY;
  glideZSecsToX: typeof glideZSecsToX;
  changeXBy: typeof changeXBy;
  changeYBy: typeof changeYBy;
  setXTo: typeof setXTo;
  setYTo: typeof setYTo;
  ifOnEdgeBounce: typeof ifOnEdgeBounce;
  setRotationStyle: typeof setRotationStyle;
  xPosition: typeof xPosition;
  yPosition: typeof yPosition;
  direction: typeof direction;
  sayForXSeconds: typeof sayForXSeconds;
  say: typeof say;
  thinkForXSeconds: typeof thinkForXSeconds;
  think: typeof think;
  show: typeof show;
  hide: typeof hide;
  switchCostumeTo: typeof switchCostumeTo;
  switchBackdropTo: typeof switchBackdropTo;
  switchBackdropToAndWait: typeof switchBackdropToAndWait;
  nextCostume: typeof nextCostume;
  nextBackdrop: typeof nextBackdrop;
  changeEffectBy: typeof changeEffectBy;
  setEffectTo: typeof setEffectTo;
  clearGraphicsEffects: typeof clearGraphicsEffects;
  changeSizeBy: typeof changeSizeBy;
  setSizeTo: typeof setSizeTo;
  goToLayer: typeof goToLayer;
  goLayers: typeof goLayers;
  costume: typeof costume;
  backdrop: typeof backdrop;
  size: typeof size;
  customBlock: typeof customBlock;
  greenFlag: typeof greenFlag;
  whenKeyPressed: typeof whenKeyPressed;
  whenSpriteClicked: typeof whenSpriteClicked;
  whenStageClicked: typeof whenStageClicked;
  whenBackdropSwitchedTo: typeof whenBackdropSwitchedTo;
  whenXGreaterThanY: typeof whenXGreaterThanY;
  whenIReceive: typeof whenIReceive;
  broadcast: typeof bBroadcast;
  broadcastAndWait: typeof broadcastAndWait;
  whenIStartAsClone: typeof whenIStartAsClone;
  wait: typeof bWait;
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
 * The callback function in the test plan. There are three kinds
 * of callback functions.
 *
 * ## Before evaluation
 * This is run before the VM is started, so you only have access to the static
 * data.
 *
 * ## During execution
 * Function that is run just before the project is executed, allowing to
 * schedule events, inputs and tests for during the execution. While you
 * have full access to the log in this stage, it might not be properly
 * filled. It is recommend to put tests using the log in the afterExecution
 * step.
 *
 * ## After execution
 * Function that is run after the project has been executed. At this
 * point the log is filled, and available for inspection. Mosts tests
 * in this stage are in the category of checking the end state of the
 * execution: checking how the project reacted to the instructions
 * scheduled in the "duringExecution" step.
 */
declare type CallbackFunction = (e: Evaluation) => void;

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
    OneHatAllowedTest: typeof AllowedTest;
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

    beforeExecution?: typeof beforeExecution | CallbackFunction;
    duringExecution?: CallbackFunction;
    afterExecution?: CallbackFunction;

    run: typeof run;
    format: typeof format;
    Itch: Itch;

    t: typeof translate;

    B: BlockMatch;
  }

  const Itch: Itch;

  const B: BlockMatch;

  /** @deprecated */
  const OneHatAllowedTest: typeof AllowedTest;

  const t: typeof translate;
}
