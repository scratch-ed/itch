import { program } from 'commander';
import fs from 'fs';
import { downloadTranslations } from './download-translations.js';
import { downloadExercise } from './download-exercises.js';
import { getBearerToken } from './authenticate-user.js';

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
  .action(async (local, _options) => {
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

program.parseAsync(process.argv).then(() => process.exit());
