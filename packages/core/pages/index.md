# Documentation for the Scratch Judge

This is the documentation for the Scratch Judge.

## Scratch primer

It is useful to understand how Scratch works internally.
The UI and all the stuff that's visible for students in handled in the ScratchGUI project.
This is a React web app, basically an editor for Sb3 files.
Note that the canvas is not included.

The core of actually executing the Sb3 files is done using the Scratch VM.
This is a normal JavaScript library, containing the VM used to run Scratch.
It reads the blocks from the SB3 files, and executes them.
The VM also manages the canvas using the Scratch Renderer, which is a WebGL-based rendering engine.

There are few more helper packages used by the VM, but these are less important for the Scratch Judge, as the judge only interacts with the VM and the Renderer.

## Components

The repository is a mono-repo with a few components.

The code of the judge is located in `/packages/core`.
Since Scratch is executed in a browser, this is a browser-library, meaning there is no access to the usual NodeJS APIs.
This package is responsible for the actual judging.
It will interact with the Scratch VM and Renderer to instrument it, capture everything that happens and event run events.

While the core is a browser library, we need a better way to run the judge on a solution.
To this end, the `packages/runner` package exists.
It allows running the judge manually (via an HTML file) or in a more automated way, using puppeteer.
This package is used by the AWS repo to actually run the judge.
See the readme in the package for more information.
Other relevant information is found in the [feedback documentation](./feedback.md), which explains the format of the results coming out of the judge.

There are two more utility packages:

- `packages/test-utils`: utilities to run the judge from jest tests, used in the exercises (see later)
- `packages/ipm`: the "itch package manager", allows downloading SB3 files and translation data from the FTRPRF servers.

Finally, there are exercises in `/exercises`.
Each exercise is its own "JavaScript package", containing one or more test plans.
Additionally, there are some jest tests, to ensure we don't break the test plan by changing the judge.
See the [documentation on test plans](./testplan.md) for more information about the test plans.
