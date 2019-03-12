function addTest(testName, expected, generated, message) {
    let status;
    window.startTestcase(testName);
    window.startTest(expected);
    window.appendMessage(message);
    if (generated) {
        if (generated === expected) {
            status = {enum: 'correct', human: 'Correct'};
        } else {
            status = {enum: 'wrong', human: 'Fout'};
        }
    } else {
        status = {enum: 'runtime error', human: 'Error: resultaat is undefined'};
    }

    window.closeTest(generated, status);
    window.closeTestcase();
}

function startTab(tabName) {
    window.startTab(tabName);
    window.startContext();
}

function closeTab() {
    window.closeContext();
    window.closeTab();
}
