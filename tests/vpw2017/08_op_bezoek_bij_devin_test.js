function check(templateJSON, testJSON) {
    return false;
}

function prepare() {

    actionTimeout = 6000;

    scratch.answers = ['Louise'];

    scratch.eventScheduling
        .greenFlag({sync: true})
        .end();

    scratch.start();
}

function evaluate() {

    console.log(scratch);

    //Controleer de tekst van de drie tekstballonnen
    addTest('Devin stelt zich voor', 'Hallo, ik ben Devin.', log.renderer.responses[0], 'Er wordt foute tekst weergegeven in de tekstballon');
    addTest('Devin vraagt je naam', 'Wat is jouw naam?', log.renderer.responses[1], 'Er wordt foute tekst weergegeven in de tekstballon');
    addTest('Devin zegt hallo', `Hallo, ${scratch.answers[0]}`, log.renderer.responses[2], 'Er wordt foute tekst weergegeven in de tekstballon');

    //Controleer of Devin de eerste boodschap 2 seconden lang zegt
    let rendererEvents = log.events.filter({type: 'renderer'});
    let textSkinEvent = [];
    for (let event of rendererEvents) {
        if (event.data.name === 'createTextSkin') {
            textSkinEvent.push(event);
        }
    }
    addCase('Devin stelt zich minstends 2 seconden lang voor', (textSkinEvent[1].time >= textSkinEvent[0].time + 2000), 'De eerste tekstballon moet minimum 2 seconden getoond worden.')
}
