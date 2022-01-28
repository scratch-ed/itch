import fetch, { Headers } from 'node-fetch';
import fs from 'fs';
import { translateSb3 } from './translate.js';
import { getBearerToken } from './authenticate-user.js';

async function download(from, to, headers = {}) {
  const res = await fetch(from, { headers });
  if (!res.ok && res.status !== 304) {
    console.error('Error while downloading sb3 file.');
    console.error('Code: ', response.status);
    console.error(await response.text());
    throw new Error();
  }
  if (res.ok) {
    await new Promise((resolve, reject) => {
      if (fs.existsSync(to)) {
        fs.unlinkSync(to);
      }
      const fileStream = fs.createWriteStream(to, 'utf8');
      res.body.pipe(fileStream);
      res.body.on('error', reject);
      fileStream.on('finish', resolve);
    });
  }

  return res.headers;
}

async function getVersions(id, token) {
  const myHeaders = new Headers();
  myHeaders.append('authorization', token);
  myHeaders.append('content-type', 'application/json');
  myHeaders.append('Origin', 'https://studio.ftrprf.be');
  myHeaders.append('Referer', 'https://studio.ftrprf.be/');

  const raw = JSON.stringify({
    operationName: 'ScratchExercise',
    variables: {
      id: id,
    },
    query: `
    query ScratchExercise($id: Int!) {
      findExercise(id: $id) {
        id
        title
        type
        versions {
          versionType
          ... on ScratchExerciseVersion {
            id
            blobUri
            name
            testPlanId
            __typename
          }
          __typename
        }
        __typename
      }
    }`,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const response = await fetch(
    'https://studio-backend.ftrprf.be/graphql',
    requestOptions,
  );

  if (!response.ok) {
    console.error('Error while getting exercise details.');
    console.error('Code: ', response.status);
    console.error(await response.text());
    throw new Error();
  }

  return await response.json();
}

/**
 * Download the actual file and store it. If downloading and an etag is found,
 * skip if possible. The `lock` will be updated with the new etag if available.
 * You should save it afterwards.
 *
 * @param {{relativePath: string, log: string, url: string, absolutePath: string}} exercise
 * @param {Object} lock - lock file
 * @return {boolean} True if the file was actually updated, false otherwise.
 */
async function getBytes(exercise, lock) {
  const headers = {};
  if (lock[exercise.relativePath] && fs.existsSync(exercise.absolutePath)) {
    headers['If-None-Match'] = lock[exercise.relativePath];
  }

  let updated = false;
  const responseHeaders = await download(exercise.url, exercise.absolutePath, headers);
  if (responseHeaders.has('etag')) {
    console.debug(`[${exercise.log}] ${exercise.relativePath}: downloaded new version.`);
    updated = true;
    lock[exercise.relativePath] = responseHeaders.get('etag');
  } else {
    console.debug(
      `[${exercise.log}] ${exercise.absolutePath}: local version is up-to-date.`,
    );
  }

  return updated;
}

async function downloadLevel(
  relativePath,
  result,
  level,
  absolutePath,
  name,
  includeTranslations,
  quiet,
) {
  const regex = new RegExp(`level ${level}[^0-9]*$`);
  // Attempt to find the starter project.
  const starterData = result.findExercise.versions
    .filter(
      (v) =>
        v.versionType === 'STARTER' &&
        (regex.test(v.name.toLowerCase()) || !level) &&
        !v.name.toLowerCase().includes('oplossing') &&
        !v.name.toLowerCase().includes('v0'),
    )
    .sort((a, b) => b.id - a.id)
    .find((_) => true);

  const starterUri = starterData?.blobUri;

  if (starterUri === undefined) {
    throw new Error(`Could not find starter project for level ${level}`);
  }

  const solutionData = result.findExercise.versions
    .filter(
      (v) =>
        v.versionType === 'SOLUTION' &&
        (regex.test(v.name.toLowerCase()) || !level) &&
        v.name.toLowerCase().includes('oplossing'),
    )
    .sort((a, b) => b.id - a.id)
    .find((_) => true);

  const solutionUri = solutionData?.blobUri;

  if (solutionUri === undefined) {
    throw new Error(`Could not find solution project for level ${level}`);
  }

  // Check cache.
  const lockPath = `${absolutePath}/../exercise-lock.json`;
  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch (error) {
    lock = {};
  }

  const startSuffix = `projects/${name || ''}${level ? level + '-' : ''}template`;

  const startDisplayPath = `${relativePath}/${startSuffix}`;

  const starterPromise = getBytes(
    {
      absolutePath: `${absolutePath}/${startSuffix}.sb3`,
      relativePath: `${startDisplayPath}.sb3`,
      log: level ? `${relativePath}/${level}` : relativePath,
      url: starterUri,
    },
    lock,
  );

  const solutionSuffix = `projects/${name || ''}${level ? level + '-' : ''}solution`;
  const solutionDisplayPath = `${relativePath}/${solutionSuffix}`;

  const solutionPromise = getBytes(
    {
      absolutePath: `${absolutePath}/${solutionSuffix}.sb3`,
      relativePath: `${solutionDisplayPath}.sb3`,
      log: level ? `${relativePath}/${level}` : relativePath,
      url: solutionUri,
    },
    lock,
  );

  const [updatedStarter, updatedSolution] = await Promise.allSettled([
    starterPromise,
    solutionPromise,
  ]);

  if (updatedStarter || updatedSolution) {
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
  }

  if (includeTranslations) {
    const translationPath = `${absolutePath}/../translations.json`;
    await translateSb3(
      `${absolutePath}/${startSuffix}.sb3`,
      `${absolutePath}/${startSuffix}-NL.sb3`,
      translationPath,
      'nl',
      quiet,
    );
    await translateSb3(
      `${absolutePath}/${solutionSuffix}.sb3`,
      `${absolutePath}/${solutionSuffix}-NL.sb3`,
      translationPath,
      'nl',
      quiet,
    );
    await translateSb3(
      `${absolutePath}/${startSuffix}.sb3`,
      `${absolutePath}/${startSuffix}-EN.sb3`,
      translationPath,
      'en',
      quiet,
    );
    await translateSb3(
      `${absolutePath}/${solutionSuffix}.sb3`,
      `${absolutePath}/${solutionSuffix}-EN.sb3`,
      translationPath,
      'en',
      quiet,
    );
  }
}

export async function downloadExercise(
  absolutePath,
  relativePath,
  translations = true,
  token = undefined,
  quiet = false,
) {
  const packageJson = JSON.parse(fs.readFileSync(`${absolutePath}/package.json`, 'utf8'));

  if (!token) {
    token = await getBearerToken();
  }

  if (packageJson.itch === undefined) {
    console.warn(`[${relativePath}] Skipping due to missing itch config in package.json`);
    return;
  }

  // Check if project dir exists, and create it otherwise.
  const projectDir = `${absolutePath}/projects`;
  fs.mkdirSync(projectDir, { recursive: true });

  for (const exercise of packageJson.itch) {
    const result = (await getVersions(exercise.id, token)).data;
    console.info(
      `[${relativePath}] Downloading information for ${result.findExercise.title}${
        exercise.name ? '/' + exercise.name : ''
      }.`,
    );
    if (exercise.levels === undefined) {
      await downloadLevel(
        relativePath,
        result,
        undefined,
        absolutePath,
        exercise.name,
        translations,
      );
    } else {
      for (let i = 1; i <= exercise.levels; i++) {
        await downloadLevel(
          relativePath,
          result,
          i,
          absolutePath,
          exercise.name,
          translations,
          quiet,
        );
      }
    }
  }
}
