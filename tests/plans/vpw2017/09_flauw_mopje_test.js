/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function duringExecution() {
  actionTimeout = 15000;

  scratch.eventScheduling
    // TODO: we don't want to wait here.
    .wait(100)
    .greenFlag({ sync: false })
    .wait(12000)
    .end();

  scratch.start();
}

function afterExecution() {
  const sayEvents = log.events.filter({ type: 'say' });
  const sprekers = ['Kat', 'Bananen', 'Kat', 'Bananen', 'Kat'];
  const berichten = [
    'Klop, klop!',
    'Wie is daar?',
    'Ki!',
    'Ki, wie?',
    'Neen, dank je. Ik heb liever bananen!'
  ];
  console.log('Found events:', sayEvents);
  for (let i = 0; i < berichten.length; i++) {
    addCase(`Bericht nummer ${i} komt van de ${sprekers[i]}`, sayEvents[i].data.sprite === sprekers[i], `Spreker ${i} moet de ${sprekers[i]} zijn!`);
    addTest(`Correcte text in bericht nummer ${i}`, berichten[i], sayEvents[i].data.text, 'De tekst in de tekstballon is verkeerd');
  }
}
