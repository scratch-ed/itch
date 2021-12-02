import type VirtualMachine from '@ftrprf/judge-scratch-vm-types/types/virtual-machine';
import { Event, NewLog } from './new-log';
import { ScratchBlock } from './model';

export interface ProfileEventData {
  /**
   * The ID of the block that executed.
   */
  readonly blockId: string;
  /**
   * The name of the target that executed the block.
   */
  readonly target: string;
  /**
   * Shortcut to get the actual block.
   */
  block(): ScratchBlock;
}

/**
 * Install the advanced block profiler into the VM.
 *
 * This will save each executed block. Since this is executed a lot,
 * no new snapshots are taken; instead the previous one is linked.
 */
export function installAdvancedBlockProfiler(vm: VirtualMachine, log: NewLog): void {
  console.log('Installing advanced block profiler...');
  // Attach the advanced profiler.
  for (const [opcode, blockFunction] of Object.entries(vm.runtime._primitives)) {
    vm.runtime._primitives[opcode] = new Proxy(blockFunction, {
      apply: function (target, thisArg, argumentsList) {
        const targetId = argumentsList[1].target.getName();
        const currentBlockId = argumentsList[1].thread.peekStack();
        const event = new Event('block_execution', {
          blockId: currentBlockId,
          target: targetId,
          block: () => {
            const target = log.last.target(targetId);
            return target.block(currentBlockId);
          },
        } as ProfileEventData);
        event.previous = log.last;
        event.next = event.previous;
        log.registerEvent(event);
        return target.apply(thisArg, argumentsList);
      },
    });
  }
}
