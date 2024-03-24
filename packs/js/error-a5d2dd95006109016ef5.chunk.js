(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[4],{

/***/ 1273:
/*!****************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/client.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BrowserClient": function() { return /* binding */ BrowserClient; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 2850);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/core */ 1482);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/core */ 95);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @sentry/core */ 2852);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @sentry/utils */ 2863);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @sentry/utils */ 2851);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @sentry/utils */ 2848);
/* harmony import */ var _eventbuilder_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventbuilder.js */ 2859);
/* harmony import */ var _integrations_breadcrumbs_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./integrations/breadcrumbs.js */ 836);
/* harmony import */ var _transports_utils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./transports/utils.js */ 2864);





var globalObject = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
/**
 * The Sentry Browser SDK Client.
 *
 * @see BrowserOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */

class BrowserClient extends _sentry_core__WEBPACK_IMPORTED_MODULE_1__.BaseClient {
  /**
   * Creates a new Browser SDK instance.
   *
   * @param options Configuration options for this SDK.
   */
  constructor(options) {
    options._metadata = options._metadata || {};
    options._metadata.sdk = options._metadata.sdk || {
      name: 'sentry.javascript.browser',
      packages: [{
        name: 'npm:@sentry/browser',
        version: _sentry_core__WEBPACK_IMPORTED_MODULE_2__.SDK_VERSION
      }],
      version: _sentry_core__WEBPACK_IMPORTED_MODULE_2__.SDK_VERSION
    };
    super(options);

    if (options.sendClientReports && globalObject.document) {
      globalObject.document.addEventListener('visibilitychange', () => {
        if (globalObject.document.visibilityState === 'hidden') {
          this._flushOutcomes();
        }
      });
    }
  }
  /**
   * @inheritDoc
   */


  eventFromException(exception, hint) {
    return (0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_3__.eventFromException)(this._options.stackParser, exception, hint, this._options.attachStacktrace);
  }
  /**
   * @inheritDoc
   */


  eventFromMessage(message) {
    let level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
    let hint = arguments.length > 2 ? arguments[2] : undefined;
    return (0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_3__.eventFromMessage)(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
  }
  /**
   * @inheritDoc
   */


  sendEvent(event, hint) {
    // We only want to add the sentry event breadcrumb when the user has the breadcrumb integration installed and
    // activated its `sentry` option.
    // We also do not want to use the `Breadcrumbs` class here directly, because we do not want it to be included in
    // bundles, if it is not used by the SDK.
    // This all sadly is a bit ugly, but we currently don't have a "pre-send" hook on the integrations so we do it this
    // way for now.
    var breadcrumbIntegration = this.getIntegrationById(_integrations_breadcrumbs_js__WEBPACK_IMPORTED_MODULE_4__.BREADCRUMB_INTEGRATION_ID);

    if (breadcrumbIntegration && // We check for definedness of `options`, even though it is not strictly necessary, because that access to
    // `.sentry` below does not throw, in case users provided their own integration with id "Breadcrumbs" that does
    // not have an`options` field
    breadcrumbIntegration.options && breadcrumbIntegration.options.sentry) {
      (0,_sentry_core__WEBPACK_IMPORTED_MODULE_5__.getCurrentHub)().addBreadcrumb({
        category: "sentry.".concat(event.type === 'transaction' ? 'transaction' : 'event'),
        event_id: event.event_id,
        level: event.level,
        message: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.getEventDescription)(event)
      }, {
        event
      });
    }

    super.sendEvent(event, hint);
  }
  /**
   * @inheritDoc
   */


  _prepareEvent(event, hint, scope) {
    event.platform = event.platform || 'javascript';
    return super._prepareEvent(event, hint, scope);
  }
  /**
   * Sends client reports as an envelope.
   */


  _flushOutcomes() {
    var outcomes = this._clearOutcomes();

    if (outcomes.length === 0) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_7__.logger.log('No outcomes to send');
      return;
    }

    if (!this._dsn) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_7__.logger.log('No dsn provided, will not send outcomes');
      return;
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_7__.logger.log('Sending outcomes:', outcomes);
    var url = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_8__.getEnvelopeEndpointWithUrlEncodedAuth)(this._dsn, this._options.tunnel);
    var envelope = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.createClientReportEnvelope)(outcomes, this._options.tunnel && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_10__.dsnToString)(this._dsn));

    try {
      (0,_transports_utils_js__WEBPACK_IMPORTED_MODULE_11__.sendReport)(url, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.serializeEnvelope)(envelope));
    } catch (e) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_7__.logger.error(e);
    }
  }

}



/***/ }),

/***/ 2859:
/*!**********************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/eventbuilder.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eventFromError": function() { return /* binding */ eventFromError; },
/* harmony export */   "eventFromException": function() { return /* binding */ eventFromException; },
/* harmony export */   "eventFromMessage": function() { return /* binding */ eventFromMessage; },
/* harmony export */   "eventFromPlainObject": function() { return /* binding */ eventFromPlainObject; },
/* harmony export */   "eventFromString": function() { return /* binding */ eventFromString; },
/* harmony export */   "eventFromUnknownInput": function() { return /* binding */ eventFromUnknownInput; },
/* harmony export */   "exceptionFromError": function() { return /* binding */ exceptionFromError; },
/* harmony export */   "parseStackFrames": function() { return /* binding */ parseStackFrames; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2838);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2856);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2844);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/**
 * This function creates an exception from a JavaScript Error
 */

function exceptionFromError(stackParser, ex) {
  // Get the frames first since Opera can lose the stack if we touch anything else first
  var frames = parseStackFrames(stackParser, ex);
  var exception = {
    type: ex && ex.name,
    value: extractMessage(ex)
  };

  if (frames.length) {
    exception.stacktrace = {
      frames
    };
  }

  if (exception.type === undefined && exception.value === '') {
    exception.value = 'Unrecoverable error caught';
  }

  return exception;
}
/**
 * @hidden
 */


function eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection) {
  var event = {
    exception: {
      values: [{
        type: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isEvent)(exception) ? exception.constructor.name : isUnhandledRejection ? 'UnhandledRejection' : 'Error',
        value: "Non-Error ".concat(isUnhandledRejection ? 'promise rejection' : 'exception', " captured with keys: ").concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.extractExceptionKeysForMessage)(exception))
      }]
    },
    extra: {
      __serialized__: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.normalizeToSize)(exception)
    }
  };

  if (syntheticException) {
    var frames = parseStackFrames(stackParser, syntheticException);

    if (frames.length) {
      // event.exception.values[0] has been set above
      event.exception.values[0].stacktrace = {
        frames
      };
    }
  }

  return event;
}
/**
 * @hidden
 */


function eventFromError(stackParser, ex) {
  return {
    exception: {
      values: [exceptionFromError(stackParser, ex)]
    }
  };
}
/** Parses stack frames from an error */


function parseStackFrames(stackParser, ex) {
  // Access and store the stacktrace property before doing ANYTHING
  // else to it because Opera is not very good at providing it
  // reliably in other circumstances.
  var stacktrace = ex.stacktrace || ex.stack || '';
  var popSize = getPopSize(ex);

  try {
    return stackParser(stacktrace, popSize);
  } catch (e) {// no-empty
  }

  return [];
} // Based on our own mapping pattern - https://github.com/getsentry/sentry/blob/9f08305e09866c8bd6d0c24f5b0aabdd7dd6c59c/src/sentry/lang/javascript/errormapping.py#L83-L108


var reactMinifiedRegexp = /Minified React error #\d+;/i;

function getPopSize(ex) {
  if (ex) {
    if (typeof ex.framesToPop === 'number') {
      return ex.framesToPop;
    }

    if (reactMinifiedRegexp.test(ex.message)) {
      return 1;
    }
  }

  return 0;
}
/**
 * There are cases where stacktrace.message is an Event object
 * https://github.com/getsentry/sentry-javascript/issues/1949
 * In this specific case we try to extract stacktrace.message.error.message
 */


function extractMessage(ex) {
  var message = ex && ex.message;

  if (!message) {
    return 'No error message';
  }

  if (message.error && typeof message.error.message === 'string') {
    return message.error.message;
  }

  return message;
}
/**
 * Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
 * @hidden
 */


function eventFromException(stackParser, exception, hint, attachStacktrace) {
  var syntheticException = hint && hint.syntheticException || undefined;
  var event = eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace);
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.addExceptionMechanism)(event); // defaults to { type: 'generic', handled: true }

  event.level = 'error';

  if (hint && hint.event_id) {
    event.event_id = hint.event_id;
  }

  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.resolvedSyncPromise)(event);
}
/**
 * Builds and Event from a Message
 * @hidden
 */


function eventFromMessage(stackParser, message) {
  let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'info';
  let hint = arguments.length > 3 ? arguments[3] : undefined;
  let attachStacktrace = arguments.length > 4 ? arguments[4] : undefined;
  var syntheticException = hint && hint.syntheticException || undefined;
  var event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
  event.level = level;

  if (hint && hint.event_id) {
    event.event_id = hint.event_id;
  }

  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.resolvedSyncPromise)(event);
}
/**
 * @hidden
 */


function eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
  let event;

  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isErrorEvent)(exception) && exception.error) {
    // If it is an ErrorEvent with `error` property, extract it to get actual Error
    var errorEvent = exception;
    return eventFromError(stackParser, errorEvent.error);
  } // If it is a `DOMError` (which is a legacy API, but still supported in some browsers) then we just extract the name
  // and message, as it doesn't provide anything else. According to the spec, all `DOMExceptions` should also be
  // `Error`s, but that's not the case in IE11, so in that case we treat it the same as we do a `DOMError`.
  //
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMError
  // https://developer.mozilla.org/en-US/docs/Web/API/DOMException
  // https://webidl.spec.whatwg.org/#es-DOMException-specialness


  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMError)(exception) || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMException)(exception)) {
    var domException = exception;

    if ('stack' in exception) {
      event = eventFromError(stackParser, exception);
    } else {
      var name = domException.name || ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isDOMError)(domException) ? 'DOMError' : 'DOMException');
      var message = domException.message ? "".concat(name, ": ").concat(domException.message) : name;
      event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.addExceptionTypeValue)(event, message);
    }

    if ('code' in domException) {
      event.tags = _objectSpread(_objectSpread({}, event.tags), {}, {
        'DOMException.code': "".concat(domException.code)
      });
    }

    return event;
  }

  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isError)(exception)) {
    // we have a real Error object, do nothing
    return eventFromError(stackParser, exception);
  }

  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(exception) || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isEvent)(exception)) {
    // If it's a plain object or an instance of `Event` (the built-in JS kind, not this SDK's `Event` type), serialize
    // it manually. This will allow us to group events based on top-level keys which is much better than creating a new
    // group on any key/value change.
    var objectException = exception;
    event = eventFromPlainObject(stackParser, objectException, syntheticException, isUnhandledRejection);
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.addExceptionMechanism)(event, {
      synthetic: true
    });
    return event;
  } // If none of previous checks were valid, then it means that it's not:
  // - an instance of DOMError
  // - an instance of DOMException
  // - an instance of Event
  // - an instance of Error
  // - a valid ErrorEvent (one with an error property)
  // - a plain Object
  //
  // So bail out and capture it as a simple message:


  event = eventFromString(stackParser, exception, syntheticException, attachStacktrace);
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.addExceptionTypeValue)(event, "".concat(exception), undefined);
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.addExceptionMechanism)(event, {
    synthetic: true
  });
  return event;
}
/**
 * @hidden
 */


function eventFromString(stackParser, input, syntheticException, attachStacktrace) {
  var event = {
    message: input
  };

  if (attachStacktrace && syntheticException) {
    var frames = parseStackFrames(stackParser, syntheticException);

    if (frames.length) {
      event.exception = {
        values: [{
          value: input,
          stacktrace: {
            frames
          }
        }]
      };
    }
  }

  return event;
}



/***/ }),

/***/ 2865:
/*!*****************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/helpers.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ignoreNextOnError": function() { return /* binding */ ignoreNextOnError; },
/* harmony export */   "shouldIgnoreOnError": function() { return /* binding */ shouldIgnoreOnError; },
/* harmony export */   "wrap": function() { return /* binding */ wrap; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 45);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 813);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



let ignoreOnError = 0;
/**
 * @hidden
 */

function shouldIgnoreOnError() {
  return ignoreOnError > 0;
}
/**
 * @hidden
 */


function ignoreNextOnError() {
  // onerror should trigger before setTimeout
  ignoreOnError += 1;
  setTimeout(() => {
    ignoreOnError -= 1;
  });
}
/**
 * Instruments the given function and sends an event to Sentry every time the
 * function throws an exception.
 *
 * @param fn A function to wrap. It is generally safe to pass an unbound function, because the returned wrapper always
 * has a correct `this` context.
 * @returns The wrapped function.
 * @hidden
 */


function wrap(fn) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let before = arguments.length > 2 ? arguments[2] : undefined;

  // for future readers what this does is wrap a function and then create
  // a bi-directional wrapping between them.
  //
  // example: wrapped = wrap(original);
  //  original.__sentry_wrapped__ -> wrapped
  //  wrapped.__sentry_original__ -> original
  if (typeof fn !== 'function') {
    return fn;
  }

  try {
    // if we're dealing with a function that was previously wrapped, return
    // the original wrapper.
    var wrapper = fn.__sentry_wrapped__;

    if (wrapper) {
      return wrapper;
    } // We don't wanna wrap it twice


    if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getOriginalFunction)(fn)) {
      return fn;
    }
  } catch (e) {
    // Just accessing custom props in some Selenium environments
    // can cause a "Permission denied" exception (see raven-js#495).
    // Bail on wrapping and return the function as-is (defers to window.onerror).
    return fn;
  } // It is important that `sentryWrapped` is not an arrow function to preserve the context of `this`


  var sentryWrapped = function () {
    var args = Array.prototype.slice.call(arguments);

    try {
      if (before && typeof before === 'function') {
        before.apply(this, arguments);
      }

      var wrappedArguments = args.map(arg => wrap(arg, options)); // Attempt to invoke user-land function
      // NOTE: If you are a Sentry user, and you are seeing this stack frame, it
      //       means the sentry.javascript SDK caught an error invoking your application code. This
      //       is expected behavior and NOT indicative of a bug with sentry.javascript.

      return fn.apply(this, wrappedArguments);
    } catch (ex) {
      ignoreNextOnError();
      (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.withScope)(scope => {
        scope.addEventProcessor(event => {
          if (options.mechanism) {
            (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.addExceptionTypeValue)(event, undefined, undefined);
            (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.addExceptionMechanism)(event, options.mechanism);
          }

          event.extra = _objectSpread(_objectSpread({}, event.extra), {}, {
            arguments: args
          });
          return event;
        });
        (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.captureException)(ex);
      });
      throw ex;
    }
  }; // Accessing some objects may throw
  // ref: https://github.com/getsentry/sentry-javascript/issues/1168


  try {
    for (var property in fn) {
      if (Object.prototype.hasOwnProperty.call(fn, property)) {
        sentryWrapped[property] = fn[property];
      }
    }
  } catch (_oO) {} // Signal that this function has been wrapped/filled already
  // for both debugging and to prevent it to being wrapped/filled twice


  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.markFunctionWrapped)(sentryWrapped, fn);
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addNonEnumerableProperty)(fn, '__sentry_wrapped__', sentryWrapped); // Restore original function name (not all browsers allow that)

  try {
    var descriptor = Object.getOwnPropertyDescriptor(sentryWrapped, 'name');

    if (descriptor.configurable) {
      Object.defineProperty(sentryWrapped, 'name', {
        get() {
          return fn.name;
        }

      });
    }
  } catch (_oO) {}

  return sentryWrapped;
}
/**
 * All properties the report dialog supports
 */




/***/ }),

/***/ 2406:
/*!***************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/index.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Breadcrumbs": function() { return /* reexport safe */ _integrations_breadcrumbs_js__WEBPACK_IMPORTED_MODULE_14__.Breadcrumbs; },
/* harmony export */   "BrowserClient": function() { return /* reexport safe */ _client_js__WEBPACK_IMPORTED_MODULE_7__.BrowserClient; },
/* harmony export */   "Dedupe": function() { return /* reexport safe */ _integrations_dedupe_js__WEBPACK_IMPORTED_MODULE_17__.Dedupe; },
/* harmony export */   "FunctionToString": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_0__.FunctionToString; },
/* harmony export */   "GlobalHandlers": function() { return /* reexport safe */ _integrations_globalhandlers_js__WEBPACK_IMPORTED_MODULE_12__.GlobalHandlers; },
/* harmony export */   "HttpContext": function() { return /* reexport safe */ _integrations_httpcontext_js__WEBPACK_IMPORTED_MODULE_16__.HttpContext; },
/* harmony export */   "Hub": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_1__.Hub; },
/* harmony export */   "InboundFilters": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_2__.InboundFilters; },
/* harmony export */   "Integrations": function() { return /* binding */ INTEGRATIONS; },
/* harmony export */   "LinkedErrors": function() { return /* reexport safe */ _integrations_linkederrors_js__WEBPACK_IMPORTED_MODULE_15__.LinkedErrors; },
/* harmony export */   "SDK_VERSION": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_3__.SDK_VERSION; },
/* harmony export */   "Scope": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_4__.Scope; },
/* harmony export */   "TryCatch": function() { return /* reexport safe */ _integrations_trycatch_js__WEBPACK_IMPORTED_MODULE_13__.TryCatch; },
/* harmony export */   "addBreadcrumb": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.addBreadcrumb; },
/* harmony export */   "addGlobalEventProcessor": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_4__.addGlobalEventProcessor; },
/* harmony export */   "captureEvent": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.captureEvent; },
/* harmony export */   "captureException": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.captureException; },
/* harmony export */   "captureMessage": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.captureMessage; },
/* harmony export */   "chromeStackLineParser": function() { return /* reexport safe */ _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.chromeStackLineParser; },
/* harmony export */   "close": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.close; },
/* harmony export */   "configureScope": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.configureScope; },
/* harmony export */   "createTransport": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_6__.createTransport; },
/* harmony export */   "defaultIntegrations": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.defaultIntegrations; },
/* harmony export */   "defaultStackLineParsers": function() { return /* reexport safe */ _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.defaultStackLineParsers; },
/* harmony export */   "defaultStackParser": function() { return /* reexport safe */ _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.defaultStackParser; },
/* harmony export */   "flush": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.flush; },
/* harmony export */   "forceLoad": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.forceLoad; },
/* harmony export */   "geckoStackLineParser": function() { return /* reexport safe */ _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.geckoStackLineParser; },
/* harmony export */   "getCurrentHub": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub; },
/* harmony export */   "getHubFromCarrier": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_1__.getHubFromCarrier; },
/* harmony export */   "init": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.init; },
/* harmony export */   "lastEventId": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.lastEventId; },
/* harmony export */   "makeFetchTransport": function() { return /* reexport safe */ _transports_fetch_js__WEBPACK_IMPORTED_MODULE_8__.makeFetchTransport; },
/* harmony export */   "makeMain": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_1__.makeMain; },
/* harmony export */   "makeXHRTransport": function() { return /* reexport safe */ _transports_xhr_js__WEBPACK_IMPORTED_MODULE_9__.makeXHRTransport; },
/* harmony export */   "onLoad": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.onLoad; },
/* harmony export */   "opera10StackLineParser": function() { return /* reexport safe */ _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.opera10StackLineParser; },
/* harmony export */   "opera11StackLineParser": function() { return /* reexport safe */ _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.opera11StackLineParser; },
/* harmony export */   "setContext": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.setContext; },
/* harmony export */   "setExtra": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.setExtra; },
/* harmony export */   "setExtras": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.setExtras; },
/* harmony export */   "setTag": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.setTag; },
/* harmony export */   "setTags": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.setTags; },
/* harmony export */   "setUser": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.setUser; },
/* harmony export */   "showReportDialog": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.showReportDialog; },
/* harmony export */   "startTransaction": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.startTransaction; },
/* harmony export */   "winjsStackLineParser": function() { return /* reexport safe */ _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.winjsStackLineParser; },
/* harmony export */   "withScope": function() { return /* reexport safe */ _sentry_core__WEBPACK_IMPORTED_MODULE_5__.withScope; },
/* harmony export */   "wrap": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_11__.wrap; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @sentry/core */ 2867);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/core */ 812);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 95);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/core */ 814);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/core */ 1482);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/core */ 1462);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/core */ 45);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/core */ 1483);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _integrations_index_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./integrations/index.js */ 2868);
/* harmony import */ var _client_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./client.js */ 1273);
/* harmony import */ var _transports_fetch_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./transports/fetch.js */ 1274);
/* harmony import */ var _transports_xhr_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./transports/xhr.js */ 1275);
/* harmony import */ var _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./stack-parsers.js */ 51);
/* harmony import */ var _sdk_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./sdk.js */ 48);
/* harmony import */ var _integrations_globalhandlers_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./integrations/globalhandlers.js */ 838);
/* harmony import */ var _integrations_trycatch_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./integrations/trycatch.js */ 837);
/* harmony import */ var _integrations_breadcrumbs_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./integrations/breadcrumbs.js */ 836);
/* harmony import */ var _integrations_linkederrors_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./integrations/linkederrors.js */ 839);
/* harmony import */ var _integrations_httpcontext_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./integrations/httpcontext.js */ 841);
/* harmony import */ var _integrations_dedupe_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./integrations/dedupe.js */ 840);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

















let windowIntegrations = {}; // This block is needed to add compatibility with the integrations packages when used with a CDN

var _window = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_18__.getGlobalObject)();

if (_window.Sentry && _window.Sentry.Integrations) {
  windowIntegrations = _window.Sentry.Integrations;
}

var INTEGRATIONS = _objectSpread(_objectSpread(_objectSpread({}, windowIntegrations), _sentry_core__WEBPACK_IMPORTED_MODULE_19__), _integrations_index_js__WEBPACK_IMPORTED_MODULE_20__);



/***/ }),

/***/ 836:
/*!**********************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/integrations/breadcrumbs.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BREADCRUMB_INTEGRATION_ID": function() { return /* binding */ BREADCRUMB_INTEGRATION_ID; },
/* harmony export */   "Breadcrumbs": function() { return /* binding */ Breadcrumbs; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/core */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2860);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2839);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2862);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2842);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/utils */ 813);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/** JSDoc */

var BREADCRUMB_INTEGRATION_ID = 'Breadcrumbs';
/**
 * Default Breadcrumbs instrumentations
 * TODO: Deprecated - with v6, this will be renamed to `Instrument`
 */

class Breadcrumbs {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = BREADCRUMB_INTEGRATION_ID;
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Breadcrumbs.id;
  }
  /**
   * Options of the breadcrumbs integration.
   */
  // This field is public, because we use it in the browser client to check if the `sentry` option is enabled.

  /**
   * @inheritDoc
   */


  constructor(options) {
    ;

    Breadcrumbs.prototype.__init.call(this);

    this.options = _objectSpread({
      console: true,
      dom: true,
      fetch: true,
      history: true,
      sentry: true,
      xhr: true
    }, options);
  }
  /**
   * Instrument browser built-ins w/ breadcrumb capturing
   *  - Console API
   *  - DOM API (click/typing)
   *  - XMLHttpRequest API
   *  - Fetch API
   *  - History API
   */


  setupOnce() {
    if (this.options.console) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('console', _consoleBreadcrumb);
    }

    if (this.options.dom) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('dom', _domBreadcrumb(this.options.dom));
    }

    if (this.options.xhr) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('xhr', _xhrBreadcrumb);
    }

    if (this.options.fetch) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('fetch', _fetchBreadcrumb);
    }

    if (this.options.history) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('history', _historyBreadcrumb);
    }
  }

}

Breadcrumbs.__initStatic();
/**
 * A HOC that creaes a function that creates breadcrumbs from DOM API calls.
 * This is a HOC so that we get access to dom options in the closure.
 */


function _domBreadcrumb(dom) {
  function _innerDomBreadcrumb(handlerData) {
    let target;
    let keyAttrs = typeof dom === 'object' ? dom.serializeAttribute : undefined;

    if (typeof keyAttrs === 'string') {
      keyAttrs = [keyAttrs];
    } // Accessing event.target can throw (see getsentry/raven-js#838, #768)


    try {
      target = handlerData.event.target ? (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.htmlTreeAsString)(handlerData.event.target, keyAttrs) : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.htmlTreeAsString)(handlerData.event, keyAttrs);
    } catch (e) {
      target = '<unknown>';
    }

    if (target.length === 0) {
      return;
    }

    (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().addBreadcrumb({
      category: "ui.".concat(handlerData.name),
      message: target
    }, {
      event: handlerData.event,
      name: handlerData.name,
      global: handlerData.global
    });
  }

  return _innerDomBreadcrumb;
}
/**
 * Creates breadcrumbs from console API calls
 */


function _consoleBreadcrumb(handlerData) {
  var breadcrumb = {
    category: 'console',
    data: {
      arguments: handlerData.args,
      logger: 'console'
    },
    level: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.severityLevelFromString)(handlerData.level),
    message: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.safeJoin)(handlerData.args, ' ')
  };

  if (handlerData.level === 'assert') {
    if (handlerData.args[0] === false) {
      breadcrumb.message = "Assertion failed: ".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.safeJoin)(handlerData.args.slice(1), ' ') || 'console.assert');
      breadcrumb.data.arguments = handlerData.args.slice(1);
    } else {
      // Don't capture a breadcrumb for passed assertions
      return;
    }
  }

  (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().addBreadcrumb(breadcrumb, {
    input: handlerData.args,
    level: handlerData.level
  });
}
/**
 * Creates breadcrumbs from XHR API calls
 */


function _xhrBreadcrumb(handlerData) {
  if (handlerData.endTimestamp) {
    // We only capture complete, non-sentry requests
    if (handlerData.xhr.__sentry_own_request__) {
      return;
    }

    const {
      method,
      url,
      status_code,
      body
    } = handlerData.xhr.__sentry_xhr__ || {};
    (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().addBreadcrumb({
      category: 'xhr',
      data: {
        method,
        url,
        status_code
      },
      type: 'http'
    }, {
      xhr: handlerData.xhr,
      input: body
    });
    return;
  }
}
/**
 * Creates breadcrumbs from fetch API calls
 */


function _fetchBreadcrumb(handlerData) {
  // We only capture complete fetch requests
  if (!handlerData.endTimestamp) {
    return;
  }

  if (handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === 'POST') {
    // We will not create breadcrumbs for fetch requests that contain `sentry_key` (internal sentry requests)
    return;
  }

  if (handlerData.error) {
    (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().addBreadcrumb({
      category: 'fetch',
      data: handlerData.fetchData,
      level: 'error',
      type: 'http'
    }, {
      data: handlerData.error,
      input: handlerData.args
    });
  } else {
    (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().addBreadcrumb({
      category: 'fetch',
      data: _objectSpread(_objectSpread({}, handlerData.fetchData), {}, {
        status_code: handlerData.response.status
      }),
      type: 'http'
    }, {
      input: handlerData.args,
      response: handlerData.response
    });
  }
}
/**
 * Creates breadcrumbs from history API calls
 */


function _historyBreadcrumb(handlerData) {
  var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalObject)();
  let from = handlerData.from;
  let to = handlerData.to;
  var parsedLoc = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.parseUrl)(global.location.href);
  let parsedFrom = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.parseUrl)(from);
  var parsedTo = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.parseUrl)(to); // Initial pushState doesn't provide `from` information

  if (!parsedFrom.path) {
    parsedFrom = parsedLoc;
  } // Use only the path component of the URL if the URL matches the current
  // document (almost all the time when using pushState)


  if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host) {
    to = parsedTo.relative;
  }

  if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host) {
    from = parsedFrom.relative;
  }

  (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().addBreadcrumb({
    category: 'navigation',
    data: {
      from,
      to
    }
  });
}



/***/ }),

/***/ 840:
/*!*****************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/integrations/dedupe.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dedupe": function() { return /* binding */ Dedupe; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2845);


/** Deduplication filter */

class Dedupe {
  constructor() {
    Dedupe.prototype.__init.call(this);
  }
  /**
   * @inheritDoc
   */


  static __initStatic() {
    this.id = 'Dedupe';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Dedupe.id;
  }
  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */


  setupOnce(addGlobalEventProcessor, getCurrentHub) {
    var eventProcessor = currentEvent => {
      var self = getCurrentHub().getIntegration(Dedupe);

      if (self) {
        // Juuust in case something goes wrong
        try {
          if (_shouldDropEvent(currentEvent, self._previousEvent)) {
            (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn('Event dropped due to being a duplicate of previously captured event.');
            return null;
          }
        } catch (_oO) {
          return self._previousEvent = currentEvent;
        }

        return self._previousEvent = currentEvent;
      }

      return currentEvent;
    };

    eventProcessor.id = this.name;
    addGlobalEventProcessor(eventProcessor);
  }

}

Dedupe.__initStatic();
/** JSDoc */


function _shouldDropEvent(currentEvent, previousEvent) {
  if (!previousEvent) {
    return false;
  }

  if (_isSameMessageEvent(currentEvent, previousEvent)) {
    return true;
  }

  if (_isSameExceptionEvent(currentEvent, previousEvent)) {
    return true;
  }

  return false;
}
/** JSDoc */


function _isSameMessageEvent(currentEvent, previousEvent) {
  var currentMessage = currentEvent.message;
  var previousMessage = previousEvent.message; // If neither event has a message property, they were both exceptions, so bail out

  if (!currentMessage && !previousMessage) {
    return false;
  } // If only one event has a stacktrace, but not the other one, they are not the same


  if (currentMessage && !previousMessage || !currentMessage && previousMessage) {
    return false;
  }

  if (currentMessage !== previousMessage) {
    return false;
  }

  if (!_isSameFingerprint(currentEvent, previousEvent)) {
    return false;
  }

  if (!_isSameStacktrace(currentEvent, previousEvent)) {
    return false;
  }

  return true;
}
/** JSDoc */


function _isSameExceptionEvent(currentEvent, previousEvent) {
  var previousException = _getExceptionFromEvent(previousEvent);

  var currentException = _getExceptionFromEvent(currentEvent);

  if (!previousException || !currentException) {
    return false;
  }

  if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
    return false;
  }

  if (!_isSameFingerprint(currentEvent, previousEvent)) {
    return false;
  }

  if (!_isSameStacktrace(currentEvent, previousEvent)) {
    return false;
  }

  return true;
}
/** JSDoc */


function _isSameStacktrace(currentEvent, previousEvent) {
  let currentFrames = _getFramesFromEvent(currentEvent);

  let previousFrames = _getFramesFromEvent(previousEvent); // If neither event has a stacktrace, they are assumed to be the same


  if (!currentFrames && !previousFrames) {
    return true;
  } // If only one event has a stacktrace, but not the other one, they are not the same


  if (currentFrames && !previousFrames || !currentFrames && previousFrames) {
    return false;
  }

  currentFrames = currentFrames;
  previousFrames = previousFrames; // If number of frames differ, they are not the same

  if (previousFrames.length !== currentFrames.length) {
    return false;
  } // Otherwise, compare the two


  for (let i = 0; i < previousFrames.length; i++) {
    var frameA = previousFrames[i];
    var frameB = currentFrames[i];

    if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function) {
      return false;
    }
  }

  return true;
}
/** JSDoc */


function _isSameFingerprint(currentEvent, previousEvent) {
  let currentFingerprint = currentEvent.fingerprint;
  let previousFingerprint = previousEvent.fingerprint; // If neither event has a fingerprint, they are assumed to be the same

  if (!currentFingerprint && !previousFingerprint) {
    return true;
  } // If only one event has a fingerprint, but not the other one, they are not the same


  if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint) {
    return false;
  }

  currentFingerprint = currentFingerprint;
  previousFingerprint = previousFingerprint; // Otherwise, compare the two

  try {
    return !!(currentFingerprint.join('') === previousFingerprint.join(''));
  } catch (_oO) {
    return false;
  }
}
/** JSDoc */


function _getExceptionFromEvent(event) {
  return event.exception && event.exception.values && event.exception.values[0];
}
/** JSDoc */


function _getFramesFromEvent(event) {
  var exception = event.exception;

  if (exception) {
    try {
      // @ts-ignore Object could be undefined
      return exception.values[0].stacktrace.frames;
    } catch (_oO) {
      return undefined;
    }
  }

  return undefined;
}



/***/ }),

/***/ 838:
/*!*************************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/integrations/globalhandlers.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GlobalHandlers": function() { return /* binding */ GlobalHandlers; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @sentry/core */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2860);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2838);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2839);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _eventbuilder_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../eventbuilder.js */ 2859);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers.js */ 2865);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/** Global handlers */

class GlobalHandlers {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'GlobalHandlers';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = GlobalHandlers.id;
  }
  /** JSDoc */

  /**
   * Stores references functions to installing handlers. Will set to undefined
   * after they have been run so that they are not used twice.
   */


  __init2() {
    this._installFunc = {
      onerror: _installGlobalOnErrorHandler,
      onunhandledrejection: _installGlobalOnUnhandledRejectionHandler
    };
  }
  /** JSDoc */


  constructor(options) {
    ;

    GlobalHandlers.prototype.__init.call(this);

    GlobalHandlers.prototype.__init2.call(this);

    this._options = _objectSpread({
      onerror: true,
      onunhandledrejection: true
    }, options);
  }
  /**
   * @inheritDoc
   */


  setupOnce() {
    Error.stackTraceLimit = 50;
    var options = this._options; // We can disable guard-for-in as we construct the options object above + do checks against
    // `this._installFunc` for the property.

    for (var key in options) {
      var installFunc = this._installFunc[key];

      if (installFunc && options[key]) {
        globalHandlerLog(key);
        installFunc();
        this._installFunc[key] = undefined;
      }
    }
  }

}

GlobalHandlers.__initStatic();
/** JSDoc */


function _installGlobalOnErrorHandler() {
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.addInstrumentationHandler)('error', data => {
    const [hub, stackParser, attachStacktrace] = getHubAndOptions();

    if (!hub.getIntegration(GlobalHandlers)) {
      return;
    }

    const {
      msg,
      url,
      line,
      column,
      error
    } = data;

    if ((0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.shouldIgnoreOnError)() || error && error.__sentry_own_request__) {
      return;
    }

    var event = error === undefined && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isString)(msg) ? _eventFromIncompleteOnError(msg, url, line, column) : _enhanceEventWithInitialFrame((0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_4__.eventFromUnknownInput)(stackParser, error || msg, undefined, attachStacktrace, false), url, line, column);
    event.level = 'error';
    addMechanismAndCapture(hub, error, event, 'onerror');
  });
}
/** JSDoc */


function _installGlobalOnUnhandledRejectionHandler() {
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.addInstrumentationHandler)('unhandledrejection', e => {
    const [hub, stackParser, attachStacktrace] = getHubAndOptions();

    if (!hub.getIntegration(GlobalHandlers)) {
      return;
    }

    let error = e; // dig the object of the rejection out of known event types

    try {
      // PromiseRejectionEvents store the object of the rejection under 'reason'
      // see https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
      if ('reason' in e) {
        error = e.reason;
      } // something, somewhere, (likely a browser extension) effectively casts PromiseRejectionEvents
      // to CustomEvents, moving the `promise` and `reason` attributes of the PRE into
      // the CustomEvent's `detail` attribute, since they're not part of CustomEvent's spec
      // see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent and
      // https://github.com/getsentry/sentry-javascript/issues/2380
      else if ('detail' in e && 'reason' in e.detail) {
        error = e.detail.reason;
      }
    } catch (_oO) {// no-empty
    }

    if ((0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.shouldIgnoreOnError)() || error && error.__sentry_own_request__) {
      return true;
    }

    var event = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isPrimitive)(error) ? _eventFromRejectionWithPrimitive(error) : (0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_4__.eventFromUnknownInput)(stackParser, error, undefined, attachStacktrace, true);
    event.level = 'error';
    addMechanismAndCapture(hub, error, event, 'onunhandledrejection');
    return;
  });
}
/**
 * Create an event from a promise rejection where the `reason` is a primitive.
 *
 * @param reason: The `reason` property of the promise rejection
 * @returns An Event object with an appropriate `exception` value
 */


function _eventFromRejectionWithPrimitive(reason) {
  return {
    exception: {
      values: [{
        type: 'UnhandledRejection',
        // String() is needed because the Primitive type includes symbols (which can't be automatically stringified)
        value: "Non-Error promise rejection captured with value: ".concat(String(reason))
      }]
    }
  };
}
/**
 * This function creates a stack from an old, error-less onerror handler.
 */


function _eventFromIncompleteOnError(msg, url, line, column) {
  var ERROR_TYPES_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i; // If 'message' is ErrorEvent, get real message from inside

  let message = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isErrorEvent)(msg) ? msg.message : msg;
  let name = 'Error';
  var groups = message.match(ERROR_TYPES_RE);

  if (groups) {
    name = groups[1];
    message = groups[2];
  }

  var event = {
    exception: {
      values: [{
        type: name,
        value: message
      }]
    }
  };
  return _enhanceEventWithInitialFrame(event, url, line, column);
}
/** JSDoc */


function _enhanceEventWithInitialFrame(event, url, line, column) {
  // event.exception
  var e = event.exception = event.exception || {}; // event.exception.values

  var ev = e.values = e.values || []; // event.exception.values[0]

  var ev0 = ev[0] = ev[0] || {}; // event.exception.values[0].stacktrace

  var ev0s = ev0.stacktrace = ev0.stacktrace || {}; // event.exception.values[0].stacktrace.frames

  var ev0sf = ev0s.frames = ev0s.frames || [];
  var colno = isNaN(parseInt(column, 10)) ? undefined : column;
  var lineno = isNaN(parseInt(line, 10)) ? undefined : line;
  var filename = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isString)(url) && url.length > 0 ? url : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getLocationHref)(); // event.exception.values[0].stacktrace.frames

  if (ev0sf.length === 0) {
    ev0sf.push({
      colno,
      filename,
      function: '?',
      in_app: true,
      lineno
    });
  }

  return event;
}

function globalHandlerLog(type) {
  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_6__.logger.log("Global Handler attached: ".concat(type));
}

function addMechanismAndCapture(hub, error, event, type) {
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.addExceptionMechanism)(event, {
    handled: false,
    type
  });
  hub.captureEvent(event, {
    originalException: error
  });
}

function getHubAndOptions() {
  var hub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_8__.getCurrentHub)();
  var client = hub.getClient();
  var options = client && client.getOptions() || {
    stackParser: () => [],
    attachStacktrace: false
  };
  return [hub, options.stackParser, options.attachStacktrace];
}



/***/ }),

/***/ 841:
/*!**********************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/integrations/httpcontext.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HttpContext": function() { return /* binding */ HttpContext; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 1462);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/core */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
/** HttpContext integration collects information about HTTP request headers */

class HttpContext {
  constructor() {
    HttpContext.prototype.__init.call(this);
  }
  /**
   * @inheritDoc
   */


  static __initStatic() {
    this.id = 'HttpContext';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = HttpContext.id;
  }
  /**
   * @inheritDoc
   */


  setupOnce() {
    (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.addGlobalEventProcessor)(event => {
      if ((0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().getIntegration(HttpContext)) {
        // if none of the information we want exists, don't bother
        if (!global.navigator && !global.location && !global.document) {
          return event;
        } // grab as much info as exists and add it to the event


        var url = event.request && event.request.url || global.location && global.location.href;
        const {
          referrer
        } = global.document || {};
        const {
          userAgent
        } = global.navigator || {};

        var headers = _objectSpread(_objectSpread(_objectSpread({}, event.request && event.request.headers), referrer && {
          Referer: referrer
        }), userAgent && {
          'User-Agent': userAgent
        });

        var request = _objectSpread(_objectSpread({}, url && {
          url
        }), {}, {
          headers
        });

        return _objectSpread(_objectSpread({}, event), {}, {
          request
        });
      }

      return event;
    });
  }

}

HttpContext.__initStatic();



/***/ }),

/***/ 2868:
/*!****************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/integrations/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Breadcrumbs": function() { return /* reexport safe */ _breadcrumbs_js__WEBPACK_IMPORTED_MODULE_2__.Breadcrumbs; },
/* harmony export */   "Dedupe": function() { return /* reexport safe */ _dedupe_js__WEBPACK_IMPORTED_MODULE_5__.Dedupe; },
/* harmony export */   "GlobalHandlers": function() { return /* reexport safe */ _globalhandlers_js__WEBPACK_IMPORTED_MODULE_0__.GlobalHandlers; },
/* harmony export */   "HttpContext": function() { return /* reexport safe */ _httpcontext_js__WEBPACK_IMPORTED_MODULE_4__.HttpContext; },
/* harmony export */   "LinkedErrors": function() { return /* reexport safe */ _linkederrors_js__WEBPACK_IMPORTED_MODULE_3__.LinkedErrors; },
/* harmony export */   "TryCatch": function() { return /* reexport safe */ _trycatch_js__WEBPACK_IMPORTED_MODULE_1__.TryCatch; }
/* harmony export */ });
/* harmony import */ var _globalhandlers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globalhandlers.js */ 838);
/* harmony import */ var _trycatch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./trycatch.js */ 837);
/* harmony import */ var _breadcrumbs_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./breadcrumbs.js */ 836);
/* harmony import */ var _linkederrors_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./linkederrors.js */ 839);
/* harmony import */ var _httpcontext_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./httpcontext.js */ 841);
/* harmony import */ var _dedupe_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dedupe.js */ 840);







/***/ }),

/***/ 839:
/*!***********************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/integrations/linkederrors.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LinkedErrors": function() { return /* binding */ LinkedErrors; },
/* harmony export */   "_handler": function() { return /* binding */ _handler; },
/* harmony export */   "_walkErrorTree": function() { return /* binding */ _walkErrorTree; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 95);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/core */ 1462);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2838);
/* harmony import */ var _eventbuilder_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../eventbuilder.js */ 2859);




var DEFAULT_KEY = 'cause';
var DEFAULT_LIMIT = 5;
/** Adds SDK info to an event. */

class LinkedErrors {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'LinkedErrors';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = LinkedErrors.id;
  }
  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */


  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ;

    LinkedErrors.prototype.__init.call(this);

    this._key = options.key || DEFAULT_KEY;
    this._limit = options.limit || DEFAULT_LIMIT;
  }
  /**
   * @inheritDoc
   */


  setupOnce() {
    var client = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)().getClient();

    if (!client) {
      return;
    }

    (0,_sentry_core__WEBPACK_IMPORTED_MODULE_2__.addGlobalEventProcessor)((event, hint) => {
      var self = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)().getIntegration(LinkedErrors);
      return self ? _handler(client.getOptions().stackParser, self._key, self._limit, event, hint) : event;
    });
  }

}

LinkedErrors.__initStatic();
/**
 * @inheritDoc
 */


function _handler(parser, key, limit, event, hint) {
  if (!event.exception || !event.exception.values || !hint || !(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isInstanceOf)(hint.originalException, Error)) {
    return event;
  }

  var linkedErrors = _walkErrorTree(parser, limit, hint.originalException, key);

  event.exception.values = [...linkedErrors, ...event.exception.values];
  return event;
}
/**
 * JSDOC
 */


function _walkErrorTree(parser, limit, error, key) {
  let stack = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  if (!(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isInstanceOf)(error[key], Error) || stack.length + 1 >= limit) {
    return stack;
  }

  var exception = (0,_eventbuilder_js__WEBPACK_IMPORTED_MODULE_4__.exceptionFromError)(parser, error[key]);
  return _walkErrorTree(parser, limit, error[key], key, [exception, ...stack]);
}



/***/ }),

/***/ 837:
/*!*******************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/integrations/trycatch.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TryCatch": function() { return /* binding */ TryCatch; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2858);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers.js */ 2865);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var DEFAULT_EVENT_TARGET = ['EventTarget', 'Window', 'Node', 'ApplicationCache', 'AudioTrackList', 'ChannelMergerNode', 'CryptoOperation', 'EventSource', 'FileReader', 'HTMLUnknownElement', 'IDBDatabase', 'IDBRequest', 'IDBTransaction', 'KeyOperation', 'MediaController', 'MessagePort', 'ModalWindow', 'Notification', 'SVGElementInstance', 'Screen', 'TextTrack', 'TextTrackCue', 'TextTrackList', 'WebSocket', 'WebSocketWorker', 'Worker', 'XMLHttpRequest', 'XMLHttpRequestEventTarget', 'XMLHttpRequestUpload'];
/** Wrap timer functions and event targets to catch errors and provide better meta data */

class TryCatch {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'TryCatch';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = TryCatch.id;
  }
  /** JSDoc */

  /**
   * @inheritDoc
   */


  constructor(options) {
    ;

    TryCatch.prototype.__init.call(this);

    this._options = _objectSpread({
      XMLHttpRequest: true,
      eventTarget: true,
      requestAnimationFrame: true,
      setInterval: true,
      setTimeout: true
    }, options);
  }
  /**
   * Wrap timer functions and event targets to catch errors
   * and provide better metadata.
   */


  setupOnce() {
    var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

    if (this._options.setTimeout) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(global, 'setTimeout', _wrapTimeFunction);
    }

    if (this._options.setInterval) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(global, 'setInterval', _wrapTimeFunction);
    }

    if (this._options.requestAnimationFrame) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(global, 'requestAnimationFrame', _wrapRAF);
    }

    if (this._options.XMLHttpRequest && 'XMLHttpRequest' in global) {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(XMLHttpRequest.prototype, 'send', _wrapXHR);
    }

    var eventTargetOption = this._options.eventTarget;

    if (eventTargetOption) {
      var eventTarget = Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET;
      eventTarget.forEach(_wrapEventTarget);
    }
  }

}

TryCatch.__initStatic();
/** JSDoc */


function _wrapTimeFunction(original) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var originalCallback = args[0];
    args[0] = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.wrap)(originalCallback, {
      mechanism: {
        data: {
          function: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(original)
        },
        handled: true,
        type: 'instrument'
      }
    });
    return original.apply(this, args);
  };
}
/** JSDoc */


function _wrapRAF(original) {
  return function (callback) {
    return original.apply(this, [(0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.wrap)(callback, {
      mechanism: {
        data: {
          function: 'requestAnimationFrame',
          handler: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(original)
        },
        handled: true,
        type: 'instrument'
      }
    })]);
  };
}
/** JSDoc */


function _wrapXHR(originalSend) {
  return function () {
    var xhr = this;
    var xmlHttpRequestProps = ['onload', 'onerror', 'onprogress', 'onreadystatechange'];
    xmlHttpRequestProps.forEach(prop => {
      if (prop in xhr && typeof xhr[prop] === 'function') {
        (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(xhr, prop, function (original) {
          var wrapOptions = {
            mechanism: {
              data: {
                function: prop,
                handler: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(original)
              },
              handled: true,
              type: 'instrument'
            }
          }; // If Instrument integration has been called before TryCatch, get the name of original function

          var originalFunction = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.getOriginalFunction)(original);

          if (originalFunction) {
            wrapOptions.mechanism.data.handler = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(originalFunction);
          } // Otherwise wrap directly


          return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.wrap)(original, wrapOptions);
        });
      }
    });

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return originalSend.apply(this, args);
  };
}
/** JSDoc */


function _wrapEventTarget(target) {
  var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
  var proto = global[target] && global[target].prototype;

  if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
    return;
  }

  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(proto, 'addEventListener', function (original) {
    return function (eventName, fn, options) {
      try {
        if (typeof fn.handleEvent === 'function') {
          // ESlint disable explanation:
          //  First, it is generally safe to call `wrap` with an unbound function. Furthermore, using `.bind()` would
          //  introduce a bug here, because bind returns a new function that doesn't have our
          //  flags(like __sentry_original__) attached. `wrap` checks for those flags to avoid unnecessary wrapping.
          //  Without those flags, every call to addEventListener wraps the function again, causing a memory leak.
          fn.handleEvent = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.wrap)(fn.handleEvent, {
            mechanism: {
              data: {
                function: 'handleEvent',
                handler: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(fn),
                target
              },
              handled: true,
              type: 'instrument'
            }
          });
        }
      } catch (err) {// can sometimes get 'Permission denied to access property "handle Event'
      }

      return original.apply(this, [eventName, (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.wrap)(fn, {
        mechanism: {
          data: {
            function: 'addEventListener',
            handler: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(fn),
            target
          },
          handled: true,
          type: 'instrument'
        }
      }), options]);
    };
  });
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.fill)(proto, 'removeEventListener', function (originalRemoveEventListener) {
    return function (eventName, fn, options) {
      /**
       * There are 2 possible scenarios here:
       *
       * 1. Someone passes a callback, which was attached prior to Sentry initialization, or by using unmodified
       * method, eg. `document.addEventListener.call(el, name, handler). In this case, we treat this function
       * as a pass-through, and call original `removeEventListener` with it.
       *
       * 2. Someone passes a callback, which was attached after Sentry was initialized, which means that it was using
       * our wrapped version of `addEventListener`, which internally calls `wrap` helper.
       * This helper "wraps" whole callback inside a try/catch statement, and attached appropriate metadata to it,
       * in order for us to make a distinction between wrapped/non-wrapped functions possible.
       * If a function was wrapped, it has additional property of `__sentry_wrapped__`, holding the handler.
       *
       * When someone adds a handler prior to initialization, and then do it again, but after,
       * then we have to detach both of them. Otherwise, if we'd detach only wrapped one, it'd be impossible
       * to get rid of the initial handler and it'd stick there forever.
       */
      var wrappedEventHandler = fn;

      try {
        var originalEventHandler = wrappedEventHandler && wrappedEventHandler.__sentry_wrapped__;

        if (originalEventHandler) {
          originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
        }
      } catch (e) {// ignore, accessing __sentry_wrapped__ will throw in some Selenium environments
      }

      return originalRemoveEventListener.call(this, eventName, wrappedEventHandler, options);
    };
  });
}



/***/ }),

/***/ 48:
/*!*************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/sdk.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "close": function() { return /* binding */ close; },
/* harmony export */   "defaultIntegrations": function() { return /* binding */ defaultIntegrations; },
/* harmony export */   "flush": function() { return /* binding */ flush; },
/* harmony export */   "forceLoad": function() { return /* binding */ forceLoad; },
/* harmony export */   "init": function() { return /* binding */ init; },
/* harmony export */   "lastEventId": function() { return /* binding */ lastEventId; },
/* harmony export */   "onLoad": function() { return /* binding */ onLoad; },
/* harmony export */   "showReportDialog": function() { return /* binding */ showReportDialog; },
/* harmony export */   "wrap": function() { return /* binding */ wrap; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/core */ 814);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 812);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @sentry/core */ 2853);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @sentry/core */ 2866);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @sentry/core */ 95);
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @sentry/core */ 2852);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @sentry/utils */ 2858);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @sentry/utils */ 2861);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @sentry/utils */ 2844);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @sentry/utils */ 2860);
/* harmony import */ var _client_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./client.js */ 1273);
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./helpers.js */ 2865);
/* harmony import */ var _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./stack-parsers.js */ 51);
/* harmony import */ var _integrations_trycatch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./integrations/trycatch.js */ 837);
/* harmony import */ var _integrations_breadcrumbs_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./integrations/breadcrumbs.js */ 836);
/* harmony import */ var _integrations_globalhandlers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./integrations/globalhandlers.js */ 838);
/* harmony import */ var _integrations_linkederrors_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./integrations/linkederrors.js */ 839);
/* harmony import */ var _integrations_dedupe_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./integrations/dedupe.js */ 840);
/* harmony import */ var _integrations_httpcontext_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./integrations/httpcontext.js */ 841);
/* harmony import */ var _transports_fetch_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./transports/fetch.js */ 1274);
/* harmony import */ var _transports_xhr_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./transports/xhr.js */ 1275);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
















var defaultIntegrations = [new _sentry_core__WEBPACK_IMPORTED_MODULE_0__.InboundFilters(), new _sentry_core__WEBPACK_IMPORTED_MODULE_1__.FunctionToString(), new _integrations_trycatch_js__WEBPACK_IMPORTED_MODULE_2__.TryCatch(), new _integrations_breadcrumbs_js__WEBPACK_IMPORTED_MODULE_3__.Breadcrumbs(), new _integrations_globalhandlers_js__WEBPACK_IMPORTED_MODULE_4__.GlobalHandlers(), new _integrations_linkederrors_js__WEBPACK_IMPORTED_MODULE_5__.LinkedErrors(), new _integrations_dedupe_js__WEBPACK_IMPORTED_MODULE_6__.Dedupe(), new _integrations_httpcontext_js__WEBPACK_IMPORTED_MODULE_7__.HttpContext()];
/**
 * The Sentry Browser SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible when
 * loading the web page. To set context information or send manual events, use
 * the provided methods.
 *
 * @example
 *
 * ```
 *
 * import { init } from '@sentry/browser';
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { configureScope } from '@sentry/browser';
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 * ```
 *
 * @example
 * ```
 *
 * import { addBreadcrumb } from '@sentry/browser';
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 *
 * ```
 *
 * import * as Sentry from '@sentry/browser';
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link BrowserOptions} for documentation on configuration options.
 */

function init() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (options.defaultIntegrations === undefined) {
    options.defaultIntegrations = defaultIntegrations;
  }

  if (options.release === undefined) {
    var window = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.getGlobalObject)(); // This supports the variable that sentry-webpack-plugin injects

    if (window.SENTRY_RELEASE && window.SENTRY_RELEASE.id) {
      options.release = window.SENTRY_RELEASE.id;
    }
  }

  if (options.autoSessionTracking === undefined) {
    options.autoSessionTracking = true;
  }

  if (options.sendClientReports === undefined) {
    options.sendClientReports = true;
  }

  var clientOptions = _objectSpread(_objectSpread({}, options), {}, {
    stackParser: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.stackParserFromStackParserOptions)(options.stackParser || _stack_parsers_js__WEBPACK_IMPORTED_MODULE_10__.defaultStackParser),
    integrations: (0,_sentry_core__WEBPACK_IMPORTED_MODULE_11__.getIntegrationsToSetup)(options),
    transport: options.transport || ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.supportsFetch)() ? _transports_fetch_js__WEBPACK_IMPORTED_MODULE_13__.makeFetchTransport : _transports_xhr_js__WEBPACK_IMPORTED_MODULE_14__.makeXHRTransport)
  });

  (0,_sentry_core__WEBPACK_IMPORTED_MODULE_15__.initAndBind)(_client_js__WEBPACK_IMPORTED_MODULE_16__.BrowserClient, clientOptions);

  if (options.autoSessionTracking) {
    startSessionTracking();
  }
}
/**
 * Present the user with a report dialog.
 *
 * @param options Everything is optional, we try to fetch all info need from the global scope.
 */


function showReportDialog() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let hub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0,_sentry_core__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)();
  // doesn't work without a document (React Native)
  var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.getGlobalObject)();

  if (!global.document) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_18__.logger.error('Global document not defined in showReportDialog call');
    return;
  }

  const {
    client,
    scope
  } = hub.getStackTop();
  var dsn = options.dsn || client && client.getDsn();

  if (!dsn) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_18__.logger.error('DSN not configured for showReportDialog call');
    return;
  }

  if (scope) {
    options.user = _objectSpread(_objectSpread({}, scope.getUser()), options.user);
  }

  if (!options.eventId) {
    options.eventId = hub.lastEventId();
  }

  var script = global.document.createElement('script');
  script.async = true;
  script.src = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_19__.getReportDialogEndpoint)(dsn, options);

  if (options.onLoad) {
    script.onload = options.onLoad;
  }

  var injectionPoint = global.document.head || global.document.body;

  if (injectionPoint) {
    injectionPoint.appendChild(script);
  } else {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_18__.logger.error('Not injecting report dialog. No injection point found in HTML');
  }
}
/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */


function lastEventId() {
  return (0,_sentry_core__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)().lastEventId();
}
/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */


function forceLoad() {// Noop
}
/**
 * This function is here to be API compatible with the loader.
 * @hidden
 */


function onLoad(callback) {
  callback();
}
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */


function flush(timeout) {
  var client = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)().getClient();

  if (client) {
    return client.flush(timeout);
  }

  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_18__.logger.warn('Cannot flush events. No client defined.');
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_20__.resolvedSyncPromise)(false);
}
/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */


function close(timeout) {
  var client = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)().getClient();

  if (client) {
    return client.close(timeout);
  }

  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_18__.logger.warn('Cannot flush events and disable SDK. No client defined.');
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_20__.resolvedSyncPromise)(false);
}
/**
 * Wrap code within a try/catch block so the SDK is able to capture errors.
 *
 * @param fn A function to wrap.
 *
 * @returns The result of wrapped function call.
 */


function wrap(fn) {
  return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_21__.wrap)(fn)();
}

function startSessionOnHub(hub) {
  hub.startSession({
    ignoreDuration: true
  });
  hub.captureSession();
}
/**
 * Enable automatic Session Tracking for the initial page load.
 */


function startSessionTracking() {
  var window = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.getGlobalObject)();
  var document = window.document;

  if (typeof document === 'undefined') {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_18__.logger.warn('Session tracking in non-browser environment with @sentry/browser is not supported.');
    return;
  }

  var hub = (0,_sentry_core__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)(); // The only way for this to be false is for there to be a version mismatch between @sentry/browser (>= 6.0.0) and
  // @sentry/hub (< 5.27.0). In the simple case, there won't ever be such a mismatch, because the two packages are
  // pinned at the same version in package.json, but there are edge cases where it's possible. See
  // https://github.com/getsentry/sentry-javascript/issues/3207 and
  // https://github.com/getsentry/sentry-javascript/issues/3234 and
  // https://github.com/getsentry/sentry-javascript/issues/3278.

  if (!hub.captureSession) {
    return;
  } // The session duration for browser sessions does not track a meaningful
  // concept that can be used as a metric.
  // Automatically captured sessions are akin to page views, and thus we
  // discard their duration.


  startSessionOnHub(hub); // We want to create a session for every navigation as well

  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_22__.addInstrumentationHandler)('history', _ref => {
    let {
      from,
      to
    } = _ref;

    // Don't create an additional session for the initial route or if the location did not change
    if (!(from === undefined || from === to)) {
      startSessionOnHub((0,_sentry_core__WEBPACK_IMPORTED_MODULE_17__.getCurrentHub)());
    }
  });
}



/***/ }),

/***/ 51:
/*!***********************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/stack-parsers.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "chromeStackLineParser": function() { return /* binding */ chromeStackLineParser; },
/* harmony export */   "defaultStackLineParsers": function() { return /* binding */ defaultStackLineParsers; },
/* harmony export */   "defaultStackParser": function() { return /* binding */ defaultStackParser; },
/* harmony export */   "geckoStackLineParser": function() { return /* binding */ geckoStackLineParser; },
/* harmony export */   "opera10StackLineParser": function() { return /* binding */ opera10StackLineParser; },
/* harmony export */   "opera11StackLineParser": function() { return /* binding */ opera11StackLineParser; },
/* harmony export */   "winjsStackLineParser": function() { return /* binding */ winjsStackLineParser; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2858);

 // global reference to slice

var UNKNOWN_FUNCTION = '?';
var OPERA10_PRIORITY = 10;
var OPERA11_PRIORITY = 20;
var CHROME_PRIORITY = 30;
var WINJS_PRIORITY = 40;
var GECKO_PRIORITY = 50;

function createFrame(filename, func, lineno, colno) {
  var frame = {
    filename,
    function: func,
    // All browser frames are considered in_app
    in_app: true
  };

  if (lineno !== undefined) {
    frame.lineno = lineno;
  }

  if (colno !== undefined) {
    frame.colno = colno;
  }

  return frame;
} // Chromium based browsers: Chrome, Brave, new Opera, new Edge


var chromeRegex = /^\s*at (?:(.*?) ?\((?:address at )?)?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;

var chrome = line => {
  var parts = chromeRegex.exec(line);

  if (parts) {
    var isEval = parts[2] && parts[2].indexOf('eval') === 0; // start of line

    if (isEval) {
      var subMatch = chromeEvalRegex.exec(parts[2]);

      if (subMatch) {
        // throw out eval line/column and use top-most line/column number
        parts[2] = subMatch[1]; // url

        parts[3] = subMatch[2]; // line

        parts[4] = subMatch[3]; // column
      }
    } // Kamil: One more hack won't hurt us right? Understanding and adding more rules on top of these regexps right now
    // would be way too time consuming. (TODO: Rewrite whole RegExp to be more readable)


    const [func, filename] = extractSafariExtensionDetails(parts[1] || UNKNOWN_FUNCTION, parts[2]);
    return createFrame(filename, func, parts[3] ? +parts[3] : undefined, parts[4] ? +parts[4] : undefined);
  }

  return;
};

var chromeStackLineParser = [CHROME_PRIORITY, chrome]; // gecko regex: `(?:bundle|\d+\.js)`: `bundle` is for react native, `\d+\.js` also but specifically for ram bundles because it
// generates filenames without a prefix like `file://` the filenames in the stacktrace are just 42.js
// We need this specific case for now because we want no other regex to match.

var geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:file|https?|blob|chrome|webpack|resource|moz-extension|capacitor).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
var geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;

var gecko = line => {
  var parts = geckoREgex.exec(line);

  if (parts) {
    var isEval = parts[3] && parts[3].indexOf(' > eval') > -1;

    if (isEval) {
      var subMatch = geckoEvalRegex.exec(parts[3]);

      if (subMatch) {
        // throw out eval line/column and use top-most line number
        parts[1] = parts[1] || 'eval';
        parts[3] = subMatch[1];
        parts[4] = subMatch[2];
        parts[5] = ''; // no column when eval
      }
    }

    let filename = parts[3];
    let func = parts[1] || UNKNOWN_FUNCTION;
    [func, filename] = extractSafariExtensionDetails(func, filename);
    return createFrame(filename, func, parts[4] ? +parts[4] : undefined, parts[5] ? +parts[5] : undefined);
  }

  return;
};

var geckoStackLineParser = [GECKO_PRIORITY, gecko];
var winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;

var winjs = line => {
  var parts = winjsRegex.exec(line);
  return parts ? createFrame(parts[2], parts[1] || UNKNOWN_FUNCTION, +parts[3], parts[4] ? +parts[4] : undefined) : undefined;
};

var winjsStackLineParser = [WINJS_PRIORITY, winjs];
var opera10Regex = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;

var opera10 = line => {
  var parts = opera10Regex.exec(line);
  return parts ? createFrame(parts[2], parts[3] || UNKNOWN_FUNCTION, +parts[1]) : undefined;
};

var opera10StackLineParser = [OPERA10_PRIORITY, opera10];
var opera11Regex = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i;

var opera11 = line => {
  var parts = opera11Regex.exec(line);
  return parts ? createFrame(parts[5], parts[3] || parts[4] || UNKNOWN_FUNCTION, +parts[1], +parts[2]) : undefined;
};

var opera11StackLineParser = [OPERA11_PRIORITY, opera11];
var defaultStackLineParsers = [chromeStackLineParser, geckoStackLineParser, winjsStackLineParser];
var defaultStackParser = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.createStackParser)(...defaultStackLineParsers);
/**
 * Safari web extensions, starting version unknown, can produce "frames-only" stacktraces.
 * What it means, is that instead of format like:
 *
 * Error: wat
 *   at function@url:row:col
 *   at function@url:row:col
 *   at function@url:row:col
 *
 * it produces something like:
 *
 *   function@url:row:col
 *   function@url:row:col
 *   function@url:row:col
 *
 * Because of that, it won't be captured by `chrome` RegExp and will fall into `Gecko` branch.
 * This function is extracted so that we can use it in both places without duplicating the logic.
 * Unfortunately "just" changing RegExp is too complicated now and making it pass all tests
 * and fix this case seems like an impossible, or at least way too time-consuming task.
 */

var extractSafariExtensionDetails = (func, filename) => {
  var isSafariExtension = func.indexOf('safari-extension') !== -1;
  var isSafariWebExtension = func.indexOf('safari-web-extension') !== -1;
  return isSafariExtension || isSafariWebExtension ? [func.indexOf('@') !== -1 ? func.split('@')[0] : UNKNOWN_FUNCTION, isSafariExtension ? "safari-extension:".concat(filename) : "safari-web-extension:".concat(filename)] : [func, filename];
};



/***/ }),

/***/ 1274:
/*!**************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/transports/fetch.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeFetchTransport": function() { return /* binding */ makeFetchTransport; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 1483);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ 2864);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/**
 * Creates a Transport that uses the Fetch API to send events to Sentry.
 */

function makeFetchTransport(options) {
  let nativeFetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getNativeFetchImplementation)();

  function makeRequest(request) {
    var requestOptions = _objectSpread({
      body: request.body,
      method: 'POST',
      referrerPolicy: 'origin',
      headers: options.headers
    }, options.fetchOptions);

    return nativeFetch(options.url, requestOptions).then(response => ({
      statusCode: response.status,
      headers: {
        'x-sentry-rate-limits': response.headers.get('X-Sentry-Rate-Limits'),
        'retry-after': response.headers.get('Retry-After')
      }
    }));
  }

  return (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.createTransport)(options, makeRequest);
}



/***/ }),

/***/ 2864:
/*!**************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/transports/utils.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getNativeFetchImplementation": function() { return /* binding */ getNativeFetchImplementation; },
/* harmony export */   "sendReport": function() { return /* binding */ sendReport; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2861);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2845);

var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
let cachedFetchImpl;
/**
 * A special usecase for incorrectly wrapped Fetch APIs in conjunction with ad-blockers.
 * Whenever someone wraps the Fetch API and returns the wrong promise chain,
 * this chain becomes orphaned and there is no possible way to capture it's rejections
 * other than allowing it bubble up to this very handler. eg.
 *
 * var f = window.fetch;
 * window.fetch = function () {
 *   var p = f.apply(this, arguments);
 *
 *   p.then(function() {
 *     console.log('hi.');
 *   });
 *
 *   return p;
 * }
 *
 * `p.then(function () { ... })` is producing a completely separate promise chain,
 * however, what's returned is `p` - the result of original `fetch` call.
 *
 * This mean, that whenever we use the Fetch API to send our own requests, _and_
 * some ad-blocker blocks it, this orphaned chain will _always_ reject,
 * effectively causing another event to be captured.
 * This makes a whole process become an infinite loop, which we need to somehow
 * deal with, and break it in one way or another.
 *
 * To deal with this issue, we are making sure that we _always_ use the real
 * browser Fetch API, instead of relying on what `window.fetch` exposes.
 * The only downside to this would be missing our own requests as breadcrumbs,
 * but because we are already not doing this, it should be just fine.
 *
 * Possible failed fetch error messages per-browser:
 *
 * Chrome:  Failed to fetch
 * Edge:    Failed to Fetch
 * Firefox: NetworkError when attempting to fetch resource
 * Safari:  resource blocked by content blocker
 */

function getNativeFetchImplementation() {
  if (cachedFetchImpl) {
    return cachedFetchImpl;
  } // Fast path to avoid DOM I/O


  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isNativeFetch)(global.fetch)) {
    return cachedFetchImpl = global.fetch.bind(global);
  }

  var document = global.document;
  let fetchImpl = global.fetch;

  if (document && typeof document.createElement === 'function') {
    try {
      var sandbox = document.createElement('iframe');
      sandbox.hidden = true;
      document.head.appendChild(sandbox);
      var contentWindow = sandbox.contentWindow;

      if (contentWindow && contentWindow.fetch) {
        fetchImpl = contentWindow.fetch;
      }

      document.head.removeChild(sandbox);
    } catch (e) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', e);
    }
  }

  return cachedFetchImpl = fetchImpl.bind(global);
}
/**
 * Sends sdk client report using sendBeacon or fetch as a fallback if available
 *
 * @param url report endpoint
 * @param body report payload
 */


function sendReport(url, body) {
  var isRealNavigator = Object.prototype.toString.call(global && global.navigator) === '[object Navigator]';
  var hasSendBeacon = isRealNavigator && typeof global.navigator.sendBeacon === 'function';

  if (hasSendBeacon) {
    // Prevent illegal invocations - https://xgwang.me/posts/you-may-not-know-beacon/#it-may-throw-error%2C-be-sure-to-catch
    var sendBeacon = global.navigator.sendBeacon.bind(global.navigator);
    sendBeacon(url, body);
  } else if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.supportsFetch)()) {
    var fetch = getNativeFetchImplementation();
    fetch(url, {
      body,
      method: 'POST',
      credentials: 'omit',
      keepalive: true
    }).then(null, error => {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.error(error);
    });
  }
}



/***/ }),

/***/ 1275:
/*!************************************************************!*\
  !*** ./node_modules/@sentry/browser/esm/transports/xhr.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makeXHRTransport": function() { return /* binding */ makeXHRTransport; }
/* harmony export */ });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ 1483);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2844);


/**
 * The DONE ready state for XmlHttpRequest
 *
 * Defining it here as a constant b/c XMLHttpRequest.DONE is not always defined
 * (e.g. during testing, it is `undefined`)
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState}
 */

var XHR_READYSTATE_DONE = 4;
/**
 * Creates a Transport that uses the XMLHttpRequest API to send events to Sentry.
 */

function makeXHRTransport(options) {
  function makeRequest(request) {
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.SyncPromise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XHR_READYSTATE_DONE) {
          resolve({
            statusCode: xhr.status,
            headers: {
              'x-sentry-rate-limits': xhr.getResponseHeader('X-Sentry-Rate-Limits'),
              'retry-after': xhr.getResponseHeader('Retry-After')
            }
          });
        }
      };

      xhr.open('POST', options.url);

      for (var header in options.headers) {
        if (Object.prototype.hasOwnProperty.call(options.headers, header)) {
          xhr.setRequestHeader(header, options.headers[header]);
        }
      }

      xhr.send(request.body);
    });
  }

  return (0,_sentry_core__WEBPACK_IMPORTED_MODULE_1__.createTransport)(options, makeRequest);
}



/***/ }),

/***/ 2852:
/*!**********************************************!*\
  !*** ./node_modules/@sentry/core/esm/api.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getEnvelopeEndpointWithUrlEncodedAuth": function() { return /* binding */ getEnvelopeEndpointWithUrlEncodedAuth; },
/* harmony export */   "getReportDialogEndpoint": function() { return /* binding */ getReportDialogEndpoint; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2851);

var SENTRY_API_VERSION = '7';
/** Returns the prefix to construct Sentry ingestion API endpoints. */

function getBaseApiEndpoint(dsn) {
  var protocol = dsn.protocol ? "".concat(dsn.protocol, ":") : '';
  var port = dsn.port ? ":".concat(dsn.port) : '';
  return "".concat(protocol, "//").concat(dsn.host).concat(port).concat(dsn.path ? "/".concat(dsn.path) : '', "/api/");
}
/** Returns the ingest API endpoint for target. */


function _getIngestEndpoint(dsn) {
  return "".concat(getBaseApiEndpoint(dsn)).concat(dsn.projectId, "/envelope/");
}
/** Returns a URL-encoded string with auth config suitable for a query string. */


function _encodedAuth(dsn) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.urlEncode)({
    // We send only the minimum set of required information. See
    // https://github.com/getsentry/sentry-javascript/issues/2572.
    sentry_key: dsn.publicKey,
    sentry_version: SENTRY_API_VERSION
  });
}
/**
 * Returns the envelope endpoint URL with auth in the query string.
 *
 * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
 */


function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnel) {
  return tunnel ? tunnel : "".concat(_getIngestEndpoint(dsn), "?").concat(_encodedAuth(dsn));
}
/** Returns the url to the report dialog endpoint. */


function getReportDialogEndpoint(dsnLike, dialogOptions) {
  var dsn = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.makeDsn)(dsnLike);
  var endpoint = "".concat(getBaseApiEndpoint(dsn), "embed/error-page/");
  let encodedOptions = "dsn=".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.dsnToString)(dsn));

  for (var key in dialogOptions) {
    if (key === 'dsn') {
      continue;
    }

    if (key === 'user') {
      var user = dialogOptions.user;

      if (!user) {
        continue;
      }

      if (user.name) {
        encodedOptions += "&name=".concat(encodeURIComponent(user.name));
      }

      if (user.email) {
        encodedOptions += "&email=".concat(encodeURIComponent(user.email));
      }
    } else {
      encodedOptions += "&".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(dialogOptions[key]));
    }
  }

  return "".concat(endpoint, "?").concat(encodedOptions);
}



/***/ }),

/***/ 2850:
/*!*****************************************************!*\
  !*** ./node_modules/@sentry/core/esm/baseclient.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseClient": function() { return /* binding */ BaseClient; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/hub */ 2843);
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @sentry/hub */ 1462);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2851);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2838);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @sentry/utils */ 2844);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @sentry/utils */ 2848);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @sentry/utils */ 2856);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @sentry/utils */ 2842);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @sentry/utils */ 2847);
/* harmony import */ var _api_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api.js */ 2852);
/* harmony import */ var _envelope_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./envelope.js */ 2854);
/* harmony import */ var _integration_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./integration.js */ 2853);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







var ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event, it is passed through
 * {@link BaseClient._prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(options);
 *   }
 *
 *   // ...
 * }
 */

class BaseClient {
  /** Options passed to the SDK. */

  /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */

  /** Array of set up integrations. */
  __init() {
    this._integrations = {};
  }
  /** Indicates whether this client's integrations have been set up. */


  __init2() {
    this._integrationsInitialized = false;
  }
  /** Number of calls being processed */


  __init3() {
    this._numProcessing = 0;
  }
  /** Holds flushable  */


  __init4() {
    this._outcomes = {};
  }
  /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */


  constructor(options) {
    ;

    BaseClient.prototype.__init.call(this);

    BaseClient.prototype.__init2.call(this);

    BaseClient.prototype.__init3.call(this);

    BaseClient.prototype.__init4.call(this);

    this._options = options;

    if (options.dsn) {
      this._dsn = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.makeDsn)(options.dsn);
      var url = (0,_api_js__WEBPACK_IMPORTED_MODULE_2__.getEnvelopeEndpointWithUrlEncodedAuth)(this._dsn, options.tunnel);
      this._transport = options.transport(_objectSpread(_objectSpread({
        recordDroppedEvent: this.recordDroppedEvent.bind(this)
      }, options.transportOptions), {}, {
        url
      }));
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn('No DSN provided, client will not do anything.');
    }
  }
  /**
   * @inheritDoc
   */


  captureException(exception, hint, scope) {
    // ensure we haven't captured this very object before
    if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.checkOrSetAlreadyCaught)(exception)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(ALREADY_SEEN_ERROR);
      return;
    }

    let eventId = hint && hint.event_id;

    this._process(this.eventFromException(exception, hint).then(event => this._captureEvent(event, hint, scope)).then(result => {
      eventId = result;
    }));

    return eventId;
  }
  /**
   * @inheritDoc
   */


  captureMessage(message, level, hint, scope) {
    let eventId = hint && hint.event_id;
    var promisedEvent = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.isPrimitive)(message) ? this.eventFromMessage(String(message), level, hint) : this.eventFromException(message, hint);

    this._process(promisedEvent.then(event => this._captureEvent(event, hint, scope)).then(result => {
      eventId = result;
    }));

    return eventId;
  }
  /**
   * @inheritDoc
   */


  captureEvent(event, hint, scope) {
    // ensure we haven't captured this very object before
    if (hint && hint.originalException && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.checkOrSetAlreadyCaught)(hint.originalException)) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log(ALREADY_SEEN_ERROR);
      return;
    }

    let eventId = hint && hint.event_id;

    this._process(this._captureEvent(event, hint, scope).then(result => {
      eventId = result;
    }));

    return eventId;
  }
  /**
   * @inheritDoc
   */


  captureSession(session) {
    if (!this._isEnabled()) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn('SDK not enabled, will not capture session.');
      return;
    }

    if (!(typeof session.release === 'string')) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn('Discarded session because of missing or non-string release');
    } else {
      this.sendSession(session); // After sending, we set init false to indicate it's not the first occurrence

      (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_6__.updateSession)(session, {
        init: false
      });
    }
  }
  /**
   * @inheritDoc
   */


  getDsn() {
    return this._dsn;
  }
  /**
   * @inheritDoc
   */


  getOptions() {
    return this._options;
  }
  /**
   * @inheritDoc
   */


  getTransport() {
    return this._transport;
  }
  /**
   * @inheritDoc
   */


  flush(timeout) {
    var transport = this._transport;

    if (transport) {
      return this._isClientDoneProcessing(timeout).then(clientFinished => {
        return transport.flush(timeout).then(transportFlushed => clientFinished && transportFlushed);
      });
    } else {
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.resolvedSyncPromise)(true);
    }
  }
  /**
   * @inheritDoc
   */


  close(timeout) {
    return this.flush(timeout).then(result => {
      this.getOptions().enabled = false;
      return result;
    });
  }
  /**
   * Sets up the integrations
   */


  setupIntegrations() {
    if (this._isEnabled() && !this._integrationsInitialized) {
      this._integrations = (0,_integration_js__WEBPACK_IMPORTED_MODULE_8__.setupIntegrations)(this._options.integrations);
      this._integrationsInitialized = true;
    }
  }
  /**
   * Gets an installed integration by its `id`.
   *
   * @returns The installed integration or `undefined` if no integration with that `id` was installed.
   */


  getIntegrationById(integrationId) {
    return this._integrations[integrationId];
  }
  /**
   * @inheritDoc
   */


  getIntegration(integration) {
    try {
      return this._integrations[integration.id] || null;
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn("Cannot retrieve integration ".concat(integration.id, " from the current Client"));
      return null;
    }
  }
  /**
   * @inheritDoc
   */


  sendEvent(event) {
    let hint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this._dsn) {
      let env = (0,_envelope_js__WEBPACK_IMPORTED_MODULE_9__.createEventEnvelope)(event, this._dsn, this._options._metadata, this._options.tunnel);

      for (var attachment of hint.attachments || []) {
        env = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_10__.addItemToEnvelope)(env, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_10__.createAttachmentEnvelopeItem)(attachment, (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_11__._optionalChain)([this, 'access', _ => _._options, 'access', _2 => _2.transportOptions, 'optionalAccess', _3 => _3.textEncoder])));
      }

      this._sendEnvelope(env);
    }
  }
  /**
   * @inheritDoc
   */


  sendSession(session) {
    if (this._dsn) {
      var env = (0,_envelope_js__WEBPACK_IMPORTED_MODULE_9__.createSessionEnvelope)(session, this._dsn, this._options._metadata, this._options.tunnel);

      this._sendEnvelope(env);
    }
  }
  /**
   * @inheritDoc
   */


  recordDroppedEvent(reason, category) {
    if (this._options.sendClientReports) {
      // We want to track each category (error, transaction, session) separately
      // but still keep the distinction between different type of outcomes.
      // We could use nested maps, but it's much easier to read and type this way.
      // A correct type for map-based implementation if we want to go that route
      // would be `Partial<Record<SentryRequestType, Partial<Record<Outcome, number>>>>`
      // With typescript 4.1 we could even use template literal types
      var key = "".concat(reason, ":").concat(category);
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log("Adding outcome: \"".concat(key, "\"")); // The following works because undefined + 1 === NaN and NaN is falsy

      this._outcomes[key] = this._outcomes[key] + 1 || 1;
    }
  }
  /** Updates existing session based on the provided event */


  _updateSessionFromEvent(session, event) {
    let crashed = false;
    let errored = false;
    var exceptions = event.exception && event.exception.values;

    if (exceptions) {
      errored = true;

      for (var ex of exceptions) {
        var mechanism = ex.mechanism;

        if (mechanism && mechanism.handled === false) {
          crashed = true;
          break;
        }
      }
    } // A session is updated and that session update is sent in only one of the two following scenarios:
    // 1. Session with non terminal status and 0 errors + an error occurred -> Will set error count to 1 and send update
    // 2. Session with non terminal status and 1 error + a crash occurred -> Will set status crashed and send update


    var sessionNonTerminal = session.status === 'ok';
    var shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;

    if (shouldUpdateAndSend) {
      (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_6__.updateSession)(session, _objectSpread(_objectSpread({}, crashed && {
        status: 'crashed'
      }), {}, {
        errors: session.errors || Number(errored || crashed)
      }));
      this.captureSession(session);
    }
  }
  /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */


  _isClientDoneProcessing(timeout) {
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_7__.SyncPromise(resolve => {
      let ticked = 0;
      var tick = 1;
      var interval = setInterval(() => {
        if (this._numProcessing == 0) {
          clearInterval(interval);
          resolve(true);
        } else {
          ticked += tick;

          if (timeout && ticked >= timeout) {
            clearInterval(interval);
            resolve(false);
          }
        }
      }, tick);
    });
  }
  /** Determines whether this SDK is enabled and a valid Dsn is present. */


  _isEnabled() {
    return this.getOptions().enabled !== false && this._dsn !== undefined;
  }
  /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A new event with more information.
   */


  _prepareEvent(event, hint, scope) {
    const {
      normalizeDepth = 3,
      normalizeMaxBreadth = 1000
    } = this.getOptions();

    var prepared = _objectSpread(_objectSpread({}, event), {}, {
      event_id: event.event_id || hint.event_id || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.uuid4)(),
      timestamp: event.timestamp || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.dateTimestampInSeconds)()
    });

    this._applyClientOptions(prepared);

    this._applyIntegrationsMetadata(prepared); // If we have scope given to us, use it as the base for further modifications.
    // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.


    let finalScope = scope;

    if (hint.captureContext) {
      finalScope = _sentry_hub__WEBPACK_IMPORTED_MODULE_13__.Scope.clone(finalScope).update(hint.captureContext);
    } // We prepare the result here with a resolved Event.


    let result = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.resolvedSyncPromise)(prepared); // This should be the last thing called, since we want that
    // {@link Hub.addEventProcessor} gets the finished prepared event.

    if (finalScope) {
      // Collect attachments from the hint and scope
      var attachments = [...(hint.attachments || []), ...finalScope.getAttachments()];

      if (attachments.length) {
        hint.attachments = attachments;
      } // In case we have a hub we reassign it.


      result = finalScope.applyToEvent(prepared, hint);
    }

    return result.then(evt => {
      if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
        return this._normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
      }

      return evt;
    });
  }
  /**
   * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
   * Normalized keys:
   * - `breadcrumbs.data`
   * - `user`
   * - `contexts`
   * - `extra`
   * @param event Event
   * @returns Normalized event
   */


  _normalizeEvent(event, depth, maxBreadth) {
    if (!event) {
      return null;
    }

    var normalized = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, event), event.breadcrumbs && {
      breadcrumbs: event.breadcrumbs.map(b => _objectSpread(_objectSpread({}, b), b.data && {
        data: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_14__.normalize)(b.data, depth, maxBreadth)
      }))
    }), event.user && {
      user: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_14__.normalize)(event.user, depth, maxBreadth)
    }), event.contexts && {
      contexts: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_14__.normalize)(event.contexts, depth, maxBreadth)
    }), event.extra && {
      extra: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_14__.normalize)(event.extra, depth, maxBreadth)
    }); // event.contexts.trace stores information about a Transaction. Similarly,
    // event.spans[] stores information about child Spans. Given that a
    // Transaction is conceptually a Span, normalization should apply to both
    // Transactions and Spans consistently.
    // For now the decision is to skip normalization of Transactions and Spans,
    // so this block overwrites the normalized event to add back the original
    // Transaction information prior to normalization.


    if (event.contexts && event.contexts.trace && normalized.contexts) {
      normalized.contexts.trace = event.contexts.trace; // event.contexts.trace.data may contain circular/dangerous data so we need to normalize it

      if (event.contexts.trace.data) {
        normalized.contexts.trace.data = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_14__.normalize)(event.contexts.trace.data, depth, maxBreadth);
      }
    } // event.spans[].data may contain circular/dangerous data so we need to normalize it


    if (event.spans) {
      normalized.spans = event.spans.map(span => {
        // We cannot use the spread operator here because `toJSON` on `span` is non-enumerable
        if (span.data) {
          span.data = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_14__.normalize)(span.data, depth, maxBreadth);
        }

        return span;
      });
    }

    return normalized;
  }
  /**
   *  Enhances event using the client configuration.
   *  It takes care of all "static" values like environment, release and `dist`,
   *  as well as truncating overly long values.
   * @param event event instance to be enhanced
   */


  _applyClientOptions(event) {
    var options = this.getOptions();
    const {
      environment,
      release,
      dist,
      maxValueLength = 250
    } = options;

    if (!('environment' in event)) {
      event.environment = 'environment' in options ? environment : 'production';
    }

    if (event.release === undefined && release !== undefined) {
      event.release = release;
    }

    if (event.dist === undefined && dist !== undefined) {
      event.dist = dist;
    }

    if (event.message) {
      event.message = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_15__.truncate)(event.message, maxValueLength);
    }

    var exception = event.exception && event.exception.values && event.exception.values[0];

    if (exception && exception.value) {
      exception.value = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_15__.truncate)(exception.value, maxValueLength);
    }

    var request = event.request;

    if (request && request.url) {
      request.url = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_15__.truncate)(request.url, maxValueLength);
    }
  }
  /**
   * This function adds all used integrations to the SDK info in the event.
   * @param event The event that will be filled with all integrations.
   */


  _applyIntegrationsMetadata(event) {
    var integrationsArray = Object.keys(this._integrations);

    if (integrationsArray.length > 0) {
      event.sdk = event.sdk || {};
      event.sdk.integrations = [...(event.sdk.integrations || []), ...integrationsArray];
    }
  }
  /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */


  _captureEvent(event) {
    let hint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let scope = arguments.length > 2 ? arguments[2] : undefined;
    return this._processEvent(event, hint, scope).then(finalEvent => {
      return finalEvent.event_id;
    }, reason => {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn(reason);
      return undefined;
    });
  }
  /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param scope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */


  _processEvent(event, hint, scope) {
    const {
      beforeSend,
      sampleRate
    } = this.getOptions();

    if (!this._isEnabled()) {
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.rejectedSyncPromise)(new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError('SDK not enabled, will not capture event.'));
    }

    var isTransaction = event.type === 'transaction'; // 1.0 === 100% events are sent
    // 0.0 === 0% events are sent
    // Sampling for transaction happens somewhere else

    if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {
      this.recordDroppedEvent('sample_rate', 'error');
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.rejectedSyncPromise)(new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError("Discarding event because it's not included in the random sample (sampling rate = ".concat(sampleRate, ")")));
    }

    return this._prepareEvent(event, hint, scope).then(prepared => {
      if (prepared === null) {
        this.recordDroppedEvent('event_processor', event.type || 'error');
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError('An event processor returned null, will not send event.');
      }

      var isInternalException = hint.data && hint.data.__sentry__ === true;

      if (isInternalException || isTransaction || !beforeSend) {
        return prepared;
      }

      var beforeSendResult = beforeSend(prepared, hint);
      return _ensureBeforeSendRv(beforeSendResult);
    }).then(processedEvent => {
      if (processedEvent === null) {
        this.recordDroppedEvent('before_send', event.type || 'error');
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError('`beforeSend` returned `null`, will not send event.');
      }

      var session = scope && scope.getSession();

      if (!isTransaction && session) {
        this._updateSessionFromEvent(session, processedEvent);
      }

      this.sendEvent(processedEvent, hint);
      return processedEvent;
    }).then(null, reason => {
      if (reason instanceof _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError) {
        throw reason;
      }

      this.captureException(reason, {
        data: {
          __sentry__: true
        },
        originalException: reason
      });
      throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError("Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ".concat(reason));
    });
  }
  /**
   * Occupies the client with processing and event
   */


  _process(promise) {
    this._numProcessing += 1;
    void promise.then(value => {
      this._numProcessing -= 1;
      return value;
    }, reason => {
      this._numProcessing -= 1;
      return reason;
    });
  }
  /**
   * @inheritdoc
   */


  _sendEnvelope(envelope) {
    if (this._transport && this._dsn) {
      this._transport.send(envelope).then(null, reason => {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.error('Error while sending event:', reason);
      });
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.error('Transport disabled');
    }
  }
  /**
   * Clears outcomes on this client and returns them.
   */


  _clearOutcomes() {
    var outcomes = this._outcomes;
    this._outcomes = {};
    return Object.keys(outcomes).map(key => {
      const [reason, category] = key.split(':');
      return {
        reason,
        category,
        quantity: outcomes[key]
      };
    });
  }
  /**
   * @inheritDoc
   */


}
/**
 * Verifies that return value of configured `beforeSend` is of expected type.
 */


function _ensureBeforeSendRv(rv) {
  var nullErr = '`beforeSend` method has to return `null` or a valid event.';

  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.isThenable)(rv)) {
    return rv.then(event => {
      if (!((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.isPlainObject)(event) || event === null)) {
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError(nullErr);
      }

      return event;
    }, e => {
      throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError("beforeSend rejected with ".concat(e));
    });
  } else if (!((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.isPlainObject)(rv) || rv === null)) {
    throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_16__.SentryError(nullErr);
  }

  return rv;
}



/***/ }),

/***/ 2854:
/*!***************************************************!*\
  !*** ./node_modules/@sentry/core/esm/envelope.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createEventEnvelope": function() { return /* binding */ createEventEnvelope; },
/* harmony export */   "createSessionEnvelope": function() { return /* binding */ createSessionEnvelope; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2851);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2848);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2837);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/** Extract sdk info from from the API metadata */

function getSdkMetadataForEnvelopeHeader(metadata) {
  if (!metadata || !metadata.sdk) {
    return;
  }

  const {
    name,
    version
  } = metadata.sdk;
  return {
    name,
    version
  };
}
/**
 * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
 * Merge with existing data if any.
 **/


function enhanceEventWithSdkInfo(event, sdkInfo) {
  if (!sdkInfo) {
    return event;
  }

  event.sdk = event.sdk || {};
  event.sdk.name = event.sdk.name || sdkInfo.name;
  event.sdk.version = event.sdk.version || sdkInfo.version;
  event.sdk.integrations = [...(event.sdk.integrations || []), ...(sdkInfo.integrations || [])];
  event.sdk.packages = [...(event.sdk.packages || []), ...(sdkInfo.packages || [])];
  return event;
}
/** Creates an envelope from a Session */


function createSessionEnvelope(session, dsn, metadata, tunnel) {
  var sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);

  var envelopeHeaders = _objectSpread(_objectSpread({
    sent_at: new Date().toISOString()
  }, sdkInfo && {
    sdk: sdkInfo
  }), !!tunnel && {
    dsn: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.dsnToString)(dsn)
  });

  var envelopeItem = 'aggregates' in session ? [{
    type: 'sessions'
  }, session] : [{
    type: 'session'
  }, session];
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.createEnvelope)(envelopeHeaders, [envelopeItem]);
}
/**
 * Create an Envelope from an event.
 */


function createEventEnvelope(event, dsn, metadata, tunnel) {
  var sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  var eventType = event.type || 'event';
  const {
    transactionSampling
  } = event.sdkProcessingMetadata || {};
  const {
    method: samplingMethod,
    rate: sampleRate
  } = transactionSampling || {};
  enhanceEventWithSdkInfo(event, metadata && metadata.sdk); // Prevent this data (which, if it exists, was used in earlier steps in the processing pipeline) from being sent to
  // sentry. (Note: Our use of this property comes and goes with whatever we might be debugging, whatever hacks we may
  // have temporarily added, etc. Even if we don't happen to be using it at some point in the future, let's not get rid
  // of this `delete`, lest we miss putting it back in the next time the property is in use.)

  delete event.sdkProcessingMetadata;
  var envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
  var eventItem = [{
    type: eventType,
    sample_rates: [{
      id: samplingMethod,
      rate: sampleRate
    }]
  }, event];
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.createEnvelope)(envelopeHeaders, [eventItem]);
}

function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
  var baggage = event.contexts && event.contexts.baggage;
  const {
    environment,
    release,
    transaction,
    userid,
    usersegment
  } = baggage || {};
  return _objectSpread(_objectSpread(_objectSpread({
    event_id: event.event_id,
    sent_at: new Date().toISOString()
  }, sdkInfo && {
    sdk: sdkInfo
  }), !!tunnel && {
    dsn: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.dsnToString)(dsn)
  }), event.type === 'transaction' && // If we don't already have a trace context in the event, we can't get the trace id, which makes adding any other
  // trace data pointless
  event.contexts && event.contexts.trace && {
    trace: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dropUndefinedKeys)(_objectSpread({
      // Trace context must be defined for transactions
      trace_id: event.contexts.trace.trace_id,
      public_key: dsn.publicKey,
      environment: environment,
      release: release,
      transaction: transaction
    }, (userid || usersegment) && {
      user: {
        id: userid,
        segment: usersegment
      }
    }))
  });
}



/***/ }),

/***/ 2853:
/*!******************************************************!*\
  !*** ./node_modules/@sentry/core/esm/integration.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getIntegrationsToSetup": function() { return /* binding */ getIntegrationsToSetup; },
/* harmony export */   "installedIntegrations": function() { return /* binding */ installedIntegrations; },
/* harmony export */   "setupIntegrations": function() { return /* binding */ setupIntegrations; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/hub */ 1462);
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/hub */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2845);



var installedIntegrations = [];
/** Map of integrations assigned to a client */

/**
 * @private
 */

function filterDuplicates(integrations) {
  return integrations.reduce((acc, integrations) => {
    if (acc.every(accIntegration => integrations.name !== accIntegration.name)) {
      acc.push(integrations);
    }

    return acc;
  }, []);
}
/** Gets integration to install */


function getIntegrationsToSetup(options) {
  var defaultIntegrations = options.defaultIntegrations && [...options.defaultIntegrations] || [];
  var userIntegrations = options.integrations;
  let integrations = [...filterDuplicates(defaultIntegrations)];

  if (Array.isArray(userIntegrations)) {
    // Filter out integrations that are also included in user options
    integrations = [...integrations.filter(integrations => userIntegrations.every(userIntegration => userIntegration.name !== integrations.name)), // And filter out duplicated user options integrations
    ...filterDuplicates(userIntegrations)];
  } else if (typeof userIntegrations === 'function') {
    integrations = userIntegrations(integrations);
    integrations = Array.isArray(integrations) ? integrations : [integrations];
  } // Make sure that if present, `Debug` integration will always run last


  var integrationsNames = integrations.map(i => i.name);
  var alwaysLastToRun = 'Debug';

  if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {
    integrations.push(...integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1));
  }

  return integrations;
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */


function setupIntegrations(integrations) {
  var integrationIndex = {};
  integrations.forEach(integration => {
    integrationIndex[integration.name] = integration;

    if (installedIntegrations.indexOf(integration.name) === -1) {
      integration.setupOnce(_sentry_hub__WEBPACK_IMPORTED_MODULE_1__.addGlobalEventProcessor, _sentry_hub__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub);
      installedIntegrations.push(integration.name);
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.log("Integration installed: ".concat(integration.name));
    }
  });
  return integrationIndex;
}



/***/ }),

/***/ 812:
/*!************************************************************************!*\
  !*** ./node_modules/@sentry/core/esm/integrations/functiontostring.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionToString": function() { return /* binding */ FunctionToString; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2837);

let originalFunctionToString;
/** Patch toString calls to return proper name for wrapped functions */

class FunctionToString {
  constructor() {
    FunctionToString.prototype.__init.call(this);
  }
  /**
   * @inheritDoc
   */


  static __initStatic() {
    this.id = 'FunctionToString';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = FunctionToString.id;
  }
  /**
   * @inheritDoc
   */


  setupOnce() {
    originalFunctionToString = Function.prototype.toString;

    Function.prototype.toString = function () {
      var context = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getOriginalFunction)(this) || this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return originalFunctionToString.apply(context, args);
    };
  }

}

FunctionToString.__initStatic();



/***/ }),

/***/ 814:
/*!**********************************************************************!*\
  !*** ./node_modules/@sentry/core/esm/integrations/inboundfilters.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "InboundFilters": function() { return /* binding */ InboundFilters; },
/* harmony export */   "_mergeOptions": function() { return /* binding */ _mergeOptions; },
/* harmony export */   "_shouldDropEvent": function() { return /* binding */ _shouldDropEvent; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2842);

 // "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.

var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
/** Options for the InboundFilters integration */

/** Inbound filters configurable by the user */

class InboundFilters {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'InboundFilters';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = InboundFilters.id;
  }

  constructor() {
    let _options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    ;
    this._options = _options;

    InboundFilters.prototype.__init.call(this);
  }
  /**
   * @inheritDoc
   */


  setupOnce(addGlobalEventProcessor, getCurrentHub) {
    var eventProcess = event => {
      var hub = getCurrentHub();

      if (hub) {
        var self = hub.getIntegration(InboundFilters);

        if (self) {
          var client = hub.getClient();
          var clientOptions = client ? client.getOptions() : {};

          var options = _mergeOptions(self._options, clientOptions);

          return _shouldDropEvent(event, options) ? null : event;
        }
      }

      return event;
    };

    eventProcess.id = this.name;
    addGlobalEventProcessor(eventProcess);
  }

}

InboundFilters.__initStatic();
/** JSDoc */


function _mergeOptions() {
  let internalOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let clientOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    allowUrls: [...(internalOptions.allowUrls || []), ...(clientOptions.allowUrls || [])],
    denyUrls: [...(internalOptions.denyUrls || []), ...(clientOptions.denyUrls || [])],
    ignoreErrors: [...(internalOptions.ignoreErrors || []), ...(clientOptions.ignoreErrors || []), ...DEFAULT_IGNORE_ERRORS],
    ignoreInternal: internalOptions.ignoreInternal !== undefined ? internalOptions.ignoreInternal : true
  };
}
/** JSDoc */


function _shouldDropEvent(event, options) {
  if (options.ignoreInternal && _isSentryError(event)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn("Event dropped due to being internal Sentry Error.\nEvent: ".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getEventDescription)(event)));
    return true;
  }

  if (_isIgnoredError(event, options.ignoreErrors)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: ".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getEventDescription)(event)));
    return true;
  }

  if (_isDeniedUrl(event, options.denyUrls)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn("Event dropped due to being matched by `denyUrls` option.\nEvent: ".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getEventDescription)(event), ".\nUrl: ").concat(_getEventFilterUrl(event)));
    return true;
  }

  if (!_isAllowedUrl(event, options.allowUrls)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn("Event dropped due to not being matched by `allowUrls` option.\nEvent: ".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getEventDescription)(event), ".\nUrl: ").concat(_getEventFilterUrl(event)));
    return true;
  }

  return false;
}

function _isIgnoredError(event, ignoreErrors) {
  if (!ignoreErrors || !ignoreErrors.length) {
    return false;
  }

  return _getPossibleEventMessages(event).some(message => ignoreErrors.some(pattern => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isMatchingPattern)(message, pattern)));
}

function _isDeniedUrl(event, denyUrls) {
  // TODO: Use Glob instead?
  if (!denyUrls || !denyUrls.length) {
    return false;
  }

  var url = _getEventFilterUrl(event);

  return !url ? false : denyUrls.some(pattern => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isMatchingPattern)(url, pattern));
}

function _isAllowedUrl(event, allowUrls) {
  // TODO: Use Glob instead?
  if (!allowUrls || !allowUrls.length) {
    return true;
  }

  var url = _getEventFilterUrl(event);

  return !url ? true : allowUrls.some(pattern => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isMatchingPattern)(url, pattern));
}

function _getPossibleEventMessages(event) {
  if (event.message) {
    return [event.message];
  }

  if (event.exception) {
    try {
      const {
        type = '',
        value = ''
      } = event.exception.values && event.exception.values[0] || {};
      return ["".concat(value), "".concat(type, ": ").concat(value)];
    } catch (oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error("Cannot extract message for event ".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getEventDescription)(event)));
      return [];
    }
  }

  return [];
}

function _isSentryError(event) {
  try {
    // @ts-ignore can't be a sentry error if undefined
    return event.exception.values[0].type === 'SentryError';
  } catch (e) {// ignore
  }

  return false;
}

function _getLastValidUrl() {
  let frames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  for (let i = frames.length - 1; i >= 0; i--) {
    var frame = frames[i];

    if (frame && frame.filename !== '<anonymous>' && frame.filename !== '[native code]') {
      return frame.filename || null;
    }
  }

  return null;
}

function _getEventFilterUrl(event) {
  try {
    let frames;

    try {
      // @ts-ignore we only care about frames if the whole thing here is defined
      frames = event.exception.values[0].stacktrace.frames;
    } catch (e) {// ignore
    }

    return frames ? _getLastValidUrl(frames) : null;
  } catch (oO) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error("Cannot extract url for event ".concat((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getEventDescription)(event)));
    return null;
  }
}



/***/ }),

/***/ 2867:
/*!*************************************************************!*\
  !*** ./node_modules/@sentry/core/esm/integrations/index.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FunctionToString": function() { return /* reexport safe */ _functiontostring_js__WEBPACK_IMPORTED_MODULE_0__.FunctionToString; },
/* harmony export */   "InboundFilters": function() { return /* reexport safe */ _inboundfilters_js__WEBPACK_IMPORTED_MODULE_1__.InboundFilters; }
/* harmony export */ });
/* harmony import */ var _functiontostring_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functiontostring.js */ 812);
/* harmony import */ var _inboundfilters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inboundfilters.js */ 814);



/***/ }),

/***/ 2866:
/*!**********************************************!*\
  !*** ./node_modules/@sentry/core/esm/sdk.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initAndBind": function() { return /* binding */ initAndBind; }
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/hub */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2845);


/** A class object that can instantiate Client objects. */

/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */

function initAndBind(clientClass, options) {
  if (options.debug === true) {
    if (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) {
      _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.enable();
    } else {
      // use `console.warn` rather than `logger.warn` since by non-debug bundles have all `logger.x` statements stripped
      console.warn('[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.');
    }
  }

  var hub = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)();
  var scope = hub.getScope();

  if (scope) {
    scope.update(options.initialScope);
  }

  var client = new clientClass(options);
  hub.bindClient(client);
}



/***/ }),

/***/ 1483:
/*!**********************************************************!*\
  !*** ./node_modules/@sentry/core/esm/transports/base.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_TRANSPORT_BUFFER_SIZE": function() { return /* binding */ DEFAULT_TRANSPORT_BUFFER_SIZE; },
/* harmony export */   "createTransport": function() { return /* binding */ createTransport; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2846);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2848);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2849);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2844);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2847);

var DEFAULT_TRANSPORT_BUFFER_SIZE = 30;
/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */

function createTransport(options, makeRequest) {
  let buffer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.makePromiseBuffer)(options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE);
  let rateLimits = {};

  var flush = timeout => buffer.drain(timeout);

  function send(envelope) {
    var filteredEnvelopeItems = []; // Drop rate limited items from envelope

    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.forEachEnvelopeItem)(envelope, (item, type) => {
      var envelopeItemDataCategory = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.envelopeItemTypeToDataCategory)(type);

      if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isRateLimited)(rateLimits, envelopeItemDataCategory)) {
        options.recordDroppedEvent('ratelimit_backoff', envelopeItemDataCategory);
      } else {
        filteredEnvelopeItems.push(item);
      }
    }); // Skip sending if envelope is empty after filtering out rate limited events

    if (filteredEnvelopeItems.length === 0) {
      return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.resolvedSyncPromise)();
    }

    var filteredEnvelope = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.createEnvelope)(envelope[0], filteredEnvelopeItems); // Creates client report for each item in an envelope

    var recordEnvelopeLoss = reason => {
      (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.forEachEnvelopeItem)(filteredEnvelope, (_, type) => {
        options.recordDroppedEvent(reason, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.envelopeItemTypeToDataCategory)(type));
      });
    };

    var requestTask = () => makeRequest({
      body: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.serializeEnvelope)(filteredEnvelope, options.textEncoder)
    }).then(response => {
      // We don't want to throw on NOK responses, but we want to at least log them
      if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.warn("Sentry responded with status code ".concat(response.statusCode, " to sent event."));
      }

      rateLimits = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.updateRateLimits)(rateLimits, response);
    }, error => {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.error('Failed while sending event:', error);
      recordEnvelopeLoss('network_error');
    });

    return buffer.add(requestTask).then(result => result, error => {
      if (error instanceof _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.SentryError) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.error('Skipped sending event due to full buffer');
        recordEnvelopeLoss('queue_overflow');
        return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.resolvedSyncPromise)();
      } else {
        throw error;
      }
    });
  }

  return {
    send,
    flush
  };
}



/***/ }),

/***/ 1482:
/*!**************************************************!*\
  !*** ./node_modules/@sentry/core/esm/version.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SDK_VERSION": function() { return /* binding */ SDK_VERSION; }
/* harmony export */ });
var SDK_VERSION = '7.2.0';


/***/ }),

/***/ 45:
/*!*************************************************!*\
  !*** ./node_modules/@sentry/hub/esm/exports.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addBreadcrumb": function() { return /* binding */ addBreadcrumb; },
/* harmony export */   "captureEvent": function() { return /* binding */ captureEvent; },
/* harmony export */   "captureException": function() { return /* binding */ captureException; },
/* harmony export */   "captureMessage": function() { return /* binding */ captureMessage; },
/* harmony export */   "configureScope": function() { return /* binding */ configureScope; },
/* harmony export */   "setContext": function() { return /* binding */ setContext; },
/* harmony export */   "setExtra": function() { return /* binding */ setExtra; },
/* harmony export */   "setExtras": function() { return /* binding */ setExtras; },
/* harmony export */   "setTag": function() { return /* binding */ setTag; },
/* harmony export */   "setTags": function() { return /* binding */ setTags; },
/* harmony export */   "setUser": function() { return /* binding */ setUser; },
/* harmony export */   "startTransaction": function() { return /* binding */ startTransaction; },
/* harmony export */   "withScope": function() { return /* binding */ withScope; }
/* harmony export */ });
/* harmony import */ var _hub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hub.js */ 95);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

 // Note: All functions in this file are typed with a return value of `ReturnType<Hub[HUB_FUNCTION]>`,
// where HUB_FUNCTION is some method on the Hub class.
//
// This is done to make sure the top level SDK methods stay in sync with the hub methods.
// Although every method here has an explicit return type, some of them (that map to void returns) do not
// contain `return` keywords. This is done to save on bundle size, as `return` is not minifiable.

/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @param captureContext Additional scope data to apply to exception event.
 * @returns The generated eventId.
 */

function captureException(exception, captureContext) {
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().captureException(exception, {
    captureContext
  });
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param Severity Define the level of the message.
 * @returns The generated eventId.
 */


function captureMessage(message, captureContext) {
  // This is necessary to provide explicit scopes upgrade, without changing the original
  // arity of the `captureMessage(message, level)` method.
  var level = typeof captureContext === 'string' ? captureContext : undefined;
  var context = typeof captureContext !== 'string' ? {
    captureContext
  } : undefined;
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().captureMessage(message, level, context);
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */


function captureEvent(event, hint) {
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().captureEvent(event, hint);
}
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */


function configureScope(callback) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().configureScope(callback);
}
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */


function addBreadcrumb(breadcrumb) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().addBreadcrumb(breadcrumb);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */


function setContext(name, context) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setContext(name, context);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */


function setExtras(extras) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setExtras(extras);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */


function setExtra(key, extra) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setExtra(key, extra);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */


function setTags(tags) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setTags(tags);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */


function setTag(key, value) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setTag(key, value);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */


function setUser(user) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().setUser(user);
}
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */


function withScope(callback) {
  (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().withScope(callback);
}
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */


function startTransaction(context, customSamplingContext) {
  return (0,_hub_js__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub)().startTransaction(_objectSpread({}, context), customSamplingContext);
}



/***/ }),

/***/ 95:
/*!*********************************************!*\
  !*** ./node_modules/@sentry/hub/esm/hub.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "API_VERSION": function() { return /* binding */ API_VERSION; },
/* harmony export */   "Hub": function() { return /* binding */ Hub; },
/* harmony export */   "getCurrentHub": function() { return /* binding */ getCurrentHub; },
/* harmony export */   "getHubFromCarrier": function() { return /* binding */ getHubFromCarrier; },
/* harmony export */   "getMainCarrier": function() { return /* binding */ getMainCarrier; },
/* harmony export */   "makeMain": function() { return /* binding */ makeMain; },
/* harmony export */   "setHubOnCarrier": function() { return /* binding */ setHubOnCarrier; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/utils */ 165);
/* harmony import */ var _scope_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scope.js */ 1462);
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./session.js */ 2843);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */

var API_VERSION = 4;
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */

var DEFAULT_BREADCRUMBS = 100;
/**
 * A layer in the process stack.
 * @hidden
 */

/**
 * @inheritDoc
 */

class Hub {
  /** Is a {@link Layer}[] containing the client and scope */
  __init() {
    this._stack = [{}];
  }
  /** Contains the last event id of a captured event.  */

  /**
   * Creates a new instance of the hub, will push one {@link Layer} into the
   * internal stack on creation.
   *
   * @param client bound to the hub.
   * @param scope bound to the hub.
   * @param version number, higher number means higher priority.
   */


  constructor(client) {
    let scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope();

    let _version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : API_VERSION;

    ;
    this._version = _version;

    Hub.prototype.__init.call(this);

    this.getStackTop().scope = scope;

    if (client) {
      this.bindClient(client);
    }
  }
  /**
   * @inheritDoc
   */


  isOlderThan(version) {
    return this._version < version;
  }
  /**
   * @inheritDoc
   */


  bindClient(client) {
    var top = this.getStackTop();
    top.client = client;

    if (client && client.setupIntegrations) {
      client.setupIntegrations();
    }
  }
  /**
   * @inheritDoc
   */


  pushScope() {
    // We want to clone the content of prev scope
    var scope = _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope.clone(this.getScope());
    this.getStack().push({
      client: this.getClient(),
      scope
    });
    return scope;
  }
  /**
   * @inheritDoc
   */


  popScope() {
    if (this.getStack().length <= 1) return false;
    return !!this.getStack().pop();
  }
  /**
   * @inheritDoc
   */


  withScope(callback) {
    var scope = this.pushScope();

    try {
      callback(scope);
    } finally {
      this.popScope();
    }
  }
  /**
   * @inheritDoc
   */


  getClient() {
    return this.getStackTop().client;
  }
  /** Returns the scope of the top stack. */


  getScope() {
    return this.getStackTop().scope;
  }
  /** Returns the scope stack for domains or the process. */


  getStack() {
    return this._stack;
  }
  /** Returns the topmost scope layer in the order domain > local > process. */


  getStackTop() {
    return this._stack[this._stack.length - 1];
  }
  /**
   * @inheritDoc
   */


  captureException(exception, hint) {
    var eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();
    var syntheticException = new Error('Sentry syntheticException');

    this._withClient((client, scope) => {
      client.captureException(exception, _objectSpread(_objectSpread({
        originalException: exception,
        syntheticException
      }, hint), {}, {
        event_id: eventId
      }), scope);
    });

    return eventId;
  }
  /**
   * @inheritDoc
   */


  captureMessage(message, level, hint) {
    var eventId = this._lastEventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();
    var syntheticException = new Error(message);

    this._withClient((client, scope) => {
      client.captureMessage(message, level, _objectSpread(_objectSpread({
        originalException: message,
        syntheticException
      }, hint), {}, {
        event_id: eventId
      }), scope);
    });

    return eventId;
  }
  /**
   * @inheritDoc
   */


  captureEvent(event, hint) {
    var eventId = hint && hint.event_id ? hint.event_id : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();

    if (event.type !== 'transaction') {
      this._lastEventId = eventId;
    }

    this._withClient((client, scope) => {
      client.captureEvent(event, _objectSpread(_objectSpread({}, hint), {}, {
        event_id: eventId
      }), scope);
    });

    return eventId;
  }
  /**
   * @inheritDoc
   */


  lastEventId() {
    return this._lastEventId;
  }
  /**
   * @inheritDoc
   */


  addBreadcrumb(breadcrumb, hint) {
    const {
      scope,
      client
    } = this.getStackTop();
    if (!scope || !client) return;
    const {
      beforeBreadcrumb = null,
      maxBreadcrumbs = DEFAULT_BREADCRUMBS
    } = client.getOptions && client.getOptions() || {};
    if (maxBreadcrumbs <= 0) return;
    var timestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dateTimestampInSeconds)();

    var mergedBreadcrumb = _objectSpread({
      timestamp
    }, breadcrumb);

    var finalBreadcrumb = beforeBreadcrumb ? (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.consoleSandbox)(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
    if (finalBreadcrumb === null) return;
    scope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
  }
  /**
   * @inheritDoc
   */


  setUser(user) {
    var scope = this.getScope();
    if (scope) scope.setUser(user);
  }
  /**
   * @inheritDoc
   */


  setTags(tags) {
    var scope = this.getScope();
    if (scope) scope.setTags(tags);
  }
  /**
   * @inheritDoc
   */


  setExtras(extras) {
    var scope = this.getScope();
    if (scope) scope.setExtras(extras);
  }
  /**
   * @inheritDoc
   */


  setTag(key, value) {
    var scope = this.getScope();
    if (scope) scope.setTag(key, value);
  }
  /**
   * @inheritDoc
   */


  setExtra(key, extra) {
    var scope = this.getScope();
    if (scope) scope.setExtra(key, extra);
  }
  /**
   * @inheritDoc
   */


  setContext(name, context) {
    var scope = this.getScope();
    if (scope) scope.setContext(name, context);
  }
  /**
   * @inheritDoc
   */


  configureScope(callback) {
    const {
      scope,
      client
    } = this.getStackTop();

    if (scope && client) {
      callback(scope);
    }
  }
  /**
   * @inheritDoc
   */


  run(callback) {
    var oldHub = makeMain(this);

    try {
      callback(this);
    } finally {
      makeMain(oldHub);
    }
  }
  /**
   * @inheritDoc
   */


  getIntegration(integration) {
    var client = this.getClient();
    if (!client) return null;

    try {
      return client.getIntegration(integration);
    } catch (_oO) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn("Cannot retrieve integration ".concat(integration.id, " from the current Hub"));
      return null;
    }
  }
  /**
   * @inheritDoc
   */


  startTransaction(context, customSamplingContext) {
    return this._callExtensionMethod('startTransaction', context, customSamplingContext);
  }
  /**
   * @inheritDoc
   */


  traceHeaders() {
    return this._callExtensionMethod('traceHeaders');
  }
  /**
   * @inheritDoc
   */


  captureSession() {
    let endSession = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    // both send the update and pull the session from the scope
    if (endSession) {
      return this.endSession();
    } // only send the update


    this._sendSessionUpdate();
  }
  /**
   * @inheritDoc
   */


  endSession() {
    var layer = this.getStackTop();
    var scope = layer && layer.scope;
    var session = scope && scope.getSession();

    if (session) {
      (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.closeSession)(session);
    }

    this._sendSessionUpdate(); // the session is over; take it off of the scope


    if (scope) {
      scope.setSession();
    }
  }
  /**
   * @inheritDoc
   */


  startSession(context) {
    const {
      scope,
      client
    } = this.getStackTop();
    const {
      release,
      environment
    } = client && client.getOptions() || {}; // Will fetch userAgent if called from browser sdk

    var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalObject)();
    const {
      userAgent
    } = global.navigator || {};
    var session = (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.makeSession)(_objectSpread(_objectSpread(_objectSpread({
      release,
      environment
    }, scope && {
      user: scope.getUser()
    }), userAgent && {
      userAgent
    }), context));

    if (scope) {
      // End existing session if there's one
      var currentSession = scope.getSession && scope.getSession();

      if (currentSession && currentSession.status === 'ok') {
        (0,_session_js__WEBPACK_IMPORTED_MODULE_4__.updateSession)(currentSession, {
          status: 'exited'
        });
      }

      this.endSession(); // Afterwards we set the new session on the scope

      scope.setSession(session);
    }

    return session;
  }
  /**
   * Sends the current Session on the scope
   */


  _sendSessionUpdate() {
    const {
      scope,
      client
    } = this.getStackTop();
    if (!scope) return;
    var session = scope.getSession();

    if (session) {
      if (client && client.captureSession) {
        client.captureSession(session);
      }
    }
  }
  /**
   * Internal helper function to call a method on the top client if it exists.
   *
   * @param method The method to call on the client.
   * @param args Arguments to pass to the client function.
   */


  _withClient(callback) {
    const {
      scope,
      client
    } = this.getStackTop();

    if (client) {
      callback(client, scope);
    }
  }
  /**
   * Calls global extension method and binding current instance to the function call
   */
  // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)


  _callExtensionMethod(method) {
    var carrier = getMainCarrier();
    var sentry = carrier.__SENTRY__;

    if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return sentry.extensions[method].apply(this, args);
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn("Extension method ".concat(method, " couldn't be found, doing nothing."));
  }

}
/**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/


function getMainCarrier() {
  var carrier = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalObject)();
  carrier.__SENTRY__ = carrier.__SENTRY__ || {
    extensions: {},
    hub: undefined
  };
  return carrier;
}
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */


function makeMain(hub) {
  var registry = getMainCarrier();
  var oldHub = getHubFromCarrier(registry);
  setHubOnCarrier(registry, hub);
  return oldHub;
}
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */


function getCurrentHub() {
  // Get main carrier (global for every environment)
  var registry = getMainCarrier(); // If there's no hub, or its an old API, assign a new one

  if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
    setHubOnCarrier(registry, new Hub());
  } // Prefer domains over global if they are there (applicable only to Node environment)


  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.isNodeEnv)()) {
    return getHubFromActiveDomain(registry);
  } // Return hub that lives on a global object


  return getHubFromCarrier(registry);
}
/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */


function getHubFromActiveDomain(registry) {
  try {
    var sentry = getMainCarrier().__SENTRY__;

    var activeDomain = sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active; // If there's no active domain, just return global hub

    if (!activeDomain) {
      return getHubFromCarrier(registry);
    } // If there's no hub on current domain, or it's an old API, assign a new one


    if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
      var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
      setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, _scope_js__WEBPACK_IMPORTED_MODULE_0__.Scope.clone(registryHubTopStack.scope)));
    } // Return hub that lives on a domain


    return getHubFromCarrier(activeDomain);
  } catch (_Oo) {
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
  }
}
/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */


function hasHubOnCarrier(carrier) {
  return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */


function getHubFromCarrier(carrier) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.getGlobalSingleton)('hub', () => new Hub(), carrier);
}
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 * @returns A boolean indicating success or failure
 */


function setHubOnCarrier(carrier, hub) {
  if (!carrier) return false;

  var __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};

  __SENTRY__.hub = hub;
  return true;
}



/***/ }),

/***/ 1462:
/*!***********************************************!*\
  !*** ./node_modules/@sentry/hub/esm/scope.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scope": function() { return /* binding */ Scope; },
/* harmony export */   "addGlobalEventProcessor": function() { return /* binding */ addGlobalEventProcessor; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2838);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2844);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./session.js */ 2843);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * Absolute maximum number of breadcrumbs added to an event.
 * The `maxBreadcrumbs` option cannot be higher than this value.
 */

var MAX_BREADCRUMBS = 100;
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */

class Scope {
  constructor() {
    Scope.prototype.__init.call(this);

    Scope.prototype.__init2.call(this);

    Scope.prototype.__init3.call(this);

    Scope.prototype.__init4.call(this);

    Scope.prototype.__init5.call(this);

    Scope.prototype.__init6.call(this);

    Scope.prototype.__init7.call(this);

    Scope.prototype.__init8.call(this);

    Scope.prototype.__init9.call(this);

    Scope.prototype.__init10.call(this);
  }
  /** Flag if notifying is happening. */


  __init() {
    this._notifyingListeners = false;
  }
  /** Callback for client to receive scope changes. */


  __init2() {
    this._scopeListeners = [];
  }
  /** Callback list that will be called after {@link applyToEvent}. */


  __init3() {
    this._eventProcessors = [];
  }
  /** Array of breadcrumbs. */


  __init4() {
    this._breadcrumbs = [];
  }
  /** User */


  __init5() {
    this._user = {};
  }
  /** Tags */


  __init6() {
    this._tags = {};
  }
  /** Extra */


  __init7() {
    this._extra = {};
  }
  /** Contexts */


  __init8() {
    this._contexts = {};
  }
  /** Fingerprint */

  /** Severity */

  /** Transaction Name */

  /** Span */

  /** Session */

  /** Request Mode Session Status */

  /** Attachments */


  __init9() {
    this._attachments = [];
  }
  /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */


  __init10() {
    this._sdkProcessingMetadata = {};
  }
  /**
   * Inherit values from the parent scope.
   * @param scope to clone.
   */


  static clone(scope) {
    var newScope = new Scope();

    if (scope) {
      newScope._breadcrumbs = [...scope._breadcrumbs];
      newScope._tags = _objectSpread({}, scope._tags);
      newScope._extra = _objectSpread({}, scope._extra);
      newScope._contexts = _objectSpread({}, scope._contexts);
      newScope._user = scope._user;
      newScope._level = scope._level;
      newScope._span = scope._span;
      newScope._session = scope._session;
      newScope._transactionName = scope._transactionName;
      newScope._fingerprint = scope._fingerprint;
      newScope._eventProcessors = [...scope._eventProcessors];
      newScope._requestSession = scope._requestSession;
      newScope._attachments = [...scope._attachments];
    }

    return newScope;
  }
  /**
   * Add internal on change listener. Used for sub SDKs that need to store the scope.
   * @hidden
   */


  addScopeListener(callback) {
    this._scopeListeners.push(callback);
  }
  /**
   * @inheritDoc
   */


  addEventProcessor(callback) {
    this._eventProcessors.push(callback);

    return this;
  }
  /**
   * @inheritDoc
   */


  setUser(user) {
    this._user = user || {};

    if (this._session) {
      (0,_session_js__WEBPACK_IMPORTED_MODULE_1__.updateSession)(this._session, {
        user
      });
    }

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  getUser() {
    return this._user;
  }
  /**
   * @inheritDoc
   */


  getRequestSession() {
    return this._requestSession;
  }
  /**
   * @inheritDoc
   */


  setRequestSession(requestSession) {
    this._requestSession = requestSession;
    return this;
  }
  /**
   * @inheritDoc
   */


  setTags(tags) {
    this._tags = _objectSpread(_objectSpread({}, this._tags), tags);

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setTag(key, value) {
    this._tags = _objectSpread(_objectSpread({}, this._tags), {}, {
      [key]: value
    });

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setExtras(extras) {
    this._extra = _objectSpread(_objectSpread({}, this._extra), extras);

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setExtra(key, extra) {
    this._extra = _objectSpread(_objectSpread({}, this._extra), {}, {
      [key]: extra
    });

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setFingerprint(fingerprint) {
    this._fingerprint = fingerprint;

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setLevel(level) {
    this._level = level;

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setTransactionName(name) {
    this._transactionName = name;

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setContext(key, context) {
    if (context === null) {
      delete this._contexts[key];
    } else {
      this._contexts = _objectSpread(_objectSpread({}, this._contexts), {}, {
        [key]: context
      });
    }

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  setSpan(span) {
    this._span = span;

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  getSpan() {
    return this._span;
  }
  /**
   * @inheritDoc
   */


  getTransaction() {
    // Often, this span (if it exists at all) will be a transaction, but it's not guaranteed to be. Regardless, it will
    // have a pointer to the currently-active transaction.
    var span = this.getSpan();
    return span && span.transaction;
  }
  /**
   * @inheritDoc
   */


  setSession(session) {
    if (!session) {
      delete this._session;
    } else {
      this._session = session;
    }

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  getSession() {
    return this._session;
  }
  /**
   * @inheritDoc
   */


  update(captureContext) {
    if (!captureContext) {
      return this;
    }

    if (typeof captureContext === 'function') {
      var updatedScope = captureContext(this);
      return updatedScope instanceof Scope ? updatedScope : this;
    }

    if (captureContext instanceof Scope) {
      this._tags = _objectSpread(_objectSpread({}, this._tags), captureContext._tags);
      this._extra = _objectSpread(_objectSpread({}, this._extra), captureContext._extra);
      this._contexts = _objectSpread(_objectSpread({}, this._contexts), captureContext._contexts);

      if (captureContext._user && Object.keys(captureContext._user).length) {
        this._user = captureContext._user;
      }

      if (captureContext._level) {
        this._level = captureContext._level;
      }

      if (captureContext._fingerprint) {
        this._fingerprint = captureContext._fingerprint;
      }

      if (captureContext._requestSession) {
        this._requestSession = captureContext._requestSession;
      }
    } else if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isPlainObject)(captureContext)) {
      captureContext = captureContext;
      this._tags = _objectSpread(_objectSpread({}, this._tags), captureContext.tags);
      this._extra = _objectSpread(_objectSpread({}, this._extra), captureContext.extra);
      this._contexts = _objectSpread(_objectSpread({}, this._contexts), captureContext.contexts);

      if (captureContext.user) {
        this._user = captureContext.user;
      }

      if (captureContext.level) {
        this._level = captureContext.level;
      }

      if (captureContext.fingerprint) {
        this._fingerprint = captureContext.fingerprint;
      }

      if (captureContext.requestSession) {
        this._requestSession = captureContext.requestSession;
      }
    }

    return this;
  }
  /**
   * @inheritDoc
   */


  clear() {
    this._breadcrumbs = [];
    this._tags = {};
    this._extra = {};
    this._user = {};
    this._contexts = {};
    this._level = undefined;
    this._transactionName = undefined;
    this._fingerprint = undefined;
    this._requestSession = undefined;
    this._span = undefined;
    this._session = undefined;

    this._notifyScopeListeners();

    this._attachments = [];
    return this;
  }
  /**
   * @inheritDoc
   */


  addBreadcrumb(breadcrumb, maxBreadcrumbs) {
    var maxCrumbs = typeof maxBreadcrumbs === 'number' ? Math.min(maxBreadcrumbs, MAX_BREADCRUMBS) : MAX_BREADCRUMBS; // No data has been changed, so don't notify scope listeners

    if (maxCrumbs <= 0) {
      return this;
    }

    var mergedBreadcrumb = _objectSpread({
      timestamp: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.dateTimestampInSeconds)()
    }, breadcrumb);

    this._breadcrumbs = [...this._breadcrumbs, mergedBreadcrumb].slice(-maxCrumbs);

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  clearBreadcrumbs() {
    this._breadcrumbs = [];

    this._notifyScopeListeners();

    return this;
  }
  /**
   * @inheritDoc
   */


  addAttachment(attachment) {
    this._attachments.push(attachment);

    return this;
  }
  /**
   * @inheritDoc
   */


  getAttachments() {
    return this._attachments;
  }
  /**
   * @inheritDoc
   */


  clearAttachments() {
    this._attachments = [];
    return this;
  }
  /**
   * Applies the current context and fingerprint to the event.
   * Note that breadcrumbs will be added by the client.
   * Also if the event has already breadcrumbs on it, we do not merge them.
   * @param event Event
   * @param hint May contain additional information about the original exception.
   * @hidden
   */


  applyToEvent(event) {
    let hint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this._extra && Object.keys(this._extra).length) {
      event.extra = _objectSpread(_objectSpread({}, this._extra), event.extra);
    }

    if (this._tags && Object.keys(this._tags).length) {
      event.tags = _objectSpread(_objectSpread({}, this._tags), event.tags);
    }

    if (this._user && Object.keys(this._user).length) {
      event.user = _objectSpread(_objectSpread({}, this._user), event.user);
    }

    if (this._contexts && Object.keys(this._contexts).length) {
      event.contexts = _objectSpread(_objectSpread({}, this._contexts), event.contexts);
    }

    if (this._level) {
      event.level = this._level;
    }

    if (this._transactionName) {
      event.transaction = this._transactionName;
    } // We want to set the trace context for normal events only if there isn't already
    // a trace context on the event. There is a product feature in place where we link
    // errors with transaction and it relies on that.


    if (this._span) {
      event.contexts = _objectSpread({
        trace: this._span.getTraceContext()
      }, event.contexts);
      var transactionName = this._span.transaction && this._span.transaction.name;

      if (transactionName) {
        event.tags = _objectSpread({
          transaction: transactionName
        }, event.tags);
      }
    }

    this._applyFingerprint(event);

    event.breadcrumbs = [...(event.breadcrumbs || []), ...this._breadcrumbs];
    event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
    event.sdkProcessingMetadata = this._sdkProcessingMetadata;
    return this._notifyEventProcessors([...getGlobalEventProcessors(), ...this._eventProcessors], event, hint);
  }
  /**
   * Add data which will be accessible during event processing but won't get sent to Sentry
   */


  setSDKProcessingMetadata(newData) {
    this._sdkProcessingMetadata = _objectSpread(_objectSpread({}, this._sdkProcessingMetadata), newData);
    return this;
  }
  /**
   * This will be called after {@link applyToEvent} is finished.
   */


  _notifyEventProcessors(processors, event, hint) {
    let index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.SyncPromise((resolve, reject) => {
      var processor = processors[index];

      if (event === null || typeof processor !== 'function') {
        resolve(event);
      } else {
        var result = processor(_objectSpread({}, event), hint);
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && processor.id && result === null && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log("Event processor \"".concat(processor.id, "\" dropped event"));

        if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isThenable)(result)) {
          void result.then(final => this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve)).then(null, reject);
        } else {
          void this._notifyEventProcessors(processors, result, hint, index + 1).then(resolve).then(null, reject);
        }
      }
    });
  }
  /**
   * This will be called on every set call.
   */


  _notifyScopeListeners() {
    // We need this check for this._notifyingListeners to be able to work on scope during updates
    // If this check is not here we'll produce endless recursion when something is done with the scope
    // during the callback.
    if (!this._notifyingListeners) {
      this._notifyingListeners = true;

      this._scopeListeners.forEach(callback => {
        callback(this);
      });

      this._notifyingListeners = false;
    }
  }
  /**
   * Applies fingerprint from the scope to the event if there's one,
   * uses message if there's one instead or get rid of empty fingerprint
   */


  _applyFingerprint(event) {
    // Make sure it's an array first and we actually have something in place
    event.fingerprint = event.fingerprint ? Array.isArray(event.fingerprint) ? event.fingerprint : [event.fingerprint] : []; // If we have something on the scope, then merge it with event

    if (this._fingerprint) {
      event.fingerprint = event.fingerprint.concat(this._fingerprint);
    } // If we have no data at all, remove empty array default


    if (event.fingerprint && !event.fingerprint.length) {
      delete event.fingerprint;
    }
  }

}
/**
 * Returns the global event processors.
 */


function getGlobalEventProcessors() {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.getGlobalSingleton)('globalEventProcessors', () => []);
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */


function addGlobalEventProcessor(callback) {
  getGlobalEventProcessors().push(callback);
}



/***/ }),

/***/ 2843:
/*!*************************************************!*\
  !*** ./node_modules/@sentry/hub/esm/session.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeSession": function() { return /* binding */ closeSession; },
/* harmony export */   "makeSession": function() { return /* binding */ makeSession; },
/* harmony export */   "updateSession": function() { return /* binding */ updateSession; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2837);

/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */

function makeSession(context) {
  // Both timestamp and started are in seconds since the UNIX epoch.
  var startingTime = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.timestampInSeconds)();
  var session = {
    sid: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)(),
    init: true,
    timestamp: startingTime,
    started: startingTime,
    duration: 0,
    status: 'ok',
    errors: 0,
    ignoreDuration: false,
    toJSON: () => sessionToJSON(session)
  };

  if (context) {
    updateSession(session, context);
  }

  return session;
}
/**
 * Updates a session object with the properties passed in the context.
 *
 * Note that this function mutates the passed object and returns void.
 * (Had to do this instead of returning a new and updated session because closing and sending a session
 * makes an update to the session after it was passed to the sending logic.
 * @see BaseClient.captureSession )
 *
 * @param session the `Session` to update
 * @param context the `SessionContext` holding the properties that should be updated in @param session
 */


function updateSession(session) {
  let context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }

    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }

  session.timestamp = context.timestamp || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.timestampInSeconds)();

  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }

  if (context.sid) {
    // Good enough uuid validation. — Kamil
    session.sid = context.sid.length === 32 ? context.sid : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.uuid4)();
  }

  if (context.init !== undefined) {
    session.init = context.init;
  }

  if (!session.did && context.did) {
    session.did = "".concat(context.did);
  }

  if (typeof context.started === 'number') {
    session.started = context.started;
  }

  if (session.ignoreDuration) {
    session.duration = undefined;
  } else if (typeof context.duration === 'number') {
    session.duration = context.duration;
  } else {
    var duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }

  if (context.release) {
    session.release = context.release;
  }

  if (context.environment) {
    session.environment = context.environment;
  }

  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }

  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }

  if (typeof context.errors === 'number') {
    session.errors = context.errors;
  }

  if (context.status) {
    session.status = context.status;
  }
}
/**
 * Closes a session by setting its status and updating the session object with it.
 * Internally calls `updateSession` to update the passed session object.
 *
 * Note that this function mutates the passed session (@see updateSession for explanation).
 *
 * @param session the `Session` object to be closed
 * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
 *               this function will keep the previously set status, unless it was `'ok'` in which case
 *               it is changed to `'exited'`.
 */


function closeSession(session, status) {
  let context = {};

  if (status) {
    context = {
      status
    };
  } else if (session.status === 'ok') {
    context = {
      status: 'exited'
    };
  }

  updateSession(session, context);
}
/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */


function sessionToJSON(session) {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dropUndefinedKeys)({
    sid: "".concat(session.sid),
    init: session.init,
    // Make sure that sec is converted to ms for date constructor
    started: new Date(session.started * 1000).toISOString(),
    timestamp: new Date(session.timestamp * 1000).toISOString(),
    status: session.status,
    errors: session.errors,
    did: typeof session.did === 'number' || typeof session.did === 'string' ? "".concat(session.did) : undefined,
    duration: session.duration,
    attrs: {
      release: session.release,
      environment: session.environment,
      ip_address: session.ipAddress,
      user_agent: session.userAgent
    }
  });
}



/***/ }),

/***/ 2869:
/*!*****************************************************!*\
  !*** ./node_modules/@sentry/react/esm/constants.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "REACT_MOUNT_OP": function() { return /* binding */ REACT_MOUNT_OP; },
/* harmony export */   "REACT_RENDER_OP": function() { return /* binding */ REACT_RENDER_OP; },
/* harmony export */   "REACT_UPDATE_OP": function() { return /* binding */ REACT_UPDATE_OP; }
/* harmony export */ });
var REACT_RENDER_OP = 'ui.react.render';
var REACT_UPDATE_OP = 'ui.react.update';
var REACT_MOUNT_OP = 'ui.react.mount';


/***/ }),

/***/ 2258:
/*!*********************************************************!*\
  !*** ./node_modules/@sentry/react/esm/errorboundary.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ErrorBoundary": function() { return /* binding */ ErrorBoundary; },
/* harmony export */   "UNKNOWN_COMPONENT": function() { return /* binding */ UNKNOWN_COMPONENT; },
/* harmony export */   "isAtLeastReact17": function() { return /* binding */ isAtLeastReact17; },
/* harmony export */   "withErrorBoundary": function() { return /* binding */ withErrorBoundary; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/browser */ 45);
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/browser */ 48);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hoist-non-react-statics */ 280);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var _jsxFileName = "/home/runner/work/sentry-javascript/sentry-javascript/packages/react/src/errorboundary.tsx";

function isAtLeastReact17(version) {
  var major = version.match(/^([^.]+)/);
  return major !== null && parseInt(major[0]) >= 17;
}

var UNKNOWN_COMPONENT = 'unknown';
var INITIAL_STATE = {
  componentStack: null,
  error: null,
  eventId: null
};
/**
 * A ErrorBoundary component that logs errors to Sentry. Requires React >= 16.
 * NOTE: If you are a Sentry user, and you are seeing this stack frame, it means the
 * Sentry React SDK ErrorBoundary caught an error invoking your application code. This
 * is expected behavior and NOT indicative of a bug with the Sentry React SDK.
 */

class ErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_2__.Component {
  constructor() {
    super(...arguments);

    ErrorBoundary.prototype.__init.call(this);

    ErrorBoundary.prototype.__init2.call(this);
  }

  __init() {
    this.state = INITIAL_STATE;
  }

  componentDidCatch(error, _ref) {
    let {
      componentStack
    } = _ref;
    const {
      beforeCapture,
      onError,
      showDialog,
      dialogOptions
    } = this.props;
    (0,_sentry_browser__WEBPACK_IMPORTED_MODULE_3__.withScope)(scope => {
      // If on React version >= 17, create stack trace from componentStack param and links
      // to to the original error using `error.cause` otherwise relies on error param for stacktrace.
      // Linking errors requires the `LinkedErrors` integration be enabled.
      if (isAtLeastReact17(react__WEBPACK_IMPORTED_MODULE_2__.version)) {
        var errorBoundaryError = new Error(error.message);
        errorBoundaryError.name = "React ErrorBoundary ".concat(errorBoundaryError.name);
        errorBoundaryError.stack = componentStack; // Using the `LinkedErrors` integration to link the errors together.

        error.cause = errorBoundaryError;
      }

      if (beforeCapture) {
        beforeCapture(scope, error, componentStack);
      }

      var eventId = (0,_sentry_browser__WEBPACK_IMPORTED_MODULE_3__.captureException)(error, {
        contexts: {
          react: {
            componentStack
          }
        }
      });

      if (onError) {
        onError(error, componentStack, eventId);
      }

      if (showDialog) {
        (0,_sentry_browser__WEBPACK_IMPORTED_MODULE_4__.showReportDialog)(_objectSpread(_objectSpread({}, dialogOptions), {}, {
          eventId
        }));
      } // componentDidCatch is used over getDerivedStateFromError
      // so that componentStack is accessible through state.


      this.setState({
        error,
        componentStack,
        eventId
      });
    });
  }

  componentDidMount() {
    const {
      onMount
    } = this.props;

    if (onMount) {
      onMount();
    }
  }

  componentWillUnmount() {
    const {
      error,
      componentStack,
      eventId
    } = this.state;
    const {
      onUnmount
    } = this.props;

    if (onUnmount) {
      onUnmount(error, componentStack, eventId);
    }
  }

  __init2() {
    this.resetErrorBoundary = () => {
      const {
        onReset
      } = this.props;
      const {
        error,
        componentStack,
        eventId
      } = this.state;

      if (onReset) {
        onReset(error, componentStack, eventId);
      }

      this.setState(INITIAL_STATE);
    };
  }

  render() {
    const {
      fallback,
      children
    } = this.props;
    const {
      error,
      componentStack,
      eventId
    } = this.state;

    if (error) {
      let element = undefined;

      if (typeof fallback === 'function') {
        element = fallback({
          error,
          componentStack,
          resetError: this.resetErrorBoundary,
          eventId
        });
      } else {
        element = fallback;
      }

      if ( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.isValidElement(element)) {
        return element;
      }

      if (fallback) {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.warn('fallback did not produce a valid ReactElement');
      } // Fail gracefully if no fallback provided or is not valid


      return null;
    }

    if (typeof children === 'function') {
      return children();
    }

    return children;
  }

}

function withErrorBoundary(WrappedComponent, errorBoundaryOptions) {
  var componentDisplayName = WrappedComponent.displayName || WrappedComponent.name || UNKNOWN_COMPONENT;

  var Wrapped = props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(ErrorBoundary, _objectSpread(_objectSpread({}, errorBoundaryOptions), {}, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 168
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(WrappedComponent, _objectSpread(_objectSpread({}, props), {}, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 169
    }
  })));

  Wrapped.displayName = "errorBoundary(".concat(componentDisplayName, ")"); // Copy over static methods from Wrapped component to Profiler HOC
  // See: https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over

  hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1___default()(Wrapped, WrappedComponent);
  return Wrapped;
}



/***/ }),

/***/ 1935:
/*!*************************************************!*\
  !*** ./node_modules/@sentry/react/esm/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Breadcrumbs": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.Breadcrumbs; },
/* harmony export */   "BrowserClient": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.BrowserClient; },
/* harmony export */   "Dedupe": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.Dedupe; },
/* harmony export */   "ErrorBoundary": function() { return /* reexport safe */ _errorboundary_js__WEBPACK_IMPORTED_MODULE_3__.ErrorBoundary; },
/* harmony export */   "FunctionToString": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.FunctionToString; },
/* harmony export */   "GlobalHandlers": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.GlobalHandlers; },
/* harmony export */   "HttpContext": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.HttpContext; },
/* harmony export */   "Hub": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.Hub; },
/* harmony export */   "InboundFilters": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.InboundFilters; },
/* harmony export */   "Integrations": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.Integrations; },
/* harmony export */   "LinkedErrors": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.LinkedErrors; },
/* harmony export */   "Profiler": function() { return /* reexport safe */ _profiler_js__WEBPACK_IMPORTED_MODULE_2__.Profiler; },
/* harmony export */   "SDK_VERSION": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION; },
/* harmony export */   "Scope": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.Scope; },
/* harmony export */   "TryCatch": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.TryCatch; },
/* harmony export */   "addBreadcrumb": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.addBreadcrumb; },
/* harmony export */   "addGlobalEventProcessor": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.addGlobalEventProcessor; },
/* harmony export */   "captureEvent": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.captureEvent; },
/* harmony export */   "captureException": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.captureException; },
/* harmony export */   "captureMessage": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.captureMessage; },
/* harmony export */   "chromeStackLineParser": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.chromeStackLineParser; },
/* harmony export */   "close": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.close; },
/* harmony export */   "configureScope": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.configureScope; },
/* harmony export */   "createReduxEnhancer": function() { return /* reexport safe */ _redux_js__WEBPACK_IMPORTED_MODULE_4__.createReduxEnhancer; },
/* harmony export */   "createTransport": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.createTransport; },
/* harmony export */   "defaultIntegrations": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.defaultIntegrations; },
/* harmony export */   "defaultStackLineParsers": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.defaultStackLineParsers; },
/* harmony export */   "defaultStackParser": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.defaultStackParser; },
/* harmony export */   "flush": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.flush; },
/* harmony export */   "forceLoad": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.forceLoad; },
/* harmony export */   "geckoStackLineParser": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.geckoStackLineParser; },
/* harmony export */   "getCurrentHub": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.getCurrentHub; },
/* harmony export */   "getHubFromCarrier": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.getHubFromCarrier; },
/* harmony export */   "init": function() { return /* reexport safe */ _sdk_js__WEBPACK_IMPORTED_MODULE_1__.init; },
/* harmony export */   "lastEventId": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.lastEventId; },
/* harmony export */   "makeFetchTransport": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.makeFetchTransport; },
/* harmony export */   "makeMain": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.makeMain; },
/* harmony export */   "makeXHRTransport": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.makeXHRTransport; },
/* harmony export */   "onLoad": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.onLoad; },
/* harmony export */   "opera10StackLineParser": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.opera10StackLineParser; },
/* harmony export */   "opera11StackLineParser": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.opera11StackLineParser; },
/* harmony export */   "reactRouterV3Instrumentation": function() { return /* reexport safe */ _reactrouterv3_js__WEBPACK_IMPORTED_MODULE_5__.reactRouterV3Instrumentation; },
/* harmony export */   "reactRouterV4Instrumentation": function() { return /* reexport safe */ _reactrouter_js__WEBPACK_IMPORTED_MODULE_6__.reactRouterV4Instrumentation; },
/* harmony export */   "reactRouterV5Instrumentation": function() { return /* reexport safe */ _reactrouter_js__WEBPACK_IMPORTED_MODULE_6__.reactRouterV5Instrumentation; },
/* harmony export */   "reactRouterV6Instrumentation": function() { return /* reexport safe */ _reactrouterv6_js__WEBPACK_IMPORTED_MODULE_7__.reactRouterV6Instrumentation; },
/* harmony export */   "setContext": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.setContext; },
/* harmony export */   "setExtra": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.setExtra; },
/* harmony export */   "setExtras": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.setExtras; },
/* harmony export */   "setTag": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.setTag; },
/* harmony export */   "setTags": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.setTags; },
/* harmony export */   "setUser": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.setUser; },
/* harmony export */   "showReportDialog": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.showReportDialog; },
/* harmony export */   "startTransaction": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.startTransaction; },
/* harmony export */   "useProfiler": function() { return /* reexport safe */ _profiler_js__WEBPACK_IMPORTED_MODULE_2__.useProfiler; },
/* harmony export */   "winjsStackLineParser": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.winjsStackLineParser; },
/* harmony export */   "withErrorBoundary": function() { return /* reexport safe */ _errorboundary_js__WEBPACK_IMPORTED_MODULE_3__.withErrorBoundary; },
/* harmony export */   "withProfiler": function() { return /* reexport safe */ _profiler_js__WEBPACK_IMPORTED_MODULE_2__.withProfiler; },
/* harmony export */   "withScope": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.withScope; },
/* harmony export */   "withSentryReactRouterV6Routing": function() { return /* reexport safe */ _reactrouterv6_js__WEBPACK_IMPORTED_MODULE_7__.withSentryReactRouterV6Routing; },
/* harmony export */   "withSentryRouting": function() { return /* reexport safe */ _reactrouter_js__WEBPACK_IMPORTED_MODULE_6__.withSentryRouting; },
/* harmony export */   "wrap": function() { return /* reexport safe */ _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.wrap; }
/* harmony export */ });
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/browser */ 2406);
/* harmony import */ var _sdk_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sdk.js */ 2489);
/* harmony import */ var _profiler_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./profiler.js */ 2211);
/* harmony import */ var _errorboundary_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./errorboundary.js */ 2258);
/* harmony import */ var _redux_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./redux.js */ 2490);
/* harmony import */ var _reactrouterv3_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reactrouterv3.js */ 2491);
/* harmony import */ var _reactrouter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./reactrouter.js */ 2212);
/* harmony import */ var _reactrouterv6_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reactrouterv6.js */ 2259);









/***/ }),

/***/ 2211:
/*!****************************************************!*\
  !*** ./node_modules/@sentry/react/esm/profiler.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Profiler": function() { return /* binding */ Profiler; },
/* harmony export */   "UNKNOWN_COMPONENT": function() { return /* binding */ UNKNOWN_COMPONENT; },
/* harmony export */   "getActiveTransaction": function() { return /* binding */ getActiveTransaction; },
/* harmony export */   "useProfiler": function() { return /* binding */ useProfiler; },
/* harmony export */   "withProfiler": function() { return /* binding */ withProfiler; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/browser */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! hoist-non-react-statics */ 280);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ 2869);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






var _jsxFileName = "/home/runner/work/sentry-javascript/sentry-javascript/packages/react/src/profiler.tsx";
var UNKNOWN_COMPONENT = 'unknown';
/**
 * The Profiler component leverages Sentry's Tracing integration to generate
 * spans based on component lifecycles.
 */

class Profiler extends react__WEBPACK_IMPORTED_MODULE_2__.Component {
  /**
   * The span of the mount activity
   * Made protected for the React Native SDK to access
   */
  __init() {
    this._mountSpan = undefined;
  }

  static __initStatic() {
    this.defaultProps = {
      disabled: false,
      includeRender: true,
      includeUpdates: true
    };
  }

  constructor(props) {
    super(props);

    Profiler.prototype.__init.call(this);

    ;
    const {
      name,
      disabled = false
    } = this.props;

    if (disabled) {
      return;
    }

    var activeTransaction = getActiveTransaction();

    if (activeTransaction) {
      this._mountSpan = activeTransaction.startChild({
        description: "<".concat(name, ">"),
        op: _constants_js__WEBPACK_IMPORTED_MODULE_3__.REACT_MOUNT_OP
      });
    }
  } // If a component mounted, we can finish the mount activity.


  componentDidMount() {
    if (this._mountSpan) {
      this._mountSpan.finish();
    }
  }

  componentDidUpdate(_ref) {
    let {
      updateProps,
      includeUpdates = true
    } = _ref;

    // Only generate an update span if hasUpdateSpan is true, if there is a valid mountSpan,
    // and if the updateProps have changed. It is ok to not do a deep equality check here as it is expensive.
    // We are just trying to give baseline clues for further investigation.
    if (includeUpdates && this._mountSpan && updateProps !== this.props.updateProps) {
      // See what props haved changed between the previous props, and the current props. This is
      // set as data on the span. We just store the prop keys as the values could be potenially very large.
      var changedProps = Object.keys(updateProps).filter(k => updateProps[k] !== this.props.updateProps[k]);

      if (changedProps.length > 0) {
        // The update span is a point in time span with 0 duration, just signifying that the component
        // has been updated.
        var now = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.timestampWithMs)();

        this._mountSpan.startChild({
          data: {
            changedProps
          },
          description: "<".concat(this.props.name, ">"),
          endTimestamp: now,
          op: _constants_js__WEBPACK_IMPORTED_MODULE_3__.REACT_UPDATE_OP,
          startTimestamp: now
        });
      }
    }
  } // If a component is unmounted, we can say it is no longer on the screen.
  // This means we can finish the span representing the component render.


  componentWillUnmount() {
    const {
      name,
      includeRender = true
    } = this.props;

    if (this._mountSpan && includeRender) {
      // If we were able to obtain the spanId of the mount activity, we should set the
      // next activity as a child to the component mount activity.
      this._mountSpan.startChild({
        description: "<".concat(name, ">"),
        endTimestamp: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.timestampWithMs)(),
        op: _constants_js__WEBPACK_IMPORTED_MODULE_3__.REACT_RENDER_OP,
        startTimestamp: this._mountSpan.endTimestamp
      });
    }
  }

  render() {
    return this.props.children;
  }

}

Profiler.__initStatic();
/**
 * withProfiler is a higher order component that wraps a
 * component in a {@link Profiler} component. It is recommended that
 * the higher order component be used over the regular {@link Profiler} component.
 *
 * @param WrappedComponent component that is wrapped by Profiler
 * @param options the {@link ProfilerProps} you can pass into the Profiler
 */


function withProfiler(WrappedComponent, // We do not want to have `updateProps` given in options, it is instead filled through the HOC.
options) {
  var componentDisplayName = options && options.name || WrappedComponent.displayName || WrappedComponent.name || UNKNOWN_COMPONENT;

  var Wrapped = props => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(Profiler, _objectSpread(_objectSpread({}, options), {}, {
    name: componentDisplayName,
    updateProps: props,
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 133
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement(WrappedComponent, _objectSpread(_objectSpread({}, props), {}, {
    __self: this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 134
    }
  })));

  Wrapped.displayName = "profiler(".concat(componentDisplayName, ")"); // Copy over static methods from Wrapped component to Profiler HOC
  // See: https://reactjs.org/docs/higher-order-components.html#static-methods-must-be-copied-over

  hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_1___default()(Wrapped, WrappedComponent);
  return Wrapped;
}
/**
 *
 * `useProfiler` is a React hook that profiles a React component.
 *
 * Requires React 16.8 or above.
 * @param name displayName of component being profiled
 */


function useProfiler(name) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    disabled: false,
    hasRenderSpan: true
  };
  const [mountSpan] = react__WEBPACK_IMPORTED_MODULE_2__.useState(() => {
    if (options && options.disabled) {
      return undefined;
    }

    var activeTransaction = getActiveTransaction();

    if (activeTransaction) {
      return activeTransaction.startChild({
        description: "<".concat(name, ">"),
        op: _constants_js__WEBPACK_IMPORTED_MODULE_3__.REACT_MOUNT_OP
      });
    }

    return undefined;
  });
  react__WEBPACK_IMPORTED_MODULE_2__.useEffect(() => {
    if (mountSpan) {
      mountSpan.finish();
    }

    return () => {
      if (mountSpan && options.hasRenderSpan) {
        mountSpan.startChild({
          description: "<".concat(name, ">"),
          endTimestamp: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.timestampWithMs)(),
          op: _constants_js__WEBPACK_IMPORTED_MODULE_3__.REACT_RENDER_OP,
          startTimestamp: mountSpan.endTimestamp
        });
      }
    }; // We only want this to run once.
  }, []);
}
/** Grabs active transaction off scope */


function getActiveTransaction() {
  let hub = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_sentry_browser__WEBPACK_IMPORTED_MODULE_5__.getCurrentHub)();

  if (hub) {
    var scope = hub.getScope();

    if (scope) {
      return scope.getTransaction();
    }
  }

  return undefined;
}



/***/ }),

/***/ 2212:
/*!*******************************************************!*\
  !*** ./node_modules/@sentry/react/esm/reactrouter.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reactRouterV4Instrumentation": function() { return /* binding */ reactRouterV4Instrumentation; },
/* harmony export */   "reactRouterV5Instrumentation": function() { return /* binding */ reactRouterV5Instrumentation; },
/* harmony export */   "withSentryRouting": function() { return /* binding */ withSentryRouting; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hoist-non-react-statics */ 280);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var _jsxFileName = "/home/runner/work/sentry-javascript/sentry-javascript/packages/react/src/reactrouter.tsx"; // We need to disable eslint no-explict-any because any is required for the
// react-router typings.

var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getGlobalObject)();
let activeTransaction;

function reactRouterV4Instrumentation(history, routes, matchPath) {
  return createReactRouterInstrumentation(history, 'react-router-v4', routes, matchPath);
}

function reactRouterV5Instrumentation(history, routes, matchPath) {
  return createReactRouterInstrumentation(history, 'react-router-v5', routes, matchPath);
}

function createReactRouterInstrumentation(history, name) {
  let allRoutes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let matchPath = arguments.length > 3 ? arguments[3] : undefined;

  function getInitPathName() {
    if (history && history.location) {
      return history.location.pathname;
    }

    if (global && global.location) {
      return global.location.pathname;
    }

    return undefined;
  }

  function getTransactionName(pathname) {
    if (allRoutes.length === 0 || !matchPath) {
      return pathname;
    }

    var branches = matchRoutes(allRoutes, pathname, matchPath);

    for (let x = 0; x < branches.length; x++) {
      if (branches[x].match.isExact) {
        return branches[x].match.path;
      }
    }

    return pathname;
  }

  return function (customStartTransaction) {
    let startTransactionOnPageLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let startTransactionOnLocationChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var initPathName = getInitPathName();

    if (startTransactionOnPageLoad && initPathName) {
      activeTransaction = customStartTransaction({
        name: getTransactionName(initPathName),
        op: 'pageload',
        tags: {
          'routing.instrumentation': name
        }
      });
    }

    if (startTransactionOnLocationChange && history.listen) {
      history.listen((location, action) => {
        if (action && (action === 'PUSH' || action === 'POP')) {
          if (activeTransaction) {
            activeTransaction.finish();
          }

          var tags = {
            'routing.instrumentation': name
          };
          activeTransaction = customStartTransaction({
            name: getTransactionName(location.pathname),
            op: 'navigation',
            tags
          });
        }
      });
    }
  };
}
/**
 * Matches a set of routes to a pathname
 * Based on implementation from
 */


function matchRoutes(routes, pathname, matchPath) {
  let branch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  routes.some(route => {
    var match = route.path ? matchPath(pathname, route) : branch.length ? branch[branch.length - 1].match // use parent match
    : computeRootMatch(pathname); // use default "root" match

    if (match) {
      branch.push({
        route,
        match
      });

      if (route.routes) {
        matchRoutes(route.routes, pathname, matchPath, branch);
      }
    }

    return !!match;
  });
  return branch;
}

function computeRootMatch(pathname) {
  return {
    path: '/',
    url: '/',
    params: {},
    isExact: pathname === '/'
  };
}

function withSentryRouting(Route) {
  var componentDisplayName = Route.displayName || Route.name;

  var WrappedRoute = props => {
    if (activeTransaction && props && props.computedMatch && props.computedMatch.isExact) {
      activeTransaction.setName(props.computedMatch.path);
    } // @ts-ignore Setting more specific React Component typing for `R` generic above
    // will break advanced type inference done by react router params:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/13dc4235c069e25fe7ee16e11f529d909f9f3ff8/types/react-router/index.d.ts#L154-L164


    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Route, _objectSpread(_objectSpread({}, props), {}, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 163
      }
    }));
  };

  WrappedRoute.displayName = "sentryRoute(".concat(componentDisplayName, ")");
  hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default()(WrappedRoute, Route); // @ts-ignore Setting more specific React Component typing for `R` generic above
  // will break advanced type inference done by react router params:
  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/13dc4235c069e25fe7ee16e11f529d909f9f3ff8/types/react-router/index.d.ts#L154-L164

  return WrappedRoute;
}



/***/ }),

/***/ 2491:
/*!*********************************************************!*\
  !*** ./node_modules/@sentry/react/esm/reactrouterv3.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reactRouterV3Instrumentation": function() { return /* binding */ reactRouterV3Instrumentation; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
 // Many of the types below had to be mocked out to prevent typescript issues
// these types are required for correct functionality.

var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
/**
 * Creates routing instrumentation for React Router v3
 * Works for React Router >= 3.2.0 and < 4.0.0
 *
 * @param history object from the `history` library
 * @param routes a list of all routes, should be
 * @param match `Router.match` utility
 */

function reactRouterV3Instrumentation(history, routes, match) {
  return function (startTransaction) {
    let startTransactionOnPageLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let startTransactionOnLocationChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    let activeTransaction;
    let prevName; // Have to use global.location because history.location might not be defined.

    if (startTransactionOnPageLoad && global && global.location) {
      normalizeTransactionName(routes, global.location, match, localName => {
        prevName = localName;
        activeTransaction = startTransaction({
          name: prevName,
          op: 'pageload',
          tags: {
            'routing.instrumentation': 'react-router-v3'
          }
        });
      });
    }

    if (startTransactionOnLocationChange && history.listen) {
      history.listen(location => {
        if (location.action === 'PUSH' || location.action === 'POP') {
          if (activeTransaction) {
            activeTransaction.finish();
          }

          var tags = {
            'routing.instrumentation': 'react-router-v3'
          };

          if (prevName) {
            tags.from = prevName;
          }

          normalizeTransactionName(routes, location, match, localName => {
            prevName = localName;
            activeTransaction = startTransaction({
              name: prevName,
              op: 'navigation',
              tags
            });
          });
        }
      });
    }
  };
}
/**
 * Normalize transaction names using `Router.match`
 */


function normalizeTransactionName(appRoutes, location, match, callback) {
  let name = location.pathname;
  match({
    location,
    routes: appRoutes
  }, (error, _redirectLocation, renderProps) => {
    if (error || !renderProps) {
      return callback(name);
    }

    var routePath = getRouteStringFromRoutes(renderProps.routes || []);

    if (routePath.length === 0 || routePath === '/*') {
      return callback(name);
    }

    name = routePath;
    return callback(name);
  });
}
/**
 * Generate route name from array of routes
 */


function getRouteStringFromRoutes(routes) {
  if (!Array.isArray(routes) || routes.length === 0) {
    return '';
  }

  var routesWithPaths = routes.filter(route => !!route.path);
  let index = -1;

  for (let x = routesWithPaths.length - 1; x >= 0; x--) {
    var route = routesWithPaths[x];

    if (route.path && route.path.startsWith('/')) {
      index = x;
      break;
    }
  }

  return routesWithPaths.slice(index).filter(_ref => {
    let {
      path
    } = _ref;
    return !!path;
  }).map(_ref2 => {
    let {
      path
    } = _ref2;
    return path;
  }).join('');
}



/***/ }),

/***/ 2259:
/*!*********************************************************!*\
  !*** ./node_modules/@sentry/react/esm/reactrouterv6.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reactRouterV6Instrumentation": function() { return /* binding */ reactRouterV6Instrumentation; },
/* harmony export */   "withSentryReactRouterV6Routing": function() { return /* binding */ withSentryReactRouterV6Routing; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hoist-non-react-statics */ 280);
/* harmony import */ var hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var _jsxFileName = "/home/runner/work/sentry-javascript/sentry-javascript/packages/react/src/reactrouterv6.tsx";
let activeTransaction;

let _useEffect;

let _useLocation;

let _useNavigationType;

let _createRoutesFromChildren;

let _matchRoutes;

let _customStartTransaction;

let _startTransactionOnLocationChange;

var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getGlobalObject)();
var SENTRY_TAGS = {
  'routing.instrumentation': 'react-router-v6'
};

function getInitPathName() {
  if (global && global.location) {
    return global.location.pathname;
  }

  return undefined;
}

function reactRouterV6Instrumentation(useEffect, useLocation, useNavigationType, createRoutesFromChildren, matchRoutes) {
  return function (customStartTransaction) {
    let startTransactionOnPageLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    let startTransactionOnLocationChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var initPathName = getInitPathName();

    if (startTransactionOnPageLoad && initPathName) {
      activeTransaction = customStartTransaction({
        name: initPathName,
        op: 'pageload',
        tags: SENTRY_TAGS
      });
    }

    _useEffect = useEffect;
    _useLocation = useLocation;
    _useNavigationType = useNavigationType;
    _matchRoutes = matchRoutes;
    _createRoutesFromChildren = createRoutesFromChildren;
    _customStartTransaction = customStartTransaction;
    _startTransactionOnLocationChange = startTransactionOnLocationChange;
  };
}

var getTransactionName = (routes, location, matchRoutes) => {
  if (!routes || routes.length === 0 || !matchRoutes) {
    return location.pathname;
  }

  var branches = matchRoutes(routes, location);

  if (branches) {
    for (let x = 0; x < branches.length; x++) {
      if (branches[x].route && branches[x].route.path && branches[x].pathname === location.pathname) {
        return branches[x].route.path || location.pathname;
      }
    }
  }

  return location.pathname;
};

function withSentryReactRouterV6Routing(Routes) {
  if (!_useEffect || !_useLocation || !_useNavigationType || !_createRoutesFromChildren || !_matchRoutes || !_customStartTransaction) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.warn('reactRouterV6Instrumentation was unable to wrap Routes because of one or more missing parameters.');
    return Routes;
  }

  let isBaseLocation = false;
  let routes;

  var SentryRoutes = props => {
    var location = _useLocation();

    var navigationType = _useNavigationType();

    _useEffect(() => {
      // Performance concern:
      // This is repeated when <Routes /> is rendered.
      routes = _createRoutesFromChildren(props.children);
      isBaseLocation = true;

      if (activeTransaction) {
        activeTransaction.setName(getTransactionName(routes, location, _matchRoutes));
      }
    }, [props.children]);

    _useEffect(() => {
      if (isBaseLocation) {
        if (activeTransaction) {
          activeTransaction.finish();
        }

        return;
      }

      if (_startTransactionOnLocationChange && (navigationType === 'PUSH' || navigationType === 'POP')) {
        if (activeTransaction) {
          activeTransaction.finish();
        }

        activeTransaction = _customStartTransaction({
          name: getTransactionName(routes, location, _matchRoutes),
          op: 'navigation',
          tags: SENTRY_TAGS
        });
      }
    }, [props.children, location, navigationType, isBaseLocation]);

    isBaseLocation = false; // @ts-ignore Setting more specific React Component typing for `R` generic above
    // will break advanced type inference done by react router params

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createElement(Routes, _objectSpread(_objectSpread({}, props), {}, {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 171
      }
    }));
  };

  hoist_non_react_statics__WEBPACK_IMPORTED_MODULE_0___default()(SentryRoutes, Routes); // @ts-ignore Setting more specific React Component typing for `R` generic above
  // will break advanced type inference done by react router params

  return SentryRoutes;
}



/***/ }),

/***/ 2490:
/*!*************************************************!*\
  !*** ./node_modules/@sentry/react/esm/redux.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createReduxEnhancer": function() { return /* binding */ createReduxEnhancer; }
/* harmony export */ });
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/browser */ 45);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var ACTION_BREADCRUMB_CATEGORY = 'redux.action';
var ACTION_BREADCRUMB_TYPE = 'info';
var STATE_CONTEXT_KEY = 'redux.state';
var defaultOptions = {
  actionTransformer: action => action,
  stateTransformer: state => state || null
};
/**
 * Creates an enhancer that would be passed to Redux's createStore to log actions and the latest state to Sentry.
 *
 * @param enhancerOptions Options to pass to the enhancer
 */

function createReduxEnhancer(enhancerOptions) {
  // Note: We return an any type as to not have type conflicts.
  var options = _objectSpread(_objectSpread({}, defaultOptions), enhancerOptions);

  return next => (reducer, initialState) => {
    var sentryReducer = (state, action) => {
      var newState = reducer(state, action);
      (0,_sentry_browser__WEBPACK_IMPORTED_MODULE_0__.configureScope)(scope => {
        /* Action breadcrumbs */
        var transformedAction = options.actionTransformer(action);

        if (typeof transformedAction !== 'undefined' && transformedAction !== null) {
          scope.addBreadcrumb({
            category: ACTION_BREADCRUMB_CATEGORY,
            data: transformedAction,
            type: ACTION_BREADCRUMB_TYPE
          });
        }
        /* Set latest state to scope */


        var transformedState = options.stateTransformer(newState);

        if (typeof transformedState !== 'undefined' && transformedState !== null) {
          scope.setContext(STATE_CONTEXT_KEY, transformedState);
        } else {
          scope.setContext(STATE_CONTEXT_KEY, null);
        }
        /* Allow user to configure scope with latest state */


        const {
          configureScopeWithState
        } = options;

        if (typeof configureScopeWithState === 'function') {
          configureScopeWithState(scope, newState);
        }
      });
      return newState;
    };

    return next(sentryReducer, initialState);
  };
}



/***/ }),

/***/ 2489:
/*!***********************************************!*\
  !*** ./node_modules/@sentry/react/esm/sdk.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "init": function() { return /* binding */ init; }
/* harmony export */ });
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/browser */ 1482);
/* harmony import */ var _sentry_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/browser */ 48);

/**
 * Inits the React SDK
 */

function init(options) {
  options._metadata = options._metadata || {};
  options._metadata.sdk = options._metadata.sdk || {
    name: 'sentry.javascript.react',
    packages: [{
      name: 'npm:@sentry/react',
      version: _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION
    }],
    version: _sentry_browser__WEBPACK_IMPORTED_MODULE_0__.SDK_VERSION
  };
  (0,_sentry_browser__WEBPACK_IMPORTED_MODULE_1__.init)(options);
}



/***/ }),

/***/ 2885:
/*!*******************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/backgroundtab.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerBackgroundTabDetection": function() { return /* binding */ registerBackgroundTabDetection; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils.js */ 2260);


var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
/**
 * Add a listener that cancels and finishes a transaction when the global
 * document is hidden.
 */

function registerBackgroundTabDetection() {
  if (global && global.document) {
    global.document.addEventListener('visibilitychange', () => {
      var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getActiveTransaction)();

      if (global.document.hidden && activeTransaction) {
        var statusType = 'cancelled';
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log("[Tracing] Transaction: ".concat(statusType, " -> since tab moved to the background, op: ").concat(activeTransaction.op)); // We should not set status if it is already set, this prevent important statuses like
        // error or data loss from being overwritten on transaction.

        if (!activeTransaction.status) {
          activeTransaction.setStatus(statusType);
        }

        activeTransaction.setTag('visibilitychange', 'document.hidden');
        activeTransaction.finish();
      }
    });
  } else {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('[Tracing] Could not set up background tab detection due to lack of global document');
  }
}



/***/ }),

/***/ 534:
/*!********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/browsertracing.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BROWSER_TRACING_INTEGRATION_ID": function() { return /* binding */ BROWSER_TRACING_INTEGRATION_ID; },
/* harmony export */   "BrowserTracing": function() { return /* binding */ BrowserTracing; },
/* harmony export */   "extractTraceDataFromMetaTags": function() { return /* binding */ extractTraceDataFromMetaTags; },
/* harmony export */   "getMetaContent": function() { return /* binding */ getMetaContent; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @sentry/utils */ 136);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @sentry/utils */ 2871);
/* harmony import */ var _hubextensions_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../hubextensions.js */ 2194);
/* harmony import */ var _idletransaction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../idletransaction.js */ 2493);
/* harmony import */ var _backgroundtab_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./backgroundtab.js */ 2885);
/* harmony import */ var _metrics_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./metrics/index.js */ 2874);
/* harmony import */ var _request_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./request.js */ 2262);
/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./router.js */ 2873);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }









var BROWSER_TRACING_INTEGRATION_ID = 'BrowserTracing';
/** Options for Browser Tracing integration */

var DEFAULT_BROWSER_TRACING_OPTIONS = _objectSpread({
  idleTimeout: _idletransaction_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_IDLE_TIMEOUT,
  finalTimeout: _idletransaction_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_FINAL_TIMEOUT,
  markBackgroundTransactions: true,
  routingInstrumentation: _router_js__WEBPACK_IMPORTED_MODULE_1__.instrumentRoutingWithDefaults,
  startTransactionOnLocationChange: true,
  startTransactionOnPageLoad: true
}, _request_js__WEBPACK_IMPORTED_MODULE_2__.defaultRequestInstrumentationOptions);
/**
 * The Browser Tracing integration automatically instruments browser pageload/navigation
 * actions as transactions, and captures requests, metrics and errors as spans.
 *
 * The integration can be configured with a variety of options, and can be extended to use
 * any routing library. This integration uses {@see IdleTransaction} to create transactions.
 */


class BrowserTracing {
  // This class currently doesn't have a static `id` field like the other integration classes, because it prevented
  // @sentry/tracing from being treeshaken. Tree shakers do not like static fields, because they behave like side effects.
  // TODO: Come up with a better plan, than using static fields on integration classes, and use that plan on all
  // integrations.

  /** Browser Tracing integration options */

  /**
   * @inheritDoc
   */
  __init() {
    this.name = BROWSER_TRACING_INTEGRATION_ID;
  }

  constructor(_options) {
    ;

    BrowserTracing.prototype.__init.call(this);

    let tracingOrigins = _request_js__WEBPACK_IMPORTED_MODULE_2__.defaultRequestInstrumentationOptions.tracingOrigins; // NOTE: Logger doesn't work in constructors, as it's initialized after integrations instances

    if (_options) {
      if (_options.tracingOrigins && Array.isArray(_options.tracingOrigins) && _options.tracingOrigins.length !== 0) {
        tracingOrigins = _options.tracingOrigins;
      } else {
        (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && (this._emitOptionsWarning = true);
      }
    }

    this.options = _objectSpread(_objectSpread(_objectSpread({}, DEFAULT_BROWSER_TRACING_OPTIONS), _options), {}, {
      tracingOrigins
    });
    const {
      _metricOptions
    } = this.options;
    (0,_metrics_index_js__WEBPACK_IMPORTED_MODULE_3__.startTrackingWebVitals)(_metricOptions && _metricOptions._reportAllChanges);
  }
  /**
   * @inheritDoc
   */


  setupOnce(_, getCurrentHub) {
    this._getCurrentHub = getCurrentHub;

    if (this._emitOptionsWarning) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.warn('[Tracing] You need to define `tracingOrigins` in the options. Set an array of urls or patterns to trace.');
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.warn("[Tracing] We added a reasonable default for you: ".concat(_request_js__WEBPACK_IMPORTED_MODULE_2__.defaultRequestInstrumentationOptions.tracingOrigins));
    }

    const {
      routingInstrumentation: instrumentRouting,
      startTransactionOnLocationChange,
      startTransactionOnPageLoad,
      markBackgroundTransactions,
      traceFetch,
      traceXHR,
      tracingOrigins,
      shouldCreateSpanForRequest
    } = this.options;
    instrumentRouting(context => this._createRouteTransaction(context), startTransactionOnPageLoad, startTransactionOnLocationChange);

    if (markBackgroundTransactions) {
      (0,_backgroundtab_js__WEBPACK_IMPORTED_MODULE_5__.registerBackgroundTabDetection)();
    }

    (0,_request_js__WEBPACK_IMPORTED_MODULE_2__.instrumentOutgoingRequests)({
      traceFetch,
      traceXHR,
      tracingOrigins,
      shouldCreateSpanForRequest
    });
  }
  /** Create routing idle transaction. */


  _createRouteTransaction(context) {
    if (!this._getCurrentHub) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.warn("[Tracing] Did not create ".concat(context.op, " transaction because _getCurrentHub is invalid."));
      return undefined;
    }

    const {
      beforeNavigate,
      idleTimeout,
      finalTimeout
    } = this.options;
    var parentContextFromHeader = context.op === 'pageload' ? extractTraceDataFromMetaTags() : undefined;

    var expandedContext = _objectSpread(_objectSpread(_objectSpread({}, context), parentContextFromHeader), {}, {
      trimEnd: true
    });

    var modifiedContext = typeof beforeNavigate === 'function' ? beforeNavigate(expandedContext) : expandedContext; // For backwards compatibility reasons, beforeNavigate can return undefined to "drop" the transaction (prevent it
    // from being sent to Sentry).

    var finalContext = modifiedContext === undefined ? _objectSpread(_objectSpread({}, expandedContext), {}, {
      sampled: false
    }) : modifiedContext;

    if (finalContext.sampled === false) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log("[Tracing] Will not send ".concat(finalContext.op, " transaction because of beforeNavigate."));
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log("[Tracing] Starting ".concat(finalContext.op, " transaction on scope"));

    var hub = this._getCurrentHub();

    const {
      location
    } = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.getGlobalObject)();
    var idleTransaction = (0,_hubextensions_js__WEBPACK_IMPORTED_MODULE_7__.startIdleTransaction)(hub, finalContext, idleTimeout, finalTimeout, true, {
      location
    } // for use in the tracesSampler
    );
    idleTransaction.registerBeforeFinishCallback(transaction => {
      (0,_metrics_index_js__WEBPACK_IMPORTED_MODULE_3__.addPerformanceEntries)(transaction);
      transaction.setTag('sentry_reportAllChanges', Boolean(this.options._metricOptions && this.options._metricOptions._reportAllChanges));
    });
    return idleTransaction;
  }

}
/**
 * Gets transaction context data from `sentry-trace` and `baggage` <meta> tags.
 * @returns Transaction context data or undefined neither tag exists or has valid data
 */


function extractTraceDataFromMetaTags() {
  var sentrytraceValue = getMetaContent('sentry-trace');
  var baggageValue = getMetaContent('baggage');
  var sentrytraceData = sentrytraceValue ? (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_8__.extractTraceparentData)(sentrytraceValue) : undefined;
  var baggage = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_9__.parseBaggageSetMutability)(baggageValue, sentrytraceValue); // TODO more extensive checks for baggage validity/emptyness?

  if (sentrytraceData || baggage) {
    return _objectSpread(_objectSpread({}, sentrytraceData && sentrytraceData), baggage && {
      metadata: {
        baggage
      }
    });
  }

  return undefined;
}
/** Returns the value of a meta tag */


function getMetaContent(metaName) {
  var globalObject = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.getGlobalObject)(); // DOM/querySelector is not available in all environments

  if (globalObject.document && globalObject.document.querySelector) {
    var el = globalObject.document.querySelector("meta[name=".concat(metaName, "]"));
    return el ? el.getAttribute('content') : null;
  } else {
    return null;
  }
}



/***/ }),

/***/ 2874:
/*!*******************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/metrics/index.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_addMeasureSpans": function() { return /* binding */ _addMeasureSpans; },
/* harmony export */   "_addResourceSpans": function() { return /* binding */ _addResourceSpans; },
/* harmony export */   "addPerformanceEntries": function() { return /* binding */ addPerformanceEntries; },
/* harmony export */   "startTrackingWebVitals": function() { return /* binding */ startTrackingWebVitals; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2870);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @sentry/utils */ 2839);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils.js */ 2260);
/* harmony import */ var _web_vitals_getCLS_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../web-vitals/getCLS.js */ 2875);
/* harmony import */ var _web_vitals_getFID_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../web-vitals/getFID.js */ 2883);
/* harmony import */ var _web_vitals_getLCP_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../web-vitals/getLCP.js */ 2881);
/* harmony import */ var _web_vitals_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../web-vitals/lib/getVisibilityWatcher.js */ 2882);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils.js */ 2884);










var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.getGlobalObject)();

function getBrowserPerformanceAPI() {
  return global && global.addEventListener && global.performance;
}

let _performanceCursor = 0;
let _measurements = {};

let _lcpEntry;

let _clsEntry;
/**
 * Start tracking web vitals
 */


function startTrackingWebVitals() {
  let reportAllChanges = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var performance = getBrowserPerformanceAPI();

  if (performance && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.browserPerformanceTimeOrigin) {
    if (performance.mark) {
      global.performance.mark('sentry-tracing-init');
    }

    _trackCLS();

    _trackLCP(reportAllChanges);

    _trackFID();
  }
}
/** Starts tracking the Cumulative Layout Shift on the current page. */


function _trackCLS() {
  // See:
  // https://web.dev/evolving-cls/
  // https://web.dev/cls-web-tooling/
  (0,_web_vitals_getCLS_js__WEBPACK_IMPORTED_MODULE_4__.getCLS)(metric => {
    var entry = metric.entries.pop();

    if (!entry) {
      return;
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding CLS');
    _measurements['cls'] = {
      value: metric.value,
      unit: 'millisecond'
    };
    _clsEntry = entry;
  });
}
/** Starts tracking the Largest Contentful Paint on the current page. */


function _trackLCP(reportAllChanges) {
  (0,_web_vitals_getLCP_js__WEBPACK_IMPORTED_MODULE_6__.getLCP)(metric => {
    var entry = metric.entries.pop();

    if (!entry) {
      return;
    }

    var timeOrigin = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.browserPerformanceTimeOrigin);
    var startTime = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.startTime);
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding LCP');
    _measurements['lcp'] = {
      value: metric.value,
      unit: 'millisecond'
    };
    _measurements['mark.lcp'] = {
      value: timeOrigin + startTime,
      unit: 'second'
    };
    _lcpEntry = entry;
  }, reportAllChanges);
}
/** Starts tracking the First Input Delay on the current page. */


function _trackFID() {
  (0,_web_vitals_getFID_js__WEBPACK_IMPORTED_MODULE_8__.getFID)(metric => {
    var entry = metric.entries.pop();

    if (!entry) {
      return;
    }

    var timeOrigin = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.browserPerformanceTimeOrigin);
    var startTime = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.startTime);
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding FID');
    _measurements['fid'] = {
      value: metric.value,
      unit: 'millisecond'
    };
    _measurements['mark.fid'] = {
      value: timeOrigin + startTime,
      unit: 'second'
    };
  });
}
/** Add performance related spans to a transaction */


function addPerformanceEntries(transaction) {
  var performance = getBrowserPerformanceAPI();

  if (!performance || !global.performance.getEntries || !_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.browserPerformanceTimeOrigin) {
    // Gatekeeper if performance API not available
    return;
  }

  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Tracing] Adding & adjusting spans using Performance API');
  var timeOrigin = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.browserPerformanceTimeOrigin);
  var performanceEntries = performance.getEntries();
  let responseStartTimestamp;
  let requestStartTimestamp;
  performanceEntries.slice(_performanceCursor).forEach(entry => {
    var startTime = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.startTime);
    var duration = (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.duration);

    if (transaction.op === 'navigation' && timeOrigin + startTime < transaction.startTimestamp) {
      return;
    }

    switch (entry.entryType) {
      case 'navigation':
        {
          _addNavigationSpans(transaction, entry, timeOrigin);

          responseStartTimestamp = timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.responseStart);
          requestStartTimestamp = timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.requestStart);
          break;
        }

      case 'mark':
      case 'paint':
      case 'measure':
        {
          var startTimestamp = _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin); // capture web vitals


          var firstHidden = (0,_web_vitals_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_9__.getVisibilityWatcher)(); // Only report if the page wasn't hidden prior to the web vital.

          var shouldRecord = entry.startTime < firstHidden.firstHiddenTime;

          if (entry.name === 'first-paint' && shouldRecord) {
            (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding FP');
            _measurements['fp'] = {
              value: entry.startTime,
              unit: 'millisecond'
            };
            _measurements['mark.fp'] = {
              value: startTimestamp,
              unit: 'second'
            };
          }

          if (entry.name === 'first-contentful-paint' && shouldRecord) {
            (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding FCP');
            _measurements['fcp'] = {
              value: entry.startTime,
              unit: 'millisecond'
            };
            _measurements['mark.fcp'] = {
              value: startTimestamp,
              unit: 'second'
            };
          }

          break;
        }

      case 'resource':
        {
          var resourceName = entry.name.replace(global.location.origin, '');

          _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin);

          break;
        }

      default: // Ignore other entry types.

    }
  });
  _performanceCursor = Math.max(performanceEntries.length - 1, 0);

  _trackNavigator(transaction); // Measurements are only available for pageload transactions


  if (transaction.op === 'pageload') {
    // Generate TTFB (Time to First Byte), which measured as the time between the beginning of the transaction and the
    // start of the response in milliseconds
    if (typeof responseStartTimestamp === 'number') {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding TTFB');
      _measurements['ttfb'] = {
        value: (responseStartTimestamp - transaction.startTimestamp) * 1000,
        unit: 'millisecond'
      };

      if (typeof requestStartTimestamp === 'number' && requestStartTimestamp <= responseStartTimestamp) {
        // Capture the time spent making the request and receiving the first byte of the response.
        // This is the time between the start of the request and the start of the response in milliseconds.
        _measurements['ttfb.requestTime'] = {
          value: (responseStartTimestamp - requestStartTimestamp) * 1000,
          unit: 'second'
        };
      }
    }

    ['fcp', 'fp', 'lcp'].forEach(name => {
      if (!_measurements[name] || timeOrigin >= transaction.startTimestamp) {
        return;
      } // The web vitals, fcp, fp, lcp, and ttfb, all measure relative to timeOrigin.
      // Unfortunately, timeOrigin is not captured within the transaction span data, so these web vitals will need
      // to be adjusted to be relative to transaction.startTimestamp.


      var oldValue = _measurements[name].value;
      var measurementTimestamp = timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(oldValue); // normalizedValue should be in milliseconds

      var normalizedValue = Math.abs((measurementTimestamp - transaction.startTimestamp) * 1000);
      var delta = normalizedValue - oldValue;
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log("[Measurements] Normalized ".concat(name, " from ").concat(oldValue, " to ").concat(normalizedValue, " (").concat(delta, ")"));
      _measurements[name].value = normalizedValue;
    });

    if (_measurements['mark.fid'] && _measurements['fid']) {
      // create span for FID
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__._startChild)(transaction, {
        description: 'first input delay',
        endTimestamp: _measurements['mark.fid'].value + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(_measurements['fid'].value),
        op: 'web.vitals',
        startTimestamp: _measurements['mark.fid'].value
      });
    } // If FCP is not recorded we should not record the cls value
    // according to the new definition of CLS.


    if (!('fcp' in _measurements)) {
      delete _measurements.cls;
    }

    Object.keys(_measurements).forEach(measurementName => {
      transaction.setMeasurement(measurementName, _measurements[measurementName].value, _measurements[measurementName].unit);
    });

    _tagMetricInfo(transaction);
  }

  _lcpEntry = undefined;
  _clsEntry = undefined;
  _measurements = {};
}
/** Create measure related spans */


function _addMeasureSpans(transaction, entry, startTime, duration, timeOrigin) {
  var measureStartTimestamp = timeOrigin + startTime;
  var measureEndTimestamp = measureStartTimestamp + duration;

  (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__._startChild)(transaction, {
    description: entry.name,
    endTimestamp: measureEndTimestamp,
    op: entry.entryType,
    startTimestamp: measureStartTimestamp
  });

  return measureStartTimestamp;
}
/** Instrument navigation entries */


function _addNavigationSpans(transaction, entry, timeOrigin) {
  ['unloadEvent', 'redirect', 'domContentLoadedEvent', 'loadEvent', 'connect'].forEach(event => {
    _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin);
  });

  _addPerformanceNavigationTiming(transaction, entry, 'secureConnection', timeOrigin, 'TLS/SSL', 'connectEnd');

  _addPerformanceNavigationTiming(transaction, entry, 'fetch', timeOrigin, 'cache', 'domainLookupStart');

  _addPerformanceNavigationTiming(transaction, entry, 'domainLookup', timeOrigin, 'DNS');

  _addRequest(transaction, entry, timeOrigin);
}
/** Create performance navigation related spans */


function _addPerformanceNavigationTiming(transaction, entry, event, timeOrigin, description, eventEnd) {
  var end = eventEnd ? entry[eventEnd] : entry["".concat(event, "End")];
  var start = entry["".concat(event, "Start")];

  if (!start || !end) {
    return;
  }

  (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__._startChild)(transaction, {
    op: 'browser',
    description: (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_11__._nullishCoalesce)(description, () => event),
    startTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(start),
    endTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(end)
  });
}
/** Create request and response related spans */


function _addRequest(transaction, entry, timeOrigin) {
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__._startChild)(transaction, {
    op: 'browser',
    description: 'request',
    startTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.requestStart),
    endTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.responseEnd)
  });

  (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__._startChild)(transaction, {
    op: 'browser',
    description: 'response',
    startTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.responseStart),
    endTimestamp: timeOrigin + (0,_utils_js__WEBPACK_IMPORTED_MODULE_7__.msToSec)(entry.responseEnd)
  });
}
/** Create resource-related spans */


function _addResourceSpans(transaction, entry, resourceName, startTime, duration, timeOrigin) {
  // we already instrument based on fetch and xhr, so we don't need to
  // duplicate spans here.
  if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') {
    return;
  }

  var data = {};

  if ('transferSize' in entry) {
    data['Transfer Size'] = entry.transferSize;
  }

  if ('encodedBodySize' in entry) {
    data['Encoded Body Size'] = entry.encodedBodySize;
  }

  if ('decodedBodySize' in entry) {
    data['Decoded Body Size'] = entry.decodedBodySize;
  }

  var startTimestamp = timeOrigin + startTime;
  var endTimestamp = startTimestamp + duration;

  (0,_utils_js__WEBPACK_IMPORTED_MODULE_10__._startChild)(transaction, {
    description: resourceName,
    endTimestamp,
    op: entry.initiatorType ? "resource.".concat(entry.initiatorType) : 'resource',
    startTimestamp,
    data
  });
}
/**
 * Capture the information of the user agent.
 */


function _trackNavigator(transaction) {
  var navigator = global.navigator;

  if (!navigator) {
    return;
  } // track network connectivity


  var connection = navigator.connection;

  if (connection) {
    if (connection.effectiveType) {
      transaction.setTag('effectiveConnectionType', connection.effectiveType);
    }

    if (connection.type) {
      transaction.setTag('connectionType', connection.type);
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.isMeasurementValue)(connection.rtt)) {
      _measurements['connection.rtt'] = {
        value: connection.rtt,
        unit: 'millisecond'
      };
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.isMeasurementValue)(connection.downlink)) {
      _measurements['connection.downlink'] = {
        value: connection.downlink,
        unit: ''
      }; // unit is empty string for now, while relay doesn't support download speed units
    }
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.isMeasurementValue)(navigator.deviceMemory)) {
    transaction.setTag('deviceMemory', "".concat(navigator.deviceMemory, " GB"));
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_10__.isMeasurementValue)(navigator.hardwareConcurrency)) {
    transaction.setTag('hardwareConcurrency', String(navigator.hardwareConcurrency));
  }
}
/** Add LCP / CLS data to transaction to allow debugging */


function _tagMetricInfo(transaction) {
  if (_lcpEntry) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding LCP Data'); // Capture Properties of the LCP element that contributes to the LCP.

    if (_lcpEntry.element) {
      transaction.setTag('lcp.element', (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.htmlTreeAsString)(_lcpEntry.element));
    }

    if (_lcpEntry.id) {
      transaction.setTag('lcp.id', _lcpEntry.id);
    }

    if (_lcpEntry.url) {
      // Trim URL to the first 200 characters.
      transaction.setTag('lcp.url', _lcpEntry.url.trim().slice(0, 200));
    }

    transaction.setTag('lcp.size', _lcpEntry.size);
  } // See: https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift


  if (_clsEntry && _clsEntry.sources) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.logger.log('[Measurements] Adding CLS Data');

    _clsEntry.sources.forEach((source, index) => transaction.setTag("cls.source.".concat(index + 1), (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_12__.htmlTreeAsString)(source.node)));
  }
}



/***/ }),

/***/ 2884:
/*!*******************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/metrics/utils.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_startChild": function() { return /* binding */ _startChild; },
/* harmony export */   "isMeasurementValue": function() { return /* binding */ isMeasurementValue; }
/* harmony export */ });
const _excluded = ["startTimestamp"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * Checks if a given value is a valid measurement value.
 */
function isMeasurementValue(value) {
  return typeof value === 'number' && isFinite(value);
}
/**
 * Helper function to start child on transactions. This function will make sure that the transaction will
 * use the start timestamp of the created child span if it is earlier than the transactions actual
 * start timestamp.
 */


function _startChild(transaction, _ref) {
  let {
    startTimestamp
  } = _ref,
      ctx = _objectWithoutProperties(_ref, _excluded);

  if (startTimestamp && transaction.startTimestamp > startTimestamp) {
    transaction.startTimestamp = startTimestamp;
  }

  return transaction.startChild(_objectSpread({
    startTimestamp
  }, ctx));
}



/***/ }),

/***/ 2262:
/*!*************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/request.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_TRACING_ORIGINS": function() { return /* binding */ DEFAULT_TRACING_ORIGINS; },
/* harmony export */   "defaultRequestInstrumentationOptions": function() { return /* binding */ defaultRequestInstrumentationOptions; },
/* harmony export */   "fetchCallback": function() { return /* binding */ fetchCallback; },
/* harmony export */   "instrumentOutgoingRequests": function() { return /* binding */ instrumentOutgoingRequests; },
/* harmony export */   "xhrCallback": function() { return /* binding */ xhrCallback; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2842);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2860);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2838);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2871);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils.js */ 2260);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var DEFAULT_TRACING_ORIGINS = ['localhost', /^\//];
/** Options for Request Instrumentation */

var defaultRequestInstrumentationOptions = {
  traceFetch: true,
  traceXHR: true,
  tracingOrigins: DEFAULT_TRACING_ORIGINS
};
/** Registers span creators for xhr and fetch requests  */

function instrumentOutgoingRequests(_options) {
  const {
    traceFetch,
    traceXHR,
    tracingOrigins,
    shouldCreateSpanForRequest
  } = _objectSpread(_objectSpread({}, defaultRequestInstrumentationOptions), _options); // We should cache url -> decision so that we don't have to compute
  // regexp everytime we create a request.


  var urlMap = {};

  var defaultShouldCreateSpan = url => {
    if (urlMap[url]) {
      return urlMap[url];
    }

    var origins = tracingOrigins;
    urlMap[url] = origins.some(origin => (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isMatchingPattern)(url, origin)) && !(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.isMatchingPattern)(url, 'sentry_key');
    return urlMap[url];
  }; // We want that our users don't have to re-implement shouldCreateSpanForRequest themselves
  // That's why we filter out already unwanted Spans from tracingOrigins


  let shouldCreateSpan = defaultShouldCreateSpan;

  if (typeof shouldCreateSpanForRequest === 'function') {
    shouldCreateSpan = url => {
      return defaultShouldCreateSpan(url) && shouldCreateSpanForRequest(url);
    };
  }

  var spans = {};

  if (traceFetch) {
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.addInstrumentationHandler)('fetch', handlerData => {
      fetchCallback(handlerData, shouldCreateSpan, spans);
    });
  }

  if (traceXHR) {
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.addInstrumentationHandler)('xhr', handlerData => {
      xhrCallback(handlerData, shouldCreateSpan, spans);
    });
  }
}
/**
 * Create and track fetch request spans
 */


function fetchCallback(handlerData, shouldCreateSpan, spans) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.hasTracingEnabled)() || !(handlerData.fetchData && shouldCreateSpan(handlerData.fetchData.url))) {
    return;
  }

  if (handlerData.endTimestamp) {
    var spanId = handlerData.fetchData.__span;
    if (!spanId) return;
    var span = spans[spanId];

    if (span) {
      if (handlerData.response) {
        // TODO (kmclb) remove this once types PR goes through
        span.setHttpStatus(handlerData.response.status);
      } else if (handlerData.error) {
        span.setStatus('internal_error');
      }

      span.finish();
      delete spans[spanId];
    }

    return;
  }

  var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getActiveTransaction)();

  if (activeTransaction) {
    var span = activeTransaction.startChild({
      data: _objectSpread(_objectSpread({}, handlerData.fetchData), {}, {
        type: 'fetch'
      }),
      description: "".concat(handlerData.fetchData.method, " ").concat(handlerData.fetchData.url),
      op: 'http.client'
    });
    handlerData.fetchData.__span = span.spanId;
    spans[span.spanId] = span;
    var request = handlerData.args[0] = handlerData.args[0];
    var options = handlerData.args[1] = handlerData.args[1] || {};
    options.headers = addTracingHeaders(request, span, options);
  }
}

function addTracingHeaders(request, span, options) {
  let headers = options.headers;

  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isInstanceOf)(request, Request)) {
    headers = request.headers;
  }

  var incomingBaggage = span.getBaggage();

  if (headers) {
    if (typeof headers.append === 'function') {
      headers.append('sentry-trace', span.toTraceparent());
      headers.append(_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.BAGGAGE_HEADER_NAME, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.mergeAndSerializeBaggage)(incomingBaggage, headers.get(_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.BAGGAGE_HEADER_NAME)));
    } else if (Array.isArray(headers)) {
      const [, headerBaggageString] = headers.find(_ref => {
        let [key, _] = _ref;
        return key === _sentry_utils__WEBPACK_IMPORTED_MODULE_5__.BAGGAGE_HEADER_NAME;
      });
      headers = [...headers, ['sentry-trace', span.toTraceparent()], [_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.BAGGAGE_HEADER_NAME, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.mergeAndSerializeBaggage)(incomingBaggage, headerBaggageString)]];
    } else {
      headers = _objectSpread(_objectSpread({}, headers), {}, {
        'sentry-trace': span.toTraceparent(),
        baggage: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.mergeAndSerializeBaggage)(incomingBaggage, headers.baggage)
      });
    }
  } else {
    headers = {
      'sentry-trace': span.toTraceparent(),
      baggage: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.mergeAndSerializeBaggage)(incomingBaggage)
    };
  }

  return headers;
}
/**
 * Create and track xhr request spans
 */


function xhrCallback(handlerData, shouldCreateSpan, spans) {
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.hasTracingEnabled)() || handlerData.xhr && handlerData.xhr.__sentry_own_request__ || !(handlerData.xhr && handlerData.xhr.__sentry_xhr__ && shouldCreateSpan(handlerData.xhr.__sentry_xhr__.url))) {
    return;
  }

  var xhr = handlerData.xhr.__sentry_xhr__; // check first if the request has finished and is tracked by an existing span which should now end

  if (handlerData.endTimestamp) {
    var spanId = handlerData.xhr.__sentry_xhr_span_id__;
    if (!spanId) return;
    var span = spans[spanId];

    if (span) {
      span.setHttpStatus(xhr.status_code);
      span.finish();
      delete spans[spanId];
    }

    return;
  } // if not, create a new span to track it


  var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getActiveTransaction)();

  if (activeTransaction) {
    var span = activeTransaction.startChild({
      data: _objectSpread(_objectSpread({}, xhr.data), {}, {
        type: 'xhr',
        method: xhr.method,
        url: xhr.url
      }),
      description: "".concat(xhr.method, " ").concat(xhr.url),
      op: 'http.client'
    });
    handlerData.xhr.__sentry_xhr_span_id__ = span.spanId;
    spans[handlerData.xhr.__sentry_xhr_span_id__] = span;

    if (handlerData.xhr.setRequestHeader) {
      try {
        handlerData.xhr.setRequestHeader('sentry-trace', span.toTraceparent());
        var headerBaggageString = handlerData.xhr.getRequestHeader && handlerData.xhr.getRequestHeader(_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.BAGGAGE_HEADER_NAME);
        handlerData.xhr.setRequestHeader(_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.BAGGAGE_HEADER_NAME, (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.mergeAndSerializeBaggage)(span.getBaggage(), headerBaggageString));
      } catch (_) {// Error: InvalidStateError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
      }
    }
  }
}



/***/ }),

/***/ 2873:
/*!************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/router.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "instrumentRoutingWithDefaults": function() { return /* binding */ instrumentRoutingWithDefaults; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2860);

var global = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
/**
 * Default function implementing pageload and navigation transactions
 */

function instrumentRoutingWithDefaults(customStartTransaction) {
  let startTransactionOnPageLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let startTransactionOnLocationChange = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!global || !global.location) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.warn('Could not initialize routing instrumentation due to invalid location');
    return;
  }

  let startingUrl = global.location.href;
  let activeTransaction;

  if (startTransactionOnPageLoad) {
    activeTransaction = customStartTransaction({
      name: global.location.pathname,
      op: 'pageload'
    });
  }

  if (startTransactionOnLocationChange) {
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.addInstrumentationHandler)('history', _ref => {
      let {
        to,
        from
      } = _ref;

      /**
       * This early return is there to account for some cases where a navigation transaction starts right after
       * long-running pageload. We make sure that if `from` is undefined and a valid `startingURL` exists, we don't
       * create an uneccessary navigation transaction.
       *
       * This was hard to duplicate, but this behavior stopped as soon as this fix was applied. This issue might also
       * only be caused in certain development environments where the usage of a hot module reloader is causing
       * errors.
       */
      if (from === undefined && startingUrl && startingUrl.indexOf(to) !== -1) {
        startingUrl = undefined;
        return;
      }

      if (from !== to) {
        startingUrl = undefined;

        if (activeTransaction) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.log("[Tracing] Finishing current transaction with op: ".concat(activeTransaction.op)); // If there's an open transaction on the scope, we need to finish it before creating an new one.

          activeTransaction.finish();
        }

        activeTransaction = customStartTransaction({
          name: global.location.pathname,
          op: 'navigation'
        });
      }
    });
  }
}



/***/ }),

/***/ 2875:
/*!***********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/getCLS.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCLS": function() { return /* binding */ getCLS; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/bindReporter.js */ 2879);
/* harmony import */ var _lib_initMetric_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/initMetric.js */ 2876);
/* harmony import */ var _lib_observe_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/observe.js */ 2878);
/* harmony import */ var _lib_onHidden_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/onHidden.js */ 2880);





/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// https://wicg.github.io/layout-instability/#sec-layout-shift

var getCLS = (onReport, reportAllChanges) => {
  var metric = (0,_lib_initMetric_js__WEBPACK_IMPORTED_MODULE_1__.initMetric)('CLS', 0);
  let report;
  let sessionValue = 0;
  let sessionEntries = [];

  var entryHandler = entry => {
    // Only count layout shifts without recent user input.
    // TODO: Figure out why entry can be undefined
    if (entry && !entry.hadRecentInput) {
      var firstSessionEntry = sessionEntries[0];
      var lastSessionEntry = sessionEntries[sessionEntries.length - 1]; // If the entry occurred less than 1 second after the previous entry and
      // less than 5 seconds after the first entry in the session, include the
      // entry in the current session. Otherwise, start a new session.

      if (sessionValue && sessionEntries.length !== 0 && entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      } // If the current session value is larger than the current CLS value,
      // update CLS and the entries contributing to it.


      if (sessionValue > metric.value) {
        metric.value = sessionValue;
        metric.entries = sessionEntries;

        if (report) {
          report();
        }
      }
    }
  };

  var po = (0,_lib_observe_js__WEBPACK_IMPORTED_MODULE_2__.observe)('layout-shift', entryHandler);

  if (po) {
    report = (0,_lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_3__.bindReporter)(onReport, metric, reportAllChanges);
    (0,_lib_onHidden_js__WEBPACK_IMPORTED_MODULE_4__.onHidden)(() => {
      po.takeRecords().map(entryHandler);
      report(true);
    });
  }
};



/***/ }),

/***/ 2883:
/*!***********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/getFID.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFID": function() { return /* binding */ getFID; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/bindReporter.js */ 2879);
/* harmony import */ var _lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/getVisibilityWatcher.js */ 2882);
/* harmony import */ var _lib_initMetric_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/initMetric.js */ 2876);
/* harmony import */ var _lib_observe_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/observe.js */ 2878);
/* harmony import */ var _lib_onHidden_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/onHidden.js */ 2880);






/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var getFID = (onReport, reportAllChanges) => {
  var visibilityWatcher = (0,_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_1__.getVisibilityWatcher)();
  var metric = (0,_lib_initMetric_js__WEBPACK_IMPORTED_MODULE_2__.initMetric)('FID');
  let report;

  var entryHandler = entry => {
    // Only report if the page wasn't hidden prior to the first input.
    if (report && entry.startTime < visibilityWatcher.firstHiddenTime) {
      metric.value = entry.processingStart - entry.startTime;
      metric.entries.push(entry);
      report(true);
    }
  };

  var po = (0,_lib_observe_js__WEBPACK_IMPORTED_MODULE_3__.observe)('first-input', entryHandler);

  if (po) {
    report = (0,_lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_4__.bindReporter)(onReport, metric, reportAllChanges);
    (0,_lib_onHidden_js__WEBPACK_IMPORTED_MODULE_5__.onHidden)(() => {
      po.takeRecords().map(entryHandler);
      po.disconnect();
    }, true);
  }
};



/***/ }),

/***/ 2881:
/*!***********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/getLCP.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLCP": function() { return /* binding */ getLCP; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/bindReporter.js */ 2879);
/* harmony import */ var _lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/getVisibilityWatcher.js */ 2882);
/* harmony import */ var _lib_initMetric_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/initMetric.js */ 2876);
/* harmony import */ var _lib_observe_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/observe.js */ 2878);
/* harmony import */ var _lib_onHidden_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/onHidden.js */ 2880);






/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// https://wicg.github.io/largest-contentful-paint/#sec-largest-contentful-paint-interface

var reportedMetricIDs = {};

var getLCP = (onReport, reportAllChanges) => {
  var visibilityWatcher = (0,_lib_getVisibilityWatcher_js__WEBPACK_IMPORTED_MODULE_1__.getVisibilityWatcher)();
  var metric = (0,_lib_initMetric_js__WEBPACK_IMPORTED_MODULE_2__.initMetric)('LCP');
  let report;

  var entryHandler = entry => {
    // The startTime attribute returns the value of the renderTime if it is not 0,
    // and the value of the loadTime otherwise.
    var value = entry.startTime; // If the page was hidden prior to paint time of the entry,
    // ignore it and mark the metric as final, otherwise add the entry.

    if (value < visibilityWatcher.firstHiddenTime) {
      metric.value = value;
      metric.entries.push(entry);
    }

    if (report) {
      report();
    }
  };

  var po = (0,_lib_observe_js__WEBPACK_IMPORTED_MODULE_3__.observe)('largest-contentful-paint', entryHandler);

  if (po) {
    report = (0,_lib_bindReporter_js__WEBPACK_IMPORTED_MODULE_4__.bindReporter)(onReport, metric, reportAllChanges);

    var stopListening = () => {
      if (!reportedMetricIDs[metric.id]) {
        po.takeRecords().map(entryHandler);
        po.disconnect();
        reportedMetricIDs[metric.id] = true;
        report(true);
      }
    }; // Stop listening after input. Note: while scrolling is an input that
    // stop LCP observation, it's unreliable since it can be programmatically
    // generated. See: https://github.com/GoogleChrome/web-vitals/issues/75


    ['keydown', 'click'].forEach(type => {
      addEventListener(type, stopListening, {
        once: true,
        capture: true
      });
    });
    (0,_lib_onHidden_js__WEBPACK_IMPORTED_MODULE_5__.onHidden)(stopListening, true);
  }
};



/***/ }),

/***/ 2879:
/*!*********************************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/bindReporter.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bindReporter": function() { return /* binding */ bindReporter; }
/* harmony export */ });
var bindReporter = (callback, metric, reportAllChanges) => {
  let prevValue;
  return forceReport => {
    if (metric.value >= 0) {
      if (forceReport || reportAllChanges) {
        metric.delta = metric.value - (prevValue || 0); // Report the metric if there's a non-zero delta or if no previous
        // value exists (which can happen in the case of the document becoming
        // hidden when the metric value is 0).
        // See: https://github.com/GoogleChrome/web-vitals/issues/14

        if (metric.delta || prevValue === undefined) {
          prevValue = metric.value;
          callback(metric);
        }
      }
    }
  };
};



/***/ }),

/***/ 2877:
/*!*************************************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/generateUniqueID.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateUniqueID": function() { return /* binding */ generateUniqueID; }
/* harmony export */ });
/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Performantly generate a unique, 30-char string by combining a version
 * number, the current timestamp with a 13-digit number integer.
 * @return {string}
 */
var generateUniqueID = () => {
  return "v2-".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12);
};



/***/ }),

/***/ 2882:
/*!*****************************************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/getVisibilityWatcher.js ***!
  \*****************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getVisibilityWatcher": function() { return /* binding */ getVisibilityWatcher; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);
/* harmony import */ var _onHidden_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./onHidden.js */ 2880);


/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let firstHiddenTime = -1;

var initHiddenTime = () => {
  return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)().document.visibilityState === 'hidden' ? 0 : Infinity;
};

var trackChanges = () => {
  // Update the time if/when the document becomes hidden.
  (0,_onHidden_js__WEBPACK_IMPORTED_MODULE_1__.onHidden)(_ref => {
    let {
      timeStamp
    } = _ref;
    firstHiddenTime = timeStamp;
  }, true);
};

var getVisibilityWatcher = () => {
  if (firstHiddenTime < 0) {
    // If the document is hidden when this code runs, assume it was hidden
    // since navigation start. This isn't a perfect heuristic, but it's the
    // best we can do until an API is available to support querying past
    // visibilityState.
    firstHiddenTime = initHiddenTime();
    trackChanges();
  }

  return {
    get firstHiddenTime() {
      return firstHiddenTime;
    }

  };
};



/***/ }),

/***/ 2876:
/*!*******************************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/initMetric.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initMetric": function() { return /* binding */ initMetric; }
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2870);
/* harmony import */ var _generateUniqueID_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./generateUniqueID.js */ 2877);



var initMetric = (name, value) => {
  return {
    name,
    value: (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_0__._nullishCoalesce)(value, () => -1),
    delta: 0,
    entries: [],
    id: (0,_generateUniqueID_js__WEBPACK_IMPORTED_MODULE_1__.generateUniqueID)()
  };
};



/***/ }),

/***/ 2878:
/*!****************************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/observe.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "observe": function() { return /* binding */ observe; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);


/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Takes a performance entry type and a callback function, and creates a
 * `PerformanceObserver` instance that will observe the specified entry type
 * with buffering enabled and call the callback _for each entry_.
 *
 * This function also feature-detects entry support and wraps the logic in a
 * try/catch to avoid errors in unsupporting browsers.
 */
var observe = (type, callback) => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(type)) {
      // More extensive feature detect needed for Firefox due to:
      // https://github.com/GoogleChrome/web-vitals/issues/142
      if (type === 'first-input' && !('PerformanceEventTiming' in self)) {
        return;
      }

      var po = new PerformanceObserver(l => l.getEntries().map(callback));
      po.observe({
        type,
        buffered: true
      });
      return po;
    }
  } catch (e) {// Do nothing.
  }

  return;
};



/***/ }),

/***/ 2880:
/*!*****************************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/browser/web-vitals/lib/onHidden.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onHidden": function() { return /* binding */ onHidden; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2840);

/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var onHidden = (cb, once) => {
  var onHiddenOrPageHide = event => {
    if (event.type === 'pagehide' || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)().document.visibilityState === 'hidden') {
      cb(event);

      if (once) {
        removeEventListener('visibilitychange', onHiddenOrPageHide, true);
        removeEventListener('pagehide', onHiddenOrPageHide, true);
      }
    }
  };

  addEventListener('visibilitychange', onHiddenOrPageHide, true); // Some browsers have buggy implementations of visibilitychange,
  // so we use pagehide in addition, just to be safe.

  addEventListener('pagehide', onHiddenOrPageHide, true);
};



/***/ }),

/***/ 2872:
/*!****************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/errors.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerErrorInstrumentation": function() { return /* binding */ registerErrorInstrumentation; }
/* harmony export */ });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2860);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ 2260);


/**
 * Configures global error listeners
 */

function registerErrorInstrumentation() {
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('error', errorCallback);
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.addInstrumentationHandler)('unhandledrejection', errorCallback);
}
/**
 * If an error or unhandled promise occurs, we mark the active transaction as failed
 */


function errorCallback() {
  var activeTransaction = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getActiveTransaction)();

  if (activeTransaction) {
    var status = 'internal_error';
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log("[Tracing] Transaction: ".concat(status, " -> Global error occured"));
    activeTransaction.setStatus(status);
  }
}



/***/ }),

/***/ 2194:
/*!***********************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/hubextensions.js ***!
  \***********************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_addTracingExtensions": function() { return /* binding */ _addTracingExtensions; },
/* harmony export */   "addExtensionMethods": function() { return /* binding */ addExtensionMethods; },
/* harmony export */   "startIdleTransaction": function() { return /* binding */ startIdleTransaction; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/hub */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2838);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @sentry/utils */ 165);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./errors.js */ 2872);
/* harmony import */ var _idletransaction_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./idletransaction.js */ 2493);
/* harmony import */ var _transaction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transaction.js */ 2492);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ 2260);
/* module decorator */ module = __webpack_require__.hmd(module);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







/** Returns all trace headers that are currently on the top scope. */

function traceHeaders() {
  var scope = this.getScope();

  if (scope) {
    var span = scope.getSpan();

    if (span) {
      return {
        'sentry-trace': span.toTraceparent()
      };
    }
  }

  return {};
}
/**
 * Makes a sampling decision for the given transaction and stores it on the transaction.
 *
 * Called every time a transaction is created. Only transactions which emerge with a `sampled` value of `true` will be
 * sent to Sentry.
 *
 * @param transaction: The transaction needing a sampling decision
 * @param options: The current client's options, so we can access `tracesSampleRate` and/or `tracesSampler`
 * @param samplingContext: Default and user-provided data which may be used to help make the decision
 *
 * @returns The given transaction with its `sampled` value set
 */


function sample(transaction, options, samplingContext) {
  // nothing to do if tracing is not enabled
  if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.hasTracingEnabled)(options)) {
    transaction.sampled = false;
    return transaction;
  } // if the user has forced a sampling decision by passing a `sampled` value in their transaction context, go with that


  if (transaction.sampled !== undefined) {
    transaction.setMetadata({
      transactionSampling: {
        method: 'explicitly_set'
      }
    });
    return transaction;
  } // we would have bailed already if neither `tracesSampler` nor `tracesSampleRate` were defined, so one of these should
  // work; prefer the hook if so


  let sampleRate;

  if (typeof options.tracesSampler === 'function') {
    sampleRate = options.tracesSampler(samplingContext);
    transaction.setMetadata({
      transactionSampling: {
        method: 'client_sampler',
        // cast to number in case it's a boolean
        rate: Number(sampleRate)
      }
    });
  } else if (samplingContext.parentSampled !== undefined) {
    sampleRate = samplingContext.parentSampled;
    transaction.setMetadata({
      transactionSampling: {
        method: 'inheritance'
      }
    });
  } else {
    sampleRate = options.tracesSampleRate;
    transaction.setMetadata({
      transactionSampling: {
        method: 'client_rate',
        // cast to number in case it's a boolean
        rate: Number(sampleRate)
      }
    });
  } // Since this is coming from the user (or from a function provided by the user), who knows what we might get. (The
  // only valid values are booleans or numbers between 0 and 1.)


  if (!isValidSampleRate(sampleRate)) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('[Tracing] Discarding transaction because of invalid sample rate.');
    transaction.sampled = false;
    return transaction;
  } // if the function returned 0 (or false), or if `tracesSampleRate` is 0, it's a sign the transaction should be dropped


  if (!sampleRate) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log("[Tracing] Discarding transaction because ".concat(typeof options.tracesSampler === 'function' ? 'tracesSampler returned 0 or false' : 'a negative sampling decision was inherited or tracesSampleRate is set to 0'));
    transaction.sampled = false;
    return transaction;
  } // Now we roll the dice. Math.random is inclusive of 0, but not of 1, so strict < is safe here. In case sampleRate is
  // a boolean, the < comparison will cause it to be automatically cast to 1 if it's true and 0 if it's false.


  transaction.sampled = Math.random() < sampleRate; // if we're not going to keep it, we're done

  if (!transaction.sampled) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log("[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ".concat(Number(sampleRate), ")"));
    return transaction;
  }

  (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log("[Tracing] starting ".concat(transaction.op, " transaction - ").concat(transaction.name));
  return transaction;
}
/**
 * Checks the given sample rate to make sure it is valid type and value (a boolean, or a number between 0 and 1).
 */


function isValidSampleRate(rate) {
  // we need to check NaN explicitly because it's of type 'number' and therefore wouldn't get caught by this typecheck
  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.isNaN)(rate) || !(typeof rate === 'number' || typeof rate === 'boolean')) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn("[Tracing] Given sample rate is invalid. Sample rate must be a boolean or a number between 0 and 1. Got ".concat(JSON.stringify(rate), " of type ").concat(JSON.stringify(typeof rate), "."));
    return false;
  } // in case sampleRate is a boolean, it will get automatically cast to 1 if it's true and 0 if it's false


  if (rate < 0 || rate > 1) {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn("[Tracing] Given sample rate is invalid. Sample rate must be between 0 and 1. Got ".concat(rate, "."));
    return false;
  }

  return true;
}
/**
 * Creates a new transaction and adds a sampling decision if it doesn't yet have one.
 *
 * The Hub.startTransaction method delegates to this method to do its work, passing the Hub instance in as `this`, as if
 * it had been called on the hub directly. Exists as a separate function so that it can be injected into the class as an
 * "extension method."
 *
 * @param this: The Hub starting the transaction
 * @param transactionContext: Data used to configure the transaction
 * @param CustomSamplingContext: Optional data to be provided to the `tracesSampler` function (if any)
 *
 * @returns The new transaction
 *
 * @see {@link Hub.startTransaction}
 */


function _startTransaction(transactionContext, customSamplingContext) {
  var client = this.getClient();
  var options = client && client.getOptions() || {};
  let transaction = new _transaction_js__WEBPACK_IMPORTED_MODULE_4__.Transaction(transactionContext, this);
  transaction = sample(transaction, options, _objectSpread({
    parentSampled: transactionContext.parentSampled,
    transactionContext
  }, customSamplingContext));

  if (transaction.sampled) {
    transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
  }

  return transaction;
}
/**
 * Create new idle transaction.
 */


function startIdleTransaction(hub, transactionContext, idleTimeout, finalTimeout, onScope, customSamplingContext) {
  var client = hub.getClient();
  var options = client && client.getOptions() || {};
  let transaction = new _idletransaction_js__WEBPACK_IMPORTED_MODULE_5__.IdleTransaction(transactionContext, hub, idleTimeout, finalTimeout, onScope);
  transaction = sample(transaction, options, _objectSpread({
    parentSampled: transactionContext.parentSampled,
    transactionContext
  }, customSamplingContext));

  if (transaction.sampled) {
    transaction.initSpanRecorder(options._experiments && options._experiments.maxSpans);
  }

  return transaction;
}
/**
 * @private
 */


function _addTracingExtensions() {
  var carrier = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_6__.getMainCarrier)();

  if (!carrier.__SENTRY__) {
    return;
  }

  carrier.__SENTRY__.extensions = carrier.__SENTRY__.extensions || {};

  if (!carrier.__SENTRY__.extensions.startTransaction) {
    carrier.__SENTRY__.extensions.startTransaction = _startTransaction;
  }

  if (!carrier.__SENTRY__.extensions.traceHeaders) {
    carrier.__SENTRY__.extensions.traceHeaders = traceHeaders;
  }
}
/**
 * @private
 */


function _autoloadDatabaseIntegrations() {
  var carrier = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_6__.getMainCarrier)();

  if (!carrier.__SENTRY__) {
    return;
  }

  var packageToIntegrationMapping = {
    mongodb() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.dynamicRequire)(module, './integrations/node/mongo');
      return new integration.Mongo();
    },

    mongoose() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.dynamicRequire)(module, './integrations/node/mongo');
      return new integration.Mongo({
        mongoose: true
      });
    },

    mysql() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.dynamicRequire)(module, './integrations/node/mysql');
      return new integration.Mysql();
    },

    pg() {
      var integration = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.dynamicRequire)(module, './integrations/node/postgres');
      return new integration.Postgres();
    }

  };
  var mappedPackages = Object.keys(packageToIntegrationMapping).filter(moduleName => !!(0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.loadModule)(moduleName)).map(pkg => {
    try {
      return packageToIntegrationMapping[pkg]();
    } catch (e) {
      return undefined;
    }
  }).filter(p => p);

  if (mappedPackages.length > 0) {
    carrier.__SENTRY__.integrations = [...(carrier.__SENTRY__.integrations || []), ...mappedPackages];
  }
}
/**
 * This patches the global object and injects the Tracing extensions methods
 */


function addExtensionMethods() {
  _addTracingExtensions(); // Detect and automatically load specified integrations.


  if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_7__.isNodeEnv)()) {
    _autoloadDatabaseIntegrations();
  } // If an error happens globally, we should make sure transaction status is set to error.


  (0,_errors_js__WEBPACK_IMPORTED_MODULE_8__.registerErrorInstrumentation)();
}



/***/ }),

/***/ 2493:
/*!*************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/idletransaction.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_FINAL_TIMEOUT": function() { return /* binding */ DEFAULT_FINAL_TIMEOUT; },
/* harmony export */   "DEFAULT_IDLE_TIMEOUT": function() { return /* binding */ DEFAULT_IDLE_TIMEOUT; },
/* harmony export */   "HEARTBEAT_INTERVAL": function() { return /* binding */ HEARTBEAT_INTERVAL; },
/* harmony export */   "IdleTransaction": function() { return /* binding */ IdleTransaction; },
/* harmony export */   "IdleTransactionSpanRecorder": function() { return /* binding */ IdleTransactionSpanRecorder; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _span_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./span.js */ 2261);
/* harmony import */ var _transaction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./transaction.js */ 2492);




var DEFAULT_IDLE_TIMEOUT = 1000;
var DEFAULT_FINAL_TIMEOUT = 30000;
var HEARTBEAT_INTERVAL = 5000;
/**
 * @inheritDoc
 */

class IdleTransactionSpanRecorder extends _span_js__WEBPACK_IMPORTED_MODULE_1__.SpanRecorder {
  constructor(_pushActivity, _popActivity, transactionSpanId, maxlen) {
    super(maxlen);
    this._pushActivity = _pushActivity;
    this._popActivity = _popActivity;
    this.transactionSpanId = transactionSpanId;
    ;
  }
  /**
   * @inheritDoc
   */


  add(span) {
    // We should make sure we do not push and pop activities for
    // the transaction that this span recorder belongs to.
    if (span.spanId !== this.transactionSpanId) {
      // We patch span.finish() to pop an activity after setting an endTimestamp.
      span.finish = endTimestamp => {
        span.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.timestampWithMs)();

        this._popActivity(span.spanId);
      }; // We should only push new activities if the span does not have an end timestamp.


      if (span.endTimestamp === undefined) {
        this._pushActivity(span.spanId);
      }
    }

    super.add(span);
  }

}
/**
 * An IdleTransaction is a transaction that automatically finishes. It does this by tracking child spans as activities.
 * You can have multiple IdleTransactions active, but if the `onScope` option is specified, the idle transaction will
 * put itself on the scope on creation.
 */


class IdleTransaction extends _transaction_js__WEBPACK_IMPORTED_MODULE_3__.Transaction {
  // Activities store a list of active spans
  __init() {
    this.activities = {};
  } // Track state of activities in previous heartbeat
  // Amount of times heartbeat has counted. Will cause transaction to finish after 3 beats.


  __init2() {
    this._heartbeatCounter = 0;
  } // We should not use heartbeat if we finished a transaction


  __init3() {
    this._finished = false;
  }

  __init4() {
    this._beforeFinishCallbacks = [];
  }
  /**
   * Timer that tracks Transaction idleTimeout
   */


  constructor(transactionContext, _idleHub) {
    let _idleTimeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_IDLE_TIMEOUT;

    let _finalTimeout = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_FINAL_TIMEOUT;

    let _onScope = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    super(transactionContext, _idleHub);
    this._idleHub = _idleHub;
    this._idleTimeout = _idleTimeout;
    this._finalTimeout = _finalTimeout;
    this._onScope = _onScope;

    IdleTransaction.prototype.__init.call(this);

    IdleTransaction.prototype.__init2.call(this);

    IdleTransaction.prototype.__init3.call(this);

    IdleTransaction.prototype.__init4.call(this);

    ;

    if (_onScope) {
      // There should only be one active transaction on the scope
      clearActiveTransaction(_idleHub); // We set the transaction here on the scope so error events pick up the trace
      // context and attach it to the error.

      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log("Setting idle transaction on scope. Span ID: ".concat(this.spanId));

      _idleHub.configureScope(scope => scope.setSpan(this));
    }

    this._startIdleTimeout();

    setTimeout(() => {
      if (!this._finished) {
        this.setStatus('deadline_exceeded');
        this.finish();
      }
    }, this._finalTimeout);
  }
  /** {@inheritDoc} */


  finish() {
    let endTimestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.timestampWithMs)();
    this._finished = true;
    this.activities = {};

    if (this.spanRecorder) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] finishing IdleTransaction', new Date(endTimestamp * 1000).toISOString(), this.op);

      for (var callback of this._beforeFinishCallbacks) {
        callback(this, endTimestamp);
      }

      this.spanRecorder.spans = this.spanRecorder.spans.filter(span => {
        // If we are dealing with the transaction itself, we just return it
        if (span.spanId === this.spanId) {
          return true;
        } // We cancel all pending spans with status "cancelled" to indicate the idle transaction was finished early


        if (!span.endTimestamp) {
          span.endTimestamp = endTimestamp;
          span.setStatus('cancelled');
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] cancelling span since transaction ended early', JSON.stringify(span, undefined, 2));
        }

        var keepSpan = span.startTimestamp < endTimestamp;

        if (!keepSpan) {
          (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] discarding Span since it happened after Transaction was finished', JSON.stringify(span, undefined, 2));
        }

        return keepSpan;
      });
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] flushing IdleTransaction');
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] No active IdleTransaction');
    } // if `this._onScope` is `true`, the transaction put itself on the scope when it started


    if (this._onScope) {
      clearActiveTransaction(this._idleHub);
    }

    return super.finish(endTimestamp);
  }
  /**
   * Register a callback function that gets excecuted before the transaction finishes.
   * Useful for cleanup or if you want to add any additional spans based on current context.
   *
   * This is exposed because users have no other way of running something before an idle transaction
   * finishes.
   */


  registerBeforeFinishCallback(callback) {
    this._beforeFinishCallbacks.push(callback);
  }
  /**
   * @inheritDoc
   */


  initSpanRecorder(maxlen) {
    if (!this.spanRecorder) {
      var pushActivity = id => {
        if (this._finished) {
          return;
        }

        this._pushActivity(id);
      };

      var popActivity = id => {
        if (this._finished) {
          return;
        }

        this._popActivity(id);
      };

      this.spanRecorder = new IdleTransactionSpanRecorder(pushActivity, popActivity, this.spanId, maxlen); // Start heartbeat so that transactions do not run forever.

      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('Starting heartbeat');

      this._pingHeartbeat();
    }

    this.spanRecorder.add(this);
  }
  /**
   * Cancels the existing idletimeout, if there is one
   */


  _cancelIdleTimeout() {
    if (this._idleTimeoutID) {
      clearTimeout(this._idleTimeoutID);
      this._idleTimeoutID = undefined;
    }
  }
  /**
   * Creates an idletimeout
   */


  _startIdleTimeout(endTimestamp) {
    this._cancelIdleTimeout();

    this._idleTimeoutID = setTimeout(() => {
      if (!this._finished && Object.keys(this.activities).length === 0) {
        this.finish(endTimestamp);
      }
    }, this._idleTimeout);
  }
  /**
   * Start tracking a specific activity.
   * @param spanId The span id that represents the activity
   */


  _pushActivity(spanId) {
    this._cancelIdleTimeout();

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log("[Tracing] pushActivity: ".concat(spanId));
    this.activities[spanId] = true;
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] new activities count', Object.keys(this.activities).length);
  }
  /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */


  _popActivity(spanId) {
    if (this.activities[spanId]) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log("[Tracing] popActivity ".concat(spanId));
      delete this.activities[spanId];
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] new activities count', Object.keys(this.activities).length);
    }

    if (Object.keys(this.activities).length === 0) {
      // We need to add the timeout here to have the real endtimestamp of the transaction
      // Remember timestampWithMs is in seconds, timeout is in ms
      var endTimestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.timestampWithMs)() + this._idleTimeout / 1000;

      this._startIdleTimeout(endTimestamp);
    }
  }
  /**
   * Checks when entries of this.activities are not changing for 3 beats.
   * If this occurs we finish the transaction.
   */


  _beat() {
    // We should not be running heartbeat if the idle transaction is finished.
    if (this._finished) {
      return;
    }

    var heartbeatString = Object.keys(this.activities).join('');

    if (heartbeatString === this._prevHeartbeatString) {
      this._heartbeatCounter += 1;
    } else {
      this._heartbeatCounter = 1;
    }

    this._prevHeartbeatString = heartbeatString;

    if (this._heartbeatCounter >= 3) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log('[Tracing] Transaction finished because of no change for 3 heart beats');
      this.setStatus('deadline_exceeded');
      this.finish();
    } else {
      this._pingHeartbeat();
    }
  }
  /**
   * Pings the heartbeat
   */


  _pingHeartbeat() {
    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_4__.logger.log("pinging Heartbeat -> current counter: ".concat(this._heartbeatCounter));
    setTimeout(() => {
      this._beat();
    }, HEARTBEAT_INTERVAL);
  }

}
/**
 * Reset transaction on scope to `undefined`
 */


function clearActiveTransaction(hub) {
  var scope = hub.getScope();

  if (scope) {
    var transaction = scope.getTransaction();

    if (transaction) {
      scope.setSpan(undefined);
    }
  }
}



/***/ }),

/***/ 2191:
/*!***************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/index.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BROWSER_TRACING_INTEGRATION_ID": function() { return /* reexport safe */ _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__.BROWSER_TRACING_INTEGRATION_ID; },
/* harmony export */   "BrowserTracing": function() { return /* reexport safe */ _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__.BrowserTracing; },
/* harmony export */   "IdleTransaction": function() { return /* reexport safe */ _idletransaction_js__WEBPACK_IMPORTED_MODULE_5__.IdleTransaction; },
/* harmony export */   "Integrations": function() { return /* reexport module object */ _integrations_index_js__WEBPACK_IMPORTED_MODULE_1__; },
/* harmony export */   "Span": function() { return /* reexport safe */ _span_js__WEBPACK_IMPORTED_MODULE_2__.Span; },
/* harmony export */   "SpanStatus": function() { return /* reexport safe */ _spanstatus_js__WEBPACK_IMPORTED_MODULE_3__.SpanStatus; },
/* harmony export */   "TRACEPARENT_REGEXP": function() { return /* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_9__.TRACEPARENT_REGEXP; },
/* harmony export */   "Transaction": function() { return /* reexport safe */ _transaction_js__WEBPACK_IMPORTED_MODULE_4__.Transaction; },
/* harmony export */   "addExtensionMethods": function() { return /* reexport safe */ _hubextensions_js__WEBPACK_IMPORTED_MODULE_0__.addExtensionMethods; },
/* harmony export */   "defaultRequestInstrumentationOptions": function() { return /* reexport safe */ _browser_request_js__WEBPACK_IMPORTED_MODULE_8__.defaultRequestInstrumentationOptions; },
/* harmony export */   "extractTraceparentData": function() { return /* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_9__.extractTraceparentData; },
/* harmony export */   "getActiveTransaction": function() { return /* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.getActiveTransaction; },
/* harmony export */   "hasTracingEnabled": function() { return /* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_6__.hasTracingEnabled; },
/* harmony export */   "instrumentOutgoingRequests": function() { return /* reexport safe */ _browser_request_js__WEBPACK_IMPORTED_MODULE_8__.instrumentOutgoingRequests; },
/* harmony export */   "spanStatusfromHttpCode": function() { return /* reexport safe */ _span_js__WEBPACK_IMPORTED_MODULE_2__.spanStatusfromHttpCode; },
/* harmony export */   "startIdleTransaction": function() { return /* reexport safe */ _hubextensions_js__WEBPACK_IMPORTED_MODULE_0__.startIdleTransaction; },
/* harmony export */   "stripUrlQueryAndFragment": function() { return /* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_10__.stripUrlQueryAndFragment; }
/* harmony export */ });
/* harmony import */ var _hubextensions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hubextensions.js */ 2194);
/* harmony import */ var _integrations_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./integrations/index.js */ 2494);
/* harmony import */ var _span_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span.js */ 2261);
/* harmony import */ var _spanstatus_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./spanstatus.js */ 2495);
/* harmony import */ var _transaction_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./transaction.js */ 2492);
/* harmony import */ var _idletransaction_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./idletransaction.js */ 2493);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ 2260);
/* harmony import */ var _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./browser/browsertracing.js */ 534);
/* harmony import */ var _browser_request_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./browser/request.js */ 2262);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @sentry/utils */ 136);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @sentry/utils */ 813);













;
; // Treeshakable guard to remove all code related to tracing
// Guard for tree

if (typeof __SENTRY_TRACING__ === 'undefined' || __SENTRY_TRACING__) {
  // We are patching the global object with our hub extension methods
  (0,_hubextensions_js__WEBPACK_IMPORTED_MODULE_0__.addExtensionMethods)();
}

/***/ }),

/***/ 2494:
/*!****************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Apollo": function() { return /* reexport safe */ _node_apollo_js__WEBPACK_IMPORTED_MODULE_6__.Apollo; },
/* harmony export */   "BrowserTracing": function() { return /* reexport safe */ _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__.BrowserTracing; },
/* harmony export */   "Express": function() { return /* reexport safe */ _node_express_js__WEBPACK_IMPORTED_MODULE_0__.Express; },
/* harmony export */   "GraphQL": function() { return /* reexport safe */ _node_graphql_js__WEBPACK_IMPORTED_MODULE_5__.GraphQL; },
/* harmony export */   "Mongo": function() { return /* reexport safe */ _node_mongo_js__WEBPACK_IMPORTED_MODULE_3__.Mongo; },
/* harmony export */   "Mysql": function() { return /* reexport safe */ _node_mysql_js__WEBPACK_IMPORTED_MODULE_2__.Mysql; },
/* harmony export */   "Postgres": function() { return /* reexport safe */ _node_postgres_js__WEBPACK_IMPORTED_MODULE_1__.Postgres; },
/* harmony export */   "Prisma": function() { return /* reexport safe */ _node_prisma_js__WEBPACK_IMPORTED_MODULE_4__.Prisma; }
/* harmony export */ });
/* harmony import */ var _node_express_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node/express.js */ 2407);
/* harmony import */ var _node_postgres_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node/postgres.js */ 2408);
/* harmony import */ var _node_mysql_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node/mysql.js */ 2409);
/* harmony import */ var _node_mongo_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node/mongo.js */ 2410);
/* harmony import */ var _node_prisma_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node/prisma.js */ 2411);
/* harmony import */ var _node_graphql_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./node/graphql.js */ 2412);
/* harmony import */ var _node_apollo_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./node/apollo.js */ 2413);
/* harmony import */ var _browser_browsertracing_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../browser/browsertracing.js */ 534);










/***/ }),

/***/ 2413:
/*!**********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/node/apollo.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Apollo": function() { return /* binding */ Apollo; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 165);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2838);



/** Tracing integration for Apollo */

class Apollo {
  constructor() {
    Apollo.prototype.__init.call(this);
  }
  /**
   * @inheritDoc
   */


  static __initStatic() {
    this.id = 'Apollo';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Apollo.id;
  }
  /**
   * @inheritDoc
   */


  setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.loadModule)('apollo-server-core');

    if (!pkg) {
      _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.error('Apollo Integration was unable to require apollo-server-core package.');
      return;
    }
    /**
     * Iterate over resolvers of the ApolloServer instance before schemas are constructed.
     */


    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(pkg.ApolloServerBase.prototype, 'constructSchema', function (orig) {
      return function () {
        var resolvers = Array.isArray(this.config.resolvers) ? this.config.resolvers : [this.config.resolvers];
        this.config.resolvers = resolvers.map(model => {
          Object.keys(model).forEach(resolverGroupName => {
            Object.keys(model[resolverGroupName]).forEach(resolverName => {
              if (typeof model[resolverGroupName][resolverName] !== 'function') {
                return;
              }

              wrapResolver(model, resolverGroupName, resolverName, getCurrentHub);
            });
          });
          return model;
        });
        return orig.call(this);
      };
    });
  }

}

Apollo.__initStatic();
/**
 * Wrap a single resolver which can be a parent of other resolvers and/or db operations.
 */


function wrapResolver(model, resolverGroupName, resolverName, getCurrentHub) {
  (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(model[resolverGroupName], resolverName, function (orig) {
    return function () {
      var scope = getCurrentHub().getScope();

      var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

      var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
        description: "".concat(resolverGroupName, ".").concat(resolverName),
        op: 'db.graphql.apollo'
      })]);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var rv = orig.call(this, ...args);

      if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.isThenable)(rv)) {
        return rv.then(res => {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);

          return res;
        });
      }

      (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

      return rv;
    };
  });
}



/***/ }),

/***/ 2407:
/*!***********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/node/express.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Express": function() { return /* binding */ Express; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2845);



/**
 * Express integration
 *
 * Provides an request and error handler for Express framework as well as tracing capabilities
 */

class Express {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'Express';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Express.id;
  }
  /**
   * Express App instance
   */

  /**
   * @inheritDoc
   */


  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ;

    Express.prototype.__init.call(this);

    this._router = options.router || options.app;
    this._methods = (Array.isArray(options.methods) ? options.methods : []).concat('use');
  }
  /**
   * @inheritDoc
   */


  setupOnce() {
    if (!this._router) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error('ExpressIntegration is missing an Express instance');
      return;
    }

    instrumentMiddlewares(this._router, this._methods);
  }

}

Express.__initStatic();
/**
 * Wraps original middleware function in a tracing call, which stores the info about the call as a span,
 * and finishes it once the middleware is done invoking.
 *
 * Express middlewares have 3 various forms, thus we have to take care of all of them:
 * // sync
 * app.use(function (req, res) { ... })
 * // async
 * app.use(function (req, res, next) { ... })
 * // error handler
 * app.use(function (err, req, res, next) { ... })
 *
 * They all internally delegate to the `router[method]` of the given application instance.
 */


function wrap(fn, method) {
  var arity = fn.length;

  switch (arity) {
    case 2:
      {
        return function (req, res) {
          var transaction = res.__sentry_transaction;

          if (transaction) {
            var span = transaction.startChild({
              description: fn.name,
              op: "express.middleware.".concat(method)
            });
            res.once('finish', () => {
              span.finish();
            });
          }

          return fn.call(this, req, res);
        };
      }

    case 3:
      {
        return function (req, res, next) {
          var transaction = res.__sentry_transaction;

          var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([transaction, 'optionalAccess', _ => _.startChild, 'call', _2 => _2({
            description: fn.name,
            op: "express.middleware.".concat(method)
          })]);

          fn.call(this, req, res, function () {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _3 => _3.finish, 'call', _4 => _4()]);

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            next.call(this, ...args);
          });
        };
      }

    case 4:
      {
        return function (err, req, res, next) {
          var transaction = res.__sentry_transaction;

          var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([transaction, 'optionalAccess', _5 => _5.startChild, 'call', _6 => _6({
            description: fn.name,
            op: "express.middleware.".concat(method)
          })]);

          fn.call(this, err, req, res, function () {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _7 => _7.finish, 'call', _8 => _8()]);

            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            next.call(this, ...args);
          });
        };
      }

    default:
      {
        throw new Error("Express middleware takes 2-4 arguments. Got: ".concat(arity));
      }
  }
}
/**
 * Takes all the function arguments passed to the original `app` or `router` method, eg. `app.use` or `router.use`
 * and wraps every function, as well as array of functions with a call to our `wrap` method.
 * We have to take care of the arrays as well as iterate over all of the arguments,
 * as `app.use` can accept middlewares in few various forms.
 *
 * app.use([<path>], <fn>)
 * app.use([<path>], <fn>, ...<fn>)
 * app.use([<path>], ...<fn>[])
 */


function wrapMiddlewareArgs(args, method) {
  return args.map(arg => {
    if (typeof arg === 'function') {
      return wrap(arg, method);
    }

    if (Array.isArray(arg)) {
      return arg.map(a => {
        if (typeof a === 'function') {
          return wrap(a, method);
        }

        return a;
      });
    }

    return arg;
  });
}
/**
 * Patches original router to utilize our tracing functionality
 */


function patchMiddleware(router, method) {
  var originalCallback = router[method];

  router[method] = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return originalCallback.call(this, ...wrapMiddlewareArgs(args, method));
  };

  return router;
}
/**
 * Patches original router methods
 */


function instrumentMiddlewares(router) {
  let methods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  methods.forEach(method => patchMiddleware(router, method));
}



/***/ }),

/***/ 2412:
/*!***********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/node/graphql.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GraphQL": function() { return /* binding */ GraphQL; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 165);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils */ 2838);



/** Tracing integration for graphql package */

class GraphQL {
  constructor() {
    GraphQL.prototype.__init.call(this);
  }
  /**
   * @inheritDoc
   */


  static __initStatic() {
    this.id = 'GraphQL';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = GraphQL.id;
  }
  /**
   * @inheritDoc
   */


  setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.loadModule)('graphql/execution/execute.js');

    if (!pkg) {
      _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.error('GraphQL Integration was unable to require graphql/execution package.');
      return;
    }

    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(pkg, 'execute', function (orig) {
      return function () {
        var scope = getCurrentHub().getScope();

        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
          description: 'execute',
          op: 'db.graphql'
        })]);

        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([scope, 'optionalAccess', _6 => _6.setSpan, 'call', _7 => _7(span)]);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var rv = orig.call(this, ...args);

        if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_5__.isThenable)(rv)) {
          return rv.then(res => {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([scope, 'optionalAccess', _10 => _10.setSpan, 'call', _11 => _11(parentSpan)]);

            return res;
          });
        }

        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);

        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_4__._optionalChain)([scope, 'optionalAccess', _14 => _14.setSpan, 'call', _15 => _15(parentSpan)]);

        return rv;
      };
    });
  }

}

GraphQL.__initStatic();



/***/ }),

/***/ 2410:
/*!*********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/node/mongo.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mongo": function() { return /* binding */ Mongo; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 165);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @sentry/utils */ 2838);



 // This allows us to use the same array for both defaults options and the type itself.
// (note `as const` at the end to make it a union of string literal types (i.e. "a" | "b" | ... )
// and not just a string[])

var OPERATIONS = ['aggregate', // aggregate(pipeline, options, callback)
'bulkWrite', // bulkWrite(operations, options, callback)
'countDocuments', // countDocuments(query, options, callback)
'createIndex', // createIndex(fieldOrSpec, options, callback)
'createIndexes', // createIndexes(indexSpecs, options, callback)
'deleteMany', // deleteMany(filter, options, callback)
'deleteOne', // deleteOne(filter, options, callback)
'distinct', // distinct(key, query, options, callback)
'drop', // drop(options, callback)
'dropIndex', // dropIndex(indexName, options, callback)
'dropIndexes', // dropIndexes(options, callback)
'estimatedDocumentCount', // estimatedDocumentCount(options, callback)
'find', // find(query, options, callback)
'findOne', // findOne(query, options, callback)
'findOneAndDelete', // findOneAndDelete(filter, options, callback)
'findOneAndReplace', // findOneAndReplace(filter, replacement, options, callback)
'findOneAndUpdate', // findOneAndUpdate(filter, update, options, callback)
'indexes', // indexes(options, callback)
'indexExists', // indexExists(indexes, options, callback)
'indexInformation', // indexInformation(options, callback)
'initializeOrderedBulkOp', // initializeOrderedBulkOp(options, callback)
'insertMany', // insertMany(docs, options, callback)
'insertOne', // insertOne(doc, options, callback)
'isCapped', // isCapped(options, callback)
'mapReduce', // mapReduce(map, reduce, options, callback)
'options', // options(options, callback)
'parallelCollectionScan', // parallelCollectionScan(options, callback)
'rename', // rename(newName, options, callback)
'replaceOne', // replaceOne(filter, doc, options, callback)
'stats', // stats(options, callback)
'updateMany', // updateMany(filter, update, options, callback)
'updateOne' // updateOne(filter, update, options, callback)
]; // All of the operations above take `options` and `callback` as their final parameters, but some of them
// take additional parameters as well. For those operations, this is a map of
// { <operation name>:  [<names of additional parameters>] }, as a way to know what to call the operation's
// positional arguments when we add them to the span's `data` object later

var OPERATION_SIGNATURES = {
  // aggregate intentionally not included because `pipeline` arguments are too complex to serialize well
  // see https://github.com/getsentry/sentry-javascript/pull/3102
  bulkWrite: ['operations'],
  countDocuments: ['query'],
  createIndex: ['fieldOrSpec'],
  createIndexes: ['indexSpecs'],
  deleteMany: ['filter'],
  deleteOne: ['filter'],
  distinct: ['key', 'query'],
  dropIndex: ['indexName'],
  find: ['query'],
  findOne: ['query'],
  findOneAndDelete: ['filter'],
  findOneAndReplace: ['filter', 'replacement'],
  findOneAndUpdate: ['filter', 'update'],
  indexExists: ['indexes'],
  insertMany: ['docs'],
  insertOne: ['doc'],
  mapReduce: ['map', 'reduce'],
  rename: ['newName'],
  replaceOne: ['filter', 'doc'],
  updateMany: ['filter', 'update'],
  updateOne: ['filter', 'update']
};
/** Tracing integration for mongo package */

class Mongo {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'Mongo';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Mongo.id;
  }
  /**
   * @inheritDoc
   */


  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ;

    Mongo.prototype.__init.call(this);

    this._operations = Array.isArray(options.operations) ? options.operations : OPERATIONS;
    this._describeOperations = 'describeOperations' in options ? options.describeOperations : true;
    this._useMongoose = !!options.useMongoose;
  }
  /**
   * @inheritDoc
   */


  setupOnce(_, getCurrentHub) {
    var moduleName = this._useMongoose ? 'mongoose' : 'mongodb';
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.loadModule)(moduleName);

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_3__.logger.error("Mongo Integration was unable to require `".concat(moduleName, "` package."));
      return;
    }

    this._instrumentOperations(pkg.Collection, this._operations, getCurrentHub);
  }
  /**
   * Patches original collection methods
   */


  _instrumentOperations(collection, operations, getCurrentHub) {
    operations.forEach(operation => this._patchOperation(collection, operation, getCurrentHub));
  }
  /**
   * Patches original collection to utilize our tracing functionality
   */


  _patchOperation(collection, operation, getCurrentHub) {
    if (!(operation in collection.prototype)) return;

    var getSpanContext = this._getSpanContextFromOperationArguments.bind(this);

    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.fill)(collection.prototype, operation, function (orig) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var lastArg = args[args.length - 1];
        var scope = getCurrentHub().getScope();

        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]); // Check if the operation was passed a callback. (mapReduce requires a different check, as
        // its (non-callback) arguments can also be functions.)


        if (typeof lastArg !== 'function' || operation === 'mapReduce' && args.length === 2) {
          var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5(getSpanContext(this, operation, args))]);

          var maybePromise = orig.call(this, ...args);

          if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_6__.isThenable)(maybePromise)) {
            return maybePromise.then(res => {
              (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);

              return res;
            });
          } else {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

            return maybePromise;
          }
        }

        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([parentSpan, 'optionalAccess', _10 => _10.startChild, 'call', _11 => _11(getSpanContext(this, operation, args.slice(0, -1)))]);

        return orig.call(this, ...args.slice(0, -1), function (err, result) {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._optionalChain)([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);

          lastArg(err, result);
        });
      };
    });
  }
  /**
   * Form a SpanContext based on the user input to a given operation.
   */


  _getSpanContextFromOperationArguments(collection, operation, args) {
    var data = {
      collectionName: collection.collectionName,
      dbName: collection.dbName,
      namespace: collection.namespace
    };
    var spanContext = {
      op: 'db',
      description: operation,
      data
    }; // If the operation takes no arguments besides `options` and `callback`, or if argument
    // collection is disabled for this operation, just return early.

    var signature = OPERATION_SIGNATURES[operation];
    var shouldDescribe = Array.isArray(this._describeOperations) ? this._describeOperations.includes(operation) : this._describeOperations;

    if (!signature || !shouldDescribe) {
      return spanContext;
    }

    try {
      // Special case for `mapReduce`, as the only one accepting functions as arguments.
      if (operation === 'mapReduce') {
        const [map, reduce] = args;
        data[signature[0]] = typeof map === 'string' ? map : map.name || '<anonymous>';
        data[signature[1]] = typeof reduce === 'string' ? reduce : reduce.name || '<anonymous>';
      } else {
        for (let i = 0; i < signature.length; i++) {
          data[signature[i]] = JSON.stringify(args[i]);
        }
      }
    } catch (_oO) {// no-empty
    }

    return spanContext;
  }

}

Mongo.__initStatic();



/***/ }),

/***/ 2409:
/*!*********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/node/mysql.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Mysql": function() { return /* binding */ Mysql; }
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 165);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2837);


/** Tracing integration for node-mysql package */

class Mysql {
  constructor() {
    Mysql.prototype.__init.call(this);
  }
  /**
   * @inheritDoc
   */


  static __initStatic() {
    this.id = 'Mysql';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Mysql.id;
  }
  /**
   * @inheritDoc
   */


  setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.loadModule)('mysql/lib/Connection.js');

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error('Mysql Integration was unable to require `mysql` package.');
      return;
    } // The original function will have one of these signatures:
    //    function (callback) => void
    //    function (options, callback) => void
    //    function (options, values, callback) => void


    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.fill)(pkg, 'createQuery', function (orig) {
      return function (options, values, callback) {
        var scope = getCurrentHub().getScope();

        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
          description: typeof options === 'string' ? options : options.sql,
          op: 'db'
        })]);

        if (typeof callback === 'function') {
          return orig.call(this, options, values, function (err, result, fields) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);

            callback(err, result, fields);
          });
        }

        if (typeof values === 'function') {
          return orig.call(this, options, function (err, result, fields) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

            values(err, result, fields);
          });
        }

        return orig.call(this, options, values, callback);
      };
    });
  }

}

Mysql.__initStatic();



/***/ }),

/***/ 2408:
/*!************************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/node/postgres.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Postgres": function() { return /* binding */ Postgres; }
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 165);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2838);


/** Tracing integration for node-postgres package */

class Postgres {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'Postgres';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Postgres.id;
  }

  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ;

    Postgres.prototype.__init.call(this);

    this._usePgNative = !!options.usePgNative;
  }
  /**
   * @inheritDoc
   */


  setupOnce(_, getCurrentHub) {
    var pkg = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.loadModule)('pg');

    if (!pkg) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error('Postgres Integration was unable to require `pg` package.');
      return;
    }

    if (this._usePgNative && !(0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([pkg, 'access', _2 => _2.native, 'optionalAccess', _3 => _3.Client])) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.logger.error("Postgres Integration was unable to access 'pg-native' bindings.");
      return;
    }

    const {
      Client
    } = this._usePgNative ? pkg.native : pkg;
    /**
     * function (query, callback) => void
     * function (query, params, callback) => void
     * function (query) => Promise
     * function (query, params) => Promise
     * function (pg.Cursor) => pg.Cursor
     */

    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.fill)(Client.prototype, 'query', function (orig) {
      return function (config, values, callback) {
        var scope = getCurrentHub().getScope();

        var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([scope, 'optionalAccess', _4 => _4.getSpan, 'call', _5 => _5()]);

        var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([parentSpan, 'optionalAccess', _6 => _6.startChild, 'call', _7 => _7({
          description: typeof config === 'string' ? config : config.text,
          op: 'db'
        })]);

        if (typeof callback === 'function') {
          return orig.call(this, config, values, function (err, result) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

            callback(err, result);
          });
        }

        if (typeof values === 'function') {
          return orig.call(this, config, function (err, result) {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _10 => _10.finish, 'call', _11 => _11()]);

            values(err, result);
          });
        }

        var rv = typeof values !== 'undefined' ? orig.call(this, config, values) : orig.call(this, config);

        if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isThenable)(rv)) {
          return rv.then(res => {
            (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _12 => _12.finish, 'call', _13 => _13()]);

            return res;
          });
        }

        (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_2__._optionalChain)([span, 'optionalAccess', _14 => _14.finish, 'call', _15 => _15()]);

        return rv;
      };
    });
  }

}

Postgres.__initStatic();



/***/ }),

/***/ 2411:
/*!**********************************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/integrations/node/prisma.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Prisma": function() { return /* binding */ Prisma; }
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2855);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2838);



function isValidPrismaClient(possibleClient) {
  return possibleClient && !!possibleClient['$use'];
}
/** Tracing integration for @prisma/client package */


class Prisma {
  /**
   * @inheritDoc
   */
  static __initStatic() {
    this.id = 'Prisma';
  }
  /**
   * @inheritDoc
   */


  __init() {
    this.name = Prisma.id;
  }
  /**
   * Prisma ORM Client Instance
   */

  /**
   * @inheritDoc
   */


  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    ;

    Prisma.prototype.__init.call(this);

    if (isValidPrismaClient(options.client)) {
      this._client = options.client;
    } else {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.warn("Unsupported Prisma client provided to PrismaIntegration. Provided client: ".concat(JSON.stringify(options.client)));
    }
  }
  /**
   * @inheritDoc
   */


  setupOnce(_, getCurrentHub) {
    if (!this._client) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.logger.error('PrismaIntegration is missing a Prisma Client Instance');
      return;
    }

    this._client.$use((params, next) => {
      var scope = getCurrentHub().getScope();

      var parentSpan = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([scope, 'optionalAccess', _2 => _2.getSpan, 'call', _3 => _3()]);

      var action = params.action;
      var model = params.model;

      var span = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([parentSpan, 'optionalAccess', _4 => _4.startChild, 'call', _5 => _5({
        description: model ? "".concat(model, " ").concat(action) : action,
        op: 'db.prisma'
      })]);

      var rv = next(params);

      if ((0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.isThenable)(rv)) {
        return rv.then(res => {
          (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([span, 'optionalAccess', _6 => _6.finish, 'call', _7 => _7()]);

          return res;
        });
      }

      (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_1__._optionalChain)([span, 'optionalAccess', _8 => _8.finish, 'call', _9 => _9()]);

      return rv;
    });
  }

}

Prisma.__initStatic();



/***/ }),

/***/ 2261:
/*!**************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/span.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Span": function() { return /* binding */ Span; },
/* harmony export */   "SpanRecorder": function() { return /* binding */ SpanRecorder; },
/* harmony export */   "spanStatusfromHttpCode": function() { return /* binding */ spanStatusfromHttpCode; }
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2870);
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/hub */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 813);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 1272);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2871);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * Keeps track of finished spans for a given transaction
 * @internal
 * @hideconstructor
 * @hidden
 */

class SpanRecorder {
  __init() {
    this.spans = [];
  }

  constructor() {
    let maxlen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
    ;

    SpanRecorder.prototype.__init.call(this);

    this._maxlen = maxlen;
  }
  /**
   * This is just so that we don't run out of memory while recording a lot
   * of spans. At some point we just stop and flush out the start of the
   * trace tree (i.e.the first n spans with the smallest
   * start_timestamp).
   */


  add(span) {
    if (this.spans.length > this._maxlen) {
      span.spanRecorder = undefined;
    } else {
      this.spans.push(span);
    }
  }

}
/**
 * Span contains all data about a span
 */


class Span {
  /**
   * @inheritDoc
   */
  __init2() {
    this.traceId = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.uuid4)();
  }
  /**
   * @inheritDoc
   */


  __init3() {
    this.spanId = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_0__.uuid4)().substring(16);
  }
  /**
   * @inheritDoc
   */

  /**
   * Internal keeper of the status
   */

  /**
   * @inheritDoc
   */

  /**
   * Timestamp in seconds when the span was created.
   */


  __init4() {
    this.startTimestamp = (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.timestampWithMs)();
  }
  /**
   * Timestamp in seconds when the span ended.
   */

  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */

  /**
   * @inheritDoc
   */


  __init5() {
    this.tags = {};
  }
  /**
   * @inheritDoc
   */


  __init6() {
    this.data = {};
  }
  /**
   * List of spans that were finalized
   */

  /**
   * @inheritDoc
   */

  /**
   * You should never call the constructor manually, always use `Sentry.startTransaction()`
   * or call `startChild()` on an existing span.
   * @internal
   * @hideconstructor
   * @hidden
   */


  constructor(spanContext) {
    ;

    Span.prototype.__init2.call(this);

    Span.prototype.__init3.call(this);

    Span.prototype.__init4.call(this);

    Span.prototype.__init5.call(this);

    Span.prototype.__init6.call(this);

    if (!spanContext) {
      return this;
    }

    if (spanContext.traceId) {
      this.traceId = spanContext.traceId;
    }

    if (spanContext.spanId) {
      this.spanId = spanContext.spanId;
    }

    if (spanContext.parentSpanId) {
      this.parentSpanId = spanContext.parentSpanId;
    } // We want to include booleans as well here


    if ('sampled' in spanContext) {
      this.sampled = spanContext.sampled;
    }

    if (spanContext.op) {
      this.op = spanContext.op;
    }

    if (spanContext.description) {
      this.description = spanContext.description;
    }

    if (spanContext.data) {
      this.data = spanContext.data;
    }

    if (spanContext.tags) {
      this.tags = spanContext.tags;
    }

    if (spanContext.status) {
      this.status = spanContext.status;
    }

    if (spanContext.startTimestamp) {
      this.startTimestamp = spanContext.startTimestamp;
    }

    if (spanContext.endTimestamp) {
      this.endTimestamp = spanContext.endTimestamp;
    }
  }
  /**
   * @inheritDoc
   */


  startChild(spanContext) {
    var childSpan = new Span(_objectSpread(_objectSpread({}, spanContext), {}, {
      parentSpanId: this.spanId,
      sampled: this.sampled,
      traceId: this.traceId
    }));
    childSpan.spanRecorder = this.spanRecorder;

    if (childSpan.spanRecorder) {
      childSpan.spanRecorder.add(childSpan);
    }

    childSpan.transaction = this.transaction;
    return childSpan;
  }
  /**
   * @inheritDoc
   */


  setTag(key, value) {
    this.tags = _objectSpread(_objectSpread({}, this.tags), {}, {
      [key]: value
    });
    return this;
  }
  /**
   * @inheritDoc
   */


  setData(key, value) {
    this.data = _objectSpread(_objectSpread({}, this.data), {}, {
      [key]: value
    });
    return this;
  }
  /**
   * @inheritDoc
   */


  setStatus(value) {
    this.status = value;
    return this;
  }
  /**
   * @inheritDoc
   */


  setHttpStatus(httpStatus) {
    this.setTag('http.status_code', String(httpStatus));
    var spanStatus = spanStatusfromHttpCode(httpStatus);

    if (spanStatus !== 'unknown_error') {
      this.setStatus(spanStatus);
    }

    return this;
  }
  /**
   * @inheritDoc
   */


  isSuccess() {
    return this.status === 'ok';
  }
  /**
   * @inheritDoc
   */


  finish(endTimestamp) {
    this.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_1__.timestampWithMs)();
  }
  /**
   * @inheritDoc
   */


  toTraceparent() {
    let sampledString = '';

    if (this.sampled !== undefined) {
      sampledString = this.sampled ? '-1' : '-0';
    }

    return "".concat(this.traceId, "-").concat(this.spanId).concat(sampledString);
  }
  /**
   * @inheritDoc
   */


  toContext() {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dropUndefinedKeys)({
      data: this.data,
      description: this.description,
      endTimestamp: this.endTimestamp,
      op: this.op,
      parentSpanId: this.parentSpanId,
      sampled: this.sampled,
      spanId: this.spanId,
      startTimestamp: this.startTimestamp,
      status: this.status,
      tags: this.tags,
      traceId: this.traceId
    });
  }
  /**
   * @inheritDoc
   */


  updateWithContext(spanContext) {
    this.data = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._nullishCoalesce)(spanContext.data, () => ({}));
    this.description = spanContext.description;
    this.endTimestamp = spanContext.endTimestamp;
    this.op = spanContext.op;
    this.parentSpanId = spanContext.parentSpanId;
    this.sampled = spanContext.sampled;
    this.spanId = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._nullishCoalesce)(spanContext.spanId, () => this.spanId);
    this.startTimestamp = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._nullishCoalesce)(spanContext.startTimestamp, () => this.startTimestamp);
    this.status = spanContext.status;
    this.tags = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._nullishCoalesce)(spanContext.tags, () => ({}));
    this.traceId = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_3__._nullishCoalesce)(spanContext.traceId, () => this.traceId);
    return this;
  }
  /**
   * @inheritDoc
   */


  getTraceContext() {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dropUndefinedKeys)({
      data: Object.keys(this.data).length > 0 ? this.data : undefined,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
      trace_id: this.traceId
    });
  }
  /**
   * @inheritdoc
   */


  getBaggage() {
    var existingBaggage = this.transaction && this.transaction.metadata.baggage; // Only add Sentry baggage items to baggage, if baggage does not exist yet or it is still
    // empty and mutable

    var finalBaggage = !existingBaggage || (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isBaggageMutable)(existingBaggage) && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.isSentryBaggageEmpty)(existingBaggage) ? this._getBaggageWithSentryValues(existingBaggage) : existingBaggage;
    return finalBaggage;
  }
  /**
   * @inheritDoc
   */


  toJSON() {
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_2__.dropUndefinedKeys)({
      data: Object.keys(this.data).length > 0 ? this.data : undefined,
      description: this.description,
      op: this.op,
      parent_span_id: this.parentSpanId,
      span_id: this.spanId,
      start_timestamp: this.startTimestamp,
      status: this.status,
      tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
      timestamp: this.endTimestamp,
      trace_id: this.traceId
    });
  }
  /**
   * Collects and adds data to the passed baggage object.
   *
   * Note: This function does not explicitly check if the passed baggage object is allowed
   * to be modified. Implicitly, `setBaggageValue` will not make modification to the object
   * if it was already set immutable.
   *
   * After adding the data, the baggage object is set immutable to prevent further modifications.
   *
   * @param baggage
   *
   * @returns modified and immutable baggage object
   */


  _getBaggageWithSentryValues() {
    let baggage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.createBaggage)({});
    var hub = this.transaction && this.transaction._hub || (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_5__.getCurrentHub)();
    var client = hub.getClient();
    const {
      environment,
      release
    } = client && client.getOptions() || {};
    environment && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.setBaggageValue)(baggage, 'environment', environment);
    release && (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.setBaggageValue)(baggage, 'release', release);
    (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.setBaggageImmutable)(baggage);
    return baggage;
  }

}
/**
 * Converts a HTTP status code into a {@link SpanStatusType}.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or unknown_error.
 */


function spanStatusfromHttpCode(httpStatus) {
  if (httpStatus < 400 && httpStatus >= 100) {
    return 'ok';
  }

  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return 'unauthenticated';

      case 403:
        return 'permission_denied';

      case 404:
        return 'not_found';

      case 409:
        return 'already_exists';

      case 413:
        return 'failed_precondition';

      case 429:
        return 'resource_exhausted';

      default:
        return 'invalid_argument';
    }
  }

  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return 'unimplemented';

      case 503:
        return 'unavailable';

      case 504:
        return 'deadline_exceeded';

      default:
        return 'internal_error';
    }
  }

  return 'unknown_error';
}



/***/ }),

/***/ 2495:
/*!********************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/spanstatus.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpanStatus": function() { return /* binding */ SpanStatus; }
/* harmony export */ });
/** The status of an Span.
 *
 * @deprecated Use string literals - if you require type casting, cast to SpanStatusType type
 */
var SpanStatus;

(function (SpanStatus) {
  /** The operation completed successfully. */
  var Ok = 'ok';
  SpanStatus["Ok"] = Ok;
  /** Deadline expired before operation could complete. */

  var DeadlineExceeded = 'deadline_exceeded';
  SpanStatus["DeadlineExceeded"] = DeadlineExceeded;
  /** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */

  var Unauthenticated = 'unauthenticated';
  SpanStatus["Unauthenticated"] = Unauthenticated;
  /** 403 Forbidden */

  var PermissionDenied = 'permission_denied';
  SpanStatus["PermissionDenied"] = PermissionDenied;
  /** 404 Not Found. Some requested entity (file or directory) was not found. */

  var NotFound = 'not_found';
  SpanStatus["NotFound"] = NotFound;
  /** 429 Too Many Requests */

  var ResourceExhausted = 'resource_exhausted';
  SpanStatus["ResourceExhausted"] = ResourceExhausted;
  /** Client specified an invalid argument. 4xx. */

  var InvalidArgument = 'invalid_argument';
  SpanStatus["InvalidArgument"] = InvalidArgument;
  /** 501 Not Implemented */

  var Unimplemented = 'unimplemented';
  SpanStatus["Unimplemented"] = Unimplemented;
  /** 503 Service Unavailable */

  var Unavailable = 'unavailable';
  SpanStatus["Unavailable"] = Unavailable;
  /** Other/generic 5xx. */

  var InternalError = 'internal_error';
  SpanStatus["InternalError"] = InternalError;
  /** Unknown. Any non-standard HTTP status code. */

  var UnknownError = 'unknown_error';
  SpanStatus["UnknownError"] = UnknownError;
  /** The operation was cancelled (typically by the user). */

  var Cancelled = 'cancelled';
  SpanStatus["Cancelled"] = Cancelled;
  /** Already exists (409) */

  var AlreadyExists = 'already_exists';
  SpanStatus["AlreadyExists"] = AlreadyExists;
  /** Operation was rejected because the system is not in a state required for the operation's */

  var FailedPrecondition = 'failed_precondition';
  SpanStatus["FailedPrecondition"] = FailedPrecondition;
  /** The operation was aborted, typically due to a concurrency issue. */

  var Aborted = 'aborted';
  SpanStatus["Aborted"] = Aborted;
  /** Operation was attempted past the valid range. */

  var OutOfRange = 'out_of_range';
  SpanStatus["OutOfRange"] = OutOfRange;
  /** Unrecoverable data loss or corruption */

  var DataLoss = 'data_loss';
  SpanStatus["DataLoss"] = DataLoss;
})(SpanStatus || (SpanStatus = {}));



/***/ }),

/***/ 2492:
/*!*********************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/transaction.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Transaction": function() { return /* binding */ Transaction; }
/* harmony export */ });
/* harmony import */ var _sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @sentry/utils/esm/buildPolyfills */ 2870);
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/hub */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ 2845);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ 2871);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @sentry/utils */ 2837);
/* harmony import */ var _span_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./span.js */ 2261);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/** JSDoc */

class Transaction extends _span_js__WEBPACK_IMPORTED_MODULE_0__.Span {
  /**
   * The reference to the current hub.
   */
  __init() {
    this._measurements = {};
  }
  /**
   * This constructor should never be called manually. Those instrumenting tracing should use
   * `Sentry.startTransaction()`, and internal methods should use `hub.startTransaction()`.
   * @internal
   * @hideconstructor
   * @hidden
   */


  constructor(transactionContext, hub) {
    super(transactionContext);

    Transaction.prototype.__init.call(this);

    ;
    this._hub = hub || (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_1__.getCurrentHub)();
    this.name = transactionContext.name || '';
    this.metadata = transactionContext.metadata || {};
    this._trimEnd = transactionContext.trimEnd; // this is because transactions are also spans, and spans have a transaction pointer

    this.transaction = this;
  }
  /**
   * JSDoc
   */


  setName(name) {
    this.name = name;
  }
  /**
   * Attaches SpanRecorder to the span itself
   * @param maxlen maximum number of spans that can be recorded
   */


  initSpanRecorder() {
    let maxlen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

    if (!this.spanRecorder) {
      this.spanRecorder = new _span_js__WEBPACK_IMPORTED_MODULE_0__.SpanRecorder(maxlen);
    }

    this.spanRecorder.add(this);
  }
  /**
   * @inheritDoc
   */


  setMeasurement(name, value) {
    let unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    this._measurements[name] = {
      value,
      unit
    };
  }
  /**
   * Set metadata for this transaction.
   * @hidden
   */


  setMetadata(newMetadata) {
    this.metadata = _objectSpread(_objectSpread({}, this.metadata), newMetadata);
  }
  /**
   * @inheritDoc
   */


  finish(endTimestamp) {
    // This transaction is already finished, so we should not flush it again.
    if (this.endTimestamp !== undefined) {
      return undefined;
    }

    if (!this.name) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.warn('Transaction has no name, falling back to `<unlabeled transaction>`.');
      this.name = '<unlabeled transaction>';
    } // just sets the end timestamp


    super.finish(endTimestamp);

    if (this.sampled !== true) {
      // At this point if `sampled !== true` we want to discard the transaction.
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log('[Tracing] Discarding transaction because its trace was not chosen to be sampled.');

      var client = this._hub.getClient();

      if (client) {
        client.recordDroppedEvent('sample_rate', 'transaction');
      }

      return undefined;
    }

    var finishedSpans = this.spanRecorder ? this.spanRecorder.spans.filter(s => s !== this && s.endTimestamp) : [];

    if (this._trimEnd && finishedSpans.length > 0) {
      this.endTimestamp = finishedSpans.reduce((prev, current) => {
        if (prev.endTimestamp && current.endTimestamp) {
          return prev.endTimestamp > current.endTimestamp ? prev : current;
        }

        return prev;
      }).endTimestamp;
    }

    var transaction = {
      contexts: {
        trace: this.getTraceContext(),
        baggage: (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_3__.getSentryBaggageItems)(this.getBaggage())
      },
      spans: finishedSpans,
      start_timestamp: this.startTimestamp,
      tags: this.tags,
      timestamp: this.endTimestamp,
      transaction: this.name,
      type: 'transaction',
      sdkProcessingMetadata: this.metadata
    };
    var hasMeasurements = Object.keys(this._measurements).length > 0;

    if (hasMeasurements) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log('[Measurements] Adding measurements to transaction', JSON.stringify(this._measurements, undefined, 2));
      transaction.measurements = this._measurements;
    }

    (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _sentry_utils__WEBPACK_IMPORTED_MODULE_2__.logger.log("[Tracing] Finishing ".concat(this.op, " transaction: ").concat(this.name, "."));
    return this._hub.captureEvent(transaction);
  }
  /**
   * @inheritDoc
   */


  toContext() {
    var spanContext = super.toContext();
    return (0,_sentry_utils__WEBPACK_IMPORTED_MODULE_4__.dropUndefinedKeys)(_objectSpread(_objectSpread({}, spanContext), {}, {
      name: this.name,
      trimEnd: this._trimEnd
    }));
  }
  /**
   * @inheritDoc
   */


  updateWithContext(transactionContext) {
    super.updateWithContext(transactionContext);
    this.name = (0,_sentry_utils_esm_buildPolyfills__WEBPACK_IMPORTED_MODULE_5__._nullishCoalesce)(transactionContext.name, () => '');
    this._trimEnd = transactionContext.trimEnd;
    return this;
  }

}



/***/ }),

/***/ 2260:
/*!***************************************************!*\
  !*** ./node_modules/@sentry/tracing/esm/utils.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TRACEPARENT_REGEXP": function() { return /* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.TRACEPARENT_REGEXP; },
/* harmony export */   "extractTraceparentData": function() { return /* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_0__.extractTraceparentData; },
/* harmony export */   "getActiveTransaction": function() { return /* binding */ getActiveTransaction; },
/* harmony export */   "hasTracingEnabled": function() { return /* binding */ hasTracingEnabled; },
/* harmony export */   "msToSec": function() { return /* binding */ msToSec; },
/* harmony export */   "secToMs": function() { return /* binding */ secToMs; },
/* harmony export */   "stripUrlQueryAndFragment": function() { return /* reexport safe */ _sentry_utils__WEBPACK_IMPORTED_MODULE_1__.stripUrlQueryAndFragment; }
/* harmony export */ });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/hub */ 95);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ 136);
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ 813);


/**
 * Determines if tracing is currently enabled.
 *
 * Tracing is enabled when at least one of `tracesSampleRate` and `tracesSampler` is defined in the SDK config.
 */

function hasTracingEnabled(maybeOptions) {
  var client = (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)().getClient();
  var options = maybeOptions || client && client.getOptions();
  return !!options && ('tracesSampleRate' in options || 'tracesSampler' in options);
}
/** Grabs active transaction off scope, if any */


function getActiveTransaction(maybeHub) {
  var hub = maybeHub || (0,_sentry_hub__WEBPACK_IMPORTED_MODULE_2__.getCurrentHub)();
  var scope = hub.getScope();
  return scope && scope.getTransaction();
}
/**
 * Converts from milliseconds to seconds
 * @param time time in ms
 */


function msToSec(time) {
  return time / 1000;
}
/**
 * Converts from seconds to milliseconds
 * @param time time in seconds
 */


function secToMs(time) {
  return time * 1000;
}



/***/ }),

/***/ 2871:
/*!***************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/baggage.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BAGGAGE_HEADER_NAME": function() { return /* binding */ BAGGAGE_HEADER_NAME; },
/* harmony export */   "MAX_BAGGAGE_STRING_LENGTH": function() { return /* binding */ MAX_BAGGAGE_STRING_LENGTH; },
/* harmony export */   "SENTRY_BAGGAGE_KEY_PREFIX": function() { return /* binding */ SENTRY_BAGGAGE_KEY_PREFIX; },
/* harmony export */   "SENTRY_BAGGAGE_KEY_PREFIX_REGEX": function() { return /* binding */ SENTRY_BAGGAGE_KEY_PREFIX_REGEX; },
/* harmony export */   "createBaggage": function() { return /* binding */ createBaggage; },
/* harmony export */   "getBaggageValue": function() { return /* binding */ getBaggageValue; },
/* harmony export */   "getSentryBaggageItems": function() { return /* binding */ getSentryBaggageItems; },
/* harmony export */   "getThirdPartyBaggage": function() { return /* binding */ getThirdPartyBaggage; },
/* harmony export */   "isBaggageEmpty": function() { return /* binding */ isBaggageEmpty; },
/* harmony export */   "isBaggageMutable": function() { return /* binding */ isBaggageMutable; },
/* harmony export */   "isSentryBaggageEmpty": function() { return /* binding */ isSentryBaggageEmpty; },
/* harmony export */   "mergeAndSerializeBaggage": function() { return /* binding */ mergeAndSerializeBaggage; },
/* harmony export */   "parseBaggageSetMutability": function() { return /* binding */ parseBaggageSetMutability; },
/* harmony export */   "parseBaggageString": function() { return /* binding */ parseBaggageString; },
/* harmony export */   "serializeBaggage": function() { return /* binding */ serializeBaggage; },
/* harmony export */   "setBaggageImmutable": function() { return /* binding */ setBaggageImmutable; },
/* harmony export */   "setBaggageValue": function() { return /* binding */ setBaggageValue; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger.js */ 2845);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var BAGGAGE_HEADER_NAME = 'baggage';
var SENTRY_BAGGAGE_KEY_PREFIX = 'sentry-';
var SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
/**
 * Max length of a serialized baggage string
 *
 * https://www.w3.org/TR/baggage/#limits
 */

var MAX_BAGGAGE_STRING_LENGTH = 8192;
/** Create an instance of Baggage */

function createBaggage(initItems) {
  let baggageString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let mutable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return [_objectSpread({}, initItems), baggageString, mutable];
}
/** Get a value from baggage */


function getBaggageValue(baggage, key) {
  return baggage[0][key];
}
/** Add a value to baggage */


function setBaggageValue(baggage, key, value) {
  if (isBaggageMutable(baggage)) {
    baggage[0][key] = value;
  }
}
/** Check if the Sentry part of the passed baggage (i.e. the first element in the tuple) is empty */


function isSentryBaggageEmpty(baggage) {
  return Object.keys(baggage[0]).length === 0;
}
/** Check if the Sentry part of the passed baggage (i.e. the first element in the tuple) is empty */


function isBaggageEmpty(baggage) {
  var thirdPartyBaggage = getThirdPartyBaggage(baggage);
  return isSentryBaggageEmpty(baggage) && (thirdPartyBaggage == undefined || thirdPartyBaggage.length === 0);
}
/** Returns Sentry specific baggage values */


function getSentryBaggageItems(baggage) {
  return baggage[0];
}
/**
 * Returns 3rd party baggage string of @param baggage
 * @param baggage
 */


function getThirdPartyBaggage(baggage) {
  return baggage[1];
}
/**
 * Checks if baggage is mutable
 * @param baggage
 * @returns true if baggage is mutable, else false
 */


function isBaggageMutable(baggage) {
  return baggage[2];
}
/**
 * Sets the passed baggage immutable
 * @param baggage
 */


function setBaggageImmutable(baggage) {
  baggage[2] = false;
}
/** Serialize a baggage object */


function serializeBaggage(baggage) {
  return Object.keys(baggage[0]).reduce((prev, key) => {
    var val = baggage[0][key];
    var baggageEntry = "".concat(SENTRY_BAGGAGE_KEY_PREFIX).concat(encodeURIComponent(key), "=").concat(encodeURIComponent(val));
    var newVal = prev === '' ? baggageEntry : "".concat(prev, ",").concat(baggageEntry);

    if (newVal.length > MAX_BAGGAGE_STRING_LENGTH) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _logger_js__WEBPACK_IMPORTED_MODULE_1__.logger.warn("Not adding key: ".concat(key, " with val: ").concat(val, " to baggage due to exceeding baggage size limits."));
      return prev;
    } else {
      return newVal;
    }
  }, baggage[1]);
}
/** Parse a baggage header from a string and return a Baggage object */


function parseBaggageString(inputBaggageString) {
  return inputBaggageString.split(',').reduce((_ref, curr) => {
    let [baggageObj, baggageString] = _ref;
    const [key, val] = curr.split('=');

    if (SENTRY_BAGGAGE_KEY_PREFIX_REGEX.test(key)) {
      var baggageKey = decodeURIComponent(key.split('-')[1]);
      return [_objectSpread(_objectSpread({}, baggageObj), {}, {
        [baggageKey]: decodeURIComponent(val)
      }), baggageString, true];
    } else {
      return [baggageObj, baggageString === '' ? curr : "".concat(baggageString, ",").concat(curr), true];
    }
  }, [{}, '', true]);
}
/**
 * Merges the baggage header we saved from the incoming request (or meta tag) with
 * a possibly created or modified baggage header by a third party that's been added
 * to the outgoing request header.
 *
 * In case @param headerBaggageString exists, we can safely add the the 3rd party part of @param headerBaggage
 * with our @param incomingBaggage. This is possible because if we modified anything beforehand,
 * it would only affect parts of the sentry baggage (@see Baggage interface).
 *
 * @param incomingBaggage the baggage header of the incoming request that might contain sentry entries
 * @param headerBaggageString possibly existing baggage header string added from a third party to request headers
 *
 * @return a merged and serialized baggage string to be propagated with the outgoing request
 */


function mergeAndSerializeBaggage(incomingBaggage, headerBaggageString) {
  if (!incomingBaggage && !headerBaggageString) {
    return '';
  }

  var headerBaggage = headerBaggageString && parseBaggageString(headerBaggageString) || undefined;
  var thirdPartyHeaderBaggage = headerBaggage && getThirdPartyBaggage(headerBaggage);
  var finalBaggage = createBaggage(incomingBaggage && incomingBaggage[0] || {}, thirdPartyHeaderBaggage || incomingBaggage && incomingBaggage[1] || '');
  return serializeBaggage(finalBaggage);
}
/**
 * Helper function that takes a raw baggage string (if available) and the processed sentry-trace header
 * data (if available), parses the baggage string and creates a Baggage object
 * If there is no baggage string, it will create an empty Baggage object.
 * In a second step, this functions determines if the created Baggage object should be set immutable
 * to prevent mutation of the Sentry data.
 *
 * Extracted this logic to a function because it's duplicated in a lot of places.
 *
 * @param rawBaggageString
 * @param sentryTraceHeader
 */


function parseBaggageSetMutability(rawBaggageString, sentryTraceHeader) {
  var baggage = parseBaggageString(rawBaggageString || '');

  if (!isSentryBaggageEmpty(baggage) || sentryTraceHeader && isSentryBaggageEmpty(baggage)) {
    setBaggageImmutable(baggage);
  }

  return baggage;
}



/***/ }),

/***/ 2839:
/*!***************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/browser.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLocationHref": function() { return /* binding */ getLocationHref; },
/* harmony export */   "htmlTreeAsString": function() { return /* binding */ htmlTreeAsString; }
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global.js */ 2840);
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is.js */ 2838);


/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */

function htmlTreeAsString(elem, keyAttrs) {
  // try/catch both:
  // - accessing event.target (see getsentry/raven-js#838, #768)
  // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
  // - can throw an exception in some circumstances.
  try {
    let currentElem = elem;
    var MAX_TRAVERSE_HEIGHT = 5;
    var MAX_OUTPUT_LEN = 80;
    var out = [];
    let height = 0;
    let len = 0;
    var separator = ' > ';
    var sepLength = separator.length;
    let nextStr;

    while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
      nextStr = _htmlElementAsString(currentElem, keyAttrs); // bail out if
      // - nextStr is the 'html' element
      // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
      //   (ignore this limit if we are on the first iteration)

      if (nextStr === 'html' || height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN) {
        break;
      }

      out.push(nextStr);
      len += nextStr.length;
      currentElem = currentElem.parentNode;
    }

    return out.reverse().join(separator);
  } catch (_oO) {
    return '<unknown>';
  }
}
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */


function _htmlElementAsString(el, keyAttrs) {
  var elem = el;
  var out = [];
  let className;
  let classes;
  let key;
  let attr;
  let i;

  if (!elem || !elem.tagName) {
    return '';
  }

  out.push(elem.tagName.toLowerCase()); // Pairs of attribute keys defined in `serializeAttribute` and their values on element.

  var keyAttrPairs = keyAttrs && keyAttrs.length ? keyAttrs.filter(keyAttr => elem.getAttribute(keyAttr)).map(keyAttr => [keyAttr, elem.getAttribute(keyAttr)]) : null;

  if (keyAttrPairs && keyAttrPairs.length) {
    keyAttrPairs.forEach(keyAttrPair => {
      out.push("[".concat(keyAttrPair[0], "=\"").concat(keyAttrPair[1], "\"]"));
    });
  } else {
    if (elem.id) {
      out.push("#".concat(elem.id));
    }

    className = elem.className;

    if (className && (0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isString)(className)) {
      classes = className.split(/\s+/);

      for (i = 0; i < classes.length; i++) {
        out.push(".".concat(classes[i]));
      }
    }
  }

  var allowedAttrs = ['type', 'name', 'title', 'alt'];

  for (i = 0; i < allowedAttrs.length; i++) {
    key = allowedAttrs[i];
    attr = elem.getAttribute(key);

    if (attr) {
      out.push("[".concat(key, "=\"").concat(attr, "\"]"));
    }
  }

  return out.join('');
}
/**
 * A safe form of location.href
 */


function getLocationHref() {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();

  try {
    return global.document.location.href;
  } catch (oO) {
    return '';
  }
}



/***/ }),

/***/ 2870:
/*!***************************************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/buildPolyfills/_nullishCoalesce.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_nullishCoalesce": function() { return /* binding */ _nullishCoalesce; }
/* harmony export */ });
/**
 * Polyfill for the nullish coalescing operator (`??`).
 *
 * Note that the RHS is wrapped in a function so that if it's a computed value, that evaluation won't happen unless the
 * LHS evaluates to a nullish value, to mimic the operator's short-circuiting behavior.
 *
 * Adapted from Sucrase (https://github.com/alangpierce/sucrase)
 *
 * @param lhs The value of the expression to the left of the `??`
 * @param rhsFn A function returning the value of the expression to the right of the `??`
 * @returns The LHS value, unless it's `null` or `undefined`, in which case, the RHS value
 */
function _nullishCoalesce(lhs, rhsFn) {
  // by checking for loose equality to `null`, we catch both `null` and `undefined`
  return lhs != null ? lhs : rhsFn();
} // Sucrase version:
// function _nullishCoalesce(lhs, rhsFn) {
//   if (lhs != null) {
//     return lhs;
//   } else {
//     return rhsFn();
//   }
// }




/***/ }),

/***/ 2855:
/*!*************************************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/buildPolyfills/_optionalChain.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_optionalChain": function() { return /* binding */ _optionalChain; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Polyfill for the optional chain operator, `?.`, given previous conversion of the expression into an array of values,
 * descriptors, and functions.
 *
 * Adapted from Sucrase (https://github.com/alangpierce/sucrase)
 * See https://github.com/alangpierce/sucrase/blob/265887868966917f3b924ce38dfad01fbab1329f/src/transformers/OptionalChainingNullishTransformer.ts#L15
 *
 * @param ops Array result of expression conversion
 * @returns The value of the expression
 */
function _optionalChain(ops) {
  let lastAccessLHS = undefined;
  let value = ops[0];
  let i = 1;

  while (i < ops.length) {
    var op = ops[i];
    var fn = ops[i + 1];
    i += 2; // by checking for loose equality to `null`, we catch both `null` and `undefined`

    if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
      // really we're meaning to return `undefined` as an actual value here, but it saves bytes not to write it
      return;
    }

    if (op === 'access' || op === 'optionalAccess') {
      lastAccessLHS = value;
      value = fn(value);
    } else if (op === 'call' || op === 'optionalCall') {
      value = fn(function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return value.call(lastAccessLHS, ...args);
      });
      lastAccessLHS = undefined;
    }
  }

  return value;
} // Sucrase version
// function _optionalChain(ops) {
//   let lastAccessLHS = undefined;
//   let value = ops[0];
//   let i = 1;
//   while (i < ops.length) {
//     var op = ops[i];
//     var fn = ops[i + 1];
//     i += 2;
//     if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
//       return undefined;
//     }
//     if (op === 'access' || op === 'optionalAccess') {
//       lastAccessLHS = value;
//       value = fn(value);
//     } else if (op === 'call' || op === 'optionalCall') {
//       value = fn((...args) => value.call(lastAccessLHS, ...args));
//       lastAccessLHS = undefined;
//     }
//   }
//   return value;
// }




/***/ }),

/***/ 2863:
/*!********************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/clientreport.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createClientReportEnvelope": function() { return /* binding */ createClientReportEnvelope; }
/* harmony export */ });
/* harmony import */ var _envelope_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./envelope.js */ 2848);
/* harmony import */ var _time_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time.js */ 1272);


/**
 * Creates client report envelope
 * @param discarded_events An array of discard events
 * @param dsn A DSN that can be set on the header. Optional.
 */

function createClientReportEnvelope(discarded_events, dsn, timestamp) {
  var clientReportItem = [{
    type: 'client_report'
  }, {
    timestamp: timestamp || (0,_time_js__WEBPACK_IMPORTED_MODULE_0__.dateTimestampInSeconds)(),
    discarded_events
  }];
  return (0,_envelope_js__WEBPACK_IMPORTED_MODULE_1__.createEnvelope)(dsn ? {
    dsn
  } : {}, [clientReportItem]);
}



/***/ }),

/***/ 2851:
/*!***********************************************!*\
  !*** ./node_modules/@sentry/utils/esm/dsn.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dsnToString": function() { return /* binding */ dsnToString; },
/* harmony export */   "extensionRelayDSN": function() { return /* binding */ extensionRelayDSN; },
/* harmony export */   "makeDsn": function() { return /* binding */ makeDsn; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error.js */ 2847);


/** Regular expression used to parse a Dsn. */

var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;

function isValidProtocol(protocol) {
  return protocol === 'http' || protocol === 'https';
}
/**
 * Renders the string representation of this Dsn.
 *
 * By default, this will render the public representation without the password
 * component. To get the deprecated private representation, set `withPassword`
 * to true.
 *
 * @param withPassword When set to true, the password will be included.
 */


function dsnToString(dsn) {
  let withPassword = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const {
    host,
    path,
    pass,
    port,
    projectId,
    protocol,
    publicKey
  } = dsn;
  return "".concat(protocol, "://").concat(publicKey).concat(withPassword && pass ? ":".concat(pass) : '') + "@".concat(host).concat(port ? ":".concat(port) : '', "/").concat(path ? "".concat(path, "/") : path).concat(projectId);
}
/**
 * Parses a Dsn from a given string.
 *
 * @param str A Dsn as string
 * @returns Dsn as DsnComponents
 */


function dsnFromString(str) {
  var match = DSN_REGEX.exec(str);

  if (!match) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.SentryError("Invalid Sentry Dsn: ".concat(str));
  }

  const [protocol, publicKey, pass = '', host, port = '', lastPath] = match.slice(1);
  let path = '';
  let projectId = lastPath;
  var split = projectId.split('/');

  if (split.length > 1) {
    path = split.slice(0, -1).join('/');
    projectId = split.pop();
  }

  if (projectId) {
    var projectMatch = projectId.match(/^\d+/);

    if (projectMatch) {
      projectId = projectMatch[0];
    }
  }

  return dsnFromComponents({
    host,
    pass,
    path,
    projectId,
    port,
    protocol: protocol,
    publicKey
  });
}

function dsnFromComponents(components) {
  return {
    protocol: components.protocol,
    publicKey: components.publicKey || '',
    pass: components.pass || '',
    host: components.host,
    port: components.port || '',
    path: components.path || '',
    projectId: components.projectId
  };
}

function validateDsn(dsn) {
  if (!(typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__)) {
    return;
  }

  const {
    port,
    projectId,
    protocol
  } = dsn;
  var requiredComponents = ['protocol', 'publicKey', 'host', 'projectId'];
  requiredComponents.forEach(component => {
    if (!dsn[component]) {
      throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.SentryError("Invalid Sentry Dsn: ".concat(component, " missing"));
    }
  });

  if (!projectId.match(/^\d+$/)) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.SentryError("Invalid Sentry Dsn: Invalid projectId ".concat(projectId));
  }

  if (!isValidProtocol(protocol)) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.SentryError("Invalid Sentry Dsn: Invalid protocol ".concat(protocol));
  }

  if (port && isNaN(parseInt(port, 10))) {
    throw new _error_js__WEBPACK_IMPORTED_MODULE_1__.SentryError("Invalid Sentry Dsn: Invalid port ".concat(port));
  }

  return true;
}
/** The Sentry Dsn, identifying a Sentry instance and project. */


function makeDsn(from) {
  var components = typeof from === 'string' ? dsnFromString(from) : dsnFromComponents(from);
  validateDsn(components);
  return components;
}
/**
 * Changes a Dsn to point to the `relay` server running in the Lambda Extension.
 *
 * This is only used by the serverless integration for AWS Lambda.
 *
 * @param originalDsn The original Dsn of the customer.
 * @returns Dsn pointing to Lambda extension.
 */


function extensionRelayDSN(originalDsn) {
  if (originalDsn === undefined) {
    return undefined;
  }

  var dsn = dsnFromString(originalDsn);
  dsn.host = 'localhost';
  dsn.port = '3000';
  dsn.protocol = 'http';
  return dsnToString(dsn);
}



/***/ }),

/***/ 2841:
/*!***********************************************!*\
  !*** ./node_modules/@sentry/utils/esm/env.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBrowserBundle": function() { return /* binding */ isBrowserBundle; }
/* harmony export */ });
/*
 * This module exists for optimizations in the build process through rollup and terser.  We define some global
 * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
 * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
 * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
 * `logger` and preventing node-related code from appearing in browser bundles.
 *
 * Attention:
 * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
 * users. These fags should live in their respective packages, as we identified user tooling (specifically webpack)
 * having issues tree-shaking these constants across package boundaries.
 * An example for this is the __SENTRY_DEBUG__ constant. It is declared in each package individually because we want
 * users to be able to shake away expressions that it guards.
 */

/**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */
function isBrowserBundle() {
  return typeof __SENTRY_BROWSER_BUNDLE__ !== 'undefined' && !!__SENTRY_BROWSER_BUNDLE__;
}



/***/ }),

/***/ 2848:
/*!****************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/envelope.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addItemToEnvelope": function() { return /* binding */ addItemToEnvelope; },
/* harmony export */   "createAttachmentEnvelopeItem": function() { return /* binding */ createAttachmentEnvelopeItem; },
/* harmony export */   "createEnvelope": function() { return /* binding */ createEnvelope; },
/* harmony export */   "envelopeItemTypeToDataCategory": function() { return /* binding */ envelopeItemTypeToDataCategory; },
/* harmony export */   "forEachEnvelopeItem": function() { return /* binding */ forEachEnvelopeItem; },
/* harmony export */   "serializeEnvelope": function() { return /* binding */ serializeEnvelope; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_typed_array_uint8_array_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.typed-array.uint8-array.js */ 196);
/* harmony import */ var core_js_modules_es_typed_array_uint8_array_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_uint8_array_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/esnext.typed-array.at.js */ 171);
/* harmony import */ var core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.typed-array.fill.js */ 172);
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.typed-array.set.js */ 173);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.typed-array.sort.js */ 174);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./object.js */ 2837);







/**
 * Creates an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */

function createEnvelope(headers) {
  let items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return [headers, items];
}
/**
 * Add an item to an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */


function addItemToEnvelope(envelope, newItem) {
  const [headers, items] = envelope;
  return [headers, [...items, newItem]];
}
/**
 * Convenience function to loop through the items and item types of an envelope.
 * (This function was mostly created because working with envelope types is painful at the moment)
 */


function forEachEnvelopeItem(envelope, callback) {
  var envelopeItems = envelope[1];
  envelopeItems.forEach(envelopeItem => {
    var envelopeItemType = envelopeItem[0].type;
    callback(envelopeItem, envelopeItemType);
  });
}

function encodeUTF8(input, textEncoder) {
  var utf8 = textEncoder || new TextEncoder();
  return utf8.encode(input);
}
/**
 * Serializes an envelope.
 */


function serializeEnvelope(envelope, textEncoder) {
  const [envHeaders, items] = envelope; // Initially we construct our envelope as a string and only convert to binary chunks if we encounter binary data

  let parts = JSON.stringify(envHeaders);

  function append(next) {
    if (typeof parts === 'string') {
      parts = typeof next === 'string' ? parts + next : [encodeUTF8(parts, textEncoder), next];
    } else {
      parts.push(typeof next === 'string' ? encodeUTF8(next, textEncoder) : next);
    }
  }

  for (var item of items) {
    const [itemHeaders, payload] = item;
    append("\n".concat(JSON.stringify(itemHeaders), "\n"));
    append(typeof payload === 'string' || payload instanceof Uint8Array ? payload : JSON.stringify(payload));
  }

  return typeof parts === 'string' ? parts : concatBuffers(parts);
}

function concatBuffers(buffers) {
  var totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  var merged = new Uint8Array(totalLength);
  let offset = 0;

  for (var buffer of buffers) {
    merged.set(buffer, offset);
    offset += buffer.length;
  }

  return merged;
}
/**
 * Creates attachment envelope items
 */


function createAttachmentEnvelopeItem(attachment, textEncoder) {
  var buffer = typeof attachment.data === 'string' ? encodeUTF8(attachment.data, textEncoder) : attachment.data;
  return [(0,_object_js__WEBPACK_IMPORTED_MODULE_6__.dropUndefinedKeys)({
    type: 'attachment',
    length: buffer.length,
    filename: attachment.filename,
    content_type: attachment.contentType,
    attachment_type: attachment.attachmentType
  }), buffer];
}

var ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
  session: 'session',
  sessions: 'session',
  attachment: 'attachment',
  transaction: 'transaction',
  event: 'error',
  client_report: 'internal',
  user_report: 'default'
};
/**
 * Maps the type of an envelope item to a data category.
 */

function envelopeItemTypeToDataCategory(type) {
  return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}



/***/ }),

/***/ 2847:
/*!*************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/error.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SentryError": function() { return /* binding */ SentryError; }
/* harmony export */ });
/** An error emitted by Sentry SDKs and related utilities. */
class SentryError extends Error {
  /** Display name of this error instance. */
  constructor(message) {
    super(message);
    this.message = message;
    ;
    this.name = new.target.prototype.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

}



/***/ }),

/***/ 2840:
/*!**************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/global.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getGlobalObject": function() { return /* binding */ getGlobalObject; },
/* harmony export */   "getGlobalSingleton": function() { return /* binding */ getGlobalSingleton; }
/* harmony export */ });
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node.js */ 165);

/** Internal */

var fallbackGlobalObject = {};
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */

function getGlobalObject() {
  return (0,_node_js__WEBPACK_IMPORTED_MODULE_0__.isNodeEnv)() ? __webpack_require__.g : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : fallbackGlobalObject;
}
/**
 * Returns a global singleton contained in the global `__SENTRY__` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `getGlobalObject`'s return value
 * @returns the singleton
 */


function getGlobalSingleton(name, creator, obj) {
  var global = obj || getGlobalObject();

  var __SENTRY__ = global.__SENTRY__ = global.__SENTRY__ || {};

  var singleton = __SENTRY__[name] || (__SENTRY__[name] = creator());
  return singleton;
}



/***/ }),

/***/ 2860:
/*!******************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/instrument.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addInstrumentationHandler": function() { return /* binding */ addInstrumentationHandler; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global.js */ 2840);
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./is.js */ 2838);
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logger.js */ 2845);
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./object.js */ 2837);
/* harmony import */ var _stacktrace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./stacktrace.js */ 2858);
/* harmony import */ var _supports_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./supports.js */ 2861);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();
/**
 * Instrument native APIs to call handlers that can be used to create breadcrumbs, APM spans etc.
 *  - Console API
 *  - Fetch API
 *  - XHR API
 *  - History API
 *  - DOM API (click/typing)
 *  - Error API
 *  - UnhandledRejection API
 */

var handlers = {};
var instrumented = {};
/** Instruments given API */

function instrument(type) {
  if (instrumented[type]) {
    return;
  }

  instrumented[type] = true;

  switch (type) {
    case 'console':
      instrumentConsole();
      break;

    case 'dom':
      instrumentDOM();
      break;

    case 'xhr':
      instrumentXHR();
      break;

    case 'fetch':
      instrumentFetch();
      break;

    case 'history':
      instrumentHistory();
      break;

    case 'error':
      instrumentError();
      break;

    case 'unhandledrejection':
      instrumentUnhandledRejection();
      break;

    default:
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _logger_js__WEBPACK_IMPORTED_MODULE_2__.logger.warn('unknown instrumentation type:', type);
      return;
  }
}
/**
 * Add handler that will be called when given type of instrumentation triggers.
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */


function addInstrumentationHandler(type, callback) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(callback);
  instrument(type);
}
/** JSDoc */


function triggerHandlers(type, data) {
  if (!type || !handlers[type]) {
    return;
  }

  for (var handler of handlers[type] || []) {
    try {
      handler(data);
    } catch (e) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _logger_js__WEBPACK_IMPORTED_MODULE_2__.logger.error("Error while triggering instrumentation handler.\nType: ".concat(type, "\nName: ").concat((0,_stacktrace_js__WEBPACK_IMPORTED_MODULE_3__.getFunctionName)(handler), "\nError:"), e);
    }
  }
}
/** JSDoc */


function instrumentConsole() {
  if (!('console' in global)) {
    return;
  }

  _logger_js__WEBPACK_IMPORTED_MODULE_2__.CONSOLE_LEVELS.forEach(function (level) {
    if (!(level in global.console)) {
      return;
    }

    (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(global.console, level, function (originalConsoleMethod) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        triggerHandlers('console', {
          args,
          level
        }); // this fails for some browsers. :(

        if (originalConsoleMethod) {
          originalConsoleMethod.apply(global.console, args);
        }
      };
    });
  });
}
/** JSDoc */


function instrumentFetch() {
  if (!(0,_supports_js__WEBPACK_IMPORTED_MODULE_5__.supportsNativeFetch)()) {
    return;
  }

  (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(global, 'fetch', function (originalFetch) {
    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var handlerData = {
        args,
        fetchData: {
          method: getFetchMethod(args),
          url: getFetchUrl(args)
        },
        startTimestamp: Date.now()
      };
      triggerHandlers('fetch', _objectSpread({}, handlerData));
      return originalFetch.apply(global, args).then(response => {
        triggerHandlers('fetch', _objectSpread(_objectSpread({}, handlerData), {}, {
          endTimestamp: Date.now(),
          response
        }));
        return response;
      }, error => {
        triggerHandlers('fetch', _objectSpread(_objectSpread({}, handlerData), {}, {
          endTimestamp: Date.now(),
          error
        })); // NOTE: If you are a Sentry user, and you are seeing this stack frame,
        //       it means the sentry.javascript SDK caught an error invoking your application code.
        //       This is expected behavior and NOT indicative of a bug with sentry.javascript.

        throw error;
      });
    };
  });
}
/** Extract `method` from fetch call arguments */


function getFetchMethod() {
  let fetchArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if ('Request' in global && (0,_is_js__WEBPACK_IMPORTED_MODULE_6__.isInstanceOf)(fetchArgs[0], Request) && fetchArgs[0].method) {
    return String(fetchArgs[0].method).toUpperCase();
  }

  if (fetchArgs[1] && fetchArgs[1].method) {
    return String(fetchArgs[1].method).toUpperCase();
  }

  return 'GET';
}
/** Extract `url` from fetch call arguments */


function getFetchUrl() {
  let fetchArgs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (typeof fetchArgs[0] === 'string') {
    return fetchArgs[0];
  }

  if ('Request' in global && (0,_is_js__WEBPACK_IMPORTED_MODULE_6__.isInstanceOf)(fetchArgs[0], Request)) {
    return fetchArgs[0].url;
  }

  return String(fetchArgs[0]);
}
/** JSDoc */


function instrumentXHR() {
  if (!('XMLHttpRequest' in global)) {
    return;
  }

  var xhrproto = XMLHttpRequest.prototype;
  (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(xhrproto, 'open', function (originalOpen) {
    return function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var xhr = this;
      var url = args[1];
      var xhrInfo = xhr.__sentry_xhr__ = {
        method: (0,_is_js__WEBPACK_IMPORTED_MODULE_6__.isString)(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1]
      }; // if Sentry key appears in URL, don't capture it as a request

      if ((0,_is_js__WEBPACK_IMPORTED_MODULE_6__.isString)(url) && xhrInfo.method === 'POST' && url.match(/sentry_key/)) {
        xhr.__sentry_own_request__ = true;
      }

      var onreadystatechangeHandler = function () {
        if (xhr.readyState === 4) {
          try {
            // touching statusCode in some platforms throws
            // an exception
            xhrInfo.status_code = xhr.status;
          } catch (e) {
            /* do nothing */
          }

          triggerHandlers('xhr', {
            args,
            endTimestamp: Date.now(),
            startTimestamp: Date.now(),
            xhr
          });
        }
      };

      if ('onreadystatechange' in xhr && typeof xhr.onreadystatechange === 'function') {
        (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(xhr, 'onreadystatechange', function (original) {
          return function () {
            onreadystatechangeHandler();

            for (var _len4 = arguments.length, readyStateArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              readyStateArgs[_key4] = arguments[_key4];
            }

            return original.apply(xhr, readyStateArgs);
          };
        });
      } else {
        xhr.addEventListener('readystatechange', onreadystatechangeHandler);
      }

      return originalOpen.apply(xhr, args);
    };
  });
  (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(xhrproto, 'send', function (originalSend) {
    return function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      if (this.__sentry_xhr__ && args[0] !== undefined) {
        this.__sentry_xhr__.body = args[0];
      }

      triggerHandlers('xhr', {
        args,
        startTimestamp: Date.now(),
        xhr: this
      });
      return originalSend.apply(this, args);
    };
  });
}

let lastHref;
/** JSDoc */

function instrumentHistory() {
  if (!(0,_supports_js__WEBPACK_IMPORTED_MODULE_5__.supportsHistory)()) {
    return;
  }

  var oldOnPopState = global.onpopstate;

  global.onpopstate = function () {
    var to = global.location.href; // keep track of the current URL state, as we always receive only the updated state

    var from = lastHref;
    lastHref = to;
    triggerHandlers('history', {
      from,
      to
    });

    if (oldOnPopState) {
      // Apparently this can throw in Firefox when incorrectly implemented plugin is installed.
      // https://github.com/getsentry/sentry-javascript/issues/3344
      // https://github.com/bugsnag/bugsnag-js/issues/469
      try {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        return oldOnPopState.apply(this, args);
      } catch (_oO) {// no-empty
      }
    }
  };
  /** @hidden */


  function historyReplacementFunction(originalHistoryFunction) {
    return function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      var url = args.length > 2 ? args[2] : undefined;

      if (url) {
        // coerce to string (this is what pushState does)
        var from = lastHref;
        var to = String(url); // keep track of the current URL state, as we always receive only the updated state

        lastHref = to;
        triggerHandlers('history', {
          from,
          to
        });
      }

      return originalHistoryFunction.apply(this, args);
    };
  }

  (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(global.history, 'pushState', historyReplacementFunction);
  (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(global.history, 'replaceState', historyReplacementFunction);
}

var debounceDuration = 1000;
let debounceTimerID;
let lastCapturedEvent;
/**
 * Decide whether the current event should finish the debounce of previously captured one.
 * @param previous previously captured event
 * @param current event to be captured
 */

function shouldShortcircuitPreviousDebounce(previous, current) {
  // If there was no previous event, it should always be swapped for the new one.
  if (!previous) {
    return true;
  } // If both events have different type, then user definitely performed two separate actions. e.g. click + keypress.


  if (previous.type !== current.type) {
    return true;
  }

  try {
    // If both events have the same type, it's still possible that actions were performed on different targets.
    // e.g. 2 clicks on different buttons.
    if (previous.target !== current.target) {
      return true;
    }
  } catch (e) {// just accessing `target` property can throw an exception in some rare circumstances
    // see: https://github.com/getsentry/sentry-javascript/issues/838
  } // If both events have the same type _and_ same `target` (an element which triggered an event, _not necessarily_
  // to which an event listener was attached), we treat them as the same action, as we want to capture
  // only one breadcrumb. e.g. multiple clicks on the same button, or typing inside a user input box.


  return false;
}
/**
 * Decide whether an event should be captured.
 * @param event event to be captured
 */


function shouldSkipDOMEvent(event) {
  // We are only interested in filtering `keypress` events for now.
  if (event.type !== 'keypress') {
    return false;
  }

  try {
    var target = event.target;

    if (!target || !target.tagName) {
      return true;
    } // Only consider keypress events on actual input elements. This will disregard keypresses targeting body
    // e.g.tabbing through elements, hotkeys, etc.


    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return false;
    }
  } catch (e) {// just accessing `target` property can throw an exception in some rare circumstances
    // see: https://github.com/getsentry/sentry-javascript/issues/838
  }

  return true;
}
/**
 * Wraps addEventListener to capture UI breadcrumbs
 * @param handler function that will be triggered
 * @param globalListener indicates whether event was captured by the global event listener
 * @returns wrapped breadcrumb events handler
 * @hidden
 */


function makeDOMEventHandler(handler) {
  let globalListener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return event => {
    // It's possible this handler might trigger multiple times for the same
    // event (e.g. event propagation through node ancestors).
    // Ignore if we've already captured that event.
    if (!event || lastCapturedEvent === event) {
      return;
    } // We always want to skip _some_ events.


    if (shouldSkipDOMEvent(event)) {
      return;
    }

    var name = event.type === 'keypress' ? 'input' : event.type; // If there is no debounce timer, it means that we can safely capture the new event and store it for future comparisons.

    if (debounceTimerID === undefined) {
      handler({
        event: event,
        name,
        global: globalListener
      });
      lastCapturedEvent = event;
    } // If there is a debounce awaiting, see if the new event is different enough to treat it as a unique one.
    // If that's the case, emit the previous event and store locally the newly-captured DOM event.
    else if (shouldShortcircuitPreviousDebounce(lastCapturedEvent, event)) {
      handler({
        event: event,
        name,
        global: globalListener
      });
      lastCapturedEvent = event;
    } // Start a new debounce timer that will prevent us from capturing multiple events that should be grouped together.


    clearTimeout(debounceTimerID);
    debounceTimerID = global.setTimeout(() => {
      debounceTimerID = undefined;
    }, debounceDuration);
  };
}
/** JSDoc */


function instrumentDOM() {
  if (!('document' in global)) {
    return;
  } // Make it so that any click or keypress that is unhandled / bubbled up all the way to the document triggers our dom
  // handlers. (Normally we have only one, which captures a breadcrumb for each click or keypress.) Do this before
  // we instrument `addEventListener` so that we don't end up attaching this handler twice.


  var triggerDOMHandler = triggerHandlers.bind(null, 'dom');
  var globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
  global.document.addEventListener('click', globalDOMEventHandler, false);
  global.document.addEventListener('keypress', globalDOMEventHandler, false); // After hooking into click and keypress events bubbled up to `document`, we also hook into user-handled
  // clicks & keypresses, by adding an event listener of our own to any element to which they add a listener. That
  // way, whenever one of their handlers is triggered, ours will be, too. (This is needed because their handler
  // could potentially prevent the event from bubbling up to our global listeners. This way, our handler are still
  // guaranteed to fire at least once.)

  ['EventTarget', 'Node'].forEach(target => {
    var proto = global[target] && global[target].prototype;

    if (!proto || !proto.hasOwnProperty || !proto.hasOwnProperty('addEventListener')) {
      return;
    }

    (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(proto, 'addEventListener', function (originalAddEventListener) {
      return function (type, listener, options) {
        if (type === 'click' || type == 'keypress') {
          try {
            var el = this;
            var handlers = el.__sentry_instrumentation_handlers__ = el.__sentry_instrumentation_handlers__ || {};
            var handlerForType = handlers[type] = handlers[type] || {
              refCount: 0
            };

            if (!handlerForType.handler) {
              var handler = makeDOMEventHandler(triggerDOMHandler);
              handlerForType.handler = handler;
              originalAddEventListener.call(this, type, handler, options);
            }

            handlerForType.refCount += 1;
          } catch (e) {// Accessing dom properties is always fragile.
            // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
          }
        }

        return originalAddEventListener.call(this, type, listener, options);
      };
    });
    (0,_object_js__WEBPACK_IMPORTED_MODULE_4__.fill)(proto, 'removeEventListener', function (originalRemoveEventListener) {
      return function (type, listener, options) {
        if (type === 'click' || type == 'keypress') {
          try {
            var el = this;
            var handlers = el.__sentry_instrumentation_handlers__ || {};
            var handlerForType = handlers[type];

            if (handlerForType) {
              handlerForType.refCount -= 1; // If there are no longer any custom handlers of the current type on this element, we can remove ours, too.

              if (handlerForType.refCount <= 0) {
                originalRemoveEventListener.call(this, type, handlerForType.handler, options);
                handlerForType.handler = undefined;
                delete handlers[type];
              } // If there are no longer any custom handlers of any type on this element, cleanup everything.


              if (Object.keys(handlers).length === 0) {
                delete el.__sentry_instrumentation_handlers__;
              }
            }
          } catch (e) {// Accessing dom properties is always fragile.
            // Also allows us to skip `addEventListenrs` calls with no proper `this` context.
          }
        }

        return originalRemoveEventListener.call(this, type, listener, options);
      };
    });
  });
}

let _oldOnErrorHandler = null;
/** JSDoc */

function instrumentError() {
  _oldOnErrorHandler = global.onerror;

  global.onerror = function (msg, url, line, column, error) {
    triggerHandlers('error', {
      column,
      error,
      line,
      msg,
      url
    });

    if (_oldOnErrorHandler) {
      return _oldOnErrorHandler.apply(this, arguments);
    }

    return false;
  };
}

let _oldOnUnhandledRejectionHandler = null;
/** JSDoc */

function instrumentUnhandledRejection() {
  _oldOnUnhandledRejectionHandler = global.onunhandledrejection;

  global.onunhandledrejection = function (e) {
    triggerHandlers('unhandledrejection', e);

    if (_oldOnUnhandledRejectionHandler) {
      return _oldOnUnhandledRejectionHandler.apply(this, arguments);
    }

    return true;
  };
}



/***/ }),

/***/ 2838:
/*!**********************************************!*\
  !*** ./node_modules/@sentry/utils/esm/is.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isDOMError": function() { return /* binding */ isDOMError; },
/* harmony export */   "isDOMException": function() { return /* binding */ isDOMException; },
/* harmony export */   "isElement": function() { return /* binding */ isElement; },
/* harmony export */   "isError": function() { return /* binding */ isError; },
/* harmony export */   "isErrorEvent": function() { return /* binding */ isErrorEvent; },
/* harmony export */   "isEvent": function() { return /* binding */ isEvent; },
/* harmony export */   "isInstanceOf": function() { return /* binding */ isInstanceOf; },
/* harmony export */   "isNaN": function() { return /* binding */ isNaN; },
/* harmony export */   "isPlainObject": function() { return /* binding */ isPlainObject; },
/* harmony export */   "isPrimitive": function() { return /* binding */ isPrimitive; },
/* harmony export */   "isRegExp": function() { return /* binding */ isRegExp; },
/* harmony export */   "isString": function() { return /* binding */ isString; },
/* harmony export */   "isSyntheticEvent": function() { return /* binding */ isSyntheticEvent; },
/* harmony export */   "isThenable": function() { return /* binding */ isThenable; }
/* harmony export */ });
var objectToString = Object.prototype.toString;
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */

function isError(wat) {
  switch (objectToString.call(wat)) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMException]':
      return true;

    default:
      return isInstanceOf(wat, Error);
  }
}

function isBuiltin(wat, ty) {
  return objectToString.call(wat) === "[object ".concat(ty, "]");
}
/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isErrorEvent(wat) {
  return isBuiltin(wat, 'ErrorEvent');
}
/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isDOMError(wat) {
  return isBuiltin(wat, 'DOMError');
}
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isDOMException(wat) {
  return isBuiltin(wat, 'DOMException');
}
/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isString(wat) {
  return isBuiltin(wat, 'String');
}
/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isPrimitive(wat) {
  return wat === null || typeof wat !== 'object' && typeof wat !== 'function';
}
/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isPlainObject(wat) {
  return isBuiltin(wat, 'Object');
}
/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isEvent(wat) {
  return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isElement(wat) {
  return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
}
/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isRegExp(wat) {
  return isBuiltin(wat, 'RegExp');
}
/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */


function isThenable(wat) {
  return Boolean(wat && wat.then && typeof wat.then === 'function');
}
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isSyntheticEvent(wat) {
  return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}
/**
 * Checks whether given value is NaN
 * {@link isNaN}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */


function isNaN(wat) {
  return typeof wat === 'number' && wat !== wat;
}
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */


function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch (_e) {
    return false;
  }
}



/***/ }),

/***/ 2845:
/*!**************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/logger.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CONSOLE_LEVELS": function() { return /* binding */ CONSOLE_LEVELS; },
/* harmony export */   "consoleSandbox": function() { return /* binding */ consoleSandbox; },
/* harmony export */   "logger": function() { return /* binding */ logger; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./global.js */ 2840);

 // TODO: Implement different loggers for different environments

var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();
/** Prefix for logging strings */

var PREFIX = 'Sentry Logger ';
var CONSOLE_LEVELS = ['debug', 'info', 'warn', 'error', 'log', 'assert', 'trace'];
/**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */

function consoleSandbox(callback) {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalObject)();

  if (!('console' in global)) {
    return callback();
  }

  var originalConsole = global.console;
  var wrappedLevels = {}; // Restore all wrapped console methods

  CONSOLE_LEVELS.forEach(level => {
    // TODO(v7): Remove this check as it's only needed for Node 6
    var originalWrappedFunc = originalConsole[level] && originalConsole[level].__sentry_original__;

    if (level in global.console && originalWrappedFunc) {
      wrappedLevels[level] = originalConsole[level];
      originalConsole[level] = originalWrappedFunc;
    }
  });

  try {
    return callback();
  } finally {
    // Revert restoration to wrapped state
    Object.keys(wrappedLevels).forEach(level => {
      originalConsole[level] = wrappedLevels[level];
    });
  }
}

function makeLogger() {
  let enabled = false;
  var logger = {
    enable: () => {
      enabled = true;
    },
    disable: () => {
      enabled = false;
    }
  };

  if (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) {
    CONSOLE_LEVELS.forEach(name => {
      logger[name] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (enabled) {
          consoleSandbox(() => {
            global.console[name]("".concat(PREFIX, "[").concat(name, "]:"), ...args);
          });
        }
      };
    });
  } else {
    CONSOLE_LEVELS.forEach(name => {
      logger[name] = () => undefined;
    });
  }

  return logger;
} // Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used


let logger;

if (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) {
  logger = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalSingleton)('logger', makeLogger);
} else {
  logger = makeLogger();
}



/***/ }),

/***/ 2857:
/*!************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/memo.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "memoBuilder": function() { return /* binding */ memoBuilder; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Helper to decycle json objects
 */
function memoBuilder() {
  var hasWeakSet = typeof WeakSet === 'function';
  var inner = hasWeakSet ? new WeakSet() : [];

  function memoize(obj) {
    if (hasWeakSet) {
      if (inner.has(obj)) {
        return true;
      }

      inner.add(obj);
      return false;
    }

    for (let i = 0; i < inner.length; i++) {
      var value = inner[i];

      if (value === obj) {
        return true;
      }
    }

    inner.push(obj);
    return false;
  }

  function unmemoize(obj) {
    if (hasWeakSet) {
      inner.delete(obj);
    } else {
      for (let i = 0; i < inner.length; i++) {
        if (inner[i] === obj) {
          inner.splice(i, 1);
          break;
        }
      }
    }
  }

  return [memoize, unmemoize];
}



/***/ }),

/***/ 813:
/*!************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/misc.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addContextToFrame": function() { return /* binding */ addContextToFrame; },
/* harmony export */   "addExceptionMechanism": function() { return /* binding */ addExceptionMechanism; },
/* harmony export */   "addExceptionTypeValue": function() { return /* binding */ addExceptionTypeValue; },
/* harmony export */   "checkOrSetAlreadyCaught": function() { return /* binding */ checkOrSetAlreadyCaught; },
/* harmony export */   "getEventDescription": function() { return /* binding */ getEventDescription; },
/* harmony export */   "parseSemver": function() { return /* binding */ parseSemver; },
/* harmony export */   "parseUrl": function() { return /* binding */ parseUrl; },
/* harmony export */   "stripUrlQueryAndFragment": function() { return /* binding */ stripUrlQueryAndFragment; },
/* harmony export */   "uuid4": function() { return /* binding */ uuid4; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_typed_array_uint16_array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.typed-array.uint16-array.js */ 1509);
/* harmony import */ var core_js_modules_es_typed_array_uint16_array_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_uint16_array_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/esnext.typed-array.at.js */ 171);
/* harmony import */ var core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_esnext_typed_array_at_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.typed-array.fill.js */ 172);
/* harmony import */ var core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_fill_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.typed-array.set.js */ 173);
/* harmony import */ var core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_set_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.typed-array.sort.js */ 174);
/* harmony import */ var core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_typed_array_sort_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./global.js */ 2840);
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./object.js */ 2837);
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./string.js */ 2842);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











/**
 * Extended Window interface that allows for Crypto API usage in IE browsers
 */

/**
 * UUID4 generator
 *
 * @returns string Generated UUID4.
 */

function uuid4() {
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_7__.getGlobalObject)();
  var crypto = global.crypto || global.msCrypto;

  if (!(crypto === void 0) && crypto.getRandomValues) {
    // Use window.crypto API if available
    var arr = new Uint16Array(8);
    crypto.getRandomValues(arr); // set 4 in byte 7

    arr[3] = arr[3] & 0xfff | 0x4000; // set 2 most significant bits of byte 9 to '10'

    arr[4] = arr[4] & 0x3fff | 0x8000;

    var pad = num => {
      let v = num.toString(16);

      while (v.length < 4) {
        v = "0".concat(v);
      }

      return v;
    };

    return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
  } // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523


  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */


function parseUrl(url) {
  if (!url) {
    return {};
  }

  var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);

  if (!match) {
    return {};
  } // coerce to undefined values to empty string so we don't get 'undefined'


  var query = match[6] || '';
  var fragment = match[8] || '';
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment // everything minus origin

  };
}

function getFirstException(event) {
  return event.exception && event.exception.values ? event.exception.values[0] : undefined;
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */


function getEventDescription(event) {
  const {
    message,
    event_id: eventId
  } = event;

  if (message) {
    return message;
  }

  var firstException = getFirstException(event);

  if (firstException) {
    if (firstException.type && firstException.value) {
      return "".concat(firstException.type, ": ").concat(firstException.value);
    }

    return firstException.type || firstException.value || eventId || '<unknown>';
  }

  return eventId || '<unknown>';
}
/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */


function addExceptionTypeValue(event, value, type) {
  var exception = event.exception = event.exception || {};
  var values = exception.values = exception.values || [];
  var firstException = values[0] = values[0] || {};

  if (!firstException.value) {
    firstException.value = value || '';
  }

  if (!firstException.type) {
    firstException.type = type || 'Error';
  }
}
/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */


function addExceptionMechanism(event, newMechanism) {
  var firstException = getFirstException(event);

  if (!firstException) {
    return;
  }

  var defaultMechanism = {
    type: 'generic',
    handled: true
  };
  var currentMechanism = firstException.mechanism;
  firstException.mechanism = _objectSpread(_objectSpread(_objectSpread({}, defaultMechanism), currentMechanism), newMechanism);

  if (newMechanism && 'data' in newMechanism) {
    var mergedData = _objectSpread(_objectSpread({}, currentMechanism && currentMechanism.data), newMechanism.data);

    firstException.mechanism.data = mergedData;
  }
} // https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string


var SEMVER_REGEXP = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
/**
 * Represents Semantic Versioning object
 */

/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */

function parseSemver(input) {
  var match = input.match(SEMVER_REGEXP) || [];
  var major = parseInt(match[1], 10);
  var minor = parseInt(match[2], 10);
  var patch = parseInt(match[3], 10);
  return {
    buildmetadata: match[5],
    major: isNaN(major) ? undefined : major,
    minor: isNaN(minor) ? undefined : minor,
    patch: isNaN(patch) ? undefined : patch,
    prerelease: match[4]
  };
}
/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */


function addContextToFrame(lines, frame) {
  let linesOfContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
  var lineno = frame.lineno || 0;
  var maxLines = lines.length;
  var sourceLine = Math.max(Math.min(maxLines, lineno - 1), 0);
  frame.pre_context = lines.slice(Math.max(0, sourceLine - linesOfContext), sourceLine).map(line => (0,_string_js__WEBPACK_IMPORTED_MODULE_8__.snipLine)(line, 0));
  frame.context_line = (0,_string_js__WEBPACK_IMPORTED_MODULE_8__.snipLine)(lines[Math.min(maxLines - 1, sourceLine)], frame.colno || 0);
  frame.post_context = lines.slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext).map(line => (0,_string_js__WEBPACK_IMPORTED_MODULE_8__.snipLine)(line, 0));
}
/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */


function stripUrlQueryAndFragment(urlPath) {
  return urlPath.split(/[\?#]/, 1)[0];
}
/**
 * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
 * in question), and marks it captured if not.
 *
 * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
 * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
 * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
 * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
 * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
 * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
 * see it.
 *
 * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
 * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
 * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
 * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
 * must be done before the exception captured.
 *
 * @param A thrown exception to check or flag as having been seen
 * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
 */


function checkOrSetAlreadyCaught(exception) {
  if (exception && exception.__sentry_captured__) {
    return true;
  }

  try {
    // set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
    // `ExtraErrorData` integration
    (0,_object_js__WEBPACK_IMPORTED_MODULE_9__.addNonEnumerableProperty)(exception, '__sentry_captured__', true);
  } catch (err) {// `exception` is a primitive, so we can't mark it seen
  }

  return false;
}



/***/ }),

/***/ 165:
/*!************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/node.js ***!
  \************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dynamicRequire": function() { return /* binding */ dynamicRequire; },
/* harmony export */   "isNodeEnv": function() { return /* binding */ isNodeEnv; },
/* harmony export */   "loadModule": function() { return /* binding */ loadModule; }
/* harmony export */ });
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./env.js */ 2841);
/* module decorator */ module = __webpack_require__.hmd(module);
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ 44);

/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the logger, or b) put your function elsewhere.
 */

/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */

function isNodeEnv() {
  // explicitly check for browser bundles as those can be optimized statically
  // by terser/rollup.
  return !(0,_env_js__WEBPACK_IMPORTED_MODULE_0__.isBrowserBundle)() && Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */


function dynamicRequire(mod, request) {
  return mod.require(request);
}
/**
 * Helper for dynamically loading module that should work with linked dependencies.
 * The problem is that we _should_ be using `require(require.resolve(moduleName, { paths: [cwd()] }))`
 * However it's _not possible_ to do that with Webpack, as it has to know all the dependencies during
 * build time. `require.resolve` is also not available in any other way, so we cannot create,
 * a fake helper like we do with `dynamicRequire`.
 *
 * We always prefer to use local package, thus the value is not returned early from each `try/catch` block.
 * That is to mimic the behavior of `require.resolve` exactly.
 *
 * @param moduleName module name to require
 * @returns possibly required module
 */


function loadModule(moduleName) {
  let mod;

  try {
    mod = dynamicRequire(module, moduleName);
  } catch (e) {// no-empty
  }

  try {
    const {
      cwd
    } = dynamicRequire(module, 'process');
    mod = dynamicRequire(module, "".concat(cwd(), "/node_modules/").concat(moduleName));
  } catch (e) {// no-empty
  }

  return mod;
}



/***/ }),

/***/ 2856:
/*!*****************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/normalize.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalize": function() { return /* binding */ normalize; },
/* harmony export */   "normalizeToSize": function() { return /* binding */ normalizeToSize; },
/* harmony export */   "walk": function() { return /* binding */ visit; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_to_json_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url.to-json.js */ 355);
/* harmony import */ var core_js_modules_web_url_to_json_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_to_json_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./is.js */ 2838);
/* harmony import */ var _memo_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./memo.js */ 2857);
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./object.js */ 2837);
/* harmony import */ var _stacktrace_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stacktrace.js */ 2858);








/**
 * Recursively normalizes the given object.
 *
 * - Creates a copy to prevent original input mutation
 * - Skips non-enumerable properties
 * - When stringifying, calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
 * - Translates known global objects/classes to a string representations
 * - Takes care of `Error` object serialization
 * - Optionally limits depth of final output
 * - Optionally limits number of properties/elements included in any single object/array
 *
 * @param input The object to be normalized.
 * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
 * @param maxProperties The max number of elements or properties to be included in any single array or
 * object in the normallized output..
 * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
 */

function normalize(input) {
  let depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : +Infinity;
  let maxProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : +Infinity;

  try {
    // since we're at the outermost level, we don't provide a key
    return visit('', input, depth, maxProperties);
  } catch (err) {
    return {
      ERROR: "**non-serializable** (".concat(err, ")")
    };
  }
}
/** JSDoc */


function normalizeToSize(object) {
  let depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  let maxSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100 * 1024;
  var normalized = normalize(object, depth);

  if (jsonSize(normalized) > maxSize) {
    return normalizeToSize(object, depth - 1, maxSize);
  }

  return normalized;
}
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */


function visit(key, value) {
  let depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : +Infinity;
  let maxProperties = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : +Infinity;
  let memo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : (0,_memo_js__WEBPACK_IMPORTED_MODULE_4__.memoBuilder)();
  const [memoize, unmemoize] = memo; // If the value has a `toJSON` method, see if we can bail and let it do the work

  var valueWithToJSON = value;

  if (valueWithToJSON && typeof valueWithToJSON.toJSON === 'function') {
    try {
      return valueWithToJSON.toJSON();
    } catch (err) {// pass (The built-in `toJSON` failed, but we can still try to do it ourselves)
    }
  } // Get the simple cases out of the way first


  if (value === null || ['number', 'boolean', 'string'].includes(typeof value) && !(0,_is_js__WEBPACK_IMPORTED_MODULE_5__.isNaN)(value)) {
    return value;
  }

  var stringified = stringifyValue(key, value); // Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
  // Everything else will have already been serialized, so if we don't see that pattern, we're done.

  if (!stringified.startsWith('[object ')) {
    return stringified;
  } // From here on, we can assert that `value` is either an object or an array.
  // Do not normalize objects that we know have already been normalized. As a general rule, the
  // "__sentry_skip_normalization__" property should only be used sparingly and only should only be set on objects that
  // have already been normalized.


  if (value['__sentry_skip_normalization__']) {
    return value;
  } // We're also done if we've reached the max depth


  if (depth === 0) {
    // At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
    return stringified.replace('object ', '');
  } // If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.


  if (memoize(value)) {
    return '[Circular ~]';
  } // At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
  // because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
  // property/entry, and keep track of the number of items we add to it.


  var normalized = Array.isArray(value) ? [] : {};
  let numAdded = 0; // Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
  // properties are non-enumerable and otherwise would get missed.

  var visitable = (0,_object_js__WEBPACK_IMPORTED_MODULE_6__.convertToPlainObject)(value);

  for (var visitKey in visitable) {
    // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
      continue;
    }

    if (numAdded >= maxProperties) {
      normalized[visitKey] = '[MaxProperties ~]';
      break;
    } // Recursively visit all the child nodes


    var visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, depth - 1, maxProperties, memo);
    numAdded += 1;
  } // Once we've visited all the branches, remove the parent from memo storage


  unmemoize(value); // Return accumulated values

  return normalized;
}
/**
 * Stringify the given value. Handles various known special values and types.
 *
 * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
 * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
 *
 * @param value The value to stringify
 * @returns A stringified representation of the given value
 */


function stringifyValue(key, // this type is a tiny bit of a cheat, since this function does handle NaN (which is technically a number), but for
// our internal use, it'll do
value) {
  try {
    if (key === 'domain' && value && typeof value === 'object' && value._events) {
      return '[Domain]';
    }

    if (key === 'domainEmitter') {
      return '[DomainEmitter]';
    } // It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
    // which won't throw if they are not present.


    if (typeof __webpack_require__.g !== 'undefined' && value === __webpack_require__.g) {
      return '[Global]';
    }

    if (typeof window !== 'undefined' && value === window) {
      return '[Window]';
    }

    if (typeof document !== 'undefined' && value === document) {
      return '[Document]';
    } // React's SyntheticEvent thingy


    if ((0,_is_js__WEBPACK_IMPORTED_MODULE_5__.isSyntheticEvent)(value)) {
      return '[SyntheticEvent]';
    }

    if (typeof value === 'number' && value !== value) {
      return '[NaN]';
    } // this catches `undefined` (but not `null`, which is a primitive and can be serialized on its own)


    if (value === void 0) {
      return '[undefined]';
    }

    if (typeof value === 'function') {
      return "[Function: ".concat((0,_stacktrace_js__WEBPACK_IMPORTED_MODULE_7__.getFunctionName)(value), "]");
    }

    if (typeof value === 'symbol') {
      return "[".concat(String(value), "]");
    } // stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion


    if (typeof value === 'bigint') {
      return "[BigInt: ".concat(String(value), "]");
    } // Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
    // them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
    // `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
    // we can make sure that only plain objects come out that way.


    return "[object ".concat(Object.getPrototypeOf(value).constructor.name, "]");
  } catch (err) {
    return "**non-serializable** (".concat(err, ")");
  }
}
/** Calculates bytes size of input string */


function utf8Length(value) {
  return ~-encodeURI(value).split(/%..|./).length;
}
/** Calculates bytes size of input object */


function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}



/***/ }),

/***/ 2837:
/*!**************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/object.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addNonEnumerableProperty": function() { return /* binding */ addNonEnumerableProperty; },
/* harmony export */   "convertToPlainObject": function() { return /* binding */ convertToPlainObject; },
/* harmony export */   "dropUndefinedKeys": function() { return /* binding */ dropUndefinedKeys; },
/* harmony export */   "extractExceptionKeysForMessage": function() { return /* binding */ extractExceptionKeysForMessage; },
/* harmony export */   "fill": function() { return /* binding */ fill; },
/* harmony export */   "getOriginalFunction": function() { return /* binding */ getOriginalFunction; },
/* harmony export */   "markFunctionWrapped": function() { return /* binding */ markFunctionWrapped; },
/* harmony export */   "objectify": function() { return /* binding */ objectify; },
/* harmony export */   "urlEncode": function() { return /* binding */ urlEncode; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _browser_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./browser.js */ 2839);
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./is.js */ 2838);
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./string.js */ 2842);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




/**
 * Replace a method in an object with a wrapped version of itself.
 *
 * @param source An object that contains a method to be wrapped.
 * @param name The name of the method to be wrapped.
 * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
 * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
 * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
 * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
 * @returns void
 */

function fill(source, name, replacementFactory) {
  if (!(name in source)) {
    return;
  }

  var original = source[name];
  var wrapped = replacementFactory(original); // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
  // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"

  if (typeof wrapped === 'function') {
    try {
      markFunctionWrapped(wrapped, original);
    } catch (_Oo) {// This can throw if multiple fill happens on a global object like XMLHttpRequest
      // Fixes https://github.com/getsentry/sentry-javascript/issues/2043
    }
  }

  source[name] = wrapped;
}
/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */


function addNonEnumerableProperty(obj, name, value) {
  Object.defineProperty(obj, name, {
    // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
    value: value,
    writable: true,
    configurable: true
  });
}
/**
 * Remembers the original function on the wrapped function and
 * patches up the prototype.
 *
 * @param wrapped the wrapper function
 * @param original the original function that gets wrapped
 */


function markFunctionWrapped(wrapped, original) {
  var proto = original.prototype || {};
  wrapped.prototype = original.prototype = proto;
  addNonEnumerableProperty(wrapped, '__sentry_original__', original);
}
/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */


function getOriginalFunction(func) {
  return func.__sentry_original__;
}
/**
 * Encodes given object into url-friendly format
 *
 * @param object An object that contains serializable values
 * @returns string Encoded
 */


function urlEncode(object) {
  return Object.keys(object).map(key => "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(object[key]))).join('&');
}
/**
 * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
 * non-enumerable properties attached.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 * @returns An Event or Error turned into an object - or the value argurment itself, when value is neither an Event nor
 *  an Error.
 */


function convertToPlainObject(value) {
  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isError)(value)) {
    return _objectSpread({
      message: value.message,
      name: value.name,
      stack: value.stack
    }, getOwnProperties(value));
  } else if ((0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isEvent)(value)) {
    var newObj = _objectSpread({
      type: value.type,
      target: serializeEventTarget(value.target),
      currentTarget: serializeEventTarget(value.currentTarget)
    }, getOwnProperties(value));

    if (typeof CustomEvent !== 'undefined' && (0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isInstanceOf)(value, CustomEvent)) {
      newObj.detail = value.detail;
    }

    return newObj;
  } else {
    return value;
  }
}
/** Creates a string representation of the target of an `Event` object */


function serializeEventTarget(target) {
  try {
    return (0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isElement)(target) ? (0,_browser_js__WEBPACK_IMPORTED_MODULE_2__.htmlTreeAsString)(target) : Object.prototype.toString.call(target);
  } catch (_oO) {
    return '<unknown>';
  }
}
/** Filters out all but an object's own properties */


function getOwnProperties(obj) {
  if (typeof obj === 'object' && obj !== null) {
    var extractedProps = {};

    for (var property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        extractedProps[property] = obj[property];
      }
    }

    return extractedProps;
  } else {
    return {};
  }
}
/**
 * Given any captured exception, extract its keys and create a sorted
 * and truncated list that will be used inside the event message.
 * eg. `Non-error exception captured with keys: foo, bar, baz`
 */


function extractExceptionKeysForMessage(exception) {
  let maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 40;
  var keys = Object.keys(convertToPlainObject(exception));
  keys.sort();

  if (!keys.length) {
    return '[object has no keys]';
  }

  if (keys[0].length >= maxLength) {
    return (0,_string_js__WEBPACK_IMPORTED_MODULE_3__.truncate)(keys[0], maxLength);
  }

  for (let includedKeys = keys.length; includedKeys > 0; includedKeys--) {
    var serialized = keys.slice(0, includedKeys).join(', ');

    if (serialized.length > maxLength) {
      continue;
    }

    if (includedKeys === keys.length) {
      return serialized;
    }

    return (0,_string_js__WEBPACK_IMPORTED_MODULE_3__.truncate)(serialized, maxLength);
  }

  return '';
}
/**
 * Given any object, return a new object having removed all fields whose value was `undefined`.
 * Works recursively on objects and arrays.
 *
 * Attention: This function keeps circular references in the returned object.
 */


function dropUndefinedKeys(inputValue) {
  // This map keeps track of what already visited nodes map to.
  // Our Set - based memoBuilder doesn't work here because we want to the output object to have the same circular
  // references as the input object.
  var memoizationMap = new Map(); // This function just proxies `_dropUndefinedKeys` to keep the `memoBuilder` out of this function's API

  return _dropUndefinedKeys(inputValue, memoizationMap);
}

function _dropUndefinedKeys(inputValue, memoizationMap) {
  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(inputValue)) {
    // If this node has already been visited due to a circular reference, return the object it was mapped to in the new object
    var memoVal = memoizationMap.get(inputValue);

    if (memoVal !== undefined) {
      return memoVal;
    }

    var returnValue = {}; // Store the mapping of this value in case we visit it again, in case of circular data

    memoizationMap.set(inputValue, returnValue);

    for (var key of Object.keys(inputValue)) {
      if (typeof inputValue[key] !== 'undefined') {
        returnValue[key] = _dropUndefinedKeys(inputValue[key], memoizationMap);
      }
    }

    return returnValue;
  }

  if (Array.isArray(inputValue)) {
    // If this node has already been visited due to a circular reference, return the array it was mapped to in the new object
    var memoVal = memoizationMap.get(inputValue);

    if (memoVal !== undefined) {
      return memoVal;
    }

    var returnValue = []; // Store the mapping of this value in case we visit it again, in case of circular data

    memoizationMap.set(inputValue, returnValue);
    inputValue.forEach(item => {
      returnValue.push(_dropUndefinedKeys(item, memoizationMap));
    });
    return returnValue;
  }

  return inputValue;
}
/**
 * Ensure that something is an object.
 *
 * Turns `undefined` and `null` into `String`s and all other primitives into instances of their respective wrapper
 * classes (String, Boolean, Number, etc.). Acts as the identity function on non-primitives.
 *
 * @param wat The subject of the objectification
 * @returns A version of `wat` which can safely be used with `Object` class methods
 */


function objectify(wat) {
  let objectified;

  switch (true) {
    case wat === undefined || wat === null:
      objectified = new String(wat);
      break;
    // Though symbols and bigints do have wrapper classes (`Symbol` and `BigInt`, respectively), for whatever reason
    // those classes don't have constructors which can be used with the `new` keyword. We therefore need to cast each as
    // an object in order to wrap it.

    case typeof wat === 'symbol' || typeof wat === 'bigint':
      objectified = Object(wat);
      break;
    // this will catch the remaining primitives: `String`, `Number`, and `Boolean`

    case (0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isPrimitive)(wat):
      objectified = new wat.constructor(wat);
      break;
    // by process of elimination, at this point we know that `wat` must already be an object

    default:
      objectified = wat;
      break;
  }

  return objectified;
}



/***/ }),

/***/ 2846:
/*!*********************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/promisebuffer.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "makePromiseBuffer": function() { return /* binding */ makePromiseBuffer; }
/* harmony export */ });
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error.js */ 2847);
/* harmony import */ var _syncpromise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./syncpromise.js */ 2844);


/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */

function makePromiseBuffer(limit) {
  var buffer = [];

  function isReady() {
    return limit === undefined || buffer.length < limit;
  }
  /**
   * Remove a promise from the queue.
   *
   * @param task Can be any PromiseLike<T>
   * @returns Removed promise.
   */


  function remove(task) {
    return buffer.splice(buffer.indexOf(task), 1)[0];
  }
  /**
   * Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
   *
   * @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
   *        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
   *        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
   *        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
   *        limit check.
   * @returns The original promise.
   */


  function add(taskProducer) {
    if (!isReady()) {
      return (0,_syncpromise_js__WEBPACK_IMPORTED_MODULE_0__.rejectedSyncPromise)(new _error_js__WEBPACK_IMPORTED_MODULE_1__.SentryError('Not adding Promise due to buffer limit reached.'));
    } // start the task and add its promise to the queue


    var task = taskProducer();

    if (buffer.indexOf(task) === -1) {
      buffer.push(task);
    }

    void task.then(() => remove(task)) // Use `then(null, rejectionHandler)` rather than `catch(rejectionHandler)` so that we can use `PromiseLike`
    // rather than `Promise`. `PromiseLike` doesn't have a `.catch` method, making its polyfill smaller. (ES5 didn't
    // have promises, so TS has to polyfill when down-compiling.)
    .then(null, () => remove(task).then(null, () => {// We have to add another catch here because `remove()` starts a new promise chain.
    }));
    return task;
  }
  /**
   * Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
   * not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
   * `false` otherwise
   */


  function drain(timeout) {
    return new _syncpromise_js__WEBPACK_IMPORTED_MODULE_0__.SyncPromise((resolve, reject) => {
      let counter = buffer.length;

      if (!counter) {
        return resolve(true);
      } // wait for `timeout` ms and then resolve to `false` (if not cancelled first)


      var capturedSetTimeout = setTimeout(() => {
        if (timeout && timeout > 0) {
          resolve(false);
        }
      }, timeout); // if all promises resolve in time, cancel the timer and resolve to `true`

      buffer.forEach(item => {
        void (0,_syncpromise_js__WEBPACK_IMPORTED_MODULE_0__.resolvedSyncPromise)(item).then(() => {
          if (! --counter) {
            clearTimeout(capturedSetTimeout);
            resolve(true);
          }
        }, reject);
      });
    });
  }

  return {
    $: buffer,
    add,
    drain
  };
}



/***/ }),

/***/ 2849:
/*!*****************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/ratelimit.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DEFAULT_RETRY_AFTER": function() { return /* binding */ DEFAULT_RETRY_AFTER; },
/* harmony export */   "disabledUntil": function() { return /* binding */ disabledUntil; },
/* harmony export */   "isRateLimited": function() { return /* binding */ isRateLimited; },
/* harmony export */   "parseRetryAfterHeader": function() { return /* binding */ parseRetryAfterHeader; },
/* harmony export */   "updateRateLimits": function() { return /* binding */ updateRateLimits; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Intentionally keeping the key broad, as we don't know for sure what rate limit headers get returned from backend
var DEFAULT_RETRY_AFTER = 60 * 1000; // 60 seconds

/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */

function parseRetryAfterHeader(header) {
  let now = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Date.now();
  var headerDelay = parseInt("".concat(header), 10);

  if (!isNaN(headerDelay)) {
    return headerDelay * 1000;
  }

  var headerDate = Date.parse("".concat(header));

  if (!isNaN(headerDate)) {
    return headerDate - now;
  }

  return DEFAULT_RETRY_AFTER;
}
/**
 * Gets the time that given category is disabled until for rate limiting
 */


function disabledUntil(limits, category) {
  return limits[category] || limits.all || 0;
}
/**
 * Checks if a category is rate limited
 */


function isRateLimited(limits, category) {
  let now = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Date.now();
  return disabledUntil(limits, category) > now;
}
/**
 * Update ratelimits from incoming headers.
 * Returns true if headers contains a non-empty rate limiting header.
 */


function updateRateLimits(limits, _ref) {
  let {
    statusCode,
    headers
  } = _ref;
  let now = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Date.now();

  var updatedRateLimits = _objectSpread({}, limits); // "The name is case-insensitive."
  // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get


  var rateLimitHeader = headers && headers['x-sentry-rate-limits'];
  var retryAfterHeader = headers && headers['retry-after'];

  if (rateLimitHeader) {
    /**
     * rate limit headers are of the form
     *     <header>,<header>,..
     * where each <header> is of the form
     *     <retry_after>: <categories>: <scope>: <reason_code>
     * where
     *     <retry_after> is a delay in seconds
     *     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
     *         <category>;<category>;...
     *     <scope> is what's being limited (org, project, or key) - ignored by SDK
     *     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
     */
    for (var limit of rateLimitHeader.trim().split(',')) {
      const [retryAfter, categories] = limit.split(':', 2);
      var headerDelay = parseInt(retryAfter, 10);
      var delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default

      if (!categories) {
        updatedRateLimits.all = now + delay;
      } else {
        for (var category of categories.split(';')) {
          updatedRateLimits[category] = now + delay;
        }
      }
    }
  } else if (retryAfterHeader) {
    updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
  } else if (statusCode === 429) {
    updatedRateLimits.all = now + 60 * 1000;
  }

  return updatedRateLimits;
}



/***/ }),

/***/ 2862:
/*!****************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/severity.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "severityFromString": function() { return /* binding */ severityFromString; },
/* harmony export */   "severityLevelFromString": function() { return /* binding */ severityLevelFromString; },
/* harmony export */   "validSeverityLevels": function() { return /* binding */ validSeverityLevels; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);

// Note: Ideally the `SeverityLevel` type would be derived from `validSeverityLevels`, but that would mean either
//
// a) moving `validSeverityLevels` to `@sentry/types`,
// b) moving the`SeverityLevel` type here, or
// c) importing `validSeverityLevels` from here into `@sentry/types`.
//
// Option A would make `@sentry/types` a runtime dependency of `@sentry/utils` (not good), and options B and C would
// create a circular dependency between `@sentry/types` and `@sentry/utils` (also not good). So a TODO accompanying the
// type, reminding anyone who changes it to change this list also, will have to do.
var validSeverityLevels = ['fatal', 'error', 'warning', 'log', 'info', 'debug'];
/**
 * Converts a string-based level into a member of the deprecated {@link Severity} enum.
 *
 * @deprecated `severityFromString` is deprecated. Please use `severityLevelFromString` instead.
 *
 * @param level String representation of Severity
 * @returns Severity
 */

function severityFromString(level) {
  return severityLevelFromString(level);
}
/**
 * Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
 *
 * @param level String representation of desired `SeverityLevel`.
 * @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
 */


function severityLevelFromString(level) {
  return level === 'warn' ? 'warning' : validSeverityLevels.includes(level) ? level : 'log';
}



/***/ }),

/***/ 2858:
/*!******************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/stacktrace.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createStackParser": function() { return /* binding */ createStackParser; },
/* harmony export */   "getFunctionName": function() { return /* binding */ getFunctionName; },
/* harmony export */   "stackParserFromStackParserOptions": function() { return /* binding */ stackParserFromStackParserOptions; },
/* harmony export */   "stripSentryFramesAndReverse": function() { return /* binding */ stripSentryFramesAndReverse; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


var STACKTRACE_LIMIT = 50;
/**
 * Creates a stack parser with the supplied line parsers
 *
 * StackFrames are returned in the correct order for Sentry Exception
 * frames and with Sentry SDK internal frames removed from the top and bottom
 *
 */

function createStackParser() {
  for (var _len = arguments.length, parsers = new Array(_len), _key = 0; _key < _len; _key++) {
    parsers[_key] = arguments[_key];
  }

  var sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map(p => p[1]);
  return function (stack) {
    let skipFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var frames = [];

    for (var line of stack.split('\n').slice(skipFirst)) {
      for (var parser of sortedParsers) {
        var frame = parser(line);

        if (frame) {
          frames.push(frame);
          break;
        }
      }
    }

    return stripSentryFramesAndReverse(frames);
  };
}
/**
 * Gets a stack parser implementation from Options.stackParser
 * @see Options
 *
 * If options contains an array of line parsers, it is converted into a parser
 */


function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser);
  }

  return stackParser;
}
/**
 * @hidden
 */


function stripSentryFramesAndReverse(stack) {
  if (!stack.length) {
    return [];
  }

  let localStack = stack;
  var firstFrameFunction = localStack[0].function || '';
  var lastFrameFunction = localStack[localStack.length - 1].function || ''; // If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)

  if (firstFrameFunction.indexOf('captureMessage') !== -1 || firstFrameFunction.indexOf('captureException') !== -1) {
    localStack = localStack.slice(1);
  } // If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)


  if (lastFrameFunction.indexOf('sentryWrapped') !== -1) {
    localStack = localStack.slice(0, -1);
  } // The frame where the crash happened, should be the last entry in the array


  return localStack.slice(0, STACKTRACE_LIMIT).map(frame => _objectSpread(_objectSpread({}, frame), {}, {
    filename: frame.filename || localStack[0].filename,
    function: frame.function || '?'
  })).reverse();
}

var defaultFunctionName = '<anonymous>';
/**
 * Safely extract function name from itself
 */

function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== 'function') {
      return defaultFunctionName;
    }

    return fn.name || defaultFunctionName;
  } catch (e) {
    // Just accessing custom props in some Selenium environments
    // can cause a "Permission denied" exception (see raven-js#495).
    return defaultFunctionName;
  }
}



/***/ }),

/***/ 2842:
/*!**************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/string.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "escapeStringForRegex": function() { return /* binding */ escapeStringForRegex; },
/* harmony export */   "isMatchingPattern": function() { return /* binding */ isMatchingPattern; },
/* harmony export */   "safeJoin": function() { return /* binding */ safeJoin; },
/* harmony export */   "snipLine": function() { return /* binding */ snipLine; },
/* harmony export */   "truncate": function() { return /* binding */ truncate; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./is.js */ 2838);


/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */

function truncate(str) {
  let max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (typeof str !== 'string' || max === 0) {
    return str;
  }

  return str.length <= max ? str : "".concat(str.substr(0, max), "...");
}
/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */


function snipLine(line, colno) {
  let newLine = line;
  var lineLength = newLine.length;

  if (lineLength <= 150) {
    return newLine;
  }

  if (colno > lineLength) {
    colno = lineLength;
  }

  let start = Math.max(colno - 60, 0);

  if (start < 5) {
    start = 0;
  }

  let end = Math.min(start + 140, lineLength);

  if (end > lineLength - 5) {
    end = lineLength;
  }

  if (end === lineLength) {
    start = Math.max(end - 140, 0);
  }

  newLine = newLine.slice(start, end);

  if (start > 0) {
    newLine = "'{snip} ".concat(newLine);
  }

  if (end < lineLength) {
    newLine += ' {snip}';
  }

  return newLine;
}
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */


function safeJoin(input, delimiter) {
  if (!Array.isArray(input)) {
    return '';
  }

  var output = [];

  for (let i = 0; i < input.length; i++) {
    var value = input[i];

    try {
      output.push(String(value));
    } catch (e) {
      output.push('[value cannot be serialized]');
    }
  }

  return output.join(delimiter);
}
/**
 * Checks if the value matches a regex or includes the string
 * @param value The string value to be checked against
 * @param pattern Either a regex or a string that must be contained in value
 */


function isMatchingPattern(value, pattern) {
  if (!(0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isString)(value)) {
    return false;
  }

  if ((0,_is_js__WEBPACK_IMPORTED_MODULE_1__.isRegExp)(pattern)) {
    return pattern.test(value);
  }

  if (typeof pattern === 'string') {
    return value.indexOf(pattern) !== -1;
  }

  return false;
}
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * Based on https://github.com/sindresorhus/escape-string-regexp. Vendored to a) reduce the size by skipping the runtime
 * type-checking, and b) ensure it gets down-compiled for old versions of Node (the published package only supports Node
 * 12+).
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */


function escapeStringForRegex(regexString) {
  // escape the hyphen separately so we can also replace it with a unicode literal hyphen, to avoid the problems
  // discussed in https://github.com/sindresorhus/escape-string-regexp/issues/20.
  return regexString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}



/***/ }),

/***/ 2861:
/*!****************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/supports.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNativeFetch": function() { return /* binding */ isNativeFetch; },
/* harmony export */   "supportsDOMError": function() { return /* binding */ supportsDOMError; },
/* harmony export */   "supportsDOMException": function() { return /* binding */ supportsDOMException; },
/* harmony export */   "supportsErrorEvent": function() { return /* binding */ supportsErrorEvent; },
/* harmony export */   "supportsFetch": function() { return /* binding */ supportsFetch; },
/* harmony export */   "supportsHistory": function() { return /* binding */ supportsHistory; },
/* harmony export */   "supportsNativeFetch": function() { return /* binding */ supportsNativeFetch; },
/* harmony export */   "supportsReferrerPolicy": function() { return /* binding */ supportsReferrerPolicy; },
/* harmony export */   "supportsReportingObserver": function() { return /* binding */ supportsReportingObserver; }
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global.js */ 2840);
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger.js */ 2845);


/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */

function supportsErrorEvent() {
  try {
    new ErrorEvent('');
    return true;
  } catch (e) {
    return false;
  }
}
/**
 * Tells whether current environment supports DOMError objects
 * {@link supportsDOMError}.
 *
 * @returns Answer to the given question.
 */


function supportsDOMError() {
  try {
    // Chrome: VM89:1 Uncaught TypeError: Failed to construct 'DOMError':
    // 1 argument required, but only 0 present.
    // @ts-ignore It really needs 1 argument, not 0.
    new DOMError('');
    return true;
  } catch (e) {
    return false;
  }
}
/**
 * Tells whether current environment supports DOMException objects
 * {@link supportsDOMException}.
 *
 * @returns Answer to the given question.
 */


function supportsDOMException() {
  try {
    new DOMException('');
    return true;
  } catch (e) {
    return false;
  }
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 */


function supportsFetch() {
  if (!('fetch' in (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)())) {
    return false;
  }

  try {
    new Headers();
    new Request('');
    new Response();
    return true;
  } catch (e) {
    return false;
  }
}
/**
 * isNativeFetch checks if the given function is a native implementation of fetch()
 */


function isNativeFetch(func) {
  return func && /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */


function supportsNativeFetch() {
  if (!supportsFetch()) {
    return false;
  }

  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)(); // Fast path to avoid DOM I/O

  if (isNativeFetch(global.fetch)) {
    return true;
  } // window.fetch is implemented, but is polyfilled or already wrapped (e.g: by a chrome extension)
  // so create a "pure" iframe to see if that has native fetch


  let result = false;
  var doc = global.document;

  if (doc && typeof doc.createElement === 'function') {
    try {
      var sandbox = doc.createElement('iframe');
      sandbox.hidden = true;
      doc.head.appendChild(sandbox);

      if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
        result = isNativeFetch(sandbox.contentWindow.fetch);
      }

      doc.head.removeChild(sandbox);
    } catch (err) {
      (typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__) && _logger_js__WEBPACK_IMPORTED_MODULE_1__.logger.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', err);
    }
  }

  return result;
}
/**
 * Tells whether current environment supports ReportingObserver API
 * {@link supportsReportingObserver}.
 *
 * @returns Answer to the given question.
 */


function supportsReportingObserver() {
  return 'ReportingObserver' in (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 */


function supportsReferrerPolicy() {
  // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default'
  // (see https://caniuse.com/#feat=referrer-policy),
  // it doesn't. And it throws an exception instead of ignoring this parameter...
  // REF: https://github.com/getsentry/raven-js/issues/1233
  if (!supportsFetch()) {
    return false;
  }

  try {
    new Request('_', {
      referrerPolicy: 'origin'
    });
    return true;
  } catch (e) {
    return false;
  }
}
/**
 * Tells whether current environment supports History API
 * {@link supportsHistory}.
 *
 * @returns Answer to the given question.
 */


function supportsHistory() {
  // NOTE: in Chrome App environment, touching history.pushState, *even inside
  //       a try/catch block*, will cause Chrome to output an error to console.error
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  var global = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();
  var chrome = global.chrome;
  var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
  var hasHistoryApi = 'history' in global && !!global.history.pushState && !!global.history.replaceState;
  return !isChromePackagedApp && hasHistoryApi;
}



/***/ }),

/***/ 2844:
/*!*******************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/syncpromise.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SyncPromise": function() { return /* binding */ SyncPromise; },
/* harmony export */   "rejectedSyncPromise": function() { return /* binding */ rejectedSyncPromise; },
/* harmony export */   "resolvedSyncPromise": function() { return /* binding */ resolvedSyncPromise; }
/* harmony export */ });
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is.js */ 2838);

/** SyncPromise internal states */

var States;

(function (States) {
  /** Pending */
  var PENDING = 0;
  States[States["PENDING"] = PENDING] = "PENDING";
  /** Resolved / OK */

  var RESOLVED = 1;
  States[States["RESOLVED"] = RESOLVED] = "RESOLVED";
  /** Rejected / Error */

  var REJECTED = 2;
  States[States["REJECTED"] = REJECTED] = "REJECTED";
})(States || (States = {})); // Overloads so we can call resolvedSyncPromise without arguments and generic argument

/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */


function resolvedSyncPromise(value) {
  return new SyncPromise(resolve => {
    resolve(value);
  });
}
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */


function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}
/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */


class SyncPromise {
  __init() {
    this._state = States.PENDING;
  }

  __init2() {
    this._handlers = [];
  }

  constructor(executor) {
    ;

    SyncPromise.prototype.__init.call(this);

    SyncPromise.prototype.__init2.call(this);

    SyncPromise.prototype.__init3.call(this);

    SyncPromise.prototype.__init4.call(this);

    SyncPromise.prototype.__init5.call(this);

    SyncPromise.prototype.__init6.call(this);

    try {
      executor(this._resolve, this._reject);
    } catch (e) {
      this._reject(e);
    }
  }
  /** JSDoc */


  then(onfulfilled, onrejected) {
    return new SyncPromise((resolve, reject) => {
      this._handlers.push([false, result => {
        if (!onfulfilled) {
          // TODO: ¯\_(ツ)_/¯
          // TODO: FIXME
          resolve(result);
        } else {
          try {
            resolve(onfulfilled(result));
          } catch (e) {
            reject(e);
          }
        }
      }, reason => {
        if (!onrejected) {
          reject(reason);
        } else {
          try {
            resolve(onrejected(reason));
          } catch (e) {
            reject(e);
          }
        }
      }]);

      this._executeHandlers();
    });
  }
  /** JSDoc */


  catch(onrejected) {
    return this.then(val => val, onrejected);
  }
  /** JSDoc */


  finally(onfinally) {
    return new SyncPromise((resolve, reject) => {
      let val;
      let isRejected;
      return this.then(value => {
        isRejected = false;
        val = value;

        if (onfinally) {
          onfinally();
        }
      }, reason => {
        isRejected = true;
        val = reason;

        if (onfinally) {
          onfinally();
        }
      }).then(() => {
        if (isRejected) {
          reject(val);
          return;
        }

        resolve(val);
      });
    });
  }
  /** JSDoc */


  __init3() {
    this._resolve = value => {
      this._setResult(States.RESOLVED, value);
    };
  }
  /** JSDoc */


  __init4() {
    this._reject = reason => {
      this._setResult(States.REJECTED, reason);
    };
  }
  /** JSDoc */


  __init5() {
    this._setResult = (state, value) => {
      if (this._state !== States.PENDING) {
        return;
      }

      if ((0,_is_js__WEBPACK_IMPORTED_MODULE_0__.isThenable)(value)) {
        void value.then(this._resolve, this._reject);
        return;
      }

      this._state = state;
      this._value = value;

      this._executeHandlers();
    };
  }
  /** JSDoc */


  __init6() {
    this._executeHandlers = () => {
      if (this._state === States.PENDING) {
        return;
      }

      var cachedHandlers = this._handlers.slice();

      this._handlers = [];
      cachedHandlers.forEach(handler => {
        if (handler[0]) {
          return;
        }

        if (this._state === States.RESOLVED) {
          handler[1](this._value);
        }

        if (this._state === States.REJECTED) {
          handler[2](this._value);
        }

        handler[0] = true;
      });
    };
  }

}



/***/ }),

/***/ 1272:
/*!************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/time.js ***!
  \************************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_browserPerformanceTimeOriginMode": function() { return /* binding */ _browserPerformanceTimeOriginMode; },
/* harmony export */   "browserPerformanceTimeOrigin": function() { return /* binding */ browserPerformanceTimeOrigin; },
/* harmony export */   "dateTimestampInSeconds": function() { return /* binding */ dateTimestampInSeconds; },
/* harmony export */   "timestampInSeconds": function() { return /* binding */ timestampInSeconds; },
/* harmony export */   "timestampWithMs": function() { return /* binding */ timestampWithMs; },
/* harmony export */   "usingPerformanceAPI": function() { return /* binding */ usingPerformanceAPI; }
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global.js */ 2840);
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node.js */ 165);
/* module decorator */ module = __webpack_require__.hmd(module);


/**
 * An object that can return the current timestamp in seconds since the UNIX epoch.
 */

/**
 * A TimestampSource implementation for environments that do not support the Performance Web API natively.
 *
 * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
 * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
 * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
 */

var dateTimestampSource = {
  nowSeconds: () => Date.now() / 1000
};
/**
 * A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
 * for accessing a high-resolution monotonic clock.
 */

/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */

function getBrowserPerformance() {
  const {
    performance
  } = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

  if (!performance || !performance.now) {
    return undefined;
  } // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
  //
  // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
  // performance.now() gives a date arbitrarily in the past.
  //
  // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
  // undefined.
  //
  // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
  // interact with data coming out of performance entries.
  //
  // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
  // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
  // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
  // observed skews that can be as long as days, weeks or months.
  //
  // See https://github.com/getsentry/sentry-javascript/issues/2590.
  //
  // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
  // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
  // transactions of long-lived web pages.


  var timeOrigin = Date.now() - performance.now();
  return {
    now: () => performance.now(),
    timeOrigin
  };
}
/**
 * Returns the native Performance API implementation from Node.js. Returns undefined in old Node.js versions that don't
 * implement the API.
 */


function getNodePerformance() {
  try {
    var perfHooks = (0,_node_js__WEBPACK_IMPORTED_MODULE_1__.dynamicRequire)(module, 'perf_hooks');
    return perfHooks.performance;
  } catch (_) {
    return undefined;
  }
}
/**
 * The Performance API implementation for the current platform, if available.
 */


var platformPerformance = (0,_node_js__WEBPACK_IMPORTED_MODULE_1__.isNodeEnv)() ? getNodePerformance() : getBrowserPerformance();
var timestampSource = platformPerformance === undefined ? dateTimestampSource : {
  nowSeconds: () => (platformPerformance.timeOrigin + platformPerformance.now()) / 1000
};
/**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 */

var dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * See `usingPerformanceAPI` to test whether the Performance API is used.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */

var timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource); // Re-exported with an old name for backwards-compatibility.

var timestampWithMs = timestampInSeconds;
/**
 * A boolean that is true when timestampInSeconds uses the Performance API to produce monotonic timestamps.
 */

var usingPerformanceAPI = platformPerformance !== undefined;
/**
 * Internal helper to store what is the source of browserPerformanceTimeOrigin below. For debugging only.
 */

let _browserPerformanceTimeOriginMode;
/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */


var browserPerformanceTimeOrigin = (() => {
  // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
  // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
  // data as reliable if they are within a reasonable threshold of the current time.
  const {
    performance
  } = (0,_global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalObject)();

  if (!performance || !performance.now) {
    _browserPerformanceTimeOriginMode = 'none';
    return undefined;
  }

  var threshold = 3600 * 1000;
  var performanceNow = performance.now();
  var dateNow = Date.now(); // if timeOrigin isn't available set delta to threshold so it isn't used

  var timeOriginDelta = performance.timeOrigin ? Math.abs(performance.timeOrigin + performanceNow - dateNow) : threshold;
  var timeOriginIsReliable = timeOriginDelta < threshold; // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
  // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
  // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
  // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
  // Date API.

  var navigationStart = performance.timing && performance.timing.navigationStart;
  var hasNavigationStart = typeof navigationStart === 'number'; // if navigationStart isn't available set delta to threshold so it isn't used

  var navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
  var navigationStartIsReliable = navigationStartDelta < threshold;

  if (timeOriginIsReliable || navigationStartIsReliable) {
    // Use the more reliable time origin
    if (timeOriginDelta <= navigationStartDelta) {
      _browserPerformanceTimeOriginMode = 'timeOrigin';
      return performance.timeOrigin;
    } else {
      _browserPerformanceTimeOriginMode = 'navigationStart';
      return navigationStart;
    }
  } // Either both timeOrigin and navigationStart are skewed or neither is available, fallback to Date.


  _browserPerformanceTimeOriginMode = 'dateNow';
  return dateNow;
})();



/***/ }),

/***/ 136:
/*!***************************************************!*\
  !*** ./node_modules/@sentry/utils/esm/tracing.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TRACEPARENT_REGEXP": function() { return /* binding */ TRACEPARENT_REGEXP; },
/* harmony export */   "extractTraceparentData": function() { return /* binding */ extractTraceparentData; }
/* harmony export */ });
var TRACEPARENT_REGEXP = new RegExp('^[ \\t]*' + // whitespace
'([0-9a-f]{32})?' + // trace_id
'-?([0-9a-f]{16})?' + // span_id
'-?([01])?' + // sampled
'[ \\t]*$');
/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */

function extractTraceparentData(traceparent) {
  var matches = traceparent.match(TRACEPARENT_REGEXP);

  if (matches) {
    let parentSampled;

    if (matches[3] === '1') {
      parentSampled = true;
    } else if (matches[3] === '0') {
      parentSampled = false;
    }

    return {
      traceId: matches[1],
      parentSampled,
      parentSpanId: matches[2]
    };
  }

  return undefined;
}



/***/ }),

/***/ 1925:
/*!************************************!*\
  !*** ./node_modules/bowser/es5.js ***!
  \************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);

!function (e, t) {
   true ? module.exports = t() : 0;
}(this, function () {
  return function (e) {
    var t = {};

    function r(n) {
      if (t[n]) return t[n].exports;
      var i = t[n] = {
        i: n,
        l: !1,
        exports: {}
      };
      return e[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports;
    }

    return r.m = e, r.c = t, r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: n
      });
    }, r.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      });
    }, r.t = function (e, t) {
      if (1 & t && (e = r(e)), 8 & t) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (r.r(n), Object.defineProperty(n, "default", {
        enumerable: !0,
        value: e
      }), 2 & t && "string" != typeof e) for (var i in e) r.d(n, i, function (t) {
        return e[t];
      }.bind(null, i));
      return n;
    }, r.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e.default;
      } : function () {
        return e;
      };
      return r.d(t, "a", t), t;
    }, r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, r.p = "", r(r.s = 90);
  }({
    17: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.default = void 0;

      var n = r(18),
          i = function () {
        function e() {}

        return e.getFirstMatch = function (e, t) {
          var r = t.match(e);
          return r && r.length > 0 && r[1] || "";
        }, e.getSecondMatch = function (e, t) {
          var r = t.match(e);
          return r && r.length > 1 && r[2] || "";
        }, e.matchAndReturnConst = function (e, t, r) {
          if (e.test(t)) return r;
        }, e.getWindowsVersionName = function (e) {
          switch (e) {
            case "NT":
              return "NT";

            case "XP":
              return "XP";

            case "NT 5.0":
              return "2000";

            case "NT 5.1":
              return "XP";

            case "NT 5.2":
              return "2003";

            case "NT 6.0":
              return "Vista";

            case "NT 6.1":
              return "7";

            case "NT 6.2":
              return "8";

            case "NT 6.3":
              return "8.1";

            case "NT 10.0":
              return "10";

            default:
              return;
          }
        }, e.getMacOSVersionName = function (e) {
          var t = e.split(".").splice(0, 2).map(function (e) {
            return parseInt(e, 10) || 0;
          });
          if (t.push(0), 10 === t[0]) switch (t[1]) {
            case 5:
              return "Leopard";

            case 6:
              return "Snow Leopard";

            case 7:
              return "Lion";

            case 8:
              return "Mountain Lion";

            case 9:
              return "Mavericks";

            case 10:
              return "Yosemite";

            case 11:
              return "El Capitan";

            case 12:
              return "Sierra";

            case 13:
              return "High Sierra";

            case 14:
              return "Mojave";

            case 15:
              return "Catalina";

            default:
              return;
          }
        }, e.getAndroidVersionName = function (e) {
          var t = e.split(".").splice(0, 2).map(function (e) {
            return parseInt(e, 10) || 0;
          });
          if (t.push(0), !(1 === t[0] && t[1] < 5)) return 1 === t[0] && t[1] < 6 ? "Cupcake" : 1 === t[0] && t[1] >= 6 ? "Donut" : 2 === t[0] && t[1] < 2 ? "Eclair" : 2 === t[0] && 2 === t[1] ? "Froyo" : 2 === t[0] && t[1] > 2 ? "Gingerbread" : 3 === t[0] ? "Honeycomb" : 4 === t[0] && t[1] < 1 ? "Ice Cream Sandwich" : 4 === t[0] && t[1] < 4 ? "Jelly Bean" : 4 === t[0] && t[1] >= 4 ? "KitKat" : 5 === t[0] ? "Lollipop" : 6 === t[0] ? "Marshmallow" : 7 === t[0] ? "Nougat" : 8 === t[0] ? "Oreo" : 9 === t[0] ? "Pie" : void 0;
        }, e.getVersionPrecision = function (e) {
          return e.split(".").length;
        }, e.compareVersions = function (t, r, n) {
          void 0 === n && (n = !1);
          var i = e.getVersionPrecision(t),
              s = e.getVersionPrecision(r),
              a = Math.max(i, s),
              o = 0,
              u = e.map([t, r], function (t) {
            var r = a - e.getVersionPrecision(t),
                n = t + new Array(r + 1).join(".0");
            return e.map(n.split("."), function (e) {
              return new Array(20 - e.length).join("0") + e;
            }).reverse();
          });

          for (n && (o = a - Math.min(i, s)), a -= 1; a >= o;) {
            if (u[0][a] > u[1][a]) return 1;

            if (u[0][a] === u[1][a]) {
              if (a === o) return 0;
              a -= 1;
            } else if (u[0][a] < u[1][a]) return -1;
          }
        }, e.map = function (e, t) {
          var r,
              n = [];
          if (Array.prototype.map) return Array.prototype.map.call(e, t);

          for (r = 0; r < e.length; r += 1) n.push(t(e[r]));

          return n;
        }, e.find = function (e, t) {
          var r, n;
          if (Array.prototype.find) return Array.prototype.find.call(e, t);

          for (r = 0, n = e.length; r < n; r += 1) {
            var i = e[r];
            if (t(i, r)) return i;
          }
        }, e.assign = function (e) {
          for (var t, r, n = e, i = arguments.length, s = new Array(i > 1 ? i - 1 : 0), a = 1; a < i; a++) s[a - 1] = arguments[a];

          if (Object.assign) return Object.assign.apply(Object, [e].concat(s));

          var o = function () {
            var e = s[t];
            "object" == typeof e && null !== e && Object.keys(e).forEach(function (t) {
              n[t] = e[t];
            });
          };

          for (t = 0, r = s.length; t < r; t += 1) o();

          return e;
        }, e.getBrowserAlias = function (e) {
          return n.BROWSER_ALIASES_MAP[e];
        }, e.getBrowserTypeByAlias = function (e) {
          return n.BROWSER_MAP[e] || "";
        }, e;
      }();

      t.default = i, e.exports = t.default;
    },
    18: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.ENGINE_MAP = t.OS_MAP = t.PLATFORMS_MAP = t.BROWSER_MAP = t.BROWSER_ALIASES_MAP = void 0;
      t.BROWSER_ALIASES_MAP = {
        "Amazon Silk": "amazon_silk",
        "Android Browser": "android",
        Bada: "bada",
        BlackBerry: "blackberry",
        Chrome: "chrome",
        Chromium: "chromium",
        Electron: "electron",
        Epiphany: "epiphany",
        Firefox: "firefox",
        Focus: "focus",
        Generic: "generic",
        "Google Search": "google_search",
        Googlebot: "googlebot",
        "Internet Explorer": "ie",
        "K-Meleon": "k_meleon",
        Maxthon: "maxthon",
        "Microsoft Edge": "edge",
        "MZ Browser": "mz",
        "NAVER Whale Browser": "naver",
        Opera: "opera",
        "Opera Coast": "opera_coast",
        PhantomJS: "phantomjs",
        Puffin: "puffin",
        QupZilla: "qupzilla",
        QQ: "qq",
        QQLite: "qqlite",
        Safari: "safari",
        Sailfish: "sailfish",
        "Samsung Internet for Android": "samsung_internet",
        SeaMonkey: "seamonkey",
        Sleipnir: "sleipnir",
        Swing: "swing",
        Tizen: "tizen",
        "UC Browser": "uc",
        Vivaldi: "vivaldi",
        "WebOS Browser": "webos",
        WeChat: "wechat",
        "Yandex Browser": "yandex",
        Roku: "roku"
      };
      t.BROWSER_MAP = {
        amazon_silk: "Amazon Silk",
        android: "Android Browser",
        bada: "Bada",
        blackberry: "BlackBerry",
        chrome: "Chrome",
        chromium: "Chromium",
        electron: "Electron",
        epiphany: "Epiphany",
        firefox: "Firefox",
        focus: "Focus",
        generic: "Generic",
        googlebot: "Googlebot",
        google_search: "Google Search",
        ie: "Internet Explorer",
        k_meleon: "K-Meleon",
        maxthon: "Maxthon",
        edge: "Microsoft Edge",
        mz: "MZ Browser",
        naver: "NAVER Whale Browser",
        opera: "Opera",
        opera_coast: "Opera Coast",
        phantomjs: "PhantomJS",
        puffin: "Puffin",
        qupzilla: "QupZilla",
        qq: "QQ Browser",
        qqlite: "QQ Browser Lite",
        safari: "Safari",
        sailfish: "Sailfish",
        samsung_internet: "Samsung Internet for Android",
        seamonkey: "SeaMonkey",
        sleipnir: "Sleipnir",
        swing: "Swing",
        tizen: "Tizen",
        uc: "UC Browser",
        vivaldi: "Vivaldi",
        webos: "WebOS Browser",
        wechat: "WeChat",
        yandex: "Yandex Browser"
      };
      t.PLATFORMS_MAP = {
        tablet: "tablet",
        mobile: "mobile",
        desktop: "desktop",
        tv: "tv"
      };
      t.OS_MAP = {
        WindowsPhone: "Windows Phone",
        Windows: "Windows",
        MacOS: "macOS",
        iOS: "iOS",
        Android: "Android",
        WebOS: "WebOS",
        BlackBerry: "BlackBerry",
        Bada: "Bada",
        Tizen: "Tizen",
        Linux: "Linux",
        ChromeOS: "Chrome OS",
        PlayStation4: "PlayStation 4",
        Roku: "Roku"
      };
      t.ENGINE_MAP = {
        EdgeHTML: "EdgeHTML",
        Blink: "Blink",
        Trident: "Trident",
        Presto: "Presto",
        Gecko: "Gecko",
        WebKit: "WebKit"
      };
    },
    90: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.default = void 0;
      var n,
          i = (n = r(91)) && n.__esModule ? n : {
        default: n
      },
          s = r(18);

      function a(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r];
          n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
        }
      }

      var o = function () {
        function e() {}

        var t, r, n;
        return e.getParser = function (e, t) {
          if (void 0 === t && (t = !1), "string" != typeof e) throw new Error("UserAgent should be a string");
          return new i.default(e, t);
        }, e.parse = function (e) {
          return new i.default(e).getResult();
        }, t = e, n = [{
          key: "BROWSER_MAP",
          get: function () {
            return s.BROWSER_MAP;
          }
        }, {
          key: "ENGINE_MAP",
          get: function () {
            return s.ENGINE_MAP;
          }
        }, {
          key: "OS_MAP",
          get: function () {
            return s.OS_MAP;
          }
        }, {
          key: "PLATFORMS_MAP",
          get: function () {
            return s.PLATFORMS_MAP;
          }
        }], (r = null) && a(t.prototype, r), n && a(t, n), e;
      }();

      t.default = o, e.exports = t.default;
    },
    91: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.default = void 0;
      var n = u(r(92)),
          i = u(r(93)),
          s = u(r(94)),
          a = u(r(95)),
          o = u(r(17));

      function u(e) {
        return e && e.__esModule ? e : {
          default: e
        };
      }

      var d = function () {
        function e(e, t) {
          if (void 0 === t && (t = !1), null == e || "" === e) throw new Error("UserAgent parameter can't be empty");
          this._ua = e, this.parsedResult = {}, !0 !== t && this.parse();
        }

        var t = e.prototype;
        return t.getUA = function () {
          return this._ua;
        }, t.test = function (e) {
          return e.test(this._ua);
        }, t.parseBrowser = function () {
          var e = this;
          this.parsedResult.browser = {};
          var t = o.default.find(n.default, function (t) {
            if ("function" == typeof t.test) return t.test(e);
            if (t.test instanceof Array) return t.test.some(function (t) {
              return e.test(t);
            });
            throw new Error("Browser's test function is not valid");
          });
          return t && (this.parsedResult.browser = t.describe(this.getUA())), this.parsedResult.browser;
        }, t.getBrowser = function () {
          return this.parsedResult.browser ? this.parsedResult.browser : this.parseBrowser();
        }, t.getBrowserName = function (e) {
          return e ? String(this.getBrowser().name).toLowerCase() || "" : this.getBrowser().name || "";
        }, t.getBrowserVersion = function () {
          return this.getBrowser().version;
        }, t.getOS = function () {
          return this.parsedResult.os ? this.parsedResult.os : this.parseOS();
        }, t.parseOS = function () {
          var e = this;
          this.parsedResult.os = {};
          var t = o.default.find(i.default, function (t) {
            if ("function" == typeof t.test) return t.test(e);
            if (t.test instanceof Array) return t.test.some(function (t) {
              return e.test(t);
            });
            throw new Error("Browser's test function is not valid");
          });
          return t && (this.parsedResult.os = t.describe(this.getUA())), this.parsedResult.os;
        }, t.getOSName = function (e) {
          var t = this.getOS().name;
          return e ? String(t).toLowerCase() || "" : t || "";
        }, t.getOSVersion = function () {
          return this.getOS().version;
        }, t.getPlatform = function () {
          return this.parsedResult.platform ? this.parsedResult.platform : this.parsePlatform();
        }, t.getPlatformType = function (e) {
          void 0 === e && (e = !1);
          var t = this.getPlatform().type;
          return e ? String(t).toLowerCase() || "" : t || "";
        }, t.parsePlatform = function () {
          var e = this;
          this.parsedResult.platform = {};
          var t = o.default.find(s.default, function (t) {
            if ("function" == typeof t.test) return t.test(e);
            if (t.test instanceof Array) return t.test.some(function (t) {
              return e.test(t);
            });
            throw new Error("Browser's test function is not valid");
          });
          return t && (this.parsedResult.platform = t.describe(this.getUA())), this.parsedResult.platform;
        }, t.getEngine = function () {
          return this.parsedResult.engine ? this.parsedResult.engine : this.parseEngine();
        }, t.getEngineName = function (e) {
          return e ? String(this.getEngine().name).toLowerCase() || "" : this.getEngine().name || "";
        }, t.parseEngine = function () {
          var e = this;
          this.parsedResult.engine = {};
          var t = o.default.find(a.default, function (t) {
            if ("function" == typeof t.test) return t.test(e);
            if (t.test instanceof Array) return t.test.some(function (t) {
              return e.test(t);
            });
            throw new Error("Browser's test function is not valid");
          });
          return t && (this.parsedResult.engine = t.describe(this.getUA())), this.parsedResult.engine;
        }, t.parse = function () {
          return this.parseBrowser(), this.parseOS(), this.parsePlatform(), this.parseEngine(), this;
        }, t.getResult = function () {
          return o.default.assign({}, this.parsedResult);
        }, t.satisfies = function (e) {
          var t = this,
              r = {},
              n = 0,
              i = {},
              s = 0;

          if (Object.keys(e).forEach(function (t) {
            var a = e[t];
            "string" == typeof a ? (i[t] = a, s += 1) : "object" == typeof a && (r[t] = a, n += 1);
          }), n > 0) {
            var a = Object.keys(r),
                u = o.default.find(a, function (e) {
              return t.isOS(e);
            });

            if (u) {
              var d = this.satisfies(r[u]);
              if (void 0 !== d) return d;
            }

            var c = o.default.find(a, function (e) {
              return t.isPlatform(e);
            });

            if (c) {
              var f = this.satisfies(r[c]);
              if (void 0 !== f) return f;
            }
          }

          if (s > 0) {
            var l = Object.keys(i),
                h = o.default.find(l, function (e) {
              return t.isBrowser(e, !0);
            });
            if (void 0 !== h) return this.compareVersion(i[h]);
          }
        }, t.isBrowser = function (e, t) {
          void 0 === t && (t = !1);
          var r = this.getBrowserName().toLowerCase(),
              n = e.toLowerCase(),
              i = o.default.getBrowserTypeByAlias(n);
          return t && i && (n = i.toLowerCase()), n === r;
        }, t.compareVersion = function (e) {
          var t = [0],
              r = e,
              n = !1,
              i = this.getBrowserVersion();
          if ("string" == typeof i) return ">" === e[0] || "<" === e[0] ? (r = e.substr(1), "=" === e[1] ? (n = !0, r = e.substr(2)) : t = [], ">" === e[0] ? t.push(1) : t.push(-1)) : "=" === e[0] ? r = e.substr(1) : "~" === e[0] && (n = !0, r = e.substr(1)), t.indexOf(o.default.compareVersions(i, r, n)) > -1;
        }, t.isOS = function (e) {
          return this.getOSName(!0) === String(e).toLowerCase();
        }, t.isPlatform = function (e) {
          return this.getPlatformType(!0) === String(e).toLowerCase();
        }, t.isEngine = function (e) {
          return this.getEngineName(!0) === String(e).toLowerCase();
        }, t.is = function (e, t) {
          return void 0 === t && (t = !1), this.isBrowser(e, t) || this.isOS(e) || this.isPlatform(e);
        }, t.some = function (e) {
          var t = this;
          return void 0 === e && (e = []), e.some(function (e) {
            return t.is(e);
          });
        }, e;
      }();

      t.default = d, e.exports = t.default;
    },
    92: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.default = void 0;
      var n,
          i = (n = r(17)) && n.__esModule ? n : {
        default: n
      };
      var s = /version\/(\d+(\.?_?\d+)+)/i,
          a = [{
        test: [/googlebot/i],
        describe: function (e) {
          var t = {
            name: "Googlebot"
          },
              r = i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/opera/i],
        describe: function (e) {
          var t = {
            name: "Opera"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/opr\/|opios/i],
        describe: function (e) {
          var t = {
            name: "Opera"
          },
              r = i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/SamsungBrowser/i],
        describe: function (e) {
          var t = {
            name: "Samsung Internet for Android"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/Whale/i],
        describe: function (e) {
          var t = {
            name: "NAVER Whale Browser"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/MZBrowser/i],
        describe: function (e) {
          var t = {
            name: "MZ Browser"
          },
              r = i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/focus/i],
        describe: function (e) {
          var t = {
            name: "Focus"
          },
              r = i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/swing/i],
        describe: function (e) {
          var t = {
            name: "Swing"
          },
              r = i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/coast/i],
        describe: function (e) {
          var t = {
            name: "Opera Coast"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/opt\/\d+(?:.?_?\d+)+/i],
        describe: function (e) {
          var t = {
            name: "Opera Touch"
          },
              r = i.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/yabrowser/i],
        describe: function (e) {
          var t = {
            name: "Yandex Browser"
          },
              r = i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/ucbrowser/i],
        describe: function (e) {
          var t = {
            name: "UC Browser"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/Maxthon|mxios/i],
        describe: function (e) {
          var t = {
            name: "Maxthon"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/epiphany/i],
        describe: function (e) {
          var t = {
            name: "Epiphany"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/puffin/i],
        describe: function (e) {
          var t = {
            name: "Puffin"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/sleipnir/i],
        describe: function (e) {
          var t = {
            name: "Sleipnir"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/k-meleon/i],
        describe: function (e) {
          var t = {
            name: "K-Meleon"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/micromessenger/i],
        describe: function (e) {
          var t = {
            name: "WeChat"
          },
              r = i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/qqbrowser/i],
        describe: function (e) {
          var t = {
            name: /qqbrowserlite/i.test(e) ? "QQ Browser Lite" : "QQ Browser"
          },
              r = i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/msie|trident/i],
        describe: function (e) {
          var t = {
            name: "Internet Explorer"
          },
              r = i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/\sedg\//i],
        describe: function (e) {
          var t = {
            name: "Microsoft Edge"
          },
              r = i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/edg([ea]|ios)/i],
        describe: function (e) {
          var t = {
            name: "Microsoft Edge"
          },
              r = i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/vivaldi/i],
        describe: function (e) {
          var t = {
            name: "Vivaldi"
          },
              r = i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/seamonkey/i],
        describe: function (e) {
          var t = {
            name: "SeaMonkey"
          },
              r = i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/sailfish/i],
        describe: function (e) {
          var t = {
            name: "Sailfish"
          },
              r = i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/silk/i],
        describe: function (e) {
          var t = {
            name: "Amazon Silk"
          },
              r = i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/phantom/i],
        describe: function (e) {
          var t = {
            name: "PhantomJS"
          },
              r = i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/slimerjs/i],
        describe: function (e) {
          var t = {
            name: "SlimerJS"
          },
              r = i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe: function (e) {
          var t = {
            name: "BlackBerry"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/(web|hpw)[o0]s/i],
        describe: function (e) {
          var t = {
            name: "WebOS Browser"
          },
              r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/bada/i],
        describe: function (e) {
          var t = {
            name: "Bada"
          },
              r = i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/tizen/i],
        describe: function (e) {
          var t = {
            name: "Tizen"
          },
              r = i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/qupzilla/i],
        describe: function (e) {
          var t = {
            name: "QupZilla"
          },
              r = i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/firefox|iceweasel|fxios/i],
        describe: function (e) {
          var t = {
            name: "Firefox"
          },
              r = i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/electron/i],
        describe: function (e) {
          var t = {
            name: "Electron"
          },
              r = i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/MiuiBrowser/i],
        describe: function (e) {
          var t = {
            name: "Miui"
          },
              r = i.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/chromium/i],
        describe: function (e) {
          var t = {
            name: "Chromium"
          },
              r = i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/chrome|crios|crmo/i],
        describe: function (e) {
          var t = {
            name: "Chrome"
          },
              r = i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/GSA/i],
        describe: function (e) {
          var t = {
            name: "Google Search"
          },
              r = i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: function (e) {
          var t = !e.test(/like android/i),
              r = e.test(/android/i);
          return t && r;
        },
        describe: function (e) {
          var t = {
            name: "Android Browser"
          },
              r = i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/playstation 4/i],
        describe: function (e) {
          var t = {
            name: "PlayStation 4"
          },
              r = i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/safari|applewebkit/i],
        describe: function (e) {
          var t = {
            name: "Safari"
          },
              r = i.default.getFirstMatch(s, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/.*/i],
        describe: function (e) {
          var t = -1 !== e.search("\\(") ? /^(.*)\/(.*)[ \t]\((.*)/ : /^(.*)\/(.*) /;
          return {
            name: i.default.getFirstMatch(t, e),
            version: i.default.getSecondMatch(t, e)
          };
        }
      }];
      t.default = a, e.exports = t.default;
    },
    93: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.default = void 0;
      var n,
          i = (n = r(17)) && n.__esModule ? n : {
        default: n
      },
          s = r(18);
      var a = [{
        test: [/Roku\/DVP/],
        describe: function (e) {
          var t = i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, e);
          return {
            name: s.OS_MAP.Roku,
            version: t
          };
        }
      }, {
        test: [/windows phone/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, e);
          return {
            name: s.OS_MAP.WindowsPhone,
            version: t
          };
        }
      }, {
        test: [/windows /i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, e),
              r = i.default.getWindowsVersionName(t);
          return {
            name: s.OS_MAP.Windows,
            version: t,
            versionName: r
          };
        }
      }, {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe: function (e) {
          var t = {
            name: s.OS_MAP.iOS
          },
              r = i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/macintosh/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, e).replace(/[_\s]/g, "."),
              r = i.default.getMacOSVersionName(t),
              n = {
            name: s.OS_MAP.MacOS,
            version: t
          };
          return r && (n.versionName = r), n;
        }
      }, {
        test: [/(ipod|iphone|ipad)/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, e).replace(/[_\s]/g, ".");
          return {
            name: s.OS_MAP.iOS,
            version: t
          };
        }
      }, {
        test: function (e) {
          var t = !e.test(/like android/i),
              r = e.test(/android/i);
          return t && r;
        },
        describe: function (e) {
          var t = i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, e),
              r = i.default.getAndroidVersionName(t),
              n = {
            name: s.OS_MAP.Android,
            version: t
          };
          return r && (n.versionName = r), n;
        }
      }, {
        test: [/(web|hpw)[o0]s/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, e),
              r = {
            name: s.OS_MAP.WebOS
          };
          return t && t.length && (r.version = t), r;
        }
      }, {
        test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, e) || i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, e) || i.default.getFirstMatch(/\bbb(\d+)/i, e);
          return {
            name: s.OS_MAP.BlackBerry,
            version: t
          };
        }
      }, {
        test: [/bada/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, e);
          return {
            name: s.OS_MAP.Bada,
            version: t
          };
        }
      }, {
        test: [/tizen/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, e);
          return {
            name: s.OS_MAP.Tizen,
            version: t
          };
        }
      }, {
        test: [/linux/i],
        describe: function () {
          return {
            name: s.OS_MAP.Linux
          };
        }
      }, {
        test: [/CrOS/],
        describe: function () {
          return {
            name: s.OS_MAP.ChromeOS
          };
        }
      }, {
        test: [/PlayStation 4/],
        describe: function (e) {
          var t = i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, e);
          return {
            name: s.OS_MAP.PlayStation4,
            version: t
          };
        }
      }];
      t.default = a, e.exports = t.default;
    },
    94: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.default = void 0;
      var n,
          i = (n = r(17)) && n.__esModule ? n : {
        default: n
      },
          s = r(18);
      var a = [{
        test: [/googlebot/i],
        describe: function () {
          return {
            type: "bot",
            vendor: "Google"
          };
        }
      }, {
        test: [/huawei/i],
        describe: function (e) {
          var t = i.default.getFirstMatch(/(can-l01)/i, e) && "Nova",
              r = {
            type: s.PLATFORMS_MAP.mobile,
            vendor: "Huawei"
          };
          return t && (r.model = t), r;
        }
      }, {
        test: [/nexus\s*(?:7|8|9|10).*/i],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tablet,
            vendor: "Nexus"
          };
        }
      }, {
        test: [/ipad/i],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tablet,
            vendor: "Apple",
            model: "iPad"
          };
        }
      }, {
        test: [/Macintosh(.*?) FxiOS(.*?)\//],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tablet,
            vendor: "Apple",
            model: "iPad"
          };
        }
      }, {
        test: [/kftt build/i],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tablet,
            vendor: "Amazon",
            model: "Kindle Fire HD 7"
          };
        }
      }, {
        test: [/silk/i],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tablet,
            vendor: "Amazon"
          };
        }
      }, {
        test: [/tablet(?! pc)/i],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tablet
          };
        }
      }, {
        test: function (e) {
          var t = e.test(/ipod|iphone/i),
              r = e.test(/like (ipod|iphone)/i);
          return t && !r;
        },
        describe: function (e) {
          var t = i.default.getFirstMatch(/(ipod|iphone)/i, e);
          return {
            type: s.PLATFORMS_MAP.mobile,
            vendor: "Apple",
            model: t
          };
        }
      }, {
        test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.mobile,
            vendor: "Nexus"
          };
        }
      }, {
        test: [/[^-]mobi/i],
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.mobile
          };
        }
      }, {
        test: function (e) {
          return "blackberry" === e.getBrowserName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.mobile,
            vendor: "BlackBerry"
          };
        }
      }, {
        test: function (e) {
          return "bada" === e.getBrowserName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.mobile
          };
        }
      }, {
        test: function (e) {
          return "windows phone" === e.getBrowserName();
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.mobile,
            vendor: "Microsoft"
          };
        }
      }, {
        test: function (e) {
          var t = Number(String(e.getOSVersion()).split(".")[0]);
          return "android" === e.getOSName(!0) && t >= 3;
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tablet
          };
        }
      }, {
        test: function (e) {
          return "android" === e.getOSName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.mobile
          };
        }
      }, {
        test: function (e) {
          return "macos" === e.getOSName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.desktop,
            vendor: "Apple"
          };
        }
      }, {
        test: function (e) {
          return "windows" === e.getOSName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.desktop
          };
        }
      }, {
        test: function (e) {
          return "linux" === e.getOSName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.desktop
          };
        }
      }, {
        test: function (e) {
          return "playstation 4" === e.getOSName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tv
          };
        }
      }, {
        test: function (e) {
          return "roku" === e.getOSName(!0);
        },
        describe: function () {
          return {
            type: s.PLATFORMS_MAP.tv
          };
        }
      }];
      t.default = a, e.exports = t.default;
    },
    95: function (e, t, r) {
      "use strict";

      t.__esModule = !0, t.default = void 0;
      var n,
          i = (n = r(17)) && n.__esModule ? n : {
        default: n
      },
          s = r(18);
      var a = [{
        test: function (e) {
          return "microsoft edge" === e.getBrowserName(!0);
        },
        describe: function (e) {
          if (/\sedg\//i.test(e)) return {
            name: s.ENGINE_MAP.Blink
          };
          var t = i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, e);
          return {
            name: s.ENGINE_MAP.EdgeHTML,
            version: t
          };
        }
      }, {
        test: [/trident/i],
        describe: function (e) {
          var t = {
            name: s.ENGINE_MAP.Trident
          },
              r = i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: function (e) {
          return e.test(/presto/i);
        },
        describe: function (e) {
          var t = {
            name: s.ENGINE_MAP.Presto
          },
              r = i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: function (e) {
          var t = e.test(/gecko/i),
              r = e.test(/like gecko/i);
          return t && !r;
        },
        describe: function (e) {
          var t = {
            name: s.ENGINE_MAP.Gecko
          },
              r = i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }, {
        test: [/(apple)?webkit\/537\.36/i],
        describe: function () {
          return {
            name: s.ENGINE_MAP.Blink
          };
        }
      }, {
        test: [/(apple)?webkit/i],
        describe: function (e) {
          var t = {
            name: s.ENGINE_MAP.WebKit
          },
              r = i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, e);
          return r && (t.version = r), t;
        }
      }];
      t.default = a, e.exports = t.default;
    }
  });
});

/***/ }),

/***/ 2177:
/*!**********************************************************!*\
  !*** ./app/soapbox/features/intentional_error/index.tsx ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * IntentionalError:
 * For testing logging/monitoring & previewing ErrorBoundary design.
 */
var IntentionalError = function () {
    throw 'This error is intentional.';
};
/* harmony default export */ __webpack_exports__["default"] = (IntentionalError);


/***/ })

}]);
//# sourceMappingURL=error-a5d2dd95006109016ef5.chunk.js.map