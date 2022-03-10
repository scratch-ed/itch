import { snapshotFromSb3 } from '../src/new-log';
import projectData from './agario-NL.json';
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
} from '../src/matcher/patterns';
import { subtreeMatchesOneStack } from '../src/matcher/node-matcher';

function treeMatches(roots, pattern) {
  // Check if a node from the tree matches.
  return roots.some((r) => subtreeMatchesOneStack(r, pattern));
}

describe('Block patterns work', () => {
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
      expect(treeMatches(tree, pattern)).toBe(true);
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
        expect(treeMatches(tree, pattern)).toBe(true);
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
      expect(treeMatches(tree, pattern)).toBe(true);
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
    expect(treeMatches(tree, wrongValue)).toBe(false);

    const wrongNothing = stack(
      whenIReceive('Start'),
      setEffectTo(transparent(), 0),
      repeat(15, stack(changeSizeBy(3), nothing(), changeYBy(-2))),
      repeat(20, stack(changeEffectBy(transparent(), 5), changeSizeBy(3), nothing())),
      hide(),
    );

    expect(treeMatches(tree, wrongNothing)).toBe(false);
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
        switchCostumeTo('Boodschap 1'),
        show(),
        nothing(),
      ),
    ];

    for (const pattern of patterns) {
      expect(treeMatches(tree, pattern)).toBe(true);
    }
  });
});
