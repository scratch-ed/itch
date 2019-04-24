class Playground {
    constructor(log) {
        this.lines = log.renderer.lines;
        this.say = log.renderer.responses;
        this.ask = log.renderer.responses;
    }

    get squares() {
        return findSquares(this.lines);
    }

    get triangles() {
        return findTriangles(this.lines);
    }

    get mergedLines() {
        return mergeLines(this.lines);
    }
}

class AllBlocks {
    constructor(log) {
        this.blocks = log.blocks;
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

class Sprites {
    constructor() {

    }

    getVariableValue(variableName, spriteName = 'Stage') {
        for (let sprite of log.currentFrame.sprites) {
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

    containsLoop(spriteId) {
        return containsLoop(spriteId, this.sprites);
    }

    getStartSprites() {
        return log.frames[0].sprites;
    }


    getCostume(spriteName) {

        let sprite = getSpriteByName(spriteName, log.currentFrame);
        if (sprite != null) {
            return sprite.costume;
        } else {
            return `Error: Er bestaat geen sprite met naam: ${spriteName}`
        }
    }

    getMaxX(spriteName) {

        let max = 0;
        for (let index = 0; index < log.frames.length; index++) {
            let frame = log.frames[index];
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.x > max) {
                    max = sprite.x;
                }
            }
        }
        return max;

    }

    getMinX(spriteName) {

        let min = 0;
        for (let index = 0; index < log.frames.length; index++) {
            let frame = log.frames[index];
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.x < min) {
                    min = sprite.x;
                }
            }
        }
        return min;

    }

    getMaxY(spriteName) {

        let max = 0;
        for (let index = 0; index < log.frames.length; index++) {
            let frame = log.frames[index];
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.y > max) {
                    max = sprite.y;
                }
            }
        }
        return max;

    }

    getMinY(spriteName) {

        let min = 0;
        for (let index = 0; index < log.frames.length; index++) {
            let frame = log.frames[index];
            let sprite = getSpriteByName(spriteName, frame);
            if (sprite != null) {
                if (sprite.y < min) {
                    min = sprite.y;
                }
            }
        }
        return min;

    }

    inBounds(spriteName) {

        let WIDTH = 480;
        let HEIGHT = 360;

        let sprite = getSpriteByName(spriteName, log.currentFrame);
        let spritesizeXRadius = Math.floor(sprite.costumeSize[0] * (sprite.size / 100) / 2);
        let spritesizeYRadius = Math.floor(sprite.costumeSize[1] * (sprite.size / 100) / 2);

        console.log(spritesizeYRadius);

        let maxX = this.getMaxX(spriteName);
        let minX = this.getMinX(spriteName);
        let maxY = this.getMaxY(spriteName);
        let minY = this.getMinY(spriteName);

        return (maxX < (WIDTH / 2) - spritesizeXRadius) && (minX > (-WIDTH / 2) + spritesizeXRadius) && (maxY < (HEIGHT / 2) - spritesizeYRadius) && (minY > (-HEIGHT / 2) + spritesizeYRadius);

    }


    isVisibleAtStart(spriteName) {
        return this.isVisible(spriteName, this.getStartSprites());
    }

    isVisibleAtEnd(spriteName) {
        return this.isVisible(spriteName, this.sprites);
    }

    isVisible(spriteName, sprites) {
        let spriteId = this.getSpriteIdByName(spriteName, sprites);
        return isVisible(spriteId, sprites);
    }

    getBlocks(spriteName) {
        let spriteId = this.getSpriteIdByName(spriteName, this.sprites);
        return getBlocks(spriteId, this.sprites);
    }

    getCostumes(spriteName) {
        let costumes = {};
        let costumeIds = new Set();
        for (let frame of log.frames) {
            let sprite = getSpriteByName(spriteName, frame);
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

}

class Events {
    constructor(log) {
        this.events = log.events;
    }

    getEventsByType(type) {
        let result = [];
        for (let event of log.events) {
            if (event.type === type) {
                result.push(event);
            }
        }
        return result;
    }

    getSpriteBeforeEvent(event, spriteName) {
        for (let sprite of event.data.before.sprites) {
            if (sprite.name === spriteName) {
                return sprite;
            }
        }
    }

    getSpriteAfterEvent(event, spriteName) {
        for (let sprite of event.data.after.sprites) {
            if (sprite.name === spriteName) {
                return sprite;
            }
        }
    }
}

class ScratchJudge {

    constructor() {
        this.eventScheduling = new ScratchSimulationEvent().start();
        this.log = {};
        this.blocks = {};
        this.playground = {};
        this.sprites = {};
        this.events = {};
    }

    fill() {
        console.log(log);
        this.log = log;
        this.playground = new Playground(log);
        this.blocks = new AllBlocks(log);
        this.sprites = new Sprites(log);
        this.events = new Events(log);
    }

    start() {
        simulationChain = this.eventScheduling;
    }

    async startEvents() {
        createProfiler();
        start();
        await Scratch.simulationEnd.promise;
        this.fill();
    }

}

const scratch = new ScratchJudge();
let actionTimeout = 5000;

async function runTests() {
    //wait until Scratch project is fully loaded.
    await Scratch.loadedEnd.promise;
    //Execute the prepare function from the evaluation file to create events
    prepare();

    dodona.startTestTab('Resultaat');

    //Execute the scratch project
    dodona.startTestContext();
    await scratch.startEvents();
    dodona.closeTestContext();

    //Create new test context for tests after the execution
    dodona.startTestContext();
    evaluate();
    dodona.closeTestContext();

    dodona.closeTestTab();
    console.log('--- END OF EVALUATION ---');
    return true;
}
