/**
 * @file This file contains the testplan API, i.e. most of the stuff
 * you use when writing a test plan. This API is inspired by Jest, so
 * if you are familiar, it should be fairly easy to pick up.
 *
 * ## Structure
 *
 * Itch provides 4 levels of groupings for tests:
 *
 * 1. `tab`
 * 2. `describe`
 * 3. `test`
 * 4. `expect`
 *
 * When starting from the bottom, we begin simple:
 *
 * 1. The `expect` is used to compare two values. It does not have a name itself,
 *    but you can provide a custom error message. This is only shown when the
 *    assertion fails. (The values are always passed as well).
 * 2. The `test` is the lowest level with a name. It groups a bunch of related
 *    `expect` statements.
 * 3. The `describe` directive groups a bunch of related tests, e.g. for one sprite.
 * 4. The `tab` groups a bunch of `describe` statements. These are mainly for UI purposes.
 */
import type VirtualMachine from 'itch-scratch-vm-types';
import type BlockUtility from 'itch-scratch-vm-types/types/engine/block-utility';

export class FatalErrorException extends Error {}

/**
 * EXPERIMENTAL!
 *
 * Intercepts wait blocks in procedure definitions in the given sprite for the
 * given amount and ignores them.
 *
 * @param {VirtualMachine} vm
 * @param {string} sprite
 */
export function ignoreWaitInProcedureFor(vm: VirtualMachine, sprite: string): void {
  const original = vm.runtime._primitives.control_wait;
  vm.runtime._primitives.control_wait = (args: unknown, util: BlockUtility) => {
    // Big hack to ignore wait in movement steps.
    if (util.thread!.target?.getName() === sprite) {
      const glowId = util.thread!.blockGlowInFrame;
      if (glowId) {
        let current = util.thread!.blockContainer.getBlock(glowId);
        while (current?.parent !== null) {
          current = util.thread!.blockContainer.getBlock(current.parent);
        }
        if (current?.opcode === 'procedures_definition') {
          console.log(`Skipping ... ${current?.opcode}`);
          return;
        }
      }
    }

    original(args, util);
  };
}

interface Range {
  min: number;
  max: number;
}

export function asRange(range: number | Range): Range {
  if (typeof range === 'number') {
    return { min: range, max: range };
  } else {
    return range;
  }
}
