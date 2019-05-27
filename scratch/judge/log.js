/**
 * Frame describes one captured moment during execution. It saves a snapshot of the current state of the sprites.
 * @example
 * let frame = new Frame('looks_nextcostume');
 */
class Frame {

    /**
     * When a new frame is created, information from the current state of the targets is saved. Some properties, like if the target is touching another target,
     * are calculated before being saved.
     * @param {string} block The executed code-block of the Scratch Project that triggered the save of a Frame in the log.
     */
    constructor(block) {
        this.time = getTimeStamp();
        this.block = block;
        this.type = block;
        this.sprites = [];

        let targets = Scratch.vm.runtime.targets;

        for (let target of targets) {

            let sprite = {};
            sprite.name = target.sprite.name;

            let propertiesToLog = ['id', 'x', 'y', 'direction', 'currentCostume', 'isStage', 'size', 'visible', 'tempo'];
            propertiesToLog.forEach((variable) => {
                sprite[variable] = target[variable];
            });

            let variables = [];
            for (let property in target['variables']) {
                variables.push({name: target.variables[property].name, value: target.variables[property].value});
            }
            sprite['variables'] = variables;

            // sprite properties to log
            sprite['costume'] = target.sprite.costumes_[target['currentCostume']].name;
            sprite['costumeSize'] = target.sprite.costumes_[target['currentCostume']].size;

            sprite['isTouchingEdge'] = target.isTouchingEdge();
            sprite['bounds'] = target.getBounds();

            let touchings = [];
            for (let touchingTarget of targets) {
                if (touchingTarget.id !== target.id) {
                    let x = {
                        name: touchingTarget.sprite.name,
                        value: target.isTouchingSprite(touchingTarget.sprite.name)
                    };
                    touchings.push(x);
                }
            }
            sprite['isTouchingSprite'] = touchings;

            // block properties to log
            sprite['blocks'] = target.blocks._blocks;

            this.sprites.push(sprite);
        }

    }

    /**
     * Returns a sprite object with a given name.
     * @param {string} spriteName The name of the sprite that has to be returned. Returns null if no such sprite exists.
     * @returns {Object} sprite The sprite object with the matching name.
     */
    getSprite(spriteName) {
        for (let sprite of this.sprites) {
            if (sprite.name === spriteName) {
                return sprite;
            }
        }
        return null;
    }

    /**
     * Tests if two sprites are touching at the moment the frame was captured.
     * @param {string} spriteName1 The name of the first sprite.
     * @param {string} spriteName2 The name of the second sprite.
     * @returns {boolean} true if the sprites are touching, false if they are not.
     */
    isTouching(spriteName1, spriteName2) {
        let sprite = this.getSprite(spriteName1);
        for (let s of sprite.isTouchingSprite) {
            if (s.name === spriteName2) {
                return s.value;
            }
        }
        return false;
    }
}

/**
 * Frames is a collection of frames, where it is possible to filter frames with certain arguments.
 */
class Frames {
    constructor() {
        this.length = 0;
        this.list = [];
        this.lastTime = 0;
    }

    /**
     * Add a new frame to frames.
     * @param {Object} frame The frame to be added to the collection of frames.
     */
    push(frame) {
        this.list.push(frame);
        this.length++;
        this.lastTime = frame.time;
    }

    /**
     * Add a new frame to frames.
     * @param {Object} arg An object with two timestamps.
     * @param {number} arg.after A starting timestamp.
     * @param {number} arg.before An ending timestamp.
     * @returns {Frame[]} filtered The list of frames between the two given timestamps.
     */
    filter(arg) {
        let before = arg['before'] || this.lastTime;
        let after = arg['after'] || 0;
        let type = arg['type'] || 'any';
        let filtered = [];
        for (let frame of this.list) {
            if (frame.time >= after && frame.time <= before) {
                if (frame.type === type || type === 'any') {
                    filtered.push(frame);
                }
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
    constructor() {
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
    constructor() {
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
        return this.frames.list[this.frames.length - 1];
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

    getVariableValue(variableName, spriteName = 'Stage', frame = this.sprites) {
        for (let sprite of frame.sprites) {
            if (sprite.name === spriteName) {
                for (let variable of sprite.variables) {
                    if (variable.name === variableName) {
                        return variable.value;
                    }
                }
            }
        }
    }

    getStartSprites() {
        return this.frames.list[0].sprites;
    }

    getMaxX(spriteName, frames = this.frames.list) {

        let max = -240;
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
            if (sprite != null) {
                if (sprite.x > max) {
                    max = sprite.x;
                }
            }
        }
        return max;

    }

    getMinX(spriteName, frames = this.frames.list) {

        let min = 240;
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
            if (sprite != null) {
                if (sprite.x < min) {
                    min = sprite.x;
                }
            }
        }
        return min;

    }

    getMaxY(spriteName, frames = this.frames.list) {

        let max = -180;
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
            if (sprite != null) {
                if (sprite.y > max) {
                    max = sprite.y;
                }
            }
        }
        return max;

    }

    getMinY(spriteName, frames = this.frames.list) {

        let min = 180;
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
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
            let sprite = frame.getSprite(spriteName);
            if (sprite != null) {
                if (sprite.isTouchingEdge) {
                    return false;
                }
            }
        }
        return true;
    }

    getDirectionChanges(spriteName, frames = this.frames.list) {
        let directions = [];
        let oldDirection = 0;
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
            if (sprite != null) {
                if (oldDirection !== sprite.direction) {
                    directions.push(sprite.direction);
                    oldDirection = sprite.direction;
                }
            }
        }
        return directions;
    }

    getCostumeChanges(spriteName, frames = this.frames.list) {
        let costumes = [];
        let oldCostume = '';
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
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
        return frame.isTouching(spriteName, targetName);
    }

    getDistancesToSprite(spriteName, targetName, frames = this.frames.list) {
        let distances = [];
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
            let target = frame.getSprite(targetName);
            if (sprite != null && target != null) {
                distances.push(Math.sqrt(distSq(sprite, target)));
            }
        }
        return distances;
    }

    doSpritesOverlap(spriteName1, spriteName2, frame = this.sprites) {
        let sprite1 = frame.getSprite(spriteName1);
        let sprite2 = frame.getSprite(spriteName2);
        let bounds1 = sprite1.bounds;
        let bounds2 = sprite2.bounds;
        // If one rectangle is on left side of other
        if (bounds1.left > bounds2.right || bounds1.right < bounds2.left) {
            return false;
        }
        // If one rectangle is above other
        if (bounds1.top < bounds2.bottom || bounds1.bottom > bounds2.top) {
            return false;
        }
        return true;

    }

    getSpriteLocations(spriteName, frames = this.frames.list) {
        let places = [];
        let lastX = 0;
        let lastY = 0;
        let first = true;
        for (let frame of frames) {
            let sprite = frame.getSprite(spriteName);
            if (lastX !== sprite.x || lastY !== sprite.y || first) {
                lastX = sprite.x;
                lastY = sprite.y;
                places.push({x: lastX, y: lastY});
                first = false;
            }
        }
        return places;
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
