const Scratch = window.Scratch = window.Scratch || {};
var executionTime;
var keyInput;
var mouseInput;
let numberOfRun = 0;

var logData = {index:0, lines:[], color:null, points:[], responses:[]};
var blocks = [];
var vmData;
var sprites;
var spritesLog = [];

var profilerRun;

/**
 * When a new file is loaded by calling chromeless.setFile(fileName), the project gets initialized.
 */
document.getElementById('file').addEventListener('change', e => {
    const reader = new FileReader();
    const thisFileInput = e.target;
    reader.onload = () => {
        init(reader.result);
    };
    reader.readAsArrayBuffer(thisFileInput.files[0]);
});


/**
 * Init vm
 */
const init = function (file) {
    // Lots of global variables to make debugging easier
    // Instantiate the VM.
    const vm = new window.VirtualMachine();
    Scratch.vm = vm;

    vm.setTurboMode(true);
    vm.loadProject(file);

    const storage = new ScratchStorage(); /* global ScratchStorage */
    vm.attachStorage(storage);

    // Instantiate the renderer and connect it to the VM.
    const canvas = document.getElementById('scratch-stage');
    const renderer = new window.makeProxiedRenderer(canvas, logData);
    Scratch.renderer = renderer;
    vm.attachRenderer(renderer);
    const audioEngine = new window.AudioEngine();
    vm.attachAudioEngine(audioEngine);
    /* global ScratchSVGRenderer */
    vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
    vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());

    console.log("Finished loading");
    const div = document.createElement('div');
    div.id='loaded';
    document.body.appendChild(div);

    vm.start();
};

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
        console.log(this.opcodes);
        for (let arg in this.opcodes) {
            blocks.push({name:arg, executions:this.opcodes[arg]});
        }
    }
}

function createProfiler() {
    const vm = Scratch.vm;

    vm.runtime.enableProfiling();
    const profiler = vm.runtime.profiler;
    Scratch.profiler = profiler;
    vm.runtime.profiler = null;

    const stepId = profiler.idByName('Runtime._step');
    const blockId = profiler.idByName('blockFunction');

    Scratch.opcodes = new Opcodes();
    let firstState = true;
    profiler.onFrame = ({id, selfTime, totalTime, arg}) => {
        if (firstState) {
            spritesLog.push({block:'START', sprites:JSON.parse(JSON.stringify(vm.runtime.targets))});
            firstState = false;
        }
        if (id === blockId) {
            Scratch.opcodes.update(arg);
            spritesLog.push({block:arg, sprites:JSON.parse(JSON.stringify(vm.runtime.targets))});
            if (arg === 'sensing_askandwait' || arg === 'event_whenkeypressed' || arg === 'sensing_keypressed') {
                // Enters the next value of the keyInput list as answer
                vm.runtime.emit("ANSWER", keyInput.shift());
            }
        }
    };
}

function greenFlag(){
    console.log("clickGreenFlag()");

    const vm = Scratch.vm;

    setTimeout(() => {
        vm.greenFlag();
    }, 100);

    setTimeout(() => {
        vm.runtime.profiler = Scratch.profiler;
    }, 100);

    setTimeout(() => {
        // Timeout exceeded
        vm.stopAll();
    }, 100 + this.maxRecordedTime);

    vm.runtime.on('QUESTION', () => {
        //vm.runtime.emit("ANSWER", 5);
    });

    vm.runtime.on('PROJECT_RUN_STOP', () => {
        clearTimeout(vm.runtime._steppingInterval);
        vm.runtime.profiler = null;
        Scratch.opcodes.end();
        console.log("Ended run");
        const div = document.createElement('div');
        div.id=`ended_${numberOfRun}`;
        numberOfRun++;
        document.body.appendChild(div);

        vmData = JSON.parse(JSON.stringify(vm));
    });
}


