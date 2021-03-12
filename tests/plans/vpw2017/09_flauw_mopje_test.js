/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 15000;

  e.scheduler
    // TODO: we don't want to wait here.
    .greenFlag(false)
    .wait(12000)
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const sayEvents = e.log.events.filter({ type: 'say' });
  const sprekers = ['Kat', 'Bananen', 'Kat', 'Bananen', 'Kat'];
  const berichten = [
    'Klop, klop!',
    'Wie is daar?',
    'Ki!',
    'Ki, wie?',
    'Neen, dank je. Ik heb liever bananen!'
  ];
  console.log(sayEvents);
  for (let i = 0; i < berichten.length; i++) {
    e.test(`Bericht nummer ${i} komt van de ${sprekers[i]}`, l => {
      l.expect(sayEvents[i].data.sprite)
        .withError(`Spreker ${i} moet de ${sprekers[i]} zijn!`)
        .toBe(sprekers[i]);
    });
    e.test(`Correcte text in bericht nummer ${i}`, l => {
      l.expect(sayEvents[i].data.text)
        .withError('De tekst in de tekstballon is verkeerd')
        .toBe(berichten[i]);
    });
  }
}
