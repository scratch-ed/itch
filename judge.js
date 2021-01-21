/* Copyright (C) 2019 Ghent University - All Rights Reserved */
const path = require('path');
let acceptsOutput = true;
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');

// unzipping
const yauzl = require('yauzl');

// puppeteer
const puppeteer = require('puppeteer');

function toStdOut(output) {
  if (acceptsOutput) {
    process.stdout.write(JSON.stringify(output));
  }
}

//
// Judge
//

function projectToJson(where) {
  const chunks = [];
  const str = '';
  yauzl.open(where, { lazyEntries: true }, function (err, zipfile) {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on('entry', function (entry) {
      if (entry.fileName === 'project.json') {
        zipfile.openReadStream(entry, function (err, readStream) {
          if (err) throw err;
          readStream.on('end', function () {
            str = Buffer.concat(chunks).toString('utd8');
          });
          readStream.on('data', function (data) {
            chunks.push(data);
          });
        });
      } else {
        zipfile.readEntry();
      }
    });
  });
  return templateJSON;
}

class Judge {
  constructor(testFile, options = {}, outputStream = toStdOut) {
    // start timing
    this.time_start = new Date();

    // extract options
    this.time_limit = options.time_limit || 10000;

    this.test_file = path.resolve(__dirname, testFile);

    this.log = outputStream;

    this.debug = options.debug || false;
  }

  async run(templateFile, submissionFile) {
    let browser;
    if (this.debug) {
      browser = await puppeteer.launch({
        ...(process.env.PUPPETEER_BROWSER_PATH && {
          executablePath: process.env.PUPPETEER_BROWSER_PATH,
        }),
        headless: false,
        devtools: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
        ],
      });
    } else {
      browser = await puppeteer.launch({
        ...(process.env.PUPPETEER_BROWSER_PATH && {
          executablePath: process.env.PUPPETEER_BROWSER_PATH,
        }),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-web-security',
        ],
      });
    }

    const page = await browser.newPage();

    if (this.debug) {
      page.on('console', (msg) => console.debug('PAGE LOG:', msg.text()));
    }

    await page.goto(`file://${url}`);

    await page.exposeFunction('appendMessage', (message) => {
      this.log({ command: 'append-message', message: message });
    });
    await page.exposeFunction('annotate', (row, column, text) => {
      this.log({
        command: 'annotate',
        row: row,
        column: column,
        text: text,
      });
    });
    await page.exposeFunction('startTab', (title) => {
      this.log({ command: 'start-tab', title: title });
    });
    await page.exposeFunction('startContext', () => {
      this.log({ command: 'start-context' });
    });
    await page.exposeFunction('startTestcase', (description) => {
      this.log({ command: 'start-testcase', description: description });
    });
    await page.exposeFunction('startTest', (expected) => {
      this.log({ command: 'start-test', expected: expected.toString() });
    });
    await page.exposeFunction('closeTest', (generated, status) => {
      this.log({
        command: 'close-test',
        generated: generated.toString(),
        status: status,
      });
    });
    await page.exposeFunction('closeTestcase', (accepted = undefined) => {
      if (accepted !== null && accepted !== undefined && accepted !== true) {
        // this.log({command: "close-testcase", accepted: accepted.toString()});
        this.log({ command: 'start-test', expected: 'true' });
        let status = {};
        if (accepted) {
          status = { enum: 'correct', human: 'Correct' };
        } else {
          status = { enum: 'wrong', human: 'Wrong' };
        }
        this.log({
          command: 'close-test',
          generated: accepted.toString(),
          status: status,
        });
        this.log({ command: 'close-testcase' });
      } else {
        this.log({ command: 'close-testcase' });
      }
    });
    await page.exposeFunction('closeContext', () => {
      this.log({ command: 'close-context' });
    });
    await page.exposeFunction('closeTab', () => {
      this.log({ command: 'close-tab' });
    });
    await page.exposeFunction('closeJudge', (accepted = undefined) => {
      if (accepted !== null && accepted !== undefined) {
        this.log({ command: 'close-judgement' });
      } else {
        let status = {};
        if (accepted) {
          status = { enum: 'correct', human: 'Correct' };
        } else {
          status = { enum: 'wrong', human: 'Wrong' };
        }
        this.log({
          command: 'close-judgement',
          accepted: accepted.toString(),
          status: status,
        });
      }
      acceptsOutput = false;
    });
    
    await page.addScriptTag({ url: this.test_file });

    let templateJSON = '';
    const sourceFileTemplate = path.resolve(__dirname, submissionFile);
    const templateFileTemplate = path.resolve(__dirname, templateFile);
    yauzl.open(
      templateFileTemplate,
      { lazyEntries: true },
      function (err, zipfile) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on('entry', function (entry) {
          if (entry.fileName === 'project.json') {
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) throw err;
              readStream.on('data', function (data) {
                templateJSON += data;
              });
              readStream.on('end', function () {
                //continue
              });
            });
          } else {
            zipfile.readEntry();
          }
        });
      },
    );

    let testJSON = '';
    // TODO: use file test
    yauzl.open(
      sourceFileTemplate,
      { lazyEntries: true },
      function (err, zipfile) {
        if (err) throw err;
        zipfile.readEntry();
        zipfile.on('entry', function (entry) {
          if (entry.fileName === 'project.json') {
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) throw err;
              let json = '';
              readStream.on('data', function (data) {
                testJSON += data;
              });
              readStream.on('end', function () {
                //continue
              });
            });
          } else {
            zipfile.readEntry();
          }
        });
      },
    );

    // START JUDGE
    this.log({ command: 'start-judgement' });

    const fileHandle = await page.$('#file');
    // TODO: also do file test here
    await fileHandle.uploadFile(sourceFileTemplate);

    await page.waitForTimeout(50);

    if (this.debug) {
      await page.evaluate(() => {
        // eslint-disable-next-line no-debugger
        debugger;
      });
    }

    const output = await page.evaluate(
      (templateJSON, testJSON) => {
        return runTests(templateJSON, testJSON);
      },
      templateJSON,
      testJSON,
    );

    if (!this.debug) {
      await browser.close();
    }

    // END JUDGE
    this.log({ command: 'close-judgement' });
  }
}

module.exports = {
  Judge,
};
