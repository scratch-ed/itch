const Scratch = window.Scratch = window.Scratch || {};
var executionTime;
var input;

var logData = {index:0, lines:[], color:null, points:[]};
var blocks = [];
var vmData;
var sprites;
var spritesLog = [];

const SLOW = .1;


document.getElementById('file').addEventListener('change', e => {
    const reader = new FileReader();
    const thisFileInput = e.target;
    reader.onload = () => {
        runBenchmark(reader.result, this.executionTime);
    };
    console.log(thisFileInput.files[0]);
    reader.readAsArrayBuffer(thisFileInput.files[0]);
});

function enterInput(str, vm) {
    let l = str.length;
    for (let i = 0; i < l; i++) {
        let c = str.charAt(i);
        console.log(c);
        console.log(c.charCodeAt(0));
        vm.postIOData('keyboard', {
            keyCode: c.charCodeAt(0),
            isDown: true
        });
        vm.postIOData('keyboard', {
            keyCode: c.charCodeAt(0),
            isDown: false
        });
    }
    vm.postIOData('keyboard', {
        keyCode: 13,
        isDown: true
    });
    vm.postIOData('keyboard', {
        keyCode: 13,
        isDown: false
    });

}

class LoadingProgress {
    constructor (callback) {
        this.total = 0;
        this.complete = 0;
        this.callback = callback;
    }

    on (storage) {
        const _this = this;
        const _load = storage.webHelper.load;
        storage.webHelper.load = function (...args) {
            const result = _load.call(this, ...args);
            _this.total += 1;
            _this.callback(_this);
            result.then(() => {
                _this.complete += 1;
                _this.callback(_this);
            });
            return result;
        };
    }
}

class StatTable {
    constructor ({table, keys, viewOf, isSlow}) {
        this.table = table;
        if (keys) {
            this.keys = keys;
        }
        if (viewOf) {
            this.viewOf = viewOf;
        }
        if (isSlow) {
            this.isSlow = isSlow;
        }
    }

    render () {
        const table = this.table;
        Array.from(table.children)
            .forEach(node => table.removeChild(node));
        const keys = this.keys();
        for (const key of keys) {
            this.viewOf(key).render({
                table,
                isSlow: frame => this.isSlow(key, frame)
            });
        }
    }
}

class StatView {
    constructor (name, isOpcode) {
        this.name = name;
        this.isOpcode = isOpcode;
        this.executions = 0;
        this.selfTime = 0;
        this.totalTime = 0;
    }

    update (selfTime, totalTime) {
        this.executions++;
        this.selfTime += selfTime;
        this.totalTime += totalTime;
    }

    render ({table, isSlow}) {
        const row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.innerText = this.name;
        row.appendChild(cell);

        if (isSlow(this)) {
            row.setAttribute('class', 'slow');
        }

        cell = document.createElement('td');
        // Truncate selfTime. Value past the microsecond are floating point
        // noise.
        this.selfTime = Math.floor(this.selfTime * 1000) / 1000;
        cell.innerText = (this.selfTime / 1000).toPrecision(3);
        row.appendChild(cell);

        cell = document.createElement('td');
        // Truncate totalTime. Value past the microsecond are floating point
        // noise.
        this.totalTime = Math.floor(this.totalTime * 1000) / 1000;
        cell.innerText = (this.totalTime / 1000).toPrecision(3);
        row.appendChild(cell);

        cell = document.createElement('td');
        cell.innerText = this.executions;
        row.appendChild(cell);

        table.appendChild(row);

        if (this.isOpcode) {
            blocks.push({name:this.name, executions:this.executions});
        }
    }
}

class RunningStats {
    constructor (profiler) {
        this.stepThreadsInnerId = profiler.idByName('Sequencer.stepThreads#inner');
        this.blockFunctionId = profiler.idByName('blockFunction');
        this.stpeThreadsId = profiler.idByName('Sequencer.stepThreads');

        this.recordedTime = 0;
        this.executed = {
            steps: 0,
            blocks: 0
        };
    }

    update (id, selfTime, totalTime) {
        if (id === this.stpeThreadsId) {
            this.recordedTime += totalTime;
        } else if (id === this.stepThreadsInnerId) {
            this.executed.steps++;
        } else if (id === this.blockFunctionId) {
            this.executed.blocks++;
        }
    }
}

const WORK_TIME = 0.75;

class RunningStatsView {
    constructor ({runningStats, maxRecordedTime, dom}) {
        this.recordedTimeDom =
            dom.getElementsByClassName('profile-count-amount-recorded')[0];
        this.stepsLoopedDom =
            dom.getElementsByClassName('profile-count-steps-looped')[0];
        this.blocksExecutedDom =
            dom.getElementsByClassName('profile-count-blocks-executed')[0];

        this.maxRecordedTime = maxRecordedTime;
        this.maxWorkedTime = maxRecordedTime * WORK_TIME;
        this.runningStats = runningStats;
    }

    render () {
        const {
            runningStats,
            recordedTimeDom,
            stepsLoopedDom,
            blocksExecutedDom
        } = this;
        const {executed} = runningStats;
        const fractionWorked = runningStats.recordedTime / this.maxWorkedTime;
        recordedTimeDom.innerText = `${(fractionWorked * 100).toFixed(1)} %`;
        stepsLoopedDom.innerText = executed.steps;
        blocksExecutedDom.innerText = executed.blocks;
    }
}

class Frames {
    constructor (profiler) {
        this.profiler = profiler;

        this.frames = [];
    }

    update (id, selfTime, totalTime) {
        if (!this.frames[id]) {
            this.frames[id] = new StatView(this.profiler.nameById(id), false);
        }
        this.frames[id].update(selfTime, totalTime);
    }
}

class VmStates {
    constructor (profiler) {
        this.profiler = profiler;
        this.index = 0;
    }

    update (id, selfTime, totalTime) {
        this.index++;
    }
}

const frameOrder = [
    'blockFunction',
    'execute',
    'Sequencer.stepThread',
    'Sequencer.stepThreads#inner',
    'Sequencer.stepThreads',
    'RenderWebGL.draw',
    'Runtime._step'
];

const trackSlowFrames = [
    'Sequencer.stepThreads',
    'Sequencer.stepThreads#inner',
    'Sequencer.stepThread',
    'execute'
];

class FramesTable extends StatTable {
    constructor (options) {
        super(options);

        this.profiler = options.profiler;
        this.frames = options.frames;
    }

    keys () {
        const keys = Object.keys(this.frames.frames)
            .map(id => this.profiler.nameById(Number(id)));
        keys.sort((a, b) => frameOrder.indexOf(a) - frameOrder.indexOf(b));
        return keys;
    }

    viewOf (key) {
        return this.frames.frames[this.profiler.idByName(key)];
    }

    isSlow (key, frame) {
        return (trackSlowFrames.indexOf(key) > 0 &&
        frame.selfTime / frame.totalTime > SLOW);
    }
}

class Opcodes {
    constructor (profiler) {
        this.blockFunctionId = profiler.idByName('blockFunction');

        this.opcodes = {};
    }

    update (id, selfTime, totalTime, arg) {
        if (id === this.blockFunctionId) {
            if (!this.opcodes[arg]) {
                this.opcodes[arg] = new StatView(arg, true);
            }
            this.opcodes[arg].update(selfTime, totalTime);
        }
    }
}

class OpcodeTable extends StatTable {
    constructor (options) {
        super(options);

        this.profiler = options.profiler;
        this.opcodes = options.opcodes;
        this.frames = options.frames;
    }

    keys () {
        const keys = Object.keys(this.opcodes.opcodes);
        keys.sort();
        return keys;
    }

    viewOf (key) {
        return this.opcodes.opcodes[key];
    }

    isSlow (key) {
        const blockFunctionTotalTime = this.frames.frames[this.profiler.idByName('blockFunction')].totalTime;
        const rowTotalTime = this.opcodes.opcodes[key].totalTime;
        const percentOfRun = rowTotalTime / blockFunctionTotalTime;
        return percentOfRun > SLOW;
    }
}

class ProfilerRun {
    constructor ({vm, maxRecordedTime, warmUpTime}) {
        this.vm = vm;
        this.maxRecordedTime = maxRecordedTime;
        this.warmUpTime = warmUpTime;

        vm.runtime.enableProfiling();
        const profiler = this.profiler = vm.runtime.profiler;
        vm.runtime.profiler = null;

        const runningStats = this.runningStats = new RunningStats(profiler);
        const runningStatsView = this.runningStatsView = new RunningStatsView({
            dom: document.getElementsByClassName('profile-count-group')[0],

            runningStats,
            maxRecordedTime
        });

        const frames = this.frames = new Frames(profiler);
        this.frameTable = new FramesTable({
            table: document
                .getElementsByClassName('profile-count-frame-table')[0]
                .getElementsByTagName('tbody')[0],

            profiler,
            frames
        });

        const opcodes = this.opcodes = new Opcodes(profiler);
        this.opcodeTable = new OpcodeTable({
            table: document
                .getElementsByClassName('profile-count-opcode-table')[0]
                .getElementsByTagName('tbody')[0],

            profiler,
            opcodes,
            frames
        });

        const vmStates = this.vmStates = new VmStates(profiler);

        const stepId = profiler.idByName('Runtime._step');
        const blockId = profiler.idByName('blockFunction');

        let firstState = true;
        let i = 0;
        profiler.onFrame = ({id, selfTime, totalTime, arg}) => {
            if (firstState) {
                spritesLog.push({block:'START', sprites:JSON.parse(JSON.stringify(this.vm.runtime.targets))});
                console.log(JSON.parse(JSON.stringify(this.vm.runtime.targets)));
                console.log(profiler.nameById(id));
                firstState = false;
            }
            if (id === stepId) {
                runningStatsView.render();
            }
            if (id === blockId) {
                spritesLog.push({block:arg, sprites:JSON.parse(JSON.stringify(this.vm.runtime.targets))});
                if (arg === 'sensing_askandwait') {
                    console.log('entering input');
                    console.log(input);
                    enterInput(input[i], this.vm)
                    i++;
                }
            }
            runningStats.update(id, selfTime, totalTime, arg);
            opcodes.update(id, selfTime, totalTime, arg);
            frames.update(id, selfTime, totalTime, arg);
        };
    }

    run () {
        window.parent.postMessage({
            type: 'BENCH_MESSAGE_LOADING'
        }, '*');

        this.vm.on('workspaceUpdate', () => {
            setTimeout(() => {
                window.parent.postMessage({
                    type: 'BENCH_MESSAGE_WARMING_UP'
                }, '*');
                this.vm.greenFlag();
            }, 100);
            setTimeout(() => {
                window.parent.postMessage({
                    type: 'BENCH_MESSAGE_ACTIVE'
                }, '*');
                this.vm.runtime.profiler = this.profiler;
            }, 100 + this.warmUpTime);
            setTimeout(() => {
                this.vm.stopAll();
                clearTimeout(this.vm.runtime._steppingInterval);
                this.vm.runtime.profiler = null;

                this.frameTable.render();
                this.opcodeTable.render();

                window.parent.postMessage({
                    type: 'BENCH_MESSAGE_COMPLETE',
                    frames: this.frames.frames,
                    opcodes: this.opcodes.opcodes
                }, '*');

                const div = document.createElement('div');
                div.id='loaded';
                document.body.appendChild(div)

                vmData = JSON.parse(JSON.stringify(this.vm));

            }, 100 + this.warmUpTime + this.maxRecordedTime);
        });
    }
}

/**
 * Run the benchmark with given parameters in the location's hash field or
 * using defaults.
 */
const runBenchmark = function (file, executionTime) {
    // Lots of global variables to make debugging easier
    // Instantiate the VM.
    const vm = new window.VirtualMachine();
    Scratch.vm = vm;

    vm.setTurboMode(true);
    vm.loadProject(file);

    const storage = new ScratchStorage(); /* global ScratchStorage */
    vm.attachStorage(storage);

    new LoadingProgress(progress => {
        document.getElementsByClassName('loading-total')[0]
            .innerText = progress.total;
        document.getElementsByClassName('loading-complete')[0]
            .innerText = progress.complete;
    }).on(storage);

    let warmUpTime = 0;

    new ProfilerRun({
        vm,
        warmUpTime,
        maxRecordedTime: executionTime
    }).run();

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

    // Run threads
    vm.start();

};

