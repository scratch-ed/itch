const testStream = require('./stream');

const test = async (req, res, next, browser) => {
  const { testplan } = req.body;
  const { templateFile, testFile } = req.files;
  const { accept } = req.headers;

  const page = await browser.newPage();

  // stream mode
  if (accept === 'application/octet-stream') {
    await testStream(res, { testplan, templateFile, testFile, page });
    await page.close();
    next();
  }
};

module.exports = test;
