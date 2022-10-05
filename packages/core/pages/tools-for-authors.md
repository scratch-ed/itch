This document contains practical information for people writing testplans.
It does not explain what to write in the testplans themselves; see the document [_Introduction to testing_](./introduction-to-testing.md) for that.

## What to test

Before or when writing a testplan, you should know what you want to test.
In most cases, an exercise is part of a lesson with some goals.
The tests will therefore depend on the goal of the lesson (and, of course, on the problem statement).
At FTRPRF, in most cases, you'll get that information from the content team.

## Running the judge locally

You should be able to run the Scratch judge locally.
The most up-to-date information on this can probably be found in the readme of the Judge's repository.

First, you'll need to clone the Scratch judge's git repository.
It uses _npm_ workspaces, so you need a recent version of npm (> 7.7):

- `node` 15+
- `npm` 7.7+

If you use `nvm`, you can simply execute `nvm use` to get the desired `node` and `npm` version.

To run the judge, you need to:

1. Execute `npm run build` to compile the judge.
   You must repeat this each time you change code in the judge.
2. Open `packages/runner/src/environment/page.html` in your browser.
   This will load and execute a project based on the `config.json` file.
   This `config.json` file is obtained by copying the `config.example.json` file (in the root of the repo) and changing its name.

### Config file

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

### Getting Scratch projects locally

To execute the judge, you also need the Scratch projects of the exercise you want to test.
Instead of downloading all `sb3` files manually from the Studio, the judge provides a useful script to do just that.
The most useful commands are:

- `npm run ipm --workspace packages/ipm -- down ../../exercises/[exercise]` for a single exercise
- `npm run ipm --workspace packages/ipm -- sync` for all exercises

When executing these commands, you need to authenticate to the FTRPRF Studio.
To do so, you need to set the following environment variables:

- `USERNAME` to your username
- `PASSWORD` to your password

The first time you probably want to execute the first command (`sync`),
as it will download all `sb3` files for all exercises in the repository.
Afterwards, you can use the `down` command to download the files for a single exercise (as downloading all files can take a while).

Now you can change your `config.json` file to point to an actual exercise.

## Preparing a new exercise

You should do the following steps when adding a new exercise:

1. Create a new folder in `exercises`, say `exercise-a`.
2. Add a `package.json` file to the folder.
   This will make the exercise an npm project.
   Don't forget to add the judge-specific information in the `package.json`:

   ```json
   {
     "itch": [
       {
         "id": 232557
       }
     ]
   }
   ```

   See existing exercises for more examples.

3. Execute `npm install` in the root of the repository.
4. Execute `npm run ipm --workspace packages/ipm -- down ../../exercises/exercise-a` to get the `sb3` files for the new exercise.
5. Create a `plan.js` file in the exercise directory.
   This will be the testplan.
6. Write the testplan.
7. Adjust the `config.json` file to point the new exercise:
   ```json
   {
     "template": "../../../../exercises/exercise-a/projects/Starter-NL.sb3",
     "submission": "../../../../exercises/exercise-a/projects/Oplossing-NL.sb3",
     "testplan": "../../../../exercises/exercise-a/plan.js",
     "debug": false,
     "translations": "../../../../exercises/translations.json",
     "language": "nl"
   }
   ```
8. Run the judge locally by opening `packages/runner/src/environment/page.html` in your browser.
   This will run your new testplan.
9. Adjust the testplan as needed, and refresh the browser window to test a newer version of the testplan.
10. Add the exercise (and all levels if needed) to the `exercises.test.js` file.
11. Commit and push the changes.

## Translations

In the FTRPRF Studio, all Scratch projects use _translation codes_ to make the projects translatable.
A translation code is a string starting and ending with a colon, e.g. `":hello:"`.
This translation code will then be replaced by the values in Dutch and English when publishing the exercise.

The same codes are also used in the testplans.
In production, the translation codes are replaced with a regex before the testplan is sent to the judge.
However, locally, we don't have the backend, so we need to do this ourselves.

In a testplan, translation codes should be surrounded by the globally available `t()` function.

For example, imagine this piece of code:

```javascript
console.log(t(':hallo:'));
```

Locally, the following procedure is used:

1. The `config.json` file has an entry specifying the translation data, which is downloaded when you download the `sb3` files.
2. The key, `:hallo:` is looked up in the translation data.
3. The found translation is returned, e.g. `"Hallo"` in Dutch and `"Hello"` in English.

In the production environment, things are different:

1. The translation codes are replaced by a regex with the translated value.
   This will result in two testplans: `t('Hallo')` and `t('Hello')`.
2. In production, the judge has no translation data, so the argument to the `t()` function is just returned.
