/**
 * @fileOverview A basic debug view for the output of the judge.
 */
class Processor {
  constructor(element) {
    this.stack = [];
    this.element = element;
    this.groupStack = [];
  }

  process(message) {
    /** @type {string} */
    const command = message.command;

    if (command === 'start-judgement') {
      this.start = new Date();
    }

    if (command === 'close-judgement') {
      const title = document.getElementById('out');
      if (title) {
        title.innerHTML = `Output (took ${new Date() - this.start}ms)`;
      }
    }

    if (command.startsWith('start')) {
      this.stack.push(message);
    }

    if (command === 'start-group') {
      // Start a new group.
      const details = document.createElement('details');
      details.open = message.visibility === 'show';
      const summary = document.createElement('summary');
      summary.innerHTML = `<strong>${message.name}</strong>`;
      details.appendChild(summary);
      this.element.appendChild(details);
      this.groupStack.push(this.element);
      this.element = details;
    }

    if (command === 'close-group') {
      if (message.description) {
        const summary = this.element.querySelector('summary');
        summary.innerHTML += '<br>';
        summary.innerHTML += message.description;
      }
      this.element = this.groupStack.pop();
    }

    if (command === 'start-test') {
      this.currentTest = message;
    }

    if (command === 'close-test') {
      this.element.innerHTML += `<span title='${this.currentTest.name}'>${
        message.status === 'correct' ? '✅' : '❌'
      } ${message.feedback || this.currentTest.name}</span><br>`;
    }

    if (command.startsWith('close')) {
      this.stack.pop();
    } else if (command === 'append-message') {
      this.element.innerHTML += `Message: ${message.message}`;
    } else if (command === 'escalate-status') {
      this.element.innerHTML += `<br><strong>ESCALATION</strong>: status is now ${message.status}`;
    }
  }
}

// eslint-disable-next-line no-unused-vars
function init(element) {
  const processor = new Processor(element);
  window.handleOut = (result) => {
    processor.process(result);
    console.debug(result);
  };
}
