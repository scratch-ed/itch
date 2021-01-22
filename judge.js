/* Copyright (C) 2019 Ghent University - All Rights Reserved */
const path = require('path');
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');

// unzipping
const yauzl = require('yauzl');

// puppeteer
const puppeteer = require('puppeteer');

function toStdOut(output) {
  process.stdout.write(JSON.stringify(output));
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
    // extract options
    this.time_limit = options.time_limit || 10000;

    this.test_file = path.resolve(__dirname, testFile);
    
    this.out = outputStream;

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

    /** @type {Page} */
    const page = await browser.newPage();

    if (this.debug) {
      page.on('console', (msg) => console.debug('PAGE LOG:', msg.text()));
    }

    await page.goto(`file://${url}`);
    
    // Hook up the test output to stdout.
    await page.exposeFunction('handleOut', this.out);
    
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
    this.out({ command: 'start-judgement' });

    /** @type {ElementHandle} */
    const fileHandle = await page.$('#file');
    await fileHandle.uploadFile(sourceFileTemplate);

    await page.waitForTimeout(50);

    if (this.debug) {
      await page.evaluate(() => {
        // eslint-disable-next-line no-debugger
        debugger;
      });
    }

    await page.evaluate(
      (templateJSON, testJSON, testplan) => {
        return runTests(templateJSON, testJSON, testplan);
      },
      templateJSON,
      testJSON,
      this.test_file
    );

    if (!this.debug) {
      await browser.close();
    }

    // END JUDGE
    this.out({ command: 'close-judgement' });
  }
}

module.exports = {
  Judge,
};
