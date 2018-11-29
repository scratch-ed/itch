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
function init(file) {
    // Lots of global variables to make debugging easier
    // Instantiate the VM.
    const vm = new window.VirtualMachine();
    Scratch.vm = vm;

    vm.setTurboMode(true);
    vm.loadProject(file);

    // Storage
    const storage = new ScratchStorage(); /* global ScratchStorage */
    vm.attachStorage(storage);

    // Instantiate the renderer and connect it to the VM.
    const canvas = document.getElementById('scratch-stage');
    const renderer = new window.makeProxiedRenderer(canvas, logData);
    Scratch.renderer = renderer;
    vm.attachRenderer(renderer);

    // AudioEngine
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
        for (let arg in this.opcodes) {
            blocks.push({name:arg, executions:this.opcodes[arg]});
        }
    }
}

function createProfiler() {
    const vm = Scratch.vm;

    vm.runtime.enableProfiling();
    Scratch.profiler = vm.runtime.profiler;
    console.log(Scratch.profiler);
    vm.runtime.profiler = null;

    const stepId = Scratch.profiler.idByName('Runtime._step');
    const blockId = Scratch.profiler.idByName('blockFunction');

    Scratch.opcodes = new Opcodes();
    let firstState = true;
    Scratch.profiler.onFrame = ({id, selfTime, totalTime, arg}) => {
        if (firstState) {
            spritesLog.push({block:'START', sprites:JSON.parse(JSON.stringify(vm.runtime.targets))});
            firstState = false;
        }
        if (id === blockId) {
            console.log(arg);
            Scratch.opcodes.update(arg);
            spritesLog.push({block:arg, sprites:JSON.parse(JSON.stringify(vm.runtime.targets))});
        }
    };
}

function greenFlag(){
    console.log("clickGreenFlag()");

    const vm = Scratch.vm;
    const START_DELAY = 100;

    console.log(vm);

    setTimeout(() => {
        console.log("vm.greenFlag()");
        vm.greenFlag();
        vm.runtime.profiler = Scratch.profiler;
    }, START_DELAY);

    /*setTimeout(() => {
        // Timeout exceeded
        console.log('timeout');
        vm.stopAll();
    }, START_DELAY + this.maxRecordedTime);*/

    setTimeout(() => {

        vm.runtime.on('SAY', (target, type, text) => {
            console.log("say: ", text);
        });

        vm.runtime.on('QUESTION', (question) => {
            if (question != null) {
                let x = keyInput.shift();
                console.log("input: ", x);
                vm.runtime.emit("ANSWER", x);
            }
        });

        vm.runtime.on('PROJECT_RUN_STOP', () => {
            clearTimeout(vm.runtime._steppingInterval);
            vm.runtime.disableProfiling();
            vm.runtime.profiler = null;
            Scratch.opcodes.end();
            console.log("Ended run");

            vmData = JSON.parse(JSON.stringify(vm));

            setTimeout(() => {
                const div = document.createElement('div');
                div.id=`ended_${numberOfRun}`;
                numberOfRun++;
                document.body.appendChild(div);
            }, START_DELAY);

        });

    }, START_DELAY );


}


