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
async function runTests(templateJSON, testJSON) {
  
  const config = new JudgeConfig();
  config.submission = await fileDeferred.promise;
  config.submissionJson = testJSON;
  config.templateJson = templateJSON;
  config.testplan = '';
  // noinspection JSValidateTypes
  config.canvas = document.getElementById('scratch-stage');
  
  await window.run(config);
}
