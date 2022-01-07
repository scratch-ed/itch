import { program } from 'commander';
import fs from 'fs';
// eslint-disable-next-line import/no-duplicates
import { Headers } from 'node-fetch';
// eslint-disable-next-line import/no-duplicates
import fetch from 'node-fetch';

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
  const myHeaders = new Headers();
  myHeaders.append('Connection', 'keep-alive');
  myHeaders.append(
    'sec-ch-ua',
    '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
  );
  myHeaders.append('accept', '*/*');
  myHeaders.append('authorization', process.env.BEARER);
  myHeaders.append('sec-ch-ua-mobile', '?0');
  myHeaders.append('content-type', 'application/json');
  myHeaders.append('Origin', 'https://studio.ftrprf.be');
  myHeaders.append('Sec-Fetch-Site', 'same-site');
  myHeaders.append('Sec-Fetch-Mode', 'cors');
  myHeaders.append('Sec-Fetch-Dest', 'empty');
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

async function getTranslatedVersionInformation(id, language) {
  const myHeaders = new Headers();
  myHeaders.append('Connection', 'keep-alive');
  myHeaders.append(
    'sec-ch-ua',
    '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
  );
  myHeaders.append('accept', '*/*');
  myHeaders.append('authorization', process.env.BEARER_TEACHER);
  myHeaders.append('content-type', 'application/json');
  myHeaders.append('Origin', 'https://school.ftrprf.be');
  myHeaders.append('Referer', 'https://school.ftrprf.be/');

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const response = await fetch(
    `https://education-backend.ftrprf.be/api/exercises/start/${id}?new=true&language=${language}`,
    requestOptions,
  );

  if (!response.ok) {
    console.error('Error while getting exercise translation details.');
    console.error('Code: ', response.status);
    console.error(await response.text());
    throw new Error();
  }

  return await response.json();
}

// From mono repo
// data:application/pdf;base64,
function base64ToBuffer(dataUrl) {
  const byteString = dataUrl.split(',')[1];
  return Buffer.from(byteString, 'base64');
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

async function downloadTranslation(localPrefix, id, language) {
  const path = `${localPrefix}-${language}.sb3`;
  const information = await getTranslatedVersionInformation(id, language);
  const buffer = base64ToBuffer(information.base64EncodedBlob);
  fs.writeFileSync(path, buffer);
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
    try {
      console.info(`[${local}/${level}] starter: downloading Dutch translation...`);
      await downloadTranslation(starterPrefix, starterData.id, 'NL');
    } catch (e) {
      console.warn(`[${local}/${level}/starter] skipping Dutch due to error...`);
    }
    try {
      console.info(`[${local}/${level}] starter: downloading English translation...`);
      await downloadTranslation(starterPrefix, starterData.id, 'EN');
    } catch (e) {
      console.warn(`[${local}/${level}/starter] skipping English due to error...`);
    }
    try {
      console.info(`[${local}/${level}] solution: downloading Dutch translation...`);
      await downloadTranslation(solutionPrefix, solutionData.id, 'NL');
    } catch (e) {
      console.warn(`[${local}/${level}/solution] skipping Dutch due to error...`);
    }
    try {
      console.info(`[${local}/${level}] solution: downloading English translation...`);
      await downloadTranslation(solutionPrefix, solutionData.id, 'EN');
    } catch (e) {
      console.warn(`[${local}/${level}/solution] skipping English due to error...`);
    }
  }
}

async function downloadExercise(local, onlyMissing = false, translations = true) {
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

async function executeTranslationRequest(page) {
  const myHeaders = new Headers();
  myHeaders.append('Connection', 'keep-alive');
  myHeaders.append(
    'sec-ch-ua',
    '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
  );
  myHeaders.append('accept', '*/*');
  myHeaders.append('authorization', process.env.BEARER);
  myHeaders.append('sec-ch-ua-mobile', '?0');
  myHeaders.append('content-type', 'application/json');
  myHeaders.append('Origin', 'https://studio.ftrprf.be');
  myHeaders.append('Sec-Fetch-Site', 'same-site');
  myHeaders.append('Sec-Fetch-Mode', 'cors');
  myHeaders.append('Sec-Fetch-Dest', 'empty');
  myHeaders.append('Referer', 'https://studio.ftrprf.be/');

  const raw = JSON.stringify({
    operationName: 'FindAllTranslations',
    variables: {
      page: page,
      size: 50,
    },
    query: `
    query FindAllTranslations($page: Int!, $size: Int!, $filter: [JSON], $sort: JSON) {
      findAllTranslations(page: $page, size: $size, filter: $filter, sort: $sort) {
        total
        pages
        currentPage
        content {
          id
          valueNl
          valueEn
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
    console.error('Error while getting translation details.');
    console.error('Code: ', response.status);
    console.error(await response.text());
    throw new Error();
  }

  return await response.json();
}

function resultToTranslationObject(object, result) {
  const data = result.data.findAllTranslations.content;
  for (const datum of data) {
    object.nl[`:${datum.id}:`] = datum.valueNl;
    object.en[`:${datum.id}:`] = datum.valueEn;
  }
}

/**
 * Download all translations.
 *
 * @param {string} local - Where to put them.
 * @returns {Promise<void>}
 */
async function downloadTranslations(local) {
  const translations = {
    nl: {},
    en: {},
  };

  console.info('Downloading first translations page.');
  const firstPage = await executeTranslationRequest(0);
  resultToTranslationObject(translations, firstPage);

  for (let i = 0; i < firstPage.data.findAllTranslations.pages; i++) {
    console.info(`Downloading page ${i}...`);
    const page = await executeTranslationRequest(i);
    resultToTranslationObject(translations, page);
  }

  const jsonPath = local + '/translations.json';
  fs.writeFileSync(jsonPath, JSON.stringify(translations, null, 2) + '\n', 'utf8');
}

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
