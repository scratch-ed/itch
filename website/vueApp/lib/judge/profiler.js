const ScratchStorage = require('scratch-storage');
const VirtualMachine = require('scratch-vm');
const ScratchRender = require('scratch-render');
const AudioEngine = require('scratch-audio');
const ScratchSVGRenderer = require('scratch-svg-renderer');

const Scratch = window.Scratch = window.Scratch || {};

let executionTime;
let keyInput;
let mouseInput;
let simulation;
let numberOfRun = 0;
let startTimestamp;
let timeStamp;

var logData = {index: 0, lines: [], color: null, points: [], responses: []};
var blocks = [];
var vmData;
var spritesLog = [];
let events = [];
let simulationChain = new ScratchSimulationEvent(() => {
}, 0);


//todo: in library steken
class Future {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

Scratch.loaded = new Future();

export function loadFile(e, canvas) {
  const reader = new FileReader();
  const thisFileInput = e.target;
  reader.onload = () => {
    init(reader.result, canvas);
  };
  reader.readAsArrayBuffer(thisFileInput.files[0]);
}

function getTimeStamp() {
  let date = new Date();
  return date.getTime() - startTimestamp;
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

  //Start timer
  let date = new Date();
  startTimestamp = date.getTime();
  console.log("start timestamp:", startTimestamp); //TODO replace this with init event

  // Storage
  const storage = new ScratchStorage();
  /* global ScratchStorage */
  vm.attachStorage(storage);

  // Instantiate the renderer and connect it to the VM.
  // const canvas = document.getElementById('scratch-stage');
  const renderer = new makeProxiedRenderer(canvas, logData, startTimestamp);
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
    //Scratch.opcodes.end();
    console.log(`${getTimeStamp()}: Ended run`);

    //vmData = JSON.parse(JSON.stringify(vm));

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
      spritesLog.push({block: 'START', sprites: JSON.parse(JSON.stringify(vm.runtime.targets))});
      firstState = false;
    }
    if (id === blockId) {
      console.log(`${getTimeStamp()}: ${arg}`);
      Scratch.opcodes.update(arg);
      spritesLog.push({block: arg, sprites: JSON.parse(JSON.stringify(vm.runtime.targets))});
    }
  };
}

function greenFlag() {
  //reset logbook
  /*logData = {lines:[], color:null, points:[], responses:[]};
  blocks = [];
  spritesLog = [];
  events = [];*/

  Scratch.vm.greenFlag();
  Scratch.ended = new Future();

  Scratch.simulationEnd = new Future();

  simulation = new Simulation(simulationChain);

  console.log(simulation);
  simulation.run();

}

function clickSprite(sprite) {
  Scratch.vm.runtime.startHats('event_whenthisspriteclicked', null, sprite);
}



