class Processor {

  constructor(element) {
    this.stack = [];
    this.element = element;
  }

  process(message) {

    /** @type {string} */
    const command = message.command;

    if (command.startsWith('start')) {
      this.stack.push(message);
    }

    if (command === 'start-context') {
      this.output(`<h2>${message.description || 'Context'}</h2>`);
    } else if (command === 'start-testcase') {
      this.case = message.description;
      this.caseTests = [];
    } else if (command === "start-test") {
      this.currentTest = message;
    } else if (command === 'close-test') {
      const expected = this.currentTest;
      const actual = message.generated;
      const status = message.status.enum;
      this.caseTests.push({
        expected: expected,
        actual: actual,
        status: status
      });
    } else if (command === "close-testcase") {
      const content = this.caseTests.map(test => {
        return `${test.status === 'correct' ? '✅' : '❌'} Expected ${test.expected.expected}, got: ${test.actual}\n`;
      });
      const allCorrect = this.caseTests.every(test => test.status === 'correct');
      this.output(`<span title="${this.case}\n${content}">${allCorrect ? '✅' : '❌'}</span>`);
    } else if (command.startsWith('close')) {
      this.stack.pop();
    } else if (command === 'append-message') {
      this.output(`Message: ${message.message}`);
    }
  }

  output(res) {
    this.element.innerHTML += this.prepareHtml(res);
  }

  info(res) {
    this.element.innerHTML += this.prepareHtml(res);
  }

  error(res) {
    this.element.innerHTML += this.prepareHtml(res);
  }

  /** @param {string} html */
  prepareHtml(html) {
    return html;
  }
}

function init(element) {
  const old = window.handleOut;
  const processor = new Processor(element);
  window.handleOut = (result) => {
    processor.process(result);
    old(result);
  };
}