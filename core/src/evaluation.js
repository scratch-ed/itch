// Neede for https://github.com/LLK/scratch-gui/issues/5025
import 'regenerator-runtime/runtime.js';

import { searchFrames } from './log.js';
import { numericEquals } from './utils.js';
import Context from './context.js';
import Project from './project.js';
import { delay, broadcast, sprite } from './scheduler/index.js';

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
  object.sprite = sprite;
  object.broadcast = broadcast;
  object.delay = delay;
}

/**
 * A bundle of all inputs for the judge. It contains all information
 * necessary for the judge to run a test.
 *
 * @typedef {Object} EvalConfig
 * @property {string|ArrayBuffer} submission - The submission sb3 data.
 * @property {string|ArrayBuffer} template - The template sb3 file.
 * @property {HTMLCanvasElement} canvas - The canvas for the renderer.
 */

const EvaluationStage = {
  not_started: 0,
  before: 1,
  scheduling: 2,
  executing: 3,
  after: 4
}

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

    /**
     * Used to track the stage internally.
     * @type {number}
     * @protected
     */
    this.stage = EvaluationStage.not_started;
  }

  /**
   * Get access to the log.
   *
   * @return {Log} The log.
   */
  get log() {
    return this.context.log;
  }

  /**
   * Get access to the scratch VM. This should be considered read-only.
   * If you modify the VM, there are no guarantees it will keep working.
   *
   * @return {VirtualMachine}
   */
  get vm() {
    return this.context.vm;
  }

  /**
   * Get the array of answers provided previously.
   *
   * @return {string[]}
   */
  get answers() {
    return this.context.answers;
  }

  /**
   * Set the array of answers to provide to the submission.
   *
   * @param {string[]} answers
   */
  set answers(answers) {
    this.context.answers = answers;
  }

  /**
   * Get the output manager.
   *
   * @return {ResultManager}
   */
  get output() {
    return this.context.output;
  }

  /**
   * Get the event scheduler.
   *
   * @return {ScheduledEvent}
   */
  get scheduler() {
    return this.context.event;
  }

  /** @param {number} timeout */
  set actionTimeout(timeout) {
    this.assertBefore(EvaluationStage.scheduling, "actionTimeout");
    this.context.actionTimeout = timeout;
  }

  /** @return {number} */
  get actionTimeout() {
    return this.context.actionTimeout;
  }

  /**
   * Set the acceleration factor for the test.
   * @param {number} factor - The factor, e.g. 2 will double the speed.
   */
  set acceleration(factor) {
    this.assertBefore(EvaluationStage.scheduling, "acceleration");
    this.context.accelerationFactor = { 
      factor: factor
    };
  }

  /**
   * @return {number}
   */
  get acceleration() {
    return this.context.accelerationFactor.factor;
  }

  /**
   * Set the acceleration factor for the test's times.
   * This will be used to set the timeouts for the scheduled events.
   * 
   * @param {number} factor - The factor, e.g. 2 will double the speed.
   */
  set timeAcceleration(factor) {
    this.assertBefore(EvaluationStage.scheduling, "timeAcceleration");
    this.context.accelerationFactor.time = factor;
  }
  
  get timeAcceleration() {
    return this.context.accelerationFactor.time;
  }

  /**
   * Set the acceleration factor for the event times.
   * This will be used to set the timeouts for the scheduled events.
   *
   * @param {number} factor - The factor, e.g. 2 will double the speed.
   */
  set eventAcceleration(factor) {
    this.assertBefore(EvaluationStage.scheduling, "eventAcceleration");
    this.context.accelerationFactor.event = factor;
  }

  get eventAcceleration() {
    return this.context.accelerationFactor.event;
  }

  /**
   * Check that we are before or on a given stage.
   * @param {number} stage
   * @param {string} func
   */
  assertBefore(stage, func) {
    if (this.stage > stage) {
      throw new Error(`The function ${func} cannot be used at this stage: it must be used earlier.`);
    }
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

/**
 * Run the judge.
 *
 * @param {EvalConfig} config - The config with the inputs for the judge.
 *
 * @return {Promise<void>}
 */
export async function run(config) {

  const context = new Context();
  const templateJson = await context.getProjectJson(config);
  const submissionJson = await context.prepareVm(config);
  const testplan = {
    /** @type {BeforeExecution} */
    beforeExecution: window.beforeExecution || (() => {}),
    /** @type {DuringExecution} */
    duringExecution: window.duringExecution || (e => e.scheduler.end()),
    /** @type {AfterExecution} */
    afterExecution: window.afterExecution || (() => {})
  };

  context.output.startTestTab('Testen uit het testplan');
  context.output.startTestContext();
  context.stage = EvaluationStage.before;

  // Run the tests before the execution.
  testplan.beforeExecution(new Project(templateJson), new Project(submissionJson), context.output);
  context.output.closeTestContext();

  const judge = new Evaluation(context);
  expose();

  await context.vmLoaded.promise;
  context.stage = EvaluationStage.scheduling;

  // Schedule the commands for the duration.
  testplan.duringExecution(judge);

  context.stage = EvaluationStage.executing;
  // Prepare the context for execution.
  context.prepareAndRunVm();

  // Run the events.
  context.output.startTestContext();
  await context.event.run(context);
  await context.simulationEnd.promise;
  context.output.closeTestContext();
  
  context.stage = EvaluationStage.after;

  // Do post-mortem tests.
  context.output.startTestContext();
  testplan.afterExecution(judge);
  context.output.closeTestContext();

  context.output.closeTestTab();
  console.log('--- END OF EVALUATION ---');
}

// Main function in the judge.
object.run = run;
