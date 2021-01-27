/** @type {Deferred<string|ArrayBuffer>} */
const submissionUpload = new Deferred();

document.getElementById('file').addEventListener('change', e => {
  const reader = new FileReader();
  const thisFileInput = e.target;
  reader.onload = () => {
    submissionUpload.resolve(reader.result);
  };
  reader.readAsArrayBuffer(thisFileInput.files[0]);
});

const templateUpload = new Deferred();

document.getElementById('template').addEventListener('change', e => {
  const reader = new FileReader();
  const thisFileInput = e.target;
  reader.onload = () => {
    templateUpload.resolve(reader.result);
  };
  reader.readAsArrayBuffer(thisFileInput.files[0]);
});


// This function is called by puppeteer to actually execute the tests.
// eslint-disable-next-line no-unused-vars
async function runTests(testplan) {

  /** @type {EvalConfig} */
  const config = {
    submission: await submissionUpload.promise,
    template: await templateUpload.promise,
    testplan: testplan,
    canvas: document.getElementById('scratch-stage')
  };

  // Hook up the output visualizer.
  if (window.visualise()) {
    console.log("Initialising test output visualizer");
    init(document.getElementById("output"));
  }

  // Main function of the Itch judge, exposed by the evaluation module.
  await window.run(config);
}
