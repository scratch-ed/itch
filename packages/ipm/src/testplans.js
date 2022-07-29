import fetch, { Headers, FormData } from 'node-fetch';
import { Blob } from 'node:buffer';
import fs from 'fs';
import { getBearerToken } from './authenticate-user.js';
import {
  getVersions,
  retrieveStarterAndSubmissionForLevel,
} from './download-exercises.js';

async function executeExerciseTestSuiteRequest(exerciseId, token) {
  const myHeaders = new Headers();
  myHeaders.append('authorization', token);
  myHeaders.append('content-type', 'application/json');
  myHeaders.append('Origin', 'https://studio.ftrprf.be');
  myHeaders.append('Referer', 'https://studio.ftrprf.be/');

  const raw = JSON.stringify({
    operationName: 'ExerciseTestPlan',
    variables: {
      exerciseVersionId: exerciseId,
    },
    query: `
    query ExerciseTestPlan($exerciseVersionId: Int!) {
      findExerciseTestPlanByExerciseVersionId(exerciseVersionId: $exerciseVersionId) {
        id
        name
        blobUri
        __typename
      }
    }
    `,
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
    console.error('Error while getting test suite details.');
    console.error('Code: ', response.status);
    console.error(await response.text());
    throw new Error();
  }

  return await response.json();
}

async function sendTestplan(exerciseId, testplanPath, token) {
  const myHeaders = new Headers();
  myHeaders.append('authorization', token);
  myHeaders.append('Origin', 'https://studio.ftrprf.be');
  myHeaders.append('Referer', 'https://studio.ftrprf.be/');

  const operations = JSON.stringify({
    operationName: 'CreateExerciseTestPlan',
    variables: {
      exerciseVersionId: exerciseId,
      name: `testplan${exerciseId}.js`,
      file: null,
    },
    query: `
    mutation CreateExerciseTestPlan(
      $exerciseVersionId: Int!
      $name: String!
      $file: Upload
    ) {
      createExerciseTestPlan(
        exerciseVersionId: $exerciseVersionId
        name: $name
        file: $file
      ) {
        id
        __typename
      }
    }
    `,
  });

  const map = JSON.stringify({ 1: ['variables.file'] });

  const formData = new FormData();
  formData.set('operations', operations);
  formData.set('map', map);
  formData.set(
    '1',
    new Blob([fs.readFileSync(testplanPath)], { type: 'application/javascript' }),
    `testplan${exerciseId}.js`,
  );

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow',
  };

  const response = await fetch(
    'https://studio-backend.ftrprf.be/graphql',
    requestOptions,
  );

  if (!response.ok) {
    console.error('Error while creating new test suite.');
    console.error('Code: ', response.status);
    console.error(await response.text());
    throw new Error();
  }

  console.log(await response.json());
}

function findLocalTestplan(relativePath, level) {
  const regex = new RegExp(`plan${level ? '-' + level : ''}.js`);
  return fs
    .readdirSync(relativePath, { withFileTypes: true })
    .filter((v) => v.isFile() && regex.test(v.name))
    .find(() => true);
}

async function uploadTestplan(relativePath, result, level, name, token) {
  const [starterData, solutionData] = retrieveStarterAndSubmissionForLevel(result, level);

  const testplanFile = findLocalTestplan(relativePath, level);
  const testplanPath = `${relativePath}/${testplanFile.name}`;

  const suffix = name ? `${name}-${level}` : level;
  console.log(`[${relativePath}/${suffix}] STARTER: uploading test plan`);
  await sendTestplan(starterData.id, testplanPath, token);
  console.log(`[${relativePath}/${suffix}] SOLUTION: uploading test plan`);
  await sendTestplan(solutionData.id, testplanPath, token);
}

async function checkTestplan(relativePath, result, level, name, token) {
  const [starterData, solutionData] = retrieveStarterAndSubmissionForLevel(result, level);

  // Find the test plan for the level.
  const testplanFile = findLocalTestplan(relativePath, level);
  const testplanPath = `${relativePath}/${testplanFile.name}`;

  // Get the content of the local testplan.
  const localContent = fs.readFileSync(testplanPath).toString();

  // Get the content of the remote testplans.
  const remoteStarterData = await executeExerciseTestSuiteRequest(starterData.id, token);
  const remoteStarterContent = await fetch(
    remoteStarterData.data.findExerciseTestPlanByExerciseVersionId.blobUri,
  ).then((r) => r.text());

  const remoteSubmissionData = await executeExerciseTestSuiteRequest(
    solutionData.id,
    token,
  );
  const remoteSubmissionContent = await fetch(
    remoteSubmissionData.data.findExerciseTestPlanByExerciseVersionId.blobUri,
  ).then((r) => r.text());

  const starterStatus = localContent === remoteStarterContent ? 'EQUAL' : 'DIFFERENT';
  const solutionStatus = localContent === remoteSubmissionContent ? 'EQUAL' : 'DIFFERENT';

  const suffix = name ? `${name}-${level}` : level;
  console.log(`[${relativePath}/${suffix}] STARTER: test plan is ${starterStatus}`);
  console.log(`[${relativePath}/${suffix}] SOLUTION: test plan is ${solutionStatus}`);
}

export async function checkOrUploadTestplans(relativePath, mode, token = undefined) {
  const packageJson = JSON.parse(fs.readFileSync(`${relativePath}/package.json`, 'utf8'));

  if (!token) {
    token = await getBearerToken();
  }

  if (packageJson.itch === undefined) {
    console.warn(`[${relativePath}] Skipping due to missing itch config in package.json`);
    return;
  }

  let toCall;
  if (mode === 'check') {
    toCall = checkTestplan;
  } else {
    toCall = uploadTestplan;
  }

  for (const exercise of packageJson.itch) {
    const result = (await getVersions(exercise.id, token)).data;
    console.info(
      `[${relativePath}] Downloading information for ${result.findExercise.title}${
        exercise.name ? '/' + exercise.name : ''
      }.`,
    );
    if (exercise.levels === undefined) {
      await toCall(relativePath, result, undefined, exercise.name, token);
    } else if (typeof exercise.levels === 'number') {
      for (let i = 1; i <= exercise.levels; i++) {
        await toCall(relativePath, result, i, exercise.name, token);
      }
    } else {
      for (const instance of result.findExercise.versions) {
        await toCall(relativePath, instance, exercise.name, token);
      }
    }
  }
}
