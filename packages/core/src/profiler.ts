import type VirtualMachine from '@ftrprf/judge-scratch-vm-types/types/virtual-machine';
import { Node } from './blocks';
import { Event, Log } from './log';
import { ScratchBlock } from './model';
import { memoize } from './utils';

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
   * Get the executed block as an instance of a `ScratchBlock`.
   * This method is expensive, so only use it if necessary.
   * The method is memoized, so calling it multiple times is no problem.
   */
  block(): ScratchBlock;

  /**
   * Get the executed block as an instance of a `Node`.
   * This allows for easy matching against blocks.
   * This method is expensive, so only use it if necessary.
   * The method is memoized, so calling it multiple times is no problem.
   */
  node(): Node;
}

/**
 * Install the advanced block profiler into the VM.
 *
 * This will save each executed block. Since this is executed a lot,
 * no new snapshots are taken; instead the previous one is linked.
 */
export function installAdvancedBlockProfiler(vm: VirtualMachine, log: Log): void {
  console.log('Installing advanced block profiler...');
  // Attach the advanced profiler.
  for (const [opcode, blockFunction] of Object.entries(vm.runtime._primitives)) {
    vm.runtime._primitives[opcode] = new Proxy(blockFunction, {
      apply: function (target, thisArg, argumentsList) {
        const vmTarget = argumentsList[1].target;
        const targetName = vmTarget.getName();
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
        return target.apply(thisArg, argumentsList);
      },
    });
  }
}
