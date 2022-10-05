This document is a short introduction to the concept of testing Scratch exercises with the Scratch judge.
It doesn't focus on the full technical details, which are linked where appropriate.

The document [_Tools for testplan authors_](./tools-for-authors.html) might also be useful.
It contains a more practical guide to get started when writing testplans.
It also details how the translations work.

## Types of tests

How a Scratch exercise is tested also depends on what you want to achieve with the exercise.
In general, there are two types of tests:

- Static tests, where the Scratch project is not executed.
  This means the test only looks at the blocks, but doesn't execute the project.
- Dynamic tests, where the Scratch project is executed.
  Here, the full Scratch project is run with simulated user input (e.g. pressing the green flag or clicking a sprite).

Static tests are generally easier to write and faster to execute, but are severely limited in what they can test.
Assessing whether a project uses a certain block (e.g. a loop block) somewhere in the project is typically done with static tests.
Assessing whether a preprogrammed sprite (e.g. blocks that are provided in the starter project) was not modified is also done with static tests.

Checking more high-level goals, such as "Does the sprite move when clicked?", are more difficult with static tests.
You often don't want to limit an accepted solution to just the way you would solve it.
There are multiple ways a sprite can move, and probably want to accept them all.
In this case, dynamic tests are needed.
You need to execute the project, simulate someone clicking the sprite under test and finally checking if the sprite did move.

## Output of a "test"

After a test of an exercise, you need some kind of feedback, to indicate which tests passed and which didn't.
The result of a test is a hierarchical structure of groups and tests.
A test is, as the name implies, a check on some property of the exercise.
It can be correct or wrong, and contains feedback for both cases.
Additionally, a test also has a name and can include additional information, such as diffs, messages, etc.
However, most of the additional information is not used at the moment.

Structure is added by grouping the tests into, again the aptly named, groups.
Groups can be nested, so groups inside groups inside groups ... is possible.
While there is no hard limit, we generally try to keep the number of levels small (think 3 or less).

Groups are used for more than just structure though.
They also support a notion of visibility, with three modes:

- Visible: the group is expanded, all children are visible.
- Hidden: the group is completely hidden, unless one of the tests fails.
- Summary: the group is collapsed by default and a summary message is shown, unless one of the tests fails.

The Scratch judge offers a set of functions that will take care of outputting the result in the correct format.
An example of a test inside a group is:

```javascript
e.group.group('Tests for sprite A', () => {
  e.group
    .test('Sprite A does stuff right')
    .feedback({
      correct: 'Good job, sprite A does get stuff right!',
      wrong: 'Oh no, sprite A does not get it right, take another look.',
    })
    .expect('some value')
    .toBe('another value');
});
```

The double `group.group` is not a typo, but needed for backwards compatibility with older testplans.
At some point, it will be removed.

The example above is a group with a single test.
The test, as written in the example, will always fail, since it expects the string `"some value"` to be equal to `"another value"`.
Users of Jest will recognize the `expect`/`toBe` notation.

A more conceptual overview of the output format is given in the [_Output format_](./feedback.html) document.
The documentation for use in the testplans resides in the [JavaScript docs for the `hierarchy` module](../modules/testplan_hierarchy.html).

## Testing with the Scratch judge

The link between a Scratch exercise and the test feedback is the testplan.
This is the test suite and contains the actual tests, which will be executed by the judge.
It thus also contains all the feedback that should be given.

When testing exercises, three phases are executed:

1. Before execution.
   This phase happens before the Scratch project is executed.
2. During execution.
   In this phase, you actually run the Scratch project.
   This means simulating user interactions.
3. After execution (or _post-mortem tests_).
   Here, the execution has finished and various data were recorded in the log.

These phases are represented in the testplan by functions:

```javascript
/** @param {Evaluation} e */
function beforeExecution(e) {}

/** @param {Evaluation} e */
function duringExecution(e) {}

/** @param {Evaluation} e */
function afterExecution(e) {}
```

The argument to these functions is the `Evaluation` object.
This provides access to all the tools needed in the tests,
from the scheduler to simulate user interaction, to the functions used to group and write tests.
This is explained in detail in the [`Evaluation` JavaScript docs](../classes/evaluation.Evaluation.html).

### Before execution

The _before execution_ phase allows for execution static tests.
In general, if possible to test statically, you should use static tests, as they are very fast.

The Scratch judge has tools specifically to facilitate testing that the students did not modify the existing code (or, for example, that they didn't remove some sprites).
This is implemented a function called `checkPredefinedBlocks`.
More details can be found in the [JavaScript docs for the `checkPredefinedBlocks`](../functions/testplan_predefined_blocks.checkPredefinedBlocks.html) function.

Abstractions also exist to statically test for a set blocks.
For example, you might want to verify that a certain sprite has a specific script of blocks.
This is achieved by having a set of functions that represent blocks, and accompanying functions that allow comparing those block representations against the Scratch project.

For example, consider the following script:

![image](../media/stack.png)

This can be represented in a testplan as follows:

```javascript
script(
  whenIReceive('Start'),
  setEffectTo(transparent(), 0),
  repeat(15, script(changeSizeBy(3), changeYBy(-2))),
  repeat(20, script(changeEffectBy(transparent(), 5), changeSizeBy(3))),
  hide(),
);
```

The relevant documentation for these features is:

- The [`differ` module](../modules/matcher_differ.html), which contains the code to compare a set of blocks against a Scratch project.
- A list of all available blocks in the [`patterns` module](../modules/matcher_patterns.html) docs.

## During execution

In this phase, the main objective is to simulate user interaction and command the Scratch VM to do stuff.
This is achieved by using the [`Scheduler` instance](../classes/scheduler_scheduled_event.ScheduledEvent.html), which allows you to "schedule" (i.e. plan) which events will be executed on the Scratch project.

For example, a small example where the green flag is pressed, a wait of 800 ms and then pressing the `s` key:

```javascript
/** @param {Evaluation} e */
function duringExecution(e) {
  e.scheduler.greenFlag(true).wait(800).pressKey('s');
}
```

Tests themselves are seldom written in the _during execution_ phase, as all information is stored in the log.
This log can then be queried in the _after execution_ phase.

## After execution

Each scheduled event and a set of actions in the Scratch VM are logged in the log.
In this phase, most tests will examine the log and derive a conclusion from the information found in the log.

A good starting point for information on the log is the [JavaScript docs for the `Log` class](../classes/log.Log.html).
Of course, you should click through to find information on other available types.
