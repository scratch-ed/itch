
class Frame {

    constructor(block) {
        this.time = getTimeStamp();
        this.block = block;
        this.sprites = [];

        let targets = Scratch.vm.runtime.targets;
        //console.log(targets);

        for (let target of targets) {
            //console.log('is touching edge?', target.isTouchingEdge());
            let sprite = {};
            sprite.name = target.sprite.name;

            // todo choose which properties to log
            let propertiesToLog = ['id', 'x', 'y', 'direction', 'currentCostume', 'isStage', 'size', 'visible', 'tempo'];

            propertiesToLog.forEach((variable) => {
                sprite[variable] = target[variable];
            });

            sprite['variables'] = JSON.parse(JSON.stringify(target['variables']));

            // sprite properties to log
            sprite['costume'] = target.sprite.costumes_[target['currentCostume']].name;
            sprite['costumeSize'] = target.sprite.costumes_[target['currentCostume']].size;

            // block properties to log
            sprite['blocks'] = target.blocks._blocks;

            this.sprites.push(sprite);
        }

    }

}

class Event {
    constructor(type, data) {
        this.time = getTimeStamp();
        this.type = type;
        this.data = data;
    }

}

class Renderer {
    constructor () {
        this.index = 0;
        this.lines = [];
        this.color = null;
        this.points = [];
        this.responses = [];
    }
}


class Log {

    constructor() {
        this.frames = [];
        this.lastFrame = null; // methods voor previous en current frame uit frames (getter)
        this.currentFrame = null;

        //lijst van events
        this.events = [];

        this.renderer = new Renderer();

        this.blocks = {};

        this.events = [];

    }

    addFrame(block) {
        let frame = new Frame(block);
        this.lastFrame = this.currentFrame;
        this.currentFrame = frame;

        this.frames.push(frame);

        if (!this.blocks[block]) {
            this.blocks[block] = 0;
        }
        this.blocks[block]++;
    }

    addEvent(type, data) {
        let event = new Event(type, data);
        this.events.push(event);

        if (type === 'renderer') {
            //todo
        }
    }

    reset() {
        this.frames = [];
        this.lastFrame = null;
        this.currentFrame = null;
        this.renderer = new Renderer();
        this.blocks = {};
        this.events = [];
    }

}
