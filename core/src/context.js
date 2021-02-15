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
  DONE_THREADS_UPDATE: 'DONE_THREADS_UPDATE',
  BEFORE_HATS_START: 'BEFORE_HATS_START'
};

/**
 * Wrap the stepper function.
 *
 * @param {VirtualMachine} vm
 */
function wrapStep(vm) {
  const oldFunction = vm.runtime._step.bind(vm.runtime);

  let time = Date.now();
  vm.runtime._step = () => {
    const oldResult = oldFunction();
    if (vm.runtime._lastStepDoneThreads.length > 0) {
      vm.runtime.emit(Events.DONE_THREADS_UPDATE, vm.runtime._lastStepDoneThreads);
    }
    const newTime = Date.now();
    if (time && newTime) {
      console.log(`Step took ${newTime - time}`, {
        currentStep: vm.runtime.currentStepTime
      });
    }
    time = newTime;
    return oldResult;
  };
}

/**
 * Wrap the start hats function to emit an event when this happens.
 * @param {VirtualMachine} vm
 */
function wrapStartHats(vm) {
  const oldFunction = vm.runtime.startHats.bind(vm.runtime);

  vm.runtime.startHats = (requestedHatOpcode, optMatchFields, optTarget) => {
    vm.runtime.emit(Events.BEFORE_HATS_START, {
      requestedHatOpcode, optMatchFields, optTarget
    });
    return oldFunction(requestedHatOpcode, optMatchFields, optTarget);
  };
}

/**
 * Load the VM. The returned VM is completely prepared: listeners
 * are attached, dependencies loaded and the project is loaded into
 * the VM.
 *
 * @param {VirtualMachine} vm - The VM to load.
 * @param {string|ArrayBuffer} project - The project to load.
 * @param {HTMLCanvasElement|null} [canvas] - The canvas for the renderer.
 * @param {Context} context - The context. The VM part of the context is not loaded yet.
 * @return {Promise<VirtualMachine>} The virtual machine.
 */
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
    wrapStartHats(vm);
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

    /**
     * The listeners for the broadcasts.
     * @type {BroadcastListener[]}
     */
    this.broadcastListeners = [];

    /** @type {ScheduledEvent} */
    this.event = ScheduledEvent.create();
    /**
     * Output manager
     */
    this.output = new ResultManager();

    /**
     * The acceleration factor, used to speed up (or slow down)
     * execution in the VM.
     *
     * There is a limit on how much you can increase this, since
     * each step in the VM must still have time to run of course.
     *
     * @type {number}
     */
    this.accelerationFactor = 1;

    /**
     * The acceleration factor for times, e.g. how long you should
     * wait for something. This is not always the same as the normal
     * acceleration factor, but in most cases, you should not change 
     * this.
     * 
     * @type {null|number}
     */
    this.timeAccelerationFactor = null;
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
      if (text !== '') {
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

    this.vm.runtime.on(Events.BEFORE_HATS_START, (opts) => {
      if (opts.requestedHatOpcode === 'event_whenbroadcastreceived') {
        this.broadcastListeners
          .filter(l => l.active)
          .forEach(l => l.update({
            matchFields: opts.optMatchFields,
            target: opts.optTarget
          }));
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
    this.vm.runtime.profiler.onFrame = ({ id, _selfTime, _totalTime, arg }) => {
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

    // Enable profiling.
    this.createProfiler();

    console.log('Loading is finished.');
    this.vmLoaded.resolve();

    return JSON.parse(this.vm.toJSON());
  }

  /**
   * Prepare the VM for execution. This will prepare the answers for
   * questions (if applicable) and instrument the VM to take the
   * acceleration factor into account.
   */
  prepareAndRunVm() {
    this.providedAnswers = this.answers.slice();

    // Optimisation.
    if (this.accelerationFactor !== 1) {
      // We need to instrument the VM.
      // Changing the events is not necessary; this
      // is handled by the event scheduler itself.

      // First, modify the step time.
      // TODO: we don't want to include RUNTIME
      const currentStepInterval = this.vm.runtime.constructor.THREAD_STEP_INTERVAL;
      const newStepInterval = currentStepInterval / this.accelerationFactor;

      Object.defineProperty(this.vm.runtime.constructor, "THREAD_STEP_INTERVAL", {
        value: newStepInterval
      });

      // We also need to change various time stuff.
      this.acceleratePrimitive('control_wait', 'DURATION');
      this.acceleratePrimitive('looks_sayforsecs');
      this.acceleratePrimitive('looks_thinkforsecs');
      this.acceleratePrimitive('motion_glidesecstoxy');
      this.acceleratePrimitive('motion_glideto');

      this.accelerateTimer();
    }

    // Start the vm.
    this.vm.start();
  }

  /**
   * Adjust the given argument for a given opcode to the acceleration factor.
   *
   * This is used to modify "time" constants to account for the acceleration factor.
   * For example, if a condition is "wait for 10 seconds", but the acceleration factor
   * is 2, we only want to wait for 5 seconds, not 10.
   *
   * @param {string} opcode - The opcode to accelerate.
   * @param {string} argument - The argument to accelerate.
   * 
   * @private
   */
  acceleratePrimitive(opcode, argument= 'SECS') {
    const original = this.vm.runtime.getOpcodeFunction(opcode);
    this.vm.runtime._primitives[opcode] = (originalArgs, util) => {
      // For safety, clone the arguments.
      // But, todo: is this needed?
      const args = { ...originalArgs };
      args[argument] = args[argument] / this.accelerationFactor;
      return original(args, util);
    };
  }

  /**
   * Adjust the given method on the given device to account for the
   * acceleration factor.
   * 
   * This is mainly used to reverse accelerate the project timer.
   * E.g. if the project timer is counts 10s for a project with
   * acceleration factor 2, it should count 20s instead.
   */
  accelerateTimer() {
    const factor = this.timeAccelerationFactor || this.accelerationFactor;
    
    if (factor === 1) {
      return;
    }
    
    const device = this.vm.runtime.ioDevices.clock;
    const original = device.projectTimer;
    
    device.projectTimer = () => {
      return original.call(device) * factor;
    };
  }

  /**
   * Accelerate a certain number. This is intended for times;
   * `timeAccelerationFactor` is used when available.
   * 
   * @param {number|any} number - The number to accelerate. All non-numbers are returned as is.
   * @return {number|any}
   */
  accelerate(number) {
    const factor = this.timeAccelerationFactor || this.accelerationFactor;
    if (factor === 1 || typeof number !== 'number') {
      return number;
    }
    return number / factor;
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