(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["itch-core"] = factory();
	else
		root["itch-core"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.cjs");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/audio-context/index.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/audio-context/index.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var window = __webpack_require__(/*! global/window */ "../../node_modules/global/window.js")

var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext
var Context = window.AudioContext || window.webkitAudioContext

var cache = {}

module.exports = function getContext (options) {
	if (!Context) return null

	if (typeof options === 'number') {
		options = {sampleRate: options}
	}

	var sampleRate = options && options.sampleRate


	if (options && options.offline) {
		if (!OfflineContext) return null

		return new OfflineContext(options.channels || 2, options.length, sampleRate || 44100)
	}


	//cache by sampleRate, rather strong guess
	var ctx = cache[sampleRate]

	if (ctx) return ctx

	//several versions of firefox have issues with the
	//constructor argument
	//see: https://bugzilla.mozilla.org/show_bug.cgi?id=1361475
	try {
		ctx = new Context(options)
	}
	catch (err) {
		ctx = new Context()
	}
	cache[ctx.sampleRate] = cache[sampleRate] = ctx

	return ctx
}


/***/ }),

/***/ "../../node_modules/events/events.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/events/events.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "../../node_modules/global/window.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/global/window.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/lodash-es/_Promise.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_Promise.js ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ "../../node_modules/lodash-es/_getNative.js");
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ "../../node_modules/lodash-es/_root.js");



/* Built-in method references that are verified to be native. */
var Promise = Object(_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'Promise');

/* harmony default export */ __webpack_exports__["default"] = (Promise);


/***/ }),

/***/ "../../node_modules/lodash-es/_Symbol.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_Symbol.js ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "../../node_modules/lodash-es/_root.js");


/** Built-in value references. */
var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;

/* harmony default export */ __webpack_exports__["default"] = (Symbol);


/***/ }),

/***/ "../../node_modules/lodash-es/_baseGetTag.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_baseGetTag.js ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "../../node_modules/lodash-es/_Symbol.js");
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ "../../node_modules/lodash-es/_getRawTag.js");
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ "../../node_modules/lodash-es/_objectToString.js");




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? Object(_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)
    : Object(_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (baseGetTag);


/***/ }),

/***/ "../../node_modules/lodash-es/_baseIsNative.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_baseIsNative.js ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isFunction.js */ "../../node_modules/lodash-es/isFunction.js");
/* harmony import */ var _isMasked_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isMasked.js */ "../../node_modules/lodash-es/_isMasked.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isObject.js */ "../../node_modules/lodash-es/isObject.js");
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_toSource.js */ "../../node_modules/lodash-es/_toSource.js");





/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!Object(_isObject_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value) || Object(_isMasked_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    return false;
  }
  var pattern = Object(_isFunction_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) ? reIsNative : reIsHostCtor;
  return pattern.test(Object(_toSource_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value));
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsNative);


/***/ }),

/***/ "../../node_modules/lodash-es/_coreJsData.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_coreJsData.js ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ "../../node_modules/lodash-es/_root.js");


/** Used to detect overreaching core-js shims. */
var coreJsData = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"]['__core-js_shared__'];

/* harmony default export */ __webpack_exports__["default"] = (coreJsData);


/***/ }),

/***/ "../../node_modules/lodash-es/_freeGlobal.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_freeGlobal.js ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["default"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/lodash-es/_getNative.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_getNative.js ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseIsNative.js */ "../../node_modules/lodash-es/_baseIsNative.js");
/* harmony import */ var _getValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getValue.js */ "../../node_modules/lodash-es/_getValue.js");



/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = Object(_getValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key);
  return Object(_baseIsNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) ? value : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (getNative);


/***/ }),

/***/ "../../node_modules/lodash-es/_getRawTag.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_getRawTag.js ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ "../../node_modules/lodash-es/_Symbol.js");


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (getRawTag);


/***/ }),

/***/ "../../node_modules/lodash-es/_getValue.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_getValue.js ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/* harmony default export */ __webpack_exports__["default"] = (getValue);


/***/ }),

/***/ "../../node_modules/lodash-es/_isMasked.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_isMasked.js ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_coreJsData.js */ "../../node_modules/lodash-es/_coreJsData.js");


/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__["default"].keys && _coreJsData_js__WEBPACK_IMPORTED_MODULE_0__["default"].keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/* harmony default export */ __webpack_exports__["default"] = (isMasked);


/***/ }),

/***/ "../../node_modules/lodash-es/_objectToString.js":
/*!**********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_objectToString.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/* harmony default export */ __webpack_exports__["default"] = (objectToString);


/***/ }),

/***/ "../../node_modules/lodash-es/_root.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_root.js ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ "../../node_modules/lodash-es/_freeGlobal.js");


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["default"] = (root);


/***/ }),

/***/ "../../node_modules/lodash-es/_toSource.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/_toSource.js ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/* harmony default export */ __webpack_exports__["default"] = (toSource);


/***/ }),

/***/ "../../node_modules/lodash-es/isFunction.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/isFunction.js ***!
  \*****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGetTag.js */ "../../node_modules/lodash-es/_baseGetTag.js");
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ "../../node_modules/lodash-es/isObject.js");



/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!Object(_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = Object(_baseGetTag_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/* harmony default export */ __webpack_exports__["default"] = (isFunction);


/***/ }),

/***/ "../../node_modules/lodash-es/isObject.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash-es/isObject.js ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/* harmony default export */ __webpack_exports__["default"] = (isObject);


/***/ }),

/***/ "../../node_modules/lodash/_DataView.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_DataView.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "../../node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ "../../node_modules/lodash/_Hash.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_Hash.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(/*! ./_hashClear */ "../../node_modules/lodash/_hashClear.js"),
    hashDelete = __webpack_require__(/*! ./_hashDelete */ "../../node_modules/lodash/_hashDelete.js"),
    hashGet = __webpack_require__(/*! ./_hashGet */ "../../node_modules/lodash/_hashGet.js"),
    hashHas = __webpack_require__(/*! ./_hashHas */ "../../node_modules/lodash/_hashHas.js"),
    hashSet = __webpack_require__(/*! ./_hashSet */ "../../node_modules/lodash/_hashSet.js");

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ "../../node_modules/lodash/_ListCache.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_ListCache.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(/*! ./_listCacheClear */ "../../node_modules/lodash/_listCacheClear.js"),
    listCacheDelete = __webpack_require__(/*! ./_listCacheDelete */ "../../node_modules/lodash/_listCacheDelete.js"),
    listCacheGet = __webpack_require__(/*! ./_listCacheGet */ "../../node_modules/lodash/_listCacheGet.js"),
    listCacheHas = __webpack_require__(/*! ./_listCacheHas */ "../../node_modules/lodash/_listCacheHas.js"),
    listCacheSet = __webpack_require__(/*! ./_listCacheSet */ "../../node_modules/lodash/_listCacheSet.js");

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ "../../node_modules/lodash/_Map.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_Map.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "../../node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ "../../node_modules/lodash/_MapCache.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_MapCache.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(/*! ./_mapCacheClear */ "../../node_modules/lodash/_mapCacheClear.js"),
    mapCacheDelete = __webpack_require__(/*! ./_mapCacheDelete */ "../../node_modules/lodash/_mapCacheDelete.js"),
    mapCacheGet = __webpack_require__(/*! ./_mapCacheGet */ "../../node_modules/lodash/_mapCacheGet.js"),
    mapCacheHas = __webpack_require__(/*! ./_mapCacheHas */ "../../node_modules/lodash/_mapCacheHas.js"),
    mapCacheSet = __webpack_require__(/*! ./_mapCacheSet */ "../../node_modules/lodash/_mapCacheSet.js");

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ "../../node_modules/lodash/_Promise.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_Promise.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "../../node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ "../../node_modules/lodash/_Set.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_Set.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "../../node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ "../../node_modules/lodash/_SetCache.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_SetCache.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(/*! ./_MapCache */ "../../node_modules/lodash/_MapCache.js"),
    setCacheAdd = __webpack_require__(/*! ./_setCacheAdd */ "../../node_modules/lodash/_setCacheAdd.js"),
    setCacheHas = __webpack_require__(/*! ./_setCacheHas */ "../../node_modules/lodash/_setCacheHas.js");

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;


/***/ }),

/***/ "../../node_modules/lodash/_Stack.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_Stack.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ "../../node_modules/lodash/_ListCache.js"),
    stackClear = __webpack_require__(/*! ./_stackClear */ "../../node_modules/lodash/_stackClear.js"),
    stackDelete = __webpack_require__(/*! ./_stackDelete */ "../../node_modules/lodash/_stackDelete.js"),
    stackGet = __webpack_require__(/*! ./_stackGet */ "../../node_modules/lodash/_stackGet.js"),
    stackHas = __webpack_require__(/*! ./_stackHas */ "../../node_modules/lodash/_stackHas.js"),
    stackSet = __webpack_require__(/*! ./_stackSet */ "../../node_modules/lodash/_stackSet.js");

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ "../../node_modules/lodash/_Symbol.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_Symbol.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "../../node_modules/lodash/_Uint8Array.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_Uint8Array.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ "../../node_modules/lodash/_WeakMap.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_WeakMap.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "../../node_modules/lodash/_getNative.js"),
    root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ "../../node_modules/lodash/_apply.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_apply.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;


/***/ }),

/***/ "../../node_modules/lodash/_arrayFilter.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_arrayFilter.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ "../../node_modules/lodash/_arrayIncludes.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_arrayIncludes.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ "../../node_modules/lodash/_baseIndexOf.js");

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;


/***/ }),

/***/ "../../node_modules/lodash/_arrayIncludesWith.js":
/*!**********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_arrayIncludesWith.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;


/***/ }),

/***/ "../../node_modules/lodash/_arrayLikeKeys.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_arrayLikeKeys.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(/*! ./_baseTimes */ "../../node_modules/lodash/_baseTimes.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "../../node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "../../node_modules/lodash/isBuffer.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "../../node_modules/lodash/_isIndex.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "../../node_modules/lodash/isTypedArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ "../../node_modules/lodash/_arrayMap.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_arrayMap.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),

/***/ "../../node_modules/lodash/_arrayPush.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_arrayPush.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ "../../node_modules/lodash/_arraySome.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_arraySome.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;


/***/ }),

/***/ "../../node_modules/lodash/_assignValue.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_assignValue.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ "../../node_modules/lodash/_baseAssignValue.js"),
    eq = __webpack_require__(/*! ./eq */ "../../node_modules/lodash/eq.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ "../../node_modules/lodash/_assocIndexOf.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_assocIndexOf.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ "../../node_modules/lodash/eq.js");

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ "../../node_modules/lodash/_baseAssignValue.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseAssignValue.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(/*! ./_defineProperty */ "../../node_modules/lodash/_defineProperty.js");

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ "../../node_modules/lodash/_baseAt.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseAt.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var get = __webpack_require__(/*! ./get */ "../../node_modules/lodash/get.js");

/**
 * The base implementation of `_.at` without support for individual paths.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {string[]} paths The property paths to pick.
 * @returns {Array} Returns the picked elements.
 */
function baseAt(object, paths) {
  var index = -1,
      length = paths.length,
      result = Array(length),
      skip = object == null;

  while (++index < length) {
    result[index] = skip ? undefined : get(object, paths[index]);
  }
  return result;
}

module.exports = baseAt;


/***/ }),

/***/ "../../node_modules/lodash/_baseClamp.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseClamp.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

module.exports = baseClamp;


/***/ }),

/***/ "../../node_modules/lodash/_baseDifference.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseDifference.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "../../node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "../../node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "../../node_modules/lodash/_arrayIncludesWith.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "../../node_modules/lodash/_baseUnary.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "../../node_modules/lodash/_cacheHas.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;


/***/ }),

/***/ "../../node_modules/lodash/_baseFill.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseFill.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js"),
    toLength = __webpack_require__(/*! ./toLength */ "../../node_modules/lodash/toLength.js");

/**
 * The base implementation of `_.fill` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 */
function baseFill(array, value, start, end) {
  var length = array.length;

  start = toInteger(start);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : toInteger(end);
  if (end < 0) {
    end += length;
  }
  end = start > end ? 0 : toLength(end);
  while (start < end) {
    array[start++] = value;
  }
  return array;
}

module.exports = baseFill;


/***/ }),

/***/ "../../node_modules/lodash/_baseFindIndex.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseFindIndex.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),

/***/ "../../node_modules/lodash/_baseFlatten.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseFlatten.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "../../node_modules/lodash/_arrayPush.js"),
    isFlattenable = __webpack_require__(/*! ./_isFlattenable */ "../../node_modules/lodash/_isFlattenable.js");

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;


/***/ }),

/***/ "../../node_modules/lodash/_baseGet.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseGet.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(/*! ./_castPath */ "../../node_modules/lodash/_castPath.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "../../node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),

/***/ "../../node_modules/lodash/_baseGetAllKeys.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseGetAllKeys.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "../../node_modules/lodash/_arrayPush.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js");

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ "../../node_modules/lodash/_baseGetTag.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseGetTag.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "../../node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "../../node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "../../node_modules/lodash/_baseHasIn.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseHasIn.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;


/***/ }),

/***/ "../../node_modules/lodash/_baseIndexOf.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIndexOf.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "../../node_modules/lodash/_baseFindIndex.js"),
    baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ "../../node_modules/lodash/_baseIsNaN.js"),
    strictIndexOf = __webpack_require__(/*! ./_strictIndexOf */ "../../node_modules/lodash/_strictIndexOf.js");

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),

/***/ "../../node_modules/lodash/_baseIndexOfWith.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIndexOfWith.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This function is like `baseIndexOf` except that it accepts a comparator.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOfWith(array, value, fromIndex, comparator) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (comparator(array[index], value)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOfWith;


/***/ }),

/***/ "../../node_modules/lodash/_baseIntersection.js":
/*!*********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIntersection.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "../../node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "../../node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "../../node_modules/lodash/_arrayIncludesWith.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "../../node_modules/lodash/_baseUnary.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "../../node_modules/lodash/_cacheHas.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;


/***/ }),

/***/ "../../node_modules/lodash/_baseIsArguments.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIsArguments.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ "../../node_modules/lodash/_baseIsEqual.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIsEqual.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(/*! ./_baseIsEqualDeep */ "../../node_modules/lodash/_baseIsEqualDeep.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../node_modules/lodash/isObjectLike.js");

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;


/***/ }),

/***/ "../../node_modules/lodash/_baseIsEqualDeep.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIsEqualDeep.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(/*! ./_Stack */ "../../node_modules/lodash/_Stack.js"),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ "../../node_modules/lodash/_equalArrays.js"),
    equalByTag = __webpack_require__(/*! ./_equalByTag */ "../../node_modules/lodash/_equalByTag.js"),
    equalObjects = __webpack_require__(/*! ./_equalObjects */ "../../node_modules/lodash/_equalObjects.js"),
    getTag = __webpack_require__(/*! ./_getTag */ "../../node_modules/lodash/_getTag.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js"),
    isBuffer = __webpack_require__(/*! ./isBuffer */ "../../node_modules/lodash/isBuffer.js"),
    isTypedArray = __webpack_require__(/*! ./isTypedArray */ "../../node_modules/lodash/isTypedArray.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;


/***/ }),

/***/ "../../node_modules/lodash/_baseIsMatch.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIsMatch.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(/*! ./_Stack */ "../../node_modules/lodash/_Stack.js"),
    baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "../../node_modules/lodash/_baseIsEqual.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;


/***/ }),

/***/ "../../node_modules/lodash/_baseIsNaN.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIsNaN.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),

/***/ "../../node_modules/lodash/_baseIsNative.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIsNative.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "../../node_modules/lodash/isFunction.js"),
    isMasked = __webpack_require__(/*! ./_isMasked */ "../../node_modules/lodash/_isMasked.js"),
    isObject = __webpack_require__(/*! ./isObject */ "../../node_modules/lodash/isObject.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "../../node_modules/lodash/_toSource.js");

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ "../../node_modules/lodash/_baseIsTypedArray.js":
/*!*********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIsTypedArray.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../node_modules/lodash/_baseGetTag.js"),
    isLength = __webpack_require__(/*! ./isLength */ "../../node_modules/lodash/isLength.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ "../../node_modules/lodash/_baseIteratee.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseIteratee.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(/*! ./_baseMatches */ "../../node_modules/lodash/_baseMatches.js"),
    baseMatchesProperty = __webpack_require__(/*! ./_baseMatchesProperty */ "../../node_modules/lodash/_baseMatchesProperty.js"),
    identity = __webpack_require__(/*! ./identity */ "../../node_modules/lodash/identity.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js"),
    property = __webpack_require__(/*! ./property */ "../../node_modules/lodash/property.js");

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;


/***/ }),

/***/ "../../node_modules/lodash/_baseKeys.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseKeys.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(/*! ./_isPrototype */ "../../node_modules/lodash/_isPrototype.js"),
    nativeKeys = __webpack_require__(/*! ./_nativeKeys */ "../../node_modules/lodash/_nativeKeys.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ "../../node_modules/lodash/_baseMatches.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseMatches.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(/*! ./_baseIsMatch */ "../../node_modules/lodash/_baseIsMatch.js"),
    getMatchData = __webpack_require__(/*! ./_getMatchData */ "../../node_modules/lodash/_getMatchData.js"),
    matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "../../node_modules/lodash/_matchesStrictComparable.js");

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;


/***/ }),

/***/ "../../node_modules/lodash/_baseMatchesProperty.js":
/*!************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseMatchesProperty.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "../../node_modules/lodash/_baseIsEqual.js"),
    get = __webpack_require__(/*! ./get */ "../../node_modules/lodash/get.js"),
    hasIn = __webpack_require__(/*! ./hasIn */ "../../node_modules/lodash/hasIn.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "../../node_modules/lodash/_isKey.js"),
    isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "../../node_modules/lodash/_isStrictComparable.js"),
    matchesStrictComparable = __webpack_require__(/*! ./_matchesStrictComparable */ "../../node_modules/lodash/_matchesStrictComparable.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "../../node_modules/lodash/_toKey.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;


/***/ }),

/***/ "../../node_modules/lodash/_baseNth.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseNth.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isIndex = __webpack_require__(/*! ./_isIndex */ "../../node_modules/lodash/_isIndex.js");

/**
 * The base implementation of `_.nth` which doesn't coerce arguments.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {number} n The index of the element to return.
 * @returns {*} Returns the nth element of `array`.
 */
function baseNth(array, n) {
  var length = array.length;
  if (!length) {
    return;
  }
  n += n < 0 ? length : 0;
  return isIndex(n, length) ? array[n] : undefined;
}

module.exports = baseNth;


/***/ }),

/***/ "../../node_modules/lodash/_baseProperty.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseProperty.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;


/***/ }),

/***/ "../../node_modules/lodash/_basePropertyDeep.js":
/*!*********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_basePropertyDeep.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(/*! ./_baseGet */ "../../node_modules/lodash/_baseGet.js");

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;


/***/ }),

/***/ "../../node_modules/lodash/_basePullAll.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_basePullAll.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ "../../node_modules/lodash/_baseIndexOf.js"),
    baseIndexOfWith = __webpack_require__(/*! ./_baseIndexOfWith */ "../../node_modules/lodash/_baseIndexOfWith.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "../../node_modules/lodash/_baseUnary.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "../../node_modules/lodash/_copyArray.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * The base implementation of `_.pullAllBy` without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 */
function basePullAll(array, values, iteratee, comparator) {
  var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
      index = -1,
      length = values.length,
      seen = array;

  if (array === values) {
    values = copyArray(values);
  }
  if (iteratee) {
    seen = arrayMap(array, baseUnary(iteratee));
  }
  while (++index < length) {
    var fromIndex = 0,
        value = values[index],
        computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice.call(seen, fromIndex, 1);
      }
      splice.call(array, fromIndex, 1);
    }
  }
  return array;
}

module.exports = basePullAll;


/***/ }),

/***/ "../../node_modules/lodash/_basePullAt.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_basePullAt.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseUnset = __webpack_require__(/*! ./_baseUnset */ "../../node_modules/lodash/_baseUnset.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "../../node_modules/lodash/_isIndex.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * The base implementation of `_.pullAt` without support for individual
 * indexes or capturing the removed elements.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {number[]} indexes The indexes of elements to remove.
 * @returns {Array} Returns `array`.
 */
function basePullAt(array, indexes) {
  var length = array ? indexes.length : 0,
      lastIndex = length - 1;

  while (length--) {
    var index = indexes[length];
    if (length == lastIndex || index !== previous) {
      var previous = index;
      if (isIndex(index)) {
        splice.call(array, index, 1);
      } else {
        baseUnset(array, index);
      }
    }
  }
  return array;
}

module.exports = basePullAt;


/***/ }),

/***/ "../../node_modules/lodash/_baseRest.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseRest.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(/*! ./identity */ "../../node_modules/lodash/identity.js"),
    overRest = __webpack_require__(/*! ./_overRest */ "../../node_modules/lodash/_overRest.js"),
    setToString = __webpack_require__(/*! ./_setToString */ "../../node_modules/lodash/_setToString.js");

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;


/***/ }),

/***/ "../../node_modules/lodash/_baseSet.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseSet.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(/*! ./_assignValue */ "../../node_modules/lodash/_assignValue.js"),
    castPath = __webpack_require__(/*! ./_castPath */ "../../node_modules/lodash/_castPath.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "../../node_modules/lodash/_isIndex.js"),
    isObject = __webpack_require__(/*! ./isObject */ "../../node_modules/lodash/isObject.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "../../node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),

/***/ "../../node_modules/lodash/_baseSetToString.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseSetToString.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(/*! ./constant */ "../../node_modules/lodash/constant.js"),
    defineProperty = __webpack_require__(/*! ./_defineProperty */ "../../node_modules/lodash/_defineProperty.js"),
    identity = __webpack_require__(/*! ./identity */ "../../node_modules/lodash/identity.js");

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;


/***/ }),

/***/ "../../node_modules/lodash/_baseSlice.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseSlice.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),

/***/ "../../node_modules/lodash/_baseSortedIndex.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseSortedIndex.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSortedIndexBy = __webpack_require__(/*! ./_baseSortedIndexBy */ "../../node_modules/lodash/_baseSortedIndexBy.js"),
    identity = __webpack_require__(/*! ./identity */ "../../node_modules/lodash/identity.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "../../node_modules/lodash/isSymbol.js");

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295,
    HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

/**
 * The base implementation of `_.sortedIndex` and `_.sortedLastIndex` which
 * performs a binary search of `array` to determine the index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @private
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {boolean} [retHighest] Specify returning the highest qualified index.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function baseSortedIndex(array, value, retHighest) {
  var low = 0,
      high = array == null ? low : array.length;

  if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
    while (low < high) {
      var mid = (low + high) >>> 1,
          computed = array[mid];

      if (computed !== null && !isSymbol(computed) &&
          (retHighest ? (computed <= value) : (computed < value))) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return high;
  }
  return baseSortedIndexBy(array, value, identity, retHighest);
}

module.exports = baseSortedIndex;


/***/ }),

/***/ "../../node_modules/lodash/_baseSortedIndexBy.js":
/*!**********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseSortedIndexBy.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "../../node_modules/lodash/isSymbol.js");

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295,
    MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
    nativeMin = Math.min;

/**
 * The base implementation of `_.sortedIndexBy` and `_.sortedLastIndexBy`
 * which invokes `iteratee` for `value` and each element of `array` to compute
 * their sort ranking. The iteratee is invoked with one argument; (value).
 *
 * @private
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} iteratee The iteratee invoked per element.
 * @param {boolean} [retHighest] Specify returning the highest qualified index.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function baseSortedIndexBy(array, value, iteratee, retHighest) {
  var low = 0,
      high = array == null ? 0 : array.length;
  if (high === 0) {
    return 0;
  }

  value = iteratee(value);
  var valIsNaN = value !== value,
      valIsNull = value === null,
      valIsSymbol = isSymbol(value),
      valIsUndefined = value === undefined;

  while (low < high) {
    var mid = nativeFloor((low + high) / 2),
        computed = iteratee(array[mid]),
        othIsDefined = computed !== undefined,
        othIsNull = computed === null,
        othIsReflexive = computed === computed,
        othIsSymbol = isSymbol(computed);

    if (valIsNaN) {
      var setLow = retHighest || othIsReflexive;
    } else if (valIsUndefined) {
      setLow = othIsReflexive && (retHighest || othIsDefined);
    } else if (valIsNull) {
      setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
    } else if (valIsSymbol) {
      setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
    } else if (othIsNull || othIsSymbol) {
      setLow = false;
    } else {
      setLow = retHighest ? (computed <= value) : (computed < value);
    }
    if (setLow) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return nativeMin(high, MAX_ARRAY_INDEX);
}

module.exports = baseSortedIndexBy;


/***/ }),

/***/ "../../node_modules/lodash/_baseSortedUniq.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseSortedUniq.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ "../../node_modules/lodash/eq.js");

/**
 * The base implementation of `_.sortedUniq` and `_.sortedUniqBy` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseSortedUniq(array, iteratee) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    if (!index || !eq(computed, seen)) {
      var seen = computed;
      result[resIndex++] = value === 0 ? 0 : value;
    }
  }
  return result;
}

module.exports = baseSortedUniq;


/***/ }),

/***/ "../../node_modules/lodash/_baseTimes.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseTimes.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ "../../node_modules/lodash/_baseToString.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseToString.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../node_modules/lodash/_Symbol.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "../../node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),

/***/ "../../node_modules/lodash/_baseTrim.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseTrim.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var trimmedEndIndex = __webpack_require__(/*! ./_trimmedEndIndex */ "../../node_modules/lodash/_trimmedEndIndex.js");

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),

/***/ "../../node_modules/lodash/_baseUnary.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseUnary.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ "../../node_modules/lodash/_baseUniq.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseUniq.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "../../node_modules/lodash/_SetCache.js"),
    arrayIncludes = __webpack_require__(/*! ./_arrayIncludes */ "../../node_modules/lodash/_arrayIncludes.js"),
    arrayIncludesWith = __webpack_require__(/*! ./_arrayIncludesWith */ "../../node_modules/lodash/_arrayIncludesWith.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "../../node_modules/lodash/_cacheHas.js"),
    createSet = __webpack_require__(/*! ./_createSet */ "../../node_modules/lodash/_createSet.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "../../node_modules/lodash/_setToArray.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;


/***/ }),

/***/ "../../node_modules/lodash/_baseUnset.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseUnset.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(/*! ./_castPath */ "../../node_modules/lodash/_castPath.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js"),
    parent = __webpack_require__(/*! ./_parent */ "../../node_modules/lodash/_parent.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "../../node_modules/lodash/_toKey.js");

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;


/***/ }),

/***/ "../../node_modules/lodash/_baseWhile.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseWhile.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js");

/**
 * The base implementation of methods like `_.dropWhile` and `_.takeWhile`
 * without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to query.
 * @param {Function} predicate The function invoked per iteration.
 * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the slice of `array`.
 */
function baseWhile(array, predicate, isDrop, fromRight) {
  var length = array.length,
      index = fromRight ? length : -1;

  while ((fromRight ? index-- : ++index < length) &&
    predicate(array[index], index, array)) {}

  return isDrop
    ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
    : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
}

module.exports = baseWhile;


/***/ }),

/***/ "../../node_modules/lodash/_baseXor.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseXor.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ "../../node_modules/lodash/_baseDifference.js"),
    baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ "../../node_modules/lodash/_baseUniq.js");

/**
 * The base implementation of methods like `_.xor`, without support for
 * iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of values.
 */
function baseXor(arrays, iteratee, comparator) {
  var length = arrays.length;
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  var index = -1,
      result = Array(length);

  while (++index < length) {
    var array = arrays[index],
        othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}

module.exports = baseXor;


/***/ }),

/***/ "../../node_modules/lodash/_baseZipObject.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_baseZipObject.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This base implementation of `_.zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */
function baseZipObject(props, values, assignFunc) {
  var index = -1,
      length = props.length,
      valsLength = values.length,
      result = {};

  while (++index < length) {
    var value = index < valsLength ? values[index] : undefined;
    assignFunc(result, props[index], value);
  }
  return result;
}

module.exports = baseZipObject;


/***/ }),

/***/ "../../node_modules/lodash/_cacheHas.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_cacheHas.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;


/***/ }),

/***/ "../../node_modules/lodash/_castArrayLikeObject.js":
/*!************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_castArrayLikeObject.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js");

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

module.exports = castArrayLikeObject;


/***/ }),

/***/ "../../node_modules/lodash/_castPath.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_castPath.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "../../node_modules/lodash/_isKey.js"),
    stringToPath = __webpack_require__(/*! ./_stringToPath */ "../../node_modules/lodash/_stringToPath.js"),
    toString = __webpack_require__(/*! ./toString */ "../../node_modules/lodash/toString.js");

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),

/***/ "../../node_modules/lodash/_compareAscending.js":
/*!*********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_compareAscending.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "../../node_modules/lodash/isSymbol.js");

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;


/***/ }),

/***/ "../../node_modules/lodash/_copyArray.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_copyArray.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ "../../node_modules/lodash/_coreJsData.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_coreJsData.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js");

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ "../../node_modules/lodash/_createSet.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_createSet.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Set = __webpack_require__(/*! ./_Set */ "../../node_modules/lodash/_Set.js"),
    noop = __webpack_require__(/*! ./noop */ "../../node_modules/lodash/noop.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "../../node_modules/lodash/_setToArray.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;


/***/ }),

/***/ "../../node_modules/lodash/_defineProperty.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_defineProperty.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "../../node_modules/lodash/_getNative.js");

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ "../../node_modules/lodash/_equalArrays.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_equalArrays.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(/*! ./_SetCache */ "../../node_modules/lodash/_SetCache.js"),
    arraySome = __webpack_require__(/*! ./_arraySome */ "../../node_modules/lodash/_arraySome.js"),
    cacheHas = __webpack_require__(/*! ./_cacheHas */ "../../node_modules/lodash/_cacheHas.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Check that cyclic values are equal.
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;


/***/ }),

/***/ "../../node_modules/lodash/_equalByTag.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_equalByTag.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../node_modules/lodash/_Symbol.js"),
    Uint8Array = __webpack_require__(/*! ./_Uint8Array */ "../../node_modules/lodash/_Uint8Array.js"),
    eq = __webpack_require__(/*! ./eq */ "../../node_modules/lodash/eq.js"),
    equalArrays = __webpack_require__(/*! ./_equalArrays */ "../../node_modules/lodash/_equalArrays.js"),
    mapToArray = __webpack_require__(/*! ./_mapToArray */ "../../node_modules/lodash/_mapToArray.js"),
    setToArray = __webpack_require__(/*! ./_setToArray */ "../../node_modules/lodash/_setToArray.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;


/***/ }),

/***/ "../../node_modules/lodash/_equalObjects.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_equalObjects.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(/*! ./_getAllKeys */ "../../node_modules/lodash/_getAllKeys.js");

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Check that cyclic values are equal.
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;


/***/ }),

/***/ "../../node_modules/lodash/_flatRest.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_flatRest.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var flatten = __webpack_require__(/*! ./flatten */ "../../node_modules/lodash/flatten.js"),
    overRest = __webpack_require__(/*! ./_overRest */ "../../node_modules/lodash/_overRest.js"),
    setToString = __webpack_require__(/*! ./_setToString */ "../../node_modules/lodash/_setToString.js");

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;


/***/ }),

/***/ "../../node_modules/lodash/_freeGlobal.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_freeGlobal.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/lodash/_getAllKeys.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getAllKeys.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ "../../node_modules/lodash/_baseGetAllKeys.js"),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ "../../node_modules/lodash/_getSymbols.js"),
    keys = __webpack_require__(/*! ./keys */ "../../node_modules/lodash/keys.js");

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ "../../node_modules/lodash/_getMapData.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getMapData.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(/*! ./_isKeyable */ "../../node_modules/lodash/_isKeyable.js");

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ "../../node_modules/lodash/_getMatchData.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getMatchData.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(/*! ./_isStrictComparable */ "../../node_modules/lodash/_isStrictComparable.js"),
    keys = __webpack_require__(/*! ./keys */ "../../node_modules/lodash/keys.js");

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;


/***/ }),

/***/ "../../node_modules/lodash/_getNative.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getNative.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(/*! ./_baseIsNative */ "../../node_modules/lodash/_baseIsNative.js"),
    getValue = __webpack_require__(/*! ./_getValue */ "../../node_modules/lodash/_getValue.js");

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ "../../node_modules/lodash/_getRawTag.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getRawTag.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "../../node_modules/lodash/_getSymbols.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getSymbols.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "../../node_modules/lodash/_arrayFilter.js"),
    stubArray = __webpack_require__(/*! ./stubArray */ "../../node_modules/lodash/stubArray.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ "../../node_modules/lodash/_getTag.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getTag.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(/*! ./_DataView */ "../../node_modules/lodash/_DataView.js"),
    Map = __webpack_require__(/*! ./_Map */ "../../node_modules/lodash/_Map.js"),
    Promise = __webpack_require__(/*! ./_Promise */ "../../node_modules/lodash/_Promise.js"),
    Set = __webpack_require__(/*! ./_Set */ "../../node_modules/lodash/_Set.js"),
    WeakMap = __webpack_require__(/*! ./_WeakMap */ "../../node_modules/lodash/_WeakMap.js"),
    baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../node_modules/lodash/_baseGetTag.js"),
    toSource = __webpack_require__(/*! ./_toSource */ "../../node_modules/lodash/_toSource.js");

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ "../../node_modules/lodash/_getValue.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_getValue.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ "../../node_modules/lodash/_hasPath.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_hasPath.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(/*! ./_castPath */ "../../node_modules/lodash/_castPath.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "../../node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "../../node_modules/lodash/_isIndex.js"),
    isLength = __webpack_require__(/*! ./isLength */ "../../node_modules/lodash/isLength.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "../../node_modules/lodash/_toKey.js");

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;


/***/ }),

/***/ "../../node_modules/lodash/_hashClear.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_hashClear.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../node_modules/lodash/_nativeCreate.js");

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ "../../node_modules/lodash/_hashDelete.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_hashDelete.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ "../../node_modules/lodash/_hashGet.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_hashGet.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ "../../node_modules/lodash/_hashHas.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_hashHas.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../node_modules/lodash/_nativeCreate.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ "../../node_modules/lodash/_hashSet.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_hashSet.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(/*! ./_nativeCreate */ "../../node_modules/lodash/_nativeCreate.js");

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ "../../node_modules/lodash/_isFlattenable.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isFlattenable.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ "../../node_modules/lodash/_Symbol.js"),
    isArguments = __webpack_require__(/*! ./isArguments */ "../../node_modules/lodash/isArguments.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js");

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;


/***/ }),

/***/ "../../node_modules/lodash/_isIndex.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isIndex.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ "../../node_modules/lodash/_isIterateeCall.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isIterateeCall.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(/*! ./eq */ "../../node_modules/lodash/eq.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../node_modules/lodash/isArrayLike.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "../../node_modules/lodash/_isIndex.js"),
    isObject = __webpack_require__(/*! ./isObject */ "../../node_modules/lodash/isObject.js");

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),

/***/ "../../node_modules/lodash/_isKey.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isKey.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "../../node_modules/lodash/isSymbol.js");

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),

/***/ "../../node_modules/lodash/_isKeyable.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isKeyable.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ "../../node_modules/lodash/_isMasked.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isMasked.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(/*! ./_coreJsData */ "../../node_modules/lodash/_coreJsData.js");

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ "../../node_modules/lodash/_isPrototype.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isPrototype.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ "../../node_modules/lodash/_isStrictComparable.js":
/*!***********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_isStrictComparable.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ "../../node_modules/lodash/isObject.js");

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;


/***/ }),

/***/ "../../node_modules/lodash/_listCacheClear.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_listCacheClear.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ "../../node_modules/lodash/_listCacheDelete.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_listCacheDelete.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../node_modules/lodash/_assocIndexOf.js");

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ "../../node_modules/lodash/_listCacheGet.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_listCacheGet.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../node_modules/lodash/_assocIndexOf.js");

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ "../../node_modules/lodash/_listCacheHas.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_listCacheHas.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../node_modules/lodash/_assocIndexOf.js");

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ "../../node_modules/lodash/_listCacheSet.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_listCacheSet.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(/*! ./_assocIndexOf */ "../../node_modules/lodash/_assocIndexOf.js");

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ "../../node_modules/lodash/_mapCacheClear.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_mapCacheClear.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(/*! ./_Hash */ "../../node_modules/lodash/_Hash.js"),
    ListCache = __webpack_require__(/*! ./_ListCache */ "../../node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "../../node_modules/lodash/_Map.js");

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ "../../node_modules/lodash/_mapCacheDelete.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_mapCacheDelete.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "../../node_modules/lodash/_getMapData.js");

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ "../../node_modules/lodash/_mapCacheGet.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_mapCacheGet.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "../../node_modules/lodash/_getMapData.js");

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ "../../node_modules/lodash/_mapCacheHas.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_mapCacheHas.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "../../node_modules/lodash/_getMapData.js");

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ "../../node_modules/lodash/_mapCacheSet.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_mapCacheSet.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(/*! ./_getMapData */ "../../node_modules/lodash/_getMapData.js");

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ "../../node_modules/lodash/_mapToArray.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_mapToArray.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;


/***/ }),

/***/ "../../node_modules/lodash/_matchesStrictComparable.js":
/*!****************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_matchesStrictComparable.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;


/***/ }),

/***/ "../../node_modules/lodash/_memoizeCapped.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_memoizeCapped.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(/*! ./memoize */ "../../node_modules/lodash/memoize.js");

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;


/***/ }),

/***/ "../../node_modules/lodash/_nativeCreate.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_nativeCreate.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(/*! ./_getNative */ "../../node_modules/lodash/_getNative.js");

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ "../../node_modules/lodash/_nativeKeys.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_nativeKeys.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(/*! ./_overArg */ "../../node_modules/lodash/_overArg.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ "../../node_modules/lodash/_nodeUtil.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_nodeUtil.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "../../node_modules/lodash/_freeGlobal.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "../../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../../node_modules/lodash/_objectToString.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_objectToString.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "../../node_modules/lodash/_overArg.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_overArg.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ "../../node_modules/lodash/_overRest.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_overRest.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(/*! ./_apply */ "../../node_modules/lodash/_apply.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;


/***/ }),

/***/ "../../node_modules/lodash/_parent.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_parent.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(/*! ./_baseGet */ "../../node_modules/lodash/_baseGet.js"),
    baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js");

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),

/***/ "../../node_modules/lodash/_root.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_root.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "../../node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "../../node_modules/lodash/_setCacheAdd.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_setCacheAdd.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;


/***/ }),

/***/ "../../node_modules/lodash/_setCacheHas.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_setCacheHas.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;


/***/ }),

/***/ "../../node_modules/lodash/_setToArray.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_setToArray.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;


/***/ }),

/***/ "../../node_modules/lodash/_setToString.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_setToString.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(/*! ./_baseSetToString */ "../../node_modules/lodash/_baseSetToString.js"),
    shortOut = __webpack_require__(/*! ./_shortOut */ "../../node_modules/lodash/_shortOut.js");

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;


/***/ }),

/***/ "../../node_modules/lodash/_shortOut.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_shortOut.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;


/***/ }),

/***/ "../../node_modules/lodash/_stackClear.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_stackClear.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ "../../node_modules/lodash/_ListCache.js");

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ "../../node_modules/lodash/_stackDelete.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_stackDelete.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ "../../node_modules/lodash/_stackGet.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_stackGet.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ "../../node_modules/lodash/_stackHas.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_stackHas.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ "../../node_modules/lodash/_stackSet.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_stackSet.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(/*! ./_ListCache */ "../../node_modules/lodash/_ListCache.js"),
    Map = __webpack_require__(/*! ./_Map */ "../../node_modules/lodash/_Map.js"),
    MapCache = __webpack_require__(/*! ./_MapCache */ "../../node_modules/lodash/_MapCache.js");

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ "../../node_modules/lodash/_strictIndexOf.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_strictIndexOf.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),

/***/ "../../node_modules/lodash/_strictLastIndexOf.js":
/*!**********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_strictLastIndexOf.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.lastIndexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictLastIndexOf(array, value, fromIndex) {
  var index = fromIndex + 1;
  while (index--) {
    if (array[index] === value) {
      return index;
    }
  }
  return index;
}

module.exports = strictLastIndexOf;


/***/ }),

/***/ "../../node_modules/lodash/_stringToPath.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_stringToPath.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(/*! ./_memoizeCapped */ "../../node_modules/lodash/_memoizeCapped.js");

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),

/***/ "../../node_modules/lodash/_toKey.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_toKey.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(/*! ./isSymbol */ "../../node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;


/***/ }),

/***/ "../../node_modules/lodash/_toSource.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_toSource.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ "../../node_modules/lodash/_trimmedEndIndex.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/_trimmedEndIndex.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),

/***/ "../../node_modules/lodash/array.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/array.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'chunk': __webpack_require__(/*! ./chunk */ "../../node_modules/lodash/chunk.js"),
  'compact': __webpack_require__(/*! ./compact */ "../../node_modules/lodash/compact.js"),
  'concat': __webpack_require__(/*! ./concat */ "../../node_modules/lodash/concat.js"),
  'difference': __webpack_require__(/*! ./difference */ "../../node_modules/lodash/difference.js"),
  'differenceBy': __webpack_require__(/*! ./differenceBy */ "../../node_modules/lodash/differenceBy.js"),
  'differenceWith': __webpack_require__(/*! ./differenceWith */ "../../node_modules/lodash/differenceWith.js"),
  'drop': __webpack_require__(/*! ./drop */ "../../node_modules/lodash/drop.js"),
  'dropRight': __webpack_require__(/*! ./dropRight */ "../../node_modules/lodash/dropRight.js"),
  'dropRightWhile': __webpack_require__(/*! ./dropRightWhile */ "../../node_modules/lodash/dropRightWhile.js"),
  'dropWhile': __webpack_require__(/*! ./dropWhile */ "../../node_modules/lodash/dropWhile.js"),
  'fill': __webpack_require__(/*! ./fill */ "../../node_modules/lodash/fill.js"),
  'findIndex': __webpack_require__(/*! ./findIndex */ "../../node_modules/lodash/findIndex.js"),
  'findLastIndex': __webpack_require__(/*! ./findLastIndex */ "../../node_modules/lodash/findLastIndex.js"),
  'first': __webpack_require__(/*! ./first */ "../../node_modules/lodash/first.js"),
  'flatten': __webpack_require__(/*! ./flatten */ "../../node_modules/lodash/flatten.js"),
  'flattenDeep': __webpack_require__(/*! ./flattenDeep */ "../../node_modules/lodash/flattenDeep.js"),
  'flattenDepth': __webpack_require__(/*! ./flattenDepth */ "../../node_modules/lodash/flattenDepth.js"),
  'fromPairs': __webpack_require__(/*! ./fromPairs */ "../../node_modules/lodash/fromPairs.js"),
  'head': __webpack_require__(/*! ./head */ "../../node_modules/lodash/head.js"),
  'indexOf': __webpack_require__(/*! ./indexOf */ "../../node_modules/lodash/indexOf.js"),
  'initial': __webpack_require__(/*! ./initial */ "../../node_modules/lodash/initial.js"),
  'intersection': __webpack_require__(/*! ./intersection */ "../../node_modules/lodash/intersection.js"),
  'intersectionBy': __webpack_require__(/*! ./intersectionBy */ "../../node_modules/lodash/intersectionBy.js"),
  'intersectionWith': __webpack_require__(/*! ./intersectionWith */ "../../node_modules/lodash/intersectionWith.js"),
  'join': __webpack_require__(/*! ./join */ "../../node_modules/lodash/join.js"),
  'last': __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js"),
  'lastIndexOf': __webpack_require__(/*! ./lastIndexOf */ "../../node_modules/lodash/lastIndexOf.js"),
  'nth': __webpack_require__(/*! ./nth */ "../../node_modules/lodash/nth.js"),
  'pull': __webpack_require__(/*! ./pull */ "../../node_modules/lodash/pull.js"),
  'pullAll': __webpack_require__(/*! ./pullAll */ "../../node_modules/lodash/pullAll.js"),
  'pullAllBy': __webpack_require__(/*! ./pullAllBy */ "../../node_modules/lodash/pullAllBy.js"),
  'pullAllWith': __webpack_require__(/*! ./pullAllWith */ "../../node_modules/lodash/pullAllWith.js"),
  'pullAt': __webpack_require__(/*! ./pullAt */ "../../node_modules/lodash/pullAt.js"),
  'remove': __webpack_require__(/*! ./remove */ "../../node_modules/lodash/remove.js"),
  'reverse': __webpack_require__(/*! ./reverse */ "../../node_modules/lodash/reverse.js"),
  'slice': __webpack_require__(/*! ./slice */ "../../node_modules/lodash/slice.js"),
  'sortedIndex': __webpack_require__(/*! ./sortedIndex */ "../../node_modules/lodash/sortedIndex.js"),
  'sortedIndexBy': __webpack_require__(/*! ./sortedIndexBy */ "../../node_modules/lodash/sortedIndexBy.js"),
  'sortedIndexOf': __webpack_require__(/*! ./sortedIndexOf */ "../../node_modules/lodash/sortedIndexOf.js"),
  'sortedLastIndex': __webpack_require__(/*! ./sortedLastIndex */ "../../node_modules/lodash/sortedLastIndex.js"),
  'sortedLastIndexBy': __webpack_require__(/*! ./sortedLastIndexBy */ "../../node_modules/lodash/sortedLastIndexBy.js"),
  'sortedLastIndexOf': __webpack_require__(/*! ./sortedLastIndexOf */ "../../node_modules/lodash/sortedLastIndexOf.js"),
  'sortedUniq': __webpack_require__(/*! ./sortedUniq */ "../../node_modules/lodash/sortedUniq.js"),
  'sortedUniqBy': __webpack_require__(/*! ./sortedUniqBy */ "../../node_modules/lodash/sortedUniqBy.js"),
  'tail': __webpack_require__(/*! ./tail */ "../../node_modules/lodash/tail.js"),
  'take': __webpack_require__(/*! ./take */ "../../node_modules/lodash/take.js"),
  'takeRight': __webpack_require__(/*! ./takeRight */ "../../node_modules/lodash/takeRight.js"),
  'takeRightWhile': __webpack_require__(/*! ./takeRightWhile */ "../../node_modules/lodash/takeRightWhile.js"),
  'takeWhile': __webpack_require__(/*! ./takeWhile */ "../../node_modules/lodash/takeWhile.js"),
  'union': __webpack_require__(/*! ./union */ "../../node_modules/lodash/union.js"),
  'unionBy': __webpack_require__(/*! ./unionBy */ "../../node_modules/lodash/unionBy.js"),
  'unionWith': __webpack_require__(/*! ./unionWith */ "../../node_modules/lodash/unionWith.js"),
  'uniq': __webpack_require__(/*! ./uniq */ "../../node_modules/lodash/uniq.js"),
  'uniqBy': __webpack_require__(/*! ./uniqBy */ "../../node_modules/lodash/uniqBy.js"),
  'uniqWith': __webpack_require__(/*! ./uniqWith */ "../../node_modules/lodash/uniqWith.js"),
  'unzip': __webpack_require__(/*! ./unzip */ "../../node_modules/lodash/unzip.js"),
  'unzipWith': __webpack_require__(/*! ./unzipWith */ "../../node_modules/lodash/unzipWith.js"),
  'without': __webpack_require__(/*! ./without */ "../../node_modules/lodash/without.js"),
  'xor': __webpack_require__(/*! ./xor */ "../../node_modules/lodash/xor.js"),
  'xorBy': __webpack_require__(/*! ./xorBy */ "../../node_modules/lodash/xorBy.js"),
  'xorWith': __webpack_require__(/*! ./xorWith */ "../../node_modules/lodash/xorWith.js"),
  'zip': __webpack_require__(/*! ./zip */ "../../node_modules/lodash/zip.js"),
  'zipObject': __webpack_require__(/*! ./zipObject */ "../../node_modules/lodash/zipObject.js"),
  'zipObjectDeep': __webpack_require__(/*! ./zipObjectDeep */ "../../node_modules/lodash/zipObjectDeep.js"),
  'zipWith': __webpack_require__(/*! ./zipWith */ "../../node_modules/lodash/zipWith.js")
};


/***/ }),

/***/ "../../node_modules/lodash/castArray.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/castArray.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js");

/**
 * Casts `value` as an array if it's not one.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Lang
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast array.
 * @example
 *
 * _.castArray(1);
 * // => [1]
 *
 * _.castArray({ 'a': 1 });
 * // => [{ 'a': 1 }]
 *
 * _.castArray('abc');
 * // => ['abc']
 *
 * _.castArray(null);
 * // => [null]
 *
 * _.castArray(undefined);
 * // => [undefined]
 *
 * _.castArray();
 * // => []
 *
 * var array = [1, 2, 3];
 * console.log(_.castArray(array) === array);
 * // => true
 */
function castArray() {
  if (!arguments.length) {
    return [];
  }
  var value = arguments[0];
  return isArray(value) ? value : [value];
}

module.exports = castArray;


/***/ }),

/***/ "../../node_modules/lodash/chunk.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/chunk.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "../../node_modules/lodash/_isIterateeCall.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  var length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, (index += size));
  }
  return result;
}

module.exports = chunk;


/***/ }),

/***/ "../../node_modules/lodash/compact.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/compact.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
function compact(array) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = compact;


/***/ }),

/***/ "../../node_modules/lodash/concat.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/concat.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ "../../node_modules/lodash/_arrayPush.js"),
    baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    copyArray = __webpack_require__(/*! ./_copyArray */ "../../node_modules/lodash/_copyArray.js"),
    isArray = __webpack_require__(/*! ./isArray */ "../../node_modules/lodash/isArray.js");

/**
 * Creates a new array concatenating `array` with any additional arrays
 * and/or values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to concatenate.
 * @param {...*} [values] The values to concatenate.
 * @returns {Array} Returns the new concatenated array.
 * @example
 *
 * var array = [1];
 * var other = _.concat(array, 2, [3], [[4]]);
 *
 * console.log(other);
 * // => [1, 2, 3, [4]]
 *
 * console.log(array);
 * // => [1]
 */
function concat() {
  var length = arguments.length;
  if (!length) {
    return [];
  }
  var args = Array(length - 1),
      array = arguments[0],
      index = length;

  while (index--) {
    args[index - 1] = arguments[index];
  }
  return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}

module.exports = concat;


/***/ }),

/***/ "../../node_modules/lodash/constant.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/constant.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;


/***/ }),

/***/ "../../node_modules/lodash/difference.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/difference.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ "../../node_modules/lodash/_baseDifference.js"),
    baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js");

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;


/***/ }),

/***/ "../../node_modules/lodash/differenceBy.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/differenceBy.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ "../../node_modules/lodash/_baseDifference.js"),
    baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.difference` except that it accepts `iteratee` which
 * is invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The order and references of result values are
 * determined by the first array. The iteratee is invoked with one argument:
 * (value).
 *
 * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */
var differenceBy = baseRest(function(array, values) {
  var iteratee = last(values);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2))
    : [];
});

module.exports = differenceBy;


/***/ }),

/***/ "../../node_modules/lodash/differenceWith.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/differenceWith.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ "../../node_modules/lodash/_baseDifference.js"),
    baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.difference` except that it accepts `comparator`
 * which is invoked to compare elements of `array` to `values`. The order and
 * references of result values are determined by the first array. The comparator
 * is invoked with two arguments: (arrVal, othVal).
 *
 * **Note:** Unlike `_.pullAllWith`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 *
 * _.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }]
 */
var differenceWith = baseRest(function(array, values) {
  var comparator = last(values);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
    : [];
});

module.exports = differenceWith;


/***/ }),

/***/ "../../node_modules/lodash/drop.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/drop.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/**
 * Creates a slice of `array` with `n` elements dropped from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.drop([1, 2, 3]);
 * // => [2, 3]
 *
 * _.drop([1, 2, 3], 2);
 * // => [3]
 *
 * _.drop([1, 2, 3], 5);
 * // => []
 *
 * _.drop([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function drop(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, n < 0 ? 0 : n, length);
}

module.exports = drop;


/***/ }),

/***/ "../../node_modules/lodash/dropRight.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/dropRight.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/**
 * Creates a slice of `array` with `n` elements dropped from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to drop.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.dropRight([1, 2, 3]);
 * // => [1, 2]
 *
 * _.dropRight([1, 2, 3], 2);
 * // => [1]
 *
 * _.dropRight([1, 2, 3], 5);
 * // => []
 *
 * _.dropRight([1, 2, 3], 0);
 * // => [1, 2, 3]
 */
function dropRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = dropRight;


/***/ }),

/***/ "../../node_modules/lodash/dropRightWhile.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/dropRightWhile.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseWhile = __webpack_require__(/*! ./_baseWhile */ "../../node_modules/lodash/_baseWhile.js");

/**
 * Creates a slice of `array` excluding elements dropped from the end.
 * Elements are dropped until `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.dropRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney']
 *
 * // The `_.matches` iteratee shorthand.
 * _.dropRightWhile(users, { 'user': 'pebbles', 'active': false });
 * // => objects for ['barney', 'fred']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.dropRightWhile(users, ['active', false]);
 * // => objects for ['barney']
 *
 * // The `_.property` iteratee shorthand.
 * _.dropRightWhile(users, 'active');
 * // => objects for ['barney', 'fred', 'pebbles']
 */
function dropRightWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate, 3), true, true)
    : [];
}

module.exports = dropRightWhile;


/***/ }),

/***/ "../../node_modules/lodash/dropWhile.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/dropWhile.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseWhile = __webpack_require__(/*! ./_baseWhile */ "../../node_modules/lodash/_baseWhile.js");

/**
 * Creates a slice of `array` excluding elements dropped from the beginning.
 * Elements are dropped until `predicate` returns falsey. The predicate is
 * invoked with three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.dropWhile(users, function(o) { return !o.active; });
 * // => objects for ['pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * _.dropWhile(users, { 'user': 'barney', 'active': false });
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.dropWhile(users, ['active', false]);
 * // => objects for ['pebbles']
 *
 * // The `_.property` iteratee shorthand.
 * _.dropWhile(users, 'active');
 * // => objects for ['barney', 'fred', 'pebbles']
 */
function dropWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate, 3), true)
    : [];
}

module.exports = dropWhile;


/***/ }),

/***/ "../../node_modules/lodash/eq.js":
/*!******************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/eq.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ "../../node_modules/lodash/fill.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/fill.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFill = __webpack_require__(/*! ./_baseFill */ "../../node_modules/lodash/_baseFill.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "../../node_modules/lodash/_isIterateeCall.js");

/**
 * Fills elements of `array` with `value` from `start` up to, but not
 * including, `end`.
 *
 * **Note:** This method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Array
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * _.fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * _.fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */
function fill(array, value, start, end) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }
  return baseFill(array, value, start, end);
}

module.exports = fill;


/***/ }),

/***/ "../../node_modules/lodash/findIndex.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/findIndex.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "../../node_modules/lodash/_baseFindIndex.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;


/***/ }),

/***/ "../../node_modules/lodash/findLastIndex.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/findLastIndex.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "../../node_modules/lodash/_baseFindIndex.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * This method is like `_.findIndex` except that it iterates over elements
 * of `collection` from right to left.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
 * // => 2
 *
 * // The `_.matches` iteratee shorthand.
 * _.findLastIndex(users, { 'user': 'barney', 'active': true });
 * // => 0
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findLastIndex(users, ['active', false]);
 * // => 2
 *
 * // The `_.property` iteratee shorthand.
 * _.findLastIndex(users, 'active');
 * // => 0
 */
function findLastIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = length - 1;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = fromIndex < 0
      ? nativeMax(length + index, 0)
      : nativeMin(index, length - 1);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
}

module.exports = findLastIndex;


/***/ }),

/***/ "../../node_modules/lodash/first.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/first.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./head */ "../../node_modules/lodash/head.js");


/***/ }),

/***/ "../../node_modules/lodash/flatten.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/flatten.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js");

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;


/***/ }),

/***/ "../../node_modules/lodash/flattenDeep.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/flattenDeep.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}

module.exports = flattenDeep;


/***/ }),

/***/ "../../node_modules/lodash/flattenDepth.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/flattenDepth.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/**
 * Recursively flatten `array` up to `depth` times.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @param {number} [depth=1] The maximum recursion depth.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * var array = [1, [2, [3, [4]], 5]];
 *
 * _.flattenDepth(array, 1);
 * // => [1, 2, [3, [4]], 5]
 *
 * _.flattenDepth(array, 2);
 * // => [1, 2, 3, [4], 5]
 */
function flattenDepth(array, depth) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(array, depth);
}

module.exports = flattenDepth;


/***/ }),

/***/ "../../node_modules/lodash/fromPairs.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/fromPairs.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * The inverse of `_.toPairs`; this method returns an object composed
 * from key-value `pairs`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} pairs The key-value pairs.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.fromPairs([['a', 1], ['b', 2]]);
 * // => { 'a': 1, 'b': 2 }
 */
function fromPairs(pairs) {
  var index = -1,
      length = pairs == null ? 0 : pairs.length,
      result = {};

  while (++index < length) {
    var pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}

module.exports = fromPairs;


/***/ }),

/***/ "../../node_modules/lodash/get.js":
/*!*******************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/get.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(/*! ./_baseGet */ "../../node_modules/lodash/_baseGet.js");

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ "../../node_modules/lodash/hasIn.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/hasIn.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(/*! ./_baseHasIn */ "../../node_modules/lodash/_baseHasIn.js"),
    hasPath = __webpack_require__(/*! ./_hasPath */ "../../node_modules/lodash/_hasPath.js");

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;


/***/ }),

/***/ "../../node_modules/lodash/head.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/head.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return (array && array.length) ? array[0] : undefined;
}

module.exports = head;


/***/ }),

/***/ "../../node_modules/lodash/identity.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/identity.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),

/***/ "../../node_modules/lodash/indexOf.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/indexOf.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(/*! ./_baseIndexOf */ "../../node_modules/lodash/_baseIndexOf.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found in `array`
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it's used as the
 * offset from the end of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.indexOf([1, 2, 1, 2], 2);
 * // => 1
 *
 * // Search from the `fromIndex`.
 * _.indexOf([1, 2, 1, 2], 2, 2);
 * // => 3
 */
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}

module.exports = indexOf;


/***/ }),

/***/ "../../node_modules/lodash/initial.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/initial.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js");

/**
 * Gets all but the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 */
function initial(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 0, -1) : [];
}

module.exports = initial;


/***/ }),

/***/ "../../node_modules/lodash/intersection.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/intersection.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseIntersection = __webpack_require__(/*! ./_baseIntersection */ "../../node_modules/lodash/_baseIntersection.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    castArrayLikeObject = __webpack_require__(/*! ./_castArrayLikeObject */ "../../node_modules/lodash/_castArrayLikeObject.js");

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

module.exports = intersection;


/***/ }),

/***/ "../../node_modules/lodash/intersectionBy.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/intersectionBy.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseIntersection = __webpack_require__(/*! ./_baseIntersection */ "../../node_modules/lodash/_baseIntersection.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    castArrayLikeObject = __webpack_require__(/*! ./_castArrayLikeObject */ "../../node_modules/lodash/_castArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.intersection` except that it accepts `iteratee`
 * which is invoked for each element of each `arrays` to generate the criterion
 * by which they're compared. The order and references of result values are
 * determined by the first array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [2.1]
 *
 * // The `_.property` iteratee shorthand.
 * _.intersectionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }]
 */
var intersectionBy = baseRest(function(arrays) {
  var iteratee = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  if (iteratee === last(mapped)) {
    iteratee = undefined;
  } else {
    mapped.pop();
  }
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped, baseIteratee(iteratee, 2))
    : [];
});

module.exports = intersectionBy;


/***/ }),

/***/ "../../node_modules/lodash/intersectionWith.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/intersectionWith.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseIntersection = __webpack_require__(/*! ./_baseIntersection */ "../../node_modules/lodash/_baseIntersection.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    castArrayLikeObject = __webpack_require__(/*! ./_castArrayLikeObject */ "../../node_modules/lodash/_castArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.intersection` except that it accepts `comparator`
 * which is invoked to compare elements of `arrays`. The order and references
 * of result values are determined by the first array. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.intersectionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }]
 */
var intersectionWith = baseRest(function(arrays) {
  var comparator = last(arrays),
      mapped = arrayMap(arrays, castArrayLikeObject);

  comparator = typeof comparator == 'function' ? comparator : undefined;
  if (comparator) {
    mapped.pop();
  }
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped, undefined, comparator)
    : [];
});

module.exports = intersectionWith;


/***/ }),

/***/ "../../node_modules/lodash/isArguments.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isArguments.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(/*! ./_baseIsArguments */ "../../node_modules/lodash/_baseIsArguments.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../node_modules/lodash/isObjectLike.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ "../../node_modules/lodash/isArray.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isArray.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ "../../node_modules/lodash/isArrayLike.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isArrayLike.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(/*! ./isFunction */ "../../node_modules/lodash/isFunction.js"),
    isLength = __webpack_require__(/*! ./isLength */ "../../node_modules/lodash/isLength.js");

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ "../../node_modules/lodash/isArrayLikeObject.js":
/*!*********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isArrayLikeObject.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../node_modules/lodash/isArrayLike.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../node_modules/lodash/isObjectLike.js");

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;


/***/ }),

/***/ "../../node_modules/lodash/isBuffer.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isBuffer.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(/*! ./_root */ "../../node_modules/lodash/_root.js"),
    stubFalse = __webpack_require__(/*! ./stubFalse */ "../../node_modules/lodash/stubFalse.js");

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "../../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../../node_modules/lodash/isEqual.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isEqual.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ "../../node_modules/lodash/_baseIsEqual.js");

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;


/***/ }),

/***/ "../../node_modules/lodash/isFunction.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isFunction.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../node_modules/lodash/_baseGetTag.js"),
    isObject = __webpack_require__(/*! ./isObject */ "../../node_modules/lodash/isObject.js");

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ "../../node_modules/lodash/isLength.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isLength.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ "../../node_modules/lodash/isObject.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isObject.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "../../node_modules/lodash/isObjectLike.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isObjectLike.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "../../node_modules/lodash/isSymbol.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isSymbol.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "../../node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "../../node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "../../node_modules/lodash/isTypedArray.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/isTypedArray.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(/*! ./_baseIsTypedArray */ "../../node_modules/lodash/_baseIsTypedArray.js"),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ "../../node_modules/lodash/_baseUnary.js"),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ "../../node_modules/lodash/_nodeUtil.js");

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ "../../node_modules/lodash/join.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/join.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeJoin = arrayProto.join;

/**
 * Converts all elements in `array` into a string separated by `separator`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to convert.
 * @param {string} [separator=','] The element separator.
 * @returns {string} Returns the joined string.
 * @example
 *
 * _.join(['a', 'b', 'c'], '~');
 * // => 'a~b~c'
 */
function join(array, separator) {
  return array == null ? '' : nativeJoin.call(array, separator);
}

module.exports = join;


/***/ }),

/***/ "../../node_modules/lodash/keys.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/keys.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ "../../node_modules/lodash/_arrayLikeKeys.js"),
    baseKeys = __webpack_require__(/*! ./_baseKeys */ "../../node_modules/lodash/_baseKeys.js"),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ "../../node_modules/lodash/isArrayLike.js");

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ "../../node_modules/lodash/last.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/last.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),

/***/ "../../node_modules/lodash/lastIndexOf.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/lastIndexOf.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(/*! ./_baseFindIndex */ "../../node_modules/lodash/_baseFindIndex.js"),
    baseIsNaN = __webpack_require__(/*! ./_baseIsNaN */ "../../node_modules/lodash/_baseIsNaN.js"),
    strictLastIndexOf = __webpack_require__(/*! ./_strictLastIndexOf */ "../../node_modules/lodash/_strictLastIndexOf.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * This method is like `_.indexOf` except that it iterates over elements of
 * `array` from right to left.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=array.length-1] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.lastIndexOf([1, 2, 1, 2], 2);
 * // => 3
 *
 * // Search from the `fromIndex`.
 * _.lastIndexOf([1, 2, 1, 2], 2, 2);
 * // => 1
 */
function lastIndexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = length;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
  }
  return value === value
    ? strictLastIndexOf(array, value, index)
    : baseFindIndex(array, baseIsNaN, index, true);
}

module.exports = lastIndexOf;


/***/ }),

/***/ "../../node_modules/lodash/memoize.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/memoize.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(/*! ./_MapCache */ "../../node_modules/lodash/_MapCache.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;


/***/ }),

/***/ "../../node_modules/lodash/noop.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/noop.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),

/***/ "../../node_modules/lodash/nth.js":
/*!*******************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/nth.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseNth = __webpack_require__(/*! ./_baseNth */ "../../node_modules/lodash/_baseNth.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/**
 * Gets the element at index `n` of `array`. If `n` is negative, the nth
 * element from the end is returned.
 *
 * @static
 * @memberOf _
 * @since 4.11.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=0] The index of the element to return.
 * @returns {*} Returns the nth element of `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 *
 * _.nth(array, 1);
 * // => 'b'
 *
 * _.nth(array, -2);
 * // => 'c';
 */
function nth(array, n) {
  return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
}

module.exports = nth;


/***/ }),

/***/ "../../node_modules/lodash/property.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/property.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(/*! ./_baseProperty */ "../../node_modules/lodash/_baseProperty.js"),
    basePropertyDeep = __webpack_require__(/*! ./_basePropertyDeep */ "../../node_modules/lodash/_basePropertyDeep.js"),
    isKey = __webpack_require__(/*! ./_isKey */ "../../node_modules/lodash/_isKey.js"),
    toKey = __webpack_require__(/*! ./_toKey */ "../../node_modules/lodash/_toKey.js");

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;


/***/ }),

/***/ "../../node_modules/lodash/pull.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/pull.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    pullAll = __webpack_require__(/*! ./pullAll */ "../../node_modules/lodash/pullAll.js");

/**
 * Removes all given values from `array` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
 * to remove elements from an array by predicate.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...*} [values] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pull(array, 'a', 'c');
 * console.log(array);
 * // => ['b', 'b']
 */
var pull = baseRest(pullAll);

module.exports = pull;


/***/ }),

/***/ "../../node_modules/lodash/pullAll.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/pullAll.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var basePullAll = __webpack_require__(/*! ./_basePullAll */ "../../node_modules/lodash/_basePullAll.js");

/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */
function pullAll(array, values) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values)
    : array;
}

module.exports = pullAll;


/***/ }),

/***/ "../../node_modules/lodash/pullAllBy.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/pullAllBy.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    basePullAll = __webpack_require__(/*! ./_basePullAll */ "../../node_modules/lodash/_basePullAll.js");

/**
 * This method is like `_.pullAll` except that it accepts `iteratee` which is
 * invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The iteratee is invoked with one argument: (value).
 *
 * **Note:** Unlike `_.differenceBy`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
 *
 * _.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
 * console.log(array);
 * // => [{ 'x': 2 }]
 */
function pullAllBy(array, values, iteratee) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values, baseIteratee(iteratee, 2))
    : array;
}

module.exports = pullAllBy;


/***/ }),

/***/ "../../node_modules/lodash/pullAllWith.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/pullAllWith.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var basePullAll = __webpack_require__(/*! ./_basePullAll */ "../../node_modules/lodash/_basePullAll.js");

/**
 * This method is like `_.pullAll` except that it accepts `comparator` which
 * is invoked to compare elements of `array` to `values`. The comparator is
 * invoked with two arguments: (arrVal, othVal).
 *
 * **Note:** Unlike `_.differenceWith`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.6.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
 *
 * _.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
 * console.log(array);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
 */
function pullAllWith(array, values, comparator) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values, undefined, comparator)
    : array;
}

module.exports = pullAllWith;


/***/ }),

/***/ "../../node_modules/lodash/pullAt.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/pullAt.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseAt = __webpack_require__(/*! ./_baseAt */ "../../node_modules/lodash/_baseAt.js"),
    basePullAt = __webpack_require__(/*! ./_basePullAt */ "../../node_modules/lodash/_basePullAt.js"),
    compareAscending = __webpack_require__(/*! ./_compareAscending */ "../../node_modules/lodash/_compareAscending.js"),
    flatRest = __webpack_require__(/*! ./_flatRest */ "../../node_modules/lodash/_flatRest.js"),
    isIndex = __webpack_require__(/*! ./_isIndex */ "../../node_modules/lodash/_isIndex.js");

/**
 * Removes elements from `array` corresponding to `indexes` and returns an
 * array of removed elements.
 *
 * **Note:** Unlike `_.at`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...(number|number[])} [indexes] The indexes of elements to remove.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = ['a', 'b', 'c', 'd'];
 * var pulled = _.pullAt(array, [1, 3]);
 *
 * console.log(array);
 * // => ['a', 'c']
 *
 * console.log(pulled);
 * // => ['b', 'd']
 */
var pullAt = flatRest(function(array, indexes) {
  var length = array == null ? 0 : array.length,
      result = baseAt(array, indexes);

  basePullAt(array, arrayMap(indexes, function(index) {
    return isIndex(index, length) ? +index : index;
  }).sort(compareAscending));

  return result;
});

module.exports = pullAt;


/***/ }),

/***/ "../../node_modules/lodash/remove.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/remove.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    basePullAt = __webpack_require__(/*! ./_basePullAt */ "../../node_modules/lodash/_basePullAt.js");

/**
 * Removes all elements from `array` that `predicate` returns truthy for
 * and returns an array of the removed elements. The predicate is invoked
 * with three arguments: (value, index, array).
 *
 * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
 * to pull elements from an array by value.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new array of removed elements.
 * @example
 *
 * var array = [1, 2, 3, 4];
 * var evens = _.remove(array, function(n) {
 *   return n % 2 == 0;
 * });
 *
 * console.log(array);
 * // => [1, 3]
 *
 * console.log(evens);
 * // => [2, 4]
 */
function remove(array, predicate) {
  var result = [];
  if (!(array && array.length)) {
    return result;
  }
  var index = -1,
      indexes = [],
      length = array.length;

  predicate = baseIteratee(predicate, 3);
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result.push(value);
      indexes.push(index);
    }
  }
  basePullAt(array, indexes);
  return result;
}

module.exports = remove;


/***/ }),

/***/ "../../node_modules/lodash/reverse.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/reverse.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeReverse = arrayProto.reverse;

/**
 * Reverses `array` so that the first element becomes the last, the second
 * element becomes the second to last, and so on.
 *
 * **Note:** This method mutates `array` and is based on
 * [`Array#reverse`](https://mdn.io/Array/reverse).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.reverse(array);
 * // => [3, 2, 1]
 *
 * console.log(array);
 * // => [3, 2, 1]
 */
function reverse(array) {
  return array == null ? array : nativeReverse.call(array);
}

module.exports = reverse;


/***/ }),

/***/ "../../node_modules/lodash/slice.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/slice.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js"),
    isIterateeCall = __webpack_require__(/*! ./_isIterateeCall */ "../../node_modules/lodash/_isIterateeCall.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/**
 * Creates a slice of `array` from `start` up to, but not including, `end`.
 *
 * **Note:** This method is used instead of
 * [`Array#slice`](https://mdn.io/Array/slice) to ensure dense arrays are
 * returned.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function slice(array, start, end) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
    start = 0;
    end = length;
  }
  else {
    start = start == null ? 0 : toInteger(start);
    end = end === undefined ? length : toInteger(end);
  }
  return baseSlice(array, start, end);
}

module.exports = slice;


/***/ }),

/***/ "../../node_modules/lodash/sortedIndex.js":
/*!***************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedIndex.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSortedIndex = __webpack_require__(/*! ./_baseSortedIndex */ "../../node_modules/lodash/_baseSortedIndex.js");

/**
 * Uses a binary search to determine the lowest index at which `value`
 * should be inserted into `array` in order to maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedIndex([30, 50], 40);
 * // => 1
 */
function sortedIndex(array, value) {
  return baseSortedIndex(array, value);
}

module.exports = sortedIndex;


/***/ }),

/***/ "../../node_modules/lodash/sortedIndexBy.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedIndexBy.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseSortedIndexBy = __webpack_require__(/*! ./_baseSortedIndexBy */ "../../node_modules/lodash/_baseSortedIndexBy.js");

/**
 * This method is like `_.sortedIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedIndexBy(objects, { 'x': 4 }, 'x');
 * // => 0
 */
function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2));
}

module.exports = sortedIndexBy;


/***/ }),

/***/ "../../node_modules/lodash/sortedIndexOf.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedIndexOf.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSortedIndex = __webpack_require__(/*! ./_baseSortedIndex */ "../../node_modules/lodash/_baseSortedIndex.js"),
    eq = __webpack_require__(/*! ./eq */ "../../node_modules/lodash/eq.js");

/**
 * This method is like `_.indexOf` except that it performs a binary
 * search on a sorted `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.sortedIndexOf([4, 5, 5, 5, 6], 5);
 * // => 1
 */
function sortedIndexOf(array, value) {
  var length = array == null ? 0 : array.length;
  if (length) {
    var index = baseSortedIndex(array, value);
    if (index < length && eq(array[index], value)) {
      return index;
    }
  }
  return -1;
}

module.exports = sortedIndexOf;


/***/ }),

/***/ "../../node_modules/lodash/sortedLastIndex.js":
/*!*******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedLastIndex.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSortedIndex = __webpack_require__(/*! ./_baseSortedIndex */ "../../node_modules/lodash/_baseSortedIndex.js");

/**
 * This method is like `_.sortedIndex` except that it returns the highest
 * index at which `value` should be inserted into `array` in order to
 * maintain its sort order.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * _.sortedLastIndex([4, 5, 5, 5, 6], 5);
 * // => 4
 */
function sortedLastIndex(array, value) {
  return baseSortedIndex(array, value, true);
}

module.exports = sortedLastIndex;


/***/ }),

/***/ "../../node_modules/lodash/sortedLastIndexBy.js":
/*!*********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedLastIndexBy.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseSortedIndexBy = __webpack_require__(/*! ./_baseSortedIndexBy */ "../../node_modules/lodash/_baseSortedIndexBy.js");

/**
 * This method is like `_.sortedLastIndex` except that it accepts `iteratee`
 * which is invoked for `value` and each element of `array` to compute their
 * sort ranking. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 * @example
 *
 * var objects = [{ 'x': 4 }, { 'x': 5 }];
 *
 * _.sortedLastIndexBy(objects, { 'x': 4 }, function(o) { return o.x; });
 * // => 1
 *
 * // The `_.property` iteratee shorthand.
 * _.sortedLastIndexBy(objects, { 'x': 4 }, 'x');
 * // => 1
 */
function sortedLastIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2), true);
}

module.exports = sortedLastIndexBy;


/***/ }),

/***/ "../../node_modules/lodash/sortedLastIndexOf.js":
/*!*********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedLastIndexOf.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSortedIndex = __webpack_require__(/*! ./_baseSortedIndex */ "../../node_modules/lodash/_baseSortedIndex.js"),
    eq = __webpack_require__(/*! ./eq */ "../../node_modules/lodash/eq.js");

/**
 * This method is like `_.lastIndexOf` except that it performs a binary
 * search on a sorted `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.sortedLastIndexOf([4, 5, 5, 5, 6], 5);
 * // => 3
 */
function sortedLastIndexOf(array, value) {
  var length = array == null ? 0 : array.length;
  if (length) {
    var index = baseSortedIndex(array, value, true) - 1;
    if (eq(array[index], value)) {
      return index;
    }
  }
  return -1;
}

module.exports = sortedLastIndexOf;


/***/ }),

/***/ "../../node_modules/lodash/sortedUniq.js":
/*!**************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedUniq.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSortedUniq = __webpack_require__(/*! ./_baseSortedUniq */ "../../node_modules/lodash/_baseSortedUniq.js");

/**
 * This method is like `_.uniq` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniq([1, 1, 2]);
 * // => [1, 2]
 */
function sortedUniq(array) {
  return (array && array.length)
    ? baseSortedUniq(array)
    : [];
}

module.exports = sortedUniq;


/***/ }),

/***/ "../../node_modules/lodash/sortedUniqBy.js":
/*!****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/sortedUniqBy.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseSortedUniq = __webpack_require__(/*! ./_baseSortedUniq */ "../../node_modules/lodash/_baseSortedUniq.js");

/**
 * This method is like `_.uniqBy` except that it's designed and optimized
 * for sorted arrays.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor);
 * // => [1.1, 2.3]
 */
function sortedUniqBy(array, iteratee) {
  return (array && array.length)
    ? baseSortedUniq(array, baseIteratee(iteratee, 2))
    : [];
}

module.exports = sortedUniqBy;


/***/ }),

/***/ "../../node_modules/lodash/stubArray.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/stubArray.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ "../../node_modules/lodash/stubFalse.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/stubFalse.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ "../../node_modules/lodash/tail.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/tail.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js");

/**
 * Gets all but the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.tail([1, 2, 3]);
 * // => [2, 3]
 */
function tail(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 1, length) : [];
}

module.exports = tail;


/***/ }),

/***/ "../../node_modules/lodash/take.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/take.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;


/***/ }),

/***/ "../../node_modules/lodash/takeRight.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/takeRight.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(/*! ./_baseSlice */ "../../node_modules/lodash/_baseSlice.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/**
 * Creates a slice of `array` with `n` elements taken from the end.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.takeRight([1, 2, 3]);
 * // => [3]
 *
 * _.takeRight([1, 2, 3], 2);
 * // => [2, 3]
 *
 * _.takeRight([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.takeRight([1, 2, 3], 0);
 * // => []
 */
function takeRight(array, n, guard) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  return baseSlice(array, n < 0 ? 0 : n, length);
}

module.exports = takeRight;


/***/ }),

/***/ "../../node_modules/lodash/takeRightWhile.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/takeRightWhile.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseWhile = __webpack_require__(/*! ./_baseWhile */ "../../node_modules/lodash/_baseWhile.js");

/**
 * Creates a slice of `array` with elements taken from the end. Elements are
 * taken until `predicate` returns falsey. The predicate is invoked with
 * three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': true },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': false }
 * ];
 *
 * _.takeRightWhile(users, function(o) { return !o.active; });
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.matches` iteratee shorthand.
 * _.takeRightWhile(users, { 'user': 'pebbles', 'active': false });
 * // => objects for ['pebbles']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.takeRightWhile(users, ['active', false]);
 * // => objects for ['fred', 'pebbles']
 *
 * // The `_.property` iteratee shorthand.
 * _.takeRightWhile(users, 'active');
 * // => []
 */
function takeRightWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate, 3), false, true)
    : [];
}

module.exports = takeRightWhile;


/***/ }),

/***/ "../../node_modules/lodash/takeWhile.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/takeWhile.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseWhile = __webpack_require__(/*! ./_baseWhile */ "../../node_modules/lodash/_baseWhile.js");

/**
 * Creates a slice of `array` with elements taken from the beginning. Elements
 * are taken until `predicate` returns falsey. The predicate is invoked with
 * three arguments: (value, index, array).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.takeWhile(users, function(o) { return !o.active; });
 * // => objects for ['barney', 'fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.takeWhile(users, { 'user': 'barney', 'active': false });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.takeWhile(users, ['active', false]);
 * // => objects for ['barney', 'fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.takeWhile(users, 'active');
 * // => []
 */
function takeWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, baseIteratee(predicate, 3))
    : [];
}

module.exports = takeWhile;


/***/ }),

/***/ "../../node_modules/lodash/toFinite.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/toFinite.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(/*! ./toNumber */ "../../node_modules/lodash/toNumber.js");

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),

/***/ "../../node_modules/lodash/toInteger.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/toInteger.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(/*! ./toFinite */ "../../node_modules/lodash/toFinite.js");

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),

/***/ "../../node_modules/lodash/toLength.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/toLength.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseClamp = __webpack_require__(/*! ./_baseClamp */ "../../node_modules/lodash/_baseClamp.js"),
    toInteger = __webpack_require__(/*! ./toInteger */ "../../node_modules/lodash/toInteger.js");

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * **Note:** This method is based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toLength(3.2);
 * // => 3
 *
 * _.toLength(Number.MIN_VALUE);
 * // => 0
 *
 * _.toLength(Infinity);
 * // => 4294967295
 *
 * _.toLength('3.2');
 * // => 3
 */
function toLength(value) {
  return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
}

module.exports = toLength;


/***/ }),

/***/ "../../node_modules/lodash/toNumber.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/toNumber.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseTrim = __webpack_require__(/*! ./_baseTrim */ "../../node_modules/lodash/_baseTrim.js"),
    isObject = __webpack_require__(/*! ./isObject */ "../../node_modules/lodash/isObject.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "../../node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ "../../node_modules/lodash/toString.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/toString.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(/*! ./_baseToString */ "../../node_modules/lodash/_baseToString.js");

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),

/***/ "../../node_modules/lodash/union.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/union.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ "../../node_modules/lodash/_baseUniq.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js");

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = baseRest(function(arrays) {
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
});

module.exports = union;


/***/ }),

/***/ "../../node_modules/lodash/unionBy.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/unionBy.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ "../../node_modules/lodash/_baseUniq.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.union` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which uniqueness is computed. Result values are chosen from the first
 * array in which the value occurs. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.unionBy([2.1], [1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.unionBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
var unionBy = baseRest(function(arrays) {
  var iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2));
});

module.exports = unionBy;


/***/ }),

/***/ "../../node_modules/lodash/unionWith.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/unionWith.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(/*! ./_baseFlatten */ "../../node_modules/lodash/_baseFlatten.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ "../../node_modules/lodash/_baseUniq.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.union` except that it accepts `comparator` which
 * is invoked to compare elements of `arrays`. Result values are chosen from
 * the first array in which the value occurs. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.unionWith(objects, others, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */
var unionWith = baseRest(function(arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined, comparator);
});

module.exports = unionWith;


/***/ }),

/***/ "../../node_modules/lodash/uniq.js":
/*!********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/uniq.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseUniq = __webpack_require__(/*! ./_baseUniq */ "../../node_modules/lodash/_baseUniq.js");

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}

module.exports = uniq;


/***/ }),

/***/ "../../node_modules/lodash/uniqBy.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/uniqBy.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseUniq = __webpack_require__(/*! ./_baseUniq */ "../../node_modules/lodash/_baseUniq.js");

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The order of result values is determined by the
 * order they occur in the array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
  return (array && array.length) ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
}

module.exports = uniqBy;


/***/ }),

/***/ "../../node_modules/lodash/uniqWith.js":
/*!************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/uniqWith.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseUniq = __webpack_require__(/*! ./_baseUniq */ "../../node_modules/lodash/_baseUniq.js");

/**
 * This method is like `_.uniq` except that it accepts `comparator` which
 * is invoked to compare elements of `array`. The order of result values is
 * determined by the order they occur in the array.The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.uniqWith(objects, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 */
function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
}

module.exports = uniqWith;


/***/ }),

/***/ "../../node_modules/lodash/unzip.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/unzip.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "../../node_modules/lodash/_arrayFilter.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    baseProperty = __webpack_require__(/*! ./_baseProperty */ "../../node_modules/lodash/_baseProperty.js"),
    baseTimes = __webpack_require__(/*! ./_baseTimes */ "../../node_modules/lodash/_baseTimes.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js");

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * _.unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 */
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }
  var length = 0;
  array = arrayFilter(array, function(group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function(index) {
    return arrayMap(array, baseProperty(index));
  });
}

module.exports = unzip;


/***/ }),

/***/ "../../node_modules/lodash/unzipWith.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/unzipWith.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(/*! ./_apply */ "../../node_modules/lodash/_apply.js"),
    arrayMap = __webpack_require__(/*! ./_arrayMap */ "../../node_modules/lodash/_arrayMap.js"),
    unzip = __webpack_require__(/*! ./unzip */ "../../node_modules/lodash/unzip.js");

/**
 * This method is like `_.unzip` except that it accepts `iteratee` to specify
 * how regrouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  regrouped values.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
 * // => [[1, 10, 100], [2, 20, 200]]
 *
 * _.unzipWith(zipped, _.add);
 * // => [3, 30, 300]
 */
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }
  var result = unzip(array);
  if (iteratee == null) {
    return result;
  }
  return arrayMap(result, function(group) {
    return apply(iteratee, undefined, group);
  });
}

module.exports = unzipWith;


/***/ }),

/***/ "../../node_modules/lodash/without.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/without.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(/*! ./_baseDifference */ "../../node_modules/lodash/_baseDifference.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js");

/**
 * Creates an array excluding all given values using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.pull`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...*} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.xor
 * @example
 *
 * _.without([2, 1, 2, 3], 1, 2);
 * // => [3]
 */
var without = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, values)
    : [];
});

module.exports = without;


/***/ }),

/***/ "../../node_modules/lodash/xor.js":
/*!*******************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/xor.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "../../node_modules/lodash/_arrayFilter.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    baseXor = __webpack_require__(/*! ./_baseXor */ "../../node_modules/lodash/_baseXor.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js");

/**
 * Creates an array of unique values that is the
 * [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
 * of the given arrays. The order of result values is determined by the order
 * they occur in the arrays.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.difference, _.without
 * @example
 *
 * _.xor([2, 1], [2, 3]);
 * // => [1, 3]
 */
var xor = baseRest(function(arrays) {
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
});

module.exports = xor;


/***/ }),

/***/ "../../node_modules/lodash/xorBy.js":
/*!*********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/xorBy.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "../../node_modules/lodash/_arrayFilter.js"),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ "../../node_modules/lodash/_baseIteratee.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    baseXor = __webpack_require__(/*! ./_baseXor */ "../../node_modules/lodash/_baseXor.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.xor` except that it accepts `iteratee` which is
 * invoked for each element of each `arrays` to generate the criterion by
 * which by which they're compared. The order of result values is determined
 * by the order they occur in the arrays. The iteratee is invoked with one
 * argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * _.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2, 3.4]
 *
 * // The `_.property` iteratee shorthand.
 * _.xorBy([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 2 }]
 */
var xorBy = baseRest(function(arrays) {
  var iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee, 2));
});

module.exports = xorBy;


/***/ }),

/***/ "../../node_modules/lodash/xorWith.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/xorWith.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(/*! ./_arrayFilter */ "../../node_modules/lodash/_arrayFilter.js"),
    baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    baseXor = __webpack_require__(/*! ./_baseXor */ "../../node_modules/lodash/_baseXor.js"),
    isArrayLikeObject = __webpack_require__(/*! ./isArrayLikeObject */ "../../node_modules/lodash/isArrayLikeObject.js"),
    last = __webpack_require__(/*! ./last */ "../../node_modules/lodash/last.js");

/**
 * This method is like `_.xor` except that it accepts `comparator` which is
 * invoked to compare elements of `arrays`. The order of result values is
 * determined by the order they occur in the arrays. The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 * var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.xorWith(objects, others, _.isEqual);
 * // => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
 */
var xorWith = baseRest(function(arrays) {
  var comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
});

module.exports = xorWith;


/***/ }),

/***/ "../../node_modules/lodash/zip.js":
/*!*******************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/zip.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    unzip = __webpack_require__(/*! ./unzip */ "../../node_modules/lodash/unzip.js");

/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 */
var zip = baseRest(unzip);

module.exports = zip;


/***/ }),

/***/ "../../node_modules/lodash/zipObject.js":
/*!*************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/zipObject.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(/*! ./_assignValue */ "../../node_modules/lodash/_assignValue.js"),
    baseZipObject = __webpack_require__(/*! ./_baseZipObject */ "../../node_modules/lodash/_baseZipObject.js");

/**
 * This method is like `_.fromPairs` except that it accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 0.4.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObject(['a', 'b'], [1, 2]);
 * // => { 'a': 1, 'b': 2 }
 */
function zipObject(props, values) {
  return baseZipObject(props || [], values || [], assignValue);
}

module.exports = zipObject;


/***/ }),

/***/ "../../node_modules/lodash/zipObjectDeep.js":
/*!*****************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/zipObjectDeep.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseSet = __webpack_require__(/*! ./_baseSet */ "../../node_modules/lodash/_baseSet.js"),
    baseZipObject = __webpack_require__(/*! ./_baseZipObject */ "../../node_modules/lodash/_baseZipObject.js");

/**
 * This method is like `_.zipObject` except that it supports property paths.
 *
 * @static
 * @memberOf _
 * @since 4.1.0
 * @category Array
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 * @returns {Object} Returns the new object.
 * @example
 *
 * _.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]);
 * // => { 'a': { 'b': [{ 'c': 1 }, { 'd': 2 }] } }
 */
function zipObjectDeep(props, values) {
  return baseZipObject(props || [], values || [], baseSet);
}

module.exports = zipObjectDeep;


/***/ }),

/***/ "../../node_modules/lodash/zipWith.js":
/*!***********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/lodash/zipWith.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(/*! ./_baseRest */ "../../node_modules/lodash/_baseRest.js"),
    unzipWith = __webpack_require__(/*! ./unzipWith */ "../../node_modules/lodash/unzipWith.js");

/**
 * This method is like `_.zip` except that it accepts `iteratee` to specify
 * how grouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @static
 * @memberOf _
 * @since 3.8.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @param {Function} [iteratee=_.identity] The function to combine
 *  grouped values.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
 *   return a + b + c;
 * });
 * // => [111, 222]
 */
var zipWith = baseRest(function(arrays) {
  var length = arrays.length,
      iteratee = length > 1 ? arrays[length - 1] : undefined;

  iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
  return unzipWith(arrays, iteratee);
});

module.exports = zipWith;


/***/ }),

/***/ "../../node_modules/microee/index.js":
/*!**********************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/microee/index.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function M() { this._events = {}; }
M.prototype = {
  on: function(ev, cb) {
    this._events || (this._events = {});
    var e = this._events;
    (e[ev] || (e[ev] = [])).push(cb);
    return this;
  },
  removeListener: function(ev, cb) {
    var e = this._events[ev] || [], i;
    for(i = e.length-1; i >= 0 && e[i]; i--){
      if(e[i] === cb || e[i].cb === cb) { e.splice(i, 1); }
    }
  },
  removeAllListeners: function(ev) {
    if(!ev) { this._events = {}; }
    else { this._events[ev] && (this._events[ev] = []); }
  },
  listeners: function(ev) {
    return (this._events ? this._events[ev] || [] : []);
  },
  emit: function(ev) {
    this._events || (this._events = {});
    var args = Array.prototype.slice.call(arguments, 1), i, e = this._events[ev] || [];
    for(i = e.length-1; i >= 0 && e[i]; i--){
      e[i].apply(this, args);
    }
    return this;
  },
  when: function(ev, cb) {
    return this.once(ev, cb, true);
  },
  once: function(ev, cb, when) {
    if(!cb) return this;
    function c() {
      if(!when) this.removeListener(ev, c);
      if(cb.apply(this, arguments) && when) this.removeListener(ev, c);
    }
    c.cb = cb;
    this.on(ev, c);
    return this;
  }
};
M.mixin = function(dest) {
  var o = M.prototype, k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};
module.exports = M;


/***/ }),

/***/ "../../node_modules/minilog/lib/common/filter.js":
/*!**********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/common/filter.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// default filter
var Transform = __webpack_require__(/*! ./transform.js */ "../../node_modules/minilog/lib/common/transform.js");

var levelMap = { debug: 1, info: 2, warn: 3, error: 4 };

function Filter() {
  this.enabled = true;
  this.defaultResult = true;
  this.clear();
}

Transform.mixin(Filter);

// allow all matching, with level >= given level
Filter.prototype.allow = function(name, level) {
  this._white.push({ n: name, l: levelMap[level] });
  return this;
};

// deny all matching, with level <= given level
Filter.prototype.deny = function(name, level) {
  this._black.push({ n: name, l: levelMap[level] });
  return this;
};

Filter.prototype.clear = function() {
  this._white = [];
  this._black = [];
  return this;
};

function test(rule, name) {
  // use .test for RegExps
  return (rule.n.test ? rule.n.test(name) : rule.n == name);
};

Filter.prototype.test = function(name, level) {
  var i, len = Math.max(this._white.length, this._black.length);
  for(i = 0; i < len; i++) {
    if(this._white[i] && test(this._white[i], name) && levelMap[level] >= this._white[i].l) {
      return true;
    }
    if(this._black[i] && test(this._black[i], name) && levelMap[level] <= this._black[i].l) {
      return false;
    }
  }
  return this.defaultResult;
};

Filter.prototype.write = function(name, level, args) {
  if(!this.enabled || this.test(name, level)) {
    return this.emit('item', name, level, args);
  }
};

module.exports = Filter;


/***/ }),

/***/ "../../node_modules/minilog/lib/common/minilog.js":
/*!***********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/common/minilog.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Transform = __webpack_require__(/*! ./transform.js */ "../../node_modules/minilog/lib/common/transform.js"),
    Filter = __webpack_require__(/*! ./filter.js */ "../../node_modules/minilog/lib/common/filter.js");

var log = new Transform(),
    slice = Array.prototype.slice;

exports = module.exports = function create(name) {
  var o   = function() { log.write(name, undefined, slice.call(arguments)); return o; };
  o.debug = function() { log.write(name, 'debug', slice.call(arguments)); return o; };
  o.info  = function() { log.write(name, 'info',  slice.call(arguments)); return o; };
  o.warn  = function() { log.write(name, 'warn',  slice.call(arguments)); return o; };
  o.error = function() { log.write(name, 'error', slice.call(arguments)); return o; };
  o.log   = o.debug; // for interface compliance with Node and browser consoles
  o.suggest = exports.suggest;
  o.format = log.format;
  return o;
};

// filled in separately
exports.defaultBackend = exports.defaultFormatter = null;

exports.pipe = function(dest) {
  return log.pipe(dest);
};

exports.end = exports.unpipe = exports.disable = function(from) {
  return log.unpipe(from);
};

exports.Transform = Transform;
exports.Filter = Filter;
// this is the default filter that's applied when .enable() is called normally
// you can bypass it completely and set up your own pipes
exports.suggest = new Filter();

exports.enable = function() {
  if(exports.defaultFormatter) {
    return log.pipe(exports.suggest) // filter
              .pipe(exports.defaultFormatter) // formatter
              .pipe(exports.defaultBackend); // backend
  }
  return log.pipe(exports.suggest) // filter
            .pipe(exports.defaultBackend); // formatter
};



/***/ }),

/***/ "../../node_modules/minilog/lib/common/transform.js":
/*!*************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/common/transform.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var microee = __webpack_require__(/*! microee */ "../../node_modules/microee/index.js");

// Implements a subset of Node's stream.Transform - in a cross-platform manner.
function Transform() {}

microee.mixin(Transform);

// The write() signature is different from Node's
// --> makes it much easier to work with objects in logs.
// One of the lessons from v1 was that it's better to target
// a good browser rather than the lowest common denominator
// internally.
// If you want to use external streams, pipe() to ./stringify.js first.
Transform.prototype.write = function(name, level, args) {
  this.emit('item', name, level, args);
};

Transform.prototype.end = function() {
  this.emit('end');
  this.removeAllListeners();
};

Transform.prototype.pipe = function(dest) {
  var s = this;
  // prevent double piping
  s.emit('unpipe', dest);
  // tell the dest that it's being piped to
  dest.emit('pipe', s);

  function onItem() {
    dest.write.apply(dest, Array.prototype.slice.call(arguments));
  }
  function onEnd() { !dest._isStdio && dest.end(); }

  s.on('item', onItem);
  s.on('end', onEnd);

  s.when('unpipe', function(from) {
    var match = (from === dest) || typeof from == 'undefined';
    if(match) {
      s.removeListener('item', onItem);
      s.removeListener('end', onEnd);
      dest.emit('unpipe');
    }
    return match;
  });

  return dest;
};

Transform.prototype.unpipe = function(from) {
  this.emit('unpipe', from);
  return this;
};

Transform.prototype.format = function(dest) {
  throw new Error([
    'Warning: .format() is deprecated in Minilog v2! Use .pipe() instead. For example:',
    'var Minilog = require(\'minilog\');',
    'Minilog',
    '  .pipe(Minilog.backends.console.formatClean)',
    '  .pipe(Minilog.backends.console);'].join('\n'));
};

Transform.mixin = function(dest) {
  var o = Transform.prototype, k;
  for (k in o) {
    o.hasOwnProperty(k) && (dest.prototype[k] = o[k]);
  }
};

module.exports = Transform;


/***/ }),

/***/ "../../node_modules/minilog/lib/web/array.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/array.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Transform = __webpack_require__(/*! ../common/transform.js */ "../../node_modules/minilog/lib/common/transform.js"),
    cache = [ ];

var logger = new Transform();

logger.write = function(name, level, args) {
  cache.push([ name, level, args ]);
};

// utility functions
logger.get = function() { return cache; };
logger.empty = function() { cache = []; };

module.exports = logger;


/***/ }),

/***/ "../../node_modules/minilog/lib/web/console.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/console.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Transform = __webpack_require__(/*! ../common/transform.js */ "../../node_modules/minilog/lib/common/transform.js");

var newlines = /\n+$/,
    logger = new Transform();

logger.write = function(name, level, args) {
  var i = args.length-1;
  if (typeof console === 'undefined' || !console.log) {
    return;
  }
  if(console.log.apply) {
    return console.log.apply(console, [name, level].concat(args));
  } else if(JSON && JSON.stringify) {
    // console.log.apply is undefined in IE8 and IE9
    // for IE8/9: make console.log at least a bit less awful
    if(args[i] && typeof args[i] == 'string') {
      args[i] = args[i].replace(newlines, '');
    }
    try {
      for(i = 0; i < args.length; i++) {
        args[i] = JSON.stringify(args[i]);
      }
    } catch(e) {}
    console.log(args.join(' '));
  }
};

logger.formatters = ['color', 'minilog'];
logger.color = __webpack_require__(/*! ./formatters/color.js */ "../../node_modules/minilog/lib/web/formatters/color.js");
logger.minilog = __webpack_require__(/*! ./formatters/minilog.js */ "../../node_modules/minilog/lib/web/formatters/minilog.js");

module.exports = logger;


/***/ }),

/***/ "../../node_modules/minilog/lib/web/formatters/color.js":
/*!*****************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/formatters/color.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Transform = __webpack_require__(/*! ../../common/transform.js */ "../../node_modules/minilog/lib/common/transform.js"),
    color = __webpack_require__(/*! ./util.js */ "../../node_modules/minilog/lib/web/formatters/util.js");

var colors = { debug: ['cyan'], info: ['purple' ], warn: [ 'yellow', true ], error: [ 'red', true ] },
    logger = new Transform();

logger.write = function(name, level, args) {
  var fn = console.log;
  if(console[level] && console[level].apply) {
    fn = console[level];
    fn.apply(console, [ '%c'+name+' %c'+level, color('gray'), color.apply(color, colors[level])].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger.pipe = function() { };

module.exports = logger;


/***/ }),

/***/ "../../node_modules/minilog/lib/web/formatters/minilog.js":
/*!*******************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/formatters/minilog.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Transform = __webpack_require__(/*! ../../common/transform.js */ "../../node_modules/minilog/lib/common/transform.js"),
    color = __webpack_require__(/*! ./util.js */ "../../node_modules/minilog/lib/web/formatters/util.js"),
    colors = { debug: ['gray'], info: ['purple' ], warn: [ 'yellow', true ], error: [ 'red', true ] },
    logger = new Transform();

logger.write = function(name, level, args) {
  var fn = console.log;
  if(level != 'debug' && console[level]) {
    fn = console[level];
  }

  var subset = [], i = 0;
  if(level != 'info') {
    for(; i < args.length; i++) {
      if(typeof args[i] != 'string') break;
    }
    fn.apply(console, [ '%c'+name +' '+ args.slice(0, i).join(' '), color.apply(color, colors[level]) ].concat(args.slice(i)));
  } else {
    fn.apply(console, [ '%c'+name, color.apply(color, colors[level]) ].concat(args));
  }
};

// NOP, because piping the formatted logs can only cause trouble.
logger.pipe = function() { };

module.exports = logger;


/***/ }),

/***/ "../../node_modules/minilog/lib/web/formatters/util.js":
/*!****************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/formatters/util.js ***!
  \****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hex = {
  black: '#000',
  red: '#c23621',
  green: '#25bc26',
  yellow: '#bbbb00',
  blue:  '#492ee1',
  magenta: '#d338d3',
  cyan: '#33bbc8',
  gray: '#808080',
  purple: '#708'
};
function color(fg, isInverse) {
  if(isInverse) {
    return 'color: #fff; background: '+hex[fg]+';';
  } else {
    return 'color: '+hex[fg]+';';
  }
}

module.exports = color;


/***/ }),

/***/ "../../node_modules/minilog/lib/web/index.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/index.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Minilog = __webpack_require__(/*! ../common/minilog.js */ "../../node_modules/minilog/lib/common/minilog.js");

var oldEnable = Minilog.enable,
    oldDisable = Minilog.disable,
    isChrome = (typeof navigator != 'undefined' && /chrome/i.test(navigator.userAgent)),
    console = __webpack_require__(/*! ./console.js */ "../../node_modules/minilog/lib/web/console.js");

// Use a more capable logging backend if on Chrome
Minilog.defaultBackend = (isChrome ? console.minilog : console);

// apply enable inputs from localStorage and from the URL
if(typeof window != 'undefined') {
  try {
    Minilog.enable(JSON.parse(window.localStorage['minilogSettings']));
  } catch(e) {}
  if(window.location && window.location.search) {
    var match = RegExp('[?&]minilog=([^&]*)').exec(window.location.search);
    match && Minilog.enable(decodeURIComponent(match[1]));
  }
}

// Make enable also add to localStorage
Minilog.enable = function() {
  oldEnable.call(Minilog, true);
  try { window.localStorage['minilogSettings'] = JSON.stringify(true); } catch(e) {}
  return this;
};

Minilog.disable = function() {
  oldDisable.call(Minilog);
  try { delete window.localStorage.minilogSettings; } catch(e) {}
  return this;
};

exports = module.exports = Minilog;

exports.backends = {
  array: __webpack_require__(/*! ./array.js */ "../../node_modules/minilog/lib/web/array.js"),
  browser: Minilog.defaultBackend,
  localStorage: __webpack_require__(/*! ./localstorage.js */ "../../node_modules/minilog/lib/web/localstorage.js"),
  jQuery: __webpack_require__(/*! ./jquery_simple.js */ "../../node_modules/minilog/lib/web/jquery_simple.js")
};


/***/ }),

/***/ "../../node_modules/minilog/lib/web/jquery_simple.js":
/*!**************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/jquery_simple.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Transform = __webpack_require__(/*! ../common/transform.js */ "../../node_modules/minilog/lib/common/transform.js");

var cid = new Date().valueOf().toString(36);

function AjaxLogger(options) {
  this.url = options.url || '';
  this.cache = [];
  this.timer = null;
  this.interval = options.interval || 30*1000;
  this.enabled = true;
  this.jQuery = window.jQuery;
  this.extras = {};
}

Transform.mixin(AjaxLogger);

AjaxLogger.prototype.write = function(name, level, args) {
  if(!this.timer) { this.init(); }
  this.cache.push([name, level].concat(args));
};

AjaxLogger.prototype.init = function() {
  if(!this.enabled || !this.jQuery) return;
  var self = this;
  this.timer = setTimeout(function() {
    var i, logs = [], ajaxData, url = self.url;
    if(self.cache.length == 0) return self.init();
    // Test each log line and only log the ones that are valid (e.g. don't have circular references).
    // Slight performance hit but benefit is we log all valid lines.
    for(i = 0; i < self.cache.length; i++) {
      try {
        JSON.stringify(self.cache[i]);
        logs.push(self.cache[i]);
      } catch(e) { }
    }
    if(self.jQuery.isEmptyObject(self.extras)) {
        ajaxData = JSON.stringify({ logs: logs });
        url = self.url + '?client_id=' + cid;
    } else {
        ajaxData = JSON.stringify(self.jQuery.extend({logs: logs}, self.extras));
    }

    self.jQuery.ajax(url, {
      type: 'POST',
      cache: false,
      processData: false,
      data: ajaxData,
      contentType: 'application/json',
      timeout: 10000
    }).success(function(data, status, jqxhr) {
      if(data.interval) {
        self.interval = Math.max(1000, data.interval);
      }
    }).error(function() {
      self.interval = 30000;
    }).always(function() {
      self.init();
    });
    self.cache = [];
  }, this.interval);
};

AjaxLogger.prototype.end = function() {};

// wait until jQuery is defined. Useful if you don't control the load order.
AjaxLogger.jQueryWait = function(onDone) {
  if(typeof window !== 'undefined' && (window.jQuery || window.$)) {
    return onDone(window.jQuery || window.$);
  } else if (typeof window !== 'undefined') {
    setTimeout(function() { AjaxLogger.jQueryWait(onDone); }, 200);
  }
};

module.exports = AjaxLogger;


/***/ }),

/***/ "../../node_modules/minilog/lib/web/localstorage.js":
/*!*************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/minilog/lib/web/localstorage.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Transform = __webpack_require__(/*! ../common/transform.js */ "../../node_modules/minilog/lib/common/transform.js"),
    cache = false;

var logger = new Transform();

logger.write = function(name, level, args) {
  if(typeof window == 'undefined' || typeof JSON == 'undefined' || !JSON.stringify || !JSON.parse) return;
  try {
    if(!cache) { cache = (window.localStorage.minilog ? JSON.parse(window.localStorage.minilog) : []); }
    cache.push([ new Date().toString(), name, level, args ]);
    window.localStorage.minilog = JSON.stringify(cache);
  } catch(e) {}
};

module.exports = logger;

/***/ }),

/***/ "../../node_modules/regenerator-runtime/runtime.js":
/*!************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/regenerator-runtime/runtime.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);


/***/ }),

/***/ "../../node_modules/scratch-audio/src/ADPCMSoundDecoder.js":
/*!********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/ADPCMSoundDecoder.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const ArrayBufferStream = __webpack_require__(/*! ./ArrayBufferStream */ "../../node_modules/scratch-audio/src/ArrayBufferStream.js");
const log = __webpack_require__(/*! ./log */ "../../node_modules/scratch-audio/src/log.js");

/**
 * Data used by the decompression algorithm
 * @type {Array}
 */
const STEP_TABLE = [
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230,
    253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963,
    1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327,
    3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487,
    12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
];

/**
 * Data used by the decompression algorithm
 * @type {Array}
 */
const INDEX_TABLE = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
];

let _deltaTable = null;

/**
 * Build a table of deltas from the 89 possible steps and 16 codes.
 * @return {Array<number>} computed delta values
 */
const deltaTable = function () {
    if (_deltaTable === null) {
        const NUM_STEPS = STEP_TABLE.length;
        const NUM_INDICES = INDEX_TABLE.length;
        _deltaTable = new Array(NUM_STEPS * NUM_INDICES).fill(0);
        let i = 0;

        for (let index = 0; index < NUM_STEPS; index++) {
            for (let code = 0; code < NUM_INDICES; code++) {
                const step = STEP_TABLE[index];

                let delta = 0;
                if (code & 4) delta += step;
                if (code & 2) delta += step >> 1;
                if (code & 1) delta += step >> 2;
                delta += step >> 3;
                _deltaTable[i++] = (code & 8) ? -delta : delta;
            }
        }
    }

    return _deltaTable;
};

/**
 * Decode wav audio files that have been compressed with the ADPCM format.
 * This is necessary because, while web browsers have native decoders for many audio
 * formats, ADPCM is a non-standard format used by Scratch since its early days.
 * This decoder is based on code from Scratch-Flash:
 * https://github.com/LLK/scratch-flash/blob/master/src/sound/WAVFile.as
 */
class ADPCMSoundDecoder {
    /**
     * @param {AudioContext} audioContext - a webAudio context
     * @constructor
     */
    constructor (audioContext) {
        this.audioContext = audioContext;
    }

    /**
     * Data used by the decompression algorithm
     * @type {Array}
     */
    static get STEP_TABLE () {
        return STEP_TABLE;
    }

    /**
     * Data used by the decompression algorithm
     * @type {Array}
     */
    static get INDEX_TABLE () {
        return INDEX_TABLE;
    }

    /**
     * Decode an ADPCM sound stored in an ArrayBuffer and return a promise
     * with the decoded audio buffer.
     * @param  {ArrayBuffer} audioData - containing ADPCM encoded wav audio
     * @return {AudioBuffer} the decoded audio buffer
     */
    decode (audioData) {

        return new Promise((resolve, reject) => {
            const stream = new ArrayBufferStream(audioData);

            const riffStr = stream.readUint8String(4);
            if (riffStr !== 'RIFF') {
                log.warn('incorrect adpcm wav header');
                reject();
            }

            const lengthInHeader = stream.readInt32();
            if ((lengthInHeader + 8) !== audioData.byteLength) {
                log.warn(`adpcm wav length in header: ${lengthInHeader} is incorrect`);
            }

            const wavStr = stream.readUint8String(4);
            if (wavStr !== 'WAVE') {
                log.warn('incorrect adpcm wav header');
                reject();
            }

            const formatChunk = this.extractChunk('fmt ', stream);
            this.encoding = formatChunk.readUint16();
            this.channels = formatChunk.readUint16();
            this.samplesPerSecond = formatChunk.readUint32();
            this.bytesPerSecond = formatChunk.readUint32();
            this.blockAlignment = formatChunk.readUint16();
            this.bitsPerSample = formatChunk.readUint16();
            formatChunk.position += 2;  // skip extra header byte count
            this.samplesPerBlock = formatChunk.readUint16();
            this.adpcmBlockSize = ((this.samplesPerBlock - 1) / 2) + 4; // block size in bytes

            const compressedData = this.extractChunk('data', stream);
            const sampleCount = this.numberOfSamples(compressedData, this.adpcmBlockSize);

            const buffer = this.audioContext.createBuffer(1, sampleCount, this.samplesPerSecond);
            this.imaDecompress(compressedData, this.adpcmBlockSize, buffer.getChannelData(0));

            resolve(buffer);
        });
    }

    /**
     * Extract a chunk of audio data from the stream, consisting of a set of audio data bytes
     * @param  {string} chunkType - the type of chunk to extract. 'data' or 'fmt' (format)
     * @param  {ArrayBufferStream} stream - an stream containing the audio data
     * @return {ArrayBufferStream} a stream containing the desired chunk
     */
    extractChunk (chunkType, stream) {
        stream.position = 12;
        while (stream.position < (stream.getLength() - 8)) {
            const typeStr = stream.readUint8String(4);
            const chunkSize = stream.readInt32();
            if (typeStr === chunkType) {
                const chunk = stream.extract(chunkSize);
                return chunk;
            }
            stream.position += chunkSize;

        }
    }

    /**
     * Count the exact number of samples in the compressed data.
     * @param {ArrayBufferStream} compressedData - the compressed data
     * @param {number} blockSize - size of each block in the data in bytes
     * @return {number} number of samples in the compressed data
     */
    numberOfSamples (compressedData, blockSize) {
        if (!compressedData) return 0;

        compressedData.position = 0;

        const available = compressedData.getBytesAvailable();
        const blocks = (available / blockSize) | 0;
        // Number of samples in full blocks.
        const fullBlocks = blocks * (2 * (blockSize - 4)) + 1;
        // Number of samples in the last incomplete block. 0 if the last block
        // is full.
        const subBlock = Math.max((available % blockSize) - 4, 0) * 2;
        // 1 if the last block is incomplete. 0 if it is complete.
        const incompleteBlock = Math.min(available % blockSize, 1);
        return fullBlocks + subBlock + incompleteBlock;
    }

    /**
     * Decompress sample data using the IMA ADPCM algorithm.
     * Note: Handles only one channel, 4-bits per sample.
     * @param  {ArrayBufferStream} compressedData - a stream of compressed audio samples
     * @param  {number} blockSize - the number of bytes in the stream
     * @param  {Float32Array} out - the uncompressed audio samples
     */
    imaDecompress (compressedData, blockSize, out) {
        let sample;
        let code;
        let delta;
        let index = 0;
        let lastByte = -1; // -1 indicates that there is no saved lastByte

        // Bail and return no samples if we have no data
        if (!compressedData) return;

        compressedData.position = 0;

        const size = out.length;
        const samplesAfterBlockHeader = (blockSize - 4) * 2;

        const DELTA_TABLE = deltaTable();

        let i = 0;
        while (i < size) {
            // read block header
            sample = compressedData.readInt16();
            index = compressedData.readUint8();
            compressedData.position++; // skip extra header byte
            if (index > 88) index = 88;
            out[i++] = sample / 32768;

            const blockLength = Math.min(samplesAfterBlockHeader, size - i);
            const blockStart = i;
            while (i - blockStart < blockLength) {
                // read 4-bit code and compute delta from previous sample
                lastByte = compressedData.readUint8();
                code = lastByte & 0xF;
                delta = DELTA_TABLE[index * 16 + code];
                // compute next index
                index += INDEX_TABLE[code];
                if (index > 88) index = 88;
                else if (index < 0) index = 0;
                // compute and output sample
                sample += delta;
                if (sample > 32767) sample = 32767;
                else if (sample < -32768) sample = -32768;
                out[i++] = sample / 32768;

                // use 4-bit code from lastByte and compute delta from previous
                // sample
                code = (lastByte >> 4) & 0xF;
                delta = DELTA_TABLE[index * 16 + code];
                // compute next index
                index += INDEX_TABLE[code];
                if (index > 88) index = 88;
                else if (index < 0) index = 0;
                // compute and output sample
                sample += delta;
                if (sample > 32767) sample = 32767;
                else if (sample < -32768) sample = -32768;
                out[i++] = sample / 32768;
            }
        }
    }
}

module.exports = ADPCMSoundDecoder;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/ArrayBufferStream.js":
/*!********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/ArrayBufferStream.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class ArrayBufferStream {
    /**
     * ArrayBufferStream wraps the built-in javascript ArrayBuffer, adding the ability to access
     * data in it like a stream, tracking its position.
     * You can request to read a value from the front of the array, and it will keep track of the position
     * within the byte array, so that successive reads are consecutive.
     * The available types to read include:
     * Uint8, Uint8String, Int16, Uint16, Int32, Uint32
     * @param {ArrayBuffer} arrayBuffer - array to use as a stream
     * @param {number} start - the start position in the raw buffer. position
     * will be relative to the start value.
     * @param {number} end - the end position in the raw buffer. length and
     * bytes available will be relative to the end value.
     * @param {ArrayBufferStream} parent - if passed reuses the parent's
     * internal objects
     * @constructor
     */
    constructor (
        arrayBuffer, start = 0, end = arrayBuffer.byteLength,
        {
            _uint8View = new Uint8Array(arrayBuffer)
        } = {}
    ) {
        /**
         * Raw data buffer for stream to read.
         * @type {ArrayBufferStream}
         */
        this.arrayBuffer = arrayBuffer;

        /**
         * Start position in arrayBuffer. Read values are relative to the start
         * in the arrayBuffer.
         * @type {number}
         */
        this.start = start;

        /**
         * End position in arrayBuffer. Length and bytes available are relative
         * to the start, end, and _position in the arrayBuffer;
         * @type {number};
         */
        this.end = end;

        /**
         * Cached Uint8Array view of the arrayBuffer. Heavily used for reading
         * Uint8 values and Strings from the stream.
         * @type {Uint8Array}
         */
        this._uint8View = _uint8View;

        /**
         * Raw position in the arrayBuffer relative to the beginning of the
         * arrayBuffer.
         * @type {number}
         */
        this._position = start;
    }

    /**
     * Return a new ArrayBufferStream that is a slice of the existing one
     * @param  {number} length - the number of bytes of extract
     * @return {ArrayBufferStream} the extracted stream
     */
    extract (length) {
        return new ArrayBufferStream(this.arrayBuffer, this._position, this._position + length, this);
    }

    /**
     * @return {number} the length of the stream in bytes
     */
    getLength () {
        return this.end - this.start;
    }

    /**
     * @return {number} the number of bytes available after the current position in the stream
     */
    getBytesAvailable () {
        return this.end - this._position;
    }

    /**
     * Position relative to the start value in the arrayBuffer of this
     * ArrayBufferStream.
     * @type {number}
     */
    get position () {
        return this._position - this.start;
    }

    /**
     * Set the position to read from in the arrayBuffer.
     * @type {number}
     * @param {number} value - new value to set position to
     */
    set position (value) {
        this._position = value + this.start;
        return value;
    }

    /**
     * Read an unsigned 8 bit integer from the stream
     * @return {number} the next 8 bit integer in the stream
     */
    readUint8 () {
        const val = this._uint8View[this._position];
        this._position += 1;
        return val;
    }

    /**
     * Read a sequence of bytes of the given length and convert to a string.
     * This is a convenience method for use with short strings.
     * @param {number} length - the number of bytes to convert
     * @return {string} a String made by concatenating the chars in the input
     */
    readUint8String (length) {
        const arr = this._uint8View;
        let str = '';
        const end = this._position + length;
        for (let i = this._position; i < end; i++) {
            str += String.fromCharCode(arr[i]);
        }
        this._position += length;
        return str;
    }

    /**
     * Read a 16 bit integer from the stream
     * @return {number} the next 16 bit integer in the stream
     */
    readInt16 () {
        const val = new Int16Array(this.arrayBuffer, this._position, 1)[0];
        this._position += 2; // one 16 bit int is 2 bytes
        return val;
    }

    /**
     * Read an unsigned 16 bit integer from the stream
     * @return {number} the next unsigned 16 bit integer in the stream
     */
    readUint16 () {
        const val = new Uint16Array(this.arrayBuffer, this._position, 1)[0];
        this._position += 2; // one 16 bit int is 2 bytes
        return val;
    }

    /**
     * Read a 32 bit integer from the stream
     * @return {number} the next 32 bit integer in the stream
     */
    readInt32 () {
        let val;
        if (this._position % 4 === 0) {
            val = new Int32Array(this.arrayBuffer, this._position, 1)[0];
        } else {
            // Cannot read Int32 directly out because offset is not multiple of 4
            // Need to slice out the values first
            val = new Int32Array(
                this.arrayBuffer.slice(this._position, this._position + 4)
            )[0];
        }
        this._position += 4; // one 32 bit int is 4 bytes
        return val;
    }

    /**
     * Read an unsigned 32 bit integer from the stream
     * @return {number} the next unsigned 32 bit integer in the stream
     */
    readUint32 () {
        const val = new Uint32Array(this.arrayBuffer, this._position, 1)[0];
        this._position += 4; // one 32 bit int is 4 bytes
        return val;
    }
}

module.exports = ArrayBufferStream;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/AudioEngine.js":
/*!**************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/AudioEngine.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const StartAudioContext = __webpack_require__(/*! ./StartAudioContext */ "../../node_modules/scratch-audio/src/StartAudioContext.js");
const AudioContext = __webpack_require__(/*! audio-context */ "../../node_modules/audio-context/index.js");

const log = __webpack_require__(/*! ./log */ "../../node_modules/scratch-audio/src/log.js");
const uid = __webpack_require__(/*! ./uid */ "../../node_modules/scratch-audio/src/uid.js");

const ADPCMSoundDecoder = __webpack_require__(/*! ./ADPCMSoundDecoder */ "../../node_modules/scratch-audio/src/ADPCMSoundDecoder.js");
const Loudness = __webpack_require__(/*! ./Loudness */ "../../node_modules/scratch-audio/src/Loudness.js");
const SoundPlayer = __webpack_require__(/*! ./SoundPlayer */ "../../node_modules/scratch-audio/src/SoundPlayer.js");

const EffectChain = __webpack_require__(/*! ./effects/EffectChain */ "../../node_modules/scratch-audio/src/effects/EffectChain.js");
const PanEffect = __webpack_require__(/*! ./effects/PanEffect */ "../../node_modules/scratch-audio/src/effects/PanEffect.js");
const PitchEffect = __webpack_require__(/*! ./effects/PitchEffect */ "../../node_modules/scratch-audio/src/effects/PitchEffect.js");
const VolumeEffect = __webpack_require__(/*! ./effects/VolumeEffect */ "../../node_modules/scratch-audio/src/effects/VolumeEffect.js");

const SoundBank = __webpack_require__(/*! ./SoundBank */ "../../node_modules/scratch-audio/src/SoundBank.js");

/**
 * Wrapper to ensure that audioContext.decodeAudioData is a promise
 * @param {object} audioContext The current AudioContext
 * @param {ArrayBuffer} buffer Audio data buffer to decode
 * @return {Promise} A promise that resolves to the decoded audio
 */
const decodeAudioData = function (audioContext, buffer) {
    // Check for newer promise-based API
    if (audioContext.decodeAudioData.length === 1) {
        return audioContext.decodeAudioData(buffer);
    }
    // Fall back to callback API
    return new Promise((resolve, reject) => {
        audioContext.decodeAudioData(buffer,
            decodedAudio => resolve(decodedAudio),
            error => reject(error)
        );
    });
};

/**
 * There is a single instance of the AudioEngine. It handles global audio
 * properties and effects, loads all the audio buffers for sounds belonging to
 * sprites.
 */
class AudioEngine {
    constructor (audioContext = new AudioContext()) {
        /**
         * AudioContext to play and manipulate sounds with a graph of source
         * and effect nodes.
         * @type {AudioContext}
         */
        this.audioContext = audioContext;
        StartAudioContext(this.audioContext);

        /**
         * Master GainNode that all sounds plays through. Changing this node
         * will change the volume for all sounds.
         * @type {GainNode}
         */
        this.inputNode = this.audioContext.createGain();
        this.inputNode.connect(this.audioContext.destination);

        /**
         * a map of soundIds to audio buffers, holding sounds for all sprites
         * @type {Object<String, ArrayBuffer>}
         */
        this.audioBuffers = {};

        /**
         * A Loudness detector.
         * @type {Loudness}
         */
        this.loudness = null;

        /**
         * Array of effects applied in order, left to right,
         * Left is closest to input, Right is closest to output
         */
        this.effects = [PanEffect, PitchEffect, VolumeEffect];
    }

    /**
     * Current time in the AudioEngine.
     * @type {number}
     */
    get currentTime () {
        return this.audioContext.currentTime;
    }

    /**
     * Names of the audio effects.
     * @enum {string}
     */
    get EFFECT_NAMES () {
        return {
            pitch: 'pitch',
            pan: 'pan'
        };
    }

    /**
     * A short duration to transition audio prarameters.
     *
     * Used as a time constant for exponential transitions. A general value
     * must be large enough that it does not cute off lower frequency, or bass,
     * sounds. Human hearing lower limit is ~20Hz making a safe value 25
     * milliseconds or 0.025 seconds, where half of a 20Hz wave will play along
     * with the DECAY. Higher frequencies will play multiple waves during the
     * same amount of time and avoid clipping.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime}
     * @const {number}
     */
    get DECAY_DURATION () {
        return 0.025;
    }

    /**
     * Some environments cannot smoothly change parameters immediately, provide
     * a small delay before decaying.
     *
     * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1228207}
     * @const {number}
     */
    get DECAY_WAIT () {
        return 0.05;
    }

    /**
     * Get the input node.
     * @return {AudioNode} - audio node that is the input for this effect
     */
    getInputNode () {
        return this.inputNode;
    }

    /**
     * Decode a sound, decompressing it into audio samples.
     * @param {object} sound - an object containing audio data and metadata for
     *     a sound
     * @param {Buffer} sound.data - sound data loaded from scratch-storage
     * @returns {?Promise} - a promise which will resolve to the sound id and
     *     buffer if decoded
     */
    _decodeSound (sound) {
        // Make a copy of the buffer because decoding detaches the original
        // buffer
        const bufferCopy1 = sound.data.buffer.slice(0);

        // todo: multiple decodings of the same buffer create duplicate decoded
        // copies in audioBuffers. Create a hash id of the buffer or deprecate
        // audioBuffers to avoid memory issues for large audio buffers.
        const soundId = uid();

        // Attempt to decode the sound using the browser's native audio data
        // decoder If that fails, attempt to decode as ADPCM
        const decoding = decodeAudioData(this.audioContext, bufferCopy1)
            .catch(() => {
                // If the file is empty, create an empty sound
                if (sound.data.length === 0) {
                    return this._emptySound();
                }

                // The audio context failed to parse the sound data
                // we gave it, so try to decode as 'adpcm'

                // First we need to create another copy of our original data
                const bufferCopy2 = sound.data.buffer.slice(0);
                // Try decoding as adpcm
                return new ADPCMSoundDecoder(this.audioContext).decode(bufferCopy2)
                    .catch(() => this._emptySound());
            })
            .then(
                buffer => ([soundId, buffer]),
                error => {
                    log.warn('audio data could not be decoded', error);
                }
            );

        return decoding;
    }

    /**
     * An empty sound buffer, for use when we are unable to decode a sound file.
     * @returns {AudioBuffer} - an empty audio buffer.
     */
    _emptySound () {
        return this.audioContext.createBuffer(1, 1, this.audioContext.sampleRate);
    }

    /**
     * Decode a sound, decompressing it into audio samples.
     *
     * Store a reference to it the sound in the audioBuffers dictionary,
     * indexed by soundId.
     *
     * @param {object} sound - an object containing audio data and metadata for
     *     a sound
     * @param {Buffer} sound.data - sound data loaded from scratch-storage
     * @returns {?Promise} - a promise which will resolve to the sound id
     */
    decodeSound (sound) {
        return this._decodeSound(sound)
            .then(([id, buffer]) => {
                this.audioBuffers[id] = buffer;
                return id;
            });
    }

    /**
     * Decode a sound, decompressing it into audio samples.
     *
     * Create a SoundPlayer instance that can be used to play the sound and
     * stop and fade out playback.
     *
     * @param {object} sound - an object containing audio data and metadata for
     *     a sound
     * @param {Buffer} sound.data - sound data loaded from scratch-storage
     * @returns {?Promise} - a promise which will resolve to the buffer
     */
    decodeSoundPlayer (sound) {
        return this._decodeSound(sound)
        .then(([id, buffer]) => new SoundPlayer(this, {id, buffer}));
    }

    /**
     * Get the current loudness of sound received by the microphone.
     * Sound is measured in RMS and smoothed.
     * @return {number} loudness scaled 0 to 100
     */
    getLoudness () {
        // The microphone has not been set up, so try to connect to it
        if (!this.loudness) {
            this.loudness = new Loudness(this.audioContext);
        }

        return this.loudness.getLoudness();
    }

    /**
     * Create an effect chain.
     * @returns {EffectChain} chain of effects defined by this AudioEngine
     */
    createEffectChain () {
        const effects = new EffectChain(this, this.effects);
        effects.connect(this);
        return effects;
    }

    /**
     * Create a sound bank and effect chain.
     * @returns {SoundBank} a sound bank configured with an effect chain
     *     defined by this AudioEngine
     */
    createBank () {
        return new SoundBank(this, this.createEffectChain());
    }
}

module.exports = AudioEngine;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/Loudness.js":
/*!***********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/Loudness.js ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const log = __webpack_require__(/*! ./log */ "../../node_modules/scratch-audio/src/log.js");

class Loudness {
    /**
     * Instrument and detect a loudness value from a local microphone.
     * @param {AudioContext} audioContext - context to create nodes from for
     *     detecting loudness
     * @constructor
     */
    constructor (audioContext) {
        /**
         * AudioContext the mic will connect to and provide analysis of
         * @type {AudioContext}
         */
        this.audioContext = audioContext;

        /**
         * Are we connecting to the mic yet?
         * @type {Boolean}
         */
        this.connectingToMic = false;

        /**
         * microphone, for measuring loudness, with a level meter analyzer
         * @type {MediaStreamSourceNode}
         */
        this.mic = null;
    }

    /**
     * Get the current loudness of sound received by the microphone.
     * Sound is measured in RMS and smoothed.
     * Some code adapted from Tone.js: https://github.com/Tonejs/Tone.js
     * @return {number} loudness scaled 0 to 100
     */
    getLoudness () {
        // The microphone has not been set up, so try to connect to it
        if (!this.mic && !this.connectingToMic) {
            this.connectingToMic = true; // prevent multiple connection attempts
            navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                this.audioStream = stream;
                this.mic = this.audioContext.createMediaStreamSource(stream);
                this.analyser = this.audioContext.createAnalyser();
                this.mic.connect(this.analyser);
                this.micDataArray = new Float32Array(this.analyser.fftSize);
            })
            .catch(err => {
                log.warn(err);
            });
        }

        // If the microphone is set up and active, measure the loudness
        if (this.mic && this.audioStream.active) {
            this.analyser.getFloatTimeDomainData(this.micDataArray);
            let sum = 0;
            // compute the RMS of the sound
            for (let i = 0; i < this.micDataArray.length; i++){
                sum += Math.pow(this.micDataArray[i], 2);
            }
            let rms = Math.sqrt(sum / this.micDataArray.length);
            // smooth the value, if it is descending
            if (this._lastValue) {
                rms = Math.max(rms, this._lastValue * 0.6);
            }
            this._lastValue = rms;

            // Scale the measurement so it's more sensitive to quieter sounds
            rms *= 1.63;
            rms = Math.sqrt(rms);
            // Scale it up to 0-100 and round
            rms = Math.round(rms * 100);
            // Prevent it from going above 100
            rms = Math.min(rms, 100);
            return rms;
        }

        // if there is no microphone input, return -1
        return -1;
    }
}

module.exports = Loudness;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/SoundBank.js":
/*!************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/SoundBank.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const log = __webpack_require__(/*! ./log */ "../../node_modules/scratch-audio/src/log.js");

/**
 * A symbol indicating all targets are to be effected.
 * @const {string}
 */
const ALL_TARGETS = '*';

class SoundBank {
    /**
     * A bank of sounds that can be played.
     * @constructor
     * @param {AudioEngine} audioEngine - related AudioEngine
     * @param {EffectChain} effectChainPrime - original EffectChain cloned for
     *     playing sounds
     */
    constructor (audioEngine, effectChainPrime) {
        /**
         * AudioEngine this SoundBank is related to.
         * @type {AudioEngine}
         */
        this.audioEngine = audioEngine;

        /**
         * Map of ids to soundPlayers.
         * @type {object<SoundPlayer>}
         */
        this.soundPlayers = {};

        /**
         * Map of targets by sound id.
         * @type {Map<string, Target>}
         */
        this.playerTargets = new Map();

        /**
         * Map of effect chains by sound id.
         * @type {Map<string, EffectChain}
         */
        this.soundEffects = new Map();

        /**
         * Original EffectChain cloned for every playing sound.
         * @type {EffectChain}
         */
        this.effectChainPrime = effectChainPrime;
    }

    /**
     * Add a sound player instance likely from AudioEngine.decodeSoundPlayer
     * @param {SoundPlayer} soundPlayer - SoundPlayer to add
     */
    addSoundPlayer (soundPlayer) {
        this.soundPlayers[soundPlayer.id] = soundPlayer;
    }

    /**
     * Get a sound player by id.
     * @param {string} soundId - sound to look for
     * @returns {SoundPlayer} instance of sound player for the id
     */
    getSoundPlayer (soundId) {
        if (!this.soundPlayers[soundId]) {
            log.error(`SoundBank.getSoundPlayer(${soundId}): called missing sound in bank`);
        }

        return this.soundPlayers[soundId];
    }

    /**
     * Get a sound EffectChain by id.
     * @param {string} sound - sound to look for an EffectChain
     * @returns {EffectChain} available EffectChain for this id
     */
    getSoundEffects (sound) {
        if (!this.soundEffects.has(sound)) {
            this.soundEffects.set(sound, this.effectChainPrime.clone());
        }

        return this.soundEffects.get(sound);
    }

    /**
     * Play a sound.
     * @param {Target} target - Target to play for
     * @param {string} soundId - id of sound to play
     * @returns {Promise} promise that resolves when the sound finishes playback
     */
    playSound (target, soundId) {
        const effects = this.getSoundEffects(soundId);
        const player = this.getSoundPlayer(soundId);

        if (this.playerTargets.get(soundId) !== target) {
            // make sure to stop the old sound, effectively "forking" the output
            // when the target switches before we adjust it's effects
            player.stop();
        }

        this.playerTargets.set(soundId, target);
        effects.addSoundPlayer(player);
        effects.setEffectsFromTarget(target);
        player.connect(effects);

        player.play();

        return player.finished();
    }

    /**
     * Set the effects (pan, pitch, and volume) from values on the given target.
     * @param {Target} target - target to set values from
     */
    setEffects (target) {
        this.playerTargets.forEach((playerTarget, key) => {
            if (playerTarget === target) {
                this.getSoundEffects(key).setEffectsFromTarget(target);
            }
        });
    }

    /**
     * Stop playback of sound by id if was lasted played by the target.
     * @param {Target} target - target to check if it last played the sound
     * @param {string} soundId - id of the sound to stop
     */
    stop (target, soundId) {
        if (this.playerTargets.get(soundId) === target) {
            this.soundPlayers[soundId].stop();
        }
    }

    /**
     * Stop all sounds for all targets or a specific target.
     * @param {Target|string} target - a symbol for all targets or the target
     *     to stop sounds for
     */
    stopAllSounds (target = ALL_TARGETS) {
        this.playerTargets.forEach((playerTarget, key) => {
            if (target === ALL_TARGETS || playerTarget === target) {
                this.getSoundPlayer(key).stop();
            }
        });
    }

    /**
     * Dispose of all EffectChains and SoundPlayers.
     */
    dispose () {
        this.playerTargets.clear();
        this.soundEffects.forEach(effects => effects.dispose());
        this.soundEffects.clear();
        for (const soundId in this.soundPlayers) {
            if (this.soundPlayers.hasOwnProperty(soundId)) {
                this.soundPlayers[soundId].dispose();
            }
        }
        this.soundPlayers = {};
    }

}

module.exports = SoundBank;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/SoundPlayer.js":
/*!**************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/SoundPlayer.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const {EventEmitter} = __webpack_require__(/*! events */ "../../node_modules/events/events.js");

const VolumeEffect = __webpack_require__(/*! ./effects/VolumeEffect */ "../../node_modules/scratch-audio/src/effects/VolumeEffect.js");

/**
 * Name of event that indicates playback has ended.
 * @const {string}
 */
const ON_ENDED = 'ended';

class SoundPlayer extends EventEmitter {
    /**
     * Play sounds that stop without audible clipping.
     *
     * @param {AudioEngine} audioEngine - engine to play sounds on
     * @param {object} data - required data for sound playback
     * @param {string} data.id - a unique id for this sound
     * @param {ArrayBuffer} data.buffer - buffer of the sound's waveform to play
     * @constructor
     */
    constructor (audioEngine, {id, buffer}) {
        super();

        /**
         * Unique sound identifier set by AudioEngine.
         * @type {string}
         */
        this.id = id;

        /**
         * AudioEngine creating this sound player.
         * @type {AudioEngine}
         */
        this.audioEngine = audioEngine;

        /**
         * Decoded audio buffer from audio engine for playback.
         * @type {AudioBuffer}
         */
        this.buffer = buffer;

        /**
         * Output audio node.
         * @type {AudioNode}
         */
        this.outputNode = null;

        /**
         * VolumeEffect used to fade out playing sounds when stopping them.
         * @type {VolumeEffect}
         */
        this.volumeEffect = null;


        /**
         * Target engine, effect, or chain this player directly connects to.
         * @type {AudioEngine|Effect|EffectChain}
         */
        this.target = null;

        /**
         * Internally is the SoundPlayer initialized with at least its buffer
         * source node and output node.
         * @type {boolean}
         */
        this.initialized = false;

        /**
         * Is the sound playing or starting to play?
         * @type {boolean}
         */
        this.isPlaying = false;

        /**
         * Timestamp sound is expected to be starting playback until. Once the
         * future timestamp is reached the sound is considered to be playing
         * through the audio hardware and stopping should fade out instead of
         * cutting off playback.
         * @type {number}
         */
        this.startingUntil = 0;

        /**
         * Rate to play back the audio at.
         * @type {number}
         */
        this.playbackRate = 1;

        // handleEvent is a EventTarget api for the DOM, however the
        // web-audio-test-api we use uses an addEventListener that isn't
        // compatable with object and requires us to pass this bound function
        // instead
        this.handleEvent = this.handleEvent.bind(this);
    }

    /**
     * Is plaback currently starting?
     * @type {boolean}
     */
    get isStarting () {
        return this.isPlaying && this.startingUntil > this.audioEngine.currentTime;
    }

    /**
     * Handle any event we have told the output node to listen for.
     * @param {Event} event - dom event to handle
     */
    handleEvent (event) {
        if (event.type === ON_ENDED) {
            this.onEnded();
        }
    }

    /**
     * Event listener for when playback ends.
     */
    onEnded () {
        this.emit('stop');

        this.isPlaying = false;
    }

    /**
     * Create the buffer source node during initialization or secondary
     * playback.
     */
    _createSource () {
        if (this.outputNode !== null) {
            this.outputNode.removeEventListener(ON_ENDED, this.handleEvent);
            this.outputNode.disconnect();
        }

        this.outputNode = this.audioEngine.audioContext.createBufferSource();
        this.outputNode.playbackRate.value = this.playbackRate;
        this.outputNode.buffer = this.buffer;

        this.outputNode.addEventListener(ON_ENDED, this.handleEvent);

        if (this.target !== null) {
            this.connect(this.target);
        }
    }

    /**
     * Initialize the player for first playback.
     */
    initialize () {
        this.initialized = true;

        this._createSource();
    }

    /**
     * Connect the player to the engine or an effect chain.
     * @param {object} target - object to connect to
     * @returns {object} - return this sound player
     */
    connect (target) {
        if (target === this.volumeEffect) {
            this.outputNode.disconnect();
            this.outputNode.connect(this.volumeEffect.getInputNode());
            return;
        }

        this.target = target;

        if (!this.initialized) {
            return;
        }

        if (this.volumeEffect === null) {
            this.outputNode.disconnect();
            this.outputNode.connect(target.getInputNode());
        } else {
            this.volumeEffect.connect(target);
        }

        return this;
    }

    /**
     * Teardown the player.
     */
    dispose () {
        if (!this.initialized) {
            return;
        }

        this.stopImmediately();

        if (this.volumeEffect !== null) {
            this.volumeEffect.dispose();
            this.volumeEffect = null;
        }

        this.outputNode.disconnect();
        this.outputNode = null;

        this.target = null;

        this.initialized = false;
    }

    /**
     * Take the internal state of this player and create a new player from
     * that. Restore the state of this player to that before its first playback.
     *
     * The returned player can be used to stop the original playback or
     * continue it without manipulation from the original player.
     *
     * @returns {SoundPlayer} - new SoundPlayer with old state
     */
    take () {
        if (this.outputNode) {
            this.outputNode.removeEventListener(ON_ENDED, this.handleEvent);
        }

        const taken = new SoundPlayer(this.audioEngine, this);
        taken.playbackRate = this.playbackRate;
        if (this.isPlaying) {
            taken.startingUntil = this.startingUntil;
            taken.isPlaying = this.isPlaying;
            taken.initialized = this.initialized;
            taken.outputNode = this.outputNode;
            taken.outputNode.addEventListener(ON_ENDED, taken.handleEvent);
            taken.volumeEffect = this.volumeEffect;
            if (taken.volumeEffect) {
                taken.volumeEffect.audioPlayer = taken;
            }
            if (this.target !== null) {
                taken.connect(this.target);
            }

            this.emit('stop');
            taken.emit('play');
        }

        this.outputNode = null;
        this.volumeEffect = null;
        this.initialized = false;
        this.startingUntil = 0;
        this.isPlaying = false;

        return taken;
    }

    /**
     * Start playback for this sound.
     *
     * If the sound is already playing it will stop playback with a quick fade
     * out.
     */
    play () {
        if (this.isStarting) {
            this.emit('stop');
            this.emit('play');
            return;
        }

        if (this.isPlaying) {
            this.stop();
        }

        if (this.initialized) {
            this._createSource();
        } else {
            this.initialize();
        }

        this.outputNode.start();

        this.isPlaying = true;

        const {currentTime, DECAY_DURATION} = this.audioEngine;
        this.startingUntil = currentTime + DECAY_DURATION;

        this.emit('play');
    }

    /**
     * Stop playback after quickly fading out.
     */
    stop () {
        if (!this.isPlaying) {
            return;
        }

        // always do a manual stop on a taken / volume effect fade out sound
        // player take will emit "stop" as well as reset all of our playing
        // statuses / remove our nodes / etc
        const taken = this.take();
        taken.volumeEffect = new VolumeEffect(taken.audioEngine, taken, null);

        taken.volumeEffect.connect(taken.target);
        // volumeEffect will recursively connect to us if it needs to, so this
        // happens too:
        // taken.connect(taken.volumeEffect);

        taken.finished().then(() => taken.dispose());

        taken.volumeEffect.set(0);
        const {currentTime, DECAY_DURATION} = this.audioEngine;
        taken.outputNode.stop(currentTime + DECAY_DURATION);
    }

    /**
     * Stop immediately without fading out. May cause audible clipping.
     */
    stopImmediately () {
        if (!this.isPlaying) {
            return;
        }

        this.outputNode.stop();

        this.isPlaying = false;
        this.startingUntil = 0;

        this.emit('stop');
    }

    /**
     * Return a promise that resolves when the sound next finishes.
     * @returns {Promise} - resolves when the sound finishes
     */
    finished () {
        return new Promise(resolve => {
            this.once('stop', resolve);
        });
    }

    /**
     * Set the sound's playback rate.
     * @param {number} value - playback rate. Default is 1.
     */
    setPlaybackRate (value) {
        this.playbackRate = value;

        if (this.initialized) {
            this.outputNode.playbackRate.value = value;
        }
    }
}

module.exports = SoundPlayer;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/StartAudioContext.js":
/*!********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/StartAudioContext.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// StartAudioContext assumes that we are in a window/document setting and messes with the unit
// tests, this is our own version just checking to see if we have a global document to listen
// to before we even try to "start" it.  Our test api audio context is started by default.
const StartAudioContext = __webpack_require__(/*! startaudiocontext */ "../../node_modules/startaudiocontext/StartAudioContext.js");

module.exports = function (context) {
    if (typeof document !== 'undefined') {
        return StartAudioContext(context);
    }
};


/***/ }),

/***/ "../../node_modules/scratch-audio/src/effects/Effect.js":
/*!*****************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/effects/Effect.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * An effect on an AudioPlayer and all its SoundPlayers.
 */
class Effect {
     /**
      * @param {AudioEngine} audioEngine - audio engine this runs with
      * @param {AudioPlayer} audioPlayer - audio player this affects
      * @param {Effect} lastEffect - effect in the chain before this one
      * @constructor
      */
    constructor (audioEngine, audioPlayer, lastEffect) {
        this.audioEngine = audioEngine;
        this.audioPlayer = audioPlayer;
        this.lastEffect = lastEffect;

        this.value = this.DEFAULT_VALUE;

        this.initialized = false;

        this.inputNode = null;
        this.outputNode = null;

        this.target = null;
    }

    /**
     * Return the name of the effect.
     * @type {string}
     */
    get name () {
        throw new Error(`${this.constructor.name}.name is not implemented`);
    }

    /**
     * Default value to set the Effect to when constructed and when clear'ed.
     * @const {number}
     */
    get DEFAULT_VALUE () {
        return 0;
    }

    /**
     * Should the effect be connected to the audio graph?
     * The pitch effect is an example that does not need to be patched in.
     * Instead of affecting the graph it affects the player directly.
     * @return {boolean} is the effect affecting the graph?
     */
    get _isPatch () {
        return this.initialized && (this.value !== this.DEFAULT_VALUE || this.audioPlayer === null);
    }

    /**
     * Get the input node.
     * @return {AudioNode} - audio node that is the input for this effect
     */
    getInputNode () {
        if (this._isPatch) {
            return this.inputNode;
        }
        return this.target.getInputNode();
    }

    /**
     * Initialize the Effect.
     * Effects start out uninitialized. Then initialize when they are first set
     * with some value.
     * @throws {Error} throws when left unimplemented
     */
    initialize () {
        throw new Error(`${this.constructor.name}.initialize is not implemented.`);
    }

    /**
     * Set the effects value.
     * @private
     * @param {number} value - new value to set effect to
     */
    _set () {
        throw new Error(`${this.constructor.name}._set is not implemented.`);
    }

    /**
     * Set the effects value.
     * @param {number} value - new value to set effect to
     */
    set (value) {
        // Initialize the node on first set.
        if (!this.initialized) {
            this.initialize();
        }

        // Store whether the graph should currently affected by this effect.
        const wasPatch = this._isPatch;
        if (wasPatch) {
            this._lastPatch = this.audioEngine.currentTime;
        }

        // Call the internal implementation per this Effect.
        this._set(value);

        // Connect or disconnect from the graph if this now applies or no longer
        // applies an effect.
        if (this._isPatch !== wasPatch && this.target !== null) {
            this.connect(this.target);
        }
    }

    /**
     * Update the effect for changes in the audioPlayer.
     */
    update () {}

    /**
     * Clear the value back to the default.
     */
    clear () {
        this.set(this.DEFAULT_VALUE);
    }

    /**
     * Connnect this effect's output to another audio node
     * @param {object} target - target whose node to should be connected
     */
    connect (target) {
        if (target === null) {
            throw new Error('target may not be null');
        }

        const checkForCircularReference = subtarget => {
            if (subtarget) {
                if (subtarget === this) {
                    return true;
                }
                return checkForCircularReference(subtarget.target);
            }
        };
        if (checkForCircularReference(target)) {
            throw new Error('Effect cannot connect to itself');
        }

        this.target = target;

        if (this.outputNode !== null) {
            this.outputNode.disconnect();
        }

        if (this._isPatch || this._lastPatch + this.audioEngine.DECAY_DURATION < this.audioEngine.currentTime) {
            this.outputNode.connect(target.getInputNode());
        }

        if (this.lastEffect === null) {
            if (this.audioPlayer !== null) {
                this.audioPlayer.connect(this);
            }
        } else {
            this.lastEffect.connect(this);
        }
    }

    /**
     * Clean up and disconnect audio nodes.
     */
    dispose () {
        this.inputNode = null;
        this.outputNode = null;
        this.target = null;

        this.initialized = false;
    }
}

module.exports = Effect;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/effects/EffectChain.js":
/*!**********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/effects/EffectChain.js ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class EffectChain {
    /**
     * Chain of effects that can be applied to a group of SoundPlayers.
     * @param {AudioEngine} audioEngine - engine whose effects these belong to
     * @param {Array<Effect>} effects - array of Effect classes to construct
     */
    constructor (audioEngine, effects) {
        /**
         * AudioEngine whose effects these belong to.
         * @type {AudioEngine}
         */
        this.audioEngine = audioEngine;

        /**
         * Node incoming connections will attach to. This node than connects to
         * the items in the chain which finally connect to some output.
         * @type {AudioNode}
         */
        this.inputNode = this.audioEngine.audioContext.createGain();

        /**
         * List of Effect types to create.
         * @type {Array<Effect>}
         */
        this.effects = effects;

        // Effects are instantiated in reverse so that the first refers to the
        // second, the second refers to the third, etc and the last refers to
        // null.
        let lastEffect = null;
        /**
         * List of instantiated Effects.
         * @type {Array<Effect>}
         */
        this._effects = effects
            .reverse()
            .map(Effect => {
                const effect = new Effect(audioEngine, this, lastEffect);
                this[effect.name] = effect;
                lastEffect = effect;
                return effect;
            })
            .reverse();

        /**
         * First effect of this chain.
         * @type {Effect}
         */
        this.firstEffect = this._effects[0];

        /**
         * Last effect of this chain.
         * @type {Effect}
         */
        this.lastEffect = this._effects[this._effects.length - 1];

        /**
         * A set of players this chain is managing.
         */
        this._soundPlayers = new Set();
    }

    /**
     * Create a clone of the EffectChain.
     * @returns {EffectChain} a clone of this EffectChain
     */
    clone () {
        const chain = new EffectChain(this.audioEngine, this.effects);
        if (this.target) {
            chain.connect(this.target);
        }
        return chain;
    }

    /**
     * Add a sound player.
     * @param {SoundPlayer} soundPlayer - a sound player to manage
     */
    addSoundPlayer (soundPlayer) {
        if (!this._soundPlayers.has(soundPlayer)) {
            this._soundPlayers.add(soundPlayer);
            this.update();
        }
    }

    /**
     * Remove a sound player.
     * @param {SoundPlayer} soundPlayer - a sound player to stop managing
     */
    removeSoundPlayer (soundPlayer) {
        this._soundPlayers.remove(soundPlayer);
    }

    /**
     * Get the audio input node.
     * @returns {AudioNode} audio node the upstream can connect to
     */
    getInputNode () {
        return this.inputNode;
    }

    /**
     * Connnect this player's output to another audio node.
     * @param {object} target - target whose node to should be connected
     */
    connect (target) {
        const {firstEffect, lastEffect} = this;

        if (target === lastEffect) {
            this.inputNode.disconnect();
            this.inputNode.connect(lastEffect.getInputNode());

            return;
        } else if (target === firstEffect) {
            return;
        }

        this.target = target;

        firstEffect.connect(target);
    }

    /**
     * Array of SoundPlayers managed by this EffectChain.
     * @returns {Array<SoundPlayer>} sound players managed by this chain
     */
    getSoundPlayers () {
        return [...this._soundPlayers];
    }

    /**
     * Set Effect values with named values on target.soundEffects if it exist
     * and then from target itself.
     * @param {Target} target - target to set values from
     */
    setEffectsFromTarget (target) {
        this._effects.forEach(effect => {
            if ('soundEffects' in target && effect.name in target.soundEffects) {
                effect.set(target.soundEffects[effect.name]);
            } else if (effect.name in target) {
                effect.set(target[effect.name]);
            }
        });
    }

    /**
     * Set an effect value by its name.
     * @param {string} effect - effect name to change
     * @param {number} value - value to set effect to
     */
    set (effect, value) {
        if (effect in this) {
            this[effect].set(value);
        }
    }

    /**
     * Update managed sound players with the effects on this chain.
     */
    update () {
        this._effects.forEach(effect => effect.update());
    }

    /**
     * Clear all effects to their default values.
     */
    clear () {
        this._effects.forEach(effect => effect.clear());
    }

    /**
     * Dispose of all effects in this chain. Nothing is done to managed
     * SoundPlayers.
     */
    dispose () {
        this._soundPlayers = null;
        this._effects.forEach(effect => effect.dispose());
        this._effects = null;
    }
}

module.exports = EffectChain;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/effects/PanEffect.js":
/*!********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/effects/PanEffect.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Effect = __webpack_require__(/*! ./Effect */ "../../node_modules/scratch-audio/src/effects/Effect.js");

/**
 * A pan effect, which moves the sound to the left or right between the speakers
 * Effect value of -100 puts the audio entirely on the left channel,
 * 0 centers it, 100 puts it on the right.
 */
class PanEffect extends Effect {
    /**
     * @param {AudioEngine} audioEngine - audio engine this runs with
     * @param {AudioPlayer} audioPlayer - audio player this affects
     * @param {Effect} lastEffect - effect in the chain before this one
     * @constructor
     */
    constructor (audioEngine, audioPlayer, lastEffect) {
        super(audioEngine, audioPlayer, lastEffect);

        this.leftGain = null;
        this.rightGain = null;
        this.channelMerger = null;
    }

    /**
     * Return the name of the effect.
     * @type {string}
     */
    get name () {
        return 'pan';
    }

    /**
     * Initialize the Effect.
     * Effects start out uninitialized. Then initialize when they are first set
     * with some value.
     * @throws {Error} throws when left unimplemented
     */
    initialize () {
        const audioContext = this.audioEngine.audioContext;

        this.inputNode = audioContext.createGain();
        this.leftGain = audioContext.createGain();
        this.rightGain = audioContext.createGain();
        this.channelMerger = audioContext.createChannelMerger(2);
        this.outputNode = this.channelMerger;

        this.inputNode.connect(this.leftGain);
        this.inputNode.connect(this.rightGain);
        this.leftGain.connect(this.channelMerger, 0, 0);
        this.rightGain.connect(this.channelMerger, 0, 1);

        this.initialized = true;
    }

    /**
     * Set the effect value
     * @param {number} value - the new value to set the effect to
     */
    _set (value) {
        this.value = value;

        // Map the scratch effect value (-100 to 100) to (0 to 1)
        const p = (value + 100) / 200;

        // Use trig functions for equal-loudness panning
        // See e.g. https://docs.cycling74.com/max7/tutorials/13_panningchapter01
        const leftVal = Math.cos(p * Math.PI / 2);
        const rightVal = Math.sin(p * Math.PI / 2);

        const {currentTime, DECAY_WAIT, DECAY_DURATION} = this.audioEngine;
        this.leftGain.gain.setTargetAtTime(leftVal, currentTime + DECAY_WAIT, DECAY_DURATION);
        this.rightGain.gain.setTargetAtTime(rightVal, currentTime + DECAY_WAIT, DECAY_DURATION);
    }

    /**
     * Clean up and disconnect audio nodes.
     */
    dispose () {
        if (!this.initialized) {
            return;
        }

        this.inputNode.disconnect();
        this.leftGain.disconnect();
        this.rightGain.disconnect();
        this.channelMerger.disconnect();

        this.inputNode = null;
        this.leftGain = null;
        this.rightGain = null;
        this.channelMerger = null;
        this.outputNode = null;
        this.target = null;

        this.initialized = false;
    }
}

module.exports = PanEffect;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/effects/PitchEffect.js":
/*!**********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/effects/PitchEffect.js ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Effect = __webpack_require__(/*! ./Effect */ "../../node_modules/scratch-audio/src/effects/Effect.js");

/**
 * A pitch change effect, which changes the playback rate of the sound in order
 * to change its pitch: reducing the playback rate lowers the pitch, increasing
 * the rate raises the pitch. The duration of the sound is also changed.
 *
 * Changing the value of the pitch effect by 10 causes a change in pitch by 1
 * semitone (i.e. a musical half-step, such as the difference between C and C#)
 * Changing the pitch effect by 120 changes the pitch by one octave (12
 * semitones)
 *
 * The value of this effect is not clamped (i.e. it is typically between -120
 * and 120, but can be set much higher or much lower, with weird and fun
 * results). We should consider what extreme values to use for clamping it.
 *
 * Note that this effect functions differently from the other audio effects. It
 * is not part of a chain of audio nodes. Instead, it provides a way to set the
 * playback on one SoundPlayer or a group of them.
 */
class PitchEffect extends Effect {
    /**
     * @param {AudioEngine} audioEngine - audio engine this runs with
     * @param {AudioPlayer} audioPlayer - audio player this affects
     * @param {Effect} lastEffect - effect in the chain before this one
     * @constructor
     */
    constructor (audioEngine, audioPlayer, lastEffect) {
        super(audioEngine, audioPlayer, lastEffect);

        /**
         * The playback rate ratio
         * @type {Number}
         */
        this.ratio = 1;
    }

    /**
     * Return the name of the effect.
     * @type {string}
     */
    get name () {
        return 'pitch';
    }

    /**
     * Should the effect be connected to the audio graph?
     * @return {boolean} is the effect affecting the graph?
     */
    get _isPatch () {
        return false;
    }

    /**
     * Get the input node.
     * @return {AudioNode} - audio node that is the input for this effect
     */
    getInputNode () {
        return this.target.getInputNode();
    }

    /**
     * Initialize the Effect.
     * Effects start out uninitialized. Then initialize when they are first set
     * with some value.
     * @throws {Error} throws when left unimplemented
     */
    initialize () {
        this.initialized = true;
    }

    /**
     * Set the effect value.
     * @param {number} value - the new value to set the effect to
     */
    _set (value) {
        this.value = value;
        this.ratio = this.getRatio(this.value);
        this.updatePlayers(this.audioPlayer.getSoundPlayers());
    }

    /**
     * Update the effect for changes in the audioPlayer.
     */
    update () {
        this.updatePlayers(this.audioPlayer.getSoundPlayers());
    }

    /**
     * Compute the playback ratio for an effect value.
     * The playback ratio is scaled so that a change of 10 in the effect value
     * gives a change of 1 semitone in the ratio.
     * @param {number} val - an effect value
     * @returns {number} a playback ratio
     */
    getRatio (val) {
        const interval = val / 10;
        // Convert the musical interval in semitones to a frequency ratio
        return Math.pow(2, (interval / 12));
    }

    /**
     * Update a sound player's playback rate using the current ratio for the
     * effect
     * @param {object} player - a SoundPlayer object
     */
    updatePlayer (player) {
        player.setPlaybackRate(this.ratio);
    }

    /**
     * Update a sound player's playback rate using the current ratio for the
     * effect
     * @param {object} players - a dictionary of SoundPlayer objects to update,
     *     indexed by md5
     */
    updatePlayers (players) {
        if (!players) return;

        for (const id in players) {
            if (players.hasOwnProperty(id)) {
                this.updatePlayer(players[id]);
            }
        }
    }
}

module.exports = PitchEffect;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/effects/VolumeEffect.js":
/*!***********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/effects/VolumeEffect.js ***!
  \***********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Effect = __webpack_require__(/*! ./Effect */ "../../node_modules/scratch-audio/src/effects/Effect.js");

/**
 * Affect the volume of an effect chain.
 */
class VolumeEffect extends Effect {
    /**
     * Default value to set the Effect to when constructed and when clear'ed.
     * @const {number}
     */
    get DEFAULT_VALUE () {
        return 100;
    }

    /**
     * Return the name of the effect.
     * @type {string}
     */
    get name () {
        return 'volume';
    }

    /**
     * Initialize the Effect.
     * Effects start out uninitialized. Then initialize when they are first set
     * with some value.
     * @throws {Error} throws when left unimplemented
     */
    initialize () {
        this.inputNode = this.audioEngine.audioContext.createGain();
        this.outputNode = this.inputNode;

        this.initialized = true;
    }

    /**
     * Set the effects value.
     * @private
     * @param {number} value - new value to set effect to
     */
    _set (value) {
        this.value = value;

        const {gain} = this.outputNode;
        const {currentTime, DECAY_DURATION} = this.audioEngine;
        gain.linearRampToValueAtTime(value / 100, currentTime + DECAY_DURATION);
    }

    /**
     * Clean up and disconnect audio nodes.
     */
    dispose () {
        if (!this.initialized) {
            return;
        }

        this.outputNode.disconnect();

        this.inputNode = null;
        this.outputNode = null;
        this.target = null;

        this.initialized = false;
    }
}

module.exports = VolumeEffect;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/index.js":
/*!********************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/index.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @fileOverview Scratch Audio is divided into a single AudioEngine, that
 * handles global functionality, and AudioPlayers, belonging to individual
 * sprites and clones.
 */

const AudioEngine = __webpack_require__(/*! ./AudioEngine */ "../../node_modules/scratch-audio/src/AudioEngine.js");

module.exports = AudioEngine;


/***/ }),

/***/ "../../node_modules/scratch-audio/src/log.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/log.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const minilog = __webpack_require__(/*! minilog */ "../../node_modules/minilog/lib/web/index.js");
minilog.enable();

module.exports = minilog('scratch-audioengine');


/***/ }),

/***/ "../../node_modules/scratch-audio/src/uid.js":
/*!******************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/scratch-audio/src/uid.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * @fileoverview UID generator, from Blockly.
 */

/**
 * Legal characters for the unique ID.
 * Should be all on a US keyboard.  No XML special characters or control codes.
 * Removed $ due to issue 251.
 * @private
 */
const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generate a unique ID, from Blockly.  This should be globally unique.
 * 87 characters ^ 20 length > 128 bits (better than a UUID).
 * @return {string} A globally unique ID string.
 */
const uid = function () {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
};

module.exports = uid;


/***/ }),

/***/ "../../node_modules/startaudiocontext/StartAudioContext.js":
/*!********************************************************************************************************************!*\
  !*** C:/Users/strij/Ontwikkeling/Scratch4D/itch-scratch-judge/node_modules/startaudiocontext/StartAudioContext.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 *  StartAudioContext.js
 *  @author Yotam Mann
 *  @license http://opensource.org/licenses/MIT MIT License
 *  @copyright 2016 Yotam Mann
 */
(function (root, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	 } else {}
}(this, function () {

	//TAP LISTENER/////////////////////////////////////////////////////////////

	/**
	 * @class  Listens for non-dragging tap ends on the given element
	 * @param {Element} element
	 * @internal
	 */
	var TapListener = function(element, context){

		this._dragged = false

		this._element = element

		this._bindedMove = this._moved.bind(this)
		this._bindedEnd = this._ended.bind(this, context)

		element.addEventListener("touchstart", this._bindedEnd)
		element.addEventListener("touchmove", this._bindedMove)
		element.addEventListener("touchend", this._bindedEnd)
		element.addEventListener("mouseup", this._bindedEnd)
	}

	/**
	 * drag move event
	 */
	TapListener.prototype._moved = function(e){
		this._dragged = true
	};

	/**
	 * tap ended listener
	 */
	TapListener.prototype._ended = function(context){
		if (!this._dragged){
			startContext(context)
		}
		this._dragged = false
	};

	/**
	 * remove all the bound events
	 */
	TapListener.prototype.dispose = function(){
		this._element.removeEventListener("touchstart", this._bindedEnd)
		this._element.removeEventListener("touchmove", this._bindedMove)
		this._element.removeEventListener("touchend", this._bindedEnd)
		this._element.removeEventListener("mouseup", this._bindedEnd)
		this._bindedMove = null
		this._bindedEnd = null
		this._element = null
	};

	//END TAP LISTENER/////////////////////////////////////////////////////////

	/**
	 * Plays a silent sound and also invoke the "resume" method
	 * @param {AudioContext} context
	 * @private
	 */
	function startContext(context){
		// this accomplishes the iOS specific requirement
		var buffer = context.createBuffer(1, 1, context.sampleRate)
		var source = context.createBufferSource()
		source.buffer = buffer
		source.connect(context.destination)
		source.start(0)

		// resume the audio context
		if (context.resume){
			context.resume()
		}
	}

	/**
	 * Returns true if the audio context is started
	 * @param  {AudioContext}  context
	 * @return {Boolean}
	 * @private
	 */
	function isStarted(context){
		 return context.state === "running"
	}

	/**
	 * Invokes the callback as soon as the AudioContext
	 * is started
	 * @param  {AudioContext}   context
	 * @param  {Function} callback
	 */
	function onStarted(context, callback){

		function checkLoop(){
			if (isStarted(context)){
				callback()
			} else {
				requestAnimationFrame(checkLoop)
				if (context.resume){
					context.resume()
				}
			}
		}

		if (isStarted(context)){
			callback()
		} else {
			checkLoop()
		}
	}

	/**
	 * Add a tap listener to the audio context
	 * @param  {Array|Element|String|jQuery} element
	 * @param {Array} tapListeners
	 */
	function bindTapListener(element, tapListeners, context){
		if (Array.isArray(element) || (NodeList && element instanceof NodeList)){
			for (var i = 0; i < element.length; i++){
				bindTapListener(element[i], tapListeners, context)
			}
		} else if (typeof element === "string"){
			bindTapListener(document.querySelectorAll(element), tapListeners, context)
		} else if (element.jquery && typeof element.toArray === "function"){
			bindTapListener(element.toArray(), tapListeners, context)
		} else if (Element && element instanceof Element){
			//if it's an element, create a TapListener
			var tap = new TapListener(element, context)
			tapListeners.push(tap)
		} 
	}

	/**
	 * @param {AudioContext} context The AudioContext to start.
	 * @param {Array|String|Element|jQuery=} elements For iOS, the list of elements
	 *                                               to bind tap event listeners
	 *                                               which will start the AudioContext. If
	 *                                               no elements are given, it will bind
	 *                                               to the document.body.
	 * @param {Function=} callback The callback to invoke when the AudioContext is started.
	 * @return {Promise} The promise is invoked when the AudioContext
	 *                       is started.
	 */
	function StartAudioContext(context, elements, callback){

		//the promise is invoked when the AudioContext is started
		var promise = new Promise(function(success) {
			onStarted(context, success)
		})

		// The TapListeners bound to the elements
		var tapListeners = []

		// add all the tap listeners
		if (!elements){
			elements = document.body
		}
		bindTapListener(elements, tapListeners, context)

		//dispose all these tap listeners when the context is started
		promise.then(function(){
			for (var i = 0; i < tapListeners.length; i++){
				tapListeners[i].dispose()
			}
			tapListeners = null

			if (callback){
				callback()
			}
		})

		return promise
	}

	return StartAudioContext
}))

/***/ }),

/***/ "../../node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "../../node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "./src/blocks.js":
/*!***********************!*\
  !*** ./src/blocks.js ***!
  \***********************/
/*! exports provided: containsLoop, containsBlock, countExecutions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "containsLoop", function() { return containsLoop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "containsBlock", function() { return containsBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "countExecutions", function() { return countExecutions; });
/* Copyright (C) 2019 Ghent University - All Rights Reserved */
function containsLoop(blocks) {
  for (var key in blocks) {
    if (key === 'control_repeat' || key === 'control_forever') return true;
  }

  return false;
}
function containsBlock(name, blocks) {
  for (var key in blocks) {
    if (key === name) return true;
  }

  return false;
}
function countExecutions(name, blocks) {
  for (var key in blocks) {
    if (key === name) return blocks[key];
  }

  return 0;
}

/***/ }),

/***/ "./src/context.js":
/*!************************!*\
  !*** ./src/context.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Context; });
/* harmony import */ var scratch_vm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scratch-vm */ "scratch-vm");
/* harmony import */ var scratch_vm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scratch_vm__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var scratch_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scratch-storage */ "scratch-storage");
/* harmony import */ var scratch_storage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scratch_storage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var scratch_svg_renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! scratch-svg-renderer */ "scratch-svg-renderer");
/* harmony import */ var scratch_svg_renderer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(scratch_svg_renderer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var scratch_audio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! scratch-audio */ "../../node_modules/scratch-audio/src/index.js");
/* harmony import */ var scratch_audio__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(scratch_audio__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var scratch_render__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! scratch-render */ "scratch-render");
/* harmony import */ var scratch_render__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(scratch_render__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./log.js */ "./src/log.js");
/* harmony import */ var _deferred_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./deferred.js */ "./src/deferred.js");
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./renderer */ "./src/renderer.js");
/* harmony import */ var _output__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./output */ "./src/output.js");
/* harmony import */ var _scheduler_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./scheduler/index.js */ "./src/scheduler/index.js");
/* harmony import */ var _scheduler_end_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./scheduler/end.js */ "./src/scheduler/end.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }












var Events = {
  SCRATCH_PROJECT_START: 'PROJECT_START',
  SCRATCH_PROJECT_RUN_STOP: 'PROJECT_RUN_STOP',
  SCRATCH_SAY_OR_THINK: 'SAY',
  SCRATCH_QUESTION: 'QUESTION',
  SCRATCH_ANSWER: 'ANSWER',
  // Custom events,
  DONE_THREADS_UPDATE: 'DONE_THREADS_UPDATE',
  BEFORE_HATS_START: 'BEFORE_HATS_START'
};
/**
 * Wrap the stepper function.
 *
 * @param {VirtualMachine} vm
 */

function wrapStep(vm) {
  var oldFunction = vm.runtime._step.bind(vm.runtime); // let time = Date.now();


  vm.runtime._step = function () {
    var oldResult = oldFunction();

    if (vm.runtime._lastStepDoneThreads.length > 0) {
      vm.runtime.emit(Events.DONE_THREADS_UPDATE, vm.runtime._lastStepDoneThreads);
    } // const newTime = Date.now();
    // if (time && newTime) {
    //   console.log(`Step took ${newTime - time}`, {
    //     currentStep: vm.runtime.currentStepTime
    //   });
    // }
    // time = newTime;


    return oldResult;
  };
}
/**
 * Wrap the start hats function to emit an event when this happens.
 * @param {VirtualMachine} vm
 */


function wrapStartHats(vm) {
  var oldFunction = vm.runtime.startHats.bind(vm.runtime);

  vm.runtime.startHats = function (requestedHatOpcode, optMatchFields, optTarget) {
    vm.runtime.emit(Events.BEFORE_HATS_START, {
      requestedHatOpcode: requestedHatOpcode,
      optMatchFields: optMatchFields,
      optTarget: optTarget
    });
    return oldFunction(requestedHatOpcode, optMatchFields, optTarget);
  };
}
/**
 * Load the VM. The returned VM is completely prepared: listeners
 * are attached, dependencies loaded and the project is loaded into
 * the VM.
 *
 * @param {VirtualMachine} vm - The VM to load.
 * @param {string|ArrayBuffer} project - The project to load.
 * @param {HTMLCanvasElement|null} [canvas] - The canvas for the renderer.
 * @param {Context} context - The context. The VM part of the context is not loaded yet.
 * @return {Promise<VirtualMachine>} The virtual machine.
 */


function loadVm(_x, _x2) {
  return _loadVm.apply(this, arguments);
}
/**
 * @typedef {object} Acceleration
 * @property {number} factor - Main acceleration factor.
 * @property {number} [time] - Scratch waiting times.
 * @property {number} [event] - Scheduled events waiting time.
 */

/**
 * Contains common information and parameters for the
 * judge. This is passed around in lieu of using globals.
 */


function _loadVm() {
  _loadVm = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(vm, project) {
    var canvas,
        context,
        storage,
        audioEngine,
        renderer,
        _args4 = arguments;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            canvas = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : null;
            context = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : null;
            vm.setTurboMode(false); // Set up the components.

            storage = new scratch_storage__WEBPACK_IMPORTED_MODULE_1___default.a();
            vm.attachStorage(storage);
            audioEngine = new scratch_audio__WEBPACK_IMPORTED_MODULE_3___default.a();
            vm.attachAudioEngine(audioEngine);
            vm.attachV2SVGAdapter(new scratch_svg_renderer__WEBPACK_IMPORTED_MODULE_2___default.a.SVGRenderer());
            vm.attachV2BitmapAdapter(new scratch_svg_renderer__WEBPACK_IMPORTED_MODULE_2___default.a.BitmapAdapter()); // Set up the renderer, and inject our proxy.

            if (context !== null) {
              renderer = Object(_renderer__WEBPACK_IMPORTED_MODULE_7__["makeProxiedRenderer"])(context, canvas);
              vm.attachRenderer(renderer);
            } else {
              vm.attachRenderer(new scratch_render__WEBPACK_IMPORTED_MODULE_4___default.a(canvas));
            }

            if (context !== null) {
              // Wrap the step function.
              wrapStep(vm);
              wrapStartHats(vm);
            } // Load the project.


            _context4.next = 13;
            return vm.loadProject(project);

          case 13:
            return _context4.abrupt("return", vm);

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _loadVm.apply(this, arguments);
}

var Context = /*#__PURE__*/function () {
  function Context() {
    _classCallCheck(this, Context);

    /**
     * When the execution started.
     * @type {number}
     */
    this.startTime = Date.now();
    /**
     * The number of the run.
     * @type {number}
     */

    this.numberOfRun = 0;
    /**
     *
     * @type {Log}
     */

    this.log = new _log_js__WEBPACK_IMPORTED_MODULE_5__["Log"]();
    /**
     * Answers to give to scratch.
     * @type {string[]}
     */

    this.answers = [];
    this.providedAnswers = [];
    /**
     * Resolves once the scratch files have been loaded.
     * @type {Deferred}
     */

    this.vmLoaded = new _deferred_js__WEBPACK_IMPORTED_MODULE_6__["default"]();
    /**
     * Resolves once the simulation has ended.
     * @type {Deferred}
     */

    this.simulationEnd = new _deferred_js__WEBPACK_IMPORTED_MODULE_6__["default"]();
    /**
     * The timeout for the actions.
     * @type {number}
     */

    this.actionTimeout = 5000;
    /**
     * The listeners for the threads.
     * @type {ThreadListener[]}
     */

    this.threadListeners = [];
    /**
     * The listeners for the broadcasts.
     * @type {BroadcastListener[]}
     */

    this.broadcastListeners = [];
    /** @type {ScheduledEvent} */

    this.event = _scheduler_index_js__WEBPACK_IMPORTED_MODULE_9__["ScheduledEvent"].create();
    /**
     * Output manager
     * @type {ResultManager}
     */

    this.output = new _output__WEBPACK_IMPORTED_MODULE_8__["default"]();
    /**
     * The acceleration factor, used to speed up (or slow down)
     * execution in the VM.
     *
     * There is a limit on how much you can increase this, since
     * each step in the VM must still have time to run of course.
     *
     * @type {Acceleration}
     */

    this.accelerationFactor = {
      factor: 1
    };
  }
  /**
   * Get a current timestamp.
   * @return {number}
   */


  _createClass(Context, [{
    key: "timestamp",
    value: function timestamp() {
      return Date.now() - this.startTime;
    }
    /**
     * Set up the event handles for a the vm.
     * @private
     */

  }, {
    key: "attachEventHandles",
    value: function attachEventHandles() {
      var _this = this;

      this.vm.runtime.on(Events.SCRATCH_PROJECT_START, function () {
        console.log("".concat(_this.timestamp(), ": run number: ").concat(_this.numberOfRun));
        _this.numberOfRun++;
      });
      this.vm.runtime.on(Events.SCRATCH_SAY_OR_THINK, function (target, type, text) {
        // Only save it when something is actually being said.
        if (text !== '') {
          console.log("".concat(_this.timestamp(), ": say: ").concat(text, " with ").concat(type));
          var event = new _log_js__WEBPACK_IMPORTED_MODULE_5__["LogEvent"](_this, 'say', {
            text: text,
            target: target,
            type: type,
            sprite: target.sprite.name
          });
          event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_5__["LogFrame"](_this, 'say');
          event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_5__["LogFrame"](_this, 'sayEnd');

          _this.log.addEvent(event);
        }
      });
      this.vm.runtime.on(Events.SCRATCH_QUESTION, function (question) {
        if (question != null) {
          var x = _this.providedAnswers.shift();

          if (x === undefined) {
            _this.output.addError('Er werd een vraag gesteld waarop geen antwoord voorzien is.');

            x = null;
          }

          console.log("".concat(_this.timestamp(), ": input: ").concat(x));
          var event = new _log_js__WEBPACK_IMPORTED_MODULE_5__["LogEvent"](_this, 'answer', {
            question: question,
            text: x
          });
          event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_5__["LogFrame"](_this, 'answer');
          event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_5__["LogFrame"](_this, 'answerEnd');

          _this.log.addEvent(event);

          _this.vm.runtime.emit(Events.SCRATCH_ANSWER, x);
        }
      });
      this.vm.runtime.on(Events.SCRATCH_PROJECT_RUN_STOP, function () {
        console.log("".concat(_this.timestamp(), ": Ended run"));
      });
      this.vm.runtime.on(Events.DONE_THREADS_UPDATE, function (threads) {
        var _iterator = _createForOfIteratorHelper(threads),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var thread = _step.value;

            var _iterator2 = _createForOfIteratorHelper(_this.threadListeners),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var action = _step2.value;

                if (action.active) {
                  action.update(thread);
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
      this.vm.runtime.on(Events.BEFORE_HATS_START, function (opts) {
        if (opts.requestedHatOpcode === 'event_whenbroadcastreceived') {
          _this.broadcastListeners.filter(function (l) {
            return l.active;
          }).forEach(function (l) {
            return l.update({
              matchFields: opts.optMatchFields,
              target: opts.optTarget
            });
          });
        }
      });
    }
    /**
     * Create a profile and attach it to the VM.
     * @private
     */

  }, {
    key: "createProfiler",
    value: function createProfiler() {
      var _this2 = this;

      this.vm.runtime.enableProfiling();
      var blockId = this.vm.runtime.profiler.idByName('blockFunction'); // eslint-disable-next-line no-unused-vars

      this.vm.runtime.profiler.onFrame = function (_ref) {
        var id = _ref.id,
            _selfTime = _ref._selfTime,
            _totalTime = _ref._totalTime,
            arg = _ref.arg;

        if (id === blockId) {
          _this2.log.addFrame(_this2, arg);
        }
      };
    }
    /**
     * Extract the project.json from a sb3 project.
     *
     * If you need the project JSON from the actual project you want to test,
     * it's more efficient to use `prepareVm`, since that will re-use the created
     * VM.
     *
     * @param {EvalConfig} config
     * @return {Promise<Object>}
     */

  }, {
    key: "getProjectJson",
    value: function () {
      var _getProjectJson = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.vm) {
                  this.vm = new scratch_vm__WEBPACK_IMPORTED_MODULE_0___default.a();
                }

                _context.next = 3;
                return loadVm(this.vm, config.template, config.canvas);

              case 3:
                return _context.abrupt("return", JSON.parse(this.vm.toJSON()));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getProjectJson(_x3) {
        return _getProjectJson.apply(this, arguments);
      }

      return getProjectJson;
    }()
    /**
     * Set-up the scratch vm. After calling this function,
     * the vmLoaded promise will be resolved.
     *
     * @param {EvalConfig} config
     *
     * @return {Promise<Object>} The JSON representation of the
     */

  }, {
    key: "prepareVm",
    value: function () {
      var _prepareVm = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(config) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.vm) {
                  this.vm = new scratch_vm__WEBPACK_IMPORTED_MODULE_0___default.a();
                }
                /**
                 * The scratch virtual machine.
                 *
                 * @type {VirtualMachine};
                 */


                _context2.next = 3;
                return loadVm(this.vm, config.submission, config.canvas, this);

              case 3:
                // Attach handlers
                this.attachEventHandles(); // Enable profiling.

                this.createProfiler();
                console.log('Loading is finished.');
                this.vmLoaded.resolve();
                return _context2.abrupt("return", JSON.parse(this.vm.toJSON()));

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function prepareVm(_x4) {
        return _prepareVm.apply(this, arguments);
      }

      return prepareVm;
    }()
    /**
     * Prepare the VM for execution. This will prepare the answers for
     * questions (if applicable) and instrument the VM to take the
     * acceleration factor into account.
     */

  }, {
    key: "prepareAndRunVm",
    value: function prepareAndRunVm() {
      this.providedAnswers = this.answers.slice(); // Optimisation.

      if (this.accelerationFactor.time !== 1) {
        // We need to instrument the VM.
        // Changing the events is not necessary; this
        // is handled by the event scheduler itself.
        // First, modify the step time.
        var currentStepInterval = this.vm.runtime.constructor.THREAD_STEP_INTERVAL;
        var newStepInterval = currentStepInterval / this.accelerationFactor.factor;
        Object.defineProperty(this.vm.runtime.constructor, "THREAD_STEP_INTERVAL", {
          value: newStepInterval
        }); // We also need to change various time stuff.

        this.acceleratePrimitive('control_wait', 'DURATION');
        this.acceleratePrimitive('looks_sayforsecs');
        this.acceleratePrimitive('looks_thinkforsecs');
        this.acceleratePrimitive('motion_glidesecstoxy');
        this.acceleratePrimitive('motion_glideto');
        this.accelerateTimer();
      } // Start the vm.


      this.vm.start();
    }
    /**
     * Adjust the given argument for a given opcode to the acceleration factor.
     *
     * This is used to modify "time" constants to account for the acceleration factor.
     * For example, if a condition is "wait for 10 seconds", but the acceleration factor
     * is 2, we only want to wait for 5 seconds, not 10.
     *
     * @param {string} opcode - The opcode to accelerate.
     * @param {string} argument - The argument to accelerate.
     * 
     * @private
     */

  }, {
    key: "acceleratePrimitive",
    value: function acceleratePrimitive(opcode) {
      var argument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'SECS';
      var original = this.vm.runtime.getOpcodeFunction(opcode);
      var factor = this.accelerationFactor.time || this.accelerationFactor.factor;

      this.vm.runtime._primitives[opcode] = function (originalArgs, util) {
        // For safety, clone the arguments.
        var args = _objectSpread({}, originalArgs);

        args[argument] = args[argument] / factor;
        return original(args, util);
      };
    }
    /**
     * Adjust the given method on the given device to account for the
     * acceleration factor.
     * 
     * This is mainly used to reverse accelerate the project timer.
     * E.g. if the project timer is counts 10s for a project with
     * acceleration factor 2, it should count 20s instead.
     */

  }, {
    key: "accelerateTimer",
    value: function accelerateTimer() {
      var factor = this.accelerationFactor.time || this.accelerationFactor;
      var device = this.vm.runtime.ioDevices.clock;
      var original = device.projectTimer;

      device.projectTimer = function () {
        return original.call(device) * factor;
      };
    }
    /**
     * Accelerate a certain number. This is intended for events.
     * 
     * @param {number|any} number - The number to accelerate. All non-numbers are returned as is.
     * @return {number|any}
     */

  }, {
    key: "accelerateEvent",
    value: function accelerateEvent(number) {
      var factor = this.accelerationFactor.event || this.accelerationFactor.factor;

      if (factor === 1 || typeof number !== 'number') {
        return number;
      }

      return number / factor;
    }
  }, {
    key: "terminate",
    value: function terminate() {
      var action = new _scheduler_end_js__WEBPACK_IMPORTED_MODULE_10__["EndAction"]();
      action.execute(this, function () {});
    }
    /**
     * Create a context with a fully prepared VM.
     *
     * @param {EvalConfig} config
     * @return {Promise<Context>}
     */

  }], [{
    key: "create",
    value: function () {
      var _create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(config) {
        var context;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                context = new Context();
                _context3.next = 3;
                return context.prepareVm(config);

              case 3:
                return _context3.abrupt("return", context);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function create(_x5) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }]);

  return Context;
}();



/***/ }),

/***/ "./src/deferred.js":
/*!*************************!*\
  !*** ./src/deferred.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Deferred; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A "Deferred" like implementation on top of a Promise.
 */
var Deferred = function Deferred() {
  var _this = this;

  _classCallCheck(this, Deferred);

  /**
   * The promise. Use this to await completion.
   * @type {Promise<any>}
   */
  this.promise = new Promise(function (resolve, reject) {
    /**
     * Call to resolve the underlying promise.
     * @type {function(any): void}
     */
    _this.resolve = resolve;
    /**
     * Call to reject the underlying promise.
     * @type {function(Error): void}
     */

    _this.reject = reject;
  });
};



/***/ }),

/***/ "./src/evaluation.js":
/*!***************************!*\
  !*** ./src/evaluation.js ***!
  \***************************/
/*! exports provided: run */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "run", function() { return run; });
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime.js */ "../../node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log.js */ "./src/log.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./context.js */ "./src/context.js");
/* harmony import */ var _project_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./project.js */ "./src/project.js");
/* harmony import */ var _scheduler_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scheduler/index.js */ "./src/scheduler/index.js");
/* harmony import */ var _testplan_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./testplan.js */ "./src/testplan.js");
/* harmony import */ var _lines_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lines.js */ "./src/lines.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// Neede for https://github.com/LLK/scratch-gui/issues/5025








var object;

if (typeof global === 'undefined') {
  object = window;
} else {
  object = global;
}
/**
 * Expose the some API in the global namespace.
 *
 * TODO: move these elsewhere.
 */


function expose() {
  object.numericEquals = _utils_js__WEBPACK_IMPORTED_MODULE_2__["numericEquals"];
  object.searchFrames = _log_js__WEBPACK_IMPORTED_MODULE_1__["searchFrames"];
  object.sprite = _scheduler_index_js__WEBPACK_IMPORTED_MODULE_5__["sprite"];
  object.broadcast = _scheduler_index_js__WEBPACK_IMPORTED_MODULE_5__["broadcast"];
  object.delay = _scheduler_index_js__WEBPACK_IMPORTED_MODULE_5__["delay"];
  object.distSq = _lines_js__WEBPACK_IMPORTED_MODULE_7__["distSq"];
}
/**
 * A bundle of all inputs for the judge. It contains all information
 * necessary for the judge to run a test.
 *
 * @typedef {Object} EvalConfig
 * @property {string|ArrayBuffer} submission - The submission sb3 data.
 * @property {string|ArrayBuffer} template - The template sb3 file.
 * @property {HTMLCanvasElement} canvas - The canvas for the renderer.
 */


var EvaluationStage = {
  not_started: 0,
  before: 1,
  scheduling: 2,
  executing: 3,
  after: 4
};
/**
 * Entry point for the test plan API.
 *
 * When writing tests, you should limit interaction with Scratch and
 * the judge to this class, if at all possible.
 *
 * While possible, you should limit yourself to the function
 */

var Evaluation = /*#__PURE__*/function (_TabLevel) {
  _inherits(Evaluation, _TabLevel);

  var _super = _createSuper(Evaluation);

  /**
   * @param {Context} context
   */
  function Evaluation(context) {
    var _this;

    _classCallCheck(this, Evaluation);

    _this = _super.call(this, context);
    /**
     * Used to track the stage internally.
     * @type {number}
     * @protected
     */

    _this.stage = EvaluationStage.not_started;
    return _this;
  }
  /**
   * Get access to the log.
   *
   * @return {Log} The log.
   */


  _createClass(Evaluation, [{
    key: "log",
    get: function get() {
      return this.context.log;
    }
    /**
     * Get access to the scratch VM. This should be considered read-only.
     * If you modify the VM, there are no guarantees it will keep working.
     *
     * @return {VirtualMachine}
     */

  }, {
    key: "vm",
    get: function get() {
      return this.context.vm;
    }
    /**
     * Get the array of answers provided previously.
     *
     * @return {string[]}
     */

  }, {
    key: "answers",
    get: function get() {
      return this.context.answers;
    }
    /**
     * Set the array of answers to provide to the submission.
     *
     * @param {string[]} answers
     */
    ,
    set: function set(answers) {
      this.context.answers = answers;
    }
    /**
     * Get the output manager.
     *
     * @return {ResultManager}
     */

  }, {
    key: "output",
    get: function get() {
      return this.context.output;
    }
    /**
     * Get the event scheduler.
     *
     * @return {ScheduledEvent}
     */

  }, {
    key: "scheduler",
    get: function get() {
      return this.context.event;
    }
    /** @param {number} timeout */

  }, {
    key: "actionTimeout",
    get:
    /** @return {number} */
    function get() {
      return this.context.actionTimeout;
    }
    /**
     * Set the acceleration factor for the test.
     * @param {number} factor - The factor, e.g. 2 will double the speed.
     */
    ,
    set: function set(timeout) {
      this.assertBefore(EvaluationStage.scheduling, "actionTimeout");
      this.context.actionTimeout = timeout;
    }
  }, {
    key: "acceleration",
    get:
    /**
     * @return {number}
     */
    function get() {
      return this.context.accelerationFactor.factor;
    }
    /**
     * Set the acceleration factor for the test's times.
     * This will be used to set the timeouts for the scheduled events.
     * 
     * @param {number} factor - The factor, e.g. 2 will double the speed.
     */
    ,
    set: function set(factor) {
      this.assertBefore(EvaluationStage.scheduling, "acceleration");
      this.context.accelerationFactor = {
        factor: factor
      };
    }
  }, {
    key: "timeAcceleration",
    get: function get() {
      return this.context.accelerationFactor.time;
    }
    /**
     * Set the acceleration factor for the event times.
     * This will be used to set the timeouts for the scheduled events.
     *
     * @param {number} factor - The factor, e.g. 2 will double the speed.
     */
    ,
    set: function set(factor) {
      this.assertBefore(EvaluationStage.scheduling, "timeAcceleration");
      this.context.accelerationFactor.time = factor;
    }
  }, {
    key: "eventAcceleration",
    get: function get() {
      return this.context.accelerationFactor.event;
    },
    set: function set(factor) {
      this.assertBefore(EvaluationStage.scheduling, "eventAcceleration");
      this.context.accelerationFactor.event = factor;
    }
  }, {
    key: "runError",
    get: function get() {
      return this.context.error;
    }
    /**
     * Enables or disabled turbo mode.
     * 
     * @param {boolean} enabled
     */
    // eslint-disable-next-line accessor-pairs

  }, {
    key: "turboMode",
    set: function set(enabled) {
      this.context.vm.setTurboMode(enabled);
    }
    /**
     * Check that we are before or on a given stage.
     * @param {number} stage
     * @param {string} func
     */

  }, {
    key: "assertBefore",
    value: function assertBefore(stage, func) {
      if (this.stage > stage) {
        throw new Error("The function ".concat(func, " cannot be used at this stage: it must be used earlier."));
      }
    }
  }]);

  return Evaluation;
}(_testplan_js__WEBPACK_IMPORTED_MODULE_6__["TabLevel"]);
/**
 * Function that runs before the project is started. This can be used to
 * run static checks on the submitted project. For your convenience, the
 * template project is also provided. One example where this can be used
 * is to check if there were no sprites removed in the submission.
 *
 * @callback BeforeExecution
 * @param {Project} template - The template project.
 * @param {Project} submission - The submission project.
 * @param {Evaluation} output - The output manager.
 * @return {void} Nothing -> ignored.
 */

/**
 * Function that is run just before the project is executed, allowing to
 * schedule events, inputs and tests for during the execution. While you
 * have full access to the log in this stage, it might not be properly
 * filled. It is recommend to put tests using the log in the afterExecution
 * step.
 *
 * @callback DuringExecution
 * @param {Evaluation} evaluation - The judge object, providing the API.
 * @return {void} Nothing -> ignored.
 */

/**
 * Function that is run after the project has been executed. At this
 * point the log is filled, and available for inspection. Mosts tests
 * in this stage are in the category of checking the end state of the
 * execution: checking how the project reacted to the instructions
 * scheduled in the "duringExecution" step.
 *
 * @callback AfterExecution
 * @param {Evaluation} evaluation - The judge object, providing the API.
 * @return {void} Nothing -> ignored.
 */

/**
 * Run the judge.
 *
 * @param {EvalConfig} config - The config with the inputs for the judge.
 *
 * @return {Promise<void>}
 */


function run(_x) {
  return _run.apply(this, arguments);
} // Main function in the judge.

function _run() {
  _run = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config) {
    var context, templateJson, submissionJson, testplan, judge;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            context = new _context_js__WEBPACK_IMPORTED_MODULE_3__["default"]();
            _context.next = 3;
            return context.getProjectJson(config);

          case 3:
            templateJson = _context.sent;
            _context.next = 6;
            return context.prepareVm(config);

          case 6:
            submissionJson = _context.sent;
            testplan = {
              /** @type {BeforeExecution} */
              beforeExecution: window.beforeExecution || function () {},

              /** @type {DuringExecution} */
              duringExecution: window.duringExecution || function (e) {
                return e.scheduler.end();
              },

              /** @type {AfterExecution} */
              afterExecution: window.afterExecution || function () {}
            };
            context.output.startJudgement();
            context.stage = EvaluationStage.before;
            judge = new Evaluation(context);
            _context.prev = 11;
            // Run the tests before the execution.
            testplan.beforeExecution(new _project_js__WEBPACK_IMPORTED_MODULE_4__["default"](templateJson), new _project_js__WEBPACK_IMPORTED_MODULE_4__["default"](submissionJson), judge);
            expose();
            _context.next = 16;
            return context.vmLoaded.promise;

          case 16:
            context.stage = EvaluationStage.scheduling; // Schedule the commands for the duration.

            testplan.duringExecution(judge);
            context.stage = EvaluationStage.executing; // Prepare the context for execution.

            context.prepareAndRunVm(); // Run the events.

            _context.next = 22;
            return context.event.run(context);

          case 22:
            _context.next = 24;
            return context.simulationEnd.promise;

          case 24:
            context.stage = EvaluationStage.after; // Do post-mortem tests.

            testplan.afterExecution(judge);
            _context.next = 36;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](11);

            if (_context.t0 instanceof _testplan_js__WEBPACK_IMPORTED_MODULE_6__["FatalErrorException"]) {
              _context.next = 34;
              break;
            }

            throw _context.t0;

          case 34:
            console.warn("Stopping tests due to fatal test not passing.");
            console.warn(_context.t0);

          case 36:
            context.output.closeJudgement();
            console.log('--- END OF EVALUATION ---');

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[11, 28]]);
  }));
  return _run.apply(this, arguments);
}

object.run = run;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../node_modules/webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/index.cjs":
/*!***********************!*\
  !*** ./src/index.cjs ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Wrapper for common js modules.
const result = __webpack_require__(/*! ./evaluation.js */ "./src/evaluation.js");

module.exports = result.run;

/***/ }),

/***/ "./src/lines.js":
/*!**********************!*\
  !*** ./src/lines.js ***!
  \**********************/
/*! exports provided: distSq, dist, isEqual, removeDuplicates, squareTest, mergeLines, pointsAreSquare, findSquareLength, findSquares, pointsAreTriangle, findTriangles */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "distSq", function() { return distSq; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dist", function() { return dist; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEqual", function() { return isEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeDuplicates", function() { return removeDuplicates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "squareTest", function() { return squareTest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeLines", function() { return mergeLines; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pointsAreSquare", function() { return pointsAreSquare; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findSquareLength", function() { return findSquareLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findSquares", function() { return findSquares; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pointsAreTriangle", function() { return pointsAreTriangle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findTriangles", function() { return findTriangles; });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* Copyright (C) 2019 Ghent University - All Rights Reserved */
// CONSTANTS
var threshold = 0.01; // Calculates the squared distance between two points

function distSq(p1, p2) {
  return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}
function dist(line) {
  return Math.sqrt(distSq(line.start, line.end));
} // Checks if two numbers d1 and d2 are almost equal. (The difference has to be smaller than a certain threshold)

function isEqual(d1, d2) {
  return d1 - d2 < threshold && d1 - d2 > -threshold;
} // Removed duplicate points from an array of points by checking if the position in the list is equal to the position
// of the first occurance of the point.

function removeDuplicates(myArray) {
  return myArray.filter(function (obj, index, self) {
    return index === self.findIndex(function (t) {
      return isEqual(t.x, obj.x) && isEqual(t.y, obj.y);
    });
  });
} // If d1 and d2 are the same, then following conditions must met to form a square.
// 1) Square of d3 is same as twice the square of d1
// 2) Square of d2 is same as twice the square of d1

function squareTest(d1, d2, d3, p1, p2, p3) {
  if (isEqual(d1, d2) && isEqual(2 * d1, d3) && isEqual(2 * d1, distSq(p1, p2))) {
    var d = distSq(p1, p3);
    return isEqual(d, distSq(p2, p3)) && isEqual(d, d1);
  }

  return false;
} // EXPORTED FUNCTIONS
// Function that takes an array of line segments and merges the overlapping segments.
// It returns an array with the merged lines.

function mergeLines(lines) {
  var ricoDict = {};
  var vertDict = {}; // sort op rico and on intersection with the y-axis:
  // This groups line segments on the same line together.

  for (var i = 0; i < lines.length; i++) {
    var p1 = lines[i].start;
    var p2 = lines[i].end;
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;

    if (x1 === x2) {
      if (x1 in vertDict) {
        vertDict[x1].push(lines[i]);
      } else {
        vertDict[x1] = [lines[i]];
      }
    } else {
      var rico = (y2 - y1) / (x2 - x1);
      var b = (y1 - rico * x1).toFixed(4);
      rico = rico.toFixed(4);

      if (rico in ricoDict) {
        var lineDict = ricoDict[rico];

        if (b in lineDict) {
          lineDict[b].push(lines[i]);
        } else {
          lineDict[b] = [lines[i]];
        }

        ricoDict[rico] = lineDict;
      } else {
        var _lineDict = {};
        _lineDict[b] = [lines[i]];
        ricoDict[rico] = _lineDict;
      }
    }
  } // sort rico dictionary on intersection with y-axis.


  var merged_lines = [];

  for (var _i = 0, _Object$entries = Object.entries(ricoDict); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        _rico = _Object$entries$_i[0],
        ld = _Object$entries$_i[1];

    for (var _i2 = 0, _Object$entries2 = Object.entries(ld); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          _b = _Object$entries2$_i[0],
          _lines = _Object$entries2$_i[1];

      var line = _lines[0];

      for (var _i3 = 1; _i3 < _lines.length; _i3++) {
        if (distSq(line.start, _lines[_i3].end) > distSq(line.end, _lines[_i3].start)) {
          line = {
            start: line.start,
            end: _lines[_i3].end
          };
        } else {
          line = {
            start: _lines[_i3].start,
            end: line.end
          };
        }
      }

      merged_lines.push(line);
    }
  }

  for (var _i4 = 0, _Object$entries3 = Object.entries(vertDict); _i4 < _Object$entries3.length; _i4++) {
    var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i4], 2),
        x = _Object$entries3$_i[0],
        _lines2 = _Object$entries3$_i[1];

    var _line = _lines2[0];

    for (var _i5 = 1; _i5 < _lines2.length; _i5++) {
      if (distSq(_line.start, _lines2[_i5].end) > distSq(_line.end, _lines2[_i5].start)) {
        _line = {
          start: _line.start,
          end: _lines2[_i5].end
        };
      } else {
        _line = {
          start: _lines2[_i5].start,
          end: _line.end
        };
      }
    }

    merged_lines.push(_line);
  }

  return merged_lines;
} // Given points, test if they form a square

function pointsAreSquare(points) {
  // only square if there are four unique points
  if (points.length === 4) {
    var p1 = points[0];
    var p2 = points[1];
    var p3 = points[2];
    var p4 = points[3];
    var d2 = distSq(p1, p2); // distance squared from p1 to p2

    var d3 = distSq(p1, p3); // distance squared from p1 to p3

    var d4 = distSq(p1, p4); // distance squared from p1 to p4
    // test if the points form a square

    if (squareTest(d2, d3, d4, p2, p3, p4)) return true;
    if (squareTest(d3, d4, d2, p3, p4, p2)) return true;
    if (squareTest(d2, d4, d3, p2, p4, p3)) return true;
  }

  return false;
}
function findSquareLength(points) {
  var l = 0;

  for (var i = 0; i < 4; i++) {
    var p = points[i];

    for (var j = 0; j < 4; j++) {
      if (i !== j) {
        var q = points[j];
        var d = distSq(p, q);

        if (d < l || l === 0) {
          l = d;
        }
      }
    }
  }

  return Math.sqrt(l);
}
function findSquares(lines) {
  var squares = [];
  if (lines.length < 4) return false; // no square without at least 4 sides

  var merged_lines = mergeLines(lines); //
  // check if four points are a square
  //

  for (var i = 0; i < merged_lines.length - 3; i++) {
    for (var j = i + 1; j < merged_lines.length - 2; j++) {
      for (var k = j + 1; k < merged_lines.length - 1; k++) {
        for (var l = k + 1; l < merged_lines.length; l++) {
          var p11 = merged_lines[i].start;
          var p12 = merged_lines[i].end;
          var p21 = merged_lines[j].start;
          var p22 = merged_lines[j].end;
          var p31 = merged_lines[k].start;
          var p32 = merged_lines[k].end;
          var p41 = merged_lines[l].start;
          var p42 = merged_lines[l].end;
          var points = [p11, p12, p21, p22, p31, p32, p41, p42]; // from the 8 points, there should be 4 pairs of equal points

          points = removeDuplicates(points);
          var square = {
            points: points,
            length: findSquareLength(points)
          };
          if (pointsAreSquare(points)) squares.push(square);
        }
      }
    }
  }

  return squares;
}
function pointsAreTriangle(points) {
  // given points are not equal
  return points.length === 3;
}
function findTriangles(lines) {
  var triangles = [];
  if (lines.length < 3) return false;
  var mergedLinesList = mergeLines(lines);

  for (var i = 0; i < mergedLinesList.length - 2; i++) {
    for (var j = i + 1; j < mergedLinesList.length - 1; j++) {
      for (var k = j + 1; k < mergedLinesList.length; k++) {
        var p11 = mergedLinesList[i].start;
        var p12 = mergedLinesList[i].end;
        var p21 = mergedLinesList[j].start;
        var p22 = mergedLinesList[j].end;
        var p31 = mergedLinesList[k].start;
        var p32 = mergedLinesList[k].end;
        var points = [p11, p12, p21, p22, p31, p32]; // from the 6 points, there should be 3 pairs of equal points

        points = removeDuplicates(points);
        if (pointsAreTriangle(points)) triangles.push(points);
      }
    }
  }

  return triangles;
}

/***/ }),

/***/ "./src/listener.js":
/*!*************************!*\
  !*** ./src/listener.js ***!
  \*************************/
/*! exports provided: ThreadListener, BroadcastListener */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThreadListener", function() { return ThreadListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BroadcastListener", function() { return BroadcastListener; });
/* harmony import */ var _deferred_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deferred.js */ "./src/deferred.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* Copyright (C) 2019 Ghent University - All Rights Reserved */


var Listener = /*#__PURE__*/function () {
  function Listener() {
    _classCallCheck(this, Listener);

    this.active = true;
    /**
     * @protected
     * @type {Deferred}
     * */

    this.deffered = new _deferred_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  /**
   * @return {Promise<string>}
   */


  _createClass(Listener, [{
    key: "promise",
    get: function get() {
      return this.deffered.promise;
    }
  }]);

  return Listener;
}();
/**
 * Listens to thread updates and resolves once all initial threads
 * are finished.
 *
 * This class is mostly registered in the event scheduler to wait
 * on a bunch of threads. Once all are resolved, the `actionEnded`
 * property will be resolved as well.
 */


var ThreadListener = /*#__PURE__*/function (_Listener) {
  _inherits(ThreadListener, _Listener);

  var _super = _createSuper(ThreadListener);

  /**
   * Initialise the listener with the given threads.
   *
   * If there are no threads, the listener will resolve immediately.
   *
   * @param {Thread[]} threads - The threads to wait on.
   */
  function ThreadListener() {
    var _this;

    var threads = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, ThreadListener);

    _this = _super.call(this);
    /** @private */

    _this.threads = threads;

    if (threads.length === 0) {
      _this.active = false;

      _this.deffered.resolve('no threads in action');
    }

    return _this;
  }
  /**
   * Update the threads. This is called when the VM emits
   * a thread update event.
   *
   * @param {Thread} thread - A thread that has finished running.
   */


  _createClass(ThreadListener, [{
    key: "update",
    value: function update(thread) {
      this.threads = this.threads.filter(function (t) {
        return t !== thread;
      });

      if (this.threads.length === 0) {
        this.deffered.resolve('all threads completed');
        this.active = false;
      }
    }
  }]);

  return ThreadListener;
}(Listener);
/**
 * Listens to broadcasts, and resolves once a broadcast has been found.
 */

var BroadcastListener = /*#__PURE__*/function (_Listener2) {
  _inherits(BroadcastListener, _Listener2);

  var _super2 = _createSuper(BroadcastListener);

  /**
   * @param {string} broadcastName
   */
  function BroadcastListener(broadcastName) {
    var _this2;

    _classCallCheck(this, BroadcastListener);

    _this2 = _super2.call(this);
    _this2.name = broadcastName;
    return _this2;
  }

  _createClass(BroadcastListener, [{
    key: "update",
    value: function update(options) {
      var _options$matchFields;

      if ((options === null || options === void 0 ? void 0 : (_options$matchFields = options.matchFields) === null || _options$matchFields === void 0 ? void 0 : _options$matchFields.BROADCAST_OPTION) === this.name) {
        this.deffered.resolve("received broadcast ".concat(this.name));
        this.active = false;
      }
    }
  }]);

  return BroadcastListener;
}(Listener);

/***/ }),

/***/ "./src/log.js":
/*!********************!*\
  !*** ./src/log.js ***!
  \********************/
/*! exports provided: LoggedVariable, LoggedSprite, LogFrame, searchFrames, LogRenderer, LogBlocks, LogEvent, Log */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoggedVariable", function() { return LoggedVariable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoggedSprite", function() { return LoggedSprite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogFrame", function() { return LogFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "searchFrames", function() { return searchFrames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogRenderer", function() { return LogRenderer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogBlocks", function() { return LogBlocks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogEvent", function() { return LogEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Log", function() { return Log; });
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/last */ "../../node_modules/lodash/last.js");
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_last__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/first */ "../../node_modules/lodash/first.js");
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_first__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/isEqual */ "../../node_modules/lodash/isEqual.js");
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./blocks */ "./src/blocks.js");
/* harmony import */ var _lines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lines */ "./src/lines.js");
/* harmony import */ var lodash_array_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash/array.js */ "../../node_modules/lodash/array.js");
/* harmony import */ var lodash_array_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_array_js__WEBPACK_IMPORTED_MODULE_5__);
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }







/**
 * Our own version of a variable. Basically a copy of a {@link Variable}.
 */

var LoggedVariable =
/**
 * @param {Variable} variable - The source to copy from.
 */
function LoggedVariable(variable) {
  _classCallCheck(this, LoggedVariable);

  this.id = variable.id;
  this.name = variable.name;
  this.type = variable.type;
  this.value = variable.value;
};
/**
 * Our own version of a sprite. Basically a copy of a {@link RenderedTarget}.
 */

var LoggedSprite = /*#__PURE__*/function () {
  /**
   * @param {RenderedTarget} target - The source to extract information from.
   * @param {Target[]} targets - Other targets.
   */
  function LoggedSprite(target, targets) {
    _classCallCheck(this, LoggedSprite);

    // Copy some properties
    this.id = target.id;
    this.name = target.getName();
    this.x = target.x;
    this.y = target.y;
    this.direction = target.direction;
    this.isStage = target.isStage;
    this.size = target.size;
    this.visible = target.visible;
    this.tempo = target.tempo;
    this.draggable = target.draggable;
    this.volume = target.volume;
    this.time = target.runtime.currentMSecs;
    this.type = target.type; // Copy variables.

    this.variables = [];

    for (var _i = 0, _Object$keys = Object.keys(target.variables || {}); _i < _Object$keys.length; _i++) {
      var varName = _Object$keys[_i];
      this.variables.push(new LoggedVariable(target.lookupVariableById(varName)));
    } // Copy sprite information.


    this.currentCostume = target.currentCostume;
    this.costume = target.getCurrentCostume().name;
    this.costumeSize = target.getCurrentCostume().size;
    this.isTouchingEdge = target.isTouchingEdge();
    this.bounds = target.getBounds(); // Get all targets that touch this one.

    this.touchingSprites = [];

    var _iterator = _createForOfIteratorHelper(targets),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var otherTarget = _step.value;

        if (otherTarget.id === this.id) {
          // Skip self.
          continue;
        }

        this.touchingSprites.push({
          name: otherTarget.getName(),
          value: target.isTouchingSprite(otherTarget.getName())
        });
      }
      /** @deprecated */

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    this.isTouchingSprite = this.touchingSprites; // Get blocks.

    this.blocks = target.blocks._blocks;
    this.scriptes = target.blocks.getScripts();
  }
  /**
   * Check if this sprite contains a block with the given opcode.
   *
   * @param {string} opcode
   * @return {boolean}
   */


  _createClass(LoggedSprite, [{
    key: "hasBlock",
    value: function hasBlock(opcode) {
      return Object.values(this.blocks).some(function (block) {
        return block.opcode === opcode;
      });
    }
  }, {
    key: "blockList",
    value: function blockList() {
      return Object.values(this.blocks);
    }
    /**
     * Check if this sprite touches another sprite.
     *
     * @param {string} name The name of the other sprite.
     *
     * @return {boolean}
     */

  }, {
    key: "touches",
    value: function touches(name) {
      return this.touchingSprites.find(function (ts) {
        return ts.name === name;
      }).value;
    }
  }, {
    key: "getVariable",
    value: function getVariable(name) {
      var _iterator2 = _createForOfIteratorHelper(this.variables),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var variable = _step2.value;

          if (variable.name === name) {
            return variable;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return null;
    }
  }]);

  return LoggedSprite;
}();
/**
 * One captured moment during execution.
 *
 * A frame consists of a snapshot of the current state of the sprites
 * at the moment the frame was saved.
 *
 * A frame is created from a block, and extracts information from the
 * Scratch VM.
 *
 * @example
 * let frame = new Frame('looks_nextcostume');
 */

var LogFrame = /*#__PURE__*/function () {
  /**
   * When a new frame is created, information from the current state of the targets is saved. Some properties, like if the target is touching another target,
   * are calculated before being saved.
   *
   * @param {Context} context - The scratch virtual machine.
   * @param {string} block - The block that triggered the fame saving.
   */
  function LogFrame(context, block) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, LogFrame);

    /**
     * The timestamp of the frame.
     *
     * @type {number}
     */
    this.time = context.timestamp();
    /**
     * The name of the block that triggered this frame.
     * @type {string}
     */

    this.block = block;
    /**
     * The targets saved at this moment in the VM.
     * @type {LoggedSprite[]}
     */

    this.sprites = []; // For now we only save rendered targets.

    var _iterator3 = _createForOfIteratorHelper(context.vm.runtime.targets),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var target = _step3.value;
        this.sprites.push(new LoggedSprite(target, context.vm.runtime.targets));
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  /**
   * @param {string} spriteName - The name of the sprite that has to be returned.
   *
   * @returns {LoggedSprite | null} sprite - The found sprite or null if none was found.
   */


  _createClass(LogFrame, [{
    key: "getSprite",
    value: function getSprite(spriteName) {
      var _iterator4 = _createForOfIteratorHelper(this.sprites),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var sprite = _step4.value;

          if (sprite.name === spriteName) {
            return sprite;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return null;
    }
    /**
     * Check if two sprites were touching when the frame was captured.
     *
     * An exception will be thrown if the first sprite does not exist.
     *
     * @param {string} first - The first sprite.
     * @param {string} second - The second sprite.
     *
     * @return {boolean} If they were touching ir not.
     */

  }, {
    key: "areTouching",
    value: function areTouching(first, second) {
      var firstSprite = this.getSprite(first);

      if (firstSprite === null) {
        throw new TypeError("Cannot check non existing sprite ".concat(first));
      }

      return firstSprite.touches(second);
    }
    /**
     * @deprecated
     */

  }, {
    key: "isTouching",
    value: function isTouching(spriteName1, spriteName2) {
      this.areTouching(spriteName1, spriteName2);
    }
  }]);

  return LogFrame;
}();
/**
 * @typedef {Object} Constraints
 * @property {number|null} [before]
 * @property {number|null} [after]
 * @property {string|null} [type]
 */

/**
 * Search for frames with the given constraints.
 *
 * @param {LogFrame[]} frames - Frames to search.
 * @param {Constraints} constraints - Values to filter on.
 *
 * @return {LogFrame[]} A new instance of this array with the filtered values.
 */

function searchFrames(frames, constraints) {
  var before = constraints.before || lodash_last__WEBPACK_IMPORTED_MODULE_0___default()(frames).time;
  var after = constraints.after || 0;
  var type = constraints.type || null;
  return frames.filter(function (f) {
    return f.time >= after && f.time <= before && (f.type === type || type === null);
  });
}
/**
 * Saves render information.
 * TODO: review
 */

var LogRenderer = function LogRenderer() {
  _classCallCheck(this, LogRenderer);

  this.index = 0;
  this.lines = [];
  this.color = null;
  this.points = [];
  this.responses = [];
};
/**
 * Saves block information.
 * TODO: review
 */

var LogBlocks = /*#__PURE__*/function () {
  function LogBlocks() {
    _classCallCheck(this, LogBlocks);

    this.blocks = {};
  }

  _createClass(LogBlocks, [{
    key: "push",
    value: function push(block) {
      if (!this.blocks[block]) {
        this.blocks[block] = 0;
      }

      this.blocks[block]++;
    }
    /**
     * Check if the blocks contain a loop.
     * @return {boolean}
     */

  }, {
    key: "containsLoop",
    value: function containsLoop() {
      return this.blocks.some(function (key) {
        return key === 'control_repeat' || key === 'control_forever';
      });
    }
    /**
     * Check if the blocks contain a certain block.
     * @param {string} blockName The name of the block to search for.
     * @return {boolean}
     */

  }, {
    key: "containsBlock",
    value: function containsBlock(blockName) {
      return this.blocks.some(function (key) {
        return key === blockName;
      });
    }
  }, {
    key: "countExecutions",
    value: function countExecutions(name, blocks) {
      for (var key in blocks) {
        if (key === name) return blocks[key];
      }

      return 0;
    }
  }, {
    key: "numberOfExecutions",
    value: function numberOfExecutions(blockName) {
      return this.countExecutions(blockName, this.blocks);
    }
  }]);

  return LogBlocks;
}(); // TODO: review

var LogEvent = /*#__PURE__*/function () {
  /**
   *
   * @param {Context} context
   * @param type
   * @param data
   */
  function LogEvent(context, type) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, LogEvent);

    this.time = context.timestamp();
    this.type = type;
    this.data = data;
    /** @type {?LogFrame} */

    this.nextFrame = null;
    /** @type {?LogFrame} */

    this.previousFrame = null;
  }

  _createClass(LogEvent, [{
    key: "getNextFrame",
    value: function getNextFrame() {
      return this.nextFrame;
    }
  }, {
    key: "getPreviousFrame",
    value: function getPreviousFrame() {
      return this.previousFrame;
    }
  }]);

  return LogEvent;
}();

var Events = /*#__PURE__*/function () {
  function Events() {
    _classCallCheck(this, Events);

    this.list = [];
    /** @deprecated */

    this.length = 0;
    /** @deprecated */

    this.lastTime = 0;
  }
  /** @deprecated */


  _createClass(Events, [{
    key: "push",
    value: function push(event) {
      this.list.push(event);
      this.length++;
      this.lastTime = event.time;
    }
    /** @deprecated */

  }, {
    key: "filter",
    value: function filter(arg) {
      var type = arg.type || 'all';
      var before = arg.before || this.lastTime;
      var after = arg.after || 0;
      var filtered = [];

      var _iterator5 = _createForOfIteratorHelper(this.list),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var event = _step5.value;

          if (type === 'all' || event.type === type) {
            if (event.time >= after && event.time <= before) {
              filtered.push(event);
            }
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return filtered;
    }
    /** @deprecated */

  }, {
    key: "find",
    value: function find(a) {
      return this.list.find(a);
    }
    /** @deprecated */

  }, {
    key: "findIndex",
    value: function findIndex(a) {
      return this.list.findIndex(a);
    }
  }]);

  return Events;
}();

var Blocks = /*#__PURE__*/function () {
  function Blocks() {
    _classCallCheck(this, Blocks);

    this.blocks = {};
  }

  _createClass(Blocks, [{
    key: "push",
    value: function push(block) {
      if (!this.blocks[block]) {
        this.blocks[block] = 0;
      }

      this.blocks[block]++;
    }
  }, {
    key: "containsLoop",
    value: function containsLoop() {
      return Object(_blocks__WEBPACK_IMPORTED_MODULE_3__["containsLoop"])(this.blocks);
    }
  }, {
    key: "containsBlock",
    value: function containsBlock(blockName) {
      return Object(_blocks__WEBPACK_IMPORTED_MODULE_3__["containsBlock"])(blockName, this.blocks);
    }
  }, {
    key: "numberOfExecutions",
    value: function numberOfExecutions(blockName) {
      return Object(_blocks__WEBPACK_IMPORTED_MODULE_3__["countExecutions"])(blockName, this.blocks);
    }
  }]);

  return Blocks;
}(); // TODO: review


var Log = /*#__PURE__*/function () {
  function Log() {
    _classCallCheck(this, Log);

    /** @type LogFrame[] */
    this.frames = [];
    this.events = new Events();
    this.renderer = new LogRenderer();
    this.blocks = new Blocks();
  }
  /**
   * Get the first saved frame.
   *
   * @return {LogFrame|undefined}
   */


  _createClass(Log, [{
    key: "initial",
    get: function get() {
      return lodash_first__WEBPACK_IMPORTED_MODULE_1___default()(this.frames);
    }
    /**
     * Get the current frame, i.e. the last saved frame.
     *
     * @return {LogFrame|undefined}
     */

  }, {
    key: "current",
    get: function get() {
      return lodash_last__WEBPACK_IMPORTED_MODULE_0___default()(this.frames);
    }
    /**
     * Add a frame.
     * @param {Context} context
     * @param block
     */

  }, {
    key: "addFrame",
    value: function addFrame(context, block) {
      var frame = new LogFrame(context, block);
      this.frames.push(frame);
      this.blocks.push(block);
    }
  }, {
    key: "addEvent",
    value: function addEvent(event) {
      this.events.push(event);
    }
  }, {
    key: "reset",
    value: function reset() {// not needed
    }
    /**
     * @return {LogFrame} return final state of sprites
     */

  }, {
    key: "sprites",
    get: function get() {
      return this.frames[this.frames.length - 1];
    } // Functions needed for evaluation
    // Sprite related

  }, {
    key: "getCostumes",
    value: function getCostumes(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var costumes = {};
      var costumeIds = new Set();

      var _iterator6 = _createForOfIteratorHelper(frames),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var frame = _step6.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (!costumeIds.has(sprite.currentCostume)) {
              costumeIds.add(sprite.currentCostume);
              costumes[sprite.currentCostume] = sprite.costume;
            }
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return costumes;
    }
  }, {
    key: "getNumberOfCostumes",
    value: function getNumberOfCostumes(spriteName) {
      var costumes = this.getCostumes(spriteName);
      return Object.keys(costumes).length;
    }
  }, {
    key: "getVariableValue",
    value: function getVariableValue(variableName) {
      var spriteName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Stage';
      var frame = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.sprites;

      var _iterator7 = _createForOfIteratorHelper(frame.sprites),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var sprite = _step7.value;

          if (sprite.name === spriteName) {
            var _iterator8 = _createForOfIteratorHelper(sprite.variables),
                _step8;

            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var variable = _step8.value;

                if (variable.name === variableName) {
                  return variable.value;
                }
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "getVariables",
    value: function getVariables(variableName) {
      var spriteName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Stage';
      var frames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.frames;
      return frames.map(function (frame) {
        return frame.getSprite(spriteName);
      }).map(function (sprite) {
        return sprite.getVariable(variableName);
      }).map(function (variable) {
        return variable.value;
      }).filter(function (item, pos, arr) {
        return pos === 0 || !lodash_isEqual__WEBPACK_IMPORTED_MODULE_2___default()(item, arr[pos - 1]);
      });
    }
  }, {
    key: "getStartSprites",
    value: function getStartSprites() {
      return this.frames[0].sprites;
    }
  }, {
    key: "getMaxX",
    value: function getMaxX(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var max = -240;

      var _iterator9 = _createForOfIteratorHelper(frames),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var frame = _step9.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (sprite.x > max) {
              max = sprite.x;
            }
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      return max;
    }
  }, {
    key: "getMinX",
    value: function getMinX(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var min = 240;

      var _iterator10 = _createForOfIteratorHelper(frames),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var frame = _step10.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (sprite.x < min) {
              min = sprite.x;
            }
          }
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      return min;
    }
  }, {
    key: "getMaxY",
    value: function getMaxY(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var max = -180;

      var _iterator11 = _createForOfIteratorHelper(frames),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var frame = _step11.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (sprite.y > max) {
              max = sprite.y;
            }
          }
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      return max;
    }
  }, {
    key: "getMinY",
    value: function getMinY(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var min = 180;

      var _iterator12 = _createForOfIteratorHelper(frames),
          _step12;

      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var frame = _step12.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (sprite.y < min) {
              min = sprite.y;
            }
          }
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }

      return min;
    }
  }, {
    key: "hasSpriteMoved",
    value: function hasSpriteMoved(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      if (frames.length === 0) return false;
      var minX = this.getMinX(spriteName, frames);
      var maxX = this.getMaxX(spriteName, frames);
      var minY = this.getMinY(spriteName, frames);
      var maxY = this.getMaxY(spriteName, frames);
      return !(minX === maxX && minY === maxY);
    }
  }, {
    key: "inBounds",
    value: function inBounds(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;

      var _iterator13 = _createForOfIteratorHelper(frames),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var frame = _step13.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (sprite.isTouchingEdge) {
              return false;
            }
          }
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      return true;
    }
  }, {
    key: "getDirectionChanges",
    value: function getDirectionChanges(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var directions = [];
      var oldDirection = 0;

      var _iterator14 = _createForOfIteratorHelper(frames),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var frame = _step14.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (oldDirection !== sprite.direction) {
              directions.push(sprite.direction);
              oldDirection = sprite.direction;
            }
          }
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      return directions;
    }
  }, {
    key: "getCostumeChanges",
    value: function getCostumeChanges(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var costumes = [];
      var oldCostume = '';

      var _iterator15 = _createForOfIteratorHelper(frames),
          _step15;

      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var frame = _step15.value;
          var sprite = frame.getSprite(spriteName);

          if (sprite != null) {
            if (oldCostume !== sprite.costume) {
              costumes.push(sprite.costume);
              oldCostume = sprite.costume;
            }
          }
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }

      return costumes;
    }
  }, {
    key: "isTouchingSprite",
    value: function isTouchingSprite(spriteName, targetName, frame) {
      return frame.isTouching(spriteName, targetName);
    }
  }, {
    key: "getDistancesToSprite",
    value: function getDistancesToSprite(spriteName, targetName) {
      var frames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.frames;
      var distances = [];

      var _iterator16 = _createForOfIteratorHelper(frames),
          _step16;

      try {
        for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
          var frame = _step16.value;
          var sprite = frame.getSprite(spriteName);
          var target = frame.getSprite(targetName);

          if (sprite != null && target != null) {
            distances.push(Math.sqrt(Object(_lines__WEBPACK_IMPORTED_MODULE_4__["distSq"])(sprite, target)));
          }
        }
      } catch (err) {
        _iterator16.e(err);
      } finally {
        _iterator16.f();
      }

      return distances;
    }
  }, {
    key: "doSpritesOverlap",
    value: function doSpritesOverlap(spriteName1, spriteName2) {
      var frame = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.sprites;
      var sprite1 = frame.getSprite(spriteName1);
      var sprite2 = frame.getSprite(spriteName2);
      var bounds1 = sprite1.bounds;
      var bounds2 = sprite2.bounds; // If one rectangle is on left side of other

      if (bounds1.left > bounds2.right || bounds1.right < bounds2.left) {
        return false;
      } // If one rectangle is above other


      if (bounds1.top < bounds2.bottom || bounds1.bottom > bounds2.top) {
        return false;
      }

      return true;
    }
    /**
     * Get all logged locations of a sprite.
     *
     * The locations are consecutively unique: if a sprite hasn't moved between
     * two logged frames, only one position will be included.
     *
     * @param {string} sprite - The name of the sprite.
     * @param {LogFrame[]} frames - The frames to search. Defaults to all frames.
     * @return {Array<{x:Number, y:Number}>} The positions.
     */

  }, {
    key: "getSpritePositions",
    value: function getSpritePositions(sprite) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      return frames.map(function (frame) {
        return frame.getSprite(sprite);
      }).map(function (sprite) {
        return {
          x: sprite.x,
          y: sprite.y
        };
      }).filter(function (item, pos, arr) {
        return pos === 0 || !lodash_isEqual__WEBPACK_IMPORTED_MODULE_2___default()(item, arr[pos - 1]);
      });
    }
  }, {
    key: "getSprites",
    value: function getSprites(sprite) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      var mapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (s) {
        return s;
      };
      var sprites = frames.map(function (frame) {
        return frame.getSprite(sprite);
      }).map(mapper);
      return Object(lodash_array_js__WEBPACK_IMPORTED_MODULE_5__["uniq"])(sprites);
    }
    /** @deprecated Use getSpritePositions */

  }, {
    key: "getSpriteLocations",
    value: function getSpriteLocations(spriteName) {
      var frames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.frames;
      return this.getSpritePositions(spriteName, frames);
    } // RENDERER RELATED

  }, {
    key: "getSquares",
    value: function getSquares() {
      return Object(_lines__WEBPACK_IMPORTED_MODULE_4__["findSquares"])(this.renderer.lines);
    }
  }, {
    key: "getTriangles",
    value: function getTriangles() {
      return Object(_lines__WEBPACK_IMPORTED_MODULE_4__["findTriangles"])(this.renderer.lines);
    }
  }, {
    key: "getMergedLines",
    value: function getMergedLines() {
      return Object(_lines__WEBPACK_IMPORTED_MODULE_4__["mergeLines"])(this.renderer.lines);
    }
  }, {
    key: "getLineLength",
    value: function getLineLength(line) {
      return Object(_lines__WEBPACK_IMPORTED_MODULE_4__["dist"])(line);
    }
  }, {
    key: "getResponses",
    value: function getResponses() {
      return this.renderer.responses;
    }
  }, {
    key: "getCreateSkinEvents",
    value: function getCreateSkinEvents() {
      var rendererEvents = this.events.filter({
        type: 'renderer'
      });
      var createTextSkinEvents = [];

      var _iterator17 = _createForOfIteratorHelper(rendererEvents),
          _step17;

      try {
        for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
          var event = _step17.value;

          if (event.data.name === 'createTextSkin') {
            createTextSkinEvents.push(event);
          }
        }
      } catch (err) {
        _iterator17.e(err);
      } finally {
        _iterator17.f();
      }

      return createTextSkinEvents;
    }
  }, {
    key: "getDestroySkinEvents",
    value: function getDestroySkinEvents() {
      var rendererEvents = this.events.filter({
        type: 'renderer'
      });
      var destroySkinEvents = [];

      var _iterator18 = _createForOfIteratorHelper(rendererEvents),
          _step18;

      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var event = _step18.value;

          if (event.data.name === 'destroySkin') {
            destroySkinEvents.push(event);
          }
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }

      return destroySkinEvents;
    }
  }, {
    key: "getSkinDuration",
    value: function getSkinDuration(text) {
      var createTextSkinEvents = this.getCreateSkinEvents();
      var destroyTextSkinEvents = this.getDestroySkinEvents();
      var time = 0;
      var id = -1;

      var _iterator19 = _createForOfIteratorHelper(createTextSkinEvents),
          _step19;

      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var e = _step19.value;

          if (e.data.text === text) {
            time = e.time;
            id = e.data.id;
          }
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }

      var _iterator20 = _createForOfIteratorHelper(destroyTextSkinEvents),
          _step20;

      try {
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          var _e = _step20.value;

          if (_e.data.id === id) {
            return _e.time - time;
          }
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
      }

      return null;
    }
  }]);

  return Log;
}();

/***/ }),

/***/ "./src/output.js":
/*!***********************!*\
  !*** ./src/output.js ***!
  \***********************/
/*! exports provided: CORRECT, WRONG, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CORRECT", function() { return CORRECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WRONG", function() { return WRONG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ResultManager; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Handle outputting. By default, all output is sent to stderr.
 *
 * @private
 */
function toOutput(output) {
  if (typeof window.handleOut !== 'undefined') {
    window.handleOut(output);
  } else {
    console.log(output);
  }
}
/**
 * @typedef {Object} Status
 * @property {string} human
 * @property {"time limit exceeded"|"runtime error"|"wrong"|"correct"} enum
 */

/** @type {Status} */


var CORRECT = {
  enum: 'correct',
  human: 'Correct'
};
/** @type {Status} */

var WRONG = {
  enum: 'wrong',
  human: 'Wrong'
};
/**
 * Manages the output for the Dodona-inspired format.
 *
 * While this class is exposed in testplans, in most cases
 * you should use the high-level testplan API instead of this one.
 *
 * ### Dodona format
 *
 * Some more information on the Dodona format. The format is a partial format.
 * The judge basically sends updates to the test result state via commands, e.g.
 * "start testcase X", "start test Y", "close testcase X", etc.
 *
 * For ease of use, the result manager will automatically open higher levels when
 * opening lower levels. For example, if you open a testcase without opening a
 * context first, the result manager will do so for you. Previous levels are also
 * closed when appropriate. For example, when starting a new tab, all previous tabs
 * will be closed.
 *
 * There is one exception: a test. If an open test is detected, an error will be thrown,
 * as the result manager has no way of knowing if the test is successful or not.
 */

var ResultManager = /*#__PURE__*/function () {
  function ResultManager() {
    _classCallCheck(this, ResultManager);

    this.out = toOutput;
    this.hasOpenJudgement = false;
    this.hasOpenTab = false;
    this.hasOpenContext = false;
    this.hasOpenCase = false;
    this.hasOpenTest = false;
    this.isFinished = false;
  }
  /**
   * Start the judgement.
   */


  _createClass(ResultManager, [{
    key: "startJudgement",
    value: function startJudgement() {
      if (this.isFinished) {
        console.warn('Attempting to start judgement after judgement has been completed. Ignoring.');
        return;
      }

      this.out({
        command: 'start-judgement'
      });
      this.hasOpenJudgement = true;
    }
    /**
     * Close the judgement. This will finish the judge, meaning all future
     * output is ignored.
     *
     * @param {boolean} [accepted] - If the judgement is accepted or not.
     */

  }, {
    key: "closeJudgement",
    value: function closeJudgement() {
      var accepted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      console.warn("Closing judgement...");

      if (this.isFinished) {
        console.warn('Attempting to close judgement after judgement has been completed. Ignoring.');
        return;
      }

      if (!this.hasOpenJudgement) {
        console.warn('Attempting to close judgement while none is open. Ignoring.');
        return;
      }

      if (this.hasOpenTab) {
        this.closeTab();
      }

      if (typeof accepted === 'undefined') {
        this.out({
          command: 'close-judgement'
        });
      } else {
        this.out({
          command: 'close-judgement',
          accepted: accepted,
          status: accepted ? CORRECT : WRONG
        });
      }

      this.hasOpenJudgement = false;
      this.isFinished = true;
    }
    /**
     * Start a tab.
     *
     * @param {string} title
     * @param {boolean} [hidden]
     */

  }, {
    key: "startTab",
    value: function startTab(title) {
      var hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (this.isFinished) {
        console.warn('Attempting to open tab after judgement has been completed. Ignoring.');
        return;
      }

      if (!this.hasOpenJudgement) {
        this.hasOpenJudgement();
      }

      if (this.hasOpenTab) {
        this.closeTab();
      }

      this.out({
        command: 'start-tab',
        title: title,
        hidden: hidden
      });
      this.hasOpenTab = true;
    }
    /**
     * Close a tab.
     */

  }, {
    key: "closeTab",
    value: function closeTab() {
      if (this.isFinished) {
        console.warn('Attempting to close tab after judgement has been completed. Ignoring.');
        return;
      }

      if (!this.hasOpenTab) {
        console.warn('Attempting to close tab while none is open. Ignoring.');
        return;
      }

      if (this.hasOpenContext) {
        this.closeContext();
      }

      this.out({
        command: 'close-tab'
      });
      this.hasOpenTab = false;
    }
    /**
     * Start a context. This will initialise other levels if needed.
     *
     * @param {string} [description] - Optional description of the context.
     */

  }, {
    key: "startContext",
    value: function startContext() {
      var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.isFinished) {
        console.warn('Attempting to start context after judgement has been completed.');
        return;
      }

      if (this.hasOpenContext) {
        this.closeContext();
      }

      if (!this.hasOpenTab) {
        this.startTab('Testen uit het testplan');
      }

      this.out({
        command: 'start-context',
        description: description
      });
      this.hasOpenContext = true;
    }
    /**
     * Close a context.
     *
     * @param {boolean} [accepted]
     */

  }, {
    key: "closeContext",
    value: function closeContext() {
      var accepted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.isFinished) {
        console.warn('Attempting to close context after judgement has been completed.');
        return;
      }

      if (!this.hasOpenContext) {
        console.warn('Attempting to close context while none is open. Ignoring.');
        return;
      }

      if (this.hasOpenCase) {
        this.closeTestcase();
      }

      this.out({
        command: 'close-context',
        accepted: accepted
      });
      this.hasOpenContext = false;
    }
    /**
     * Start a testcase. This will initialise other levels if needed.
     *
     * @param {string} [description] - Optional description of the context.
     */

  }, {
    key: "startTestcase",
    value: function startTestcase() {
      var description = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.isFinished) {
        console.warn('Attempting to start testcase after judgement has been completed.');
        return;
      }

      if (this.hasOpenCase) {
        this.closeTestcase();
      }

      if (!this.hasOpenContext) {
        this.startContext(description);
      }

      this.out({
        command: 'start-testcase',
        description: description
      });
      this.hasOpenCase = true;
    }
    /**
     * @param {boolean} [accepted]
     */

  }, {
    key: "closeTestcase",
    value: function closeTestcase() {
      var accepted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (this.isFinished) {
        console.warn('Attempting to close testcase after judgement has been completed.');
        return;
      }

      if (!this.hasOpenCase) {
        console.warn('Attempting to close testcase while none is open. Ignoring.');
        return;
      }

      if (this.hasOpenTest) {
        this.closeTest(undefined, accepted);
      }

      this.out({
        command: 'close-testcase',
        accepted: accepted
      });
      this.hasOpenCase = false;
    }
    /**
     * @param {any} expected
     * @param {string} [description]
     */

  }, {
    key: "startTest",
    value: function startTest(expected) {
      var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (this.isFinished) {
        console.warn('Attempting to start test after judgement has been completed.');
        return;
      }

      if (this.hasOpenTest) {
        this.closeTest(undefined, false);
      }

      if (!this.hasOpenCase) {
        this.startTestcase(description);
      }

      this.out({
        command: 'start-test',
        expected: expected === null || expected === void 0 ? void 0 : expected.toString(),
        description: description
      });
      this.hasOpenTest = true;
    }
    /**
     * @param {any} generated
     * @param {boolean} accepted
     * @param {Status} [status]
     */

  }, {
    key: "closeTest",
    value: function closeTest(generated, accepted) {
      var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

      if (this.isFinished) {
        console.warn('Attempting to close test after judgement has been completed.');
        return;
      }

      if (!this.hasOpenTest) {
        console.warn('Attempting to close test while none is open. Ignoring.');
        return;
      }

      this.out({
        command: 'close-test',
        generated: generated === null || generated === void 0 ? void 0 : generated.toString(),
        accepted: accepted,
        status: status || (accepted ? CORRECT : WRONG)
      });
      this.hasOpenTest = false;
    }
    /**
     * @param {string} message
     */

  }, {
    key: "appendMessage",
    value: function appendMessage(message) {
      if (!this.hasOpenJudgement) {
        console.warn('Attempting to append message while no judgement is open. Ignoring.');
        return;
      }

      this.out({
        command: 'append-message',
        message: message
      });
    }
    /**
     * @param {Status} status
     */

  }, {
    key: "escalateStatus",
    value: function escalateStatus(status) {
      if (!this.hasOpenJudgement) {
        console.warn('Attempting to escalate status of closed judgement. Ignoring.');
        return;
      }

      this.out({
        command: 'escalate-status',
        status: status
      });
    }
  }]);

  return ResultManager;
}();



/***/ }),

/***/ "./src/project.js":
/*!************************!*\
  !*** ./src/project.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Project; });
/* harmony import */ var _structures_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./structures.js */ "./src/structures.js");
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/isEqual */ "../../node_modules/lodash/isEqual.js");
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_1__);
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/**
 * A callback allowing comparison between two sprites.
 *
 * @callback SpritePredicate
 *
 * @param {Sb3Target} one - The first sprite, from the base project.
 * @param {Sb3Target} two - The second sprite, from the comparing project.
 *
 * @return {boolean} Value defined by usage.
 */

/**
 * Represents information about a Scratch project.
 *
 * Besides the query methods, the class also provides a bunch
 * of comparison methods, allowing for tests against two versions.
 */

var Project = /*#__PURE__*/function () {
  /**
   * @param {Object} json - The JSON extracted from the sb3 file.
   */
  function Project(json) {
    _classCallCheck(this, Project);

    /**
     * @type {Sb3Json}
     * @private
     */
    this.json = new _structures_js__WEBPACK_IMPORTED_MODULE_0__["Sb3Json"](json);
  }
  /**
   * Check if the given project has removed sprites in comparison to this project.
   *
   * @example
   * const template = new Project({..});
   * const submission = new Project({});
   *
   * template.hasRemovedSprites(submission);
   * // Returns true if the student removed some sprites.
   *
   * @param {Project} other - Project to check.
   *
   * @return {boolean}
   */


  _createClass(Project, [{
    key: "hasRemovedSprites",
    value: function hasRemovedSprites(other) {
      var names = new Set(other.json.targets.map(function (t) {
        return t.name;
      }));
      return !this.json.targets.every(function (t) {
        return names.has(t.name);
      });
    }
    /**
     * Check if the given project has added sprites in comparison to this project.
     *
     * @param {Project} other - Project to check.
     *
     * @return {boolean}
     */

  }, {
    key: "hasAddedSprites",
    value: function hasAddedSprites(other) {
      var names = new Set(this.json.targets.map(function (t) {
        return t.name;
      }));
      return other.json.targets.some(function (t) {
        return !names.has(t.name);
      });
    }
    /**
     * Check if the costume of one of the sprites changed in comparison to
     * the given project.
     *
     * If the sprite does not exist in either project, it does not have
     * changed costumes. If it does not exist in only one, it will be
     * considered changed.
     *
     * @param {Project} other - Project to compare to.
     * @param {string} sprite - Name of the sprite to check.
     */

  }, {
    key: "hasChangedCostumes",
    value: function hasChangedCostumes(other, sprite) {
      var _this$sprite, _this$sprite$costumes, _other$sprite, _other$sprite$costume;

      var myCostumeIds = (_this$sprite = this.sprite(sprite)) === null || _this$sprite === void 0 ? void 0 : (_this$sprite$costumes = _this$sprite.costumes) === null || _this$sprite$costumes === void 0 ? void 0 : _this$sprite$costumes.map(function (c) {
        return c.assetId;
      });
      var otherCustomIds = (_other$sprite = other.sprite(sprite)) === null || _other$sprite === void 0 ? void 0 : (_other$sprite$costume = _other$sprite.costumes) === null || _other$sprite$costume === void 0 ? void 0 : _other$sprite$costume.map(function (c) {
        return c.assetId;
      });
      return !lodash_isEqual__WEBPACK_IMPORTED_MODULE_1___default()(myCostumeIds, otherCustomIds);
    }
    /**
     * Check if a sprite has changed between this project and the given project,
     * as defined by the predicate. This allows for every flexible checks.
     *
     * The function handles cases where sprites are missing:
     * - If missing in both, returns false.
     * - If missing in one, but not the other, returns true.
     * - Else pass to the predicate.
     *
     * For example, to check if a given sprite has changed position:
     *
     * @example
     *  const template = new Project(templateJSON);
     *  const test = new Project(testJSON);
     *  template.hasChangedSprite(test, "test", (a, b) => a.size === b.size);
     *
     * @param {Project} other - Project to compare to.
     * @param {string} sprite - Name of the sprite.
     * @param {SpritePredicate} predicate - Return true if the sprite has changed.
     *
     * @return True if the sprite satisfies the change predicate.
     */

  }, {
    key: "hasChangedSprite",
    value: function hasChangedSprite(other, sprite, predicate) {
      var baseSprite = this.sprite(sprite);
      var comparisonSprite = other.sprite(sprite);

      if (baseSprite === null && comparisonSprite === null) {
        return false;
      }

      if (baseSprite === null || comparisonSprite === null) {
        return true;
      }

      return predicate(baseSprite, comparisonSprite);
    }
    /**
     * Check if a sprite has changed position.
     *
     * If the sprite does not exist in either project, it does not have
     * changed positions. If it does not exist in only one, it will be
     * considered changed.
     *
     * @param {Project} other - Project to compare to.
     * @param {string} sprite - Name of the sprite to check.
     */

  }, {
    key: "hasChangedPosition",
    value: function hasChangedPosition(other, sprite) {
      return this.hasChangedSprite(other, sprite, function (one, two) {
        return one.x !== two.x || one.y !== two.y;
      });
    }
    /**
     * Check if the project contains a sprite.
     *
     * @param {string} sprite - Name of the sprite.
     * @return {boolean}
     */

  }, {
    key: "containsSprite",
    value: function containsSprite(sprite) {
      return this.sprite(sprite) !== null;
    }
    /**
     * Get the sprite with the given name.
     *
     * @param {string} name - The name.
     *
     * @return {Sb3Sprite|Sb3Stage|null} The sprite or null if not found.
     */

  }, {
    key: "sprite",
    value: function sprite(name) {
      return this.json.targets.find(function (t) {
        return t.name === name;
      }) || null;
    }
    /**
     * @return {Sb3Sprite|Sb3Stage[]} A list of sprites in this project.
     */

  }, {
    key: "sprites",
    value: function sprites() {
      return this.json.targets;
    }
    /**
     * 
     * @param name
     * @return {null|{variable: Sb3Variable, target: Sb3Target}}
     */

  }, {
    key: "getVariable",
    value: function getVariable(name) {
      var _iterator = _createForOfIteratorHelper(this.json.targets),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var target = _step.value;

          for (var _i = 0, _Object$keys = Object.keys(target.variables); _i < _Object$keys.length; _i++) {
            var variable = _Object$keys[_i];

            /** @type {Sb3Variable} */
            var varObject = target.variables[variable];

            if (varObject.name === name) {
              return {
                target: target,
                variable: varObject
              };
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return null;
    }
  }]);

  return Project;
}();



/***/ }),

/***/ "./src/renderer.js":
/*!*************************!*\
  !*** ./src/renderer.js ***!
  \*************************/
/*! exports provided: makeProxiedRenderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeProxiedRenderer", function() { return makeProxiedRenderer; });
/* harmony import */ var scratch_render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! scratch-render */ "scratch-render");
/* harmony import */ var scratch_render__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scratch_render__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log.js */ "./src/log.js");
/* Copyright (C) 2019 Ghent University - All Rights Reserved */


/**
 * Intercept events from pen extension.
 *
 * @param {Context} context - The vm to intercept info from.
 * @param {ScratchRender} renderer - Renderer
 *
 * @see https://en.scratch-wiki.info/wiki/Pen_Extension
 */

function interceptPen(context, renderer) {
  console.log('Intercepting pen events...'); // Intercept lines

  var oldLine = renderer.penLine;
  renderer.penLine = new Proxy(oldLine, {
    apply: function apply(target, thisArg, argumentsList) {
      var p1 = {
        x: argumentsList[2],
        y: argumentsList[3]
      };
      var p2 = {
        x: argumentsList[4],
        y: argumentsList[5]
      };
      var line = {
        start: p1,
        end: p2
      };
      context.log.renderer.lines.push(line);
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'renderer', {
        name: 'penLine',
        line: line,
        color: argumentsList[1].color4f
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'penLine');
      event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'penLineEnd');
      context.log.addEvent(event);
      return target.apply(thisArg, argumentsList);
    }
  }); // Intercept points

  var penPointOld = renderer.penPoint;
  renderer.penPoint = new Proxy(penPointOld, {
    apply: function apply(target, thisArg, argumentsList) {
      var point = {
        x: argumentsList[2],
        y: argumentsList[3]
      };
      context.log.renderer.points.push(point);
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'renderer', {
        name: 'penPoint',
        point: point,
        color: argumentsList[1].color4f
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'penPoint');
      event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'penPointEnd');
      context.log.addEvent(event);
      return target.apply(thisArg, argumentsList);
    }
  }); // Intercept clear

  var penClearOld = renderer.penClear;
  renderer.penClear = new Proxy(penClearOld, {
    apply: function apply(target, thisArg, argumentsList) {
      context.log.renderer.lines = [];
      context.log.renderer.points = [];
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'renderer', {
        name: 'penClear'
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'penClear');
      event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'penClearEnd');
      context.log.addEvent(event);
      return target.apply(thisArg, argumentsList);
    }
  });
}
/**
 * Create a proxied renderer, allowing us to intercept various stuff.
 *
 * @param {Context} context - The context.
 * @param {HTMLCanvasElement} canvas - The canvas where the renderer should work.
 *
 * @return {ScratchRender}
 */


function makeProxiedRenderer(context, canvas) {
  var render = new scratch_render__WEBPACK_IMPORTED_MODULE_0___default.a(canvas);
  console.log('renderer created');
  interceptPen(context, render); // text bubble creation

  var createTextSkinOld = render.createTextSkin;
  render.createTextSkin = new Proxy(createTextSkinOld, {
    apply: function apply(target, thisArg, argumentsList) {
      var skinId = target.apply(thisArg, argumentsList);
      context.log.renderer.responses.push(argumentsList[1]);
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'renderer', {
        id: skinId,
        name: 'createTextSkin',
        text: argumentsList[1]
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'createTextSkin');
      event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'createTextSkinEnd');
      context.log.addEvent(event);
      return skinId;
    }
  });
  var updateTextSkinOld = render.updateTextSkin;
  render.updateTextSkin = new Proxy(updateTextSkinOld, {
    apply: function apply(target, thisArg, argumentsList) {
      context.log.renderer.responses.push(argumentsList[2]);
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'renderer', {
        name: 'updateTextSkin',
        text: argumentsList[2]
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'updateTextSkin');
      event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'updateTextSkinEnd');
      context.log.addEvent(event);
      return target.apply(thisArg, argumentsList);
    }
  });
  var destroySkinOld = render.destroySkin;
  render.destroySkin = new Proxy(destroySkinOld, {
    apply: function apply(target, thisArg, argumentsList) {
      var skinId = argumentsList[0];
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'renderer', {
        name: 'destroySkin',
        id: skinId
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'destroySkin');
      event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'destroySkinEnd');
      context.log.addEvent(event);
      return target.apply(thisArg, argumentsList);
    }
  });
  return render;
}

/***/ }),

/***/ "./src/scheduler/action.js":
/*!*********************************!*\
  !*** ./src/scheduler/action.js ***!
  \*********************************/
/*! exports provided: ScheduledAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScheduledAction", function() { return ScheduledAction; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Base class for scheduled actions.
 * 
 * When implementing an action, you should override the `execute` function.
 * Its docs contain information on what to do.
 * 
 * This is a class internal to the judge; do not use it in testplans.
 * 
 * @package
 */
var ScheduledAction = /*#__PURE__*/function () {
  function ScheduledAction() {
    _classCallCheck(this, ScheduledAction);
  }

  _createClass(ScheduledAction, [{
    key: "execute",
    value:
    /**
     * Execute the action. This should do what the action is supposed to do,
     * but should not concern itself with scheduling details.
     *
     * This method should be "sync": the resolve callback must be called when
     * the event is done, async or not. The framework will take care of the
     * async/sync scheduling.
     *
     * @param {Context} _context - The context.
     * @param {function(T):void} _resolve - Mark the action as done.
     */
    function execute(_context, _resolve) {
      throw new Error('You must implement and execution action.');
    }
    /**
     * Human readable string representation. The default implementation
     * returns the class name, but you should override this to add relevant
     * params.
     * 
     * @return {string}
     */

  }, {
    key: "toString",
    value: function toString() {
      return this.constructor.name;
    }
  }]);

  return ScheduledAction;
}();

/***/ }),

/***/ "./src/scheduler/broadcast.js":
/*!************************************!*\
  !*** ./src/scheduler/broadcast.js ***!
  \************************************/
/*! exports provided: SendBroadcastAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SendBroadcastAction", function() { return SendBroadcastAction; });
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log.js */ "./src/log.js");
/* harmony import */ var _listener_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../listener.js */ "./src/listener.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




/** @package */

var SendBroadcastAction = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(SendBroadcastAction, _ScheduledAction);

  var _super = _createSuper(SendBroadcastAction);

  /**
   * @param {string} name - The name of the broadcast
   */
  function SendBroadcastAction(name) {
    var _this;

    _classCallCheck(this, SendBroadcastAction);

    _this = _super.call(this);
    _this.name = name;
    return _this;
  }

  _createClass(SendBroadcastAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this2 = this;

      // Save the state of the sprite before the click event.

      /** @type {Target} */
      var target = context.vm.runtime.getTargetForStage();
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'broadcast', {
        target: target.getName()
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'broadcast');
      context.log.addEvent(event);
      var threads = context.vm.runtime.startHats('event_whenbroadcastreceived', {
        BROADCAST_OPTION: this.name
      });
      var action = new _listener_js__WEBPACK_IMPORTED_MODULE_2__["ThreadListener"](threads);
      context.threadListeners.push(action);
      action.promise.then(function () {
        // save sprites state after click
        event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'broadcastEnd');
        resolve("finished ".concat(_this2));
      });
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(_get(_getPrototypeOf(SendBroadcastAction.prototype), "toString", this).call(this), " of ").concat(this.name);
    }
  }]);

  return SendBroadcastAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);

/***/ }),

/***/ "./src/scheduler/callback.js":
/*!***********************************!*\
  !*** ./src/scheduler/callback.js ***!
  \***********************************/
/*! exports provided: CallbackAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallbackAction", function() { return CallbackAction; });
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


/**
 * @package
 */

var CallbackAction = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(CallbackAction, _ScheduledAction);

  var _super = _createSuper(CallbackAction);

  /**
   * @param {function():void} callback
   */
  function CallbackAction(callback) {
    var _this;

    _classCallCheck(this, CallbackAction);

    _this = _super.call(this);
    _this.callback = callback;
    return _this;
  }

  _createClass(CallbackAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      context.log.addFrame(context, 'manual_logging');
      this.callback();
      resolve("finished ".concat(this));
    }
  }]);

  return CallbackAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);

/***/ }),

/***/ "./src/scheduler/click.js":
/*!********************************!*\
  !*** ./src/scheduler/click.js ***!
  \********************************/
/*! exports provided: ClickSpriteAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClickSpriteAction", function() { return ClickSpriteAction; });
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log.js */ "./src/log.js");
/* harmony import */ var _listener_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../listener.js */ "./src/listener.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var STAGE = 'Stage';
/**
 * @package
 */

var ClickSpriteAction = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(ClickSpriteAction, _ScheduledAction);

  var _super = _createSuper(ClickSpriteAction);

  /**
   * @param {string} spriteName
   */
  function ClickSpriteAction(spriteName) {
    var _this;

    _classCallCheck(this, ClickSpriteAction);

    _this = _super.call(this);
    _this.spriteName = spriteName;
    return _this;
  }

  _createClass(ClickSpriteAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this2 = this;

      // Get the sprite

      /** @type {Target} */
      var sprite;

      if (this.spriteName !== STAGE) {
        sprite = context.vm.runtime.getSpriteTargetByName(this.spriteName);
      } else {
        sprite = context.vm.runtime.getTargetForStage();
      } // Save the state of the sprite before the click event.


      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'click', {
        target: this.spriteName
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'click');
      context.log.addEvent(event); // Simulate mouse click by explicitly triggering click event on the target

      var list;

      if (this.spriteName !== STAGE) {
        list = context.vm.runtime.startHats('event_whenthisspriteclicked', null, sprite);
      } else {
        list = context.vm.runtime.startHats('event_whenstageclicked', null, sprite);
      }

      var action = new _listener_js__WEBPACK_IMPORTED_MODULE_2__["ThreadListener"](list);
      context.threadListeners.push(action);
      action.promise.then(function () {
        console.log("finished click on ".concat(_this2.spriteName)); // save sprites state after click

        event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'clickEnd');
        resolve("finished ".concat(_this2));
      });
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(_get(_getPrototypeOf(ClickSpriteAction.prototype), "toString", this).call(this), " on ").concat(this.sprite);
    }
  }]);

  return ClickSpriteAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);

/***/ }),

/***/ "./src/scheduler/end.js":
/*!******************************!*\
  !*** ./src/scheduler/end.js ***!
  \******************************/
/*! exports provided: EndAction, JoinAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EndAction", function() { return EndAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JoinAction", function() { return JoinAction; });
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log.js */ "./src/log.js");
/* harmony import */ var _deferred_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../deferred.js */ "./src/deferred.js");
/* harmony import */ var lodash_es_Promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es/_Promise.js */ "../../node_modules/lodash-es/_Promise.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





/** @package */

var EndAction = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(EndAction, _ScheduledAction);

  var _super = _createSuper(EndAction);

  function EndAction() {
    _classCallCheck(this, EndAction);

    return _super.apply(this, arguments);
  }

  _createClass(EndAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _iterator = _createForOfIteratorHelper(context.log.events.list),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var event = _step.value;

          if (event.nextFrame == null) {
            event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'programEnd');
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      context.vm.stopAll();
      resolve("finished ".concat(this));
      context.simulationEnd.resolve('done with simulation');
    }
  }]);

  return EndAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);
var JoinAction = /*#__PURE__*/function (_ScheduledAction2) {
  _inherits(JoinAction, _ScheduledAction2);

  var _super2 = _createSuper(JoinAction);

  /**
   * @param {ScheduledEvent[]} events
   */
  function JoinAction(events) {
    var _this;

    _classCallCheck(this, JoinAction);

    _this = _super2.call(this);
    var promises = events.map(function (e) {
      var deferred = new _deferred_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
      var oldExecute = e.action.execute;

      e.action.execute = function (context, resolve) {
        oldExecute.call(e.action, context, function (value) {
          deferred.resolve(value);
          resolve(value);
        });
      };

      return deferred.promise;
    });
    _this.promise = lodash_es_Promise_js__WEBPACK_IMPORTED_MODULE_3__["default"].race(promises);
    return _this;
  }

  _createClass(JoinAction, [{
    key: "execute",
    value: function execute(_context, resolve) {
      // Do nothing.
      this.promise.then(function () {
        console.log("Threads have been joined...");
        resolve();
      }, function (reason) {
        throw reason;
      });
    }
  }]);

  return JoinAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);

/***/ }),

/***/ "./src/scheduler/green-flag.js":
/*!*************************************!*\
  !*** ./src/scheduler/green-flag.js ***!
  \*************************************/
/*! exports provided: GreenFlagAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GreenFlagAction", function() { return GreenFlagAction; });
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log.js */ "./src/log.js");
/* harmony import */ var _listener_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../listener.js */ "./src/listener.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




/**
 * @package
 */

var GreenFlagAction = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(GreenFlagAction, _ScheduledAction);

  var _super = _createSuper(GreenFlagAction);

  function GreenFlagAction() {
    _classCallCheck(this, GreenFlagAction);

    return _super.apply(this, arguments);
  }

  _createClass(GreenFlagAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this = this;

      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'greenFlag');
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'greenFlag');
      context.log.addEvent(event); // Stuff from the greenFlag function.

      context.vm.runtime.stopAll();
      context.vm.runtime.emit('PROJECT_START');
      context.vm.runtime.ioDevices.clock.resetProjectTimer();
      context.vm.runtime.targets.forEach(function (target) {
        return target.clearEdgeActivatedValues();
      }); // Inform all targets of the green flag.

      for (var i = 0; i < context.vm.runtime.targets.length; i++) {
        context.vm.runtime.targets[i].onGreenFlag();
      }

      var list = context.vm.runtime.startHats('event_whenflagclicked');
      var action = new _listener_js__WEBPACK_IMPORTED_MODULE_2__["ThreadListener"](list);
      context.threadListeners.push(action);
      action.promise.then(function () {
        event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'greenFlagEnd');
        resolve("finished ".concat(_this));
      });
    }
  }]);

  return GreenFlagAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);

/***/ }),

/***/ "./src/scheduler/index.js":
/*!********************************!*\
  !*** ./src/scheduler/index.js ***!
  \********************************/
/*! exports provided: delay, broadcast, sprite, ScheduledEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScheduledEvent", function() { return ScheduledEvent; });
/* harmony import */ var _green_flag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./green-flag.js */ "./src/scheduler/green-flag.js");
/* harmony import */ var _callback_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./callback.js */ "./src/scheduler/callback.js");
/* harmony import */ var _click_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./click.js */ "./src/scheduler/click.js");
/* harmony import */ var _io_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./io.js */ "./src/scheduler/io.js");
/* harmony import */ var _broadcast_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./broadcast.js */ "./src/scheduler/broadcast.js");
/* harmony import */ var _end_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./end.js */ "./src/scheduler/end.js");
/* harmony import */ var _wait_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./wait.js */ "./src/scheduler/wait.js");
/* harmony import */ var _track_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./track.js */ "./src/scheduler/track.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
/* harmony import */ var _testplan_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../testplan.js */ "./src/testplan.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return _wait_js__WEBPACK_IMPORTED_MODULE_6__["delay"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "broadcast", function() { return _wait_js__WEBPACK_IMPORTED_MODULE_6__["broadcast"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "sprite", function() { return _wait_js__WEBPACK_IMPORTED_MODULE_6__["sprite"]; });

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }













var InitialAction = /*#__PURE__*/function (_CallbackAction) {
  _inherits(InitialAction, _CallbackAction);

  var _super = _createSuper(InitialAction);

  function InitialAction() {
    _classCallCheck(this, InitialAction);

    return _super.call(this, function () {});
  }

  return InitialAction;
}(_callback_js__WEBPACK_IMPORTED_MODULE_1__["CallbackAction"]);
/**
 * Used to indicate an event timed out.
 */


var TimeoutError = /*#__PURE__*/function (_Error) {
  _inherits(TimeoutError, _Error);

  var _super2 = _createSuper(TimeoutError);

  function TimeoutError() {
    _classCallCheck(this, TimeoutError);

    return _super2.apply(this, arguments);
  }

  return TimeoutError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * @typedef {Object} WaitCondition
 * @property {ScheduledAction} action - The action.
 * @property {number|null} timeout - How long to wait.
 */

/**
 * The Scratch scheduler: allows scheduling events that
 * will be executed when running a scratch project.
 *
 * While we mostly speak about "the scheduler", it doesn't really exist.
 * The scheduler is a chain or tree of events, starting with the first event.
 * Each event is responsible for their own scheduling, and then running next
 * events, as described below.
 *
 * ### Scheduling
 *
 * Event scheduling results in a tree of events. Each events a list of
 * next events to be executed when the current event is done (see below).
 *
 * All events on the same level, i.e. in the same list of next events, will
 * be launched at the same time.
 *
 * All functions return the last added event to anchor new events. If you don't
 * want this, you'll need to save the previous event manually.
 *
 * See the examples for details.
 *
 * ### Timeouts & other times
 *
 * Timeouts and other time params will be rescaled according to the global
 * acceleration factor. You should not apply it yourself. For example, if
 * you have an acceleration factor of 2, you should pass 10s to wait 5s.
 *
 * You can manually change this by using the option `timeAcceleration`. If
 * present, this will be used for all time-related acceleration. This allows
 * you to set the timeouts slower or faster than the frame acceleration, since
 * the frame acceleration is not always reached.
 *
 * ### Types of events
 *
 * There are two types of events:
 *
 * - sync events, which will block next events until they are completed
 * - async events, which will yield to next events before completion
 *
 * For example, a "wait" event will be sync, since it is otherwise
 * pretty useless.
 *
 * A click event might be sync or async. If you want to wait until
 * everything triggered by the click is done, you should make it sync.
 * However, suppose you want to click a sprite, which will then move around
 * forever; if so, this will cause a timeout. You must make it async.
 *
 * ### Example
 *
 * Assume we start with event A, which has two events as next: B1 and B2.
 * B1 is synchronous, while B2 is not. B1 takes 2 time units to complete.
 * Additionally, B1 has one next event, C1. B2 has two, C2 & C3.
 *
 * Below is a reconstructed timeline, where the number represents the time
 * unit at which an event is started.
 *
 * ```
 * 1. A
 * 2. B1 - B2
 * 3.      C2 - C3
 * 4.
 * 5. C1
 * ```
 *
 * @example <caption>Schedule events sequentially</caption>
 * event.newEvent()
 *      .newEvent()
 *      .newEvent()
 *
 * @example <caption>Schedule events in parallel</caption>
 * event.newEvent();
 * event.newEvent();
 * event.newEvent();
 */


var ScheduledEvent = /*#__PURE__*/function () {
  /**
   * Create a new event.
   *
   * You should not create events directly, but use one of the helper functions
   * instead.
   *
   * @param {ScheduledAction} action - The action to execute on this event.
   * @param {boolean} sync - The data for the event.
   * @param {?number} timeout - How to long to wait before resolving.
   *
   * @private
   */
  function ScheduledEvent(action) {
    var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, ScheduledEvent);

    /** @package */
    this.action = action;
    /** @private */

    this.sync = sync;
    /** @private */

    this.timeout = timeout;
    /**
     * @private
     * @type {ScheduledEvent[]}
     */

    this.nextEvents = [];
    /**
     * @type {null|function(Context)}
     * @private
     */

    this.onResolve = null;
    /**
     * @type {null|function(Context):?boolean}
     * @private
     */

    this.onTimeout = null;
  }
  /**
   * Create the initial event.
   *
   * @return {ScheduledEvent}
   * @package
   */


  _createClass(ScheduledEvent, [{
    key: "toString",
    value:
    /**
     * @return {string} A name identifying this event, for debugging and logging
     *                  purposes.
     */
    function toString() {
      return this.action.toString();
    }
    /**
     * Execute this event, and launch the next events when allowed.
     *
     * If the current event is synchronous, the action is executed, after which
     * the next events are launched. If the event is asynchronous, the action is
     * executed, but the next events are launched immediately.
     *
     * You should not call this function; the framework takes care of it for you.
     *
     * @param  {Context} context
     * @return {Promise<void>}
     * @package
     */

  }, {
    key: "run",
    value: function run(context) {
      var _this = this;

      console.debug("".concat(context.timestamp(), ": Running actions ").concat(this.action.toString()));
      var action = new Promise(function (resolve, _reject) {
        console.debug("".concat(context.timestamp(), ": Executing actions ").concat(_this.action.toString()));

        _this.action.execute(context, resolve);
      });
      var timeout = new Promise(function (resolve, reject) {
        var time = _this.sync ? context.accelerateEvent(_this.timeout || context.actionTimeout) : 0;
        setTimeout(function () {
          if (_this.sync) {
            reject(new TimeoutError("".concat(context.timestamp(), ": timeout after ").concat(_this.timeout || context.actionTimeout, " (real: ").concat(time, ") from ").concat(_this.action.toString())));
          } else {
            resolve("".concat(context.timestamp(), ": Ignoring timeout for async event ").concat(_this.action.toString(), "."));
          }
        }, time);
      }); // This will take the result from the first promise to resolve, which
      // will be either the result or the timeout if something went wrong.
      // Note that async events cannot timeout.

      return Promise.race([action, timeout]).then(function (v) {
        console.debug("".concat(context.timestamp(), ": resolved action ").concat(_this.action.toString(), ": ").concat(v));

        if (_this.onResolve) {
          _this.onResolve(context);
        } // Schedule the next event. This will work for both sync & async events:
        // - For sync events this callback is reached either if the event resolves.
        //   If it times out, we don't schedule next events.
        // - For async events, the resolve of the timeout promise resolves immediately,
        //   we reach this immediately.


        _this.nextEvents.forEach(function (e) {
          return e.run(context);
        });
      }, function (reason) {
        console.debug("".concat(context.timestamp(), ": Rejected actions ").concat(_this.action.toString()));

        if (reason instanceof TimeoutError) {
          var escalate = true;

          if (_this.onTimeout) {
            var result = _this.onTimeout(context);

            escalate = typeof result === 'undefined' || !result;
          } // If there was no callback, or the callback requested we handle the error
          // escalate the status and stop the judgement.


          if (escalate) {
            console.warn(reason);
            context.output.escalateStatus({
              human: 'Tijdslimiet overschreden',
              enum: 'time limit exceeded'
            });
            context.output.closeJudgement(false);
          }
        } else if (reason instanceof _testplan_js__WEBPACK_IMPORTED_MODULE_9__["FatalErrorException"]) {
          console.warn("Fatal test failed, stopping execution of all tests.");
          context.output.closeJudgement(false);
        } else {
          console.error('Unexpected error:', reason);
          context.output.escalateStatus({
            human: 'Fout bij uitvoeren testplan.',
            enum: 'runtime error'
          });
          context.output.appendMessage(reason);
          context.output.closeJudgement(false);
        } // Finish executing, ensuring we stop.


        context.terminate();
      });
    }
    /**
     * Create and schedule a new event.
     *
     * @param {ScheduledAction} action - What to execute.
     * @param {boolean} sync - If the event is sync.
     * @param {?number} timeout - Optional timeout.
     * @return {ScheduledEvent}
     * @private
     */

  }, {
    key: "constructNext",
    value: function constructNext(action) {
      var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var event = new this.constructor(action, sync, timeout);
      this.nextEvents.push(event);
      return event;
    }
    /**
     * Wait for a certain condition before proceeding with the events.
     *
     * The basic most basic way to use this is to pass a number as argument.
     * In that case you will wait a number of ms before proceeding.
     *
     * The second option is to pass a `WaitCondition`. You can obtain one of those
     * using the following global functions:
     *
     * - {@link sprite}
     * - {@link delay} (passing a number to this function is equivalent to using this)
     * - {@link broadcast}
     *
     * Wait events are always synchronous. If you want to do something while waiting,
     * you need to fork the event scheduling.
     *
     * @param {number|WaitCondition} param - How long we should wait in ms.
     * @return {ScheduledEvent}
     */

  }, {
    key: "wait",
    value: function wait(param) {
      if (typeof param === 'number') {
        param = Object(_wait_js__WEBPACK_IMPORTED_MODULE_6__["delay"])(param);
      }

      var _param = param,
          action = _param.action,
          timeout = _param.timeout;
      return this.constructNext(action, true, timeout);
    }
    /**
     * Schedule an event for each item in a list.
     *
     * This function is basically a wrapper around `reduce`. For each item in the list,
     * the reducer is called with the result of the previous call and the current value,
     * and should return the new value for the next call.
     *
     * What this means is that the reducer should return the new anchor event. If you
     * return a new event each time, the events will be scheduled in sequence. If you
     * return the same event every time, they will be scheduled in parallel.
     *
     * The reducer accepts all params from the normal `reduce`'s reducer.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
     *
     * It basically means you get the accumulator, the value, (optionally) the value's index and (optionally)
     * the full array of items.
     *
     * @example <caption>Scheduling in sequence</caption>
     * event.forEach([100, 200, 300], (previous, value) => {
     *   return previous.wait(value);
     * })
     * // Schedules events that wait the amount in the array.
     *
     * @example <caption>Scheduling in parallel</caption>
     * event.forEach([100, 200, 300], (_previous, value) => {
     *   return event.wait(value);
     * })
     * // Schedules events that wait the amount in the array.
     *
     * By default, the last event will become the new anchor.
     *
     * @param {any[]} items - The items to create events for.
     * @param {function(ScheduledEvent, any, number, any[]):ScheduledEvent} reducer - Reduces the events.
     * @return {ScheduledEvent}
     */

  }, {
    key: "forEach",
    value: function forEach(items, reducer) {
      return items.reduce(reducer, this);
    }
    /**
     * End the events and shut down the Scratch VM. After you are done
     * with your events, you should call this, or the VM risks to never
     * stop.
     *
     * Do ensure you either wait long enough, or anchor on a sync event,
     * or the VM will be stopped before all events have completed.
     *
     * This is a sync event: the event will resolve after the VM has
     * shut down.
     *
     * @return {ScheduledEvent}
     */

  }, {
    key: "end",
    value: function end() {
      return this.constructNext(new _end_js__WEBPACK_IMPORTED_MODULE_5__["EndAction"]());
    }
    /**
     * Save the current frame in the log, optionally doing something.
     *
     * The current frame will be saved, after which the callback is
     * called with the log (already containing the new frame).
     *
     * For example, you can add a test or a debug statement in the
     * callback. Other uses include checking the position or state
     * of sprites.
     *
     * @param {function} callback
     * @return {ScheduledEvent}
     */

  }, {
    key: "log",
    value: function log() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
      return this.constructNext(new _callback_js__WEBPACK_IMPORTED_MODULE_1__["CallbackAction"](callback));
    }
  }, {
    key: "track",
    value: function track(sprite) {
      return this.constructNext(new _track_js__WEBPACK_IMPORTED_MODULE_7__["TrackSpriteAction"](sprite));
    }
    /**
     * Click the "green flag". This is often the first thing you do.
     *
     * This event can be synchronous or not. If synchronous, all blocks
     * attached to the green flag hat will need to be completed before the
     * event resolves. Otherwise it resolves immediately.
     *
     * @param {boolean} sync - Synchronous or not, default true.
     * @param {number|null} timeout - How long to wait for synchronous events.
     * @return {ScheduledEvent}
     */

  }, {
    key: "greenFlag",
    value: function greenFlag() {
      var sync = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.constructNext(new _green_flag_js__WEBPACK_IMPORTED_MODULE_0__["GreenFlagAction"](), sync, timeout);
    }
    /**
     * Click the sprite with the given name.
     *
     * This event can be asynchronous. If synchronous, all blocks attached
     * to hats listening to the click event must be completed before the
     * event resolves. Otherwise it resolves immediately.
     *
     * @param {string} spriteName - The name of the sprite.
     * @param {boolean} sync - Synchronous or not, default true.
     * @param {number|null} timeout - How long to wait for synchronous events.
     * @return {ScheduledEvent}
     */

  }, {
    key: "clickSprite",
    value: function clickSprite() {
      var spriteName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : STAGE;
      var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return this.constructNext(new _click_js__WEBPACK_IMPORTED_MODULE_2__["ClickSpriteAction"](spriteName), sync, timeout);
    }
    /**
     * Send a broadcast of the specified signal.
     *
     * This event can be asynchronous. If synchronous, all blocks attached
     * to hats listening to the given broadcast must be completed before
     * the event resolves. Otherwise it resolves immediately.
     *
     * If synchronous, resembles a "Broadcast () and Wait" block, otherwise
     * resembles a "Broadcast ()" block.
     *
     * The event is logged with event type `broadcast`.
     *
     * @see https://en.scratch-wiki.info/wiki/Broadcast_()_(block)
     * @see https://en.scratch-wiki.info/wiki/Broadcast_()_and_Wait_(block)
     *
     * @param {string} broadcast - The name of the broadcast to send.
     * @param {boolean} sync - Synchronous or not, default true.
     * @param {number|null} timeout - How long to wait for synchronous events.
     * @return {ScheduledEvent}
     */

  }, {
    key: "sendBroadcast",
    value: function sendBroadcast(broadcast) {
      var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return this.constructNext(new _broadcast_js__WEBPACK_IMPORTED_MODULE_4__["SendBroadcastAction"](broadcast), sync, timeout);
    }
    /**
     * Simulate a key press.
     *
     * The difference between this event and the `useKey` event is similar
     * to the difference between the "When () Key Pressed" block and the
     * "Key () Pressed?" block.
     *
     * This event will activate all hats with the "When () Key Pressed"
     * block. This means it simulates a full "key press", meaning pressing
     * it down and letting go. It has no impact on the current key status,
     * and will NOT trigger a `KEY_PRESSED` event.
     *
     * This event can be asynchronous. If synchronous, all blocks attached
     * to hats listening to the click event must be completed before the
     * event resolves. Otherwise it resolves immediately.
     *
     * @see https://en.scratch-wiki.info/wiki/Key_()_Pressed%3F_(block)
     * @see https://en.scratch-wiki.info/wiki/When_()_Key_Pressed_(Events_block)
     *
     * @param {string} key - The name of the key to press.
     * @param {boolean} sync - Synchronous or not, default true.
     * @param {number|null} timeout - How long to wait for synchronous events.
     * @return {ScheduledEvent}
     */

  }, {
    key: "pressKey",
    value: function pressKey(key) {
      var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return this.constructNext(new _io_js__WEBPACK_IMPORTED_MODULE_3__["WhenPressKeyAction"](key), sync, timeout);
    }
    /**
     * Use the keyboard.
     *
     * The difference between this event and the `pressKey` event is similar
     * to the difference between the "When () Key Pressed" block and the
     * "Key () Pressed?" block.
     *
     * This event will update the internal state of the keyboard. When you
     * send this event, the key will be pressed down, and kept that way.
     * As such, this key will trigger both "When () Key Pressed" blocks
     * and return true for "Key () Pressed?" blocks.
     *
     * To make life easier, you can optionally pass a time, after which the
     * key is lifted automatically.
     *
     * If no timeout is passed, the event is asynchronous. If a timeout is
     * passed, the event resolves after the key has been lifted if synchronous.
     *
     * Due to the nature of the event, it is currently not possible to wait
     * on completion of scripts with this event. This would mean basically
     * running scripts to see if they are waiting on this press or not, which
     * is not possible.
     *
     * Finally, since the event should at least be noticeable in the next step
     * of the Scratch VM, by default a 20 ms waiting time is introduced after
     * each key event (the delay). You can modify this delay by setting the last
     * parameter. In most cases, it is not necessary to adjust this.
     *
     * The time the key is pressed before it is released does not account for
     * the delay: if  `down` is 50ms, the key will be lifted after 50 ms.
     *
     * When using as a sync event, the total execution time will therefore be
     * delay + down. If down is true or false, the execution time will be just
     * the delay.
     *
     * The `useMouse` event is similar, but for the mouse.
     *
     * This event is logged with event type 'useKey'. The event saves the state
     * before the key press. The next frame of the event is saved after the delay
     * has been completed or before the key is lifted.
     *
     * @see https://en.scratch-wiki.info/wiki/Key_()_Pressed%3F_(block)
     * @see https://en.scratch-wiki.info/wiki/When_()_Key_Pressed_(Events_block)
     *
     * @param {string} key - The key to press.
     * @param {number|boolean} down - If a boolean, the key event will be
     *        passed as is. If a number, the key will first be set to down,
     *        but then lifted after the given amount of ms. By default, this
     *        is 10 ms.
     * @param {boolean} sync - If the lifting of the key press should be async
     *        or sync. When no automatic lifting is used, the event is always
     *        async.
     * @param {number} delay - The amount of time to wait after the last key
     *        press. You can set this to less than 10, but you risk that your
     *        key press will be undetected.
     *
     * @return {ScheduledEvent}
     */

  }, {
    key: "useKey",
    value: function useKey(key) {
      var down = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60;
      var sync = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
      return this.constructNext(new _io_js__WEBPACK_IMPORTED_MODULE_3__["KeyUseAction"](key, down, delay), sync);
    }
    /**
     * Use the mouse.
     *
     * At the moment you can pass all data to the mouse event, and thus
     * also simulate clicks. This is not supported and will probably break
     * in weird ways.
     *
     * This event is synchronous: the event resolves after the mouse data
     * has been posted to the Scratch VM.
     *
     * This updates the mouse data in the VM, and keeps it like that. E.g.
     * if you move the mouse to x+5, y-5, it will stay there.
     *
     * @param {Object} data
     * @return {ScheduledEvent}
     */

  }, {
    key: "useMouse",
    value: function useMouse(data) {
      return this.constructNext(new _io_js__WEBPACK_IMPORTED_MODULE_3__["MouseUseAction"](data));
    }
    /**
     * A utility function that allows to run a function to schedule events.
     *
     * This function is mainly intended to allow better organisation of code
     * when writing test plans. The callback will be executed with the current
     * event as argument and is expected to return the next anchor event.
     *
     *
     * @example
     * // without this function
     * function scheduleStuff(e) {
     *   return e.wait(10);
     * }
     *
     * function duringExecution(e) {
     *   let events = e.scheduler.wait(10);
     *   events = scheduleStuff(events);
     * }
     *
     * @example
     * // with this function
     * function scheduleStuff(e) {
     *   return e.wait(10);
     * }
     *
     * function duringExecution(e) {
     *   e.scheduler
     *    .wait(10)
     *    .run(scheduleStuff);
     * }
     *
     * @param {function(e:ScheduledEvent):ScheduledEvent} provider
     * @return {ScheduledEvent}
     */

  }, {
    key: "pipe",
    value: function pipe(provider) {
      return provider(this);
    }
    /**
     * Joins the scheduled event threads, ie. waits until
     * all events are resolved. This could be considered the
     * opposite of "forking" the threads.
     *
     * Technically speaking, this will add an event on the first
     * event as anchor, which will only resolve if all other events
     * are resolved.
     *
     * @param {ScheduledEvent[]} events
     * @param {?number} timeout
     * @return {ScheduledEvent}
     */

  }, {
    key: "join",
    value: function join(events) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return this.constructNext(new _end_js__WEBPACK_IMPORTED_MODULE_5__["JoinAction"](events), true, timeout);
    }
    /**
     * Add a callback to the current event that will be called if the event is successfully
     * resolved.
     *
     * As always, synchronous events are resolved after the event is done, while asynchronous
     * events are immediately resolved.
     *
     * If an event errors, the callback will not be called.
     *
     * Calling this function multiple times on the same event will discard previous
     * calls.
     *
     * @param {function(Context)} callback
     * @return {ScheduledEvent}
     */

  }, {
    key: "resolved",
    value: function resolved(callback) {
      this.onResolve = callback;
      return this;
    }
    /**
     * Add a callback to the current event that will be called if the event times out.
     *
     * As always, only synchronous events can time out.
     *
     * If an event errors, the callback will not be called.
     *
     * Calling this function multiple times on the same event will discard previous
     * calls.
     *
     * @param {function(Context)} callback
     * @return {ScheduledEvent}
     */

  }, {
    key: "timedOut",
    value: function timedOut(callback) {
      this.onTimeout = callback;
      return this;
    }
    /**
     * Allow to use the event as a test. If successful,
     * the event will be reported as a passing test with the message.
     * Otherwise it will be a failing test with the message.
     *
     * @param {{[correct]:string|function():string, [wrong]:string|function():string}} [messages]
     * 
     * @return {ScheduledEvent}
     */

  }, {
    key: "asTest",
    value: function asTest(messages) {
      var wrapped = {
        correct: Object(_utils_js__WEBPACK_IMPORTED_MODULE_8__["castCallback"])(messages === null || messages === void 0 ? void 0 : messages.correct),
        wrong: Object(_utils_js__WEBPACK_IMPORTED_MODULE_8__["castCallback"])(messages === null || messages === void 0 ? void 0 : messages.wrong)
      };
      this.resolved(function (context) {
        context.output.startTest(true);
        var message = wrapped.correct();

        if (message) {
          context.output.appendMessage(message);
        }

        context.output.closeTest(true, true);
      });
      this.timedOut(function (context) {
        context.output.startTest(true);
        var message = wrapped.wrong();

        if (message) {
          context.output.appendMessage(message);
        }

        context.output.closeTest(false, false);
        return true;
      });
      return this;
    }
  }], [{
    key: "create",
    value: function create() {
      return new ScheduledEvent(new InitialAction());
    }
  }]);

  return ScheduledEvent;
}();

/***/ }),

/***/ "./src/scheduler/io.js":
/*!*****************************!*\
  !*** ./src/scheduler/io.js ***!
  \*****************************/
/*! exports provided: WhenPressKeyAction, MouseUseAction, KeyUseAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WhenPressKeyAction", function() { return WhenPressKeyAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MouseUseAction", function() { return MouseUseAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KeyUseAction", function() { return KeyUseAction; });
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../log.js */ "./src/log.js");
/* harmony import */ var _listener_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../listener.js */ "./src/listener.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var WhenPressKeyAction = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(WhenPressKeyAction, _ScheduledAction);

  var _super = _createSuper(WhenPressKeyAction);

  /**
   * @param {string} key
   */
  function WhenPressKeyAction(key) {
    var _this;

    _classCallCheck(this, WhenPressKeyAction);

    _this = _super.call(this);
    _this.key = key;
    return _this;
  }

  _createClass(WhenPressKeyAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this2 = this;

      // Save sprites state before key press.
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'key', {
        key: this.key
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'key');
      context.log.addEvent(event);

      var scratchKey = context.vm.runtime.ioDevices.keyboard._keyStringToScratchKey(this.key);

      if (scratchKey === '') {
        throw new Error("Unknown key press: '".concat(this.key, "'"));
      }

      var list = context.vm.runtime.startHats('event_whenkeypressed', {
        KEY_OPTION: scratchKey
      });
      var list2 = context.vm.runtime.startHats('event_whenkeypressed', {
        KEY_OPTION: 'any'
      });
      var threads = list.concat(list2);
      var action = new _listener_js__WEBPACK_IMPORTED_MODULE_2__["ThreadListener"](threads);
      context.threadListeners.push(action);
      action.promise.then(function () {
        console.log("finished keyPress on ".concat(_this2.key)); // save sprites state after click

        event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'keyEnd');
        resolve("finished ".concat(_this2));
      });
    }
  }]);

  return WhenPressKeyAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);
var MouseUseAction = /*#__PURE__*/function (_ScheduledAction2) {
  _inherits(MouseUseAction, _ScheduledAction2);

  var _super2 = _createSuper(MouseUseAction);

  function MouseUseAction(data) {
    var _this3;

    _classCallCheck(this, MouseUseAction);

    _this3 = _super2.call(this);
    _this3.data = data;
    return _this3;
  }

  _createClass(MouseUseAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      this.data.x = this.data.x + 240;
      this.data.y = this.data.y + 180;
      this.data.canvasWidth = 480;
      this.data.canvasHeight = 360;
      context.vm.runtime.ioDevices.mouse.postData(this.data);
      resolve("finished ".concat(this));
    }
  }]);

  return MouseUseAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);
var KeyUseAction = /*#__PURE__*/function (_ScheduledAction3) {
  _inherits(KeyUseAction, _ScheduledAction3);

  var _super3 = _createSuper(KeyUseAction);

  /**
   * @param {string} key
   * @param {boolean|number} down
   * @param {number} delay
   */
  function KeyUseAction(key, down, delay) {
    var _this4;

    _classCallCheck(this, KeyUseAction);

    _this4 = _super3.call(this);
    _this4.key = key;
    _this4.down = down;
    _this4.delay = delay;
    return _this4;
  }

  _createClass(KeyUseAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this5 = this;

      var event = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogEvent"](context, 'useKey', {
        key: this.key,
        down: this.down,
        delay: this.delay
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'event');
      context.log.addEvent(event);
      context.vm.postIOData('keyboard', {
        key: this.key,
        isDown: this.isDown()
      });
      var delay = context.accelerateEvent(this.delay);
      var accelDown = context.accelerateEvent(this.down);

      if (this.isDelayed()) {
        setTimeout(function () {
          event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'event');
          context.vm.postIOData('keyboard', {
            key: _this5.key,
            isDown: false
          });
          setTimeout(function () {
            resolve("finished delayed ".concat(_this5));
          }, delay);
        }, accelDown);
      } else {
        setTimeout(function () {
          event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_1__["LogFrame"](context, 'event');
          resolve("finished ".concat(_this5));
        }, delay);
      }
    }
  }, {
    key: "isDown",
    value: function isDown() {
      if (this.isDelayed()) {
        return true;
      } else {
        return this.down;
      }
    }
  }, {
    key: "isDelayed",
    value: function isDelayed() {
      return typeof this.down === 'number';
    }
  }]);

  return KeyUseAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);

/***/ }),

/***/ "./src/scheduler/track.js":
/*!********************************!*\
  !*** ./src/scheduler/track.js ***!
  \********************************/
/*! exports provided: TrackSpriteAction */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrackSpriteAction", function() { return TrackSpriteAction; });
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var TrackSpriteAction = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(TrackSpriteAction, _ScheduledAction);

  var _super = _createSuper(TrackSpriteAction);

  function TrackSpriteAction(sprite) {
    var _this;

    _classCallCheck(this, TrackSpriteAction);

    _this = _super.call(this);
    _this.name = sprite;
    return _this;
  }

  _createClass(TrackSpriteAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var sprite = context.vm.runtime.getSpriteTargetByName(this.name);

      if (!sprite) {
        throw new Error("Sprite ".concat(this.name, " was not found in the runtime."));
      }

      sprite.addListener('EVENT_TARGET_VISUAL_CHANGE', function (target) {
        context.log.addFrame(context, "update_".concat(target.getName()));
      });
      resolve('register complete');
    }
  }]);

  return TrackSpriteAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_0__["ScheduledAction"]);

/***/ }),

/***/ "./src/scheduler/wait.js":
/*!*******************************!*\
  !*** ./src/scheduler/wait.js ***!
  \*******************************/
/*! exports provided: SpriteCondition, sprite, broadcast, delay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SpriteCondition", function() { return SpriteCondition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sprite", function() { return sprite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "broadcast", function() { return broadcast; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return delay; });
/* harmony import */ var lodash_castArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/castArray */ "../../node_modules/lodash/castArray.js");
/* harmony import */ var lodash_castArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_castArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _action_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action.js */ "./src/scheduler/action.js");
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../log.js */ "./src/log.js");
/* harmony import */ var _listener_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../listener.js */ "./src/listener.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }







var WaitEvent = /*#__PURE__*/function (_ScheduledAction) {
  _inherits(WaitEvent, _ScheduledAction);

  var _super = _createSuper(WaitEvent);

  /**
   * @param {number} delay
   */
  function WaitEvent(delay) {
    var _this;

    _classCallCheck(this, WaitEvent);

    _this = _super.call(this);
    _this.delay = delay;
    return _this;
  }

  _createClass(WaitEvent, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this2 = this;

      var delay = context.accelerateEvent(this.delay);
      setTimeout(function () {
        resolve("finished ".concat(_this2));
      }, delay);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(_get(_getPrototypeOf(WaitEvent.prototype), "toString", this).call(this), " for ").concat(this.delay);
    }
  }]);

  return WaitEvent;
}(_action_js__WEBPACK_IMPORTED_MODULE_1__["ScheduledAction"]);

var WaitForSpriteAction = /*#__PURE__*/function (_ScheduledAction2) {
  _inherits(WaitForSpriteAction, _ScheduledAction2);

  var _super2 = _createSuper(WaitForSpriteAction);

  /**
   * @param {string} name
   */
  function WaitForSpriteAction(name) {
    var _this3;

    _classCallCheck(this, WaitForSpriteAction);

    _this3 = _super2.call(this);
    _this3.name = name;
    _this3.active = true;
    return _this3;
  }

  _createClass(WaitForSpriteAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this4 = this;

      var sprite = context.vm.runtime.getSpriteTargetByName(this.name);

      if (!sprite) {
        throw new Error("Sprite ".concat(this.name, " was not found in the runtime."));
      }

      var callback = function callback(target, oldX, oldY) {
        if (target.x !== oldX || target.y !== oldY) {
          sprite.removeListener('TARGET_MOVED', callback);
          resolve("finished ".concat(_this4));
        }
      };

      sprite.addListener('TARGET_MOVED', callback);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Wait for sprite ".concat(this.name, " to move.");
    }
  }]);

  return WaitForSpriteAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_1__["ScheduledAction"]);

var WaitForSpritePositionAction = /*#__PURE__*/function (_ScheduledAction3) {
  _inherits(WaitForSpritePositionAction, _ScheduledAction3);

  var _super3 = _createSuper(WaitForSpritePositionAction);

  /**
   * @param {string} name
   * @param {function(x:number,y:number):boolean} callback
   */
  function WaitForSpritePositionAction(name, callback) {
    var _this5;

    _classCallCheck(this, WaitForSpritePositionAction);

    _this5 = _super3.call(this);
    _this5.name = name;
    _this5.callback = callback;
    return _this5;
  }

  _createClass(WaitForSpritePositionAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this6 = this;

      var sprite = context.vm.runtime.getSpriteTargetByName(this.name);

      if (!sprite) {
        throw new Error("Sprite ".concat(this.name, " was not found in the runtime."));
      }

      var event = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogEvent"](context, 'waitForSpritePosition');
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'event');
      context.log.addEvent(event);

      var callback = function callback(target) {
        if (_this6.callback(target.x, target.y)) {
          sprite.removeListener('TARGET_MOVED', callback);
          event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'event');
          resolve("finished ".concat(_this6));
        }
      };

      sprite.addListener('TARGET_MOVED', callback);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Wait for sprite ".concat(this.name, " to reach one of ").concat(this.callback);
    }
  }]);

  return WaitForSpritePositionAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_1__["ScheduledAction"]);

var WaitForSpriteTouchAction = /*#__PURE__*/function (_ScheduledAction4) {
  _inherits(WaitForSpriteTouchAction, _ScheduledAction4);

  var _super4 = _createSuper(WaitForSpriteTouchAction);

  /**
   * @param {string} name
   * @param {function():string[]|string} paramCallback
   */
  function WaitForSpriteTouchAction(name, paramCallback) {
    var _this7;

    _classCallCheck(this, WaitForSpriteTouchAction);

    _this7 = _super4.call(this);
    _this7.name = name;
    _this7.paramCallback = paramCallback;
    return _this7;
  }

  _createClass(WaitForSpriteTouchAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this8 = this;

      var sprite = context.vm.runtime.getSpriteTargetByName(this.name);

      if (!sprite) {
        throw new Error("Sprite ".concat(this.name, " was not found in the runtime."));
      }

      this.targets = lodash_castArray__WEBPACK_IMPORTED_MODULE_0___default()(this.paramCallback());
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogEvent"](context, 'waitForSpriteTouch', {
        targets: this.targets,
        sprite: this.name
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'event');
      context.log.addEvent(event);

      var callback = function callback(target) {
        var _iterator = _createForOfIteratorHelper(_this8.targets),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var goal = _step.value;
            console.log("Checking...", goal);

            if (target.isTouchingObject(goal)) {
              sprite.removeListener('TARGET_MOVED', callback);
              event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'event');
              resolve("finished ".concat(_this8));
              return;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };

      sprite.addListener('TARGET_MOVED', callback);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Wait for sprite ".concat(this.name, " to touch one of ").concat(this.targets);
    }
  }]);

  return WaitForSpriteTouchAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_1__["ScheduledAction"]);

var WaitForSpriteNotTouchAction = /*#__PURE__*/function (_ScheduledAction5) {
  _inherits(WaitForSpriteNotTouchAction, _ScheduledAction5);

  var _super5 = _createSuper(WaitForSpriteNotTouchAction);

  /**
   * @param {string} name
   * @param {function():string} paramCallback
   */
  function WaitForSpriteNotTouchAction(name, paramCallback) {
    var _this9;

    _classCallCheck(this, WaitForSpriteNotTouchAction);

    _this9 = _super5.call(this);
    _this9.name = name;
    _this9.paramCallback = paramCallback;
    return _this9;
  }

  _createClass(WaitForSpriteNotTouchAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this10 = this;

      var sprite = context.vm.runtime.getSpriteTargetByName(this.name);

      if (!sprite) {
        throw new Error("Sprite ".concat(this.name, " was not found in the runtime."));
      }

      this.target = this.paramCallback();
      var event = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogEvent"](context, 'waitForSpriteNotTouch', {
        target: this.target,
        sprite: this.name
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'event');
      context.log.addEvent(event);

      var callback = function callback(target) {
        if (!target.isTouchingObject(_this10.target)) {
          sprite.removeListener('TARGET_MOVED', callback);
          event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'event');
          resolve("finished ".concat(_this10));
        }
      };

      sprite.addListener('TARGET_MOVED', callback);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Wait for sprite ".concat(this.name, " to not touch ").concat(this.target || this.paramCallback);
    }
  }]);

  return WaitForSpriteNotTouchAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_1__["ScheduledAction"]);

var WaitOnBroadcastAction = /*#__PURE__*/function (_ScheduledAction6) {
  _inherits(WaitOnBroadcastAction, _ScheduledAction6);

  var _super6 = _createSuper(WaitOnBroadcastAction);

  /**
   * @param {string} name - Name of the broadcast.
   */
  function WaitOnBroadcastAction(name) {
    var _this11;

    _classCallCheck(this, WaitOnBroadcastAction);

    _this11 = _super6.call(this);
    _this11.name = name;
    return _this11;
  }

  _createClass(WaitOnBroadcastAction, [{
    key: "execute",
    value: function execute(context, resolve) {
      var _this12 = this;

      var event = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogEvent"](context, 'broadcast_listener', {
        name: this.name
      });
      event.previousFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'broadcast_listener');
      context.log.addEvent(event);
      var listener = new _listener_js__WEBPACK_IMPORTED_MODULE_3__["BroadcastListener"](this.name);
      context.broadcastListeners.push(listener);
      listener.promise.then(function () {
        event.nextFrame = new _log_js__WEBPACK_IMPORTED_MODULE_2__["LogFrame"](context, 'broadcastReceived');
        resolve("finished ".concat(_this12));
      });
    }
  }]);

  return WaitOnBroadcastAction;
}(_action_js__WEBPACK_IMPORTED_MODULE_1__["ScheduledAction"]);
/**
 * Various conditions for sprites.
 */


var SpriteCondition = /*#__PURE__*/function () {
  function SpriteCondition(name) {
    _classCallCheck(this, SpriteCondition);

    this.name = name;
  }
  /**
   * Wait for a sprite to move.
   *
   * @param {number|null} timeout - Optional timeout.
   * @return {WaitCondition}
   */


  _createClass(SpriteCondition, [{
    key: "toMove",
    value: function toMove() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return {
        action: new WaitForSpriteAction(this.name),
        timeout: timeout
      };
    }
    /**
     * Wait for a sprite to reach a certain position.
     * 
     * You can pass one position or a list of positions. If a list, the sprite
     * needs to reach one of the locations. For each location, you can leave either x or y
     * as null, which will be interpreted as a wildcard. A position object with both x and y
     * as null is considered an error.
     * 
     * Alternatively, you can pass a callback that will receive the position (x,y) of the sprite.
     * It must return true if the position is considered reached.
     * 
     * The callback can be used to test things like "is the sprite.x > 170?".
     * 
     * This event is logged with event type `waitForSpritePosition`. The previous frame
     * is taken at the start of the wait. The next frame is taken when the condition has been
     * completed.
     * 
     * {Array<{x:number|null,y:number|null}>|{x:number|null,y:number|null}|function(x:number,y:number):boolean}
     *
     * @param {any} positions - The positions.
     * @param {number|null} timeout - Optional timeout.
     *
     * @return {WaitCondition}
     */

  }, {
    key: "toReach",
    value: function toReach(positions) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback;

      if (typeof positions !== 'function') {
        callback = function callback(x, y) {
          return lodash_castArray__WEBPACK_IMPORTED_MODULE_0___default()(positions).some(function (pos) {
            if (pos.x === null && pos.y === null) {
              console.warn("Both positions in wait condition are wildcard. A mistake?");
            }

            return (pos.x === null || numericEquals(x, pos.x)) && (pos.y === null || numericEquals(y, pos.y));
          });
        };
      } else {
        callback = positions;
      }

      return {
        action: new WaitForSpritePositionAction(this.name, callback),
        timeout: timeout
      };
    }
    /**
     * Wait for a sprite to touch another sprite.
     * 
     * This event is logged with event type `waitForSpriteTouch`. The previous frame
     * is taken at the start of the wait. The next frame is taken when the condition has been
     * completed.
     *
     * @param {string|string[]|function():string[]|function():string} targets - Name of the sprite.
     * @param {number|null} timeout - Optional timeout.
     *
     * @return {WaitCondition}
     */

  }, {
    key: "toTouch",
    value: function toTouch(targets) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = Object(_utils_js__WEBPACK_IMPORTED_MODULE_4__["castCallback"])(targets);
      return {
        action: new WaitForSpriteTouchAction(this.name, callback),
        timeout: timeout
      };
    }
    /**
     * Wait for a sprite to not touch another sprite.
     * 
     * @param {string|function():string} target
     * @param {?number} timeout
     * @return {WaitCondition}
     */

  }, {
    key: "toNotTouch",
    value: function toNotTouch(target) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = Object(_utils_js__WEBPACK_IMPORTED_MODULE_4__["castCallback"])(target);
      return {
        action: new WaitForSpriteNotTouchAction(this.name, callback),
        timeout: timeout
      };
    }
    /**
     * Wait for a sprite to touch the edge of the stage.
     *
     * @param {number|null} timeout - Optional timeout.
     *
     * @return {WaitCondition}
     */

  }, {
    key: "toTouchEdge",
    value: function toTouchEdge() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.toTouch('_edge_', timeout);
    }
    /**
     * Wait for a sprite to touch the current mouse position.
     *
     * If you want to move the mouse while waiting on it, you should
     * fork the event stream.
     *
     * @param {number|null} timeout - Optional timeout.
     *
     * @return {WaitCondition}
     */

  }, {
    key: "toTouchMouse",
    value: function toTouchMouse() {
      var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return this.toTouch('_mouse_', timeout);
    }
  }]);

  return SpriteCondition;
}();
/**
 * Start a condition for a specific sprite.
 *
 * @alias wait:sprite
 * @param {string} name - Name of the sprite.
 *
 * @return SpriteCondition
 */

function sprite(name) {
  return new SpriteCondition(name);
}
/**
 * Wait for a broadcast to be sent before proceeding.
 *
 * As with all wait events, this event is always synchronous.
 *
 * The event is logged with event type `broadcast_listener`.
 *
 * @alias wait:broadcast
 * @param {string} name - Name of the broadcast to wait on.
 * @param {number|null} timeout - Max time to wait before aborting.
 *
 * @return {WaitCondition}
 */

function broadcast(name) {
  var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return {
    action: new WaitOnBroadcastAction(name),
    timeout: timeout
  };
}
/**
 * Wait delay amount of ms before proceeding with the next event.
 * This event is always synchronous.
 *
 * @alias wait:delay
 * @param {number} delay - How long we should wait in ms.
 * @return {WaitCondition}
 */

function delay(delay) {
  return {
    action: new WaitEvent(delay),
    timeout: delay + 100
  };
}

/***/ }),

/***/ "./src/structures.js":
/*!***************************!*\
  !*** ./src/structures.js ***!
  \***************************/
/*! exports provided: Sb3Variable, Sb3Block, Sb3Target, Sb3Stage, Sb3Sprite, Sb3Json */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sb3Variable", function() { return Sb3Variable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sb3Block", function() { return Sb3Block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sb3Target", function() { return Sb3Target; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sb3Stage", function() { return Sb3Stage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sb3Sprite", function() { return Sb3Sprite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sb3Json", function() { return Sb3Json; });
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/isEqual */ "../../node_modules/lodash/isEqual.js");
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }


var Sb3Variable = function Sb3Variable(id, data) {
  _classCallCheck(this, Sb3Variable);

  /**
   * Name of the variable.
   * @type {string}
   */
  this.name = data[0];
  this.value = data[1];
  /** @type {string} */

  this.id = id;
};
/**
 * @typedef {object} Sb3Mutation
 * @property {string} tagName
 * @property {Array} children
 * @property {string} proccode
 * @property {string} argymentids
 */

/**
 * @typedef {object} Sb3List
 * @property {string} name
 * @property {Array} list
 */

var Sb3Block = /*#__PURE__*/function () {
  function Sb3Block(id, data) {
    _classCallCheck(this, Sb3Block);

    /** @type {string} */
    this.id = id;
    /**
     * A string naming the block. The opcode of a "core" block may be found in the
     * Scratch source code here or here for shadows, and the opcode of an extension's
     * block may be found in the extension's source code.
     * 
     * @type {string}
     */

    this.opcode = data.opcode;
    /**
     * The ID of the following block or `null`.
     * 
     * @type {?string}
     */

    this.next = data.next;
    /**
     * If the block is a stack block and is preceded, this is the ID of the preceding
     * block. If the block is the first stack block in a C mouth, this is the ID of
     * the C block. If the block is an input to another block, this is the ID of
     * that other block. Otherwise it is null.
     * 
     * @type {?string}
     */

    this.parent = data.parent;
    /**
     * An object associating names with arrays representing inputs into which
     * reporters may be dropped and C mouths. The first element of each array
     * is 1 if the input is a shadow, 2 if there is no shadow, and 3 if there
     * is a shadow but it is obscured by the input. The second is either the
     * ID of the input or an array representing it as described below. If 
     * there is an obscured shadow, the third element is its ID or an array
     * representing it.
     * 
     * @type {Object.<string,Array>}
     */

    this.inputs = data.inputs;
    /**
     * An object associating names with arrays representing fields. The first
     * element of each array is the field's value which may be followed by an ID.
     * 
     * @type {Object.<string,Array>}
     */

    this.fields = data.fields;
    /**
     * True if this is a shadow and false otherwise.
     * 
     * A shadow is a constant expression in a block input which can be replaced
     * by a reporter; Scratch internally considers these to be blocks although they
     * are not usually thought of as such.
     * 
     * This means that a shadow is basically the place holder of some variable in blocks
     * while they are in the toolbox.
     * 
     * @see https://groups.google.com/g/blockly/c/bXe4iEaVSao
     * @type {boolean}
     */

    this.shadow = data.shadow;
    /**
     * False if the block has a parent and true otherwise.
     * 
     * @type {boolean}
     */

    this.topLevel = data.topLevel;
    /**
     * ID of the comment if the block has a comment.
     * 
     * @type {?string}
     */

    this.comment = data.comment;
    /**
     * X coordinate in the code area if top-level.
     * @type {?number}
     */

    this.x = data.x;
    /**
     * Y coordinate in the code area if top-level.
     * 
     * @type {?number}
     */

    this.y = data.y;
    /**
     * Mutation data if a mutation.
     * 
     * @type {Sb3Mutation}
     */

    this.mutation = data.mutation;
  }
  /**
   * Get the procedure name of the procedure being called.
   * If the block is not a procedure call, an error will be thrown.
   * 
   * @return {string}
   */


  _createClass(Sb3Block, [{
    key: "calledProcedureName",
    get: function get() {
      if (this.opcode !== 'procedures_call') {
        throw new Error("Cannot get called procedure name from non procedure call.");
      }

      return this.mutation.proccode;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Block ".concat(this.id, " (").concat(this.opcode, ")");
    }
  }]);

  return Sb3Block;
}();
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

var Sb3Target = /*#__PURE__*/function () {
  /**
   * @param {Object} data - Original data from the project.json
   */
  function Sb3Target(data) {
    _classCallCheck(this, Sb3Target);

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

    for (var _i = 0, _Object$keys = Object.keys(data.variables || {}); _i < _Object$keys.length; _i++) {
      var variable = _Object$keys[_i];
      this.variables[variable] = new Sb3Variable(variable, data.variables[variable]);
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
     * @type {Sb3Block[]}
     */

    this.blocks = [];

    for (var _i2 = 0, _Object$entries = Object.entries(data.blocks); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      this.blocks.push(new Sb3Block(key, value));
    }
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


  _createClass(Sb3Target, [{
    key: "equals",
    value: function equals(other) {
      return lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default()(this, other);
    }
    /**
     * Deep diff between two object, using lodash
     * @param  {Object} object Object compared
     * @param  {Object} base   Object to compare with
     * @return {Object}        Return a new object who represent the diff
     */

  }, {
    key: "difference",
    value: function difference(object, base) {
      function changes(object, base) {
        return _.transform(object, function (result, value, key) {
          if (!_.isEqual(value, base[key])) {
            result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value;
          }
        });
      }

      return changes(object, base);
    }
  }, {
    key: "diff",
    value: function diff(other) {
      return this.difference(this, other);
    }
    /**
     * Check if this sprite contains a block with the given opcode.
     * 
     * @param {string} opcode
     * @return {boolean}
     */

  }, {
    key: "hasBlock",
    value: function hasBlock(opcode) {
      return this.blocks.some(function (block) {
        return block.opcode === opcode;
      });
    }
    /**
     * Get the first block with opcode.
     * 
     * @param {string} opcode
     * @return {null|Sb3Block}
     */

  }, {
    key: "getFirst",
    value: function getFirst(opcode) {
      var found = null;

      for (var _i3 = 0, _Object$keys2 = Object.keys(this.blocks); _i3 < _Object$keys2.length; _i3++) {
        var key = _Object$keys2[_i3];

        if (this.blocks[key].opcode === opcode) {
          found = this.blocks[key];
          break;
        }
      }

      return found;
    }
  }]);

  return Sb3Target;
}();
var Sb3Stage = /*#__PURE__*/function (_Sb3Target) {
  _inherits(Sb3Stage, _Sb3Target);

  var _super = _createSuper(Sb3Stage);

  function Sb3Stage(data) {
    var _this;

    _classCallCheck(this, Sb3Stage);

    _this = _super.call(this, data);
    /** @type {number} */

    _this.tempo = data.temppo;
    /** @type {number} */

    _this.videoTransparency = data.videoTransparency;
    /** @type {"on" | "on)-flipped" | "off"} */

    _this.videoState = data.videoState;
    /** @type {string} */

    _this.textToSpeechLanguage = data.textToSpeechLanguage;
    return _this;
  }

  return Sb3Stage;
}(Sb3Target);
var Sb3Sprite = /*#__PURE__*/function (_Sb3Target2) {
  _inherits(Sb3Sprite, _Sb3Target2);

  var _super2 = _createSuper(Sb3Sprite);

  function Sb3Sprite(data) {
    var _this2;

    _classCallCheck(this, Sb3Sprite);

    _this2 = _super2.call(this, data);
    /** @type {boolean} */

    _this2.visible = data.visible;
    /** @type {number} */

    _this2.x = data.x;
    /** @type {number} */

    _this2.y = data.y;
    /** @type {number} */

    _this2.size = data.size;
    /** @type {number} */

    _this2.direction = data.direction;
    /** @type {boolean} */

    _this2.draggable = data.draggable;
    /** @type {"all around" | "left-right" | "don't rotate"} */

    _this2.rotationStyle = data.rotationStyle;
    return _this2;
  }

  return Sb3Sprite;
}(Sb3Target);
var Sb3Json = function Sb3Json(data) {
  _classCallCheck(this, Sb3Json);

  /** @type {Sb3Target[]} */
  this.targets = data.targets.map(function (t) {
    return t.isStage ? new Sb3Stage(t) : new Sb3Sprite(t);
  });
  /** @type {Sb3Monitor[]} */

  this.monitors = data.monitors;
  /** @type {Object[]} */

  this.extensions = data.extensions;
  /** @type {Object} */

  this.meta = data.meta;
};

/***/ }),

/***/ "./src/testplan.js":
/*!*************************!*\
  !*** ./src/testplan.js ***!
  \*************************/
/*! exports provided: FatalErrorException, TabLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FatalErrorException", function() { return FatalErrorException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TabLevel", function() { return TabLevel; });
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/isEqual */ "../../node_modules/lodash/isEqual.js");
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _output_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./output.js */ "./src/output.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * @file This file contains the testplan API, i.e. most of the stuff
 * you use when writing a test plan. This API is inspired by Jest, so
 * if you are familiar, it should be fairly easy to pick up.
 *
 * ## Structure
 *
 * Itch provides 4 levels of groupings for tests:
 *
 * 1. `tab`
 * 2. `describe`
 * 3. `test`
 * 4. `expect`
 *
 * When starting from the bottom, we begin simple:
 *
 * 1. The `expect` is used to compare two values. It does not have a name itself,
 *    but you can provide a custom error message. This is only shown when the
 *    assertion fails. (The values are always passed as well).
 * 2. The `test` is the lowest level with a name. It groups a bunch of related
 *    `expect` statements.
 * 3. The `describe` directive groups a bunch of related tests, e.g. for one sprite.
 * 4. The `tab` groups a bunch of `describe` statements. These are mainly for UI purposes.
 */



var FatalErrorException = /*#__PURE__*/function (_Error) {
  _inherits(FatalErrorException, _Error);

  var _super = _createSuper(FatalErrorException);

  function FatalErrorException() {
    _classCallCheck(this, FatalErrorException);

    return _super.apply(this, arguments);
  }

  return FatalErrorException;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var GenericMatcher = /*#__PURE__*/function () {
  function GenericMatcher(context, actual) {
    _classCallCheck(this, GenericMatcher);

    /** @type {Context} */
    this.context = context;
    this.actual = actual;
    /** @type {function(any, any):string} */

    this.errorMessage = null;
    /** @type {function(any, any):string} */

    this.successMessage = null;
    /** @type {boolean} */

    this.terminate = false;
  }
  /**
   * Post the result.
   *
   * @param {boolean} accepted - If the property satisfies the condition.
   * @param {string} [errorMessage] - Default error message.
   * @param {string} [successMessage] - Optional success message.
   *
   * @private
   */


  _createClass(GenericMatcher, [{
    key: "out",
    value: function out(accepted) {
      var errorMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var successMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      this.context.output.startTest(this.expected);
      var status = accepted ? _output_js__WEBPACK_IMPORTED_MODULE_1__["CORRECT"] : _output_js__WEBPACK_IMPORTED_MODULE_1__["WRONG"];

      if (accepted) {
        var message = this.successMessage ? this.successMessage(this.expected, this.actual) : successMessage;

        if (message) {
          this.context.output.appendMessage(message);
        }
      } else {
        var _message = this.errorMessage ? this.errorMessage(this.expected, this.actual) : errorMessage;

        if (_message) {
          this.context.output.appendMessage(_message);
        }
      }

      this.context.output.closeTest(this.actual, accepted, status);

      if (!accepted && this.terminate) {
        throw new FatalErrorException();
      }
    }
    /**
     * Allows setting an error message.
     *
     * @param {string|function(any,any):string} message
     *
     * @return {GenericMatcher}
     * @deprecated
     */

  }, {
    key: "withError",
    value: function withError(message) {
      this.errorMessage = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["castCallback"])(message);
      return this;
    }
    /**
     * Allows setting an error message.
     *
     * @param {string|function(any,any):string} message
     *
     * @return {GenericMatcher}
     * @deprecated
     */

  }, {
    key: "withSuccess",
    value: function withSuccess(message) {
      this.successMessage = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["castCallback"])(message);
      return this;
    }
    /**
     * Combines withSuccess & withError
     * 
     * @param {{[correct]:string|function():string, [wrong]:string|function():string}} messages
     * 
     * @return {GenericMatcher}
     */

  }, {
    key: "with",
    value: function _with(messages) {
      this.successMessage = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["castCallback"])(messages.correct);
      this.errorMessage = Object(_utils_js__WEBPACK_IMPORTED_MODULE_2__["castCallback"])(messages.wrong);
      return this;
    }
    /**
     * Mark this test as fatal: if it fails, the testplan will stop.
     * 
     * @return {GenericMatcher}
     */

  }, {
    key: "fatal",
    value: function fatal() {
      this.terminate = true;
      return this;
    }
    /**
     * Compares two values for equality.
     *
     * Most types of objects should be supported:
     *
     * - If both values are numbers, `numericEquals` is used, which supports floats.
     * - Otherwise, the `isEqual` function from lodash is used. Quoting their docs:
     *
     *   > This method supports comparing arrays, array buffers, booleans,
     *   > date objects, error objects, maps, numbers, `Object` objects, regexes,
     *   > sets, strings, symbols, and typed arrays. `Object` objects are compared
     *   > by their own, not inherited, enumerable properties. Functions and DOM
     *   > nodes are **not** supported.
     *
     *
     * @param expected
     */

  }, {
    key: "toBe",
    value: function toBe(expected) {
      this.expected = expected;

      if (typeof this.actual === 'number' && typeof expected === 'number') {
        var _this$actual;

        this.out(numericEquals(this.actual, expected), "Expected ".concat(expected === null || expected === void 0 ? void 0 : expected.toString(), " but got ").concat((_this$actual = this.actual) === null || _this$actual === void 0 ? void 0 : _this$actual.toString()));
      } else {
        var _this$actual2;

        this.out(lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default()(this.actual, expected), "Expected ".concat(expected === null || expected === void 0 ? void 0 : expected.toString(), " but got ").concat((_this$actual2 = this.actual) === null || _this$actual2 === void 0 ? void 0 : _this$actual2.toString()));
      }
    }
    /**
     * Compares two values for equality.
     *
     * Most types of objects should be supported:
     *
     * - If both values are numbers, `numericEquals` is used, which supports floats.
     * - Otherwise, the `isEqual` function from lodash is used. Quoting their docs:
     *
     *   > This method supports comparing arrays, array buffers, booleans,
     *   > date objects, error objects, maps, numbers, `Object` objects, regexes,
     *   > sets, strings, symbols, and typed arrays. `Object` objects are compared
     *   > by their own, not inherited, enumerable properties. Functions and DOM
     *   > nodes are **not** supported.
     *
     *
     * @param expected
     */

  }, {
    key: "toNotBe",
    value: function toNotBe(expected) {
      this.expected = expected;

      if (typeof this.actual === 'number' && typeof expected === 'number') {
        var _this$actual3;

        this.out(!numericEquals(this.actual, expected), "Expected ".concat(expected === null || expected === void 0 ? void 0 : expected.toString(), " but got ").concat((_this$actual3 = this.actual) === null || _this$actual3 === void 0 ? void 0 : _this$actual3.toString()));
      } else {
        var _this$actual4;

        this.out(!lodash_isEqual__WEBPACK_IMPORTED_MODULE_0___default()(this.actual, expected), "Expected ".concat(expected === null || expected === void 0 ? void 0 : expected.toString(), " but got ").concat((_this$actual4 = this.actual) === null || _this$actual4 === void 0 ? void 0 : _this$actual4.toString()));
      }
    }
  }]);

  return GenericMatcher;
}();

var ExpectLevel = /*#__PURE__*/function () {
  /**
   * @param {Context} context
   * @package
   */
  function ExpectLevel(context) {
    _classCallCheck(this, ExpectLevel);

    this.context = context;
  }
  /**
   * Start an assertion be providing a value.
   *
   * You can optionally provide a custom error message.
   *
   * @param {*} value
   *
   * @return {GenericMatcher}
   */


  _createClass(ExpectLevel, [{
    key: "expect",
    value: function expect(value) {
      return new GenericMatcher(this.context, value);
    }
    /**
     * Add a test that will always be accepted.
     */

  }, {
    key: "accept",
    value: function accept() {
      this.context.output.startTest(true);
      this.context.output.closeTest(true, true);
    }
  }]);

  return ExpectLevel;
}();

var TestLevel = /*#__PURE__*/function () {
  /**
   * @param {Context} context
   * @package
   */
  function TestLevel(context) {
    _classCallCheck(this, TestLevel);

    this.context = context;
  }
  /**
   * Check some properties as part of the same test.
   *
   * ### Test vs expect
   *
   * A good guideline to decide whether testing multiple properties
   * should happen in the same file or not: if it needs a name, it should
   * be a separate test.
   *
   * For example, if you are testing that a sprite moves down when pressing a key,
   * you might have one test, with two properties: one for x and one for y.
   *
   * On the other hand, you might want to have multiple tests: one for the position,
   * one for the orientation, etc.
   *
   * This level results in a `testcase` in the output format.
   *
   * @param {string} name
   * @param {function(out:ExpectLevel)} block
   */


  _createClass(TestLevel, [{
    key: "test",
    value: function test(name, block) {
      this.context.output.startTestcase(name);
      block(new ExpectLevel(this.context));
      this.context.output.closeTestcase();
    }
  }]);

  return TestLevel;
}();

var DescribeLevel = /*#__PURE__*/function (_TestLevel) {
  _inherits(DescribeLevel, _TestLevel);

  var _super2 = _createSuper(DescribeLevel);

  function DescribeLevel() {
    _classCallCheck(this, DescribeLevel);

    return _super2.apply(this, arguments);
  }

  _createClass(DescribeLevel, [{
    key: "describe",
    value:
    /**
     * Groups a bunch of related tests.
     *
     * This level results in a `context` in the output format.
     *
     * @param {string} name - Either the name or the function.
     * @param {function(TestLevel)} block - The function if a name is passed.
     */
    function describe() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      var block = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      this.context.output.startContext(name);
      block(this);
      this.context.output.closeContext();
    }
  }]);

  return DescribeLevel;
}(TestLevel);

var TabLevel = /*#__PURE__*/function (_DescribeLevel) {
  _inherits(TabLevel, _DescribeLevel);

  var _super3 = _createSuper(TabLevel);

  function TabLevel() {
    _classCallCheck(this, TabLevel);

    return _super3.apply(this, arguments);
  }

  _createClass(TabLevel, [{
    key: "tab",
    value:
    /**
     * Run the tests in the block inside the tab.
     *
     * This level results in a `tab` in the output format.
     *
     * @param {string} name
     * @param {function(DescribeLevel)} block
     */
    function tab(name, block) {
      this.context.output.startTab(name);
      block(this);
      this.context.output.closeTab();
    }
  }]);

  return TabLevel;
}(DescribeLevel);

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! exports provided: numericEquals, castCallback */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "numericEquals", function() { return numericEquals; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "castCallback", function() { return castCallback; });
/**
 * Check if two floating points are equal, considering
 * the given epsilon.
 *
 * @param {number} float1
 * @param {number} float2
 * @param {number } epsilon
 *
 * @return {boolean} True if the two are equal, false otherwise.
 */
function numericEquals(float1, float2) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.0001;
  return Math.abs(float1 - float2) < epsilon;
}
/**
 * Convert a value or function to a function.
 * 
 * If the argument is a function, return it.
 * Otherwise, returns a function that returns the value.
 * 
 * @template T
 * @param {T|null|undefined|function():T} functionOrObject
 * @return {function():T}
 */

function castCallback(functionOrObject) {
  if (typeof functionOrObject === 'function') {
    return functionOrObject;
  } else {
    return function () {
      return functionOrObject;
    };
  }
}

/***/ }),

/***/ "scratch-render":
/*!********************************!*\
  !*** external "ScratchRender" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ScratchRender;

/***/ }),

/***/ "scratch-storage":
/*!*********************************!*\
  !*** external "ScratchStorage" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ScratchStorage;

/***/ }),

/***/ "scratch-svg-renderer":
/*!*************************************!*\
  !*** external "ScratchSVGRenderer" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ScratchSVGRenderer;

/***/ }),

/***/ "scratch-vm":
/*!*********************************!*\
  !*** external "VirtualMachine" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = VirtualMachine;

/***/ })

/******/ });
});
//# sourceMappingURL=judge.browser.js.map