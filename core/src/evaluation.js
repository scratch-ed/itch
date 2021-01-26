import { searchFrames } from './log';
import { numericEquals } from './utils';
import Context from './context';
import Deferred from './deferred';
import Project from './project';

let object;
if (typeof global === 'undefined') {
  object = window;
} else {
  object = global;
}

/**
 * Expose the some API in the global namespace.
 * 
 * TODO: move these elsewhere.
 */
function expose() {
  object.numericEquals = numericEquals;
  object.searchFrames = searchFrames;
}

/**
 * A bundle of all inputs for the judge. It contains all information
 * necessary for the judge to run a test.
 *
 * @typedef {Object} EvalConfig
 * @property {string|ArrayBuffer} submission - The submission sb3 data.
 * @property {string} templateJson - The JSON for the template.
 * @property {string} submissionJson - The JSON for the submission.
 * @property {HTMLCanvasElement} canvas - The canvas for the renderer.
 * @property {string} testplan - Location of the testplan.
 */

/**
 * Entry point for the test plan API.
 *
 * When writing tests, you should limit interaction with Scratch and
 * the judge to this class, if at all possible.
 *
 * While possible, you should limit yourself to the function
 */
class Evaluation {
  /**
   * @param {Context} context
   */
  constructor(context) {
    /**
     * @private
     * @type {Context}
     */
    this.context = context;
  }

  /**
   * Get access to the log.
   *
   * @public
   * @return {Log} The log.
   */
  get log() {
    return this.context.log;
  }

  /**
   * Get access to the scratch VM. This should be considered read-only.
   * If you modify the VM, there are no guarantees it will keep working.
   *
   * @public
   * @return {VirtualMachine}
   */
  get vm() {
    return this.context.vm;
  }

  /**
   * Get the array of answers provided previously.
   *
   * @public
   * @return {string[]}
   */
  get answers() {
    return this.context.answers;
  }

  /**
   * Set the array of answers to provide to the submission.
   *
   * @public
   * @param {string[]} answers
   */
  set answers(answers) {
    this.context.answers = answers;
  }

  /**
   * Get the output manager.
   *
   * @public
   * @return {ResultManager}
   */
  get output() {
    return this.context.output;
  }

  /**
   * Get the event scheduler.
   *
   * @return {SimulationEvent}
   */
  get eventScheduling() {
    return this.context.simulationChain;
  }
  
  /** @param {number} timeout */
  set actionTimeout(timeout) {
    this.context.actionTimeout = timeout;
  }
  
  /** @return {number} */
  get actionTimeout() {
    return this.context.actionTimeout;
  }
}

/**
 * Function that runs before the project is started. This can be used to
 * run static checks on the submitted project. For your convenience, the
 * template project is also provided. One example where this can be used
 * is to check if there were no sprites removed in the submission.
 *
 * @callback BeforeExecution
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {ResultManager} output - The output manager.
 * @return {void} Nothing -> ignored.
 */

/**
 * @type {BeforeExecution}
 */
// eslint-disable-next-line no-unused-vars
function defaultBeforeExecution(template, submission, output) {
  // pass
}

/**
 * Function that is run just before the project is executed, allowing to
 * schedule events, inputs and tests for during the execution. While you
 * have full access to the log in this stage, it might not be properly
 * filled. It is recommend to put tests using the log in the afterExecution
 * step.
 *
 * @callback DuringExecution
 * @param {Evaluation} evaluation - The judge object, providing the API.
 * @return {void} Nothing -> ignored.
 */

/** @param {Evaluation} evaluation */
// eslint-disable-next-line no-unused-vars
function defaultDuringExecution(evaluation) {
  // pass
  evaluation.eventScheduling.end();
}

/**
 * Function that is run after the project has been executed. At this
 * point the log is filled, and available for inspection. Mosts tests
 * in this stage are in the category of checking the end state of the
 * execution: checking how the project reacted to the instructions
 * scheduled in the "duringExecution" step.
 * 
 * @callback AfterExecution
 * @param {Evaluation} evaluation - The judge object, providing the API.
 * @return {void} Nothing -> ignored.
 */

/** @type {AfterExecution} */
// eslint-disable-next-line no-unused-vars
function defaultAfterExecution(evaluation) {
  // pass
}

async function loadTestplan(value) {
  if (typeof window !== 'undefined') {
    return {
      /** @type {BeforeExecution} */
      beforeExecution: window.beforeExecution || defaultBeforeExecution,
      /** @type {DuringExecution} */
      duringExecution: window.duringExecution || defaultDuringExecution,
      /** @type {AfterExecution} */
      afterExecution: window.afterExecution || defaultAfterExecution
    };
  } else {
    // This does currently not work :(
    // Since we use file://, the mime type is wrong in Chrome.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=824651
    return await import(value);
  }
}

/**
 * Run the judge.
 *
 * @param {EvalConfig} config - The config with the inputs for the judge.
 *
 * @return {Promise<void>}
 */
export async function run(config) {

  const context = await Context.create(config);
  const testplan = await loadTestplan(config.testplan);

  context.output.startTestTab('Testen uit het testplan');
  context.output.startTestContext();

  // Run the tests before the execution.
  const templateJson = JSON.parse(config.templateJson);
  const submissionJson = JSON.parse(config.submissionJson);
  testplan.beforeExecution(new Project(templateJson), new Project(submissionJson), context.output);
  context.output.closeTestContext();

  const judge = new Evaluation(context);
  expose();

  await context.vmLoaded.promise;

  // Schedule the commands for the duration.
  testplan.duringExecution(judge);

  // Prepare the context for execution.
  context.prepareForExecution();

  // Run the events.
  context.output.startTestContext();
  await context.simulationChain.launch();
  await context.simulationEnd.promise;
  context.output.closeTestContext();

  // Do post-mortem tests.
  context.output.startTestContext();
  testplan.afterExecution(judge);
  context.output.closeTestContext();

  context.output.closeTestTab();
  console.log('--- END OF EVALUATION ---');
}

// Main function in the judge.
object.run = run;

// Small utility we need.
object.Deferred = Deferred;
