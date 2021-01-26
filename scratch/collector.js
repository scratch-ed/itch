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

    if (command === 'start-tab') {
      this.output(' '.repeat(this.indent()) + `Tab: ${message.title}`);
    } else if (command === 'start-testcase') {
      this.case = message.description;
    } else if (command === 'close-test') {
      const expected = this.stack.pop();
      const actual = message.actual;
      const status = message.status.enum;
      if (status === 'correct') {
        this.smallLog(`✅`, this.case);
      } else {
        this.error(`❌ expected ${expected}, got ${actual}.`);
      }
    } else if (command.startsWith('close')) {
      this.stack.pop();
    } else if (command === 'append-message') {
      this.output(`Message: ${message.message}`);
    }

  }

  indent() {
    return this.stack.length;
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

  smallLog(res, t) {
    let h = '';
    if (this.isFirstTest) {
      h = `<span style="margin-left: ${this.indent() * 5}px"></span>`;
    }
    h += `<span title="${t}">${res}</span>`;
    this.element.innerHTML += h;
  }

  /** @param {string} html */
  prepareHtml(html) {
    const h = html.trim();
    return `<div style="margin-left: ${this.indent() * 5}px">${h}</div>`;
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