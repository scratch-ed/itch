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

async function getVersions(id) {
  const token = await getBearerToken();

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
 * Download the actual file and store it. If onlyMissing is true and there is a
 * file, do nothing. If downloading and an etag is found, skip if possible.
 * The `lock` will be updated with the new etag if available. You should save it
 * afterwards.
 *
 * @param {{localPath: string, log: string, url: string}} exercise
 * @param {Object} lock - lock file
 * @param {boolean} onlyMissing - if downloading if locally available is needed
 * @return {boolean} True if the file was actually updated, false otherwise.
 */
async function getBytes(exercise, lock, onlyMissing) {
  const headers = {};
  if (lock[exercise.localPath] && fs.existsSync(exercise.localPath)) {
    headers['If-None-Match'] = lock[exercise.localPath];
  }

  let updated = false;
  if (onlyMissing && fs.existsSync(exercise.localPath)) {
    console.debug(
      `[${exercise.log}] ${exercise.localPath}: exists and onlyMissing mode, skipping.`,
    );
  } else {
    const responseHeaders = await download(exercise.url, exercise.localPath, headers);
    if (responseHeaders.has('etag')) {
      console.debug(`[${exercise.log}] ${exercise.localPath}: downloaded new version.`);
      updated = true;
      lock[exercise.localPath] = responseHeaders.get('etag');
    } else {
      console.debug(
        `[${exercise.log}] ${exercise.localPath}: local version is up-to-date.`,
      );
    }
  }

  return updated;
}

async function downloadLevel(
  result,
  level,
  local,
  name,
  onlyMissing,
  includeTranslations,
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
  const lockPath = `${local}/projects/lock.json`;
  let lock;
  try {
    lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  } catch (error) {
    lock = {};
  }

  const starterPrefix = `${local}/projects/${name || ''}${
    level ? level + '-' : ''
  }template`;

  const starterPromise = getBytes(
    {
      localPath: `${starterPrefix}.sb3`,
      log: `${local}/${level}`,
      url: starterUri,
    },
    lock,
    onlyMissing,
  );

  const solutionPrefix = `${local}/projects/${name || ''}${
    level ? level + '-' : ''
  }solution`;

  const solutionPromise = getBytes(
    {
      localPath: `${solutionPrefix}.sb3`,
      log: `${local}/${level}`,
      url: solutionUri,
    },
    lock,
    onlyMissing,
  );

  const [updatedStarter, updatedSolution] = await Promise.allSettled([
    starterPromise,
    solutionPromise,
  ]);

  if (updatedStarter || updatedSolution) {
    fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
  }

  if (includeTranslations) {
    const translationPath = `${local}/../translations.json`;
    await translateSb3(
      `${starterPrefix}.sb3`,
      `${starterPrefix}-NL.sb3`,
      translationPath,
      'nl',
    );
    await translateSb3(
      `${solutionPrefix}.sb3`,
      `${solutionPrefix}-NL.sb3`,
      translationPath,
      'nl',
    );
    await translateSb3(
      `${starterPrefix}.sb3`,
      `${starterPrefix}-EN.sb3`,
      translationPath,
      'en',
    );
    await translateSb3(
      `${solutionPrefix}.sb3`,
      `${solutionPrefix}-EN.sb3`,
      translationPath,
      'en',
    );
  }
}

export async function downloadExercise(local, onlyMissing = false, translations = true) {
  const packageJson = JSON.parse(fs.readFileSync(`${local}/package.json`, 'utf8'));

  if (packageJson.itch === undefined) {
    console.warn(`[${local}] Skipping due to missing itch config in package.json`);
    return;
  }

  for (const exercise of packageJson.itch) {
    const result = (await getVersions(exercise.id)).data;
    console.info(
      `[${local}] Downloading information for ${result.findExercise.title}${
        exercise.name ? '/' + exercise.name : ''
      }.`,
    );
    if (exercise.levels === undefined) {
      await downloadLevel(
        result,
        undefined,
        local,
        exercise.name,
        onlyMissing,
        translations,
      );
    } else {
      for (let i = 1; i <= exercise.levels; i++) {
        await downloadLevel(result, i, local, exercise.name, onlyMissing, translations);
      }
    }
  }
}
