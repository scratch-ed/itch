# scratch-judge

Repo for the Scratch judge.

## Requirements

This repo uses _npm_ workspaces, so you need a recent version of npm (> 7.7):

- node: 15.x.x
- npm: 7.7+

If you use `nvm`, you can simply execute `nvm use` to get the desired `node` and `npm` version.

## Running the judge

For more high-level docs, see [here](./packages/core/pages/index.md).
You can also build the docs for a better experience.

To start, run `npm run build`.

To run the judge in debug mode:

- Open `packages/runner/src/environment/page.html` in your browser. This will load and execute a project based on the `config.json` file.

### Config

The `config.json` file is used to determine what project should be judged.
An example can be found in `config.example.json`:

```json
{
  "template": "tests/projects/status/01.space_mission.sb3",
  "submission": "tests/projects/status/01.space_mission.sb3",
  "testplan": "plans/status/01.space_mission_test.js",
  "debug": false
}
```

The properties are:

- **template**: path to the template sb3 file, relative to the root of the repo.
- **submission**: path to the solution sb3 file, relative to the root of the repo.
- **plan**: plan to the testplan, relative to the root of the repo.
- **debug**: if true and run with puppeteer, the browser will open, otherwise it will be headless.

Getting the local files can be done with:

```bash
$ npm run ipm --workspace packages/ipm -- down ../../exercises/agario
```

## Troubleshooting

### Puppeteer complains about my browser

When running into this issue, it might help to manually set the executable for your browser in the `.env` files. For example when using Chromium this might be a viable entry:

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

## Deployment

To deploy the judge, you'll need to do 4 things:

1. Tag a new version
2. Create and publish that version as a npm package
3. Update the AWS repo to point to that version
4. Publish to AWS

#### Tagging a new version

Some presets are available: `npm run release:prerelease|patch|minor|major`.
Otherwise, use `npm version` to do it.

Until https://github.com/npm/cli/issues/4017 is fixed, you'll need to manually
commit all changed files and tag the commit with the version.

#### Creating a new package

After pushing the tag to GitHub, a new version will be made automatically.
