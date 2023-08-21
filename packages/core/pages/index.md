This is the documentation for the Scratch Judge.
It contains high-level information, linking to the JavaScript docs where appropriate.
Given some Scratch and JavaScript knowledge, you should be able to write test suites after reading this documentation.
If that is not the case, the documentation should be updated.

## Components

There are quite a few moving parts in the Scratch Judge.
This section attempts to give an overview.

### Scratch

It is useful to have some knowledge of how Scratch works internally when using the Scratch judge.

Scratch is an umbrella term for a few packages that work together to deliver the full Scratch experience.
The most important packages are:

- The Scratch GUI.
  This is the graphical user interface that you see when you open Scratch.
  It is written in JavaScript and React.
- The Scratch VM.
  This is the "brain" of the operation.
  This takes the Scratch blocks, converts them to an internal representation and executes the code.

Critically, Scratch blocks are not converted to a "normal" programming language when executing.
There is thus no JavaScript or Python version of a Scratch project.
The Scratch blocks are executed directly.

Finally, another Scratch package that is important for the judge is the Scratch renderer.
This package takes commands from the Scratch VM and draws everything you see in the Stage.

### Scratch judge ("Itch")

When an exercise is tested, the judge receives three things:

- The unmodified starter project (although it is the published and thus translated version).
- The solution project created by the student.
- The testplan for the exercise in question.

## This repository

The judge's repository is a mono-repo with a few components.
The most important ones are:

- The code of the judge is located in `/packages/core`.
  Since Scratch is executed in a browser, this is a browser-library, meaning there is no access to the usual NodeJS APIs.
  This package is responsible for the actual judging.
  It will interact with the Scratch VM and Renderer to instrument it, capture everything that happens and event run events.
- The runner in `packages/runner`.
  While the core is a browser library, we need a better way to run the judge on a solution.
  The runner allows running the judge manually (via an HTML file) or in a more automated way, using puppeteer.
  This package is used by the AWS repo to actually run the judge.
  See the readme in the package for more information.

There are two more utility packages:

- `packages/test-utils`: utilities to run the judge from jest tests, used in the exercises (see later)

Finally, there are exercises in `/exercises`.
Each exercise is its own "JavaScript package", containing one or more test plans.

The next step is to read the [_Introduction to testing Scratch exercises_](./introduction-to-testing.html).
Alternatively, you can read the documentation on using the judge in other projects, such as the debugger.

Finally, if you are interested in running the judge yourself, consult [_Using the judge_](./using-the-judge.html).
