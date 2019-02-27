const ScratchStorage = require('scratch-storage');
const VirtualMachine = require('scratch-vm');
const ScratchRender = require('scratch-render');
const AudioEngine = require('scratch-audio');
const ScratchSVGRenderer = require('scratch-svg-renderer');

const Scratch = window.Scratch = window.Scratch || {};

let executionTime;
let keyInput;
let mouseInput;
let numberOfRun = 0;

let logData = {index: 0, lines: [], color: null, points: [], responses: []};
let blocks = [];
let vmData;
let spritesLog = [];
let simulationChain = new ScratchSimulationEvent(() => {
}, 0);


class Future {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

Scratch.loaded = new Future();

function reset() {
  numberOfRun = 0;

  blocks = [];

  logData = {index: 0, lines: [], color: null, points: [], responses: []};
  spritesLog = [];

  simulationChain = new ScratchSimulationEvent(() => {
  }, 0);
}

export function loadFile(e, canvas) {
  reset();
  const reader = new FileReader();
  const thisFileInput = e.target;
  reader.onload = () => {
    init(reader.result, canvas);
  };
  reader.readAsArrayBuffer(thisFileInput.files[0]);
}

class Opcodes {
  constructor() {
    this.opcodes = {};
  }

  update(arg) {
    if (!this.opcodes[arg]) {
      this.opcodes[arg] = 0;
    }
    this.opcodes[arg]++;
  }

  end() {
    for (let arg in this.opcodes) {
      blocks.push({name: arg, executions: this.opcodes[arg]});
    }
    this.opcodes = {};
  }
}

/**
 * Init vm
 */
function init(file, canvas) {
  // Lots of global variables to make debugging easier
  // Instantiate the VM.
  const vm = new VirtualMachine();
  Scratch.vm = vm;

  vm.setTurboMode(true);
  vm.loadProject(file);

  console.log(vm);

  // Storage
  const storage = new ScratchStorage();
  /* global ScratchStorage */
  vm.attachStorage(storage);

  // Instantiate the renderer and connect it to the VM.
  // const canvas = document.getElementById('scratch-stage');
  const renderer = new makeProxiedRenderer(canvas, logData);
  Scratch.renderer = renderer;
  vm.attachRenderer(renderer);

  // AudioEngine
  const audioEngine = new AudioEngine();
  vm.attachAudioEngine(audioEngine);
  /* global ScratchSVGRenderer */
  vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
  vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());


  // VM event handlers
  vmHandleEvents(vm);

  // VM start
  vm.start();

  console.log("Finished loading");
  Scratch.loaded.resolve();

}

function vmHandleEvents(vm) {
  vm.runtime.on('PROJECT_START', () => {
    console.log(`${getTimeStamp()}: run number: ${numberOfRun}`);
    numberOfRun++;
  });

  vm.runtime.on('SAY', (target, type, text) => {
    console.log(`${getTimeStamp()}: say: ${text}`);
  });

  vm.runtime.on('QUESTION', (question) => {
    if (question != null) {
      let x = keyInput.shift();
      console.log(`${getTimeStamp()}: input: ${x}`);
      vm.runtime.emit("ANSWER", x);
    }
  });

  vm.runtime.on('PROJECT_RUN_STOP', () => {
    Scratch.opcodes.end();
    console.log(`${getTimeStamp()}: Ended run`);
    Scratch.ended.resolve();
  });
}

function createProfiler() {
  const vm = Scratch.vm;

  vm.runtime.enableProfiling();
  Scratch.profiler = vm.runtime.profiler;

  const stepId = Scratch.profiler.idByName('Runtime._step');
  const blockId = Scratch.profiler.idByName('blockFunction');

  Scratch.opcodes = new Opcodes();
  let firstState = true;
  Scratch.profiler.onFrame = ({id, selfTime, totalTime, arg}) => {
    if (firstState) {
      spritesLog.push({time:getTimeStamp(), block: 'START', sprites: JSON.parse(JSON.stringify(vm.runtime.targets))});
      firstState = false;
    }
    if (id === blockId) {
      Scratch.opcodes.update(arg);
      spritesLog.push({time:getTimeStamp(), block: arg, sprites: JSON.parse(JSON.stringify(vm.runtime.targets))});
    }
  };
}

function greenFlag() {

  //Start timer
  let date = new Date();
  startTimestamp = date.getTime();
  console.log("start timestamp:", startTimestamp);

  Scratch.vm.greenFlag();
  Scratch.ended = new Future();

  Scratch.simulationEnd = new Future();
  new Simulation(simulationChain).run();

}
