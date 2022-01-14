import { program } from 'commander';
import fs from 'fs';
import { downloadTranslations } from './download-translations.js';
import { downloadExercise } from './download-exercises.js';

program
  .command('down')
  .option('-m, --missing', 'only download missing projects')
  .option('-t, --translations', 'include translated versions')
  .argument('<local>', 'path to the local exercise')
  .action(async (local, options) => {
    await downloadExercise(local, options.missing, options.translations);
  });

program
  .command('sync')
  .argument('<local>', 'location of the exercises folder')
  .option('-m, --missing', 'only download missing projects')
  .action(async (local, options) => {
    const exercises = fs
      .readdirSync(local, { withFileTypes: true })
      .filter((p) => p.isDirectory());
    for (const exercise of exercises) {
      await downloadExercise(exercise.name, options.missing);
    }
  });

program
  .command('translations')
  .argument('<local>', 'location of the translations')
  .action(async (local) => {
    await downloadTranslations(local);
  });

program.parseAsync(process.argv).then(() => process.exit());
