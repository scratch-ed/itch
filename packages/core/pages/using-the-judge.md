This document is a description of how to use the judge, from a platform perspective.
Platforms wishing to integrate Itch will find this useful.

## Requirements for execution

As explained in [_Introduction to testing_](./introductuion-to-testing.html), a test plan consists of three phases:

1. Before execution, i.e. static tests.
2. During execution, i.e. instrumenting and instructing the Scratch VM.
3. After execution, i.e. checking the log for the results of phase 2.

For phase 1, no browser environment is required.
Phases 2 and 3 do require a browser environment.

While it might be tempting to split test plans into two, to enable running phase 1 without browser, we recommend against it.
Test plans are designed to be executed as a whole; splitting them may have unforeseen consequences.
Additionally, the speedup achieved by not having a browser environment is vastly outstripped by the time spent in executing exercises that do require a browser environment.

## Running the judge

The judge exposes one function, `run`, which takes a configuration object and runs the test plan on the exercise from that configuration option.
See the JavaScript docs on that function and the configuration object for more information on how to use it.

## Examples

There are a few examples of how to run the judge.
The `runner` package includes two ways:

- A "manual" way, in which you open an HTML page and the judge is run (with the config.json file). This is intended for judge developers and for debugging.
- The automated way, exposing a `runOnPage` function, which expects a Puppeteer page and will run the judge in that page.

Secondly, the `test-utils` package also uses the `runOnPage` function from above to run the tests.

Thirdly, the source code that runs on the AWS Lamba's can be of interest.

### Integrating in other projects

It is possible to use the judge, or part of it, in other projects.
For example, a debugger might also use the log facilities from the judge.

#### Using the log component

To set up the log of the judge, without judging a project, you will need to use the `Context` class directly:

```javascript
import { createContextWithVm, Context, snapshotFromVm } from 'itch-core';

// Create a Context with an existing VM.
const context = await createContextWithVm(vm);
// Instrument the VM with the "debugger" profile.
context.instrumentVm('debugger');
// Start logging.
context.log.started = true;
// Insert the first snapshot in the log.
// While not strictly necessary, it does making the log easier, so
// we recommend it.
const snapshot = snapshotFromVm(this.props.vm);
context.log.registerStartSnapshots(snapshot, snapshot);
```

####

### Running locally

To run the judge locally in debug mode, follow these steps:

1. Modify (or create) the `config.json` file in the root of the repository.
   An example can be found in `config.example.json`:

   ```json
   {
     "template": "tests/projects/status/01.space_mission.sb3",
     "submission": "tests/projects/status/01.space_mission.sb3",
     "testplan": "plans/status/01.space_mission_test.js",
     "debug": false
   }
   ```

2. Open `packages/runner/src/environment/page.html` in your browser.
   Now the judge will load the projects from the `config.json` file and judge them.
