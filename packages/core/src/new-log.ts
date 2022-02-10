import type Variable from '@ftrprf/judge-scratch-vm-types/types/engine/variable';
import type Comment from '@ftrprf/judge-scratch-vm-types/types/engine/comment';
import type VirtualMachine from '@ftrprf/judge-scratch-vm-types/types/virtual-machine';
import type RenderedTarget from '@ftrprf/judge-scratch-vm-types/types/sprites/rendered-target';

import {
  Bounds,
  RotationStyle,
  ScratchBlock,
  ScratchComment,
  ScratchCostume,
  ScratchMutation,
  ScratchSprite,
  ScratchStage,
  ScratchTarget,
  ScratchVariable,
  VariableType,
  VideoState,
} from './model';
import { assertType, ensure } from './utils';
import { last, isEqual } from 'lodash-es';
import { LogRenderer } from './log';
import { ProfileEventData } from './profiler';
import { ClickEventData } from './scheduler/click';

/**
 * A lazy wrapper around a scratch block from the VM.
 *
 * This wrapper is necessary to keep the VM running fast;
 * converting all blocks to our structure up front is too
 * much work.
 *
 * TODO: is this still needed with the new log?
 */
class LazyScratchBlock implements ScratchBlock {
  constructor(readonly id: string, private readonly block: Record<string, unknown>) {}

  get fields(): Record<string, Record<string, unknown>> {
    return (this.block.fields || {}) as Record<string, Record<string, unknown>>;
  }

  get inputs(): Record<string, Record<string, unknown>> {
    const inputs: Record<string, Record<string, unknown>> = {};
    for (const input in this.block.inputs as Record<string, Record<string, unknown>>) {
      // Ignore blocks prefixed with branch prefix.
      if (!input.startsWith('SUBSTACK')) {
        inputs[input] = (this.block.inputs as Record<string, Record<string, unknown>>)[
          input
        ];
      }
    }
    return inputs;
  }

  get mutation(): ScratchMutation {
    return this.block.mutation as ScratchMutation;
  }

  get next(): string | undefined {
    return (this.block.next as string) ?? undefined;
  }

  get parent(): string | undefined {
    return (this.block.parent as string) ?? undefined;
  }

  get opcode(): string {
    return this.block.opcode as string;
  }

  get shadow(): boolean {
    return this.block.shadow as boolean;
  }

  get topLevel(): boolean {
    return this.block.topLevel as boolean;
  }

  get x(): number | undefined {
    return (this.block.x as number) ?? undefined;
  }

  get y(): number | undefined {
    return (this.block.y as number) ?? undefined;
  }
}

function vmTargetToScratchTarget(
  target: RenderedTarget,
  isStage: boolean,
): ScratchTarget {
  const variables: ScratchVariable[] = [];
  for (const id in target.variables) {
    const variable: Variable = target.variables[id];
    let value = variable.value;
    if (Array.isArray(value)) {
      value = value.slice();
    }
    variables.push(
      new ScratchVariable(id, variable.name, variable.type as VariableType, value),
    );
  }
  const blocks: ScratchBlock[] = [];
  for (const id in target.blocks._blocks) {
    const block = target.blocks.getBlock(id) as Record<string, unknown>;
    blocks.push(new LazyScratchBlock(id, block));
  }

  const comments = [];
  for (const id in target.comments) {
    const comment: Comment = target.comments[id];
    comments.push(
      new ScratchComment(
        id,
        comment.blockId,
        comment.x,
        comment.y,
        comment.height,
        comment.width,
        comment.minimized,
        comment.text,
      ),
    );
  }

  const costumes = [];
  for (const costume of target.getCostumes()) {
    costumes.push(costume as ScratchCostume);
  }

  if (isStage) {
    return new ScratchStage(
      target.getName(),
      variables,
      blocks,
      comments,
      target.currentCostume,
      costumes,
      target.volume,
      target.getLayerOrder(),
      target.tempo,
      target.videoTransparency,
      target.videoState as VideoState,
    );
  } else {
    return new ScratchSprite(
      target.getName(),
      variables,
      blocks,
      comments,
      target.currentCostume,
      costumes,
      target.volume,
      target.getLayerOrder(),
      target.visible,
      target.x,
      target.y,
      target.size,
      target.direction,
      target.draggable,
      target.rotationStyle as RotationStyle,
      target.getBounds() as Bounds,
    );
  }
}

/**
 * The state of the VM at a certain point in time.
 *
 * The snapshot consists of all the current sprites' state when the snapshot
 * was made. By default the amount of collected information is limited due to
 * performance reasons. In the future we might enable "expensive" snapshotting
 * mode, which will contain more information.
 */
export class Snapshot {
  /**
   *
   * @param timestamp When the snapshot was taken.
   * @param origin Why it was taken. You can use anything you want.
   * @param targets The actual data that was captured.
   */
  constructor(
    readonly timestamp: number,
    readonly origin: string,
    readonly targets: ScratchTarget[],
  ) {}

  get sprites(): ScratchSprite[] {
    return this.targets.filter((t) => t instanceof ScratchSprite) as ScratchSprite[];
  }

  get stage(): ScratchStage {
    return this.targets.find((t) => t instanceof ScratchStage) as ScratchStage;
  }

  findSprite(name: string): ScratchSprite | undefined {
    return this.sprites.find((s) => s.name === name);
  }

  findTarget(name: string): ScratchTarget | undefined {
    return this.targets.find((t) => t.name === name);
  }

  sprite(name: string): ScratchSprite {
    return ensure(this.findSprite(name));
  }

  target(name: string): ScratchTarget {
    return ensure(this.findTarget(name));
  }

  /** @deprecated */
  getSprite(name: string): ScratchSprite | null {
    return this.findSprite(name) || null;
  }

  /** @deprecated */
  getSpriteOr(name: string): ScratchTarget {
    return this.target(name);
  }

  /**
   * Check if a target has changed between this snapshot and another snapshot,
   * as defined by the predicate. This allows for every flexible checks.
   *
   * The function handles cases where sprites are missing:
   * - If missing in both, returns false.
   * - If missing in one, but not the other, returns true.
   * - Else pass to the predicate.
   *
   * The default predicate checks the target itself, but not it's blocks.
   *
   * @param other - Snapshot to compare to.
   * @param target - Name of the target.
   * @param predicate - Return true if the target has changed.
   *
   * @return True if the target satisfies the change predicate.
   */
  hasChangedTarget(
    other: Snapshot,
    target: string,
    predicate = (s1: ScratchTarget, s2: ScratchTarget) =>
      !isEqual(s1.comparableObject(), s2.comparableObject()),
  ): boolean {
    const baseSprite = this.target(target);
    const comparisonSprite = other.target(target);

    if (baseSprite === undefined && comparisonSprite === undefined) {
      return false;
    }

    if (baseSprite === undefined || comparisonSprite === undefined) {
      return true;
    }

    return predicate(baseSprite, comparisonSprite);
  }

  /**
   * Check if the blocks of a target have changed compared to another snapshot.
   *
   * @param other - The other snapshot to compare to.
   * @param target - The name of the target to check.
   */
  hasChangedBlocks(other: Snapshot, target: string): boolean {
    return this.hasChangedTarget(other, target, (s1, s2) => {
      const set1 = s1.blockTree();
      const set2 = s2.blockTree();
      // if (!isEqual(set1, set2)) {
      //   const d = difference(set1, set2);
      //   const t_a = Array.from(set1).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1);
      //   const s_a = Array.from(set2).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1);
      //   for (let i = 0; i < t_a.length; i++) {
      //     if (!isEqual(t_a[i], s_a[i])) {
      //       const dd = difference(t_a[i], s_a[i]);
      //       debugger;
      //     }
      //   }
      //   console.log(d);
      // }
      return !isEqual(set1, set2);
    });
  }

  get time(): number {
    return this.timestamp;
  }
}

type EventData = ProfileEventData | ClickEventData | Record<string, unknown>;

/**
 * An event is a high-level event in the VM.
 *
 * The event has a link to a snapshot before and after the event. Some events
 * represent an instance, in which case the "next" snapshot is the same as the
 * "previous" snapshot. All snapshots are also in the Log's snapshot timeline;
 * the main function of events is to capture more data, or be able to find
 * specific snapshots.
 */
export class Event {
  private previousSnapshot?: Snapshot;
  private nextSnapshot?: Snapshot;

  constructor(readonly type: string, readonly data: EventData = {}) {}

  get previous(): Snapshot {
    return ensure(this.previousSnapshot, 'The previous snapshot is not available yet.');
  }

  set previous(snap: Snapshot) {
    this.previousSnapshot = snap;
  }

  get next(): Snapshot {
    return ensure(this.nextSnapshot, 'The next snapshot is not available yet.');
  }

  set next(snap: Snapshot) {
    this.nextSnapshot = snap;
  }

  hasNext(): boolean {
    return this.nextSnapshot !== undefined;
  }

  // eslint-disable-next-line accessor-pairs
  set snapshot(snap: Snapshot) {
    this.next = snap;
    this.previous = snap;
  }

  get timestamp(): number {
    return this.previous.timestamp;
  }

  /** @deprecated */
  get time(): number {
    return this.timestamp;
  }

  /** @deprecated */
  get nextFrame(): Snapshot {
    return this.next;
  }
}

function targetFromSb3(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: Record<string, any>,
  isStage: boolean,
): ScratchTarget {
  const variables: ScratchVariable[] = [];
  assertType<Record<string, unknown[]>>(target.variables);
  for (const id in target.variables) {
    const variable = target.variables[id];
    variables.push(new ScratchVariable(id, variable[0] as string, '', variable[1]));
  }
  // Includes lists as variables
  assertType<Record<string, unknown[]>>(target.lists);
  for (const id in target.lists) {
    const list = target.lists[id];
    variables.push(new ScratchVariable(id, list[0] as string, 'list', list[1]));
  }
  // Includes broadcasts as variables
  assertType<Record<string, string>>(target.broadcasts);
  for (const id in target.broadcasts) {
    const broadcast = target.broadcasts[id];
    variables.push(new ScratchVariable(id, broadcast, 'broadcast_msg', broadcast));
  }
  assertType<Record<string, Record<string, unknown>>>(target.blocks);
  const blocks: ScratchBlock[] = [];
  for (const id in target.blocks._blocks) {
    // @ts-ignore
    const block = target.blocks.getBlock(id) as Record<string, unknown>;
    blocks.push(new LazyScratchBlock(id, block));
  }

  assertType<Record<string, Comment>>(target.comments);
  const comments = [];
  for (const id in target.comments) {
    const comment: Comment = target.comments[id];
    comments.push(
      new ScratchComment(
        id,
        comment.blockId,
        comment.x,
        comment.y,
        comment.height,
        comment.width,
        comment.minimized,
        comment.text,
      ),
    );
  }

  assertType<ScratchCostume[]>(target.costumes);
  const costumes = [];
  for (const costume of target.costumes) {
    costumes.push(costume);
  }

  if (isStage) {
    return new ScratchStage(
      target.name,
      variables,
      blocks,
      comments,
      target.currentCostume,
      costumes,
      target.volume,
      target.layerOrder,
      target.tempo,
      target.videoTransparency,
      target.videoState as VideoState,
    );
  } else {
    return new ScratchSprite(
      target.name,
      variables,
      blocks,
      comments,
      target.currentCostume,
      costumes,
      target.volume,
      target.layerOrder,
      target.visible,
      target.x,
      target.y,
      target.size,
      target.direction,
      target.draggable,
      target.rotationStyle as RotationStyle,
    );
  }
}

export function snapshotFromSb3(sb3Json: Record<string, unknown>): Snapshot {
  assertType<Record<string, unknown>[]>(sb3Json.targets);
  const targets = sb3Json.targets.map((t) => targetFromSb3(t, t.isStage as boolean));
  return new Snapshot(0, 'template', targets);
}

/**
 * The log contains a timeline of snapshots and events.
 *
 * ## Snapshots
 *
 * Snapshots are either taken automatically when interesting events happen, or
 * manually during the execution phase of the test plan. There are two special
 * snapshots: the ones from the pre-execution phase. This includes one snapshot
 * of the solution, and one snapshot of the template.
 *
 * All snapshots, except the one from the template, are put into the snapshot
 * timeline, accessible via `snapshots`.
 *
 * ## Events
 *
 * An event is an interesting thing to happen during the execution, and are
 * useful to find specific snapshots. The snapshots linked from the events are
 * also included in the snapshot timeline.
 *
 * See the docs on the Snapshot and Event classes for more technical
 * information.
 */
export class NewLog {
  private readonly snapshotList: Snapshot[] = [];
  private readonly eventList: Event[] = [];
  private readonly startTime: number = Date.now();
  private readonly vm: VirtualMachine;
  private templateSnapshot?: Snapshot;
  public started = false;

  constructor(vm: VirtualMachine) {
    this.vm = vm;
  }

  /** @deprecated */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addEvent(): void {}

  /** @deprecated */
  get sprites(): Snapshot {
    return this.last;
  }

  // TODO: temp
  renderer: LogRenderer = new LogRenderer();

  /**
   * A read-only list of all snapshots. This includes the pre-execution
   * snapshot of the submission, but not of the template of course.
   */
  get snapshots(): ReadonlyArray<Snapshot> {
    return this.snapshotList;
  }

  get last(): Snapshot {
    return last(this.snapshotList)!;
  }

  /**
   * @deprecated
   */
  get current(): Snapshot {
    return this.last;
  }

  /**
   * A read-only list of all events. The snapshots linked in the events are also
   * in the snapshot timeline.
   */
  get events(): ReadonlyArray<Event> {
    // Temporarily add compatability events.
    // @ts-ignore
    this.eventList.list = this.eventList;
    return this.eventList;
  }

  /**
   * Get the submission's snapshot.
   */
  get submission(): Snapshot {
    return this.snapshots[0];
  }

  /**
   * Get the template's snapshot.
   */
  get template(): Snapshot {
    return ensure(this.templateSnapshot);
  }

  /**
   * Registers the initial snapshots in the log.
   *
   * @internal
   * @param template The snapshot of the template file.
   * @param submission The snapshot of the submission file.
   */
  registerStartSnapshots(template: Snapshot, submission: Snapshot): void {
    this.registerSnapshot(submission);
    this.templateSnapshot = template;
  }

  /**
   * Register a snapshot into the log.
   */
  private registerSnapshot(snapshot: Snapshot): void {
    if (!this.started) {
      return;
    }
    this.snapshotList.push(snapshot);
  }

  /**
   * Create a new snapshot from the current state of the VM.
   *
   * @internal
   * @param origin Why the snapshot is being taken.
   */
  snap(origin: string): Snapshot {
    const stage = this.vm.runtime.getTargetForStage()!;
    const targets = this.vm.runtime.targets.map((t) => {
      return vmTargetToScratchTarget(t as RenderedTarget, t.id === stage.id);
    });

    const snapshot = new Snapshot(this.timestamp(), origin, targets);
    this.registerSnapshot(snapshot);
    return snapshot;
  }

  /**
   * Mint a new timestamp.
   */
  timestamp(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Register an event in the log.
   *
   * @internal
   */
  registerEvent(event: Event): void {
    if (!this.started) {
      return;
    }
    this.eventList.push(event);
  }

  get frames(): ReadonlyArray<Snapshot> {
    return this.snapshots;
  }
}
