const fs = require('fs');

class CsvReporter {
  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
    this._context = reporterContext;
  }

  onRunComplete(contexts, results) {
    const data = [['Oefening', 'Level', 'Test', 'Resultaat']];
    const regex = /Level ([0-9]+)/i;

    for (const result of results.testResults) {
      for (const testCase of result.testResults) {
        const isTemplate = testCase.title.startsWith('Template');
        const exercise = testCase.fullName.split(' ')[0];
        const found = testCase.fullName.match(regex);
        let level;
        if (found) {
          level = found[1];
        } else {
          level = '';
        }

        data.push([
          exercise,
          level,
          isTemplate ? 'opgave' : 'oplossing',
          testCase.status,
        ]);
      }
    }

    let stringData = '';
    for (const line of data) {
      stringData += line.join(',');
      stringData += '\r\n';
    }

    fs.writeFileSync('results.csv', stringData);
  }
}

module.exports = CsvReporter;
