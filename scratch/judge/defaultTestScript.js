/* Copyright (C) 2019 Ghent University - All Rights Reserved */
// These functions get overridden by the functions supplied in the test script added through the Puppeteer function "addScriptTag({url: testFile})"
// If one of the functions is not supplied these functions will be used instead.

/** @deprecated */
function beforeExecution(templateJSON, testJSON) {
    // empty
}

/**
 * @param {Project} template
 * @param {Project} submission
 */
function beforeExecution2(template, submission) {
    // empty
}

function duringExecution() {
    scratch.eventScheduling
        .greenFlag()
        .end();

    scratch.start();
}

function afterExecution() {
    // empty
}

