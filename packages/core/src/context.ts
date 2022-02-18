import type VirtualMachine from 'scratch-vm';
import type Runtime from '@ftrprf/judge-scratch-vm-types/types/engine/runtime';

import { Deferred } from './deferred';
import { ScheduledEvent } from './scheduler/scheduled-event';
import { EndAction } from './scheduler/end';
import { BroadcastReceiver, ThreadListener } from './listener';
import { installAdvancedBlockProfiler, ProfileEventData } from './profiler';
import { GroupedResultManager, OutputHandler } from './output';
import { Event, NewLog } from './new-log';
import { assertType } from './utils';
import { Events } from './vm';

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

/**
 * Contains common information and parameters for the
 * judge. This is passed around in lieu of using globals.
 */
export class Context {
  readonly vm: VirtualMachine;
  numberOfRun: number;
  readonly newLog: NewLog;
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
  groupedOutput: GroupedResultManager;

  /** @deprecated */
  readonly submissionJson: Record<string, unknown>;
  /** @deprecated */
  readonly templateJson: Record<string, unknown>;

  /**
   * The acceleration factor, used to speed up (or slow down)
   * execution in the VM.
   *
   * There is a limit on how much you can increase this, since
   * each step in the VM must still have time to run of course.
   */
  accelerationFactor: Acceleration;

  constructor(
    vm: VirtualMachine,
    log: NewLog,
    templateJson: Record<string, unknown>,
    submissionJson: Record<string, unknown>,
    callback?: OutputHandler,
  ) {
    this.numberOfRun = 0;
    this.answers = [];
    this.providedAnswers = [];
    this.simulationEnd = new Deferred();
    this.actionTimeout = 5000;
    this.threadListeners = [];
    this.broadcastListeners = [];
    this.event = ScheduledEvent.create();
    this.groupedOutput = new GroupedResultManager(callback);
    this.accelerationFactor = {
      factor: 1,
    };
    this.vm = vm;
    this.newLog = log;
    this.submissionJson = submissionJson;
    this.templateJson = templateJson;
  }

  /**
   * Get a current timestamp.
   * @return {number}
   * @deprecated Use the log instead.
   */
  timestamp(): number {
    return this.log.timestamp();
  }

  private tempAdvancedProfiler = {
    advanced: undefined,
    at: 0,
  };

  /** @deprecated */
  get advancedProfiler(): unknown {
    if (
      this.tempAdvancedProfiler.advanced === undefined ||
      this.log.events.length > this.tempAdvancedProfiler.at
    ) {
      this.tempAdvancedProfiler = {
        // @ts-ignore
        advanced: {
          executions: this.log.events
            .filter((e) => e.type === 'block_execution')
            .map((e) => {
              assertType<ProfileEventData>(e.data);
              const block = e.previous
                .target(e.data.target as string)
                .block(e.data.blockId as string);
              return {
                timestamp: e.timestamp,
                opcode: block.opcode,
                args: {
                  mutation: block.mutation,
                },
                target: e.data.target,
              };
            }),
        },
        at: this.log.events.length,
      };
    }
    return this.tempAdvancedProfiler.advanced;
  }

  /**
   * Set up the event handles for a the vm.
   * @private
   */
  attachEventHandles(): void {
    this.vm!.runtime.on(Events.SCRATCH_PROJECT_START, () => {
      console.log(`${this.log.timestamp()}: run number: ${this.numberOfRun}`);
      this.numberOfRun++;
    });

    this.vm!.runtime.on(Events.SCRATCH_SAY_OR_THINK, (target, type, text) => {
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
    });

    this.vm!.runtime.on(Events.SCRATCH_QUESTION, (question) => {
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

        this.vm!.runtime.emit(Events.SCRATCH_ANSWER, x);
      }
    });

    this.vm!.runtime.on(Events.SCRATCH_PROJECT_RUN_STOP, () => {
      console.log(`${this.log.timestamp()}: Ended run`);
    });

    this.vm!.runtime.on(Events.DONE_THREADS_UPDATE, (threads) => {
      for (const thread of threads) {
        for (const action of this.threadListeners) {
          if (action.active) {
            action.update(thread);
          }
        }
      }
    });

    this.vm!.runtime.on(Events.BEFORE_HATS_START, (opts) => {
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
    });
  }

  /**
   * Create a profile and attach it to the VM.
   * @private
   */
  createProfiler(): void {
    this.vm!.runtime.enableProfiling();
    const blockId = this.vm!.runtime.profiler.idByName('blockFunction');
    this.vm!.runtime.profiler.onFrame = (frame) => {
      if (frame.id === blockId) {
        this.log.snap('profiler.basic');
      }
    };

    installAdvancedBlockProfiler(this.vm!, this.log!);
  }

  /**
   * Prepare the VM for execution. This will prepare the answers for
   * questions (if applicable) and instrument the VM to take the
   * acceleration factor into account.
   */
  prepareAndRunVm(): void {
    this.attachEventHandles();

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
    this.vm!.start();
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
    const original = this.vm!.runtime.getOpcodeFunction(opcode);
    const factor = this.accelerationFactor.time || this.accelerationFactor.factor;
    this.vm!.runtime._primitives[opcode] = (
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
    const device = this.vm!.runtime.ioDevices.clock;
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

  get log(): NewLog {
    return this.newLog!;
  }
}
