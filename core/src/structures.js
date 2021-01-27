import isEqual from 'lodash-es/isEqual';

export class Sb3Variable {
  constructor(data) {
    /**
     * Name of the variable.
     * @type {string}
     */
    this.name = data.name;
    this.value = data.value;
  }
}

/**
 * @typedef Sb3List
 * @property {string} name
 * @property {Array} list
 */

/**
 * The block format used in project serialisation.
 *
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Blocks
 *
 * @typedef {Object} Sb3Block
 * @property {string} opcode - A string naming the block.
 * @property {string|null} next - The ID of the following block or null.
 * @property {string|null} parent - If the block is a stack block and is preceded, this is
 *              the ID of the preceding block. If the block is the first
 *              stack block in a C mouth, this is the ID of the C block.
 *              If the block is an input to another block, this is the
 *              ID of that other block. Otherwise it is null.
 * @property {boolean} shadow - True if this is a shadow and false otherwise.
 * @property {boolean} topLevel - False if the block has a parent and true otherwise.
 */

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Comments
 *
 * @typedef {Object} Sb3Comment
 * @property {string} blockId
 * @property {number} x
 * @property {number} y
 * @property {number} height
 * @property {number} width
 * @property {boolean} minimized
 * @property {string} text
 */

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Costumes
 * @typedef {Object} Sb3Costume
 * @property {number|null} bitmapResolution
 * @property {number} rotationCenterX
 * @property {number} rotationCenterY
 */

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Sounds
 * @typedef {Object} Sb3Sound
 * @property {number} rate
 * @property {number} sampleCount
 */

/**
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Sounds
 * @typedef {Object} Sb3Monitor
 * @property {string} id
 * @property {"default" | "large" | "slider" | "list"} mode
 * @property {string} opcode
 * @property {Object.<string, *>} params
 * @property {string|null} spriteName
 * @property {*} value
 * @property {number} width
 * @property {number} height
 * @property {number} x
 * @property {number} y
 * @property {boolean} visible
 */

/**
 * The base sprite class, used in the sb3 format.
 *
 * @see https://en.scratch-wiki.info/wiki/Scratch_File_Format#Targets
 */
export class Sb3Target {
  /**
   * @param {Object} data - Original data from the project.json
   */
  constructor(data) {
    /**
     * True if this is the stage and false otherwise.
     * @type {boolean}
     */
    this.isStage = data.isStage;
    /**
     * The name.
     * @type {string}
     */
    this.name = data.name;
    /**
     * An object associating IDs with arrays representing variables whose first element is the variable's name followed by it's value.
     * @type {Object.<string, Sb3Variable>}
     */
    this.variables = {};
    for (const variable of Object.keys(data.variables || {})) {
      this.variables[variable] = new Sb3Variable(data.variables[variable]);
    }
    /**
     * An object associating IDs with arrays representing lists whose first element is the list's name followed by the list as an array.
     * @type {Object.<string, Sb3List>}
     */
    this.lists = data.lists || {};
    /**
     * An object associating IDs with broadcast names.
     * @type {Object.<string, string>}
     */
    this.broadcasts = data.broadcasts || {};
    /**
     * An object associating IDs with blocks.
     * @type {Object.<string, Sb3Block>}
     */
    this.blocks = data.blocks || {};
    /**
     * An object associating IDs with comments.
     * @type {Object.<string, Sb3Comment>}
     */
    this.comments = data.comments || {};
    /**
     * The costume number.
     * @type {number}
     */
    this.currentCostume = data.currentCostume;
    /**
     * An array of costumes.
     * @type {Sb3Costume[]}
     */
    this.costumes = data.costumes;
    /**
     * An array of sounds.
     * @type {Sb3Sound[]}
     */
    this.sounds = data.sounds;
    /** @type {number} */
    this.volume = data.volume;
    /** @type {number} */
    this.layerOrder = data.layerOrder;
  }

  /**
   * Check if this target is equal to another target.
   * @param {Sb3Target} other
   */
  equals(other) {
    return isEqual(this, other);
  }

  /**
   * Deep diff between two object, using lodash
   * @param  {Object} object Object compared
   * @param  {Object} base   Object to compare with
   * @return {Object}        Return a new object who represent the diff
   */
  difference(object, base) {
    function changes(object, base) {
      return _.transform(object, function(result, value, key) {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }
  
  diff(other) {
    return this.difference(this, other);
  }

  /**
   * Check if this sprite contains a block with the given opcode.
   * 
   * @param {string} opcode
   * @return {boolean}
   */
  hasBlock(opcode) {
    let found = null;
    for (const key of Object.keys(this.blocks)) {
      if (this.blocks[key].opcode === opcode) {
        found = this.blocks[key];
        break;
      }
    }
    return found !== null;
  }

  /**
   * Get the first block with opcode.
   * 
   * @param {string} opcode
   * @return {null|Sb3Block}
   */
  getFirst(opcode) {
    let found = null;
    for (const key of Object.keys(this.blocks)) {
      if (this.blocks[key].opcode === opcode) {
        found = this.blocks[key];
        break;
      }
    }
    return found;
  }
}

export class Sb3Stage extends Sb3Target {
  constructor(data) {
    super(data);
    /** @type {number} */
    this.tempo = data.temppo;
    /** @type {number} */
    this.videoTransparency = data.videoTransparency;
    /** @type {"on" | "on)-flipped" | "off"} */
    this.videoState = data.videoState;
    /** @type {string} */
    this.textToSpeechLanguage = data.textToSpeechLanguage;
  }
}

export class Sb3Sprite extends Sb3Target {
  constructor(data) {
    super(data);
    /** @type {boolean} */
    this.visible = data.visible;
    /** @type {number} */
    this.x = data.x;
    /** @type {number} */
    this.y = data.y;
    /** @type {number} */
    this.size = data.size;
    /** @type {number} */
    this.direction = data.direction;
    /** @type {boolean} */
    this.draggable = data.draggable;
    /** @type {"all around" | "left-right" | "don't rotate"} */
    this.rotationStyle = data.rotationStyle;
  }
}

export class Sb3Json {
  constructor(data) {
    /** @type {Sb3Target[]} */
    this.targets = data.targets.map(t => t.isStage ? new Sb3Stage(t) : new Sb3Sprite(t));
    /** @type {Sb3Monitor[]} */
    this.monitors = data.monitors;
    /** @type {Object[]} */
    this.extensions = data.extensions;
    /** @type {Object} */
    this.meta = data.meta;
  }
}
