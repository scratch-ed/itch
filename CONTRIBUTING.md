# Contributing

Most of the work will be in the `core` package.

## Core

When working on the core judge, following things should be taken into account:

- Proper documentation, especially for the event scheduler, is needed.
- The judge runs in the browser, so no node API's.

## Debugging

In most cases, you'll have a testplan you want to run while developing the judge.
There are two ways to do this:

1. Run the judge as it is run in production: using puppeteer.
2. In "debug" mode, as a standalone HTML file, which allows you to connect your favourite IDE to do debugging.

So, to start, you'll need to setup the build of the core package `cd code && npm run watch`. This will run a `webpack` server, which will rebuild the core libraries when changes are made.

### Puppeteer

Eiter run it directly using `run` with the input on stdin, or use `node fileEval.js`. This will also run the judge, but read the input from the file `config.json`.

### Debugger

The puppeteer way is annoying, since every time you make a change, you need to close puppeteer, let the rebuild finish, and re-open puppeteer.

The solution is `debug.html`. Serve this file with your favourite HTTP server (e.g. Webstorm has this built-in) and open it in the browser. This file will also read `config.json`, but execute everything in-browser.

This allows the following workflow:

1. Start the webpack watcher, as described above.
2. Open `debug.html` in a browser, e.g. via webstorm (which allows you to attach the debugger as well).
3. Make changes to the core.
4. Webpack will rebuild.
5. Refresh the `debug.html` page in the browser and voilà - new changes are live in the browser, and the testplan will be run again.
