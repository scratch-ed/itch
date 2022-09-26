import { snapshotFromSb3 } from '../src/log';
import order2 from './block_order/order_2.json';
import order1 from './block_order/order_1.json';
import duplicateBlocks from './block_order/duplicate_blocks.json';
import missingBlocks from './block_order/missing_blocks.json';
import wrongBlocks from './block_order/wrong_blocks.json';
import {
  ifThen,
  isTouching,
  nothing,
  procedureCall,
  script,
  wait,
  whenIReceive,
} from '../src/matcher/patterns';
import { anyOrder, checkBlocks } from '../src/matcher/differ';
import { GroupLevel } from '../src/testplan/hierarchy';
import { GroupedResultManager } from '../src/output/index';
import { subtreeMatchesOneScript } from '../src/matcher/node-matcher';

function ifCreator(number) {
  return ifThen(
    isTouching(`Schakelaar ${number}`),
    script(procedureCall(`Mag schakelaar ${number} uit?`), nothing()),
  );
}

function createIfPattern(number) {
  return {
    name: `If pattern ${number}`,
    pattern: ifCreator(number),
    feedback: {
      correct: 'Yes',
      wrong: 'No',
    },
  };
}

class MockEvaluation {
  constructor() {
    this.results = [];
    this.groupedOutput = new GroupedResultManager((update) => {
      this.results.push(update);
    });
  }

  get group() {
    return new GroupLevel(this.groupedOutput);
  }
}

function createOrdlessPattern() {
  return [
    {
      name: 'hallo',
      pattern: script(whenIReceive('Start'), wait(2)),
      feedback: {
        correct: 'Yes',
        wrong: 'No',
      },
    },
    anyOrder([
      createIfPattern(1),
      createIfPattern(2),
      createIfPattern(3),
      createIfPattern(4),
      createIfPattern(5),
      createIfPattern(6),
      createIfPattern(8),
      createIfPattern(7),
    ]),
    {
      name: 'Te veel blokjes',
      pattern: nothing(),
      feedback: {
        correct: 'Yes',
        wrong: 'No',
      },
    },
  ];
}

test('Pattern is correct', () => {
  console.log(order2);
  const snapshot = snapshotFromSb3(order2);
  const startNode = snapshot.sprite('Hand').findScript(whenIReceive('Start'), wait(2));

  expect(
    subtreeMatchesOneScript(
      startNode,
      script(
        whenIReceive('Start'),
        wait(2),
        ifCreator(1),
        ifCreator(2),
        ifCreator(3),
        ifCreator(4),
        ifCreator(5),
        ifCreator(6),
        ifCreator(8),
        ifCreator(7),
        nothing(),
      ),
    ),
  ).toBe(true);
});

describe('Order 2', () => {
  const snapshot = snapshotFromSb3(order2);
  const startNode = snapshot.sprite('Hand').findScript(whenIReceive('Start'), wait(2));

  test('Is accepted with normal check', () => {
    const evaluation = new MockEvaluation();

    checkBlocks(evaluation, startNode, [
      {
        name: 'hallo',
        pattern: script(whenIReceive('Start'), wait(2)),
        feedback: {
          correct: 'Yes',
          wrong: 'No',
        },
      },
      createIfPattern(1),
      createIfPattern(2),
      createIfPattern(3),
      createIfPattern(4),
      createIfPattern(5),
      createIfPattern(6),
      createIfPattern(8),
      createIfPattern(7),
      {
        name: 'Te veel blokjes',
        pattern: nothing(),
        feedback: {
          correct: 'Yes',
          wrong: 'No',
        },
      },
    ]);
    evaluation.groupedOutput.closeJudgement();

    const status = evaluation.results
      .map((command) => command.status)
      .filter((status) => status);

    expect(status).toStrictEqual(Array(10).fill('correct'));
  });

  test('Is accepted with orderless check', () => {
    const evaluation = new MockEvaluation();
    checkBlocks(evaluation, startNode, createOrdlessPattern());
    evaluation.groupedOutput.closeJudgement();

    const status = evaluation.results
      .map((command) => command.status)
      .filter((status) => status);

    expect(status).toStrictEqual(Array(10).fill('correct'));
  });
});

test('Order 1 is accepted', () => {
  const snapshot = snapshotFromSb3(order1);
  const startNode = snapshot.sprite('Hand').findScript(whenIReceive('Start'), wait(2));

  const evaluation = new MockEvaluation();
  checkBlocks(evaluation, startNode, createOrdlessPattern());
  evaluation.groupedOutput.closeJudgement();

  const status = evaluation.results
    .map((command) => command.status)
    .filter((status) => status);

  expect(status).toStrictEqual(Array(10).fill('correct'));
});

test('Duplicate blocks are rejected', () => {
  const snapshot = snapshotFromSb3(duplicateBlocks);
  const startNode = snapshot.sprite('Hand').findScript(whenIReceive('Start'), wait(2));

  const evaluation = new MockEvaluation();
  checkBlocks(evaluation, startNode, createOrdlessPattern());
  evaluation.groupedOutput.closeJudgement();

  const status = evaluation.results
    .map((command) => command.status)
    .filter((status) => status);

  expect(status).toStrictEqual(Array(9).fill('correct').concat(['wrong']));
});

test('Missing blocks are rejected', () => {
  const snapshot = snapshotFromSb3(missingBlocks);
  const startNode = snapshot.sprite('Hand').findScript(whenIReceive('Start'), wait(2));

  const evaluation = new MockEvaluation();
  checkBlocks(evaluation, startNode, createOrdlessPattern());
  evaluation.groupedOutput.closeJudgement();

  const status = evaluation.results
    .map((command) => command.status)
    .filter((status) => status);

  expect(status).toStrictEqual(
    Array(7).fill('correct').concat(['wrong', 'wrong', 'correct']),
  );
});

test('Wrong blocks are rejected', () => {
  const snapshot = snapshotFromSb3(wrongBlocks);
  const startNode = snapshot.sprite('Hand').findScript(whenIReceive('Start'), wait(2));

  const evaluation = new MockEvaluation();
  checkBlocks(evaluation, startNode, createOrdlessPattern());
  evaluation.groupedOutput.closeJudgement();

  const status = evaluation.results
    .map((command) => command.status)
    .filter((status) => status);

  expect(status).toStrictEqual(Array(4).fill('correct').concat(Array(6).fill('wrong')));
});
