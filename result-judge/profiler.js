const Scratch = window.Scratch = window.Scratch || {};
var executionTime;
var keyInput;
var mouseInput;
let numberOfRun = 0;
let startTimestamp;

var logData = {index:0, lines:[], color:null, points:[], responses:[]};
var blocks = [];
var vmData;
var sprites;
var spritesLog = [];

var profilerRun;

/**
 * When a new file is loaded by calling chromeless.setFile(fileName), the project gets initialized.
 */
/*
function loadFile() {
    return new Promise((resolve, reject) => {
        let file = document.getElementById('file');
        console.log(file);
        const reader = new FileReader();
        reader.onload = () => {
            init(reader.result);
            resolve();
        };
        console.log(file.files[0]);
        reader.readAsArrayBuffer(file.files[0]);
    })
}
*/

let promise = new Promise();

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

    //Start timer
    let date = new Date();
    startTimestamp = date.getTime();
    console.log("start timestamp:", startTimestamp); //TODO replace this with init event

    // Storage
    const storage = new ScratchStorage(); /* global ScratchStorage */
    vm.attachStorage(storage);

    // Instantiate the renderer and connect it to the VM.
    const canvas = document.getElementById('scratch-stage');
    const renderer = new window.makeProxiedRenderer(canvas, logData, startTimestamp);
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

    promise.resolve();

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

function getTimeStamp() {
    let date = new Date();
    return date.getTime() - startTimestamp;
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
            console.log(`${getTimeStamp()}: ${arg}`);
            Scratch.opcodes.update(arg);
            spritesLog.push({block:arg, sprites:JSON.parse(JSON.stringify(vm.runtime.targets))});
        }
    };
}



async function greenFlag(){
    console.log("clickGreenFlag()");

    const vm = Scratch.vm;
    const START_DELAY = 100;

    console.log(vm);

    setTimeout(() => {
        console.log("vm.greenFlag()");
        vm.greenFlag();
        //vm.runtime.profiler = Scratch.profiler;
    }, START_DELAY);

    /*setTimeout(() => {
        // Timeout exceeded
        console.log('timeout');
        vm.stopAll();
    }, START_DELAY + this.maxRecordedTime);*/

    setTimeout(() => {

        vm.runtime.on('PROJECT_START', () => {
            let date = new Date();
            let timestamp = date.getTime() - startTimestamp;
            console.log(`${timestamp}: project start event: ${numberOfRun}`);
        });

        vm.runtime.on('SAY', (target, type, text) => {
            let date = new Date();
            let timestamp = date.getTime() - startTimestamp;
            console.log(`${timestamp}: say: ${text}`);
        });

        vm.runtime.on('QUESTION', (question) => {
            if (question != null) {
                let date = new Date();
                let timestamp = date.getTime() - startTimestamp;
                let x = keyInput.shift();
                console.log(`${timestamp}: input: ${x}`);
                vm.runtime.emit("ANSWER", x);
            }
        });

        vm.runtime.on('PROJECT_RUN_STOP', () => {
            //clearTimeout(vm.runtime._steppingInterval);

            //vm.runtime.disableProfiling();
            //vm.runtime.profiler = null;
            Scratch.opcodes.end();
            let date = new Date();
            let timestamp = date.getTime() - startTimestamp;
            console.log(`${timestamp}: Ended run`);

            vmData = JSON.parse(JSON.stringify(vm));

            const div = document.createElement('div');
            div.id=`ended_${numberOfRun}`;
            numberOfRun++;
            document.body.appendChild(div);

        });

    }, START_DELAY );


}


