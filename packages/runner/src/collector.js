/**
 * @fileOverview A basic debug view for the output of the judge.
 */
class Processor {

  constructor(element) {
    this.stack = [];
    this.element = element;
  }

  process(message) {

    /** @type {string} */
    const command = message.command;
    
    if (command === 'start-judgement') {
      this.start = new Date();
    }
    
    if (command === 'close-judgement') {
      const title = document.getElementById("out");
      if (title) {
        title.innerHTML = `Output (took ${new Date() - this.start}ms)`;
      }
    }

    if (command.startsWith('start')) {
      this.stack.push(message);
    }

    if (command === 'start-tab') {
      this.output(`<h2>${message.title || 'Tabblad'}</h2>`);
    } else if (command === 'start-context') {
      this.output(`<h3>${message.description || 'Context'}</h3>`);
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
        return `${test.status === 'correct' ? '✅' : '❌'} Expected ${test.expected.expected}, got: ${test.actual}`;
      });
      const merged = content.join("\n");
      const allCorrect = this.caseTests.every(test => test.status === 'correct');
      this.output(`<span title="${this.case}\n${merged}">${allCorrect ? '✅' : '❌'}</span>`);
    } else if (command.startsWith('close')) {
      this.stack.pop();
    } else if (command === 'append-message') {
      this.output(`<br>Message: ${message.message}`);
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

// eslint-disable-next-line no-unused-vars
function init(element) {
  const old = window.handleOut;
  const processor = new Processor(element);
  window.handleOut = (result) => {
    processor.process(result);
    old(result);
  };
}