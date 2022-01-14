import fetch, { Headers } from 'node-fetch';
import fs from 'fs';

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
export async function downloadTranslations(local) {
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
