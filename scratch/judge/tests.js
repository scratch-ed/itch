function addTest(testName, expected, generated, message) {
    let status;
    dodona.startTestCase(testName);
    dodona.startTest(expected);
    dodona.addMessage(message);
    if (generated) {
        if (generated === expected) {
            status = {enum: 'correct', human: 'Correct'};
        } else {
            status = {enum: 'wrong', human: 'Fout'};
        }
    } else {
        status = {enum: 'runtime error', human: 'Error: resultaat is undefined'};
    }

    dodona.closeTest(generated, status);
    dodona.closeTestCase();
}

