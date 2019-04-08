
class Frame {

    constructor(block, pen) {
        this.time = getTimeStamp();
        this.block = block;
        this.sprites = [];
        this.pen = JSON.parse(JSON.stringify(pen));

        let targets = Scratch.vm.runtime.targets;

        for (let index in targets) {
            let target = targets[index];
            let sprite = {};
            sprite.name = target.sprite.name;

            // todo choose which properties to log
            let propertiesToLog = ['id', 'x', 'y', 'direction', 'currentCostume', 'isStage', 'size', 'visible', 'tempo'];

            propertiesToLog.forEach((variable) => {
                sprite[variable] = target[variable];
            });

            // sprite properties to log
            sprite['costume'] = target.sprite.costumes_[target['currentCostume']].name;

            // block properties to log
            sprite['blocks'] = target.blocks._blocks;

            this.sprites.push(sprite);
        }
    }

}

class Pen {
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
        this.lastFrame = null;
        this.currentFrame = null;

        this.pen = new Pen();

        this.blocks = {};

        this.events = [];

    }

    addFrame(block) {
        let frame = new Frame(block, this.pen);
        this.lastFrame = this.currentFrame;
        this.currentFrame = frame;

        this.frames.push(frame);

        if (!this.blocks[block]) {
            this.blocks[block] = 0;
        }
        this.blocks[block]++;
    }

    addEvent(event) {
        this.events.push(event);
    }

    reset() {
        this.frames = [];
        this.blocks = [];
        this.lastFrame = null;
        this.currentFrame = null;
    }

}
