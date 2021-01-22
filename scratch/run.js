/** @type {Deferred<boolean>} */
const fileDeferred = new Deferred();

document.getElementById('file').addEventListener('change', e => {
  const reader = new FileReader();
  const thisFileInput = e.target;
  reader.onload = () => {
    fileDeferred.resolve(reader.result);
  };
  reader.readAsArrayBuffer(thisFileInput.files[0]);
});

// This function is called by puppeteer to actually execute the tests.
// eslint-disable-next-line no-unused-vars
async function runTests(templateJSON, testJSON, testplan) {
  
  /** @type {EvalConfig} */
  const config = {
    submission: await fileDeferred.promise,
    submissionJson: testJSON,
    templateJson: templateJSON,
    testplan: testplan,
    canvas: document.getElementById('scratch-stage')
  };
  
  // Main function of the Itch judge, exposed by the evaluation module.
  await window.run(config);
}
