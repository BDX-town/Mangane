/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 1446:
/*!********************************************************************!*\
  !*** ./node_modules/@virtuoso.dev/react-urx/dist/react-urx.esm.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "systemToComponent": function() { return /* binding */ systemToComponent; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @virtuoso.dev/urx */ 781);




function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var _excluded = ["children"];
/** @internal */

function omit(keys, obj) {
  var result = {};
  var index = {};
  var idx = 0;
  var len = keys.length;

  while (idx < len) {
    index[keys[idx]] = 1;
    idx += 1;
  }

  for (var prop in obj) {
    if (!index.hasOwnProperty(prop)) {
      result[prop] = obj[prop];
    }
  }

  return result;
}

var useIsomorphicLayoutEffect = typeof document !== 'undefined' ? react__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_1__.useEffect;
/**
 * Converts a system spec to React component by mapping the system streams to component properties, events and methods. Returns hooks for querying and modifying
 * the system streams from the component's child components.
 * @param systemSpec The return value from a [[system]] call.
 * @param map The streams to props / events / methods mapping Check [[SystemPropsMap]] for more details.
 * @param Root The optional React component to render. By default, the resulting component renders nothing, acting as a logical wrapper for its children.
 * @returns an object containing the following:
 *  - `Component`: the React component.
 *  - `useEmitterValue`: a hook that lets child components use values emitted from the specified output stream.
 *  - `useEmitter`: a hook that calls the provided callback whenever the specified stream emits a value.
 *  - `usePublisher`: a hook which lets child components publish values to the specified stream.
 *  <hr />
 */

function systemToComponent(systemSpec, map, Root) {
  var requiredPropNames = Object.keys(map.required || {});
  var optionalPropNames = Object.keys(map.optional || {});
  var methodNames = Object.keys(map.methods || {});
  var eventNames = Object.keys(map.events || {});
  var Context = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({});

  function applyPropsToSystem(system, props) {
    if (system['propsReady']) {
      (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.publish)(system['propsReady'], false);
    }

    for (var _iterator = _createForOfIteratorHelperLoose(requiredPropNames), _step; !(_step = _iterator()).done;) {
      var requiredPropName = _step.value;
      var stream = system[map.required[requiredPropName]];
      (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.publish)(stream, props[requiredPropName]);
    }

    for (var _iterator2 = _createForOfIteratorHelperLoose(optionalPropNames), _step2; !(_step2 = _iterator2()).done;) {
      var optionalPropName = _step2.value;

      if (optionalPropName in props) {
        var _stream = system[map.optional[optionalPropName]];
        (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.publish)(_stream, props[optionalPropName]);
      }
    }

    if (system['propsReady']) {
      (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.publish)(system['propsReady'], true);
    }
  }

  function buildMethods(system) {
    return methodNames.reduce(function (acc, methodName) {
      acc[methodName] = function (value) {
        var stream = system[map.methods[methodName]];
        (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.publish)(stream, value);
      };

      return acc;
    }, {});
  }

  function buildEventHandlers(system) {
    return eventNames.reduce(function (handlers, eventName) {
      handlers[eventName] = (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.eventHandler)(system[map.events[eventName]]);
      return handlers;
    }, {});
  }
  /**
   * A React component generated from an urx system
   */


  var Component = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(function (propsWithChildren, ref) {
    var children = propsWithChildren.children,
        props = _objectWithoutPropertiesLoose(propsWithChildren, _excluded);

    var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(function () {
      return (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.tap)((0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.init)(systemSpec), function (system) {
        return applyPropsToSystem(system, props);
      });
    }),
        system = _useState[0];

    var _useState2 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.curry1to0)(buildEventHandlers, system)),
        handlers = _useState2[0];

    useIsomorphicLayoutEffect(function () {
      for (var _iterator3 = _createForOfIteratorHelperLoose(eventNames), _step3; !(_step3 = _iterator3()).done;) {
        var eventName = _step3.value;

        if (eventName in props) {
          (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.subscribe)(handlers[eventName], props[eventName]);
        }
      }

      return function () {
        Object.values(handlers).map(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.reset);
      };
    }, [props, handlers, system]);
    useIsomorphicLayoutEffect(function () {
      applyPropsToSystem(system, props);
    });
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useImperativeHandle)(ref, (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.always)(buildMethods(system)));
    return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(Context.Provider, {
      value: system
    }, Root ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(Root, omit([].concat(requiredPropNames, optionalPropNames, eventNames), props), children) : children);
  });

  var usePublisher = function usePublisher(key) {
    return (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.curry2to1)(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.publish, (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Context)[key]), [key]);
  };
  /**
   * Returns the value emitted from the stream.
   */


  var useEmitterValue = function useEmitterValue(key) {
    var context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Context);
    var source = context[key];

    var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.curry1to0)(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.getValue, source)),
        value = _useState3[0],
        setValue = _useState3[1];

    useIsomorphicLayoutEffect(function () {
      return (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.subscribe)(source, function (next) {
        if (next !== value) {
          setValue((0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.always)(next));
        }
      });
    }, [source, value]);
    return value;
  };

  var useEmitter = function useEmitter(key, callback) {
    var context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(Context);
    var source = context[key];
    useIsomorphicLayoutEffect(function () {
      return (0,_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_2__.subscribe)(source, callback);
    }, [callback, source]);
  };

  return {
    Component: Component,
    usePublisher: usePublisher,
    useEmitterValue: useEmitterValue,
    useEmitter: useEmitter
  };
}



/***/ }),

/***/ 781:
/*!********************************************************!*\
  !*** ./node_modules/@virtuoso.dev/urx/dist/urx.esm.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "always": function() { return /* binding */ always; },
/* harmony export */   "call": function() { return /* binding */ call; },
/* harmony export */   "combineLatest": function() { return /* binding */ combineLatest; },
/* harmony export */   "compose": function() { return /* binding */ compose; },
/* harmony export */   "connect": function() { return /* binding */ connect; },
/* harmony export */   "curry1to0": function() { return /* binding */ curry1to0; },
/* harmony export */   "curry2to1": function() { return /* binding */ curry2to1; },
/* harmony export */   "debounceTime": function() { return /* binding */ debounceTime; },
/* harmony export */   "defaultComparator": function() { return /* binding */ defaultComparator; },
/* harmony export */   "distinctUntilChanged": function() { return /* binding */ distinctUntilChanged; },
/* harmony export */   "duc": function() { return /* binding */ duc; },
/* harmony export */   "eventHandler": function() { return /* binding */ eventHandler; },
/* harmony export */   "filter": function() { return /* binding */ filter; },
/* harmony export */   "getValue": function() { return /* binding */ getValue; },
/* harmony export */   "handleNext": function() { return /* binding */ handleNext; },
/* harmony export */   "init": function() { return /* binding */ init; },
/* harmony export */   "joinProc": function() { return /* binding */ joinProc; },
/* harmony export */   "map": function() { return /* binding */ map; },
/* harmony export */   "mapTo": function() { return /* binding */ mapTo; },
/* harmony export */   "merge": function() { return /* binding */ merge; },
/* harmony export */   "noop": function() { return /* binding */ noop; },
/* harmony export */   "pipe": function() { return /* binding */ pipe; },
/* harmony export */   "prop": function() { return /* binding */ prop; },
/* harmony export */   "publish": function() { return /* binding */ publish; },
/* harmony export */   "reset": function() { return /* binding */ reset; },
/* harmony export */   "scan": function() { return /* binding */ scan; },
/* harmony export */   "skip": function() { return /* binding */ skip; },
/* harmony export */   "statefulStream": function() { return /* binding */ statefulStream; },
/* harmony export */   "statefulStreamFromEmitter": function() { return /* binding */ statefulStreamFromEmitter; },
/* harmony export */   "stream": function() { return /* binding */ stream; },
/* harmony export */   "streamFromEmitter": function() { return /* binding */ streamFromEmitter; },
/* harmony export */   "subscribe": function() { return /* binding */ subscribe; },
/* harmony export */   "system": function() { return /* binding */ system; },
/* harmony export */   "tap": function() { return /* binding */ tap; },
/* harmony export */   "throttleTime": function() { return /* binding */ throttleTime; },
/* harmony export */   "thrush": function() { return /* binding */ thrush; },
/* harmony export */   "tup": function() { return /* binding */ tup; },
/* harmony export */   "withLatestFrom": function() { return /* binding */ withLatestFrom; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);

var PUBLISH = 0;
var SUBSCRIBE = 1;
var RESET = 2;
var VALUE = 4;
/**
 * Utils includes
 * - a handful of functional utilities inspired by or taken from the [Ramda library](https://ramdajs.com/);
 * - TypeScript crutches - the [[tup]] function.
 *
 * Use these for your convenience - they are here so that urx is zero-dependency package.
 *
 * @packageDocumentation
 */

/**
 * Performs left to right composition of two functions.
 */

function compose(a, b) {
  return function (arg) {
    return a(b(arg));
  };
}
/**
 * Takes a value and applies a function to it.
 */


function thrush(arg, proc) {
  return proc(arg);
}
/**
 * Takes a 2 argument function and partially applies the first argument.
 */


function curry2to1(proc, arg1) {
  return function (arg2) {
    return proc(arg1, arg2);
  };
}
/**
 * Takes a 1 argument function and returns a function which when called, executes it with the provided argument.
 */


function curry1to0(proc, arg) {
  return function () {
    return proc(arg);
  };
}
/**
 * Returns a function which extracts the property from from the passed object.
 */


function prop(property) {
  return function (object) {
    return object[property];
  };
}
/**
 * Calls callback with the first argument, and returns it.
 */


function tap(arg, proc) {
  proc(arg);
  return arg;
}
/**
 *  Utility function to help typescript figure out that what we pass is a tuple and not a generic array.
 *  Taken from (this StackOverflow tread)[https://stackoverflow.com/questions/49729550/implicitly-create-a-tuple-in-typescript/52445008#52445008]
 */


function tup() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args;
}
/**
 * Calls the passed function.
 */


function call(proc) {
  proc();
}
/**
 * returns a function which when called always returns the passed value
 */


function always(value) {
  return function () {
    return value;
  };
}
/**
 * returns a function which calls all passed functions in the passed order.
 * joinProc does not pass arguments or collect return values.
 */


function joinProc() {
  for (var _len2 = arguments.length, procs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    procs[_key2] = arguments[_key2];
  }

  return function () {
    procs.map(call);
  };
}

function noop() {}
/**
 * urx Actions operate on streams - `publish` publishes data in a stream, and `subscribe` attaches a subscription to a stream.
 * @packageDocumentation
 */

/**
 * Subscribes the specified [[Subscription]] to the updates from the Emitter.
 * The emitter calls the subscription with the new data each time new data is published into it.
 *
 * ```ts
 * const foo = stream<number>();
 * subscribe(foo, (value) => console.log(value));
 * ```
 *
 * @returns an [[Unsubscribe]] handle  - calling it will unbind the subscription from the emitter.
 *```ts
 * const foo = stream<number>();
 * const unsub = subscribe(foo, (value) => console.log(value));
 * unsub();
 *```
 */


function subscribe(emitter, subscription) {
  return emitter(SUBSCRIBE, subscription);
}
/**
 * Publishes the value into the passed [[Publisher]].
 *
 * ```ts
 * const foo = stream<number>();
 * publish(foo, 42);
 * ```
 */


function publish(publisher, value) {
  publisher(PUBLISH, value);
}
/**
 * Clears all subscriptions from the [[Emitter]].
 * ```ts
 * const foo = stream<number>();
 * subscribe(foo, (value) => console.log(value));
 * reset(foo);
 * publish(foo, 42);
 * ```
 */


function reset(emitter) {
  emitter(RESET);
}
/**
 * Extracts the current value from a stateful stream. Use it only as an escape hatch, as it violates the concept of reactive programming.
 * ```ts
 * const foo = statefulStream(42);
 * console.log(getValue(foo));
 * ```
 */


function getValue(depot) {
  return depot(VALUE);
}
/**
 * Connects two streams - any value emitted from the emitter will be published in the publisher.
 * ```ts
 * const foo = stream<number>();
 * const bar = stream<number>();
 * subscribe(bar, (value) => console.log(`Bar emitted ${value}`));
 *
 * connect(foo, bar);
 * publish(foo);
 * ```
 * @returns an [[Unsubscribe]] handle which will disconnect the two streams.
 */


function connect(emitter, publisher) {
  return subscribe(emitter, curry2to1(publisher, PUBLISH));
}
/**
 * Executes the passed subscription at most once, for the next emit from the emitter.
 * ```ts
 * const foo = stream<number>()
 * handleNext(foo, value => console.log(value)) // called once, with 42
 * publish(foo, 42)
 * publish(foo, 43)
 * ```
 * @returns an [[Unsubscribe]] handle to unbind the subscription if necessary.
 */


function handleNext(emitter, subscription) {
  var unsub = emitter(SUBSCRIBE, function (value) {
    unsub();
    subscription(value);
  });
  return unsub;
}
/**
 * Streams are the basic building blocks of a reactive system. Think of them as the system permanent "data tubes".
 *
 * A stream acts as both an [[Emitter]] and [[Publisher]]. Each stream can have multiple {@link Subscription | Subscriptions}.
 *
 * urx streams are either **stateless** or **stateful**.
 * Stateless streams emit data to existing subscriptions when published, without keeping track of it.
 * Stateful streams remember the last published value and immediately publish it to new subscriptions.
 *
 * ```ts
 * import { stream, statefulStream, publish, subscribe } from "@virtuoso.dev/urx";
 *
 * // foo is a stateless stream
 * const foo = stream<number>();
 *
 * publish(foo, 42);
 * // this subsription will not be called...
 * subscribe(foo, (value) => console.log(value));
 * // it will only catch published values after it
 * publish(foo, 43);
 *
 * // stateful streams always start with an initial value
 * const bar = statefulStream(42);
 *
 * // subscribing to a stateful stream
 * // immediately calls the subscription with the current value
 * subscribe(bar, (value) => console.log(value));
 *
 * // subsequent publishing works just like stateless streams
 * publish(bar, 43);
 * ```
 * @packageDocumentation
 */

/**
 * Constructs a new stateless stream.
 * ```ts
 * const foo = stream<number>();
 * ```
 * @typeParam T the type of values to publish in the stream.
 * @returns a [[Stream]]
 */


function stream() {
  var subscriptions = [];
  return function (action, arg) {
    switch (action) {
      case RESET:
        subscriptions.splice(0, subscriptions.length);
        return;

      case SUBSCRIBE:
        subscriptions.push(arg);
        return function () {
          var indexOf = subscriptions.indexOf(arg);

          if (indexOf > -1) {
            subscriptions.splice(indexOf, 1);
          }
        };

      case PUBLISH:
        subscriptions.slice().forEach(function (subscription) {
          subscription(arg);
        });
        return;

      default:
        throw new Error("unrecognized action " + action);
    }
  };
}
/**
 * Constructs a new stateful stream.
 * ```ts
 * const foo = statefulStream(42);
 * ```
 * @param initial the initial value in the stream.
 * @typeParam T the type of values to publish in the stream. If omitted, the function infers it from the initial value.
 * @returns a [[StatefulStream]]
 */


function statefulStream(initial) {
  var value = initial;
  var innerSubject = stream();
  return function (action, arg) {
    switch (action) {
      case SUBSCRIBE:
        var subscription = arg;
        subscription(value);
        break;

      case PUBLISH:
        value = arg;
        break;

      case VALUE:
        return value;
    }

    return innerSubject(action, arg);
  };
}
/**
 * Event handlers are special emitters which can have **at most one active subscription**.
 * Subscribing to an event handler unsubscribes the previous subscription, if present.
 * ```ts
 * const foo = stream<number>();
 * const fooEvent = eventHandler(foo);
 *
 * // will be called once with 42
 * subscribe(fooEvent, (value) => console.log(`Sub 1 ${value}`));
 * publish(foo, 42);
 *
 * // unsubscribes sub 1
 * subscribe(fooEvent, (value) => console.log(`Sub 2 ${value}`));
 * publish(foo, 43);
 * ```
 * @param emitter the source emitter.
 * @returns the single-subscription emitter.
 */


function eventHandler(emitter) {
  var unsub;
  var currentSubscription;

  var cleanup = function cleanup() {
    return unsub && unsub();
  };

  return function (action, subscription) {
    switch (action) {
      case SUBSCRIBE:
        if (subscription) {
          if (currentSubscription === subscription) {
            return;
          }

          cleanup();
          currentSubscription = subscription;
          unsub = subscribe(emitter, subscription);
          return unsub;
        } else {
          cleanup();
          return noop;
        }

      case RESET:
        cleanup();
        currentSubscription = null;
        return;

      default:
        throw new Error("unrecognized action " + action);
    }
  };
}
/**
 * Creates and connects a "junction" stream to the specified emitter. Often used with [[pipe]], to avoid the multiple evaluation of operator sets.
 *
 * ```ts
 * const foo = stream<number>();
 *
 * const fooX2 = pipe(
 *   foo,
 *   map((value) => {
 *     console.log(`multiplying ${value}`);
 *     return value * 2;
 *   })
 * );
 *
 * subscribe(fooX2, (value) => console.log(value));
 * subscribe(fooX2, (value) => console.log(value));
 *
 * publish(foo, 42); // executes the map operator twice for each subscription.
 *
 * const sharedFooX2 = streamFromEmitter(pipe(
 *   foo,
 *   map((value) => {
 *     console.log(`shared multiplying ${value}`);
 *     return value * 2;
 *   })
 * ));
 *
 * subscribe(sharedFooX2, (value) => console.log(value));
 * subscribe(sharedFooX2, (value) => console.log(value));
 *
 * publish(foo, 42);
 *```
 * @returns the resulting stream.
 */


function streamFromEmitter(emitter) {
  return tap(stream(), function (stream) {
    return connect(emitter, stream);
  });
}
/**
 * Creates and connects a "junction" stateful stream to the specified emitter. Often used with [[pipe]], to avoid the multiple evaluation of operator sets.
 *
 * ```ts
 * const foo = stream<number>();
 *
 * const fooX2 = pipe(
 *   foo,
 *   map((value) => {
 *     console.log(`multiplying ${value}`);
 *     return value * 2;
 *   })
 * );
 *
 * subscribe(fooX2, (value) => console.log(value));
 * subscribe(fooX2, (value) => console.log(value));
 *
 * publish(foo, 42); // executes the map operator twice for each subscription.
 *
 * const sharedFooX2 = statefulStreamFromEmitter(pipe(
 *   foo,
 *   map((value) => {
 *     console.log(`shared multiplying ${value}`);
 *     return value * 2;
 *   })
 * ), 42);
 *
 * subscribe(sharedFooX2, (value) => console.log(value));
 * subscribe(sharedFooX2, (value) => console.log(value));
 *
 * publish(foo, 42);
 *```
 * @param initial the initial value in the stream.
 * @returns the resulting stateful stream.
 */


function statefulStreamFromEmitter(emitter, initial) {
  return tap(statefulStream(initial), function (stream) {
    return connect(emitter, stream);
  });
}
/**
 *
 * Stream values can be transformed and controlled by {@link pipe | **piping**} through **operators**.
 * urx includes several operators like [[map]], [[filter]], [[scan]], and [[throttleTime]].
 * The [[withLatestFrom]] operator allows the combination of values from other streams.
 *
 * ```ts
 * const foo = stream<number>()
 *
 * // create an emitter that first adds 2 to the passed value, then multiplies it by * 2
 * const bar = pipe(foo, map(value => value + 2), map(value => value * 2))
 * subscribe(bar, value => console.log(value))
 * publish(foo, 2) // outputs 8
 * ```
 *
 * ### Implementing Custom Operators
 * To implement your own operators, implement the [[Operator]] interface.
 * @packageDocumentation
 */

/** @internal */


function combineOperators() {
  for (var _len = arguments.length, operators = new Array(_len), _key = 0; _key < _len; _key++) {
    operators[_key] = arguments[_key];
  }

  return function (subscriber) {
    return operators.reduceRight(thrush, subscriber);
  };
}

function pipe(source) {
  for (var _len2 = arguments.length, operators = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    operators[_key2 - 1] = arguments[_key2];
  } // prettier-ignore


  var project = combineOperators.apply(void 0, operators);
  return function (action, subscription) {
    switch (action) {
      case SUBSCRIBE:
        return subscribe(source, project(subscription));

      case RESET:
        reset(source);
        return;

      default:
        throw new Error("unrecognized action " + action);
    }
  };
}
/**
 * The default [[Comparator]] for [[distinctUntilChanged]] and [[duc]].
 */


function defaultComparator(previous, next) {
  return previous === next;
}
/**
 * Filters out identical values. Pass an optional [[Comparator]] if you need to filter non-primitive values.
 * ```ts
 * const foo = stream<number>()
 *
 * subscribe(
 *  pipe(foo, distinctUntilChanged()),
 *  console.log
 * ) // will be called only once
 *
 * publish(foo, 42)
 * publish(foo, 42)
 * ```
 */


function distinctUntilChanged(comparator) {
  if (comparator === void 0) {
    comparator = defaultComparator;
  }

  var current;
  return function (done) {
    return function (next) {
      if (!comparator(current, next)) {
        current = next;
        done(next);
      }
    };
  };
}
/**
 * Filters out values for which the predicator does not return `true`-ish.
 * ```ts
 * const foo = stream<number>()
 *
 * subscribe(
 *  pipe(foo, filter(value => value % 2 === 0)),
 *  console.log
 * ) // will be called only with even values
 *
 * publish(foo, 2)
 * publish(foo, 3)
 * publish(foo, 4)
 * publish(foo, 5)
 * ```
 */


function filter(predicate) {
  return function (done) {
    return function (value) {
      predicate(value) && done(value);
    };
  };
}
/**
 * Maps values using the provided project function.
 * ```ts
 * const foo = stream<number>()
 *
 * subscribe(
 *  pipe(foo, map(value => value * 2)),
 *  console.log
 * ) // 4, 6
 *
 * publish(foo, 2)
 * publish(foo, 3)
 * ```
 */


function map(project) {
  return function (done) {
    return compose(done, project);
  };
}
/**
 * Maps values to the hard-coded value.
 * ```ts
 * const foo = stream<number>()
 *
 * subscribe(
 *  pipe(foo, mapTo(3)),
 *  console.log
 * ) // 3, 3
 *
 * publish(foo, 1)
 * publish(foo, 2)
 * ```
 */


function mapTo(value) {
  return function (done) {
    return function () {
      return done(value);
    };
  };
}
/**
 * Works like Array#reduce.
 * Applies an accumulator function on the emitter, and outputs intermediate result. Starts with the initial value.
 * ```ts
 * const foo = stream<number>()
 *
 * subscribe(
 *  pipe(foo, scan((acc, value) => acc + value, 2),
 *  console.log
 * ) // 3, 5
 *
 * publish(foo, 1)
 * publish(foo, 2)
 * ```
 */


function scan(scanner, initial) {
  return function (done) {
    return function (value) {
      return done(initial = scanner(initial, value));
    };
  };
}
/**
 * Skips the specified amount of values from the emitter.
 * ```ts
 * const foo = stream<number>()
 *
 * subscribe(
 *  pipe(foo, skip(2)),
 *  console.log
 * ) // 3, 4
 *
 * publish(foo, 1) // skipped
 * publish(foo, 2) // skipped
 * publish(foo, 3)
 * publish(foo, 4)
 * ```
 */


function skip(times) {
  return function (done) {
    return function (value) {
      times > 0 ? times-- : done(value);
    };
  };
}
/**
 * Throttles flowing values at the provided interval in milliseconds.
 * [Throttle VS Debounce in SO](https://stackoverflow.com/questions/25991367/difference-between-throttling-and-debouncing-a-function).
 *
 * ```ts
 *  const foo = stream<number>()
 *  publish(foo, 1)
 *
 *  setTimeout(() => publish(foo, 2), 20)
 *  setTimeout(() => publish(foo, 3), 20)
 *
 *  subscribe(pipe(foo, throttleTime(50)), val => {
 *    console.log(value); // 3
 *  })
 * ```
 */


function throttleTime(interval) {
  var currentValue;
  var timeout;
  return function (done) {
    return function (value) {
      currentValue = value;

      if (timeout) {
        return;
      }

      timeout = setTimeout(function () {
        timeout = undefined;
        done(currentValue);
      }, interval);
    };
  };
}
/**
 * Debounces flowing values at the provided interval in milliseconds.
 * [Throttle VS Debounce in SO](https://stackoverflow.com/questions/25991367/difference-between-throttling-and-debouncing-a-function).
 *
 * ```ts
 *  const foo = stream<number>()
 *  publish(foo, 1)
 *
 *  setTimeout(() => publish(foo, 2), 20)
 *  setTimeout(() => publish(foo, 3), 20)
 *
 *  subscribe(pipe(foo, debounceTime(50)), val => {
 *    console.log(value); // 3
 *  })
 * ```
 */


function debounceTime(interval) {
  var currentValue;
  var timeout;
  return function (done) {
    return function (value) {
      currentValue = value;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(function () {
        done(currentValue);
      }, interval);
    };
  };
}

function withLatestFrom() {
  for (var _len3 = arguments.length, sources = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    sources[_key3] = arguments[_key3];
  }

  var values = new Array(sources.length);
  var called = 0;
  var pendingCall = null;
  var allCalled = Math.pow(2, sources.length) - 1;
  sources.forEach(function (source, index) {
    var bit = Math.pow(2, index);
    subscribe(source, function (value) {
      var prevCalled = called;
      called = called | bit;
      values[index] = value;

      if (prevCalled !== allCalled && called === allCalled && pendingCall) {
        pendingCall();
        pendingCall = null;
      }
    });
  });
  return function (done) {
    return function (value) {
      var call = function call() {
        return done([value].concat(values));
      };

      if (called === allCalled) {
        call();
      } else {
        pendingCall = call;
      }
    };
  };
}
/**
 * Transformers change and combine streams, similar to operators.
 * urx comes with two combinators - [[combineLatest]] and [[merge]], and one convenience filter - [[duc]].
 *
 * @packageDocumentation
 */

/**
 * Merges one or more emitters from the same type into a new Emitter which emits values from any of the source emitters.
 * ```ts
 * const foo = stream<number>()
 * const bar = stream<number>()
 *
 * subscribe(merge(foo, bar), (value) => console.log(value)) // 42, 43
 *
 * publish(foo, 42)
 * publish(bar, 43)
 * ```
 */


function merge() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  return function (action, subscription) {
    switch (action) {
      case SUBSCRIBE:
        return joinProc.apply(void 0, sources.map(function (source) {
          return subscribe(source, subscription);
        }));

      case RESET:
        // do nothing, we are stateless
        return;

      default:
        throw new Error("unrecognized action " + action);
    }
  };
}
/**
 * A convenience wrapper that emits only the distinct values from the passed Emitter. Wraps [[pipe]] and [[distinctUntilChanged]].
 *
 * ```ts
 * const foo = stream<number>()
 *
 * // this line...
 * const a = duc(foo)
 *
 * // is equivalent to this
 * const b = pipe(distinctUntilChanged(foo))
 * ```
 *
 * @param source The source emitter.
 * @param comparator optional custom comparison function for the two values.
 *
 * @typeParam T the type of the value emitted by the source.
 *
 * @returns the resulting emitter.
 */


function duc(source, comparator) {
  if (comparator === void 0) {
    comparator = defaultComparator;
  }

  return pipe(source, distinctUntilChanged(comparator));
}

function combineLatest() {
  var innerSubject = stream();

  for (var _len2 = arguments.length, emitters = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    emitters[_key2] = arguments[_key2];
  }

  var values = new Array(emitters.length);
  var called = 0;
  var allCalled = Math.pow(2, emitters.length) - 1;
  emitters.forEach(function (source, index) {
    var bit = Math.pow(2, index);
    subscribe(source, function (value) {
      values[index] = value;
      called = called | bit;

      if (called === allCalled) {
        publish(innerSubject, values);
      }
    });
  });
  return function (action, subscription) {
    switch (action) {
      case SUBSCRIBE:
        if (called === allCalled) {
          subscription(values);
        }

        return subscribe(innerSubject, subscription);

      case RESET:
        return reset(innerSubject);

      default:
        throw new Error("unrecognized action " + action);
    }
  };
}
/**
 * `system` defines a specification of a system - its constructor, dependencies and if it should act as a singleton in a system dependency tree.
 * When called, system returns a [[SystemSpec]], which is then initialized along with its dependencies by passing it to [[init]].
 *
 * ```ts
 * @import { subscribe, publish, system, init, tup, connect, map, pipe } from 'urx'
 *
 * // a simple system with two streams
 * const sys1 = system(() => {
 *  const a = stream<number>()
 *  const b = stream<number>()
 *
 *  connect(pipe(a, map(value => value * 2)), b)
 *  return { a, b }
 * })
 *
 * // a second system which depends on the streams from the first one
 * const sys2 = system(([ {a, b} ]) => {
 *  const c = stream<number>()
 *  connect(pipe(b, map(value => value * 2)), c)
 *  // re-export the `a` stream, keep `b` internal
 *  return { a, c }
 * }, tup(sys1))
 *
 * // init will recursively initialize sys2 dependencies, in this case sys1
 * const { a, c } = init(sys2)
 * subscribe(c, c => console.log(`Value multiplied by 4`, c))
 * publish(a, 2)
 * ```
 *
 * #### Singletons in Dependency Tree
 *
 * By default, systems will be initialized only once if encountered multiple times in the dependency tree.
 * In the below dependency system tree, systems `b` and `c` will receive the same stream instances from system `a` when system `d` is initialized.
 * ```txt
 *   a
 *  / \
 * b   c
 *  \ /
 *   d
 * ```
 * If `a` gets `{singleton: false}` as a last argument, `init` creates two separate instances - one for `b` and one for `c`.
 *
 * @param constructor the system constructor function. Initialize and connect the streams in its body.
 *
 * @param dependencies the system dependencies, which the constructor will receive as arguments.
 * Use the [[tup]] utility **For TypeScript type inference to work correctly**.
 * ```ts
 * const sys3 = system(() => { ... }, tup(sys2, sys1))
 * ```
 * @param __namedParameters Options
 * @param singleton determines if the system will act as a singleton in a system dependency tree. `true` by default.
 */


function system(constructor, dependencies, _temp) {
  if (dependencies === void 0) {
    dependencies = [];
  }

  var _ref = _temp === void 0 ? {
    singleton: true
  } : _temp,
      singleton = _ref.singleton;

  return {
    id: id(),
    constructor: constructor,
    dependencies: dependencies,
    singleton: singleton
  };
}
/** @internal */


var id = function id() {
  return Symbol();
};
/**
 * Initializes a [[SystemSpec]] by recursively initializing its dependencies.
 *
 * ```ts
 * // a simple system with two streams
 * const sys1 = system(() => {
 *  const a = stream<number>()
 *  const b = stream<number>()
 *
 *  connect(pipe(a, map(value => value * 2)), b)
 *  return { a, b }
 * })
 *
 * const { a, b } = init(sys1)
 * subscribe(b, b => console.log(b))
 * publish(a, 2)
 * ```
 *
 * @returns the [[System]] constructed by the spec constructor.
 * @param systemSpec the system spec to initialize.
 */


function init(systemSpec) {
  var singletons = new Map();

  var _init = function _init(_ref2) {
    var id = _ref2.id,
        constructor = _ref2.constructor,
        dependencies = _ref2.dependencies,
        singleton = _ref2.singleton;

    if (singleton && singletons.has(id)) {
      return singletons.get(id);
    }

    var system = constructor(dependencies.map(function (e) {
      return _init(e);
    }));

    if (singleton) {
      singletons.set(id, system);
    }

    return system;
  };

  return _init(systemSpec);
}



/***/ }),

/***/ 738:
/*!******************************************!*\
  !*** ./node_modules/char-regex/index.js ***!
  \******************************************/
/***/ (function(module) {

"use strict";
 // Based on: https://github.com/lodash/lodash/blob/6018350ac10d5ce6a5b7db625140b82aeab804df/.internal/unicodeSize.js

module.exports = () => {
  // Used to compose unicode character classes.
  const astralRange = "\\ud800-\\udfff";
  const comboMarksRange = "\\u0300-\\u036f";
  const comboHalfMarksRange = "\\ufe20-\\ufe2f";
  const comboSymbolsRange = "\\u20d0-\\u20ff";
  const comboMarksExtendedRange = "\\u1ab0-\\u1aff";
  const comboMarksSupplementRange = "\\u1dc0-\\u1dff";
  const comboRange = comboMarksRange + comboHalfMarksRange + comboSymbolsRange + comboMarksExtendedRange + comboMarksSupplementRange;
  const varRange = "\\ufe0e\\ufe0f";
  const familyRange = "\\uD83D\\uDC69\\uD83C\\uDFFB\\u200D\\uD83C\\uDF93"; // Used to compose unicode capture groups.

  const astral = "[".concat(astralRange, "]");
  const combo = "[".concat(comboRange, "]");
  const fitz = "\\ud83c[\\udffb-\\udfff]";
  const modifier = "(?:".concat(combo, "|").concat(fitz, ")");
  const nonAstral = "[^".concat(astralRange, "]");
  const regional = "(?:\\uD83C[\\uDDE6-\\uDDFF]){2}";
  const surrogatePair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
  const zwj = "\\u200d";
  const blackFlag = "(?:\\ud83c\\udff4\\udb40\\udc67\\udb40\\udc62\\udb40(?:\\udc65|\\udc73|\\udc77)\\udb40(?:\\udc6e|\\udc63|\\udc6c)\\udb40(?:\\udc67|\\udc74|\\udc73)\\udb40\\udc7f)";
  const family = "[".concat(familyRange, "]"); // Used to compose unicode regexes.

  const optModifier = "".concat(modifier, "?");
  const optVar = "[".concat(varRange, "]?");
  const optJoin = "(?:".concat(zwj, "(?:").concat([nonAstral, regional, surrogatePair].join("|"), ")").concat(optVar + optModifier, ")*");
  const seq = optVar + optModifier + optJoin;
  const nonAstralCombo = "".concat(nonAstral).concat(combo, "?");
  const symbol = "(?:".concat([nonAstralCombo, combo, regional, surrogatePair, astral, family].join("|"), ")"); // Used to match [String symbols](https://mathiasbynens.be/notes/javascript-unicode).

  return new RegExp("".concat(blackFlag, "|").concat(fitz, "(?=").concat(fitz, ")|").concat(symbol + seq), "g");
};

/***/ }),

/***/ 756:
/*!************************************************!*\
  !*** ./node_modules/lodash/_escapeHtmlChar.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var basePropertyOf = __webpack_require__(/*! ./_basePropertyOf */ 336);
/** Used to map characters to HTML entities. */


var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */

var escapeHtmlChar = basePropertyOf(htmlEscapes);
module.exports = escapeHtmlChar;

/***/ }),

/***/ 755:
/*!***************************************!*\
  !*** ./node_modules/lodash/escape.js ***!
  \***************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);

var escapeHtmlChar = __webpack_require__(/*! ./_escapeHtmlChar */ 756),
    toString = __webpack_require__(/*! ./toString */ 73);
/** Used to match HTML entities and HTML characters. */


var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */

function escape(string) {
  string = toString(string);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}

module.exports = escape;

/***/ }),

/***/ 452:
/*!*************************************!*\
  !*** ./node_modules/lodash/noop.js ***!
  \*************************************/
/***/ (function(module) {

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
function noop() {// No operation performed.
}

module.exports = noop;

/***/ }),

/***/ 1460:
/*!****************************************************!*\
  !*** ./node_modules/qrcode.react/lib/esm/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QRCodeCanvas": function() { return /* binding */ QRCodeCanvas; },
/* harmony export */   "QRCodeSVG": function() { return /* binding */ QRCodeSVG; },
/* harmony export */   "default": function() { return /* binding */ QRCode; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;

var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;

var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);

  if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
    if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  }
  return a;
};

var __objRest = (source, exclude) => {
  var target = {};

  for (var prop in source) if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];

  if (source != null && __getOwnPropSymbols) for (var prop of __getOwnPropSymbols(source)) {
    if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
  }
  return target;
}; // src/index.tsx


 // src/third-party/qrcodegen/index.ts

/**
 * @license QR Code generator library (TypeScript)
 * Copyright (c) Project Nayuki.
 * SPDX-License-Identifier: MIT
 */

var qrcodegen;

(qrcodegen2 => {
  const _QrCode = class {
    constructor(version, errorCorrectionLevel, dataCodewords, msk) {
      this.version = version;
      this.errorCorrectionLevel = errorCorrectionLevel;
      this.modules = [];
      this.isFunction = [];
      if (version < _QrCode.MIN_VERSION || version > _QrCode.MAX_VERSION) throw new RangeError("Version value out of range");
      if (msk < -1 || msk > 7) throw new RangeError("Mask value out of range");
      this.size = version * 4 + 17;
      let row = [];

      for (let i = 0; i < this.size; i++) row.push(false);

      for (let i = 0; i < this.size; i++) {
        this.modules.push(row.slice());
        this.isFunction.push(row.slice());
      }

      this.drawFunctionPatterns();
      const allCodewords = this.addEccAndInterleave(dataCodewords);
      this.drawCodewords(allCodewords);

      if (msk == -1) {
        let minPenalty = 1e9;

        for (let i = 0; i < 8; i++) {
          this.applyMask(i);
          this.drawFormatBits(i);
          const penalty = this.getPenaltyScore();

          if (penalty < minPenalty) {
            msk = i;
            minPenalty = penalty;
          }

          this.applyMask(i);
        }
      }

      assert(0 <= msk && msk <= 7);
      this.mask = msk;
      this.applyMask(msk);
      this.drawFormatBits(msk);
      this.isFunction = [];
    }

    static encodeText(text, ecl) {
      const segs = qrcodegen2.QrSegment.makeSegments(text);
      return _QrCode.encodeSegments(segs, ecl);
    }

    static encodeBinary(data, ecl) {
      const seg = qrcodegen2.QrSegment.makeBytes(data);
      return _QrCode.encodeSegments([seg], ecl);
    }

    static encodeSegments(segs, ecl) {
      let minVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      let maxVersion = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 40;
      let mask = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
      let boostEcl = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
      if (!(_QrCode.MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= _QrCode.MAX_VERSION) || mask < -1 || mask > 7) throw new RangeError("Invalid value");
      let version;
      let dataUsedBits;

      for (version = minVersion;; version++) {
        const dataCapacityBits2 = _QrCode.getNumDataCodewords(version, ecl) * 8;
        const usedBits = QrSegment.getTotalBits(segs, version);

        if (usedBits <= dataCapacityBits2) {
          dataUsedBits = usedBits;
          break;
        }

        if (version >= maxVersion) throw new RangeError("Data too long");
      }

      for (const newEcl of [_QrCode.Ecc.MEDIUM, _QrCode.Ecc.QUARTILE, _QrCode.Ecc.HIGH]) {
        if (boostEcl && dataUsedBits <= _QrCode.getNumDataCodewords(version, newEcl) * 8) ecl = newEcl;
      }

      let bb = [];

      for (const seg of segs) {
        appendBits(seg.mode.modeBits, 4, bb);
        appendBits(seg.numChars, seg.mode.numCharCountBits(version), bb);

        for (const b of seg.getData()) bb.push(b);
      }

      assert(bb.length == dataUsedBits);
      const dataCapacityBits = _QrCode.getNumDataCodewords(version, ecl) * 8;
      assert(bb.length <= dataCapacityBits);
      appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
      appendBits(0, (8 - bb.length % 8) % 8, bb);
      assert(bb.length % 8 == 0);

      for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 236 ^ 17) appendBits(padByte, 8, bb);

      let dataCodewords = [];

      while (dataCodewords.length * 8 < bb.length) dataCodewords.push(0);

      bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << 7 - (i & 7));
      return new _QrCode(version, ecl, dataCodewords, mask);
    }

    getModule(x, y) {
      return 0 <= x && x < this.size && 0 <= y && y < this.size && this.modules[y][x];
    }

    getModules() {
      return this.modules;
    }

    drawFunctionPatterns() {
      for (let i = 0; i < this.size; i++) {
        this.setFunctionModule(6, i, i % 2 == 0);
        this.setFunctionModule(i, 6, i % 2 == 0);
      }

      this.drawFinderPattern(3, 3);
      this.drawFinderPattern(this.size - 4, 3);
      this.drawFinderPattern(3, this.size - 4);
      const alignPatPos = this.getAlignmentPatternPositions();
      const numAlign = alignPatPos.length;

      for (let i = 0; i < numAlign; i++) {
        for (let j = 0; j < numAlign; j++) {
          if (!(i == 0 && j == 0 || i == 0 && j == numAlign - 1 || i == numAlign - 1 && j == 0)) this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
        }
      }

      this.drawFormatBits(0);
      this.drawVersion();
    }

    drawFormatBits(mask) {
      const data = this.errorCorrectionLevel.formatBits << 3 | mask;
      let rem = data;

      for (let i = 0; i < 10; i++) rem = rem << 1 ^ (rem >>> 9) * 1335;

      const bits = (data << 10 | rem) ^ 21522;
      assert(bits >>> 15 == 0);

      for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, getBit(bits, i));

      this.setFunctionModule(8, 7, getBit(bits, 6));
      this.setFunctionModule(8, 8, getBit(bits, 7));
      this.setFunctionModule(7, 8, getBit(bits, 8));

      for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, getBit(bits, i));

      for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));

      for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));

      this.setFunctionModule(8, this.size - 8, true);
    }

    drawVersion() {
      if (this.version < 7) return;
      let rem = this.version;

      for (let i = 0; i < 12; i++) rem = rem << 1 ^ (rem >>> 11) * 7973;

      const bits = this.version << 12 | rem;
      assert(bits >>> 18 == 0);

      for (let i = 0; i < 18; i++) {
        const color = getBit(bits, i);
        const a = this.size - 11 + i % 3;
        const b = Math.floor(i / 3);
        this.setFunctionModule(a, b, color);
        this.setFunctionModule(b, a, color);
      }
    }

    drawFinderPattern(x, y) {
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const xx = x + dx;
          const yy = y + dy;
          if (0 <= xx && xx < this.size && 0 <= yy && yy < this.size) this.setFunctionModule(xx, yy, dist != 2 && dist != 4);
        }
      }
    }

    drawAlignmentPattern(x, y) {
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
      }
    }

    setFunctionModule(x, y, isDark) {
      this.modules[y][x] = isDark;
      this.isFunction[y][x] = true;
    }

    addEccAndInterleave(data) {
      const ver = this.version;
      const ecl = this.errorCorrectionLevel;
      if (data.length != _QrCode.getNumDataCodewords(ver, ecl)) throw new RangeError("Invalid argument");
      const numBlocks = _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
      const blockEccLen = _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver];
      const rawCodewords = Math.floor(_QrCode.getNumRawDataModules(ver) / 8);
      const numShortBlocks = numBlocks - rawCodewords % numBlocks;
      const shortBlockLen = Math.floor(rawCodewords / numBlocks);
      let blocks = [];

      const rsDiv = _QrCode.reedSolomonComputeDivisor(blockEccLen);

      for (let i = 0, k = 0; i < numBlocks; i++) {
        let dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
        k += dat.length;

        const ecc = _QrCode.reedSolomonComputeRemainder(dat, rsDiv);

        if (i < numShortBlocks) dat.push(0);
        blocks.push(dat.concat(ecc));
      }

      let result = [];

      for (let i = 0; i < blocks[0].length; i++) {
        blocks.forEach((block, j) => {
          if (i != shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[i]);
        });
      }

      assert(result.length == rawCodewords);
      return result;
    }

    drawCodewords(data) {
      if (data.length != Math.floor(_QrCode.getNumRawDataModules(this.version) / 8)) throw new RangeError("Invalid argument");
      let i = 0;

      for (let right = this.size - 1; right >= 1; right -= 2) {
        if (right == 6) right = 5;

        for (let vert = 0; vert < this.size; vert++) {
          for (let j = 0; j < 2; j++) {
            const x = right - j;
            const upward = (right + 1 & 2) == 0;
            const y = upward ? this.size - 1 - vert : vert;

            if (!this.isFunction[y][x] && i < data.length * 8) {
              this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
              i++;
            }
          }
        }
      }

      assert(i == data.length * 8);
    }

    applyMask(mask) {
      if (mask < 0 || mask > 7) throw new RangeError("Mask value out of range");

      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          let invert;

          switch (mask) {
            case 0:
              invert = (x + y) % 2 == 0;
              break;

            case 1:
              invert = y % 2 == 0;
              break;

            case 2:
              invert = x % 3 == 0;
              break;

            case 3:
              invert = (x + y) % 3 == 0;
              break;

            case 4:
              invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 == 0;
              break;

            case 5:
              invert = x * y % 2 + x * y % 3 == 0;
              break;

            case 6:
              invert = (x * y % 2 + x * y % 3) % 2 == 0;
              break;

            case 7:
              invert = ((x + y) % 2 + x * y % 3) % 2 == 0;
              break;

            default:
              throw new Error("Unreachable");
          }

          if (!this.isFunction[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
        }
      }
    }

    getPenaltyScore() {
      let result = 0;

      for (let y = 0; y < this.size; y++) {
        let runColor = false;
        let runX = 0;
        let runHistory = [0, 0, 0, 0, 0, 0, 0];

        for (let x = 0; x < this.size; x++) {
          if (this.modules[y][x] == runColor) {
            runX++;
            if (runX == 5) result += _QrCode.PENALTY_N1;else if (runX > 5) result++;
          } else {
            this.finderPenaltyAddHistory(runX, runHistory);
            if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
            runColor = this.modules[y][x];
            runX = 1;
          }
        }

        result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * _QrCode.PENALTY_N3;
      }

      for (let x = 0; x < this.size; x++) {
        let runColor = false;
        let runY = 0;
        let runHistory = [0, 0, 0, 0, 0, 0, 0];

        for (let y = 0; y < this.size; y++) {
          if (this.modules[y][x] == runColor) {
            runY++;
            if (runY == 5) result += _QrCode.PENALTY_N1;else if (runY > 5) result++;
          } else {
            this.finderPenaltyAddHistory(runY, runHistory);
            if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * _QrCode.PENALTY_N3;
            runColor = this.modules[y][x];
            runY = 1;
          }
        }

        result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * _QrCode.PENALTY_N3;
      }

      for (let y = 0; y < this.size - 1; y++) {
        for (let x = 0; x < this.size - 1; x++) {
          const color = this.modules[y][x];
          if (color == this.modules[y][x + 1] && color == this.modules[y + 1][x] && color == this.modules[y + 1][x + 1]) result += _QrCode.PENALTY_N2;
        }
      }

      let dark = 0;

      for (const row of this.modules) dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);

      const total = this.size * this.size;
      const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
      assert(0 <= k && k <= 9);
      result += k * _QrCode.PENALTY_N4;
      assert(0 <= result && result <= 2568888);
      return result;
    }

    getAlignmentPatternPositions() {
      if (this.version == 1) return [];else {
        const numAlign = Math.floor(this.version / 7) + 2;
        const step = this.version == 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
        let result = [6];

        for (let pos = this.size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);

        return result;
      }
    }

    static getNumRawDataModules(ver) {
      if (ver < _QrCode.MIN_VERSION || ver > _QrCode.MAX_VERSION) throw new RangeError("Version number out of range");
      let result = (16 * ver + 128) * ver + 64;

      if (ver >= 2) {
        const numAlign = Math.floor(ver / 7) + 2;
        result -= (25 * numAlign - 10) * numAlign - 55;
        if (ver >= 7) result -= 36;
      }

      assert(208 <= result && result <= 29648);
      return result;
    }

    static getNumDataCodewords(ver, ecl) {
      return Math.floor(_QrCode.getNumRawDataModules(ver) / 8) - _QrCode.ECC_CODEWORDS_PER_BLOCK[ecl.ordinal][ver] * _QrCode.NUM_ERROR_CORRECTION_BLOCKS[ecl.ordinal][ver];
    }

    static reedSolomonComputeDivisor(degree) {
      if (degree < 1 || degree > 255) throw new RangeError("Degree out of range");
      let result = [];

      for (let i = 0; i < degree - 1; i++) result.push(0);

      result.push(1);
      let root = 1;

      for (let i = 0; i < degree; i++) {
        for (let j = 0; j < result.length; j++) {
          result[j] = _QrCode.reedSolomonMultiply(result[j], root);
          if (j + 1 < result.length) result[j] ^= result[j + 1];
        }

        root = _QrCode.reedSolomonMultiply(root, 2);
      }

      return result;
    }

    static reedSolomonComputeRemainder(data, divisor) {
      let result = divisor.map(_ => 0);

      for (const b of data) {
        const factor = b ^ result.shift();
        result.push(0);
        divisor.forEach((coef, i) => result[i] ^= _QrCode.reedSolomonMultiply(coef, factor));
      }

      return result;
    }

    static reedSolomonMultiply(x, y) {
      if (x >>> 8 != 0 || y >>> 8 != 0) throw new RangeError("Byte out of range");
      let z = 0;

      for (let i = 7; i >= 0; i--) {
        z = z << 1 ^ (z >>> 7) * 285;
        z ^= (y >>> i & 1) * x;
      }

      assert(z >>> 8 == 0);
      return z;
    }

    finderPenaltyCountPatterns(runHistory) {
      const n = runHistory[1];
      assert(n <= this.size * 3);
      const core = n > 0 && runHistory[2] == n && runHistory[3] == n * 3 && runHistory[4] == n && runHistory[5] == n;
      return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
    }

    finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
      if (currentRunColor) {
        this.finderPenaltyAddHistory(currentRunLength, runHistory);
        currentRunLength = 0;
      }

      currentRunLength += this.size;
      this.finderPenaltyAddHistory(currentRunLength, runHistory);
      return this.finderPenaltyCountPatterns(runHistory);
    }

    finderPenaltyAddHistory(currentRunLength, runHistory) {
      if (runHistory[0] == 0) currentRunLength += this.size;
      runHistory.pop();
      runHistory.unshift(currentRunLength);
    }

  };

  let QrCode = _QrCode;
  QrCode.MIN_VERSION = 1;
  QrCode.MAX_VERSION = 40;
  QrCode.PENALTY_N1 = 3;
  QrCode.PENALTY_N2 = 3;
  QrCode.PENALTY_N3 = 40;
  QrCode.PENALTY_N4 = 10;
  QrCode.ECC_CODEWORDS_PER_BLOCK = [[-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28], [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]];
  QrCode.NUM_ERROR_CORRECTION_BLOCKS = [[-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25], [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49], [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68], [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]];
  qrcodegen2.QrCode = QrCode;

  function appendBits(val, len, bb) {
    if (len < 0 || len > 31 || val >>> len != 0) throw new RangeError("Value out of range");

    for (let i = len - 1; i >= 0; i--) bb.push(val >>> i & 1);
  }

  function getBit(x, i) {
    return (x >>> i & 1) != 0;
  }

  function assert(cond) {
    if (!cond) throw new Error("Assertion error");
  }

  const _QrSegment = class {
    constructor(mode, numChars, bitData) {
      this.mode = mode;
      this.numChars = numChars;
      this.bitData = bitData;
      if (numChars < 0) throw new RangeError("Invalid argument");
      this.bitData = bitData.slice();
    }

    static makeBytes(data) {
      let bb = [];

      for (const b of data) appendBits(b, 8, bb);

      return new _QrSegment(_QrSegment.Mode.BYTE, data.length, bb);
    }

    static makeNumeric(digits) {
      if (!_QrSegment.isNumeric(digits)) throw new RangeError("String contains non-numeric characters");
      let bb = [];

      for (let i = 0; i < digits.length;) {
        const n = Math.min(digits.length - i, 3);
        appendBits(parseInt(digits.substr(i, n), 10), n * 3 + 1, bb);
        i += n;
      }

      return new _QrSegment(_QrSegment.Mode.NUMERIC, digits.length, bb);
    }

    static makeAlphanumeric(text) {
      if (!_QrSegment.isAlphanumeric(text)) throw new RangeError("String contains unencodable characters in alphanumeric mode");
      let bb = [];
      let i;

      for (i = 0; i + 2 <= text.length; i += 2) {
        let temp = _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
        temp += _QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
        appendBits(temp, 11, bb);
      }

      if (i < text.length) appendBits(_QrSegment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
      return new _QrSegment(_QrSegment.Mode.ALPHANUMERIC, text.length, bb);
    }

    static makeSegments(text) {
      if (text == "") return [];else if (_QrSegment.isNumeric(text)) return [_QrSegment.makeNumeric(text)];else if (_QrSegment.isAlphanumeric(text)) return [_QrSegment.makeAlphanumeric(text)];else return [_QrSegment.makeBytes(_QrSegment.toUtf8ByteArray(text))];
    }

    static makeEci(assignVal) {
      let bb = [];
      if (assignVal < 0) throw new RangeError("ECI assignment value out of range");else if (assignVal < 1 << 7) appendBits(assignVal, 8, bb);else if (assignVal < 1 << 14) {
        appendBits(2, 2, bb);
        appendBits(assignVal, 14, bb);
      } else if (assignVal < 1e6) {
        appendBits(6, 3, bb);
        appendBits(assignVal, 21, bb);
      } else throw new RangeError("ECI assignment value out of range");
      return new _QrSegment(_QrSegment.Mode.ECI, 0, bb);
    }

    static isNumeric(text) {
      return _QrSegment.NUMERIC_REGEX.test(text);
    }

    static isAlphanumeric(text) {
      return _QrSegment.ALPHANUMERIC_REGEX.test(text);
    }

    getData() {
      return this.bitData.slice();
    }

    static getTotalBits(segs, version) {
      let result = 0;

      for (const seg of segs) {
        const ccbits = seg.mode.numCharCountBits(version);
        if (seg.numChars >= 1 << ccbits) return Infinity;
        result += 4 + ccbits + seg.bitData.length;
      }

      return result;
    }

    static toUtf8ByteArray(str) {
      str = encodeURI(str);
      let result = [];

      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) != "%") result.push(str.charCodeAt(i));else {
          result.push(parseInt(str.substr(i + 1, 2), 16));
          i += 2;
        }
      }

      return result;
    }

  };

  let QrSegment = _QrSegment;
  QrSegment.NUMERIC_REGEX = /^[0-9]*$/;
  QrSegment.ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+.\/:-]*$/;
  QrSegment.ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
  qrcodegen2.QrSegment = QrSegment;
})(qrcodegen || (qrcodegen = {}));

(qrcodegen2 => {
  let QrCode;

  (QrCode2 => {
    const _Ecc = class {
      constructor(ordinal, formatBits) {
        this.ordinal = ordinal;
        this.formatBits = formatBits;
      }

    };

    let Ecc = _Ecc;
    Ecc.LOW = new _Ecc(0, 1);
    Ecc.MEDIUM = new _Ecc(1, 0);
    Ecc.QUARTILE = new _Ecc(2, 3);
    Ecc.HIGH = new _Ecc(3, 2);
    QrCode2.Ecc = Ecc;
  })(QrCode = qrcodegen2.QrCode || (qrcodegen2.QrCode = {}));
})(qrcodegen || (qrcodegen = {}));

(qrcodegen2 => {
  let QrSegment;

  (QrSegment2 => {
    const _Mode = class {
      constructor(modeBits, numBitsCharCount) {
        this.modeBits = modeBits;
        this.numBitsCharCount = numBitsCharCount;
      }

      numCharCountBits(ver) {
        return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
      }

    };

    let Mode = _Mode;
    Mode.NUMERIC = new _Mode(1, [10, 12, 14]);
    Mode.ALPHANUMERIC = new _Mode(2, [9, 11, 13]);
    Mode.BYTE = new _Mode(4, [8, 16, 16]);
    Mode.KANJI = new _Mode(8, [8, 10, 12]);
    Mode.ECI = new _Mode(7, [0, 0, 0]);
    QrSegment2.Mode = Mode;
  })(QrSegment = qrcodegen2.QrSegment || (qrcodegen2.QrSegment = {}));
})(qrcodegen || (qrcodegen = {}));

var qrcodegen_default = qrcodegen; // src/index.tsx

/**
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */

var ERROR_LEVEL_MAP = {
  L: qrcodegen_default.QrCode.Ecc.LOW,
  M: qrcodegen_default.QrCode.Ecc.MEDIUM,
  Q: qrcodegen_default.QrCode.Ecc.QUARTILE,
  H: qrcodegen_default.QrCode.Ecc.HIGH
};
var DEFAULT_PROPS = {
  size: 128,
  level: "L",
  bgColor: "#FFFFFF",
  fgColor: "#000000",
  includeMargin: false
};
var MARGIN_SIZE = 4;
var DEFAULT_IMG_SCALE = 0.1;

function generatePath(modules) {
  let margin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const ops = [];
  modules.forEach(function (row, y) {
    let start = null;
    row.forEach(function (cell, x) {
      if (!cell && start !== null) {
        ops.push("M".concat(start + margin, " ").concat(y + margin, "h").concat(x - start, "v1H").concat(start + margin, "z"));
        start = null;
        return;
      }

      if (x === row.length - 1) {
        if (!cell) {
          return;
        }

        if (start === null) {
          ops.push("M".concat(x + margin, ",").concat(y + margin, " h1v1H").concat(x + margin, "z"));
        } else {
          ops.push("M".concat(start + margin, ",").concat(y + margin, " h").concat(x + 1 - start, "v1H").concat(start + margin, "z"));
        }

        return;
      }

      if (cell && start === null) {
        start = x;
      }
    });
  });
  return ops.join("");
}

function excavateModules(modules, excavation) {
  return modules.slice().map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h) {
      return row;
    }

    return row.map((cell, x) => {
      if (x < excavation.x || x >= excavation.x + excavation.w) {
        return cell;
      }

      return false;
    });
  });
}

function getImageSettings(props, cells) {
  const {
    imageSettings,
    size,
    includeMargin
  } = props;

  if (imageSettings == null) {
    return null;
  }

  const margin = includeMargin ? MARGIN_SIZE : 0;
  const numCells = cells.length + margin * 2;
  const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
  const scale = numCells / size;
  const w = (imageSettings.width || defaultSize) * scale;
  const h = (imageSettings.height || defaultSize) * scale;
  const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
  const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;
  let excavation = null;

  if (imageSettings.excavate) {
    let floorX = Math.floor(x);
    let floorY = Math.floor(y);
    let ceilW = Math.ceil(w + x - floorX);
    let ceilH = Math.ceil(h + y - floorY);
    excavation = {
      x: floorX,
      y: floorY,
      w: ceilW,
      h: ceilH
    };
  }

  return {
    x,
    y,
    h,
    w,
    excavation
  };
}

var SUPPORTS_PATH2D = function () {
  try {
    new Path2D().addPath(new Path2D());
  } catch (e) {
    return false;
  }

  return true;
}();

function QRCodeCanvas(props) {
  const _canvas = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);

  const _image = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);

  function update() {
    const {
      value: value2,
      size: size2,
      level: level2,
      bgColor: bgColor2,
      fgColor: fgColor2,
      includeMargin: includeMargin2
    } = props;

    if (_canvas.current != null) {
      const canvas = _canvas.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      let cells = qrcodegen_default.QrCode.encodeText(value2, ERROR_LEVEL_MAP[level2]).getModules();
      const margin = includeMargin2 ? MARGIN_SIZE : 0;
      const numCells = cells.length + margin * 2;
      const calculatedImageSettings = getImageSettings(props, cells);
      const image = _image.current;
      const haveImageToRender = calculatedImageSettings != null && image !== null && image.complete && image.naturalHeight !== 0 && image.naturalWidth !== 0;

      if (haveImageToRender) {
        if (calculatedImageSettings.excavation != null) {
          cells = excavateModules(cells, calculatedImageSettings.excavation);
        }
      }

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.height = canvas.width = size2 * pixelRatio;
      const scale = size2 / numCells * pixelRatio;
      ctx.scale(scale, scale);
      ctx.fillStyle = bgColor2;
      ctx.fillRect(0, 0, numCells, numCells);
      ctx.fillStyle = fgColor2;

      if (SUPPORTS_PATH2D) {
        ctx.fill(new Path2D(generatePath(cells, margin)));
      } else {
        cells.forEach(function (row, rdx) {
          row.forEach(function (cell, cdx) {
            if (cell) {
              ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
            }
          });
        });
      }

      if (haveImageToRender) {
        ctx.drawImage(image, calculatedImageSettings.x + margin, calculatedImageSettings.y + margin, calculatedImageSettings.w, calculatedImageSettings.h);
      }
    }
  }

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    update();
  });

  const _a = props,
        {
    value,
    size,
    level,
    bgColor,
    fgColor,
    style,
    includeMargin,
    imageSettings
  } = _a,
        otherProps = __objRest(_a, ["value", "size", "level", "bgColor", "fgColor", "style", "includeMargin", "imageSettings"]);

  const canvasStyle = __spreadValues({
    height: size,
    width: size
  }, style);

  let img = null;
  let imgSrc = imageSettings == null ? void 0 : imageSettings.src;

  if (imgSrc != null) {
    img = /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement("img", {
      src: imgSrc,
      key: imgSrc,
      style: {
        display: "none"
      },
      onLoad: () => {
        update();
      },
      ref: _image
    });
  }

  return /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement("canvas", __spreadValues({
    style: canvasStyle,
    height: size,
    width: size,
    ref: _canvas
  }, otherProps)), img);
}

QRCodeCanvas.defaultProps = DEFAULT_PROPS;

function QRCodeSVG(props) {
  const _a = props,
        {
    value,
    size,
    level,
    bgColor,
    fgColor,
    includeMargin,
    imageSettings
  } = _a,
        otherProps = __objRest(_a, ["value", "size", "level", "bgColor", "fgColor", "includeMargin", "imageSettings"]);

  let cells = qrcodegen_default.QrCode.encodeText(value, ERROR_LEVEL_MAP[level]).getModules();
  const margin = includeMargin ? MARGIN_SIZE : 0;
  const numCells = cells.length + margin * 2;
  const calculatedImageSettings = getImageSettings(props, cells);
  let image = null;

  if (imageSettings != null && calculatedImageSettings != null) {
    if (calculatedImageSettings.excavation != null) {
      cells = excavateModules(cells, calculatedImageSettings.excavation);
    }

    image = /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement("image", {
      xlinkHref: imageSettings.src,
      height: calculatedImageSettings.h,
      width: calculatedImageSettings.w,
      x: calculatedImageSettings.x + margin,
      y: calculatedImageSettings.y + margin,
      preserveAspectRatio: "none"
    });
  }

  const fgPath = generatePath(cells, margin);
  return /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement("svg", __spreadValues({
    shapeRendering: "crispEdges",
    height: size,
    width: size,
    viewBox: "0 0 ".concat(numCells, " ").concat(numCells)
  }, otherProps), /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement("path", {
    fill: bgColor,
    d: "M0,0 h".concat(numCells, "v").concat(numCells, "H0z")
  }), /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement("path", {
    fill: fgColor,
    d: fgPath
  }), image);
}

QRCodeSVG.defaultProps = DEFAULT_PROPS;

var QRCode = props => {
  const _a = props,
        {
    renderAs
  } = _a,
        otherProps = __objRest(_a, ["renderAs"]);

  if (renderAs === "svg") {
    return /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement(QRCodeSVG, __spreadValues({}, otherProps));
  }

  return /* @__PURE__ */react__WEBPACK_IMPORTED_MODULE_1__.createElement(QRCodeCanvas, __spreadValues({}, otherProps));
};

QRCode.defaultProps = __spreadValues({
  renderAs: "canvas"
}, DEFAULT_PROPS);


/***/ }),

/***/ 193:
/*!***************************************************************************!*\
  !*** ./node_modules/react-immutable-proptypes/dist/ImmutablePropTypes.js ***!
  \***************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * This is a straight rip-off of the React.js ReactPropTypes.js proptype validators,
 * modified to make it possible to validate Immutable.js data.
 *     ImmutableTypes.listOf is patterned after React.PropTypes.arrayOf, but for Immutable.List
 *     ImmutableTypes.shape  is based on React.PropTypes.shape, but for any Immutable.Iterable
 */


var Immutable = __webpack_require__(/*! immutable */ 5);

var ANONYMOUS = "<<anonymous>>";
var ImmutablePropTypes;

if (true) {
  ImmutablePropTypes = {
    listOf: createListOfTypeChecker,
    mapOf: createMapOfTypeChecker,
    orderedMapOf: createOrderedMapOfTypeChecker,
    setOf: createSetOfTypeChecker,
    orderedSetOf: createOrderedSetOfTypeChecker,
    stackOf: createStackOfTypeChecker,
    iterableOf: createIterableOfTypeChecker,
    recordOf: createRecordOfTypeChecker,
    shape: createShapeChecker,
    contains: createShapeChecker,
    mapContains: createMapContainsChecker,
    orderedMapContains: createOrderedMapContainsChecker,
    // Primitive Types
    list: createImmutableTypeChecker("List", Immutable.List.isList),
    map: createImmutableTypeChecker("Map", Immutable.Map.isMap),
    orderedMap: createImmutableTypeChecker("OrderedMap", Immutable.OrderedMap.isOrderedMap),
    set: createImmutableTypeChecker("Set", Immutable.Set.isSet),
    orderedSet: createImmutableTypeChecker("OrderedSet", Immutable.OrderedSet.isOrderedSet),
    stack: createImmutableTypeChecker("Stack", Immutable.Stack.isStack),
    seq: createImmutableTypeChecker("Seq", Immutable.Seq.isSeq),
    record: createImmutableTypeChecker("Record", function (isRecord) {
      return isRecord instanceof Immutable.Record;
    }),
    iterable: createImmutableTypeChecker("Iterable", Immutable.Iterable.isIterable)
  };
} else { var getProductionTypeChecker, productionTypeChecker; }

ImmutablePropTypes.iterable.indexed = createIterableSubclassTypeChecker("Indexed", Immutable.Iterable.isIndexed);
ImmutablePropTypes.iterable.keyed = createIterableSubclassTypeChecker("Keyed", Immutable.Iterable.isKeyed);

function getPropType(propValue) {
  var propType = typeof propValue;

  if (Array.isArray(propValue)) {
    return "array";
  }

  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return "object";
  }

  if (propValue instanceof Immutable.Iterable) {
    return "Immutable." + propValue.toSource().split(" ")[0];
  }

  return propType;
}

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = Array(_len > 6 ? _len - 6 : 0), _key = 6; _key < _len; _key++) {
      rest[_key - 6] = arguments[_key];
    }

    propFullName = propFullName || propName;
    componentName = componentName || ANONYMOUS;

    if (props[propName] == null) {
      var locationName = location;

      if (isRequired) {
        return new Error("Required " + locationName + " `" + propFullName + "` was not specified in " + ("`" + componentName + "`."));
      }
    } else {
      return validate.apply(undefined, [props, propName, componentName, location, propFullName].concat(rest));
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);
  return chainedCheckType;
}

function createImmutableTypeChecker(immutableClassName, immutableClassTypeValidator) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];

    if (!immutableClassTypeValidator(propValue)) {
      var propType = getPropType(propValue);
      return new Error("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `" + immutableClassName + "`."));
    }

    return null;
  }

  return createChainableTypeChecker(validate);
}

function createIterableSubclassTypeChecker(subclassName, validator) {
  return createImmutableTypeChecker("Iterable." + subclassName, function (propValue) {
    return Immutable.Iterable.isIterable(propValue) && validator(propValue);
  });
}

function createIterableTypeChecker(typeChecker, immutableClassName, immutableClassTypeValidator) {
  function validate(props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      rest[_key - 5] = arguments[_key];
    }

    var propValue = props[propName];

    if (!immutableClassTypeValidator(propValue)) {
      var locationName = location;
      var propType = getPropType(propValue);
      return new Error("Invalid " + locationName + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an Immutable.js " + immutableClassName + "."));
    }

    if (typeof typeChecker !== "function") {
      return new Error("Invalid typeChecker supplied to `" + componentName + "` " + ("for propType `" + propFullName + "`, expected a function."));
    }

    var propValues = propValue.valueSeq().toArray();

    for (var i = 0, len = propValues.length; i < len; i++) {
      var error = typeChecker.apply(undefined, [propValues, i, componentName, location, "" + propFullName + "[" + i + "]"].concat(rest));

      if (error instanceof Error) {
        return error;
      }
    }
  }

  return createChainableTypeChecker(validate);
}

function createKeysTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      rest[_key - 5] = arguments[_key];
    }

    var propValue = props[propName];

    if (typeof typeChecker !== "function") {
      return new Error("Invalid keysTypeChecker (optional second argument) supplied to `" + componentName + "` " + ("for propType `" + propFullName + "`, expected a function."));
    }

    var keys = propValue.keySeq().toArray();

    for (var i = 0, len = keys.length; i < len; i++) {
      var error = typeChecker.apply(undefined, [keys, i, componentName, location, "" + propFullName + " -> key(" + keys[i] + ")"].concat(rest));

      if (error instanceof Error) {
        return error;
      }
    }
  }

  return createChainableTypeChecker(validate);
}

function createListOfTypeChecker(typeChecker) {
  return createIterableTypeChecker(typeChecker, "List", Immutable.List.isList);
}

function createMapOfTypeCheckerFactory(valuesTypeChecker, keysTypeChecker, immutableClassName, immutableClassTypeValidator) {
  function validate() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return createIterableTypeChecker(valuesTypeChecker, immutableClassName, immutableClassTypeValidator).apply(undefined, args) || keysTypeChecker && createKeysTypeChecker(keysTypeChecker).apply(undefined, args);
  }

  return createChainableTypeChecker(validate);
}

function createMapOfTypeChecker(valuesTypeChecker, keysTypeChecker) {
  return createMapOfTypeCheckerFactory(valuesTypeChecker, keysTypeChecker, "Map", Immutable.Map.isMap);
}

function createOrderedMapOfTypeChecker(valuesTypeChecker, keysTypeChecker) {
  return createMapOfTypeCheckerFactory(valuesTypeChecker, keysTypeChecker, "OrderedMap", Immutable.OrderedMap.isOrderedMap);
}

function createSetOfTypeChecker(typeChecker) {
  return createIterableTypeChecker(typeChecker, "Set", Immutable.Set.isSet);
}

function createOrderedSetOfTypeChecker(typeChecker) {
  return createIterableTypeChecker(typeChecker, "OrderedSet", Immutable.OrderedSet.isOrderedSet);
}

function createStackOfTypeChecker(typeChecker) {
  return createIterableTypeChecker(typeChecker, "Stack", Immutable.Stack.isStack);
}

function createIterableOfTypeChecker(typeChecker) {
  return createIterableTypeChecker(typeChecker, "Iterable", Immutable.Iterable.isIterable);
}

function createRecordOfTypeChecker(recordKeys) {
  function validate(props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      rest[_key - 5] = arguments[_key];
    }

    var propValue = props[propName];

    if (!(propValue instanceof Immutable.Record)) {
      var propType = getPropType(propValue);
      var locationName = location;
      return new Error("Invalid " + locationName + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected an Immutable.js Record."));
    }

    for (var key in recordKeys) {
      var checker = recordKeys[key];

      if (!checker) {
        continue;
      }

      var mutablePropValue = propValue.toObject();
      var error = checker.apply(undefined, [mutablePropValue, key, componentName, location, "" + propFullName + "." + key].concat(rest));

      if (error) {
        return error;
      }
    }
  }

  return createChainableTypeChecker(validate);
} // there is some irony in the fact that shapeTypes is a standard hash and not an immutable collection


function createShapeTypeChecker(shapeTypes) {
  var immutableClassName = arguments[1] === undefined ? "Iterable" : arguments[1];
  var immutableClassTypeValidator = arguments[2] === undefined ? Immutable.Iterable.isIterable : arguments[2];

  function validate(props, propName, componentName, location, propFullName) {
    for (var _len = arguments.length, rest = Array(_len > 5 ? _len - 5 : 0), _key = 5; _key < _len; _key++) {
      rest[_key - 5] = arguments[_key];
    }

    var propValue = props[propName];

    if (!immutableClassTypeValidator(propValue)) {
      var propType = getPropType(propValue);
      var locationName = location;
      return new Error("Invalid " + locationName + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected an Immutable.js " + immutableClassName + "."));
    }

    var mutablePropValue = propValue.toObject();

    for (var key in shapeTypes) {
      var checker = shapeTypes[key];

      if (!checker) {
        continue;
      }

      var error = checker.apply(undefined, [mutablePropValue, key, componentName, location, "" + propFullName + "." + key].concat(rest));

      if (error) {
        return error;
      }
    }
  }

  return createChainableTypeChecker(validate);
}

function createShapeChecker(shapeTypes) {
  return createShapeTypeChecker(shapeTypes);
}

function createMapContainsChecker(shapeTypes) {
  return createShapeTypeChecker(shapeTypes, "Map", Immutable.Map.isMap);
}

function createOrderedMapContainsChecker(shapeTypes) {
  return createShapeTypeChecker(shapeTypes, "OrderedMap", Immutable.OrderedMap.isOrderedMap);
}

module.exports = ImmutablePropTypes;

/***/ }),

/***/ 520:
/*!******************************************************!*\
  !*** ./node_modules/react-sparklines/build/index.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);

(function webpackUniversalModuleDefinition(root, factory) {
  if (true) module.exports = factory(__webpack_require__(/*! react */ 0));else {}
})(this, function (__WEBPACK_EXTERNAL_MODULE_1__) {
  return (
    /******/
    function (modules) {
      // webpackBootstrap

      /******/
      // The module cache

      /******/
      var installedModules = {};
      /******/

      /******/
      // The require function

      /******/

      function __nested_webpack_require_809__(moduleId) {
        /******/

        /******/
        // Check if module is in cache

        /******/
        if (installedModules[moduleId]) {
          /******/
          return installedModules[moduleId].exports;
          /******/
        }
        /******/
        // Create a new module (and put it into the cache)

        /******/


        var module = installedModules[moduleId] = {
          /******/
          i: moduleId,

          /******/
          l: false,

          /******/
          exports: {}
          /******/

        };
        /******/

        /******/
        // Execute the module function

        /******/

        modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_809__);
        /******/

        /******/
        // Flag the module as loaded

        /******/

        module.l = true;
        /******/

        /******/
        // Return the exports of the module

        /******/

        return module.exports;
        /******/
      }
      /******/

      /******/

      /******/
      // expose the modules object (__webpack_modules__)

      /******/


      __nested_webpack_require_809__.m = modules;
      /******/

      /******/
      // expose the module cache

      /******/

      __nested_webpack_require_809__.c = installedModules;
      /******/

      /******/
      // define getter function for harmony exports

      /******/

      __nested_webpack_require_809__.d = function (exports, name, getter) {
        /******/
        if (!__nested_webpack_require_809__.o(exports, name)) {
          /******/
          Object.defineProperty(exports, name, {
            /******/
            configurable: false,

            /******/
            enumerable: true,

            /******/
            get: getter
            /******/

          });
          /******/
        }
        /******/

      };
      /******/

      /******/
      // getDefaultExport function for compatibility with non-harmony modules

      /******/


      __nested_webpack_require_809__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
        /******/
        function getDefault() {
          return module['default'];
        } :
        /******/
        function getModuleExports() {
          return module;
        };
        /******/

        __nested_webpack_require_809__.d(getter, 'a', getter);
        /******/


        return getter;
        /******/
      };
      /******/

      /******/
      // Object.prototype.hasOwnProperty.call

      /******/


      __nested_webpack_require_809__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/

      /******/
      // __webpack_public_path__

      /******/


      __nested_webpack_require_809__.p = "/";
      /******/

      /******/
      // Load entry module and return exports

      /******/

      return __nested_webpack_require_809__(__nested_webpack_require_809__.s = 11);
      /******/
    }
    /************************************************************************/

    /******/
    ([
    /* 0 */

    /***/
    function (module, exports, __nested_webpack_require_3935__) {
      /* WEBPACK VAR INJECTION */
      (function (process) {
        /**
        * Copyright 2013-present, Facebook, Inc.
        * All rights reserved.
        *
        * This source code is licensed under the BSD-style license found in the
        * LICENSE file in the root directory of this source tree. An additional grant
        * of patent rights can be found in the PATENTS file in the same directory.
        */
        if (process.env.NODE_ENV !== 'production') {
          var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

          var isValidElement = function (object) {
            return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
          }; // By explicitly using `prop-types` you are opting into new development behavior.
          // http://fb.me/prop-types-in-prod


          var throwOnDirectAccess = true;
          module.exports = __nested_webpack_require_3935__(14)(isValidElement, throwOnDirectAccess);
        } else {
          // By explicitly using `prop-types` you are opting into new production behavior.
          // http://fb.me/prop-types-in-prod
          module.exports = __nested_webpack_require_3935__(16)();
        }
        /* WEBPACK VAR INJECTION */

      }).call(exports, __nested_webpack_require_3935__(2));
      /***/
    },
    /* 1 */

    /***/
    function (module, exports) {
      module.exports = __WEBPACK_EXTERNAL_MODULE_1__;
      /***/
    },
    /* 2 */

    /***/
    function (module, exports) {
      // shim for using process in browser
      var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }

      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }

      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }

        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();

      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        } // if setTimeout wasn't available but was latter defined


        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }

        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }

      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        } // if clearTimeout wasn't available but was latter defined


        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }

        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }

      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }

        draining = false;

        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }

        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }

        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;

        while (len) {
          currentQueue = queue;
          queue = [];

          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }

          queueIndex = -1;
          len = queue.length;
        }

        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);

        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }

        queue.push(new Item(fun, args));

        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      }; // v8 likes predictible objects


      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }

      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };

      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues

      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) {
        return [];
      };

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () {
        return '/';
      };

      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };

      process.umask = function () {
        return 0;
      };
      /***/

    },
    /* 3 */

    /***/
    function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (data) {
        return data.reduce(function (a, b) {
          return a + b;
        }) / data.length;
      };
      /***/

    },
    /* 4 */

    /***/
    function (module, exports, __webpack_require__) {
      "use strict";
      /**
       * Copyright (c) 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       *
       * 
       */

      function makeEmptyFunction(arg) {
        return function () {
          return arg;
        };
      }
      /**
       * This function accepts and discards inputs; it has no side effects. This is
       * primarily useful idiomatically for overridable function endpoints which
       * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
       */


      var emptyFunction = function emptyFunction() {};

      emptyFunction.thatReturns = makeEmptyFunction;
      emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
      emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
      emptyFunction.thatReturnsNull = makeEmptyFunction(null);

      emptyFunction.thatReturnsThis = function () {
        return this;
      };

      emptyFunction.thatReturnsArgument = function (arg) {
        return arg;
      };

      module.exports = emptyFunction;
      /***/
    },
    /* 5 */

    /***/
    function (module, exports, __nested_webpack_require_13388__) {
      "use strict";
      /* WEBPACK VAR INJECTION */

      (function (process) {
        /**
        * Copyright (c) 2013-present, Facebook, Inc.
        * All rights reserved.
        *
        * This source code is licensed under the BSD-style license found in the
        * LICENSE file in the root directory of this source tree. An additional grant
        * of patent rights can be found in the PATENTS file in the same directory.
        *
        */

        /**
         * Use invariant() to assert state which your program assumes to be true.
         *
         * Provide sprintf-style format (only %s is supported) and arguments
         * to provide information about what broke and what you were
         * expecting.
         *
         * The invariant message will be stripped in production, but the invariant
         * will remain to ensure logic does not differ in production.
         */
        var validateFormat = function validateFormat(format) {};

        if (process.env.NODE_ENV !== 'production') {
          validateFormat = function validateFormat(format) {
            if (format === undefined) {
              throw new Error('invariant requires an error message argument');
            }
          };
        }

        function invariant(condition, format, a, b, c, d, e, f) {
          validateFormat(format);

          if (!condition) {
            var error;

            if (format === undefined) {
              error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
            } else {
              var args = [a, b, c, d, e, f];
              var argIndex = 0;
              error = new Error(format.replace(/%s/g, function () {
                return args[argIndex++];
              }));
              error.name = 'Invariant Violation';
            }

            error.framesToPop = 1; // we don't care about invariant's own frame

            throw error;
          }
        }

        module.exports = invariant;
        /* WEBPACK VAR INJECTION */
      }).call(exports, __nested_webpack_require_13388__(2));
      /***/
    },
    /* 6 */

    /***/
    function (module, exports, __webpack_require__) {
      "use strict";
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       */

      var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
      module.exports = ReactPropTypesSecret;
      /***/
    },
    /* 7 */

    /***/
    function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (data) {
        return Math.min.apply(Math, data);
      };
      /***/

    },
    /* 8 */

    /***/
    function (module, exports, __nested_webpack_require_16522__) {
      "use strict";
      /* WEBPACK VAR INJECTION */

      (function (process) {
        /**
        * Copyright 2014-2015, Facebook, Inc.
        * All rights reserved.
        *
        * This source code is licensed under the BSD-style license found in the
        * LICENSE file in the root directory of this source tree. An additional grant
        * of patent rights can be found in the PATENTS file in the same directory.
        *
        */
        var emptyFunction = __nested_webpack_require_16522__(4);
        /**
         * Similar to invariant but only logs a warning if the condition is not met.
         * This can be used to log issues in development environments in critical
         * paths. Removing the logging code for production environments will keep the
         * same logic and follow the same code paths.
         */


        var warning = emptyFunction;

        if (process.env.NODE_ENV !== 'production') {
          var printWarning = function printWarning(format) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }

            var argIndex = 0;
            var message = 'Warning: ' + format.replace(/%s/g, function () {
              return args[argIndex++];
            });

            if (typeof console !== 'undefined') {
              console.error(message);
            }

            try {
              // --- Welcome to debugging React ---
              // This error was thrown as a convenience so that you can use this stack
              // to find the callsite that caused this warning to fire.
              throw new Error(message);
            } catch (x) {}
          };

          warning = function warning(condition, format) {
            if (format === undefined) {
              throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
            }

            if (format.indexOf('Failed Composite propType: ') === 0) {
              return; // Ignore CompositeComponent proptype check.
            }

            if (!condition) {
              for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                args[_key2 - 2] = arguments[_key2];
              }

              printWarning.apply(undefined, [format].concat(args));
            }
          };
        }

        module.exports = warning;
        /* WEBPACK VAR INJECTION */
      }).call(exports, __nested_webpack_require_16522__(2));
      /***/
    },
    /* 9 */

    /***/
    function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (data) {
        return Math.max.apply(Math, data);
      };
      /***/

    },
    /* 10 */

    /***/
    function (module, exports, __nested_webpack_require_19489__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _mean = __nested_webpack_require_19489__(3);

      var _mean2 = _interopRequireDefault(_mean);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      exports.default = function (data) {
        var dataMean = (0, _mean2.default)(data);
        var sqDiff = data.map(function (n) {
          return Math.pow(n - dataMean, 2);
        });
        var avgSqDiff = (0, _mean2.default)(sqDiff);
        return Math.sqrt(avgSqDiff);
      };
      /***/

    },
    /* 11 */

    /***/
    function (module, exports, __nested_webpack_require_20213__) {
      module.exports = __nested_webpack_require_20213__(12);
      /***/
    },
    /* 12 */

    /***/
    function (module, exports, __nested_webpack_require_20358__) {
      "use strict";

      module.exports = __nested_webpack_require_20358__(13);
      /***/
    },
    /* 13 */

    /***/
    function (module, exports, __nested_webpack_require_20524__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.SparklinesText = exports.SparklinesNormalBand = exports.SparklinesReferenceLine = exports.SparklinesSpots = exports.SparklinesBars = exports.SparklinesCurve = exports.SparklinesLine = exports.Sparklines = undefined;

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

      var _propTypes = __nested_webpack_require_20524__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_20524__(1);

      var _react2 = _interopRequireDefault(_react);

      var _SparklinesText = __nested_webpack_require_20524__(17);

      var _SparklinesText2 = _interopRequireDefault(_SparklinesText);

      var _SparklinesLine = __nested_webpack_require_20524__(18);

      var _SparklinesLine2 = _interopRequireDefault(_SparklinesLine);

      var _SparklinesCurve = __nested_webpack_require_20524__(19);

      var _SparklinesCurve2 = _interopRequireDefault(_SparklinesCurve);

      var _SparklinesBars = __nested_webpack_require_20524__(20);

      var _SparklinesBars2 = _interopRequireDefault(_SparklinesBars);

      var _SparklinesSpots = __nested_webpack_require_20524__(21);

      var _SparklinesSpots2 = _interopRequireDefault(_SparklinesSpots);

      var _SparklinesReferenceLine = __nested_webpack_require_20524__(22);

      var _SparklinesReferenceLine2 = _interopRequireDefault(_SparklinesReferenceLine);

      var _SparklinesNormalBand = __nested_webpack_require_20524__(27);

      var _SparklinesNormalBand2 = _interopRequireDefault(_SparklinesNormalBand);

      var _dataToPoints = __nested_webpack_require_20524__(28);

      var _dataToPoints2 = _interopRequireDefault(_dataToPoints);

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

      var Sparklines = function (_PureComponent) {
        _inherits(Sparklines, _PureComponent);

        function Sparklines(props) {
          _classCallCheck(this, Sparklines);

          return _possibleConstructorReturn(this, (Sparklines.__proto__ || Object.getPrototypeOf(Sparklines)).call(this, props));
        }

        _createClass(Sparklines, [{
          key: 'render',
          value: function render() {
            var _props = this.props,
                data = _props.data,
                limit = _props.limit,
                width = _props.width,
                height = _props.height,
                svgWidth = _props.svgWidth,
                svgHeight = _props.svgHeight,
                preserveAspectRatio = _props.preserveAspectRatio,
                margin = _props.margin,
                style = _props.style,
                max = _props.max,
                min = _props.min;
            if (data.length === 0) return null;
            var points = (0, _dataToPoints2.default)({
              data: data,
              limit: limit,
              width: width,
              height: height,
              margin: margin,
              max: max,
              min: min
            });
            var svgOpts = {
              style: style,
              viewBox: '0 0 ' + width + ' ' + height,
              preserveAspectRatio: preserveAspectRatio
            };
            if (svgWidth > 0) svgOpts.width = svgWidth;
            if (svgHeight > 0) svgOpts.height = svgHeight;
            return _react2.default.createElement('svg', svgOpts, _react2.default.Children.map(this.props.children, function (child) {
              return _react2.default.cloneElement(child, {
                data: data,
                points: points,
                width: width,
                height: height,
                margin: margin
              });
            }));
          }
        }]);

        return Sparklines;
      }(_react.PureComponent);

      Sparklines.propTypes = {
        data: _propTypes2.default.array,
        limit: _propTypes2.default.number,
        width: _propTypes2.default.number,
        height: _propTypes2.default.number,
        svgWidth: _propTypes2.default.number,
        svgHeight: _propTypes2.default.number,
        preserveAspectRatio: _propTypes2.default.string,
        margin: _propTypes2.default.number,
        style: _propTypes2.default.object,
        min: _propTypes2.default.number,
        max: _propTypes2.default.number,
        onMouseMove: _propTypes2.default.func
      };
      Sparklines.defaultProps = {
        data: [],
        width: 240,
        height: 60,
        //Scale the graphic content of the given element non-uniformly if necessary such that the element's bounding box exactly matches the viewport rectangle.
        preserveAspectRatio: 'none',
        //https://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
        margin: 2
      };
      exports.Sparklines = Sparklines;
      exports.SparklinesLine = _SparklinesLine2.default;
      exports.SparklinesCurve = _SparklinesCurve2.default;
      exports.SparklinesBars = _SparklinesBars2.default;
      exports.SparklinesSpots = _SparklinesSpots2.default;
      exports.SparklinesReferenceLine = _SparklinesReferenceLine2.default;
      exports.SparklinesNormalBand = _SparklinesNormalBand2.default;
      exports.SparklinesText = _SparklinesText2.default;
      /***/
    },
    /* 14 */

    /***/
    function (module, exports, __nested_webpack_require_27595__) {
      "use strict";
      /* WEBPACK VAR INJECTION */

      (function (process) {
        /**
        * Copyright 2013-present, Facebook, Inc.
        * All rights reserved.
        *
        * This source code is licensed under the BSD-style license found in the
        * LICENSE file in the root directory of this source tree. An additional grant
        * of patent rights can be found in the PATENTS file in the same directory.
        */
        var emptyFunction = __nested_webpack_require_27595__(4);

        var invariant = __nested_webpack_require_27595__(5);

        var warning = __nested_webpack_require_27595__(8);

        var ReactPropTypesSecret = __nested_webpack_require_27595__(6);

        var checkPropTypes = __nested_webpack_require_27595__(15);

        module.exports = function (isValidElement, throwOnDirectAccess) {
          /* global Symbol */
          var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
          var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

          /**
           * Returns the iterator method function contained on the iterable object.
           *
           * Be sure to invoke the function with the iterable as context:
           *
           *     var iteratorFn = getIteratorFn(myIterable);
           *     if (iteratorFn) {
           *       var iterator = iteratorFn.call(myIterable);
           *       ...
           *     }
           *
           * @param {?object} maybeIterable
           * @return {?function}
           */

          function getIteratorFn(maybeIterable) {
            var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);

            if (typeof iteratorFn === 'function') {
              return iteratorFn;
            }
          }
          /**
           * Collection of methods that allow declaration and validation of props that are
           * supplied to React components. Example usage:
           *
           *   var Props = require('ReactPropTypes');
           *   var MyArticle = React.createClass({
           *     propTypes: {
           *       // An optional string prop named "description".
           *       description: Props.string,
           *
           *       // A required enum prop named "category".
           *       category: Props.oneOf(['News','Photos']).isRequired,
           *
           *       // A prop named "dialog" that requires an instance of Dialog.
           *       dialog: Props.instanceOf(Dialog).isRequired
           *     },
           *     render: function() { ... }
           *   });
           *
           * A more formal specification of how these methods are used:
           *
           *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
           *   decl := ReactPropTypes.{type}(.isRequired)?
           *
           * Each and every declaration produces a function with the same signature. This
           * allows the creation of custom validation functions. For example:
           *
           *  var MyLink = React.createClass({
           *    propTypes: {
           *      // An optional string or URI prop named "href".
           *      href: function(props, propName, componentName) {
           *        var propValue = props[propName];
           *        if (propValue != null && typeof propValue !== 'string' &&
           *            !(propValue instanceof URI)) {
           *          return new Error(
           *            'Expected a string or an URI for ' + propName + ' in ' +
           *            componentName
           *          );
           *        }
           *      }
           *    },
           *    render: function() {...}
           *  });
           *
           * @internal
           */


          var ANONYMOUS = '<<anonymous>>'; // Important!
          // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.

          var ReactPropTypes = {
            array: createPrimitiveTypeChecker('array'),
            bool: createPrimitiveTypeChecker('boolean'),
            func: createPrimitiveTypeChecker('function'),
            number: createPrimitiveTypeChecker('number'),
            object: createPrimitiveTypeChecker('object'),
            string: createPrimitiveTypeChecker('string'),
            symbol: createPrimitiveTypeChecker('symbol'),
            any: createAnyTypeChecker(),
            arrayOf: createArrayOfTypeChecker,
            element: createElementTypeChecker(),
            instanceOf: createInstanceTypeChecker,
            node: createNodeChecker(),
            objectOf: createObjectOfTypeChecker,
            oneOf: createEnumTypeChecker,
            oneOfType: createUnionTypeChecker,
            shape: createShapeTypeChecker
          };
          /**
           * inlined Object.is polyfill to avoid requiring consumers ship their own
           * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
           */

          /*eslint-disable no-self-compare*/

          function is(x, y) {
            // SameValue algorithm
            if (x === y) {
              // Steps 1-5, 7-10
              // Steps 6.b-6.e: +0 != -0
              return x !== 0 || 1 / x === 1 / y;
            } else {
              // Step 6.a: NaN == NaN
              return x !== x && y !== y;
            }
          }
          /*eslint-enable no-self-compare*/

          /**
           * We use an Error-like object for backward compatibility as people may call
           * PropTypes directly and inspect their output. However, we don't use real
           * Errors anymore. We don't inspect their stack anyway, and creating them
           * is prohibitively expensive if they are created too often, such as what
           * happens in oneOfType() for any type before the one that matched.
           */


          function PropTypeError(message) {
            this.message = message;
            this.stack = '';
          } // Make `instanceof Error` still work for returned errors.


          PropTypeError.prototype = Error.prototype;

          function createChainableTypeChecker(validate) {
            if (process.env.NODE_ENV !== 'production') {
              var manualPropTypeCallCache = {};
              var manualPropTypeWarningCount = 0;
            }

            function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
              componentName = componentName || ANONYMOUS;
              propFullName = propFullName || propName;

              if (secret !== ReactPropTypesSecret) {
                if (throwOnDirectAccess) {
                  // New behavior only for users of `prop-types` package
                  invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
                } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
                  // Old behavior for people using React.PropTypes
                  var cacheKey = componentName + ':' + propName;

                  if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
                  manualPropTypeWarningCount < 3) {
                    warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
                    manualPropTypeCallCache[cacheKey] = true;
                    manualPropTypeWarningCount++;
                  }
                }
              }

              if (props[propName] == null) {
                if (isRequired) {
                  if (props[propName] === null) {
                    return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
                  }

                  return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
                }

                return null;
              } else {
                return validate(props, propName, componentName, location, propFullName);
              }
            }

            var chainedCheckType = checkType.bind(null, false);
            chainedCheckType.isRequired = checkType.bind(null, true);
            return chainedCheckType;
          }

          function createPrimitiveTypeChecker(expectedType) {
            function validate(props, propName, componentName, location, propFullName, secret) {
              var propValue = props[propName];
              var propType = getPropType(propValue);

              if (propType !== expectedType) {
                // `propValue` being instance of, say, date/regexp, pass the 'object'
                // check, but we can offer a more precise error message here rather than
                // 'of type `object`'.
                var preciseType = getPreciseType(propValue);
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
              }

              return null;
            }

            return createChainableTypeChecker(validate);
          }

          function createAnyTypeChecker() {
            return createChainableTypeChecker(emptyFunction.thatReturnsNull);
          }

          function createArrayOfTypeChecker(typeChecker) {
            function validate(props, propName, componentName, location, propFullName) {
              if (typeof typeChecker !== 'function') {
                return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
              }

              var propValue = props[propName];

              if (!Array.isArray(propValue)) {
                var propType = getPropType(propValue);
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
              }

              for (var i = 0; i < propValue.length; i++) {
                var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);

                if (error instanceof Error) {
                  return error;
                }
              }

              return null;
            }

            return createChainableTypeChecker(validate);
          }

          function createElementTypeChecker() {
            function validate(props, propName, componentName, location, propFullName) {
              var propValue = props[propName];

              if (!isValidElement(propValue)) {
                var propType = getPropType(propValue);
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
              }

              return null;
            }

            return createChainableTypeChecker(validate);
          }

          function createInstanceTypeChecker(expectedClass) {
            function validate(props, propName, componentName, location, propFullName) {
              if (!(props[propName] instanceof expectedClass)) {
                var expectedClassName = expectedClass.name || ANONYMOUS;
                var actualClassName = getClassName(props[propName]);
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
              }

              return null;
            }

            return createChainableTypeChecker(validate);
          }

          function createEnumTypeChecker(expectedValues) {
            if (!Array.isArray(expectedValues)) {
              process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
              return emptyFunction.thatReturnsNull;
            }

            function validate(props, propName, componentName, location, propFullName) {
              var propValue = props[propName];

              for (var i = 0; i < expectedValues.length; i++) {
                if (is(propValue, expectedValues[i])) {
                  return null;
                }
              }

              var valuesString = JSON.stringify(expectedValues);
              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
            }

            return createChainableTypeChecker(validate);
          }

          function createObjectOfTypeChecker(typeChecker) {
            function validate(props, propName, componentName, location, propFullName) {
              if (typeof typeChecker !== 'function') {
                return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
              }

              var propValue = props[propName];
              var propType = getPropType(propValue);

              if (propType !== 'object') {
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
              }

              for (var key in propValue) {
                if (propValue.hasOwnProperty(key)) {
                  var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

                  if (error instanceof Error) {
                    return error;
                  }
                }
              }

              return null;
            }

            return createChainableTypeChecker(validate);
          }

          function createUnionTypeChecker(arrayOfTypeCheckers) {
            if (!Array.isArray(arrayOfTypeCheckers)) {
              process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
              return emptyFunction.thatReturnsNull;
            }

            for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
              var checker = arrayOfTypeCheckers[i];

              if (typeof checker !== 'function') {
                warning(false, 'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
                return emptyFunction.thatReturnsNull;
              }
            }

            function validate(props, propName, componentName, location, propFullName) {
              for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
                var checker = arrayOfTypeCheckers[i];

                if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
                  return null;
                }
              }

              return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
            }

            return createChainableTypeChecker(validate);
          }

          function createNodeChecker() {
            function validate(props, propName, componentName, location, propFullName) {
              if (!isNode(props[propName])) {
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
              }

              return null;
            }

            return createChainableTypeChecker(validate);
          }

          function createShapeTypeChecker(shapeTypes) {
            function validate(props, propName, componentName, location, propFullName) {
              var propValue = props[propName];
              var propType = getPropType(propValue);

              if (propType !== 'object') {
                return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
              }

              for (var key in shapeTypes) {
                var checker = shapeTypes[key];

                if (!checker) {
                  continue;
                }

                var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

                if (error) {
                  return error;
                }
              }

              return null;
            }

            return createChainableTypeChecker(validate);
          }

          function isNode(propValue) {
            switch (typeof propValue) {
              case 'number':
              case 'string':
              case 'undefined':
                return true;

              case 'boolean':
                return !propValue;

              case 'object':
                if (Array.isArray(propValue)) {
                  return propValue.every(isNode);
                }

                if (propValue === null || isValidElement(propValue)) {
                  return true;
                }

                var iteratorFn = getIteratorFn(propValue);

                if (iteratorFn) {
                  var iterator = iteratorFn.call(propValue);
                  var step;

                  if (iteratorFn !== propValue.entries) {
                    while (!(step = iterator.next()).done) {
                      if (!isNode(step.value)) {
                        return false;
                      }
                    }
                  } else {
                    // Iterator will provide entry [k,v] tuples rather than values.
                    while (!(step = iterator.next()).done) {
                      var entry = step.value;

                      if (entry) {
                        if (!isNode(entry[1])) {
                          return false;
                        }
                      }
                    }
                  }
                } else {
                  return false;
                }

                return true;

              default:
                return false;
            }
          }

          function isSymbol(propType, propValue) {
            // Native Symbol.
            if (propType === 'symbol') {
              return true;
            } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


            if (propValue['@@toStringTag'] === 'Symbol') {
              return true;
            } // Fallback for non-spec compliant Symbols which are polyfilled.


            if (typeof Symbol === 'function' && propValue instanceof Symbol) {
              return true;
            }

            return false;
          } // Equivalent of `typeof` but with special handling for array and regexp.


          function getPropType(propValue) {
            var propType = typeof propValue;

            if (Array.isArray(propValue)) {
              return 'array';
            }

            if (propValue instanceof RegExp) {
              // Old webkits (at least until Android 4.0) return 'function' rather than
              // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
              // passes PropTypes.object.
              return 'object';
            }

            if (isSymbol(propType, propValue)) {
              return 'symbol';
            }

            return propType;
          } // This handles more types than `getPropType`. Only used for error messages.
          // See `createPrimitiveTypeChecker`.


          function getPreciseType(propValue) {
            if (typeof propValue === 'undefined' || propValue === null) {
              return '' + propValue;
            }

            var propType = getPropType(propValue);

            if (propType === 'object') {
              if (propValue instanceof Date) {
                return 'date';
              } else if (propValue instanceof RegExp) {
                return 'regexp';
              }
            }

            return propType;
          } // Returns a string that is postfixed to a warning about an invalid type.
          // For example, "undefined" or "of type array"


          function getPostfixForTypeWarning(value) {
            var type = getPreciseType(value);

            switch (type) {
              case 'array':
              case 'object':
                return 'an ' + type;

              case 'boolean':
              case 'date':
              case 'regexp':
                return 'a ' + type;

              default:
                return type;
            }
          } // Returns class name of the object, if any.


          function getClassName(propValue) {
            if (!propValue.constructor || !propValue.constructor.name) {
              return ANONYMOUS;
            }

            return propValue.constructor.name;
          }

          ReactPropTypes.checkPropTypes = checkPropTypes;
          ReactPropTypes.PropTypes = ReactPropTypes;
          return ReactPropTypes;
        };
        /* WEBPACK VAR INJECTION */

      }).call(exports, __nested_webpack_require_27595__(2));
      /***/
    },
    /* 15 */

    /***/
    function (module, exports, __nested_webpack_require_49649__) {
      "use strict";
      /* WEBPACK VAR INJECTION */

      (function (process) {
        /**
        * Copyright 2013-present, Facebook, Inc.
        * All rights reserved.
        *
        * This source code is licensed under the BSD-style license found in the
        * LICENSE file in the root directory of this source tree. An additional grant
        * of patent rights can be found in the PATENTS file in the same directory.
        */
        if (process.env.NODE_ENV !== 'production') {
          var invariant = __nested_webpack_require_49649__(5);

          var warning = __nested_webpack_require_49649__(8);

          var ReactPropTypesSecret = __nested_webpack_require_49649__(6);

          var loggedTypeFailures = {};
        }
        /**
         * Assert that the values match with the type specs.
         * Error messages are memorized and will only be shown once.
         *
         * @param {object} typeSpecs Map of name to a ReactPropType
         * @param {object} values Runtime values that need to be type-checked
         * @param {string} location e.g. "prop", "context", "child context"
         * @param {string} componentName Name of the component for error messages.
         * @param {?Function} getStack Returns the component stack.
         * @private
         */


        function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
          if (process.env.NODE_ENV !== 'production') {
            for (var typeSpecName in typeSpecs) {
              if (typeSpecs.hasOwnProperty(typeSpecName)) {
                var error; // Prop type validation may throw. In case they do, we don't want to
                // fail the render phase where it didn't fail before. So we log it.
                // After these have been cleaned up, we'll let them throw.

                try {
                  // This is intentionally an invariant that gets caught. It's the same
                  // behavior as without this statement except with a better message.
                  invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
                  error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
                } catch (ex) {
                  error = ex;
                }

                warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);

                if (error instanceof Error && !(error.message in loggedTypeFailures)) {
                  // Only monitor this failure once because there tends to be a lot of the
                  // same error.
                  loggedTypeFailures[error.message] = true;
                  var stack = getStack ? getStack() : '';
                  warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
                }
              }
            }
          }
        }

        module.exports = checkPropTypes;
        /* WEBPACK VAR INJECTION */
      }).call(exports, __nested_webpack_require_49649__(2));
      /***/
    },
    /* 16 */

    /***/
    function (module, exports, __nested_webpack_require_53219__) {
      "use strict";
      /**
       * Copyright 2013-present, Facebook, Inc.
       * All rights reserved.
       *
       * This source code is licensed under the BSD-style license found in the
       * LICENSE file in the root directory of this source tree. An additional grant
       * of patent rights can be found in the PATENTS file in the same directory.
       */

      var emptyFunction = __nested_webpack_require_53219__(4);

      var invariant = __nested_webpack_require_53219__(5);

      var ReactPropTypesSecret = __nested_webpack_require_53219__(6);

      module.exports = function () {
        function shim(props, propName, componentName, location, propFullName, secret) {
          if (secret === ReactPropTypesSecret) {
            // It is still safe when called from React.
            return;
          }

          invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        }

        ;
        shim.isRequired = shim;

        function getShim() {
          return shim;
        }

        ; // Important!
        // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.

        var ReactPropTypes = {
          array: shim,
          bool: shim,
          func: shim,
          number: shim,
          object: shim,
          string: shim,
          symbol: shim,
          any: shim,
          arrayOf: getShim,
          element: shim,
          instanceOf: getShim,
          node: shim,
          objectOf: getShim,
          oneOf: getShim,
          oneOfType: getShim,
          shape: getShim
        };
        ReactPropTypes.checkPropTypes = emptyFunction;
        ReactPropTypes.PropTypes = ReactPropTypes;
        return ReactPropTypes;
      };
      /***/

    },
    /* 17 */

    /***/
    function (module, exports, __nested_webpack_require_55150__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

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

      var _propTypes = __nested_webpack_require_55150__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_55150__(1);

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

      var SparklinesText = function (_React$Component) {
        _inherits(SparklinesText, _React$Component);

        function SparklinesText() {
          _classCallCheck(this, SparklinesText);

          return _possibleConstructorReturn(this, (SparklinesText.__proto__ || Object.getPrototypeOf(SparklinesText)).apply(this, arguments));
        }

        _createClass(SparklinesText, [{
          key: 'render',
          value: function render() {
            var _props = this.props,
                point = _props.point,
                text = _props.text,
                fontSize = _props.fontSize,
                fontFamily = _props.fontFamily;
            var x = point.x,
                y = point.y;
            return _react2.default.createElement('g', null, _react2.default.createElement('text', {
              x: x,
              y: y,
              fontFamily: fontFamily || "Verdana",
              fontSize: fontSize || 10
            }, text));
          }
        }]);

        return SparklinesText;
      }(_react2.default.Component);

      SparklinesText.propTypes = {
        text: _propTypes2.default.string,
        point: _propTypes2.default.object,
        fontSize: _propTypes2.default.number,
        fontFamily: _propTypes2.default.string
      };
      SparklinesText.defaultProps = {
        text: '',
        point: {
          x: 0,
          y: 0
        }
      };
      exports.default = SparklinesText;
      /***/
    },
    /* 18 */

    /***/
    function (module, exports, __nested_webpack_require_58969__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

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

      var _propTypes = __nested_webpack_require_58969__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_58969__(1);

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

      var SparklinesLine = function (_React$Component) {
        _inherits(SparklinesLine, _React$Component);

        function SparklinesLine() {
          _classCallCheck(this, SparklinesLine);

          return _possibleConstructorReturn(this, (SparklinesLine.__proto__ || Object.getPrototypeOf(SparklinesLine)).apply(this, arguments));
        }

        _createClass(SparklinesLine, [{
          key: 'render',
          value: function render() {
            var _props = this.props,
                data = _props.data,
                points = _props.points,
                width = _props.width,
                height = _props.height,
                margin = _props.margin,
                color = _props.color,
                style = _props.style,
                onMouseMove = _props.onMouseMove;
            var linePoints = points.map(function (p) {
              return [p.x, p.y];
            }).reduce(function (a, b) {
              return a.concat(b);
            });
            var closePolyPoints = [points[points.length - 1].x, height - margin, margin, height - margin, margin, points[0].y];
            var fillPoints = linePoints.concat(closePolyPoints);
            var lineStyle = {
              stroke: color || style.stroke || 'slategray',
              strokeWidth: style.strokeWidth || '1',
              strokeLinejoin: style.strokeLinejoin || 'round',
              strokeLinecap: style.strokeLinecap || 'round',
              fill: 'none'
            };
            var fillStyle = {
              stroke: style.stroke || 'none',
              strokeWidth: '0',
              fillOpacity: style.fillOpacity || '.1',
              fill: style.fill || color || 'slategray',
              pointerEvents: 'auto'
            };
            var tooltips = points.map(function (p, i) {
              return _react2.default.createElement('circle', {
                key: i,
                cx: p.x,
                cy: p.y,
                r: 2,
                style: fillStyle,
                onMouseEnter: function onMouseEnter(e) {
                  return onMouseMove('enter', data[i], p);
                },
                onClick: function onClick(e) {
                  return onMouseMove('click', data[i], p);
                }
              });
            });
            return _react2.default.createElement('g', null, tooltips, _react2.default.createElement('polyline', {
              points: fillPoints.join(' '),
              style: fillStyle
            }), _react2.default.createElement('polyline', {
              points: linePoints.join(' '),
              style: lineStyle
            }));
          }
        }]);

        return SparklinesLine;
      }(_react2.default.Component);

      SparklinesLine.propTypes = {
        color: _propTypes2.default.string,
        style: _propTypes2.default.object
      };
      SparklinesLine.defaultProps = {
        style: {},
        onMouseMove: function onMouseMove() {}
      };
      exports.default = SparklinesLine;
      /***/
    },
    /* 19 */

    /***/
    function (module, exports, __nested_webpack_require_64360__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

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

      var _propTypes = __nested_webpack_require_64360__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_64360__(1);

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

      var SparklinesCurve = function (_React$Component) {
        _inherits(SparklinesCurve, _React$Component);

        function SparklinesCurve() {
          _classCallCheck(this, SparklinesCurve);

          return _possibleConstructorReturn(this, (SparklinesCurve.__proto__ || Object.getPrototypeOf(SparklinesCurve)).apply(this, arguments));
        }

        _createClass(SparklinesCurve, [{
          key: 'render',
          value: function render() {
            var _props = this.props,
                points = _props.points,
                width = _props.width,
                height = _props.height,
                margin = _props.margin,
                color = _props.color,
                style = _props.style,
                _props$divisor = _props.divisor,
                divisor = _props$divisor === undefined ? 0.25 : _props$divisor;
            var prev = void 0;

            var curve = function curve(p) {
              var res = void 0;

              if (!prev) {
                res = [p.x, p.y];
              } else {
                var len = (p.x - prev.x) * divisor;
                res = ["C", //x1
                prev.x + len, //y1
                prev.y, //x2,
                p.x - len, //y2,
                p.y, //x,
                p.x, //y
                p.y];
              }

              prev = p;
              return res;
            };

            var linePoints = points.map(function (p) {
              return curve(p);
            }).reduce(function (a, b) {
              return a.concat(b);
            });
            var closePolyPoints = ["L" + points[points.length - 1].x, height - margin, margin, height - margin, margin, points[0].y];
            var fillPoints = linePoints.concat(closePolyPoints);
            var lineStyle = {
              stroke: color || style.stroke || 'slategray',
              strokeWidth: style.strokeWidth || '1',
              strokeLinejoin: style.strokeLinejoin || 'round',
              strokeLinecap: style.strokeLinecap || 'round',
              fill: 'none'
            };
            var fillStyle = {
              stroke: style.stroke || 'none',
              strokeWidth: '0',
              fillOpacity: style.fillOpacity || '.1',
              fill: style.fill || color || 'slategray'
            };
            return _react2.default.createElement('g', null, _react2.default.createElement('path', {
              d: "M" + fillPoints.join(' '),
              style: fillStyle
            }), _react2.default.createElement('path', {
              d: "M" + linePoints.join(' '),
              style: lineStyle
            }));
          }
        }]);

        return SparklinesCurve;
      }(_react2.default.Component);

      SparklinesCurve.propTypes = {
        color: _propTypes2.default.string,
        style: _propTypes2.default.object
      };
      SparklinesCurve.defaultProps = {
        style: {}
      };
      exports.default = SparklinesCurve;
      /***/
    },
    /* 20 */

    /***/
    function (module, exports, __nested_webpack_require_69698__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

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

      var _propTypes = __nested_webpack_require_69698__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_69698__(1);

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

      var SparklinesBars = function (_React$Component) {
        _inherits(SparklinesBars, _React$Component);

        function SparklinesBars() {
          _classCallCheck(this, SparklinesBars);

          return _possibleConstructorReturn(this, (SparklinesBars.__proto__ || Object.getPrototypeOf(SparklinesBars)).apply(this, arguments));
        }

        _createClass(SparklinesBars, [{
          key: 'render',
          value: function render() {
            var _this2 = this;

            var _props = this.props,
                points = _props.points,
                height = _props.height,
                style = _props.style,
                barWidth = _props.barWidth,
                margin = _props.margin,
                onMouseMove = _props.onMouseMove;
            var strokeWidth = 1 * (style && style.strokeWidth || 0);
            var marginWidth = margin ? 2 * margin : 0;
            var width = barWidth || (points && points.length >= 2 ? Math.max(0, points[1].x - points[0].x - strokeWidth - marginWidth) : 0);
            return _react2.default.createElement('g', {
              transform: 'scale(1,-1)'
            }, points.map(function (p, i) {
              return _react2.default.createElement('rect', {
                key: i,
                x: p.x - (width + strokeWidth) / 2,
                y: -height,
                width: width,
                height: Math.max(0, height - p.y),
                style: style,
                onMouseMove: onMouseMove && onMouseMove.bind(_this2, p)
              });
            }));
          }
        }]);

        return SparklinesBars;
      }(_react2.default.Component);

      SparklinesBars.propTypes = {
        points: _propTypes2.default.arrayOf(_propTypes2.default.object),
        height: _propTypes2.default.number,
        style: _propTypes2.default.object,
        barWidth: _propTypes2.default.number,
        margin: _propTypes2.default.number,
        onMouseMove: _propTypes2.default.func
      };
      SparklinesBars.defaultProps = {
        style: {
          fill: 'slategray'
        }
      };
      exports.default = SparklinesBars;
      /***/
    },
    /* 21 */

    /***/
    function (module, exports, __nested_webpack_require_74208__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

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

      var _propTypes = __nested_webpack_require_74208__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_74208__(1);

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

      var SparklinesSpots = function (_React$Component) {
        _inherits(SparklinesSpots, _React$Component);

        function SparklinesSpots() {
          _classCallCheck(this, SparklinesSpots);

          return _possibleConstructorReturn(this, (SparklinesSpots.__proto__ || Object.getPrototypeOf(SparklinesSpots)).apply(this, arguments));
        }

        _createClass(SparklinesSpots, [{
          key: 'lastDirection',
          value: function lastDirection(points) {
            Math.sign = Math.sign || function (x) {
              return x > 0 ? 1 : -1;
            };

            return points.length < 2 ? 0 : Math.sign(points[points.length - 2].y - points[points.length - 1].y);
          }
        }, {
          key: 'render',
          value: function render() {
            var _props = this.props,
                points = _props.points,
                width = _props.width,
                height = _props.height,
                size = _props.size,
                style = _props.style,
                spotColors = _props.spotColors;

            var startSpot = _react2.default.createElement('circle', {
              cx: points[0].x,
              cy: points[0].y,
              r: size,
              style: style
            });

            var endSpot = _react2.default.createElement('circle', {
              cx: points[points.length - 1].x,
              cy: points[points.length - 1].y,
              r: size,
              style: style || {
                fill: spotColors[this.lastDirection(points)]
              }
            });

            return _react2.default.createElement('g', null, style && startSpot, endSpot);
          }
        }]);

        return SparklinesSpots;
      }(_react2.default.Component);

      SparklinesSpots.propTypes = {
        size: _propTypes2.default.number,
        style: _propTypes2.default.object,
        spotColors: _propTypes2.default.object
      };
      SparklinesSpots.defaultProps = {
        size: 2,
        spotColors: {
          '-1': 'red',
          '0': 'black',
          '1': 'green'
        }
      };
      exports.default = SparklinesSpots;
      /***/
    },
    /* 22 */

    /***/
    function (module, exports, __nested_webpack_require_78724__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

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

      var _propTypes = __nested_webpack_require_78724__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_78724__(1);

      var _react2 = _interopRequireDefault(_react);

      var _dataProcessing = __nested_webpack_require_78724__(23);

      var dataProcessing = _interopRequireWildcard(_dataProcessing);

      function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        } else {
          var newObj = {};

          if (obj != null) {
            for (var key in obj) {
              if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
          }

          newObj.default = obj;
          return newObj;
        }
      }

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

      var SparklinesReferenceLine = function (_React$Component) {
        _inherits(SparklinesReferenceLine, _React$Component);

        function SparklinesReferenceLine() {
          _classCallCheck(this, SparklinesReferenceLine);

          return _possibleConstructorReturn(this, (SparklinesReferenceLine.__proto__ || Object.getPrototypeOf(SparklinesReferenceLine)).apply(this, arguments));
        }

        _createClass(SparklinesReferenceLine, [{
          key: 'render',
          value: function render() {
            var _props = this.props,
                points = _props.points,
                margin = _props.margin,
                type = _props.type,
                style = _props.style,
                value = _props.value;
            var ypoints = points.map(function (p) {
              return p.y;
            });
            var y = type == 'custom' ? value : dataProcessing[type](ypoints);
            return _react2.default.createElement('line', {
              x1: points[0].x,
              y1: y + margin,
              x2: points[points.length - 1].x,
              y2: y + margin,
              style: style
            });
          }
        }]);

        return SparklinesReferenceLine;
      }(_react2.default.Component);

      SparklinesReferenceLine.propTypes = {
        type: _propTypes2.default.oneOf(['max', 'min', 'mean', 'avg', 'median', 'custom']),
        value: _propTypes2.default.number,
        style: _propTypes2.default.object
      };
      SparklinesReferenceLine.defaultProps = {
        type: 'mean',
        style: {
          stroke: 'red',
          strokeOpacity: .75,
          strokeDasharray: '2, 2'
        }
      };
      exports.default = SparklinesReferenceLine;
      /***/
    },
    /* 23 */

    /***/
    function (module, exports, __nested_webpack_require_83361__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.variance = exports.stdev = exports.median = exports.midRange = exports.avg = exports.mean = exports.max = exports.min = undefined;

      var _min2 = __nested_webpack_require_83361__(7);

      var _min3 = _interopRequireDefault(_min2);

      var _mean2 = __nested_webpack_require_83361__(3);

      var _mean3 = _interopRequireDefault(_mean2);

      var _midRange2 = __nested_webpack_require_83361__(24);

      var _midRange3 = _interopRequireDefault(_midRange2);

      var _median2 = __nested_webpack_require_83361__(25);

      var _median3 = _interopRequireDefault(_median2);

      var _stdev2 = __nested_webpack_require_83361__(10);

      var _stdev3 = _interopRequireDefault(_stdev2);

      var _variance2 = __nested_webpack_require_83361__(26);

      var _variance3 = _interopRequireDefault(_variance2);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      exports.min = _min3.default;
      exports.max = _min3.default;
      exports.mean = _mean3.default;
      exports.avg = _mean3.default;
      exports.midRange = _midRange3.default;
      exports.median = _median3.default;
      exports.stdev = _stdev3.default;
      exports.variance = _variance3.default;
      /***/
    },
    /* 24 */

    /***/
    function (module, exports, __nested_webpack_require_84766__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _min = __nested_webpack_require_84766__(7);

      var _min2 = _interopRequireDefault(_min);

      var _max = __nested_webpack_require_84766__(9);

      var _max2 = _interopRequireDefault(_max);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      exports.default = function (data) {
        return (0, _max2.default)(data) - (0, _min2.default)(data) / 2;
      };
      /***/

    },
    /* 25 */

    /***/
    function (module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.default = function (data) {
        return data.sort(function (a, b) {
          return a - b;
        })[Math.floor(data.length / 2)];
      };
      /***/

    },
    /* 26 */

    /***/
    function (module, exports, __nested_webpack_require_85771__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _mean = __nested_webpack_require_85771__(3);

      var _mean2 = _interopRequireDefault(_mean);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      exports.default = function (data) {
        var dataMean = (0, _mean2.default)(data);
        var sq = data.map(function (n) {
          return Math.pow(n - dataMean, 2);
        });
        return (0, _mean2.default)(sq);
      };
      /***/

    },
    /* 27 */

    /***/
    function (module, exports, __nested_webpack_require_86441__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

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

      var _propTypes = __nested_webpack_require_86441__(0);

      var _propTypes2 = _interopRequireDefault(_propTypes);

      var _react = __nested_webpack_require_86441__(1);

      var _react2 = _interopRequireDefault(_react);

      var _mean = __nested_webpack_require_86441__(3);

      var _mean2 = _interopRequireDefault(_mean);

      var _stdev = __nested_webpack_require_86441__(10);

      var _stdev2 = _interopRequireDefault(_stdev);

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

      var SparklinesNormalBand = function (_React$Component) {
        _inherits(SparklinesNormalBand, _React$Component);

        function SparklinesNormalBand() {
          _classCallCheck(this, SparklinesNormalBand);

          return _possibleConstructorReturn(this, (SparklinesNormalBand.__proto__ || Object.getPrototypeOf(SparklinesNormalBand)).apply(this, arguments));
        }

        _createClass(SparklinesNormalBand, [{
          key: 'render',
          value: function render() {
            var _props = this.props,
                points = _props.points,
                margin = _props.margin,
                style = _props.style;
            var ypoints = points.map(function (p) {
              return p.y;
            });
            var dataMean = (0, _mean2.default)(ypoints);
            var dataStdev = (0, _stdev2.default)(ypoints);
            return _react2.default.createElement('rect', {
              x: points[0].x,
              y: dataMean - dataStdev + margin,
              width: points[points.length - 1].x - points[0].x,
              height: _stdev2.default * 2,
              style: style
            });
          }
        }]);

        return SparklinesNormalBand;
      }(_react2.default.Component);

      SparklinesNormalBand.propTypes = {
        style: _propTypes2.default.object
      };
      SparklinesNormalBand.defaultProps = {
        style: {
          fill: 'red',
          fillOpacity: .1
        }
      };
      exports.default = SparklinesNormalBand;
      /***/
    },
    /* 28 */

    /***/
    function (module, exports, __nested_webpack_require_90520__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _min = __nested_webpack_require_90520__(7);

      var _min2 = _interopRequireDefault(_min);

      var _max = __nested_webpack_require_90520__(9);

      var _max2 = _interopRequireDefault(_max);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      exports.default = function (_ref) {
        var data = _ref.data,
            limit = _ref.limit,
            _ref$width = _ref.width,
            width = _ref$width === undefined ? 1 : _ref$width,
            _ref$height = _ref.height,
            height = _ref$height === undefined ? 1 : _ref$height,
            _ref$margin = _ref.margin,
            margin = _ref$margin === undefined ? 0 : _ref$margin,
            _ref$max = _ref.max,
            max = _ref$max === undefined ? (0, _max2.default)(data) : _ref$max,
            _ref$min = _ref.min,
            min = _ref$min === undefined ? (0, _min2.default)(data) : _ref$min;
        var len = data.length;

        if (limit && limit < len) {
          data = data.slice(len - limit);
        }

        var vfactor = (height - margin * 2) / (max - min || 2);
        var hfactor = (width - margin * 2) / ((limit || len) - (len > 1 ? 1 : 0));
        return data.map(function (d, i) {
          return {
            x: i * hfactor + margin,
            y: (max === min ? 1 : max - d) * vfactor + margin
          };
        });
      };
      /***/

    }
    /******/
    ])
  );
});

/***/ }),

/***/ 1349:
/*!*************************************************************************!*\
  !*** ./node_modules/react-swipeable-views-core/lib/checkIndexBounds.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 94);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 0));

var _warning = _interopRequireDefault(__webpack_require__(/*! warning */ 313));

var checkIndexBounds = function checkIndexBounds(props) {
  var index = props.index,
      children = props.children;

  var childrenCount = _react.default.Children.count(children);

   true ? (0, _warning.default)(index >= 0 && index <= childrenCount, "react-swipeable-view: the new index: ".concat(index, " is out of bounds: [0-").concat(childrenCount, "].")) : 0;
};

var _default = checkIndexBounds;
exports["default"] = _default;

/***/ }),

/***/ 1350:
/*!*********************************************************************!*\
  !*** ./node_modules/react-swipeable-views-core/lib/computeIndex.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 94);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = computeIndex;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 0));

var _constant = _interopRequireDefault(__webpack_require__(/*! ./constant */ 754));

function computeIndex(params) {
  var children = params.children,
      startIndex = params.startIndex,
      startX = params.startX,
      pageX = params.pageX,
      viewLength = params.viewLength,
      resistance = params.resistance;
  var indexMax = _react.default.Children.count(children) - 1;
  var index = startIndex + (startX - pageX) / viewLength;
  var newStartX;

  if (!resistance) {
    // Reset the starting point
    if (index < 0) {
      index = 0;
      newStartX = (index - startIndex) * viewLength + pageX;
    } else if (index > indexMax) {
      index = indexMax;
      newStartX = (index - startIndex) * viewLength + pageX;
    }
  } else if (index < 0) {
    index = Math.exp(index * _constant.default.RESISTANCE_COEF) - 1;
  } else if (index > indexMax) {
    index = indexMax + 1 - Math.exp((indexMax - index) * _constant.default.RESISTANCE_COEF);
  }

  return {
    index: index,
    startX: newStartX
  };
}

/***/ }),

/***/ 754:
/*!*****************************************************************!*\
  !*** ./node_modules/react-swipeable-views-core/lib/constant.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = {
  RESISTANCE_COEF: 0.6,
  // This value is closed to what browsers are using internally to
  // trigger a native scroll.
  UNCERTAINTY_THRESHOLD: 3 // px

};
exports["default"] = _default;

/***/ }),

/***/ 1351:
/*!****************************************************************************!*\
  !*** ./node_modules/react-swipeable-views-core/lib/getDisplaySameSlide.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 94);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ 0));

var getDisplaySameSlide = function getDisplaySameSlide(props, nextProps) {
  var displaySameSlide = false;

  var getChildrenKey = function getChildrenKey(child) {
    return child ? child.key : 'empty';
  };

  if (props.children.length && nextProps.children.length) {
    var oldKeys = _react.default.Children.map(props.children, getChildrenKey);

    var oldKey = oldKeys[props.index];

    if (oldKey !== null && oldKey !== undefined) {
      var newKeys = _react.default.Children.map(nextProps.children, getChildrenKey);

      var newKey = newKeys[nextProps.index];

      if (oldKey === newKey) {
        displaySameSlide = true;
      }
    }
  }

  return displaySameSlide;
};

var _default = getDisplaySameSlide;
exports["default"] = _default;

/***/ }),

/***/ 1259:
/*!**************************************************************!*\
  !*** ./node_modules/react-swipeable-views-core/lib/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 94);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "checkIndexBounds", ({
  enumerable: true,
  get: function get() {
    return _checkIndexBounds.default;
  }
}));
Object.defineProperty(exports, "computeIndex", ({
  enumerable: true,
  get: function get() {
    return _computeIndex.default;
  }
}));
Object.defineProperty(exports, "constant", ({
  enumerable: true,
  get: function get() {
    return _constant.default;
  }
}));
Object.defineProperty(exports, "getDisplaySameSlide", ({
  enumerable: true,
  get: function get() {
    return _getDisplaySameSlide.default;
  }
}));
Object.defineProperty(exports, "mod", ({
  enumerable: true,
  get: function get() {
    return _mod.default;
  }
}));

var _checkIndexBounds = _interopRequireDefault(__webpack_require__(/*! ./checkIndexBounds */ 1349));

var _computeIndex = _interopRequireDefault(__webpack_require__(/*! ./computeIndex */ 1350));

var _constant = _interopRequireDefault(__webpack_require__(/*! ./constant */ 754));

var _getDisplaySameSlide = _interopRequireDefault(__webpack_require__(/*! ./getDisplaySameSlide */ 1351));

var _mod = _interopRequireDefault(__webpack_require__(/*! ./mod */ 1352));

/***/ }),

/***/ 1352:
/*!************************************************************!*\
  !*** ./node_modules/react-swipeable-views-core/lib/mod.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0; // Extended version of % with negative integer support.

function mod(n, m) {
  var q = n % m;
  return q < 0 ? q + m : q;
}

var _default = mod;
exports["default"] = _default;

/***/ }),

/***/ 1258:
/*!******************************************************************!*\
  !*** ./node_modules/react-swipeable-views/lib/SwipeableViews.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ 397);

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 746);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.getDomTreeShapes = getDomTreeShapes;
exports.findNativeHandler = findNativeHandler;
exports["default"] = exports.SwipeableViewsContext = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/extends */ 517));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/objectWithoutProperties */ 747));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 749));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 750));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ 751));

var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ 518));

var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ 753));

var React = _interopRequireWildcard(__webpack_require__(/*! react */ 0));

var _warning = _interopRequireDefault(__webpack_require__(/*! warning */ 313));

var _reactSwipeableViewsCore = __webpack_require__(/*! react-swipeable-views-core */ 1259);

function addEventListener(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return {
    remove: function remove() {
      node.removeEventListener(event, handler, options);
    }
  };
}

var styles = {
  container: {
    direction: 'ltr',
    display: 'flex',
    willChange: 'transform'
  },
  slide: {
    width: '100%',
    WebkitFlexShrink: 0,
    flexShrink: 0,
    overflow: 'auto'
  }
};
var axisProperties = {
  root: {
    x: {
      overflowX: 'hidden'
    },
    'x-reverse': {
      overflowX: 'hidden'
    },
    y: {
      overflowY: 'hidden'
    },
    'y-reverse': {
      overflowY: 'hidden'
    }
  },
  flexDirection: {
    x: 'row',
    'x-reverse': 'row-reverse',
    y: 'column',
    'y-reverse': 'column-reverse'
  },
  transform: {
    x: function x(translate) {
      return "translate(".concat(-translate, "%, 0)");
    },
    'x-reverse': function xReverse(translate) {
      return "translate(".concat(translate, "%, 0)");
    },
    y: function y(translate) {
      return "translate(0, ".concat(-translate, "%)");
    },
    'y-reverse': function yReverse(translate) {
      return "translate(0, ".concat(translate, "%)");
    }
  },
  length: {
    x: 'width',
    'x-reverse': 'width',
    y: 'height',
    'y-reverse': 'height'
  },
  rotationMatrix: {
    x: {
      x: [1, 0],
      y: [0, 1]
    },
    'x-reverse': {
      x: [-1, 0],
      y: [0, 1]
    },
    y: {
      x: [0, 1],
      y: [1, 0]
    },
    'y-reverse': {
      x: [0, -1],
      y: [1, 0]
    }
  },
  scrollPosition: {
    x: 'scrollLeft',
    'x-reverse': 'scrollLeft',
    y: 'scrollTop',
    'y-reverse': 'scrollTop'
  },
  scrollLength: {
    x: 'scrollWidth',
    'x-reverse': 'scrollWidth',
    y: 'scrollHeight',
    'y-reverse': 'scrollHeight'
  },
  clientLength: {
    x: 'clientWidth',
    'x-reverse': 'clientWidth',
    y: 'clientHeight',
    'y-reverse': 'clientHeight'
  }
};

function createTransition(property, options) {
  var duration = options.duration,
      easeFunction = options.easeFunction,
      delay = options.delay;
  return "".concat(property, " ").concat(duration, " ").concat(easeFunction, " ").concat(delay);
} // We are using a 2x2 rotation matrix.


function applyRotationMatrix(touch, axis) {
  var rotationMatrix = axisProperties.rotationMatrix[axis];
  return {
    pageX: rotationMatrix.x[0] * touch.pageX + rotationMatrix.x[1] * touch.pageY,
    pageY: rotationMatrix.y[0] * touch.pageX + rotationMatrix.y[1] * touch.pageY
  };
}

function adaptMouse(event) {
  event.touches = [{
    pageX: event.pageX,
    pageY: event.pageY
  }];
  return event;
}

function getDomTreeShapes(element, rootNode) {
  var domTreeShapes = [];

  while (element && element !== rootNode && element !== document.body) {
    // We reach a Swipeable View, no need to look higher in the dom tree.
    if (element.hasAttribute('data-swipeable')) {
      break;
    }

    var style = window.getComputedStyle(element);

    if ( // Ignore the scroll children if the element is absolute positioned.
    style.getPropertyValue('position') === 'absolute' || // Ignore the scroll children if the element has an overflowX hidden
    style.getPropertyValue('overflow-x') === 'hidden') {
      domTreeShapes = [];
    } else if (element.clientWidth > 0 && element.scrollWidth > element.clientWidth || element.clientHeight > 0 && element.scrollHeight > element.clientHeight) {
      // Ignore the nodes that have no width.
      // Keep elements with a scroll
      domTreeShapes.push({
        element: element,
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      });
    }

    element = element.parentNode;
  }

  return domTreeShapes;
} // We can only have one node at the time claiming ownership for handling the swipe.
// Otherwise, the UX would be confusing.
// That's why we use a singleton here.


var nodeWhoClaimedTheScroll = null;

function findNativeHandler(params) {
  var domTreeShapes = params.domTreeShapes,
      pageX = params.pageX,
      startX = params.startX,
      axis = params.axis;
  return domTreeShapes.some(function (shape) {
    // Determine if we are going backward or forward.
    var goingForward = pageX >= startX;

    if (axis === 'x' || axis === 'y') {
      goingForward = !goingForward;
    } // scrollTop is not always be an integer.
    // https://github.com/jquery/api.jquery.com/issues/608


    var scrollPosition = Math.round(shape[axisProperties.scrollPosition[axis]]);
    var areNotAtStart = scrollPosition > 0;
    var areNotAtEnd = scrollPosition + shape[axisProperties.clientLength[axis]] < shape[axisProperties.scrollLength[axis]];

    if (goingForward && areNotAtEnd || !goingForward && areNotAtStart) {
      nodeWhoClaimedTheScroll = shape.element;
      return true;
    }

    return false;
  });
}

var SwipeableViewsContext = React.createContext();
exports.SwipeableViewsContext = SwipeableViewsContext;

if (true) {
  SwipeableViewsContext.displayName = 'SwipeableViewsContext';
}

var SwipeableViews = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(SwipeableViews, _React$Component);

  function SwipeableViews(props) {
    var _this;

    (0, _classCallCheck2.default)(this, SwipeableViews);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(SwipeableViews).call(this, props));
    _this.rootNode = null;
    _this.containerNode = null;
    _this.ignoreNextScrollEvents = false;
    _this.viewLength = 0;
    _this.startX = 0;
    _this.lastX = 0;
    _this.vx = 0;
    _this.startY = 0;
    _this.isSwiping = undefined;
    _this.started = false;
    _this.startIndex = 0;
    _this.transitionListener = null;
    _this.touchMoveListener = null;
    _this.activeSlide = null;
    _this.indexCurrent = null;
    _this.firstRenderTimeout = null;

    _this.setRootNode = function (node) {
      _this.rootNode = node;
    };

    _this.setContainerNode = function (node) {
      _this.containerNode = node;
    };

    _this.setActiveSlide = function (node) {
      _this.activeSlide = node;

      _this.updateHeight();
    };

    _this.handleSwipeStart = function (event) {
      var axis = _this.props.axis;
      var touch = applyRotationMatrix(event.touches[0], axis);
      _this.viewLength = _this.rootNode.getBoundingClientRect()[axisProperties.length[axis]];
      _this.startX = touch.pageX;
      _this.lastX = touch.pageX;
      _this.vx = 0;
      _this.startY = touch.pageY;
      _this.isSwiping = undefined;
      _this.started = true;
      var computedStyle = window.getComputedStyle(_this.containerNode);
      var transform = computedStyle.getPropertyValue('-webkit-transform') || computedStyle.getPropertyValue('transform');

      if (transform && transform !== 'none') {
        var transformValues = transform.split('(')[1].split(')')[0].split(',');
        var rootStyle = window.getComputedStyle(_this.rootNode);
        var tranformNormalized = applyRotationMatrix({
          pageX: parseInt(transformValues[4], 10),
          pageY: parseInt(transformValues[5], 10)
        }, axis);
        _this.startIndex = -tranformNormalized.pageX / (_this.viewLength - parseInt(rootStyle.paddingLeft, 10) - parseInt(rootStyle.paddingRight, 10)) || 0;
      }
    };

    _this.handleSwipeMove = function (event) {
      // The touch start event can be cancel.
      // Makes sure we set a starting point.
      if (!_this.started) {
        _this.handleTouchStart(event);

        return;
      } // We are not supposed to hanlde this touch move.


      if (nodeWhoClaimedTheScroll !== null && nodeWhoClaimedTheScroll !== _this.rootNode) {
        return;
      }

      var _this$props = _this.props,
          axis = _this$props.axis,
          children = _this$props.children,
          ignoreNativeScroll = _this$props.ignoreNativeScroll,
          onSwitching = _this$props.onSwitching,
          resistance = _this$props.resistance;
      var touch = applyRotationMatrix(event.touches[0], axis); // We don't know yet.

      if (_this.isSwiping === undefined) {
        var dx = Math.abs(touch.pageX - _this.startX);
        var dy = Math.abs(touch.pageY - _this.startY);
        var isSwiping = dx > dy && dx > _reactSwipeableViewsCore.constant.UNCERTAINTY_THRESHOLD; // We let the parent handle the scroll.

        if (!resistance && (axis === 'y' || axis === 'y-reverse') && (_this.indexCurrent === 0 && _this.startX < touch.pageX || _this.indexCurrent === React.Children.count(_this.props.children) - 1 && _this.startX > touch.pageX)) {
          _this.isSwiping = false;
          return;
        } // We are likely to be swiping, let's prevent the scroll event.


        if (dx > dy) {
          event.preventDefault();
        }

        if (isSwiping === true || dy > _reactSwipeableViewsCore.constant.UNCERTAINTY_THRESHOLD) {
          _this.isSwiping = isSwiping;
          _this.startX = touch.pageX; // Shift the starting point.

          return; // Let's wait the next touch event to move something.
        }
      }

      if (_this.isSwiping !== true) {
        return;
      } // We are swiping, let's prevent the scroll event.


      event.preventDefault(); // Low Pass filter.

      _this.vx = _this.vx * 0.5 + (touch.pageX - _this.lastX) * 0.5;
      _this.lastX = touch.pageX;

      var _computeIndex = (0, _reactSwipeableViewsCore.computeIndex)({
        children: children,
        resistance: resistance,
        pageX: touch.pageX,
        startIndex: _this.startIndex,
        startX: _this.startX,
        viewLength: _this.viewLength
      }),
          index = _computeIndex.index,
          startX = _computeIndex.startX; // Add support for native scroll elements.


      if (nodeWhoClaimedTheScroll === null && !ignoreNativeScroll) {
        var domTreeShapes = getDomTreeShapes(event.target, _this.rootNode);
        var hasFoundNativeHandler = findNativeHandler({
          domTreeShapes: domTreeShapes,
          startX: _this.startX,
          pageX: touch.pageX,
          axis: axis
        }); // We abort the touch move handler.

        if (hasFoundNativeHandler) {
          return;
        }
      } // We are moving toward the edges.


      if (startX) {
        _this.startX = startX;
      } else if (nodeWhoClaimedTheScroll === null) {
        nodeWhoClaimedTheScroll = _this.rootNode;
      }

      _this.setIndexCurrent(index);

      var callback = function callback() {
        if (onSwitching) {
          onSwitching(index, 'move');
        }
      };

      if (_this.state.displaySameSlide || !_this.state.isDragging) {
        _this.setState({
          displaySameSlide: false,
          isDragging: true
        }, callback);
      }

      callback();
    };

    _this.handleSwipeEnd = function () {
      nodeWhoClaimedTheScroll = null; // The touch start event can be cancel.
      // Makes sure that a starting point is set.

      if (!_this.started) {
        return;
      }

      _this.started = false;

      if (_this.isSwiping !== true) {
        return;
      }

      var indexLatest = _this.state.indexLatest;
      var indexCurrent = _this.indexCurrent;
      var delta = indexLatest - indexCurrent;
      var indexNew; // Quick movement

      if (Math.abs(_this.vx) > _this.props.threshold) {
        if (_this.vx > 0) {
          indexNew = Math.floor(indexCurrent);
        } else {
          indexNew = Math.ceil(indexCurrent);
        }
      } else if (Math.abs(delta) > _this.props.hysteresis) {
        // Some hysteresis with indexLatest.
        indexNew = delta > 0 ? Math.floor(indexCurrent) : Math.ceil(indexCurrent);
      } else {
        indexNew = indexLatest;
      }

      var indexMax = React.Children.count(_this.props.children) - 1;

      if (indexNew < 0) {
        indexNew = 0;
      } else if (indexNew > indexMax) {
        indexNew = indexMax;
      }

      _this.setIndexCurrent(indexNew);

      _this.setState({
        indexLatest: indexNew,
        isDragging: false
      }, function () {
        if (_this.props.onSwitching) {
          _this.props.onSwitching(indexNew, 'end');
        }

        if (_this.props.onChangeIndex && indexNew !== indexLatest) {
          _this.props.onChangeIndex(indexNew, indexLatest, {
            reason: 'swipe'
          });
        } // Manually calling handleTransitionEnd in that case as isn't otherwise.


        if (indexCurrent === indexLatest) {
          _this.handleTransitionEnd();
        }
      });
    };

    _this.handleTouchStart = function (event) {
      if (_this.props.onTouchStart) {
        _this.props.onTouchStart(event);
      }

      _this.handleSwipeStart(event);
    };

    _this.handleTouchEnd = function (event) {
      if (_this.props.onTouchEnd) {
        _this.props.onTouchEnd(event);
      }

      _this.handleSwipeEnd(event);
    };

    _this.handleMouseDown = function (event) {
      if (_this.props.onMouseDown) {
        _this.props.onMouseDown(event);
      }

      event.persist();

      _this.handleSwipeStart(adaptMouse(event));
    };

    _this.handleMouseUp = function (event) {
      if (_this.props.onMouseUp) {
        _this.props.onMouseUp(event);
      }

      _this.handleSwipeEnd(adaptMouse(event));
    };

    _this.handleMouseLeave = function (event) {
      if (_this.props.onMouseLeave) {
        _this.props.onMouseLeave(event);
      } // Filter out events


      if (_this.started) {
        _this.handleSwipeEnd(adaptMouse(event));
      }
    };

    _this.handleMouseMove = function (event) {
      if (_this.props.onMouseMove) {
        _this.props.onMouseMove(event);
      } // Filter out events


      if (_this.started) {
        _this.handleSwipeMove(adaptMouse(event));
      }
    };

    _this.handleScroll = function (event) {
      if (_this.props.onScroll) {
        _this.props.onScroll(event);
      } // Ignore events bubbling up.


      if (event.target !== _this.rootNode) {
        return;
      }

      if (_this.ignoreNextScrollEvents) {
        _this.ignoreNextScrollEvents = false;
        return;
      }

      var indexLatest = _this.state.indexLatest;
      var indexNew = Math.ceil(event.target.scrollLeft / event.target.clientWidth) + indexLatest;
      _this.ignoreNextScrollEvents = true; // Reset the scroll position.

      event.target.scrollLeft = 0;

      if (_this.props.onChangeIndex && indexNew !== indexLatest) {
        _this.props.onChangeIndex(indexNew, indexLatest, {
          reason: 'focus'
        });
      }
    };

    _this.updateHeight = function () {
      if (_this.activeSlide !== null) {
        var child = _this.activeSlide.children[0];

        if (child !== undefined && child.offsetHeight !== undefined && _this.state.heightLatest !== child.offsetHeight) {
          _this.setState({
            heightLatest: child.offsetHeight
          });
        }
      }
    };

    if (true) {
      (0, _reactSwipeableViewsCore.checkIndexBounds)(props);
    }

    _this.state = {
      indexLatest: props.index,
      // Set to true as soon as the component is swiping.
      // It's the state counter part of this.isSwiping.
      isDragging: false,
      // Help with SSR logic and lazy loading logic.
      renderOnlyActive: !props.disableLazyLoading,
      heightLatest: 0,
      // Let the render method that we are going to display the same slide than previously.
      displaySameSlide: true
    };

    _this.setIndexCurrent(props.index);

    return _this;
  }

  (0, _createClass2.default)(SwipeableViews, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this; // Subscribe to transition end events.


      this.transitionListener = addEventListener(this.containerNode, 'transitionend', function (event) {
        if (event.target !== _this2.containerNode) {
          return;
        }

        _this2.handleTransitionEnd();
      }); // Block the thread to handle that event.

      this.touchMoveListener = addEventListener(this.rootNode, 'touchmove', function (event) {
        // Handling touch events is disabled.
        if (_this2.props.disabled) {
          return;
        }

        _this2.handleSwipeMove(event);
      }, {
        passive: false
      });

      if (!this.props.disableLazyLoading) {
        this.firstRenderTimeout = setTimeout(function () {
          _this2.setState({
            renderOnlyActive: false
          });
        }, 0);
      } // Send all functions in an object if action param is set.


      if (this.props.action) {
        this.props.action({
          updateHeight: this.updateHeight
        });
      }
    } // eslint-disable-next-line camelcase,react/sort-comp

  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var index = nextProps.index;

      if (typeof index === 'number' && index !== this.props.index) {
        if (true) {
          (0, _reactSwipeableViewsCore.checkIndexBounds)(nextProps);
        }

        this.setIndexCurrent(index);
        this.setState({
          // If true, we are going to change the children. We shoudn't animate it.
          displaySameSlide: (0, _reactSwipeableViewsCore.getDisplaySameSlide)(this.props, nextProps),
          indexLatest: index
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.transitionListener.remove();
      this.touchMoveListener.remove();
      clearTimeout(this.firstRenderTimeout);
    }
  }, {
    key: "getSwipeableViewsContext",
    value: function getSwipeableViewsContext() {
      var _this3 = this;

      return {
        slideUpdateHeight: function slideUpdateHeight() {
          _this3.updateHeight();
        }
      };
    }
  }, {
    key: "setIndexCurrent",
    value: function setIndexCurrent(indexCurrent) {
      if (!this.props.animateTransitions && this.indexCurrent !== indexCurrent) {
        this.handleTransitionEnd();
      }

      this.indexCurrent = indexCurrent;

      if (this.containerNode) {
        var axis = this.props.axis;
        var transform = axisProperties.transform[axis](indexCurrent * 100);
        this.containerNode.style.WebkitTransform = transform;
        this.containerNode.style.transform = transform;
      }
    }
  }, {
    key: "handleTransitionEnd",
    value: function handleTransitionEnd() {
      if (!this.props.onTransitionEnd) {
        return;
      } // Filters out when changing the children


      if (this.state.displaySameSlide) {
        return;
      } // The rest callback is triggered when swiping. It's just noise.
      // We filter it out.


      if (!this.state.isDragging) {
        this.props.onTransitionEnd();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props2 = this.props,
          action = _this$props2.action,
          animateHeight = _this$props2.animateHeight,
          animateTransitions = _this$props2.animateTransitions,
          axis = _this$props2.axis,
          children = _this$props2.children,
          containerStyleProp = _this$props2.containerStyle,
          disabled = _this$props2.disabled,
          disableLazyLoading = _this$props2.disableLazyLoading,
          enableMouseEvents = _this$props2.enableMouseEvents,
          hysteresis = _this$props2.hysteresis,
          ignoreNativeScroll = _this$props2.ignoreNativeScroll,
          index = _this$props2.index,
          onChangeIndex = _this$props2.onChangeIndex,
          onSwitching = _this$props2.onSwitching,
          onTransitionEnd = _this$props2.onTransitionEnd,
          resistance = _this$props2.resistance,
          slideStyleProp = _this$props2.slideStyle,
          slideClassName = _this$props2.slideClassName,
          springConfig = _this$props2.springConfig,
          style = _this$props2.style,
          threshold = _this$props2.threshold,
          other = (0, _objectWithoutProperties2.default)(_this$props2, ["action", "animateHeight", "animateTransitions", "axis", "children", "containerStyle", "disabled", "disableLazyLoading", "enableMouseEvents", "hysteresis", "ignoreNativeScroll", "index", "onChangeIndex", "onSwitching", "onTransitionEnd", "resistance", "slideStyle", "slideClassName", "springConfig", "style", "threshold"]);
      var _this$state = this.state,
          displaySameSlide = _this$state.displaySameSlide,
          heightLatest = _this$state.heightLatest,
          indexLatest = _this$state.indexLatest,
          isDragging = _this$state.isDragging,
          renderOnlyActive = _this$state.renderOnlyActive;
      var touchEvents = !disabled ? {
        onTouchStart: this.handleTouchStart,
        onTouchEnd: this.handleTouchEnd
      } : {};
      var mouseEvents = !disabled && enableMouseEvents ? {
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        onMouseLeave: this.handleMouseLeave,
        onMouseMove: this.handleMouseMove
      } : {}; // There is no point to animate if we are already providing a height.

       true ? (0, _warning.default)(!animateHeight || !containerStyleProp || !containerStyleProp.height, "react-swipeable-view: You are setting animateHeight to true but you are\nalso providing a custom height.\nThe custom height has a higher priority than the animateHeight property.\nSo animateHeight is most likely having no effect at all.") : 0;
      var slideStyle = (0, _extends2.default)({}, styles.slide, slideStyleProp);
      var transition;
      var WebkitTransition;

      if (isDragging || !animateTransitions || displaySameSlide) {
        transition = 'all 0s ease 0s';
        WebkitTransition = 'all 0s ease 0s';
      } else {
        transition = createTransition('transform', springConfig);
        WebkitTransition = createTransition('-webkit-transform', springConfig);

        if (heightLatest !== 0) {
          var additionalTranstion = ", ".concat(createTransition('height', springConfig));
          transition += additionalTranstion;
          WebkitTransition += additionalTranstion;
        }
      }

      var containerStyle = {
        height: null,
        WebkitFlexDirection: axisProperties.flexDirection[axis],
        flexDirection: axisProperties.flexDirection[axis],
        WebkitTransition: WebkitTransition,
        transition: transition
      }; // Apply the styles for SSR considerations

      if (!renderOnlyActive) {
        var transform = axisProperties.transform[axis](this.indexCurrent * 100);
        containerStyle.WebkitTransform = transform;
        containerStyle.transform = transform;
      }

      if (animateHeight) {
        containerStyle.height = heightLatest;
      }

      return React.createElement(SwipeableViewsContext.Provider, {
        value: this.getSwipeableViewsContext()
      }, React.createElement("div", (0, _extends2.default)({
        ref: this.setRootNode,
        style: (0, _extends2.default)({}, axisProperties.root[axis], style)
      }, other, touchEvents, mouseEvents, {
        onScroll: this.handleScroll
      }), React.createElement("div", {
        ref: this.setContainerNode,
        style: (0, _extends2.default)({}, containerStyle, styles.container, containerStyleProp),
        className: "react-swipeable-view-container"
      }, React.Children.map(children, function (child, indexChild) {
        if (renderOnlyActive && indexChild !== indexLatest) {
          return null;
        }

         true ? (0, _warning.default)(React.isValidElement(child), "react-swipeable-view: one of the children provided is invalid: ".concat(child, ".\n  We are expecting a valid React Element")) : 0;
        var ref;
        var hidden = true;

        if (indexChild === indexLatest) {
          hidden = false;

          if (animateHeight) {
            ref = _this4.setActiveSlide;
            slideStyle.overflowY = 'hidden';
          }
        }

        return React.createElement("div", {
          ref: ref,
          style: slideStyle,
          className: slideClassName,
          "aria-hidden": hidden,
          "data-swipeable": "true"
        }, child);
      }))));
    }
  }]);
  return SwipeableViews;
}(React.Component); // Added as an ads for people using the React dev tools in production.
// So they know, the tool used to build the awesome UI they
// are looking at/retro engineering.


SwipeableViews.displayName = 'ReactSwipableView';
SwipeableViews.defaultProps = {
  animateHeight: false,
  animateTransitions: true,
  axis: 'x',
  disabled: false,
  disableLazyLoading: false,
  enableMouseEvents: false,
  hysteresis: 0.6,
  ignoreNativeScroll: false,
  index: 0,
  threshold: 5,
  springConfig: {
    duration: '0.35s',
    easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
    delay: '0s'
  },
  resistance: false
};
var _default = SwipeableViews;
exports["default"] = _default;

/***/ }),

/***/ 1452:
/*!*********************************************************!*\
  !*** ./node_modules/react-swipeable-views/lib/index.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(/*! @babel/runtime/helpers/interopRequireWildcard */ 397);

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "default", ({
  enumerable: true,
  get: function get() {
    return _SwipeableViews.default;
  }
}));
Object.defineProperty(exports, "SwipeableViewsContext", ({
  enumerable: true,
  get: function get() {
    return _SwipeableViews.SwipeableViewsContext;
  }
}));

var _SwipeableViews = _interopRequireWildcard(__webpack_require__(/*! ./SwipeableViews */ 1258));

/***/ }),

/***/ 1285:
/*!******************************************************************************************!*\
  !*** ./node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.esm.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ 1220);
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutPropertiesLoose */ 1221);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var use_latest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! use-latest */ 1342);
/* harmony import */ var use_composed_ref__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! use-composed-ref */ 1344);





var HIDDEN_TEXTAREA_STYLE = {
  'min-height': '0',
  'max-height': 'none',
  height: '0',
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0'
};

var forceHiddenStyles = function forceHiddenStyles(node) {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(function (key) {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], 'important');
  });
}; //   export type CalculatedNodeHeights = [height: number, rowHeight: number];
// https://github.com/microsoft/TypeScript/issues/28259


var hiddenTextarea = null;

var getHeight = function getHeight(node, sizingData) {
  var height = node.scrollHeight;

  if (sizingData.sizingStyle.boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize;
  } // remove padding, since height = content


  return height - sizingData.paddingSize;
};

function calculateNodeHeight(sizingData, value, minRows, maxRows) {
  if (minRows === void 0) {
    minRows = 1;
  }

  if (maxRows === void 0) {
    maxRows = Infinity;
  }

  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.setAttribute('tabindex', '-1');
    hiddenTextarea.setAttribute('aria-hidden', 'true');
    forceHiddenStyles(hiddenTextarea);
  }

  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea);
  }

  var paddingSize = sizingData.paddingSize,
      borderSize = sizingData.borderSize,
      sizingStyle = sizingData.sizingStyle;
  var boxSizing = sizingStyle.boxSizing;
  Object.keys(sizingStyle).forEach(function (_key) {
    var key = _key;
    hiddenTextarea.style[key] = sizingStyle[key];
  });
  forceHiddenStyles(hiddenTextarea);
  hiddenTextarea.value = value;
  var height = getHeight(hiddenTextarea, sizingData); // measure height of a textarea with a single row

  hiddenTextarea.value = 'x';
  var rowHeight = hiddenTextarea.scrollHeight - paddingSize;
  var minHeight = rowHeight * minRows;

  if (boxSizing === 'border-box') {
    minHeight = minHeight + paddingSize + borderSize;
  }

  height = Math.max(minHeight, height);
  var maxHeight = rowHeight * maxRows;

  if (boxSizing === 'border-box') {
    maxHeight = maxHeight + paddingSize + borderSize;
  }

  height = Math.min(maxHeight, height);
  return [height, rowHeight];
}

var noop = function noop() {};

var pick = function pick(props, obj) {
  return props.reduce(function (acc, prop) {
    acc[prop] = obj[prop];
    return acc;
  }, {});
};

var SIZING_STYLE = ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'boxSizing', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', // non-standard
'tabSize', 'textIndent', // non-standard
'textRendering', 'textTransform', 'width', 'wordBreak'];
var isIE = !!document.documentElement.currentStyle;

var getSizingData = function getSizingData(node) {
  var style = window.getComputedStyle(node);

  if (style === null) {
    return null;
  }

  var sizingStyle = pick(SIZING_STYLE, style);
  var boxSizing = sizingStyle.boxSizing; // probably node is detached from DOM, can't read computed dimensions

  if (boxSizing === '') {
    return null;
  } // IE (Edge has already correct behaviour) returns content width as computed width
  // so we need to add manually padding and border widths


  if (isIE && boxSizing === 'border-box') {
    sizingStyle.width = parseFloat(sizingStyle.width) + parseFloat(sizingStyle.borderRightWidth) + parseFloat(sizingStyle.borderLeftWidth) + parseFloat(sizingStyle.paddingRight) + parseFloat(sizingStyle.paddingLeft) + 'px';
  }

  var paddingSize = parseFloat(sizingStyle.paddingBottom) + parseFloat(sizingStyle.paddingTop);
  var borderSize = parseFloat(sizingStyle.borderBottomWidth) + parseFloat(sizingStyle.borderTopWidth);
  return {
    sizingStyle: sizingStyle,
    paddingSize: paddingSize,
    borderSize: borderSize
  };
};

var useWindowResizeListener = function useWindowResizeListener(listener) {
  var latestListener = (0,use_latest__WEBPACK_IMPORTED_MODULE_3__["default"])(listener);
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect)(function () {
    var handler = function handler(event) {
      latestListener.current(event);
    };

    window.addEventListener('resize', handler);
    return function () {
      window.removeEventListener('resize', handler);
    };
  }, []);
};

var TextareaAutosize = function TextareaAutosize(_ref, userRef) {
  var cacheMeasurements = _ref.cacheMeasurements,
      maxRows = _ref.maxRows,
      minRows = _ref.minRows,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? noop : _ref$onChange,
      _ref$onHeightChange = _ref.onHeightChange,
      onHeightChange = _ref$onHeightChange === void 0 ? noop : _ref$onHeightChange,
      props = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"]);

  if ( true && props.style) {
    if ('maxHeight' in props.style) {
      throw new Error('Using `style.maxHeight` for <TextareaAutosize/> is not supported. Please use `maxRows`.');
    }

    if ('minHeight' in props.style) {
      throw new Error('Using `style.minHeight` for <TextareaAutosize/> is not supported. Please use `minRows`.');
    }
  }

  var isControlled = props.value !== undefined;
  var libRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
  var ref = (0,use_composed_ref__WEBPACK_IMPORTED_MODULE_4__["default"])(libRef, userRef);
  var heightRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(0);
  var measurementsCacheRef = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)();

  var resizeTextarea = function resizeTextarea() {
    var node = libRef.current;
    var nodeSizingData = cacheMeasurements && measurementsCacheRef.current ? measurementsCacheRef.current : getSizingData(node);

    if (!nodeSizingData) {
      return;
    }

    measurementsCacheRef.current = nodeSizingData;

    var _calculateNodeHeight = calculateNodeHeight(nodeSizingData, node.value || node.placeholder || 'x', minRows, maxRows),
        height = _calculateNodeHeight[0],
        rowHeight = _calculateNodeHeight[1];

    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty('height', height + "px", 'important');
      onHeightChange(height, {
        rowHeight: rowHeight
      });
    }
  };

  var handleChange = function handleChange(event) {
    if (!isControlled) {
      resizeTextarea();
    }

    onChange(event);
  };

  {
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect)(resizeTextarea);
    useWindowResizeListener(resizeTextarea);
  }
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_2__.createElement)("textarea", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props, {
    onChange: handleChange,
    ref: ref
  }));
};

var index = /* #__PURE__ */(0,react__WEBPACK_IMPORTED_MODULE_2__.forwardRef)(TextareaAutosize);
/* harmony default export */ __webpack_exports__["default"] = (index);

/***/ }),

/***/ 842:
/*!*****************************************************!*\
  !*** ./node_modules/react-virtuoso/dist/index.m.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GroupedVirtuoso": function() { return /* binding */ an; },
/* harmony export */   "LogLevel": function() { return /* binding */ p; },
/* harmony export */   "TableVirtuoso": function() { return /* binding */ ln; },
/* harmony export */   "Virtuoso": function() { return /* binding */ on; },
/* harmony export */   "VirtuosoGrid": function() { return /* binding */ sn; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _virtuoso_dev_react_urx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @virtuoso.dev/react-urx */ 1446);
/* harmony import */ var _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @virtuoso.dev/urx */ 781);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ 32);







function u() {
  return u = Object.assign || function (t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];

      for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
    }

    return t;
  }, u.apply(this, arguments);
}

function c(t, e) {
  if (null == t) return {};
  var n,
      r,
      o = {},
      i = Object.keys(t);

  for (r = 0; r < i.length; r++) e.indexOf(n = i[r]) >= 0 || (o[n] = t[n]);

  return o;
}

function m(t, e) {
  (null == e || e > t.length) && (e = t.length);

  for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];

  return r;
}

function d(t, e) {
  var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
  if (n) return (n = n.call(t)).next.bind(n);

  if (Array.isArray(t) || (n = function (t, e) {
    if (t) {
      if ("string" == typeof t) return m(t, e);
      var n = Object.prototype.toString.call(t).slice(8, -1);
      return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? m(t, e) : void 0;
    }
  }(t)) || e && t && "number" == typeof t.length) {
    n && (t = n);
    var r = 0;
    return function () {
      return r >= t.length ? {
        done: !0
      } : {
        done: !1,
        value: t[r++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var f,
    p,
    h = "undefined" != typeof document ? react__WEBPACK_IMPORTED_MODULE_1__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_1__.useEffect;
!function (t) {
  t[t.DEBUG = 0] = "DEBUG", t[t.INFO = 1] = "INFO", t[t.WARN = 2] = "WARN", t[t.ERROR = 3] = "ERROR";
}(p || (p = {}));
var g = ((f = {})[p.DEBUG] = "debug", f[p.INFO] = "log", f[p.WARN] = "warn", f[p.ERROR] = "error", f),
    v = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function () {
  var t = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(p.ERROR);
  return {
    log: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(function (n, r, o) {
      var i;
      void 0 === o && (o = p.INFO), o >= (null != (i = ("undefined" == typeof globalThis ? window : globalThis).VIRTUOSO_LOG_LEVEL) ? i : _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(t)) && console[g[o]]("%creact-virtuoso: %c%s %o", "color: #0253b3; font-weight: bold", "color: initial", n, r);
    }),
    logLevel: t
  };
}, [], {
  singleton: !0
});

function S(t, e) {
  void 0 === e && (e = !0);

  var n = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
      r = function (t) {};

  if ("undefined" != typeof ResizeObserver) {
    var o = new ResizeObserver(function (e) {
      var n = e[0].target;
      null !== n.offsetParent && t(n);
    });

    r = function (t) {
      t && e ? (o.observe(t), n.current = t) : (n.current && o.unobserve(n.current), n.current = null);
    };
  }

  return {
    ref: n,
    callbackRef: r
  };
}

function I(t, e) {
  return void 0 === e && (e = !0), S(t, e).callbackRef;
}

function C(t, e, n, r, o, i, a) {
  return S(function (n) {
    for (var l = function (t, e, n, r) {
      var o = t.length;
      if (0 === o) return null;

      for (var i = [], a = 0; a < o; a++) {
        var l = t.item(a);

        if (l && void 0 !== l.dataset.index) {
          var s = parseInt(l.dataset.index),
              u = parseFloat(l.dataset.knownSize),
              c = e(l, "offsetHeight");

          if (0 === c && r("Zero-sized element, this should not happen", {
            child: l
          }, p.ERROR), c !== u) {
            var m = i[i.length - 1];
            0 === i.length || m.size !== c || m.endIndex !== s - 1 ? i.push({
              startIndex: s,
              endIndex: s,
              size: c
            }) : i[i.length - 1].endIndex++;
          }
        }
      }

      return i;
    }(n.children, e, 0, o), s = n.parentElement; !s.dataset.virtuosoScroller;) s = s.parentElement;

    var u = a ? a.scrollTop : "window" === s.firstElementChild.dataset.viewportType ? window.pageYOffset || document.documentElement.scrollTop : s.scrollTop;
    r({
      scrollTop: Math.max(u, 0),
      scrollHeight: (null != a ? a : s).scrollHeight,
      viewportHeight: (null != a ? a : s).offsetHeight
    }), null == i || i(function (t, e, n) {
      return "normal" === e || e.endsWith("px") || n("row-gap was not resolved to pixel value correctly", e, p.WARN), "normal" === e ? 0 : parseInt(e, 10);
    }(0, getComputedStyle(n).rowGap, o)), null !== l && t(l);
  }, n);
}

function T(t, e) {
  return Math.round(t.getBoundingClientRect()[e]);
}

function w(t, e) {
  return Math.abs(t - e) < 1.01;
}

function x(t, n, r, l, u) {
  void 0 === l && (l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.noop);
  var c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
      m = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
      d = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
      f = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(!1),
      p = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function (e) {
    var r = e.target,
        o = r === window || r === document,
        i = o ? window.pageYOffset || document.documentElement.scrollTop : r.scrollTop,
        a = o ? document.documentElement.scrollHeight : r.scrollHeight,
        l = o ? window.innerHeight : r.offsetHeight,
        u = function () {
      t({
        scrollTop: Math.max(i, 0),
        scrollHeight: a,
        viewportHeight: l
      });
    };

    f.current ? (0,react_dom__WEBPACK_IMPORTED_MODULE_2__.flushSync)(u) : u(), f.current = !1, null !== m.current && (i === m.current || i <= 0 || i === a - l) && (m.current = null, n(!0), d.current && (clearTimeout(d.current), d.current = null));
  }, [t, n]);
  return (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    var t = u || c.current;
    return l(u || c.current), p({
      target: t
    }), t.addEventListener("scroll", p, {
      passive: !0
    }), function () {
      l(null), t.removeEventListener("scroll", p);
    };
  }, [c, p, r, l, u]), {
    scrollerRef: c,
    scrollByCallback: function (t) {
      f.current = !0, c.current.scrollBy(t);
    },
    scrollToCallback: function (e) {
      var r = c.current;

      if (r && (!("offsetHeight" in r) || 0 !== r.offsetHeight)) {
        var o,
            i,
            a,
            l = "smooth" === e.behavior;
        if (r === window ? (i = Math.max(T(document.documentElement, "height"), document.documentElement.scrollHeight), o = window.innerHeight, a = document.documentElement.scrollTop) : (i = r.scrollHeight, o = T(r, "height"), a = r.scrollTop), e.top = Math.ceil(Math.max(Math.min(i - o, e.top), 0)), w(o, i) || e.top === a) return t({
          scrollTop: a,
          scrollHeight: i,
          viewportHeight: o
        }), void (l && n(!0));
        l ? (m.current = e.top, d.current && clearTimeout(d.current), d.current = setTimeout(function () {
          d.current = null, m.current = null, n(!0);
        }, 1e3)) : m.current = null, r.scrollTo(e);
      }
    }
  };
}

var b = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function () {
  var t = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      n = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      a = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      s = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      u = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      c = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      m = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      d = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      f = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1),
      p = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(t, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.scrollTop;
  })), n), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(t, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.scrollHeight;
  })), l), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(n, i), {
    scrollContainerState: t,
    scrollTop: n,
    viewportHeight: a,
    headerHeight: s,
    fixedHeaderHeight: u,
    footerHeight: c,
    scrollHeight: l,
    smoothScrollTargetReached: o,
    react18ConcurrentRendering: p,
    scrollTo: m,
    scrollBy: d,
    statefulScrollTop: i,
    deviation: r,
    scrollingInProgress: f
  };
}, [], {
  singleton: !0
}),
    y = {
  lvl: 0
};

function E(t, e, n, r, o) {
  return void 0 === r && (r = y), void 0 === o && (o = y), {
    k: t,
    v: e,
    lvl: n,
    l: r,
    r: o
  };
}

function H(t) {
  return t === y;
}

function R() {
  return y;
}

function L(t, e) {
  if (H(t)) return y;
  var n = t.k,
      r = t.l,
      o = t.r;

  if (e === n) {
    if (H(r)) return o;
    if (H(o)) return r;
    var i = P(r);
    return U(M(t, {
      k: i[0],
      v: i[1],
      l: O(r)
    }));
  }

  return U(M(t, e < n ? {
    l: L(r, e)
  } : {
    r: L(o, e)
  }));
}

function k(t, e, n) {
  if (void 0 === n && (n = "k"), H(t)) return [-Infinity, void 0];
  if (t[n] === e) return [t.k, t.v];

  if (t[n] < e) {
    var r = k(t.r, e, n);
    return -Infinity === r[0] ? [t.k, t.v] : r;
  }

  return k(t.l, e, n);
}

function z(t, e, n) {
  return H(t) ? E(e, n, 1) : e === t.k ? M(t, {
    k: e,
    v: n
  }) : function (t) {
    return N(D(t));
  }(M(t, e < t.k ? {
    l: z(t.l, e, n)
  } : {
    r: z(t.r, e, n)
  }));
}

function B(t, e, n) {
  if (H(t)) return [];
  var r = t.k,
      o = t.v,
      i = t.r,
      a = [];
  return r > e && (a = a.concat(B(t.l, e, n))), r >= e && r <= n && a.push({
    k: r,
    v: o
  }), r <= n && (a = a.concat(B(i, e, n))), a;
}

function F(t) {
  return H(t) ? [] : [].concat(F(t.l), [{
    k: t.k,
    v: t.v
  }], F(t.r));
}

function P(t) {
  return H(t.r) ? [t.k, t.v] : P(t.r);
}

function O(t) {
  return H(t.r) ? t.l : U(M(t, {
    r: O(t.r)
  }));
}

function M(t, e) {
  return E(void 0 !== e.k ? e.k : t.k, void 0 !== e.v ? e.v : t.v, void 0 !== e.lvl ? e.lvl : t.lvl, void 0 !== e.l ? e.l : t.l, void 0 !== e.r ? e.r : t.r);
}

function V(t) {
  return H(t) || t.lvl > t.r.lvl;
}

function U(t) {
  var e = t.l,
      n = t.r,
      r = t.lvl;
  if (n.lvl >= r - 1 && e.lvl >= r - 1) return t;

  if (r > n.lvl + 1) {
    if (V(e)) return D(M(t, {
      lvl: r - 1
    }));
    if (H(e) || H(e.r)) throw new Error("Unexpected empty nodes");
    return M(e.r, {
      l: M(e, {
        r: e.r.l
      }),
      r: M(t, {
        l: e.r.r,
        lvl: r - 1
      }),
      lvl: r
    });
  }

  if (V(t)) return N(M(t, {
    lvl: r - 1
  }));
  if (H(n) || H(n.l)) throw new Error("Unexpected empty nodes");
  var o = n.l,
      i = V(o) ? n.lvl - 1 : n.lvl;
  return M(o, {
    l: M(t, {
      r: o.l,
      lvl: r - 1
    }),
    r: N(M(n, {
      l: o.r,
      lvl: i
    })),
    lvl: o.lvl + 1
  });
}

function A(t, e, n) {
  return H(t) ? [] : W(B(t, k(t, e)[0], n), function (t) {
    return {
      index: t.k,
      value: t.v
    };
  });
}

function W(t, e) {
  var n = t.length;
  if (0 === n) return [];

  for (var r = e(t[0]), o = r.index, i = r.value, a = [], l = 1; l < n; l++) {
    var s = e(t[l]),
        u = s.index,
        c = s.value;
    a.push({
      start: o,
      end: u - 1,
      value: i
    }), o = u, i = c;
  }

  return a.push({
    start: o,
    end: Infinity,
    value: i
  }), a;
}

function N(t) {
  var e = t.r,
      n = t.lvl;
  return H(e) || H(e.r) || e.lvl !== n || e.r.lvl !== n ? t : M(e, {
    l: M(t, {
      r: e.l
    }),
    lvl: n + 1
  });
}

function D(t) {
  var e = t.l;
  return H(e) || e.lvl !== t.lvl ? t : M(e, {
    r: M(t, {
      l: e.r
    })
  });
}

function G(t, e, n, r) {
  void 0 === r && (r = 0);

  for (var o = t.length - 1; r <= o;) {
    var i = Math.floor((r + o) / 2),
        a = n(t[i], e);
    if (0 === a) return i;

    if (-1 === a) {
      if (o - r < 2) return i - 1;
      o = i - 1;
    } else {
      if (o === r) return i;
      r = i + 1;
    }
  }

  throw new Error("Failed binary finding record in array - " + t.join(",") + ", searched for " + e);
}

function _(t, e, n) {
  return t[G(t, e, n)];
}

var j = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function () {
  return {
    recalcInProgress: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1)
  };
}, [], {
  singleton: !0
});

function K(t) {
  var e = t.size,
      n = t.startIndex,
      r = t.endIndex;
  return function (t) {
    return t.start === n && (t.end === r || Infinity === t.end) && t.value === e;
  };
}

function Y(t, e) {
  var n = t.index;
  return e === n ? 0 : e < n ? -1 : 1;
}

function q(t, e) {
  var n = t.offset;
  return e === n ? 0 : e < n ? -1 : 1;
}

function Z(t) {
  return {
    index: t.index,
    value: t
  };
}

function J(t, e, n, r) {
  var o = t,
      i = 0,
      a = 0,
      l = 0,
      s = 0;

  if (0 !== e) {
    l = o[s = G(o, e - 1, Y)].offset;
    var u = k(n, e - 1);
    i = u[0], a = u[1], o.length && o[s].size === k(n, e)[1] && (s -= 1), o = o.slice(0, s + 1);
  } else o = [];

  for (var c, m = d(A(n, e, Infinity)); !(c = m()).done;) {
    var f = c.value,
        p = f.start,
        h = f.value,
        g = p - i,
        v = g * a + l + g * r;
    o.push({
      offset: v,
      size: h,
      index: p
    }), i = p, l = v, a = h;
  }

  return {
    offsetTree: o,
    lastIndex: i,
    lastOffset: l,
    lastSize: a
  };
}

function $(t, e) {
  var n = e[0],
      r = e[1],
      o = e[3];
  n.length > 0 && (0, e[2])("received item sizes", n, p.DEBUG);
  var i = t.sizeTree,
      a = i,
      l = 0;

  if (r.length > 0 && H(i) && 2 === n.length) {
    var s = n[0].size,
        u = n[1].size;
    a = r.reduce(function (t, e) {
      return z(z(t, e, s), e + 1, u);
    }, a);
  } else {
    var c = function (t, e) {
      for (var n, r = H(t) ? 0 : Infinity, o = d(e); !(n = o()).done;) {
        var i = n.value,
            a = i.size,
            l = i.startIndex,
            s = i.endIndex;
        if (r = Math.min(r, l), H(t)) t = z(t, 0, a);else {
          var u = A(t, l - 1, s + 1);

          if (!u.some(K(i))) {
            for (var c, m = !1, f = !1, p = d(u); !(c = p()).done;) {
              var h = c.value,
                  g = h.start,
                  v = h.end,
                  S = h.value;
              m ? (s >= g || a === S) && (t = L(t, g)) : (f = S !== a, m = !0), v > s && s >= g && S !== a && (t = z(t, s + 1, S));
            }

            f && (t = z(t, l, a));
          }
        }
      }

      return [t, r];
    }(a, n);

    a = c[0], l = c[1];
  }

  if (a === i) return t;
  var m = J(t.offsetTree, l, a, o),
      f = m.offsetTree;
  return {
    sizeTree: a,
    offsetTree: f,
    lastIndex: m.lastIndex,
    lastOffset: m.lastOffset,
    lastSize: m.lastSize,
    groupOffsetTree: r.reduce(function (t, e) {
      return z(t, e, Q(e, f, o));
    }, R()),
    groupIndices: r
  };
}

function Q(t, e, n) {
  if (0 === e.length) return 0;

  var r = _(e, t, Y),
      o = t - r.index,
      i = r.size * o + (o - 1) * n + r.offset;

  return i > 0 ? i + n : i;
}

function X(t, e, n) {
  if (function (t) {
    return void 0 !== t.groupIndex;
  }(t)) return e.groupIndices[t.groupIndex] + 1;
  var r = tt("LAST" === t.index ? n : t.index, e);
  return Math.max(0, r, Math.min(n, r));
}

function tt(t, e) {
  if (!et(e)) return t;

  for (var n = 0; e.groupIndices[n] <= t + n;) n++;

  return t + n;
}

function et(t) {
  return !H(t.groupOffsetTree);
}

var nt = {
  offsetHeight: "height",
  offsetWidth: "width"
},
    rt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0].log,
      r = t[1].recalcInProgress,
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      a = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(i, 0),
      l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      s = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      c = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      m = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream([]),
      d = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(void 0),
      f = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(void 0),
      h = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(function (t, e) {
    return T(t, nt[e]);
  }),
      g = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(void 0),
      v = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      S = {
    offsetTree: [],
    sizeTree: R(),
    groupOffsetTree: R(),
    lastIndex: 0,
    lastOffset: 0,
    lastSize: 0,
    groupIndices: []
  },
      I = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(o, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(m, n, v), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan($, S), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), S);
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(m, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t.length > 0;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(I, v), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = t[1],
        r = t[2],
        o = e.reduce(function (t, e, o) {
      return z(t, e, Q(e, n.offsetTree, r) || o);
    }, R());
    return u({}, n, {
      groupIndices: e,
      groupOffsetTree: o
    });
  })), I), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(i, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(I), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t[0] < t[1].lastIndex;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[1];
    return [{
      startIndex: t[0],
      endIndex: e.lastIndex,
      size: e.lastSize
    }];
  })), o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(d, f);
  var C = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(d, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return void 0 === t;
  })), !0);
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(f, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return void 0 !== t && H(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(I).sizeTree);
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return [{
      startIndex: 0,
      endIndex: 0,
      size: t
    }];
  })), o);
  var w = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(o, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(I), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, e) {
    var n = e[1];
    return {
      changed: n !== t.sizes,
      sizes: n
    };
  }, {
    changed: !1,
    sizes: S
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.changed;
  })));
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(c, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, e) {
    return {
      diff: t.prev - e,
      prev: e
    };
  }, {
    diff: 0,
    prev: 0
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.diff;
  })), function (t) {
    t > 0 ? (_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(r, !0), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(l, t)) : t < 0 && _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(s, t);
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(c, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(n)), function (t) {
    t[0] < 0 && (0, t[1])("`firstItemIndex` prop should not be set to less than zero. If you don't know the total count, just use a very high value", {
      firstItemIndex: c
    }, p.ERROR);
  });
  var x = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(l);
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(l, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(I), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = t[1];
    if (n.groupIndices.length > 0) throw new Error("Virtuoso: prepending items does not work with groups");
    return F(n.sizeTree).reduce(function (t, n) {
      var r = n.k,
          o = n.v;
      return {
        ranges: [].concat(t.ranges, [{
          startIndex: t.prevIndex,
          endIndex: r + e - 1,
          size: t.prevSize
        }]),
        prevIndex: r + e,
        prevSize: o
      };
    }, {
      ranges: [],
      prevIndex: 0,
      prevSize: n.lastSize
    }).ranges;
  })), o);
  var b = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(s, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(I, v), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return Q(-t[0], t[1].offsetTree, t[2]);
  })));
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(s, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(I, v), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = t[1],
        r = t[2];
    if (n.groupIndices.length > 0) throw new Error("Virtuoso: shifting items does not work with groups");
    var o = F(n.sizeTree).reduce(function (t, n) {
      var r = n.v;
      return z(t, Math.max(0, n.k + e), r);
    }, R());
    return u({}, n, {
      sizeTree: o
    }, J(n.offsetTree, 0, o, r));
  })), I), {
    data: g,
    totalCount: i,
    sizeRanges: o,
    groupIndices: m,
    defaultItemSize: f,
    fixedItemSize: d,
    unshiftWith: l,
    shiftWith: s,
    shiftWithOffset: b,
    beforeUnshiftWith: x,
    firstItemIndex: c,
    gap: v,
    sizes: I,
    listRefresh: w,
    statefulTotalCount: a,
    trackItemSizes: C,
    itemSize: h
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(v, j), {
  singleton: !0
}),
    ot = "undefined" != typeof document && "scrollBehavior" in document.documentElement.style;

function it(t) {
  var e = "number" == typeof t ? {
    index: t
  } : t;
  return e.align || (e.align = "start"), e.behavior && ot || (e.behavior = "auto"), e.offset || (e.offset = 0), e;
}

var at = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.sizes,
      o = n.totalCount,
      i = n.listRefresh,
      a = n.gap,
      l = t[1],
      s = l.scrollingInProgress,
      u = l.viewportHeight,
      c = l.scrollTo,
      m = l.smoothScrollTargetReached,
      d = l.headerHeight,
      f = l.footerHeight,
      h = t[2].log,
      g = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      v = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      S = null,
      I = null,
      C = null;

  function T() {
    S && (S(), S = null), C && (C(), C = null), I && (clearTimeout(I), I = null), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(s, !1);
  }

  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(g, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(r, u, o, v, d, f, h), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(a), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var n = t[0],
        r = n[0],
        o = n[1],
        a = n[2],
        l = n[3],
        u = n[4],
        c = n[5],
        d = n[6],
        f = n[7],
        h = t[1],
        v = it(r),
        w = v.align,
        x = v.behavior,
        b = v.offset,
        y = l - 1,
        E = X(v, o, y),
        H = Q(E, o.offsetTree, h) + c;
    "end" === w ? (H = H - a + k(o.sizeTree, E)[1], E === y && (H += d)) : "center" === w ? H = H - a / 2 + k(o.sizeTree, E)[1] / 2 : H -= u, b && (H += b);

    var R = function (t) {
      T(), t ? (f("retrying to scroll to", {
        location: r
      }, p.DEBUG), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(g, r)) : f("list did not change, scroll successful", {}, p.DEBUG);
    };

    if (T(), "smooth" === x) {
      var L = !1;
      C = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(i, function (t) {
        L = L || t;
      }), S = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.handleNext(m, function () {
        R(L);
      });
    } else S = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.handleNext(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(i, function (t) {
      var e = setTimeout(function () {
        t(!1);
      }, 150);
      return function (n) {
        n && (t(!0), clearTimeout(e));
      };
    }), R);

    return I = setTimeout(function () {
      T();
    }, 1200), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(s, !0), f("scrolling from index to", {
      index: E,
      top: H,
      behavior: x
    }, p.DEBUG), {
      top: H,
      behavior: x
    };
  })), c), {
    scrollToIndex: g,
    topListHeight: v
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, b, v), {
  singleton: !0
}),
    lt = "up",
    st = {
  atBottom: !1,
  notAtBottomBecause: "NOT_SHOWING_LAST_ITEM",
  state: {
    offsetBottom: 0,
    scrollTop: 0,
    viewportHeight: 0,
    scrollHeight: 0
  }
},
    ut = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.scrollContainerState,
      o = n.scrollTop,
      i = n.viewportHeight,
      a = n.headerHeight,
      l = n.footerHeight,
      s = n.scrollBy,
      u = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1),
      c = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!0),
      m = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      d = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      f = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(4),
      p = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      h = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.merge(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.skip(1), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo(!0)), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.skip(1), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo(!1), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.debounceTime(100))), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), !1),
      g = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.merge(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(s, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo(!0)), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(s, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo(!1), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.debounceTime(200))), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), !1);
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(p)), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t[0] <= t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), c), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(c, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.throttleTime(50)), d);
  var v = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(a), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(l), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(f)), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, e) {
    var n,
        r,
        o = e[0],
        i = o.scrollTop,
        a = o.scrollHeight,
        l = e[1],
        s = {
      viewportHeight: l,
      scrollTop: i,
      scrollHeight: a
    };
    return i + l - a > -e[4] ? (i > t.state.scrollTop ? (n = "SCROLLED_DOWN", r = t.state.scrollTop - i) : (n = "SIZE_DECREASED", r = t.state.scrollTop - i || t.scrollTopDelta), {
      atBottom: !0,
      state: s,
      atBottomBecause: n,
      scrollTopDelta: r
    }) : {
      atBottom: !1,
      notAtBottomBecause: s.scrollHeight > t.state.scrollHeight ? "SIZE_INCREASED" : l < t.state.viewportHeight ? "VIEWPORT_HEIGHT_DECREASING" : i < t.state.scrollTop ? "SCROLLING_UPWARDS" : "NOT_FULLY_SCROLLED_TO_LAST_ITEM_BOTTOM",
      state: s
    };
  }, st), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(function (t, e) {
    return t && t.atBottom === e.atBottom;
  }))),
      S = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, e) {
    var n = e.scrollTop,
        r = e.scrollHeight,
        o = e.viewportHeight;
    return w(t.scrollHeight, r) ? {
      scrollTop: n,
      scrollHeight: r,
      jump: 0,
      changed: !1
    } : t.scrollTop !== n && r - (n + o) < 1 ? {
      scrollHeight: r,
      scrollTop: n,
      jump: t.scrollTop - n,
      changed: !0
    } : {
      scrollHeight: r,
      scrollTop: n,
      jump: 0,
      changed: !0
    };
  }, {
    scrollHeight: 0,
    jump: 0,
    scrollTop: 0,
    changed: !1
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t.changed;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.jump;
  })), 0);
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(v, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.atBottom;
  })), u), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(u, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.throttleTime(50)), m);
  var I = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream("down");
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.scrollTop;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, n) {
    return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(g) ? {
      direction: t.direction,
      prevScrollTop: n
    } : {
      direction: n < t.prevScrollTop ? lt : "down",
      prevScrollTop: n
    };
  }, {
    direction: "down",
    prevScrollTop: 0
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.direction;
  })), I), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.throttleTime(50), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo("none")), I);
  var C = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(h, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return !t;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo(0)), C), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(o, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.throttleTime(100), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(h), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return !!t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, e) {
    return [t[1], e[0]];
  }, [0, 0]), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t[1] - t[0];
  })), C), {
    isScrolling: h,
    isAtTop: c,
    isAtBottom: u,
    atBottomState: v,
    atTopStateChange: d,
    atBottomStateChange: m,
    scrollDirection: I,
    atBottomThreshold: f,
    atTopThreshold: p,
    scrollVelocity: C,
    lastJumpDueToItemResize: S
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(b)),
    ct = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0].log,
      r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1),
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()));
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(r, function (t) {
    t && _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(n)("props updated", {}, p.DEBUG);
  }), {
    propsReady: r,
    didMount: o
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(v), {
  singleton: !0
}),
    mt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.sizes,
      o = n.listRefresh,
      i = n.defaultItemSize,
      a = t[1].scrollTop,
      l = t[2].scrollToIndex,
      s = t[3].didMount,
      u = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!0),
      c = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(s, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(c), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return !!t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo(!1)), u), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(o, s), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(u, r, i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    var e = t[1],
        n = t[3];
    return t[0][1] && (!H(t[2].sizeTree) || void 0 !== n) && !e;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(c)), function (t) {
    var n = t[1];
    setTimeout(function () {
      _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.handleNext(a, function () {
        _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(u, !0);
      }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(l, n);
    });
  }), {
    scrolledToInitialItem: u,
    initialTopMostItemIndex: c
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, b, at, ct), {
  singleton: !0
});

function dt(t) {
  return !!t && ("smooth" === t ? "smooth" : "auto");
}

var ft = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.totalCount,
      o = n.listRefresh,
      i = t[1],
      a = i.isAtBottom,
      l = i.atBottomState,
      s = t[2].scrollToIndex,
      u = t[3].scrolledToInitialItem,
      c = t[4],
      m = c.propsReady,
      d = c.didMount,
      f = t[5].log,
      h = t[6].scrollingInProgress,
      g = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1),
      v = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      S = null;

  function I(t) {
    _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(s, {
      index: "LAST",
      align: "end",
      behavior: t
    });
  }

  function C(t) {
    var n = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.handleNext(l, function (n) {
      !t || n.atBottom || "SIZE_INCREASED" !== n.notAtBottomBecause || S || (_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(f)("scrolling to bottom due to increased size", {}, p.DEBUG), I("auto"));
    });
    setTimeout(n, 100);
  }

  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(r), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.skip(1)), d), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(g), a, u, h), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = e[0],
        r = e[1] && t[3],
        o = "auto";
    return r && (o = function (t, e) {
      return "function" == typeof t ? dt(t(e)) : e && dt(t);
    }(t[1], t[2] || t[4]), r = r && !!o), {
      totalCount: n,
      shouldFollow: r,
      followOutputBehavior: o
    };
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t.shouldFollow;
  })), function (t) {
    var n = t.totalCount,
        r = t.followOutputBehavior;
    S && (S(), S = null), S = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.handleNext(o, function () {
      _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(f)("following output to ", {
        totalCount: n
      }, p.DEBUG), I(r), S = null;
    });
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(g), r, m), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t[0] && t[2];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, e) {
    var n = e[1];
    return {
      refreshed: t.value === n,
      value: n
    };
  }, {
    refreshed: !1,
    value: 0
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t.refreshed;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(g, r)), function (t) {
    C(!1 !== t[1]);
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(v, function () {
    C(!1 !== _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(g));
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(g), l), function (t) {
    var e = t[1];
    t[0] && !e.atBottom && "VIEWPORT_HEIGHT_DECREASING" === e.notAtBottomBecause && I("auto");
  }), {
    followOutput: g,
    autoscrollToBottom: v
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, ut, at, mt, ct, v, b));

function pt(t) {
  return t.reduce(function (t, e) {
    return t.groupIndices.push(t.totalCount), t.totalCount += e + 1, t;
  }, {
    totalCount: 0,
    groupIndices: []
  });
}

var ht = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.totalCount,
      o = n.groupIndices,
      i = n.sizes,
      a = t[1],
      l = a.scrollTop,
      s = a.headerHeight,
      u = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      c = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      m = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(u, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(pt)));
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(m, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.totalCount;
  })), r), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(m, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.groupIndices;
  })), o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(l, i, s), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return et(t[1]);
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return k(t[1].groupOffsetTree, Math.max(t[0] - t[2], 0), "v")[0];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return [t];
  })), c), {
    groupCounts: u,
    topItemsIndexes: c
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, b));

function gt(t, e) {
  return !(!t || t[0] !== e[0] || t[1] !== e[1]);
}

function vt(t, e) {
  return !(!t || t.startIndex !== e.startIndex || t.endIndex !== e.endIndex);
}

function St(t, e, n) {
  return "number" == typeof t ? n === lt && "top" === e || "down" === n && "bottom" === e ? t : 0 : n === lt ? "top" === e ? t.main : t.reverse : "bottom" === e ? t.main : t.reverse;
}

function It(t, e) {
  return "number" == typeof t ? t : t[e] || 0;
}

var Ct = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.scrollTop,
      o = n.viewportHeight,
      i = n.deviation,
      a = n.headerHeight,
      l = n.fixedHeaderHeight,
      s = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      u = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      c = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      m = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      d = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(r), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(a), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(s, gt), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(m), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(u), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(l), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(c)), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = t[1],
        r = t[2],
        o = t[3],
        i = o[0],
        a = o[1],
        l = t[4],
        s = t[6],
        u = t[7],
        c = t[8],
        m = e - u,
        d = t[5] + s,
        f = Math.max(r - m, 0),
        p = "none",
        h = It(c, "top"),
        g = It(c, "bottom");
    return i -= u, a += r + s, (i += r + s) > e + d - h && (p = lt), (a -= u) < e - f + n + g && (p = "down"), "none" !== p ? [Math.max(m - r - St(l, "top", p) - h, 0), m - f - s + n + St(l, "bottom", p) + g] : null;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return null != t;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(gt)), [0, 0]);
  return {
    listBoundary: s,
    overscan: m,
    topListHeight: u,
    increaseViewportBy: c,
    visibleRange: d
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(b), {
  singleton: !0
}),
    Tt = {
  items: [],
  topItems: [],
  offsetTop: 0,
  offsetBottom: 0,
  top: 0,
  bottom: 0,
  topListHeight: 0,
  totalCount: 0,
  firstItemIndex: 0
};

function wt(t, e, n) {
  if (0 === t.length) return [];
  if (!et(e)) return t.map(function (t) {
    return u({}, t, {
      index: t.index + n,
      originalIndex: t.index
    });
  });

  for (var r, o = [], i = A(e.groupOffsetTree, t[0].index, t[t.length - 1].index), a = void 0, l = 0, s = d(t); !(r = s()).done;) {
    var c = r.value;
    (!a || a.end < c.index) && (a = i.shift(), l = e.groupIndices.indexOf(a.start)), o.push(u({}, c.index === a.start ? {
      type: "group",
      index: l
    } : {
      index: c.index - (l + 1) + n,
      groupIndex: l
    }, {
      size: c.size,
      offset: c.offset,
      originalIndex: c.index,
      data: c.data
    }));
  }

  return o;
}

function xt(t, e, n, r, o, i) {
  var a = 0,
      l = 0;

  if (t.length > 0) {
    a = t[0].offset;
    var s = t[t.length - 1];
    l = s.offset + s.size;
  }

  var u = n - o.lastIndex,
      c = a,
      m = o.lastOffset + u * o.lastSize + (u - 1) * r - l;
  return {
    items: wt(t, o, i),
    topItems: wt(e, o, i),
    topListHeight: e.reduce(function (t, e) {
      return e.size + t;
    }, 0),
    offsetTop: a,
    offsetBottom: m,
    top: c,
    bottom: l,
    totalCount: n,
    firstItemIndex: i
  };
}

var bt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.sizes,
      o = n.totalCount,
      i = n.data,
      a = n.firstItemIndex,
      l = n.gap,
      s = t[1],
      c = t[2],
      m = c.visibleRange,
      f = c.listBoundary,
      p = c.topListHeight,
      h = t[3],
      g = h.scrolledToInitialItem,
      v = h.initialTopMostItemIndex,
      S = t[4].topListHeight,
      I = t[5],
      C = t[6].didMount,
      T = t[7].recalcInProgress,
      w = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream([]),
      x = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream();
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(s.topItemsIndexes, w);
  var b = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(C, T, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(m, gt), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(r), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(v), g, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(w), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(a), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(l), i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t[0] && !t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var n = t[2],
        r = n[0],
        o = n[1],
        i = t[3],
        a = t[5],
        l = t[6],
        s = t[7],
        u = t[8],
        c = t[9],
        m = t[10],
        f = t[4],
        p = f.sizeTree,
        h = f.offsetTree;
    if (0 === i || 0 === r && 0 === o) return Tt;
    if (H(p)) return xt(function (t, e, n) {
      if (et(e)) {
        var r = tt(t, e);
        return [{
          index: k(e.groupOffsetTree, r)[0],
          size: 0,
          offset: 0
        }, {
          index: r,
          size: 0,
          offset: 0,
          data: n && n[0]
        }];
      }

      return [{
        index: t,
        size: 0,
        offset: 0,
        data: n && n[0]
      }];
    }(function (t, e) {
      return "number" == typeof t ? t : "LAST" === t.index ? e - 1 : t.index;
    }(a, i), f, m), [], i, c, f, u);
    var g = [];
    if (s.length > 0) for (var v, S = s[0], I = s[s.length - 1], C = 0, T = d(A(p, S, I)); !(v = T()).done;) for (var w = v.value, x = w.value, b = Math.max(w.start, S), y = Math.min(w.end, I), E = b; E <= y; E++) g.push({
      index: E,
      size: x,
      offset: C,
      data: m && m[E]
    }), C += x;
    if (!l) return xt([], g, i, c, f, u);

    var R = s.length > 0 ? s[s.length - 1] + 1 : 0,
        L = function (t, e, n, r) {
      return void 0 === r && (r = 0), r > 0 && (e = Math.max(e, _(t, r, Y).offset)), W((i = n, l = G(o = t, e, a = q), s = G(o, i, a, l), o.slice(l, s + 1)), Z);
      var o, i, a, l, s;
    }(h, r, o, R);

    if (0 === L.length) return null;
    var z = i - 1;
    return xt(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tap([], function (t) {
      for (var e, n = d(L); !(e = n()).done;) {
        var i = e.value,
            a = i.value,
            l = a.offset,
            s = i.start,
            u = a.size;

        if (a.offset < r) {
          var f = (s += Math.floor((r - a.offset + c) / (u + c))) - i.start;
          l += f * u + f * c;
        }

        s < R && (l += (R - s) * u, s = R);

        for (var p = Math.min(i.end, z), h = s; h <= p && !(l >= o); h++) t.push({
          index: h,
          size: u,
          offset: l,
          data: m && m[h]
        }), l += u + c;
      }
    }), g, i, c, f, u);
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return null !== t;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), Tt);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(i, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return void 0 !== t;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.length;
  })), o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(b, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.topListHeight;
  })), S), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(S, p), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(b, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return [t.top, t.bottom];
  })), f), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(b, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.items;
  })), x), u({
    listState: b,
    topItemsIndexes: w,
    endReached: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(b, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
      return t.items.length > 0;
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(o, i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
      var e = t[0].items;
      return e[e.length - 1].originalIndex === t[1] - 1;
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
      return [t[1] - 1, t[2]];
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(gt), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
      return t[0];
    }))),
    startReached: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(b, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.throttleTime(200), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
      var e = t.items;
      return e.length > 0 && e[0].originalIndex === t.topItems.length;
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
      return t.items[0].index;
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged())),
    rangeChanged: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(b, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
      return t.items.length > 0;
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
      var e = t.items;
      return {
        startIndex: e[0].index,
        endIndex: e[e.length - 1].index
      };
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(vt))),
    itemsRendered: x
  }, I);
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, ht, Ct, mt, at, ut, ct, j), {
  singleton: !0
}),
    yt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.sizes,
      o = n.firstItemIndex,
      i = n.data,
      a = n.gap,
      l = t[1].listState,
      s = t[2].didMount,
      u = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(s, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(u), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return 0 !== t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(r, o, a, i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0][1],
        n = t[1],
        r = t[2],
        o = t[3],
        i = t[4],
        a = void 0 === i ? [] : i,
        l = 0;
    if (n.groupIndices.length > 0) for (var s, u = d(n.groupIndices); !((s = u()).done || s.value - l >= e);) l++;
    var c = e + l;
    return xt(Array.from({
      length: c
    }).map(function (t, e) {
      return {
        index: e,
        size: 0,
        offset: 0,
        data: a[e]
      };
    }), [], c, o, n, r);
  })), l), {
    initialItemCount: u
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, bt, ct), {
  singleton: !0
}),
    Et = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0].scrollVelocity,
      r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1),
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(n, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(i, r, o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return !!t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = t[1],
        r = t[2],
        o = t[3],
        i = n.enter;

    if (r) {
      if ((0, n.exit)(e, o)) return !1;
    } else if (i(e, o)) return !0;

    return r;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), r), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(r, n, o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(i)), function (t) {
    var e = t[0],
        n = t[1];
    return e[0] && n && n.change && n.change(e[1], e[2]);
  }), {
    isSeeking: r,
    scrollSeekConfiguration: i,
    scrollVelocity: n,
    scrollSeekRangeChanged: o
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(ut), {
  singleton: !0
}),
    Ht = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0].topItemsIndexes,
      r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t > 0;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return Array.from({
      length: t
    }).map(function (t, e) {
      return e;
    });
  })), n), {
    topItemCount: r
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(bt)),
    Rt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.footerHeight,
      o = n.headerHeight,
      i = n.fixedHeaderHeight,
      a = t[1].listState,
      l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      s = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(r, o, i, a), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[3];
    return t[0] + t[1] + t[2] + e.offsetBottom + e.bottom;
  })), 0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(s), l), {
    totalListHeight: s,
    totalListHeightChanged: l
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(b, bt), {
  singleton: !0
});

function Lt(t) {
  var e,
      n = !1;
  return function () {
    return n || (n = !0, e = t()), e;
  };
}

var kt = Lt(function () {
  return /iP(ad|hone|od).+Version\/[\d.]+.*Safari/i.test(navigator.userAgent);
}),
    zt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.scrollBy,
      o = n.scrollTop,
      i = n.deviation,
      a = n.scrollingInProgress,
      l = t[1],
      s = l.isScrolling,
      u = l.isAtBottom,
      c = l.scrollDirection,
      m = t[3],
      d = m.beforeUnshiftWith,
      f = m.shiftWithOffset,
      h = m.sizes,
      g = m.gap,
      v = t[4].log,
      S = t[5].recalcInProgress,
      I = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(t[2].listState, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(l.lastJumpDueToItemResize), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.scan(function (t, e) {
    var n = t[1],
        r = e[0],
        o = r.items,
        i = r.totalCount,
        a = r.bottom + r.offsetBottom,
        l = 0;
    return t[2] === i && n.length > 0 && o.length > 0 && (0 === o[0].originalIndex && 0 === n[0].originalIndex || 0 != (l = a - t[3]) && (l += e[1])), [l, o, i, a];
  }, [0, [], 0, 0]), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return 0 !== t[0];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(o, c, a, u, v), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return !t[3] && 0 !== t[1] && t[2] === lt;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0][0];
    return (0, t[5])("Upward scrolling compensation", {
      amount: e
    }, p.DEBUG), e;
  })));

  function C(t) {
    t > 0 ? (_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(r, {
      top: -t,
      behavior: "auto"
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(i, 0)) : (_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(i, 0), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(r, {
      top: -t,
      behavior: "auto"
    }));
  }

  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(I, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(i, s)), function (t) {
    var n = t[0],
        r = t[1];
    t[2] && kt() ? _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(i, r - n) : C(-n);
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(s, !1), i, S), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return !t[0] && !t[2] && 0 !== t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.throttleTime(1)), C), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(f, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return {
      top: -t
    };
  })), r), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(d, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(h, g), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0];
    return e * t[1].lastSize + e * t[2];
  })), function (t) {
    _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(i, t), requestAnimationFrame(function () {
      _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(r, {
        top: t
      }), requestAnimationFrame(function () {
        _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(i, 0), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(S, !1);
      });
    });
  }), {
    deviation: i
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(b, ut, bt, rt, v, j)),
    Bt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0].totalListHeight,
      r = t[1].didMount,
      o = t[2].scrollTo,
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return 0 !== t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return {
      top: t[1]
    };
  })), function (t) {
    _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.handleNext(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(n, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
      return 0 !== t;
    })), function () {
      setTimeout(function () {
        _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(o, t);
      });
    });
  }), {
    initialScrollTop: i
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(Rt, ct, b), {
  singleton: !0
}),
    Ft = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0].viewportHeight,
      r = t[1].totalListHeight,
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1);
  return {
    alignToBottom: o,
    paddingTopAddition: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(o, n, r), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
      return t[0];
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
      return Math.max(0, t[1] - t[2]);
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), 0)
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(b, Rt), {
  singleton: !0
}),
    Pt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.scrollTo,
      o = n.scrollContainerState,
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      a = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      s = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(!1),
      c = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(void 0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(i, a), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = e.viewportHeight,
        r = e.scrollHeight;
    return {
      scrollTop: Math.max(0, e.scrollTop - t[1].offsetTop),
      scrollHeight: r,
      viewportHeight: n
    };
  })), o), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(r, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(a), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0];
    return u({}, e, {
      top: e.top + t[1].offsetTop
    });
  })), l), {
    useWindowScroll: s,
    customScrollParent: c,
    windowScrollContainerState: i,
    windowViewportRect: a,
    windowScrollTo: l
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(b)),
    Ot = ["done", "behavior"],
    Mt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.sizes,
      o = n.totalCount,
      i = n.gap,
      a = t[1],
      l = a.scrollTop,
      s = a.viewportHeight,
      m = a.headerHeight,
      d = a.scrollingInProgress,
      f = t[2].scrollToIndex,
      p = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream();
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(p, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(r, s, o, m, l, i), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var n = t[0],
        r = t[1],
        o = t[2],
        i = t[3],
        a = t[4],
        l = t[5],
        s = t[6],
        m = n.done,
        f = n.behavior,
        p = c(n, Ot),
        h = null,
        g = X(n, r, i - 1),
        v = Q(g, r.offsetTree, s) + a;
    return v < l ? h = u({}, p, {
      behavior: f,
      align: "start"
    }) : v + k(r.sizeTree, g)[1] > l + o && (h = u({}, p, {
      behavior: f,
      align: "end"
    })), h ? m && _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.handleNext(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(d, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.skip(1), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
      return !1 === t;
    })), m) : m && m(), h;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return null !== t;
  })), f), {
    scrollIntoView: p
  };
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, b, at, bt, v), {
  singleton: !0
}),
    Vt = ["listState", "topItemsIndexes"],
    Ut = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  return u({}, t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8]);
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(Ct, yt, ct, Et, Rt, Bt, Ft, Pt, Mt)),
    At = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.totalCount,
      o = n.sizeRanges,
      i = n.fixedItemSize,
      a = n.defaultItemSize,
      l = n.trackItemSizes,
      s = n.itemSize,
      m = n.data,
      d = n.firstItemIndex,
      f = n.groupIndices,
      p = n.statefulTotalCount,
      h = n.gap,
      g = t[1],
      v = g.initialTopMostItemIndex,
      S = g.scrolledToInitialItem,
      I = t[2],
      C = t[3],
      T = t[4],
      w = T.listState,
      x = T.topItemsIndexes,
      b = c(T, Vt),
      y = t[5].scrollToIndex,
      E = t[7].topItemCount,
      H = t[8].groupCounts,
      R = t[9],
      L = t[10];
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(b.rangeChanged, R.scrollSeekRangeChanged), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(R.windowViewportRect, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.visibleHeight;
  })), I.viewportHeight), u({
    totalCount: r,
    data: m,
    firstItemIndex: d,
    sizeRanges: o,
    initialTopMostItemIndex: v,
    scrolledToInitialItem: S,
    topItemsIndexes: x,
    topItemCount: E,
    groupCounts: H,
    fixedItemHeight: i,
    defaultItemHeight: a,
    gap: h
  }, C, {
    statefulTotalCount: p,
    listState: w,
    scrollToIndex: y,
    trackItemSizes: l,
    itemSize: s,
    groupIndices: f
  }, b, R, I, L);
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(rt, mt, b, ft, bt, at, zt, Ht, ht, Ut, v)),
    Wt = Lt(function () {
  if ("undefined" == typeof document) return "sticky";
  var t = document.createElement("div");
  return t.style.position = "-webkit-sticky", "-webkit-sticky" === t.style.position ? "-webkit-sticky" : "sticky";
});

function Nt(t, e) {
  var n = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
      r = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function (r) {
    if (null !== r && r.offsetParent) {
      var o,
          i,
          a = r.getBoundingClientRect(),
          l = a.width;

      if (e) {
        var s = e.getBoundingClientRect(),
            u = a.top - s.top;
        o = s.height - Math.max(0, u), i = u + e.scrollTop;
      } else o = window.innerHeight - Math.max(0, a.top), i = a.top + window.pageYOffset;

      n.current = {
        offsetTop: i,
        visibleHeight: o,
        visibleWidth: l
      }, t(n.current);
    }
  }, [t, e]),
      l = S(r),
      s = l.callbackRef,
      u = l.ref,
      c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function () {
    r(u.current);
  }, [r, u]);
  return (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    if (e) {
      e.addEventListener("scroll", c);
      var t = new ResizeObserver(c);
      return t.observe(e), function () {
        e.removeEventListener("scroll", c), t.unobserve(e);
      };
    }

    return window.addEventListener("scroll", c), window.addEventListener("resize", c), function () {
      window.removeEventListener("scroll", c), window.removeEventListener("resize", c);
    };
  }, [c, e]), s;
}

var Dt = ["placeholder"],
    Gt = ["style", "children"],
    _t = ["style", "children"];

function jt(t) {
  return t;
}

var Kt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function () {
  var t = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(function (t) {
    return "Item " + t;
  }),
      n = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(null),
      r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(function (t) {
    return "Group " + t;
  }),
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream({}),
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(jt),
      a = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream("div"),
      l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.noop),
      s = function (t, n) {
    return void 0 === n && (n = null), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(o, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (e) {
      return e[t];
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), n);
  };

  return {
    context: n,
    itemContent: t,
    groupContent: r,
    components: o,
    computeItemKey: i,
    headerFooterTag: a,
    scrollerRef: l,
    FooterComponent: s("Footer"),
    HeaderComponent: s("Header"),
    TopItemListComponent: s("TopItemList"),
    ListComponent: s("List", "div"),
    ItemComponent: s("Item", "div"),
    GroupComponent: s("Group", "div"),
    ScrollerComponent: s("Scroller", "div"),
    EmptyPlaceholder: s("EmptyPlaceholder"),
    ScrollSeekPlaceholder: s("ScrollSeekPlaceholder")
  };
});

function Yt(t, n) {
  var r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream();
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(r, function () {
    return console.warn("react-virtuoso: You are using a deprecated property. " + n, "color: red;", "color: inherit;", "color: blue;");
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(r, t), r;
}

var qt = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = t[1],
      o = {
    item: Yt(r.itemContent, "Rename the %citem%c prop to %citemContent."),
    group: Yt(r.groupContent, "Rename the %cgroup%c prop to %cgroupContent."),
    topItems: Yt(n.topItemCount, "Rename the %ctopItems%c prop to %ctopItemCount."),
    itemHeight: Yt(n.fixedItemHeight, "Rename the %citemHeight%c prop to %cfixedItemHeight."),
    scrollingStateChange: Yt(n.isScrolling, "Rename the %cscrollingStateChange%c prop to %cisScrolling."),
    adjustForPrependedItems: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    maxHeightCacheSize: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    footer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    header: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    HeaderContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    FooterContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    ItemContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    ScrollContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    GroupContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    ListContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    emptyComponent: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    scrollSeek: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream()
  };

  function i(t, n, o) {
    _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(t, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(r.components), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
      var e,
          r = t[0],
          i = t[1];
      return console.warn("react-virtuoso: " + o + " property is deprecated. Pass components." + n + " instead."), u({}, i, ((e = {})[n] = r, e));
    })), r.components);
  }

  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(o.adjustForPrependedItems, function () {
    console.warn("react-virtuoso: adjustForPrependedItems is no longer supported. Use the firstItemIndex property instead - https://virtuoso.dev/prepend-items.", "color: red;", "color: inherit;", "color: blue;");
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(o.maxHeightCacheSize, function () {
    console.warn("react-virtuoso: maxHeightCacheSize is no longer necessary. Setting it has no effect - remove it from your code.");
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(o.HeaderContainer, function () {
    console.warn("react-virtuoso: HeaderContainer is deprecated. Use headerFooterTag if you want to change the wrapper of the header component and pass components.Header to change its contents.");
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(o.FooterContainer, function () {
    console.warn("react-virtuoso: FooterContainer is deprecated. Use headerFooterTag if you want to change the wrapper of the footer component and pass components.Footer to change its contents.");
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(o.scrollSeek, function (t) {
    var o = t.placeholder,
        i = c(t, Dt);
    console.warn("react-virtuoso: scrollSeek property is deprecated. Pass scrollSeekConfiguration and specify the placeholder in components.ScrollSeekPlaceholder instead."), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(r.components, u({}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(r.components), {
      ScrollSeekPlaceholder: o
    })), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(n.scrollSeekConfiguration, i);
  }), i(o.footer, "Footer", "footer"), i(o.header, "Header", "header"), i(o.ItemContainer, "Item", "ItemContainer"), i(o.ListContainer, "List", "ListContainer"), i(o.ScrollContainer, "Scroller", "ScrollContainer"), i(o.emptyComponent, "EmptyPlaceholder", "emptyComponent"), i(o.GroupContainer, "Group", "GroupContainer"), u({}, n, r, o);
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(At, Kt)),
    Zt = function (t) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    style: {
      height: t.height
    }
  });
},
    Jt = {
  position: Wt(),
  zIndex: 1,
  overflowAnchor: "none"
},
    $t = {
  overflowAnchor: "none"
},
    Qt = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function (t) {
  var r = t.showTopList,
      o = void 0 !== r && r,
      i = fe("listState"),
      a = de("sizeRanges"),
      s = fe("useWindowScroll"),
      c = fe("customScrollParent"),
      m = de("windowScrollContainerState"),
      d = de("scrollContainerState"),
      f = c || s ? m : d,
      p = fe("itemContent"),
      h = fe("context"),
      g = fe("groupContent"),
      v = fe("trackItemSizes"),
      S = fe("itemSize"),
      I = fe("log"),
      T = de("gap"),
      w = C(a, S, v, o ? _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.noop : f, I, T, c).callbackRef,
      x = react__WEBPACK_IMPORTED_MODULE_1__.useState(0),
      b = x[0],
      y = x[1];
  pe("deviation", function (t) {
    b !== t && y(t);
  });
  var E = fe("EmptyPlaceholder"),
      H = fe("ScrollSeekPlaceholder") || Zt,
      R = fe("ListComponent"),
      L = fe("ItemComponent"),
      k = fe("GroupComponent"),
      z = fe("computeItemKey"),
      B = fe("isSeeking"),
      F = fe("groupIndices").length > 0,
      P = fe("paddingTopAddition"),
      O = o ? {} : {
    boxSizing: "border-box",
    paddingTop: i.offsetTop + P,
    paddingBottom: i.offsetBottom,
    marginTop: b
  };
  return !o && 0 === i.totalCount && E ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(E, ne(E, h)) : /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(R, u({}, ne(R, h), {
    ref: w,
    style: O,
    "data-test-id": o ? "virtuoso-top-item-list" : "virtuoso-item-list"
  }), (o ? i.topItems : i.items).map(function (t) {
    var e = t.originalIndex,
        n = z(e + i.firstItemIndex, t.data, h);
    return B ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(H, u({}, ne(H, h), {
      key: n,
      index: t.index,
      height: t.size,
      type: t.type || "item"
    }, "group" === t.type ? {} : {
      groupIndex: t.groupIndex
    })) : "group" === t.type ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(k, u({}, ne(k, h), {
      key: n,
      "data-index": e,
      "data-known-size": t.size,
      "data-item-index": t.index,
      style: Jt
    }), g(t.index)) : /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(L, u({}, ne(L, h), {
      key: n,
      "data-index": e,
      "data-known-size": t.size,
      "data-item-index": t.index,
      "data-item-group-index": t.groupIndex,
      style: $t
    }), F ? p(t.index, t.groupIndex, t.data, h) : p(t.index, t.data, h));
  }));
}),
    Xt = {
  height: "100%",
  outline: "none",
  overflowY: "auto",
  position: "relative",
  WebkitOverflowScrolling: "touch",
  willChange: "transform"
},
    te = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0
},
    ee = {
  width: "100%",
  position: Wt(),
  top: 0
};

function ne(t, e) {
  if ("string" != typeof t) return {
    context: e
  };
}

var re = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function () {
  var t = fe("HeaderComponent"),
      e = de("headerHeight"),
      n = fe("headerFooterTag"),
      r = I(function (t) {
    return e(T(t, "height"));
  }),
      o = fe("context");
  return t ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(n, {
    ref: r
  }, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(t, ne(t, o))) : null;
}),
    oe = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function () {
  var t = fe("FooterComponent"),
      e = de("footerHeight"),
      n = fe("headerFooterTag"),
      r = I(function (t) {
    return e(T(t, "height"));
  }),
      o = fe("context");
  return t ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(n, {
    ref: r
  }, /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(t, ne(t, o))) : null;
});

function ie(t) {
  var e = t.usePublisher,
      r = t.useEmitter,
      o = t.useEmitterValue;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function (t) {
    var n = t.style,
        i = t.children,
        a = c(t, Gt),
        s = e("scrollContainerState"),
        m = o("ScrollerComponent"),
        d = e("smoothScrollTargetReached"),
        f = o("scrollerRef"),
        p = o("context"),
        h = x(s, d, m, f),
        g = h.scrollerRef,
        v = h.scrollByCallback;
    return r("scrollTo", h.scrollToCallback), r("scrollBy", v), /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(m, u({
      ref: g,
      style: u({}, Xt, n),
      "data-test-id": "virtuoso-scroller",
      "data-virtuoso-scroller": !0,
      tabIndex: 0
    }, a, ne(m, p)), i);
  });
}

function ae(t) {
  var r = t.usePublisher,
      o = t.useEmitter,
      i = t.useEmitterValue;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function (t) {
    var n = t.style,
        a = t.children,
        s = c(t, _t),
        m = r("windowScrollContainerState"),
        d = i("ScrollerComponent"),
        f = r("smoothScrollTargetReached"),
        p = i("totalListHeight"),
        g = i("deviation"),
        v = i("customScrollParent"),
        S = i("context"),
        I = x(m, f, d, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.noop, v),
        C = I.scrollerRef,
        T = I.scrollByCallback,
        w = I.scrollToCallback;
    return h(function () {
      return C.current = v || window, function () {
        C.current = null;
      };
    }, [C, v]), o("windowScrollTo", w), o("scrollBy", T), /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(d, u({
      style: u({
        position: "relative"
      }, n, 0 !== p ? {
        height: p + g
      } : {}),
      "data-virtuoso-scroller": !0
    }, s, ne(d, S)), a);
  });
}

var le = function (t) {
  var r = t.children,
      o = de("viewportHeight"),
      i = I(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.compose(o, function (t) {
    return T(t, "height");
  }));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    style: te,
    ref: i,
    "data-viewport-type": "element"
  }, r);
},
    se = function (t) {
  var e = t.children,
      r = Nt(de("windowViewportRect"), fe("customScrollParent"));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    ref: r,
    style: te,
    "data-viewport-type": "window"
  }, e);
},
    ue = function (t) {
  var e = t.children,
      n = fe("TopItemListComponent"),
      r = fe("headerHeight"),
      o = u({}, ee, {
    marginTop: r + "px"
  }),
      i = fe("context");
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(n || "div", {
    style: o,
    context: i
  }, e);
},
    ce = (0,_virtuoso_dev_react_urx__WEBPACK_IMPORTED_MODULE_4__.systemToComponent)(qt, {
  required: {},
  optional: {
    context: "context",
    followOutput: "followOutput",
    firstItemIndex: "firstItemIndex",
    itemContent: "itemContent",
    groupContent: "groupContent",
    overscan: "overscan",
    increaseViewportBy: "increaseViewportBy",
    totalCount: "totalCount",
    topItemCount: "topItemCount",
    initialTopMostItemIndex: "initialTopMostItemIndex",
    components: "components",
    groupCounts: "groupCounts",
    atBottomThreshold: "atBottomThreshold",
    atTopThreshold: "atTopThreshold",
    computeItemKey: "computeItemKey",
    defaultItemHeight: "defaultItemHeight",
    fixedItemHeight: "fixedItemHeight",
    itemSize: "itemSize",
    scrollSeekConfiguration: "scrollSeekConfiguration",
    headerFooterTag: "headerFooterTag",
    data: "data",
    initialItemCount: "initialItemCount",
    initialScrollTop: "initialScrollTop",
    alignToBottom: "alignToBottom",
    useWindowScroll: "useWindowScroll",
    customScrollParent: "customScrollParent",
    scrollerRef: "scrollerRef",
    logLevel: "logLevel",
    react18ConcurrentRendering: "react18ConcurrentRendering",
    item: "item",
    group: "group",
    topItems: "topItems",
    itemHeight: "itemHeight",
    scrollingStateChange: "scrollingStateChange",
    maxHeightCacheSize: "maxHeightCacheSize",
    footer: "footer",
    header: "header",
    ItemContainer: "ItemContainer",
    ScrollContainer: "ScrollContainer",
    ListContainer: "ListContainer",
    GroupContainer: "GroupContainer",
    emptyComponent: "emptyComponent",
    HeaderContainer: "HeaderContainer",
    FooterContainer: "FooterContainer",
    scrollSeek: "scrollSeek"
  },
  methods: {
    scrollToIndex: "scrollToIndex",
    scrollIntoView: "scrollIntoView",
    scrollTo: "scrollTo",
    scrollBy: "scrollBy",
    adjustForPrependedItems: "adjustForPrependedItems",
    autoscrollToBottom: "autoscrollToBottom"
  },
  events: {
    isScrolling: "isScrolling",
    endReached: "endReached",
    startReached: "startReached",
    rangeChanged: "rangeChanged",
    atBottomStateChange: "atBottomStateChange",
    atTopStateChange: "atTopStateChange",
    totalListHeightChanged: "totalListHeightChanged",
    itemsRendered: "itemsRendered",
    groupIndices: "groupIndices"
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function (t) {
  var e = fe("useWindowScroll"),
      r = fe("topItemsIndexes").length > 0,
      o = fe("customScrollParent"),
      i = o || e ? se : le;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(o || e ? ge : he, u({}, t), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(i, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(re, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Qt, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(oe, null)), r && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(ue, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Qt, {
    showTopList: !0
  })));
})),
    me = ce.Component,
    de = ce.usePublisher,
    fe = ce.useEmitterValue,
    pe = ce.useEmitter,
    he = ie({
  usePublisher: de,
  useEmitterValue: fe,
  useEmitter: pe
}),
    ge = ae({
  usePublisher: de,
  useEmitterValue: fe,
  useEmitter: pe
}),
    ve = {
  items: [],
  offsetBottom: 0,
  offsetTop: 0,
  top: 0,
  bottom: 0,
  itemHeight: 0,
  itemWidth: 0
},
    Se = {
  items: [{
    index: 0
  }],
  offsetBottom: 0,
  offsetTop: 0,
  top: 0,
  bottom: 0,
  itemHeight: 0,
  itemWidth: 0
},
    Ie = Math.round,
    Ce = Math.ceil,
    Te = Math.floor,
    we = Math.min,
    xe = Math.max;

function be(t, e) {
  return Array.from({
    length: e - t + 1
  }).map(function (e, n) {
    return {
      index: n + t
    };
  });
}

function ye(t, e) {
  return t && t.column === e.column && t.row === e.row;
}

var Ee = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = n.overscan,
      o = n.visibleRange,
      i = n.listBoundary,
      a = t[1],
      l = a.scrollTop,
      s = a.viewportHeight,
      c = a.scrollBy,
      m = a.scrollTo,
      d = a.smoothScrollTargetReached,
      f = a.scrollContainerState,
      p = t[2],
      h = t[3],
      g = t[4],
      v = g.propsReady,
      S = g.didMount,
      I = t[5],
      C = I.windowViewportRect,
      T = I.windowScrollTo,
      w = I.useWindowScroll,
      x = I.customScrollParent,
      b = I.windowScrollContainerState,
      y = t[6],
      E = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      H = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      R = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(ve),
      L = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream({
    height: 0,
    width: 0
  }),
      k = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream({
    height: 0,
    width: 0
  }),
      z = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      B = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
      F = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(0),
      P = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream({
    row: 0,
    column: 0
  });
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(S, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(H), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return 0 !== t[1];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return {
      items: be(0, t[1] - 1),
      top: 0,
      bottom: 0,
      offsetBottom: 0,
      offsetTop: 0,
      itemHeight: 0,
      itemWidth: 0
    };
  })), R), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(E), o, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(P, ye), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(k, function (t, e) {
    return t && t.width === e.width && t.height === e.height;
  })), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(L), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[0],
        n = e[0],
        r = e[1],
        o = r[0],
        i = r[1],
        a = e[2],
        l = e[3],
        s = t[1],
        u = a.row,
        c = l.height,
        m = l.width,
        d = s.width;
    if (0 === n || 0 === d) return ve;
    if (0 === m) return Se;
    var f = Le(d, m, a.column),
        p = f * Te((o + u) / (c + u)),
        h = f * Ce((i + u) / (c + u)) - 1;
    h = xe(0, we(n - 1, h));
    var g = be(p = we(h, xe(0, p)), h),
        v = He(s, a, l, g),
        S = v.top,
        I = v.bottom,
        C = Ce(n / f);
    return {
      items: g,
      offsetTop: S,
      offsetBottom: C * c + (C - 1) * u - I,
      top: S,
      bottom: I,
      itemHeight: c,
      itemWidth: m
    };
  })), R), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(L, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.height;
  })), s), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.combineLatest(L, k, R, P), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = He(t[0], t[3], t[1], t[2].items);
    return [e.top, e.bottom];
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(gt)), i);
  var O = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(R), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t.items.length > 0;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(E), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    var e = t[0].items;
    return e[e.length - 1].index === t[1] - 1;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t[1] - 1;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged())),
      M = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(R), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    var e = t.items;
    return e.length > 0 && 0 === e[0].index;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.mapTo(0), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged())),
      V = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.streamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.duc(R), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.filter(function (t) {
    return t.items.length > 0;
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t.items;
    return {
      startIndex: e[0].index,
      endIndex: e[e.length - 1].index
    };
  }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged(vt)));
  _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(V, h.scrollSeekRangeChanged), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(z, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(L, k, E, P), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    var e = t[1],
        n = t[2],
        r = t[3],
        o = t[4],
        i = it(t[0]),
        a = i.align,
        l = i.behavior,
        s = i.offset,
        u = i.index;
    "LAST" === u && (u = r - 1);
    var c = Re(e, o, n, u = xe(0, u, we(r - 1, u)));
    return "end" === a ? c = Ie(c - e.height + n.height) : "center" === a && (c = Ie(c - e.height / 2 + n.height / 2)), s && (c += s), {
      top: c,
      behavior: l
    };
  })), m);
  var U = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(R, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return t.offsetBottom + t.bottom;
  })), 0);
  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(C, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
    return {
      width: t.visibleWidth,
      height: t.visibleHeight
    };
  })), L), u({
    totalCount: E,
    viewportDimensions: L,
    itemDimensions: k,
    scrollTop: l,
    scrollHeight: B,
    overscan: r,
    scrollBy: c,
    scrollTo: m,
    scrollToIndex: z,
    smoothScrollTargetReached: d,
    windowViewportRect: C,
    windowScrollTo: T,
    useWindowScroll: w,
    customScrollParent: x,
    windowScrollContainerState: b,
    deviation: F,
    scrollContainerState: f,
    initialItemCount: H,
    gap: P
  }, h, {
    gridState: R,
    totalListHeight: U
  }, p, {
    startReached: M,
    endReached: O,
    rangeChanged: V,
    propsReady: v
  }, y);
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(Ct, b, ut, Et, ct, Pt, v));

function He(t, e, n, r) {
  var o = n.height;
  return void 0 === o || 0 === r.length ? {
    top: 0,
    bottom: 0
  } : {
    top: Re(t, e, n, r[0].index),
    bottom: Re(t, e, n, r[r.length - 1].index) + o
  };
}

function Re(t, e, n, r) {
  var o = Le(t.width, n.width, e.column),
      i = Te(r / o),
      a = i * n.height + xe(0, i - 1) * e.row;
  return a > 0 ? a + e.row : a;
}

function Le(t, e, n) {
  return xe(1, Te((t + n) / (e + n)));
}

var ke = ["placeholder"],
    ze = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function () {
  var t = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(function (t) {
    return "Item " + t;
  }),
      n = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream({}),
      r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(null),
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream("virtuoso-grid-item"),
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream("virtuoso-grid-list"),
      a = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(jt),
      l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.noop),
      s = function (t, r) {
    return void 0 === r && (r = null), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(n, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (e) {
      return e[t];
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), r);
  };

  return {
    context: r,
    itemContent: t,
    components: n,
    computeItemKey: a,
    itemClassName: o,
    listClassName: i,
    scrollerRef: l,
    ListComponent: s("List", "div"),
    ItemComponent: s("Item", "div"),
    ScrollerComponent: s("Scroller", "div"),
    ScrollSeekPlaceholder: s("ScrollSeekPlaceholder", "div")
  };
}),
    Be = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  var n = t[0],
      r = t[1],
      o = {
    item: Yt(r.itemContent, "Rename the %citem%c prop to %citemContent."),
    ItemContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    ScrollContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    ListContainer: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    emptyComponent: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream(),
    scrollSeek: _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.stream()
  };

  function i(t, n, o) {
    _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.connect(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(t, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.withLatestFrom(r.components), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (t) {
      var e,
          r = t[0],
          i = t[1];
      return console.warn("react-virtuoso: " + o + " property is deprecated. Pass components." + n + " instead."), u({}, i, ((e = {})[n] = r, e));
    })), r.components);
  }

  return _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.subscribe(o.scrollSeek, function (t) {
    var o = t.placeholder,
        i = c(t, ke);
    console.warn("react-virtuoso: scrollSeek property is deprecated. Pass scrollSeekConfiguration and specify the placeholder in components.ScrollSeekPlaceholder instead."), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(r.components, u({}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.getValue(r.components), {
      ScrollSeekPlaceholder: o
    })), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.publish(n.scrollSeekConfiguration, i);
  }), i(o.ItemContainer, "Item", "ItemContainer"), i(o.ListContainer, "List", "ListContainer"), i(o.ScrollContainer, "Scroller", "ScrollContainer"), u({}, n, r, o);
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(Ee, ze)),
    Fe = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function () {
  var t = Ae("gridState"),
      e = Ae("listClassName"),
      n = Ae("itemClassName"),
      r = Ae("itemContent"),
      o = Ae("computeItemKey"),
      i = Ae("isSeeking"),
      a = Ue("scrollHeight"),
      s = Ae("ItemComponent"),
      c = Ae("ListComponent"),
      m = Ae("ScrollSeekPlaceholder"),
      d = Ae("context"),
      f = Ue("itemDimensions"),
      p = Ue("gap"),
      h = Ae("log"),
      g = I(function (t) {
    a(t.parentElement.parentElement.scrollHeight);
    var e = t.firstChild;
    e && f(e.getBoundingClientRect()), p({
      row: Ge("row-gap", getComputedStyle(t).rowGap, h),
      column: Ge("column-gap", getComputedStyle(t).columnGap, h)
    });
  });
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(c, u({
    ref: g,
    className: e
  }, ne(c, d), {
    style: {
      paddingTop: t.offsetTop,
      paddingBottom: t.offsetBottom
    }
  }), t.items.map(function (e) {
    var a = o(e.index);
    return i ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(m, u({
      key: a
    }, ne(m, d), {
      index: e.index,
      height: t.itemHeight,
      width: t.itemWidth
    })) : /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(s, u({}, ne(s, d), {
      className: n,
      "data-index": e.index,
      key: a
    }), r(e.index, d));
  }));
}),
    Pe = function (t) {
  var e = t.children,
      r = Ue("viewportDimensions"),
      o = I(function (t) {
    r(t.getBoundingClientRect());
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    style: te,
    ref: o
  }, e);
},
    Oe = function (t) {
  var e = t.children,
      r = Nt(Ue("windowViewportRect"), Ae("customScrollParent"));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    ref: r,
    style: te
  }, e);
},
    Me = (0,_virtuoso_dev_react_urx__WEBPACK_IMPORTED_MODULE_4__.systemToComponent)(Be, {
  optional: {
    totalCount: "totalCount",
    overscan: "overscan",
    itemContent: "itemContent",
    components: "components",
    computeItemKey: "computeItemKey",
    initialItemCount: "initialItemCount",
    scrollSeekConfiguration: "scrollSeekConfiguration",
    listClassName: "listClassName",
    itemClassName: "itemClassName",
    useWindowScroll: "useWindowScroll",
    customScrollParent: "customScrollParent",
    scrollerRef: "scrollerRef",
    item: "item",
    ItemContainer: "ItemContainer",
    ScrollContainer: "ScrollContainer",
    ListContainer: "ListContainer",
    scrollSeek: "scrollSeek"
  },
  methods: {
    scrollTo: "scrollTo",
    scrollBy: "scrollBy",
    scrollToIndex: "scrollToIndex"
  },
  events: {
    isScrolling: "isScrolling",
    endReached: "endReached",
    startReached: "startReached",
    rangeChanged: "rangeChanged",
    atBottomStateChange: "atBottomStateChange",
    atTopStateChange: "atTopStateChange"
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function (t) {
  var e = u({}, t),
      r = Ae("useWindowScroll"),
      o = Ae("customScrollParent"),
      i = o || r ? Oe : Pe;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(o || r ? De : Ne, u({}, e), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(i, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Fe, null)));
})),
    Ve = Me.Component,
    Ue = Me.usePublisher,
    Ae = Me.useEmitterValue,
    We = Me.useEmitter,
    Ne = ie({
  usePublisher: Ue,
  useEmitterValue: Ae,
  useEmitter: We
}),
    De = ae({
  usePublisher: Ue,
  useEmitterValue: Ae,
  useEmitter: We
});

function Ge(t, e, n) {
  return "normal" === e || e.endsWith("px") || n(t + " was not resolved to pixel value correctly", e, p.WARN), "normal" === e ? 0 : parseInt(e, 10);
}

var _e = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function () {
  var t = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(function (t) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", null, "Item $", t);
  }),
      r = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(null),
      o = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(null),
      i = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream({}),
      a = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(jt),
      l = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStream(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.noop),
      s = function (t, n) {
    return void 0 === n && (n = null), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.statefulStreamFromEmitter(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.pipe(i, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.map(function (e) {
      return e[t];
    }), _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.distinctUntilChanged()), n);
  };

  return {
    context: r,
    itemContent: t,
    fixedHeaderContent: o,
    components: i,
    computeItemKey: a,
    scrollerRef: l,
    TableComponent: s("Table", "table"),
    TableHeadComponent: s("TableHead", "thead"),
    TableBodyComponent: s("TableBody", "tbody"),
    TableRowComponent: s("TableRow", "tr"),
    ScrollerComponent: s("Scroller", "div"),
    EmptyPlaceholder: s("EmptyPlaceholder"),
    ScrollSeekPlaceholder: s("ScrollSeekPlaceholder"),
    FillerRow: s("FillerRow")
  };
}),
    je = _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.system(function (t) {
  return u({}, t[0], t[1]);
}, _virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.tup(At, _e)),
    Ke = function (t) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", {
    style: {
      height: t.height
    }
  }));
},
    Ye = function (t) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("tr", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("td", {
    style: {
      height: t.height,
      padding: 0,
      border: 0
    }
  }));
},
    qe = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function () {
  var t = tn("listState"),
      e = Xe("sizeRanges"),
      r = tn("useWindowScroll"),
      o = tn("customScrollParent"),
      i = Xe("windowScrollContainerState"),
      a = Xe("scrollContainerState"),
      s = o || r ? i : a,
      c = tn("itemContent"),
      m = tn("trackItemSizes"),
      d = C(e, tn("itemSize"), m, s, tn("log"), void 0, o),
      f = d.callbackRef,
      p = d.ref,
      h = react__WEBPACK_IMPORTED_MODULE_1__.useState(0),
      g = h[0],
      v = h[1];
  en("deviation", function (t) {
    g !== t && (p.current.style.marginTop = t + "px", v(t));
  });
  var S = tn("EmptyPlaceholder"),
      I = tn("ScrollSeekPlaceholder") || Ke,
      T = tn("FillerRow") || Ye,
      w = tn("TableBodyComponent"),
      x = tn("TableRowComponent"),
      b = tn("computeItemKey"),
      y = tn("isSeeking"),
      E = tn("paddingTopAddition"),
      H = tn("firstItemIndex"),
      R = tn("statefulTotalCount"),
      L = tn("context");
  if (0 === R && S) return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(S, ne(S, L));
  var k = t.offsetTop + E + g,
      z = t.offsetBottom,
      B = k > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(T, {
    height: k,
    key: "padding-top"
  }) : null,
      F = z > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(T, {
    height: z,
    key: "padding-bottom"
  }) : null,
      P = t.items.map(function (t) {
    var e = t.originalIndex,
        n = b(e + H, t.data, L);
    return y ? /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(I, u({}, ne(I, L), {
      key: n,
      index: t.index,
      height: t.size,
      type: t.type || "item"
    })) : /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(x, u({}, ne(x, L), {
      key: n,
      "data-index": e,
      "data-known-size": t.size,
      "data-item-index": t.index,
      style: {
        overflowAnchor: "none"
      }
    }), c(t.index, t.data, L));
  });
  return /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.createElement)(w, u({
    ref: f,
    "data-test-id": "virtuoso-item-list"
  }, ne(w, L)), [B].concat(P, [F]));
}),
    Ze = function (t) {
  var r = t.children,
      o = Xe("viewportHeight"),
      i = I(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.compose(o, function (t) {
    return T(t, "height");
  }));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    style: te,
    ref: i,
    "data-viewport-type": "element"
  }, r);
},
    Je = function (t) {
  var e = t.children,
      r = Nt(Xe("windowViewportRect"), tn("customScrollParent"));
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
    ref: r,
    style: te,
    "data-viewport-type": "window"
  }, e);
},
    $e = (0,_virtuoso_dev_react_urx__WEBPACK_IMPORTED_MODULE_4__.systemToComponent)(je, {
  required: {},
  optional: {
    context: "context",
    followOutput: "followOutput",
    firstItemIndex: "firstItemIndex",
    itemContent: "itemContent",
    fixedHeaderContent: "fixedHeaderContent",
    overscan: "overscan",
    increaseViewportBy: "increaseViewportBy",
    totalCount: "totalCount",
    topItemCount: "topItemCount",
    initialTopMostItemIndex: "initialTopMostItemIndex",
    components: "components",
    groupCounts: "groupCounts",
    atBottomThreshold: "atBottomThreshold",
    atTopThreshold: "atTopThreshold",
    computeItemKey: "computeItemKey",
    defaultItemHeight: "defaultItemHeight",
    fixedItemHeight: "fixedItemHeight",
    itemSize: "itemSize",
    scrollSeekConfiguration: "scrollSeekConfiguration",
    data: "data",
    initialItemCount: "initialItemCount",
    initialScrollTop: "initialScrollTop",
    alignToBottom: "alignToBottom",
    useWindowScroll: "useWindowScroll",
    customScrollParent: "customScrollParent",
    scrollerRef: "scrollerRef",
    logLevel: "logLevel",
    react18ConcurrentRendering: "react18ConcurrentRendering"
  },
  methods: {
    scrollToIndex: "scrollToIndex",
    scrollIntoView: "scrollIntoView",
    scrollTo: "scrollTo",
    scrollBy: "scrollBy"
  },
  events: {
    isScrolling: "isScrolling",
    endReached: "endReached",
    startReached: "startReached",
    rangeChanged: "rangeChanged",
    atBottomStateChange: "atBottomStateChange",
    atTopStateChange: "atTopStateChange",
    totalListHeightChanged: "totalListHeightChanged",
    itemsRendered: "itemsRendered",
    groupIndices: "groupIndices"
  }
}, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(function (t) {
  var r = tn("useWindowScroll"),
      o = tn("customScrollParent"),
      i = Xe("fixedHeaderHeight"),
      a = tn("fixedHeaderContent"),
      l = tn("context"),
      s = I(_virtuoso_dev_urx__WEBPACK_IMPORTED_MODULE_3__.compose(i, function (t) {
    return T(t, "height");
  })),
      c = o || r ? rn : nn,
      m = o || r ? Je : Ze,
      d = tn("TableComponent"),
      f = tn("TableHeadComponent"),
      p = a ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(f, u({
    key: "TableHead",
    style: {
      zIndex: 1,
      position: "sticky",
      top: 0
    },
    ref: s
  }, ne(f, l)), a()) : null;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(c, u({}, t), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(m, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(d, u({
    style: {
      borderSpacing: 0
    }
  }, ne(d, l)), [p, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(qe, {
    key: "TableBody"
  })])));
})),
    Qe = $e.Component,
    Xe = $e.usePublisher,
    tn = $e.useEmitterValue,
    en = $e.useEmitter,
    nn = ie({
  usePublisher: Xe,
  useEmitterValue: tn,
  useEmitter: en
}),
    rn = ae({
  usePublisher: Xe,
  useEmitterValue: tn,
  useEmitter: en
}),
    on = me,
    an = me,
    ln = Qe,
    sn = Ve;



/***/ }),

/***/ 225:
/*!********************************************!*\
  !*** ./node_modules/stringz/dist/index.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
})); // @ts-ignore

var char_regex_1 = __importDefault(__webpack_require__(/*! char-regex */ 738));
/**
 * Converts a string to an array of string chars
 * @param {string} str The string to turn into array
 * @returns {string[]}
 */


function toArray(str) {
  if (typeof str !== 'string') {
    throw new Error('A string is expected as input');
  }

  return str.match(char_regex_1.default()) || [];
}

exports.toArray = toArray;
/**
 * Returns the length of a string
 *
 * @export
 * @param {string} str
 * @returns {number}
 */

function length(str) {
  // Check for input
  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }

  var match = str.match(char_regex_1.default());
  return match === null ? 0 : match.length;
}

exports.length = length;
/**
 * Returns a substring by providing start and end position
 *
 * @export
 * @param {string} str
 * @param {number} [begin=0] Starting position
 * @param {number} end End position
 * @returns {string}
 */

function substring(str, begin, end) {
  if (begin === void 0) {
    begin = 0;
  } // Check for input


  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  } // Even though negative numbers work here, theyre not in the spec


  if (typeof begin !== 'number' || begin < 0) {
    begin = 0;
  }

  if (typeof end === 'number' && end < 0) {
    end = 0;
  }

  var match = str.match(char_regex_1.default());
  if (!match) return '';
  return match.slice(begin, end).join('');
}

exports.substring = substring;
/**
 * Returns a substring by providing start position and length
 *
 * @export
 * @param {string} str
 * @param {number} [begin=0] Starting position
 * @param {number} len Desired length
 * @returns {string}
 */

function substr(str, begin, len) {
  if (begin === void 0) {
    begin = 0;
  } // Check for input


  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }

  var strLength = length(str); // Fix type

  if (typeof begin !== 'number') {
    begin = parseInt(begin, 10);
  } // Return zero-length string if got oversize number.


  if (begin >= strLength) {
    return '';
  } // Calculating postive version of negative value.


  if (begin < 0) {
    begin += strLength;
  }

  var end;

  if (typeof len === 'undefined') {
    end = strLength;
  } else {
    // Fix type
    if (typeof len !== 'number') {
      len = parseInt(len, 10);
    }

    end = len >= 0 ? len + begin : begin;
  }

  var match = str.match(char_regex_1.default());
  if (!match) return '';
  return match.slice(begin, end).join('');
}

exports.substr = substr;
/**
 * Enforces a string to be a certain length by
 * adding or removing characters
 *
 * @export
 * @param {string} str
 * @param {number} [limit=16] Limit
 * @param {string} [padString='#'] The Pad String
 * @param {string} [padPosition='right'] The Pad Position
 * @returns {string}
 */

function limit(str, limit, padString, padPosition) {
  if (limit === void 0) {
    limit = 16;
  }

  if (padString === void 0) {
    padString = '#';
  }

  if (padPosition === void 0) {
    padPosition = 'right';
  } // Input should be a string, limit should be a number


  if (typeof str !== 'string' || typeof limit !== 'number') {
    throw new Error('Invalid arguments specified');
  } // Pad position should be either left or right


  if (['left', 'right'].indexOf(padPosition) === -1) {
    throw new Error('Pad position should be either left or right');
  } // Pad string can be anything, we convert it to string


  if (typeof padString !== 'string') {
    padString = String(padString);
  } // Calculate string length considering astral code points


  var strLength = length(str);

  if (strLength > limit) {
    return substring(str, 0, limit);
  } else if (strLength < limit) {
    var padRepeats = padString.repeat(limit - strLength);
    return padPosition === 'left' ? padRepeats + str : str + padRepeats;
  }

  return str;
}

exports.limit = limit;
/**
 * Returns the index of the first occurrence of a given string
 *
 * @export
 * @param {string} str
 * @param {string} [searchStr] the string to search
 * @param {number} [pos] starting position
 * @returns {number}
 */

function indexOf(str, searchStr, pos) {
  if (pos === void 0) {
    pos = 0;
  }

  if (typeof str !== 'string') {
    throw new Error('Input must be a string');
  }

  if (str === '') {
    if (searchStr === '') {
      return 0;
    }

    return -1;
  } // fix type


  pos = Number(pos);
  pos = isNaN(pos) ? 0 : pos;
  searchStr = String(searchStr);
  var strArr = toArray(str);

  if (pos >= strArr.length) {
    if (searchStr === '') {
      return strArr.length;
    }

    return -1;
  }

  if (searchStr === '') {
    return pos;
  }

  var searchArr = toArray(searchStr);
  var finded = false;
  var index;

  for (index = pos; index < strArr.length; index += 1) {
    var searchIndex = 0;

    while (searchIndex < searchArr.length && searchArr[searchIndex] === strArr[index + searchIndex]) {
      searchIndex += 1;
    }

    if (searchIndex === searchArr.length && searchArr[searchIndex - 1] === strArr[index + searchIndex - 1]) {
      finded = true;
      break;
    }
  }

  return finded ? index : -1;
}

exports.indexOf = indexOf;

/***/ }),

/***/ 1344:
/*!********************************************************************!*\
  !*** ./node_modules/use-composed-ref/dist/use-composed-ref.esm.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);


var updateRef = function updateRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  ref.current = value;
};

var useComposedRef = function useComposedRef(libRef, userRef) {
  var prevUserRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (instance) {
    libRef.current = instance;

    if (prevUserRef.current) {
      updateRef(prevUserRef.current, null);
    }

    prevUserRef.current = userRef;

    if (!userRef) {
      return;
    }

    updateRef(userRef, instance);
  }, [userRef]);
};

/* harmony default export */ __webpack_exports__["default"] = (useComposedRef);

/***/ }),

/***/ 1343:
/*!****************************************************************************************************!*\
  !*** ./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js ***!
  \****************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);

var index = react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect;
/* harmony default export */ __webpack_exports__["default"] = (index);

/***/ }),

/***/ 1342:
/*!********************************************************!*\
  !*** ./node_modules/use-latest/dist/use-latest.esm.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ useLatest; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! use-isomorphic-layout-effect */ 1343);



var useLatest = function useLatest(value) {
  var ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef(value);
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
    ref.current = value;
  });
  return ref;
};



/***/ }),

/***/ 313:
/*!*****************************************!*\
  !*** ./node_modules/warning/warning.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

__webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);

var __DEV__ = "development" !== 'production';

var warning = function () {};

if (__DEV__) {
  var printWarning = function printWarning(format, args) {
    var len = arguments.length;
    args = new Array(len > 1 ? len - 1 : 0);

    for (var key = 1; key < len; key++) {
      args[key - 1] = arguments[key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function (condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);

    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }

    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (!condition) {
      printWarning.apply(null, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),

/***/ 94:
/*!**************************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views-core/node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**************************************************************************************************************/
/***/ (function(module) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ 752:
/*!*********************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \*********************************************************************************************************/
/***/ (function(module) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),

/***/ 749:
/*!**************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \**************************************************************************************************/
/***/ (function(module) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),

/***/ 750:
/*!***********************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/createClass.js ***!
  \***********************************************************************************************/
/***/ (function(module) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),

/***/ 517:
/*!*******************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/extends.js ***!
  \*******************************************************************************************/
/***/ (function(module) {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
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

  return _extends.apply(this, arguments);
}

module.exports = _extends;

/***/ }),

/***/ 518:
/*!**************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \**************************************************************************************************/
/***/ (function(module) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),

/***/ 753:
/*!********************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/inherits.js ***!
  \********************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf */ 519);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),

/***/ 746:
/*!*********************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \*********************************************************************************************************/
/***/ (function(module) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ 397:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/interopRequireWildcard.js ***!
  \**********************************************************************************************************/
/***/ (function(module) {

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

          if (desc.get || desc.set) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
    }

    newObj.default = obj;
    return newObj;
  }
}

module.exports = _interopRequireWildcard;

/***/ }),

/***/ 747:
/*!***********************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/objectWithoutProperties.js ***!
  \***********************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var objectWithoutPropertiesLoose = __webpack_require__(/*! ./objectWithoutPropertiesLoose */ 748);

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

module.exports = _objectWithoutProperties;

/***/ }),

/***/ 748:
/*!****************************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/objectWithoutPropertiesLoose.js ***!
  \****************************************************************************************************************/
/***/ (function(module) {

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

module.exports = _objectWithoutPropertiesLoose;

/***/ }),

/***/ 751:
/*!*************************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \*************************************************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ../helpers/typeof */ 454);

var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized */ 752);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),

/***/ 519:
/*!**************************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \**************************************************************************************************/
/***/ (function(module) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),

/***/ 454:
/*!******************************************************************************************!*\
  !*** ./node_modules/react-swipeable-views/node_modules/@babel/runtime/helpers/typeof.js ***!
  \******************************************************************************************/
/***/ (function(module) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ 1450:
/*!***************************************************!*\
  !*** ./app/soapbox/components/account_search.tsx ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_autosuggest_account_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/autosuggest_account_input */ 726);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon */ 25);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/account_search.tsx";
var _excluded = ["onSelected"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    placeholder: {
        "id": "account_search.placeholder",
        "defaultMessage": "Search for an account"
    }
});
/** Input to search for accounts. */
var AccountSearch = function (_ref) {
    var onSelected = _ref.onSelected, rest = _objectWithoutProperties(_ref, _excluded);
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(''), value = _a[0], setValue = _a[1];
    var isEmpty = function () {
        return !(value.length > 0);
    };
    var clearState = function () {
        setValue('');
    };
    var handleChange = function (_ref2) {
        var target = _ref2.target;
        setValue(target.value);
    };
    var handleSelected = function (accountId) {
        clearState();
        onSelected(accountId);
    };
    var handleClear = function (e) {
        e.preventDefault();
        if (!isEmpty()) {
            setValue('');
        }
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Escape') {
            var _document$querySelect, _document$querySelect2;
            (_document$querySelect = document.querySelector('.ui')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.parentElement) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.focus();
        }
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "search search--account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("label", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("span", {
        style: {
            display: 'none'
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.placeholder)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_autosuggest_account_input__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({
        className: "rounded-full",
        placeholder: intl.formatMessage(messages.placeholder),
        value: value,
        onChange: handleChange,
        onSelected: handleSelected,
        onKeyDown: handleKeyDown
    }, rest, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 9
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        role: "button",
        tabIndex: 0,
        className: "search__icon",
        onClick: handleClear,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_4__["default"], {
        src: __webpack_require__(/*! @tabler/icons/search.svg */ 221),
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('svg-icon--search', {
            active: isEmpty()
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_4__["default"], {
        src: __webpack_require__(/*! @tabler/icons/backspace.svg */ 817),
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('svg-icon--backspace', {
            active: !isEmpty()
        }),
        "aria-label": intl.formatMessage(messages.placeholder),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (AccountSearch);


/***/ }),

/***/ 1219:
/*!*********************************************************!*\
  !*** ./app/soapbox/components/autosuggest_textarea.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _reach_portal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @reach/portal */ 189);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-pure-component */ 156);
/* harmony import */ var react_textarea_autosize__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-textarea-autosize */ 1285);
/* harmony import */ var _features_compose_components_autosuggest_account__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../features/compose/components/autosuggest_account */ 728);
/* harmony import */ var _rtl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../rtl */ 259);
/* harmony import */ var _autosuggest_emoji__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./autosuggest_emoji */ 727);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/autosuggest_textarea.tsx";
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }










var textAtCursorMatchesToken = function (str, caretPosition) {
    var word;
    var left = str.slice(0, caretPosition).search(/\S+$/);
    var right = str.slice(caretPosition).search(/\s/);
    if (right < 0) {
        word = str.slice(left);
    }
    else {
        word = str.slice(left, right + caretPosition);
    }
    if (!word || word.trim().length < 3 || !['@', ':', '#'].includes(word[0])) {
        return [null, null];
    }
    word = word.trim().toLowerCase();
    if (word.length > 0) {
        return [left + 1, word];
    }
    else {
        return [null, null];
    }
};
var AutosuggestTextarea = /** @class */ (function (_super) {
    __extends(AutosuggestTextarea, _super);
    function AutosuggestTextarea() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "textarea", null);
        _defineProperty(_this, "state", {
            suggestionsHidden: true,
            focused: false,
            selectedSuggestion: 0,
            lastToken: null,
            tokenStart: 0
        });
        _defineProperty(_this, "onChange", function (e) {
            var _a = textAtCursorMatchesToken(e.target.value, e.target.selectionStart), tokenStart = _a[0], token = _a[1];
            if (token !== null && _this.state.lastToken !== token) {
                _this.setState({
                    lastToken: token,
                    selectedSuggestion: 0,
                    tokenStart: tokenStart
                });
                _this.props.onSuggestionsFetchRequested(token);
            }
            else if (token === null) {
                _this.setState({
                    lastToken: null
                });
                _this.props.onSuggestionsClearRequested();
            }
            _this.props.onChange(e);
        });
        _defineProperty(_this, "onKeyDown", function (e) {
            var _a = _this.props, suggestions = _a.suggestions, disabled = _a.disabled;
            var _b = _this.state, selectedSuggestion = _b.selectedSuggestion, suggestionsHidden = _b.suggestionsHidden;
            if (disabled) {
                e.preventDefault();
                return;
            }
            if (e.which === 229 || e.isComposing) {
                // Ignore key events during text composition
                // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
                return;
            }
            switch (e.key) {
                case 'Escape':
                    if (suggestions.size === 0 || suggestionsHidden) {
                        var _document$querySelect, _document$querySelect2;
                        (_document$querySelect = document.querySelector('.ui')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.parentElement) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.focus();
                    }
                    else {
                        e.preventDefault();
                        _this.setState({
                            suggestionsHidden: true
                        });
                    }
                    break;
                case 'ArrowDown':
                    if (suggestions.size > 0 && !suggestionsHidden) {
                        e.preventDefault();
                        _this.setState({
                            selectedSuggestion: Math.min(selectedSuggestion + 1, suggestions.size - 1)
                        });
                    }
                    break;
                case 'ArrowUp':
                    if (suggestions.size > 0 && !suggestionsHidden) {
                        e.preventDefault();
                        _this.setState({
                            selectedSuggestion: Math.max(selectedSuggestion - 1, 0)
                        });
                    }
                    break;
                case 'Enter':
                case 'Tab':
                    // Select suggestion
                    if (_this.state.lastToken !== null && suggestions.size > 0 && !suggestionsHidden) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.props.onSuggestionSelected(_this.state.tokenStart, _this.state.lastToken, suggestions.get(selectedSuggestion));
                    }
                    break;
            }
            if (e.defaultPrevented || !_this.props.onKeyDown) {
                return;
            }
            _this.props.onKeyDown(e);
        });
        _defineProperty(_this, "onBlur", function () {
            _this.setState({
                suggestionsHidden: true,
                focused: false
            });
            if (_this.props.onBlur) {
                _this.props.onBlur();
            }
        });
        _defineProperty(_this, "onFocus", function () {
            _this.setState({
                focused: true
            });
            if (_this.props.onFocus) {
                _this.props.onFocus();
            }
        });
        _defineProperty(_this, "onSuggestionClick", function (e) {
            var _this$textarea;
            var suggestion = _this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
            e.preventDefault();
            _this.props.onSuggestionSelected(_this.state.tokenStart, _this.state.lastToken, suggestion);
            (_this$textarea = _this.textarea) === null || _this$textarea === void 0 ? void 0 : _this$textarea.focus();
        });
        _defineProperty(_this, "setTextarea", function (c) {
            _this.textarea = c;
        });
        _defineProperty(_this, "onPaste", function (e) {
            if (e.clipboardData && e.clipboardData.files.length === 1) {
                _this.props.onPaste(e.clipboardData.files);
                e.preventDefault();
            }
        });
        _defineProperty(_this, "renderSuggestion", function (suggestion, i) {
            var selectedSuggestion = _this.state.selectedSuggestion;
            var inner, key;
            if (typeof suggestion === 'object') {
                inner = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_autosuggest_emoji__WEBPACK_IMPORTED_MODULE_7__["default"], {
                    emoji: suggestion,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 205,
                        columnNumber: 15
                    }
                });
                key = suggestion.id;
            }
            else if (suggestion[0] === '#') {
                inner = suggestion;
                key = suggestion;
            }
            else {
                inner = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_features_compose_components_autosuggest_account__WEBPACK_IMPORTED_MODULE_5__["default"], {
                    id: suggestion,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 211,
                        columnNumber: 15
                    }
                });
                key = suggestion;
            }
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                role: "button",
                tabIndex: 0,
                key: key,
                "data-index": i,
                className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
                    'px-4 py-2.5 text-sm text-gray-700 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group': true,
                    'bg-gray-100 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700': i === selectedSuggestion
                }),
                onMouseDown: _this.onSuggestionClick,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 216,
                    columnNumber: 7
                }
            }, inner);
        });
        return _this;
    }
    AutosuggestTextarea.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        // Skip updating when only the lastToken changes so the
        // cursor doesn't jump around due to re-rendering unnecessarily
        var lastTokenUpdated = this.state.lastToken !== nextState.lastToken;
        var valueUpdated = this.props.value !== nextProps.value;
        if (lastTokenUpdated && !valueUpdated) {
            return false;
        }
        else {
            return _super.prototype.shouldComponentUpdate.call(this, nextProps, nextState, undefined);
        }
    };
    AutosuggestTextarea.prototype.componentDidUpdate = function (prevProps, prevState) {
        var suggestions = this.props.suggestions;
        if (suggestions !== prevProps.suggestions && suggestions.size > 0 && prevState.suggestionsHidden && prevState.focused) {
            this.setState({
                suggestionsHidden: false
            });
        }
    };
    AutosuggestTextarea.prototype.setPortalPosition = function () {
        if (!this.textarea) {
            return {};
        }
        var _a = this.textarea.getBoundingClientRect(), top = _a.top, height = _a.height, left = _a.left, width = _a.width;
        return {
            top: top + height,
            left: left,
            width: width
        };
    };
    AutosuggestTextarea.prototype.render = function () {
        var _a = this.props, value = _a.value, suggestions = _a.suggestions, disabled = _a.disabled, placeholder = _a.placeholder, onKeyUp = _a.onKeyUp, autoFocus = _a.autoFocus, children = _a.children, condensed = _a.condensed, id = _a.id;
        var suggestionsHidden = this.state.suggestionsHidden;
        var style = {
            direction: 'ltr',
            minRows: 10
        };
        if ((0,_rtl__WEBPACK_IMPORTED_MODULE_6__.isRtl)(value)) {
            style.direction = 'rtl';
        }
        return [/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                key: "textarea",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 256,
                    columnNumber: 7
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                className: "relative",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 257,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("label", {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 258,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
                style: {
                    display: 'none'
                },
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 259,
                    columnNumber: 13
                }
            }, placeholder), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_textarea_autosize__WEBPACK_IMPORTED_MODULE_8__["default"], {
                ref: this.setTextarea,
                className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('transition-[min-height] motion-reduce:transition-none dark:bg-slate-800 px-0 border-0 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none w-full focus:shadow-none focus:border-0 focus:ring-0', {
                    'min-h-[40px]': condensed,
                    'min-h-[100px]': !condensed
                }),
                id: id,
                disabled: disabled,
                placeholder: placeholder,
                autoFocus: autoFocus,
                value: value,
                onChange: this.onChange,
                onKeyDown: this.onKeyDown,
                onKeyUp: onKeyUp,
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                onPaste: this.onPaste,
                style: style,
                "aria-autocomplete": "list",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 261,
                    columnNumber: 13
                }
            }))), children), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_reach_portal__WEBPACK_IMPORTED_MODULE_9__["default"], {
                key: "portal",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 287,
                    columnNumber: 7
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                style: this.setPortalPosition(),
                className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
                    'fixed z-1000 shadow bg-white dark:bg-slate-900 rounded-lg py-1 space-y-0': true,
                    hidden: suggestionsHidden || suggestions.isEmpty(),
                    block: !suggestionsHidden && !suggestions.isEmpty()
                }),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 288,
                    columnNumber: 9
                }
            }, suggestions.map(this.renderSuggestion)))];
    };
    return AutosuggestTextarea;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__["default"]));
_defineProperty(AutosuggestTextarea, "defaultProps", {
    autoFocus: true
});
/* harmony default export */ __webpack_exports__["default"] = (AutosuggestTextarea);


/***/ }),

/***/ 1458:
/*!********************************************!*\
  !*** ./app/soapbox/components/hashtag.tsx ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_sparklines__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-sparklines */ 520);
/* harmony import */ var react_sparklines__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_sparklines__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/soapbox */ 66);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _utils_numbers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/numbers */ 88);
/* harmony import */ var _permalink__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./permalink */ 789);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/hashtag.tsx";








var Hashtag = function (_ref) {
    var _hashtag$history, _hashtag$history$get;
    var hashtag = _ref.hashtag;
    var count = Number((_hashtag$history = hashtag.history) === null || _hashtag$history === void 0 ? void 0 : (_hashtag$history$get = _hashtag$history.get(0)) === null || _hashtag$history$get === void 0 ? void 0 : _hashtag$history$get.accounts);
    var brandColor = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return (0,soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_2__.getSoapboxConfig)(state).brandColor; });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_6__.HStack, {
        alignItems: "center",
        justifyContent: "between",
        "data-testid": "hashtag",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_permalink__WEBPACK_IMPORTED_MODULE_5__["default"], {
        href: hashtag.url,
        to: "/tag/".concat(hashtag.name),
        className: "hover:underline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        tag: "span",
        size: "sm",
        weight: "semibold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 11
        }
    }, "#", hashtag.name)), hashtag.history && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: "trends.count_by_accounts",
        defaultMessage: "{count} {rawCount, plural, one {person} other {people}} talking",
        values: {
            rawCount: count,
            count: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 37,
                    columnNumber: 24
                }
            }, (0,_utils_numbers__WEBPACK_IMPORTED_MODULE_4__.shortNumberFormat)(count))
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 13
        }
    }))), hashtag.history && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "w-[40px]",
        "data-testid": "sparklines",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_sparklines__WEBPACK_IMPORTED_MODULE_1__.Sparklines, {
        width: 40,
        height: 28,
        data: hashtag.history.reverse().map(function (day) { return +day.uses; }).toArray(),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_sparklines__WEBPACK_IMPORTED_MODULE_1__.SparklinesCurve, {
        style: {
            fill: 'none'
        },
        color: brandColor,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 13
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (Hashtag);


/***/ }),

/***/ 1209:
/*!*********************************************!*\
  !*** ./app/soapbox/components/load_gap.tsx ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/icon */ 25);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/load_gap.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    load_more: {
        "id": "status.load_more",
        "defaultMessage": "Load more"
    }
});
var LoadGap = function (_ref) {
    var disabled = _ref.disabled, maxId = _ref.maxId, onClick = _ref.onClick;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])();
    var handleClick = function () { return onClick(maxId); };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
        className: "load-more load-gap",
        disabled: disabled,
        onClick: handleClick,
        "aria-label": intl.formatMessage(messages.load_more),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {
        src: __webpack_require__(/*! @tabler/icons/dots.svg */ 187),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (LoadGap);


/***/ }),

/***/ 815:
/*!**********************************************!*\
  !*** ./app/soapbox/components/load_more.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/load_more.tsx";



var LoadMore = function (_ref) {
    var onClick = _ref.onClick, disabled = _ref.disabled, _a = _ref.visible, visible = _a === void 0 ? true : _a;
    if (!visible) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        theme: "primary",
        block: true,
        disabled: disabled || !visible,
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "status.load_more",
        defaultMessage: "Load more",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (LoadMore);


/***/ }),

/***/ 1447:
/*!******************************************************!*\
  !*** ./app/soapbox/components/missing_indicator.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/missing_indicator.tsx";



var MissingIndicator = function (_ref) {
    var _a = _ref.nested, nested = _a === void 0 ? false : _a;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        variant: nested ? undefined : 'rounded',
        size: "lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 3
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        weight: "medium",
        align: "center",
        size: "lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 14,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "missing_indicator.label",
        tagName: "strong",
        defaultMessage: "Not found",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "muted",
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "missing_indicator.sublabel",
        defaultMessage: "This resource could not be found",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 11
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (MissingIndicator);


/***/ }),

/***/ 789:
/*!**********************************************!*\
  !*** ./app/soapbox/components/permalink.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ 13);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/permalink.tsx";
var _excluded = ["className", "href", "title", "to", "children"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }


var Permalink = function (props) {
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useHistory)();
    var className = props.className, href = props.href, title = props.title, to = props.to, children = props.children, filteredProps = _objectWithoutProperties(props, _excluded);
    var handleClick = function (event) {
        if (event.button === 0 && !(event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            history.push(to);
        }
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", _extends({
        target: "_blank",
        href: href,
        onClick: handleClick,
        title: title,
        className: "permalink".concat(className ? ' ' + className : '')
    }, filteredProps, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 5
        }
    }), children);
};
/* harmony default export */ __webpack_exports__["default"] = (Permalink);


/***/ }),

/***/ 1348:
/*!****************************************************!*\
  !*** ./app/soapbox/components/progress_circle.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/progress_circle.tsx";


var ProgressCircle = function (_ref) {
    var progress = _ref.progress, _a = _ref.radius, radius = _a === void 0 ? 12 : _a, _b = _ref.stroke, stroke = _b === void 0 ? 4 : _b, title = _ref.title;
    var progressStroke = stroke + 0.5;
    var actualRadius = radius + progressStroke;
    var circumference = 2 * Math.PI * radius;
    var dashoffset = circumference * (1 - Math.min(progress, 1));
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        title: title,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("svg", {
        width: actualRadius * 2,
        height: actualRadius * 2,
        viewBox: "0 0 ".concat(actualRadius * 2, " ").concat(actualRadius * 2),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("circle", {
        className: "stroke-gray-400",
        cx: actualRadius,
        cy: actualRadius,
        r: radius,
        fill: "none",
        strokeWidth: stroke,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("circle", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('stroke-primary-800', {
            'stroke-danger-600': progress > 1
        }),
        style: {
            strokeDashoffset: dashoffset,
            strokeDasharray: circumference
        },
        cx: actualRadius,
        cy: actualRadius,
        r: radius,
        fill: "none",
        strokeWidth: progressStroke,
        strokeLinecap: "round",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ProgressCircle);


/***/ }),

/***/ 931:
/*!******************************************************!*\
  !*** ./app/soapbox/components/scroll-top-button.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/throttle */ 83);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/scroll-top-button.tsx";







/** Floating new post counter above timelines, clicked to scroll to top. */
var ScrollTopButton = function (_ref) {
    var onClick = _ref.onClick, count = _ref.count, message = _ref.message, _a = _ref.threshold, threshold = _a === void 0 ? 400 : _a, _b = _ref.autoloadThreshold, autoloadThreshold = _b === void 0 ? 50 : _b;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useSettings)();
    var timer = react__WEBPACK_IMPORTED_MODULE_2__.useRef(null);
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), scrolled = _c[0], setScrolled = _c[1];
    var autoload = settings.get('autoloadTimelines') === true;
    var getScrollTop = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(function () {
        return (document.scrollingElement || document.documentElement).scrollTop;
    }, []);
    var maybeUnload = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(function () {
        // we need to add a timer since there is a delay between content render and
        // scroll top calculation. Without it, new content is always loaded because
        // scrollTop is 0 at first.
        if (timer.current)
            clearTimeout(timer.current);
        timer.current = setTimeout(function () {
            if (count > 0 && autoload && getScrollTop() <= autoloadThreshold) {
                onClick();
            }
            timer.current = null;
        }, 250);
    }, [autoload, autoloadThreshold, onClick, count]);
    var handleScroll = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(lodash_throttle__WEBPACK_IMPORTED_MODULE_1___default()(function () {
        if (getScrollTop() > threshold) {
            setScrolled(true);
        }
        else {
            setScrolled(false);
        }
    }, 150, {
        trailing: true
    }), [threshold]);
    var scrollUp = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(function () {
        window.scrollTo({
            top: 0
        });
    }, []);
    var handleClick = function () {
        setTimeout(scrollUp, 10);
        onClick();
    };
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        window.addEventListener('scroll', handleScroll);
        return function () {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onClick]);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        maybeUnload();
    }, [maybeUnload]);
    var visible = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(function () { return count > 0 && scrolled; }, [count, scrolled]);
    if (!visible)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "left-1/2 -translate-x-1/2 fixed top-20 z-50",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", {
        className: "flex items-center bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-100 transition-transform text-white rounded-full px-4 py-2 space-x-1.5 cursor-pointer whitespace-nowrap",
        onClick: handleClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: __webpack_require__(/*! @tabler/icons/arrow-bar-to-up.svg */ 1208),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        theme: "inherit",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 9
        }
    }, intl.formatMessage(message, {
        count: count
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (ScrollTopButton);


/***/ }),

/***/ 843:
/*!****************************************************!*\
  !*** ./app/soapbox/components/scrollable_list.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var react_virtuoso__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-virtuoso */ 842);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _load_more__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./load_more */ 815);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/scrollable_list.tsx";
var _excluded = ["context"], _excluded2 = ["context"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }







/** Custom Viruoso component context. */
/** Custom Virtuoso Item component representing a single scrollable item. */
// NOTE: It's crucial to space lists with **padding** instead of margin!
// Pass an `itemClassName` like `pb-3`, NOT a `space-y-3` className
// https://virtuoso.dev/troubleshooting#list-does-not-scroll-to-the-bottom--items-jump-around
var Item = function (_ref) {
    var context = _ref.context, rest = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", _extends({
        className: context === null || context === void 0 ? void 0 : context.itemClassName
    }, rest, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 3
        }
    }));
};
/** Custom Virtuoso List component for the outer container. */
// Ensure the className winds up here
var List = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(function (props, ref) {
    var context = props.context, rest = _objectWithoutProperties(props, _excluded2);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", _extends({
        ref: ref,
        className: context === null || context === void 0 ? void 0 : context.listClassName
    }, rest, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 10
        }
    }));
});
/** Legacy ScrollableList with Virtuoso for backwards-compatibility. */
var ScrollableList = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(function (_ref2, ref) {
    var scrollKey = _ref2.scrollKey, _a = _ref2.prepend, prepend = _a === void 0 ? null : _a, alwaysPrepend = _ref2.alwaysPrepend, children = _ref2.children, isLoading = _ref2.isLoading, emptyMessage = _ref2.emptyMessage, showLoading = _ref2.showLoading, onRefresh = _ref2.onRefresh, onScroll = _ref2.onScroll, onScrollToTop = _ref2.onScrollToTop, onLoadMore = _ref2.onLoadMore, className = _ref2.className, itemClassName = _ref2.itemClassName, id = _ref2.id, hasMore = _ref2.hasMore, Placeholder = _ref2.placeholderComponent, _b = _ref2.placeholderCount, placeholderCount = _b === void 0 ? 0 : _b, _c = _ref2.initialTopMostItemIndex, initialTopMostItemIndex = _c === void 0 ? 0 : _c, _d = _ref2.style, style = _d === void 0 ? {} : _d, _e = _ref2.useWindowScroll, useWindowScroll = _e === void 0 ? true : _e;
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useHistory)();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSettings)();
    var autoloadMore = settings.get('autoloadMore'); // Preserve scroll position
    var scrollDataKey = "soapbox:scrollData:".concat(scrollKey);
    var scrollData = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return JSON.parse(sessionStorage.getItem(scrollDataKey)); }, [scrollDataKey]);
    var topIndex = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(scrollData ? scrollData.index : 0);
    var topOffset = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(scrollData ? scrollData.offset : 0);
    /** Normalized children. */
    var elements = Array.from(children || []);
    var showPlaceholder = showLoading && Placeholder && placeholderCount > 0; // NOTE: We are doing some trickery to load a feed of placeholders
    // Virtuoso's `EmptyPlaceholder` unfortunately doesn't work for our use-case
    var data = showPlaceholder ? Array(placeholderCount).fill('') : elements; // Add a placeholder at the bottom for loading
    // (Don't use Virtuoso's `Footer` component because it doesn't preserve its height)
    if (hasMore && (autoloadMore || isLoading) && Placeholder) {
        data.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(Placeholder, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 127,
                columnNumber: 15
            }
        }));
    }
    else if (hasMore && (autoloadMore || isLoading)) {
        data.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 129,
                columnNumber: 15
            }
        }));
    }
    var handleScroll = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function () {
        // HACK: Virtuoso has no better way to get this...
        var node = document.querySelector("[data-virtuoso-scroller] [data-item-index=\"".concat(topIndex.current, "\"]"));
        if (node) {
            topOffset.current = node.getBoundingClientRect().top * -1;
        }
        else {
            topOffset.current = 0;
        }
    }, 150, {
        trailing: true
    }), []);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        document.addEventListener('scroll', handleScroll);
        sessionStorage.removeItem(scrollDataKey);
        return function () {
            if (scrollKey) {
                var data_1 = {
                    index: topIndex.current,
                    offset: topOffset.current
                };
                sessionStorage.setItem(scrollDataKey, JSON.stringify(data_1));
            }
            document.removeEventListener('scroll', handleScroll);
        };
    }, []);
    /* Render an empty state instead of the scrollable list. */
    var renderEmpty = function () {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "mt-2",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 158,
                columnNumber: 7
            }
        }, alwaysPrepend && prepend, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.Card, {
            variant: "rounded",
            size: "lg",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 161,
                columnNumber: 9
            }
        }, isLoading ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 163,
                columnNumber: 13
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 165,
                columnNumber: 13
            }
        }, emptyMessage)));
    };
    /** Render a single item. */
    var renderItem = function (_i, element) {
        if (showPlaceholder) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(Placeholder, {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 175,
                    columnNumber: 14
                }
            });
        }
        else {
            return element;
        }
    };
    var handleEndReached = function () {
        if (autoloadMore && hasMore && onLoadMore) {
            onLoadMore();
        }
    };
    var loadMore = function () {
        if (autoloadMore || !hasMore || !onLoadMore) {
            return null;
        }
        else {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_load_more__WEBPACK_IMPORTED_MODULE_3__["default"], {
                visible: !isLoading,
                onClick: onLoadMore,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 191,
                    columnNumber: 14
                }
            });
        }
    };
    var handleRangeChange = function (range) {
        // HACK: using the first index can be buggy.
        // Track the second item instead, unless the endIndex comes before it (eg one 1 item in view).
        topIndex.current = Math.min(range.startIndex + 1, range.endIndex);
        handleScroll();
    };
    /** Figure out the initial index to scroll to. */
    var initialIndex = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () {
        if (showLoading)
            return 0;
        if (initialTopMostItemIndex)
            return initialTopMostItemIndex;
        if (scrollData && history.action === 'POP') {
            return {
                align: 'start',
                index: scrollData.index,
                offset: scrollData.offset
            };
        }
        return 0;
    }, [showLoading, initialTopMostItemIndex]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_virtuoso__WEBPACK_IMPORTED_MODULE_6__.Virtuoso, {
        ref: ref,
        id: id,
        useWindowScroll: useWindowScroll,
        className: className,
        data: data,
        startReached: onScrollToTop,
        endReached: handleEndReached,
        isScrolling: function (isScrolling) { return isScrolling && onScroll && onScroll(); },
        itemContent: renderItem,
        initialTopMostItemIndex: initialIndex,
        rangeChanged: handleRangeChange,
        style: style,
        context: {
            listClassName: className,
            itemClassName: itemClassName
        },
        components: {
            Header: function () { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, prepend); },
            ScrollSeekPlaceholder: Placeholder,
            EmptyPlaceholder: function () { return renderEmpty(); },
            List: List,
            Item: Item,
            Footer: loadMore
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 219,
            columnNumber: 5
        }
    });
});
/* harmony default export */ __webpack_exports__["default"] = (ScrollableList);


/***/ }),

/***/ 790:
/*!************************************************!*\
  !*** ./app/soapbox/components/status_list.tsx ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_load_gap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/load_gap */ 1209);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 843);
/* harmony import */ var soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/containers/status_container */ 848);
/* harmony import */ var soapbox_features_ads_components_ad__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/ads/components/ad */ 1210);
/* harmony import */ var soapbox_features_feed_suggestions_feed_suggestions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/features/feed-suggestions/feed-suggestions */ 1213);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_status */ 794);
/* harmony import */ var soapbox_features_ui_components_pending_status__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/features/ui/components/pending_status */ 933);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_queries_ads__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/queries/ads */ 1216);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/status_list.tsx";
var _excluded = ["statusIds", "lastStatusId", "featuredStatusIds", "divideType", "onLoadMore", "timelineId", "isLoading", "isPartial", "showAds"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }













/** Feed of statuses, built atop ScrollableList. */
var StatusList = function (_ref) {
    var statusIds = _ref.statusIds, lastStatusId = _ref.lastStatusId, featuredStatusIds = _ref.featuredStatusIds, _a = _ref.divideType, divideType = _a === void 0 ? 'border' : _a, onLoadMore = _ref.onLoadMore, timelineId = _ref.timelineId, isLoading = _ref.isLoading, isPartial = _ref.isPartial, _b = _ref.showAds, showAds = _b === void 0 ? false : _b, other = _objectWithoutProperties(_ref, _excluded);
    var ads = (0,soapbox_queries_ads__WEBPACK_IMPORTED_MODULE_12__["default"])().data;
    var soapboxConfig = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__.useSoapboxConfig)();
    var adsInterval = Number(soapboxConfig.extensions.getIn(['ads', 'interval'], 40)) || 0;
    var node = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
    var getFeaturedStatusCount = function () {
        return (featuredStatusIds === null || featuredStatusIds === void 0 ? void 0 : featuredStatusIds.size) || 0;
    };
    var getCurrentStatusIndex = function (id, featured) {
        if (featured) {
            return (featuredStatusIds === null || featuredStatusIds === void 0 ? void 0 : featuredStatusIds.keySeq().findIndex(function (key) { return key === id; })) || 0;
        }
        else {
            return statusIds.keySeq().findIndex(function (key) { return key === id; }) + getFeaturedStatusCount();
        }
    };
    var handleMoveUp = function (id) {
        var featured = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var elementIndex = getCurrentStatusIndex(id, featured) - 1;
        selectChild(elementIndex);
    };
    var handleMoveDown = function (id) {
        var featured = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var elementIndex = getCurrentStatusIndex(id, featured) + 1;
        selectChild(elementIndex);
    };
    var handleLoadOlder = (0,react__WEBPACK_IMPORTED_MODULE_3__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default()(function () {
        var maxId = lastStatusId || statusIds.last();
        if (onLoadMore && maxId) {
            onLoadMore(maxId.replace('末suggestions-', ''));
        }
    }, 300, {
        leading: true
    }), [onLoadMore, lastStatusId, statusIds.last()]);
    var selectChild = function (index) {
        var _node$current;
        (_node$current = node.current) === null || _node$current === void 0 ? void 0 : _node$current.scrollIntoView({
            index: index,
            behavior: 'smooth',
            done: function () {
                var element = document.querySelector("#status-list [data-index=\"".concat(index, "\"] .focusable"));
                element === null || element === void 0 ? void 0 : element.focus();
            }
        });
    };
    var renderLoadGap = function (index) {
        var ids = statusIds.toList();
        var nextId = ids.get(index + 1);
        var prevId = ids.get(index - 1);
        if (index < 1 || !nextId || !prevId || !onLoadMore)
            return null;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_load_gap__WEBPACK_IMPORTED_MODULE_4__["default"], {
            key: 'gap:' + nextId,
            disabled: isLoading,
            maxId: prevId,
            onClick: onLoadMore,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 114,
                columnNumber: 7
            }
        });
    };
    var renderStatus = function (statusId) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_6__["default"], {
            key: statusId,
            id: statusId,
            onMoveUp: handleMoveUp,
            onMoveDown: handleMoveDown,
            contextType: timelineId,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 125,
                columnNumber: 7
            }
        });
    };
    var renderAd = function (ad) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_ads_components_ad__WEBPACK_IMPORTED_MODULE_7__["default"], {
            card: ad.card,
            impression: ad.impression,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 137,
                columnNumber: 7
            }
        });
    };
    var renderPendingStatus = function (statusId) {
        var idempotencyKey = statusId.replace(/^末pending-/, '');
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_ui_components_pending_status__WEBPACK_IMPORTED_MODULE_10__["default"], {
            key: statusId,
            idempotencyKey: idempotencyKey,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 148,
                columnNumber: 7
            }
        });
    };
    var renderFeaturedStatuses = function () {
        if (!featuredStatusIds)
            return [];
        return featuredStatusIds.toArray().map(function (statusId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_6__["default"], {
            key: "f-".concat(statusId),
            id: statusId,
            featured: true,
            onMoveUp: handleMoveUp,
            onMoveDown: handleMoveDown,
            contextType: timelineId,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 159,
                columnNumber: 7
            }
        }); });
    };
    var renderFeedSuggestions = function () {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_feed_suggestions_feed_suggestions__WEBPACK_IMPORTED_MODULE_8__["default"], {
            key: "suggestions",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 171,
                columnNumber: 12
            }
        });
    };
    var renderStatuses = function () {
        if (isLoading || statusIds.size > 0) {
            return statusIds.toList().reduce(function (acc, statusId, index) {
                var adIndex = ads ? Math.floor((index + 1) / adsInterval) % ads.length : 0;
                var ad = ads ? ads[adIndex] : undefined;
                var showAd = (index + 1) % adsInterval === 0;
                if (statusId === null) {
                    acc.push(renderLoadGap(index));
                }
                else if (statusId.startsWith('末suggestions-')) {
                    acc.push(renderFeedSuggestions());
                }
                else if (statusId.startsWith('末pending-')) {
                    acc.push(renderPendingStatus(statusId));
                }
                else {
                    acc.push(renderStatus(statusId));
                }
                if (showAds && ad && showAd) {
                    acc.push(renderAd(ad));
                }
                return acc;
            }, []);
        }
        else {
            return [];
        }
    };
    var renderScrollableContent = function () {
        var featuredStatuses = renderFeaturedStatuses();
        var statuses = renderStatuses();
        if (featuredStatuses && statuses) {
            return featuredStatuses.concat(statuses);
        }
        else {
            return statuses;
        }
    };
    if (isPartial) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "regeneration-indicator",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 215,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 216,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "regeneration-indicator__label",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 217,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
            id: "regeneration_indicator.label",
            tagName: "strong",
            defaultMessage: "Loading\u2026",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 218,
                columnNumber: 13
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
            id: "regeneration_indicator.sublabel",
            defaultMessage: "Your home feed is being prepared!",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 219,
                columnNumber: 13
            }
        }))));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_5__["default"], _extends({
        id: "status-list",
        key: "scrollable-list",
        isLoading: isLoading,
        showLoading: isLoading && statusIds.size === 0,
        onLoadMore: handleLoadOlder,
        placeholderComponent: soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_9__["default"],
        placeholderCount: 20,
        ref: node,
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('divide-y divide-solid divide-gray-200 dark:divide-slate-700', {
            'divide-none': divideType !== 'border'
        }),
        itemClassName: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
            'pb-3': divideType !== 'border'
        })
    }, other, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 227,
            columnNumber: 5
        }
    }), renderScrollableContent());
};
/* harmony default export */ __webpack_exports__["default"] = (StatusList);


/***/ }),

/***/ 1459:
/*!***************************************************************!*\
  !*** ./app/soapbox/components/ui/streamfield/streamfield.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var _button_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../button/button */ 304);
/* harmony import */ var _hstack_hstack__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hstack/hstack */ 214);
/* harmony import */ var _icon_button_icon_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../icon-button/icon-button */ 215);
/* harmony import */ var _stack_stack__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../stack/stack */ 147);
/* harmony import */ var _text_text__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../text/text */ 169);
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
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/ui/streamfield/streamfield.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    add: {
        "id": "streamfield.add",
        "defaultMessage": "Add"
    },
    remove: {
        "id": "streamfield.remove",
        "defaultMessage": "Remove"
    }
});
/** Type of the inner Streamfield input component. */
/** List of inputs that can be added or removed. */
var Streamfield = function (_ref) {
    var values = _ref.values, label = _ref.label, hint = _ref.hint, onAddItem = _ref.onAddItem, onRemoveItem = _ref.onRemoveItem, onChange = _ref.onChange, Component = _ref.component, _a = _ref.maxItems, maxItems = _a === void 0 ? Infinity : _a;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var handleChange = function (i) {
        return function (value) {
            var newData = __spreadArray([], values, true);
            newData[i] = value;
            onChange(newData);
        };
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_stack_stack__WEBPACK_IMPORTED_MODULE_5__["default"], {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_stack_stack__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 7
        }
    }, label && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_text_text__WEBPACK_IMPORTED_MODULE_6__["default"], {
        size: "sm",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 19
        }
    }, label), hint && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_text_text__WEBPACK_IMPORTED_MODULE_6__["default"], {
        size: "xs",
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 18
        }
    }, hint)), values.length > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_stack_stack__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 9
        }
    }, values.map(function (value, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_hstack_hstack__WEBPACK_IMPORTED_MODULE_3__["default"], {
        key: i,
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(Component, {
        onChange: handleChange(i),
        value: value,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 15
        }
    }), onRemoveItem && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_icon_button_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        iconClassName: "w-4 h-4",
        className: "bg-transparent text-gray-400 hover:text-gray-600",
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
        onClick: function () { return onRemoveItem(i); },
        title: intl.formatMessage(messages.remove),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 17
        }
    })); })), onAddItem && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_button_button__WEBPACK_IMPORTED_MODULE_2__["default"], {
        icon: __webpack_require__(/*! @tabler/icons/plus.svg */ 263),
        onClick: onAddItem,
        disabled: values.length >= maxItems,
        theme: "ghost",
        block: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.add)));
};
/* harmony default export */ __webpack_exports__["default"] = (Streamfield);


/***/ }),

/***/ 739:
/*!****************************************************!*\
  !*** ./app/soapbox/components/upload-progress.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_motion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-motion */ 86);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_ui_util_optional_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/ui/util/optional_motion */ 170);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/upload-progress.tsx";





/** Displays a progress bar for uploading files. */
var UploadProgress = function (_ref) {
    var progress = _ref.progress;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.HStack, {
        alignItems: "center",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Icon, {
        src: __webpack_require__(/*! @tabler/icons/cloud-upload.svg */ 935),
        className: "w-7 h-7 text-gray-500",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "upload_progress.label",
        defaultMessage: "Uploading\u2026",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "w-full h-1.5 rounded-lg bg-gray-200 relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_util_optional_motion__WEBPACK_IMPORTED_MODULE_3__["default"], {
        defaultStyle: {
            width: 0
        },
        style: {
            width: (0,react_motion__WEBPACK_IMPORTED_MODULE_1__.spring)(progress)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 11
        }
    }, function (_ref2) {
        var width = _ref2.width;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "absolute left-0 top-0 h-1.5 bg-primary-600 rounded-lg",
            style: {
                width: "".concat(width, "%")
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
                columnNumber: 16
            }
        });
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (UploadProgress);


/***/ }),

/***/ 516:
/*!*******************************************************************!*\
  !*** ./app/soapbox/containers/emoji_picker_dropdown_container.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_emojis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/emojis */ 370);
/* harmony import */ var _components_emoji_picker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/emoji_picker */ 489);



var mapStateToProps = function (state) { return ({
    custom_emojis: (0,_components_emoji_picker__WEBPACK_IMPORTED_MODULE_2__.getCustomEmojis)(state)
}); };
var mapDispatchToProps = function (dispatch, props) { return ({
    onPickEmoji: function (emoji) {
        dispatch((0,_actions_emojis__WEBPACK_IMPORTED_MODULE_1__.useEmoji)(emoji)); // eslint-disable-line react-hooks/rules-of-hooks
        if (props.onPickEmoji) {
            props.onPickEmoji(emoji);
        }
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_emoji_picker__WEBPACK_IMPORTED_MODULE_2__["default"]));


/***/ }),

/***/ 848:
/*!*****************************************************!*\
  !*** ./app/soapbox/containers/status_container.tsx ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/status */ 838);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/containers/status_container.tsx";
var _excluded = ["id"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }




var getStatus = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_3__.makeGetStatus)();
/**
 * Legacy Status wrapper accepting a status ID instead of the full entity.
 * @deprecated Use the Status component directly.
 */
var StatusContainer = function (props) {
    var id = props.id, rest = _objectWithoutProperties(props, _excluded);
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return getStatus(state, {
        id: id
    }); });
    if (status) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_status__WEBPACK_IMPORTED_MODULE_1__["default"], _extends({
            status: status
        }, rest, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
                columnNumber: 12
            }
        }));
    }
    else {
        return null;
    }
};
/* harmony default export */ __webpack_exports__["default"] = (StatusContainer);


/***/ }),

/***/ 1210:
/*!****************************************************!*\
  !*** ./app/soapbox/features/ads/components/ad.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_components_ui_icon_button_icon_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui/icon-button/icon-button */ 215);
/* harmony import */ var soapbox_features_status_components_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/status/components/card */ 733);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ads/components/ad.tsx";







/** Displays an ad in sponsored post format. */
var Ad = function (_ref) {
    var card = _ref.card, impression = _ref.impression;
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.instance; });
    var infobox = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), showInfo = _a[0], setShowInfo = _a[1];
    /** Toggle the info box on click. */
    var handleInfoButtonClick = function () {
        setShowInfo(!showInfo);
    };
    /** Hide the info box when clicked outside. */
    var handleClickOutside = function (event) {
        if (event.target && infobox.current && !infobox.current.contains(event.target)) {
            setShowInfo(false);
        }
    }; // Hide the info box when clicked outside.
    // https://stackoverflow.com/a/42234988
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [infobox]); // Fetch the impression URL (if any) upon displaying the ad.
    // It's common for ad providers to provide this.
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (impression) {
            fetch(impression);
        }
    }, [impression]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Card, {
        className: "p-5",
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.HStack, {
        alignItems: "center",
        space: 3,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Avatar, {
        src: instance.thumbnail,
        size: 42,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        grow: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.HStack, {
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        size: "sm",
        weight: "semibold",
        truncate: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 17
        }
    }, instance.title), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Icon, {
        className: "w-5 h-5 stroke-accent-500",
        src: __webpack_require__(/*! @tabler/icons/timeline.svg */ 1211),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.HStack, {
        alignItems: "center",
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        theme: "muted",
        size: "sm",
        truncate: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "sponsored.subtitle",
        defaultMessage: "Sponsored post",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 21
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        justifyContent: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui_icon_button_icon_button__WEBPACK_IMPORTED_MODULE_3__["default"], {
        iconClassName: "stroke-gray-600 w-6 h-6",
        src: __webpack_require__(/*! @tabler/icons/info-circle.svg */ 1212),
        onClick: handleInfoButtonClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_status_components_card__WEBPACK_IMPORTED_MODULE_4__["default"], {
        card: card,
        onOpenMedia: function () { },
        horizontal: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 11
        }
    }))), showInfo && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        ref: infobox,
        className: "absolute top-5 right-5 max-w-[234px]",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Card, {
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        size: "sm",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 99,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "sponsored.info.title",
        defaultMessage: "Why am I seeing this ad?",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        size: "sm",
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 103,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "sponsored.info.message",
        defaultMessage: "{siteTitle} displays ads to help fund our service.",
        values: {
            siteTitle: instance.title
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 17
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (Ad);


/***/ }),

/***/ 1217:
/*!*****************************************************!*\
  !*** ./app/soapbox/features/ads/providers/index.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getProvider": function() { return /* binding */ getProvider; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/soapbox */ 66);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


/** Map of available provider modules. */
var PROVIDERS = {
    soapbox: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __webpack_require__.e(/*! import() | features/ads/soapbox */ 12).then(__webpack_require__.bind(__webpack_require__, /*! ./soapbox-config */ 1356))];
                case 1: return [2 /*return*/, (_a.sent()).default];
            }
        });
    }); },
    rumble: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, __webpack_require__.e(/*! import() | features/ads/rumble */ 11).then(__webpack_require__.bind(__webpack_require__, /*! ./rumble */ 1357))];
                case 1: return [2 /*return*/, (_a.sent()).default];
            }
        });
    }); }
};
/** Ad server implementation. */
/** Gets the current provider based on config. */
var getProvider = function (getState) { return __awaiter(void 0, void 0, void 0, function () {
    var state, soapboxConfig, isEnabled, providerName;
    return __generator(this, function (_a) {
        state = getState();
        soapboxConfig = (0,soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_1__.getSoapboxConfig)(state);
        isEnabled = soapboxConfig.extensions.getIn(['ads', 'enabled'], false) === true;
        providerName = soapboxConfig.extensions.getIn(['ads', 'provider'], 'soapbox');
        if (isEnabled && PROVIDERS[providerName]) {
            return [2 /*return*/, PROVIDERS[providerName]()];
        }
        return [2 /*return*/];
    });
}); };



/***/ }),

/***/ 943:
/*!*********************************************!*\
  !*** ./app/soapbox/features/audio/index.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Audio; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url.js */ 46);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 28);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash/throttle */ 83);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_features_video__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/features/video */ 431);
/* harmony import */ var _visualizer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./visualizer */ 1256);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/audio/index.js";



function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__.defineMessages)({
    play: {
        "id": "video.play",
        "defaultMessage": "Play"
    },
    pause: {
        "id": "video.pause",
        "defaultMessage": "Pause"
    },
    mute: {
        "id": "video.mute",
        "defaultMessage": "Mute sound"
    },
    unmute: {
        "id": "video.unmute",
        "defaultMessage": "Unmute sound"
    },
    download: {
        "id": "video.download",
        "defaultMessage": "Download file"
    }
});
var TICK_SIZE = 10;
var PADDING = 180;
var Audio = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Audio, _super);
    function Audio(props) {
        var _this = _super.call(this, props) || this;
        _defineProperty(_this, "state", {
            width: _this.props.width,
            currentTime: 0,
            buffer: 0,
            duration: null,
            paused: true,
            muted: false,
            volume: 0.5,
            dragging: false
        });
        _defineProperty(_this, "setPlayerRef", function (c) {
            _this.player = c;
            if (_this.player) {
                _this._setDimensions();
            }
        });
        _defineProperty(_this, "setSeekRef", function (c) {
            _this.seek = c;
        });
        _defineProperty(_this, "setVolumeRef", function (c) {
            _this.volume = c;
        });
        _defineProperty(_this, "setAudioRef", function (c) {
            _this.audio = c;
            if (_this.audio) {
                _this.setState({
                    volume: _this.audio.volume,
                    muted: _this.audio.muted
                });
            }
        });
        _defineProperty(_this, "setCanvasRef", function (c) {
            _this.canvas = c;
            _this.visualizer.setCanvas(c);
        });
        _defineProperty(_this, "togglePlay", function () {
            if (!_this.audioContext) {
                _this._initAudioContext();
            }
            if (_this.state.paused) {
                _this.setState({
                    paused: false
                }, function () { return _this.audio.play(); });
            }
            else {
                _this.setState({
                    paused: true
                }, function () { return _this.audio.pause(); });
            }
        });
        _defineProperty(_this, "handleResize", lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default()(function () {
            if (_this.player) {
                _this._setDimensions();
            }
        }, 250, {
            trailing: true
        }));
        _defineProperty(_this, "handlePlay", function () {
            _this.setState({
                paused: false
            });
            if (_this.audioContext && _this.audioContext.state === 'suspended') {
                _this.audioContext.resume();
            }
            _this._renderCanvas();
        });
        _defineProperty(_this, "handlePause", function () {
            _this.setState({
                paused: true
            });
            if (_this.audioContext) {
                _this.audioContext.suspend();
            }
        });
        _defineProperty(_this, "handleProgress", function () {
            var lastTimeRange = _this.audio.buffered.length - 1;
            if (lastTimeRange > -1) {
                _this.setState({
                    buffer: Math.ceil(_this.audio.buffered.end(lastTimeRange) / _this.audio.duration * 100)
                });
            }
        });
        _defineProperty(_this, "toggleMute", function () {
            var muted = !_this.state.muted;
            _this.setState({
                muted: muted
            }, function () {
                _this.audio.muted = muted;
            });
        });
        _defineProperty(_this, "handleVolumeMouseDown", function (e) {
            document.addEventListener('mousemove', _this.handleMouseVolSlide, true);
            document.addEventListener('mouseup', _this.handleVolumeMouseUp, true);
            document.addEventListener('touchmove', _this.handleMouseVolSlide, true);
            document.addEventListener('touchend', _this.handleVolumeMouseUp, true);
            _this.handleMouseVolSlide(e);
            e.preventDefault();
            e.stopPropagation();
        });
        _defineProperty(_this, "handleVolumeMouseUp", function () {
            document.removeEventListener('mousemove', _this.handleMouseVolSlide, true);
            document.removeEventListener('mouseup', _this.handleVolumeMouseUp, true);
            document.removeEventListener('touchmove', _this.handleMouseVolSlide, true);
            document.removeEventListener('touchend', _this.handleVolumeMouseUp, true);
        });
        _defineProperty(_this, "handleMouseDown", function (e) {
            document.addEventListener('mousemove', _this.handleMouseMove, true);
            document.addEventListener('mouseup', _this.handleMouseUp, true);
            document.addEventListener('touchmove', _this.handleMouseMove, true);
            document.addEventListener('touchend', _this.handleMouseUp, true);
            _this.setState({
                dragging: true
            });
            _this.audio.pause();
            _this.handleMouseMove(e);
            e.preventDefault();
            e.stopPropagation();
        });
        _defineProperty(_this, "handleMouseUp", function () {
            document.removeEventListener('mousemove', _this.handleMouseMove, true);
            document.removeEventListener('mouseup', _this.handleMouseUp, true);
            document.removeEventListener('touchmove', _this.handleMouseMove, true);
            document.removeEventListener('touchend', _this.handleMouseUp, true);
            _this.setState({
                dragging: false
            });
            _this.audio.play();
        });
        _defineProperty(_this, "handleMouseMove", lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default()(function (e) {
            var x = (0,soapbox_features_video__WEBPACK_IMPORTED_MODULE_9__.getPointerPosition)(_this.seek, e).x;
            var currentTime = _this.audio.duration * x;
            if (!isNaN(currentTime)) {
                _this.setState({
                    currentTime: currentTime
                }, function () {
                    _this.audio.currentTime = currentTime;
                });
            }
        }, 15));
        _defineProperty(_this, "handleTimeUpdate", function () {
            _this.setState({
                currentTime: _this.audio.currentTime,
                duration: _this.audio.duration
            });
        });
        _defineProperty(_this, "handleMouseVolSlide", lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default()(function (e) {
            var x = (0,soapbox_features_video__WEBPACK_IMPORTED_MODULE_9__.getPointerPosition)(_this.volume, e).x;
            if (!isNaN(x)) {
                _this.setState({
                    volume: x
                }, function () {
                    _this.audio.volume = x;
                });
            }
        }, 15));
        _defineProperty(_this, "handleScroll", lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default()(function () {
            if (!_this.canvas || !_this.audio) {
                return;
            }
            var _a = _this.canvas.getBoundingClientRect(), top = _a.top, height = _a.height;
            var inView = top <= (window.innerHeight || document.documentElement.clientHeight) && top + height >= 0;
            if (!_this.state.paused && !inView) {
                _this.audio.pause();
                if (_this.props.deployPictureInPicture) {
                    _this.props.deployPictureInPicture('audio', _this._pack());
                }
                _this.setState({
                    paused: true
                });
            }
        }, 150, {
            trailing: true
        }));
        _defineProperty(_this, "handleMouseEnter", function () {
            _this.setState({
                hovered: true
            });
        });
        _defineProperty(_this, "handleMouseLeave", function () {
            _this.setState({
                hovered: false
            });
        });
        _defineProperty(_this, "handleLoadedData", function () {
            var _a = _this.props, autoPlay = _a.autoPlay, currentTime = _a.currentTime, volume = _a.volume, muted = _a.muted;
            _this.setState({
                duration: _this.audio.duration
            });
            if (currentTime) {
                _this.audio.currentTime = currentTime;
            }
            if (volume !== undefined) {
                _this.audio.volume = volume;
            }
            if (muted !== undefined) {
                _this.audio.muted = muted;
            }
            if (autoPlay) {
                _this.togglePlay();
            }
        });
        _defineProperty(_this, "handleDownload", function () {
            fetch(_this.props.src).then(function (res) { return res.blob(); }).then(function (blob) {
                var element = document.createElement('a');
                var objectURL = URL.createObjectURL(blob);
                element.setAttribute('href', objectURL);
                element.setAttribute('download', (0,soapbox_features_video__WEBPACK_IMPORTED_MODULE_9__.fileNameFromURL)(_this.props.src));
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
                URL.revokeObjectURL(objectURL);
            }).catch(function (err) {
                console.error(err);
            });
        });
        _defineProperty(_this, "handleAudioKeyDown", function (e) {
            // On the audio element or the seek bar, we can safely use the space bar
            // for playback control because there are no buttons to press
            if (e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                _this.togglePlay();
            }
        });
        _defineProperty(_this, "handleKeyDown", function (e) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.togglePlay();
                    break;
                case 'm':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.toggleMute();
                    break;
                case 'j':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.seekBy(-10);
                    break;
                case 'l':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.seekBy(10);
                    break;
            }
        });
        _this.visualizer = new _visualizer__WEBPACK_IMPORTED_MODULE_10__["default"](TICK_SIZE);
        return _this;
    }
    Audio.prototype._pack = function () {
        return {
            src: this.props.src,
            volume: this.audio.volume,
            muted: this.audio.muted,
            currentTime: this.audio.currentTime,
            poster: this.props.poster,
            backgroundColor: this.props.backgroundColor,
            foregroundColor: this.props.foregroundColor,
            accentColor: this.props.accentColor
        };
    };
    Audio.prototype._setDimensions = function () {
        var width = this.player.offsetWidth;
        var height = this.props.fullscreen ? this.player.offsetHeight : width / (16 / 9);
        if (this.props.cacheWidth) {
            this.props.cacheWidth(width);
        }
        this.setState({
            width: width,
            height: height
        });
    };
    Audio.prototype.componentDidMount = function () {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize, {
            passive: true
        });
    };
    Audio.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (prevProps.src !== this.props.src || this.state.width !== prevState.width || this.state.height !== prevState.height || prevProps.accentColor !== this.props.accentColor) {
            this._clear();
            this._draw();
        }
    };
    Audio.prototype.componentWillUnmount = function () {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        if (!this.state.paused && this.audio && this.props.deployPictureInPicture) {
            this.props.deployPictureInPicture('audio', this._pack());
        }
    };
    Audio.prototype._initAudioContext = function () {
        // eslint-disable-next-line compat/compat
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();
        var source = context.createMediaElementSource(this.audio);
        this.visualizer.setAudioContext(context, source);
        source.connect(context.destination);
        this.audioContext = context;
    };
    Audio.prototype._renderCanvas = function () {
        var _this = this;
        requestAnimationFrame(function () {
            if (!_this.audio)
                return;
            _this.handleTimeUpdate();
            _this._clear();
            _this._draw();
            if (!_this.state.paused) {
                _this._renderCanvas();
            }
        });
    };
    Audio.prototype._clear = function () {
        this.visualizer.clear(this.state.width, this.state.height);
    };
    Audio.prototype._draw = function () {
        this.visualizer.draw(this._getCX(), this._getCY(), this._getAccentColor(), this._getRadius(), this._getScaleCoefficient());
    };
    Audio.prototype._getRadius = function () {
        return parseInt(((this.state.height || this.props.height) - PADDING * this._getScaleCoefficient() * 2) / 2);
    };
    Audio.prototype._getScaleCoefficient = function () {
        return (this.state.height || this.props.height) / 982;
    };
    Audio.prototype._getCX = function () {
        return Math.floor(this.state.width / 2) || null;
    };
    Audio.prototype._getCY = function () {
        return Math.floor(this._getRadius() + PADDING * this._getScaleCoefficient()) || null;
    };
    Audio.prototype._getAccentColor = function () {
        return this.props.accentColor || '#ffffff';
    };
    Audio.prototype._getBackgroundColor = function () {
        return this.props.backgroundColor || '#000000';
    };
    Audio.prototype._getForegroundColor = function () {
        return this.props.foregroundColor || '#ffffff';
    };
    Audio.prototype.seekBy = function (time) {
        var _this = this;
        var currentTime = this.audio.currentTime + time;
        if (!isNaN(currentTime)) {
            this.setState({
                currentTime: currentTime
            }, function () {
                _this.audio.currentTime = currentTime;
            });
        }
    };
    Audio.prototype.render = function () {
        var _a = this.props, src = _a.src, intl = _a.intl, alt = _a.alt, editable = _a.editable;
        var _b = this.state, paused = _b.paused, muted = _b.muted, volume = _b.volume, currentTime = _b.currentTime, buffer = _b.buffer, dragging = _b.dragging;
        var duration = this.state.duration || this.props.duration;
        var progress = Math.min(currentTime / duration * 100, 100);
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('audio-player', {
                editable: editable
            }),
            ref: this.setPlayerRef,
            style: {
                backgroundColor: this._getBackgroundColor(),
                color: this._getForegroundColor(),
                width: '100%',
                height: this.props.fullscreen ? '100%' : this.state.height || this.props.height
            },
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave,
            tabIndex: "0",
            onKeyDown: this.handleKeyDown,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 446,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("audio", {
            src: src,
            ref: this.setAudioRef,
            preload: "auto",
            onPlay: this.handlePlay,
            onPause: this.handlePause,
            onProgress: this.handleProgress,
            onLoadedData: this.handleLoadedData,
            crossOrigin: "anonymous",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 447,
                columnNumber: 9
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("canvas", {
            role: "button",
            tabIndex: "0",
            className: "audio-player__canvas",
            width: this.state.width,
            height: this.state.height,
            style: {
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            },
            ref: this.setCanvasRef,
            onClick: this.togglePlay,
            onKeyDown: this.handleAudioKeyDown,
            title: alt,
            "aria-label": alt,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 458,
                columnNumber: 9
            }
        }), this.props.poster && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("img", {
            src: this.props.poster,
            alt: "",
            width: (this._getRadius() - TICK_SIZE) * 2 || null,
            height: (this._getRadius() - TICK_SIZE) * 2 || null,
            style: {
                position: 'absolute',
                left: this._getCX(),
                top: this._getCY(),
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                pointerEvents: 'none'
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 472,
                columnNumber: 31
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__seek",
            onMouseDown: this.handleMouseDown,
            ref: this.setSeekRef,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 480,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__seek__buffer",
            style: {
                width: "".concat(buffer, "%")
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 481,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__seek__progress",
            style: {
                width: "".concat(progress, "%"),
                backgroundColor: this._getAccentColor()
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 482,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('video-player__seek__handle', {
                active: dragging
            }),
            tabIndex: "0",
            style: {
                left: "".concat(progress, "%"),
                backgroundColor: this._getAccentColor()
            },
            onKeyDown: this.handleAudioKeyDown,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 484,
                columnNumber: 11
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__controls active",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 492,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__buttons-bar",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 493,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__buttons left",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 494,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            title: intl.formatMessage(paused ? messages.play : messages.pause),
            "aria-label": intl.formatMessage(paused ? messages.play : messages.pause),
            className: "player-button",
            onClick: this.togglePlay,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 495,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
            src: paused ? __webpack_require__(/*! @tabler/icons/player-play.svg */ 396) : __webpack_require__(/*! @tabler/icons/player-pause.svg */ 744),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 495,
                columnNumber: 230
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            title: intl.formatMessage(muted ? messages.unmute : messages.mute),
            "aria-label": intl.formatMessage(muted ? messages.unmute : messages.mute),
            className: "player-button",
            onClick: this.toggleMute,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 496,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
            src: muted ? __webpack_require__(/*! @tabler/icons/volume-3.svg */ 745) : __webpack_require__(/*! @tabler/icons/volume.svg */ 453),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 496,
                columnNumber: 230
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('video-player__volume', {
                active: this.state.hovered
            }),
            ref: this.setVolumeRef,
            onMouseDown: this.handleVolumeMouseDown,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 498,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__volume__current",
            style: {
                width: "".concat(volume * 100, "%"),
                backgroundColor: this._getAccentColor()
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 499,
                columnNumber: 17
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__volume__handle",
            tabIndex: "0",
            style: {
                left: "".concat(volume * 100, "%"),
                backgroundColor: this._getAccentColor()
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 501,
                columnNumber: 17
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__time",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 508,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__time-current",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 509,
                columnNumber: 17
            }
        }, (0,soapbox_features_video__WEBPACK_IMPORTED_MODULE_9__.formatTime)(Math.floor(currentTime))), duration && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(react__WEBPACK_IMPORTED_MODULE_7__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__time-sep",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 511,
                columnNumber: 19
            }
        }, "/"), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__time-total",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 512,
                columnNumber: 19
            }
        }, (0,soapbox_features_video__WEBPACK_IMPORTED_MODULE_9__.formatTime)(Math.floor(duration)))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__buttons right",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 517,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("a", {
            title: intl.formatMessage(messages.download),
            "aria-label": intl.formatMessage(messages.download),
            className: "video-player__download__icon player-button",
            href: this.props.src,
            download: true,
            target: "_blank",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 518,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
            src: __webpack_require__(/*! @tabler/icons/download.svg */ 1257),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 526,
                columnNumber: 17
            }
        }))))));
    };
    return Audio;
}(react__WEBPACK_IMPORTED_MODULE_7__.PureComponent)), _defineProperty(_class2, "propTypes", {
    src: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string.isRequired),
    alt: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    poster: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    duration: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    width: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    height: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    editable: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    fullscreen: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().object.isRequired),
    cacheWidth: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().func),
    backgroundColor: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    foregroundColor: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    accentColor: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    currentTime: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    autoPlay: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    volume: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    muted: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    deployPictureInPicture: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().func)
}), _class2)) || _class;



/***/ }),

/***/ 1256:
/*!**************************************************!*\
  !*** ./app/soapbox/features/audio/visualizer.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_typed_array_uint8_array_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.typed-array.uint8-array.js */ 78);
/* harmony import */ var core_js_modules_es_typed_array_uint8_array_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_uint8_array_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.typed-array.at.js */ 67);
/* harmony import */ var core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.typed-array.fill.js */ 68);
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.typed-array.set.js */ 69);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.typed-array.sort.js */ 70);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_5__);
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }






/*
Copyright (c) 2020 by Alex Permyakov (https://codepen.io/alexdevp/pen/RNELPV)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var hex2rgba = function (hex) {
    var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var _a = hex.match(/\w\w/g).map(function (x) { return parseInt(x, 16); }), r = _a[0], g = _a[1], b = _a[2];
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(alpha, ")");
};
var Visualizer = /** @class */ (function () {
    function Visualizer(tickSize) {
        _defineProperty(this, "tickSize", void 0);
        _defineProperty(this, "canvas", void 0);
        _defineProperty(this, "context", void 0);
        _defineProperty(this, "analyser", void 0);
        this.tickSize = tickSize;
    }
    Visualizer.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        if (canvas) {
            this.context = canvas.getContext('2d');
        }
    };
    Visualizer.prototype.setAudioContext = function (context, source) {
        var analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.6;
        analyser.fftSize = 2048;
        source.connect(analyser);
        this.analyser = analyser;
    };
    Visualizer.prototype.getTickPoints = function (count) {
        var coords = [];
        for (var i = 0; i < count; i++) {
            var rad = Math.PI * 2 * i / count;
            coords.push({
                x: Math.cos(rad),
                y: -Math.sin(rad)
            });
        }
        return coords;
    };
    Visualizer.prototype.drawTick = function (cx, cy, mainColor, x1, y1, x2, y2) {
        var dx1 = Math.ceil(cx + x1);
        var dy1 = Math.ceil(cy + y1);
        var dx2 = Math.ceil(cx + x2);
        var dy2 = Math.ceil(cy + y2);
        var gradient = this.context.createLinearGradient(dx1, dy1, dx2, dy2);
        var lastColor = hex2rgba(mainColor, 0);
        gradient.addColorStop(0, mainColor);
        gradient.addColorStop(0.6, mainColor);
        gradient.addColorStop(1, lastColor);
        this.context.beginPath();
        this.context.strokeStyle = gradient;
        this.context.lineWidth = 2;
        this.context.moveTo(dx1, dy1);
        this.context.lineTo(dx2, dy2);
        this.context.stroke();
    };
    Visualizer.prototype.getTicks = function (count, size, radius, scaleCoefficient) {
        var ticks = this.getTickPoints(count);
        var lesser = 200;
        var m = [];
        var bufferLength = this.analyser ? this.analyser.frequencyBinCount : 0;
        var frequencyData = new Uint8Array(bufferLength);
        var allScales = [];
        if (this.analyser) {
            this.analyser.getByteFrequencyData(frequencyData);
        }
        ticks.forEach(function (tick, i) {
            var coef = 1 - i / (ticks.length * 2.5);
            var delta = ((frequencyData[i] || 0) - lesser * coef) * scaleCoefficient;
            if (delta < 0) {
                delta = 0;
            }
            var k = radius / (radius - (size + delta));
            var x1 = tick.x * (radius - size);
            var y1 = tick.y * (radius - size);
            var x2 = x1 * k;
            var y2 = y1 * k;
            m.push({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            });
            if (i < 20) {
                var scale_1 = delta / (200 * scaleCoefficient);
                scale_1 = scale_1 < 1 ? 1 : scale_1;
                allScales.push(scale_1);
            }
        });
        var scale = allScales.reduce(function (pv, cv) { return pv + cv; }, 0) / allScales.length;
        return m.map(function (_ref) {
            var x1 = _ref.x1, y1 = _ref.y1, x2 = _ref.x2, y2 = _ref.y2;
            return {
                x1: x1,
                y1: y1,
                x2: x2 * scale,
                y2: y2 * scale
            };
        });
    };
    Visualizer.prototype.clear = function (width, height) {
        this.context.clearRect(0, 0, width, height);
    };
    Visualizer.prototype.draw = function (cx, cy, color, radius, coefficient) {
        var _this = this;
        this.context.save();
        var ticks = this.getTicks(parseInt(360 * coefficient), this.tickSize, radius, coefficient);
        ticks.forEach(function (tick) {
            _this.drawTick(cx, cy, color, tick.x1, tick.y1, tick.x2, tick.y2);
        });
        this.context.restore();
    };
    return Visualizer;
}());
/* harmony default export */ __webpack_exports__["default"] = (Visualizer);


/***/ }),

/***/ 1462:
/*!************************************************************!*\
  !*** ./app/soapbox/features/chats/components/chat-box.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/chats */ 55);
/* harmony import */ var soapbox_actions_media__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/media */ 466);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_components_upload_progress__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/upload-progress */ 739);
/* harmony import */ var soapbox_containers_emoji_picker_dropdown_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/containers/emoji_picker_dropdown_container */ 516);
/* harmony import */ var soapbox_features_compose_components_upload_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/compose/components/upload_button */ 742);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_media__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/utils/media */ 465);
/* harmony import */ var _chat_message_list__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./chat-message-list */ 1262);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/components/chat-box.tsx";













var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__.defineMessages)({
    placeholder: {
        "id": "chat_box.input.placeholder",
        "defaultMessage": "Send a message\u2026"
    },
    send: {
        "id": "chat_box.actions.send",
        "defaultMessage": "Send"
    }
});
var fileKeyGen = function () { return Math.floor(Math.random() * 0x10000); };
/**
 * Chat UI with just the messages and textarea.
 * Reused between floating desktop chats and fullscreen/mobile chats.
 */
var ChatBox = function (_ref) {
    var chatId = _ref.chatId, onSetInputRef = _ref.onSetInputRef, autosize = _ref.autosize;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppDispatch)();
    var chatMessageIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.chat_message_lists.get(chatId, (0,immutable__WEBPACK_IMPORTED_MODULE_13__.OrderedSet)()); });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(''), content = _a[0], setContent = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(undefined), attachment = _b[0], setAttachment = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), isUploading = _c[0], setIsUploading = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0), uploadProgress = _d[0], setUploadProgress = _d[1];
    var _e = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(fileKeyGen()), resetFileKey = _e[0], setResetFileKey = _e[1];
    var inputElem = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var clearState = function () {
        setContent('');
        setAttachment(undefined);
        setIsUploading(false);
        setUploadProgress(0);
        setResetFileKey(fileKeyGen());
    };
    var getParams = function () {
        return {
            content: content,
            media_id: attachment && attachment.id
        };
    };
    var canSubmit = function () {
        var conds = [content.length > 0, attachment];
        return conds.some(function (c) { return c; });
    };
    var sendMessage = function () {
        if (canSubmit() && !isUploading) {
            var params = getParams();
            dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__.sendChatMessage)(chatId, params));
            clearState();
        }
    };
    var insertLine = function () {
        setContent(content + '\n');
    };
    var handleKeyDown = function (e) {
        markRead();
        if (e.key === 'Enter' && e.shiftKey) {
            insertLine();
            e.preventDefault();
        }
        else if (e.key === 'Enter') {
            sendMessage();
            e.preventDefault();
        }
    };
    var handleContentChange = function (e) {
        setContent(e.target.value);
    };
    var handlePaste = function (e) {
        if (!canSubmit() && e.clipboardData && e.clipboardData.files.length === 1) {
            handleFiles(e.clipboardData.files);
        }
    };
    var markRead = function () {
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__.markChatRead)(chatId));
    };
    var handleHover = function () {
        markRead();
    };
    var setInputRef = function (el) {
        inputElem.current = el;
        onSetInputRef(el);
    };
    var handleRemoveFile = function () {
        setAttachment(undefined);
        setResetFileKey(fileKeyGen());
    };
    var onUploadProgress = function (e) {
        var loaded = e.loaded, total = e.total;
        setUploadProgress(loaded / total);
    };
    var handleFiles = function (files) {
        setIsUploading(true);
        var data = new FormData();
        data.append('file', files[0]);
        dispatch((0,soapbox_actions_media__WEBPACK_IMPORTED_MODULE_3__.uploadMedia)(data, onUploadProgress)).then(function (response) {
            setAttachment(response.data);
            setIsUploading(false);
        }).catch(function () {
            setIsUploading(false);
        });
    };
    var handleEmojiPick = react__WEBPACK_IMPORTED_MODULE_1__.useCallback(function (data) {
        if (data.custom) {
            setContent(content + ' ' + data.native + ' ');
        }
        else {
            setContent(content + data.native);
        }
    }, [content]);
    var renderAttachment = function () {
        if (!attachment)
            return null;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "chat-box__attachment",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 156,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "chat-box__filename",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 157,
                columnNumber: 9
            }
        }, (0,soapbox_utils_media__WEBPACK_IMPORTED_MODULE_9__.truncateFilename)(attachment.preview_url, 20)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "chat-box__remove-attachment",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 160,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
            src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
            onClick: handleRemoveFile,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 161,
                columnNumber: 11
            }
        })));
    };
    if (!chatMessageIds)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "chat-box",
        onMouseOver: handleHover,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 173,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_chat_message_list__WEBPACK_IMPORTED_MODULE_10__["default"], {
        chatMessageIds: chatMessageIds,
        chatId: chatId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 174,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "chat-box__actions",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 175,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 176,
            columnNumber: 9
        }
    }, renderAttachment(), isUploading && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_upload_progress__WEBPACK_IMPORTED_MODULE_5__["default"], {
        progress: uploadProgress * 100,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 179,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-center gap-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 182,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("textarea", {
        className: "border",
        rows: 1,
        placeholder: intl.formatMessage(messages.placeholder),
        onKeyDown: handleKeyDown,
        onChange: handleContentChange,
        onPaste: handlePaste,
        value: content,
        ref: setInputRef,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 183,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "chat-box__send flex items-center gap-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 193,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_emoji_picker_dropdown_container__WEBPACK_IMPORTED_MODULE_6__["default"], {
        onPickEmoji: handleEmojiPick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 194,
            columnNumber: 13
        }
    }), canSubmit() ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
        className: "text-gray-400 hover:text-gray-600",
        src: __webpack_require__(/*! @tabler/icons/send.svg */ 721),
        title: intl.formatMessage(messages.send),
        onClick: sendMessage,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 199,
            columnNumber: 17
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_compose_components_upload_button__WEBPACK_IMPORTED_MODULE_7__["default"], {
        onSelectFile: handleFiles,
        resetFileKey: resetFileKey,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 206,
            columnNumber: 17
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (ChatBox);


/***/ }),

/***/ 1461:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/chats/components/chat-list.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_virtuoso__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-virtuoso */ 842);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reselect */ 63);
/* harmony import */ var soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/chats */ 55);
/* harmony import */ var soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/pull-to-refresh */ 416);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_chat__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_chat */ 1260);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _chat__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./chat */ 1261);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/components/chat-list.tsx";











var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    emptyMessage: {
        "id": "chat_panels.main_window.empty",
        "defaultMessage": "No chats found. To start a chat, visit a user's profile"
    }
});
var getSortedChatIds = function (chats) { return chats.toList().sort(chatDateComparator).map(function (chat) { return chat.id; }); };
var chatDateComparator = function (chatA, chatB) {
    // Sort most recently updated chats at the top
    var a = new Date(chatA.updated_at);
    var b = new Date(chatB.updated_at);
    if (a === b)
        return 0;
    if (a > b)
        return -1;
    if (a < b)
        return 1;
    return 0;
};
var sortedChatIdsSelector = (0,reselect__WEBPACK_IMPORTED_MODULE_2__.createSelector)([getSortedChatIds], function (chats) { return chats; });
var ChatList = function (_ref) {
    var onClickChat = _ref.onClickChat, _a = _ref.useWindowScroll, useWindowScroll = _a === void 0 ? false : _a;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var chatIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return sortedChatIdsSelector(state.chats.items); });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return !!state.chats.next; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.chats.isLoading; });
    var isEmpty = chatIds.size === 0;
    var handleLoadMore = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
        if (hasMore && !isLoading) {
            dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_3__.expandChats)());
        }
    }, [dispatch, hasMore, isLoading]);
    var handleRefresh = function () {
        return dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_3__.fetchChats)());
    };
    var renderEmpty = function () { return isLoading ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_placeholder_components_placeholder_chat__WEBPACK_IMPORTED_MODULE_6__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 41
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
        className: "mt-2",
        variant: "rounded",
        size: "lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.emptyMessage))); };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onRefresh: handleRefresh,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 5
        }
    }, isEmpty ? renderEmpty() : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_virtuoso__WEBPACK_IMPORTED_MODULE_11__.Virtuoso, {
        className: "chat-list",
        useWindowScroll: useWindowScroll,
        data: chatIds.toArray(),
        endReached: handleLoadMore,
        itemContent: function (_index, chatId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chat__WEBPACK_IMPORTED_MODULE_8__["default"], {
            chatId: chatId,
            onClick: onClickChat,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 83,
                columnNumber: 13
            }
        }); },
        components: {
            ScrollSeekPlaceholder: function () { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_placeholder_components_placeholder_chat__WEBPACK_IMPORTED_MODULE_6__["default"], {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 86,
                    columnNumber: 42
                }
            }); },
            Footer: function () { return hasMore ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_placeholder_components_placeholder_chat__WEBPACK_IMPORTED_MODULE_6__["default"], {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 87,
                    columnNumber: 37
                }
            }) : null; },
            EmptyPlaceholder: renderEmpty
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 9
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ChatList);


/***/ }),

/***/ 1262:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/chats/components/chat-message-list.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var lodash_escape__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/escape */ 755);
/* harmony import */ var lodash_escape__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_escape__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/throttle */ 83);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! reselect */ 63);
/* harmony import */ var soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/actions/chats */ 55);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/actions/reports */ 195);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/containers/dropdown_menu_container */ 273);
/* harmony import */ var soapbox_features_emoji_emoji__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/features/emoji/emoji */ 62);
/* harmony import */ var soapbox_features_ui_components_bundle__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/features/ui/components/bundle */ 204);
/* harmony import */ var soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! soapbox/features/ui/util/async-components */ 42);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_rich_content__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! soapbox/utils/rich_content */ 839);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/components/chat-message-list.tsx";



















var BIG_EMOJI_LIMIT = 1;
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_17__.defineMessages)({
    today: {
        "id": "chats.dividers.today",
        "defaultMessage": "Today"
    },
    more: {
        "id": "chats.actions.more",
        "defaultMessage": "More"
    },
    delete: {
        "id": "chats.actions.delete",
        "defaultMessage": "Delete message"
    },
    report: {
        "id": "chats.actions.report",
        "defaultMessage": "Report user"
    }
});
var timeChange = function (prev, curr) {
    var prevDate = new Date(prev.created_at).getDate();
    var currDate = new Date(curr.created_at).getDate();
    var nowDate = new Date().getDate();
    if (prevDate !== currDate) {
        return currDate === nowDate ? 'today' : 'date';
    }
    return null;
};
var makeEmojiMap = function (record) { return record.get('emojis', (0,immutable__WEBPACK_IMPORTED_MODULE_18__.List)()).reduce(function (map, emoji) {
    return map.set(":".concat(emoji.get('shortcode'), ":"), emoji);
}, (0,immutable__WEBPACK_IMPORTED_MODULE_18__.Map)()); };
var getChatMessages = (0,reselect__WEBPACK_IMPORTED_MODULE_6__.createSelector)([function (chatMessages, chatMessageIds) { return chatMessageIds.reduce(function (acc, curr) {
        var chatMessage = chatMessages.get(curr);
        return chatMessage ? acc.push(chatMessage) : acc;
    }, (0,immutable__WEBPACK_IMPORTED_MODULE_18__.List)()); }], function (chatMessages) { return chatMessages; });
/** Scrollable list of chat messages. */
var ChatMessageList = function (_ref) {
    var chatId = _ref.chatId, chatMessageIds = _ref.chatMessageIds, autosize = _ref.autosize;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_19__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_15__.useAppDispatch)();
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_15__.useAppSelector)(function (state) { return state.me; });
    var chatMessages = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_15__.useAppSelector)(function (state) { return getChatMessages(state.chat_messages, chatMessageIds); });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(true), initialLoad = _a[0], setInitialLoad = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(false), isLoading = _b[0], setIsLoading = _b[1];
    var node = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
    var messagesEnd = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(null);
    var lastComputedScroll = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(undefined);
    var scrollBottom = (0,react__WEBPACK_IMPORTED_MODULE_5__.useRef)(undefined);
    var initialCount = (0,react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(function () { return chatMessages.count(); }, []);
    var scrollToBottom = function () {
        var _messagesEnd$current;
        (_messagesEnd$current = messagesEnd.current) === null || _messagesEnd$current === void 0 ? void 0 : _messagesEnd$current.scrollIntoView(false);
    };
    var getFormattedTimestamp = function (chatMessage) {
        return intl.formatDate(new Date(chatMessage.created_at), {
            hour12: false,
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var setBubbleRef = function (c) {
        if (!c)
            return;
        var links = c.querySelectorAll('a[rel="ugc"]');
        links.forEach(function (link) {
            link.classList.add('chat-link');
            link.setAttribute('rel', 'ugc nofollow noopener');
            link.setAttribute('target', '_blank');
        });
        if ((0,soapbox_utils_rich_content__WEBPACK_IMPORTED_MODULE_16__.onlyEmoji)(c, BIG_EMOJI_LIMIT, false)) {
            c.classList.add('chat-message__bubble--onlyEmoji');
        }
        else {
            c.classList.remove('chat-message__bubble--onlyEmoji');
        }
    };
    var isNearBottom = function () {
        var elem = node.current;
        if (!elem)
            return false;
        var scrollBottom = elem.scrollHeight - elem.offsetHeight - elem.scrollTop;
        return scrollBottom < elem.offsetHeight * 1.5;
    };
    var handleResize = lodash_throttle__WEBPACK_IMPORTED_MODULE_4___default()(function () {
        if (isNearBottom()) {
            scrollToBottom();
        }
    }, 150);
    var restoreScrollPosition = function () {
        if (node.current && scrollBottom.current) {
            lastComputedScroll.current = node.current.scrollHeight - scrollBottom.current;
            node.current.scrollTop = lastComputedScroll.current;
        }
    };
    var handleLoadMore = function () {
        var maxId = chatMessages.getIn([0, 'id']);
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_7__.fetchChatMessages)(chatId, maxId));
        setIsLoading(true);
    };
    var handleScroll = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_15__.useRefEventHandler)(lodash_throttle__WEBPACK_IMPORTED_MODULE_4___default()(function () {
        if (node.current) {
            var _a = node.current, scrollTop = _a.scrollTop, offsetHeight = _a.offsetHeight;
            var computedScroll = lastComputedScroll.current === scrollTop;
            var nearTop = scrollTop < offsetHeight * 2;
            if (nearTop && !isLoading && !initialLoad && !computedScroll) {
                handleLoadMore();
            }
        }
    }, 150, {
        trailing: true
    }));
    var onOpenMedia = function (media, index) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_8__.openModal)('MEDIA', {
            media: media,
            index: index
        }));
    };
    var maybeRenderMedia = function (chatMessage) {
        var attachment = chatMessage.attachment;
        if (!attachment)
            return null;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
            className: "chat-message__media",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 172,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_features_ui_components_bundle__WEBPACK_IMPORTED_MODULE_13__["default"], {
            fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_14__.MediaGallery,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 173,
                columnNumber: 9
            }
        }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_5__.createElement(Component, {
            media: (0,immutable__WEBPACK_IMPORTED_MODULE_18__.List)([attachment]),
            height: 120,
            onOpenMedia: onOpenMedia,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 175,
                columnNumber: 13
            }
        }); }));
    };
    var parsePendingContent = function (content) {
        return lodash_escape__WEBPACK_IMPORTED_MODULE_3___default()(content).replace(/(?:\r\n|\r|\n)/g, '<br>');
    };
    var parseContent = function (chatMessage) {
        var content = chatMessage.content || '';
        var pending = chatMessage.pending;
        var deleting = chatMessage.deleting;
        var formatted = pending && !deleting ? parsePendingContent(content) : content;
        var emojiMap = makeEmojiMap(chatMessage);
        return (0,soapbox_features_emoji_emoji__WEBPACK_IMPORTED_MODULE_12__["default"])(formatted, emojiMap.toJS());
    };
    var renderDivider = function (key, text) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "chat-messages__divider",
        key: key,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 200,
            columnNumber: 5
        }
    }, text); };
    var handleDeleteMessage = function (chatId, messageId) {
        return function () {
            dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_7__.deleteChatMessage)(chatId, messageId));
        };
    };
    var handleReportUser = function (userId) {
        return function () {
            dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_9__.initReportById)(userId));
        };
    };
    var renderMessage = function (chatMessage) {
        var menu = [{
                text: intl.formatMessage(messages.delete),
                action: handleDeleteMessage(chatMessage.chat_id, chatMessage.id),
                icon: __webpack_require__(/*! @tabler/icons/trash.svg */ 269),
                destructive: true
            }];
        if (chatMessage.account_id !== me) {
            menu.push({
                text: intl.formatMessage(messages.report),
                action: handleReportUser(chatMessage.account_id),
                icon: __webpack_require__(/*! @tabler/icons/flag.svg */ 395)
            });
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('chat-message', {
                'chat-message--me': chatMessage.account_id === me,
                'chat-message--pending': chatMessage.pending
            }),
            key: chatMessage.id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 234,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
            title: getFormattedTimestamp(chatMessage),
            className: "chat-message__bubble",
            ref: setBubbleRef,
            tabIndex: 0,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 241,
                columnNumber: 9
            }
        }, maybeRenderMedia(chatMessage), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Text, {
            size: "sm",
            dangerouslySetInnerHTML: {
                __html: parseContent(chatMessage)
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 248,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
            className: "chat-message__menu",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 249,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_11__["default"], {
            items: menu,
            src: __webpack_require__(/*! @tabler/icons/dots.svg */ 187),
            title: intl.formatMessage(messages.more),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 250,
                columnNumber: 13
            }
        }))));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
        var _node$current;
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_7__.fetchChatMessages)(chatId));
        (_node$current = node.current) === null || _node$current === void 0 ? void 0 : _node$current.addEventListener('scroll', function (e) { return handleScroll.current(e); });
        window.addEventListener('resize', handleResize);
        scrollToBottom();
        return function () {
            var _node$current2;
            (_node$current2 = node.current) === null || _node$current2 === void 0 ? void 0 : _node$current2.removeEventListener('scroll', function (e) { return handleScroll.current(e); });
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Store the scroll position.
    (0,react__WEBPACK_IMPORTED_MODULE_5__.useLayoutEffect)(function () {
        if (node.current) {
            var _a = node.current, scrollHeight = _a.scrollHeight, scrollTop = _a.scrollTop;
            scrollBottom.current = scrollHeight - scrollTop;
        }
    }); // Stick scrollbar to bottom.
    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
        if (isNearBottom()) {
            scrollToBottom();
        } // First load.
        if (chatMessages.count() !== initialCount) {
            setInitialLoad(false);
            setIsLoading(false);
            scrollToBottom();
        }
    }, [chatMessages.count()]);
    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
        scrollToBottom();
    }, [messagesEnd.current]); // History added.
    (0,react__WEBPACK_IMPORTED_MODULE_5__.useEffect)(function () {
        // Restore scroll bar position when loading old messages.
        if (!initialLoad) {
            restoreScrollPosition();
        }
    }, [chatMessageIds.first()]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "chat-messages",
        ref: node,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 309,
            columnNumber: 5
        }
    }, chatMessages.reduce(function (acc, curr, idx) {
        var lastMessage = chatMessages.get(idx - 1);
        if (lastMessage) {
            var key = "".concat(curr.id, "_divider");
            switch (timeChange(lastMessage, curr)) {
                case 'today':
                    acc.push(renderDivider(key, intl.formatMessage(messages.today)));
                    break;
                case 'date':
                    acc.push(renderDivider(key, new Date(curr.created_at).toDateString()));
                    break;
            }
        }
        acc.push(renderMessage(curr));
        return acc;
    }, []), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        style: {
            float: 'left',
            clear: 'both'
        },
        ref: messagesEnd,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 328,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ChatMessageList);


/***/ }),

/***/ 1261:
/*!********************************************************!*\
  !*** ./app/soapbox/features/chats/components/chat.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/avatar */ 412);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/display-name */ 415);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_emoji_emoji__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/features/emoji/emoji */ 62);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/components/chat.tsx";









var getChat = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetChat)();
var Chat = function (_ref) {
    var chatId = _ref.chatId, onClick = _ref.onClick;
    var chat = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var chat = state.chats.items.get(chatId);
        return chat ? getChat(state, chat.toJS()) : undefined;
    });
    var account = chat.account;
    if (!chat || !account)
        return null;
    var unreadCount = chat.unread;
    var content = chat.getIn(['last_message', 'content']);
    var attachment = chat.getIn(['last_message', 'attachment']);
    var image = attachment && attachment.getIn(['pleroma', 'mime_type'], '').startsWith('image/');
    var parsedContent = content ? (0,soapbox_features_emoji_emoji__WEBPACK_IMPORTED_MODULE_5__["default"])(content) : '';
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
        className: "floating-link",
        onClick: function () { return onClick(chat); },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        key: account.id,
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_1__["default"], {
        account: account,
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_2__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 11
        }
    }), attachment && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        className: "chat__attachment-icon",
        src: image ? __webpack_require__(/*! @tabler/icons/photo.svg */ 743) : __webpack_require__(/*! @tabler/icons/paperclip.svg */ 224),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 13
        }
    }), content ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "chat__last-message",
        dangerouslySetInnerHTML: {
            __html: parsedContent
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 13
        }
    }) : attachment && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "chat__last-message attachment",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 13
        }
    }, image ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "chats.attachment_image",
        defaultMessage: "Image",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 24
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "chats.attachment",
        defaultMessage: "Attachment",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 98
        }
    })), unreadCount > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "absolute top-1 right-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Counter, {
        count: unreadCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 15
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (Chat);


/***/ }),

/***/ 1218:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/compose/components/compose_form.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ComposeForm; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/get */ 254);
/* harmony import */ var lodash_get__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_get__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-immutable-proptypes */ 193);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-immutable-pure-component */ 156);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var stringz__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! stringz */ 225);
/* harmony import */ var stringz__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(stringz__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var soapbox_components_autosuggest_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/autosuggest_input */ 394);
/* harmony import */ var soapbox_components_autosuggest_textarea__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/autosuggest_textarea */ 1219);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/components/ui/icon/svg-icon */ 71);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/is_mobile */ 65);
/* harmony import */ var _containers_emoji_picker_dropdown_container__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../containers/emoji_picker_dropdown_container */ 516);
/* harmony import */ var _components_polls_poll_form__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../components/polls/poll-form */ 1222);
/* harmony import */ var _components_reply_mentions__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../components/reply_mentions */ 1223);
/* harmony import */ var _components_upload_form__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../components/upload_form */ 1224);
/* harmony import */ var _components_warning__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../components/warning */ 740);
/* harmony import */ var _containers_language_dropdown_container__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../containers/language_dropdown_container */ 1232);
/* harmony import */ var _containers_markdown_button_container__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../containers/markdown_button_container */ 1234);
/* harmony import */ var _containers_poll_button_container__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../containers/poll_button_container */ 1237);
/* harmony import */ var _containers_privacy_dropdown_container__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../containers/privacy_dropdown_container */ 1239);
/* harmony import */ var _containers_quoted_status_container__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../containers/quoted_status_container */ 1241);
/* harmony import */ var _containers_reply_indicator_container__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../containers/reply_indicator_container */ 1242);
/* harmony import */ var _containers_schedule_button_container__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../containers/schedule_button_container */ 1243);
/* harmony import */ var _containers_schedule_form_container__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../containers/schedule_form_container */ 1245);
/* harmony import */ var _containers_spoiler_button_container__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../containers/spoiler_button_container */ 1246);
/* harmony import */ var _containers_upload_button_container__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../containers/upload_button_container */ 1248);
/* harmony import */ var _containers_warning_container__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../containers/warning_container */ 1249);
/* harmony import */ var _util_counter__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../util/counter */ 1250);
/* harmony import */ var _text_character_counter__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./text_character_counter */ 1251);
/* harmony import */ var _visual_character_counter__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./visual_character_counter */ 1252);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/compose_form.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }


































var allowedAroundShortCode = '><\u0085\u0020\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\u0009\u000a\u000b\u000c\u000d';
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_33__.defineMessages)({
    placeholder: {
        "id": "compose_form.placeholder",
        "defaultMessage": "What's on your mind?"
    },
    pollPlaceholder: {
        "id": "compose_form.poll_placeholder",
        "defaultMessage": "Add a poll topic..."
    },
    spoiler_placeholder: {
        "id": "compose_form.spoiler_placeholder",
        "defaultMessage": "Write your warning here"
    },
    publish: {
        "id": "compose_form.publish",
        "defaultMessage": "Post"
    },
    publishLoud: {
        "id": "compose_form.publish_loud",
        "defaultMessage": "{publish}!"
    },
    message: {
        "id": "compose_form.message",
        "defaultMessage": "Message"
    },
    schedule: {
        "id": "compose_form.schedule",
        "defaultMessage": "Schedule"
    },
    saveChanges: {
        "id": "compose_form.save_changes",
        "defaultMessage": "Save changes"
    },
    marked: {
        "id": "compose_form.spoiler.marked",
        "defaultMessage": "Text is hidden behind warning"
    }
});
var ComposeForm = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_34__.withRouter)(_class = (_class2 = /** @class */ (function (_super) {
    __extends(ComposeForm, _super);
    function ComposeForm() {
        var _this_1 = this;
        var _this;
        _this_1 = _super.apply(this, arguments) || this;
        _this = _this_1;
        _defineProperty(_this_1, "state", {
            composeFocused: false
        });
        _defineProperty(_this_1, "handleChange", function (e) {
            _this_1.props.onChange(e.target.value);
        });
        _defineProperty(_this_1, "handleComposeFocus", function () {
            _this_1.setState({
                composeFocused: true
            });
        });
        _defineProperty(_this_1, "handleKeyDown", function (e) {
            if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
                _this_1.handleSubmit();
                e.preventDefault(); // Prevent bubbling to other ComposeForm instances
            }
        });
        _defineProperty(_this_1, "getClickableArea", function () {
            var clickableAreaRef = _this_1.props.clickableAreaRef;
            return clickableAreaRef ? clickableAreaRef.current : _this_1.form;
        });
        _defineProperty(_this_1, "isEmpty", function () {
            var _a = _this_1.props, text = _a.text, spoilerText = _a.spoilerText, anyMedia = _a.anyMedia;
            return !(text || spoilerText || anyMedia);
        });
        _defineProperty(_this_1, "isClickOutside", function (e) {
            return ![
                // FIXME: Make this less brittle
                _this_1.getClickableArea(), document.querySelector('.privacy-dropdown__dropdown'), document.querySelector('.emoji-picker-dropdown__menu'), document.getElementById('modal-overlay')
            ].some(function (element) { return element === null || element === void 0 ? void 0 : element.contains(e.target); });
        });
        _defineProperty(_this_1, "handleClick", function (e) {
            if (_this_1.isEmpty() && _this_1.isClickOutside(e)) {
                _this_1.handleClickOutside();
            }
        });
        _defineProperty(_this_1, "handleClickOutside", function () {
            _this_1.setState({
                composeFocused: false
            });
        });
        _defineProperty(_this_1, "handleSubmit", function () {
            if (_this_1.props.text !== _this_1.autosuggestTextarea.textarea.value) {
                // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
                // Update the state to match the current text
                _this_1.props.onChange(_this_1.autosuggestTextarea.textarea.value);
            } // Submit disabled:
            var _a = _this_1.props, isSubmitting = _a.isSubmitting, isChangingUpload = _a.isChangingUpload, isUploading = _a.isUploading, anyMedia = _a.anyMedia, maxTootChars = _a.maxTootChars;
            var fulltext = [_this_1.props.spoilerText, (0,_util_counter__WEBPACK_IMPORTED_MODULE_30__.countableText)(_this_1.props.text)].join('');
            if (isSubmitting || isUploading || isChangingUpload || (0,stringz__WEBPACK_IMPORTED_MODULE_7__.length)(fulltext) > maxTootChars || fulltext.length !== 0 && fulltext.trim().length === 0 && !anyMedia) {
                return;
            }
            _this_1.props.onSubmit(_this_1.props.history ? _this_1.props.history : null, _this_1.props.group);
        });
        _defineProperty(_this_1, "onSuggestionsClearRequested", function () {
            _this_1.props.onClearSuggestions();
        });
        _defineProperty(_this_1, "onSuggestionsFetchRequested", function (token) {
            _this_1.props.onFetchSuggestions(token);
        });
        _defineProperty(_this_1, "onSuggestionSelected", function (tokenStart, token, value) {
            _this_1.props.onSuggestionSelected(tokenStart, token, value, ['text']);
        });
        _defineProperty(_this_1, "onSpoilerSuggestionSelected", function (tokenStart, token, value) {
            _this_1.props.onSuggestionSelected(tokenStart, token, value, ['spoiler_text']);
        });
        _defineProperty(_this_1, "handleChangeSpoilerText", function (e) {
            _this_1.props.onChangeSpoilerText(e.target.value);
        });
        _defineProperty(_this_1, "setCursor", function (start) {
            var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;
            if (!_this.autosuggestTextarea)
                return;
            _this.autosuggestTextarea.textarea.setSelectionRange(start, end);
        });
        _defineProperty(_this_1, "setAutosuggestTextarea", function (c) {
            _this_1.autosuggestTextarea = c;
        });
        _defineProperty(_this_1, "setForm", function (c) {
            _this_1.form = c;
        });
        _defineProperty(_this_1, "setSpoilerText", function (c) {
            _this_1.spoilerText = c;
        });
        _defineProperty(_this_1, "handleEmojiPick", function (data) {
            var text = _this_1.props.text;
            var position = _this_1.autosuggestTextarea.textarea.selectionStart;
            var needsSpace = data.custom && position > 0 && !allowedAroundShortCode.includes(text[position - 1]);
            _this_1.props.onPickEmoji(position, data, needsSpace);
        });
        _defineProperty(_this_1, "focusSpoilerInput", function () {
            var spoilerInput = lodash_get__WEBPACK_IMPORTED_MODULE_2___default()(_this_1, ['spoilerText', 'input']);
            if (spoilerInput)
                spoilerInput.focus();
        });
        _defineProperty(_this_1, "focusTextarea", function () {
            var textarea = lodash_get__WEBPACK_IMPORTED_MODULE_2___default()(_this_1, ['autosuggestTextarea', 'textarea']);
            if (textarea)
                textarea.focus();
        });
        _defineProperty(_this_1, "maybeUpdateFocus", function (prevProps) {
            var spoilerUpdated = _this_1.props.spoiler !== prevProps.spoiler;
            if (spoilerUpdated) {
                switch (_this_1.props.spoiler) {
                    case true:
                        _this_1.focusSpoilerInput();
                        break;
                    case false:
                        _this_1.focusTextarea();
                        break;
                }
            }
        });
        _defineProperty(_this_1, "maybeUpdateCursor", function (prevProps) {
            var shouldUpdate = [
                // the cursor position explicitly set
                _this_1.props.focusDate !== prevProps.focusDate, typeof _this_1.props.caretPosition === 'number'
            ].every(Boolean);
            if (shouldUpdate) {
                _this_1.setCursor(_this_1.props.caretPosition);
            }
        });
        return _this_1;
    }
    ComposeForm.prototype.componentDidMount = function () {
        var length = this.props.text.length;
        document.addEventListener('click', this.handleClick, true);
        if (length > 0) {
            this.setCursor(length); // Set cursor at end
        }
    };
    ComposeForm.prototype.componentWillUnmount = function () {
        document.removeEventListener('click', this.handleClick, true);
    };
    ComposeForm.prototype.componentDidUpdate = function (prevProps) {
        this.maybeUpdateFocus(prevProps);
        this.maybeUpdateCursor(prevProps);
    };
    ComposeForm.prototype.render = function () {
        var _a = this.props, intl = _a.intl, onPaste = _a.onPaste, showSearch = _a.showSearch, anyMedia = _a.anyMedia, shouldCondense = _a.shouldCondense, autoFocus = _a.autoFocus, isModalOpen = _a.isModalOpen, maxTootChars = _a.maxTootChars, scheduledStatus = _a.scheduledStatus, features = _a.features, spoilerForced = _a.spoilerForced;
        var condensed = shouldCondense && !this.state.composeFocused && this.isEmpty() && !this.props.isUploading;
        var disabled = this.props.isSubmitting;
        var text = [this.props.spoilerText, (0,_util_counter__WEBPACK_IMPORTED_MODULE_30__.countableText)(this.props.text)].join('');
        var disabledButton = disabled || this.props.isUploading || this.props.isChangingUpload || (0,stringz__WEBPACK_IMPORTED_MODULE_7__.length)(text) > maxTootChars || text.length !== 0 && text.trim().length === 0 && !anyMedia;
        var shouldAutoFocus = autoFocus && !showSearch && !(0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_13__.isMobile)(window.innerWidth);
        var publishText = '';
        if (this.props.isEditing) {
            publishText = intl.formatMessage(messages.saveChanges);
        }
        else if (this.props.privacy === 'direct') {
            publishText = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react__WEBPACK_IMPORTED_MODULE_4__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_10__["default"], {
                src: __webpack_require__(/*! @tabler/icons/mail.svg */ 141),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 281,
                    columnNumber: 11
                }
            }), intl.formatMessage(messages.message));
        }
        else if (this.props.privacy === 'private') {
            publishText = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react__WEBPACK_IMPORTED_MODULE_4__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_10__["default"], {
                src: __webpack_require__(/*! @tabler/icons/lock.svg */ 161),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 288,
                    columnNumber: 11
                }
            }), intl.formatMessage(messages.publish));
        }
        else {
            publishText = this.props.privacy !== 'unlisted' ? intl.formatMessage(messages.publishLoud, {
                publish: intl.formatMessage(messages.publish)
            }) : intl.formatMessage(messages.publish);
        }
        if (this.props.scheduledAt) {
            publishText = intl.formatMessage(messages.schedule);
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_11__.Stack, {
            className: "w-full",
            space: 1,
            ref: this.setForm,
            onClick: this.handleClick,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 301,
                columnNumber: 7
            }
        }, scheduledStatus.size > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_components_warning__WEBPACK_IMPORTED_MODULE_18__["default"], {
            message: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_35__["default"], {
                id: "compose_form.scheduled_statuses.message",
                defaultMessage: "You have scheduled posts. {click_here} to see them.",
                values: {
                    click_here: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_36__.Link, {
                        to: "/scheduled_statuses",
                        __self: this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 309,
                            columnNumber: 19
                        }
                    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_35__["default"], {
                        id: "compose_form.scheduled_statuses.click_here",
                        defaultMessage: "Click here",
                        __self: this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 310,
                            columnNumber: 21
                        }
                    }))
                },
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 305,
                    columnNumber: 15
                }
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 303,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_warning_container__WEBPACK_IMPORTED_MODULE_29__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 321,
                columnNumber: 9
            }
        }), !shouldCondense && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_reply_indicator_container__WEBPACK_IMPORTED_MODULE_24__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 323,
                columnNumber: 29
            }
        }), !shouldCondense && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_components_reply_mentions__WEBPACK_IMPORTED_MODULE_16__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 325,
                columnNumber: 29
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
                'relative transition-height': true,
                'hidden': !this.props.spoiler
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 327,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_autosuggest_input__WEBPACK_IMPORTED_MODULE_8__["default"], {
            placeholder: intl.formatMessage(messages.spoiler_placeholder),
            value: this.props.spoilerText,
            onChange: this.handleChangeSpoilerText,
            onKeyDown: this.handleKeyDown,
            disabled: this.props.spoilerForced || !this.props.spoiler,
            ref: this.setSpoilerText,
            suggestions: this.props.suggestions,
            onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.onSuggestionsClearRequested,
            onSuggestionSelected: this.onSpoilerSuggestionSelected,
            searchTokens: [':'],
            id: "cw-spoiler-input",
            className: "border-none shadow-none px-0 py-2 text-base",
            autoFocus: true,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 333,
                columnNumber: 11
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_autosuggest_textarea__WEBPACK_IMPORTED_MODULE_9__["default"], {
            ref: isModalOpen && shouldCondense ? null : this.setAutosuggestTextarea,
            placeholder: intl.formatMessage(this.props.hasPoll ? messages.pollPlaceholder : messages.placeholder),
            disabled: disabled,
            value: this.props.text,
            onChange: this.handleChange,
            suggestions: this.props.suggestions,
            onKeyDown: this.handleKeyDown,
            onFocus: this.handleComposeFocus,
            onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
            onSuggestionsClearRequested: this.onSuggestionsClearRequested,
            onSuggestionSelected: this.onSuggestionSelected,
            onPaste: onPaste,
            autoFocus: shouldAutoFocus,
            condensed: condensed,
            id: "compose-textarea",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 351,
                columnNumber: 9
            }
        }, !condensed && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            className: "compose-form__modifiers",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 370,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_components_upload_form__WEBPACK_IMPORTED_MODULE_17__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 371,
                columnNumber: 15
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_components_polls_poll_form__WEBPACK_IMPORTED_MODULE_15__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 372,
                columnNumber: 15
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_schedule_form_container__WEBPACK_IMPORTED_MODULE_26__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 373,
                columnNumber: 15
            }
        }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_quoted_status_container__WEBPACK_IMPORTED_MODULE_23__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 378,
                columnNumber: 9
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('flex flex-wrap items-center justify-between', {
                'hidden': condensed
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 380,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            className: "flex items-center space-x-2",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 385,
                columnNumber: 11
            }
        }, features.media && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_upload_button_container__WEBPACK_IMPORTED_MODULE_28__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 386,
                columnNumber: 32
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_emoji_picker_dropdown_container__WEBPACK_IMPORTED_MODULE_14__["default"], {
            onPickEmoji: this.handleEmojiPick,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 387,
                columnNumber: 13
            }
        }), features.polls && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_poll_button_container__WEBPACK_IMPORTED_MODULE_21__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 388,
                columnNumber: 32
            }
        }), features.privacyScopes && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_privacy_dropdown_container__WEBPACK_IMPORTED_MODULE_22__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 389,
                columnNumber: 40
            }
        }), features.scheduledStatuses && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_schedule_button_container__WEBPACK_IMPORTED_MODULE_25__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 390,
                columnNumber: 44
            }
        }), features.spoilers && (spoilerForced ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_12__["default"], {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('cursor-not-allowed text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'),
            src: __webpack_require__(/*! @tabler/icons/alert-triangle.svg */ 260),
            title: intl.formatMessage(messages.marked),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 392,
                columnNumber: 31
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_spoiler_button_container__WEBPACK_IMPORTED_MODULE_27__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 396,
                columnNumber: 20
            }
        })), features.richText && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_markdown_button_container__WEBPACK_IMPORTED_MODULE_20__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 398,
                columnNumber: 35
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_containers_language_dropdown_container__WEBPACK_IMPORTED_MODULE_19__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 399,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            className: "flex items-center mt-2 space-x-4 ml-auto",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 402,
                columnNumber: 11
            }
        }, maxTootChars && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            className: "flex items-center space-x-1",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 404,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_text_character_counter__WEBPACK_IMPORTED_MODULE_31__["default"], {
            max: maxTootChars,
            text: text,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 405,
                columnNumber: 17
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_visual_character_counter__WEBPACK_IMPORTED_MODULE_32__["default"], {
            max: maxTootChars,
            text: text,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 406,
                columnNumber: 17
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_11__.Button, {
            theme: "primary",
            text: publishText,
            onClick: this.handleSubmit,
            disabled: disabledButton,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 410,
                columnNumber: 13
            }
        }))));
    };
    return ComposeForm;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_6__["default"])), _defineProperty(_class2, "propTypes", {
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().object.isRequired),
    text: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string.isRequired),
    suggestions: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_5___default().list),
    spoiler: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    privacy: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
    spoilerText: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
    focusDate: prop_types__WEBPACK_IMPORTED_MODULE_3___default().instanceOf(Date),
    caretPosition: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().number),
    hasPoll: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    isSubmitting: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    isChangingUpload: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    isEditing: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    isUploading: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    onChange: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onSubmit: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onClearSuggestions: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onFetchSuggestions: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onSuggestionSelected: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onChangeSpoilerText: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onPaste: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onPickEmoji: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    showSearch: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    anyMedia: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    shouldCondense: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    autoFocus: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    group: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_5___default().map),
    isModalOpen: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    clickableAreaRef: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().object),
    scheduledAt: prop_types__WEBPACK_IMPORTED_MODULE_3___default().instanceOf(Date),
    features: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().object.isRequired),
    spoilerForced: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    scheduledStatus: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().array)
}), _defineProperty(_class2, "defaultProps", {
    showSearch: false,
    spoilerForced: false
}), _class2)) || _class;



/***/ }),

/***/ 100:
/*!*************************************************************************!*\
  !*** ./app/soapbox/features/compose/components/compose_form_button.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/compose_form_button.tsx";



var ComposeFormButton = function (_ref) {
    var icon = _ref.icon, title = _ref.title, active = _ref.active, disabled = _ref.disabled, onClick = _ref.onClick;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.IconButton, {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('text-gray-400 hover:text-gray-600', {
            'text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300': active
        }),
        src: icon,
        title: title,
        disabled: disabled,
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ComposeFormButton);


/***/ }),

/***/ 1233:
/*!***********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/language_dropdown.tsx ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var detect_passive_events__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! detect-passive-events */ 2515);
/* harmony import */ var iso_639_1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! iso-639-1 */ 741);
/* harmony import */ var iso_639_1__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(iso_639_1__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ 267);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_popper__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-popper */ 2537);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/is_mobile */ 65);
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
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/language_dropdown.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
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











var listenerOptions = detect_passive_events__WEBPACK_IMPORTED_MODULE_9__.supportsPassiveEvents ? {
    passive: true
} : false;
var LanguageDropdownMenu = function (_ref) {
    var style = _ref.style, items = _ref.items, value = _ref.value, onClose = _ref.onClose, onChange = _ref.onChange, reference = _ref.reference;
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(null), node = _a[0], setNode = _a[1];
    var list = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
    var focusedItem = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
    var top = reference.getBoundingClientRect().top;
    var _b = (0,react_popper__WEBPACK_IMPORTED_MODULE_10__.usePopper)(reference, node, {
        placement: top * 2 < window.innerHeight ? 'bottom' : 'top'
    }), attributes = _b.attributes, styles = _b.styles;
    var handleDocumentClick = function (e) {
        if (node && !node.contains(e.target)) {
            onClose();
        }
    };
    var handleKeyDown = function (e) {
        var _list$current, _list$current2, _list$current3, _list$current4, _list$current9, _list$current10;
        var index = Number.parseInt(e.currentTarget.getAttribute('data-index'), 10);
        var element = undefined;
        switch (e.key) {
            case 'Escape':
                onClose();
                break;
            case 'Enter':
                handleClick(e);
                break;
            case 'ArrowDown':
                element = ((_list$current = list.current) === null || _list$current === void 0 ? void 0 : _list$current.querySelector("[data-index='".concat(index + 1, "']"))) || ((_list$current2 = list.current) === null || _list$current2 === void 0 ? void 0 : _list$current2.firstChild);
                break;
            case 'ArrowUp':
                element = ((_list$current3 = list.current) === null || _list$current3 === void 0 ? void 0 : _list$current3.querySelector("[data-index='".concat(index - 1, "']"))) || ((_list$current4 = list.current) === null || _list$current4 === void 0 ? void 0 : _list$current4.lastChild);
                break;
            case 'Tab':
                if (e.shiftKey) {
                    var _list$current5, _list$current6;
                    element = ((_list$current5 = list.current) === null || _list$current5 === void 0 ? void 0 : _list$current5.querySelector("[data-index='".concat(index - 1, "']"))) || ((_list$current6 = list.current) === null || _list$current6 === void 0 ? void 0 : _list$current6.lastChild);
                }
                else {
                    var _list$current7, _list$current8;
                    element = ((_list$current7 = list.current) === null || _list$current7 === void 0 ? void 0 : _list$current7.querySelector("[data-index='".concat(index + 1, "']"))) || ((_list$current8 = list.current) === null || _list$current8 === void 0 ? void 0 : _list$current8.firstChild);
                }
                break;
            case 'Home':
                element = (_list$current9 = list.current) === null || _list$current9 === void 0 ? void 0 : _list$current9.firstChild;
                break;
            case 'End':
                element = (_list$current10 = list.current) === null || _list$current10 === void 0 ? void 0 : _list$current10.lastChild;
                break;
        }
        if (element) {
            element.focus();
            e.preventDefault();
            e.stopPropagation();
        }
    };
    var handleClick = function (e) {
        var option = items.find(function (it) {
            var _e$currentTarget;
            return it.value === ((_e$currentTarget = e.currentTarget) === null || _e$currentTarget === void 0 ? void 0 : _e$currentTarget.getAttribute('data-value'));
        });
        e.preventDefault();
        onClose();
        onChange(option);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(function () {
        document.addEventListener('click', handleDocumentClick, false);
        document.addEventListener('touchend', handleDocumentClick, listenerOptions);
        return function () {
            document.removeEventListener('click', handleDocumentClick, false);
            document.removeEventListener('touchend', handleDocumentClick);
        };
    }, []);
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(items), currentItems = _c[0], setCurrentItems = _c[1];
    var onSearchChange = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)((0,lodash__WEBPACK_IMPORTED_MODULE_3__.debounce)(function (e) {
        var search = e.target.value.toUpperCase().normalize('NFC');
        if (search.length === 0) {
            setCurrentItems(items);
            return;
        }
        setCurrentItems(items.filter(function (i) { return i.label.toUpperCase().normalize('NFC').indexOf(search) !== -1; }));
    }, 500), [items]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", _extends({
        className: 'absolute bg-white dark:bg-slate-900 z-[1000] rounded-md shadow-lg ml-10 text-sm',
        style: _objectSpread(_objectSpread({}, style), styles.popper),
        role: "listbox",
        ref: setNode
    }, attributes.popper, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 5
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
        className: "p-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Input, {
        autoFocus: true,
        onChange: onSearchChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 115,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
        className: "h-[250px] overflow-y-auto",
        ref: list,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 117,
            columnNumber: 7
        }
    }, currentItems.map(function (item, index) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
        role: "option",
        tabIndex: 0,
        key: item.value + index,
        "data-index": index,
        "data-value": item.value,
        onKeyDown: handleKeyDown,
        onClick: handleClick,
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('p-3 cursor-pointer hover:bg-gray-100', {
            active: item.value === value
        }),
        "aria-selected": item.value === value,
        ref: item.value === value ? focusedItem : null,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 119,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
        className: "language-dropdown__option__content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 120,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("strong", {
        className: "text-primary-600",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 15
        }
    }, item.value), "\xA0", item.label)); })));
};
var ALL_OPTIONS = iso_639_1__WEBPACK_IMPORTED_MODULE_2___default().getAllCodes().map(function (code) { return ({
    value: code,
    label: iso_639_1__WEBPACK_IMPORTED_MODULE_2___default().getNativeName(code)
}); });
var STORAGE_KEY = 'soapbox:language_dropdown';
function dedup(items) {
    return Array.from(new Set(items.map(function (i) { return JSON.stringify(i); }))).map(function (i) { return JSON.parse(i); });
}
var LanguageDropdown = function (_ref2) {
    var onChange = _ref2.onChange, defaultValue = _ref2.defaultValue, value = _ref2.value;
    var node = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
    var activeElement = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.useDispatch)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false), open = _a[0], setOpen = _a[1];
    var buildOptions = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(function () {
        var previousChoices = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return __spreadArray(__spreadArray([], previousChoices, true), ALL_OPTIONS, true);
    }, []);
    var options = (0,react__WEBPACK_IMPORTED_MODULE_4__.useMemo)(function () { return buildOptions(); }, [buildOptions, value]);
    var handleToggle = react__WEBPACK_IMPORTED_MODULE_4__.useCallback(function (e) {
        e.stopPropagation();
        if ((0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_8__.isUserTouching)()) {
            if (open)
                dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_6__.closeModal)('ACTIONS'));
            else
                dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_6__.openModal)('ACTIONS', {
                    actions: options.map(function (option) { return _objectSpread(_objectSpread({}, option), {}, {
                        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react__WEBPACK_IMPORTED_MODULE_4__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("strong", {
                            className: "text-primary-600",
                            __self: _this,
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 167,
                                columnNumber: 98
                            }
                        }, option.value), "\xA0", option.label),
                        active: option.value === value
                    }); }),
                    onClick: handleModalActionClick
                }));
        }
        else {
            var _activeElement$curren;
            if (open)
                (_activeElement$curren = activeElement.current) === null || _activeElement$curren === void 0 ? void 0 : _activeElement$curren.focus();
            setOpen(!open);
        }
    }, [open, dispatch]);
    var onInternalChange = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(function (option) {
        var previousChoices = dedup(__spreadArray([option], JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'), true)).slice(0, 3);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(previousChoices));
        onChange(option.value);
    }, [onChange]);
    var handleModalActionClick = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(function (e) {
        e.preventDefault();
        var option = options[e.currentTarget.getAttribute('data-index')];
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_6__.closeModal)('ACTIONS'));
        onInternalChange(option);
    }, [options, dispatch, onInternalChange]);
    var handleKeyDown = function (e) {
        switch (e.key) {
            case 'Escape':
                handleClose();
                break;
        }
    };
    var handleMouseDown = function () {
        if (!open) {
            activeElement.current = document.activeElement;
        }
    };
    var handleButtonKeyDown = function (e) {
        switch (e.key) {
            case ' ':
            case 'Enter':
                handleMouseDown();
                break;
        }
    };
    var handleClose = function () {
        if (open) {
            var _activeElement$curren2;
            (_activeElement$curren2 = activeElement.current) === null || _activeElement$curren2 === void 0 ? void 0 : _activeElement$curren2.focus();
        }
        setOpen(false);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('language-dropdown', {
            active: open
        }),
        onKeyDown: handleKeyDown,
        ref: node,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 218,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('language-dropdown__value'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 219,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("button", {
        className: "text-gray-400 hover:text-gray-600 border-0 bg-transparent px-1 font-bold",
        onClick: handleToggle,
        onMouseDown: handleMouseDown,
        onKeyDown: handleButtonKeyDown,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 220,
            columnNumber: 9
        }
    }, value || defaultValue)), open && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(LanguageDropdownMenu, {
        items: options,
        value: value,
        onClose: handleClose,
        onChange: onInternalChange,
        reference: node.current,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 232,
            columnNumber: 11
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (LanguageDropdown);


/***/ }),

/***/ 1235:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/markdown_button.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var _compose_form_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compose_form_button */ 100);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/markdown_button.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    marked: {
        "id": "compose_form.markdown.marked",
        "defaultMessage": "Post markdown enabled"
    },
    unmarked: {
        "id": "compose_form.markdown.unmarked",
        "defaultMessage": "Post markdown disabled"
    }
});
var MarkdownButton = function (_ref) {
    var active = _ref.active, onClick = _ref.onClick;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_compose_form_button__WEBPACK_IMPORTED_MODULE_1__["default"], {
        icon: __webpack_require__(/*! @tabler/icons/markdown.svg */ 1236),
        title: intl.formatMessage(active ? messages.marked : messages.unmarked),
        active: active,
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (MarkdownButton);


/***/ }),

/***/ 1238:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/compose/components/poll_button.tsx ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var _compose_form_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compose_form_button */ 100);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/poll_button.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    add_poll: {
        "id": "poll_button.add_poll",
        "defaultMessage": "Add a poll"
    },
    remove_poll: {
        "id": "poll_button.remove_poll",
        "defaultMessage": "Remove poll"
    }
});
var PollButton = function (_ref) {
    var active = _ref.active, unavailable = _ref.unavailable, disabled = _ref.disabled, onClick = _ref.onClick;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])();
    if (unavailable) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_compose_form_button__WEBPACK_IMPORTED_MODULE_1__["default"], {
        icon: __webpack_require__(/*! @tabler/icons/chart-bar.svg */ 816),
        title: intl.formatMessage(active ? messages.remove_poll : messages.add_poll),
        active: active,
        disabled: disabled,
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (PollButton);


/***/ }),

/***/ 1345:
/*!*****************************************************************************!*\
  !*** ./app/soapbox/features/compose/components/polls/duration-selector.tsx ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
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
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/polls/duration-selector.tsx";




var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__.defineMessages)({
    minutes: {
        "id": "intervals.full.minutes",
        "defaultMessage": "{number, plural, one {# minute} other {# minutes}}"
    },
    hours: {
        "id": "intervals.full.hours",
        "defaultMessage": "{number, plural, one {# hour} other {# hours}}"
    },
    days: {
        "id": "intervals.full.days",
        "defaultMessage": "{number, plural, one {# day} other {# days}}"
    }
});
var DurationSelector = function (_ref) {
    var onDurationChange = _ref.onDurationChange;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(2), days = _a[0], setDays = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0), hours = _b[0], setHours = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0), minutes = _c[0], setMinutes = _c[1];
    var value = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () {
        var now = new Date();
        var future = new Date();
        now.setDate(now.getDate() + days);
        now.setMinutes(now.getMinutes() + minutes);
        now.setHours(now.getHours() + hours);
        return Math.round((now - future) / 1000);
    }, [days, hours, minutes]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (days === 7) {
            setHours(0);
            setMinutes(0);
        }
    }, [days]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        onDurationChange(value);
    }, [value]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "grid grid-cols-1 gap-y-2 gap-x-2 sm:grid-cols-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "sm:col-span-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Select, {
        value: days,
        onChange: function (event) { return setDays(Number(event.target.value)); },
        "data-testid": "duration-selector-days",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 9
        }
    }, __spreadArray([], Array(8).fill(undefined), true).map(function (_, number) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", {
        value: number,
        key: number,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 13
        }
    }, intl.formatMessage(messages.days, {
        number: number
    })); }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "sm:col-span-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Select, {
        value: hours,
        onChange: function (event) { return setHours(Number(event.target.value)); },
        disabled: days === 7,
        "data-testid": "duration-selector-hours",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 9
        }
    }, __spreadArray([], Array(24).fill(undefined), true).map(function (_, number) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", {
        value: number,
        key: number,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 13
        }
    }, intl.formatMessage(messages.hours, {
        number: number
    })); }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "sm:col-span-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Select, {
        value: minutes,
        onChange: function (event) { return setMinutes(Number(event.target.value)); },
        disabled: days === 7,
        "data-testid": "duration-selector-minutes",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 9
        }
    }, [0, 15, 30, 45].map(function (number) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", {
        value: number,
        key: number,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 13
        }
    }, intl.formatMessage(messages.minutes, {
        number: number
    })); }))));
};
/* harmony default export */ __webpack_exports__["default"] = (DurationSelector);


/***/ }),

/***/ 1222:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/polls/poll-form.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 27);
/* harmony import */ var soapbox_components_autosuggest_input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/autosuggest_input */ 394);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _duration_selector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./duration-selector */ 1345);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/polls/poll-form.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    option_placeholder: {
        "id": "compose_form.poll.option_placeholder",
        "defaultMessage": "Answer #{number}"
    },
    add_option: {
        "id": "compose_form.poll.add_option",
        "defaultMessage": "Add an answer"
    },
    remove_option: {
        "id": "compose_form.poll.remove_option",
        "defaultMessage": "Remove this answer"
    },
    pollDuration: {
        "id": "compose_form.poll.duration",
        "defaultMessage": "Duration"
    },
    removePoll: {
        "id": "compose_form.poll.remove",
        "defaultMessage": "Remove poll"
    },
    switchToMultiple: {
        "id": "compose_form.poll.switch_to_multiple",
        "defaultMessage": "Change poll to allow multiple answers"
    },
    switchToSingle: {
        "id": "compose_form.poll.switch_to_single",
        "defaultMessage": "Change poll to allow for a single answer"
    },
    minutes: {
        "id": "intervals.full.minutes",
        "defaultMessage": "{number, plural, one {# minute} other {# minutes}}"
    },
    hours: {
        "id": "intervals.full.hours",
        "defaultMessage": "{number, plural, one {# hour} other {# hours}}"
    },
    days: {
        "id": "intervals.full.days",
        "defaultMessage": "{number, plural, one {# day} other {# days}}"
    },
    multiSelect: {
        "id": "compose_form.poll.multiselect",
        "defaultMessage": "Multi-Select"
    },
    multiSelectDetail: {
        "id": "compose_form.poll.multiselect_detail",
        "defaultMessage": "Allow users to select multiple answers"
    }
});
var Option = function (props) {
    var index = props.index, maxChars = props.maxChars, numOptions = props.numOptions, onChange = props.onChange, onRemove = props.onRemove, onRemovePoll = props.onRemovePoll, title = props.title;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var suggestions = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.compose.suggestions; });
    var handleOptionTitleChange = function (event) { return onChange(index, event.target.value); };
    var handleOptionRemove = function () {
        if (numOptions > 2) {
            onRemove(index);
        }
        else {
            onRemovePoll();
        }
    };
    var onSuggestionsClearRequested = function () { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.clearComposeSuggestions)()); };
    var onSuggestionsFetchRequested = function (token) { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.fetchComposeSuggestions)(token)); };
    var onSuggestionSelected = function (tokenStart, token, value) {
        if (token && typeof token === 'string') {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.selectComposeSuggestion)(tokenStart, token, value, ['poll', 'options', index]));
        }
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        alignItems: "center",
        justifyContent: "between",
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        alignItems: "center",
        space: 2,
        grow: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "w-6",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 11
        }
    }, index + 1, ".")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_autosuggest_input__WEBPACK_IMPORTED_MODULE_2__["default"], {
        className: "rounded-md",
        placeholder: intl.formatMessage(messages.option_placeholder, {
            number: index + 1
        }),
        maxLength: maxChars,
        value: title,
        onChange: handleOptionTitleChange,
        suggestions: suggestions,
        onSuggestionsFetchRequested: onSuggestionsFetchRequested,
        onSuggestionsClearRequested: onSuggestionsClearRequested,
        onSuggestionSelected: onSuggestionSelected,
        searchTokens: [':'],
        autoFocus: index === 0 || index >= 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 9
        }
    })), index > 1 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        theme: "danger",
        size: "sm",
        onClick: handleOptionRemove,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 11
        }
    }, "Delete")));
};
var PollForm = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var pollLimits = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.instance.getIn(['configuration', 'polls']); });
    var options = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var _state$compose$poll;
        return (_state$compose$poll = state.compose.poll) === null || _state$compose$poll === void 0 ? void 0 : _state$compose$poll.options;
    });
    var expiresIn = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var _state$compose$poll2;
        return (_state$compose$poll2 = state.compose.poll) === null || _state$compose$poll2 === void 0 ? void 0 : _state$compose$poll2.expires_in;
    });
    var isMultiple = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var _state$compose$poll3;
        return (_state$compose$poll3 = state.compose.poll) === null || _state$compose$poll3 === void 0 ? void 0 : _state$compose$poll3.multiple;
    });
    var maxOptions = pollLimits.get('max_options');
    var maxOptionChars = pollLimits.get('max_characters_per_option');
    var onRemoveOption = function (index) { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.removePollOption)(index)); };
    var onChangeOption = function (index, title) { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changePollOption)(index, title)); };
    var handleAddOption = function () { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.addPollOption)('')); };
    var onChangeSettings = function (expiresIn, isMultiple) { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changePollSettings)(expiresIn, isMultiple)); };
    var handleSelectDuration = function (value) { return onChangeSettings(value, isMultiple); };
    var handleToggleMultiple = function () { return onChangeSettings(expiresIn, !isMultiple); };
    var onRemovePoll = function () { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.removePoll)()); };
    if (!options) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 131,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 132,
            columnNumber: 7
        }
    }, options.map(function (title, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Option, {
        title: title,
        key: i,
        index: i,
        onChange: onChangeOption,
        onRemove: onRemoveOption,
        maxChars: maxOptionChars,
        numOptions: options.size,
        onRemovePoll: onRemovePoll,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 11
        }
    }); }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 146,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "w-6",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 11
        }
    }), options.size < maxOptions && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        theme: "secondary",
        onClick: handleAddOption,
        size: "sm",
        block: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 150,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], _extends({}, messages.add_option, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 156,
            columnNumber: 15
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Divider, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 162,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
        onClick: handleToggleMultiple,
        className: "text-left",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 164,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        alignItems: "center",
        justifyContent: "between",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 165,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 166,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 167,
            columnNumber: 13
        }
    }, intl.formatMessage(messages.multiSelect)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 171,
            columnNumber: 13
        }
    }, intl.formatMessage(messages.multiSelectDetail))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Toggle, {
        checked: isMultiple,
        onChange: handleToggleMultiple,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 176,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Divider, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 180,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 183,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 184,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.pollDuration)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_duration_selector__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onDurationChange: handleSelectDuration,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 188,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "text-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 192,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        theme: "danger-link",
        onClick: onRemovePoll,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 193,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.removePoll))));
};
/* harmony default export */ __webpack_exports__["default"] = (PollForm);


/***/ }),

/***/ 1240:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/privacy_dropdown.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var detect_passive_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! detect-passive-events */ 2515);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_popper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-popper */ 2537);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
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
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/privacy_dropdown.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
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








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    public_short: {
        "id": "privacy.public.short",
        "defaultMessage": "Public"
    },
    public_long: {
        "id": "privacy.public.long",
        "defaultMessage": "Post to public timelines"
    },
    unlisted_short: {
        "id": "privacy.unlisted.short",
        "defaultMessage": "Unlisted"
    },
    unlisted_long: {
        "id": "privacy.unlisted.long",
        "defaultMessage": "Do not post to public timelines"
    },
    local_short: {
        "id": "privacy.local.short",
        "defaultMessage": "Local-only"
    },
    local_long: {
        "id": "privacy.local.long",
        "defaultMessage": "Status is only visible to people on this instance"
    },
    private_short: {
        "id": "privacy.private.short",
        "defaultMessage": "Followers-only"
    },
    private_long: {
        "id": "privacy.private.long",
        "defaultMessage": "Post to followers only"
    },
    direct_short: {
        "id": "privacy.direct.short",
        "defaultMessage": "Direct"
    },
    direct_long: {
        "id": "privacy.direct.long",
        "defaultMessage": "Post to mentioned users only"
    },
    change_privacy: {
        "id": "privacy.change",
        "defaultMessage": "Adjust post privacy"
    }
});
var listenerOptions = detect_passive_events__WEBPACK_IMPORTED_MODULE_6__.supportsPassiveEvents ? {
    passive: true
} : false;
var PrivacyDropdownMenu = function (_ref) {
    var style = _ref.style, items = _ref.items, value = _ref.value, onClose = _ref.onClose, onChange = _ref.onChange, reference = _ref.reference;
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null), node = _a[0], setNode = _a[1];
    var focusedItem = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
    var top = reference.getBoundingClientRect().top;
    var _b = (0,react_popper__WEBPACK_IMPORTED_MODULE_7__.usePopper)(reference, node, {
        placement: top * 2 < window.innerHeight ? 'bottom' : 'top'
    }), attributes = _b.attributes, styles = _b.styles;
    var handleDocumentClick = function (e) {
        if (node && !node.contains(e.target)) {
            onClose();
        }
    };
    var handleKeyDown = function (e) {
        var value = e.currentTarget.getAttribute('data-index');
        var index = items.findIndex(function (item) { return item.value === value; });
        var element = null;
        switch (e.key) {
            case 'Escape':
                onClose();
                break;
            case 'Enter':
                handleClick(e);
                break;
            case 'ArrowDown':
                element = (node === null || node === void 0 ? void 0 : node.childNodes[index + 1]) || (node === null || node === void 0 ? void 0 : node.firstChild);
                break;
            case 'ArrowUp':
                element = (node === null || node === void 0 ? void 0 : node.childNodes[index - 1]) || (node === null || node === void 0 ? void 0 : node.lastChild);
                break;
            case 'Tab':
                if (e.shiftKey) {
                    element = (node === null || node === void 0 ? void 0 : node.childNodes[index - 1]) || (node === null || node === void 0 ? void 0 : node.lastChild);
                }
                else {
                    element = (node === null || node === void 0 ? void 0 : node.childNodes[index + 1]) || (node === null || node === void 0 ? void 0 : node.firstChild);
                }
                break;
            case 'Home':
                element = node === null || node === void 0 ? void 0 : node.firstChild;
                break;
            case 'End':
                element = node === null || node === void 0 ? void 0 : node.lastChild;
                break;
        }
        if (element) {
            element.focus();
            onChange(element.getAttribute('data-index'));
            e.preventDefault();
            e.stopPropagation();
        }
    };
    var handleClick = function (e) {
        var _e$currentTarget;
        var value = (_e$currentTarget = e.currentTarget) === null || _e$currentTarget === void 0 ? void 0 : _e$currentTarget.getAttribute('data-index');
        e.preventDefault();
        onClose();
        onChange(value);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        var _focusedItem$current;
        document.addEventListener('click', handleDocumentClick, false);
        document.addEventListener('touchend', handleDocumentClick, listenerOptions);
        (_focusedItem$current = focusedItem.current) === null || _focusedItem$current === void 0 ? void 0 : _focusedItem$current.focus({
            preventScroll: true
        });
        return function () {
            document.removeEventListener('click', handleDocumentClick, false);
            document.removeEventListener('touchend', handleDocumentClick);
        };
    }, []);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", _extends({
        className: 'privacy-dropdown__dropdown absolute bg-white dark:bg-slate-900 z-[1000] rounded-md shadow-lg ml-10 text-sm',
        style: _objectSpread(_objectSpread({}, style), styles.popper),
        role: "listbox",
        ref: setNode
    }, attributes.popper, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 5
        }
    }), items.map(function (item) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        role: "option",
        tabIndex: 0,
        key: item.value,
        "data-index": item.value,
        onKeyDown: handleKeyDown,
        onClick: handleClick,
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('privacy-dropdown__option', {
            active: item.value === value
        }),
        "aria-selected": item.value === value,
        ref: item.value === value ? focusedItem : null,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 116,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "privacy-dropdown__option__icon",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 117,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Icon, {
        size: 16,
        src: item.icon,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "privacy-dropdown__option__content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("strong", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 13
        }
    }, item.text), item.meta)); }));
};
var PrivacyDropdown = function (_ref2) {
    var isUserTouching = _ref2.isUserTouching, onChange = _ref2.onChange, onModalClose = _ref2.onModalClose, onModalOpen = _ref2.onModalOpen, value = _ref2.value, unavailable = _ref2.unavailable;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var node = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
    var activeElement = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);
    var logo = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useLogo)();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useFeatures)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), open = _a[0], setOpen = _a[1];
    var options = __spreadArray(__spreadArray([{
            icon: __webpack_require__(/*! @tabler/icons/world.svg */ 199),
            value: 'public',
            text: intl.formatMessage(messages.public_short),
            meta: intl.formatMessage(messages.public_long)
        }, {
            icon: __webpack_require__(/*! @tabler/icons/eye-off.svg */ 159),
            value: 'unlisted',
            text: intl.formatMessage(messages.unlisted_short),
            meta: intl.formatMessage(messages.unlisted_long)
        }], (features.localOnlyPrivacy ? [{
            icon: logo,
            value: 'local',
            text: intl.formatMessage(messages.local_short),
            meta: intl.formatMessage(messages.local_long)
        }] : []), true), [{
            icon: __webpack_require__(/*! @tabler/icons/lock.svg */ 161),
            value: 'private',
            text: intl.formatMessage(messages.private_short),
            meta: intl.formatMessage(messages.private_long)
        }, {
            icon: __webpack_require__(/*! @tabler/icons/mail.svg */ 141),
            value: 'direct',
            text: intl.formatMessage(messages.direct_short),
            meta: intl.formatMessage(messages.direct_long)
        }], false);
    var handleToggle = function (e) {
        if (isUserTouching()) {
            if (open) {
                onModalClose();
            }
            else {
                onModalOpen({
                    actions: options.map(function (option) { return _objectSpread(_objectSpread({}, option), {}, {
                        active: option.value === value
                    }); }),
                    onClick: handleModalActionClick
                });
            }
        }
        else {
            if (open) {
                var _activeElement$curren;
                (_activeElement$curren = activeElement.current) === null || _activeElement$curren === void 0 ? void 0 : _activeElement$curren.focus();
            }
            setOpen(!open);
        }
        e.stopPropagation();
    };
    var handleModalActionClick = function (e) {
        e.preventDefault();
        var value = options[e.currentTarget.getAttribute('data-index')].value;
        onModalClose();
        onChange(value);
    };
    var handleKeyDown = function (e) {
        switch (e.key) {
            case 'Escape':
                handleClose();
                break;
        }
    };
    var handleMouseDown = function () {
        if (!open) {
            activeElement.current = document.activeElement;
        }
    };
    var handleButtonKeyDown = function (e) {
        switch (e.key) {
            case ' ':
            case 'Enter':
                handleMouseDown();
                break;
        }
    };
    var handleClose = function () {
        if (open) {
            var _activeElement$curren2;
            (_activeElement$curren2 = activeElement.current) === null || _activeElement$curren2 === void 0 ? void 0 : _activeElement$curren2.focus();
        }
        setOpen(false);
    };
    if (unavailable) {
        return null;
    }
    var valueOption = options.find(function (item) { return item.value === value; });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('privacy-dropdown', {
            active: open
        }),
        onKeyDown: handleKeyDown,
        ref: node,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 230,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('privacy-dropdown__value', {
            active: valueOption && options.indexOf(valueOption) === 0
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 231,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.IconButton, {
        className: "text-gray-400 hover:text-gray-600",
        src: valueOption === null || valueOption === void 0 ? void 0 : valueOption.icon,
        title: intl.formatMessage(messages.change_privacy),
        onClick: handleToggle,
        onMouseDown: handleMouseDown,
        onKeyDown: handleButtonKeyDown,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 232,
            columnNumber: 9
        }
    })), open && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(PrivacyDropdownMenu, {
        items: options,
        value: value,
        onClose: handleClose,
        onChange: onChange,
        reference: node.current,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 244,
            columnNumber: 11
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (PrivacyDropdown);


/***/ }),

/***/ 937:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/reply_indicator.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/attachment-thumbs */ 429);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/containers/account_container */ 155);
/* harmony import */ var soapbox_rtl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/rtl */ 259);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/reply_indicator.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }





var ReplyIndicator = function (_ref) {
    var status = _ref.status, hideActions = _ref.hideActions, onCancel = _ref.onCancel;
    var handleClick = function () {
        onCancel();
    };
    if (!status) {
        return null;
    }
    var actions = {};
    if (!hideActions && onCancel) {
        actions = {
            onActionClick: handleClick,
            actionIcon: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
            actionAlignment: 'top',
            actionTitle: 'Dismiss'
        };
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 2,
        className: "p-4 rounded-lg bg-gray-100 dark:bg-slate-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__["default"], _extends({}, actions, {
        id: status.getIn(['account', 'id']),
        timestamp: status.created_at,
        showProfileHoverCard: false,
        withLinkToProfile: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        className: "break-words status__content",
        size: "sm",
        dangerouslySetInnerHTML: {
            __html: status.contentHtml
        },
        direction: (0,soapbox_rtl__WEBPACK_IMPORTED_MODULE_4__.isRtl)(status.search_index) ? 'rtl' : 'ltr',
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 7
        }
    }), status.media_attachments.size > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_1__["default"], {
        media: status.media_attachments,
        sensitive: status.sensitive,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 9
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ReplyIndicator);


/***/ }),

/***/ 1223:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/reply_mentions.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_reducers_compose__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/reducers/compose */ 472);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/utils/features */ 19);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/reply_mentions.tsx";








var ReplyMentions = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.instance; });
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__.makeGetStatus)()(state, {
        id: state.compose.in_reply_to
    }); });
    var to = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.compose.to; });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.accounts.get(state.me); });
    var explicitAddressing = (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_6__.getFeatures)(instance).explicitAddressing;
    if (!explicitAddressing || !status || !to) {
        return null;
    }
    var parentTo = status && (0,soapbox_reducers_compose__WEBPACK_IMPORTED_MODULE_4__.statusToMentionsAccountIdsArray)(status, account);
    var handleClick = function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('REPLY_MENTIONS'));
    };
    if (!parentTo || parentTo.size === 0) {
        return null;
    }
    if (to.size === 0) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
            href: "#",
            className: "reply-mentions",
            onClick: handleClick,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 41,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "reply_mentions.reply_empty",
            defaultMessage: "Replying to post",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 42,
                columnNumber: 9
            }
        }));
    }
    var accounts = to.slice(0, 2).map(function (acct) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "reply-mentions__account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 5
        }
    }, "@", acct.split('@')[0]); }).toArray();
    if (to.size > 2) {
        accounts.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "reply_mentions.more",
            defaultMessage: "{count} more",
            values: {
                count: to.size - 2
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 56,
                columnNumber: 7
            }
        }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        href: "#",
        className: "reply-mentions",
        onClick: handleClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: "reply_mentions.reply",
        defaultMessage: "Replying to {accounts}",
        values: {
            accounts: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__.FormattedList, {
                type: "conjunction",
                value: accounts,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 66,
                    columnNumber: 21
                }
            })
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ReplyMentions);


/***/ }),

/***/ 1244:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/schedule_button.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var _compose_form_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compose_form_button */ 100);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/schedule_button.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    add_schedule: {
        "id": "schedule_button.add_schedule",
        "defaultMessage": "Schedule post for later"
    },
    remove_schedule: {
        "id": "schedule_button.remove_schedule",
        "defaultMessage": "Post immediately"
    }
});
var ScheduleButton = function (_ref) {
    var active = _ref.active, unavailable = _ref.unavailable, disabled = _ref.disabled, onClick = _ref.onClick;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])();
    var handleClick = function () {
        onClick();
    };
    if (unavailable) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_compose_form_button__WEBPACK_IMPORTED_MODULE_1__["default"], {
        icon: __webpack_require__(/*! @tabler/icons/calendar-stats.svg */ 938),
        title: intl.formatMessage(active ? messages.remove_schedule : messages.add_schedule),
        active: active,
        disabled: disabled,
        onClick: handleClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (ScheduleButton);


/***/ }),

/***/ 1225:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/sensitive-button.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 27);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/sensitive-button.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    marked: {
        "id": "compose_form.sensitive.marked",
        "defaultMessage": "Media is marked as sensitive"
    },
    unmarked: {
        "id": "compose_form.sensitive.unmarked",
        "defaultMessage": "Media is not marked as sensitive"
    }
});
/** Button to mark own media as sensitive. */
var SensitiveButton = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var active = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.compose.sensitive === true; });
    var disabled = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.compose.spoiler === true; });
    var onClick = function () {
        dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeComposeSensitivity)());
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "px-2.5 py-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
            id: "compose_form.sensitive.hide",
            defaultMessage: "Mark media as sensitive",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 28,
                columnNumber: 20
            }
        }),
        labelTitle: intl.formatMessage(active ? messages.marked : messages.unmarked),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Checkbox, {
        name: "mark-sensitive",
        checked: active,
        onChange: onClick,
        disabled: disabled,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (SensitiveButton);


/***/ }),

/***/ 1247:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/spoiler_button.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var _compose_form_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compose_form_button */ 100);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/spoiler_button.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    marked: {
        "id": "compose_form.spoiler.marked",
        "defaultMessage": "Text is hidden behind warning"
    },
    unmarked: {
        "id": "compose_form.spoiler.unmarked",
        "defaultMessage": "Text is not hidden"
    }
});
var SpoilerButton = function (_ref) {
    var active = _ref.active, onClick = _ref.onClick;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_compose_form_button__WEBPACK_IMPORTED_MODULE_1__["default"], {
        icon: __webpack_require__(/*! @tabler/icons/alert-triangle.svg */ 260),
        title: intl.formatMessage(active ? messages.marked : messages.unmarked),
        active: active,
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (SpoilerButton);


/***/ }),

/***/ 1251:
/*!****************************************************************************!*\
  !*** ./app/soapbox/features/compose/components/text_character_counter.tsx ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var stringz__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! stringz */ 225);
/* harmony import */ var stringz__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(stringz__WEBPACK_IMPORTED_MODULE_2__);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/text_character_counter.tsx";



var TextCharacterCounter = function (_ref) {
    var text = _ref.text, max = _ref.max;
    var checkRemainingText = function (diff) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('text-sm font-semibold', {
                'text-gray-400': diff >= 0,
                'text-danger-600': diff < 0
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 13,
                columnNumber: 7
            }
        }, diff);
    };
    var diff = max - (0,stringz__WEBPACK_IMPORTED_MODULE_2__.length)(text);
    return checkRemainingText(diff);
};
/* harmony default export */ __webpack_exports__["default"] = (TextCharacterCounter);


/***/ }),

/***/ 1346:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/upload-progress.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_upload_progress__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/upload-progress */ 739);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/upload-progress.tsx";



/** File upload progress bar for post composer. */
var ComposeUploadProgress = function () {
    var active = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.compose.is_uploading; });
    var progress = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.compose.progress; });
    if (!active) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_upload_progress__WEBPACK_IMPORTED_MODULE_1__["default"], {
        progress: progress,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (ComposeUploadProgress);


/***/ }),

/***/ 936:
/*!************************************************************!*\
  !*** ./app/soapbox/features/compose/components/upload.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MIMETYPE_ICONS": function() { return /* binding */ MIMETYPE_ICONS; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-motion */ 86);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/blurhash */ 288);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/icon_button */ 410);
/* harmony import */ var _ui_util_optional_motion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../ui/util/optional_motion */ 170);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/upload.tsx";










var bookIcon = __webpack_require__(/*! @tabler/icons/book.svg */ 1227);
var fileCodeIcon = __webpack_require__(/*! @tabler/icons/file-code.svg */ 1228);
var fileSpreadsheetIcon = __webpack_require__(/*! @tabler/icons/file-spreadsheet.svg */ 1229);
var fileTextIcon = __webpack_require__(/*! @tabler/icons/file-text.svg */ 735);
var fileZipIcon = __webpack_require__(/*! @tabler/icons/file-zip.svg */ 1230);
var defaultIcon = __webpack_require__(/*! @tabler/icons/paperclip.svg */ 224);
var presentationIcon = __webpack_require__(/*! @tabler/icons/presentation.svg */ 1231);
var MIMETYPE_ICONS = {
    'application/x-freearc': fileZipIcon,
    'application/x-bzip': fileZipIcon,
    'application/x-bzip2': fileZipIcon,
    'application/gzip': fileZipIcon,
    'application/vnd.rar': fileZipIcon,
    'application/x-tar': fileZipIcon,
    'application/zip': fileZipIcon,
    'application/x-7z-compressed': fileZipIcon,
    'application/x-csh': fileCodeIcon,
    'application/html': fileCodeIcon,
    'text/javascript': fileCodeIcon,
    'application/json': fileCodeIcon,
    'application/ld+json': fileCodeIcon,
    'application/x-httpd-php': fileCodeIcon,
    'application/x-sh': fileCodeIcon,
    'application/xhtml+xml': fileCodeIcon,
    'application/xml': fileCodeIcon,
    'application/epub+zip': bookIcon,
    'application/vnd.oasis.opendocument.spreadsheet': fileSpreadsheetIcon,
    'application/vnd.ms-excel': fileSpreadsheetIcon,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': fileSpreadsheetIcon,
    'application/pdf': fileTextIcon,
    'application/vnd.oasis.opendocument.presentation': presentationIcon,
    'application/vnd.ms-powerpoint': presentationIcon,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': presentationIcon,
    'text/plain': fileTextIcon,
    'application/rtf': fileTextIcon,
    'application/msword': fileTextIcon,
    'application/x-abiword': fileTextIcon,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': fileTextIcon,
    'application/vnd.oasis.opendocument.text': fileTextIcon
};
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    description: {
        "id": "upload_form.description",
        "defaultMessage": "Describe for the visually impaired"
    },
    delete: {
        "id": "upload_form.undo",
        "defaultMessage": "Delete"
    }
});
var Upload = function (props) {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), hovered = _a[0], setHovered = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), focused = _b[0], setFocused = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null), dirtyDescription = _c[0], setDirtyDescription = _c[1];
    var handleKeyDown = function (e) {
        if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };
    var handleSubmit = function () {
        handleInputBlur();
        props.onSubmit(history);
    };
    var handleUndoClick = function (e) {
        e.stopPropagation();
        props.onUndo(props.media.get('id'));
    };
    var handleInputChange = function (e) {
        setDirtyDescription(e.target.value);
    };
    var handleMouseEnter = function () {
        setHovered(true);
    };
    var handleMouseLeave = function () {
        setHovered(false);
    };
    var handleInputFocus = function () {
        setFocused(true);
    };
    var handleClick = function () {
        setFocused(true);
    };
    var handleInputBlur = function () {
        setFocused(false);
        setDirtyDescription(null);
        if (dirtyDescription !== null) {
            props.onDescriptionChange(props.media.get('id'), dirtyDescription);
        }
    };
    var handleOpenModal = function () {
        props.onOpenModal(props.media);
    };
    var active = hovered || focused;
    var description = dirtyDescription || dirtyDescription !== '' && props.media.get('description') || '';
    var focusX = props.media.getIn(['meta', 'focus', 'x']);
    var focusY = props.media.getIn(['meta', 'focus', 'y']);
    var x = focusX ? (focusX / 2 + .5) * 100 : undefined;
    var y = focusY ? (focusY / -2 + .5) * 100 : undefined;
    var mediaType = props.media.get('type');
    var mimeType = props.media.getIn(['pleroma', 'mime_type']);
    var uploadIcon = mediaType === 'unknown' && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        className: "h-16 w-16 mx-auto my-12 text-gray-800 dark:text-gray-200",
        src: MIMETYPE_ICONS[mimeType || ''] || defaultIcon,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 139,
            columnNumber: 5
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "compose-form__upload",
        tabIndex: 0,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick: handleClick,
        role: "button",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 146,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_4__["default"], {
        hash: props.media.get('blurhash'),
        className: "media-gallery__preview",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui_util_optional_motion__WEBPACK_IMPORTED_MODULE_7__["default"], {
        defaultStyle: {
            scale: 0.8
        },
        style: {
            scale: (0,react_motion__WEBPACK_IMPORTED_MODULE_3__.spring)(1, {
                stiffness: 180,
                damping: 12
            })
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 148,
            columnNumber: 7
        }
    }, function (_ref) {
        var scale = _ref.scale;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('compose-form__upload-thumbnail', "".concat(mediaType)),
            style: {
                transform: "scale(".concat(scale, ")"),
                backgroundImage: mediaType === 'image' ? "url(".concat(props.media.get('preview_url'), ")") : undefined,
                backgroundPosition: typeof x === 'number' && typeof y === 'number' ? "".concat(x, "% ").concat(y, "%") : undefined
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 150,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('compose-form__upload__actions', {
                active: active
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 157,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_6__["default"], {
            onClick: handleUndoClick,
            src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
                id: "upload_form.undo",
                defaultMessage: "Delete",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 161,
                    columnNumber: 23
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 158,
                columnNumber: 15
            }
        }), mediaType !== 'unknown' && Boolean(props.media.get('url')) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_6__["default"], {
            onClick: handleOpenModal,
            src: __webpack_require__(/*! @tabler/icons/zoom-in.svg */ 734),
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
                id: "upload_form.preview",
                defaultMessage: "Preview",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 169,
                    columnNumber: 25
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 166,
                columnNumber: 17
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('compose-form__upload-description', {
                active: active
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 174,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("label", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 175,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("span", {
            style: {
                display: 'none'
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 176,
                columnNumber: 17
            }
        }, intl.formatMessage(messages.description)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("textarea", {
            placeholder: intl.formatMessage(messages.description),
            value: description,
            maxLength: props.descriptionLimit,
            onFocus: handleInputFocus,
            onChange: handleInputChange,
            onBlur: handleInputBlur,
            onKeyDown: handleKeyDown,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 178,
                columnNumber: 17
            }
        }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "compose-form__upload-preview",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 190,
                columnNumber: 13
            }
        }, mediaType === 'video' && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("video", {
            autoPlay: true,
            playsInline: true,
            muted: true,
            loop: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 192,
                columnNumber: 17
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("source", {
            src: props.media.get('preview_url'),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 193,
                columnNumber: 19
            }
        })), uploadIcon));
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (Upload);


/***/ }),

/***/ 742:
/*!*******************************************************************!*\
  !*** ./app/soapbox/features/compose/components/upload_button.tsx ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/upload_button.tsx";




var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__.defineMessages)({
    upload: {
        "id": "upload_button.label",
        "defaultMessage": "Add media attachment"
    }
});
var onlyImages = function (types) {
    return Boolean(types && types.every(function (type) { return type.startsWith('image/'); }));
};
var UploadButton = function (_ref) {
    var _a = _ref.disabled, disabled = _a === void 0 ? false : _a, _b = _ref.unavailable, unavailable = _b === void 0 ? false : _b, onSelectFile = _ref.onSelectFile, resetFileKey = _ref.resetFileKey;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var fileElement = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var attachmentTypes = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance.configuration.getIn(['media_attachments', 'supported_mime_types']); });
    var handleChange = function (e) {
        var _e$target$files;
        if ((_e$target$files = e.target.files) !== null && _e$target$files !== void 0 && _e$target$files.length) {
            onSelectFile(e.target.files);
        }
    };
    var handleClick = function () {
        var _fileElement$current;
        (_fileElement$current = fileElement.current) === null || _fileElement$current === void 0 ? void 0 : _fileElement$current.click();
    };
    if (unavailable) {
        return null;
    }
    var src = onlyImages(attachmentTypes) ? __webpack_require__(/*! @tabler/icons/photo.svg */ 743) : __webpack_require__(/*! @tabler/icons/paperclip.svg */ 224);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
        src: src,
        className: "text-gray-400 hover:text-gray-600",
        title: intl.formatMessage(messages.upload),
        disabled: disabled,
        onClick: handleClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "sr-only",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.upload)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("input", {
        key: resetFileKey,
        ref: fileElement,
        type: "file",
        multiple: true,
        accept: attachmentTypes && attachmentTypes.toArray().join(','),
        onChange: handleChange,
        disabled: disabled,
        className: "hidden",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (UploadButton);


/***/ }),

/***/ 1224:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/compose/components/upload_form.tsx ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _components_sensitive_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/sensitive-button */ 1225);
/* harmony import */ var _components_upload_progress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/upload-progress */ 1346);
/* harmony import */ var _containers_upload_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../containers/upload_container */ 1226);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/upload_form.tsx";






var UploadForm = function () {
    var mediaIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.compose.media_attachments.map(function (item) { return item.id; }); });
    var classes = classnames__WEBPACK_IMPORTED_MODULE_0___default()('compose-form__uploads-wrapper', {
        'contains-media': mediaIds.size !== 0
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "compose-form__upload-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_upload_progress__WEBPACK_IMPORTED_MODULE_4__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classes,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 7
        }
    }, mediaIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_containers_upload_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: id,
        key: id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 11
        }
    }); })), !mediaIds.isEmpty() && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_sensitive_button__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 31
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (UploadForm);


/***/ }),

/***/ 1252:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/compose/components/visual_character_counter.tsx ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var stringz__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stringz */ 225);
/* harmony import */ var stringz__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(stringz__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var soapbox_components_progress_circle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/progress_circle */ 1348);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/visual_character_counter.tsx";




var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__.defineMessages)({
    title: {
        "id": "compose.character_counter.title",
        "defaultMessage": "Used {chars} out of {maxChars} characters"
    }
});
/** Renders a character counter */
var VisualCharacterCounter = function (_ref) {
    var text = _ref.text, max = _ref.max;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var textLength = (0,stringz__WEBPACK_IMPORTED_MODULE_1__.length)(text);
    var progress = textLength / max;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_progress_circle__WEBPACK_IMPORTED_MODULE_2__["default"], {
        title: intl.formatMessage(messages.title, {
            chars: textLength,
            maxChars: max
        }),
        progress: progress,
        radius: 10,
        stroke: 3,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (VisualCharacterCounter);


/***/ }),

/***/ 740:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/compose/components/warning.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_motion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-motion */ 86);
/* harmony import */ var _ui_util_optional_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../ui/util/optional_motion */ 170);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/warning.tsx";



/** Warning message displayed in ComposeForm. */
var Warning = function (_ref) {
    var message = _ref.message;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_util_optional_motion__WEBPACK_IMPORTED_MODULE_2__["default"], {
        defaultStyle: {
            opacity: 0,
            scaleX: 0.85,
            scaleY: 0.75
        },
        style: {
            opacity: (0,react_motion__WEBPACK_IMPORTED_MODULE_1__.spring)(1, {
                damping: 35,
                stiffness: 400
            }),
            scaleX: (0,react_motion__WEBPACK_IMPORTED_MODULE_1__.spring)(1, {
                damping: 35,
                stiffness: 400
            }),
            scaleY: (0,react_motion__WEBPACK_IMPORTED_MODULE_1__.spring)(1, {
                damping: 35,
                stiffness: 400
            })
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 3
        }
    }, function (_ref2) {
        var opacity = _ref2.opacity, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "compose-form__warning",
            style: {
                opacity: opacity,
                transform: "scale(".concat(scaleX, ", ").concat(scaleY, ")")
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 14,
                columnNumber: 7
            }
        }, message);
    });
};
/* harmony default export */ __webpack_exports__["default"] = (Warning);


/***/ }),

/***/ 1455:
/*!***************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/compose_form_container.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 27);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var _components_compose_form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/compose_form */ 1218);
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





var mapStateToProps = function (state) {
    var instance = state.get('instance');
    var now = new Date().getTime();
    return {
        text: state.getIn(['compose', 'text']),
        suggestions: state.getIn(['compose', 'suggestions']),
        spoiler: state.getIn(['compose', 'spoiler']),
        spoilerText: state.getIn(['compose', 'spoiler_text']),
        spoilerForced: state.getIn(['compose', 'spoiler_forced']),
        privacy: state.getIn(['compose', 'privacy']),
        focusDate: state.getIn(['compose', 'focusDate']),
        caretPosition: state.getIn(['compose', 'caretPosition']),
        hasPoll: !!state.getIn(['compose', 'poll']),
        isSubmitting: state.getIn(['compose', 'is_submitting']),
        isEditing: state.getIn(['compose', 'id']) !== null,
        isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
        isUploading: state.getIn(['compose', 'is_uploading']),
        showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
        anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
        isModalOpen: Boolean(state.get('modals').size && state.get('modals').last().modalType === 'COMPOSE'),
        maxTootChars: state.getIn(['instance', 'configuration', 'statuses', 'max_characters']),
        scheduledAt: state.getIn(['compose', 'schedule']),
        // we only want to keep scheduled status that werent sent, since server does not push that information to client when scheduled status are posted
        scheduledStatus: state.get('scheduled_statuses').filter(function (s) { return new Date(s.scheduled_at).getTime() > now; }),
        features: (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_2__.getFeatures)(instance)
    };
};
var mapDispatchToProps = function (dispatch, _ref) {
    var intl = _ref.intl;
    return {
        onChange: function (text) {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeCompose)(text));
        },
        onSubmit: function (router, group) {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.submitCompose)(router, group));
        },
        onClearSuggestions: function () {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.clearComposeSuggestions)());
        },
        onFetchSuggestions: function (token) {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.fetchComposeSuggestions)(token));
        },
        onSuggestionSelected: function (position, token, suggestion, path) {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.selectComposeSuggestion)(position, token, suggestion, path));
        },
        onChangeSpoilerText: function (checked) {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeComposeSpoilerText)(checked));
        },
        onPaste: function (files) {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.uploadCompose)(files, intl));
        },
        onPickEmoji: function (position, data, needsSpace) {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.insertEmojiCompose)(position, data, needsSpace));
        }
    };
};
function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, _objectSpread(_objectSpread({}, stateProps), dispatchProps));
}
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps, mergeProps)(_components_compose_form__WEBPACK_IMPORTED_MODULE_3__["default"])));


/***/ }),

/***/ 1232:
/*!********************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/language_dropdown_container.ts ***!
  \********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../actions/modals */ 17);
/* harmony import */ var _is_mobile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../is_mobile */ 65);
/* harmony import */ var _components_language_dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/language_dropdown */ 1233);





var mapStateToProps = function (state) { return ({
    isModalOpen: Boolean(state.get('modals').size && state.get('modals').last().modalType === 'ACTIONS'),
    value: state.getIn(['compose', 'language']),
    defaultValue: state.getIn(['settings', 'defaultPostLanguage']) || 'en',
    unavailable: !!state.getIn(['compose', 'id'])
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onChange: function (value) {
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeComposeLanguage)(value));
    },
    isUserTouching: _is_mobile__WEBPACK_IMPORTED_MODULE_3__.isUserTouching,
    onModalOpen: function (props) { return dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('ACTIONS', props)); },
    onModalClose: function () {
        dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_2__.closeModal)('ACTIONS'));
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_language_dropdown__WEBPACK_IMPORTED_MODULE_4__["default"]));


/***/ }),

/***/ 1234:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/markdown_button_container.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _components_markdown_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/markdown_button */ 1235);



var mapStateToProps = function (state, _ref) {
    var intl = _ref.intl;
    return {
        active: state.getIn(['compose', 'content_type']) === 'text/markdown'
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    onClick: function () {
        dispatch(function (_, getState) {
            var active = getState().getIn(['compose', 'content_type']) === 'text/markdown';
            dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeComposeContentType)(active ? 'text/plain' : 'text/markdown'));
        });
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_markdown_button__WEBPACK_IMPORTED_MODULE_2__["default"]));


/***/ }),

/***/ 1237:
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/poll_button_container.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _components_poll_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/poll_button */ 1238);



var mapStateToProps = function (state) { return ({
    unavailable: state.getIn(['compose', 'is_uploading']),
    active: state.getIn(['compose', 'poll']) !== null
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onClick: function () {
        dispatch(function (_, getState) {
            if (getState().getIn(['compose', 'poll'])) {
                dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.removePoll)());
            }
            else {
                dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.addPoll)());
            }
        });
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_poll_button__WEBPACK_IMPORTED_MODULE_2__["default"]));


/***/ }),

/***/ 1239:
/*!*******************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/privacy_dropdown_container.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../actions/modals */ 17);
/* harmony import */ var _is_mobile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../is_mobile */ 65);
/* harmony import */ var _components_privacy_dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/privacy_dropdown */ 1240);





var mapStateToProps = function (state) { return ({
    isModalOpen: Boolean(state.get('modals').size && state.get('modals').last().modalType === 'ACTIONS'),
    value: state.getIn(['compose', 'privacy']),
    unavailable: !!state.getIn(['compose', 'id'])
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onChange: function (value) {
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeComposeVisibility)(value));
    },
    isUserTouching: _is_mobile__WEBPACK_IMPORTED_MODULE_3__.isUserTouching,
    onModalOpen: function (props) { return dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('ACTIONS', props)); },
    onModalClose: function () {
        dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_2__.closeModal)('ACTIONS'));
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_privacy_dropdown__WEBPACK_IMPORTED_MODULE_4__["default"]));


/***/ }),

/***/ 1241:
/*!*****************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/quoted_status_container.tsx ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 27);
/* harmony import */ var soapbox_components_quoted_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/quoted-status */ 731);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/containers/quoted_status_container.tsx";





var getStatus = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__.makeGetStatus)();
/** QuotedStatus shown in post composer. */
var QuotedStatusContainer = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return getStatus(state, {
        id: state.compose.quote
    }); });
    var onCancel = function () {
        dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.cancelQuoteCompose)());
    };
    if (!status) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mb-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_quoted_status__WEBPACK_IMPORTED_MODULE_2__["default"], {
        status: status,
        onCancel: onCancel,
        compose: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (QuotedStatusContainer);


/***/ }),

/***/ 1242:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/reply_indicator_container.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../selectors */ 30);
/* harmony import */ var _components_reply_indicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/reply_indicator */ 937);




var makeMapStateToProps = function () {
    var getStatus = (0,_selectors__WEBPACK_IMPORTED_MODULE_2__.makeGetStatus)();
    var mapStateToProps = function (state) {
        var statusId = state.getIn(['compose', 'in_reply_to']);
        var editing = !!state.getIn(['compose', 'id']);
        return {
            status: getStatus(state, {
                id: statusId
            }),
            hideActions: editing
        };
    };
    return mapStateToProps;
};
var mapDispatchToProps = function (dispatch) { return ({
    onCancel: function () {
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.cancelReplyCompose)());
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(makeMapStateToProps, mapDispatchToProps)(_components_reply_indicator__WEBPACK_IMPORTED_MODULE_3__["default"]));


/***/ }),

/***/ 1243:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/schedule_button_container.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _components_schedule_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/schedule_button */ 1244);



var mapStateToProps = function (state) { return ({
    active: state.getIn(['compose', 'schedule']) ? true : false,
    unavailable: !!state.getIn(['compose', 'id'])
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onClick: function () {
        dispatch(function (dispatch, getState) {
            if (getState().getIn(['compose', 'schedule'])) {
                dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.removeSchedule)());
            }
            else {
                dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.addSchedule)());
            }
        });
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_schedule_button__WEBPACK_IMPORTED_MODULE_2__["default"]));


/***/ }),

/***/ 1245:
/*!****************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/schedule_form_container.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/features/ui/containers/bundle_container */ 53);
/* harmony import */ var soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/features/ui/util/async-components */ 42);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/containers/schedule_form_container.js";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }



var ScheduleFormContainer = /** @class */ (function (_super) {
    __extends(ScheduleFormContainer, _super);
    function ScheduleFormContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScheduleFormContainer.prototype.render = function () {
        var _this = this;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_1__["default"], {
            fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_2__.ScheduleForm,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 10,
                columnNumber: 7
            }
        }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _extends({}, _this.props, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 11,
                columnNumber: 23
            }
        })); });
    };
    return ScheduleFormContainer;
}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent));
/* harmony default export */ __webpack_exports__["default"] = (ScheduleFormContainer);


/***/ }),

/***/ 1246:
/*!*****************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/spoiler_button_container.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _components_spoiler_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/spoiler_button */ 1247);



var mapStateToProps = function (state, _ref) {
    var intl = _ref.intl;
    return {
        active: state.getIn(['compose', 'spoiler'])
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    onClick: function () {
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeComposeSpoilerness)());
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_spoiler_button__WEBPACK_IMPORTED_MODULE_2__["default"]));


/***/ }),

/***/ 1248:
/*!****************************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/upload_button_container.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _components_upload_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/upload_button */ 742);




var mapStateToProps = function (state) { return ({
    disabled: state.getIn(['compose', 'is_uploading']),
    resetFileKey: state.getIn(['compose', 'resetFileKey'])
}); };
var mapDispatchToProps = function (dispatch, _ref) {
    var intl = _ref.intl;
    return {
        onSelectFile: function (files) {
            dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.uploadCompose)(files, intl));
        }
    };
};
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_upload_button__WEBPACK_IMPORTED_MODULE_2__["default"])));


/***/ }),

/***/ 1226:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/upload_container.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../actions/compose */ 27);
/* harmony import */ var _actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../actions/modals */ 17);
/* harmony import */ var _components_upload__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/upload */ 936);





var mapStateToProps = function (state, _ref) {
    var id = _ref.id;
    return {
        media: state.getIn(['compose', 'media_attachments']).find(function (item) { return item.get('id') === id; }),
        descriptionLimit: state.getIn(['instance', 'description_limit'])
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    onUndo: function (id) {
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.undoUploadCompose)(id));
    },
    onDescriptionChange: function (id, description) {
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.changeUploadCompose)(id, {
            description: description
        }));
    },
    onOpenFocalPoint: function (id) {
        dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('FOCAL_POINT', {
            id: id
        }));
    },
    onOpenModal: function (media) {
        dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('MEDIA', {
            media: immutable__WEBPACK_IMPORTED_MODULE_4__.List.of(media),
            index: 0
        }));
    },
    onSubmit: function (router) {
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_1__.submitCompose)(router));
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_upload__WEBPACK_IMPORTED_MODULE_3__["default"]));


/***/ }),

/***/ 1249:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/compose/containers/warning_container.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var _components_warning__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/warning */ 740);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/containers/warning_container.js";






var APPROX_HASHTAG_RE = /(?:^|[^\/\)\w])#(\w*[a-zA-Z·]\w*)/i;
var mapStateToProps = function (state) {
    var me = state.get('me');
    return {
        needsLockWarning: state.getIn(['compose', 'privacy']) === 'private' && !state.getIn(['accounts', me, 'locked']),
        hashtagWarning: state.getIn(['compose', 'privacy']) !== 'public' && APPROX_HASHTAG_RE.test(state.getIn(['compose', 'text'])),
        directMessageWarning: state.getIn(['compose', 'privacy']) === 'direct'
    };
};
var WarningWrapper = function (_ref) {
    var needsLockWarning = _ref.needsLockWarning, hashtagWarning = _ref.hashtagWarning, directMessageWarning = _ref.directMessageWarning;
    if (needsLockWarning) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_warning__WEBPACK_IMPORTED_MODULE_3__["default"], {
            message: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
                id: "compose_form.lock_disclaimer",
                defaultMessage: "Your account is not {locked}. Anyone can follow you to view your follower-only posts.",
                values: {
                    locked: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.Link, {
                        to: "/settings/profile",
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 22,
                            columnNumber: 203
                        }
                    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
                        id: "compose_form.lock_disclaimer.lock",
                        defaultMessage: "locked",
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 22,
                            columnNumber: 232
                        }
                    }))
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 22,
                    columnNumber: 30
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 22,
                columnNumber: 12
            }
        });
    }
    if (hashtagWarning) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_warning__WEBPACK_IMPORTED_MODULE_3__["default"], {
            message: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
                id: "compose_form.hashtag_warning",
                defaultMessage: "This post won't be listed under any hashtag as it is unlisted. Only public posts can be searched by hashtag.",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 26,
                    columnNumber: 30
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 26,
                columnNumber: 12
            }
        });
    }
    if (directMessageWarning) {
        var message = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 31,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
            id: "compose_form.direct_message_warning",
            defaultMessage: "This post will only be sent to the mentioned users.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 32,
                columnNumber: 9
            }
        }));
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_warning__WEBPACK_IMPORTED_MODULE_3__["default"], {
            message: message,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 37,
                columnNumber: 12
            }
        });
    }
    return null;
};
WarningWrapper.propTypes = {
    needsLockWarning: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool),
    hashtagWarning: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool),
    directMessageWarning: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool)
};
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.connect)(mapStateToProps)(WarningWrapper));


/***/ }),

/***/ 1250:
/*!******************************************************!*\
  !*** ./app/soapbox/features/compose/util/counter.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "countableText": function() { return /* binding */ countableText; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _url_regex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url_regex */ 1347);


var urlPlaceholder = 'xxxxxxxxxxxxxxxxxxxxxxx';
function countableText(inputText) {
    return inputText.replace(_url_regex__WEBPACK_IMPORTED_MODULE_1__.urlRegex, urlPlaceholder).replace(/(^|[^\/\w])@(([a-z0-9_]+)@[a-z0-9\.\-]+[a-z0-9]+)/ig, '$1@$3');
}


/***/ }),

/***/ 1347:
/*!********************************************************!*\
  !*** ./app/soapbox/features/compose/util/url_regex.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlRegex": function() { return /* binding */ urlRegex; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);

var regexen = {};
var regexSupplant = function (regex) {
    var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (typeof regex !== 'string') {
        if (regex.global && flags.indexOf('g') < 0) {
            flags += 'g';
        }
        if (regex.ignoreCase && flags.indexOf('i') < 0) {
            flags += 'i';
        }
        if (regex.multiline && flags.indexOf('m') < 0) {
            flags += 'm';
        }
        regex = regex.source;
    }
    return new RegExp(regex.replace(/#\{(\w+)\}/g, function (match, name) {
        var newRegex = regexen[name] || '';
        if (typeof newRegex !== 'string') {
            newRegex = newRegex.source;
        }
        return newRegex;
    }), flags);
};
var stringSupplant = function (str, values) {
    return str.replace(/#\{(\w+)\}/g, function (match, name) {
        return values[name] || '';
    });
};
var urlRegex = function () {
    regexen.spaces_group = /\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000/; // eslint-disable-line no-control-regex
    regexen.invalid_chars_group = /\uFFFE\uFEFF\uFFFF\u202A-\u202E/;
    regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;
    regexen.validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalid_chars_group}]|^)/);
    regexen.invalidDomainChars = stringSupplant('#{punct}#{spaces_group}#{invalid_chars_group}', regexen);
    regexen.validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/);
    regexen.validSubdomain = regexSupplant(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/);
    regexen.validDomainName = regexSupplant(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/);
    regexen.validGTLD = regexSupplant(RegExp('(?:(?:' + '삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|通販|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|政府|' + '政务|手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|天主教|大拿|大众汽车|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|中文网|中信|世界|' + 'ポイント|ファッション|セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|كاثوليك|عرب|شبكة|' + 'بيتك|بازار|العليان|ارامكو|اتصالات|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|католик|дети|' + 'zuerich|zone|zippo|zip|zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|yandex|yamaxun|' + 'yahoo|yachts|xyz|xxx|xperia|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|works|work|woodside|' + 'wolterskluwer|wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|weir|weibo|wedding|wed|' + 'website|weber|webcam|weatherchannel|weather|watches|watch|warman|wanggou|wang|walter|walmart|' + 'wales|vuelos|voyage|voto|voting|vote|volvo|volkswagen|vodka|vlaanderen|vivo|viva|vistaprint|' + 'vista|vision|visa|virgin|vip|vin|villas|viking|vig|video|viajes|vet|versicherung|' + 'vermögensberatung|vermögensberater|verisign|ventures|vegas|vanguard|vana|vacations|ups|uol|uno|' + 'university|unicom|uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|trust|travelersinsurance|' + 'travelers|travelchannel|travel|training|trading|trade|toys|toyota|town|tours|total|toshiba|' + 'toray|top|tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|tiffany|tienda|tickets|' + 'tiaa|theatre|theater|thd|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|tdk|' + 'tci|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|systems|symantec|sydney|' + 'swiss|swiftcover|swatch|suzuki|surgery|surf|support|supply|supplies|sucks|style|study|studio|' + 'stream|store|storage|stockholm|stcgroup|stc|statoil|statefarm|statebank|starhub|star|staples|' + 'stada|srt|srl|spreadbetting|spot|spiegel|space|soy|sony|song|solutions|solar|sohu|software|' + 'softbank|social|soccer|sncf|smile|smart|sling|skype|sky|skin|ski|site|singles|sina|silk|shriram|' + 'showtime|show|shouji|shopping|shop|shoes|shiksha|shia|shell|shaw|sharp|shangrila|sfr|sexy|sex|' + 'sew|seven|ses|services|sener|select|seek|security|secure|seat|search|scot|scor|scjohnson|' + 'science|schwarz|schule|school|scholarships|schmidt|schaeffler|scb|sca|sbs|sbi|saxo|save|sas|' + 'sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|samsclub|salon|sale|sakura|safety|safe|' + 'saarland|ryukyu|rwe|run|ruhr|rugby|rsvp|room|rogers|rodeo|rocks|rocher|rmit|rip|rio|ril|' + 'rightathome|ricoh|richardli|rich|rexroth|reviews|review|restaurant|rest|republican|report|' + 'repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|redumbrella|redstone|red|recipes|' + 'realty|realtor|realestate|read|raid|radio|racing|qvc|quest|quebec|qpon|pwc|pub|prudential|pru|' + 'protection|property|properties|promo|progressive|prof|productions|prod|pro|prime|press|praxi|' + 'pramerica|post|porn|politie|poker|pohl|pnc|plus|plumbing|playstation|play|place|pizza|pioneer|' + 'pink|ping|pin|pid|pictures|pictet|pics|piaget|physio|photos|photography|photo|phone|philips|phd|' + 'pharmacy|pfizer|pet|pccw|pay|passagens|party|parts|partners|pars|paris|panerai|panasonic|' + 'pamperedchef|page|ovh|ott|otsuka|osaka|origins|orientexpress|organic|org|orange|oracle|open|ooo|' + 'onyourside|online|onl|ong|one|omega|ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|' + 'obi|nyc|ntt|nrw|nra|nowtv|nowruz|now|norton|northwesternmutual|nokia|nissay|nissan|ninja|nikon|' + 'nike|nico|nhk|ngo|nfl|nexus|nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|' + 'net|nec|nba|navy|natura|nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|' + 'msd|movistar|movie|mov|motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|' + 'monash|mom|moi|moe|moda|mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|' + 'miami|metlife|merckmsd|meo|menu|men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|' + 'mcd|mba|mattel|maserati|marshalls|marriott|markets|marketing|market|map|mango|management|man|' + 'makeup|maison|maif|madrid|macys|luxury|luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|' + 'lotte|london|lol|loft|locus|locker|loans|loan|lixil|living|live|lipsy|link|linde|lincoln|limo|' + 'limited|lilly|like|lighting|lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|' + 'lefrak|leclerc|lease|lds|lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|' + 'lancia|lancaster|lamer|lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|' + 'komatsu|koeln|kiwi|kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|kerryhotels|' + 'kddi|kaufen|juniper|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|jewelry|jetzt|' + 'jeep|jcp|jcb|java|jaguar|iwc|iveco|itv|itau|istanbul|ist|ismaili|iselect|irish|ipiranga|' + 'investments|intuit|international|intel|int|insure|insurance|institute|ink|ing|info|infiniti|' + 'industries|immobilien|immo|imdb|imamat|ikano|iinet|ifm|ieee|icu|ice|icbc|ibm|hyundai|hyatt|' + 'hughes|htc|hsbc|how|house|hotmail|hotels|hoteles|hot|hosting|host|hospital|horse|honeywell|' + 'honda|homesense|homes|homegoods|homedepot|holiday|holdings|hockey|hkt|hiv|hitachi|hisamitsu|' + 'hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|hdfc|hbo|haus|hangout|hamburg|' + 'hair|guru|guitars|guide|guge|gucci|guardian|group|grocery|gripe|green|gratis|graphics|grainger|' + 'gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|godaddy|gmx|gmo|gmbh|gmail|' + 'globo|global|gle|glass|glade|giving|gives|gifts|gift|ggee|george|genting|gent|gea|gdn|gbiz|' + 'garden|gap|games|game|gallup|gallo|gallery|gal|fyi|futbol|furniture|fund|fun|fujixerox|fujitsu|' + 'ftr|frontier|frontdoor|frogans|frl|fresenius|free|fox|foundation|forum|forsale|forex|ford|' + 'football|foodnetwork|food|foo|fly|flsmidth|flowers|florist|flir|flights|flickr|fitness|fit|' + 'fishing|fish|firmdale|firestone|fire|financial|finance|final|film|fido|fidelity|fiat|ferrero|' + 'ferrari|feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|' + 'extraspace|express|exposed|expert|exchange|everbank|events|eus|eurovision|etisalat|esurance|' + 'estate|esq|erni|ericsson|equipment|epson|epost|enterprises|engineering|engineer|energy|emerck|' + 'email|education|edu|edeka|eco|eat|earth|dvr|dvag|durban|dupont|duns|dunlop|duck|dubai|dtv|drive|' + 'download|dot|doosan|domains|doha|dog|dodge|doctor|docs|dnp|diy|dish|discover|discount|directory|' + 'direct|digital|diet|diamonds|dhl|dev|design|desi|dentist|dental|democrat|delta|deloitte|dell|' + 'delivery|degree|deals|dealer|deal|dds|dclk|day|datsun|dating|date|data|dance|dad|dabur|cyou|' + 'cymru|cuisinella|csc|cruises|cruise|crs|crown|cricket|creditunion|creditcard|credit|courses|' + 'coupons|coupon|country|corsica|coop|cool|cookingchannel|cooking|contractors|contact|consulting|' + 'construction|condos|comsec|computer|compare|company|community|commbank|comcast|com|cologne|' + 'college|coffee|codes|coach|clubmed|club|cloud|clothing|clinique|clinic|click|cleaning|claims|' + 'cityeats|city|citic|citi|citadel|cisco|circle|cipriani|church|chrysler|chrome|christmas|chloe|' + 'chintai|cheap|chat|chase|channel|chanel|cfd|cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|' + 'catering|cat|casino|cash|caseih|case|casa|cartier|cars|careers|career|care|cards|caravan|car|' + 'capitalone|capital|capetown|canon|cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|' + 'bzh|buzz|buy|business|builders|build|bugatti|budapest|brussels|brother|broker|broadway|' + 'bridgestone|bradesco|box|boutique|bot|boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|' + 'boehringer|boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|blockbuster|blanco|blackfriday|' + 'black|biz|bio|bingo|bing|bike|bid|bible|bharti|bet|bestbuy|best|berlin|bentley|beer|beauty|' + 'beats|bcn|bcg|bbva|bbt|bbc|bayern|bauhaus|basketball|baseball|bargains|barefoot|barclays|' + 'barclaycard|barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|azure|axa|aws|avianca|' + 'autos|auto|author|auspost|audio|audible|audi|auction|attorney|athleta|associates|asia|asda|arte|' + 'art|arpa|army|archi|aramco|arab|aquarelle|apple|app|apartments|aol|anz|anquan|android|analytics|' + 'amsterdam|amica|amfam|amex|americanfamily|americanexpress|alstom|alsace|ally|allstate|allfinanz|' + 'alipay|alibaba|alfaromeo|akdn|airtel|airforce|airbus|aigo|aig|agency|agakhan|africa|afl|' + 'afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|accenture|' + 'academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa|onion' + ')(?=[^0-9a-zA-Z@]|$))'));
    regexen.validCCTLD = regexSupplant(RegExp('(?:(?:' + '한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|' + 'ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|تونس|' + 'بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|бел|бг|ελ|' + 'zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|' + 'tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|' + 're|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|' + 'mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|' + 'ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|' + 'gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|' + 'do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|' + 'bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac' + ')(?=[^0-9a-zA-Z@]|$))'));
    regexen.validPunycode = /(?:xn--[0-9a-z]+)/;
    regexen.validSpecialCCTLD = /(?:(?:co|tv)(?=[^0-9a-zA-Z@]|$))/;
    regexen.validDomain = regexSupplant(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/);
    regexen.validPortNumber = /[0-9]+/;
    regexen.pd = /\u002d\u058a\u05be\u1400\u1806\u2010-\u2015\u2e17\u2e1a\u2e3a\u2e40\u301c\u3030\u30a0\ufe31\ufe58\ufe63\uff0d/;
    regexen.validGeneralUrlPathChars = regexSupplant(/[^#{spaces_group}\(\)\?]/i); // Allow URL paths to contain up to two nested levels of balanced parens
    //  1. Used in Wikipedia URLs like /Primer_(film)
    //  2. Used in IIS sessions like /S(dfd346)/
    //  3. Used in Rdio URLs like /track/We_Up_(Album_Version_(Edited))/
    regexen.validUrlBalancedParens = regexSupplant('\\(' + '(?:' + '#{validGeneralUrlPathChars}+' + '|' + // allow one nested level of balanced parentheses
        '(?:' + '#{validGeneralUrlPathChars}*' + '\\(' + '#{validGeneralUrlPathChars}+' + '\\)' + '#{validGeneralUrlPathChars}*' + ')' + ')' + '\\)', 'i'); // Valid end-of-path characters (so /foo. does not gobble the period).
    // 1. Allow =&# for empty URL parameters and other URL-join artifacts
    regexen.validUrlPathEndingChars = regexSupplant(/[^#{spaces_group}\(\)\?!\*';:=\,\.\$%\[\]#{pd}~&\|@]|(?:#{validUrlBalancedParens})/i); // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
    regexen.validUrlPath = regexSupplant('(?:' + '(?:' + '#{validGeneralUrlPathChars}*' + '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' + '#{validUrlPathEndingChars}' + ')|(?:@#{validGeneralUrlPathChars}+\/)' + ')', 'i');
    regexen.validUrlQueryChars = /[a-z0-9!?\*'@\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;
    regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i;
    regexen.validUrl = regexSupplant('(' + // $1 URL
        '(https?:\\/\\/)' + // $2 Protocol
        '(#{validDomain})' + // $3 Domain(s)
        '(?::(#{validPortNumber}))?' + // $4 Port number (optional)
        '(\\/#{validUrlPath}*)?' + // $5 URL Path
        '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?' + // $6 Query String
        ')', 'gi');
    return regexen.validUrl;
}();


/***/ }),

/***/ 1464:
/*!******************************************************************************************!*\
  !*** ./app/soapbox/features/federation_restrictions/components/instance_restrictions.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ InstanceRestrictions; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-immutable-proptypes */ 193);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-pure-component */ 156);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/federation_restrictions/components/instance_restrictions.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }








var hasRestrictions = function (remoteInstance) {
    return remoteInstance.get('federation').deleteAll(['accept', 'reject_deletes', 'report_removal']).reduce(function (acc, value) { return acc || value; }, false);
};
var mapStateToProps = function (state) {
    return {
        instance: state.get('instance')
    };
};
var InstanceRestrictions = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.connect)(mapStateToProps), _dec(_class = (_class2 = /** @class */ (function (_super) {
    __extends(InstanceRestrictions, _super);
    function InstanceRestrictions() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "renderRestrictions", function () {
            var remoteInstance = _this.props.remoteInstance;
            var items = [];
            var _a = remoteInstance.get('federation').toJS(), avatar_removal = _a.avatar_removal, banner_removal = _a.banner_removal, federated_timeline_removal = _a.federated_timeline_removal, followers_only = _a.followers_only, media_nsfw = _a.media_nsfw, media_removal = _a.media_removal;
            var fullMediaRemoval = media_removal && avatar_removal && banner_removal;
            var partialMediaRemoval = media_removal || avatar_removal || banner_removal;
            if (followers_only) {
                items.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    key: "followers_only",
                    className: "flex items-center gap-2",
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 53,
                        columnNumber: 9
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/lock.svg */ 161),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 54,
                        columnNumber: 11
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "federation_restriction.followers_only",
                    defaultMessage: "Hidden except to followers",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 55,
                        columnNumber: 11
                    }
                })));
            }
            else if (federated_timeline_removal) {
                items.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    key: "federated_timeline_removal",
                    className: "flex items-center gap-2",
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 63,
                        columnNumber: 9
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/lock-open.svg */ 940),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 64,
                        columnNumber: 11
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "federation_restriction.federated_timeline_removal",
                    defaultMessage: "Fediverse timeline removal",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 65,
                        columnNumber: 11
                    }
                })));
            }
            if (fullMediaRemoval) {
                items.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    key: "full_media_removal",
                    className: "flex items-center gap-2",
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 75,
                        columnNumber: 9
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/photo-off.svg */ 945),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 76,
                        columnNumber: 11
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "federation_restriction.full_media_removal",
                    defaultMessage: "Full media removal",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 77,
                        columnNumber: 11
                    }
                })));
            }
            else if (partialMediaRemoval) {
                items.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    key: "partial_media_removal",
                    className: "flex items-center gap-2",
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 85,
                        columnNumber: 9
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/photo-off.svg */ 945),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 86,
                        columnNumber: 11
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "federation_restriction.partial_media_removal",
                    defaultMessage: "Partial media removal",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 87,
                        columnNumber: 11
                    }
                })));
            }
            if (!fullMediaRemoval && media_nsfw) {
                items.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    key: "media_nsfw",
                    className: "flex items-center gap-2",
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 97,
                        columnNumber: 9
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/eye-off.svg */ 159),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 98,
                        columnNumber: 11
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "federation_restriction.media_nsfw",
                    defaultMessage: "Attachments marked NSFW",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 99,
                        columnNumber: 11
                    }
                })));
            }
            return items;
        });
        _defineProperty(_this, "renderContent", function () {
            var _a = _this.props, instance = _a.instance, remoteInstance = _a.remoteInstance;
            if (!instance || !remoteInstance)
                return null;
            var host = remoteInstance.get('host');
            var siteTitle = instance.get('title');
            if (remoteInstance.getIn(['federation', 'reject']) === true) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    className: "flex items-center gap-2",
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 119,
                        columnNumber: 9
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 120,
                        columnNumber: 11
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "remote_instance.federation_panel.restricted_message",
                    defaultMessage: "{siteTitle} blocks all activities from {host}.",
                    values: {
                        host: host,
                        siteTitle: siteTitle
                    },
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 121,
                        columnNumber: 11
                    }
                }));
            }
            else if (hasRestrictions(remoteInstance)) {
                return [/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                        theme: "muted",
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 131,
                            columnNumber: 11
                        }
                    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                        id: "remote_instance.federation_panel.some_restrictions_message",
                        defaultMessage: "{siteTitle} has placed some restrictions on {host}.",
                        values: {
                            host: host,
                            siteTitle: siteTitle
                        },
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 132,
                            columnNumber: 13
                        }
                    })), _this.renderRestrictions()];
            }
            else {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    className: "flex items-center gap-2",
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 143,
                        columnNumber: 9
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/check.svg */ 157),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 144,
                        columnNumber: 11
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "remote_instance.federation_panel.no_restrictions_message",
                    defaultMessage: "{siteTitle} has placed no restrictions on {host}.",
                    values: {
                        host: host,
                        siteTitle: siteTitle
                    },
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 145,
                        columnNumber: 11
                    }
                }));
            }
        });
        return _this;
    }
    InstanceRestrictions.prototype.render = function () {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "py-1 pl-4 mb-4 border-solid border-l-[3px] border-gray-300 dark:border-gray-500",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 157,
                columnNumber: 7
            }
        }, this.renderContent());
    };
    return InstanceRestrictions;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__["default"])), _defineProperty(_class2, "propTypes", {
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired),
    remoteInstance: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map.isRequired),
    instance: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map)
}), _class2)) || _class);



/***/ }),

/***/ 1213:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/feed-suggestions/feed-suggestions.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_components_verification_badge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/verification_badge */ 198);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/ui */ 1);
/* harmony import */ var _ui_components_action_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ui/components/action-button */ 283);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/feed-suggestions/feed-suggestions.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    heading: {
        "id": "feed_suggestions.heading",
        "defaultMessage": "Suggested profiles"
    },
    viewAll: {
        "id": "feed_suggestions.view_all",
        "defaultMessage": "View all"
    }
});
var SuggestionItem = function (_ref) {
    var accountId = _ref.accountId;
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAccount)(accountId);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        space: 3,
        className: "p-4 md:p-0 rounded-md border border-solid border-gray-100 dark:border-slate-700 dark:md:border-transparent md:border-transparent w-52 shrink-0 md:shrink md:w-full",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Link, {
        to: "/@".concat(account.acct),
        title: account.acct,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        space: 3,
        className: "w-40 md:w-24 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
        src: account.avatar,
        className: "mx-auto block w-16 h-16 min-w-[56px] rounded-full object-cover",
        alt: account.acct,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        alignItems: "center",
        justifyContent: "center",
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        weight: "semibold",
        dangerouslySetInnerHTML: {
            __html: account.display_name
        },
        truncate: true,
        align: "center",
        size: "sm",
        className: "max-w-[95%]",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 15
        }
    }), account.verified && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_verification_badge__WEBPACK_IMPORTED_MODULE_1__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 36
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        theme: "muted",
        align: "center",
        size: "sm",
        truncate: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 13
        }
    }, "@", account.acct)))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "text-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_action_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 9
        }
    })));
};
var FeedSuggestions = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var suggestedProfiles = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.suggestions.items; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.suggestions.isLoading; });
    if (!isLoading && suggestedProfiles.size === 0)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        size: "lg",
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        justifyContent: "between",
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardTitle, {
        title: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_6__.Link, {
        to: "/suggestions",
        className: "text-primary-600 dark:text-primary-400 hover:underline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.viewAll))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        alignItems: "center",
        className: "overflow-x-auto lg:overflow-x-hidden space-x-4 md:space-x-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 9
        }
    }, suggestedProfiles.slice(0, 4).map(function (suggestedProfile) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(SuggestionItem, {
        key: suggestedProfile.account,
        accountId: suggestedProfile.account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 13
        }
    }); }))));
};
/* harmony default export */ __webpack_exports__["default"] = (FeedSuggestions);


/***/ }),

/***/ 939:
/*!*****************************************************!*\
  !*** ./app/soapbox/features/groups/create/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Create; }
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var _actions_group_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../actions/group_editor */ 299);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/groups/create/index.js";
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    title: {
        "id": "groups.form.title",
        "defaultMessage": "Enter a new group title"
    },
    description: {
        "id": "groups.form.description",
        "defaultMessage": "Enter the group description"
    },
    coverImage: {
        "id": "groups.form.coverImage",
        "defaultMessage": "Upload a banner image"
    },
    coverImageChange: {
        "id": "groups.form.coverImageChange",
        "defaultMessage": "Banner image selected"
    },
    create: {
        "id": "groups.form.create",
        "defaultMessage": "Create group"
    }
});
var mapStateToProps = function (state) { return ({
    title: state.getIn(['group_editor', 'title']),
    description: state.getIn(['group_editor', 'description']),
    coverImage: state.getIn(['group_editor', 'coverImage']),
    disabled: state.getIn(['group_editor', 'isSubmitting'])
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onTitleChange: function (value) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_4__.changeValue)('title', value)); },
    onDescriptionChange: function (value) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_4__.changeValue)('description', value)); },
    onCoverImageChange: function (value) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_4__.changeValue)('coverImage', value)); },
    onSubmit: function (routerHistory) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_4__.submit)(routerHistory)); },
    reset: function () { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_4__.reset)()); }
}); };
var Create = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.connect)(mapStateToProps, mapDispatchToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])(_class = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_7__.withRouter)(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Create, _super);
    function Create(props) {
        var _this = _super.call(this, props) || this;
        _defineProperty(_this, "handleTitleChange", function (e) {
            _this.props.onTitleChange(e.target.value);
        });
        _defineProperty(_this, "handleDescriptionChange", function (e) {
            _this.props.onDescriptionChange(e.target.value);
        });
        _defineProperty(_this, "handleCoverImageChange", function (e) {
            _this.props.onCoverImageChange(e.target.files[0]);
        });
        _defineProperty(_this, "handleSubmit", function (e) {
            e.preventDefault();
            _this.props.onSubmit(_this.props.history);
        });
        props.reset();
        return _this;
    }
    Create.prototype.render = function () {
        var _a = this.props, title = _a.title, description = _a.description, coverImage = _a.coverImage, disabled = _a.disabled, intl = _a.intl;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("form", {
            className: "group-form",
            method: "post",
            onSubmit: this.handleSubmit,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 78,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 79,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("input", {
            className: "standard",
            type: "text",
            value: title,
            disabled: disabled,
            onChange: this.handleTitleChange,
            placeholder: intl.formatMessage(messages.title),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 80,
                columnNumber: 11
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 89,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("textarea", {
            className: "standard",
            type: "text",
            value: description,
            disabled: disabled,
            onChange: this.handleDescriptionChange,
            placeholder: intl.formatMessage(messages.description),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 90,
                columnNumber: 11
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 99,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("label", {
            htmlFor: "group_cover_image",
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('group-form__file-label', {
                'group-form__file-label--selected': coverImage !== null
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 100,
                columnNumber: 11
            }
        }, intl.formatMessage(coverImage === null ? messages.coverImage : messages.coverImageChange)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("input", {
            type: "file",
            className: "group-form__file",
            id: "group_cover_image",
            disabled: disabled,
            onChange: this.handleCoverImageChange,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 103,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", {
            className: "standard-small",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 110,
                columnNumber: 11
            }
        }, intl.formatMessage(messages.create))));
    };
    return Create;
}(react__WEBPACK_IMPORTED_MODULE_2__.PureComponent)), _defineProperty(_class2, "propTypes", {
    title: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
    description: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
    coverImage: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
    disabled: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired),
    onTitleChange: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    onSubmit: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    reset: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    onDescriptionChange: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    onCoverImageChange: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    history: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)
}), _class2)) || _class) || _class) || _class);



/***/ }),

/***/ 1456:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/lists/components/new_list_form.tsx ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/lists */ 194);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/lists/components/new_list_form.tsx";






var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    label: {
        "id": "lists.new.title_placeholder",
        "defaultMessage": "New list title"
    },
    title: {
        "id": "lists.new.create",
        "defaultMessage": "Add list"
    },
    create: {
        "id": "lists.new.create_title",
        "defaultMessage": "Create"
    }
});
var NewListForm = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var value = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.listEditor.get('title'); });
    var disabled = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return !!state.listEditor.get('isSubmitting'); });
    var handleChange = function (e) {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.changeListEditorTitle)(e.target.value));
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.submitListEditor)(true));
    };
    var label = intl.formatMessage(messages.label);
    var create = intl.formatMessage(messages.create);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", {
        className: "flex-grow",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        style: {
            display: 'none'
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 11
        }
    }, label), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        type: "text",
        value: value,
        disabled: disabled,
        onChange: handleChange,
        placeholder: label,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        disabled: disabled,
        onClick: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 9
        }
    }, create)));
};
/* harmony default export */ __webpack_exports__["default"] = (NewListForm);


/***/ }),

/***/ 1260:
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_chat.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ 222);
/* harmony import */ var _placeholder_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeholder_avatar */ 286);
/* harmony import */ var _placeholder_display_name__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./placeholder_display_name */ 451);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_chat.tsx";




/** Fake chat to display while data is loading. */
var PlaceholderChat = function () {
    var messageLength = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.randomIntFromInterval)(5, 75);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "chat-list-item chat-list-item--placeholder",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 14,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_avatar__WEBPACK_IMPORTED_MODULE_2__["default"], {
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_display_name__WEBPACK_IMPORTED_MODULE_3__["default"], {
        minLength: 3,
        maxLength: 25,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "chat__last-message",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 13
        }
    }, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generateText)(messageLength))))));
};
/* harmony default export */ __webpack_exports__["default"] = (PlaceholderChat);


/***/ }),

/***/ 451:
/*!**********************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_display_name.tsx ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ 222);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_display_name.tsx";


/** Fake display name to show when data is loading. */
var PlaceholderDisplayName = function (_ref) {
    var minLength = _ref.minLength, maxLength = _ref.maxLength;
    var length = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.randomIntFromInterval)(maxLength, minLength);
    var acctLength = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.randomIntFromInterval)(maxLength, minLength);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex flex-col text-slate-200 dark:text-slate-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 7
        }
    }, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generateText)(length)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 7
        }
    }, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generateText)(acctLength)));
};
/* harmony default export */ __webpack_exports__["default"] = (PlaceholderDisplayName);


/***/ }),

/***/ 1214:
/*!**********************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_media_gallery.js ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-immutable-proptypes */ 193);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_media_gallery.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }




var PlaceholderMediaGallery = /** @class */ (function (_super) {
    __extends(PlaceholderMediaGallery, _super);
    function PlaceholderMediaGallery() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            width: _this.props.defaultWidth
        });
        _defineProperty(_this, "handleRef", function (node) {
            if (node) {
                _this.setState({
                    width: node.offsetWidth
                });
            }
        });
        _defineProperty(_this, "getSizeData", function (size) {
            var defaultWidth = _this.props.defaultWidth;
            var width = _this.state.width || defaultWidth;
            var style = {};
            var itemsDimensions = [];
            if (size === 1) {
                style.height = width * 9 / 16;
                itemsDimensions = [{
                        w: '100%',
                        h: '100%'
                    }];
            }
            else if (size === 2) {
                style.height = width / 2;
                itemsDimensions = [{
                        w: '50%',
                        h: '100%',
                        r: '2px'
                    }, {
                        w: '50%',
                        h: '100%',
                        l: '2px'
                    }];
            }
            else if (size === 3) {
                style.height = width;
                itemsDimensions = [{
                        w: '50%',
                        h: '50%',
                        b: '2px',
                        r: '2px'
                    }, {
                        w: '50%',
                        h: '50%',
                        b: '2px',
                        l: '2px'
                    }, {
                        w: '100%',
                        h: '50%',
                        t: '2px'
                    }];
            }
            else if (size >= 4) {
                style.height = width;
                itemsDimensions = [{
                        w: '50%',
                        h: '50%',
                        b: '2px',
                        r: '2px'
                    }, {
                        w: '50%',
                        h: '50%',
                        b: '2px',
                        l: '2px'
                    }, {
                        w: '50%',
                        h: '50%',
                        t: '2px',
                        r: '2px'
                    }, {
                        w: '50%',
                        h: '50%',
                        t: '2px',
                        l: '2px'
                    }];
            }
            return (0,immutable__WEBPACK_IMPORTED_MODULE_4__.Map)({
                style: style,
                itemsDimensions: itemsDimensions,
                size: size,
                width: width
            });
        });
        _defineProperty(_this, "renderItem", function (dimensions, i) {
            var width = dimensions.w;
            var height = dimensions.h;
            var top = dimensions.t || 'auto';
            var right = dimensions.r || 'auto';
            var bottom = dimensions.b || 'auto';
            var left = dimensions.l || 'auto';
            var float = dimensions.float || 'left';
            var position = dimensions.pos || 'relative';
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
                key: i,
                className: "media-gallery__item",
                style: {
                    position: position,
                    float: float,
                    left: left,
                    top: top,
                    right: right,
                    bottom: bottom,
                    height: height,
                    width: width
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 82,
                    columnNumber: 12
                }
            });
        });
        return _this;
    }
    PlaceholderMediaGallery.prototype.render = function () {
        var _this = this;
        var media = this.props.media;
        var sizeData = this.getSizeData(media.size);
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "media-gallery media-gallery--placeholder",
            style: sizeData.get('style'),
            ref: this.handleRef,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 90,
                columnNumber: 7
            }
        }, media.take(4).map(function (_, i) { return _this.renderItem(sizeData.get('itemsDimensions')[i], i); }));
    };
    return PlaceholderMediaGallery;
}(react__WEBPACK_IMPORTED_MODULE_2__.Component));
/* harmony default export */ __webpack_exports__["default"] = (PlaceholderMediaGallery);
_defineProperty(PlaceholderMediaGallery, "propTypes", {
    media: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map.isRequired),
    defaultWidth: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number)
});


/***/ }),

/***/ 794:
/*!****************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_status.tsx ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _placeholder_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeholder_avatar */ 286);
/* harmony import */ var _placeholder_display_name__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./placeholder_display_name */ 451);
/* harmony import */ var _placeholder_status_content__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./placeholder_status_content */ 932);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_status.tsx";





/** Fake status to display while data is loading. */
var PlaceholderStatus = function (_ref) {
    var _a = _ref.thread, thread = _a === void 0 ? false : _a;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()({
            'status-placeholder bg-white dark:bg-slate-800': true,
            'shadow-xl dark:shadow-inset sm:rounded-xl px-4 py-6 sm:p-5': !thread
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 14,
            columnNumber: 3
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "w-full animate-pulse overflow-hidden",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex space-x-3 items-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex-shrink-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_placeholder_avatar__WEBPACK_IMPORTED_MODULE_2__["default"], {
        size: 42,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "min-w-0 flex-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_placeholder_display_name__WEBPACK_IMPORTED_MODULE_3__["default"], {
        minLength: 3,
        maxLength: 25,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 13
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mt-4 status__content-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_placeholder_status_content__WEBPACK_IMPORTED_MODULE_4__["default"], {
        minLength: 5,
        maxLength: 120,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 9
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.memo(PlaceholderStatus));


/***/ }),

/***/ 932:
/*!************************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_status_content.tsx ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ 222);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_status_content.tsx";


/** Fake status content while data is loading. */
var PlaceholderStatusContent = function (_ref) {
    var minLength = _ref.minLength, maxLength = _ref.maxLength;
    var length = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.randomIntFromInterval)(maxLength, minLength);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex flex-col text-slate-200 dark:text-slate-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        className: "break-words",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 7
        }
    }, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generateText)(length)));
};
/* harmony default export */ __webpack_exports__["default"] = (PlaceholderStatusContent);


/***/ }),

/***/ 1454:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/remote_timeline/components/button-pin.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ButtonPin": function() { return /* binding */ ButtonPin; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tabler_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @tabler/icons */ 841);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/remote_timeline */ 447);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/remote_timeline/components/button-pin.tsx";
var _excluded = ["instance"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
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

function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }





var ButtonPin = function (_ref) {
    var instance = _ref.instance, props = _objectWithoutProperties(_ref, _excluded);
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), hover = _a[0], setHover = _a[1];
    var pinnedHosts = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (s) { return (0,soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__.getPinnedHosts)(s); });
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var pinned = pinnedHosts.find(function (hs) { return hs.get('host') === instance; });
    var getRemoteInstance = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__.makeGetRemoteInstance)();
    var favicon = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (s) { return getRemoteInstance(s, instance); }).get('favicon');
    var onClick = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function () {
        if (pinned) {
            dispatch((0,soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__.unpinHost)(instance));
        }
        else {
            dispatch((0,soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__.pinHost)(instance, favicon));
        }
    }, [dispatch, pinned, instance, favicon]);
    var finalProps = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return _objectSpread(_objectSpread({}, props), {}, {
        onMouseEnter: function () { return setHover(true); },
        onMouseLeave: function () { return setHover(false); },
        onClick: onClick
    }); }, [props, onClick]);
    if (hover) {
        return pinned ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_tabler_icons__WEBPACK_IMPORTED_MODULE_5__.IconPinnedOff, _extends({}, finalProps, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
                columnNumber: 21
            }
        })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_tabler_icons__WEBPACK_IMPORTED_MODULE_5__.IconPinned, _extends({}, finalProps, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
                columnNumber: 57
            }
        }));
    }
    return pinned ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_tabler_icons__WEBPACK_IMPORTED_MODULE_5__.IconPinned, _extends({}, finalProps, {
        className: "text-accent-300",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 19
        }
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_tabler_icons__WEBPACK_IMPORTED_MODULE_5__.IconPin, _extends({}, finalProps, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 80
        }
    }));
};


/***/ }),

/***/ 1451:
/*!**********************************************************!*\
  !*** ./app/soapbox/features/ui/components/accordion.tsx ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/containers/dropdown_menu_container */ 273);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/accordion.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    collapse: {
        "id": "accordion.collapse",
        "defaultMessage": "Collapse"
    },
    expand: {
        "id": "accordion.expand",
        "defaultMessage": "Expand"
    }
});
var Accordion = function (_ref) {
    var headline = _ref.headline, children = _ref.children, menu = _ref.menu, _a = _ref.expanded, expanded = _a === void 0 ? false : _a, _b = _ref.onToggle, onToggle = _b === void 0 ? function () { } : _b;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var handleToggle = function (e) {
        onToggle(!expanded);
        e.preventDefault();
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('accordion', {
            'accordion--expanded': expanded
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 5
        }
    }, menu && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "accordion__menu",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_3__["default"], {
        items: menu,
        src: __webpack_require__(/*! @tabler/icons/dots-vertical.svg */ 850),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", {
        type: "button",
        className: "accordion__title",
        onClick: handleToggle,
        title: intl.formatMessage(expanded ? messages.collapse : messages.expand),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 9
        }
    }, headline)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "accordion__content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 9
        }
    }, children)));
};
/* harmony default export */ __webpack_exports__["default"] = (Accordion);


/***/ }),

/***/ 933:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/ui/components/pending_status.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_status_reply_mentions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/status-reply-mentions */ 450);
/* harmony import */ var soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/status_content */ 417);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/account_container */ 155);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_card__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_card */ 732);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_media_gallery__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_media_gallery */ 1214);
/* harmony import */ var soapbox_features_status_containers_quoted_status_container__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/features/status/containers/quoted_status_container */ 507);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _util_pending_status_builder__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../util/pending_status_builder */ 1215);
/* harmony import */ var _poll_preview__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./poll_preview */ 934);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/pending_status.tsx";












var shouldHaveCard = function (pendingStatus) {
    return Boolean(pendingStatus.content.match(/https?:\/\/\S*/));
};
var PendingStatusMedia = function (_ref) {
    var status = _ref.status;
    if (status.media_attachments && !status.media_attachments.isEmpty()) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_placeholder_components_placeholder_media_gallery__WEBPACK_IMPORTED_MODULE_7__["default"], {
            media: status.media_attachments,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 36,
                columnNumber: 7
            }
        });
    }
    else if (!status.quote && shouldHaveCard(status)) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_placeholder_components_placeholder_card__WEBPACK_IMPORTED_MODULE_6__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 41,
                columnNumber: 12
            }
        });
    }
    else {
        return null;
    }
};
var PendingStatus = function (_ref2) {
    var idempotencyKey = _ref2.idempotencyKey, className = _ref2.className, muted = _ref2.muted;
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) {
        var pendingStatus = state.pending_statuses.get(idempotencyKey);
        return pendingStatus ? (0,_util_pending_status_builder__WEBPACK_IMPORTED_MODULE_10__.buildStatus)(state, pendingStatus, idempotencyKey) : null;
    });
    if (!status)
        return null;
    if (!status.account)
        return null;
    var account = status.account;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('opacity-50', className),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('status', {
            'status-reply': !!status.in_reply_to_id,
            muted: muted
        }),
        "data-id": status.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('status__wrapper', "status-".concat(status.visibility), {
            'status-reply': !!status.in_reply_to_id
        }),
        tabIndex: muted ? undefined : 0,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mb-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        justifyContent: "between",
        alignItems: "start",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: account.id,
        id: account.id,
        timestamp: status.created_at,
        hideActions: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "status__content-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_reply_mentions__WEBPACK_IMPORTED_MODULE_2__["default"], {
        status: status,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_3__["default"], {
        status: status,
        expanded: true,
        collapsable: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(PendingStatusMedia, {
        status: status,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 13
        }
    }), status.poll && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_poll_preview__WEBPACK_IMPORTED_MODULE_11__["default"], {
        pollId: status.poll,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 29
        }
    }), status.quote && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_status_containers_quoted_status_container__WEBPACK_IMPORTED_MODULE_8__["default"], {
        statusId: status.quote,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 30
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (PendingStatus);


/***/ }),

/***/ 934:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/ui/components/poll_preview.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/noop */ 452);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_noop__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_polls_poll_option__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/polls/poll-option */ 737);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/poll_preview.tsx";





var PollPreview = function (_ref) {
    var pollId = _ref.pollId;
    var poll = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.polls.get(pollId); });
    if (!poll) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 5
        }
    }, poll.options.map(function (option, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_polls_poll_option__WEBPACK_IMPORTED_MODULE_2__["default"], {
        key: i,
        poll: poll,
        option: option,
        index: i,
        showResults: false,
        active: false,
        onToggle: (lodash_noop__WEBPACK_IMPORTED_MODULE_0___default()),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (PollPreview);


/***/ }),

/***/ 1463:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/profile_stats.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/utils/numbers */ 88);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/profile_stats.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__.defineMessages)({
    followers: {
        "id": "account.followers",
        "defaultMessage": "Followers"
    },
    follows: {
        "id": "account.follows",
        "defaultMessage": "Follows"
    }
});
/** Display follower and following counts for an account. */
var ProfileStats = function (_ref) {
    var _account$pleroma5, _account$pleroma6;
    var account = _ref.account, onClickHandler = _ref.onClickHandler;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var FollowersWrapper = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () { return function (_ref2) {
        var _account$pleroma, _account$pleroma2;
        var children = _ref2.children;
        return (_account$pleroma = account.pleroma) !== null && _account$pleroma !== void 0 && _account$pleroma.get('hide_followers') ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, children) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.NavLink, {
            to: "/@".concat(account.acct, "/followers"),
            onClick: onClickHandler,
            title: (_account$pleroma2 = account.pleroma) !== null && _account$pleroma2 !== void 0 && _account$pleroma2.get('hide_followers_count') ? null : intl.formatNumber(account.followers_count),
            className: "hover:underline",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 25,
                columnNumber: 84
            }
        }, children);
    }; }, [account, onClickHandler, intl]);
    var FollowingWrapper = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () { return function (_ref3) {
        var _account$pleroma3, _account$pleroma4;
        var children = _ref3.children;
        return (_account$pleroma3 = account.pleroma) !== null && _account$pleroma3 !== void 0 && _account$pleroma3.get('hide_follows') ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, children) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.NavLink, {
            to: "/@".concat(account.acct, "/following"),
            onClick: onClickHandler,
            title: (_account$pleroma4 = account.pleroma) !== null && _account$pleroma4 !== void 0 && _account$pleroma4.get('hide_follows_count') ? null : intl.formatNumber(account.following_count),
            className: "hover:underline",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
                columnNumber: 82
            }
        }, children);
    }; }, [account, onClickHandler, intl]);
    if (!account) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.HStack, {
        alignItems: "center",
        space: 3,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(FollowersWrapper, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.HStack, {
        alignItems: "center",
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "primary",
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 11
        }
    }, (_account$pleroma5 = account.pleroma) !== null && _account$pleroma5 !== void 0 && _account$pleroma5.get('hide_followers_count') ? '-' : (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_2__.shortNumberFormat)(account.followers_count)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.followers)))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(FollowingWrapper, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.HStack, {
        alignItems: "center",
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "primary",
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 11
        }
    }, (_account$pleroma6 = account.pleroma) !== null && _account$pleroma6 !== void 0 && _account$pleroma6.get('hide_follows_count') ? '-' : (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_2__.shortNumberFormat)(account.following_count)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.follows)))));
};
/* harmony default export */ __webpack_exports__["default"] = (ProfileStats);


/***/ }),

/***/ 944:
/*!************************************************************!*\
  !*** ./app/soapbox/features/ui/components/promo_panel.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/promo_panel.tsx";



var PromoPanel = function () {
    var promoPanel = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSoapboxConfig)().promoPanel;
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSettings)();
    var promoItems = promoPanel.get('items');
    var locale = settings.get('locale');
    if (!promoItems || promoItems.isEmpty())
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Widget, {
        title: "",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 7
        }
    }, promoItems.map(function (item, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        key: i,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        className: "flex items-center",
        href: item.url,
        target: "_blank",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "text-lg mr-2 grayscale",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 15
        }
    }, item.icon), item.textLocales.get(locale) || item.text)); })));
};
/* harmony default export */ __webpack_exports__["default"] = (PromoPanel);


/***/ }),

/***/ 1448:
/*!*********************************************************!*\
  !*** ./app/soapbox/features/ui/components/timeline.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ 32);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/timelines */ 45);
/* harmony import */ var soapbox_components_scroll_top_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/scroll-top-button */ 931);
/* harmony import */ var soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/status_list */ 790);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/timeline.tsx";
var _excluded = ["timelineId", "onLoadMore"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    queue: {
        "id": "status_list.queue_label",
        "defaultMessage": "Click to see {count} new {count, plural, one {post} other {posts}}"
    }
});
/** Scrollable list of statuses from a timeline in the Redux store. */
var Timeline = function (_ref) {
    var timelineId = _ref.timelineId, onLoadMore = _ref.onLoadMore, rest = _objectWithoutProperties(_ref, _excluded);
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var getStatusIds = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetStatusIds, [])();
    var lastStatusId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$timelines$get;
        return (((_state$timelines$get = state.timelines.get(timelineId)) === null || _state$timelines$get === void 0 ? void 0 : _state$timelines$get.items) || (0,immutable__WEBPACK_IMPORTED_MODULE_9__.OrderedSet)()).last();
    });
    var statusIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return getStatusIds(state, {
        type: timelineId
    }); });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return (state.timelines.get(timelineId) || {
        isLoading: true
    }).isLoading === true; });
    var isPartial = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$timelines$get2;
        return (((_state$timelines$get2 = state.timelines.get(timelineId)) === null || _state$timelines$get2 === void 0 ? void 0 : _state$timelines$get2.isPartial) || false) === true;
    });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$timelines$get3;
        return ((_state$timelines$get3 = state.timelines.get(timelineId)) === null || _state$timelines$get3 === void 0 ? void 0 : _state$timelines$get3.hasMore) === true;
    });
    var totalQueuedItemsCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$timelines$get4;
        return ((_state$timelines$get4 = state.timelines.get(timelineId)) === null || _state$timelines$get4 === void 0 ? void 0 : _state$timelines$get4.totalQueuedItemsCount) || 0;
    });
    var isFilteringFeed = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$timelines$get5;
        return !!((_state$timelines$get5 = state.timelines.get(timelineId)) !== null && _state$timelines$get5 !== void 0 && _state$timelines$get5.feedAccountId);
    });
    var handleDequeueTimeline = function () {
        if (isFilteringFeed) {
            return;
        }
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.dequeueTimeline)(timelineId, onLoadMore));
    };
    var handleScrollToTop = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function () {
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.scrollTopTimeline)(timelineId, true));
    }, 100), [timelineId]);
    var handleScroll = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function () {
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.scrollTopTimeline)(timelineId, false));
    }, 100), [timelineId]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/ (0,react_dom__WEBPACK_IMPORTED_MODULE_2__.createPortal)(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scroll_top_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        key: "timeline-queue-button-header",
        onClick: handleDequeueTimeline,
        count: totalQueuedItemsCount,
        message: messages.queue,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 22
        }
    }), document.body), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_5__["default"], _extends({
        timelineId: timelineId,
        onScrollToTop: handleScrollToTop,
        onScroll: handleScroll,
        lastStatusId: lastStatusId,
        statusIds: statusIds,
        isLoading: isLoading,
        isPartial: isPartial,
        hasMore: hasMore,
        onLoadMore: onLoadMore
    }, rest, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 7
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Timeline);


/***/ }),

/***/ 1253:
/*!****************************************************!*\
  !*** ./app/soapbox/features/ui/util/fullscreen.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attachFullscreenListener": function() { return /* binding */ attachFullscreenListener; },
/* harmony export */   "detachFullscreenListener": function() { return /* binding */ detachFullscreenListener; },
/* harmony export */   "exitFullscreen": function() { return /* binding */ exitFullscreen; },
/* harmony export */   "isFullscreen": function() { return /* binding */ isFullscreen; },
/* harmony export */   "requestFullscreen": function() { return /* binding */ requestFullscreen; }
/* harmony export */ });
// APIs for normalizing fullscreen operations. Note that Edge uses
// the WebKit-prefixed APIs currently (as of Edge 16).
var isFullscreen = function () { return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement; };
var exitFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
};
var requestFullscreen = function (el) {
    if (el.requestFullscreen) {
        el.requestFullscreen();
    }
    else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    }
    else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    }
};
var attachFullscreenListener = function (listener) {
    if ('onfullscreenchange' in document) {
        document.addEventListener('fullscreenchange', listener);
    }
    else if ('onwebkitfullscreenchange' in document) {
        document.addEventListener('webkitfullscreenchange', listener);
    }
    else if ('onmozfullscreenchange' in document) {
        document.addEventListener('mozfullscreenchange', listener);
    }
};
var detachFullscreenListener = function (listener) {
    if ('onfullscreenchange' in document) {
        document.removeEventListener('fullscreenchange', listener);
    }
    else if ('onwebkitfullscreenchange' in document) {
        document.removeEventListener('webkitfullscreenchange', listener);
    }
    else if ('onmozfullscreenchange' in document) {
        document.removeEventListener('mozfullscreenchange', listener);
    }
};


/***/ }),

/***/ 1215:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/ui/util/pending_status_builder.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildStatus": function() { return /* binding */ buildStatus; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var soapbox_normalizers_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/normalizers/status */ 276);
/* harmony import */ var soapbox_reducers_statuses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/reducers/statuses */ 476);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/selectors */ 30);





var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_3__.makeGetAccount)();
var buildMentions = function (pendingStatus) {
    if (pendingStatus.in_reply_to_id) {
        return (0,immutable__WEBPACK_IMPORTED_MODULE_4__.List)(pendingStatus.to || []).map(function (acct) { return (0,immutable__WEBPACK_IMPORTED_MODULE_4__.Map)({
            acct: acct
        }); });
    }
    else {
        return (0,immutable__WEBPACK_IMPORTED_MODULE_4__.List)();
    }
};
var buildPoll = function (pendingStatus) {
    if (pendingStatus.hasIn(['poll', 'options'])) {
        return pendingStatus.poll.update('options', function (options) {
            return options.map(function (title) { return (0,immutable__WEBPACK_IMPORTED_MODULE_4__.Map)({
                title: title
            }); });
        });
    }
    else {
        return null;
    }
};
var buildStatus = function (state, pendingStatus, idempotencyKey) {
    var me = state.me;
    var account = getAccount(state, me);
    var inReplyToId = pendingStatus.in_reply_to_id;
    var status = (0,immutable__WEBPACK_IMPORTED_MODULE_4__.Map)({
        account: account,
        content: pendingStatus.status.replace(new RegExp('\n', 'g'), '<br>'),
        /* eslint-disable-line no-control-regex */
        id: "\u672Bpending-".concat(idempotencyKey),
        in_reply_to_account_id: state.statuses.getIn([inReplyToId, 'account'], null),
        in_reply_to_id: inReplyToId,
        media_attachments: (pendingStatus.media_ids || (0,immutable__WEBPACK_IMPORTED_MODULE_4__.List)()).map(function (id) { return (0,immutable__WEBPACK_IMPORTED_MODULE_4__.Map)({
            id: id
        }); }),
        mentions: buildMentions(pendingStatus),
        poll: buildPoll(pendingStatus),
        quote: pendingStatus.quote_id,
        sensitive: pendingStatus.sensitive,
        visibility: pendingStatus.visibility
    });
    return (0,soapbox_reducers_statuses__WEBPACK_IMPORTED_MODULE_2__.calculateStatus)((0,soapbox_normalizers_status__WEBPACK_IMPORTED_MODULE_1__.normalizeStatus)(status));
};


/***/ }),

/***/ 431:
/*!*********************************************!*\
  !*** ./app/soapbox/features/video/index.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Video; },
/* harmony export */   "fileNameFromURL": function() { return /* binding */ fileNameFromURL; },
/* harmony export */   "findElementPosition": function() { return /* binding */ findElementPosition; },
/* harmony export */   "formatTime": function() { return /* binding */ formatTime; },
/* harmony export */   "getPointerPosition": function() { return /* binding */ getPointerPosition; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url.js */ 46);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 28);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash/throttle */ 83);
/* harmony import */ var lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_throttle__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/blurhash */ 288);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/utils/media_aspect_ratio */ 942);
/* harmony import */ var _ui_util_fullscreen__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../ui/util/fullscreen */ 1253);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/video/index.js";
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }
















var DEFAULT_HEIGHT = 300;
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_14__.defineMessages)({
    play: {
        "id": "video.play",
        "defaultMessage": "Play"
    },
    pause: {
        "id": "video.pause",
        "defaultMessage": "Pause"
    },
    mute: {
        "id": "video.mute",
        "defaultMessage": "Mute sound"
    },
    unmute: {
        "id": "video.unmute",
        "defaultMessage": "Unmute sound"
    },
    hide: {
        "id": "video.hide",
        "defaultMessage": "Hide video"
    },
    expand: {
        "id": "video.expand",
        "defaultMessage": "Expand video"
    },
    close: {
        "id": "video.close",
        "defaultMessage": "Close video"
    },
    fullscreen: {
        "id": "video.fullscreen",
        "defaultMessage": "Full screen"
    },
    exit_fullscreen: {
        "id": "video.exit_fullscreen",
        "defaultMessage": "Exit full screen"
    }
});
var formatTime = function (secondsNum) {
    var hours = Math.floor(secondsNum / 3600);
    var minutes = Math.floor((secondsNum - hours * 3600) / 60);
    var seconds = secondsNum - hours * 3600 - minutes * 60;
    if (hours < 10)
        hours = '0' + hours;
    if (minutes < 10)
        minutes = '0' + minutes;
    if (seconds < 10)
        seconds = '0' + seconds;
    return (hours === '00' ? '' : "".concat(hours, ":")) + "".concat(minutes, ":").concat(seconds);
};
var findElementPosition = function (el) {
    var box;
    if (el.getBoundingClientRect && el.parentNode) {
        box = el.getBoundingClientRect();
    }
    if (!box) {
        return {
            left: 0,
            top: 0
        };
    }
    var docEl = document.documentElement;
    var body = document.body;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var scrollLeft = window.pageXOffset || body.scrollLeft;
    var left = box.left + scrollLeft - clientLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var scrollTop = window.pageYOffset || body.scrollTop;
    var top = box.top + scrollTop - clientTop;
    return {
        left: Math.round(left),
        top: Math.round(top)
    };
};
var getPointerPosition = function (el, event) {
    var position = {};
    var box = findElementPosition(el);
    var boxW = el.offsetWidth;
    var boxH = el.offsetHeight;
    var boxY = box.top;
    var boxX = box.left;
    var pageY = event.pageY;
    var pageX = event.pageX;
    if (event.changedTouches) {
        pageX = event.changedTouches[0].pageX;
        pageY = event.changedTouches[0].pageY;
    }
    position.y = Math.max(0, Math.min(1, (pageY - boxY) / boxH));
    position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW));
    return position;
};
var fileNameFromURL = function (str) {
    var url = new URL(str);
    var pathname = url.pathname;
    var index = pathname.lastIndexOf('/');
    return pathname.substring(index + 1);
};
var mapStateToProps = function (state) { return ({
    displayMedia: (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_9__.getSettings)(state).get('displayMedia')
}); };
var Video = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_8__.connect)(mapStateToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_15__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Video, _super);
    function Video() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            currentTime: 0,
            duration: 0,
            volume: 0.5,
            paused: true,
            dragging: false,
            containerWidth: _this.props.width,
            fullscreen: false,
            hovered: false,
            muted: false,
            revealed: _this.props.visible !== undefined ? _this.props.visible : _this.props.displayMedia !== 'hide_all' && !_this.props.sensitive || _this.props.displayMedia === 'show_all'
        });
        _defineProperty(_this, "setPlayerRef", function (c) {
            _this.player = c;
            if (_this.player) {
                _this._setDimensions();
            }
        });
        _defineProperty(_this, "setVideoRef", function (c) {
            _this.video = c;
            if (_this.video) {
                _this.setState({
                    volume: _this.video.volume,
                    muted: _this.video.muted
                });
            }
        });
        _defineProperty(_this, "setSeekRef", function (c) {
            _this.seek = c;
        });
        _defineProperty(_this, "setVolumeRef", function (c) {
            _this.volume = c;
        });
        _defineProperty(_this, "handleClickRoot", function (e) { return e.stopPropagation(); });
        _defineProperty(_this, "handlePlay", function () {
            _this.setState({
                paused: false
            });
        });
        _defineProperty(_this, "handlePause", function () {
            _this.setState({
                paused: true
            });
        });
        _defineProperty(_this, "handleTimeUpdate", function () {
            _this.setState({
                currentTime: Math.floor(_this.video.currentTime),
                duration: Math.floor(_this.video.duration)
            });
        });
        _defineProperty(_this, "handleVolumeMouseDown", function (e) {
            document.addEventListener('mousemove', _this.handleMouseVolSlide, true);
            document.addEventListener('mouseup', _this.handleVolumeMouseUp, true);
            document.addEventListener('touchmove', _this.handleMouseVolSlide, true);
            document.addEventListener('touchend', _this.handleVolumeMouseUp, true);
            _this.handleMouseVolSlide(e);
            e.preventDefault();
            e.stopPropagation();
        });
        _defineProperty(_this, "handleVolumeMouseUp", function () {
            document.removeEventListener('mousemove', _this.handleMouseVolSlide, true);
            document.removeEventListener('mouseup', _this.handleVolumeMouseUp, true);
            document.removeEventListener('touchmove', _this.handleMouseVolSlide, true);
            document.removeEventListener('touchend', _this.handleVolumeMouseUp, true);
        });
        _defineProperty(_this, "handleMouseVolSlide", lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default()(function (e) {
            var x = getPointerPosition(_this.volume, e).x;
            if (!isNaN(x)) {
                var slideamt = x;
                if (x > 1) {
                    slideamt = 1;
                }
                else if (x < 0) {
                    slideamt = 0;
                }
                _this.video.volume = slideamt;
                _this.setState({
                    volume: slideamt
                });
            }
        }, 60));
        _defineProperty(_this, "handleMouseDown", function (e) {
            document.addEventListener('mousemove', _this.handleMouseMove, true);
            document.addEventListener('mouseup', _this.handleMouseUp, true);
            document.addEventListener('touchmove', _this.handleMouseMove, true);
            document.addEventListener('touchend', _this.handleMouseUp, true);
            _this.setState({
                dragging: true
            });
            _this.video.pause();
            _this.handleMouseMove(e);
            e.preventDefault();
            e.stopPropagation();
        });
        _defineProperty(_this, "handleMouseUp", function () {
            document.removeEventListener('mousemove', _this.handleMouseMove, true);
            document.removeEventListener('mouseup', _this.handleMouseUp, true);
            document.removeEventListener('touchmove', _this.handleMouseMove, true);
            document.removeEventListener('touchend', _this.handleMouseUp, true);
            _this.setState({
                dragging: false
            });
            _this.video.play();
        });
        _defineProperty(_this, "handleMouseMove", lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default()(function (e) {
            var x = getPointerPosition(_this.seek, e).x;
            var currentTime = Math.floor(_this.video.duration * x);
            if (!isNaN(currentTime)) {
                _this.video.currentTime = currentTime;
                _this.setState({
                    currentTime: currentTime
                });
            }
        }, 60));
        _defineProperty(_this, "handleVideoKeyDown", function (e) {
            // On the video element or the seek bar, we can safely use the space bar
            // for playback control because there are no buttons to press
            if (e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                _this.togglePlay();
            }
        });
        _defineProperty(_this, "handleKeyDown", function (e) {
            var frameTime = 1 / 25;
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.togglePlay();
                    break;
                case 'm':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.toggleMute();
                    break;
                case 'f':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.toggleFullscreen();
                    break;
                case 'j':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.seekBy(-10);
                    break;
                case 'l':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.seekBy(10);
                    break;
                case ',':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.seekBy(-frameTime);
                    break;
                case '.':
                    e.preventDefault();
                    e.stopPropagation();
                    _this.seekBy(frameTime);
                    break;
            } // If we are in fullscreen mode, we don't want any hotkeys
            // interacting with the UI that's not visible
            if (_this.state.fullscreen) {
                e.preventDefault();
                e.stopPropagation();
                if (e.key === 'Escape') {
                    (0,_ui_util_fullscreen__WEBPACK_IMPORTED_MODULE_13__.exitFullscreen)();
                }
            }
        });
        _defineProperty(_this, "togglePlay", function (e) {
            if (e) {
                e.stopPropagation();
            }
            if (_this.state.paused) {
                _this.setState({
                    paused: false
                }, function () { return _this.video.play(); });
            }
            else {
                _this.setState({
                    paused: true
                }, function () { return _this.video.pause(); });
            }
        });
        _defineProperty(_this, "toggleFullscreen", function () {
            if ((0,_ui_util_fullscreen__WEBPACK_IMPORTED_MODULE_13__.isFullscreen)()) {
                (0,_ui_util_fullscreen__WEBPACK_IMPORTED_MODULE_13__.exitFullscreen)();
            }
            else {
                (0,_ui_util_fullscreen__WEBPACK_IMPORTED_MODULE_13__.requestFullscreen)(_this.player);
            }
        });
        _defineProperty(_this, "handleResize", lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default()(function () {
            if (_this.player) {
                _this._setDimensions();
            }
        }, 250, {
            trailing: true
        }));
        _defineProperty(_this, "handleScroll", lodash_throttle__WEBPACK_IMPORTED_MODULE_5___default()(function () {
            if (!_this.video) {
                return;
            }
            var _a = _this.video.getBoundingClientRect(), top = _a.top, height = _a.height;
            var inView = top <= (window.innerHeight || document.documentElement.clientHeight) && top + height >= 0;
            if (!_this.state.paused && !inView) {
                _this.setState({
                    paused: true
                }, function () { return _this.video.pause(); });
            }
        }, 150, {
            trailing: true
        }));
        _defineProperty(_this, "handleFullscreenChange", function () {
            _this.setState({
                fullscreen: (0,_ui_util_fullscreen__WEBPACK_IMPORTED_MODULE_13__.isFullscreen)()
            });
        });
        _defineProperty(_this, "handleMouseEnter", function () {
            _this.setState({
                hovered: true
            });
        });
        _defineProperty(_this, "handleMouseLeave", function () {
            _this.setState({
                hovered: false
            });
        });
        _defineProperty(_this, "toggleMute", function () {
            var muted = !_this.video.muted;
            _this.setState({
                muted: muted
            }, function () {
                _this.video.muted = muted;
            });
        });
        _defineProperty(_this, "toggleReveal", function (e) {
            e.stopPropagation();
            if (_this.props.onToggleVisibility) {
                _this.props.onToggleVisibility();
            }
            else {
                _this.setState({
                    revealed: !_this.state.revealed
                });
            }
        });
        _defineProperty(_this, "handleLoadedData", function () {
            if (_this.props.startTime) {
                _this.video.currentTime = _this.props.startTime;
                _this.video.play();
            }
        });
        _defineProperty(_this, "handleProgress", function () {
            if (_this.video.buffered.length > 0) {
                _this.setState({
                    buffer: _this.video.buffered.end(0) / _this.video.duration * 100
                });
            }
        });
        _defineProperty(_this, "handleVolumeChange", function () {
            _this.setState({
                volume: _this.video.volume,
                muted: _this.video.muted
            });
        });
        _defineProperty(_this, "handleOpenVideo", function () {
            var _a = _this.props, src = _a.src, preview = _a.preview, width = _a.width, height = _a.height, alt = _a.alt;
            var media = (0,immutable__WEBPACK_IMPORTED_MODULE_16__.fromJS)({
                type: 'video',
                url: src,
                preview_url: preview,
                description: alt,
                width: width,
                height: height
            });
            _this.video.pause();
            _this.props.onOpenVideo(media, _this.video.currentTime);
        });
        _defineProperty(_this, "handleCloseVideo", function () {
            _this.video.pause();
            _this.props.onCloseVideo();
        });
        _defineProperty(_this, "getPreload", function () {
            var _a = _this.props, startTime = _a.startTime, detailed = _a.detailed;
            var _b = _this.state, dragging = _b.dragging, fullscreen = _b.fullscreen;
            if (startTime || fullscreen || dragging) {
                return 'auto';
            }
            else if (detailed) {
                return 'metadata';
            }
            else {
                return 'none';
            }
        });
        return _this;
    }
    Video.prototype._setDimensions = function () {
        var width = this.player.offsetWidth;
        if (this.props.cacheWidth) {
            this.props.cacheWidth(width);
        }
        this.setState({
            containerWidth: width
        });
    };
    Video.prototype.seekBy = function (time) {
        var _this = this;
        var currentTime = this.video.currentTime + time;
        if (!isNaN(currentTime)) {
            this.setState({
                currentTime: currentTime
            }, function () {
                _this.video.currentTime = currentTime;
            });
        }
    };
    Video.prototype.componentDidMount = function () {
        document.addEventListener('fullscreenchange', this.handleFullscreenChange, true);
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange, true);
        document.addEventListener('mozfullscreenchange', this.handleFullscreenChange, true);
        document.addEventListener('MSFullscreenChange', this.handleFullscreenChange, true);
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize, {
            passive: true
        });
    };
    Video.prototype.componentWillUnmount = function () {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('fullscreenchange', this.handleFullscreenChange, true);
        document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange, true);
        document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange, true);
        document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange, true);
    };
    Video.prototype.componentDidUpdate = function (prevProps, prevState) {
        var visible = this.props.visible;
        if (!(0,immutable__WEBPACK_IMPORTED_MODULE_16__.is)(visible, prevProps.visible) && visible !== undefined) {
            this.setState({
                revealed: visible
            });
        }
        if (prevState.revealed && !this.state.revealed && this.video) {
            this.video.pause();
        }
    };
    Video.prototype.render = function () {
        var _a = this.props, src = _a.src, inline = _a.inline, onOpenVideo = _a.onOpenVideo, onCloseVideo = _a.onCloseVideo, intl = _a.intl, alt = _a.alt, detailed = _a.detailed, sensitive = _a.sensitive, link = _a.link, aspectRatio = _a.aspectRatio, blurhash = _a.blurhash;
        var _b = this.state, containerWidth = _b.containerWidth, currentTime = _b.currentTime, duration = _b.duration, volume = _b.volume, buffer = _b.buffer, dragging = _b.dragging, paused = _b.paused, fullscreen = _b.fullscreen, hovered = _b.hovered, muted = _b.muted, revealed = _b.revealed;
        var progress = currentTime / duration * 100;
        var playerStyle = {};
        var _c = this.props, width = _c.width, height = _c.height;
        if (inline && containerWidth) {
            width = containerWidth;
            var minSize = containerWidth / (16 / 9);
            if ((0,soapbox_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_12__.isPanoramic)(aspectRatio)) {
                height = Math.max(Math.floor(containerWidth / soapbox_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_12__.maximumAspectRatio), minSize);
            }
            else if ((0,soapbox_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_12__.isPortrait)(aspectRatio)) {
                height = Math.max(Math.floor(containerWidth / soapbox_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_12__.minimumAspectRatio), minSize);
            }
            else {
                height = Math.floor(containerWidth / aspectRatio);
            }
            playerStyle.height = height || DEFAULT_HEIGHT;
        }
        var warning;
        if (sensitive) {
            warning = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
                id: "status.sensitive_warning",
                defaultMessage: "Sensitive content",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 525,
                    columnNumber: 17
                }
            });
        }
        else {
            warning = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
                id: "status.media_hidden",
                defaultMessage: "Media hidden",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 527,
                    columnNumber: 17
                }
            });
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            role: "menuitem",
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('video-player', {
                'video-player--inactive': !revealed,
                detailed: detailed,
                'video-player--inline': inline && !fullscreen,
                fullscreen: fullscreen
            }),
            style: playerStyle,
            ref: this.setPlayerRef,
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave,
            onClick: this.handleClickRoot,
            onKeyDown: this.handleKeyDown,
            tabIndex: 0,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 531,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_10__["default"], {
            hash: blurhash,
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('media-gallery__preview', {
                'media-gallery__preview--hidden': revealed
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 542,
                columnNumber: 9
            }
        }), revealed && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("video", {
            ref: this.setVideoRef,
            src: src // preload={this.getPreload()}
            ,
            loop: true,
            role: "button",
            tabIndex: "0",
            "aria-label": alt,
            title: alt,
            width: width,
            height: height || DEFAULT_HEIGHT,
            volume: volume,
            onClick: this.togglePlay,
            onKeyDown: this.handleVideoKeyDown,
            onPlay: this.handlePlay,
            onPause: this.handlePause,
            onTimeUpdate: this.handleTimeUpdate,
            onLoadedData: this.handleLoadedData,
            onProgress: this.handleProgress,
            onVolumeChange: this.handleVolumeChange,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 549,
                columnNumber: 22
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('spoiler-button', {
                'spoiler-button--hidden': !sensitive || revealed
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 571,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            className: "spoiler-button__overlay",
            onClick: this.toggleReveal,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 572,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "spoiler-button__overlay__label",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 573,
                columnNumber: 13
            }
        }, warning))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('video-player__controls', {
                active: paused || hovered
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 577,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__seek",
            onMouseDown: this.handleMouseDown,
            ref: this.setSeekRef,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 578,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__seek__buffer",
            style: {
                width: "".concat(buffer, "%")
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 579,
                columnNumber: 13
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__seek__progress",
            style: {
                width: "".concat(progress, "%")
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 580,
                columnNumber: 13
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('video-player__seek__handle', {
                active: dragging
            }),
            tabIndex: "0",
            style: {
                left: "".concat(progress, "%")
            },
            onKeyDown: this.handleVideoKeyDown,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 582,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__buttons-bar",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 590,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__buttons left",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 591,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            title: intl.formatMessage(paused ? messages.play : messages.pause),
            "aria-label": intl.formatMessage(paused ? messages.play : messages.pause),
            className: "player-button",
            onClick: this.togglePlay,
            autoFocus: detailed,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 592,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
            src: paused ? __webpack_require__(/*! @tabler/icons/player-play.svg */ 396) : __webpack_require__(/*! @tabler/icons/player-pause.svg */ 744),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 592,
                columnNumber: 251
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            title: intl.formatMessage(muted ? messages.unmute : messages.mute),
            "aria-label": intl.formatMessage(muted ? messages.unmute : messages.mute),
            className: "player-button",
            onClick: this.toggleMute,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 593,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
            src: muted ? __webpack_require__(/*! @tabler/icons/volume-3.svg */ 745) : __webpack_require__(/*! @tabler/icons/volume.svg */ 453),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 593,
                columnNumber: 230
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('video-player__volume', {
                active: this.state.hovered
            }),
            onMouseDown: this.handleVolumeMouseDown,
            ref: this.setVolumeRef,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 595,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__volume__current",
            style: {
                width: "".concat(volume * 100, "%")
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 596,
                columnNumber: 17
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: classnames__WEBPACK_IMPORTED_MODULE_3___default()('video-player__volume__handle'),
            tabIndex: "0",
            style: {
                left: "".concat(volume * 100, "%")
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 597,
                columnNumber: 17
            }
        })), (detailed || fullscreen) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 605,
                columnNumber: 17
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__time-current",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 606,
                columnNumber: 19
            }
        }, formatTime(currentTime)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__time-sep",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 607,
                columnNumber: 19
            }
        }, "/"), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__time-total",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 608,
                columnNumber: 19
            }
        }, formatTime(duration))), link && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("span", {
            className: "video-player__link",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 612,
                columnNumber: 24
            }
        }, link)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("div", {
            className: "video-player__buttons right",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 615,
                columnNumber: 13
            }
        }, sensitive && !onCloseVideo && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            title: intl.formatMessage(messages.hide),
            "aria-label": intl.formatMessage(messages.hide),
            className: "player-button",
            onClick: this.toggleReveal,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 616,
                columnNumber: 48
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
            src: __webpack_require__(/*! @tabler/icons/eye-off.svg */ 159),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 616,
                columnNumber: 213
            }
        })), !fullscreen && onOpenVideo && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            title: intl.formatMessage(messages.expand),
            "aria-label": intl.formatMessage(messages.expand),
            className: "player-button",
            onClick: this.handleOpenVideo,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 617,
                columnNumber: 48
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
            src: __webpack_require__(/*! @tabler/icons/maximize.svg */ 1254),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 617,
                columnNumber: 220
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement("button", {
            type: "button",
            title: intl.formatMessage(fullscreen ? messages.exit_fullscreen : messages.fullscreen),
            "aria-label": intl.formatMessage(fullscreen ? messages.exit_fullscreen : messages.fullscreen),
            className: "player-button",
            onClick: this.toggleFullscreen,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 619,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_7__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
            src: fullscreen ? __webpack_require__(/*! @tabler/icons/arrows-minimize.svg */ 941) : __webpack_require__(/*! @tabler/icons/arrows-maximize.svg */ 1255),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 619,
                columnNumber: 276
            }
        }))))));
    };
    return Video;
}(react__WEBPACK_IMPORTED_MODULE_7__.PureComponent)), _defineProperty(_class2, "propTypes", {
    preview: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    src: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string.isRequired),
    alt: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    width: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    height: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    sensitive: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    startTime: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    onOpenVideo: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().func),
    onCloseVideo: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().func),
    detailed: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    inline: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    cacheWidth: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().func),
    visible: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().bool),
    onToggleVisibility: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().func),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().object.isRequired),
    blurhash: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string),
    link: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().node),
    aspectRatio: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().number),
    displayMedia: (prop_types__WEBPACK_IMPORTED_MODULE_6___default().string)
}), _class2)) || _class) || _class);



/***/ }),

/***/ 1216:
/*!************************************!*\
  !*** ./app/soapbox/queries/ads.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ useAds; }
/* harmony export */ });
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tanstack/react-query */ 188);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var soapbox_features_ads_providers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! soapbox/features/ads/providers */ 1217);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/hooks */ 3);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



function useAds() {
    var _this = this;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_1__.useAppDispatch)();
    var getAds = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, dispatch(function (_, getState) { return __awaiter(_this, void 0, void 0, function () {
                    var provider;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0,soapbox_features_ads_providers__WEBPACK_IMPORTED_MODULE_0__.getProvider)(getState)];
                            case 1:
                                provider = _a.sent();
                                if (provider) {
                                    return [2 /*return*/, provider.getAds(getState)];
                                }
                                else {
                                    return [2 /*return*/, []];
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    }); };
    return (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.useQuery)(['ads'], getAds, {
        placeholderData: []
    });
}


/***/ }),

/***/ 942:
/*!*************************************************!*\
  !*** ./app/soapbox/utils/media_aspect_ratio.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNonConformingRatio": function() { return /* binding */ isNonConformingRatio; },
/* harmony export */   "isPanoramic": function() { return /* binding */ isPanoramic; },
/* harmony export */   "isPortrait": function() { return /* binding */ isPortrait; },
/* harmony export */   "maximumAspectRatio": function() { return /* binding */ maximumAspectRatio; },
/* harmony export */   "minimumAspectRatio": function() { return /* binding */ minimumAspectRatio; }
/* harmony export */ });
var minimumAspectRatio = 9 / 16; // Portrait phone
var maximumAspectRatio = 10; // Generous min-height
var isPanoramic = function (ar) {
    if (isNaN(ar))
        return false;
    return ar >= maximumAspectRatio;
};
var isPortrait = function (ar) {
    if (isNaN(ar))
        return false;
    return ar <= minimumAspectRatio;
};
var isNonConformingRatio = function (ar) {
    if (isNaN(ar))
        return false;
    return !isPanoramic(ar) && !isPortrait(ar);
};


/***/ }),

/***/ 1208:
/*!**************************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/arrow-bar-to-up.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/arrow-bar-to-up-91fc6f1c.svg";

/***/ }),

/***/ 1255:
/*!**************************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/arrows-maximize.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/arrows-maximize-012c1cbd.svg";

/***/ }),

/***/ 941:
/*!**************************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/arrows-minimize.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/arrows-minimize-1a697b51.svg";

/***/ }),

/***/ 817:
/*!********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/backspace.svg ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/backspace-1d4a1253.svg";

/***/ }),

/***/ 1457:
/*!*****************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/ballon.svg ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/ballon-370f0fd2.svg";

/***/ }),

/***/ 1227:
/*!***************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/book.svg ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/book-d783b6a9.svg";

/***/ }),

/***/ 938:
/*!*************************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/calendar-stats.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/calendar-stats-2b26c50b.svg";

/***/ }),

/***/ 816:
/*!********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/chart-bar.svg ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/chart-bar-f42ceb6b.svg";

/***/ }),

/***/ 935:
/*!***********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/cloud-upload.svg ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/cloud-upload-0e378aff.svg";

/***/ }),

/***/ 850:
/*!************************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/dots-vertical.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/dots-vertical-613fc3b7.svg";

/***/ }),

/***/ 1257:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/download.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/download-53a21bf0.svg";

/***/ }),

/***/ 1228:
/*!********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/file-code.svg ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/file-code-d3661284.svg";

/***/ }),

/***/ 1229:
/*!***************************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/file-spreadsheet.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/file-spreadsheet-acc2517d.svg";

/***/ }),

/***/ 1230:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/file-zip.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/file-zip-9c37034f.svg";

/***/ }),

/***/ 1212:
/*!**********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/info-circle.svg ***!
  \**********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/info-circle-6fcdabff.svg";

/***/ }),

/***/ 940:
/*!********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/lock-open.svg ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/lock-open-d051989b.svg";

/***/ }),

/***/ 1236:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/markdown.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/markdown-4e42d68a.svg";

/***/ }),

/***/ 1254:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/maximize.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/maximize-206b98ef.svg";

/***/ }),

/***/ 945:
/*!********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/photo-off.svg ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/photo-off-991b1537.svg";

/***/ }),

/***/ 743:
/*!****************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/photo.svg ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/photo-84fae838.svg";

/***/ }),

/***/ 744:
/*!***********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/player-pause.svg ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/player-pause-61c4336b.svg";

/***/ }),

/***/ 1231:
/*!***********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/presentation.svg ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/presentation-221efb34.svg";

/***/ }),

/***/ 1211:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/timeline.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/timeline-b5c128a2.svg";

/***/ }),

/***/ 745:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/volume-3.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/volume-3-1f98ef20.svg";

/***/ }),

/***/ 453:
/*!*****************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/volume.svg ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/volume-b7f6508a.svg";

/***/ }),

/***/ 1328:
/*!********************************************!*\
  !*** ./node_modules/iso-639-1/src/data.js ***!
  \********************************************/
/***/ (function(module) {

const LANGUAGES_LIST = {
  aa: {
    name: 'Afar',
    nativeName: 'Afaraf'
  },
  ab: {
    name: 'Abkhaz',
    nativeName: 'аҧсуа бызшәа'
  },
  ae: {
    name: 'Avestan',
    nativeName: 'avesta'
  },
  af: {
    name: 'Afrikaans',
    nativeName: 'Afrikaans'
  },
  ak: {
    name: 'Akan',
    nativeName: 'Akan'
  },
  am: {
    name: 'Amharic',
    nativeName: 'አማርኛ'
  },
  an: {
    name: 'Aragonese',
    nativeName: 'aragonés'
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية'
  },
  as: {
    name: 'Assamese',
    nativeName: 'অসমীয়া'
  },
  av: {
    name: 'Avaric',
    nativeName: 'авар мацӀ'
  },
  ay: {
    name: 'Aymara',
    nativeName: 'aymar aru'
  },
  az: {
    name: 'Azerbaijani',
    nativeName: 'azərbaycan dili'
  },
  ba: {
    name: 'Bashkir',
    nativeName: 'башҡорт теле'
  },
  be: {
    name: 'Belarusian',
    nativeName: 'беларуская мова'
  },
  bg: {
    name: 'Bulgarian',
    nativeName: 'български език'
  },
  bi: {
    name: 'Bislama',
    nativeName: 'Bislama'
  },
  bm: {
    name: 'Bambara',
    nativeName: 'bamanankan'
  },
  bn: {
    name: 'Bengali',
    nativeName: 'বাংলা'
  },
  bo: {
    name: 'Tibetan',
    nativeName: 'བོད་ཡིག'
  },
  br: {
    name: 'Breton',
    nativeName: 'brezhoneg'
  },
  bs: {
    name: 'Bosnian',
    nativeName: 'bosanski jezik'
  },
  ca: {
    name: 'Catalan',
    nativeName: 'Català'
  },
  ce: {
    name: 'Chechen',
    nativeName: 'нохчийн мотт'
  },
  ch: {
    name: 'Chamorro',
    nativeName: 'Chamoru'
  },
  co: {
    name: 'Corsican',
    nativeName: 'corsu'
  },
  cr: {
    name: 'Cree',
    nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ'
  },
  cs: {
    name: 'Czech',
    nativeName: 'čeština'
  },
  cu: {
    name: 'Old Church Slavonic',
    nativeName: 'ѩзыкъ словѣньскъ'
  },
  cv: {
    name: 'Chuvash',
    nativeName: 'чӑваш чӗлхи'
  },
  cy: {
    name: 'Welsh',
    nativeName: 'Cymraeg'
  },
  da: {
    name: 'Danish',
    nativeName: 'Dansk'
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch'
  },
  dv: {
    name: 'Divehi',
    nativeName: 'ދިވެހި'
  },
  dz: {
    name: 'Dzongkha',
    nativeName: 'རྫོང་ཁ'
  },
  ee: {
    name: 'Ewe',
    nativeName: 'Eʋegbe'
  },
  el: {
    name: 'Greek',
    nativeName: 'Ελληνικά'
  },
  en: {
    name: 'English',
    nativeName: 'English'
  },
  eo: {
    name: 'Esperanto',
    nativeName: 'Esperanto'
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español'
  },
  et: {
    name: 'Estonian',
    nativeName: 'eesti'
  },
  eu: {
    name: 'Basque',
    nativeName: 'euskara'
  },
  fa: {
    name: 'Persian',
    nativeName: 'فارسی'
  },
  ff: {
    name: 'Fula',
    nativeName: 'Fulfulde'
  },
  fi: {
    name: 'Finnish',
    nativeName: 'suomi'
  },
  fj: {
    name: 'Fijian',
    nativeName: 'vosa Vakaviti'
  },
  fo: {
    name: 'Faroese',
    nativeName: 'Føroyskt'
  },
  fr: {
    name: 'French',
    nativeName: 'Français'
  },
  fy: {
    name: 'Western Frisian',
    nativeName: 'Frysk'
  },
  ga: {
    name: 'Irish',
    nativeName: 'Gaeilge'
  },
  gd: {
    name: 'Scottish Gaelic',
    nativeName: 'Gàidhlig'
  },
  gl: {
    name: 'Galician',
    nativeName: 'galego'
  },
  gn: {
    name: 'Guaraní',
    nativeName: "Avañe'ẽ"
  },
  gu: {
    name: 'Gujarati',
    nativeName: 'ગુજરાતી'
  },
  gv: {
    name: 'Manx',
    nativeName: 'Gaelg'
  },
  ha: {
    name: 'Hausa',
    nativeName: 'هَوُسَ'
  },
  he: {
    name: 'Hebrew',
    nativeName: 'עברית'
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी'
  },
  ho: {
    name: 'Hiri Motu',
    nativeName: 'Hiri Motu'
  },
  hr: {
    name: 'Croatian',
    nativeName: 'Hrvatski'
  },
  ht: {
    name: 'Haitian',
    nativeName: 'Kreyòl ayisyen'
  },
  hu: {
    name: 'Hungarian',
    nativeName: 'magyar'
  },
  hy: {
    name: 'Armenian',
    nativeName: 'Հայերեն'
  },
  hz: {
    name: 'Herero',
    nativeName: 'Otjiherero'
  },
  ia: {
    name: 'Interlingua',
    nativeName: 'Interlingua'
  },
  id: {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia'
  },
  ie: {
    name: 'Interlingue',
    nativeName: 'Interlingue'
  },
  ig: {
    name: 'Igbo',
    nativeName: 'Asụsụ Igbo'
  },
  ii: {
    name: 'Nuosu',
    nativeName: 'ꆈꌠ꒿ Nuosuhxop'
  },
  ik: {
    name: 'Inupiaq',
    nativeName: 'Iñupiaq'
  },
  io: {
    name: 'Ido',
    nativeName: 'Ido'
  },
  is: {
    name: 'Icelandic',
    nativeName: 'Íslenska'
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano'
  },
  iu: {
    name: 'Inuktitut',
    nativeName: 'ᐃᓄᒃᑎᑐᑦ'
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語'
  },
  jv: {
    name: 'Javanese',
    nativeName: 'basa Jawa'
  },
  ka: {
    name: 'Georgian',
    nativeName: 'ქართული'
  },
  kg: {
    name: 'Kongo',
    nativeName: 'Kikongo'
  },
  ki: {
    name: 'Kikuyu',
    nativeName: 'Gĩkũyũ'
  },
  kj: {
    name: 'Kwanyama',
    nativeName: 'Kuanyama'
  },
  kk: {
    name: 'Kazakh',
    nativeName: 'қазақ тілі'
  },
  kl: {
    name: 'Kalaallisut',
    nativeName: 'kalaallisut'
  },
  km: {
    name: 'Khmer',
    nativeName: 'ខេមរភាសា'
  },
  kn: {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ'
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어'
  },
  kr: {
    name: 'Kanuri',
    nativeName: 'Kanuri'
  },
  ks: {
    name: 'Kashmiri',
    nativeName: 'कश्मीरी'
  },
  ku: {
    name: 'Kurdish',
    nativeName: 'Kurdî'
  },
  kv: {
    name: 'Komi',
    nativeName: 'коми кыв'
  },
  kw: {
    name: 'Cornish',
    nativeName: 'Kernewek'
  },
  ky: {
    name: 'Kyrgyz',
    nativeName: 'Кыргызча'
  },
  la: {
    name: 'Latin',
    nativeName: 'latine'
  },
  lb: {
    name: 'Luxembourgish',
    nativeName: 'Lëtzebuergesch'
  },
  lg: {
    name: 'Ganda',
    nativeName: 'Luganda'
  },
  li: {
    name: 'Limburgish',
    nativeName: 'Limburgs'
  },
  ln: {
    name: 'Lingala',
    nativeName: 'Lingála'
  },
  lo: {
    name: 'Lao',
    nativeName: 'ພາສາລາວ'
  },
  lt: {
    name: 'Lithuanian',
    nativeName: 'lietuvių kalba'
  },
  lu: {
    name: 'Luba-Katanga',
    nativeName: 'Kiluba'
  },
  lv: {
    name: 'Latvian',
    nativeName: 'latviešu valoda'
  },
  mg: {
    name: 'Malagasy',
    nativeName: 'fiteny malagasy'
  },
  mh: {
    name: 'Marshallese',
    nativeName: 'Kajin M̧ajeļ'
  },
  mi: {
    name: 'Māori',
    nativeName: 'te reo Māori'
  },
  mk: {
    name: 'Macedonian',
    nativeName: 'македонски јазик'
  },
  ml: {
    name: 'Malayalam',
    nativeName: 'മലയാളം'
  },
  mn: {
    name: 'Mongolian',
    nativeName: 'Монгол хэл'
  },
  mr: {
    name: 'Marathi',
    nativeName: 'मराठी'
  },
  ms: {
    name: 'Malay',
    nativeName: 'Bahasa Melayu'
  },
  mt: {
    name: 'Maltese',
    nativeName: 'Malti'
  },
  my: {
    name: 'Burmese',
    nativeName: 'ဗမာစာ'
  },
  na: {
    name: 'Nauru',
    nativeName: 'Dorerin Naoero'
  },
  nb: {
    name: 'Norwegian Bokmål',
    nativeName: 'Norsk bokmål'
  },
  nd: {
    name: 'Northern Ndebele',
    nativeName: 'isiNdebele'
  },
  ne: {
    name: 'Nepali',
    nativeName: 'नेपाली'
  },
  ng: {
    name: 'Ndonga',
    nativeName: 'Owambo'
  },
  nl: {
    name: 'Dutch',
    nativeName: 'Nederlands'
  },
  nn: {
    name: 'Norwegian Nynorsk',
    nativeName: 'Norsk nynorsk'
  },
  no: {
    name: 'Norwegian',
    nativeName: 'Norsk'
  },
  nr: {
    name: 'Southern Ndebele',
    nativeName: 'isiNdebele'
  },
  nv: {
    name: 'Navajo',
    nativeName: 'Diné bizaad'
  },
  ny: {
    name: 'Chichewa',
    nativeName: 'chiCheŵa'
  },
  oc: {
    name: 'Occitan',
    nativeName: 'occitan'
  },
  oj: {
    name: 'Ojibwe',
    nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ'
  },
  om: {
    name: 'Oromo',
    nativeName: 'Afaan Oromoo'
  },
  or: {
    name: 'Oriya',
    nativeName: 'ଓଡ଼ିଆ'
  },
  os: {
    name: 'Ossetian',
    nativeName: 'ирон æвзаг'
  },
  pa: {
    name: 'Panjabi',
    nativeName: 'ਪੰਜਾਬੀ'
  },
  pi: {
    name: 'Pāli',
    nativeName: 'पाऴि'
  },
  pl: {
    name: 'Polish',
    nativeName: 'Polski'
  },
  ps: {
    name: 'Pashto',
    nativeName: 'پښتو'
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português'
  },
  qu: {
    name: 'Quechua',
    nativeName: 'Runa Simi'
  },
  rm: {
    name: 'Romansh',
    nativeName: 'rumantsch grischun'
  },
  rn: {
    name: 'Kirundi',
    nativeName: 'Ikirundi'
  },
  ro: {
    name: 'Romanian',
    nativeName: 'Română'
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский'
  },
  rw: {
    name: 'Kinyarwanda',
    nativeName: 'Ikinyarwanda'
  },
  sa: {
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्'
  },
  sc: {
    name: 'Sardinian',
    nativeName: 'sardu'
  },
  sd: {
    name: 'Sindhi',
    nativeName: 'सिन्धी'
  },
  se: {
    name: 'Northern Sami',
    nativeName: 'Davvisámegiella'
  },
  sg: {
    name: 'Sango',
    nativeName: 'yângâ tî sängö'
  },
  si: {
    name: 'Sinhala',
    nativeName: 'සිංහල'
  },
  sk: {
    name: 'Slovak',
    nativeName: 'slovenčina'
  },
  sl: {
    name: 'Slovenian',
    nativeName: 'slovenščina'
  },
  sm: {
    name: 'Samoan',
    nativeName: "gagana fa'a Samoa"
  },
  sn: {
    name: 'Shona',
    nativeName: 'chiShona'
  },
  so: {
    name: 'Somali',
    nativeName: 'Soomaaliga'
  },
  sq: {
    name: 'Albanian',
    nativeName: 'Shqip'
  },
  sr: {
    name: 'Serbian',
    nativeName: 'српски језик'
  },
  ss: {
    name: 'Swati',
    nativeName: 'SiSwati'
  },
  st: {
    name: 'Southern Sotho',
    nativeName: 'Sesotho'
  },
  su: {
    name: 'Sundanese',
    nativeName: 'Basa Sunda'
  },
  sv: {
    name: 'Swedish',
    nativeName: 'Svenska'
  },
  sw: {
    name: 'Swahili',
    nativeName: 'Kiswahili'
  },
  ta: {
    name: 'Tamil',
    nativeName: 'தமிழ்'
  },
  te: {
    name: 'Telugu',
    nativeName: 'తెలుగు'
  },
  tg: {
    name: 'Tajik',
    nativeName: 'тоҷикӣ'
  },
  th: {
    name: 'Thai',
    nativeName: 'ไทย'
  },
  ti: {
    name: 'Tigrinya',
    nativeName: 'ትግርኛ'
  },
  tk: {
    name: 'Turkmen',
    nativeName: 'Türkmençe'
  },
  tl: {
    name: 'Tagalog',
    nativeName: 'Wikang Tagalog'
  },
  tn: {
    name: 'Tswana',
    nativeName: 'Setswana'
  },
  to: {
    name: 'Tonga',
    nativeName: 'faka Tonga'
  },
  tr: {
    name: 'Turkish',
    nativeName: 'Türkçe'
  },
  ts: {
    name: 'Tsonga',
    nativeName: 'Xitsonga'
  },
  tt: {
    name: 'Tatar',
    nativeName: 'татар теле'
  },
  tw: {
    name: 'Twi',
    nativeName: 'Twi'
  },
  ty: {
    name: 'Tahitian',
    nativeName: 'Reo Tahiti'
  },
  ug: {
    name: 'Uyghur',
    nativeName: 'ئۇيغۇرچە‎'
  },
  uk: {
    name: 'Ukrainian',
    nativeName: 'Українська'
  },
  ur: {
    name: 'Urdu',
    nativeName: 'اردو'
  },
  uz: {
    name: 'Uzbek',
    nativeName: 'Ўзбек'
  },
  ve: {
    name: 'Venda',
    nativeName: 'Tshivenḓa'
  },
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt'
  },
  vo: {
    name: 'Volapük',
    nativeName: 'Volapük'
  },
  wa: {
    name: 'Walloon',
    nativeName: 'walon'
  },
  wo: {
    name: 'Wolof',
    nativeName: 'Wollof'
  },
  xh: {
    name: 'Xhosa',
    nativeName: 'isiXhosa'
  },
  yi: {
    name: 'Yiddish',
    nativeName: 'ייִדיש'
  },
  yo: {
    name: 'Yoruba',
    nativeName: 'Yorùbá'
  },
  za: {
    name: 'Zhuang',
    nativeName: 'Saɯ cueŋƅ'
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文'
  },
  zu: {
    name: 'Zulu',
    nativeName: 'isiZulu'
  }
};
module.exports = LANGUAGES_LIST;

/***/ }),

/***/ 741:
/*!*********************************************!*\
  !*** ./node_modules/iso-639-1/src/index.js ***!
  \*********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const LANGUAGES_LIST = __webpack_require__(/*! ./data.js */ 1328);

const LANGUAGES = {};
const LANGUAGES_BY_NAME = {};
const LANGUAGE_CODES = [];
const LANGUAGE_NAMES = [];
const LANGUAGE_NATIVE_NAMES = [];

for (const code in LANGUAGES_LIST) {
  const {
    name,
    nativeName
  } = LANGUAGES_LIST[code];
  LANGUAGES[code] = LANGUAGES_BY_NAME[name.toLowerCase()] = LANGUAGES_BY_NAME[nativeName.toLowerCase()] = {
    code,
    name,
    nativeName
  };
  LANGUAGE_CODES.push(code);
  LANGUAGE_NAMES.push(name);
  LANGUAGE_NATIVE_NAMES.push(nativeName);
}

module.exports = class ISO6391 {
  static getLanguages() {
    let codes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return codes.map(code => ISO6391.validate(code) ? Object.assign({}, LANGUAGES[code]) : {
      code,
      name: '',
      nativeName: ''
    });
  }

  static getName(code) {
    return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : '';
  }

  static getAllNames() {
    return LANGUAGE_NAMES.slice();
  }

  static getNativeName(code) {
    return ISO6391.validate(code) ? LANGUAGES_LIST[code].nativeName : '';
  }

  static getAllNativeNames() {
    return LANGUAGE_NATIVE_NAMES.slice();
  }

  static getCode(name) {
    name = name.toLowerCase();
    return LANGUAGES_BY_NAME.hasOwnProperty(name) ? LANGUAGES_BY_NAME[name].code : '';
  }

  static getAllCodes() {
    return LANGUAGE_CODES.slice();
  }

  static validate(code) {
    return LANGUAGES_LIST.hasOwnProperty(code);
  }

};

/***/ }),

/***/ 1220:
/*!*************************************************************************************************!*\
  !*** ./node_modules/react-textarea-autosize/node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \*************************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _extends; }
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
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

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ 1221:
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/react-textarea-autosize/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \**********************************************************************************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ _objectWithoutPropertiesLoose; }
/* harmony export */ });
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		var getProto = Object.getPrototypeOf ? function(obj) { return Object.getPrototypeOf(obj); } : function(obj) { return obj.__proto__; };
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(function(key) { def[key] = function() { return value[key]; }; });
/******/ 			}
/******/ 			def['default'] = function() { return value; };
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "packs/js/" + ({"2":"base_polyfills","3":"date_picker","4":"error","5":"extra_polyfills","6":"features/account_gallery","7":"features/account_timeline","8":"features/admin","9":"features/admin/moderation_log","10":"features/admin/user_index","11":"features/ads/rumble","12":"features/ads/soapbox","13":"features/aliases","14":"features/announcements","15":"features/auth_login","16":"features/auth_token_list","17":"features/backups","18":"features/blocks","19":"features/bookmarks","20":"features/chats","21":"features/chats/chat_room","22":"features/chats/components/chat_panes","23":"features/community_timeline","24":"features/compose","25":"features/conversations","26":"features/crypto_donate","27":"features/delete_account","28":"features/developers","29":"features/direct_timeline","30":"features/directory","31":"features/domain_blocks","32":"features/edit_email","33":"features/edit_password","34":"features/edit_profile","35":"features/email_confirmation","36":"features/export_data","37":"features/external_login","38":"features/favourited_statuses","39":"features/federation_restrictions","40":"features/filters","41":"features/follow-recommendations","42":"features/follow_recommendations","43":"features/follow_requests","44":"features/followers","45":"features/following","46":"features/generic_not_found","47":"features/groups/index","48":"features/groups/timeline","49":"features/hashtag_timeline","50":"features/home_timeline","51":"features/import_data","52":"features/list_adder","53":"features/list_editor","54":"features/list_timeline","55":"features/lists","56":"features/migration","57":"features/mutes","58":"features/new_status","59":"features/notifications","60":"features/onboarding","61":"features/pinned_accounts","62":"features/pinned_statuses","63":"features/public_timeline","64":"features/remote_timeline","65":"features/scheduled_statuses","66":"features/search","67":"features/security/mfa_form","68":"features/server_info","69":"features/settings","70":"features/share","71":"features/soapbox_config","72":"features/status","73":"features/test_timeline","74":"features/trends","75":"features/ui","76":"features/ui/modals/landing-page-modal","77":"features/verification","78":"locale_ar-json","79":"locale_ast-json","80":"locale_bg-json","81":"locale_bn-json","82":"locale_br-json","83":"locale_ca-json","84":"locale_co-json","85":"locale_cs-json","86":"locale_cy-json","87":"locale_da-json","88":"locale_de-json","89":"locale_defaultMessages-json","90":"locale_el-json","91":"locale_en-Shaw-json","92":"locale_en-json","93":"locale_eo-json","94":"locale_es-AR-json","95":"locale_es-json","96":"locale_et-json","97":"locale_eu-json","98":"locale_fa-json","99":"locale_fi-json","100":"locale_fr-json","101":"locale_ga-json","102":"locale_gl-json","103":"locale_he-json","104":"locale_hi-json","105":"locale_hr-json","106":"locale_hu-json","107":"locale_hy-json","108":"locale_id-json","109":"locale_io-json","110":"locale_is-json","111":"locale_it-json","112":"locale_ja-json","113":"locale_ka-json","114":"locale_kk-json","115":"locale_ko-json","116":"locale_lt-json","117":"locale_lv-json","118":"locale_mk-json","119":"locale_ms-json","120":"locale_nl-json","121":"locale_nn-json","122":"locale_no-json","123":"locale_oc-json","124":"locale_pl-json","125":"locale_pt-BR-json","126":"locale_pt-json","127":"locale_ro-json","128":"locale_ru-json","129":"locale_sk-json","130":"locale_sl-json","131":"locale_sq-json","132":"locale_sr-Latn-json","133":"locale_sr-json","134":"locale_sv-json","135":"locale_ta-json","136":"locale_te-json","137":"locale_th-json","138":"locale_tr-json","139":"locale_uk-json","140":"locale_whitelist_ar-json","141":"locale_whitelist_ast-json","142":"locale_whitelist_bg-json","143":"locale_whitelist_bn-json","144":"locale_whitelist_br-json","145":"locale_whitelist_ca-json","146":"locale_whitelist_co-json","147":"locale_whitelist_cs-json","148":"locale_whitelist_cy-json","149":"locale_whitelist_da-json","150":"locale_whitelist_de-json","151":"locale_whitelist_el-json","152":"locale_whitelist_en-Shaw-json","153":"locale_whitelist_en-json","154":"locale_whitelist_eo-json","155":"locale_whitelist_es-AR-json","156":"locale_whitelist_es-json","157":"locale_whitelist_et-json","158":"locale_whitelist_eu-json","159":"locale_whitelist_fa-json","160":"locale_whitelist_fi-json","161":"locale_whitelist_fr-json","162":"locale_whitelist_ga-json","163":"locale_whitelist_gl-json","164":"locale_whitelist_he-json","165":"locale_whitelist_hi-json","166":"locale_whitelist_hr-json","167":"locale_whitelist_hu-json","168":"locale_whitelist_hy-json","169":"locale_whitelist_id-json","170":"locale_whitelist_io-json","171":"locale_whitelist_is-json","172":"locale_whitelist_it-json","173":"locale_whitelist_ja-json","174":"locale_whitelist_ka-json","175":"locale_whitelist_kk-json","176":"locale_whitelist_ko-json","177":"locale_whitelist_lt-json","178":"locale_whitelist_lv-json","179":"locale_whitelist_mk-json","180":"locale_whitelist_ms-json","181":"locale_whitelist_nl-json","182":"locale_whitelist_nn-json","183":"locale_whitelist_no-json","184":"locale_whitelist_oc-json","185":"locale_whitelist_pl-json","186":"locale_whitelist_pt-BR-json","187":"locale_whitelist_pt-json","188":"locale_whitelist_ro-json","189":"locale_whitelist_ru-json","190":"locale_whitelist_sk-json","191":"locale_whitelist_sl-json","192":"locale_whitelist_sq-json","193":"locale_whitelist_sr-Latn-json","194":"locale_whitelist_sr-json","195":"locale_whitelist_sv-json","196":"locale_whitelist_ta-json","197":"locale_whitelist_te-json","198":"locale_whitelist_th-json","199":"locale_whitelist_tr-json","200":"locale_whitelist_uk-json","201":"locale_whitelist_zh-CN-json","202":"locale_whitelist_zh-HK-json","203":"locale_whitelist_zh-TW-json","204":"locale_zh-CN-json","205":"locale_zh-HK-json","206":"locale_zh-TW-json","207":"modals/compare_history_modal","208":"modals/embed_modal","209":"modals/familiar_followers_modal","210":"modals/mute_modal","211":"modals/report-modal/report-modal","212":"status/media_gallery"}[chunkId] || chunkId) + "-" + {"2":"bb8ed5476c2312968eb3","3":"819e6e6008b21cd642b7","4":"4f68da560dee9f4d96c6","5":"e65ad1ece4417222d28c","6":"a86350022348824517f0","7":"d9906c45e1e10ddf472d","8":"1fc6bbafeb58a7119af2","9":"6081bcd9f143f02a8ccb","10":"e81e24db57f1310c0c35","11":"58b63f5d81dda37d0041","12":"8703a73c476c1ebb3285","13":"9525afeddb25c6e81117","14":"bbaadcbdaac9fc15bd3f","15":"f99b46dd5aa919f78c12","16":"31f5a5bab9f18d828b28","17":"b2a5a028f376128119e0","18":"52a7cb2815fe888ae554","19":"aca080a39ccc9833b75e","20":"7ddc34bf4bf11a05a4cc","21":"0b3ba6bf0ab97f9ae511","22":"fd5b9a8adf6206cdc65d","23":"56fccd9e5573d770109b","24":"c016cf4538f4e572fd8d","25":"4515a2320befc3851c0d","26":"05821ead0207e11ce38e","27":"09bf9e3be0225fd21f38","28":"04916a621d054ef2bfbc","29":"f335f3c97aa32fa87c7b","30":"e13dcdea4625a0c5ebf7","31":"6d30d874d0b90728231d","32":"b4e66dd416c48f926812","33":"ccd0660b8593a1719d56","34":"b7aa663f1a536b113b5f","35":"db21121b60675739062c","36":"bfa55bd8df6ec7e2d919","37":"f820fbd5a79b25e61a16","38":"98a039f1721103190c35","39":"8f4d2d2040c68d34dd41","40":"7999d9fe2a74dd16b084","41":"41047a1c26c8bce82c6f","42":"289155ab4d89d71c4ea7","43":"7fb4e70aefdb32826b2b","44":"23dac582217d8080727f","45":"d6c8597278b5391cb3c2","46":"2523bf3dd5d33f604ef3","47":"3b3bcbdf53af7b106288","48":"4e4ecf31ee8d492173d4","49":"00b1f4fd5930a8a655c7","50":"42ac2209c28ac3faaf21","51":"d4acd90a80ea470c45fe","52":"f5ba7bdf0ba885648c4b","53":"4b02cc645eba9bb5e77e","54":"36fd340c530114e10bb7","55":"c8a3846107670f662456","56":"be83afd3539d5e5fbf5d","57":"88e1bd01e74f865212e1","58":"15136c67be29247298b8","59":"141e04ecc253f0eb0e0b","60":"dcb9587c7e84b18ea1c4","61":"15d4e4b73996ae48d09c","62":"5901d0cee62edc2ce434","63":"5a3c536616641f36f53d","64":"52ff7dad0d8190e0f830","65":"2573b795d30fa4ef78db","66":"82e3f00ac4171cbb5be7","67":"987cae5d8a754cd3b9d3","68":"847fbc8c3278f9e60828","69":"f29fd075e45cc026b0e7","70":"e79f36cf6a84db2cfb8a","71":"7f5a7f84c45177e2fd2f","72":"e1ad5b74baafff2358f5","73":"bec8021855deda037941","74":"7a3aff4abd85247cfd4f","75":"52b028dbe4bc3324d0c3","76":"8a5efa92de7891254d40","77":"d32e14e80de1faf6f660","78":"c96721a3a5a476d839df","79":"f14efc450bdffe85a13c","80":"741b7ef1ff936b26a51a","81":"eada7ccb505e99786c63","82":"861899a45eaf9651f040","83":"4b1ff5346a92b53f12f4","84":"ed168435d45fb6b68c68","85":"bf7052b61b179c31c55c","86":"7ff2427d4cf8883a5f45","87":"516058c8e0624cefc7c3","88":"5712dcbd3f74dc5410a6","89":"3c39942ebce477b45895","90":"ec556228fb3d1db8cca4","91":"2a3c42c16087eb0b592b","92":"0c507cc743d517579410","93":"698660028fad5769acfa","94":"5dd8cf94e980809d497a","95":"4d7476a866c925c1247d","96":"df217a8e0cf1c84ebaec","97":"a4b25b63b8b3a44e46d7","98":"8a4ca2b9e5ab78a1f7db","99":"fd9370f075400136ea9a","100":"71c70262c14bd471b59f","101":"3c9c9d96b0036b71978d","102":"fa5a79e44f840aef251e","103":"64ff98eb06e4712fa607","104":"2c5f0b5ca2045df7dcac","105":"a7afbcc6580d65f4bf17","106":"52836d746ac359e3ac1e","107":"c008a1332aa9e25e3bf2","108":"9337cd2d661be3c37a7a","109":"52ca34033512081fcba2","110":"c55b3da3baf445601cd2","111":"d280f061013712f58ffa","112":"1002a8ce02a00d2365b2","113":"eedb6f2ec81c982d82df","114":"bb201ceb42c8ccac9f00","115":"1b2a2ebdefb792297260","116":"1202e8a94f66f3d3127b","117":"5be600588f6410143a88","118":"6c49322dd7e22d77e657","119":"9a8049fa788efc919c70","120":"7ced75e61e7c7b653218","121":"2cb754914b42472c261f","122":"9b9811ad95d93ded3326","123":"9e16074b4f9701da1cfc","124":"9e8fd004b1601854cac7","125":"5f1f2e0f14faef69e871","126":"db885028dff711cd4432","127":"77b008730f0608a42fab","128":"19ad5774b9792fab36ca","129":"181f34ddf85c2babf771","130":"ba88f93f17f7f536a392","131":"ec751227a687610675e6","132":"aad31097d44e128bd7cd","133":"c20dd8aa94590c572137","134":"dfff1049e2f2f073d467","135":"f83212bf7b9527e2dd77","136":"b1e86760eb0fb182185d","137":"0d3778f54978ed615c7c","138":"84f991b298f4045194c6","139":"8062950ce03273dda22b","140":"30982a350d732f461387","141":"978acf2ae97ac9c60255","142":"cd86b0830e3bb198593d","143":"166f2d004316611c6e6f","144":"85640ef4383515a9472a","145":"1c89d100837c00a06052","146":"be4234393f9ba818690f","147":"fa06e1437d87899bc758","148":"38349b47f8a7bb8de330","149":"e1c4f5a0245020d4d87e","150":"ae4f2c40ae124230b824","151":"b1d89fbf9f4c81a879c4","152":"e59a3fbe2dcfbe4066d3","153":"baf24eb6d87ed8ed0931","154":"ee2be91f628d8e3f7285","155":"07fae3b9cd5a7c2ae5bf","156":"771f19af2b2d589edeb2","157":"42928ef96db96d67a776","158":"195721aaaaffc43c41ad","159":"c3834a084cc69f108af7","160":"c86c58b5a40476eef422","161":"e31ce2e10b5a6c53e583","162":"933764b928d09d3b6896","163":"0fe42eb51331bba26a08","164":"07377fef3a28e0261e42","165":"ce8d5bf59d5f86465490","166":"e840c530982148d48ede","167":"2fc82de7a4286c416d45","168":"38bc510843efb87786bb","169":"b1b4a8fa187a269d1119","170":"91fed0481379a413dacf","171":"a8a9e739a7ca1d1fc81c","172":"4add7aa306b526e820d7","173":"40d3affc08444eb4f9c6","174":"dcbd7a6ebc3177b5fbe9","175":"82be19d1a2f936fa58b1","176":"0e85e754796f4da912da","177":"94305e4b8606463adbda","178":"2c79e6d9c1850deace60","179":"01e7039ab67f576cb501","180":"2b878ef0812e9564cc2f","181":"ca90c59c11c0c4069a4c","182":"df75906593c9d505fb8a","183":"183e267f9a7b7830e3fa","184":"2f308d01ce6fbdd5aa4e","185":"6c76b57c8e504c9133b8","186":"4350884848a246f1767c","187":"073b61796775a4b20462","188":"11eb1fef37eb832cf413","189":"e3bae2613e955218dbec","190":"a8b93067db3316751582","191":"955432a5508bce9408c2","192":"05a80808f99516bfd747","193":"d045790a3eb0b2fa62c7","194":"ed6fd36f9e55ce22c9b6","195":"9748b62b22ec93210354","196":"37b037438f23cd1b25cb","197":"2932ae353b18bc2d2510","198":"2bd774f28bdded06ef6e","199":"621d75ef03c8d40b0217","200":"ce30d34ab1f25eae3f4c","201":"31109dc187edd2da0f9c","202":"2abe937d07bfc7cc3620","203":"5d1616c25239cfcd9023","204":"d16438a43d71498be93f","205":"dd21518522f72a55133e","206":"9e9a991db09f62ab8e5f","207":"5d3ee523b283ed44a2d0","208":"8bfd1f4e49aad553eb17","209":"5f70d9be99165fc50879","210":"86c34f3e02b4093e0f97","211":"83a33914fe068cdd9c1d","212":"2105e05f93ee80cbb84f","213":"483ba567ef2e6a169a01"}[chunkId] + ".chunk.js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	!function() {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "mangane-fe:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = function(url, done, key, chunkId) {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = function(prev, event) {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach(function(fn) { return fn(event); });
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/Mangane/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			0: 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = function(chunkId, promises) {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise(function(resolve, reject) { installedChunkData = installedChunks[chunkId] = [resolve, reject]; });
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = function(event) {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	
/******/ })()
;
//# sourceMappingURL=common-54cec5c4e69639857c77.js.map