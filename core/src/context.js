import VirtualMachine from 'scratch-vm';
import ScratchStorage from 'scratch-storage';
import ScratchSVGRenderer from 'scratch-svg-renderer';
import AudioEngine from 'scratch-audio';
import ScratchRender from 'scratch-render';

import { Log, LogEvent, LogFrame } from './log.js';
import Deferred from './deferred.js';
import { makeProxiedRenderer } from './renderer';
import ResultManager from './output';
import ScheduledEvent from './scheduler.js';


const Events = {
  SCRATCH_PROJECT_START: 'PROJECT_START',
  SCRATCH_PROJECT_RUN_STOP: 'PROJECT_RUN_STOP',
  SCRATCH_SAY_OR_THINK: 'SAY',
  SCRATCH_QUESTION: 'QUESTION',
  SCRATCH_ANSWER: 'ANSWER',
  // Custom events,
  DONE_THREADS_UPDATE: 'DONE_THREADS_UPDATE'
};

/**
 * Wrap the stepper function.
 *
 * @param {VirtualMachine} vm
 */
function wrapStep(vm) {
  const oldFunction = vm.runtime._step.bind(vm.runtime);

  vm.runtime._step = () => {
    const oldResult = oldFunction();
    if (vm.runtime._lastStepDoneThreads.length > 0) {
      vm.runtime.emit('DONE_THREADS_UPDATE', vm.runtime._lastStepDoneThreads);
    }
    return oldResult;
  };
}

async function loadVm(vm, project, canvas = null, context = null) {
  vm.setTurboMode(false);

  // Set up the components.
  const storage = new ScratchStorage();
  vm.attachStorage(storage);
  const audioEngine = new AudioEngine();
  vm.attachAudioEngine(audioEngine);
  vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
  vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());

  // Set up the renderer, and inject our proxy.
  if (context !== null) {
    const renderer = makeProxiedRenderer(context, canvas);
    vm.attachRenderer(renderer);
  } else {
    vm.attachRenderer(new ScratchRender(canvas));
  }

  if (context !== null) {
    // Wrap the step function.
    wrapStep(vm);
  }

  // Load the project.
  await vm.loadProject(project);

  return vm;
}

/**
 * Contains common information and parameters for the
 * judge. This is passed around in lieu of using globals.
 */
export default class Context {
  constructor() {
    /**
     * When the execution started.
     * @type {number}
     */
    this.startTime = Date.now();
    /**
     * The number of the run.
     * @type {number}
     */
    this.numberOfRun = 0;
    /**
     *
     * @type {Log}
     */
    this.log = new Log();
    /**
     * Answers to give to scratch.
     * @type {string[]}
     */
    this.answers = [];
    
    this.providedAnswers = [];
    
    /**
     * Resolves once the scratch files have been loaded.
     * @type {Deferred}
     */
    this.vmLoaded = new Deferred();
    /**
     * Resolves once the simulation has ended.
     * @type {Deferred}
     */
    this.simulationEnd = new Deferred();
    /**
     * The timeout for the actions.
     * @type {number}
     */
    this.actionTimeout = 5000;
    /**
     * The listeners for the threads.
     * @type {ThreadListener[]}
     */
    this.threadListeners = [];
    
    /** @type {ScheduledEvent} */
    this.event = ScheduledEvent.create();
    /**
     * Output manager
     */
    this.output = new ResultManager();
  }

  /**
   * Get a current timestamp.
   * @return {number}
   */
  timestamp() {
    return Date.now() - this.startTime;
  }

  /**
   * Set up the event handles for a the vm.
   * @private
   */
  attachEventHandles() {
    this.vm.runtime.on(Events.SCRATCH_PROJECT_START, () => {
      console.log(`${this.timestamp()}: run number: ${this.numberOfRun}`);
      this.numberOfRun++;
    });

    this.vm.runtime.on(Events.SCRATCH_SAY_OR_THINK, (target, type, text) => {
      // Only save it when something is actually being said.
      if (text !== "") {
        console.log(`${this.timestamp()}: say: ${text} with ${type}`);

        const event = new LogEvent(this, 'say', { text: text, target: target, type: type, sprite: target.sprite.name });
        event.previousFrame = new LogFrame(this, 'say');
        event.nextFrame = new LogFrame(this, 'sayEnd');
        this.log.addEvent(event);
      }
    });

    this.vm.runtime.on(Events.SCRATCH_QUESTION, (question) => {
      if (question != null) {
        let x = this.providedAnswers.shift();
        if (x === undefined) {
          this.output.addError('Er werd een vraag gesteld waarop geen antwoord voorzien is.');
          x = null;
        }

        console.log(`${this.timestamp()}: input: ${x}`);

        const event = new LogEvent(this, 'answer', { question: question, text: x });
        event.previousFrame = new LogFrame(this, 'answer');
        event.nextFrame = new LogFrame(this, 'answerEnd');
        this.log.addEvent(event);

        this.vm.runtime.emit(Events.SCRATCH_ANSWER, x);
      }
    });

    this.vm.runtime.on(Events.SCRATCH_PROJECT_RUN_STOP, () => {
      console.log(`${this.timestamp()}: Ended run`);
    });

    this.vm.runtime.on(Events.DONE_THREADS_UPDATE, (threads) => {
      for (const thread of threads) {
        for (const action of this.threadListeners) {
          if (action.active) {
            action.update(thread);
          }
        }
      }
    });
  }

  /**
   * Create a profile and attach it to the VM.
   * @private
   */
  createProfiler() {
    this.vm.runtime.enableProfiling();
    const blockId = this.vm.runtime.profiler.idByName('blockFunction');

    // eslint-disable-next-line no-unused-vars
    this.vm.runtime.profiler.onFrame = ({id, _selfTime, _totalTime, arg}) => {
      if (id === blockId) {
        this.log.addFrame(this, arg);
      }
    };
  }

  /**
   * Extract the project.json from a sb3 project.
   * 
   * If you need the project JSON from the actual project you want to test,
   * it's more efficient to use `prepareVm`, since that will re-use the created
   * VM.
   * 
   * @param {EvalConfig} config
   * @return {Promise<Object>}
   */
  async getProjectJson(config) {
    if (!this.vm) {
      this.vm = new VirtualMachine();
    }
    await loadVm(this.vm, config.template, config.canvas);
    return JSON.parse(this.vm.toJSON());
  }

  /**
   * Set-up the scratch vm. After calling this function,
   * the vmLoaded promise will be resolved.
   *
   * @param {EvalConfig} config
   * 
   * @return {Promise<Object>} The JSON representation of the 
   */
  async prepareVm(config) {
    if (!this.vm) {
      this.vm = new VirtualMachine();
    }
    /**
     * The scratch virtual machine.
     *
     * @type {VirtualMachine};
     */
    await loadVm(this.vm, config.submission, config.canvas, this);
    // Attach handlers
    this.attachEventHandles();
    
    // Start the vm.
    this.vm.start();
    
    // Enable profiling.
    this.createProfiler();

    console.log("Loading is finished.");
    this.vmLoaded.resolve();
    
    return JSON.parse(this.vm.toJSON());
  }
  
  prepareForExecution() {
    this.providedAnswers = this.answers.slice();
  }

  /**
   * Create a context with a fully prepared VM.
   * 
   * @param {EvalConfig} config
   * @return {Promise<Context>}
   */
  static async create(config) {
    const context = new Context();
    await context.prepareVm(config);
    return context;
  }
}