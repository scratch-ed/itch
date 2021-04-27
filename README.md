# Itch

Repo for the Scratch judge.

## Requirements

This repo uses _npm_ workspaces, so you need a recent version of npm (> 7.7):

- node: 15+
- npm: 7.7+

If you use `nvm`, you can simply execute `nvm use` to get the desired `node` and `npm` version.

## Running the judge

The repo contains some exercises:

- packages/runner/test/assets/\*\*

  These are used to run basic integration tests.

- demo/\*\*

  More in-depth exercises & test plans, used with students. They are not tested automatically at the moment, but we
  might add that in the future.

To start, run `npm run build`.

Then, there are three ways to run the judge, depending on what you want:

- As an API: `npm run api`. You can send projects and testplans to the API and receive a response.
- As a command line tool: `npm run start`. This will execute a project based on the `config.json` file.
- As a webpage: open `packages/runner/src/environment.html` in your browser. This will load and execute a project based on the `config.json` file.

### Config

The `config.json` file is used to determine what project should be judged.
An example can be found in `config.example.json`:

```json
{
  "template": "tests/projects/status/01.space_mission.sb3",
  "source": "tests/projects/status/01.space_mission.sb3",
  "plan": "plans/status/01.space_mission_test.js",
  "debug": false
}
```

The properties are:

- **template**: path to the template sb3 file, relative to the root of the repo.
- **source**: path to the solution sb3 file, relative to the root of the repo.
- **plan**: plan to the testplan, relative to the root of the repo.
- **debug**: if true and run with puppeteer, the browser will open, otherwise it will be headless.

## Docker

The judge also supports some docker config if you're in a hurry. These docker commands start a judge service, with an endpoint exposed on port 8000.

```bash
docker build --build-arg PORT=8000  -t judge . # Build judge image
docker run --publish 8000:8000 judge # runs the image
```

Or, without any setup at all with `docker-compose`

```bash
docker-compose up
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
