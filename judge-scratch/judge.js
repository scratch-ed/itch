// file system access
//const fs = require("fs");

const path = require('path');
const url = path.resolve(__dirname, 'scratch/scratch-test-environment.html');
const sourceFile = path.resolve(__dirname, 'source/sourceFile.sb3');

// sandboxing
//const vm = require("vm");

// display utilities
//const utils = require("./utils.js");

// chromeless
const { Chromeless } = require('chromeless');

// Dodona types
const {Message, Submission, Tab, Context, TestCase, Test} = require("./dodona.js");

//
// new message types
// TODO: these types should get native Dodona-support to avoid HTML with
//       Bootstrap dependencies in feedback JSON
//

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

        // create new submission
        // this.feedback = new Submission();

    }

    async run() {

        const chromeless = new Chromeless();

        console.log("navigating to url: ", url);
        await chromeless.goto(`file://${url}`);

        console.log("sourcefile", sourceFile);
        await chromeless.setFileInput('#file', sourceFile);

        await chromeless.evaluate(() => {
            return Scratch.loadedEnd.promise;
        });

        let output = await chromeless.evaluate(() => {
            runTests();
        });

        console.log(output);
    }
}

module.exports = {
    Judge,
};
