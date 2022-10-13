import VirtualMachine from 'scratch-vm';
import ScratchStorage from 'scratch-storage';
import AudioEngine from 'scratch-audio';
import ScratchSVGRenderer from 'scratch-svg-renderer';
import ScratchRender from 'scratch-render';
import { Log, Snapshot, snapshotFromSb3 } from './log';
import { OutputHandler } from './output';
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
  // Custom event for the debugger.
  OPS: 'OPS_EXECUTED',
};

/**
 * Create a context with an existing virtual machine.
 *
 * This implies that project loading does not need to happen, so this function
 * won't do that.
 */
export async function createContextWithVm(
  vm: VirtualMachine,
  callback?: OutputHandler,
): Promise<Context> {
  const log = new Log(vm);
  return new Context(vm, log, callback);
}

export function snapshotFromVm(vm: VirtualMachine): Snapshot {
  const data: Record<string, unknown> = JSON.parse(vm.toJSON());
  return snapshotFromSb3(data);
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

  // Disable turbo mode by default.
  vm.setTurboMode(false);

  // Initialize the various components of the VM.
  vm.attachStorage(new ScratchStorage());
  vm.attachAudioEngine(new AudioEngine());
  vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
  vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());
  vm.attachRenderer(new ScratchRender(config.canvas));

  const context = await createContextWithVm(vm, config.callback);

  // First, load the template project and save the JSON.
  await vm.loadProject(config.template);
  const template = snapshotFromVm(vm);

  // Second, load the submission and also save the JSON.
  await vm.clear();
  await vm.loadProject(config.submission);
  const submission = snapshotFromVm(vm);

  // Instrument the VM after the project has been loaded.
  // This means extensions will be added already.
  context.instrumentVm();

  // The log may start.
  context.log.started = true;

  // Register the two snapshots in the log.
  context.log.registerStartSnapshots(template, submission);

  return context;
}
