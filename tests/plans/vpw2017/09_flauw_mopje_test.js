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
    e.output.addCase(`Bericht nummer ${i} komt van de ${sprekers[i]}`, sayEvents[i].data.sprite === sprekers[i], `Spreker ${i} moet de ${sprekers[i]} zijn!`);
    e.output.addTest(`Correcte text in bericht nummer ${i}`, berichten[i], sayEvents[i].data.text, 'De tekst in de tekstballon is verkeerd');
  }
}
