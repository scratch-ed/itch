# scratch-judge

Repo for the Scratch judge.

## Requirements

This repo uses _npm_ workspaces, so you need a recent version of npm (> 7.7):

- node: 15.x.x
- npm: 7.7+

If you use `nvm`, you can simply execute `nvm use` to get the desired `node` and `npm` version.

## Running the judge

For more high-level docs, see [here](./packages/core/pages/index.md).
You can also build the docs for a better experience, with `npm run generate-docs --workspace packages/core`

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

Steps to take:

1. On scratch judge (this repo):
   1. `npm run release:[prerelease|patch|minor|major]`
   2. `git add . && git commit -m "Nieuwe versie"`
   3. `git tag <tagname>`
   4. `git push && git push --tags`
   5. GitHub maakt een nieuwe package
2. On the scratch judge aws wrapper:
   https://github.com/FTRPRF/scratch-judge-serverless-api-aws/edit/main/README.md#deploy-a-new-version

### Creating a new package

After pushing the tag to GitHub, a new version will be made automatically.

### Troubleshooting

#### `npm ERR! code E404` in step 2.ii

```
➜  scratch-judge-serverless-api-aws git:(main) npm installnpm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@ftrprf%2fjudge-runner - Not found
npm ERR! 404
npm ERR! 404  '@ftrprf/judge-runner@^1.8.0' is not in this registry.
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.
```

Je hebt geen toegang tot de npm registry. Om ervoor te zorgen dat je wel aan de registry kan, moet je een `~/.npmrc` bestand aanmaken:

```
.npmrc:
//npm.pkg.github.com/:_authToken=<TOKEN>
@ftrprf:registry=https://npm.pkg.github.com/
```

Hier bij is `<TOKEN>` een github personal access token van jezelf.

Meer info over de registry: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#publishing-a-package-using-a-local-npmrc-file

Personal access tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic
