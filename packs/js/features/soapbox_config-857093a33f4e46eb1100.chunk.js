(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[71],{

/***/ 2304:
/*!***************************************************!*\
  !*** ./node_modules/@icons/material/CheckIcon.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _react = __webpack_require__(/*! react */ 0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
}

var DEFAULT_SIZE = 24;

exports["default"] = function (_ref) {
  var _ref$fill = _ref.fill,
      fill = _ref$fill === undefined ? 'currentColor' : _ref$fill,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? DEFAULT_SIZE : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? DEFAULT_SIZE : _ref$height,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      props = _objectWithoutProperties(_ref, ['fill', 'width', 'height', 'style']);

  return _react2.default.createElement('svg', _extends({
    viewBox: '0 0 ' + DEFAULT_SIZE + ' ' + DEFAULT_SIZE,
    style: _extends({
      fill: fill,
      width: width,
      height: height
    }, style)
  }, props), _react2.default.createElement('path', {
    d: 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'
  }));
};

/***/ }),

/***/ 2285:
/*!******************************************************************!*\
  !*** ./node_modules/@icons/material/UnfoldMoreHorizontalIcon.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _react = __webpack_require__(/*! react */ 0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
}

var DEFAULT_SIZE = 24;

exports["default"] = function (_ref) {
  var _ref$fill = _ref.fill,
      fill = _ref$fill === undefined ? 'currentColor' : _ref$fill,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? DEFAULT_SIZE : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? DEFAULT_SIZE : _ref$height,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      props = _objectWithoutProperties(_ref, ['fill', 'width', 'height', 'style']);

  return _react2.default.createElement('svg', _extends({
    viewBox: '0 0 ' + DEFAULT_SIZE + ' ' + DEFAULT_SIZE,
    style: _extends({
      fill: fill,
      width: width,
      height: height
    }, style)
  }, props), _react2.default.createElement('path', {
    d: 'M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z'
  }));
};

/***/ }),

/***/ 2172:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_arrayEach.js ***!
  \*******************************************/
/***/ (function(module) {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }

  return array;
}

module.exports = arrayEach;

/***/ }),

/***/ 2127:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_assignValue.js ***!
  \*********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ 481),
    eq = __webpack_require__(/*! ./eq */ 216);
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

  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

/***/ }),

/***/ 2173:
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseAssign.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ 2108),
    keys = __webpack_require__(/*! ./keys */ 274);
/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */


function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

/***/ }),

/***/ 2174:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_baseAssignIn.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ 2108),
    keysIn = __webpack_require__(/*! ./keysIn */ 2112);
/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */


function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;

/***/ }),

/***/ 2171:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseClone.js ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Stack = __webpack_require__(/*! ./_Stack */ 137),
    arrayEach = __webpack_require__(/*! ./_arrayEach */ 2172),
    assignValue = __webpack_require__(/*! ./_assignValue */ 2127),
    baseAssign = __webpack_require__(/*! ./_baseAssign */ 2173),
    baseAssignIn = __webpack_require__(/*! ./_baseAssignIn */ 2174),
    cloneBuffer = __webpack_require__(/*! ./_cloneBuffer */ 2101),
    copyArray = __webpack_require__(/*! ./_copyArray */ 2177),
    copySymbols = __webpack_require__(/*! ./_copySymbols */ 2178),
    copySymbolsIn = __webpack_require__(/*! ./_copySymbolsIn */ 2179),
    getAllKeys = __webpack_require__(/*! ./_getAllKeys */ 228),
    getAllKeysIn = __webpack_require__(/*! ./_getAllKeysIn */ 2180),
    getTag = __webpack_require__(/*! ./_getTag */ 176),
    initCloneArray = __webpack_require__(/*! ./_initCloneArray */ 2181),
    initCloneByTag = __webpack_require__(/*! ./_initCloneByTag */ 2182),
    initCloneObject = __webpack_require__(/*! ./_initCloneObject */ 2187),
    isArray = __webpack_require__(/*! ./isArray */ 60),
    isBuffer = __webpack_require__(/*! ./isBuffer */ 134),
    isMap = __webpack_require__(/*! ./isMap */ 2189),
    isObject = __webpack_require__(/*! ./isObject */ 252),
    isSet = __webpack_require__(/*! ./isSet */ 2191),
    keys = __webpack_require__(/*! ./keys */ 274),
    keysIn = __webpack_require__(/*! ./keysIn */ 2112);
/** Used to compose bitmasks for cloning. */


var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;
/** `Object#toString` result references. */

var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
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
/** Used to identify `toStringTag` values supported by `_.clone`. */

var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */

function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }

  if (result !== undefined) {
    return result;
  }

  if (!isObject(value)) {
    return value;
  }

  var isArr = isArray(value);

  if (isArr) {
    result = initCloneArray(value);

    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }

    if (tag == objectTag || tag == argsTag || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject(value);

      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }

      result = initCloneByTag(value, tag, isDeep);
    }
  } // Check for circular references and return its corresponding clone.


  stack || (stack = new Stack());
  var stacked = stack.get(value);

  if (stacked) {
    return stacked;
  }

  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function (subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function (subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    } // Recursively populate clone (susceptible to call stack limits).


    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

/***/ }),

/***/ 2188:
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseCreate.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ 252);
/** Built-in value references. */


var objectCreate = Object.create;
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */

var baseCreate = function () {
  function object() {}

  return function (proto) {
    if (!isObject(proto)) {
      return {};
    }

    if (objectCreate) {
      return objectCreate(proto);
    }

    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

module.exports = baseCreate;

/***/ }),

/***/ 2168:
/*!******************************************!*\
  !*** ./node_modules/lodash/_baseEach.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseForOwn = __webpack_require__(/*! ./_baseForOwn */ 482),
    createBaseEach = __webpack_require__(/*! ./_createBaseEach */ 2169);
/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */


var baseEach = createBaseEach(baseForOwn);
module.exports = baseEach;

/***/ }),

/***/ 2190:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsMap.js ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getTag = __webpack_require__(/*! ./_getTag */ 176),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 99);
/** `Object#toString` result references. */


var mapTag = '[object Map]';
/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */

function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;

/***/ }),

/***/ 2192:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_baseIsSet.js ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var getTag = __webpack_require__(/*! ./_getTag */ 176),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 99);
/** `Object#toString` result references. */


var setTag = '[object Set]';
/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */

function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;

/***/ }),

/***/ 2175:
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseKeysIn.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./isObject */ 252),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ 187),
    nativeKeysIn = __webpack_require__(/*! ./_nativeKeysIn */ 2176);
/** Used for built-in method references. */


var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }

  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }

  return result;
}

module.exports = baseKeysIn;

/***/ }),

/***/ 2167:
/*!*****************************************!*\
  !*** ./node_modules/lodash/_baseMap.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseEach = __webpack_require__(/*! ./_baseEach */ 2168),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ 466);
/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */


function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];
  baseEach(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

/***/ }),

/***/ 2164:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_castFunction.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var identity = __webpack_require__(/*! ./identity */ 504);
/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */


function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

/***/ }),

/***/ 2113:
/*!**************************************************!*\
  !*** ./node_modules/lodash/_cloneArrayBuffer.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Uint8Array = __webpack_require__(/*! ./_Uint8Array */ 227);
/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */


function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

/***/ }),

/***/ 2101:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneBuffer.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(/*! ./_root */ 47);
/** Detect free variable `exports`. */


var freeExports =  true && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Built-in value references. */

var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */

function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }

  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/***/ }),

/***/ 2183:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_cloneDataView.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ 2113);
/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */


function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

/***/ }),

/***/ 2184:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneRegExp.js ***!
  \*********************************************/
/***/ (function(module) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;
/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */

function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

/***/ }),

/***/ 2185:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_cloneSymbol.js ***!
  \*********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var Symbol = __webpack_require__(/*! ./_Symbol */ 108);
/** Used to convert symbols to primitives and strings. */


var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */

function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

/***/ }),

/***/ 2186:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_cloneTypedArray.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ 2113);
/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */


function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

/***/ }),

/***/ 2177:
/*!*******************************************!*\
  !*** ./node_modules/lodash/_copyArray.js ***!
  \*******************************************/
/***/ (function(module) {

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

/***/ 2108:
/*!********************************************!*\
  !*** ./node_modules/lodash/_copyObject.js ***!
  \********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var assignValue = __webpack_require__(/*! ./_assignValue */ 2127),
    baseAssignValue = __webpack_require__(/*! ./_baseAssignValue */ 481);
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */


function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }

    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }

  return object;
}

module.exports = copyObject;

/***/ }),

/***/ 2178:
/*!*********************************************!*\
  !*** ./node_modules/lodash/_copySymbols.js ***!
  \*********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ 2108),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ 226);
/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */


function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

/***/ }),

/***/ 2179:
/*!***********************************************!*\
  !*** ./node_modules/lodash/_copySymbolsIn.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var copyObject = __webpack_require__(/*! ./_copyObject */ 2108),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ 2128);
/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */


function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;

/***/ }),

/***/ 2169:
/*!************************************************!*\
  !*** ./node_modules/lodash/_createBaseEach.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isArrayLike = __webpack_require__(/*! ./isArrayLike */ 466);
/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */


function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }

    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }

    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }

    return collection;
  };
}

module.exports = createBaseEach;

/***/ }),

/***/ 2180:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getAllKeysIn.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(/*! ./_baseGetAllKeys */ 229),
    getSymbolsIn = __webpack_require__(/*! ./_getSymbolsIn */ 2128),
    keysIn = __webpack_require__(/*! ./keysIn */ 2112);
/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */


function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;

/***/ }),

/***/ 2111:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getPrototype.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var overArg = __webpack_require__(/*! ./_overArg */ 191);
/** Built-in value references. */


var getPrototype = overArg(Object.getPrototypeOf, Object);
module.exports = getPrototype;

/***/ }),

/***/ 2128:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_getSymbolsIn.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arrayPush = __webpack_require__(/*! ./_arrayPush */ 502),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ 2111),
    getSymbols = __webpack_require__(/*! ./_getSymbols */ 226),
    stubArray = __webpack_require__(/*! ./stubArray */ 503);
/* Built-in method references for those with the same name as other `lodash` methods. */


var nativeGetSymbols = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
  var result = [];

  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }

  return result;
};
module.exports = getSymbolsIn;

/***/ }),

/***/ 2181:
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneArray.js ***!
  \************************************************/
/***/ (function(module) {

/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */

function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length); // Add properties assigned by `RegExp#exec`.

  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }

  return result;
}

module.exports = initCloneArray;

/***/ }),

/***/ 2182:
/*!************************************************!*\
  !*** ./node_modules/lodash/_initCloneByTag.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(/*! ./_cloneArrayBuffer */ 2113),
    cloneDataView = __webpack_require__(/*! ./_cloneDataView */ 2183),
    cloneRegExp = __webpack_require__(/*! ./_cloneRegExp */ 2184),
    cloneSymbol = __webpack_require__(/*! ./_cloneSymbol */ 2185),
    cloneTypedArray = __webpack_require__(/*! ./_cloneTypedArray */ 2186);
/** `Object#toString` result references. */


var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';
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
/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;

  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor();

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor();

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

/***/ }),

/***/ 2187:
/*!*************************************************!*\
  !*** ./node_modules/lodash/_initCloneObject.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseCreate = __webpack_require__(/*! ./_baseCreate */ 2188),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ 2111),
    isPrototype = __webpack_require__(/*! ./_isPrototype */ 187);
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */


function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}

module.exports = initCloneObject;

/***/ }),

/***/ 2176:
/*!**********************************************!*\
  !*** ./node_modules/lodash/_nativeKeysIn.js ***!
  \**********************************************/
/***/ (function(module) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

module.exports = nativeKeysIn;

/***/ }),

/***/ 2170:
/*!******************************************!*\
  !*** ./node_modules/lodash/cloneDeep.js ***!
  \******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseClone = __webpack_require__(/*! ./_baseClone */ 2171);
/** Used to compose bitmasks for cloning. */


var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;
/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */

function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;

/***/ }),

/***/ 2110:
/*!***************************************!*\
  !*** ./node_modules/lodash/forOwn.js ***!
  \***************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseForOwn = __webpack_require__(/*! ./_baseForOwn */ 482),
    castFunction = __webpack_require__(/*! ./_castFunction */ 2164);
/**
 * Iterates over own enumerable string keyed properties of an object and
 * invokes `iteratee` for each property. The iteratee is invoked with three
 * arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @since 0.3.0
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Object} Returns `object`.
 * @see _.forOwnRight
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */


function forOwn(object, iteratee) {
  return object && baseForOwn(object, castFunction(iteratee));
}

module.exports = forOwn;

/***/ }),

/***/ 2189:
/*!**************************************!*\
  !*** ./node_modules/lodash/isMap.js ***!
  \**************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseIsMap = __webpack_require__(/*! ./_baseIsMap */ 2190),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ 177),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ 174);
/* Node.js helper references. */


var nodeIsMap = nodeUtil && nodeUtil.isMap;
/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */

var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
module.exports = isMap;

/***/ }),

/***/ 2165:
/*!**********************************************!*\
  !*** ./node_modules/lodash/isPlainObject.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 101),
    getPrototype = __webpack_require__(/*! ./_getPrototype */ 2111),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 99);
/** `Object#toString` result references. */


var objectTag = '[object Object]';
/** Used for built-in method references. */

var funcProto = Function.prototype,
    objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString = funcToString.call(Object);
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */

function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }

  var proto = getPrototype(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;

/***/ }),

/***/ 2191:
/*!**************************************!*\
  !*** ./node_modules/lodash/isSet.js ***!
  \**************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseIsSet = __webpack_require__(/*! ./_baseIsSet */ 2192),
    baseUnary = __webpack_require__(/*! ./_baseUnary */ 177),
    nodeUtil = __webpack_require__(/*! ./_nodeUtil */ 174);
/* Node.js helper references. */


var nodeIsSet = nodeUtil && nodeUtil.isSet;
/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */

var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
module.exports = isSet;

/***/ }),

/***/ 2163:
/*!*****************************************!*\
  !*** ./node_modules/lodash/isString.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ 101),
    isArray = __webpack_require__(/*! ./isArray */ 60),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ 99);
/** `Object#toString` result references. */


var stringTag = '[object String]';
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */

function isString(value) {
  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
}

module.exports = isString;

/***/ }),

/***/ 2112:
/*!***************************************!*\
  !*** ./node_modules/lodash/keysIn.js ***!
  \***************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(/*! ./_arrayLikeKeys */ 500),
    baseKeysIn = __webpack_require__(/*! ./_baseKeysIn */ 2175),
    isArrayLike = __webpack_require__(/*! ./isArrayLike */ 466);
/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
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
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */


function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;

/***/ }),

/***/ 2166:
/*!************************************!*\
  !*** ./node_modules/lodash/map.js ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var arrayMap = __webpack_require__(/*! ./_arrayMap */ 135),
    baseIteratee = __webpack_require__(/*! ./_baseIteratee */ 501),
    baseMap = __webpack_require__(/*! ./_baseMap */ 2167),
    isArray = __webpack_require__(/*! ./isArray */ 60);
/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */


function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

/***/ }),

/***/ 2201:
/*!************************************************************!*\
  !*** ./node_modules/material-colors/dist/colors.es2015.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "amber": function() { return /* binding */ amber; },
/* harmony export */   "black": function() { return /* binding */ black; },
/* harmony export */   "blue": function() { return /* binding */ blue; },
/* harmony export */   "blueGrey": function() { return /* binding */ blueGrey; },
/* harmony export */   "brown": function() { return /* binding */ brown; },
/* harmony export */   "cyan": function() { return /* binding */ cyan; },
/* harmony export */   "darkIcons": function() { return /* binding */ darkIcons; },
/* harmony export */   "darkText": function() { return /* binding */ darkText; },
/* harmony export */   "deepOrange": function() { return /* binding */ deepOrange; },
/* harmony export */   "deepPurple": function() { return /* binding */ deepPurple; },
/* harmony export */   "green": function() { return /* binding */ green; },
/* harmony export */   "grey": function() { return /* binding */ grey; },
/* harmony export */   "indigo": function() { return /* binding */ indigo; },
/* harmony export */   "lightBlue": function() { return /* binding */ lightBlue; },
/* harmony export */   "lightGreen": function() { return /* binding */ lightGreen; },
/* harmony export */   "lightIcons": function() { return /* binding */ lightIcons; },
/* harmony export */   "lightText": function() { return /* binding */ lightText; },
/* harmony export */   "lime": function() { return /* binding */ lime; },
/* harmony export */   "orange": function() { return /* binding */ orange; },
/* harmony export */   "pink": function() { return /* binding */ pink; },
/* harmony export */   "purple": function() { return /* binding */ purple; },
/* harmony export */   "red": function() { return /* binding */ red; },
/* harmony export */   "teal": function() { return /* binding */ teal; },
/* harmony export */   "white": function() { return /* binding */ white; },
/* harmony export */   "yellow": function() { return /* binding */ yellow; }
/* harmony export */ });
var red = {
  "50": "#ffebee",
  "100": "#ffcdd2",
  "200": "#ef9a9a",
  "300": "#e57373",
  "400": "#ef5350",
  "500": "#f44336",
  "600": "#e53935",
  "700": "#d32f2f",
  "800": "#c62828",
  "900": "#b71c1c",
  "a100": "#ff8a80",
  "a200": "#ff5252",
  "a400": "#ff1744",
  "a700": "#d50000"
};
var pink = {
  "50": "#fce4ec",
  "100": "#f8bbd0",
  "200": "#f48fb1",
  "300": "#f06292",
  "400": "#ec407a",
  "500": "#e91e63",
  "600": "#d81b60",
  "700": "#c2185b",
  "800": "#ad1457",
  "900": "#880e4f",
  "a100": "#ff80ab",
  "a200": "#ff4081",
  "a400": "#f50057",
  "a700": "#c51162"
};
var purple = {
  "50": "#f3e5f5",
  "100": "#e1bee7",
  "200": "#ce93d8",
  "300": "#ba68c8",
  "400": "#ab47bc",
  "500": "#9c27b0",
  "600": "#8e24aa",
  "700": "#7b1fa2",
  "800": "#6a1b9a",
  "900": "#4a148c",
  "a100": "#ea80fc",
  "a200": "#e040fb",
  "a400": "#d500f9",
  "a700": "#aa00ff"
};
var deepPurple = {
  "50": "#ede7f6",
  "100": "#d1c4e9",
  "200": "#b39ddb",
  "300": "#9575cd",
  "400": "#7e57c2",
  "500": "#673ab7",
  "600": "#5e35b1",
  "700": "#512da8",
  "800": "#4527a0",
  "900": "#311b92",
  "a100": "#b388ff",
  "a200": "#7c4dff",
  "a400": "#651fff",
  "a700": "#6200ea"
};
var indigo = {
  "50": "#e8eaf6",
  "100": "#c5cae9",
  "200": "#9fa8da",
  "300": "#7986cb",
  "400": "#5c6bc0",
  "500": "#3f51b5",
  "600": "#3949ab",
  "700": "#303f9f",
  "800": "#283593",
  "900": "#1a237e",
  "a100": "#8c9eff",
  "a200": "#536dfe",
  "a400": "#3d5afe",
  "a700": "#304ffe"
};
var blue = {
  "50": "#e3f2fd",
  "100": "#bbdefb",
  "200": "#90caf9",
  "300": "#64b5f6",
  "400": "#42a5f5",
  "500": "#2196f3",
  "600": "#1e88e5",
  "700": "#1976d2",
  "800": "#1565c0",
  "900": "#0d47a1",
  "a100": "#82b1ff",
  "a200": "#448aff",
  "a400": "#2979ff",
  "a700": "#2962ff"
};
var lightBlue = {
  "50": "#e1f5fe",
  "100": "#b3e5fc",
  "200": "#81d4fa",
  "300": "#4fc3f7",
  "400": "#29b6f6",
  "500": "#03a9f4",
  "600": "#039be5",
  "700": "#0288d1",
  "800": "#0277bd",
  "900": "#01579b",
  "a100": "#80d8ff",
  "a200": "#40c4ff",
  "a400": "#00b0ff",
  "a700": "#0091ea"
};
var cyan = {
  "50": "#e0f7fa",
  "100": "#b2ebf2",
  "200": "#80deea",
  "300": "#4dd0e1",
  "400": "#26c6da",
  "500": "#00bcd4",
  "600": "#00acc1",
  "700": "#0097a7",
  "800": "#00838f",
  "900": "#006064",
  "a100": "#84ffff",
  "a200": "#18ffff",
  "a400": "#00e5ff",
  "a700": "#00b8d4"
};
var teal = {
  "50": "#e0f2f1",
  "100": "#b2dfdb",
  "200": "#80cbc4",
  "300": "#4db6ac",
  "400": "#26a69a",
  "500": "#009688",
  "600": "#00897b",
  "700": "#00796b",
  "800": "#00695c",
  "900": "#004d40",
  "a100": "#a7ffeb",
  "a200": "#64ffda",
  "a400": "#1de9b6",
  "a700": "#00bfa5"
};
var green = {
  "50": "#e8f5e9",
  "100": "#c8e6c9",
  "200": "#a5d6a7",
  "300": "#81c784",
  "400": "#66bb6a",
  "500": "#4caf50",
  "600": "#43a047",
  "700": "#388e3c",
  "800": "#2e7d32",
  "900": "#1b5e20",
  "a100": "#b9f6ca",
  "a200": "#69f0ae",
  "a400": "#00e676",
  "a700": "#00c853"
};
var lightGreen = {
  "50": "#f1f8e9",
  "100": "#dcedc8",
  "200": "#c5e1a5",
  "300": "#aed581",
  "400": "#9ccc65",
  "500": "#8bc34a",
  "600": "#7cb342",
  "700": "#689f38",
  "800": "#558b2f",
  "900": "#33691e",
  "a100": "#ccff90",
  "a200": "#b2ff59",
  "a400": "#76ff03",
  "a700": "#64dd17"
};
var lime = {
  "50": "#f9fbe7",
  "100": "#f0f4c3",
  "200": "#e6ee9c",
  "300": "#dce775",
  "400": "#d4e157",
  "500": "#cddc39",
  "600": "#c0ca33",
  "700": "#afb42b",
  "800": "#9e9d24",
  "900": "#827717",
  "a100": "#f4ff81",
  "a200": "#eeff41",
  "a400": "#c6ff00",
  "a700": "#aeea00"
};
var yellow = {
  "50": "#fffde7",
  "100": "#fff9c4",
  "200": "#fff59d",
  "300": "#fff176",
  "400": "#ffee58",
  "500": "#ffeb3b",
  "600": "#fdd835",
  "700": "#fbc02d",
  "800": "#f9a825",
  "900": "#f57f17",
  "a100": "#ffff8d",
  "a200": "#ffff00",
  "a400": "#ffea00",
  "a700": "#ffd600"
};
var amber = {
  "50": "#fff8e1",
  "100": "#ffecb3",
  "200": "#ffe082",
  "300": "#ffd54f",
  "400": "#ffca28",
  "500": "#ffc107",
  "600": "#ffb300",
  "700": "#ffa000",
  "800": "#ff8f00",
  "900": "#ff6f00",
  "a100": "#ffe57f",
  "a200": "#ffd740",
  "a400": "#ffc400",
  "a700": "#ffab00"
};
var orange = {
  "50": "#fff3e0",
  "100": "#ffe0b2",
  "200": "#ffcc80",
  "300": "#ffb74d",
  "400": "#ffa726",
  "500": "#ff9800",
  "600": "#fb8c00",
  "700": "#f57c00",
  "800": "#ef6c00",
  "900": "#e65100",
  "a100": "#ffd180",
  "a200": "#ffab40",
  "a400": "#ff9100",
  "a700": "#ff6d00"
};
var deepOrange = {
  "50": "#fbe9e7",
  "100": "#ffccbc",
  "200": "#ffab91",
  "300": "#ff8a65",
  "400": "#ff7043",
  "500": "#ff5722",
  "600": "#f4511e",
  "700": "#e64a19",
  "800": "#d84315",
  "900": "#bf360c",
  "a100": "#ff9e80",
  "a200": "#ff6e40",
  "a400": "#ff3d00",
  "a700": "#dd2c00"
};
var brown = {
  "50": "#efebe9",
  "100": "#d7ccc8",
  "200": "#bcaaa4",
  "300": "#a1887f",
  "400": "#8d6e63",
  "500": "#795548",
  "600": "#6d4c41",
  "700": "#5d4037",
  "800": "#4e342e",
  "900": "#3e2723"
};
var grey = {
  "50": "#fafafa",
  "100": "#f5f5f5",
  "200": "#eeeeee",
  "300": "#e0e0e0",
  "400": "#bdbdbd",
  "500": "#9e9e9e",
  "600": "#757575",
  "700": "#616161",
  "800": "#424242",
  "900": "#212121"
};
var blueGrey = {
  "50": "#eceff1",
  "100": "#cfd8dc",
  "200": "#b0bec5",
  "300": "#90a4ae",
  "400": "#78909c",
  "500": "#607d8b",
  "600": "#546e7a",
  "700": "#455a64",
  "800": "#37474f",
  "900": "#263238"
};
var darkText = {
  "primary": "rgba(0, 0, 0, 0.87)",
  "secondary": "rgba(0, 0, 0, 0.54)",
  "disabled": "rgba(0, 0, 0, 0.38)",
  "dividers": "rgba(0, 0, 0, 0.12)"
};
var lightText = {
  "primary": "rgba(255, 255, 255, 1)",
  "secondary": "rgba(255, 255, 255, 0.7)",
  "disabled": "rgba(255, 255, 255, 0.5)",
  "dividers": "rgba(255, 255, 255, 0.12)"
};
var darkIcons = {
  "active": "rgba(0, 0, 0, 0.54)",
  "inactive": "rgba(0, 0, 0, 0.38)"
};
var lightIcons = {
  "active": "rgba(255, 255, 255, 1)",
  "inactive": "rgba(255, 255, 255, 0.5)"
};
var white = "#ffffff";
var black = "#000000";
/* harmony default export */ __webpack_exports__["default"] = ({
  red: red,
  pink: pink,
  purple: purple,
  deepPurple: deepPurple,
  indigo: indigo,
  blue: blue,
  lightBlue: lightBlue,
  cyan: cyan,
  teal: teal,
  green: green,
  lightGreen: lightGreen,
  lime: lime,
  yellow: yellow,
  amber: amber,
  orange: orange,
  deepOrange: deepOrange,
  brown: brown,
  grey: grey,
  blueGrey: blueGrey,
  darkText: darkText,
  lightText: lightText,
  darkIcons: darkIcons,
  lightIcons: lightIcons,
  white: white,
  black: black
});

/***/ }),

/***/ 2162:
/*!***************************************************************!*\
  !*** ./node_modules/react-color/es/components/alpha/Alpha.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlphaPicker": function() { return /* binding */ AlphaPicker; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _AlphaPointer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AlphaPointer */ 2281);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};





var AlphaPicker = function AlphaPicker(_ref) {
  var rgb = _ref.rgb,
      hsl = _ref.hsl,
      width = _ref.width,
      height = _ref.height,
      onChange = _ref.onChange,
      direction = _ref.direction,
      style = _ref.style,
      renderers = _ref.renderers,
      pointer = _ref.pointer,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        position: 'relative',
        width: width,
        height: height
      },
      alpha: {
        radius: '2px',
        style: style
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker,
    className: 'alpha-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.Alpha, _extends({}, styles.alpha, {
    rgb: rgb,
    hsl: hsl,
    pointer: pointer,
    renderers: renderers,
    onChange: onChange,
    direction: direction
  })));
};
AlphaPicker.defaultProps = {
  width: '316px',
  height: '16px',
  direction: 'horizontal',
  pointer: _AlphaPointer__WEBPACK_IMPORTED_MODULE_3__["default"]
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_2__.ColorWrap)(AlphaPicker));

/***/ }),

/***/ 2281:
/*!**********************************************************************!*\
  !*** ./node_modules/react-color/es/components/alpha/AlphaPointer.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlphaPointer": function() { return /* binding */ AlphaPointer; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var AlphaPointer = function AlphaPointer(_ref) {
  var direction = _ref.direction;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        transform: 'translate(-9px, -1px)',
        backgroundColor: 'rgb(248, 248, 248)',
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)'
      }
    },
    'vertical': {
      picker: {
        transform: 'translate(-3px, -9px)'
      }
    }
  }, {
    vertical: direction === 'vertical'
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
/* harmony default export */ __webpack_exports__["default"] = (AlphaPointer);

/***/ }),

/***/ 2199:
/*!***************************************************************!*\
  !*** ./node_modules/react-color/es/components/block/Block.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Block": function() { return /* binding */ Block; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _BlockSwatches__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BlockSwatches */ 2282);







var Block = function Block(_ref) {
  var onChange = _ref.onChange,
      onSwatchHover = _ref.onSwatchHover,
      hex = _ref.hex,
      colors = _ref.colors,
      width = _ref.width,
      triangle = _ref.triangle,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var transparent = hex === 'transparent';

  var handleChange = function handleChange(hexCode, e) {
    _helpers_color__WEBPACK_IMPORTED_MODULE_3__.isValidHex(hexCode) && onChange({
      hex: hexCode,
      source: 'hex'
    }, e);
  };

  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__["default"])({
    'default': {
      card: {
        width: width,
        background: '#fff',
        boxShadow: '0 1px rgba(0,0,0,.1)',
        borderRadius: '6px',
        position: 'relative'
      },
      head: {
        height: '110px',
        background: hex,
        borderRadius: '6px 6px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      },
      body: {
        padding: '10px'
      },
      label: {
        fontSize: '18px',
        color: _helpers_color__WEBPACK_IMPORTED_MODULE_3__.getContrastingColor(hex),
        position: 'relative'
      },
      triangle: {
        width: '0px',
        height: '0px',
        borderStyle: 'solid',
        borderWidth: '0 10px 10px 10px',
        borderColor: 'transparent transparent ' + hex + ' transparent',
        position: 'absolute',
        top: '-10px',
        left: '50%',
        marginLeft: '-10px'
      },
      input: {
        width: '100%',
        fontSize: '12px',
        color: '#666',
        border: '0px',
        outline: 'none',
        height: '22px',
        boxShadow: 'inset 0 0 0 1px #ddd',
        borderRadius: '4px',
        padding: '0 7px',
        boxSizing: 'border-box'
      }
    },
    'hide-triangle': {
      triangle: {
        display: 'none'
      }
    }
  }, passedStyles), {
    'hide-triangle': triangle === 'hide'
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.card,
    className: 'block-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.triangle
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.head
  }, transparent && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.Checkboard, {
    borderRadius: '6px 6px 0 0'
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.label
  }, hex)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.body
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_BlockSwatches__WEBPACK_IMPORTED_MODULE_5__["default"], {
    colors: colors,
    onClick: handleChange,
    onSwatchHover: onSwatchHover
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input
    },
    value: hex,
    onChange: handleChange
  })));
};
Block.defaultProps = {
  width: 170,
  colors: ['#D9E3F0', '#F47373', '#697689', '#37D67A', '#2CCCE4', '#555555', '#dce775', '#ff8a65', '#ba68c8'],
  triangle: 'top',
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_4__.ColorWrap)(Block));

/***/ }),

/***/ 2282:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/block/BlockSwatches.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BlockSwatches": function() { return /* binding */ BlockSwatches; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es/map */ 2702);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common */ 1796);




var BlockSwatches = function BlockSwatches(_ref) {
  var colors = _ref.colors,
      onClick = _ref.onClick,
      onSwatchHover = _ref.onSwatchHover;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      swatches: {
        marginRight: '-10px'
      },
      swatch: {
        width: '22px',
        height: '22px',
        float: 'left',
        marginRight: '10px',
        marginBottom: '10px',
        borderRadius: '4px'
      },
      clear: {
        clear: 'both'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatches
  }, (0,lodash_es_map__WEBPACK_IMPORTED_MODULE_3__["default"])(colors, function (c) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.Swatch, {
      key: c,
      color: c,
      style: styles.swatch,
      onClick: onClick,
      onHover: onSwatchHover,
      focusStyle: {
        boxShadow: '0 0 4px ' + c
      }
    });
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.clear
  }));
};
/* harmony default export */ __webpack_exports__["default"] = (BlockSwatches);

/***/ }),

/***/ 1390:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/chrome/Chrome.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Chrome": function() { return /* binding */ Chrome; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _ChromeFields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChromeFields */ 2284);
/* harmony import */ var _ChromePointer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ChromePointer */ 2286);
/* harmony import */ var _ChromePointerCircle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ChromePointerCircle */ 2287);








var Chrome = function Chrome(_ref) {
  var width = _ref.width,
      onChange = _ref.onChange,
      disableAlpha = _ref.disableAlpha,
      rgb = _ref.rgb,
      hsl = _ref.hsl,
      hsv = _ref.hsv,
      hex = _ref.hex,
      renderers = _ref.renderers,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className,
      defaultView = _ref.defaultView;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_7__["default"])({
    'default': {
      picker: {
        width: width,
        background: '#fff',
        borderRadius: '2px',
        boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
        boxSizing: 'initial',
        fontFamily: 'Menlo'
      },
      saturation: {
        width: '100%',
        paddingBottom: '55%',
        position: 'relative',
        borderRadius: '2px 2px 0 0',
        overflow: 'hidden'
      },
      Saturation: {
        radius: '2px 2px 0 0'
      },
      body: {
        padding: '16px 16px 12px'
      },
      controls: {
        display: 'flex'
      },
      color: {
        width: '32px'
      },
      swatch: {
        marginTop: '6px',
        width: '16px',
        height: '16px',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      },
      active: {
        absolute: '0px 0px 0px 0px',
        borderRadius: '8px',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
        background: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + rgb.a + ')',
        zIndex: '2'
      },
      toggles: {
        flex: '1'
      },
      hue: {
        height: '10px',
        position: 'relative',
        marginBottom: '8px'
      },
      Hue: {
        radius: '2px'
      },
      alpha: {
        height: '10px',
        position: 'relative'
      },
      Alpha: {
        radius: '2px'
      }
    },
    'disableAlpha': {
      color: {
        width: '22px'
      },
      alpha: {
        display: 'none'
      },
      hue: {
        marginBottom: '0px'
      },
      swatch: {
        width: '10px',
        height: '10px',
        marginTop: '0px'
      }
    }
  }, passedStyles), {
    disableAlpha: disableAlpha
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker,
    className: 'chrome-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.saturation
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Saturation, {
    style: styles.Saturation,
    hsl: hsl,
    hsv: hsv,
    pointer: _ChromePointerCircle__WEBPACK_IMPORTED_MODULE_6__["default"],
    onChange: onChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.body
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.controls,
    className: 'flexbox-fix'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.color
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.active
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Checkboard, {
    renderers: renderers
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.toggles
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.hue
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Hue, {
    style: styles.Hue,
    hsl: hsl,
    pointer: _ChromePointer__WEBPACK_IMPORTED_MODULE_5__["default"],
    onChange: onChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.alpha
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Alpha, {
    style: styles.Alpha,
    rgb: rgb,
    hsl: hsl,
    pointer: _ChromePointer__WEBPACK_IMPORTED_MODULE_5__["default"],
    renderers: renderers,
    onChange: onChange
  })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ChromeFields__WEBPACK_IMPORTED_MODULE_4__["default"], {
    rgb: rgb,
    hsl: hsl,
    hex: hex,
    view: defaultView,
    onChange: onChange,
    disableAlpha: disableAlpha
  })));
};
Chrome.defaultProps = {
  width: 225,
  disableAlpha: false,
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(Chrome));

/***/ }),

/***/ 2284:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/chrome/ChromeFields.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChromeFields": function() { return /* binding */ ChromeFields; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var lodash_es_isUndefined__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es/isUndefined */ 2751);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _icons_material_UnfoldMoreHorizontalIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @icons/material/UnfoldMoreHorizontalIcon */ 2285);



var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
/* eslint-disable react/no-did-mount-set-state, no-param-reassign */








var ChromeFields = function (_React$Component) {
  _inherits(ChromeFields, _React$Component);

  function ChromeFields(props) {
    _classCallCheck(this, ChromeFields);

    var _this = _possibleConstructorReturn(this, (ChromeFields.__proto__ || Object.getPrototypeOf(ChromeFields)).call(this));

    _this.toggleViews = function () {
      if (_this.state.view === 'hex') {
        _this.setState({
          view: 'rgb'
        });
      } else if (_this.state.view === 'rgb') {
        _this.setState({
          view: 'hsl'
        });
      } else if (_this.state.view === 'hsl') {
        if (_this.props.hsl.a === 1) {
          _this.setState({
            view: 'hex'
          });
        } else {
          _this.setState({
            view: 'rgb'
          });
        }
      }
    };

    _this.handleChange = function (data, e) {
      if (data.hex) {
        _helpers_color__WEBPACK_IMPORTED_MODULE_4__.isValidHex(data.hex) && _this.props.onChange({
          hex: data.hex,
          source: 'hex'
        }, e);
      } else if (data.r || data.g || data.b) {
        _this.props.onChange({
          r: data.r || _this.props.rgb.r,
          g: data.g || _this.props.rgb.g,
          b: data.b || _this.props.rgb.b,
          source: 'rgb'
        }, e);
      } else if (data.a) {
        if (data.a < 0) {
          data.a = 0;
        } else if (data.a > 1) {
          data.a = 1;
        }

        _this.props.onChange({
          h: _this.props.hsl.h,
          s: _this.props.hsl.s,
          l: _this.props.hsl.l,
          a: Math.round(data.a * 100) / 100,
          source: 'rgb'
        }, e);
      } else if (data.h || data.s || data.l) {
        // Remove any occurances of '%'.
        if (typeof data.s === 'string' && data.s.includes('%')) {
          data.s = data.s.replace('%', '');
        }

        if (typeof data.l === 'string' && data.l.includes('%')) {
          data.l = data.l.replace('%', '');
        } // We store HSL as a unit interval so we need to override the 1 input to 0.01


        if (data.s == 1) {
          data.s = 0.01;
        } else if (data.l == 1) {
          data.l = 0.01;
        }

        _this.props.onChange({
          h: data.h || _this.props.hsl.h,
          s: Number(!(0,lodash_es_isUndefined__WEBPACK_IMPORTED_MODULE_7__["default"])(data.s) ? data.s : _this.props.hsl.s),
          l: Number(!(0,lodash_es_isUndefined__WEBPACK_IMPORTED_MODULE_7__["default"])(data.l) ? data.l : _this.props.hsl.l),
          source: 'hsl'
        }, e);
      }
    };

    _this.showHighlight = function (e) {
      e.currentTarget.style.background = '#eee';
    };

    _this.hideHighlight = function (e) {
      e.currentTarget.style.background = 'transparent';
    };

    if (props.hsl.a !== 1 && props.view === "hex") {
      _this.state = {
        view: "rgb"
      };
    } else {
      _this.state = {
        view: props.view
      };
    }

    return _this;
  }

  _createClass(ChromeFields, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_3__["default"])({
        'default': {
          wrap: {
            paddingTop: '16px',
            display: 'flex'
          },
          fields: {
            flex: '1',
            display: 'flex',
            marginLeft: '-6px'
          },
          field: {
            paddingLeft: '6px',
            width: '100%'
          },
          alpha: {
            paddingLeft: '6px',
            width: '100%'
          },
          toggle: {
            width: '32px',
            textAlign: 'right',
            position: 'relative'
          },
          icon: {
            marginRight: '-4px',
            marginTop: '12px',
            cursor: 'pointer',
            position: 'relative'
          },
          iconHighlight: {
            position: 'absolute',
            width: '24px',
            height: '28px',
            background: '#eee',
            borderRadius: '4px',
            top: '10px',
            left: '12px',
            display: 'none'
          },
          input: {
            fontSize: '11px',
            color: '#333',
            width: '100%',
            borderRadius: '2px',
            border: 'none',
            boxShadow: 'inset 0 0 0 1px #dadada',
            height: '21px',
            textAlign: 'center'
          },
          label: {
            textTransform: 'uppercase',
            fontSize: '11px',
            lineHeight: '11px',
            color: '#969696',
            textAlign: 'center',
            display: 'block',
            marginTop: '12px'
          },
          svg: {
            fill: '#333',
            width: '24px',
            height: '24px',
            border: '1px transparent solid',
            borderRadius: '5px'
          }
        },
        'disableAlpha': {
          alpha: {
            display: 'none'
          }
        }
      }, this.props, this.state);
      var fields = void 0;

      if (this.state.view === 'hex') {
        fields = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.fields,
          className: 'flexbox-fix'
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.field
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'hex',
          value: this.props.hex,
          onChange: this.handleChange
        })));
      } else if (this.state.view === 'rgb') {
        fields = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.fields,
          className: 'flexbox-fix'
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.field
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'r',
          value: this.props.rgb.r,
          onChange: this.handleChange
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.field
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'g',
          value: this.props.rgb.g,
          onChange: this.handleChange
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.field
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'b',
          value: this.props.rgb.b,
          onChange: this.handleChange
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.alpha
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'a',
          value: this.props.rgb.a,
          arrowOffset: 0.01,
          onChange: this.handleChange
        })));
      } else if (this.state.view === 'hsl') {
        fields = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.fields,
          className: 'flexbox-fix'
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.field
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'h',
          value: Math.round(this.props.hsl.h),
          onChange: this.handleChange
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.field
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 's',
          value: Math.round(this.props.hsl.s * 100) + '%',
          onChange: this.handleChange
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.field
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'l',
          value: Math.round(this.props.hsl.l * 100) + '%',
          onChange: this.handleChange
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
          style: styles.alpha
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
          style: {
            input: styles.input,
            label: styles.label
          },
          label: 'a',
          value: this.props.hsl.a,
          arrowOffset: 0.01,
          onChange: this.handleChange
        })));
      }

      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
        style: styles.wrap,
        className: 'flexbox-fix'
      }, fields, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
        style: styles.toggle
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement('div', {
        style: styles.icon,
        onClick: this.toggleViews,
        ref: function ref(icon) {
          return _this2.icon = icon;
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(_icons_material_UnfoldMoreHorizontalIcon__WEBPACK_IMPORTED_MODULE_6__["default"], {
        style: styles.svg,
        onMouseOver: this.showHighlight,
        onMouseEnter: this.showHighlight,
        onMouseOut: this.hideHighlight
      }))));
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, state) {
      if (nextProps.hsl.a !== 1 && state.view === 'hex') {
        return {
          view: 'rgb'
        };
      }

      return null;
    }
  }]);

  return ChromeFields;
}(react__WEBPACK_IMPORTED_MODULE_2__.Component);
ChromeFields.defaultProps = {
  view: "hex"
};
/* harmony default export */ __webpack_exports__["default"] = (ChromeFields);

/***/ }),

/***/ 2286:
/*!************************************************************************!*\
  !*** ./node_modules/react-color/es/components/chrome/ChromePointer.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChromePointer": function() { return /* binding */ ChromePointer; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var ChromePointer = function ChromePointer() {
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '12px',
        height: '12px',
        borderRadius: '6px',
        transform: 'translate(-6px, -1px)',
        backgroundColor: 'rgb(248, 248, 248)',
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
/* harmony default export */ __webpack_exports__["default"] = (ChromePointer);

/***/ }),

/***/ 2287:
/*!******************************************************************************!*\
  !*** ./node_modules/react-color/es/components/chrome/ChromePointerCircle.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChromePointerCircle": function() { return /* binding */ ChromePointerCircle; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var ChromePointerCircle = function ChromePointerCircle() {
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '12px',
        height: '12px',
        borderRadius: '6px',
        boxShadow: 'inset 0 0 0 1px #fff',
        transform: 'translate(-6px, -6px)'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
/* harmony default export */ __webpack_exports__["default"] = (ChromePointerCircle);

/***/ }),

/***/ 2200:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/circle/Circle.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Circle": function() { return /* binding */ Circle; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es/map */ 2702);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var material_colors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! material-colors */ 2201);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _CircleSwatch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CircleSwatch */ 2283);








var Circle = function Circle(_ref) {
  var width = _ref.width,
      onChange = _ref.onChange,
      onSwatchHover = _ref.onSwatchHover,
      colors = _ref.colors,
      hex = _ref.hex,
      circleSize = _ref.circleSize,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      circleSpacing = _ref.circleSpacing,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__["default"])({
    'default': {
      card: {
        width: width,
        display: 'flex',
        flexWrap: 'wrap',
        marginRight: -circleSpacing,
        marginBottom: -circleSpacing
      }
    }
  }, passedStyles));

  var handleChange = function handleChange(hexCode, e) {
    return onChange({
      hex: hexCode,
      source: 'hex'
    }, e);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.card,
    className: 'circle-picker ' + className
  }, (0,lodash_es_map__WEBPACK_IMPORTED_MODULE_7__["default"])(colors, function (c) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CircleSwatch__WEBPACK_IMPORTED_MODULE_5__["default"], {
      key: c,
      color: c,
      onClick: handleChange,
      onSwatchHover: onSwatchHover,
      active: hex === c.toLowerCase(),
      circleSize: circleSize,
      circleSpacing: circleSpacing
    });
  }));
};
Circle.defaultProps = {
  width: 252,
  circleSize: 28,
  circleSpacing: 14,
  colors: [material_colors__WEBPACK_IMPORTED_MODULE_3__.red[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.pink[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.purple[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepPurple[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.indigo[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.blue[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightBlue[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.cyan[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.teal[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.green[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightGreen[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.lime[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.yellow[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.amber[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.orange[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepOrange[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.brown[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.blueGrey[500]],
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_4__.ColorWrap)(Circle));

/***/ }),

/***/ 2283:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/circle/CircleSwatch.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CircleSwatch": function() { return /* binding */ CircleSwatch; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common */ 1796);



var CircleSwatch = function CircleSwatch(_ref) {
  var color = _ref.color,
      onClick = _ref.onClick,
      onSwatchHover = _ref.onSwatchHover,
      hover = _ref.hover,
      active = _ref.active,
      circleSize = _ref.circleSize,
      circleSpacing = _ref.circleSpacing;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      swatch: {
        width: circleSize,
        height: circleSize,
        marginRight: circleSpacing,
        marginBottom: circleSpacing,
        transform: 'scale(1)',
        transition: '100ms transform ease'
      },
      Swatch: {
        borderRadius: '50%',
        background: 'transparent',
        boxShadow: 'inset 0 0 0 ' + (circleSize / 2 + 1) + 'px ' + color,
        transition: '100ms box-shadow ease'
      }
    },
    'hover': {
      swatch: {
        transform: 'scale(1.2)'
      }
    },
    'active': {
      Swatch: {
        boxShadow: 'inset 0 0 0 3px ' + color
      }
    }
  }, {
    hover: hover,
    active: active
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.Swatch, {
    style: styles.Swatch,
    color: color,
    onClick: onClick,
    onHover: onSwatchHover,
    focusStyle: {
      boxShadow: styles.Swatch.boxShadow + ', 0 0 5px ' + color
    }
  }));
};
CircleSwatch.defaultProps = {
  circleSize: 28,
  circleSpacing: 14
};
/* harmony default export */ __webpack_exports__["default"] = ((0,reactcss__WEBPACK_IMPORTED_MODULE_1__.handleHover)(CircleSwatch));

/***/ }),

/***/ 2193:
/*!****************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/Alpha.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Alpha": function() { return /* binding */ Alpha; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_alpha__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/alpha */ 2276);
/* harmony import */ var _Checkboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Checkboard */ 2114);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}





var Alpha = function (_ref) {
  _inherits(Alpha, _ref);

  function Alpha() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Alpha);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Alpha.__proto__ || Object.getPrototypeOf(Alpha)).call.apply(_ref2, [this].concat(args))), _this), _this.handleChange = function (e) {
      var change = _helpers_alpha__WEBPACK_IMPORTED_MODULE_2__.calculateChange(e, _this.props.hsl, _this.props.direction, _this.props.a, _this.container);
      change && typeof _this.props.onChange === 'function' && _this.props.onChange(change, e);
    }, _this.handleMouseDown = function (e) {
      _this.handleChange(e);

      window.addEventListener('mousemove', _this.handleChange);
      window.addEventListener('mouseup', _this.handleMouseUp);
    }, _this.handleMouseUp = function () {
      _this.unbindEventListeners();
    }, _this.unbindEventListeners = function () {
      window.removeEventListener('mousemove', _this.handleChange);
      window.removeEventListener('mouseup', _this.handleMouseUp);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Alpha, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unbindEventListeners();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var rgb = this.props.rgb;
      var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
        'default': {
          alpha: {
            absolute: '0px 0px 0px 0px',
            borderRadius: this.props.radius
          },
          checkboard: {
            absolute: '0px 0px 0px 0px',
            overflow: 'hidden',
            borderRadius: this.props.radius
          },
          gradient: {
            absolute: '0px 0px 0px 0px',
            background: 'linear-gradient(to right, rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0) 0%,\n           rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 1) 100%)',
            boxShadow: this.props.shadow,
            borderRadius: this.props.radius
          },
          container: {
            position: 'relative',
            height: '100%',
            margin: '0 3px'
          },
          pointer: {
            position: 'absolute',
            left: rgb.a * 100 + '%'
          },
          slider: {
            width: '4px',
            borderRadius: '1px',
            height: '8px',
            boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
            background: '#fff',
            marginTop: '1px',
            transform: 'translateX(-2px)'
          }
        },
        'vertical': {
          gradient: {
            background: 'linear-gradient(to bottom, rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 0) 0%,\n           rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ', 1) 100%)'
          },
          pointer: {
            left: 0,
            top: rgb.a * 100 + '%'
          }
        },
        'overwrite': _extends({}, this.props.style)
      }, {
        vertical: this.props.direction === 'vertical',
        overwrite: true
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.alpha
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.checkboard
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Checkboard__WEBPACK_IMPORTED_MODULE_3__["default"], {
        renderers: this.props.renderers
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.gradient
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.container,
        ref: function ref(container) {
          return _this2.container = container;
        },
        onMouseDown: this.handleMouseDown,
        onTouchMove: this.handleChange,
        onTouchStart: this.handleChange
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.pointer
      }, this.props.pointer ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(this.props.pointer, this.props) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.slider
      }))));
    }
  }]);

  return Alpha;
}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent || react__WEBPACK_IMPORTED_MODULE_0__.Component);
/* harmony default export */ __webpack_exports__["default"] = (Alpha);

/***/ }),

/***/ 2114:
/*!*********************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/Checkboard.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Checkboard": function() { return /* binding */ Checkboard; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_checkboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/checkboard */ 2277);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};




var Checkboard = function Checkboard(_ref) {
  var white = _ref.white,
      grey = _ref.grey,
      size = _ref.size,
      renderers = _ref.renderers,
      borderRadius = _ref.borderRadius,
      boxShadow = _ref.boxShadow,
      children = _ref.children;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      grid: {
        borderRadius: borderRadius,
        boxShadow: boxShadow,
        absolute: '0px 0px 0px 0px',
        background: 'url(' + _helpers_checkboard__WEBPACK_IMPORTED_MODULE_2__.get(white, grey, size, renderers.canvas) + ') center left'
      }
    }
  });
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(children) ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(children, _extends({}, children.props, {
    style: _extends({}, children.props.style, styles.grid)
  })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.grid
  });
};
Checkboard.defaultProps = {
  size: 8,
  white: 'transparent',
  grey: 'rgba(0,0,0,.08)',
  renderers: {}
};
/* harmony default export */ __webpack_exports__["default"] = (Checkboard);

/***/ }),

/***/ 918:
/*!********************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/ColorWrap.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColorWrap": function() { return /* binding */ ColorWrap; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var lodash_es_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es/debounce */ 2687);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/color */ 1797);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}




var ColorWrap = function ColorWrap(Picker) {
  var ColorPicker = function (_ref) {
    _inherits(ColorPicker, _ref);

    function ColorPicker(props) {
      _classCallCheck(this, ColorPicker);

      var _this = _possibleConstructorReturn(this, (ColorPicker.__proto__ || Object.getPrototypeOf(ColorPicker)).call(this));

      _this.handleChange = function (data, event) {
        var isValidColor = _helpers_color__WEBPACK_IMPORTED_MODULE_1__.simpleCheckForValidColor(data);

        if (isValidColor) {
          var colors = _helpers_color__WEBPACK_IMPORTED_MODULE_1__.toState(data, data.h || _this.state.oldHue);

          _this.setState(colors);

          _this.props.onChangeComplete && _this.debounce(_this.props.onChangeComplete, colors, event);
          _this.props.onChange && _this.props.onChange(colors, event);
        }
      };

      _this.handleSwatchHover = function (data, event) {
        var isValidColor = _helpers_color__WEBPACK_IMPORTED_MODULE_1__.simpleCheckForValidColor(data);

        if (isValidColor) {
          var colors = _helpers_color__WEBPACK_IMPORTED_MODULE_1__.toState(data, data.h || _this.state.oldHue);
          _this.props.onSwatchHover && _this.props.onSwatchHover(colors, event);
        }
      };

      _this.state = _extends({}, _helpers_color__WEBPACK_IMPORTED_MODULE_1__.toState(props.color, 0));
      _this.debounce = (0,lodash_es_debounce__WEBPACK_IMPORTED_MODULE_2__["default"])(function (fn, data, event) {
        fn(data, event);
      }, 100);
      return _this;
    }

    _createClass(ColorPicker, [{
      key: 'render',
      value: function render() {
        var optionalEvents = {};

        if (this.props.onSwatchHover) {
          optionalEvents.onSwatchHover = this.handleSwatchHover;
        }

        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Picker, _extends({}, this.props, this.state, {
          onChange: this.handleChange
        }, optionalEvents));
      }
    }], [{
      key: 'getDerivedStateFromProps',
      value: function getDerivedStateFromProps(nextProps, state) {
        return _extends({}, _helpers_color__WEBPACK_IMPORTED_MODULE_1__.toState(nextProps.color, state.oldHue));
      }
    }]);

    return ColorPicker;
  }(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent || react__WEBPACK_IMPORTED_MODULE_0__.Component);

  ColorPicker.defaultProps = _extends({}, Picker.defaultProps, {
    color: {
      h: 250,
      s: 0.50,
      l: 0.20,
      a: 1
    }
  });
  return ColorPicker;
};
/* harmony default export */ __webpack_exports__["default"] = (ColorWrap);

/***/ }),

/***/ 2194:
/*!************************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/EditableInput.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditableInput": function() { return /* binding */ EditableInput; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);


var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}



var DEFAULT_ARROW_OFFSET = 1;
var UP_KEY_CODE = 38;
var DOWN_KEY_CODE = 40;
var VALID_KEY_CODES = [UP_KEY_CODE, DOWN_KEY_CODE];

var isValidKeyCode = function isValidKeyCode(keyCode) {
  return VALID_KEY_CODES.indexOf(keyCode) > -1;
};

var getNumberValue = function getNumberValue(value) {
  return Number(String(value).replace(/%/g, ''));
};

var idCounter = 1;
var EditableInput = function (_ref) {
  _inherits(EditableInput, _ref);

  function EditableInput(props) {
    _classCallCheck(this, EditableInput);

    var _this = _possibleConstructorReturn(this, (EditableInput.__proto__ || Object.getPrototypeOf(EditableInput)).call(this));

    _this.handleBlur = function () {
      if (_this.state.blurValue) {
        _this.setState({
          value: _this.state.blurValue,
          blurValue: null
        });
      }
    };

    _this.handleChange = function (e) {
      _this.setUpdatedValue(e.target.value, e);
    };

    _this.handleKeyDown = function (e) {
      // In case `e.target.value` is a percentage remove the `%` character
      // and update accordingly with a percentage
      // https://github.com/casesandberg/react-color/issues/383
      var value = getNumberValue(e.target.value);

      if (!isNaN(value) && isValidKeyCode(e.keyCode)) {
        var offset = _this.getArrowOffset();

        var updatedValue = e.keyCode === UP_KEY_CODE ? value + offset : value - offset;

        _this.setUpdatedValue(updatedValue, e);
      }
    };

    _this.handleDrag = function (e) {
      if (_this.props.dragLabel) {
        var newValue = Math.round(_this.props.value + e.movementX);

        if (newValue >= 0 && newValue <= _this.props.dragMax) {
          _this.props.onChange && _this.props.onChange(_this.getValueObjectWithLabel(newValue), e);
        }
      }
    };

    _this.handleMouseDown = function (e) {
      if (_this.props.dragLabel) {
        e.preventDefault();

        _this.handleDrag(e);

        window.addEventListener('mousemove', _this.handleDrag);
        window.addEventListener('mouseup', _this.handleMouseUp);
      }
    };

    _this.handleMouseUp = function () {
      _this.unbindEventListeners();
    };

    _this.unbindEventListeners = function () {
      window.removeEventListener('mousemove', _this.handleDrag);
      window.removeEventListener('mouseup', _this.handleMouseUp);
    };

    _this.state = {
      value: String(props.value).toUpperCase(),
      blurValue: String(props.value).toUpperCase()
    };
    _this.inputId = 'rc-editable-input-' + idCounter++;
    return _this;
  }

  _createClass(EditableInput, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.value !== this.state.value && (prevProps.value !== this.props.value || prevState.value !== this.state.value)) {
        if (this.input === document.activeElement) {
          this.setState({
            blurValue: String(this.props.value).toUpperCase()
          });
        } else {
          this.setState({
            value: String(this.props.value).toUpperCase(),
            blurValue: !this.state.blurValue && String(this.props.value).toUpperCase()
          });
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unbindEventListeners();
    }
  }, {
    key: 'getValueObjectWithLabel',
    value: function getValueObjectWithLabel(value) {
      return _defineProperty({}, this.props.label, value);
    }
  }, {
    key: 'getArrowOffset',
    value: function getArrowOffset() {
      return this.props.arrowOffset || DEFAULT_ARROW_OFFSET;
    }
  }, {
    key: 'setUpdatedValue',
    value: function setUpdatedValue(value, e) {
      var onChangeValue = this.props.label ? this.getValueObjectWithLabel(value) : value;
      this.props.onChange && this.props.onChange(onChangeValue, e);
      this.setState({
        value: value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])({
        'default': {
          wrap: {
            position: 'relative'
          }
        },
        'user-override': {
          wrap: this.props.style && this.props.style.wrap ? this.props.style.wrap : {},
          input: this.props.style && this.props.style.input ? this.props.style.input : {},
          label: this.props.style && this.props.style.label ? this.props.style.label : {}
        },
        'dragLabel-true': {
          label: {
            cursor: 'ew-resize'
          }
        }
      }, {
        'user-override': true
      }, this.props);
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
        style: styles.wrap
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('input', {
        id: this.inputId,
        style: styles.input,
        ref: function ref(input) {
          return _this2.input = input;
        },
        value: this.state.value,
        onKeyDown: this.handleKeyDown,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        placeholder: this.props.placeholder,
        spellCheck: 'false'
      }), this.props.label && !this.props.hideLabel ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('label', {
        htmlFor: this.inputId,
        style: styles.label,
        onMouseDown: this.handleMouseDown
      }, this.props.label) : null);
    }
  }]);

  return EditableInput;
}(react__WEBPACK_IMPORTED_MODULE_1__.PureComponent || react__WEBPACK_IMPORTED_MODULE_1__.Component);
/* harmony default export */ __webpack_exports__["default"] = (EditableInput);

/***/ }),

/***/ 2195:
/*!**************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/Hue.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hue": function() { return /* binding */ Hue; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_hue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/hue */ 2278);
var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}




var Hue = function (_ref) {
  _inherits(Hue, _ref);

  function Hue() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Hue);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Hue.__proto__ || Object.getPrototypeOf(Hue)).call.apply(_ref2, [this].concat(args))), _this), _this.handleChange = function (e) {
      var change = _helpers_hue__WEBPACK_IMPORTED_MODULE_2__.calculateChange(e, _this.props.direction, _this.props.hsl, _this.container);
      change && typeof _this.props.onChange === 'function' && _this.props.onChange(change, e);
    }, _this.handleMouseDown = function (e) {
      _this.handleChange(e);

      window.addEventListener('mousemove', _this.handleChange);
      window.addEventListener('mouseup', _this.handleMouseUp);
    }, _this.handleMouseUp = function () {
      _this.unbindEventListeners();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Hue, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unbindEventListeners();
    }
  }, {
    key: 'unbindEventListeners',
    value: function unbindEventListeners() {
      window.removeEventListener('mousemove', this.handleChange);
      window.removeEventListener('mouseup', this.handleMouseUp);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props$direction = this.props.direction,
          direction = _props$direction === undefined ? 'horizontal' : _props$direction;
      var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
        'default': {
          hue: {
            absolute: '0px 0px 0px 0px',
            borderRadius: this.props.radius,
            boxShadow: this.props.shadow
          },
          container: {
            padding: '0 2px',
            position: 'relative',
            height: '100%',
            borderRadius: this.props.radius
          },
          pointer: {
            position: 'absolute',
            left: this.props.hsl.h * 100 / 360 + '%'
          },
          slider: {
            marginTop: '1px',
            width: '4px',
            borderRadius: '1px',
            height: '8px',
            boxShadow: '0 0 2px rgba(0, 0, 0, .6)',
            background: '#fff',
            transform: 'translateX(-2px)'
          }
        },
        'vertical': {
          pointer: {
            left: '0px',
            top: -(this.props.hsl.h * 100 / 360) + 100 + '%'
          }
        }
      }, {
        vertical: direction === 'vertical'
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.hue
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        className: 'hue-' + direction,
        style: styles.container,
        ref: function ref(container) {
          return _this2.container = container;
        },
        onMouseDown: this.handleMouseDown,
        onTouchMove: this.handleChange,
        onTouchStart: this.handleChange
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('style', null, '\n            .hue-horizontal {\n              background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0\n                33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n              background: -webkit-linear-gradient(to right, #f00 0%, #ff0\n                17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n            }\n\n            .hue-vertical {\n              background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,\n                #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n              background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%,\n                #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n            }\n          '), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.pointer
      }, this.props.pointer ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(this.props.pointer, this.props) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.slider
      }))));
    }
  }]);

  return Hue;
}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent || react__WEBPACK_IMPORTED_MODULE_0__.Component);
/* harmony default export */ __webpack_exports__["default"] = (Hue);

/***/ }),

/***/ 2196:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/Raised.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Raised": function() { return /* binding */ Raised; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es/merge */ 2590);




var Raised = function Raised(_ref) {
  var zDepth = _ref.zDepth,
      radius = _ref.radius,
      background = _ref.background,
      children = _ref.children,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_3__["default"])({
    'default': {
      wrap: {
        position: 'relative',
        display: 'inline-block'
      },
      content: {
        position: 'relative'
      },
      bg: {
        absolute: '0px 0px 0px 0px',
        boxShadow: '0 ' + zDepth + 'px ' + zDepth * 4 + 'px rgba(0,0,0,.24)',
        borderRadius: radius,
        background: background
      }
    },
    'zDepth-0': {
      bg: {
        boxShadow: 'none'
      }
    },
    'zDepth-1': {
      bg: {
        boxShadow: '0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16)'
      }
    },
    'zDepth-2': {
      bg: {
        boxShadow: '0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2)'
      }
    },
    'zDepth-3': {
      bg: {
        boxShadow: '0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24)'
      }
    },
    'zDepth-4': {
      bg: {
        boxShadow: '0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22)'
      }
    },
    'zDepth-5': {
      bg: {
        boxShadow: '0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2)'
      }
    },
    'square': {
      bg: {
        borderRadius: '0'
      }
    },
    'circle': {
      bg: {
        borderRadius: '50%'
      }
    }
  }, passedStyles), {
    'zDepth-1': zDepth === 1
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.wrap
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.bg
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.content
  }, children));
};
Raised.defaultProps = {
  background: '#fff',
  zDepth: 1,
  radius: 2,
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = (Raised);

/***/ }),

/***/ 2197:
/*!*********************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/Saturation.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Saturation": function() { return /* binding */ Saturation; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_throttle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es/throttle */ 2686);
/* harmony import */ var _helpers_saturation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/saturation */ 2279);
var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}





var Saturation = function (_ref) {
  _inherits(Saturation, _ref);

  function Saturation(props) {
    _classCallCheck(this, Saturation);

    var _this = _possibleConstructorReturn(this, (Saturation.__proto__ || Object.getPrototypeOf(Saturation)).call(this, props));

    _this.handleChange = function (e) {
      typeof _this.props.onChange === 'function' && _this.throttle(_this.props.onChange, _helpers_saturation__WEBPACK_IMPORTED_MODULE_2__.calculateChange(e, _this.props.hsl, _this.container), e);
    };

    _this.handleMouseDown = function (e) {
      _this.handleChange(e);

      var renderWindow = _this.getContainerRenderWindow();

      renderWindow.addEventListener('mousemove', _this.handleChange);
      renderWindow.addEventListener('mouseup', _this.handleMouseUp);
    };

    _this.handleMouseUp = function () {
      _this.unbindEventListeners();
    };

    _this.throttle = (0,lodash_es_throttle__WEBPACK_IMPORTED_MODULE_3__["default"])(function (fn, data, e) {
      fn(data, e);
    }, 50);
    return _this;
  }

  _createClass(Saturation, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.throttle.cancel();
      this.unbindEventListeners();
    }
  }, {
    key: 'getContainerRenderWindow',
    value: function getContainerRenderWindow() {
      var container = this.container;
      var renderWindow = window;

      while (!renderWindow.document.contains(container) && renderWindow.parent !== renderWindow) {
        renderWindow = renderWindow.parent;
      }

      return renderWindow;
    }
  }, {
    key: 'unbindEventListeners',
    value: function unbindEventListeners() {
      var renderWindow = this.getContainerRenderWindow();
      renderWindow.removeEventListener('mousemove', this.handleChange);
      renderWindow.removeEventListener('mouseup', this.handleMouseUp);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _ref2 = this.props.style || {},
          color = _ref2.color,
          white = _ref2.white,
          black = _ref2.black,
          pointer = _ref2.pointer,
          circle = _ref2.circle;

      var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
        'default': {
          color: {
            absolute: '0px 0px 0px 0px',
            background: 'hsl(' + this.props.hsl.h + ',100%, 50%)',
            borderRadius: this.props.radius
          },
          white: {
            absolute: '0px 0px 0px 0px',
            borderRadius: this.props.radius
          },
          black: {
            absolute: '0px 0px 0px 0px',
            boxShadow: this.props.shadow,
            borderRadius: this.props.radius
          },
          pointer: {
            position: 'absolute',
            top: -(this.props.hsv.v * 100) + 100 + '%',
            left: this.props.hsv.s * 100 + '%',
            cursor: 'default'
          },
          circle: {
            width: '4px',
            height: '4px',
            boxShadow: '0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),\n            0 0 1px 2px rgba(0,0,0,.4)',
            borderRadius: '50%',
            cursor: 'hand',
            transform: 'translate(-2px, -2px)'
          }
        },
        'custom': {
          color: color,
          white: white,
          black: black,
          pointer: pointer,
          circle: circle
        }
      }, {
        'custom': !!this.props.style
      });
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.color,
        ref: function ref(container) {
          return _this2.container = container;
        },
        onMouseDown: this.handleMouseDown,
        onTouchMove: this.handleChange,
        onTouchStart: this.handleChange
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('style', null, '\n          .saturation-white {\n            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));\n            background: linear-gradient(to right, #fff, rgba(255,255,255,0));\n          }\n          .saturation-black {\n            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));\n            background: linear-gradient(to top, #000, rgba(0,0,0,0));\n          }\n        '), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.white,
        className: 'saturation-white'
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.black,
        className: 'saturation-black'
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.pointer
      }, this.props.pointer ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(this.props.pointer, this.props) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.circle
      }))));
    }
  }]);

  return Saturation;
}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent || react__WEBPACK_IMPORTED_MODULE_0__.Component);
/* harmony default export */ __webpack_exports__["default"] = (Saturation);

/***/ }),

/***/ 2198:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/Swatch.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Swatch": function() { return /* binding */ Swatch; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_interaction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/interaction */ 2280);
/* harmony import */ var _Checkboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Checkboard */ 2114);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};





var ENTER = 13;
var Swatch = function Swatch(_ref) {
  var color = _ref.color,
      style = _ref.style,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === undefined ? function () {} : _ref$onClick,
      onHover = _ref.onHover,
      _ref$title = _ref.title,
      title = _ref$title === undefined ? color : _ref$title,
      children = _ref.children,
      focus = _ref.focus,
      _ref$focusStyle = _ref.focusStyle,
      focusStyle = _ref$focusStyle === undefined ? {} : _ref$focusStyle;
  var transparent = color === 'transparent';
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    default: {
      swatch: _extends({
        background: color,
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        outline: 'none'
      }, style, focus ? focusStyle : {})
    }
  });

  var handleClick = function handleClick(e) {
    return onClick(color, e);
  };

  var handleKeyDown = function handleKeyDown(e) {
    return e.keyCode === ENTER && onClick(color, e);
  };

  var handleHover = function handleHover(e) {
    return onHover(color, e);
  };

  var optionalEvents = {};

  if (onHover) {
    optionalEvents.onMouseOver = handleHover;
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', _extends({
    style: styles.swatch,
    onClick: handleClick,
    title: title,
    tabIndex: 0,
    onKeyDown: handleKeyDown
  }, optionalEvents), children, transparent && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Checkboard__WEBPACK_IMPORTED_MODULE_3__["default"], {
    borderRadius: styles.swatch.borderRadius,
    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'
  }));
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_helpers_interaction__WEBPACK_IMPORTED_MODULE_2__.handleFocus)(Swatch));

/***/ }),

/***/ 1796:
/*!****************************************************************!*\
  !*** ./node_modules/react-color/es/components/common/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Alpha": function() { return /* reexport safe */ _Alpha__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "Checkboard": function() { return /* reexport safe */ _Checkboard__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   "ColorWrap": function() { return /* reexport safe */ _ColorWrap__WEBPACK_IMPORTED_MODULE_6__["default"]; },
/* harmony export */   "EditableInput": function() { return /* reexport safe */ _EditableInput__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   "Hue": function() { return /* reexport safe */ _Hue__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "Raised": function() { return /* reexport safe */ _Raised__WEBPACK_IMPORTED_MODULE_4__["default"]; },
/* harmony export */   "Saturation": function() { return /* reexport safe */ _Saturation__WEBPACK_IMPORTED_MODULE_5__["default"]; },
/* harmony export */   "Swatch": function() { return /* reexport safe */ _Swatch__WEBPACK_IMPORTED_MODULE_7__["default"]; }
/* harmony export */ });
/* harmony import */ var _Alpha__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Alpha */ 2193);
/* harmony import */ var _Checkboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Checkboard */ 2114);
/* harmony import */ var _EditableInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EditableInput */ 2194);
/* harmony import */ var _Hue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Hue */ 2195);
/* harmony import */ var _Raised__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Raised */ 2196);
/* harmony import */ var _Saturation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Saturation */ 2197);
/* harmony import */ var _ColorWrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ColorWrap */ 918);
/* harmony import */ var _Swatch__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Swatch */ 2198);









/***/ }),

/***/ 2202:
/*!*******************************************************************!*\
  !*** ./node_modules/react-color/es/components/compact/Compact.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Compact": function() { return /* binding */ Compact; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_map__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lodash-es/map */ 2702);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _CompactColor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CompactColor */ 2288);
/* harmony import */ var _CompactFields__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CompactFields */ 2289);









var Compact = function Compact(_ref) {
  var onChange = _ref.onChange,
      onSwatchHover = _ref.onSwatchHover,
      colors = _ref.colors,
      hex = _ref.hex,
      rgb = _ref.rgb,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_7__["default"])({
    'default': {
      Compact: {
        background: '#f6f6f6',
        radius: '4px'
      },
      compact: {
        paddingTop: '5px',
        paddingLeft: '5px',
        boxSizing: 'initial',
        width: '240px'
      },
      clear: {
        clear: 'both'
      }
    }
  }, passedStyles));

  var handleChange = function handleChange(data, e) {
    if (data.hex) {
      _helpers_color__WEBPACK_IMPORTED_MODULE_3__.isValidHex(data.hex) && onChange({
        hex: data.hex,
        source: 'hex'
      }, e);
    } else {
      onChange(data, e);
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.Raised, {
    style: styles.Compact,
    styles: passedStyles
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.compact,
    className: 'compact-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', null, (0,lodash_es_map__WEBPACK_IMPORTED_MODULE_8__["default"])(colors, function (c) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CompactColor__WEBPACK_IMPORTED_MODULE_5__["default"], {
      key: c,
      color: c,
      active: c.toLowerCase() === hex,
      onClick: handleChange,
      onSwatchHover: onSwatchHover
    });
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.clear
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CompactFields__WEBPACK_IMPORTED_MODULE_6__["default"], {
    hex: hex,
    rgb: rgb,
    onChange: handleChange
  })));
};
Compact.defaultProps = {
  colors: ['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FB9E00', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', '#AB149E'],
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_4__.ColorWrap)(Compact));

/***/ }),

/***/ 2288:
/*!************************************************************************!*\
  !*** ./node_modules/react-color/es/components/compact/CompactColor.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CompactColor": function() { return /* binding */ CompactColor; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);




var CompactColor = function CompactColor(_ref) {
  var color = _ref.color,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === undefined ? function () {} : _ref$onClick,
      onSwatchHover = _ref.onSwatchHover,
      active = _ref.active;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      color: {
        background: color,
        width: '15px',
        height: '15px',
        float: 'left',
        marginRight: '5px',
        marginBottom: '5px',
        position: 'relative',
        cursor: 'pointer'
      },
      dot: {
        absolute: '5px 5px 5px 5px',
        background: _helpers_color__WEBPACK_IMPORTED_MODULE_2__.getContrastingColor(color),
        borderRadius: '50%',
        opacity: '0'
      }
    },
    'active': {
      dot: {
        opacity: '1'
      }
    },
    'color-#FFFFFF': {
      color: {
        boxShadow: 'inset 0 0 0 1px #ddd'
      },
      dot: {
        background: '#000'
      }
    },
    'transparent': {
      dot: {
        background: '#000'
      }
    }
  }, {
    active: active,
    'color-#FFFFFF': color === '#FFFFFF',
    'transparent': color === 'transparent'
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Swatch, {
    style: styles.color,
    color: color,
    onClick: onClick,
    onHover: onSwatchHover,
    focusStyle: {
      boxShadow: '0 0 4px ' + color
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.dot
  }));
};
/* harmony default export */ __webpack_exports__["default"] = (CompactColor);

/***/ }),

/***/ 2289:
/*!*************************************************************************!*\
  !*** ./node_modules/react-color/es/components/compact/CompactFields.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CompactFields": function() { return /* binding */ CompactFields; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common */ 1796);



var CompactFields = function CompactFields(_ref) {
  var hex = _ref.hex,
      rgb = _ref.rgb,
      onChange = _ref.onChange;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      fields: {
        display: 'flex',
        paddingBottom: '6px',
        paddingRight: '5px',
        position: 'relative'
      },
      active: {
        position: 'absolute',
        top: '6px',
        left: '5px',
        height: '9px',
        width: '9px',
        background: hex
      },
      HEXwrap: {
        flex: '6',
        position: 'relative'
      },
      HEXinput: {
        width: '80%',
        padding: '0px',
        paddingLeft: '20%',
        border: 'none',
        outline: 'none',
        background: 'none',
        fontSize: '12px',
        color: '#333',
        height: '16px'
      },
      HEXlabel: {
        display: 'none'
      },
      RGBwrap: {
        flex: '3',
        position: 'relative'
      },
      RGBinput: {
        width: '70%',
        padding: '0px',
        paddingLeft: '30%',
        border: 'none',
        outline: 'none',
        background: 'none',
        fontSize: '12px',
        color: '#333',
        height: '16px'
      },
      RGBlabel: {
        position: 'absolute',
        top: '3px',
        left: '0px',
        lineHeight: '16px',
        textTransform: 'uppercase',
        fontSize: '12px',
        color: '#999'
      }
    }
  });

  var handleChange = function handleChange(data, e) {
    if (data.r || data.g || data.b) {
      onChange({
        r: data.r || rgb.r,
        g: data.g || rgb.g,
        b: data.b || rgb.b,
        source: 'rgb'
      }, e);
    } else {
      onChange({
        hex: data.hex,
        source: 'hex'
      }, e);
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.fields,
    className: 'flexbox-fix'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.active
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.EditableInput, {
    style: {
      wrap: styles.HEXwrap,
      input: styles.HEXinput,
      label: styles.HEXlabel
    },
    label: 'hex',
    value: hex,
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'r',
    value: rgb.r,
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'g',
    value: rgb.g,
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'b',
    value: rgb.b,
    onChange: handleChange
  }));
};
/* harmony default export */ __webpack_exports__["default"] = (CompactFields);

/***/ }),

/***/ 2203:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/github/Github.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Github": function() { return /* binding */ Github; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_map__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/map */ 2702);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _GithubSwatch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GithubSwatch */ 2290);







var Github = function Github(_ref) {
  var width = _ref.width,
      colors = _ref.colors,
      onChange = _ref.onChange,
      onSwatchHover = _ref.onSwatchHover,
      triangle = _ref.triangle,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_5__["default"])({
    'default': {
      card: {
        width: width,
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
        borderRadius: '4px',
        position: 'relative',
        padding: '5px',
        display: 'flex',
        flexWrap: 'wrap'
      },
      triangle: {
        position: 'absolute',
        border: '7px solid transparent',
        borderBottomColor: '#fff'
      },
      triangleShadow: {
        position: 'absolute',
        border: '8px solid transparent',
        borderBottomColor: 'rgba(0,0,0,0.15)'
      }
    },
    'hide-triangle': {
      triangle: {
        display: 'none'
      },
      triangleShadow: {
        display: 'none'
      }
    },
    'top-left-triangle': {
      triangle: {
        top: '-14px',
        left: '10px'
      },
      triangleShadow: {
        top: '-16px',
        left: '9px'
      }
    },
    'top-right-triangle': {
      triangle: {
        top: '-14px',
        right: '10px'
      },
      triangleShadow: {
        top: '-16px',
        right: '9px'
      }
    },
    'bottom-left-triangle': {
      triangle: {
        top: '35px',
        left: '10px',
        transform: 'rotate(180deg)'
      },
      triangleShadow: {
        top: '37px',
        left: '9px',
        transform: 'rotate(180deg)'
      }
    },
    'bottom-right-triangle': {
      triangle: {
        top: '35px',
        right: '10px',
        transform: 'rotate(180deg)'
      },
      triangleShadow: {
        top: '37px',
        right: '9px',
        transform: 'rotate(180deg)'
      }
    }
  }, passedStyles), {
    'hide-triangle': triangle === 'hide',
    'top-left-triangle': triangle === 'top-left',
    'top-right-triangle': triangle === 'top-right',
    'bottom-left-triangle': triangle === 'bottom-left',
    'bottom-right-triangle': triangle === 'bottom-right'
  });

  var handleChange = function handleChange(hex, e) {
    return onChange({
      hex: hex,
      source: 'hex'
    }, e);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.card,
    className: 'github-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.triangleShadow
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.triangle
  }), (0,lodash_es_map__WEBPACK_IMPORTED_MODULE_6__["default"])(colors, function (c) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GithubSwatch__WEBPACK_IMPORTED_MODULE_4__["default"], {
      color: c,
      key: c,
      onClick: handleChange,
      onSwatchHover: onSwatchHover
    });
  }));
};
Github.defaultProps = {
  width: 200,
  colors: ['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB'],
  triangle: 'top-left',
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(Github));

/***/ }),

/***/ 2290:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/github/GithubSwatch.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GithubSwatch": function() { return /* binding */ GithubSwatch; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common */ 1796);



var GithubSwatch = function GithubSwatch(_ref) {
  var hover = _ref.hover,
      color = _ref.color,
      onClick = _ref.onClick,
      onSwatchHover = _ref.onSwatchHover;
  var hoverSwatch = {
    position: 'relative',
    zIndex: '2',
    outline: '2px solid #fff',
    boxShadow: '0 0 5px 2px rgba(0,0,0,0.25)'
  };
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      swatch: {
        width: '25px',
        height: '25px',
        fontSize: '0'
      }
    },
    'hover': {
      swatch: hoverSwatch
    }
  }, {
    hover: hover
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_2__.Swatch, {
    color: color,
    onClick: onClick,
    onHover: onSwatchHover,
    focusStyle: hoverSwatch
  }));
};
/* harmony default export */ __webpack_exports__["default"] = ((0,reactcss__WEBPACK_IMPORTED_MODULE_1__.handleHover)(GithubSwatch));

/***/ }),

/***/ 2207:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/google/Google.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Google": function() { return /* binding */ Google; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _GooglePointerCircle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GooglePointerCircle */ 2305);
/* harmony import */ var _GooglePointer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./GooglePointer */ 2306);
/* harmony import */ var _GoogleFields__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./GoogleFields */ 2307);








var Google = function Google(_ref) {
  var width = _ref.width,
      onChange = _ref.onChange,
      rgb = _ref.rgb,
      hsl = _ref.hsl,
      hsv = _ref.hsv,
      hex = _ref.hex,
      header = _ref.header,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_7__["default"])({
    'default': {
      picker: {
        width: width,
        background: '#fff',
        border: '1px solid #dfe1e5',
        boxSizing: 'initial',
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: '8px 8px 0px 0px'
      },
      head: {
        height: '57px',
        width: '100%',
        paddingTop: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        fontSize: '20px',
        boxSizing: 'border-box',
        fontFamily: 'Roboto-Regular,HelveticaNeue,Arial,sans-serif'
      },
      saturation: {
        width: '70%',
        padding: '0px',
        position: 'relative',
        overflow: 'hidden'
      },
      swatch: {
        width: '30%',
        height: '228px',
        padding: '0px',
        background: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)',
        position: 'relative',
        overflow: 'hidden'
      },
      body: {
        margin: 'auto',
        width: '95%'
      },
      controls: {
        display: 'flex',
        boxSizing: 'border-box',
        height: '52px',
        paddingTop: '22px'
      },
      color: {
        width: '32px'
      },
      hue: {
        height: '8px',
        position: 'relative',
        margin: '0px 16px 0px 16px',
        width: '100%'
      },
      Hue: {
        radius: '2px'
      }
    }
  }, passedStyles));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker,
    className: 'google-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.head
  }, header), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.saturation
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Saturation, {
    hsl: hsl,
    hsv: hsv,
    pointer: _GooglePointerCircle__WEBPACK_IMPORTED_MODULE_4__["default"],
    onChange: onChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.body
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.controls,
    className: 'flexbox-fix'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.hue
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Hue, {
    style: styles.Hue,
    hsl: hsl,
    radius: '4px',
    pointer: _GooglePointer__WEBPACK_IMPORTED_MODULE_5__["default"],
    onChange: onChange
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_GoogleFields__WEBPACK_IMPORTED_MODULE_6__["default"], {
    rgb: rgb,
    hsl: hsl,
    hex: hex,
    hsv: hsv,
    onChange: onChange
  })));
};
Google.defaultProps = {
  width: 652,
  styles: {},
  header: 'Color picker'
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(Google));

/***/ }),

/***/ 2307:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/google/GoogleFields.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GoogleFields": function() { return /* binding */ GoogleFields; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ 1796);





var GoogleFields = function GoogleFields(_ref) {
  var onChange = _ref.onChange,
      rgb = _ref.rgb,
      hsl = _ref.hsl,
      hex = _ref.hex,
      hsv = _ref.hsv;

  var handleChange = function handleChange(data, e) {
    if (data.hex) {
      _helpers_color__WEBPACK_IMPORTED_MODULE_3__.isValidHex(data.hex) && onChange({
        hex: data.hex,
        source: 'hex'
      }, e);
    } else if (data.rgb) {
      var values = data.rgb.split(',');
      _helpers_color__WEBPACK_IMPORTED_MODULE_3__.isvalidColorString(data.rgb, 'rgb') && onChange({
        r: values[0],
        g: values[1],
        b: values[2],
        a: 1,
        source: 'rgb'
      }, e);
    } else if (data.hsv) {
      var _values = data.hsv.split(',');

      if (_helpers_color__WEBPACK_IMPORTED_MODULE_3__.isvalidColorString(data.hsv, 'hsv')) {
        _values[2] = _values[2].replace('%', '');
        _values[1] = _values[1].replace('%', '');
        _values[0] = _values[0].replace('°', '');

        if (_values[1] == 1) {
          _values[1] = 0.01;
        } else if (_values[2] == 1) {
          _values[2] = 0.01;
        }

        onChange({
          h: Number(_values[0]),
          s: Number(_values[1]),
          v: Number(_values[2]),
          source: 'hsv'
        }, e);
      }
    } else if (data.hsl) {
      var _values2 = data.hsl.split(',');

      if (_helpers_color__WEBPACK_IMPORTED_MODULE_3__.isvalidColorString(data.hsl, 'hsl')) {
        _values2[2] = _values2[2].replace('%', '');
        _values2[1] = _values2[1].replace('%', '');
        _values2[0] = _values2[0].replace('°', '');

        if (hsvValue[1] == 1) {
          hsvValue[1] = 0.01;
        } else if (hsvValue[2] == 1) {
          hsvValue[2] = 0.01;
        }

        onChange({
          h: Number(_values2[0]),
          s: Number(_values2[1]),
          v: Number(_values2[2]),
          source: 'hsl'
        }, e);
      }
    }
  };

  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])({
    'default': {
      wrap: {
        display: 'flex',
        height: '100px',
        marginTop: '4px'
      },
      fields: {
        width: '100%'
      },
      column: {
        paddingTop: '10px',
        display: 'flex',
        justifyContent: 'space-between'
      },
      double: {
        padding: '0px 4.4px',
        boxSizing: 'border-box'
      },
      input: {
        width: '100%',
        height: '38px',
        boxSizing: 'border-box',
        padding: '4px 10% 3px',
        textAlign: 'center',
        border: '1px solid #dadce0',
        fontSize: '11px',
        textTransform: 'lowercase',
        borderRadius: '5px',
        outline: 'none',
        fontFamily: 'Roboto,Arial,sans-serif'
      },
      input2: {
        height: '38px',
        width: '100%',
        border: '1px solid #dadce0',
        boxSizing: 'border-box',
        fontSize: '11px',
        textTransform: 'lowercase',
        borderRadius: '5px',
        outline: 'none',
        paddingLeft: '10px',
        fontFamily: 'Roboto,Arial,sans-serif'
      },
      label: {
        textAlign: 'center',
        fontSize: '12px',
        background: '#fff',
        position: 'absolute',
        textTransform: 'uppercase',
        color: '#3c4043',
        width: '35px',
        top: '-6px',
        left: '0',
        right: '0',
        marginLeft: 'auto',
        marginRight: 'auto',
        fontFamily: 'Roboto,Arial,sans-serif'
      },
      label2: {
        left: '10px',
        textAlign: 'center',
        fontSize: '12px',
        background: '#fff',
        position: 'absolute',
        textTransform: 'uppercase',
        color: '#3c4043',
        width: '32px',
        top: '-6px',
        fontFamily: 'Roboto,Arial,sans-serif'
      },
      single: {
        flexGrow: '1',
        margin: '0px 4.4px'
      }
    }
  });
  var rgbValue = rgb.r + ', ' + rgb.g + ', ' + rgb.b;
  var hslValue = Math.round(hsl.h) + '\xB0, ' + Math.round(hsl.s * 100) + '%, ' + Math.round(hsl.l * 100) + '%';
  var hsvValue = Math.round(hsv.h) + '\xB0, ' + Math.round(hsv.s * 100) + '%, ' + Math.round(hsv.v * 100) + '%';
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.wrap,
    className: 'flexbox-fix'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.fields
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.double
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input,
      label: styles.label
    },
    label: 'hex',
    value: hex,
    onChange: handleChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.column
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.single
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input2,
      label: styles.label2
    },
    label: 'rgb',
    value: rgbValue,
    onChange: handleChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.single
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input2,
      label: styles.label2
    },
    label: 'hsv',
    value: hsvValue,
    onChange: handleChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.single
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input2,
      label: styles.label2
    },
    label: 'hsl',
    value: hslValue,
    onChange: handleChange
  })))));
};
/* harmony default export */ __webpack_exports__["default"] = (GoogleFields);

/***/ }),

/***/ 2306:
/*!************************************************************************!*\
  !*** ./node_modules/react-color/es/components/google/GooglePointer.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GooglePointer": function() { return /* binding */ GooglePointer; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);



var GooglePointer = function GooglePointer(props) {
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '20px',
        height: '20px',
        borderRadius: '22px',
        transform: 'translate(-10px, -7px)',
        background: 'hsl(' + Math.round(props.hsl.h) + ', 100%, 50%)',
        border: '2px white solid'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
GooglePointer.defaultProps = {
  hsl: {
    a: 1,
    h: 249.94,
    l: 0.2,
    s: 0.50
  }
};
/* harmony default export */ __webpack_exports__["default"] = (GooglePointer);

/***/ }),

/***/ 2305:
/*!******************************************************************************!*\
  !*** ./node_modules/react-color/es/components/google/GooglePointerCircle.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GooglePointerCircle": function() { return /* binding */ GooglePointerCircle; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);



var GooglePointerCircle = function GooglePointerCircle(props) {
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '20px',
        height: '20px',
        borderRadius: '22px',
        border: '2px #fff solid',
        transform: 'translate(-12px, -13px)',
        background: 'hsl(' + Math.round(props.hsl.h) + ', ' + Math.round(props.hsl.s * 100) + '%, ' + Math.round(props.hsl.l * 100) + '%)'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
GooglePointerCircle.defaultProps = {
  hsl: {
    a: 1,
    h: 249.94,
    l: 0.2,
    s: 0.50
  }
};
/* harmony default export */ __webpack_exports__["default"] = (GooglePointerCircle);

/***/ }),

/***/ 1395:
/*!***********************************************************!*\
  !*** ./node_modules/react-color/es/components/hue/Hue.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HuePicker": function() { return /* binding */ HuePicker; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _HuePointer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./HuePointer */ 2291);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};







var HuePicker = function HuePicker(_ref) {
  var width = _ref.width,
      height = _ref.height,
      onChange = _ref.onChange,
      hsl = _ref.hsl,
      direction = _ref.direction,
      pointer = _ref.pointer,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_5__["default"])({
    'default': {
      picker: {
        position: 'relative',
        width: width,
        height: height
      },
      hue: {
        radius: '2px'
      }
    }
  }, passedStyles)); // Overwrite to provide pure hue color

  var handleChange = function handleChange(data) {
    return onChange({
      a: 1,
      h: data.h,
      l: 0.5,
      s: 1
    });
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker,
    className: 'hue-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Hue, _extends({}, styles.hue, {
    hsl: hsl,
    pointer: pointer,
    onChange: handleChange,
    direction: direction
  })));
};
HuePicker.defaultProps = {
  width: '316px',
  height: '16px',
  direction: 'horizontal',
  pointer: _HuePointer__WEBPACK_IMPORTED_MODULE_4__["default"],
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(HuePicker));

/***/ }),

/***/ 2291:
/*!******************************************************************!*\
  !*** ./node_modules/react-color/es/components/hue/HuePointer.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SliderPointer": function() { return /* binding */ SliderPointer; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var SliderPointer = function SliderPointer(_ref) {
  var direction = _ref.direction;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        transform: 'translate(-9px, -1px)',
        backgroundColor: 'rgb(248, 248, 248)',
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)'
      }
    },
    'vertical': {
      picker: {
        transform: 'translate(-3px, -9px)'
      }
    }
  }, {
    vertical: direction === 'vertical'
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
/* harmony default export */ __webpack_exports__["default"] = (SliderPointer);

/***/ }),

/***/ 2204:
/*!*********************************************************************!*\
  !*** ./node_modules/react-color/es/components/material/Material.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Material": function() { return /* binding */ Material; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);





var Material = function Material(_ref) {
  var onChange = _ref.onChange,
      hex = _ref.hex,
      rgb = _ref.rgb,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_4__["default"])({
    'default': {
      material: {
        width: '98px',
        height: '98px',
        padding: '16px',
        fontFamily: 'Roboto'
      },
      HEXwrap: {
        position: 'relative'
      },
      HEXinput: {
        width: '100%',
        marginTop: '12px',
        fontSize: '15px',
        color: '#333',
        padding: '0px',
        border: '0px',
        borderBottom: '2px solid ' + hex,
        outline: 'none',
        height: '30px'
      },
      HEXlabel: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        fontSize: '11px',
        color: '#999999',
        textTransform: 'capitalize'
      },
      Hex: {
        style: {}
      },
      RGBwrap: {
        position: 'relative'
      },
      RGBinput: {
        width: '100%',
        marginTop: '12px',
        fontSize: '15px',
        color: '#333',
        padding: '0px',
        border: '0px',
        borderBottom: '1px solid #eee',
        outline: 'none',
        height: '30px'
      },
      RGBlabel: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        fontSize: '11px',
        color: '#999999',
        textTransform: 'capitalize'
      },
      split: {
        display: 'flex',
        marginRight: '-10px',
        paddingTop: '11px'
      },
      third: {
        flex: '1',
        paddingRight: '10px'
      }
    }
  }, passedStyles));

  var handleChange = function handleChange(data, e) {
    if (data.hex) {
      _helpers_color__WEBPACK_IMPORTED_MODULE_2__.isValidHex(data.hex) && onChange({
        hex: data.hex,
        source: 'hex'
      }, e);
    } else if (data.r || data.g || data.b) {
      onChange({
        r: data.r || rgb.r,
        g: data.g || rgb.g,
        b: data.b || rgb.b,
        source: 'rgb'
      }, e);
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Raised, {
    styles: passedStyles
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.material,
    className: 'material-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.EditableInput, {
    style: {
      wrap: styles.HEXwrap,
      input: styles.HEXinput,
      label: styles.HEXlabel
    },
    label: 'hex',
    value: hex,
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.split,
    className: 'flexbox-fix'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.third
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'r',
    value: rgb.r,
    onChange: handleChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.third
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'g',
    value: rgb.g,
    onChange: handleChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.third
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'b',
    value: rgb.b,
    onChange: handleChange
  })))));
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(Material));

/***/ }),

/***/ 1396:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/photoshop/Photoshop.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Photoshop": function() { return /* binding */ Photoshop; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _PhotoshopFields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PhotoshopFields */ 2292);
/* harmony import */ var _PhotoshopPointerCircle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PhotoshopPointerCircle */ 2293);
/* harmony import */ var _PhotoshopPointer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PhotoshopPointer */ 2294);
/* harmony import */ var _PhotoshopButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PhotoshopButton */ 2295);
/* harmony import */ var _PhotoshopPreviews__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./PhotoshopPreviews */ 2296);
var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}











var Photoshop = function (_React$Component) {
  _inherits(Photoshop, _React$Component);

  function Photoshop(props) {
    _classCallCheck(this, Photoshop);

    var _this = _possibleConstructorReturn(this, (Photoshop.__proto__ || Object.getPrototypeOf(Photoshop)).call(this));

    _this.state = {
      currentColor: props.hex
    };
    return _this;
  }

  _createClass(Photoshop, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$styles = _props.styles,
          passedStyles = _props$styles === undefined ? {} : _props$styles,
          _props$className = _props.className,
          className = _props$className === undefined ? '' : _props$className;
      var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_9__["default"])({
        'default': {
          picker: {
            background: '#DCDCDC',
            borderRadius: '4px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)',
            boxSizing: 'initial',
            width: '513px'
          },
          head: {
            backgroundImage: 'linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)',
            borderBottom: '1px solid #B1B1B1',
            boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)',
            height: '23px',
            lineHeight: '24px',
            borderRadius: '4px 4px 0 0',
            fontSize: '13px',
            color: '#4D4D4D',
            textAlign: 'center'
          },
          body: {
            padding: '15px 15px 0',
            display: 'flex'
          },
          saturation: {
            width: '256px',
            height: '256px',
            position: 'relative',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0',
            overflow: 'hidden'
          },
          hue: {
            position: 'relative',
            height: '256px',
            width: '19px',
            marginLeft: '10px',
            border: '2px solid #B3B3B3',
            borderBottom: '2px solid #F0F0F0'
          },
          controls: {
            width: '180px',
            marginLeft: '10px'
          },
          top: {
            display: 'flex'
          },
          previews: {
            width: '60px'
          },
          actions: {
            flex: '1',
            marginLeft: '20px'
          }
        }
      }, passedStyles));
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.picker,
        className: 'photoshop-picker ' + className
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.head
      }, this.props.header), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.body,
        className: 'flexbox-fix'
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.saturation
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Saturation, {
        hsl: this.props.hsl,
        hsv: this.props.hsv,
        pointer: _PhotoshopPointerCircle__WEBPACK_IMPORTED_MODULE_5__["default"],
        onChange: this.props.onChange
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.hue
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Hue, {
        direction: 'vertical',
        hsl: this.props.hsl,
        pointer: _PhotoshopPointer__WEBPACK_IMPORTED_MODULE_6__["default"],
        onChange: this.props.onChange
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.controls
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.top,
        className: 'flexbox-fix'
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.previews
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PhotoshopPreviews__WEBPACK_IMPORTED_MODULE_8__["default"], {
        rgb: this.props.rgb,
        currentColor: this.state.currentColor
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
        style: styles.actions
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PhotoshopButton__WEBPACK_IMPORTED_MODULE_7__["default"], {
        label: 'OK',
        onClick: this.props.onAccept,
        active: true
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PhotoshopButton__WEBPACK_IMPORTED_MODULE_7__["default"], {
        label: 'Cancel',
        onClick: this.props.onCancel
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PhotoshopFields__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onChange: this.props.onChange,
        rgb: this.props.rgb,
        hsv: this.props.hsv,
        hex: this.props.hex
      }))))));
    }
  }]);

  return Photoshop;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component);
Photoshop.defaultProps = {
  header: 'Color Picker',
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(Photoshop));

/***/ }),

/***/ 2295:
/*!*****************************************************************************!*\
  !*** ./node_modules/react-color/es/components/photoshop/PhotoshopButton.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhotoshopButton": function() { return /* binding */ PhotoshopButton; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var PhotoshopButton = function PhotoshopButton(_ref) {
  var onClick = _ref.onClick,
      label = _ref.label,
      children = _ref.children,
      active = _ref.active;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      button: {
        backgroundImage: 'linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%)',
        border: '1px solid #878787',
        borderRadius: '2px',
        height: '20px',
        boxShadow: '0 1px 0 0 #EAEAEA',
        fontSize: '14px',
        color: '#000',
        lineHeight: '20px',
        textAlign: 'center',
        marginBottom: '10px',
        cursor: 'pointer'
      }
    },
    'active': {
      button: {
        boxShadow: '0 0 0 1px #878787'
      }
    }
  }, {
    active: active
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.button,
    onClick: onClick
  }, label || children);
};
/* harmony default export */ __webpack_exports__["default"] = (PhotoshopButton);

/***/ }),

/***/ 2292:
/*!*****************************************************************************!*\
  !*** ./node_modules/react-color/es/components/photoshop/PhotoshopFields.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhotoshopPicker": function() { return /* binding */ PhotoshopPicker; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ 1796);





var PhotoshopPicker = function PhotoshopPicker(_ref) {
  var onChange = _ref.onChange,
      rgb = _ref.rgb,
      hsv = _ref.hsv,
      hex = _ref.hex;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])({
    'default': {
      fields: {
        paddingTop: '5px',
        paddingBottom: '9px',
        width: '80px',
        position: 'relative'
      },
      divider: {
        height: '5px'
      },
      RGBwrap: {
        position: 'relative'
      },
      RGBinput: {
        marginLeft: '40%',
        width: '40%',
        height: '18px',
        border: '1px solid #888888',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC',
        marginBottom: '5px',
        fontSize: '13px',
        paddingLeft: '3px',
        marginRight: '10px'
      },
      RGBlabel: {
        left: '0px',
        top: '0px',
        width: '34px',
        textTransform: 'uppercase',
        fontSize: '13px',
        height: '18px',
        lineHeight: '22px',
        position: 'absolute'
      },
      HEXwrap: {
        position: 'relative'
      },
      HEXinput: {
        marginLeft: '20%',
        width: '80%',
        height: '18px',
        border: '1px solid #888888',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC',
        marginBottom: '6px',
        fontSize: '13px',
        paddingLeft: '3px'
      },
      HEXlabel: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        width: '14px',
        textTransform: 'uppercase',
        fontSize: '13px',
        height: '18px',
        lineHeight: '22px'
      },
      fieldSymbols: {
        position: 'absolute',
        top: '5px',
        right: '-7px',
        fontSize: '13px'
      },
      symbol: {
        height: '20px',
        lineHeight: '22px',
        paddingBottom: '7px'
      }
    }
  });

  var handleChange = function handleChange(data, e) {
    if (data['#']) {
      _helpers_color__WEBPACK_IMPORTED_MODULE_3__.isValidHex(data['#']) && onChange({
        hex: data['#'],
        source: 'hex'
      }, e);
    } else if (data.r || data.g || data.b) {
      onChange({
        r: data.r || rgb.r,
        g: data.g || rgb.g,
        b: data.b || rgb.b,
        source: 'rgb'
      }, e);
    } else if (data.h || data.s || data.v) {
      onChange({
        h: data.h || hsv.h,
        s: data.s || hsv.s,
        v: data.v || hsv.v,
        source: 'hsv'
      }, e);
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.fields
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'h',
    value: Math.round(hsv.h),
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 's',
    value: Math.round(hsv.s * 100),
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'v',
    value: Math.round(hsv.v * 100),
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.divider
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'r',
    value: rgb.r,
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'g',
    value: rgb.g,
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      wrap: styles.RGBwrap,
      input: styles.RGBinput,
      label: styles.RGBlabel
    },
    label: 'b',
    value: rgb.b,
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.divider
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      wrap: styles.HEXwrap,
      input: styles.HEXinput,
      label: styles.HEXlabel
    },
    label: '#',
    value: hex.replace('#', ''),
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.fieldSymbols
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.symbol
  }, '\xB0'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.symbol
  }, '%'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.symbol
  }, '%')));
};
/* harmony default export */ __webpack_exports__["default"] = (PhotoshopPicker);

/***/ }),

/***/ 2294:
/*!******************************************************************************!*\
  !*** ./node_modules/react-color/es/components/photoshop/PhotoshopPointer.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhotoshopPointerCircle": function() { return /* binding */ PhotoshopPointerCircle; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var PhotoshopPointerCircle = function PhotoshopPointerCircle() {
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      triangle: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '4px 0 4px 6px',
        borderColor: 'transparent transparent transparent #fff',
        position: 'absolute',
        top: '1px',
        left: '1px'
      },
      triangleBorder: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: '5px 0 5px 8px',
        borderColor: 'transparent transparent transparent #555'
      },
      left: {
        Extend: 'triangleBorder',
        transform: 'translate(-13px, -4px)'
      },
      leftInside: {
        Extend: 'triangle',
        transform: 'translate(-8px, -5px)'
      },
      right: {
        Extend: 'triangleBorder',
        transform: 'translate(20px, -14px) rotate(180deg)'
      },
      rightInside: {
        Extend: 'triangle',
        transform: 'translate(-8px, -5px)'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.pointer
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.left
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.leftInside
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.right
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.rightInside
  })));
};
/* harmony default export */ __webpack_exports__["default"] = (PhotoshopPointerCircle);

/***/ }),

/***/ 2293:
/*!************************************************************************************!*\
  !*** ./node_modules/react-color/es/components/photoshop/PhotoshopPointerCircle.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhotoshopPointerCircle": function() { return /* binding */ PhotoshopPointerCircle; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var PhotoshopPointerCircle = function PhotoshopPointerCircle(_ref) {
  var hsl = _ref.hsl;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '12px',
        height: '12px',
        borderRadius: '6px',
        boxShadow: 'inset 0 0 0 1px #fff',
        transform: 'translate(-6px, -6px)'
      }
    },
    'black-outline': {
      picker: {
        boxShadow: 'inset 0 0 0 1px #000'
      }
    }
  }, {
    'black-outline': hsl.l > 0.5
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
/* harmony default export */ __webpack_exports__["default"] = (PhotoshopPointerCircle);

/***/ }),

/***/ 2296:
/*!*******************************************************************************!*\
  !*** ./node_modules/react-color/es/components/photoshop/PhotoshopPreviews.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhotoshopPreviews": function() { return /* binding */ PhotoshopPreviews; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var PhotoshopPreviews = function PhotoshopPreviews(_ref) {
  var rgb = _ref.rgb,
      currentColor = _ref.currentColor;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      swatches: {
        border: '1px solid #B3B3B3',
        borderBottom: '1px solid #F0F0F0',
        marginBottom: '2px',
        marginTop: '1px'
      },
      new: {
        height: '34px',
        background: 'rgb(' + rgb.r + ',' + rgb.g + ', ' + rgb.b + ')',
        boxShadow: 'inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000'
      },
      current: {
        height: '34px',
        background: currentColor,
        boxShadow: 'inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000'
      },
      label: {
        fontSize: '14px',
        color: '#000',
        textAlign: 'center'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.label
  }, 'new'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatches
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.new
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.current
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.label
  }, 'current'));
};
/* harmony default export */ __webpack_exports__["default"] = (PhotoshopPreviews);

/***/ }),

/***/ 2205:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/sketch/Sketch.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sketch": function() { return /* binding */ Sketch; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _SketchFields__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SketchFields */ 2297);
/* harmony import */ var _SketchPresetColors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SketchPresetColors */ 2298);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};








var Sketch = function Sketch(_ref) {
  var width = _ref.width,
      rgb = _ref.rgb,
      hex = _ref.hex,
      hsv = _ref.hsv,
      hsl = _ref.hsl,
      onChange = _ref.onChange,
      onSwatchHover = _ref.onSwatchHover,
      disableAlpha = _ref.disableAlpha,
      presetColors = _ref.presetColors,
      renderers = _ref.renderers,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__["default"])({
    'default': _extends({
      picker: {
        width: width,
        padding: '10px 10px 0',
        boxSizing: 'initial',
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)'
      },
      saturation: {
        width: '100%',
        paddingBottom: '75%',
        position: 'relative',
        overflow: 'hidden'
      },
      Saturation: {
        radius: '3px',
        shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      },
      controls: {
        display: 'flex'
      },
      sliders: {
        padding: '4px 0',
        flex: '1'
      },
      color: {
        width: '24px',
        height: '24px',
        position: 'relative',
        marginTop: '4px',
        marginLeft: '4px',
        borderRadius: '3px'
      },
      activeColor: {
        absolute: '0px 0px 0px 0px',
        borderRadius: '2px',
        background: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      },
      hue: {
        position: 'relative',
        height: '10px',
        overflow: 'hidden'
      },
      Hue: {
        radius: '2px',
        shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      },
      alpha: {
        position: 'relative',
        height: '10px',
        marginTop: '4px',
        overflow: 'hidden'
      },
      Alpha: {
        radius: '2px',
        shadow: 'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
      }
    }, passedStyles),
    'disableAlpha': {
      color: {
        height: '10px'
      },
      hue: {
        height: '10px'
      },
      alpha: {
        display: 'none'
      }
    }
  }, passedStyles), {
    disableAlpha: disableAlpha
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker,
    className: 'sketch-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.saturation
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Saturation, {
    style: styles.Saturation,
    hsl: hsl,
    hsv: hsv,
    onChange: onChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.controls,
    className: 'flexbox-fix'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.sliders
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.hue
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Hue, {
    style: styles.Hue,
    hsl: hsl,
    onChange: onChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.alpha
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Alpha, {
    style: styles.Alpha,
    rgb: rgb,
    hsl: hsl,
    renderers: renderers,
    onChange: onChange
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.color
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Checkboard, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.activeColor
  }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SketchFields__WEBPACK_IMPORTED_MODULE_4__["default"], {
    rgb: rgb,
    hsl: hsl,
    hex: hex,
    onChange: onChange,
    disableAlpha: disableAlpha
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SketchPresetColors__WEBPACK_IMPORTED_MODULE_5__["default"], {
    colors: presetColors,
    onClick: onChange,
    onSwatchHover: onSwatchHover
  }));
};
Sketch.defaultProps = {
  disableAlpha: false,
  width: 200,
  styles: {},
  presetColors: ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(Sketch));

/***/ }),

/***/ 2297:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/sketch/SketchFields.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SketchFields": function() { return /* binding */ SketchFields; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ 1796);


/* eslint-disable no-param-reassign */




var SketchFields = function SketchFields(_ref) {
  var onChange = _ref.onChange,
      rgb = _ref.rgb,
      hsl = _ref.hsl,
      hex = _ref.hex,
      disableAlpha = _ref.disableAlpha;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])({
    'default': {
      fields: {
        display: 'flex',
        paddingTop: '4px'
      },
      single: {
        flex: '1',
        paddingLeft: '6px'
      },
      alpha: {
        flex: '1',
        paddingLeft: '6px'
      },
      double: {
        flex: '2'
      },
      input: {
        width: '80%',
        padding: '4px 10% 3px',
        border: 'none',
        boxShadow: 'inset 0 0 0 1px #ccc',
        fontSize: '11px'
      },
      label: {
        display: 'block',
        textAlign: 'center',
        fontSize: '11px',
        color: '#222',
        paddingTop: '3px',
        paddingBottom: '4px',
        textTransform: 'capitalize'
      }
    },
    'disableAlpha': {
      alpha: {
        display: 'none'
      }
    }
  }, {
    disableAlpha: disableAlpha
  });

  var handleChange = function handleChange(data, e) {
    if (data.hex) {
      _helpers_color__WEBPACK_IMPORTED_MODULE_3__.isValidHex(data.hex) && onChange({
        hex: data.hex,
        source: 'hex'
      }, e);
    } else if (data.r || data.g || data.b) {
      onChange({
        r: data.r || rgb.r,
        g: data.g || rgb.g,
        b: data.b || rgb.b,
        a: rgb.a,
        source: 'rgb'
      }, e);
    } else if (data.a) {
      if (data.a < 0) {
        data.a = 0;
      } else if (data.a > 100) {
        data.a = 100;
      }

      data.a /= 100;
      onChange({
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a: data.a,
        source: 'rgb'
      }, e);
    }
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.fields,
    className: 'flexbox-fix'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.double
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input,
      label: styles.label
    },
    label: 'hex',
    value: hex.replace('#', ''),
    onChange: handleChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.single
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input,
      label: styles.label
    },
    label: 'r',
    value: rgb.r,
    onChange: handleChange,
    dragLabel: 'true',
    dragMax: '255'
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.single
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input,
      label: styles.label
    },
    label: 'g',
    value: rgb.g,
    onChange: handleChange,
    dragLabel: 'true',
    dragMax: '255'
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.single
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input,
      label: styles.label
    },
    label: 'b',
    value: rgb.b,
    onChange: handleChange,
    dragLabel: 'true',
    dragMax: '255'
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.alpha
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.EditableInput, {
    style: {
      input: styles.input,
      label: styles.label
    },
    label: 'a',
    value: Math.round(rgb.a * 100),
    onChange: handleChange,
    dragLabel: 'true',
    dragMax: '100'
  })));
};
/* harmony default export */ __webpack_exports__["default"] = (SketchFields);

/***/ }),

/***/ 2298:
/*!*****************************************************************************!*\
  !*** ./node_modules/react-color/es/components/sketch/SketchPresetColors.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SketchPresetColors": function() { return /* binding */ SketchPresetColors; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};





var SketchPresetColors = function SketchPresetColors(_ref) {
  var colors = _ref.colors,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === undefined ? function () {} : _ref$onClick,
      onSwatchHover = _ref.onSwatchHover;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])({
    'default': {
      colors: {
        margin: '0 -10px',
        padding: '10px 0 0 10px',
        borderTop: '1px solid #eee',
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative'
      },
      swatchWrap: {
        width: '16px',
        height: '16px',
        margin: '0 10px 10px 0'
      },
      swatch: {
        borderRadius: '3px',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)'
      }
    },
    'no-presets': {
      colors: {
        display: 'none'
      }
    }
  }, {
    'no-presets': !colors || !colors.length
  });

  var handleClick = function handleClick(hex, e) {
    onClick({
      hex: hex,
      source: 'hex'
    }, e);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.colors,
    className: 'flexbox-fix'
  }, colors.map(function (colorObjOrString) {
    var c = typeof colorObjOrString === 'string' ? {
      color: colorObjOrString
    } : colorObjOrString;
    var key = '' + c.color + (c.title || '');
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
      key: key,
      style: styles.swatchWrap
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Swatch, _extends({}, c, {
      style: styles.swatch,
      onClick: handleClick,
      onHover: onSwatchHover,
      focusStyle: {
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ' + c.color
      }
    })));
  }));
};
/* harmony default export */ __webpack_exports__["default"] = (SketchPresetColors);

/***/ }),

/***/ 1397:
/*!*****************************************************************!*\
  !*** ./node_modules/react-color/es/components/slider/Slider.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Slider": function() { return /* binding */ Slider; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _SliderSwatches__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SliderSwatches */ 2299);
/* harmony import */ var _SliderPointer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SliderPointer */ 2301);







var Slider = function Slider(_ref) {
  var hsl = _ref.hsl,
      onChange = _ref.onChange,
      pointer = _ref.pointer,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__["default"])({
    'default': {
      hue: {
        height: '12px',
        position: 'relative'
      },
      Hue: {
        radius: '2px'
      }
    }
  }, passedStyles));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.wrap || {},
    className: 'slider-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.hue
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Hue, {
    style: styles.Hue,
    hsl: hsl,
    pointer: pointer,
    onChange: onChange
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatches
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SliderSwatches__WEBPACK_IMPORTED_MODULE_4__["default"], {
    hsl: hsl,
    onClick: onChange
  })));
};
Slider.defaultProps = {
  pointer: _SliderPointer__WEBPACK_IMPORTED_MODULE_5__["default"],
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_3__.ColorWrap)(Slider));

/***/ }),

/***/ 2301:
/*!************************************************************************!*\
  !*** ./node_modules/react-color/es/components/slider/SliderPointer.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SliderPointer": function() { return /* binding */ SliderPointer; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var SliderPointer = function SliderPointer() {
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      picker: {
        width: '14px',
        height: '14px',
        borderRadius: '6px',
        transform: 'translate(-7px, -1px)',
        backgroundColor: 'rgb(248, 248, 248)',
        boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker
  });
};
/* harmony default export */ __webpack_exports__["default"] = (SliderPointer);

/***/ }),

/***/ 2300:
/*!***********************************************************************!*\
  !*** ./node_modules/react-color/es/components/slider/SliderSwatch.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SliderSwatch": function() { return /* binding */ SliderSwatch; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);


var SliderSwatch = function SliderSwatch(_ref) {
  var hsl = _ref.hsl,
      offset = _ref.offset,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === undefined ? function () {} : _ref$onClick,
      active = _ref.active,
      first = _ref.first,
      last = _ref.last;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      swatch: {
        height: '12px',
        background: 'hsl(' + hsl.h + ', 50%, ' + offset * 100 + '%)',
        cursor: 'pointer'
      }
    },
    'first': {
      swatch: {
        borderRadius: '2px 0 0 2px'
      }
    },
    'last': {
      swatch: {
        borderRadius: '0 2px 2px 0'
      }
    },
    'active': {
      swatch: {
        transform: 'scaleY(1.8)',
        borderRadius: '3.6px/2px'
      }
    }
  }, {
    active: active,
    first: first,
    last: last
  });

  var handleClick = function handleClick(e) {
    return onClick({
      h: hsl.h,
      s: 0.5,
      l: offset,
      source: 'hsl'
    }, e);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch,
    onClick: handleClick
  });
};
/* harmony default export */ __webpack_exports__["default"] = (SliderSwatch);

/***/ }),

/***/ 2299:
/*!*************************************************************************!*\
  !*** ./node_modules/react-color/es/components/slider/SliderSwatches.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SliderSwatches": function() { return /* binding */ SliderSwatches; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _SliderSwatch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SliderSwatch */ 2300);



var SliderSwatches = function SliderSwatches(_ref) {
  var onClick = _ref.onClick,
      hsl = _ref.hsl;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      swatches: {
        marginTop: '20px'
      },
      swatch: {
        boxSizing: 'border-box',
        width: '20%',
        paddingRight: '1px',
        float: 'left'
      },
      clear: {
        clear: 'both'
      }
    }
  }); // Acceptible difference in floating point equality

  var epsilon = 0.1;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatches
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SliderSwatch__WEBPACK_IMPORTED_MODULE_2__["default"], {
    hsl: hsl,
    offset: '.80',
    active: Math.abs(hsl.l - 0.80) < epsilon && Math.abs(hsl.s - 0.50) < epsilon,
    onClick: onClick,
    first: true
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SliderSwatch__WEBPACK_IMPORTED_MODULE_2__["default"], {
    hsl: hsl,
    offset: '.65',
    active: Math.abs(hsl.l - 0.65) < epsilon && Math.abs(hsl.s - 0.50) < epsilon,
    onClick: onClick
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SliderSwatch__WEBPACK_IMPORTED_MODULE_2__["default"], {
    hsl: hsl,
    offset: '.50',
    active: Math.abs(hsl.l - 0.50) < epsilon && Math.abs(hsl.s - 0.50) < epsilon,
    onClick: onClick
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SliderSwatch__WEBPACK_IMPORTED_MODULE_2__["default"], {
    hsl: hsl,
    offset: '.35',
    active: Math.abs(hsl.l - 0.35) < epsilon && Math.abs(hsl.s - 0.50) < epsilon,
    onClick: onClick
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.swatch
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SliderSwatch__WEBPACK_IMPORTED_MODULE_2__["default"], {
    hsl: hsl,
    offset: '.20',
    active: Math.abs(hsl.l - 0.20) < epsilon && Math.abs(hsl.s - 0.50) < epsilon,
    onClick: onClick,
    last: true
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.clear
  }));
};
/* harmony default export */ __webpack_exports__["default"] = (SliderSwatches);

/***/ }),

/***/ 2206:
/*!*********************************************************************!*\
  !*** ./node_modules/react-color/es/components/swatches/Swatches.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Swatches": function() { return /* binding */ Swatches; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es/map */ 2702);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var material_colors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! material-colors */ 2201);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _SwatchesGroup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./SwatchesGroup */ 2302);








var Swatches = function Swatches(_ref) {
  var width = _ref.width,
      height = _ref.height,
      onChange = _ref.onChange,
      onSwatchHover = _ref.onSwatchHover,
      colors = _ref.colors,
      hex = _ref.hex,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_2__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__["default"])({
    'default': {
      picker: {
        width: width,
        height: height
      },
      overflow: {
        height: height,
        overflowY: 'scroll'
      },
      body: {
        padding: '16px 0 6px 16px'
      },
      clear: {
        clear: 'both'
      }
    }
  }, passedStyles));

  var handleChange = function handleChange(data, e) {
    return onChange({
      hex: data,
      source: 'hex'
    }, e);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.picker,
    className: 'swatches-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_4__.Raised, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.overflow
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.body
  }, (0,lodash_es_map__WEBPACK_IMPORTED_MODULE_7__["default"])(colors, function (group) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SwatchesGroup__WEBPACK_IMPORTED_MODULE_5__["default"], {
      key: group.toString(),
      group: group,
      active: hex,
      onClick: handleChange,
      onSwatchHover: onSwatchHover
    });
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.clear
  })))));
};
Swatches.defaultProps = {
  width: 320,
  height: 240,
  colors: [[material_colors__WEBPACK_IMPORTED_MODULE_3__.red[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.red[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.red[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.red[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.red[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.pink[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.pink[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.pink[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.pink[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.pink[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.purple[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.purple[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.purple[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.purple[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.purple[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.deepPurple[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepPurple[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepPurple[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepPurple[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepPurple[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.indigo[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.indigo[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.indigo[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.indigo[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.indigo[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.blue[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.blue[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.blue[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.blue[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.blue[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.lightBlue[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightBlue[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightBlue[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightBlue[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightBlue[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.cyan[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.cyan[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.cyan[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.cyan[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.cyan[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.teal[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.teal[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.teal[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.teal[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.teal[100]], ['#194D33', material_colors__WEBPACK_IMPORTED_MODULE_3__.green[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.green[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.green[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.green[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.lightGreen[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightGreen[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightGreen[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightGreen[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.lightGreen[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.lime[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.lime[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.lime[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.lime[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.lime[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.yellow[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.yellow[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.yellow[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.yellow[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.yellow[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.amber[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.amber[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.amber[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.amber[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.amber[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.orange[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.orange[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.orange[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.orange[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.orange[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.deepOrange[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepOrange[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepOrange[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepOrange[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.deepOrange[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.brown[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.brown[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.brown[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.brown[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.brown[100]], [material_colors__WEBPACK_IMPORTED_MODULE_3__.blueGrey[900], material_colors__WEBPACK_IMPORTED_MODULE_3__.blueGrey[700], material_colors__WEBPACK_IMPORTED_MODULE_3__.blueGrey[500], material_colors__WEBPACK_IMPORTED_MODULE_3__.blueGrey[300], material_colors__WEBPACK_IMPORTED_MODULE_3__.blueGrey[100]], ['#000000', '#525252', '#969696', '#D9D9D9', '#FFFFFF']],
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_4__.ColorWrap)(Swatches));

/***/ }),

/***/ 2303:
/*!**************************************************************************!*\
  !*** ./node_modules/react-color/es/components/swatches/SwatchesColor.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwatchesColor": function() { return /* binding */ SwatchesColor; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common */ 1796);
/* harmony import */ var _icons_material_CheckIcon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @icons/material/CheckIcon */ 2304);





var SwatchesColor = function SwatchesColor(_ref) {
  var color = _ref.color,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === undefined ? function () {} : _ref$onClick,
      onSwatchHover = _ref.onSwatchHover,
      first = _ref.first,
      last = _ref.last,
      active = _ref.active;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      color: {
        width: '40px',
        height: '24px',
        cursor: 'pointer',
        background: color,
        marginBottom: '1px'
      },
      check: {
        color: _helpers_color__WEBPACK_IMPORTED_MODULE_2__.getContrastingColor(color),
        marginLeft: '8px',
        display: 'none'
      }
    },
    'first': {
      color: {
        overflow: 'hidden',
        borderRadius: '2px 2px 0 0'
      }
    },
    'last': {
      color: {
        overflow: 'hidden',
        borderRadius: '0 0 2px 2px'
      }
    },
    'active': {
      check: {
        display: 'block'
      }
    },
    'color-#FFFFFF': {
      color: {
        boxShadow: 'inset 0 0 0 1px #ddd'
      },
      check: {
        color: '#333'
      }
    },
    'transparent': {
      check: {
        color: '#333'
      }
    }
  }, {
    first: first,
    last: last,
    active: active,
    'color-#FFFFFF': color === '#FFFFFF',
    'transparent': color === 'transparent'
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_common__WEBPACK_IMPORTED_MODULE_3__.Swatch, {
    color: color,
    style: styles.color,
    onClick: onClick,
    onHover: onSwatchHover,
    focusStyle: {
      boxShadow: '0 0 4px ' + color
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.check
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icons_material_CheckIcon__WEBPACK_IMPORTED_MODULE_4__["default"], null)));
};
/* harmony default export */ __webpack_exports__["default"] = (SwatchesColor);

/***/ }),

/***/ 2302:
/*!**************************************************************************!*\
  !*** ./node_modules/react-color/es/components/swatches/SwatchesGroup.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwatchesGroup": function() { return /* binding */ SwatchesGroup; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_map__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es/map */ 2702);
/* harmony import */ var _SwatchesColor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SwatchesColor */ 2303);




var SwatchesGroup = function SwatchesGroup(_ref) {
  var onClick = _ref.onClick,
      onSwatchHover = _ref.onSwatchHover,
      group = _ref.group,
      active = _ref.active;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_1__["default"])({
    'default': {
      group: {
        paddingBottom: '10px',
        width: '40px',
        float: 'left',
        marginRight: '10px'
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement('div', {
    style: styles.group
  }, (0,lodash_es_map__WEBPACK_IMPORTED_MODULE_3__["default"])(group, function (color, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(_SwatchesColor__WEBPACK_IMPORTED_MODULE_2__["default"], {
      key: color,
      color: color,
      active: color.toLowerCase() === active,
      first: i === 0,
      last: i === group.length - 1,
      onClick: onClick,
      onSwatchHover: onSwatchHover
    });
  }));
};
/* harmony default export */ __webpack_exports__["default"] = (SwatchesGroup);

/***/ }),

/***/ 1398:
/*!*******************************************************************!*\
  !*** ./node_modules/react-color/es/components/twitter/Twitter.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Twitter": function() { return /* binding */ Twitter; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var reactcss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! reactcss */ 2099);
/* harmony import */ var lodash_es_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es/map */ 2702);
/* harmony import */ var lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es/merge */ 2590);
/* harmony import */ var _helpers_color__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/color */ 1797);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common */ 1796);








var Twitter = function Twitter(_ref) {
  var onChange = _ref.onChange,
      onSwatchHover = _ref.onSwatchHover,
      hex = _ref.hex,
      colors = _ref.colors,
      width = _ref.width,
      triangle = _ref.triangle,
      _ref$styles = _ref.styles,
      passedStyles = _ref$styles === undefined ? {} : _ref$styles,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? '' : _ref$className;
  var styles = (0,reactcss__WEBPACK_IMPORTED_MODULE_3__["default"])((0,lodash_es_merge__WEBPACK_IMPORTED_MODULE_6__["default"])({
    'default': {
      card: {
        width: width,
        background: '#fff',
        border: '0 solid rgba(0,0,0,0.25)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        borderRadius: '4px',
        position: 'relative'
      },
      body: {
        padding: '15px 9px 9px 15px'
      },
      label: {
        fontSize: '18px',
        color: '#fff'
      },
      triangle: {
        width: '0px',
        height: '0px',
        borderStyle: 'solid',
        borderWidth: '0 9px 10px 9px',
        borderColor: 'transparent transparent #fff transparent',
        position: 'absolute'
      },
      triangleShadow: {
        width: '0px',
        height: '0px',
        borderStyle: 'solid',
        borderWidth: '0 9px 10px 9px',
        borderColor: 'transparent transparent rgba(0,0,0,.1) transparent',
        position: 'absolute'
      },
      hash: {
        background: '#F0F0F0',
        height: '30px',
        width: '30px',
        borderRadius: '4px 0 0 4px',
        float: 'left',
        color: '#98A1A4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      input: {
        width: '100px',
        fontSize: '14px',
        color: '#666',
        border: '0px',
        outline: 'none',
        height: '28px',
        boxShadow: 'inset 0 0 0 1px #F0F0F0',
        boxSizing: 'content-box',
        borderRadius: '0 4px 4px 0',
        float: 'left',
        paddingLeft: '8px'
      },
      swatch: {
        width: '30px',
        height: '30px',
        float: 'left',
        borderRadius: '4px',
        margin: '0 6px 6px 0'
      },
      clear: {
        clear: 'both'
      }
    },
    'hide-triangle': {
      triangle: {
        display: 'none'
      },
      triangleShadow: {
        display: 'none'
      }
    },
    'top-left-triangle': {
      triangle: {
        top: '-10px',
        left: '12px'
      },
      triangleShadow: {
        top: '-11px',
        left: '12px'
      }
    },
    'top-right-triangle': {
      triangle: {
        top: '-10px',
        right: '12px'
      },
      triangleShadow: {
        top: '-11px',
        right: '12px'
      }
    }
  }, passedStyles), {
    'hide-triangle': triangle === 'hide',
    'top-left-triangle': triangle === 'top-left',
    'top-right-triangle': triangle === 'top-right'
  });

  var handleChange = function handleChange(hexcode, e) {
    _helpers_color__WEBPACK_IMPORTED_MODULE_4__.isValidHex(hexcode) && onChange({
      hex: hexcode,
      source: 'hex'
    }, e);
  };

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.card,
    className: 'twitter-picker ' + className
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.triangleShadow
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.triangle
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.body
  }, (0,lodash_es_map__WEBPACK_IMPORTED_MODULE_7__["default"])(colors, function (c, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.Swatch, {
      key: i,
      color: c,
      hex: c,
      style: styles.swatch,
      onClick: handleChange,
      onHover: onSwatchHover,
      focusStyle: {
        boxShadow: '0 0 4px ' + c
      }
    });
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.hash
  }, '#'), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(_common__WEBPACK_IMPORTED_MODULE_5__.EditableInput, {
    label: null,
    style: {
      input: styles.input
    },
    value: hex.replace('#', ''),
    onChange: handleChange
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement('div', {
    style: styles.clear
  })));
};
Twitter.defaultProps = {
  width: 276,
  colors: ['#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'],
  triangle: 'top-left',
  styles: {}
};
/* harmony default export */ __webpack_exports__["default"] = ((0,_common__WEBPACK_IMPORTED_MODULE_5__.ColorWrap)(Twitter));

/***/ }),

/***/ 2276:
/*!******************************************************!*\
  !*** ./node_modules/react-color/es/helpers/alpha.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calculateChange": function() { return /* binding */ calculateChange; }
/* harmony export */ });
var calculateChange = function calculateChange(e, hsl, direction, initialA, container) {
  var containerWidth = container.clientWidth;
  var containerHeight = container.clientHeight;
  var x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
  var y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY;
  var left = x - (container.getBoundingClientRect().left + window.pageXOffset);
  var top = y - (container.getBoundingClientRect().top + window.pageYOffset);

  if (direction === 'vertical') {
    var a = void 0;

    if (top < 0) {
      a = 0;
    } else if (top > containerHeight) {
      a = 1;
    } else {
      a = Math.round(top * 100 / containerHeight) / 100;
    }

    if (hsl.a !== a) {
      return {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a: a,
        source: 'rgb'
      };
    }
  } else {
    var _a = void 0;

    if (left < 0) {
      _a = 0;
    } else if (left > containerWidth) {
      _a = 1;
    } else {
      _a = Math.round(left * 100 / containerWidth) / 100;
    }

    if (initialA !== _a) {
      return {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a: _a,
        source: 'rgb'
      };
    }
  }

  return null;
};

/***/ }),

/***/ 2277:
/*!***********************************************************!*\
  !*** ./node_modules/react-color/es/helpers/checkboard.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "get": function() { return /* binding */ get; },
/* harmony export */   "render": function() { return /* binding */ render; }
/* harmony export */ });
var checkboardCache = {};
var render = function render(c1, c2, size, serverCanvas) {
  if (typeof document === 'undefined' && !serverCanvas) {
    return null;
  }

  var canvas = serverCanvas ? new serverCanvas() : document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size * 2;
  var ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  } // If no context can be found, return early.


  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = c2;
  ctx.fillRect(0, 0, size, size);
  ctx.translate(size, size);
  ctx.fillRect(0, 0, size, size);
  return canvas.toDataURL();
};
var get = function get(c1, c2, size, serverCanvas) {
  var key = c1 + '-' + c2 + '-' + size + (serverCanvas ? '-server' : '');

  if (checkboardCache[key]) {
    return checkboardCache[key];
  }

  var checkboard = render(c1, c2, size, serverCanvas);
  checkboardCache[key] = checkboard;
  return checkboard;
};

/***/ }),

/***/ 1797:
/*!******************************************************!*\
  !*** ./node_modules/react-color/es/helpers/color.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getContrastingColor": function() { return /* binding */ getContrastingColor; },
/* harmony export */   "isValidHex": function() { return /* binding */ isValidHex; },
/* harmony export */   "isvalidColorString": function() { return /* binding */ isvalidColorString; },
/* harmony export */   "red": function() { return /* binding */ red; },
/* harmony export */   "simpleCheckForValidColor": function() { return /* binding */ simpleCheckForValidColor; },
/* harmony export */   "toState": function() { return /* binding */ toState; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_es_each__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es/each */ 2693);
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tinycolor2 */ 2129);
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tinycolor2__WEBPACK_IMPORTED_MODULE_1__);



var simpleCheckForValidColor = function simpleCheckForValidColor(data) {
  var keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v'];
  var checked = 0;
  var passed = 0;
  (0,lodash_es_each__WEBPACK_IMPORTED_MODULE_2__["default"])(keysToCheck, function (letter) {
    if (data[letter]) {
      checked += 1;

      if (!isNaN(data[letter])) {
        passed += 1;
      }

      if (letter === 's' || letter === 'l') {
        var percentPatt = /^\d+%$/;

        if (percentPatt.test(data[letter])) {
          passed += 1;
        }
      }
    }
  });
  return checked === passed ? data : false;
};
var toState = function toState(data, oldHue) {
  var color = data.hex ? tinycolor2__WEBPACK_IMPORTED_MODULE_1___default()(data.hex) : tinycolor2__WEBPACK_IMPORTED_MODULE_1___default()(data);
  var hsl = color.toHsl();
  var hsv = color.toHsv();
  var rgb = color.toRgb();
  var hex = color.toHex();

  if (hsl.s === 0) {
    hsl.h = oldHue || 0;
    hsv.h = oldHue || 0;
  }

  var transparent = hex === '000000' && rgb.a === 0;
  return {
    hsl: hsl,
    hex: transparent ? 'transparent' : '#' + hex,
    rgb: rgb,
    hsv: hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source
  };
};
var isValidHex = function isValidHex(hex) {
  if (hex === 'transparent') {
    return true;
  } // disable hex4 and hex8


  var lh = String(hex).charAt(0) === '#' ? 1 : 0;
  return hex.length !== 4 + lh && hex.length < 7 + lh && tinycolor2__WEBPACK_IMPORTED_MODULE_1___default()(hex).isValid();
};
var getContrastingColor = function getContrastingColor(data) {
  if (!data) {
    return '#fff';
  }

  var col = toState(data);

  if (col.hex === 'transparent') {
    return 'rgba(0,0,0,0.4)';
  }

  var yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
  return yiq >= 128 ? '#000' : '#fff';
};
var red = {
  hsl: {
    a: 1,
    h: 0,
    l: 0.5,
    s: 1
  },
  hex: '#ff0000',
  rgb: {
    r: 255,
    g: 0,
    b: 0,
    a: 1
  },
  hsv: {
    h: 0,
    s: 1,
    v: 1,
    a: 1
  }
};
var isvalidColorString = function isvalidColorString(string, type) {
  var stringWithoutDegree = string.replace('°', '');
  return tinycolor2__WEBPACK_IMPORTED_MODULE_1___default()(type + ' (' + stringWithoutDegree + ')')._ok;
};

/***/ }),

/***/ 2278:
/*!****************************************************!*\
  !*** ./node_modules/react-color/es/helpers/hue.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calculateChange": function() { return /* binding */ calculateChange; }
/* harmony export */ });
var calculateChange = function calculateChange(e, direction, hsl, container) {
  var containerWidth = container.clientWidth;
  var containerHeight = container.clientHeight;
  var x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
  var y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY;
  var left = x - (container.getBoundingClientRect().left + window.pageXOffset);
  var top = y - (container.getBoundingClientRect().top + window.pageYOffset);

  if (direction === 'vertical') {
    var h = void 0;

    if (top < 0) {
      h = 359;
    } else if (top > containerHeight) {
      h = 0;
    } else {
      var percent = -(top * 100 / containerHeight) + 100;
      h = 360 * percent / 100;
    }

    if (hsl.h !== h) {
      return {
        h: h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a,
        source: 'hsl'
      };
    }
  } else {
    var _h = void 0;

    if (left < 0) {
      _h = 0;
    } else if (left > containerWidth) {
      _h = 359;
    } else {
      var _percent = left * 100 / containerWidth;

      _h = 360 * _percent / 100;
    }

    if (hsl.h !== _h) {
      return {
        h: _h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a,
        source: 'hsl'
      };
    }
  }

  return null;
};

/***/ }),

/***/ 2280:
/*!************************************************************!*\
  !*** ./node_modules/react-color/es/helpers/interaction.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "handleFocus": function() { return /* binding */ handleFocus; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
/* eslint-disable no-invalid-this */



var handleFocus = function handleFocus(Component) {
  var Span = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'span';
  return function (_React$Component) {
    _inherits(Focus, _React$Component);

    function Focus() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Focus);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Focus.__proto__ || Object.getPrototypeOf(Focus)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        focus: false
      }, _this.handleFocus = function () {
        return _this.setState({
          focus: true
        });
      }, _this.handleBlur = function () {
        return _this.setState({
          focus: false
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Focus, [{
      key: 'render',
      value: function render() {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Span, {
          onFocus: this.handleFocus,
          onBlur: this.handleBlur
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _extends({}, this.props, this.state)));
      }
    }]);

    return Focus;
  }(react__WEBPACK_IMPORTED_MODULE_0__.Component);
};

/***/ }),

/***/ 2279:
/*!***********************************************************!*\
  !*** ./node_modules/react-color/es/helpers/saturation.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "calculateChange": function() { return /* binding */ calculateChange; }
/* harmony export */ });
var calculateChange = function calculateChange(e, hsl, container) {
  var _container$getBoundin = container.getBoundingClientRect(),
      containerWidth = _container$getBoundin.width,
      containerHeight = _container$getBoundin.height;

  var x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX;
  var y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY;
  var left = x - (container.getBoundingClientRect().left + window.pageXOffset);
  var top = y - (container.getBoundingClientRect().top + window.pageYOffset);

  if (left < 0) {
    left = 0;
  } else if (left > containerWidth) {
    left = containerWidth;
  }

  if (top < 0) {
    top = 0;
  } else if (top > containerHeight) {
    top = containerHeight;
  }

  var saturation = left / containerWidth;
  var bright = 1 - top / containerHeight;
  return {
    h: hsl.h,
    s: saturation,
    v: bright,
    a: hsl.a,
    source: 'hsv'
  };
};

/***/ }),

/***/ 948:
/*!**********************************************!*\
  !*** ./node_modules/react-color/es/index.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AlphaPicker": function() { return /* reexport safe */ _components_alpha_Alpha__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "BlockPicker": function() { return /* reexport safe */ _components_block_Block__WEBPACK_IMPORTED_MODULE_1__["default"]; },
/* harmony export */   "ChromePicker": function() { return /* reexport safe */ _components_chrome_Chrome__WEBPACK_IMPORTED_MODULE_3__["default"]; },
/* harmony export */   "CirclePicker": function() { return /* reexport safe */ _components_circle_Circle__WEBPACK_IMPORTED_MODULE_2__["default"]; },
/* harmony export */   "CompactPicker": function() { return /* reexport safe */ _components_compact_Compact__WEBPACK_IMPORTED_MODULE_4__["default"]; },
/* harmony export */   "CustomPicker": function() { return /* reexport safe */ _components_common_ColorWrap__WEBPACK_IMPORTED_MODULE_14__["default"]; },
/* harmony export */   "GithubPicker": function() { return /* reexport safe */ _components_github_Github__WEBPACK_IMPORTED_MODULE_5__["default"]; },
/* harmony export */   "GooglePicker": function() { return /* reexport safe */ _components_google_Google__WEBPACK_IMPORTED_MODULE_13__["default"]; },
/* harmony export */   "HuePicker": function() { return /* reexport safe */ _components_hue_Hue__WEBPACK_IMPORTED_MODULE_6__["default"]; },
/* harmony export */   "MaterialPicker": function() { return /* reexport safe */ _components_material_Material__WEBPACK_IMPORTED_MODULE_7__["default"]; },
/* harmony export */   "PhotoshopPicker": function() { return /* reexport safe */ _components_photoshop_Photoshop__WEBPACK_IMPORTED_MODULE_8__["default"]; },
/* harmony export */   "SketchPicker": function() { return /* reexport safe */ _components_sketch_Sketch__WEBPACK_IMPORTED_MODULE_9__["default"]; },
/* harmony export */   "SliderPicker": function() { return /* reexport safe */ _components_slider_Slider__WEBPACK_IMPORTED_MODULE_10__["default"]; },
/* harmony export */   "SwatchesPicker": function() { return /* reexport safe */ _components_swatches_Swatches__WEBPACK_IMPORTED_MODULE_11__["default"]; },
/* harmony export */   "TwitterPicker": function() { return /* reexport safe */ _components_twitter_Twitter__WEBPACK_IMPORTED_MODULE_12__["default"]; },
/* harmony export */   "default": function() { return /* reexport safe */ _components_chrome_Chrome__WEBPACK_IMPORTED_MODULE_3__["default"]; }
/* harmony export */ });
/* harmony import */ var _components_alpha_Alpha__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/alpha/Alpha */ 2162);
/* harmony import */ var _components_block_Block__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/block/Block */ 2199);
/* harmony import */ var _components_circle_Circle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/circle/Circle */ 2200);
/* harmony import */ var _components_chrome_Chrome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/chrome/Chrome */ 1390);
/* harmony import */ var _components_compact_Compact__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/compact/Compact */ 2202);
/* harmony import */ var _components_github_Github__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/github/Github */ 2203);
/* harmony import */ var _components_hue_Hue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/hue/Hue */ 1395);
/* harmony import */ var _components_material_Material__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/material/Material */ 2204);
/* harmony import */ var _components_photoshop_Photoshop__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/photoshop/Photoshop */ 1396);
/* harmony import */ var _components_sketch_Sketch__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/sketch/Sketch */ 2205);
/* harmony import */ var _components_slider_Slider__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/slider/Slider */ 1397);
/* harmony import */ var _components_swatches_Swatches__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/swatches/Swatches */ 2206);
/* harmony import */ var _components_twitter_Twitter__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/twitter/Twitter */ 1398);
/* harmony import */ var _components_google_Google__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/google/Google */ 2207);
/* harmony import */ var _components_common_ColorWrap__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/common/ColorWrap */ 918);


















/***/ }),

/***/ 2272:
/*!*************************************************!*\
  !*** ./node_modules/reactcss/lib/autoprefix.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.autoprefix = undefined;

var _forOwn2 = __webpack_require__(/*! lodash/forOwn */ 2110);

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var transforms = {
  borderRadius: function borderRadius(value) {
    return {
      msBorderRadius: value,
      MozBorderRadius: value,
      OBorderRadius: value,
      WebkitBorderRadius: value,
      borderRadius: value
    };
  },
  boxShadow: function boxShadow(value) {
    return {
      msBoxShadow: value,
      MozBoxShadow: value,
      OBoxShadow: value,
      WebkitBoxShadow: value,
      boxShadow: value
    };
  },
  userSelect: function userSelect(value) {
    return {
      WebkitTouchCallout: value,
      KhtmlUserSelect: value,
      MozUserSelect: value,
      msUserSelect: value,
      WebkitUserSelect: value,
      userSelect: value
    };
  },
  flex: function flex(value) {
    return {
      WebkitBoxFlex: value,
      MozBoxFlex: value,
      WebkitFlex: value,
      msFlex: value,
      flex: value
    };
  },
  flexBasis: function flexBasis(value) {
    return {
      WebkitFlexBasis: value,
      flexBasis: value
    };
  },
  justifyContent: function justifyContent(value) {
    return {
      WebkitJustifyContent: value,
      justifyContent: value
    };
  },
  transition: function transition(value) {
    return {
      msTransition: value,
      MozTransition: value,
      OTransition: value,
      WebkitTransition: value,
      transition: value
    };
  },
  transform: function transform(value) {
    return {
      msTransform: value,
      MozTransform: value,
      OTransform: value,
      WebkitTransform: value,
      transform: value
    };
  },
  absolute: function absolute(value) {
    var direction = value && value.split(' ');
    return {
      position: 'absolute',
      top: direction && direction[0],
      right: direction && direction[1],
      bottom: direction && direction[2],
      left: direction && direction[3]
    };
  },
  extend: function extend(name, otherElementStyles) {
    var otherStyle = otherElementStyles[name];

    if (otherStyle) {
      return otherStyle;
    }

    return {
      'extend': name
    };
  }
};

var autoprefix = exports.autoprefix = function autoprefix(elements) {
  var prefixed = {};
  (0, _forOwn3.default)(elements, function (styles, element) {
    var expanded = {};
    (0, _forOwn3.default)(styles, function (value, key) {
      var transform = transforms[key];

      if (transform) {
        expanded = _extends({}, expanded, transform(value));
      } else {
        expanded[key] = value;
      }
    });
    prefixed[element] = expanded;
  });
  return prefixed;
};

exports["default"] = autoprefix;

/***/ }),

/***/ 2274:
/*!********************************************************!*\
  !*** ./node_modules/reactcss/lib/components/active.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.active = undefined;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _react = __webpack_require__(/*! react */ 0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var active = exports.active = function active(Component) {
  var Span = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'span';
  return function (_React$Component) {
    _inherits(Active, _React$Component);

    function Active() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Active);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Active.__proto__ || Object.getPrototypeOf(Active)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        active: false
      }, _this.handleMouseDown = function () {
        return _this.setState({
          active: true
        });
      }, _this.handleMouseUp = function () {
        return _this.setState({
          active: false
        });
      }, _this.render = function () {
        return _react2.default.createElement(Span, {
          onMouseDown: _this.handleMouseDown,
          onMouseUp: _this.handleMouseUp
        }, _react2.default.createElement(Component, _extends({}, _this.props, _this.state)));
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Active;
  }(_react2.default.Component);
};

exports["default"] = active;

/***/ }),

/***/ 2273:
/*!*******************************************************!*\
  !*** ./node_modules/reactcss/lib/components/hover.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.hover = undefined;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var _react = __webpack_require__(/*! react */ 0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var hover = exports.hover = function hover(Component) {
  var Span = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'span';
  return function (_React$Component) {
    _inherits(Hover, _React$Component);

    function Hover() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, Hover);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Hover.__proto__ || Object.getPrototypeOf(Hover)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        hover: false
      }, _this.handleMouseOver = function () {
        return _this.setState({
          hover: true
        });
      }, _this.handleMouseOut = function () {
        return _this.setState({
          hover: false
        });
      }, _this.render = function () {
        return _react2.default.createElement(Span, {
          onMouseOver: _this.handleMouseOver,
          onMouseOut: _this.handleMouseOut
        }, _react2.default.createElement(Component, _extends({}, _this.props, _this.state)));
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    return Hover;
  }(_react2.default.Component);
};

exports["default"] = hover;

/***/ }),

/***/ 2270:
/*!***************************************************!*\
  !*** ./node_modules/reactcss/lib/flattenNames.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.flattenNames = undefined;

var _isString2 = __webpack_require__(/*! lodash/isString */ 2163);

var _isString3 = _interopRequireDefault(_isString2);

var _forOwn2 = __webpack_require__(/*! lodash/forOwn */ 2110);

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _isPlainObject2 = __webpack_require__(/*! lodash/isPlainObject */ 2165);

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _map2 = __webpack_require__(/*! lodash/map */ 2166);

var _map3 = _interopRequireDefault(_map2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var flattenNames = exports.flattenNames = function flattenNames() {
  var things = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var names = [];
  (0, _map3.default)(things, function (thing) {
    if (Array.isArray(thing)) {
      flattenNames(thing).map(function (name) {
        return names.push(name);
      });
    } else if ((0, _isPlainObject3.default)(thing)) {
      (0, _forOwn3.default)(thing, function (value, key) {
        value === true && names.push(key);
        names.push(key + '-' + value);
      });
    } else if ((0, _isString3.default)(thing)) {
      names.push(thing);
    }
  });
  return names;
};

exports["default"] = flattenNames;

/***/ }),

/***/ 2099:
/*!********************************************!*\
  !*** ./node_modules/reactcss/lib/index.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ReactCSS = exports.loop = exports.handleActive = exports.handleHover = exports.hover = undefined;

var _flattenNames = __webpack_require__(/*! ./flattenNames */ 2270);

var _flattenNames2 = _interopRequireDefault(_flattenNames);

var _mergeClasses = __webpack_require__(/*! ./mergeClasses */ 2271);

var _mergeClasses2 = _interopRequireDefault(_mergeClasses);

var _autoprefix = __webpack_require__(/*! ./autoprefix */ 2272);

var _autoprefix2 = _interopRequireDefault(_autoprefix);

var _hover2 = __webpack_require__(/*! ./components/hover */ 2273);

var _hover3 = _interopRequireDefault(_hover2);

var _active = __webpack_require__(/*! ./components/active */ 2274);

var _active2 = _interopRequireDefault(_active);

var _loop2 = __webpack_require__(/*! ./loop */ 2275);

var _loop3 = _interopRequireDefault(_loop2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

exports.hover = _hover3.default;
exports.handleHover = _hover3.default;
exports.handleActive = _active2.default;
exports.loop = _loop3.default;

var ReactCSS = exports.ReactCSS = function ReactCSS(classes) {
  for (var _len = arguments.length, activations = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    activations[_key - 1] = arguments[_key];
  }

  var activeNames = (0, _flattenNames2.default)(activations);
  var merged = (0, _mergeClasses2.default)(classes, activeNames);
  return (0, _autoprefix2.default)(merged);
};

exports["default"] = ReactCSS;

/***/ }),

/***/ 2275:
/*!*******************************************!*\
  !*** ./node_modules/reactcss/lib/loop.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var loopable = function loopable(i, length) {
  var props = {};

  var setProp = function setProp(name) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    props[name] = value;
  };

  i === 0 && setProp('first-child');
  i === length - 1 && setProp('last-child');
  (i === 0 || i % 2 === 0) && setProp('even');
  Math.abs(i % 2) === 1 && setProp('odd');
  setProp('nth-child', i);
  return props;
};

exports["default"] = loopable;

/***/ }),

/***/ 2271:
/*!***************************************************!*\
  !*** ./node_modules/reactcss/lib/mergeClasses.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.mergeClasses = undefined;

var _forOwn2 = __webpack_require__(/*! lodash/forOwn */ 2110);

var _forOwn3 = _interopRequireDefault(_forOwn2);

var _cloneDeep2 = __webpack_require__(/*! lodash/cloneDeep */ 2170);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

var mergeClasses = exports.mergeClasses = function mergeClasses(classes) {
  var activeNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var styles = classes.default && (0, _cloneDeep3.default)(classes.default) || {};
  activeNames.map(function (name) {
    var toMerge = classes[name];

    if (toMerge) {
      (0, _forOwn3.default)(toMerge, function (value, key) {
        if (!styles[key]) {
          styles[key] = {};
        }

        styles[key] = _extends({}, styles[key], toMerge[key]);
      });
    }

    return name;
  });
  return styles;
};

exports["default"] = mergeClasses;

/***/ }),

/***/ 2129:
/*!**********************************************!*\
  !*** ./node_modules/tinycolor2/tinycolor.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;__webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);

// TinyColor v1.4.2
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License
(function (Math) {
  var trimLeft = /^\s+/,
      trimRight = /\s+$/,
      tinyCounter = 0,
      mathRound = Math.round,
      mathMin = Math.min,
      mathMax = Math.max,
      mathRandom = Math.random;

  function tinycolor(color, opts) {
    color = color ? color : '';
    opts = opts || {}; // If input is already a tinycolor, return itself

    if (color instanceof tinycolor) {
      return color;
    } // If we are called as a function, call using new instead


    if (!(this instanceof tinycolor)) {
      return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = mathRound(100 * this._a) / 100, this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType; // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`

    if (this._r < 1) {
      this._r = mathRound(this._r);
    }

    if (this._g < 1) {
      this._g = mathRound(this._g);
    }

    if (this._b < 1) {
      this._b = mathRound(this._b);
    }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
  }

  tinycolor.prototype = {
    isDark: function () {
      return this.getBrightness() < 128;
    },
    isLight: function () {
      return !this.isDark();
    },
    isValid: function () {
      return this._ok;
    },
    getOriginalInput: function () {
      return this._originalInput;
    },
    getFormat: function () {
      return this._format;
    },
    getAlpha: function () {
      return this._a;
    },
    getBrightness: function () {
      //http://www.w3.org/TR/AERT#color-contrast
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function () {
      //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
      var rgb = this.toRgb();
      var RsRGB, GsRGB, BsRGB, R, G, B;
      RsRGB = rgb.r / 255;
      GsRGB = rgb.g / 255;
      BsRGB = rgb.b / 255;

      if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
      } else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }

      if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
      } else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }

      if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
      } else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }

      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    },
    setAlpha: function (value) {
      this._a = boundAlpha(value);
      this._roundA = mathRound(100 * this._a) / 100;
      return this;
    },
    toHsv: function () {
      var hsv = rgbToHsv(this._r, this._g, this._b);
      return {
        h: hsv.h * 360,
        s: hsv.s,
        v: hsv.v,
        a: this._a
      };
    },
    toHsvString: function () {
      var hsv = rgbToHsv(this._r, this._g, this._b);
      var h = mathRound(hsv.h * 360),
          s = mathRound(hsv.s * 100),
          v = mathRound(hsv.v * 100);
      return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
    },
    toHsl: function () {
      var hsl = rgbToHsl(this._r, this._g, this._b);
      return {
        h: hsl.h * 360,
        s: hsl.s,
        l: hsl.l,
        a: this._a
      };
    },
    toHslString: function () {
      var hsl = rgbToHsl(this._r, this._g, this._b);
      var h = mathRound(hsl.h * 360),
          s = mathRound(hsl.s * 100),
          l = mathRound(hsl.l * 100);
      return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
    },
    toHex: function (allow3Char) {
      return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function (allow3Char) {
      return '#' + this.toHex(allow3Char);
    },
    toHex8: function (allow4Char) {
      return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function (allow4Char) {
      return '#' + this.toHex8(allow4Char);
    },
    toRgb: function () {
      return {
        r: mathRound(this._r),
        g: mathRound(this._g),
        b: mathRound(this._b),
        a: this._a
      };
    },
    toRgbString: function () {
      return this._a == 1 ? "rgb(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" : "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function () {
      return {
        r: mathRound(bound01(this._r, 255) * 100) + "%",
        g: mathRound(bound01(this._g, 255) * 100) + "%",
        b: mathRound(bound01(this._b, 255) * 100) + "%",
        a: this._a
      };
    },
    toPercentageRgbString: function () {
      return this._a == 1 ? "rgb(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" : "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function () {
      if (this._a === 0) {
        return "transparent";
      }

      if (this._a < 1) {
        return false;
      }

      return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function (secondColor) {
      var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
      var secondHex8String = hex8String;
      var gradientType = this._gradientType ? "GradientType = 1, " : "";

      if (secondColor) {
        var s = tinycolor(secondColor);
        secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
      }

      return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
    },
    toString: function (format) {
      var formatSet = !!format;
      format = format || this._format;
      var formattedString = false;
      var hasAlpha = this._a < 1 && this._a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

      if (needsAlphaFormat) {
        // Special case for "transparent", all other non-alpha formats
        // will return rgba when there is transparency.
        if (format === "name" && this._a === 0) {
          return this.toName();
        }

        return this.toRgbString();
      }

      if (format === "rgb") {
        formattedString = this.toRgbString();
      }

      if (format === "prgb") {
        formattedString = this.toPercentageRgbString();
      }

      if (format === "hex" || format === "hex6") {
        formattedString = this.toHexString();
      }

      if (format === "hex3") {
        formattedString = this.toHexString(true);
      }

      if (format === "hex4") {
        formattedString = this.toHex8String(true);
      }

      if (format === "hex8") {
        formattedString = this.toHex8String();
      }

      if (format === "name") {
        formattedString = this.toName();
      }

      if (format === "hsl") {
        formattedString = this.toHslString();
      }

      if (format === "hsv") {
        formattedString = this.toHsvString();
      }

      return formattedString || this.toHexString();
    },
    clone: function () {
      return tinycolor(this.toString());
    },
    _applyModification: function (fn, args) {
      var color = fn.apply(null, [this].concat([].slice.call(args)));
      this._r = color._r;
      this._g = color._g;
      this._b = color._b;
      this.setAlpha(color._a);
      return this;
    },
    lighten: function () {
      return this._applyModification(lighten, arguments);
    },
    brighten: function () {
      return this._applyModification(brighten, arguments);
    },
    darken: function () {
      return this._applyModification(darken, arguments);
    },
    desaturate: function () {
      return this._applyModification(desaturate, arguments);
    },
    saturate: function () {
      return this._applyModification(saturate, arguments);
    },
    greyscale: function () {
      return this._applyModification(greyscale, arguments);
    },
    spin: function () {
      return this._applyModification(spin, arguments);
    },
    _applyCombination: function (fn, args) {
      return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function () {
      return this._applyCombination(analogous, arguments);
    },
    complement: function () {
      return this._applyCombination(complement, arguments);
    },
    monochromatic: function () {
      return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function () {
      return this._applyCombination(splitcomplement, arguments);
    },
    triad: function () {
      return this._applyCombination(triad, arguments);
    },
    tetrad: function () {
      return this._applyCombination(tetrad, arguments);
    }
  }; // If input is an object, force 1 into "1.0" to handle ratios properly
  // String input requires "1.0" as input, so 1 will be treated as 1

  tinycolor.fromRatio = function (color, opts) {
    if (typeof color == "object") {
      var newColor = {};

      for (var i in color) {
        if (color.hasOwnProperty(i)) {
          if (i === "a") {
            newColor[i] = color[i];
          } else {
            newColor[i] = convertToPercentage(color[i]);
          }
        }
      }

      color = newColor;
    }

    return tinycolor(color, opts);
  }; // Given a string or object, convert that input to RGB
  // Possible string inputs:
  //
  //     "red"
  //     "#f00" or "f00"
  //     "#ff0000" or "ff0000"
  //     "#ff000000" or "ff000000"
  //     "rgb 255 0 0" or "rgb (255, 0, 0)"
  //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
  //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
  //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
  //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
  //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
  //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
  //


  function inputToRGB(color) {
    var rgb = {
      r: 0,
      g: 0,
      b: 0
    };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
      color = stringInputToObject(color);
    }

    if (typeof color == "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
        format = "hsl";
      }

      if (color.hasOwnProperty("a")) {
        a = color.a;
      }
    }

    a = boundAlpha(a);
    return {
      ok: ok,
      format: color.format || format,
      r: mathMin(255, mathMax(rgb.r, 0)),
      g: mathMin(255, mathMax(rgb.g, 0)),
      b: mathMin(255, mathMax(rgb.b, 0)),
      a: a
    };
  } // Conversion Functions
  // --------------------
  // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
  // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
  // `rgbToRgb`
  // Handle bounds / percentage checking to conform to CSS color spec
  // <http://www.w3.org/TR/css3-color/>
  // *Assumes:* r, g, b in [0, 255] or [0, 1]
  // *Returns:* { r, g, b } in [0, 255]


  function rgbToRgb(r, g, b) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b, 255) * 255
    };
  } // `rgbToHsl`
  // Converts an RGB color value to HSL.
  // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
  // *Returns:* { h, s, l } in [0,1]


  function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = mathMax(r, g, b),
        min = mathMin(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: h,
      s: s,
      l: l
    };
  } // `hslToRgb`
  // Converts an HSL color value to RGB.
  // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
  // *Returns:* { r, g, b } in the set [0, 255]


  function hslToRgb(h, s, l) {
    var r, g, b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: r * 255,
      g: g * 255,
      b: b * 255
    };
  } // `rgbToHsv`
  // Converts an RGB color value to HSV
  // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
  // *Returns:* { h, s, v } in [0,1]


  function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = mathMax(r, g, b),
        min = mathMin(r, g, b);
    var h,
        s,
        v = max;
    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: h,
      s: s,
      v: v
    };
  } // `hsvToRgb`
  // Converts an HSV color value to RGB.
  // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
  // *Returns:* { r, g, b } in the set [0, 255]


  function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];
    return {
      r: r * 255,
      g: g * 255,
      b: b * 255
    };
  } // `rgbToHex`
  // Converts an RGB color to hex
  // Assumes r, g, and b are contained in the set [0, 255]
  // Returns a 3 or 6 character hex


  function rgbToHex(r, g, b, allow3Char) {
    var hex = [pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))]; // Return a 3 character hex if possible

    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
  } // `rgbaToHex`
  // Converts an RGBA color plus alpha transparency to hex
  // Assumes r, g, b are contained in the set [0, 255] and
  // a in [0, 1]. Returns a 4 or 8 character rgba hex


  function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16)), pad2(convertDecimalToHex(a))]; // Return a 4 character hex if possible

    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
  } // `rgbaToArgbHex`
  // Converts an RGBA color to an ARGB Hex8 string
  // Rarely used, but required for "toFilter()"


  function rgbaToArgbHex(r, g, b, a) {
    var hex = [pad2(convertDecimalToHex(a)), pad2(mathRound(r).toString(16)), pad2(mathRound(g).toString(16)), pad2(mathRound(b).toString(16))];
    return hex.join("");
  } // `equals`
  // Can be called with any tinycolor input


  tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) {
      return false;
    }

    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
  };

  tinycolor.random = function () {
    return tinycolor.fromRatio({
      r: mathRandom(),
      g: mathRandom(),
      b: mathRandom()
    });
  }; // Modification Functions
  // ----------------------
  // Thanks to less.js for some of the basics here
  // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>


  function desaturate(color, amount) {
    amount = amount === 0 ? 0 : amount || 10;
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
  }

  function saturate(color, amount) {
    amount = amount === 0 ? 0 : amount || 10;
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
  }

  function greyscale(color) {
    return tinycolor(color).desaturate(100);
  }

  function lighten(color, amount) {
    amount = amount === 0 ? 0 : amount || 10;
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
  }

  function brighten(color, amount) {
    amount = amount === 0 ? 0 : amount || 10;
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * -(amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * -(amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * -(amount / 100))));
    return tinycolor(rgb);
  }

  function darken(color, amount) {
    amount = amount === 0 ? 0 : amount || 10;
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
  } // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
  // Values outside of this range will be wrapped into this range.


  function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
  } // Combination Functions
  // ---------------------
  // Thanks to jQuery xColor for some of the ideas behind these
  // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>


  function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
  }

  function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [tinycolor(color), tinycolor({
      h: (h + 120) % 360,
      s: hsl.s,
      l: hsl.l
    }), tinycolor({
      h: (h + 240) % 360,
      s: hsl.s,
      l: hsl.l
    })];
  }

  function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [tinycolor(color), tinycolor({
      h: (h + 90) % 360,
      s: hsl.s,
      l: hsl.l
    }), tinycolor({
      h: (h + 180) % 360,
      s: hsl.s,
      l: hsl.l
    }), tinycolor({
      h: (h + 270) % 360,
      s: hsl.s,
      l: hsl.l
    })];
  }

  function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [tinycolor(color), tinycolor({
      h: (h + 72) % 360,
      s: hsl.s,
      l: hsl.l
    }), tinycolor({
      h: (h + 216) % 360,
      s: hsl.s,
      l: hsl.l
    })];
  }

  function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;
    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(tinycolor(hsl));
    }

    return ret;
  }

  function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h,
        s = hsv.s,
        v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
      ret.push(tinycolor({
        h: h,
        s: s,
        v: v
      }));
      v = (v + modification) % 1;
    }

    return ret;
  } // Utility Functions
  // ---------------------


  tinycolor.mix = function (color1, color2, amount) {
    amount = amount === 0 ? 0 : amount || 50;
    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();
    var p = amount / 100;
    var rgba = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b,
      a: (rgb2.a - rgb1.a) * p + rgb1.a
    };
    return tinycolor(rgba);
  }; // Readability Functions
  // ---------------------
  // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)
  // `contrast`
  // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)


  tinycolor.readability = function (color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
  }; // `isReadable`
  // Ensure that foreground and background color combinations meet WCAG2 guidelines.
  // The third argument is an optional Object.
  //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
  //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
  // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
  // *Example*
  //    tinycolor.isReadable("#000", "#111") => false
  //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false


  tinycolor.isReadable = function (color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;
    out = false;
    wcag2Parms = validateWCAG2Parms(wcag2);

    switch (wcag2Parms.level + wcag2Parms.size) {
      case "AAsmall":
      case "AAAlarge":
        out = readability >= 4.5;
        break;

      case "AAlarge":
        out = readability >= 3;
        break;

      case "AAAsmall":
        out = readability >= 7;
        break;
    }

    return out;
  }; // `mostReadable`
  // Given a base color and a list of possible foreground or background
  // colors for that base, returns the most readable color.
  // Optionally returns Black or White if the most readable color is unreadable.
  // *Example*
  //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
  //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
  //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
  //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"


  tinycolor.mostReadable = function (baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors;
    level = args.level;
    size = args.size;

    for (var i = 0; i < colorList.length; i++) {
      readability = tinycolor.readability(baseColor, colorList[i]);

      if (readability > bestScore) {
        bestScore = readability;
        bestColor = tinycolor(colorList[i]);
      }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {
      "level": level,
      "size": size
    }) || !includeFallbackColors) {
      return bestColor;
    } else {
      args.includeFallbackColors = false;
      return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
    }
  }; // Big List of Colors
  // ------------------
  // <http://www.w3.org/TR/css3-color/#svg-color>


  var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
  }; // Make it easy to access colors via `hexNames[hex]`

  var hexNames = tinycolor.hexNames = flip(names); // Utilities
  // ---------
  // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`

  function flip(o) {
    var flipped = {};

    for (var i in o) {
      if (o.hasOwnProperty(i)) {
        flipped[o[i]] = i;
      }
    }

    return flipped;
  } // Return a valid alpha value [0,1] with all invalid values being set to 1


  function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }

    return a;
  } // Take input from [0, n] and return it as [0, 1]


  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n))); // Automatically convert percentage into number

    if (processPercent) {
      n = parseInt(n * max, 10) / 100;
    } // Handle floating point rounding errors


    if (Math.abs(n - max) < 0.000001) {
      return 1;
    } // Convert into [0, 1] range if it isn't already


    return n % max / parseFloat(max);
  } // Force a number between 0 and 1


  function clamp01(val) {
    return mathMin(1, mathMax(0, val));
  } // Parse a base-16 hex value into a base-10 integer


  function parseIntFromHex(val) {
    return parseInt(val, 16);
  } // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
  // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>


  function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
  } // Check to see if string passed in is a percentage


  function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
  } // Force a hex value to have 2 characters


  function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
  } // Replace a decimal with it's percentage value


  function convertToPercentage(n) {
    if (n <= 1) {
      n = n * 100 + "%";
    }

    return n;
  } // Converts a decimal to a hex value


  function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
  } // Converts a hex value to a decimal


  function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
  }

  var matchers = function () {
    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?"; // <http://www.w3.org/TR/css3-values/#number-value>

    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?"; // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.

    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")"; // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren

    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    return {
      CSS_UNIT: new RegExp(CSS_UNIT),
      rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
      rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
      hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
      hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
      hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
      hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
      hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
  }(); // `isValidCSSUnit`
  // Take in a single string / number and check to see if it looks like a CSS unit
  // (see `matchers` above for definition).


  function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
  } // `stringInputToObject`
  // Permissive string parsing.  Take in a number of formats, and output an object
  // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`


  function stringInputToObject(color) {
    color = color.replace(trimLeft, '').replace(trimRight, '').toLowerCase();
    var named = false;

    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color == 'transparent') {
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
        format: "name"
      };
    } // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.


    var match;

    if (match = matchers.rgb.exec(color)) {
      return {
        r: match[1],
        g: match[2],
        b: match[3]
      };
    }

    if (match = matchers.rgba.exec(color)) {
      return {
        r: match[1],
        g: match[2],
        b: match[3],
        a: match[4]
      };
    }

    if (match = matchers.hsl.exec(color)) {
      return {
        h: match[1],
        s: match[2],
        l: match[3]
      };
    }

    if (match = matchers.hsla.exec(color)) {
      return {
        h: match[1],
        s: match[2],
        l: match[3],
        a: match[4]
      };
    }

    if (match = matchers.hsv.exec(color)) {
      return {
        h: match[1],
        s: match[2],
        v: match[3]
      };
    }

    if (match = matchers.hsva.exec(color)) {
      return {
        h: match[1],
        s: match[2],
        v: match[3],
        a: match[4]
      };
    }

    if (match = matchers.hex8.exec(color)) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }

    if (match = matchers.hex6.exec(color)) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }

    if (match = matchers.hex4.exec(color)) {
      return {
        r: parseIntFromHex(match[1] + '' + match[1]),
        g: parseIntFromHex(match[2] + '' + match[2]),
        b: parseIntFromHex(match[3] + '' + match[3]),
        a: convertHexToDecimal(match[4] + '' + match[4]),
        format: named ? "name" : "hex8"
      };
    }

    if (match = matchers.hex3.exec(color)) {
      return {
        r: parseIntFromHex(match[1] + '' + match[1]),
        g: parseIntFromHex(match[2] + '' + match[2]),
        b: parseIntFromHex(match[3] + '' + match[3]),
        format: named ? "name" : "hex"
      };
    }

    return false;
  }

  function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {
      "level": "AA",
      "size": "small"
    };
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();

    if (level !== "AA" && level !== "AAA") {
      level = "AA";
    }

    if (size !== "small" && size !== "large") {
      size = "small";
    }

    return {
      "level": level,
      "size": size
    };
  } // Node: Export function


  if ( true && module.exports) {
    module.exports = tinycolor;
  } // AMD/requirejs: Define the module
  else if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return tinycolor;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } // Browser: Expose to window
  else {}
})(Math);

/***/ }),

/***/ 2269:
/*!*************************************************************************!*\
  !*** ./app/soapbox/features/soapbox_config/components/color-picker.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var detect_passive_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! detect-passive-events */ 2581);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-color */ 948);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/is_mobile */ 251);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/soapbox_config/components/color-picker.tsx";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols);
} return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); });
} return target; }
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }




var listenerOptions = detect_passive_events__WEBPACK_IMPORTED_MODULE_3__.supportsPassiveEvents ? {
    passive: true
} : false;
var ColorPicker = function (_ref) {
    var style = _ref.style, value = _ref.value, onClose = _ref.onClose, onChange = _ref.onChange;
    var node = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var handleDocumentClick = function (e) {
        if (node.current && !node.current.contains(e.target)) {
            onClose();
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        document.addEventListener('click', handleDocumentClick, false);
        document.addEventListener('touchend', handleDocumentClick, listenerOptions);
        return function () {
            document.removeEventListener('click', handleDocumentClick, false);
            document.removeEventListener('touchend', handleDocumentClick);
        };
    }, []);
    var pickerStyle = _objectSpread(_objectSpread({}, style), {}, {
        marginLeft: (0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_2__.isMobile)(window.innerWidth) ? '20px' : '12px',
        position: 'absolute',
        zIndex: 1000
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        id: "SketchPickerContainer",
        ref: node,
        style: pickerStyle,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_color__WEBPACK_IMPORTED_MODULE_1__.SketchPicker, {
        color: value,
        disableAlpha: true,
        onChange: onChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ColorPicker);


/***/ }),

/***/ 2268:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/soapbox_config/components/color-with-picker.tsx ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_overlays_lib_Overlay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-overlays/lib/Overlay */ 371);
/* harmony import */ var react_overlays_lib_Overlay__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_overlays_lib_Overlay__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/is_mobile */ 251);
/* harmony import */ var _color_picker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./color-picker */ 2269);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/soapbox_config/components/color-with-picker.tsx";

 // @ts-ignore: TODO: upgrade react-overlays. v3.1 and above have TS definitions



var ColorWithPicker = function (_ref) {
    var buttonId = _ref.buttonId, value = _ref.value, onChange = _ref.onChange;
    var node = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), active = _a[0], setActive = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null), placement = _b[0], setPlacement = _b[1];
    var hidePicker = function () {
        setActive(false);
    };
    var showPicker = function () {
        setActive(true);
        setPlacement((0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_3__.isMobile)(window.innerWidth) ? 'bottom' : 'right');
    };
    var onToggle = function (e) {
        if (active) {
            hidePicker();
        }
        else {
            showPicker();
        }
        e.stopPropagation();
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        ref: node,
        id: buttonId,
        className: "w-8 h-8 rounded-md",
        role: "presentation",
        style: {
            background: value
        },
        title: value,
        onClick: onToggle,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement((react_overlays_lib_Overlay__WEBPACK_IMPORTED_MODULE_2___default()), {
        show: active,
        placement: placement,
        target: node.current,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_color_picker__WEBPACK_IMPORTED_MODULE_4__["default"], {
        value: value,
        onChange: onChange,
        onClose: hidePicker,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ColorWithPicker);


/***/ }),

/***/ 2308:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/soapbox_config/components/footer-link-input.tsx ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/soapbox_config/components/footer-link-input.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    label: {
        "id": "soapbox_config.home_footer.meta_fields.label_placeholder",
        "defaultMessage": "Label"
    },
    url: {
        "id": "soapbox_config.home_footer.meta_fields.url_placeholder",
        "defaultMessage": "URL"
    }
});
var PromoPanelInput = function (_ref) {
    var value = _ref.value, onChange = _ref.onChange;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])();
    var handleChange = function (key) {
        return function (e) {
            onChange(value.set(key, e.currentTarget.value));
        };
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.HStack, {
        space: 2,
        grow: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
        type: "text",
        outerClassName: "w-full flex-grow",
        placeholder: intl.formatMessage(messages.label),
        value: value.title,
        onChange: handleChange('title'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
        type: "text",
        outerClassName: "w-full flex-grow",
        placeholder: intl.formatMessage(messages.url),
        value: value.url,
        onChange: handleChange('url'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (PromoPanelInput);


/***/ }),

/***/ 2310:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/soapbox_config/components/icon-picker.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_emoji_picker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/emoji_picker */ 838);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/soapbox_config/components/icon-picker.tsx";


var IconPicker = function (_ref) {
    var value = _ref.value, onChange = _ref.onChange;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mt-1 relative rounded-md shadow-sm dark:bg-slate-800 border border-solid border-gray-300 dark:border-gray-600 rounded-md",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 14,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_emoji_picker__WEBPACK_IMPORTED_MODULE_1__["default"], {
        button: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "grayscale h-[38px] w-[38px] text-lg flex items-center justify-center cursor-pointer",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 15,
                columnNumber: 28
            }
        }, value),
        onPickEmoji: onChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (IconPicker);


/***/ }),

/***/ 2309:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/soapbox_config/components/promo-panel-input.tsx ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var _icon_picker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./icon-picker */ 2310);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/soapbox_config/components/promo-panel-input.tsx";




var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__.defineMessages)({
    icon: {
        "id": "soapbox_config.promo_panel.meta_fields.icon_placeholder",
        "defaultMessage": "Icon"
    },
    label: {
        "id": "soapbox_config.promo_panel.meta_fields.label_placeholder",
        "defaultMessage": "Label"
    },
    url: {
        "id": "soapbox_config.promo_panel.meta_fields.url_placeholder",
        "defaultMessage": "URL"
    }
});
var PromoPanelInput = function (_ref) {
    var value = _ref.value, onChange = _ref.onChange;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var handleIconChange = function (icon) {
        onChange(value.set('icon', icon.native));
    };
    var handleChange = function (key) {
        return function (e) {
            onChange(value.set(key, e.currentTarget.value));
        };
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.HStack, {
        space: 2,
        alignItems: "center",
        grow: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icon_picker__WEBPACK_IMPORTED_MODULE_2__["default"], {
        value: value.icon,
        onChange: handleIconChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
        type: "text",
        outerClassName: "w-full flex-grow",
        placeholder: intl.formatMessage(messages.label),
        value: value.text,
        onChange: handleChange('text'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Input, {
        type: "text",
        outerClassName: "w-full flex-grow",
        placeholder: intl.formatMessage(messages.url),
        value: value.url,
        onChange: handleChange('url'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (PromoPanelInput);


/***/ }),

/***/ 2311:
/*!*************************************************************************!*\
  !*** ./app/soapbox/features/soapbox_config/components/site-preview.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/settings */ 22);
/* harmony import */ var soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/site-logo */ 358);
/* harmony import */ var soapbox_features_ui_components_background_shapes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/ui/components/background_shapes */ 1512);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_normalizers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/normalizers */ 33);
/* harmony import */ var soapbox_utils_theme__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/utils/theme */ 379);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/soapbox_config/components/site-preview.tsx";









/** Renders a preview of the website's style with the configuration applied. */
var SitePreview = function (_ref) {
    var soapbox = _ref.soapbox;
    var soapboxConfig = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return (0,soapbox_normalizers__WEBPACK_IMPORTED_MODULE_6__.normalizeSoapboxConfig)(soapbox); }, [soapbox]);
    var settings = soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_2__.defaultSettings.mergeDeep(soapboxConfig.defaultSettings);
    var userTheme = settings.get('themeMode');
    var systemTheme = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useSystemTheme)();
    var dark = userTheme === 'dark' || userTheme === 'system' && systemTheme === 'dark';
    var bodyClass = classnames__WEBPACK_IMPORTED_MODULE_0___default()('site-preview', 'relative flex justify-center align-center text-base', 'border border-solid border-gray-200 dark:border-slate-600', 'h-40 rounded-lg overflow-hidden', {
        'bg-white': !dark,
        'bg-slate-900': dark
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: bodyClass,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("style", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 7
        }
    }, ".site-preview {".concat((0,soapbox_utils_theme__WEBPACK_IMPORTED_MODULE_7__.generateThemeCss)(soapboxConfig), "}")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_background_shapes__WEBPACK_IMPORTED_MODULE_4__["default"], {
        position: "absolute",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "absolute p-2 rounded-lg overflow-hidden bg-accent-500 text-white self-center z-20",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "site_preview.preview",
        defaultMessage: "Preview",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('flex items-center absolute inset-0 shadow z-10 h-12 lg:h-16', {
            'bg-white': !dark,
            'bg-slate-800': dark
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_3__["default"], {
        alt: "Logo",
        className: "h-5 lg:h-6 w-auto self-center px-2",
        theme: dark ? 'dark' : 'light',
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (SitePreview);


/***/ }),

/***/ 2038:
/*!*******************************************************!*\
  !*** ./app/soapbox/features/soapbox_config/index.tsx ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/admin */ 77);
/* harmony import */ var soapbox_actions_media__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/media */ 498);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 24);
/* harmony import */ var soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/list */ 689);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_components_ui_streamfield_streamfield__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui/streamfield/streamfield */ 1833);
/* harmony import */ var soapbox_features_ui_components_theme_selector__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/features/ui/components/theme-selector */ 1503);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_normalizers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/normalizers */ 33);
/* harmony import */ var _ui_components_accordion__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ui/components/accordion */ 1825);
/* harmony import */ var _components_color_with_picker__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/color-with-picker */ 2268);
/* harmony import */ var _components_footer_link_input__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/footer-link-input */ 2308);
/* harmony import */ var _components_promo_panel_input__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/promo-panel-input */ 2309);
/* harmony import */ var _components_site_preview__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/site-preview */ 2311);
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/soapbox_config/index.tsx";


















var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_16__.defineMessages)({
    heading: {
        "id": "column.soapbox_config",
        "defaultMessage": "Soapbox config"
    },
    saved: {
        "id": "soapbox_config.saved",
        "defaultMessage": "Soapbox config saved!"
    },
    copyrightFooterLabel: {
        "id": "soapbox_config.copyright_footer.meta_fields.label_placeholder",
        "defaultMessage": "Copyright footer"
    },
    cryptoDonatePanelLimitLabel: {
        "id": "soapbox_config.crypto_donate_panel_limit.meta_fields.limit_placeholder",
        "defaultMessage": "Number of items to display in the crypto homepage widget"
    },
    customCssLabel: {
        "id": "soapbox_config.custom_css.meta_fields.url_placeholder",
        "defaultMessage": "URL"
    },
    rawJSONLabel: {
        "id": "soapbox_config.raw_json_label",
        "defaultMessage": "Advanced: Edit raw JSON data"
    },
    rawJSONHint: {
        "id": "soapbox_config.raw_json_hint",
        "defaultMessage": "Edit the settings data directly. Changes made directly to the JSON file will override the form fields above. Click \"Save\" to apply your changes."
    },
    verifiedCanEditNameLabel: {
        "id": "soapbox_config.verified_can_edit_name_label",
        "defaultMessage": "Allow verified users to edit their own display name."
    },
    displayFqnLabel: {
        "id": "soapbox_config.display_fqn_label",
        "defaultMessage": "Display domain (eg @user@domain) for local accounts."
    },
    greentextLabel: {
        "id": "soapbox_config.greentext_label",
        "defaultMessage": "Enable greentext support"
    },
    quoteRT: {
        "id": "soapbox_config.quote_rt",
        "defaultMessage": "Enable Quote RT"
    },
    promoPanelIconsLink: {
        "id": "soapbox_config.hints.promo_panel_icons.link",
        "defaultMessage": "Soapbox Icons List"
    },
    authenticatedProfileLabel: {
        "id": "soapbox_config.authenticated_profile_label",
        "defaultMessage": "Profiles require authentication"
    },
    authenticatedProfileHint: {
        "id": "soapbox_config.authenticated_profile_hint",
        "defaultMessage": "Users must be logged-in to view replies and media on user profiles."
    },
    singleUserModeLabel: {
        "id": "soapbox_config.single_user_mode_label",
        "defaultMessage": "Single user mode"
    },
    singleUserModeHint: {
        "id": "soapbox_config.single_user_mode_hint",
        "defaultMessage": "Front page will redirect to a given user profile."
    },
    singleUserModeProfileLabel: {
        "id": "soapbox_config.single_user_mode_profile_label",
        "defaultMessage": "Main user handle"
    },
    singleUserModeProfileHint: {
        "id": "soapbox_config.single_user_mode_profile_hint",
        "defaultMessage": "@handle"
    },
    homeDescription: {
        "id": "soapbox_config.home_description",
        "defaultMessage": "Instance's description shown in Home page. Supports HTML. Use [users] to insert the number of current users on the instance."
    }
});
var templates = {
    promoPanelItem: (0,immutable__WEBPACK_IMPORTED_MODULE_17__.Map)({
        icon: '',
        text: '',
        url: ''
    }),
    footerItem: (0,immutable__WEBPACK_IMPORTED_MODULE_17__.Map)({
        title: '',
        url: ''
    }),
    cryptoAddress: (0,immutable__WEBPACK_IMPORTED_MODULE_17__.Map)({
        ticker: '',
        address: '',
        note: ''
    })
};
var SoapboxConfig = function () {
    var _soapbox$navlinks$get;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_18__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppDispatch)();
    var initialData = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.soapbox; });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), isLoading = _a[0], setLoading = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialData), data = _b[0], setData = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), jsonEditorExpanded = _c[0], setJsonEditorExpanded = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(JSON.stringify(initialData, null, 2)), rawJSON = _d[0], setRawJSON = _d[1];
    var _e = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), jsonValid = _e[0], setJsonValid = _e[1];
    var soapbox = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () {
        return (0,soapbox_normalizers__WEBPACK_IMPORTED_MODULE_10__.normalizeSoapboxConfig)(data);
    }, [data]);
    var setConfig = function (path, value) {
        var newData = data.setIn(path, value);
        setData(newData);
        setJsonValid(true);
    };
    var putConfig = function (newData) {
        setData(newData);
        setJsonValid(true);
    };
    var getParams = function () {
        return [{
                group: ':pleroma',
                key: ':frontend_configurations',
                value: [{
                        tuple: [':soapbox_fe', data.toJS()]
                    }]
            }];
    };
    var handleSubmit = function (e) {
        dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__.updateConfig)(getParams())).then(function () {
            setLoading(false);
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(intl.formatMessage(messages.saved)));
        }).catch(function () {
            setLoading(false);
        });
        setLoading(true);
        e.preventDefault();
    };
    var handleChange = function (path, getValue) {
        return function (e) {
            setConfig(path, getValue(e));
        };
    };
    var handleThemeChange = function (path) {
        return function (theme) {
            setConfig(path, theme);
        };
    };
    var handleColorChange = function (path, getValue) {
        return function (color, event) {
            setConfig(path, getValue(color, event));
        };
    };
    var handleFileChange = function (path) {
        return function (e) {
            var _e$target$files;
            var data = new FormData();
            var file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files.item(0);
            if (file) {
                data.append('file', file);
                dispatch((0,soapbox_actions_media__WEBPACK_IMPORTED_MODULE_3__.uploadMedia)(data)).then(function (_ref) {
                    var data = _ref.data;
                    handleChange(path, function () { return data.url; })(e);
                }).catch(console.error);
            }
        };
    };
    var handleStreamItemChange = function (path) {
        return function (values) {
            setConfig(path, (0,immutable__WEBPACK_IMPORTED_MODULE_17__.List)(values));
        };
    };
    var addStreamItem = function (path, template) {
        return function () {
            var items = data.getIn(path) || (0,immutable__WEBPACK_IMPORTED_MODULE_17__.List)();
            setConfig(path, items.push(template));
        };
    };
    var deleteStreamItem = function (path) {
        return function (i) {
            var newData = data.deleteIn(__spreadArray(__spreadArray([], path, true), [i], false));
            setData(newData);
        };
    };
    var handleEditJSON = function (e) {
        setRawJSON(e.target.value);
    };
    var toggleJSONEditor = function (expanded) { return setJsonEditorExpanded(expanded); };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        putConfig(initialData);
    }, [initialData]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        setRawJSON(JSON.stringify(data, null, 2));
    }, [data]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        try {
            var data_1 = (0,immutable__WEBPACK_IMPORTED_MODULE_17__.fromJS)(JSON.parse(rawJSON));
            putConfig(data_1);
        }
        catch (_a) {
            setJsonValid(false);
        }
    }, [rawJSON]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Column, {
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 196,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 197,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("fieldset", {
        className: "space-y-6",
        disabled: isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 198,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_site_preview__WEBPACK_IMPORTED_MODULE_15__["default"], {
        soapbox: soapbox,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 199,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.fields.logo_label",
            defaultMessage: "Logo",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 202,
                columnNumber: 24
            }
        }),
        hintText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.hints.logo",
            defaultMessage: "SVG. At most 2 MB. Will be displayed to 50px height, maintaining aspect ratio",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 203,
                columnNumber: 23
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 201,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FileInput, {
        onChange: handleFileChange(['logo']),
        accept: "image/svg+xml",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 205,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 211,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardTitle, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.headings.theme",
            defaultMessage: "Theme",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 212,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 212,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 215,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.fields.theme_label",
            defaultMessage: "Default theme",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 216,
                columnNumber: 30
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 216,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_theme_selector__WEBPACK_IMPORTED_MODULE_8__["default"], {
        value: soapbox.defaultSettings.get('themeMode'),
        onChange: handleThemeChange(['defaultSettings', 'themeMode']),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 217,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.fields.brand_color_label",
            defaultMessage: "Brand color",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 223,
                columnNumber: 30
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 223,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_color_with_picker__WEBPACK_IMPORTED_MODULE_12__["default"], {
        buttonId: "brandColor",
        value: soapbox.brandColor,
        onChange: handleColorChange(['brandColor'], function (color) { return color.hex; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 224,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.fields.accent_color_label",
            defaultMessage: "Accent color",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 231,
                columnNumber: 30
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 231,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_color_with_picker__WEBPACK_IMPORTED_MODULE_12__["default"], {
        buttonId: "accentColor",
        value: soapbox.accentColor,
        onChange: handleColorChange(['accentColor'], function (color) { return color.hex; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 232,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 240,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardTitle, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.headings.options",
            defaultMessage: "Options",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 241,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 241,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 244,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: intl.formatMessage(messages.verifiedCanEditNameLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 245,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Toggle, {
        checked: soapbox.verifiedCanEditName === true,
        onChange: handleChange(['verifiedCanEditName'], function (e) { return e.target.checked; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 246,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: intl.formatMessage(messages.displayFqnLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 252,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Toggle, {
        checked: soapbox.displayFqn === true,
        onChange: handleChange(['displayFqn'], function (e) { return e.target.checked; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 253,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: intl.formatMessage(messages.greentextLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 259,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Toggle, {
        checked: soapbox.greentext === true,
        onChange: handleChange(['greentext'], function (e) { return e.target.checked; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 260,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: intl.formatMessage(messages.quoteRT),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 266,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Toggle, {
        checked: soapbox.quotePosts === true,
        onChange: handleChange(['quotePosts'], function (e) { return e.target.checked; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 267,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: intl.formatMessage(messages.authenticatedProfileLabel),
        hint: intl.formatMessage(messages.authenticatedProfileHint),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 273,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Toggle, {
        checked: soapbox.authenticatedProfile === true,
        onChange: handleChange(['authenticatedProfile'], function (e) { return e.target.checked; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 277,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: intl.formatMessage(messages.singleUserModeLabel),
        hint: intl.formatMessage(messages.singleUserModeHint),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 283,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Toggle, {
        checked: soapbox.singleUserMode === true,
        onChange: handleChange(['singleUserMode'], function (e) { return e.target.checked; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 287,
            columnNumber: 15
        }
    })), soapbox.get('singleUserMode') && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: intl.formatMessage(messages.singleUserModeProfileLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 294,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Input, {
        type: "text",
        placeholder: intl.formatMessage(messages.singleUserModeProfileHint),
        value: soapbox.singleUserModeProfile,
        onChange: handleChange(['singleUserModeProfile'], function (e) { return e.target.value; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 295,
            columnNumber: 17
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 305,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardTitle, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.headings.home",
            defaultMessage: "Home",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 306,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 306,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: intl.formatMessage(messages.homeDescription),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 309,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Textarea, {
        placeholder: intl.formatMessage(messages.homeDescription),
        isCodeEditor: true,
        value: soapbox.homeDescription,
        onChange: handleChange(['homeDescription'], function (e) { return e.target.value; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 310,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 318,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardTitle, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.headings.navigation",
            defaultMessage: "Navigation",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 319,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 319,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui_streamfield_streamfield__WEBPACK_IMPORTED_MODULE_7__["default"], {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.fields.promo_panel_fields_label",
            defaultMessage: "Promo panel items",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 323,
                columnNumber: 20
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.hints.promo_panel_fields",
            defaultMessage: "You can have custom defined links displayed on the right panel of the timelines page.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 324,
                columnNumber: 19
            }
        }),
        component: _components_promo_panel_input__WEBPACK_IMPORTED_MODULE_14__["default"],
        values: soapbox.promoPanel.items.toArray(),
        onChange: handleStreamItemChange(['promoPanel', 'items']),
        onAddItem: addStreamItem(['promoPanel', 'items'], templates.promoPanel),
        onRemoveItem: deleteStreamItem(['promoPanel', 'items']),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 322,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui_streamfield_streamfield__WEBPACK_IMPORTED_MODULE_7__["default"], {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.fields.home_footer_fields_label",
            defaultMessage: "Home footer items",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 333,
                columnNumber: 20
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.hints.home_footer_fields",
            defaultMessage: "You can have custom defined links displayed on the footer of your static pages",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 334,
                columnNumber: 19
            }
        }),
        component: _components_footer_link_input__WEBPACK_IMPORTED_MODULE_13__["default"],
        values: ((_soapbox$navlinks$get = soapbox.navlinks.get('homeFooter')) === null || _soapbox$navlinks$get === void 0 ? void 0 : _soapbox$navlinks$get.toArray()) || [],
        onChange: handleStreamItemChange(['navlinks', 'homeFooter']),
        onAddItem: addStreamItem(['navlinks', 'homeFooter'], templates.footerItem),
        onRemoveItem: deleteStreamItem(['navlinks', 'homeFooter']),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 332,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: intl.formatMessage(messages.copyrightFooterLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 342,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Input, {
        type: "text",
        placeholder: intl.formatMessage(messages.copyrightFooterLabel),
        value: soapbox.copyright,
        onChange: handleChange(['copyright'], function (e) { return e.target.value; }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 343,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 351,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardTitle, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
            id: "soapbox_config.headings.advanced",
            defaultMessage: "Advanced",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 352,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 352,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui_components_accordion__WEBPACK_IMPORTED_MODULE_11__["default"], {
        headline: intl.formatMessage(messages.rawJSONLabel),
        expanded: jsonEditorExpanded,
        onToggle: toggleJSONEditor,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 355,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        hintText: intl.formatMessage(messages.rawJSONHint),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 360,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Textarea, {
        value: rawJSON,
        onChange: handleEditJSON,
        hasError: !jsonValid,
        isCodeEditor: true,
        rows: 12,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 361,
            columnNumber: 15
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 372,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        type: "submit",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 373,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
        id: "soapbox_config.save",
        defaultMessage: "Save",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 374,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (SoapboxConfig);


/***/ }),

/***/ 2725:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_DataView.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ 2597);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ 2603);


/* Built-in method references that are verified to be native. */

var DataView = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'DataView');
/* harmony default export */ __webpack_exports__["default"] = (DataView);

/***/ }),

/***/ 2639:
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_Hash.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hashClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hashClear.js */ 2640);
/* harmony import */ var _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_hashDelete.js */ 2642);
/* harmony import */ var _hashGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_hashGet.js */ 2643);
/* harmony import */ var _hashHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_hashHas.js */ 2644);
/* harmony import */ var _hashSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_hashSet.js */ 2645);





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
} // Add methods to `Hash`.


Hash.prototype.clear = _hashClear_js__WEBPACK_IMPORTED_MODULE_0__["default"];
Hash.prototype['delete'] = _hashDelete_js__WEBPACK_IMPORTED_MODULE_1__["default"];
Hash.prototype.get = _hashGet_js__WEBPACK_IMPORTED_MODULE_2__["default"];
Hash.prototype.has = _hashHas_js__WEBPACK_IMPORTED_MODULE_3__["default"];
Hash.prototype.set = _hashSet_js__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ __webpack_exports__["default"] = (Hash);

/***/ }),

/***/ 2624:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_ListCache.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_listCacheClear.js */ 2625);
/* harmony import */ var _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_listCacheDelete.js */ 2626);
/* harmony import */ var _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_listCacheGet.js */ 2628);
/* harmony import */ var _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_listCacheHas.js */ 2629);
/* harmony import */ var _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_listCacheSet.js */ 2630);





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
} // Add methods to `ListCache`.


ListCache.prototype.clear = _listCacheClear_js__WEBPACK_IMPORTED_MODULE_0__["default"];
ListCache.prototype['delete'] = _listCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__["default"];
ListCache.prototype.get = _listCacheGet_js__WEBPACK_IMPORTED_MODULE_2__["default"];
ListCache.prototype.has = _listCacheHas_js__WEBPACK_IMPORTED_MODULE_3__["default"];
ListCache.prototype.set = _listCacheSet_js__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ __webpack_exports__["default"] = (ListCache);

/***/ }),

/***/ 2636:
/*!****************************************!*\
  !*** ./node_modules/lodash-es/_Map.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ 2597);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ 2603);


/* Built-in method references that are verified to be native. */

var Map = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'Map');
/* harmony default export */ __webpack_exports__["default"] = (Map);

/***/ }),

/***/ 2637:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_MapCache.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_mapCacheClear.js */ 2638);
/* harmony import */ var _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_mapCacheDelete.js */ 2646);
/* harmony import */ var _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_mapCacheGet.js */ 2649);
/* harmony import */ var _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_mapCacheHas.js */ 2650);
/* harmony import */ var _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_mapCacheSet.js */ 2651);





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
} // Add methods to `MapCache`.


MapCache.prototype.clear = _mapCacheClear_js__WEBPACK_IMPORTED_MODULE_0__["default"];
MapCache.prototype['delete'] = _mapCacheDelete_js__WEBPACK_IMPORTED_MODULE_1__["default"];
MapCache.prototype.get = _mapCacheGet_js__WEBPACK_IMPORTED_MODULE_2__["default"];
MapCache.prototype.has = _mapCacheHas_js__WEBPACK_IMPORTED_MODULE_3__["default"];
MapCache.prototype.set = _mapCacheSet_js__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ __webpack_exports__["default"] = (MapCache);

/***/ }),

/***/ 2726:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_Promise.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ 2597);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ 2603);


/* Built-in method references that are verified to be native. */

var Promise = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'Promise');
/* harmony default export */ __webpack_exports__["default"] = (Promise);

/***/ }),

/***/ 2727:
/*!****************************************!*\
  !*** ./node_modules/lodash-es/_Set.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ 2597);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ 2603);


/* Built-in method references that are verified to be native. */

var Set = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'Set');
/* harmony default export */ __webpack_exports__["default"] = (Set);

/***/ }),

/***/ 2730:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_SetCache.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_MapCache.js */ 2637);
/* harmony import */ var _setCacheAdd_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_setCacheAdd.js */ 2731);
/* harmony import */ var _setCacheHas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_setCacheHas.js */ 2732);



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
  this.__data__ = new _MapCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]();

  while (++index < length) {
    this.add(values[index]);
  }
} // Add methods to `SetCache`.


SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd_js__WEBPACK_IMPORTED_MODULE_1__["default"];
SetCache.prototype.has = _setCacheHas_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ __webpack_exports__["default"] = (SetCache);

/***/ }),

/***/ 2623:
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_Stack.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_ListCache.js */ 2624);
/* harmony import */ var _stackClear_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_stackClear.js */ 2631);
/* harmony import */ var _stackDelete_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_stackDelete.js */ 2632);
/* harmony import */ var _stackGet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_stackGet.js */ 2633);
/* harmony import */ var _stackHas_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_stackHas.js */ 2634);
/* harmony import */ var _stackSet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_stackSet.js */ 2635);






/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Stack(entries) {
  var data = this.__data__ = new _ListCache_js__WEBPACK_IMPORTED_MODULE_0__["default"](entries);
  this.size = data.size;
} // Add methods to `Stack`.


Stack.prototype.clear = _stackClear_js__WEBPACK_IMPORTED_MODULE_1__["default"];
Stack.prototype['delete'] = _stackDelete_js__WEBPACK_IMPORTED_MODULE_2__["default"];
Stack.prototype.get = _stackGet_js__WEBPACK_IMPORTED_MODULE_3__["default"];
Stack.prototype.has = _stackHas_js__WEBPACK_IMPORTED_MODULE_4__["default"];
Stack.prototype.set = _stackSet_js__WEBPACK_IMPORTED_MODULE_5__["default"];
/* harmony default export */ __webpack_exports__["default"] = (Stack);

/***/ }),

/***/ 2607:
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_Symbol.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ 2603);

/** Built-in value references. */

var Symbol = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Symbol;
/* harmony default export */ __webpack_exports__["default"] = (Symbol);

/***/ }),

/***/ 2669:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_Uint8Array.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ 2603);

/** Built-in value references. */

var Uint8Array = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Uint8Array;
/* harmony default export */ __webpack_exports__["default"] = (Uint8Array);

/***/ }),

/***/ 2728:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_WeakMap.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ 2597);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_root.js */ 2603);


/* Built-in method references that are verified to be native. */

var WeakMap = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_root_js__WEBPACK_IMPORTED_MODULE_1__["default"], 'WeakMap');
/* harmony default export */ __webpack_exports__["default"] = (WeakMap);

/***/ }),

/***/ 2614:
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_apply.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
    case 0:
      return func.call(thisArg);

    case 1:
      return func.call(thisArg, args[0]);

    case 2:
      return func.call(thisArg, args[0], args[1]);

    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }

  return func.apply(thisArg, args);
}

/* harmony default export */ __webpack_exports__["default"] = (apply);

/***/ }),

/***/ 2694:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arrayEach.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }

  return array;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayEach);

/***/ }),

/***/ 2744:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_arrayFilter.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (arrayFilter);

/***/ }),

/***/ 2679:
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_arrayLikeKeys.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseTimes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_baseTimes.js */ 2680);
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArguments.js */ 2673);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isBuffer.js */ 2657);
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_isIndex.js */ 2618);
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isTypedArray.js */ 2659);






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
  var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value),
      isArg = !isArr && (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value),
      isBuff = !isArr && !isArg && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value),
      isType = !isArr && !isArg && !isBuff && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? (0,_baseTimes_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
    (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_5__["default"])(key, length)))) {
      result.push(key);
    }
  }

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (arrayLikeKeys);

/***/ }),

/***/ 2703:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_arrayMap.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (arrayMap);

/***/ }),

/***/ 2741:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arrayPush.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (arrayPush);

/***/ }),

/***/ 2733:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_arraySome.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (arraySome);

/***/ }),

/***/ 2654:
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_assignMergeValue.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseAssignValue.js */ 2655);
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eq.js */ 2619);


/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */

function assignMergeValue(object, key, value) {
  if (value !== undefined && !(0,_eq_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object[key], value) || value === undefined && !(key in object)) {
    (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, value);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (assignMergeValue);

/***/ }),

/***/ 2677:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_assignValue.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseAssignValue.js */ 2655);
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eq.js */ 2619);


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

  if (!(hasOwnProperty.call(object, key) && (0,_eq_js__WEBPACK_IMPORTED_MODULE_0__["default"])(objValue, value)) || value === undefined && !(key in object)) {
    (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, value);
  }
}

/* harmony default export */ __webpack_exports__["default"] = (assignValue);

/***/ }),

/***/ 2627:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_assocIndexOf.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eq.js */ 2619);

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
    if ((0,_eq_js__WEBPACK_IMPORTED_MODULE_0__["default"])(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}

/* harmony default export */ __webpack_exports__["default"] = (assocIndexOf);

/***/ }),

/***/ 2655:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseAssignValue.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defineProperty.js */ 2596);

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
  if (key == '__proto__' && _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (baseAssignValue);

/***/ }),

/***/ 2685:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseCreate.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ 2600);

/** Built-in value references. */

var objectCreate = Object.create;
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */

var baseCreate = function () {
  function object() {}

  return function (proto) {
    if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(proto)) {
      return {};
    }

    if (objectCreate) {
      return objectCreate(proto);
    }

    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

/* harmony default export */ __webpack_exports__["default"] = (baseCreate);

/***/ }),

/***/ 2695:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseEach.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseForOwn.js */ 2697);
/* harmony import */ var _createBaseEach_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createBaseEach.js */ 2696);


/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */

var baseEach = (0,_createBaseEach_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_baseForOwn_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (baseEach);

/***/ }),

/***/ 2621:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseFor.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _createBaseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createBaseFor.js */ 2622);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */

var baseFor = (0,_createBaseFor_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
/* harmony default export */ __webpack_exports__["default"] = (baseFor);

/***/ }),

/***/ 2697:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseForOwn.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseFor.js */ 2621);
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ 2698);


/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */

function baseForOwn(object, iteratee) {
  return object && (0,_baseFor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, iteratee, _keys_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (baseForOwn);

/***/ }),

/***/ 2712:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseGet.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _castPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_castPath.js */ 2713);
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toKey.js */ 2710);


/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */

function baseGet(object, path) {
  path = (0,_castPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[(0,_toKey_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path[index++])];
  }

  return index && index == length ? object : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (baseGet);

/***/ }),

/***/ 2740:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_baseGetAllKeys.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayPush_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayPush.js */ 2741);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ 2656);


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
  return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? result : (0,_arrayPush_js__WEBPACK_IMPORTED_MODULE_1__["default"])(result, symbolsFunc(object));
}

/* harmony default export */ __webpack_exports__["default"] = (baseGetAllKeys);

/***/ }),

/***/ 2606:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseGetTag.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ 2607);
/* harmony import */ var _getRawTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getRawTag.js */ 2608);
/* harmony import */ var _objectToString_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_objectToString.js */ 2609);



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

  return symToStringTag && symToStringTag in Object(value) ? (0,_getRawTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) : (0,_objectToString_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (baseGetTag);

/***/ }),

/***/ 2721:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseHasIn.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (baseHasIn);

/***/ }),

/***/ 2674:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsArguments.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ 2606);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ 2663);


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
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == argsTag;
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsArguments);

/***/ }),

/***/ 2722:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsEqual.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsEqualDeep_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsEqualDeep.js */ 2723);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ 2663);


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

  if (value == null || other == null || !(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && !(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other)) {
    return value !== value && other !== other;
  }

  return (0,_baseIsEqualDeep_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value, other, bitmask, customizer, baseIsEqual, stack);
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsEqual);

/***/ }),

/***/ 2723:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsEqualDeep.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_Stack.js */ 2623);
/* harmony import */ var _equalArrays_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_equalArrays.js */ 2729);
/* harmony import */ var _equalByTag_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_equalByTag.js */ 2735);
/* harmony import */ var _equalObjects_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_equalObjects.js */ 2738);
/* harmony import */ var _getTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_getTag.js */ 2724);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isBuffer.js */ 2657);
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isTypedArray.js */ 2659);








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
  var objIsArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
      othIsArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other),
      objTag = objIsArr ? arrayTag : (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object),
      othTag = othIsArr ? arrayTag : (0,_getTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other);
  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object)) {
    if (!(0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(other)) {
      return false;
    }

    objIsArr = true;
    objIsObj = false;
  }

  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]());
    return objIsArr || (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object) ? (0,_equalArrays_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object, other, bitmask, customizer, equalFunc, stack) : (0,_equalByTag_js__WEBPACK_IMPORTED_MODULE_6__["default"])(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }

  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }

  if (!isSameTag) {
    return false;
  }

  stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_3__["default"]());
  return (0,_equalObjects_js__WEBPACK_IMPORTED_MODULE_7__["default"])(object, other, bitmask, customizer, equalFunc, stack);
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsEqualDeep);

/***/ }),

/***/ 2747:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsMatch.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Stack.js */ 2623);
/* harmony import */ var _baseIsEqual_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsEqual.js */ 2722);


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

    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
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
      var stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_0__["default"]();

      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }

      if (!(result === undefined ? (0,_baseIsEqual_js__WEBPACK_IMPORTED_MODULE_1__["default"])(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
        return false;
      }
    }
  }

  return true;
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsMatch);

/***/ }),

/***/ 2599:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsNative.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isFunction.js */ 2605);
/* harmony import */ var _isMasked_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_isMasked.js */ 2601);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ 2600);
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_toSource.js */ 2610);





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

var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative(value) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) || (0,_isMasked_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value)) {
    return false;
  }

  var pattern = (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value) ? reIsNative : reIsHostCtor;
  return pattern.test((0,_toSource_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value));
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsNative);

/***/ }),

/***/ 2662:
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_baseIsTypedArray.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseGetTag.js */ 2606);
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isLength.js */ 2617);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ 2663);



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
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray(value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_isLength_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value.length) && !!typedArrayTags[(0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value)];
}

/* harmony default export */ __webpack_exports__["default"] = (baseIsTypedArray);

/***/ }),

/***/ 2705:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseIteratee.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseMatches_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseMatches.js */ 2745);
/* harmony import */ var _baseMatchesProperty_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseMatchesProperty.js */ 2706);
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity.js */ 2611);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./property.js */ 2748);





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
    return _identity_js__WEBPACK_IMPORTED_MODULE_0__["default"];
  }

  if (typeof value == 'object') {
    return (0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) ? (0,_baseMatchesProperty_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value[0], value[1]) : (0,_baseMatches_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value);
  }

  return (0,_property_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (baseIteratee);

/***/ }),

/***/ 2699:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseKeys.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isPrototype.js */ 2683);
/* harmony import */ var _nativeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_nativeKeys.js */ 2700);


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
  if (!(0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object)) {
    return (0,_nativeKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseKeys);

/***/ }),

/***/ 2681:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_baseKeysIn.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ 2600);
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_isPrototype.js */ 2683);
/* harmony import */ var _nativeKeysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_nativeKeysIn.js */ 2682);



/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeysIn(object) {
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object)) {
    return (0,_nativeKeysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object);
  }

  var isProto = (0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseKeysIn);

/***/ }),

/***/ 2704:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_baseMap.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseEach_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseEach.js */ 2695);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ 2616);


/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

function baseMap(collection, iteratee) {
  var index = -1,
      result = (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? Array(collection.length) : [];
  (0,_baseEach_js__WEBPACK_IMPORTED_MODULE_1__["default"])(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseMap);

/***/ }),

/***/ 2745:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_baseMatches.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsMatch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsMatch.js */ 2747);
/* harmony import */ var _getMatchData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMatchData.js */ 2746);
/* harmony import */ var _matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_matchesStrictComparable.js */ 2709);



/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */

function baseMatches(source) {
  var matchData = (0,_getMatchData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source);

  if (matchData.length == 1 && matchData[0][2]) {
    return (0,_matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__["default"])(matchData[0][0], matchData[0][1]);
  }

  return function (object) {
    return object === source || (0,_baseIsMatch_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object, source, matchData);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (baseMatches);

/***/ }),

/***/ 2706:
/*!********************************************************!*\
  !*** ./node_modules/lodash-es/_baseMatchesProperty.js ***!
  \********************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsEqual_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_baseIsEqual.js */ 2722);
/* harmony import */ var _get_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./get.js */ 2711);
/* harmony import */ var _hasIn_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hasIn.js */ 2719);
/* harmony import */ var _isKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isKey.js */ 2707);
/* harmony import */ var _isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isStrictComparable.js */ 2708);
/* harmony import */ var _matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_matchesStrictComparable.js */ 2709);
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_toKey.js */ 2710);







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
  if ((0,_isKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path) && (0,_isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__["default"])(srcValue)) {
    return (0,_matchesStrictComparable_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_toKey_js__WEBPACK_IMPORTED_MODULE_3__["default"])(path), srcValue);
  }

  return function (object) {
    var objValue = (0,_get_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object, path);
    return objValue === undefined && objValue === srcValue ? (0,_hasIn_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object, path) : (0,_baseIsEqual_js__WEBPACK_IMPORTED_MODULE_6__["default"])(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (baseMatchesProperty);

/***/ }),

/***/ 2620:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseMerge.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Stack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Stack.js */ 2623);
/* harmony import */ var _assignMergeValue_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_assignMergeValue.js */ 2654);
/* harmony import */ var _baseFor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseFor.js */ 2621);
/* harmony import */ var _baseMergeDeep_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseMergeDeep.js */ 2652);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isObject.js */ 2600);
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./keysIn.js */ 2678);
/* harmony import */ var _safeGet_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_safeGet.js */ 2653);







/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */

function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }

  (0,_baseFor_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, function (srcValue, key) {
    stack || (stack = new _Stack_js__WEBPACK_IMPORTED_MODULE_1__["default"]());

    if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_2__["default"])(srcValue)) {
      (0,_baseMergeDeep_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer((0,_safeGet_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object, key), srcValue, key + '', object, source, stack) : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }

      (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object, key, newValue);
    }
  }, _keysIn_js__WEBPACK_IMPORTED_MODULE_6__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (baseMerge);

/***/ }),

/***/ 2652:
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_baseMergeDeep.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_assignMergeValue.js */ 2654);
/* harmony import */ var _cloneBuffer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_cloneBuffer.js */ 2666);
/* harmony import */ var _cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_cloneTypedArray.js */ 2667);
/* harmony import */ var _copyArray_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_copyArray.js */ 2665);
/* harmony import */ var _initCloneObject_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./_initCloneObject.js */ 2684);
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./isArguments.js */ 2673);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isArrayLikeObject.js */ 2664);
/* harmony import */ var _isBuffer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isBuffer.js */ 2657);
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./isFunction.js */ 2605);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./isObject.js */ 2600);
/* harmony import */ var _isPlainObject_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./isPlainObject.js */ 2670);
/* harmony import */ var _isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isTypedArray.js */ 2659);
/* harmony import */ var _safeGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_safeGet.js */ 2653);
/* harmony import */ var _toPlainObject_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./toPlainObject.js */ 2675);















/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */

function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = (0,_safeGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key),
      srcValue = (0,_safeGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, stacked);
    return;
  }

  var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined;
  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(srcValue),
        isBuff = !isArr && (0,_isBuffer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(srcValue),
        isTyped = !isArr && !isBuff && (0,_isTypedArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(srcValue);
    newValue = srcValue;

    if (isArr || isBuff || isTyped) {
      if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(objValue)) {
        newValue = objValue;
      } else if ((0,_isArrayLikeObject_js__WEBPACK_IMPORTED_MODULE_5__["default"])(objValue)) {
        newValue = (0,_copyArray_js__WEBPACK_IMPORTED_MODULE_6__["default"])(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = (0,_cloneBuffer_js__WEBPACK_IMPORTED_MODULE_7__["default"])(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = (0,_cloneTypedArray_js__WEBPACK_IMPORTED_MODULE_8__["default"])(srcValue, true);
      } else {
        newValue = [];
      }
    } else if ((0,_isPlainObject_js__WEBPACK_IMPORTED_MODULE_9__["default"])(srcValue) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_10__["default"])(srcValue)) {
      newValue = objValue;

      if ((0,_isArguments_js__WEBPACK_IMPORTED_MODULE_10__["default"])(objValue)) {
        newValue = (0,_toPlainObject_js__WEBPACK_IMPORTED_MODULE_11__["default"])(objValue);
      } else if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_12__["default"])(objValue) || (0,_isFunction_js__WEBPACK_IMPORTED_MODULE_13__["default"])(objValue)) {
        newValue = (0,_initCloneObject_js__WEBPACK_IMPORTED_MODULE_14__["default"])(srcValue);
      }
    } else {
      isCommon = false;
    }
  }

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }

  (0,_assignMergeValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, newValue);
}

/* harmony default export */ __webpack_exports__["default"] = (baseMergeDeep);

/***/ }),

/***/ 2749:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseProperty.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

/* harmony default export */ __webpack_exports__["default"] = (baseProperty);

/***/ }),

/***/ 2750:
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_basePropertyDeep.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGet.js */ 2712);

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */

function basePropertyDeep(path) {
  return function (object) {
    return (0,_baseGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (basePropertyDeep);

/***/ }),

/***/ 2592:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseRest.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./identity.js */ 2611);
/* harmony import */ var _overRest_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_overRest.js */ 2613);
/* harmony import */ var _setToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_setToString.js */ 2593);



/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */

function baseRest(func, start) {
  return (0,_setToString_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_overRest_js__WEBPACK_IMPORTED_MODULE_1__["default"])(func, start, _identity_js__WEBPACK_IMPORTED_MODULE_2__["default"]), func + '');
}

/* harmony default export */ __webpack_exports__["default"] = (baseRest);

/***/ }),

/***/ 2595:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_baseSetToString.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constant.js */ 2612);
/* harmony import */ var _defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_defineProperty.js */ 2596);
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./identity.js */ 2611);



/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */

var baseSetToString = !_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _identity_js__WEBPACK_IMPORTED_MODULE_1__["default"] : function (func, string) {
  return (0,_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': (0,_constant_js__WEBPACK_IMPORTED_MODULE_2__["default"])(string),
    'writable': true
  });
};
/* harmony default export */ __webpack_exports__["default"] = (baseSetToString);

/***/ }),

/***/ 2680:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseTimes.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (baseTimes);

/***/ }),

/***/ 2718:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_baseToString.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ 2607);
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_arrayMap.js */ 2703);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isSymbol.js */ 2689);




/** Used as references for various `Number` constants. */

var INFINITY = 1 / 0;
/** Used to convert symbols to primitives and strings. */

var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
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

  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return (0,_arrayMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value, baseToString) + '';
  }

  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/* harmony default export */ __webpack_exports__["default"] = (baseToString);

/***/ }),

/***/ 2690:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_baseTrim.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var _trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_trimmedEndIndex.js */ 2691);


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
  return string ? string.slice(0, (0,_trimmedEndIndex_js__WEBPACK_IMPORTED_MODULE_1__["default"])(string) + 1).replace(reTrimStart, '') : string;
}

/* harmony default export */ __webpack_exports__["default"] = (baseTrim);

/***/ }),

/***/ 2661:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_baseUnary.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (baseUnary);

/***/ }),

/***/ 2734:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_cacheHas.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (cacheHas);

/***/ }),

/***/ 2701:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_castFunction.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity.js */ 2611);

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */

function castFunction(value) {
  return typeof value == 'function' ? value : _identity_js__WEBPACK_IMPORTED_MODULE_0__["default"];
}

/* harmony default export */ __webpack_exports__["default"] = (castFunction);

/***/ }),

/***/ 2713:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_castPath.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _isKey_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isKey.js */ 2707);
/* harmony import */ var _stringToPath_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_stringToPath.js */ 2714);
/* harmony import */ var _toString_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./toString.js */ 2717);




/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */

function castPath(value, object) {
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return value;
  }

  return (0,_isKey_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value, object) ? [value] : (0,_stringToPath_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_toString_js__WEBPACK_IMPORTED_MODULE_3__["default"])(value));
}

/* harmony default export */ __webpack_exports__["default"] = (castPath);

/***/ }),

/***/ 2668:
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/_cloneArrayBuffer.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Uint8Array.js */ 2669);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__["default"](result).set(new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_0__["default"](arrayBuffer));
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (cloneArrayBuffer);

/***/ }),

/***/ 2666:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_cloneBuffer.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ 2603);

/** Detect free variable `exports`. */

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Built-in value references. */

var Buffer = moduleExports ? _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */

function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }

  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (cloneBuffer);

/***/ }),

/***/ 2667:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_cloneTypedArray.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_cloneArrayBuffer.js */ 2668);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? (0,_cloneArrayBuffer_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/* harmony default export */ __webpack_exports__["default"] = (cloneTypedArray);

/***/ }),

/***/ 2665:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_copyArray.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (copyArray);

/***/ }),

/***/ 2676:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_copyObject.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assignValue_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_assignValue.js */ 2677);
/* harmony import */ var _baseAssignValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseAssignValue.js */ 2655);


/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */

function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }

    if (isNew) {
      (0,_baseAssignValue_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key, newValue);
    } else {
      (0,_assignValue_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, key, newValue);
    }
  }

  return object;
}

/* harmony default export */ __webpack_exports__["default"] = (copyObject);

/***/ }),

/***/ 2602:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_coreJsData.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ 2603);

/** Used to detect overreaching core-js shims. */

var coreJsData = _root_js__WEBPACK_IMPORTED_MODULE_0__["default"]["__core-js_shared__"];
/* harmony default export */ __webpack_exports__["default"] = (coreJsData);

/***/ }),

/***/ 2591:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_createAssigner.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseRest_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseRest.js */ 2592);
/* harmony import */ var _isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isIterateeCall.js */ 2615);


/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */

function createAssigner(assigner) {
  return (0,_baseRest_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;
    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && (0,_isIterateeCall_js__WEBPACK_IMPORTED_MODULE_1__["default"])(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }

    object = Object(object);

    while (++index < length) {
      var source = sources[index];

      if (source) {
        assigner(object, source, index, customizer);
      }
    }

    return object;
  });
}

/* harmony default export */ __webpack_exports__["default"] = (createAssigner);

/***/ }),

/***/ 2696:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_createBaseEach.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ 2616);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */

function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }

    if (!(0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection)) {
      return eachFunc(collection, iteratee);
    }

    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }

    return collection;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (createBaseEach);

/***/ }),

/***/ 2622:
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_createBaseFor.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];

      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }

    return object;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (createBaseFor);

/***/ }),

/***/ 2596:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_defineProperty.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ 2597);


var defineProperty = function () {
  try {
    var func = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

/* harmony default export */ __webpack_exports__["default"] = (defineProperty);

/***/ }),

/***/ 2729:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_equalArrays.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SetCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_SetCache.js */ 2730);
/* harmony import */ var _arraySome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arraySome.js */ 2733);
/* harmony import */ var _cacheHas_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_cacheHas.js */ 2734);



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
  } // Check that cyclic values are equal.


  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);

  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }

  var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new _SetCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]() : undefined;
  stack.set(array, other);
  stack.set(other, array); // Ignore non-index properties.

  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }

    if (compared !== undefined) {
      if (compared) {
        continue;
      }

      result = false;
      break;
    } // Recursively compare arrays (susceptible to call stack limits).


    if (seen) {
      if (!(0,_arraySome_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other, function (othValue, othIndex) {
        if (!(0,_cacheHas_js__WEBPACK_IMPORTED_MODULE_2__["default"])(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }

  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (equalArrays);

/***/ }),

/***/ 2735:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_equalByTag.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ 2607);
/* harmony import */ var _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Uint8Array.js */ 2669);
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./eq.js */ 2619);
/* harmony import */ var _equalArrays_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_equalArrays.js */ 2729);
/* harmony import */ var _mapToArray_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_mapToArray.js */ 2736);
/* harmony import */ var _setToArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_setToArray.js */ 2737);






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

var symbolProto = _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? _Symbol_js__WEBPACK_IMPORTED_MODULE_0__["default"].prototype : undefined,
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
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }

      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__["default"](object), new _Uint8Array_js__WEBPACK_IMPORTED_MODULE_1__["default"](other))) {
        return false;
      }

      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return (0,_eq_js__WEBPACK_IMPORTED_MODULE_2__["default"])(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == other + '';

    case mapTag:
      var convert = _mapToArray_js__WEBPACK_IMPORTED_MODULE_3__["default"];

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = _setToArray_js__WEBPACK_IMPORTED_MODULE_4__["default"]);

      if (object.size != other.size && !isPartial) {
        return false;
      } // Assume cyclic values are equal.


      var stacked = stack.get(object);

      if (stacked) {
        return stacked == other;
      }

      bitmask |= COMPARE_UNORDERED_FLAG; // Recursively compare objects (susceptible to call stack limits).

      stack.set(object, other);
      var result = (0,_equalArrays_js__WEBPACK_IMPORTED_MODULE_5__["default"])(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }

  }

  return false;
}

/* harmony default export */ __webpack_exports__["default"] = (equalByTag);

/***/ }),

/***/ 2738:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_equalObjects.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getAllKeys.js */ 2739);

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
      objProps = (0,_getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
      objLength = objProps.length,
      othProps = (0,_getAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(other),
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
  } // Check that cyclic values are equal.


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
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    } // Recursively compare objects (susceptible to call stack limits).


    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }

    skipCtor || (skipCtor = key == 'constructor');
  }

  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor; // Non `Object` object instances with different constructors are not equal.

    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }

  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (equalObjects);

/***/ }),

/***/ 2604:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_freeGlobal.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
/* harmony default export */ __webpack_exports__["default"] = (freeGlobal);

/***/ }),

/***/ 2739:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getAllKeys.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGetAllKeys.js */ 2740);
/* harmony import */ var _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getSymbols.js */ 2742);
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keys.js */ 2698);



/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeys(object) {
  return (0,_baseGetAllKeys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, _keys_js__WEBPACK_IMPORTED_MODULE_1__["default"], _getSymbols_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (getAllKeys);

/***/ }),

/***/ 2647:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getMapData.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isKeyable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isKeyable.js */ 2648);

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
  return (0,_isKeyable_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/* harmony default export */ __webpack_exports__["default"] = (getMapData);

/***/ }),

/***/ 2746:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getMatchData.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_isStrictComparable.js */ 2708);
/* harmony import */ var _keys_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keys.js */ 2698);


/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */

function getMatchData(object) {
  var result = (0,_keys_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];
    result[length] = [key, value, (0,_isStrictComparable_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)];
  }

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (getMatchData);

/***/ }),

/***/ 2597:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getNative.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseIsNative.js */ 2599);
/* harmony import */ var _getValue_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getValue.js */ 2598);


/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */

function getNative(object, key) {
  var value = (0,_getValue_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, key);
  return (0,_baseIsNative_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) ? value : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (getNative);

/***/ }),

/***/ 2671:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_getPrototype.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _overArg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_overArg.js */ 2672);

/** Built-in value references. */

var getPrototype = (0,_overArg_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object.getPrototypeOf, Object);
/* harmony default export */ __webpack_exports__["default"] = (getPrototype);

/***/ }),

/***/ 2608:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_getRawTag.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Symbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Symbol.js */ 2607);

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

/***/ 2742:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_getSymbols.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayFilter.js */ 2744);
/* harmony import */ var _stubArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stubArray.js */ 2743);


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

var getSymbols = !nativeGetSymbols ? _stubArray_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function (object) {
  if (object == null) {
    return [];
  }

  object = Object(object);
  return (0,_arrayFilter_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
/* harmony default export */ __webpack_exports__["default"] = (getSymbols);

/***/ }),

/***/ 2724:
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/_getTag.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DataView_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_DataView.js */ 2725);
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_Map.js */ 2636);
/* harmony import */ var _Promise_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_Promise.js */ 2726);
/* harmony import */ var _Set_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_Set.js */ 2727);
/* harmony import */ var _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_WeakMap.js */ 2728);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_baseGetTag.js */ 2606);
/* harmony import */ var _toSource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_toSource.js */ 2610);







/** `Object#toString` result references. */

var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';
var dataViewTag = '[object DataView]';
/** Used to detect maps, sets, and weakmaps. */

var dataViewCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_DataView_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
    mapCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_Map_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
    promiseCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_Promise_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
    setCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_Set_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
    weakMapCtorString = (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_WeakMap_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

var getTag = _baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__["default"]; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

if (_DataView_js__WEBPACK_IMPORTED_MODULE_1__["default"] && getTag(new _DataView_js__WEBPACK_IMPORTED_MODULE_1__["default"](new ArrayBuffer(1))) != dataViewTag || _Map_js__WEBPACK_IMPORTED_MODULE_2__["default"] && getTag(new _Map_js__WEBPACK_IMPORTED_MODULE_2__["default"]()) != mapTag || _Promise_js__WEBPACK_IMPORTED_MODULE_3__["default"] && getTag(_Promise_js__WEBPACK_IMPORTED_MODULE_3__["default"].resolve()) != promiseTag || _Set_js__WEBPACK_IMPORTED_MODULE_4__["default"] && getTag(new _Set_js__WEBPACK_IMPORTED_MODULE_4__["default"]()) != setTag || _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__["default"] && getTag(new _WeakMap_js__WEBPACK_IMPORTED_MODULE_5__["default"]()) != weakMapTag) {
  getTag = function (value) {
    var result = (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_6__["default"])(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? (0,_toSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;

        case mapCtorString:
          return mapTag;

        case promiseCtorString:
          return promiseTag;

        case setCtorString:
          return setTag;

        case weakMapCtorString:
          return weakMapTag;
      }
    }

    return result;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (getTag);

/***/ }),

/***/ 2598:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_getValue.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

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

/***/ 2720:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hasPath.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _castPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_castPath.js */ 2713);
/* harmony import */ var _isArguments_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isArguments.js */ 2673);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_isIndex.js */ 2618);
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLength.js */ 2617);
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_toKey.js */ 2710);






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
  path = (0,_castPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path, object);
  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = (0,_toKey_js__WEBPACK_IMPORTED_MODULE_1__["default"])(path[index]);

    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }

    object = object[key];
  }

  if (result || ++index != length) {
    return result;
  }

  length = object == null ? 0 : object.length;
  return !!length && (0,_isLength_js__WEBPACK_IMPORTED_MODULE_2__["default"])(length) && (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_3__["default"])(key, length) && ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_4__["default"])(object) || (0,_isArguments_js__WEBPACK_IMPORTED_MODULE_5__["default"])(object));
}

/* harmony default export */ __webpack_exports__["default"] = (hasPath);

/***/ }),

/***/ 2640:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_hashClear.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ 2641);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear() {
  this.__data__ = _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? (0,_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"])(null) : {};
  this.size = 0;
}

/* harmony default export */ __webpack_exports__["default"] = (hashClear);

/***/ }),

/***/ 2642:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_hashDelete.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (hashDelete);

/***/ }),

/***/ 2643:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashGet.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ 2641);

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

  if (_nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }

  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (hashGet);

/***/ }),

/***/ 2644:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashHas.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ 2641);

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
  return _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"] ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/* harmony default export */ __webpack_exports__["default"] = (hashHas);

/***/ }),

/***/ 2645:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_hashSet.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nativeCreate.js */ 2641);

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
  data[key] = _nativeCreate_js__WEBPACK_IMPORTED_MODULE_0__["default"] && value === undefined ? HASH_UNDEFINED : value;
  return this;
}

/* harmony default export */ __webpack_exports__["default"] = (hashSet);

/***/ }),

/***/ 2684:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_initCloneObject.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseCreate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseCreate.js */ 2685);
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getPrototype.js */ 2671);
/* harmony import */ var _isPrototype_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isPrototype.js */ 2683);



/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneObject(object) {
  return typeof object.constructor == 'function' && !(0,_isPrototype_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? (0,_baseCreate_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object)) : {};
}

/* harmony default export */ __webpack_exports__["default"] = (initCloneObject);

/***/ }),

/***/ 2618:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_isIndex.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/* harmony default export */ __webpack_exports__["default"] = (isIndex);

/***/ }),

/***/ 2615:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_isIterateeCall.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _eq_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eq.js */ 2619);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArrayLike.js */ 2616);
/* harmony import */ var _isIndex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_isIndex.js */ 2618);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ 2600);




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
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object)) {
    return false;
  }

  var type = typeof index;

  if (type == 'number' ? (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object) && (0,_isIndex_js__WEBPACK_IMPORTED_MODULE_2__["default"])(index, object.length) : type == 'string' && index in object) {
    return (0,_eq_js__WEBPACK_IMPORTED_MODULE_3__["default"])(object[index], value);
  }

  return false;
}

/* harmony default export */ __webpack_exports__["default"] = (isIterateeCall);

/***/ }),

/***/ 2707:
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_isKey.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ 2656);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isSymbol.js */ 2689);


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
  if ((0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || (0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    return true;
  }

  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}

/* harmony default export */ __webpack_exports__["default"] = (isKey);

/***/ }),

/***/ 2648:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/_isKeyable.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/* harmony default export */ __webpack_exports__["default"] = (isKeyable);

/***/ }),

/***/ 2601:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_isMasked.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var _coreJsData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_coreJsData.js */ 2602);


/** Used to detect methods masquerading as native. */

var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(_coreJsData_js__WEBPACK_IMPORTED_MODULE_1__["default"] && _coreJsData_js__WEBPACK_IMPORTED_MODULE_1__["default"].keys && _coreJsData_js__WEBPACK_IMPORTED_MODULE_1__["default"].keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

/* harmony default export */ __webpack_exports__["default"] = (isMasked);

/***/ }),

/***/ 2683:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_isPrototype.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
  return value === proto;
}

/* harmony default export */ __webpack_exports__["default"] = (isPrototype);

/***/ }),

/***/ 2708:
/*!*******************************************************!*\
  !*** ./node_modules/lodash-es/_isStrictComparable.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ 2600);

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */

function isStrictComparable(value) {
  return value === value && !(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (isStrictComparable);

/***/ }),

/***/ 2625:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheClear.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (listCacheClear);

/***/ }),

/***/ 2626:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheDelete.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ 2627);

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
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key);

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

/* harmony default export */ __webpack_exports__["default"] = (listCacheDelete);

/***/ }),

/***/ 2628:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheGet.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ 2627);

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
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key);
  return index < 0 ? undefined : data[index][1];
}

/* harmony default export */ __webpack_exports__["default"] = (listCacheGet);

/***/ }),

/***/ 2629:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheHas.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ 2627);

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
  return (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this.__data__, key) > -1;
}

/* harmony default export */ __webpack_exports__["default"] = (listCacheHas);

/***/ }),

/***/ 2630:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_listCacheSet.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_assocIndexOf.js */ 2627);

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
      index = (0,_assocIndexOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}

/* harmony default export */ __webpack_exports__["default"] = (listCacheSet);

/***/ }),

/***/ 2638:
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheClear.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Hash_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_Hash.js */ 2639);
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_ListCache.js */ 2624);
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Map.js */ 2636);



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
    'hash': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__["default"](),
    'map': new (_Map_js__WEBPACK_IMPORTED_MODULE_1__["default"] || _ListCache_js__WEBPACK_IMPORTED_MODULE_2__["default"])(),
    'string': new _Hash_js__WEBPACK_IMPORTED_MODULE_0__["default"]()
  };
}

/* harmony default export */ __webpack_exports__["default"] = (mapCacheClear);

/***/ }),

/***/ 2646:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheDelete.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ 2647);

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
  var result = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (mapCacheDelete);

/***/ }),

/***/ 2649:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheGet.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ 2647);

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
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key).get(key);
}

/* harmony default export */ __webpack_exports__["default"] = (mapCacheGet);

/***/ }),

/***/ 2650:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheHas.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ 2647);

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
  return (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key).has(key);
}

/* harmony default export */ __webpack_exports__["default"] = (mapCacheHas);

/***/ }),

/***/ 2651:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_mapCacheSet.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getMapData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getMapData.js */ 2647);

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
  var data = (0,_getMapData_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/* harmony default export */ __webpack_exports__["default"] = (mapCacheSet);

/***/ }),

/***/ 2736:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_mapToArray.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (mapToArray);

/***/ }),

/***/ 2709:
/*!************************************************************!*\
  !*** ./node_modules/lodash-es/_matchesStrictComparable.js ***!
  \************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  return function (object) {
    if (object == null) {
      return false;
    }

    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}

/* harmony default export */ __webpack_exports__["default"] = (matchesStrictComparable);

/***/ }),

/***/ 2715:
/*!**************************************************!*\
  !*** ./node_modules/lodash-es/_memoizeCapped.js ***!
  \**************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _memoize_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./memoize.js */ 2716);

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
  var result = (0,_memoize_js__WEBPACK_IMPORTED_MODULE_0__["default"])(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (memoizeCapped);

/***/ }),

/***/ 2641:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_nativeCreate.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _getNative_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_getNative.js */ 2597);

/* Built-in method references that are verified to be native. */

var nativeCreate = (0,_getNative_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object, 'create');
/* harmony default export */ __webpack_exports__["default"] = (nativeCreate);

/***/ }),

/***/ 2700:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_nativeKeys.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _overArg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_overArg.js */ 2672);

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeKeys = (0,_overArg_js__WEBPACK_IMPORTED_MODULE_0__["default"])(Object.keys, Object);
/* harmony default export */ __webpack_exports__["default"] = (nativeKeys);

/***/ }),

/***/ 2682:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_nativeKeysIn.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (nativeKeysIn);

/***/ }),

/***/ 2660:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_nodeUtil.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ 2604);

/** Detect free variable `exports`. */

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Detect free variable `process` from Node.js. */

var freeProcess = moduleExports && _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"].process;
/** Used to access faster Node.js helpers. */

var nodeUtil = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    } // Legacy `process.binding('util')` for Node.js < 10.


    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* harmony default export */ __webpack_exports__["default"] = (nodeUtil);

/***/ }),

/***/ 2609:
/*!***************************************************!*\
  !*** ./node_modules/lodash-es/_objectToString.js ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

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

/***/ 2672:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_overArg.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ __webpack_exports__["default"] = (overArg);

/***/ }),

/***/ 2613:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_overRest.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _apply_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_apply.js */ 2614);

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
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);
  return function () {
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
    return (0,_apply_js__WEBPACK_IMPORTED_MODULE_0__["default"])(func, this, otherArgs);
  };
}

/* harmony default export */ __webpack_exports__["default"] = (overRest);

/***/ }),

/***/ 2603:
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/_root.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_freeGlobal.js */ 2604);

/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = _freeGlobal_js__WEBPACK_IMPORTED_MODULE_0__["default"] || freeSelf || Function('return this')();
/* harmony default export */ __webpack_exports__["default"] = (root);

/***/ }),

/***/ 2653:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/_safeGet.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/* harmony default export */ __webpack_exports__["default"] = (safeGet);

/***/ }),

/***/ 2731:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setCacheAdd.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (setCacheAdd);

/***/ }),

/***/ 2732:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setCacheHas.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (setCacheHas);

/***/ }),

/***/ 2737:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_setToArray.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (setToArray);

/***/ }),

/***/ 2593:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_setToString.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseSetToString_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseSetToString.js */ 2595);
/* harmony import */ var _shortOut_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_shortOut.js */ 2594);


/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */

var setToString = (0,_shortOut_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_baseSetToString_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (setToString);

/***/ }),

/***/ 2594:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_shortOut.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  return function () {
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

/* harmony default export */ __webpack_exports__["default"] = (shortOut);

/***/ }),

/***/ 2631:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/_stackClear.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_ListCache.js */ 2624);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */

function stackClear() {
  this.__data__ = new _ListCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  this.size = 0;
}

/* harmony default export */ __webpack_exports__["default"] = (stackClear);

/***/ }),

/***/ 2632:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/_stackDelete.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (stackDelete);

/***/ }),

/***/ 2633:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_stackGet.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (stackGet);

/***/ }),

/***/ 2634:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_stackHas.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (stackHas);

/***/ }),

/***/ 2635:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_stackSet.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ListCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_ListCache.js */ 2624);
/* harmony import */ var _Map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_Map.js */ 2636);
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_MapCache.js */ 2637);



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

  if (data instanceof _ListCache_js__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    var pairs = data.__data__;

    if (!_Map_js__WEBPACK_IMPORTED_MODULE_1__["default"] || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new _MapCache_js__WEBPACK_IMPORTED_MODULE_2__["default"](pairs);
  }

  data.set(key, value);
  this.size = data.size;
  return this;
}

/* harmony default export */ __webpack_exports__["default"] = (stackSet);

/***/ }),

/***/ 2714:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/_stringToPath.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var _memoizeCapped_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_memoizeCapped.js */ 2715);


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

var stringToPath = (0,_memoizeCapped_js__WEBPACK_IMPORTED_MODULE_1__["default"])(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46
  /* . */
  ) {
    result.push('');
  }

  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});
/* harmony default export */ __webpack_exports__["default"] = (stringToPath);

/***/ }),

/***/ 2710:
/*!******************************************!*\
  !*** ./node_modules/lodash-es/_toKey.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ 2689);

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
  if (typeof value == 'string' || (0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

/* harmony default export */ __webpack_exports__["default"] = (toKey);

/***/ }),

/***/ 2610:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/_toSource.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

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
      return func + '';
    } catch (e) {}
  }

  return '';
}

/* harmony default export */ __webpack_exports__["default"] = (toSource);

/***/ }),

/***/ 2691:
/*!****************************************************!*\
  !*** ./node_modules/lodash-es/_trimmedEndIndex.js ***!
  \****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (trimmedEndIndex);

/***/ }),

/***/ 2612:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/constant.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  return function () {
    return value;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (constant);

/***/ }),

/***/ 2687:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/debounce.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ 2600);
/* harmony import */ var _now_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./now.js */ 2692);
/* harmony import */ var _toNumber_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toNumber.js */ 2688);



/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max,
    nativeMin = Math.min;
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */

function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  wait = (0,_toNumber_js__WEBPACK_IMPORTED_MODULE_0__["default"])(wait) || 0;

  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax((0,_toNumber_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;
    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time; // Start the timer for the trailing edge.

    timerId = setTimeout(timerExpired, wait); // Invoke the leading edge.

    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime; // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.

    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }

  function timerExpired() {
    var time = (0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (shouldInvoke(time)) {
      return trailingEdge(time);
    } // Restart the timer.


    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined; // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }

    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge((0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  }

  function debounced() {
    var time = (0,_now_js__WEBPACK_IMPORTED_MODULE_2__["default"])(),
        isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }

      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/* harmony default export */ __webpack_exports__["default"] = (debounce);

/***/ }),

/***/ 2619:
/*!**************************************!*\
  !*** ./node_modules/lodash-es/eq.js ***!
  \**************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  return value === other || value !== value && other !== other;
}

/* harmony default export */ __webpack_exports__["default"] = (eq);

/***/ }),

/***/ 2693:
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/forEach.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayEach_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayEach.js */ 2694);
/* harmony import */ var _baseEach_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseEach.js */ 2695);
/* harmony import */ var _castFunction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_castFunction.js */ 2701);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ 2656);




/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */

function forEach(collection, iteratee) {
  var func = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? _arrayEach_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _baseEach_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  return func(collection, (0,_castFunction_js__WEBPACK_IMPORTED_MODULE_3__["default"])(iteratee));
}

/* harmony default export */ __webpack_exports__["default"] = (forEach);

/***/ }),

/***/ 2711:
/*!***************************************!*\
  !*** ./node_modules/lodash-es/get.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGet_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseGet.js */ 2712);

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
  var result = object == null ? undefined : (0,_baseGet_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path);
  return result === undefined ? defaultValue : result;
}

/* harmony default export */ __webpack_exports__["default"] = (get);

/***/ }),

/***/ 2719:
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/hasIn.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseHasIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseHasIn.js */ 2721);
/* harmony import */ var _hasPath_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_hasPath.js */ 2720);


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
  return object != null && (0,_hasPath_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object, path, _baseHasIn_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
}

/* harmony default export */ __webpack_exports__["default"] = (hasIn);

/***/ }),

/***/ 2611:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/identity.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (identity);

/***/ }),

/***/ 2673:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/isArguments.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseIsArguments.js */ 2674);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObjectLike.js */ 2663);


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

var isArguments = (0,_baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function () {
  return arguments;
}()) ? _baseIsArguments_js__WEBPACK_IMPORTED_MODULE_0__["default"] : function (value) {
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};
/* harmony default export */ __webpack_exports__["default"] = (isArguments);

/***/ }),

/***/ 2656:
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/isArray.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
/* harmony default export */ __webpack_exports__["default"] = (isArray);

/***/ }),

/***/ 2616:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/isArrayLike.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isFunction_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isFunction.js */ 2605);
/* harmony import */ var _isLength_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isLength.js */ 2617);


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
  return value != null && (0,_isLength_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value.length) && !(0,_isFunction_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (isArrayLike);

/***/ }),

/***/ 2664:
/*!*****************************************************!*\
  !*** ./node_modules/lodash-es/isArrayLikeObject.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isArrayLike.js */ 2616);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ 2663);


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
  return (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (isArrayLikeObject);

/***/ }),

/***/ 2657:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isBuffer.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ 2603);
/* harmony import */ var _stubFalse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stubFalse.js */ 2658);


/** Detect free variable `exports`. */

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Built-in value references. */

var Buffer = moduleExports ? _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Buffer : undefined;
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

var isBuffer = nativeIsBuffer || _stubFalse_js__WEBPACK_IMPORTED_MODULE_1__["default"];
/* harmony default export */ __webpack_exports__["default"] = (isBuffer);

/***/ }),

/***/ 2605:
/*!**********************************************!*\
  !*** ./node_modules/lodash-es/isFunction.js ***!
  \**********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ 2606);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ 2600);


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
  if (!(0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/* harmony default export */ __webpack_exports__["default"] = (isFunction);

/***/ }),

/***/ 2617:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isLength.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/* harmony default export */ __webpack_exports__["default"] = (isLength);

/***/ }),

/***/ 2600:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isObject.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

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

/***/ 2663:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isObjectLike.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (isObjectLike);

/***/ }),

/***/ 2670:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/isPlainObject.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ 2606);
/* harmony import */ var _getPrototype_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_getPrototype.js */ 2671);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ 2663);



/** `Object#toString` result references. */

var objectTag = '[object Object]';
/** Used for built-in method references. */

var funcProto = Function.prototype,
    objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString = funcToString.call(Object);
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */

function isPlainObject(value) {
  if (!(0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) || (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) != objectTag) {
    return false;
  }

  var proto = (0,_getPrototype_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["default"] = (isPlainObject);

/***/ }),

/***/ 2689:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/isSymbol.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseGetTag.js */ 2606);
/* harmony import */ var _isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObjectLike.js */ 2663);


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
  return typeof value == 'symbol' || (0,_isObjectLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value) && (0,_baseGetTag_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value) == symbolTag;
}

/* harmony default export */ __webpack_exports__["default"] = (isSymbol);

/***/ }),

/***/ 2659:
/*!************************************************!*\
  !*** ./node_modules/lodash-es/isTypedArray.js ***!
  \************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseIsTypedArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseIsTypedArray.js */ 2662);
/* harmony import */ var _baseUnary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseUnary.js */ 2661);
/* harmony import */ var _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_nodeUtil.js */ 2660);



/* Node.js helper references. */

var nodeIsTypedArray = _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"] && _nodeUtil_js__WEBPACK_IMPORTED_MODULE_0__["default"].isTypedArray;
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

var isTypedArray = nodeIsTypedArray ? (0,_baseUnary_js__WEBPACK_IMPORTED_MODULE_1__["default"])(nodeIsTypedArray) : _baseIsTypedArray_js__WEBPACK_IMPORTED_MODULE_2__["default"];
/* harmony default export */ __webpack_exports__["default"] = (isTypedArray);

/***/ }),

/***/ 2751:
/*!***********************************************!*\
  !*** ./node_modules/lodash-es/isUndefined.js ***!
  \***********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

/* harmony default export */ __webpack_exports__["default"] = (isUndefined);

/***/ }),

/***/ 2698:
/*!****************************************!*\
  !*** ./node_modules/lodash-es/keys.js ***!
  \****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayLikeKeys.js */ 2679);
/* harmony import */ var _baseKeys_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseKeys.js */ 2699);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ 2616);



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
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? (0,_arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object) : (0,_baseKeys_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object);
}

/* harmony default export */ __webpack_exports__["default"] = (keys);

/***/ }),

/***/ 2678:
/*!******************************************!*\
  !*** ./node_modules/lodash-es/keysIn.js ***!
  \******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayLikeKeys.js */ 2679);
/* harmony import */ var _baseKeysIn_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseKeysIn.js */ 2681);
/* harmony import */ var _isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArrayLike.js */ 2616);



/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
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
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */

function keysIn(object) {
  return (0,_isArrayLike_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object) ? (0,_arrayLikeKeys_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, true) : (0,_baseKeysIn_js__WEBPACK_IMPORTED_MODULE_2__["default"])(object);
}

/* harmony default export */ __webpack_exports__["default"] = (keysIn);

/***/ }),

/***/ 2702:
/*!***************************************!*\
  !*** ./node_modules/lodash-es/map.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arrayMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_arrayMap.js */ 2703);
/* harmony import */ var _baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_baseIteratee.js */ 2705);
/* harmony import */ var _baseMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseMap.js */ 2704);
/* harmony import */ var _isArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isArray.js */ 2656);




/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */

function map(collection, iteratee) {
  var func = (0,_isArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(collection) ? _arrayMap_js__WEBPACK_IMPORTED_MODULE_1__["default"] : _baseMap_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  return func(collection, (0,_baseIteratee_js__WEBPACK_IMPORTED_MODULE_3__["default"])(iteratee, 3));
}

/* harmony default export */ __webpack_exports__["default"] = (map);

/***/ }),

/***/ 2716:
/*!*******************************************!*\
  !*** ./node_modules/lodash-es/memoize.js ***!
  \*******************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MapCache_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_MapCache.js */ 2637);

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
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  var memoized = function () {
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

  memoized.cache = new (memoize.Cache || _MapCache_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return memoized;
} // Expose `MapCache`.


memoize.Cache = _MapCache_js__WEBPACK_IMPORTED_MODULE_0__["default"];
/* harmony default export */ __webpack_exports__["default"] = (memoize);

/***/ }),

/***/ 2590:
/*!*****************************************!*\
  !*** ./node_modules/lodash-es/merge.js ***!
  \*****************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseMerge_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseMerge.js */ 2620);
/* harmony import */ var _createAssigner_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_createAssigner.js */ 2591);


/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */

var merge = (0,_createAssigner_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function (object, source, srcIndex) {
  (0,_baseMerge_js__WEBPACK_IMPORTED_MODULE_1__["default"])(object, source, srcIndex);
});
/* harmony default export */ __webpack_exports__["default"] = (merge);

/***/ }),

/***/ 2692:
/*!***************************************!*\
  !*** ./node_modules/lodash-es/now.js ***!
  \***************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_root.js */ 2603);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */

var now = function () {
  return _root_js__WEBPACK_IMPORTED_MODULE_0__["default"].Date.now();
};

/* harmony default export */ __webpack_exports__["default"] = (now);

/***/ }),

/***/ 2748:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/property.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseProperty_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_baseProperty.js */ 2749);
/* harmony import */ var _basePropertyDeep_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_basePropertyDeep.js */ 2750);
/* harmony import */ var _isKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_isKey.js */ 2707);
/* harmony import */ var _toKey_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_toKey.js */ 2710);




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
  return (0,_isKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(path) ? (0,_baseProperty_js__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_toKey_js__WEBPACK_IMPORTED_MODULE_2__["default"])(path)) : (0,_basePropertyDeep_js__WEBPACK_IMPORTED_MODULE_3__["default"])(path);
}

/* harmony default export */ __webpack_exports__["default"] = (property);

/***/ }),

/***/ 2743:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/stubArray.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (stubArray);

/***/ }),

/***/ 2658:
/*!*********************************************!*\
  !*** ./node_modules/lodash-es/stubFalse.js ***!
  \*********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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

/* harmony default export */ __webpack_exports__["default"] = (stubFalse);

/***/ }),

/***/ 2686:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/throttle.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./debounce.js */ 2687);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isObject.js */ 2600);


/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */

function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  return (0,_debounce_js__WEBPACK_IMPORTED_MODULE_1__["default"])(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/* harmony default export */ __webpack_exports__["default"] = (throttle);

/***/ }),

/***/ 2688:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/toNumber.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseTrim_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_baseTrim.js */ 2690);
/* harmony import */ var _isObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isObject.js */ 2600);
/* harmony import */ var _isSymbol_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./isSymbol.js */ 2689);



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

  if ((0,_isSymbol_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value)) {
    return NAN;
  }

  if ((0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = (0,_isObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(other) ? other + '' : other;
  }

  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }

  value = (0,_baseTrim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}

/* harmony default export */ __webpack_exports__["default"] = (toNumber);

/***/ }),

/***/ 2675:
/*!*************************************************!*\
  !*** ./node_modules/lodash-es/toPlainObject.js ***!
  \*************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _copyObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_copyObject.js */ 2676);
/* harmony import */ var _keysIn_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keysIn.js */ 2678);


/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */

function toPlainObject(value) {
  return (0,_copyObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value, (0,_keysIn_js__WEBPACK_IMPORTED_MODULE_1__["default"])(value));
}

/* harmony default export */ __webpack_exports__["default"] = (toPlainObject);

/***/ }),

/***/ 2717:
/*!********************************************!*\
  !*** ./node_modules/lodash-es/toString.js ***!
  \********************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _baseToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_baseToString.js */ 2718);

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
  return value == null ? '' : (0,_baseToString_js__WEBPACK_IMPORTED_MODULE_0__["default"])(value);
}

/* harmony default export */ __webpack_exports__["default"] = (toString);

/***/ })

}]);
//# sourceMappingURL=soapbox_config-857093a33f4e46eb1100.chunk.js.map