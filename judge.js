// file system access
//const fs = require("fs");

const path = require('path');
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');

/*
const sourceFileTest = path.resolve(__dirname, 'source/sourceFile.sb3');
const testFile = path.resolve(__dirname, 'tests/test.js');
*/

const sourceFileTest = path.resolve(__dirname, 'scratch_code/vpw2017/01_mad_hatter.sb3');
const sourceFileTemplate = path.resolve(__dirname, 'scratch_code/vpw2017/01_mad_hatter_template.sb3');
const testFile = path.resolve(__dirname, 'tests/vpw2017/01_mad_hatter_test.js');

const DEBUG = true;

// unzipping
const fs = require("fs");
const yauzl = require("yauzl");

// puppeteer
const puppeteer = require('puppeteer');

// Dodona types for formatting
const {Message, Submission, Tab, Context, TestCase, Test} = require("./dodona.js");


// display message as a banner (crossing the entire width of the feedback table)
// NOTE: banner gets color coded based on the status (success, danger, ...)
function bannerMessage(description, status="success", options) {

    // options parameter is optional
    options = options || {};

    return new Message(Object.assign(
        options,
        {
            // TODO: description requires HTML encoding
            description: `<span class="label label-${status}" style="display:block;text-align:left;">${description}</span>`,
            format: "html"
        }
    ));

}

// display message with a label and a description
// NOTE: label gets color coded based on the status (success, danger, ...)
function labeledMessage(label, description, status="success", options) {

    // options parameter is optional
    options = options || {};

    return new Message(Object.assign(
        options,
        {
            // TODO: label and description require HTML encoding
            description: `<span class="label label-${status}">${label}</span>&nbsp;${description}`,
            format: "html"
        }
    ));

}

// display message with a exception (possibly including stack trace)
function errorMessage(description, options) {

    //todo
    console.log(description);

}

function toDodona(output) {
    process.stdout.write(JSON.stringify(output));
}

//
// Judge
//

class Judge {

    constructor(testFile, options) {

        // options parameter is optional
        options = options || {};

        // start timing
        this.time_start = new Date();

        // extract options
        this.time_limit = options.time_limit || 10000;

        this.test_file = testFile;

    }

    async run(sourceFile) {

        let browser;
        if (DEBUG) {
            browser = await puppeteer.launch({headless: false, devtools: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
        } else {
            browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
        }

        const page = await browser.newPage();

        if (DEBUG) {
            page.on('console', msg => console.debug('PAGE LOG:', msg.text()));
        }

        await page.goto(`file://${url}`);

        await page.exposeFunction('appendMessage', (message) => {
            toDodona({command: "append-message", message: message});
        });
        await page.exposeFunction('annotate', (row, column, text) => {
            toDodona({command: "annotate", row: row, column: column, text: text});
        });
        await page.exposeFunction('startTab', (title) => {
            toDodona({command: "start-tab", title: title});
        });
        await page.exposeFunction('startContext', () => {
            toDodona({command: "start-context"});
        });
        await page.exposeFunction('startTestcase', (description) => {
            toDodona({command: "start-testcase", description: description});
        });
        await page.exposeFunction('startTest', (expected) => {
            toDodona({command: "start-test", expected: expected.toString()});
        });
        await page.exposeFunction('closeTest', (generated, status) => {
            toDodona({command: "close-test", generated: generated.toString(), status: status});
        });
        await page.exposeFunction('closeTestcase', (s) => {
            let status = s || undefined;
            if (status !== undefined) {
                toDodona({command: "close-testcase", status: status});
            } else {
                toDodona({command: "close-testcase"});
            }
        });
        await page.exposeFunction('closeContext', () => {
            toDodona({command: "close-context"});
        });
        await page.exposeFunction('closeTab', () => {
            toDodona({command: "close-tab"});
        });

        await page.addScriptTag({url: testFile});

        let templateJSON = "";
        yauzl.open(sourceFileTemplate, {lazyEntries: true}, function(err, zipfile) {
            if (err) throw err;
            zipfile.readEntry();
            zipfile.on("entry", function(entry) {
                if (entry.fileName === 'project.json') {
                    console.log(entry);
                    zipfile.openReadStream(entry, function (err, readStream) {
                        if (err) throw err;
                        readStream.on("data", function(data) {
                            templateJSON += data;
                        });
                        readStream.on("end", function() {
                            //continue
                        });
                    });
                } else {
                    zipfile.readEntry();
                }
            });
        });

        let testJSON = "";
        yauzl.open(sourceFileTest, {lazyEntries: true}, function(err, zipfile) {
            if (err) throw err;
            zipfile.readEntry();
            zipfile.on("entry", function(entry) {
                if (entry.fileName === 'project.json') {
                    console.log(entry);
                    zipfile.openReadStream(entry, function (err, readStream) {
                        if (err) throw err;
                        let json = "";
                        readStream.on("data", function(data) {
                            testJSON += data;
                        });
                        readStream.on("end", function() {
                            //continue
                        });
                    });
                } else {
                    zipfile.readEntry();
                }
            });
        });

        // START JUDGE
        toDodona({command: "start-judgement"});

        const fileHandle = await page.$('#file');
        await fileHandle.uploadFile(sourceFileTest);

        await page.waitFor(50);

        if (DEBUG) {
            await page.evaluate(() => {
                debugger;
            });
        }

        let output = await page.evaluate((templateJSON, testJSON) => {
            return runTests(templateJSON, testJSON);
        }, templateJSON, testJSON);

        if (!DEBUG) {
            await browser.close();
        }

        // END JUDGE
        toDodona({command: "close-judgement"});
    }
}

module.exports = {
    Judge,
};
