import { searchFrames} from './log';
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
 * A bundle of all inputs for the judge. It contains all information
 * necessary for the judge to run a test.
 * 
 * @property {string|ArrayBuffer} submission - The submission sb3 data.
 * @property {string} templateJson - The JSON for the template.
 * @property {string} submissionJson - The JSON for the submission.
 * @property {HTMLCanvasElement} canvas - The canvas for the renderer.
 * @property {string} testplan - Location of the testplan.
 */
export class JudgeConfig {
}

/**
 * Entry point for the test plan API.
 *
 * When writing tests, you should limit interaction with Scratch and
 * the judge to this class, if at all possible.
 */
class Judge {
  /**
   * @param {Context} context
   */
  constructor(context) {
    this.context = context;
  }

  /**
   * Expose the API in the global namespace.
   */
  expose() {
    object.numericEquals = numericEquals;
    object.searchFrames = searchFrames;
    object.log = this.context.log;
    object.actionTimeout = this.context.actionTimeout;
    object.answers = this.context.answers;
    object.scratch = {
      eventScheduling: this.context.simulationChain,
      start: () => {
        this.context.actionTimeout = object.actionTimeout;
        this.context.answers = object.answers;
      }
    };
  }
}

async function loadTestplan(value) {
  if (typeof window !== 'undefined') {
    return {
      beforeExecution: window.beforeExecution,
      duringExecution: window.duringExecution,
      afterExecution: window.afterExecution
    }
  } else {
    return await import(value);
  }
}

/**
 * Run the judge.
 * 
 * @param {JudgeConfig} config - The config with the inputs for the judge.
 * 
 * @return {Promise<void>}
 */
export async function run(config) {
  
  dodona.startTestTab('Testen uit het testplan');
  dodona.startTestContext();
  const testplan = await loadTestplan(config.testplan);
  
  // Run the tests before the execution.
  const templateJson = JSON.parse(config.templateJson);
  const submissionJson = JSON.parse(config.submissionJson);
  testplan.beforeExecution(new Project(templateJson), new Project(submissionJson));
  dodona.closeTestContext();
  
  const context = await Context.create(config);
  const judge = new Judge(context);
  judge.expose();
  
  console.log("Exposed.");
  
  await context.vmLoaded.promise;

  console.log("Schedule execution events.");
  
  // Schedule the commands for the duration.
  testplan.duringExecution();

  console.log("Run the simulation.");

  dodona.startTestContext();
  // TODO: should we wait for this?
  await context.simulationChain.launch();

  console.log("Waiting for finish...");
  
  // Wait until the execution is done.
  await context.simulationEnd.promise;
  dodona.closeTestContext();

  console.log("Doing afte tests");

  dodona.startTestContext();
  testplan.afterExecution();
  
  // Run tests after the execution.
  dodona.closeTestContext();

  dodona.closeTestTab();
  console.log('--- END OF EVALUATION ---');
}

object.JudgeConfig = JudgeConfig;
object.run = run;
object.Deferred = Deferred;