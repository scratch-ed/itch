import type Runtime from 'itch-scratch-vm-types/types/engine/runtime';
import type Thread from 'itch-scratch-vm-types/types/engine/thread';
import type VirtualMachine from 'scratch-vm';

import { Deferred } from './deferred';
import { BroadcastReceiver, ThreadListener } from './listener';
import { Event, Log } from './log';
import { OutputHandler, ResultManager } from './output';
import { ProfileEventData } from './profiler';
import { proxiedRenderer, RendererMethods, unproxyRenderer } from './renderer';
import { EndAction } from './scheduler/end';
import { ScheduledEvent } from './scheduler/scheduled-event';
import { memoize } from './utils';

// A list of event names...
// These must be the same as in Scratch.
const SCRATCH_PROJECT_START = 'PROJECT_START';
const SCRATCH_PROJECT_RUN_STOP = 'PROJECT_RUN_STOP';
const SCRATCH_SAY_OR_THINK = 'SAY';
const SCRATCH_QUESTION = 'QUESTION';
const SCRATCH_ANSWER = 'ANSWER';
// Custom events we emit ourselves.
const STOPPED_THREAD = 'STOPPED_THREAD';
const BEFORE_HATS_START = 'BEFORE_HATS_START';
// Custom event for the debugger.
export const OPS = 'OPS_EXECUTED';

/**
 * @typedef {object} Acceleration
 * @property {number} factor - Main acceleration factor.
 * @property {number} [time] - Scratch waiting times.
 * @property {number} [event] - Scheduled events waiting time.
 */
interface Acceleration {
  factor: number;
  time?: number;
  event?: number;
}

interface VmMethods {
  step: Runtime['_step'];
  startHats: Runtime['startHats'];
  stopThreads: Runtime['_stopThread'];
}

interface EventHandles {
  scratchProjectStart: () => void;
  // eslint-disable-next-line
  scratchSayOrThink: (...args: any[]) => void;
  // eslint-disable-next-line
  scratchQuestion: (...args: any[]) => void;
  // eslint-disable-next-line
  scratchAnswer: (...args: any[]) => void;
  // eslint-disable-next-line
  scratchProjectRunStop: (...args: any[]) => void;
  threadStopped: (thread: Thread) => void;
  // eslint-disable-next-line
  beforeHatsStart: (...args: any[]) => void;
  // eslint-disable-next-line
  ops: (...args: any[]) => void;
}

type LogMode = 'judge' | 'debugger';

/**
 * Contains common information and parameters for the
 * judge. This is passed around in lieu of using globals.
 */
export class Context {
  readonly vm: VirtualMachine;
  numberOfRun: number;
  readonly newLog: Log;
  answers: string[];
  providedAnswers: string[];
  /**
   * Resolves once the simulation has ended.
   */
  simulationEnd: Deferred<string>;
  /**
   * The timeout for the actions.
   */
  actionTimeout: number;
  /**
   * The listeners for the threads.
   */
  threadListeners: ThreadListener[];
  broadcastListeners: BroadcastReceiver[];
  event: ScheduledEvent;
  groupedOutput: ResultManager;

  /**
   * The acceleration factor, used to speed up (or slow down)
   * execution in the VM.
   *
   * There is a limit on how much you can increase this, since
   * each step in the VM must still have time to run of course.
   */
  accelerationFactor: Acceleration;

  vmMethods?: VmMethods;
  eventHandles?: EventHandles;
  renderMethods?: RendererMethods;
  // eslint-disable-next-line @typescript-eslint/ban-types
  blockMethods?: Record<string, Function>;

  constructor(vm: VirtualMachine, log: Log, callback?: OutputHandler) {
    this.numberOfRun = 0;
    this.answers = [];
    this.providedAnswers = [];
    this.simulationEnd = new Deferred();
    this.actionTimeout = 5000;
    this.threadListeners = [];
    this.broadcastListeners = [];
    this.event = ScheduledEvent.create();
    this.groupedOutput = new ResultManager(callback);
    this.accelerationFactor = {
      factor: 1,
    };
    this.vm = vm;
    this.newLog = log;
  }

  /**
   * Get a current timestamp.
   * @return {number}
   * @deprecated Use the log instead.
   */
  timestamp(): number {
    return this.log.timestamp();
  }

  private interceptVmMethods(): void {
    if (this.vmMethods) {
      throw new Error('VM methods already intercepted');
    }

    const oldStepFunction = this.vm.runtime._step.bind(this.vm.runtime);
    this.vm.runtime._step = () => {
      const oldResult = oldStepFunction();
      this.vm.runtime._lastStepDoneThreads.forEach((t) =>
        this.vm.runtime.emit(STOPPED_THREAD, t),
      );
      return oldResult;
    };

    const oldThreadFunction = this.vm.runtime.sequencer.retireThread.bind(
      this.vm.runtime.sequencer,
    );
    this.vm.runtime.sequencer.retireThread = (thread: Thread): void => {
      this.vm.emit(STOPPED_THREAD, thread);
      oldThreadFunction(thread);
    };

    const oldHatFunction = this.vm.runtime.startHats.bind(this.vm.runtime);
    this.vm.runtime.startHats = (requestedHatOpcode, optMatchFields, optTarget) => {
      this.vm.runtime.emit(BEFORE_HATS_START, {
        requestedHatOpcode,
        optMatchFields,
        optTarget,
      });
      return oldHatFunction(requestedHatOpcode, optMatchFields, optTarget);
    };

    this.vmMethods = {
      step: oldStepFunction,
      startHats: oldHatFunction,
      stopThreads: oldThreadFunction,
    };
  }

  private restoreVmMethods(): void {
    if (!this.vmMethods) {
      console.log('VM methods not intercepted, doing nothing.');
      return;
    }
    this.vm.runtime._stopThread = this.vmMethods.stopThreads;
    this.vm.runtime.startHats = this.vmMethods.startHats;
    this.vm.runtime._step = this.vmMethods.step;
    this.vmMethods = undefined;
  }

  /**
   * Attach event handles to the VM.
   *
   * @param logMode - The mode in which logging should happen. When using
   *   the "judge" mode, we listen to various input events, but we don't listen
   *   to the custom "ops" event, which is only emitted by our forked VM.
   */
  private attachEventHandles(logMode: LogMode = 'judge'): void {
    if (this.eventHandles) {
      throw new Error('Event handles already attached');
    }

    this.eventHandles = {
      scratchProjectStart: () => {
        console.log(`${this.log.timestamp()}: run number: ${this.numberOfRun}`);
        this.numberOfRun++;
      },
      scratchSayOrThink: (target, type, text) => {
        // Only save it when something is actually being said.
        if (text !== '') {
          console.log(`${this.log.timestamp()}: say: ${text} with ${type}`);
          const event = new Event('say', {
            text: text,
            target: target,
            type: type,
            sprite: target.sprite.name,
          });
          event.previous = this.log.snap('event.say');
          event.next = event.previous;
          this.log.registerEvent(event);
        }
      },
      scratchQuestion: (question) => {
        if (question != null) {
          let x = this.providedAnswers.shift();
          if (x === undefined) {
            this.groupedOutput.appendMessage(
                'Er werd een vraag gesteld waarop geen antwoord voorzien is.',
            );
            this.groupedOutput.escalateStatus('wrong');
            x = undefined;
          }

          console.log(`${this.log.timestamp()}: input: ${x}`);

          const event = new Event('answer', {
            question: question,
            text: x,
          });
          event.previous = this.log.snap('event.answer');
          event.next = event.previous;
          this.log.registerEvent(event);

          this.vm.runtime.emit(SCRATCH_ANSWER, x);
        }
      },
      // The following is only used by the debugger
      scratchAnswer: (answer) => {
        const event = new Event('answer', {
          text: answer,
        });
        event.previous = this.log.snap('event.answer');
        event.next = event.previous;
        this.log.registerEvent(event);
      },
      scratchProjectRunStop: () => {
        for (const action of this.threadListeners) {
          if (action.active) {
            action.onStopped();
          }
        }
        console.log(`${this.log.timestamp()}: Ended run`);
      },
      threadStopped: (thread) => {
        for (const action of this.threadListeners) {
          if (action.active) {
            action.onThreadStopped(thread);
          }
        }
      },
      beforeHatsStart: (opts) => {
        if (opts.requestedHatOpcode === 'event_whenbroadcastreceived') {
          this.broadcastListeners
            .filter((l) => l.active)
            .forEach((l) =>
              l.update({
                matchFields: opts.optMatchFields,
                target: opts.optTarget,
              }),
            );
        }
      },
      ops: (ops) => {
        if (ops.length === 0) {
          return;
        }
        const block = ops[ops.length - 1]; // Only log the last outer block

        // @ts-ignore
        const isMonitored = this.vm.runtime.monitorBlocks.getBlock(block.id)?.isMonitored;
        if (isMonitored) {
          return;
        }

        const event = new Event('ops', {
          blockId: block.id,
        });
        event.previous = this.log.snap('event.ops');
        event.next = event.previous;
        this.log.registerEvent(event);
      },
    };

    if (logMode === 'judge') {
      console.log('Attaching event listeners for judge log mode...');
      this.vm.runtime.on(SCRATCH_PROJECT_START, this.eventHandles.scratchProjectStart);
      this.vm.runtime.on(SCRATCH_SAY_OR_THINK, this.eventHandles.scratchSayOrThink);
      this.vm.runtime.on(SCRATCH_QUESTION, this.eventHandles.scratchQuestion);
      this.vm.runtime.on(
        SCRATCH_PROJECT_RUN_STOP,
        this.eventHandles.scratchProjectRunStop,
      );
      this.vm.runtime.on(STOPPED_THREAD, this.eventHandles.threadStopped);
      this.vm.runtime.on(BEFORE_HATS_START, this.eventHandles.beforeHatsStart);
    }

    if (logMode === 'debugger') {
      console.log('Attaching event listeners for debugger log mode...');
      this.vm.runtime.on(OPS, this.eventHandles.ops);
      this.vm.runtime.on(SCRATCH_ANSWER, this.eventHandles.scratchAnswer);
    }
  }

  public setLogRange(start: number, end: number): void {
    this.log.setRange(start, end);
  }

  /**
   * Detach event handles from the VM.
   */
  private detachEventHandles(): void {
    if (!this.eventHandles) {
      console.log('No event handles found to detach, doing nothing.');
      return;
    }
    this.vm.runtime.off(SCRATCH_PROJECT_START, this.eventHandles.scratchProjectStart);
    this.vm.runtime.off(SCRATCH_SAY_OR_THINK, this.eventHandles.scratchSayOrThink);
    this.vm.runtime.off(SCRATCH_QUESTION, this.eventHandles.scratchQuestion);
    this.vm.runtime.off(
      SCRATCH_PROJECT_RUN_STOP,
      this.eventHandles.scratchProjectRunStop,
    );
    this.vm.runtime.off(STOPPED_THREAD, this.eventHandles.threadStopped);
    this.vm.runtime.off(BEFORE_HATS_START, this.eventHandles.beforeHatsStart);
    this.vm.runtime.off(OPS, this.eventHandles.ops);
    this.eventHandles = undefined;
  }

  /**
   * Create a profile and attach it to the VM.
   */
  private createProfiler(): void {
    this.vm.runtime.enableProfiling();
    const blockId = this.vm.runtime.profiler.idByName('blockFunction');
    this.vm.runtime.profiler.onFrame = (frame) => {
      if (frame.id === blockId) {
        this.log.snap('profiler.basic');
      }
    };
  }

  /** @internal */
  public createAdvancedProfiler(onlyThese?: string[]) {
    if (this.blockMethods) {
      throw new Error('Profiler already created');
    }

    console.log('Installing advanced block profiler...');
    // Attach the advanced profiler.
    this.blockMethods = {};
    // Allow use inside the nested function below.
    const log = this.log;
    for (const [opcode, blockFunction] of Object.entries(this.vm.runtime._primitives)) {
      this.blockMethods[opcode] = blockFunction;
      this.vm.runtime._primitives[opcode] = new Proxy(blockFunction, {
        apply: function (target, thisArg, argumentsList) {
          const vmTarget = argumentsList[1].target;
          const targetName = vmTarget.getName();
          // Only track sprites we care about if given.
          if (onlyThese === undefined || onlyThese.includes(targetName)) {
            const currentBlockId = argumentsList[1].thread.peekStack();
            // Only register block executions that exist; other blocks we don't care about.
            if (vmTarget.blocks.getBlock(currentBlockId)) {
              const data: ProfileEventData = {
                blockId: currentBlockId,
                target: targetName,
                block: memoize(() => {
                  const target = log.last.target(targetName);
                  return target.block(currentBlockId);
                }),
                node: memoize(() => {
                  const target = log.last.target(targetName);
                  return target.node(currentBlockId);
                }),
              };
              const event = new Event('block_execution', data);
              event.previous = log.last;
              event.next = event.previous;
              log.registerEvent(event);
            }
          }

          return target.apply(thisArg, argumentsList);
        },
      });
    }
  }

  /** @internal */
  public removeAdvancedProfiler() {
    if (!this.blockMethods) {
      console.log('No profiler found to remove, doing nothing.');
      return;
    }

    for (const [opcode, blockFunction] of Object.entries(this.blockMethods)) {
      this.vm.runtime._primitives[opcode] = blockFunction;
    }
  }

  private removeProfiler(): void {
    this.vm.runtime.disableProfiling();
  }

  private proxyRenderer(): void {
    if (this.renderMethods) {
      throw new Error('Renderer already proxied');
    }

    this.renderMethods = proxiedRenderer(this.log, this.vm.renderer);
  }

  private unproxyRenderer(): void {
    if (!this.renderMethods) {
      console.log('No renderer found to unproxy, doing nothing.');
      return;
    }
    unproxyRenderer(this.vm.renderer, this.renderMethods);
    this.renderMethods = undefined;
  }

  /**
   * Instrument the VM, based on the log mode.
   *
   * @param logMode
   */
  public instrumentVm(logMode: LogMode = 'judge'): void {
    this.interceptVmMethods();
    this.attachEventHandles(logMode);
    this.proxyRenderer();
    if (logMode === 'judge') {
      this.createProfiler();
    }
  }

  /**
   * Remove all instrumentations from the VM.
   * This should restore the VM to its original state.
   */
  public deinstrumentVm(): void {
    this.removeProfiler();
    this.unproxyRenderer();
    this.detachEventHandles();
    this.restoreVmMethods();
    this.removeAdvancedProfiler();
  }

  /**
   * Prepare the VM for execution for the judge.
   *
   * This will prepare the answers for questions (if applicable) and instrument
   * the VM to take the acceleration factor into account.
   */
  public runVm(): void {
    this.providedAnswers = this.answers.slice();

    // Optimisation.
    if (this.accelerationFactor.time !== 1) {
      // We need to instrument the VM.
      // Changing the events is not necessary; this
      // is handled by the event scheduler itself.

      // First, modify the step time.
      const currentStepInterval = (<typeof Runtime>this.vm!.runtime.constructor)
        .THREAD_STEP_INTERVAL;
      const newStepInterval = currentStepInterval / this.accelerationFactor.factor;

      Object.defineProperty(this.vm!.runtime.constructor, 'THREAD_STEP_INTERVAL', {
        value: newStepInterval,
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
   * @param opcode - The opcode to accelerate.
   * @param argument - The argument to accelerate.
   *
   * @private
   */
  acceleratePrimitive(opcode: string, argument = 'SECS'): void {
    const original = this.vm.runtime.getOpcodeFunction(opcode);
    const factor = this.accelerationFactor.time || this.accelerationFactor.factor;
    this.vm.runtime._primitives[opcode] = (
      originalArgs: Record<string, unknown>,
      util: unknown,
    ) => {
      // For safety, clone the arguments.
      const args = { ...originalArgs };
      args[argument] = <number>args[argument] / factor;
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
  accelerateTimer(): void {
    const factor = this.accelerationFactor.time || this.accelerationFactor.factor;
    const device = this.vm.runtime.ioDevices.clock;
    const original = device.projectTimer;

    device.projectTimer = () => {
      return original.call(device) * factor;
    };
  }

  /**
   * Accelerate a certain number. This is intended for events.
   *
   * @param number - The number to accelerate. All non-numbers are returned as is.
   */
  accelerateEvent<T>(number: number | T): number | T {
    const factor = this.accelerationFactor.event || this.accelerationFactor.factor;
    if (factor === 1 || typeof number !== 'number') {
      return number;
    }
    return number / factor;
  }

  terminate(): void {
    const action = new EndAction();
    action.execute(this, () => {});
  }

  get log(): Log {
    return this.newLog!;
  }
}
