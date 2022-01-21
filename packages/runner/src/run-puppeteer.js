class Waiter {
  constructor() {
    this.prom = new Promise((resolve, _reject) => {
      this.res = resolve;
    });
  }
}

const submissionUpload = new Waiter();

document.getElementById('file').addEventListener('change', (e) => {
  const reader = new FileReader();
  const thisFileInput = e.target;
  reader.onload = () => {
    submissionUpload.res(reader.result);
  };
  reader.readAsArrayBuffer(thisFileInput.files[0]);
});

const templateUpload = new Waiter();

document.getElementById('template').addEventListener('change', (e) => {
  const reader = new FileReader();
  const thisFileInput = e.target;
  reader.onload = () => {
    templateUpload.res(reader.result);
  };
  reader.readAsArrayBuffer(thisFileInput.files[0]);
});

// This function is called by puppeteer to actually execute the tests.
// eslint-disable-next-line no-unused-vars
async function runTests(language, translations = undefined) {
  /** @type {EvalConfig} */
  const config = {
    submission: await submissionUpload.prom,
    template: await templateUpload.prom,
    canvas: document.getElementById('scratch-stage'),
    language: language,
    translations: translations
  };

  // Hook up the output visualizer.
  if (window.visualise()) {
    console.log('Initialising test output visualizer');
    init(document.getElementById('output'));
  }

  // Main function of the Itch judge, exposed by the evaluation module.
  await window.run(config);
}
