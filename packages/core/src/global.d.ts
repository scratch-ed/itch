import { anyOrder, checkBlocks } from './matcher/differ';
import { nodeMatchesPattern, subTreeMatchesScript } from './matcher/node-matcher';
import { OutputHandler } from './output';
import { format, numericEquals } from './utils';
import { broadcast, delay, sprite } from './scheduler/wait';
import { asRange, ignoreWaitInProcedureFor } from './testplan';
import { angle, distSq, findSquares, findTriangles, mergeLines } from './lines';
import { checkPredefinedBlocks } from './testplan/predefined-blocks';
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
  broadcast as bBroadcast,
  broadcastAndWait,
  whenIStartAsClone,
  wait as bWait,
  nothing,
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
  script,
  stringNumberArgument,
} from './matcher/patterns';

declare interface Itch {
  checkPredefinedBlocks: typeof checkPredefinedBlocks;
  distSq: typeof distSq;
  numericEquals: typeof numericEquals;
  sprite: typeof sprite;
  broadcast: typeof broadcast;
  delay: typeof delay;
  asRange: typeof asRange;
  mergeLines: typeof mergeLines;
  findSquares: typeof findSquares;
  findTriangles: typeof findTriangles;
}

declare interface BlockMatch {
  nothing: typeof nothing;
  /** @deprecated */
  stack: typeof script;
  script: typeof script;
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
  playSound: typeof playSound;
  stopAllSounds: typeof stopAllSounds;
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
  equals: typeof equals;
  forever: typeof forever;
  ifThenElse: typeof ifThenElse;
  isTouching: typeof isTouching;
  pickRandom: typeof pickRandom;
  repeat: typeof repeat;
  procedureCall: typeof procedureCall;
  stringNumberArgument: typeof stringNumberArgument;
  procedureDefinition: typeof procedureDefinition;
  repeatUntil: typeof repeatUntil;
  setXtoY: typeof setXtoY;
  add: typeof add;
  subtract: typeof subtract;
  transparent: typeof transparent;
  waitUntil: typeof waitUntil;
  loudness: typeof loudness;
  join: typeof join;
  createCloneOf: typeof createCloneOf;
  ifThen: typeof ifThen;
  isMouseDown: typeof isMouseDown;
  stop: typeof stop;
  deleteThisClone: typeof deleteThisClone;
  resetTimer: typeof resetTimer;
  setDragMode: typeof setDragMode;
  askAndWait: typeof askAndWait;
  isTouchingColor: typeof isTouchingColor;
  colorIsTouching: typeof colorIsTouching;
  isKeyPressed: typeof isKeyPressed;
  distanceTo: typeof distanceTo;
  answer: typeof answer;
  mouseX: typeof mouseX;
  mouseY: typeof mouseY;
  timer: typeof timer;
  senseXOfY: typeof senseXOfY;
  currentX: typeof currentX;
  divide: typeof divide;
  multiply: typeof multiply;
  round: typeof round;
  daysSince2000: typeof daysSince2000;
  username: typeof username;
  isLessThan: typeof isLessThan;
  isGreaterThan: typeof isGreaterThan;
  and: typeof and;
  or: typeof or;
  not: typeof not;
  contains: typeof contains;
  letterOf: typeof letterOf;
  lengthOf: typeof lengthOf;
  mod: typeof mod;
  operatorOf: typeof operatorOf;
  changeXbyY: typeof changeXbyY;
  showVariable: typeof showVariable;
  hideVariable: typeof hideVariable;
  variable: typeof variable;
  addXtoList: typeof addXtoList;
  deleteXfromList: typeof deleteXfromList;
  deleteAllFromList: typeof deleteAllFromList;
  insertAt: typeof insertAt;
  indexOf: typeof indexOf;
  replaceInList: typeof replaceInList;
  showList: typeof showList;
  hideList: typeof hideList;
  list: typeof list;
  itemOfList: typeof itemOfList;
  lengthOfList: typeof lengthOfList;
  listContains: typeof listContains;
  // Some utility functions
  nodeMatchesPattern: typeof nodeMatchesPattern;
  /** @deprecated */
  subTreeMatchesStack: typeof subTreeMatchesScript;
  subTreeMatchesScript: typeof subTreeMatchesScript;
  checkBlocks: typeof checkBlocks;
  anyOrder: typeof anyOrder;
}

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
    sprite: typeof sprite;
    /** @deprecated */
    broadcast: typeof broadcast;
    /** @deprecated */
    delay: typeof delay;
    /** @deprecated */
    ignoreWaitInProcedureFor: typeof ignoreWaitInProcedureFor;
    /** @deprecated */
    asRange: typeof asRange;
    /** @deprecated */
    angle: typeof angle;
    /** @deprecated */
    mergeLines: typeof mergeLines;
    /** @deprecated */
    distSq: typeof distSq;

    beforeExecution?: CallbackFunction;
    duringExecution?: CallbackFunction;

    handleOut?: OutputHandler;
    afterExecution?: CallbackFunction;

    run: typeof run;
    format: typeof format;
    Itch: Itch;

    t: typeof translate;

    B: BlockMatch;
  }

  const Itch: Itch;

  const B: BlockMatch;

  const t: typeof translate;
}
