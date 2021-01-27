# scratch4d-judge

This repo is created with npm workspaces, this means `npm 7` is a requirement. If you use `nvm`, you can simply execute `nvm use` to get the desired `node` and `npm` version.

## Running the judge

This repo contains a few test exercises and test plans, located respecitvely in `./tests/projects` and `./tests/plans`. To start test, execute following commands:

```bash
# This installs the dependencies for the core package and the root package
npm install

# This starts the judge with the config defined in config.js
npm start
```

## Troubleshooting

### Puppeteer complains about my browser

When running into this issue, it might help to manually set the executable for your browser in the `.env` files. For example when using Chromium this might be a valable entry:

```bash
# in .env
PUPPETEER_BROWSER_PATH=/usr/bin/chromium
```

### npm installation fails

Try cleaning your `node_modules` and reinstalling with following commands:

```bash
npm run clean

npm install
```

## Packages

1. The core package in `core`. Given some inputs (e.g. a canvas, files, etc.), this will execute the tests.
2. The "root" package, which will run some tests with puppeteer automatically.

The core package is a NPM workspace. When running `npm install`, it will symlink the workspace into the current node_modules.
