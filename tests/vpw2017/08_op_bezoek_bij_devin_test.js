function check(templateJSON, testJSON) {
    return false;
}

function prepare() {

    actionTimeout = 6000;

    scratch.answers = ['Louise', 'Pieter'];

    scratch.eventScheduling
        .greenFlag({sync: true})
        .end();

    scratch.start();
}

function evaluate() {

    //Controleer de tekst van de drie tekstballonnen
    addTest('Devin stelt zich voor', 'Hallo, ik ben Devin.', log.renderer.responses[0], 'Er wordt foute tekst weergegeven in de tekstballon');
    addTest('Devin vraagt je naam', 'Wat is jouw naam?', log.renderer.responses[1], 'Er wordt foute tekst weergegeven in de tekstballon');
    addTest('Devin zegt hallo', `Hallo, ${scratch.answers[0]}`, log.renderer.responses[2], 'Er wordt foute tekst weergegeven in de tekstballon');

    //Controleer of de eerste tekstballon 2 seconden wordt weergegeven
    addCase('Devin stelt zich minstends 2 seconden lang voor', log.getSkinDuration('Hallo, ik ben Devin.') >= 2000, 'De eerste tekstballon moet minimum 2 seconden getoond worden.')
}
