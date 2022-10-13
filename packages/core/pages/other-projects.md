It is possible to use the judge, or part of it, in other projects.
For example, a debugger might also use the log facilities from the judge.

## Conceptual aspects

The judge itself is built from a bunch of components.
For example, the `Context` class manages, instruments and logs the Scratch VM.
A project like the debugger might use this class directly.
This is currently the only example of using part of the judge, but others might arise in the future.

## Using the log

To set up the log of the judge, without judging a project, you will need to use the `Context` class directly:

```javascript
import { createContextWithVm, Context, snapshotFromVm } from '@ftrprf/judge-core';

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
