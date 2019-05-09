
class Frame {

    constructor(block) {
        this.time = getTimeStamp();
        this.block = block;
        this.sprites = [];

        let targets = Scratch.vm.runtime.targets;

        for (let target of targets) {

            let sprite = {};
            sprite.name = target.sprite.name;

            let propertiesToLog = ['id', 'x', 'y', 'direction', 'currentCostume', 'isStage', 'size', 'visible', 'tempo'];
            propertiesToLog.forEach((variable) => {
                sprite[variable] = target[variable];
            });

            sprite['variables'] = JSON.parse(JSON.stringify(target['variables']));

            // sprite properties to log
            sprite['costume'] = target.sprite.costumes_[target['currentCostume']].name;
            sprite['costumeSize'] = target.sprite.costumes_[target['currentCostume']].size;

            sprite['isTouchingEdge'] = target.isTouchingEdge();
            sprite['bounds'] = target.getBounds();

            let touchings = [];
            for (let touchingTarget of targets) {
                if (touchingTarget.id !== target.id) {
                    let x = {name: touchingTarget.sprite.name, value: target.isTouchingSprite(touchingTarget.sprite.name)};
                    touchings.push(x);
                }
            }
            sprite['isTouchingSprite'] = touchings;

            // block properties to log
            sprite['blocks'] = target.blocks._blocks;

            this.sprites.push(sprite);
        }

    }

    getSprite(spriteName) {
        for (let sprite of this.sprites) {
            if (sprite.name === spriteName) {
                return sprite;
            }
        }
        return null;
    }

}

class Frames {
    constructor() {
        this.length = 0;
        this.list = [];
        this.lastTime = 0;
    }

    push(frame) {
        this.list.push(frame);
        this.length++;
        this.lastTime = frame.time;
    }

    filter(arg) {
        let before = arg['before'] || this.lastTime;
        let after = arg['after'] || 0;
        let filtered = [];
        for (let frame in this.list) {
            if (frame.time >= after && frame.time <= before) {
                filtered.push(frame);
            }
        }
        return filtered;
    }
}


class Event {

    constructor(type, data = {}) {
        this.time = getTimeStamp();
        this.type = type;
        this.data = data;

        this.nextFrame = null;
        this.previousFrame = null;
    }

    getNextFrame() {
        return this.nextFrame;
    }

    getPreviousFrame() {
        return this.previousFrame;
    }

}

class Events {
    constructor () {
        this.list = [];
        this.length = 0;
        this.lastTime = 0;
    }

    push(event) {
        this.list.push(event);
        this.length++;
        this.lastTime = event.time;
    }

    filter(arg) {
        let type = arg['type'] || 'all';
        let before = arg['before'] || this.lastTime;
        let after = arg['after'] || 0;

        let filtered = [];
        for (let event of this.list) {
            if (type === 'all' || event.type === type) {
                if (event.time >= after && event.time <= before) {
                    filtered.push(event);
                }
            }
        }
        return filtered;
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

class Blocks {
    constructor() {
        this.blocks = {};
    }

    push(block) {
        if (!this.blocks[block]) {
            this.blocks[block] = 0;
        }
        this.blocks[block]++;
    }

    containsLoop() {
        return containsLoop(this.blocks);
    }

    containsBlock(blockName) {
        return containsBlock(blockName, this.blocks);
    }

    numberOfExecutions(blockName) {
        return countExecutions(blockName, this.blocks);
    }
}

class Log {

    constructor() {
        this.frames = new Frames();
        this.events = new Events();
        this.renderer = new Renderer();
        this.blocks = new Blocks();
    }

    addFrame(block) {
        let frame = new Frame(block);
        this.frames.push(frame);
        this.blocks.push(block);
    }

    addEvent(event) {
        this.events.push(event);
    }

    reset() {
        // not needed
    }

    // return final state of sprites
    get sprites() {
        return this.frames.list[this.frames.length];
    }





    // Functions needed for evaluation

    // Sprite related
    getCostumes(spriteName, frames = this.frames.list) {
        let costumes = {};
        let costumeIds = new Set();
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
            if (sprite != null) {
                if (!costumeIds.has(sprite.currentCostume)) {
                    costumeIds.add(sprite.currentCostume);
                    costumes[sprite.currentCostume] = sprite.costume;
                }
            }
        }
        return costumes;
    }

    getNumberOfCostumes(spriteName) {
        let costumes = this.getCostumes(spriteName);
        return Object.keys(costumes).length;
    }

    getVariableValue(variableName, spriteName = 'Stage') {
        for (let sprite of this.sprites) {
            if (sprite.name === spriteName) {
                if (sprite.variables !== undefined) {
                    for (let property in sprite.variables) {
                        if (sprite.variables.hasOwnProperty(property)) {
                            if (sprite.variables[property].name === variableName) {
                                return sprite.variables[property].value;
                            }
                        }
                    }
                }
            }
        }
    }

    getStartSprites() {
        return this.frames.list[0].sprites;
    }

    getMaxX(spriteName, frames = this.frames.list) {

        let max = 0;
        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.x > max) {
                    max = sprite.x;
                }
            }
        }
        return max;

    }

    getMinX(spriteName, frames = this.frames.list) {

        let min = 0;
        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.x < min) {
                    min = sprite.x;
                }
            }
        }
        return min;

    }

    getMaxY(spriteName, frames = this.frames.list) {

        let max = 0;
        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.y > max) {
                    max = sprite.y;
                }
            }
        }
        return max;

    }

    getMinY(spriteName, frames = this.frames.list) {

        let min = 0;
        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.y < min) {
                    min = sprite.y;
                }
            }
        }
        return min;

    }

    inBounds(spriteName, frames = this.frames.list) {

        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.isTouchingEdge) {
                    return false;
                }
            }
        }
        return true;
    }


    getDirections(spriteName, frames = this.frames.list) {
        let directions = [];
        let oldDirection = 0;
        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (oldDirection !== sprite.direction) {
                    directions.push(sprite.direction);
                    oldDirection = sprite.direction;
                }
            }
        }
        return directions;
    }

    isHorizontal(spriteName) {
        let directions = this.getDirections(spriteName);
        for (let direction of directions) {
            if (direction !== 90 && direction !== -90) {
                return false;
            }
        }
        return true;
    }

    bouncesHorizontal(spriteName) {
        let directions = this.getDirections(spriteName);
        let oldDirection = directions[0];
        for (let i = 1; i < directions.length; i++) {
            if (directions[i] !== (-oldDirection)) {
                return false;
            }
            oldDirection = directions[i];
        }
        return true;
    }

    getCostumeChanges(spriteName, frames = this.frames.list) {
        let costumes = [];
        let oldCostume = '';
        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (oldCostume !== sprite.costume) {
                    costumes.push(sprite.costume);
                    oldCostume = sprite.costume;
                }
            }
        }
        return costumes;
    }

    isTouchingSprite(spriteName, targetName, frame) {
        let sprite = getSpriteByName(spriteName, frame);
        for (let target of sprite.isTouchingSprite) {
            if (target.name === targetName) {
                return target.value;
            }
        }
        return false;
    }

    getDistancesToSprite(spriteName, targetName, frames = this.frames.list) {
        let distances = [];
        for (let frame of frames) {
            let sprite = getSpriteByName(spriteName, frame);
            let target = getSpriteByName(targetName, frame);
            if (sprite != null && target != null) {
                distances.push(Math.sqrt(distSq(sprite, target)));
            }
        }
        return distances;
    }

    // EVENT RELATED

    getSpriteBeforeEvent(spriteName, event) {
        for (let sprite of event.previousFrame.sprites) {
            if (sprite.name === spriteName) {
                return sprite;
            }
        }
    }

    getSpriteAfterEvent(spriteName, event) {
        for (let sprite of event.nextFrame.sprites) {
            if (sprite.name === spriteName) {
                return sprite;
            }
        }
    }

    // RENDERER RELATED

    getSquares() {
        return findSquares(this.renderer.lines);
    }

    getTriangles() {
        return findTriangles(this.renderer.lines);
    }

    getMergedLines() {
        return mergeLines(this.renderer.lines);
    }

    getLineLength(line) {
        return dist(line);
    }

    getResponses() {
        return this.renderer.responses;
    }

    getCreateSkinEvents() {
        let rendererEvents = this.events.filter({type: 'renderer'});
        let createTextSkinEvents = [];
        for (let event of rendererEvents) {
            if (event.data.name === 'createTextSkin') {
                createTextSkinEvents.push(event);
            }
        }
        return createTextSkinEvents;
    }

    getDestroySkinEvents() {
        let rendererEvents = this.events.filter({type: 'renderer'});
        let destroySkinEvents = [];
        for (let event of rendererEvents) {
            if (event.data.name === 'destroySkin') {
                destroySkinEvents.push(event);
            }
        }
        return destroySkinEvents;
    }

    getSkinDuration(text) {
        let createTextSkinEvents = this.getCreateSkinEvents();
        let destroyTextSkinEvents = this.getDestroySkinEvents();

        let time = 0;
        let id = -1;
        for (let e of createTextSkinEvents) {
            if (e.data.text === text) {
                time = e.time;
                id = e.data.id;
            }
        }
        for (let e of destroyTextSkinEvents) {
            if (e.data.id === id) {
                return (e.time - time);
            }
        }
        return null;
    }


}
