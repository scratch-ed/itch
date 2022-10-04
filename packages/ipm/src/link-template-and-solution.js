import fs from 'fs';
import {
  getVersions,
  retrieveStarterAndSubmissionForLevel,
} from './download-exercises.js';

export async function getExerciseLinkData(absolutePath, relativePath, token) {
  const packageJson = JSON.parse(fs.readFileSync(`${absolutePath}/package.json`, 'utf8'));

  if (packageJson.itch === undefined) {
    console.warn(`[${relativePath}] Skipping due to missing itch config in package.json`);
    return;
  }

  // Check if project dir exists, and create it otherwise.
  const projectDir = `${absolutePath}/projects`;
  fs.mkdirSync(projectDir, { recursive: true });

  const data = [];
  for (const exercise of packageJson.itch) {
    const result = (await getVersions(exercise.id, token)).data;
    if (exercise.levels === undefined) {
      const [starterData, solutionData] = retrieveStarterAndSubmissionForLevel(
        result,
        undefined,
      );
      data.push([
        exercise.id,
        result.findExercise.title,
        starterData.id,
        solutionData.id,
      ]);
    } else if (typeof exercise.levels === 'number') {
      for (let i = 1; i <= exercise.levels; i++) {
        const [starterData, solutionData] = retrieveStarterAndSubmissionForLevel(
          result,
          i,
        );
        data.push([
          exercise.id,
          `${result.findExercise.title} ${starterData.name}`,
          starterData.id,
          solutionData.id,
        ]);
      }
    } else {
      console.info(`Skipping ${result.findExercise.title}: don't know what to do.`);
    }
  }

  return data;
}
