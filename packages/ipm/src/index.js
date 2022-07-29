import { program } from 'commander';
import fs from 'fs';
import { downloadTranslations } from './download-translations.js';
import { downloadExercise } from './download-exercises.js';
import { getBearerToken } from './authenticate-user.js';
import { checkOrUploadTestplans } from './testplans.js';

program
  .command('down')
  .option('-t, --translations', 'include translated versions')
  .argument('<local>', 'path to the local exercise')
  .action(async (local, options) => {
    await downloadExercise(local, local, options.translations);
  });

program
  .command('sync')
  .argument('<local>', 'location of the exercises folder')
  .action(async (local) => {
    const token = await getBearerToken();
    // Download translations
    await downloadTranslations(local, token);
    const exercises = fs
      .readdirSync(local, { withFileTypes: true })
      .filter((p) => p.isDirectory());
    for (const exercise of exercises) {
      const absolutePath = `${local}/${exercise.name}`;
      const relativePath = exercise.name;
      await downloadExercise(absolutePath, relativePath, true, token, true);
    }
  });

program
  .command('translations')
  .argument('<local>', 'location of the translations')
  .action(async (local) => {
    await downloadTranslations(local);
  });

program
  .command('check-plan')
  .argument('<local>', 'path to the local exercise')
  .action(async (local) => {
    await checkOrUploadTestplans(local, 'check');
  });

program
  .command('upload-plan')
  .argument('<local>', 'path to the local exercise')
  .action(async (local) => {
    await checkOrUploadTestplans(local, 'upload');
  });

program
  .command('sync-plan')
  .argument('<local>', 'location of the exercises folder')
  .action(async (local) => {
    const token = await getBearerToken();
    const exercises = fs
      .readdirSync(local, { withFileTypes: true })
      .filter((p) => p.isDirectory());
    for (const exercise of exercises) {
      await checkOrUploadTestplans(exercise.name, 'upload', token);
    }
  });

program.parseAsync(process.argv).then(() => process.exit());
