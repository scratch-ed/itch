/* eslint-disable @typescript-eslint/ban-types */
// Various types for all external stuff.

// For now, use wildcard until everything is converted.
declare module 'scratch-vm' {
  // We have the types, so export those.
  import VirtualMachine from '@itch-types/scratch-vm';
  export default VirtualMachine;
}

declare module 'scratch-render' {
  export default class ScratchRender {
    constructor(canvas: HTMLCanvasElement);
    penLine: Function;
    penPoint: Function;
    penClear: Function;
    createTextSkin: Function;
    updateTextSkin: Function;
    destroySkin: Function;
  }
}

declare module 'scratch-audio';
declare module 'scratch-svg-renderer';
declare module 'scratch-storage';
