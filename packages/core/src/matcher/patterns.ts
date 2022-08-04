// noinspection JSUnusedGlobalSymbols
import { Node } from '../new-blocks';

/**
 * @fileOverview A DSL-like construct to match Scratch blocks against a pattern.
 *
 * The shortest description would be that this is "regex" for Scratch blocks.
 * It provides functions to create block and value patterns, which can then be
 * used to match against the blocks or functions in the log of the judge.
 *
 * Three special functions exist, see their docs for information:
 *  {@link anything}, {@link nothing} and {@link stack}.
 *
 * Other functions map to the various blocks.
 *
 * For example, to create a pattern that matches a head block:
 *
 * // TODO add example
 * @example
 * const pattern = stack(
 *
 * )
 */

type Anything = '__any_block_or_value_sentinel__';
type Nothing = '__never_block_or_value_sentinel__';

/**
 * A value can be either a static value or a reporter block, which is basically
 * a variable. However, sometimes, you cannot use any type of variable
 * (e.g. when you need to use a condition).
 *
 * @example
 * ExactValue<string>         // Allows strings and ReporterBlocks
 * ExactValue<ReporterBlock>  // Allows only ReporterBlocks
 * ExactValue<BooleanBlock>   // Allows only BooleanBlocks
 */
export type ExactValue<T> = T extends ReporterBlock ? T : T | ReporterBlock;

/**
 * A pattern is either:
 *
 * 1. An exact value. The possibilities for this are:
 *   a. number, string
 *   b. BlockScript class
 *   c. ReporterBlock (or extending classes).
 * => If possible, we would write: T extends string | number | BlockScript | ReporterBlock
 * 2. A wildcard (anything goes).
 * 4. A custom function to evaluate the value.
 */
export type OnePattern<T> =
  | T
  | Anything
  | Nothing
  | ((a: Node | null | undefined | T) => boolean);

// 3. A choice, meaning a list of possibilities.
export type Pattern<T> = OnePattern<T>[] | OnePattern<T>;

/**
 * A value pattern is used when a scratch block expects inputs.
 */
export type OneValuePattern<T> = OnePattern<ExactValue<T>>;
export type ValuePattern<T> = OneValuePattern<T>[] | OneValuePattern<T>;

export class BlockScript {
  constructor(public blockPatterns: OnePattern<PatternBlock>[]) {}
}

export const ANYTHING: Anything = '__any_block_or_value_sentinel__';
export const NOTHING: Nothing = '__never_block_or_value_sentinel__';

export interface PatternBlock {
  opcode: string;
  // We don't care about the actual value here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs?: Record<string, ValuePattern<any>>;
  // We don't care about the actual value here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields?: Record<string, ValuePattern<any>>;

  // For functions.
  mutation?: ValuePattern<string>;
  argumentList?: Array<ValuePattern<string | number | BooleanBlock>>;
}

interface ReporterBlock extends PatternBlock {
  type: 'reporter' | 'boolean';
}

interface VariableBlock extends ReporterBlock {
  opcode: 'data_variable';
  fields: {
    VARIABLE: Pattern<string>;
  };
}

interface BooleanBlock extends ReporterBlock {
  type: 'boolean';
}

export function isReporterBlock(block: unknown): block is ReporterBlock {
  return block !== null && typeof block === 'object' && 'type' in block;
}

export function isVariableBlock(block: unknown): block is VariableBlock {
  return isReporterBlock(block) && block.opcode === 'data_variable';
}

export function isOperatorBlock(block: unknown): block is ReporterBlock {
  return isReporterBlock(block) && block.opcode.startsWith('operator_');
}

export function isBooleanBlock(block: unknown): block is BooleanBlock {
  return isReporterBlock(block) && block.type === 'boolean';
}

/**
 * Match any value or block.
 *
 * No block or no value is not included in this, i.e. null or undefined
 * blocks or values are not accepted with anything.
 */
export function anything(): Anything {
  return ANYTHING;
}

/**
 * Accept only the absence of a value or block.
 */
export function nothing(): Nothing {
  return NOTHING;
}

/**
 * @deprecated Use `script` instead.
 */
export function stack(
  first: OnePattern<PatternBlock>,
  ...blocks: OnePattern<PatternBlock>[]
): BlockScript {
  return new BlockScript([first, ...blocks]);
}

/**
 * Match a stack of blocks.
 *
 * @param first The first block.
 * @param blocks The blocks in the stack.
 */
export function script(
  first: OnePattern<PatternBlock>,
  ...blocks: OnePattern<PatternBlock>[]
): BlockScript {
  return new BlockScript([first, ...blocks]);
}

// https://en.scratch-wiki.info/wiki/Move_()_Steps_(block)
export function moveXSteps(steps: ValuePattern<number | string>): PatternBlock {
  return {
    opcode: 'motion_movesteps',
    inputs: {
      STEPS: steps,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Turn_Right_()_Degrees_(block)
export function turnRightXDegrees(degrees: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_turnright',
    inputs: {
      DEGREES: degrees,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Turn_Left_()_Degrees_(block)
export function turnLeftXDegrees(degrees: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_turnleft',
    inputs: {
      DEGREES: degrees,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Point_in_Direction_()_(block)
export function pointInDirection(degrees: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_pointindirection',
    inputs: {
      DIRECTION: degrees,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Point_Towards_()_(block)
export function pointTowards(towards: ValuePattern<string | '_mouse_'>): PatternBlock {
  return {
    opcode: 'motion_pointtowards',
    inputs: {
      TOWARDS: script({
        opcode: 'motion_pointtowards_menu',
        fields: {
          TOWARDS: towards,
        },
      }),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Go_to_X:_()_Y:_()_(block)
export function goToXY(x: ValuePattern<number>, y: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_gotoxy',
    inputs: {
      X: x,
      Y: y,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Go_to_()_(block)
export function goTo(towards: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'motion_goto',
    inputs: {
      TO: new BlockScript([
        {
          opcode: 'motion_goto_menu',
          fields: {
            TO: towards,
          },
        },
      ]),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Glide_()_Secs_to_X:_()_Y:_()_(block)
export function glideZSecsToXY(
  secs: ValuePattern<number>,
  x: ValuePattern<number>,
  y: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'motion_glidesecstoxy',
    inputs: {
      SECS: secs,
      X: x,
      Y: y,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Glide_()_Secs_to_()_(block)
export function glideZSecsToX(
  secs: ValuePattern<number>,
  towards: ValuePattern<string | '_random_'>,
): PatternBlock {
  return {
    opcode: 'motion_glideto',
    inputs: {
      SECS: secs,
      TO: new BlockScript([
        {
          opcode: 'motion_glideto_menu',
          fields: {
            TO: towards,
          },
        },
      ]),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Change_X_by_()_(block)
export function changeXBy(amount: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_changexby',
    inputs: {
      DX: amount,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Change_Y_by_()_(block)
export function changeYBy(amount: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_changeyby',
    inputs: {
      DY: amount,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Set_X_to_()_(block)
export function setXTo(value: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_setx',
    inputs: {
      X: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Set_Y_to_()_(block)
export function setYTo(value: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_sety',
    inputs: {
      Y: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/If_on_Edge,_Bounce_(block)
export function ifOnEdgeBounce(): PatternBlock {
  return {
    opcode: 'motion_ifonedgebounce',
  };
}

export type RotationStyle = 'all around' | 'left-right' | "don't rotate";

export const Rotation: Record<string, RotationStyle> = {
  AllAround: 'all around',
  LeftRight: 'left-right',
  None: "don't rotate",
};

// https://en.scratch-wiki.info/wiki/Set_Rotation_Style_()_(block)
export function setRotationStyle(style: ValuePattern<RotationStyle>): PatternBlock {
  return {
    opcode: 'motion_setrotationstyle',
    fields: {
      STYLE: style,
    },
  };
}

// https://en.scratch-wiki.info/wiki/X_Position_(block)
export function xPosition(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'motion_xposition',
  };
}

// https://en.scratch-wiki.info/wiki/Y_Position_(block)
export function yPosition(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'motion_yposition',
  };
}

// https://en.scratch-wiki.info/wiki/Direction_(block)
export function direction(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'motion_direction',
  };
}

// https://en.scratch-wiki.info/wiki/Say_()_for_()_Seconds_(block)
export function sayForXSeconds(
  value: ValuePattern<string>,
  seconds: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'looks_sayforsecs',
    inputs: {
      MESSAGE: value,
      SECS: seconds,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Say_()_(block)
export function say(value: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'looks_say',
    inputs: {
      MESSAGE: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Think_()_for_()_Seconds_(block)
export function thinkForXSeconds(
  message: ValuePattern<string>,
  seconds: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'looks_thinkforsecs',
    inputs: {
      MESSAGE: message,
      SECS: seconds,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Think_()_(block)
export function think(message: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'looks_think',
    inputs: {
      MESSAGE: message,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Show_(block)
export function show(): PatternBlock {
  return {
    opcode: 'looks_show',
  };
}

// https://en.scratch-wiki.info/wiki/Hide_(block)
export function hide(): PatternBlock {
  return {
    opcode: 'looks_hide',
  };
}

// https://en.scratch-wiki.info/wiki/Switch_Costume_to_()_(block)
export function switchCostumeTo(costume: ValuePattern<string>): PatternBlock {
  if (isVariableBlock(costume)) {
    return {
      opcode: 'looks_switchcostumeto',
      inputs: {
        COSTUME: costume.fields.VARIABLE,
      },
    };
  } else if (isOperatorBlock(costume)) {
    return {
      opcode: 'looks_switchcostumeto',
      inputs: {
        COSTUME: costume,
      },
    };
  } else {
    return {
      opcode: 'looks_switchcostumeto',
      inputs: {
        COSTUME: script({
          opcode: 'looks_costume',
          fields: {
            COSTUME: costume,
          },
        }),
      },
    };
  }
}

// https://en.scratch-wiki.info/wiki/Switch_Backdrop_to_()_(block)
export function switchBackdropTo(backdrop: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'looks_switchbackdropto',
    inputs: {
      BACKDROP: script({
        opcode: 'looks_backdrops',
        fields: {
          BACKDROP: backdrop,
        },
      }),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Switch_Backdrop_to_()_and_Wait_(block)
export function switchBackdropToAndWait(backdrop: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'looks_switchbackdroptoandwait',
    inputs: {
      BACKDROP: script({
        opcode: 'looks_backdrops',
        fields: {
          BACKDROP: backdrop,
        },
      }),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Next_Costume_(block)
export function nextCostume(): PatternBlock {
  return { opcode: 'looks_nextcostume' };
}

// https://en.scratch-wiki.info/wiki/Next_Backdrop_(block)
export function nextBackdrop(): PatternBlock {
  return { opcode: 'looks_nextbackdrop' };
}

// https://en.scratch-wiki.info/wiki/Change_()_Effect_by_()_(Looks_block)
export function changeEffectBy(
  effect: ValuePattern<
    'color' | 'fisheye' | 'whirl' | 'pixelate' | 'mosaic' | 'brightness' | 'ghost'
  >,
  amount: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'looks_changeeffectby',
    inputs: {
      CHANGE: amount,
    },
    fields: {
      EFFECT: effect,
    },
  };
}

export function transparent(): string {
  return 'GHOST';
}

// https://en.scratch-wiki.info/wiki/Set_()_Effect_to_()_(Looks_block)
export function setEffectTo(
  effect: ValuePattern<string>,
  amount: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'looks_seteffectto',
    inputs: {
      VALUE: amount,
    },
    fields: {
      EFFECT: effect,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Clear_Graphic_Effects_(block)
export function clearGraphicsEffects(): PatternBlock {
  return {
    opcode: 'looks_cleargraphiceffects',
  };
}

// https://en.scratch-wiki.info/wiki/Change_Size_by_()_(block)
export function changeSizeBy(value: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'looks_changesizeby',
    inputs: {
      CHANGE: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Set_Size_to_()%25_(block)
export function setSizeTo(size: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'looks_setsizeto',
    inputs: {
      SIZE: size,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Go_to_()_Layer_(block)
export function goToLayer(layer: ValuePattern<'front' | 'back'>): PatternBlock {
  return {
    opcode: 'looks_gotofrontback',
    fields: {
      FRONT_BACK: layer,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Go_()_()_Layers_(block)
export function goLayers(
  direction: ValuePattern<'forward' | 'backward'>,
  layers: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'looks_goforwardbackwardlayers',
    inputs: {
      NUM: layers,
    },
    fields: {
      FORWARD_BACKWARD: direction,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Costume_()_(block)
export function costume(numberOrName: ValuePattern<'number' | 'name'>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'looks_costumenumbername',
    fields: {
      NUMBER_NAME: numberOrName,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Backdrop_()_(block)
export function backdrop(numberOrName: ValuePattern<'number' | 'name'>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'looks_backdropnumbername',
    fields: {
      NUMBER_NAME: numberOrName,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Size_(block)
export function size(): ReporterBlock {
  return { opcode: 'looks_size', type: 'reporter' };
}

export function playSound(sound: string): PatternBlock {
  return {
    opcode: 'sound_play',
    inputs: {
      SOUND_MENU: script({
        opcode: 'sound_sounds_menu',
        fields: {
          SOUND_MENU: sound,
        },
      }),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Stop_All_Sounds_(block)
export function stopAllSounds(): PatternBlock {
  return { opcode: 'sound_stopallsounds' };
}

// FIXME: support sound blocks.
export function customBlock(
  opcode: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs?: Record<string, ValuePattern<any>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields?: Record<string, ValuePattern<any>>,
): PatternBlock {
  return { opcode, inputs, fields };
}

// https://en.scratch-wiki.info/wiki/When_Green_Flag_Clicked_(block)
export function greenFlag(): PatternBlock {
  return {
    opcode: 'event_whenflagclicked',
  };
}

type KeyPress =
  | 'space'
  | 'left arrow'
  | 'up arrow'
  | 'right arrow'
  | 'down arrow'
  | 'enter'
  | string;

// https://en.scratch-wiki.info/wiki/When_()_Key_Pressed_(Events_block)
export function whenKeyPressed(key: ValuePattern<KeyPress>): PatternBlock {
  return {
    opcode: 'event_whenkeypressed',
    fields: {
      KEY_OPTION: key,
    },
  };
}

// https://en.scratch-wiki.info/wiki/When_This_Sprite_Clicked_(block)
export function whenSpriteClicked(): PatternBlock {
  return {
    opcode: 'event_whenthisspriteclicked',
  };
}

// https://en.scratch-wiki.info/wiki/When_This_Sprite_Clicked_(block)
export function whenStageClicked(): PatternBlock {
  return {
    opcode: 'event_whenstageclicked',
  };
}

// https://en.scratch-wiki.info/wiki/When_Backdrop_Switches_to_()_(block)
export function whenBackdropSwitchedTo(backdrop: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'event_whenbackdropswitchesto',
    fields: {
      BACKDROP: backdrop,
    },
  };
}

// https://en.scratch-wiki.info/wiki/When_()_is_greater_than_()_(block)
export function whenXGreaterThanY(
  what: ValuePattern<'loudness' | 'timer'>,
  value: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'event_whengreaterthan',
    fields: {
      WHENGREATERTHANMENU: what,
    },
    inputs: {
      VALUE: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/When_I_Receive_()_(block)
export function whenIReceive(broadcast: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'event_whenbroadcastreceived',
    fields: {
      BROADCAST_OPTION: broadcast,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Broadcast_()_(block)
export function broadcast(name: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'event_broadcast',
    inputs: {
      BROADCAST_INPUT: name,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Broadcast_()_and_Wait_(block)
export function broadcastAndWait(name: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'event_broadcastandwait',
    inputs: {
      BROADCAST_INPUT: name,
    },
  };
}

// https://en.scratch-wiki.info/wiki/When_I_Start_as_a_Clone_(block)
export function whenIStartAsClone(): PatternBlock {
  return {
    opcode: 'control_start_as_clone',
  };
}

// https://en.scratch-wiki.info/wiki/Wait_()_Seconds_(block)
export function wait(duration: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'control_wait',
    inputs: {
      DURATION: duration,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Wait_Until_()_(block)
export function waitUntil(condition: ValuePattern<BooleanBlock>): PatternBlock {
  return {
    opcode: 'control_wait_until',
    inputs: {
      CONDITION: condition,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Create_Clone_of_()_(block)
export function createCloneOf(sprite: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'control_create_clone_of',
    inputs: {
      CLONE_OPTION: script({
        opcode: 'control_create_clone_of_menu',
        fields: {
          CLONE_OPTION: sprite,
        },
      }),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Repeat_()_(block)
export function repeat(
  times: ValuePattern<number>,
  stack: Pattern<BlockScript>,
): PatternBlock {
  return {
    opcode: 'control_repeat',
    inputs: {
      TIMES: times,
      SUBSTACK: stack,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Forever_(block)
export function forever(stack: Pattern<BlockScript>): PatternBlock {
  return {
    opcode: 'control_forever',
    inputs: {
      SUBSTACK: stack,
    },
  };
}

// https://en.scratch-wiki.info/wiki/If_()_Then_(block)
export function ifThen(
  condition: ValuePattern<BooleanBlock>,
  stack: Pattern<BlockScript>,
): PatternBlock {
  return {
    opcode: 'control_if',
    inputs: {
      CONDITION: condition,
      SUBSTACK: stack,
    },
  };
}

// https://en.scratch-wiki.info/wiki/If_()_Then,_Else_(block)
export function ifThenElse(
  condition: ValuePattern<BooleanBlock>,
  ifTrue: Pattern<BlockScript>,
  ifFalse: Pattern<BlockScript>,
): PatternBlock {
  return {
    opcode: 'control_if_else',
    inputs: {
      CONDITION: condition,
      SUBSTACK: ifTrue,
      SUBSTACK2: ifFalse,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Repeat_Until_()_(block)
export function repeatUntil(
  condition: ValuePattern<BooleanBlock>,
  stack: Pattern<BlockScript>,
): PatternBlock {
  return {
    opcode: 'control_repeat_until',
    inputs: {
      CONDITION: condition,
      SUBSTACK: stack,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Stop_()_(block)
export function stop(what: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'control_stop',
    fields: {
      STOP_OPTION: what,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Delete_This_Clone_(block)
export function deleteThisClone(): PatternBlock {
  return {
    opcode: 'control_delete_this_clone',
  };
}

// https://en.scratch-wiki.info/wiki/Reset_Timer_(block)
export function resetTimer(): PatternBlock {
  return {
    opcode: 'sensing_resettimer',
  };
}

// https://en.scratch-wiki.info/wiki/Set_Drag_Mode_()_(block)
export function setDragMode(
  mode: ValuePattern<'draggable' | 'not draggable'>,
): PatternBlock {
  return {
    opcode: 'sensing_setdragmode',
    fields: {
      DRAG_MODE: mode,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Ask_()_and_Wait_(block)
export function askAndWait(question: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'sensing_askandwait',
    inputs: {
      QUESTION: question,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Touching_()%3F_(block)
export function isTouching(object: ValuePattern<string>): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'sensing_touchingobject',
    inputs: {
      TOUCHINGOBJECTMENU: new BlockScript([
        {
          opcode: 'sensing_touchingobjectmenu',
          fields: {
            TOUCHINGOBJECTMENU: object,
          },
        },
      ]),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Touching_Color_()%3F_(block)
export function isTouchingColor(color: ValuePattern<string>): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'sensing_touchingcolor',
    inputs: {
      COLOR: color,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Color_()_is_Touching_()%3F_(block)
export function colorIsTouching(
  color1: ValuePattern<string>,
  color2: ValuePattern<string>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'sensing_coloristouchingcolor',
    inputs: {
      COLOR: color1,
      COLOR2: color2,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Key_()_Pressed%3F_(block)
export function isKeyPressed(key: ValuePattern<KeyPress>): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'sensing_keypressed',
    inputs: {
      KEY_OPTION: script({
        opcode: 'sensing_keyoptions',
        fields: {
          KEY_OPTION: key,
        },
      }),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Mouse_Down%3F_(block)
export function isMouseDown(): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'sensing_mousedown',
  };
}

// https://en.scratch-wiki.info/wiki/Distance_to_()_(block)
export function distanceTo(what: ValuePattern<string>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_distanceto',
    inputs: {
      DISTANCETOMENU: script({
        opcode: 'sensing_distancetomenu',
        fields: {
          DISTANCETOMENU: what,
        },
      }),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Answer_(block)
export function answer(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_answer',
  };
}

// https://en.scratch-wiki.info/wiki/Mouse_X_(block)
export function mouseX(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_mousex',
  };
}

// https://en.scratch-wiki.info/wiki/Mouse_Y_(block)
export function mouseY(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_mousey',
  };
}

// https://en.scratch-wiki.info/wiki/Loudness_(block)
export function loudness(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_loudness',
  };
}

// https://en.scratch-wiki.info/wiki/Timer_(block)
export function timer(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_timer',
  };
}

type SensingProperty =
  | 'x position'
  | 'y position'
  | 'costume #'
  | 'costume name'
  | 'size'
  | 'volume'
  | 'backdrop #'
  | 'backdrop name';

// https://en.scratch-wiki.info/wiki/()_of_()_(Sensing_block)
export function senseXOfY(
  what: ValuePattern<SensingProperty>,
  sprite: ValuePattern<string>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_of',
    fields: {
      PROPERTY: what,
    },
    inputs: {
      OBJECT: script({
        opcode: 'sensing_of_object_menu',
        fields: {
          OBJECT: sprite,
        },
      }),
    },
  };
}

export type CurrentMenu =
  | 'year'
  | 'month'
  | 'date'
  | 'dayofweek'
  | 'hour'
  | 'minute'
  | 'second';

// https://en.scratch-wiki.info/wiki/Current_()_(block)
export function currentX(what: ValuePattern<CurrentMenu>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_current',
    fields: {
      CURRENTMENU: what,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Days_Since_2000_(block)
export function daysSince2000(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_dayssince2000',
  };
}

// https://en.scratch-wiki.info/wiki/Username_(block)
export function username(): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'sensing_username',
  };
}

// https://en.scratch-wiki.info/wiki/()_is_less_than_()_(block)
export function isLessThan(
  a: ValuePattern<number | string>,
  b: ValuePattern<number | string>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'operator_lt',
    inputs: {
      OPERAND1: a,
      OPERAND2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_=_()_(block)
export function equals(
  a: ValuePattern<number | string>,
  b: ValuePattern<number | string>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'operator_equals',
    inputs: {
      OPERAND1: a,
      OPERAND2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_is_greater_than_()_(block)
export function isGreaterThan(
  a: ValuePattern<number | string>,
  b: ValuePattern<number | string>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'operator_gt',
    inputs: {
      OPERAND1: a,
      OPERAND2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_and_()_(block)
export function and(
  a: ValuePattern<BooleanBlock>,
  b: ValuePattern<BooleanBlock>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'operator_and',
    inputs: {
      OPERAND1: a,
      OPERAND2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_or_()_(block)
export function or(
  a: ValuePattern<BooleanBlock>,
  b: ValuePattern<BooleanBlock>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'operator_or',
    inputs: {
      OPERAND1: a,
      OPERAND2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Not_()_(block)
export function not(a: ValuePattern<BooleanBlock>): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'operator_not',
    inputs: {
      OPERAND: a,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_Contains_()%3F_(Operators_block)
export function contains(
  haystack: ValuePattern<string | number>,
  needle: ValuePattern<string | number>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'operator_contains',
    inputs: {
      STRING1: haystack,
      STRING2: needle,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_%2B_()_(block)
export function add(a: ValuePattern<number>, b: ValuePattern<number>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_add',
    inputs: {
      NUM1: a,
      NUM2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_-_()_(block)
export function subtract(
  a: ValuePattern<number>,
  b: ValuePattern<number>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_subtract',
    inputs: {
      NUM1: a,
      NUM2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_*_()_(block)
export function multiply(
  a: ValuePattern<number>,
  b: ValuePattern<number>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_multiply',
    inputs: {
      NUM1: a,
      NUM2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_/_()_(block)
export function divide(a: ValuePattern<number>, b: ValuePattern<number>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_divide',
    inputs: {
      NUM1: a,
      NUM2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Pick_Random_()_to_()_(block)
export function pickRandom(
  from: ValuePattern<number>,
  to: ValuePattern<number>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_random',
    inputs: {
      FROM: from,
      TO: to,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Join_()()_(block)
export function join(
  left: ValuePattern<string | number>,
  right: ValuePattern<string | number>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_join',
    inputs: {
      STRING1: left,
      STRING2: right,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Letter_()_of_()_(block)
export function letterOf(
  position: ValuePattern<number>,
  string: ValuePattern<string>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_letter_of',
    inputs: {
      LETTER: position,
      STRING: string,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Length_of_()_(Operators_block)
export function lengthOf(string: ValuePattern<string>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_length',
    inputs: {
      STRING: string,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_Mod_()_(block)
export function mod(a: ValuePattern<number>, b: ValuePattern<number>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_mod',
    inputs: {
      NUM1: a,
      NUM2: b,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Round_()_(block)
export function round(number: ValuePattern<number>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_round',
    inputs: {
      NUM: number,
    },
  };
}

type MathOperator =
  | 'abs'
  | 'floor'
  | 'ceiling'
  | 'sqrt'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'ln'
  | 'e ^'
  | '10 ^';

// https://en.scratch-wiki.info/wiki/()_of_()_(Operators_block)
export function operatorOf(
  operation: ValuePattern<MathOperator>,
  value: ValuePattern<number>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'operator_mathop',
    fields: {
      OPERATOR: operation,
    },
    inputs: {
      NUM: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Set_()_to_()_(block)
export function setXtoY(
  variable: ValuePattern<string>,
  value: ValuePattern<string | number>,
): PatternBlock {
  return {
    opcode: 'data_setvariableto',
    fields: {
      VARIABLE: variable,
    },
    inputs: {
      VALUE: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Change_()_by_()_(block)
export function changeXbyY(
  variable: ValuePattern<string>,
  delta: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'data_changevariableby',
    fields: {
      VARIABLE: variable,
    },
    inputs: {
      VALUE: delta,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Show_Variable_()_(block)
export function showVariable(variable: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'data_showvariable',
    fields: {
      VARIABLE: variable,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Hide_Variable_()_(block)
export function hideVariable(variable: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'data_hidevariable',
    fields: {
      VARIABLE: variable,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_(Variables_block)
export function variable(variable: Pattern<string>): VariableBlock {
  return {
    type: 'reporter',
    opcode: 'data_variable',
    fields: {
      VARIABLE: variable,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Add_()_to_()_(block)
export function addXtoList(
  value: ValuePattern<number | string>,
  list: ValuePattern<string>,
): PatternBlock {
  return {
    opcode: 'data_addtolist',
    fields: {
      LIST: list,
    },
    inputs: {
      ITEM: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Delete_()_of_()_(block)
export function deleteXfromList(
  index: ValuePattern<number>,
  list: ValuePattern<string>,
): PatternBlock {
  return {
    opcode: 'data_deleteoflist',
    fields: {
      LIST: list,
    },
    inputs: {
      INDEX: index,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Delete_All_of_()_(block)
export function deleteAllFromList(list: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'data_deletealloflist',
    fields: {
      LIST: list,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Insert_()_at_()_of_()_(block)
export function insertAt(
  value: ValuePattern<string | number>,
  at: ValuePattern<number>,
  list: ValuePattern<string>,
): PatternBlock {
  return {
    opcode: 'data_insertatlist',
    fields: {
      LIST: list,
    },
    inputs: {
      ITEM: value,
      INDEX: at,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Replace_Item_()_of_()_with_()_(block)
export function replaceInList(
  index: ValuePattern<string>,
  list: ValuePattern<string>,
  newValue: ValuePattern<string | number>,
): PatternBlock {
  return {
    opcode: 'data_replaceitemoflist',
    fields: {
      LIST: list,
    },
    inputs: {
      INDEX: index,
      ITEM: newValue,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Show_List_()_(block)
export function showList(list: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'data_showlist',
    fields: {
      LIST: list,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Hide_List_()_(block)
export function hideList(list: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'data_hidelist',
    fields: {
      LIST: list,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_(List_block)
export function list(name: ValuePattern<string>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'data_listcontents',
    fields: {
      LIST: name,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Item_()_of_()_(block)
export function itemOfList(
  index: ValuePattern<number>,
  list: ValuePattern<string>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'data_itemoflist',
    fields: {
      LIST: list,
    },
    inputs: {
      INDEX: index,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Length_of_()_(List_block)
export function lengthOfList(list: ValuePattern<string>): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'data_lengthoflist',
    fields: {
      LIST: list,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Item_Number_of_()_in_()_(block)
export function indexOf(
  value: ValuePattern<string | number>,
  list: ValuePattern<string>,
): ReporterBlock {
  return {
    type: 'reporter',
    opcode: 'data_itemnumoflist',
    inputs: {
      ITEM: value,
    },
    fields: {
      LIST: list,
    },
  };
}

// https://en.scratch-wiki.info/wiki/()_Contains_()%3F_(List_block)
export function listContains(
  list: ValuePattern<string>,
  value: ValuePattern<string | number>,
): BooleanBlock {
  return {
    type: 'boolean',
    opcode: 'data_listcontainsitem',
    fields: {
      LIST: list,
    },
    inputs: {
      ITEM: value,
    },
  };
}

/**
 * Match against a procedure definition.
 *
 * The mutation should be a space-separated string, consisting of:
 *
 * - The literal names for labels and procedure names.
 * - %n for numbers
 * - %s for strings
 * - %b for booleans
 *
 * @param mutation The mutation string, see above.
 * @see https://en.scratch-wiki.info/wiki/My_Blocks
 */
export function procedureDefinition(mutation: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'procedures_definition',
    inputs: {
      custom_block: new BlockScript([
        {
          opcode: 'procedures_prototype',
          mutation: mutation,
        },
      ]),
    },
  };
}

/**
 * Match against a procedure call.
 *
 * The arguments of the procedure call should be given in-order,
 * including any labels or names of the procedure.
 * Every argument supports all pattern-related features.
 *
 * @param additionalArguments
 * @see https://en.scratch-wiki.info/wiki/My_Blocks
 */
export function procedureCall(
  ...additionalArguments: Array<ValuePattern<string | number | BooleanBlock>>
): PatternBlock {
  return {
    opcode: 'procedures_call',
    argumentList: additionalArguments,
  };
}
