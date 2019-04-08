
class Frame {

    constructor(type, block) {
        this.type = type;
        this.time = getTimeStamp();
        this.block = block;
        this.sprites = [];

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

            console.log(sprite);
            this.sprites.push(sprite);
        }
    }

}


class Log {

    constructor() {
        this.frames = [];
        this.blocks = [];
        this.lastFrame = null;
        this.currentFrame = null;
    }

    addFrame(type, block) {
        let frame = new Frame(type, block);
        this.lastFrame = this.currentFrame;
        this.currentFrame = frame;
        this.frames.push(frame);

        if (!this.blocks[block]) {
            this.blocks[block] = 0;
        }
        this.blocks[block]++;
    }

    reset() {
        this.frames = [];
        this.blocks = [];
        this.lastFrame = null;
        this.currentFrame = null;
    }

}
