import type Comment from '@ftrprf/judge-scratch-vm-types/types/engine/comment';
import type Variable from '@ftrprf/judge-scratch-vm-types/types/engine/variable';
import type RenderedTarget from '@ftrprf/judge-scratch-vm-types/types/sprites/rendered-target';
import type VirtualMachine from '@ftrprf/judge-scratch-vm-types/types/virtual-machine';
import { cloneDeep, isEqual, last } from 'lodash-es';
import { Line } from './lines';
import { RotationStyle } from './matcher/patterns';

import {
  blockFromSb3,
  Bounds,
  BubbleState,
  ScratchBlock,
  ScratchComment,
  ScratchCostume,
  ScratchSprite,
  ScratchStage,
  ScratchTarget,
  ScratchVariable,
  VariableType,
  VideoState,
} from './model';
import { ProfileEventData } from './profiler';
import { SavedRangeEventData } from './scheduler/callback';
import { ClickEventData } from './scheduler/click';
import { assertType, ensure } from './utils';

/**
 * Convert a scratch target from the VM to one we save in the log.
 *
 * @param target The target to save.
 * @param isStage If the target is the stage or not.
 * @param blocks Existing blocks.
 */
function vmTargetToScratchTarget(
  target: RenderedTarget,
  isStage: boolean,
  blocks: Array<ScratchBlock>,
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

  const internalBubbleState = target.getCustomState('Scratch.looks');
  let bubbleState: BubbleState | undefined;
  if (internalBubbleState) {
    bubbleState = {
      onSpriteRight: internalBubbleState.onSpriteRight,
      text: internalBubbleState.text.slice(),
      type: internalBubbleState.type.slice(),
    };
  }

  const clones: ScratchSprite[] = [];
  if (target.isOriginal) {
    for (const clone of target.sprite.clones) {
      if (!clone.isOriginal) {
        clones.push(<ScratchSprite>vmTargetToScratchTarget(clone, false, []));
      }
    }
  }

  const effects: { [x: string]: number } = cloneDeep(target.effects);

  if (isStage) {
    return new ScratchStage(
      target.id,
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
      target.id,
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
      clones,
      effects,
      target.getBounds() as Bounds,
      bubbleState,
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
   * @param blockId Optional originating blockID. TODO: move this to events?
   */
  constructor(
    readonly timestamp: number,
    readonly origin: string,
    readonly targets: ScratchTarget[],
    readonly blockId?: string,
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

  findSpriteById(id: string): ScratchSprite | undefined {
    return this.sprites.find((s) => s.id === id);
  }

  findTarget(name: string): ScratchTarget | undefined {
    return this.targets.find((t) => t.name === name);
  }

  spriteById(id: string): ScratchSprite {
    return ensure(this.findSpriteById(id));
  }

  sprite(name: string): ScratchSprite {
    return ensure(this.findSprite(name));
  }

  target(name: string): ScratchTarget {
    return ensure(this.findTarget(name));
  }

  /**
   * Check if two sprites were touching when the frame was captured.
   *
   * An exception will be thrown if the first sprite does not exist.
   *
   * @param first - The first sprite.
   * @param second - The second sprite.
   *
   * @return If they were touching or not.
   */
  areTouching(first: string, second: string): boolean {
    const firstSprite = this.sprite(first);
    const secondSprite = this.sprite(second);

    return firstSprite.touchesPosition({ x: secondSprite.x, y: secondSprite.y });
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
    const baseSprite = this.findTarget(target);
    const comparisonSprite = other.findTarget(target);

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
      return !isEqual(set1, set2);
    });
  }

  get time(): number {
    return this.timestamp;
  }
}

type EventData =
  | SavedRangeEventData
  | ProfileEventData
  | ClickEventData
  | Record<string, unknown>;

type EventTypes = 'block_execution' | 'key';

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

  constructor(readonly type: string | EventTypes, readonly data: EventData = {}) {}

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
  for (const [id, block] of Object.entries(target.blocks)) {
    blocks.push(blockFromSb3(id, block));
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
      target.id,
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
      target.id,
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
      [],
      {},
    );
  }
}

export function snapshotFromSb3(sb3Json: Record<string, unknown>): Snapshot {
  assertType<Record<string, unknown>[]>(sb3Json.targets);
  const targets = sb3Json.targets.map((t) => targetFromSb3(t, t.isStage as boolean));
  return new Snapshot(0, 'template', targets);
}

/**
 * Log render-related stuff.
 *
 * TODO: could we integrate with events instead?
 */
class RenderLog {
  lines: Line[] = [];
  color: unknown = null;
  points: unknown[] = [];
  responses: unknown[] = [];
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
export class Log {
  private readonly snapshotList: Snapshot[] = [];
  private readonly eventList: Event[] = [];
  private readonly startTime: number = Date.now();
  private readonly vm: VirtualMachine;
  public readonly renderer: RenderLog = new RenderLog();
  private templateSnapshot?: Snapshot;
  public started = false;

  constructor(vm: VirtualMachine) {
    this.vm = vm;
  }

  public reset(): void {
    this.snapshotList.length = 0;
    this.eventList.length = 0;
    this.templateSnapshot = undefined;
    this.renderer.lines.length = 0;
    this.renderer.color = null;
    this.renderer.points.length = 0;
    this.renderer.responses.length = 0;
  }

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
  public registerStartSnapshots(template: Snapshot, submission: Snapshot): void {
    this.registerSnapshot(submission);
    this.templateSnapshot = template;
  }

  /**
   * Register a snapshot into the log.
   */
  private registerSnapshot(snapshot: Snapshot): boolean {
    if (!this.started) {
      return false;
    }
    this.snapshotList.push(snapshot);
    return true;
  }

  /**
   * Create a new snapshot from the current state of the VM.
   *
   * @internal
   * @param origin Why the snapshot is being taken.
   * @param originBlockId Optional ID of block that triggered this snapshot.
   */
  snap(origin: string, originBlockId?: string): Snapshot {
    const stage = this.vm.runtime.getTargetForStage()!;
    const targets = this.vm.runtime.targets.map((t) => {
      return vmTargetToScratchTarget(
        t as RenderedTarget,
        t.id === stage.id,
        this.submission.target(t.getName()).blocks,
      );
    });

    const snapshot = new Snapshot(this.timestamp(), origin, targets, originBlockId);
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

  /**
   * Find a range of snapshots that were saved by the scheduler.
   *
   * @param name Name of the saved range.
   */
  savedRange(name: string): ReadonlyArray<Snapshot> {
    const event = this.events.find(
      (e) => e.type == 'savedRange' && (e.data as SavedRangeEventData).name === name,
    );
    if (!event) {
      throw new Error(`Could not find saved range event with name ${name}.`);
    }
    const startIndex = this.snapshots.indexOf(event.previous);
    const endIndex = this.snapshots.indexOf(event.next, startIndex);
    if (startIndex == -1 || endIndex == -1) {
      throw new Error(
        'Something went wrong while finding the event snapshots. This should be impossible.',
      );
    }
    return this.snapshots.slice(startIndex, endIndex);
  }
}
