// file system access
//const fs = require("fs");

const path = require('path');
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');

const sourceFile = path.resolve(__dirname, 'source/sourceFile.sb3');
const testFile = path.resolve(__dirname, 'tests/test.js');

const DEBUG = false;

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

    async run() {

        let browser;
        if (DEBUG) {
            browser = await puppeteer.launch({headless: false});
        } else {
            browser = await puppeteer.launch();
        }

        const page = await browser.newPage();

        if (DEBUG) {
            page.on('console', msg => console.debug('PAGE LOG:', msg.text()));
        }

        await page.goto(`file://${url}`);

        await page.exposeFunction('appendMessage', (message) => {
            let out = {command: "append-message", message: message};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('annotate', (row, column, text) => {
            let out = {command: "annotate", row: row, column: column, text: text};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('startTab', (title) => {
            let out = {command: "start-tab", title: title};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('startContext', () => {
            let out = {command: "start-context"};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('startTestcase', (description) => {
            let out = {command: "start-testcase", description: description};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('startTest', (expected) => {
            let out = {command: "start-test", expected: expected.toString()};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('closeTest', (generated, status) => {
            let out = {command: "close-test", generated: generated.toString(), status: status};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('closeTestcase', () => {
            let out = {command: "close-testcase"};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('closeContext', () => {
            let out = {command: "close-context"};
            console.log(JSON.stringify(out));
        });
        await page.exposeFunction('closeTab', () => {
            let out = {command: "close-tab"};
            console.log(JSON.stringify(out));
        });

        await page.addScriptTag({url: testFile});

        // START JUDGE
        console.log(JSON.stringify({command: "start-judgement"}));

        const fileHandle = await page.$('#file');
        await fileHandle.uploadFile(sourceFile);

        await page.waitFor(100);

        let output = await page.evaluate(() => {
            return runTests();
        });

        await browser.close();

        // END JUDGE
        console.log(JSON.stringify({command: "close-judgement"}))
    }
}

module.exports = {
    Judge,
};
