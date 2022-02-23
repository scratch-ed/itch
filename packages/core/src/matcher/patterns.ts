export type Anything = '__any_block_or_value_sentinel__';
export type Pattern<Type> = Type | Anything;
export type ValuePrimitives = string | number | boolean;
export type ValuePattern<T extends ValuePrimitives> =
  | Pattern<T>
  | T[]
  | ((value: T) => boolean);
export const ANYTHING = '__any_block_or_value_sentinel__';

export interface PatternBlock {
  opcode: string;
  // We don't care about the actual value here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputs?: Record<string, ValuePattern<any>>;
  // We don't care about the actual value here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields?: Record<string, ValuePattern<any>>;
}

export function anything(): Anything {
  return ANYTHING;
}

// https://en.scratch-wiki.info/wiki/Move_()_Steps_(block)
export function moveXSteps(steps: ValuePattern<number>): PatternBlock {
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
export function pointInDirectionX(degrees: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_pointindirection',
    inputs: {
      DIRECTION: degrees.toString(),
    },
  };
}

// https://en.scratch-wiki.info/wiki/Point_Towards_()_(block)
export function pointTowardsX(towards: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'motion_pointtowards',
    inputs: {
      TOWARDS: towards,
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
      TO: towards,
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
  towards: ValuePattern<string>,
): PatternBlock {
  return {
    opcode: 'motion_glideto',
    inputs: {
      SECS: secs,
      TO: towards,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Change_X_by_()_(block)
export function changeXByZ(amount: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_changexby',
    inputs: {
      DX: amount,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Change_Y_by_()_(block)
export function changeYByZ(amount: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_changeyby',
    inputs: {
      DY: amount,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Set_X_to_()_(block)
export function setXToZ(value: ValuePattern<number>): PatternBlock {
  return {
    opcode: 'motion_setx',
    inputs: {
      X: value,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Set_Y_to_()_(block)
export function setYToZ(value: ValuePattern<number>): PatternBlock {
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

// https://en.scratch-wiki.info/wiki/Set_Rotation_Style_()_(block)
export function setRotationStyle(style: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'motion_setrotationstyle',
    inputs: {
      STYLE: style,
    },
  };
}

// https://en.scratch-wiki.info/wiki/X_Position_(block)
export function xPosition(): PatternBlock {
  return {
    opcode: 'motion_xposition',
  };
}

// https://en.scratch-wiki.info/wiki/Y_Position_(block)
export function yPosition(): PatternBlock {
  return {
    opcode: 'motion_yposition',
  };
}

// https://en.scratch-wiki.info/wiki/Direction_(block)
export function direction(): PatternBlock {
  return {
    opcode: 'motion_xposition',
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
  return {
    opcode: 'looks_switchcostumeto',
    inputs: {
      COSTUME: costume,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Switch_Backdrop_to_()_(block)
export function switchBackdropTo(backdrop: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'looks_switchbackdropto',
    inputs: {
      BACKDROP: backdrop,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Switch_Backdrop_to_()_and_Wait_(block)
export function switchBackdropToAndWait(backdrop: ValuePattern<string>): PatternBlock {
  return {
    opcode: 'looks_switchbackdroptoandwait',
    inputs: {
      BACKDROP: backdrop,
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
  effect: ValuePattern<string>,
  amount: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'looks_changeeffectby',
    inputs: {
      EFFECT: effect,
      CHANGE: amount,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Set_()_Effect_to_()_(Looks_block)
export function setEffectTo(
  effect: ValuePattern<string>,
  amount: ValuePattern<number>,
): PatternBlock {
  return {
    opcode: 'looks_seteffectto',
    inputs: {
      EFFECT: effect,
      VALUE: amount,
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
    inputs: {
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
      FORWARD_BACKWARD: direction,
      NUM: layers,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Costume_()_(block)
export function costume(numberOrName: ValuePattern<'number' | 'name'>): PatternBlock {
  return {
    opcode: 'looks_costumenumbername',
    inputs: {
      NUMBER_NAME: numberOrName,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Backdrop_()_(block)
export function backdrop(numberOrName: ValuePattern<'number' | 'name'>): PatternBlock {
  return {
    opcode: 'looks_backdropnumbername',
    inputs: {
      NUMBER_NAME: numberOrName,
    },
  };
}

// https://en.scratch-wiki.info/wiki/Size_(block)
export function size(): PatternBlock {
  return { opcode: 'looks_size' };
}

// FIXME: support sound blocks.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function customBlock(
  opcode: string,
  args?: Record<string, ValuePattern<any>>,
): PatternBlock {
  return {
    opcode: opcode,
    inputs: args,
  };
}

// https://en.scratch-wiki.info/wiki/When_Green_Flag_Clicked_(block)
export function greenFlag(): PatternBlock {
  return {
    opcode: 'event_whenflagclicked',
  };
}

// https://en.scratch-wiki.info/wiki/When_()_Key_Pressed_(Events_block)
export function whenKeyPressed(key: ValuePattern<string>): PatternBlock {
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

// https://en.scratch-wiki.info/wiki/Create_Clone_of_()_(block)

// https://en.scratch-wiki.info/wiki/Repeat_()_(block)

// https://en.scratch-wiki.info/wiki/Forever_(block)

// https://en.scratch-wiki.info/wiki/If_()_Then_(block)

// https://en.scratch-wiki.info/wiki/If_()_Then,_Else_(block)

// https://en.scratch-wiki.info/wiki/Repeat_Until_()_(block)

// https://en.scratch-wiki.info/wiki/Stop_()_(block)

// https://en.scratch-wiki.info/wiki/Delete_This_Clone_(block)

// https://en.scratch-wiki.info/wiki/When_I_Receive_()_(block)
