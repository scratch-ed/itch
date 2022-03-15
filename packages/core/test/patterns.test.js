import { snapshotFromSb3 } from '../src/new-log';
import projectData from './agario-NL.json';
import allBlocks from './all-blocks-NL.json';
import {
  equals,
  forever,
  glideZSecsToX,
  goTo,
  greenFlag,
  hide,
  ifOnEdgeBounce,
  ifThenElse,
  isTouching,
  moveXSteps,
  pickRandom,
  repeat,
  procedureCall,
  procedureDefinition,
  repeatUntil,
  setSizeTo,
  setXtoY,
  show,
  stack,
  wait,
  add,
  subtract,
  whenIReceive,
  direction,
  pointInDirection,
  switchBackdropTo,
  goToXY,
  setEffectTo,
  transparent,
  changeSizeBy,
  changeYBy,
  changeEffectBy,
  nothing,
  whenKeyPressed,
  broadcast,
  switchCostumeTo,
  turnRightXDegrees,
  turnLeftXDegrees,
  pointTowards,
  glideZSecsToXY,
  changeXBy,
  setXTo,
  setYTo,
  setRotationStyle,
  Rotation,
  xPosition,
  size,
  yPosition,
  sayForXSeconds,
  say,
  thinkForXSeconds,
  think,
  switchBackdropToAndWait,
  nextCostume,
  nextBackdrop,
  clearGraphicsEffects,
  goToLayer,
  goLayers,
  costume,
  backdrop,
  customBlock,
  whenSpriteClicked,
  whenBackdropSwitchedTo,
  whenXGreaterThanY,
  broadcastAndWait,
  whenIStartAsClone,
  waitUntil,
  loudness,
  join,
  createCloneOf,
  ifThen,
  isMouseDown,
  stop,
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
  round,
  daysSince2000,
  username,
  isLessThan,
  isGreaterThan,
  and,
  or,
  not,
  contains,
  letterOf,
  lengthOf,
  mod,
  operatorOf,
  changeXbyY,
  showVariable,
  hideVariable,
  variable,
  addXtoList,
  deleteXfromList,
  deleteAllFromList,
  insertAt,
  indexOf,
  replaceInList,
  showList,
  hideList,
  list,
  itemOfList,
  lengthOfList,
  listContains,
  BlockStack,
} from '../src/matcher/patterns';
import { subtreeMatchesOneStack } from '../src/matcher/node-matcher';

expect.extend({
  /**
   * @param {Node[]} trees
   * @param {PatternBlock | BlockStack} pattern
   * @returns {{pass: boolean, message: (function(): string)}}
   */
  toMatchPattern(trees, pattern) {
    if (!(pattern instanceof BlockStack)) {
      pattern = stack(pattern);
    }
    const filtered = trees.filter((node) => subtreeMatchesOneStack(node, pattern));
    const pass = filtered.length === 1;
    if (pass) {
      return {
        message: () => `expected to find one block`,
        pass: true,
      };
    } else {
      let maybe = trees.filter((t) => t.opcode === pattern.opcode);
      if (maybe.length === 1) {
        maybe = maybe[0];
      }
      return {
        message: () =>
          `expected to find one block, but found ${filtered.length}\n\n` +
          `Expected: ${this.utils.printExpected(pattern)}\n` +
          `Received: ${this.utils.printReceived(maybe)}`,
        pass: false,
      };
    }
  },
});

describe('Integration tests for patterns', () => {
  // Load the blocks from the project.
  const snapshot = snapshotFromSb3(projectData);

  test.each(['Vijand 1', 'Vijand 2'])('Tests for vijand %s', (name) => {
    const target = snapshot.target(name);
    const tree = Array.from(target.blockTree());

    const patterns = [
      stack(
        whenIReceive('Start'),
        setSizeTo(80),
        show(),
        forever(stack(glideZSecsToX(5, '_random_'))),
      ),
      stack(greenFlag(), hide()),
    ];

    for (const pattern of patterns) {
      expect(tree).toMatchPattern(pattern);
    }
  });

  test.each(['Voedsel 1', 'Voedsel 2', 'Voedsel 3', 'Voedsel 4'])(
    'Tests for voedsel %s',
    (name) => {
      const target = snapshot.target(name);
      const tree = Array.from(target.blockTree());

      const patterns = [
        stack(
          whenIReceive('Start'),
          setSizeTo(20),
          forever(
            stack(
              hide(),
              wait(1),
              goTo('_random_'),
              show(),
              procedureCall(
                'Beweeg in een willekeurige richting tot je de planeet raakt',
              ),
            ),
          ),
        ),
        stack(greenFlag(), hide()),
        stack(whenIReceive('Start'), setXtoY('Richting', 0)),
        stack(
          procedureDefinition(
            'Beweeg in een willekeurige richting tot je de planeet raakt',
          ),
          repeatUntil(
            isTouching('Planeet'),
            stack(
              moveXSteps(2),
              ifOnEdgeBounce(),
              setXtoY('Richting', pickRandom(0, 1)),
              ifThenElse(
                equals('Richting', 1),
                stack(pointInDirection(add(direction(), 4))),
                stack(pointInDirection(subtract(direction(), 4))),
              ),
            ),
          ),
        ),
      ];

      for (const pattern of patterns) {
        expect(tree).toMatchPattern(pattern);
      }
    },
  );

  test('Tests for scherm', () => {
    const target = snapshot.target('Scherm');
    const tree = Array.from(target.blockTree());

    const patterns = [
      stack(
        greenFlag(),
        show(),
        switchBackdropTo('game'),
        goToXY(0, 0),
        setSizeTo(100),
        nothing(),
      ),
      stack(
        whenIReceive('Start'),
        setEffectTo(transparent(), 0),
        repeat(15, stack(changeSizeBy(3), changeYBy(-2), nothing())),
        repeat(20, stack(changeEffectBy(transparent(), 5), changeSizeBy(3), nothing())),
        hide(),
        nothing(),
      ),
    ];

    for (const pattern of patterns) {
      expect(tree).toMatchPattern(pattern);
    }

    const wrongValue = stack(
      whenIReceive('Start'),
      setEffectTo(transparent(), 0),
      repeat(15, stack(changeSizeBy(3), changeYBy(-2))),
      repeat(
        20,
        stack(
          changeEffectBy(transparent(), 5),
          changeSizeBy(4), // This is wrong
        ),
      ),
      hide(),
      nothing(),
    );
    expect(tree).not.toMatchPattern(wrongValue);

    const wrongNothing = stack(
      whenIReceive('Start'),
      setEffectTo(transparent(), 0),
      repeat(15, stack(changeSizeBy(3), nothing(), changeYBy(-2))),
      repeat(20, stack(changeEffectBy(transparent(), 5), changeSizeBy(3), nothing())),
      hide(),
    );

    expect(tree).not.toMatchPattern(wrongNothing);
  });

  test('Test for boodschap 1', () => {
    const target = snapshot.target('Boodschap 1');
    const tree = Array.from(target.blockTree());

    const patterns = [
      stack(whenKeyPressed('space'), broadcast('Start')),
      stack(whenIReceive('Start'), hide()),
      stack(
        greenFlag(),
        setXtoY('Boodschap 1', 'Boodschap 1'),
        switchCostumeTo(variable('Boodschap 1')),
        show(),
        nothing(),
      ),
    ];

    for (const pattern of patterns) {
      expect(tree).toMatchPattern(pattern);
    }
  });
});

describe('Individual blocks', () => {
  // Load the blocks from the project.
  const snapshot = snapshotFromSb3(allBlocks);
  const target = snapshot.target('Sprite1');
  const trees = Array.from(target.blockTree());

  test('motion_movesteps', () => {
    expect(trees).toMatchPattern(moveXSteps(10));
  });

  test('motion_turnright', () => {
    expect(trees).toMatchPattern(turnRightXDegrees(15));
  });

  test('motion_turnleft', () => {
    expect(trees).toMatchPattern(turnLeftXDegrees(15));
  });

  test('motion_pointindirection', () => {
    expect(trees).toMatchPattern(pointInDirection(90));
  });

  test('motion_pointtowards', () => {
    expect(trees).toMatchPattern(pointTowards('_mouse_'));
  });

  test('motion_gotoxy', () => {
    expect(trees).toMatchPattern(goToXY(0, 0));
  });

  test('motion_goto random', () => {
    expect(trees).toMatchPattern(goTo('_random_'));
  });

  test('motion_goto mouse', () => {
    expect(trees).toMatchPattern(goTo('_mouse_'));
  });

  test('motion_goto sprite', () => {
    expect(trees).toMatchPattern(goTo('Cat'));
  });

  test('motion_glidesecstoxy', () => {
    expect(trees).toMatchPattern(glideZSecsToXY(1, 0, 0));
  });

  test('motion_glideto random', () => {
    expect(trees).toMatchPattern(glideZSecsToX(1, '_random_'));
  });

  test('motion_glideto sprite', () => {
    expect(trees).toMatchPattern(glideZSecsToX(1, 'Cat'));
  });

  test('motion_changexby', () => {
    expect(trees).toMatchPattern(changeXBy(10));
  });

  test('motion_changeyby', () => {
    expect(trees).toMatchPattern(changeYBy(10));
  });

  test('motion_setx', () => {
    expect(trees).toMatchPattern(setXTo(0));
  });

  test('motion_sety', () => {
    expect(trees).toMatchPattern(setYTo(0));
  });

  test('motion_ifonedgebounce', () => {
    expect(trees).toMatchPattern(ifOnEdgeBounce());
  });

  test('motion_setrotationstyle', () => {
    expect(trees).toMatchPattern(setRotationStyle(Rotation.LeftRight));
  });

  test('motion_xposition', () => {
    expect(trees).toMatchPattern(xPosition());
  });

  test('motion_yposition', () => {
    expect(trees).toMatchPattern(yPosition());
  });

  test('motion_direction', () => {
    expect(trees).toMatchPattern(direction());
  });

  test('looks_sayforsecs', () => {
    expect(trees).toMatchPattern(sayForXSeconds('Hello!', 2));
  });

  test('looks_say', () => {
    expect(trees).toMatchPattern(say('Hello!'));
  });

  test('looks_say list', () => {
    expect(trees).toMatchPattern(say('list'));
  });

  test('looks_thinkforsecs', () => {
    expect(trees).toMatchPattern(thinkForXSeconds('Hmm...', 2));
  });

  test('looks_think', () => {
    expect(trees).toMatchPattern(think('Hmm...'));
  });

  test('looks_show', () => {
    expect(trees).toMatchPattern(show());
  });

  test('looks_hide', () => {
    expect(trees).toMatchPattern(hide());
  });

  test('looks_switchcostumeto', () => {
    expect(trees).toMatchPattern(switchCostumeTo('costume2'));
  });

  test('looks_switchbackdropto', () => {
    expect(trees).toMatchPattern(switchBackdropTo('backdrop1'));
  });

  test('looks_switchbackdroptoandwait', () => {
    expect(trees).toMatchPattern(switchBackdropToAndWait('random backdrop'));
  });

  test('looks_nextcostume', () => {
    expect(trees).toMatchPattern(nextCostume());
  });

  test('looks_nextbackdrop', () => {
    expect(trees).toMatchPattern(nextBackdrop());
  });

  test('looks_changeeffectby', () => {
    expect(trees).toMatchPattern(changeEffectBy('color', 25));
  });

  test('looks_seteffectto', () => {
    expect(trees).toMatchPattern(setEffectTo('color', 0));
  });

  test('looks_cleargraphiceffects', () => {
    expect(trees).toMatchPattern(clearGraphicsEffects());
  });

  test('looks_changesizeby', () => {
    expect(trees).toMatchPattern(changeSizeBy(10));
  });

  test('looks_setsizeto', () => {
    expect(trees).toMatchPattern(setSizeTo(100));
  });

  test('looks_gotofrontback', () => {
    expect(trees).toMatchPattern(goToLayer('front'));
  });

  test('looks_goforwardbackwardlayers', () => {
    expect(trees).toMatchPattern(goLayers('backward', 1));
  });

  test('looks_costumenumbername', () => {
    expect(trees).toMatchPattern(costume('number'));
  });

  test('looks_backdropnumbername', () => {
    expect(trees).toMatchPattern(backdrop('name'));
  });

  test('looks_size', () => {
    expect(trees).toMatchPattern(size());
  });

  test('custom block', () => {
    expect(trees).toMatchPattern(
      customBlock(
        'looks_backdropnumbername',
        {},
        {
          NUMBER_NAME: 'name',
        },
      ),
    );
  });

  test('event_whenflagclicked', () => {
    expect(trees).toMatchPattern(greenFlag());
  });

  test('event_whenkeypressed', () => {
    expect(trees).toMatchPattern(whenKeyPressed('space'));
  });

  test('event_whenthisspriteclicked', () => {
    expect(trees).toMatchPattern(whenSpriteClicked());
  });

  test('event_whenbackdropswitchesto', () => {
    expect(trees).toMatchPattern(whenBackdropSwitchedTo('backdrop1'));
  });

  test('event_whengreaterthan', () => {
    expect(trees).toMatchPattern(whenXGreaterThanY('loudness', 10));
  });

  test('event_whenbroadcastreceived', () => {
    expect(trees).toMatchPattern(whenIReceive('bericht1'));
  });

  test('event_broadcast', () => {
    expect(trees).toMatchPattern(broadcast('bericht1'));
  });

  test('event_broadcastandwait', () => {
    expect(trees).toMatchPattern(broadcastAndWait('bericht1'));
  });

  test('control_start_as_clone', () => {
    expect(trees).toMatchPattern(whenIStartAsClone());
  });

  test('control_wait', () => {
    expect(trees).toMatchPattern(wait(1));
  });

  test('control_wait_until', () => {
    expect(trees).toMatchPattern(waitUntil(equals(loudness(), 50)));
  });

  test('control_create_clone_of', () => {
    expect(trees).toMatchPattern(createCloneOf('_myself_'));
  });

  test('control_repeat', () => {
    expect(trees).toMatchPattern(repeat(10, stack(say('Hallo!'))));
  });

  test('control_forever', () => {
    expect(trees).toMatchPattern(forever(stack(say('Hallo!'))));
  });

  test('control_if', () => {
    expect(trees).toMatchPattern(ifThen(isMouseDown(), stack(say('Hallo!'), nothing())));
  });

  test('ifThenElse', () => {
    expect(trees).toMatchPattern(
      ifThenElse(
        equals(50, 50),
        stack(say('Hallo!'), nothing()),
        stack(say('Hallo!'), nothing()),
      ),
    );
  });

  test('control_repeat_until', () => {
    expect(trees).toMatchPattern(
      repeatUntil(equals(50, 50), stack(say('Hallo!'), nothing())),
    );
  });

  test('control_stop', () => {
    expect(trees).toMatchPattern(stop('all'));
  });

  test('control_delete_this_clone', () => {
    expect(trees).toMatchPattern(deleteThisClone());
  });

  test('sensing_resettimer', () => {
    expect(trees).toMatchPattern(resetTimer());
  });

  test('sensing_setdragmode', () => {
    expect(trees).toMatchPattern(setDragMode('not draggable'));
  });

  test('sensing_askandwait', () => {
    expect(trees).toMatchPattern(askAndWait("What's your name?"));
  });

  test('sensing_touchingobject', () => {
    expect(trees).toMatchPattern(isTouching(''));
  });

  test('sensing_touchingcolor', () => {
    expect(trees).toMatchPattern(isTouchingColor('#64cf38'));
  });

  test('sensing_coloristouchingcolor', () => {
    expect(trees).toMatchPattern(colorIsTouching('#03ed70', '#cb501b'));
  });

  test('sensing_keypressed', () => {
    expect(trees).toMatchPattern(isKeyPressed('space'));
  });

  test('sensing_mousedown', () => {
    expect(trees).toMatchPattern(isMouseDown());
  });

  test('sensing_distanceto', () => {
    expect(trees).toMatchPattern(distanceTo(''));
  });

  test('sensing_answer', () => {
    expect(trees).toMatchPattern(answer());
  });

  test('sensing_mousex', () => {
    expect(trees).toMatchPattern(mouseX());
  });

  test('sensing_mousey', () => {
    expect(trees).toMatchPattern(mouseY());
  });

  test('sensing_loudness', () => {
    expect(trees).toMatchPattern(loudness());
  });

  test('sensing_timer', () => {
    expect(trees).toMatchPattern(timer());
  });

  test('sensing_of', () => {
    expect(trees).toMatchPattern(senseXOfY('x position', 'Sprite1'));
  });

  test('sensing_current', () => {
    expect(trees).toMatchPattern(currentX('minute'));
  });

  test('sensing_dayssince2000', () => {
    expect(trees).toMatchPattern(daysSince2000());
  });

  test('sensing_username', () => {
    expect(trees).toMatchPattern(username());
  });

  test('operator_lt', () => {
    expect(trees).toMatchPattern(isLessThan(1, 2));
  });

  test('operator_equals', () => {
    expect(trees).toMatchPattern(equals(10, 10));
  });

  test('operator_equals variables and lists', () => {
    expect(trees).toMatchPattern(equals('normal variable', 'list'));
  });

  test('operator_gt', () => {
    expect(trees).toMatchPattern(isGreaterThan(20, 20));
  });

  test('operator_and', () => {
    const a = equals(50, 50);
    expect(trees).toMatchPattern(and(a, a));
  });

  test('operator_or', () => {
    expect(trees).toMatchPattern(or(equals(50, 50), isGreaterThan(50, 50)));
  });

  test('operator_not', () => {
    expect(trees).toMatchPattern(not(equals(50, 50)));
  });

  test('operator_contains', () => {
    expect(trees).toMatchPattern(contains('appel', 'a'));
  });

  test('operator_add', () => {
    expect(trees).toMatchPattern(add(10, 10));
  });

  test('operator_subtract', () => {
    expect(trees).toMatchPattern(subtract(10, 10));
  });

  test('operator_multiply', () => {
    expect(trees).toMatchPattern(multiply(25, 36));
  });

  test('operator_divide', () => {
    expect(trees).toMatchPattern(divide(20, 30));
  });

  test('operator_random', () => {
    expect(trees).toMatchPattern(pickRandom(1, 10));
  });

  test('operator_join', () => {
    expect(trees).toMatchPattern(join('hello ', 'world'));
  });

  test('operator_letter_of', () => {
    expect(trees).toMatchPattern(letterOf(1, 'world'));
  });

  test('operator_length', () => {
    expect(trees).toMatchPattern(lengthOf('world'));
  });

  test('operator_mod', () => {
    expect(trees).toMatchPattern(mod(20, 10));
  });

  test('operator_round', () => {
    expect(trees).toMatchPattern(round('2.3'));
  });

  test('operator_mathop', () => {
    expect(trees).toMatchPattern(operatorOf('sqrt', 9));
  });

  test('data_setvariableto', () => {
    expect(trees).toMatchPattern(setXtoY('normal variable', 0));
  });

  test('data_changevariableby', () => {
    expect(trees).toMatchPattern(changeXbyY('normal variable', 1));
  });

  test('data_showvariable', () => {
    expect(trees).toMatchPattern(showVariable('normal variable'));
  });

  test('data_hidevariable', () => {
    expect(trees).toMatchPattern(hideVariable('normal variable'));
  });

  // FIXME: this is a monitor, not a normal blocks.
  test.skip('data_variable', () => {
    expect(trees).toMatchPattern(variable('normal variable'));
  });

  test('data_addtolist', () => {
    expect(trees).toMatchPattern(addXtoList('thing', 'list'));
  });

  test('data_deleteoflist', () => {
    expect(trees).toMatchPattern(deleteXfromList(1, 'list'));
  });

  test('data_deletealloflist', () => {
    expect(trees).toMatchPattern(deleteAllFromList('list'));
  });

  test('data_insertatlist', () => {
    expect(trees).toMatchPattern(insertAt('thing', 1, 'list'));
  });

  test('data_replaceitemoflist', () => {
    expect(trees).toMatchPattern(replaceInList(1, 'list', 'thing'));
  });

  test('data_showlist', () => {
    expect(trees).toMatchPattern(showList('list'));
  });

  test('data_hidelist', () => {
    expect(trees).toMatchPattern(hideList('list'));
  });

  // FIXME: this is a monitor, not a normal block.
  test.skip('data_listcontents', () => {
    expect(trees).toMatchPattern(list('list'));
  });

  test('data_itemoflist', () => {
    expect(trees).toMatchPattern(itemOfList(1, 'list'));
  });

  test('data_lengthoflist', () => {
    expect(trees).toMatchPattern(lengthOfList('list'));
  });

  test('data_itemnumoflist', () => {
    expect(trees).toMatchPattern(indexOf('ding', 'list'));
  });

  test('data_listcontainsitem', () => {
    expect(trees).toMatchPattern(listContains('list', 'thing'));
  });

  test('procedures_definition', () => {
    expect(trees).toMatchPattern(procedureDefinition('%n %s %b'));
  });

  test('procedures_call', () => {
    expect(trees).toMatchPattern(procedureCall('%n %s %b'));
  });
});
