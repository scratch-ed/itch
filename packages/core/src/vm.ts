import VirtualMachine from 'scratch-vm';
import ScratchStorage from 'scratch-storage';
import AudioEngine from 'scratch-audio';
import ScratchSVGRenderer from 'scratch-svg-renderer';
import { Log, snapshotFromSb3 } from './log';
import { makeProxiedRenderer } from './renderer';
import { Context } from './context';
import { EvalConfig } from './evaluation';

export const Events: Record<string, string> = {
  SCRATCH_PROJECT_START: 'PROJECT_START',
  SCRATCH_PROJECT_RUN_STOP: 'PROJECT_RUN_STOP',
  SCRATCH_SAY_OR_THINK: 'SAY',
  SCRATCH_QUESTION: 'QUESTION',
  SCRATCH_ANSWER: 'ANSWER',
  // Custom events,
  DONE_THREADS_UPDATE: 'DONE_THREADS_UPDATE',
  BEFORE_HATS_START: 'BEFORE_HATS_START',
};

/**
 * Wrap the stepper function.
 *
 * @param {VirtualMachine} vm
 */
function wrapStep(vm: VirtualMachine) {
  const oldFunction = vm.runtime._step.bind(vm.runtime);

  // let time = Date.now();
  vm.runtime._step = () => {
    const oldResult = oldFunction();
    if (vm.runtime._lastStepDoneThreads.length > 0) {
      vm.runtime.emit(Events.DONE_THREADS_UPDATE, vm.runtime._lastStepDoneThreads);
    }
    return oldResult;
  };
}

/**
 * Wrap the start hats function to emit an event when this happens.
 * @param {VirtualMachine} vm
 */
function wrapStartHats(vm: VirtualMachine) {
  const oldFunction = vm.runtime.startHats.bind(vm.runtime);

  vm.runtime.startHats = (requestedHatOpcode, optMatchFields, optTarget) => {
    vm.runtime.emit(Events.BEFORE_HATS_START, {
      requestedHatOpcode,
      optMatchFields,
      optTarget,
    });
    return oldFunction(requestedHatOpcode, optMatchFields, optTarget);
  };
}

/**
 * This will initiate the context for a given project.
 *
 * While the VM should be ready for running, the VM will not be
 * instrumented yet, so it is not ready for the judge itself.
 *
 * The returned log is initialized with one snapshot; after the VM has been
 * loaded. This is the start snapshot.
 *
 * If the context is already initialized, it will be reset.
 * The returned snapshot is the snapshot taken after the project
 * has been loaded. This can be used to save snapshots.
 *
 * @param config The config to use.
 */
export async function createContext(config: EvalConfig): Promise<Context> {
  const vm = new VirtualMachine();
  const log = new Log(vm);

  // Disable turbo mode by default.
  vm.setTurboMode(false);

  // Initialize the various components of the VM.
  vm.attachStorage(new ScratchStorage());
  vm.attachAudioEngine(new AudioEngine());
  vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
  vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());

  // Set up our renderer. We inject a proxy, to be able to intercept various
  // interactions with the renderer.
  const renderer = makeProxiedRenderer(log, config.canvas);
  vm.attachRenderer(renderer);

  // Wrap some function to intercept even more data.
  wrapStep(vm);
  wrapStartHats(vm);

  // First, load the template project and save the JSON.
  await vm.loadProject(config.template);
  const templateData: Record<string, unknown> = JSON.parse(vm.toJSON());

  // Second, load the submission and also save the JSON.
  await vm.clear();
  await vm.loadProject(config.submission);
  const submissionData: Record<string, unknown> = JSON.parse(vm.toJSON());

  // The log may start.
  log.started = true;

  // Register the two snapshots in the log.
  const templateSnapshot = snapshotFromSb3(templateData);
  const submissionSnapshot = snapshotFromSb3(submissionData);
  log.registerStartSnapshots(templateSnapshot, submissionSnapshot);

  return new Context(vm, log, templateData, submissionData, config.callback);
}
