// Create global Scratch variable
const Scratch = window.Scratch = window.Scratch || {};

// Create global input variables
let keyInput;
let mouseInput;

// Create global logging variables
let numberOfRun = 0;

let log = new Log();

// Create event chain to simulate user input.
let simulationChain = new ScratchSimulationEvent((resolve, reject) => {
    resolve();
}, 0);


class Future {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

// Start of promise that gets resolved when the Scratch file has finished loading.
Scratch.loadedEnd = new Future();


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
    // Instantiate the VM.
    const vm = new VirtualMachine();
    Scratch.vm = vm;

    vm.setTurboMode(true);
    vm.loadProject(file);

    // Storage
    const storage = new ScratchStorage();
    /* global ScratchStorage */
    vm.attachStorage(storage);

    // Instantiate the renderer and connect it to the VM.
    const canvas = document.getElementById('scratch-stage');
    const renderer = new makeProxiedRenderer(canvas, log);
    Scratch.renderer = renderer;
    vm.attachRenderer(renderer);

    // AudioEngine
    const audioEngine = new AudioEngine();
    vm.attachAudioEngine(audioEngine);
    /* global ScratchSVGRenderer */
    vm.attachV2SVGAdapter(new ScratchSVGRenderer.SVGRenderer());
    vm.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());


    // Wrapper for step

    const oldStep = Scratch.vm.runtime._step;

    function newStep() {
        console.log(this.profiler);
        let r = oldStep.apply(this);
        Scratch.vm.runtime.emit('DONE_THREADS_UPDATE', Scratch.vm.runtime._lastStepDoneThreads);
        return r;
    }
    //Scratch.vm.runtime._step = newStep();


    // Wrapper for greenFlag: we want greenFlag to return the threads started by runtime.greenFlag()

    const oldGreenFlag = Scratch.vm.greenFlag;

    function newGreenFlag() {
        return this.runtime.greenFlag();
    }
    //Scratch.vm.greenFlag = newGreenFlag();

    // Wrapper for runtime.greenFlag: we want greenFlag to return the threads started by runtime.startHats()
    const oldRuntimeGreenFlag = Scratch.vm.runtime.greenFlag;

    function newRuntimeGreenFlag() {
        oldRuntimeGreenFlag();
        //todo find way to return threads
    }
    //Scratch.vm.runtime.greenFlag = newRuntimeGreenFlag();

    // Maybe emit threads after each StartHats function and catch them here?



    // VM event handlers
    vmHandleEvents(vm);

    // VM start
    vm.start();

    console.log("Finished loading");
    Scratch.loadedEnd.resolve();

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
        console.log(`${getTimeStamp()}: Ended run`);
        Scratch.executionEnd.resolve();
    });

    vm.runtime.on('DONE_THREADS_UPDATE', (threads) => {
        for (let index in threads) {
            console.log(threads[index].topBlock);
        }
    });
}


function createProfiler() {
    const vm = Scratch.vm;

    vm.runtime.enableProfiling();
    Scratch.profiler = vm.runtime.profiler;

    const blockId = Scratch.profiler.idByName('blockFunction');

    let firstState = true;
    Scratch.profiler.onFrame = ({id, selfTime, totalTime, arg}) => {
        if (firstState) {
            log.addFrame('START');
            firstState = false;
        }
        if (id === blockId) {
            log.addFrame(arg);
        }
    };
}

function start() {

    //Start timer
    startTimestamp = Date.now();
    console.log("start timestamp:", startTimestamp);

    Scratch.executionEnd = new Future();
    Scratch.simulationEnd = new Future();
    simulationChain.launch();
}
