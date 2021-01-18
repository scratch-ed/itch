/* Copyright (C) 2019 Ghent University - All Rights Reserved */
const path = require('path');
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');
const server = require('server');
const { status } = require('server/reply');

const DEBUG = false;
let acceptsOutput = true;

// unzipping
const yauzl = require("yauzl");

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

class Judge {

    constructor(testFile, options, toDodona = toStdOut) {

        // options parameter is optional
        options = options || {};

        // start timing
        this.time_start = new Date();

        // extract options
        this.time_limit = options.time_limit || 10000;

        this.test_file = testFile;

        this.toDodona = toDodona;
        
        this.debug = options["debug"] || false;
    }

    async run(sourceFile) {
        
        const ctx = await server({
            public: './',
            port: 3007
        }, [ctx => status(404)]);

        let browser;
        if (this.debug) {
            browser = await puppeteer.launch({
                headless: false, 
                devtools: true, 
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security']});
        } else {
            browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
            });
        }

        const page = await browser.newPage();

        if (this.debug) {
            page.on('console', msg => console.debug('PAGE LOG:', msg.text()));
        }

        await page.goto(`http://localhost:${ctx.options.port}/scratch/scratch-test-environment.html`);

        await page.exposeFunction('appendMessage', (message) => {
            this.toDodona({command: "append-message", message: message});
        });
        await page.exposeFunction('annotate', (row, column, text) => {
            this.toDodona({command: "annotate", row: row, column: column, text: text});
        });
        await page.exposeFunction('startTab', (title) => {
            this.toDodona({command: "start-tab", title: title});
        });
        await page.exposeFunction('startContext', () => {
            this.toDodona({command: "start-context"});
        });
        await page.exposeFunction('startTestcase', (description) => {
            this.toDodona({command: "start-testcase", description: description});
        });
        await page.exposeFunction('startTest', (expected) => {
            this.toDodona({command: "start-test", expected: expected.toString()});
        });
        await page.exposeFunction('closeTest', (generated, status) => {
            this.toDodona({command: "close-test", generated: generated.toString(), status: status});
        });
        await page.exposeFunction('closeTestcase', (accepted = undefined) => {
            if (accepted !== null && accepted !== undefined && accepted !== true) {
                //this.toDodona({command: "close-testcase", accepted: accepted.toString()});
                this.toDodona({command: "start-test", expected: "true"});
                let status = {};
                if (accepted) {
                    status = {enum: 'correct', human: 'Correct'};
                } else {
                    status = {enum: 'wrong', human: 'Wrong'};
                }
                this.toDodona({command: "close-test", generated: accepted.toString(), status: status});
                this.toDodona({command: "close-testcase"});
            } else {
                this.toDodona({command: "close-testcase"});
            }
        });
        await page.exposeFunction('closeContext', () => {
            this.toDodona({command: "close-context"});
        });
        await page.exposeFunction('closeTab', () => {
            this.toDodona({command: "close-tab"});
        });
        await page.exposeFunction('closeJudge', (accepted = undefined) => {
            if (accepted !== null && accepted !== undefined) {
                this.toDodona({command: "close-judgement"});
            } else {
                let status = {};
                if (accepted) {
                    status = {enum: 'correct', human: 'Correct'};
                } else {
                    status = {enum: 'wrong', human: 'Wrong'};
                }
                this.toDodona({command: "close-judgement", accepted: accepted.toString(), status: status});
            }
            acceptsOutput = false;
        });
        
        this.test_file = `http://localhost:${ctx.options.port}/${this.test_file}`

        await page.addScriptTag({url: this.test_file});

        let templateJSON = "";
        const sourceFileTemplate = path.resolve(__dirname, sourceFile);
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
        // TODO: use file test
        yauzl.open(sourceFileTemplate, {lazyEntries: true}, function(err, zipfile) {
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
        this.toDodona({command: "start-judgement"});

        const fileHandle = await page.$('#file');
        // TODO: also do file test here
        await fileHandle.uploadFile(sourceFileTemplate);

        await page.waitForTimeout(50);

        if (this.debug) {
            await page.evaluate(() => {
                debugger;
            });
        }

        let output = await page.evaluate((templateJSON, testJSON) => {
            return runTests(templateJSON, testJSON);
        }, templateJSON, testJSON);

        if (!this.debug) {
            await browser.close();
            await ctx.close();
        }

        // END JUDGE
        this.toDodona({command: "close-judgement"});
    }
}

module.exports = {
    Judge,
};
