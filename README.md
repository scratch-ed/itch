# scratch4d-judge

Gives feedback on ScratchJudge 3.0 exercises using behavior driven testing.

1. Modify runconfig.json to select exercise
2. Run ```./run < runconfig.json ```


# The judge is split into two packages:

1. The core package in `core`. Given some inputs (e.g. a canvas, files, etc.), this will execute the tests.
2. The "root" package, which will run some tests with puppeteer automatically.

The core package is a NPM workspace. When running `npm install`, it will symlink the workspace into the current node_modules.