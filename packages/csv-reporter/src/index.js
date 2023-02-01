const fs = require('fs');

class CsvReporter {
  constructor(globalConfig, reporterOptions, reporterContext) {
    this._globalConfig = globalConfig;
    this._options = reporterOptions;
    this._context = reporterContext;
  }

  onRunComplete(contexts, results) {
    let data = [];
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

    const correct = data.filter((d) => d[3] === 'passed').length;
    const wrong = data.filter((d) => d[3] === 'failed').length;
    // Create results as markdown file.
    // This can then be posted to the GitHub job summary.
    let markdown = `
### Samenvatting
|         | Aantal | %     |
|---------|--------|-------|
| Totaal  | ${data.length} | 100% |
| Werkend | ${correct} | ${((correct / data.length) * 100).toFixed(2)} |
| Kapot   | ${wrong} | ${((wrong / data.length) * 100).toFixed(2)} |

### Details
| Oefening | Level | Test  | Resultaat |
|---------|--------|-------|-----------|
`;

    for (const line of data) {
      let status;
      if (line[3] === 'failed') {
        status = '❌ failed';
      } else if (line[3] === 'passed') {
        status = '✅ passed';
      } else {
        status = '？ pending';
      }
      markdown += `| ${line[0]} | ${line[1]} | ${line[2]} | ${status} |\n`;
    }

    fs.writeFileSync('results.md', markdown);

    let stringData = 'Oefening, Level, Test, Resultaat';
    for (const line of data) {
      stringData += line.join(',');
      stringData += '\r\n';
    }

    fs.writeFileSync('results.csv', stringData);
  }
}

module.exports = CsvReporter;
