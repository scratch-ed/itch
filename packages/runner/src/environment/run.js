/**
 * @fileOverview This file is run on the HTML page of the judge, either in
 * puppeteer or directly via the HTML page.
 */

function handleFileUpload(elementId) {
  return new Promise((resolve) => {
    document.getElementById(elementId).addEventListener('change', (e) => {
      const reader = new FileReader();
      const thisFileInput = e.target;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(thisFileInput.files[0]);
    });
  });
}

const fileUploads = {};

// eslint-disable-next-line no-unused-vars
function registerFileUploads() {
  fileUploads.template = handleFileUpload('template');
  fileUploads.submission = handleFileUpload('submission');
}

/**
 * Download a file with a token in the header.
 *
 * @param {string} url - The URL to download from.
 * @param {string} [token] - A token to pass in the header.
 */
async function download(url, token) {
  console.info(`Downloading file ${url}`);
  let headers = {};
  if (token) {
    headers = { token };
  }
  const result = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  return result.arrayBuffer();
}

/**
 * Run the tests for a given testplan. It is assumed the testplan is available
 * in the environment.
 *
 * @param {JudgeOptions} config
 */
async function runTests(config) {
  console.info('Running tests...');

  let template;
  let submission;

  if (config.isLocalFile) {
    template = await fileUploads.template;
    submission = await fileUploads.submission;
  } else {
    template = await download(config.template, config.token);
    submission = await download(config.submission, config.token);
  }

  console.info('Starting judgement...');

  // Run the actual judge.
  await window.run({
    ...config,
    template,
    submission,
    canvas: document.getElementById('scratch-stage'),
  });
}

async function loadLocalDependency(path) {
  const scriptPromise = new Promise((resolve) => {
    // Make the testplan available as a file, to aid debugger.
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    script.async = false;
    script.onload = () => {
      resolve('resolved');
    };
    document.head.appendChild(script);
  });
  await scriptPromise;
}

async function manualRun() {
  console.info('Running judge in HTML mode...');
  const configPath = '../../../../config.json';

  await loadLocalDependency(
    '../../../../node_modules/scratch-storage/dist/web/scratch-storage.js',
  );
  await loadLocalDependency(
    '../../../../node_modules/scratch-render/dist/web/scratch-render.js',
  );
  await loadLocalDependency(
    '../../../../node_modules/scratch-svg-renderer/dist/web/scratch-svg-renderer.js',
  );
  await loadLocalDependency('../../../../node_modules/scratch-vm/dist/web/scratch-vm.js');
  await loadLocalDependency('../../../../node_modules/lodash/lodash.min.js');
  await loadLocalDependency(
    '../../../../node_modules/itch-core/dist/js/judge.browser.js',
  );
  await loadLocalDependency('./collector.js');

  const configResponse = await fetch(configPath);

  if (!configResponse) {
    console.error('Could not find config.json file; check the paths.');
  }

  /** @type JudgeOptions */
  const config = await configResponse.json();

  // In debug mode, the translations need to be available, if running with
  // translations.
  let translations;
  if (config.translations) {
    console.info(`Loading translations from ${config.translations}`);
    translations = await fetch(config.translations).then((r) => r.json());
  }

  // Hook up the output visualizer.
  init(document.getElementById('output'));

  // noinspection JSValidateTypes
  await loadLocalDependency(config.testplan);

  await runTests({
    // Pass all parameters to judge directly.
    ...config,
    translations,
  });
}

// If this is not puppeteer, we need to initiate running ourselves.
// In that case, read information from the config.
// noinspection TypeScriptUMDGlobal
if (!window.isPuppeteer) {
  // noinspection JSIgnoredPromiseFromCall
  manualRun();
}
