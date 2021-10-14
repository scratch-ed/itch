import type VirtualMachine from '@ftrprf/judge-scratch-vm-types/types/virtual-machine';
import { Event, NewLog } from './new-log';

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
        });
        event.previous = log.last;
        event.next = event.previous;
        log.registerEvent(event);
        return target.apply(thisArg, argumentsList);
      },
    });
  }
}
