/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.actionTimeout = 15000;
  e.acceleration = 10;

  e.scheduler
    // TODO: we don't want to wait here.
    .greenFlag(false)
    .wait(12000)
    .end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  const sayEvents = e.log.events.filter((e) => e.type === 'say');
  const sprekers = ['Kat', 'Bananen', 'Kat', 'Bananen', 'Kat'];
  const berichten = [
    'Klop, klop!',
    'Wie is daar?',
    'Ki!',
    'Ki, wie?',
    'Neen, dank je. Ik heb liever bananen!',
  ];
  for (let i = 0; i < berichten.length; i++) {
    e.group
      .test(`Bericht nummer ${i} komt van de ${sprekers[i]}`)
      .feedback({
        wrong: `Spreker ${i} moet de ${sprekers[i]} zijn!`,
        correct: `Spreker ${i} is de ${sprekers[i]} zijn!`,
      })
      .expect(sayEvents[i].data.sprite)
      .toBe(sprekers[i]);
    e.group
      .test(`Correcte text in bericht nummer ${i}`)
      .feedback({
        wrong: 'De tekst in de tekstballon is verkeerd',
        correct: 'De tekst in de tekstballon is juist',
      })
      .expect(sayEvents[i].data.text)
      .toBe(berichten[i]);
  }
}
