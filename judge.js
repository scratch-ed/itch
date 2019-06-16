// file system access
//const fs = require("fs");

const path = require('path');
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');

/*
const sourceFileTest = path.resolve(__dirname, 'source/sourceFile.sb3');
const testFile = path.resolve(__dirname, 'tests/test.js');
*/

const oefening = '02_papegaai';
const sourceFileTest = path.resolve(__dirname, `scratch_code/vpw2017/${oefening}.sb3`);
const sourceFileTemplate = path.resolve(__dirname, `scratch_code/vpw2017/${oefening}.sb3`);
const testFile = path.resolve(__dirname, `tests/vpw2017/${oefening}_test.js`);

const DEBUG = false;
let acceptsOutput = true;

// unzipping
const yauzl = require("yauzl");

// puppeteer
const puppeteer = require('puppeteer');

function toDodona(output) {
    if (acceptsOutput) {
        process.stdout.write(JSON.stringify(output));
    }
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
        await page.exposeFunction('closeTestcase', (accepted = undefined) => {
            if (accepted !== null && accepted !== undefined && accepted !== true) {
                //toDodona({command: "close-testcase", accepted: accepted.toString()});
                toDodona({command: "start-test", expected: "true"});
                let status = {};
                if (accepted) {
                    status = {enum: 'correct', human: 'Correct'};
                } else {
                    status = {enum: 'wrong', human: 'Wrong'};
                }
                toDodona({command: "close-test", generated: accepted.toString(), status: status});
                toDodona({command: "close-testcase"});
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
        await page.exposeFunction('closeJudge', (accepted = undefined) => {
            if (accepted !== null && accepted !== undefined) {
                toDodona({command: "close-judgement"});
            } else {
                let status = {};
                if (accepted) {
                    status = {enum: 'correct', human: 'Correct'};
                } else {
                    status = {enum: 'wrong', human: 'Wrong'};
                }
                toDodona({command: "close-judgement", accepted: accepted.toString(), status: status});
            }
            acceptsOutput = false;
        });

        await page.addScriptTag({url: testFile});

        let templateJSON = "";
        yauzl.open(sourceFileTemplate, {lazyEntries: true}, function(err, zipfile) {
            if (err) throw err;
            zipfile.readEntry();
            zipfile.on("entry", function(entry) {
                if (entry.fileName === 'project.json') {
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
                //debugger;
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
