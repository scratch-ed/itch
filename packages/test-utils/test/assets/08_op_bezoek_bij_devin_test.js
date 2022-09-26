/* Copyright (C) 2019 Ghent University - All Rights Reserved */
/** @param {Evaluation} e */
function duringExecution(e) {
  e.answers = ['Louise'];

  e.scheduler.greenFlag().end();
}

/** @param {Evaluation} e */
function afterExecution(e) {
  // Controleer de tekst van de drie tekstballonnen
  e.group
    .test('Devin stelt zich voor')
    .expect(e.log.renderer.responses[0])
    .toBe('Hallo, ik ben Devin.');
  e.group
    .test('Devin vraagt je naam')
    .expect(e.log.renderer.responses[1])
    .toBe('Wat is jouw naam?');
  e.group
    .test('Devin zegt hallo')
    .expect(e.log.renderer.responses[2])
    .toBe(`Hallo, ${e.answers[0]}`);

  function getSkinDuration(text) {
    const createTextSkinEvents = e.log.events.filter(
      (e) => e.type === 'renderer' && e.data.name === 'createTextSkin',
    );
    const destroyTextSkinEvents = e.log.events.filter(
      (e) => e.type === 'renderer' && e.data.name === 'destroySkin',
    );

    let time = 0;
    let id = -1;
    for (const e of createTextSkinEvents) {
      if (e.data.text === text) {
        time = e.time;
        id = e.data.id;
      }
    }
    for (const e of destroyTextSkinEvents) {
      if (e.data.id === id) {
        return e.time - time;
      }
    }
    return null;
  }

  // Controleer of de eerste tekstballon 2 seconden wordt weergegeven
  e.group
    .test('Devin stelt zich minstens 2 seconden lang voor')
    .feedback({
      correct: 'OK',
      wrong: 'De eerste tekstballon moet minimum 2 seconden getoond worden.',
    })
    .acceptIf(getSkinDuration('Hallo, ik ben Devin.') >= 2000);
}
