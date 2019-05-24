function duringExecution() {

    actionTimeout = 15000;

    scratch.eventScheduling
        .greenFlag({sync: false})
        .wait(12000)
        .end();

    scratch.start();
}

function afterExecution() {

    let sayEvents = log.events.filter({type: 'say'});

    addCase('Het eerste bericht komt van de kat', sayEvents[0].data.sprite === "Kat", 'De mop begint bij de kat!');
    addTest('Correcte tekst door kat', 'Klop, klop!', sayEvents[0].data.text, 'De tekst in de tekstballon van de kat is verkeerd');

    addCase('Het tweede bericht komt van de banenen', sayEvents[1].data.sprite === "Bananen", 'De bananen moeten antwoorden op de kat!');
    addTest('Correcte tekst door bananen', 'Wie is daar?', sayEvents[1].data.text, 'De tekst in de tekstballon van de bananen is verkeerd');

    addCase('Het derde bericht komt van de kat', sayEvents[2].data.sprite === "Kat", 'De kat moet antwoorden op de bananen');
    addTest('Correcte tekst door kat', 'Ki!', sayEvents[2].data.text, 'De tekst in de tekstballon van de kat is verkeerd');

    addCase('Het vierde bericht komt van de banenen', sayEvents[3].data.sprite === "Bananen", 'De bananen moeten antwoorden op de kat!');
    addTest('Correcte tekst door bananen', 'Ki, wie?', sayEvents[3].data.text, 'De tekst in de tekstballon van de bananen is verkeerd');

    addCase('Het vijfde bericht komt van de kat', sayEvents[4].data.sprite === "Kat", 'De kat moet antwoorden op de bananen');
    addTest('Correcte tekst door kat', 'Neen, dank je. Ik heb liever bananen!', sayEvents[4].data.text, 'De tekst in de tekstballon van de kat is verkeerd');
}
