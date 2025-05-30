"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[26],{

/***/ 1663:
/*!*********************************************************!*\
  !*** ./app/soapbox/features/developers/apps/create.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_apps__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/apps */ 296);
/* harmony import */ var soapbox_actions_oauth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/oauth */ 463);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/features/ui/components/column */ 963);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/utils/accounts */ 94);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/developers/apps/create.tsx";
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









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.app_create",
        "defaultMessage": "Create app"
    },
    namePlaceholder: {
        "id": "app_create.name_placeholder",
        "defaultMessage": "e.g. 'Soapbox'"
    },
    scopesPlaceholder: {
        "id": "app_create.scopes_placeholder",
        "defaultMessage": "e.g. 'read write follow'"
    }
});
var BLANK_PARAMS = {
    client_name: '',
    redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
    scopes: '',
    website: ''
};
var CreateApp = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useOwnAccount)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null), app = _a[0], setApp = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null), token = _b[0], setToken = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), isLoading = _c[0], setLoading = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(BLANK_PARAMS), params = _d[0], setParams = _d[1];
    var handleCreateApp = function () {
        var baseURL = (0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_7__.getBaseURL)(account);
        return dispatch((0,soapbox_actions_apps__WEBPACK_IMPORTED_MODULE_2__.createApp)(params, baseURL)).then(function (app) {
            setApp(app);
            return app;
        });
    };
    var handleCreateToken = function (app) {
        var baseURL = (0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_7__.getBaseURL)(account);
        var tokenParams = {
            client_id: app.client_id,
            client_secret: app.client_secret,
            redirect_uri: params.redirect_uris,
            grant_type: 'client_credentials',
            scope: params.scopes
        };
        return dispatch((0,soapbox_actions_oauth__WEBPACK_IMPORTED_MODULE_3__.obtainOAuthToken)(tokenParams, baseURL)).then(setToken);
    };
    var handleSubmit = function () {
        setLoading(true);
        handleCreateApp().then(handleCreateToken).then(function () {
            scrollToTop();
            setLoading(false);
        }).catch(function (error) {
            console.error(error);
            setLoading(false);
        });
    };
    var setParam = function (key, value) {
        var _a;
        setParams(_objectSpread(_objectSpread({}, params), {}, (_a = {},
            _a[key] = value,
            _a)));
    };
    var handleParamChange = function (key) {
        return function (e) {
            setParam(key, e.target.value);
        };
    };
    var resetState = function () {
        setApp(null);
        setToken(null);
        setLoading(false);
        setParams(BLANK_PARAMS);
    };
    var handleReset = function () {
        resetState();
        scrollToTop();
    };
    var scrollToTop = function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    var renderResults = function () {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_5__["default"], {
            label: intl.formatMessage(messages.heading),
            backHref: "/developers",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 103,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Form, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 104,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 105,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
            size: "lg",
            weight: "medium",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 106,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "app_create.results.explanation_title",
            defaultMessage: "App created successfully",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 107,
                columnNumber: 15
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
            theme: "muted",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 109,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "app_create.results.explanation_text",
            defaultMessage: "You created a new app and token! Please copy the credentials somewhere; you will not see them again after navigating away from this page.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 110,
                columnNumber: 15
            }
        }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormGroup, {
            labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
                id: "app_create.results.app_label",
                defaultMessage: "App",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 117,
                    columnNumber: 33
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 117,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Textarea, {
            value: JSON.stringify(app, null, 2),
            rows: 10,
            readOnly: true,
            isCodeEditor: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 118,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormGroup, {
            labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
                id: "app_create.results.token_label",
                defaultMessage: "OAuth token",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 126,
                    columnNumber: 33
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 126,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Textarea, {
            value: JSON.stringify(token, null, 2),
            rows: 10,
            readOnly: true,
            isCodeEditor: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 127,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormActions, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 135,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
            theme: "primary",
            type: "button",
            onClick: handleReset,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 136,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "app_create.restart",
            defaultMessage: "Create another",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 137,
                columnNumber: 15
            }
        })))));
    };
    if (app && token) {
        return renderResults();
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_5__["default"], {
        label: intl.formatMessage(messages.heading),
        backHref: "/developers",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 150,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 151,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "app_create.name_label",
            defaultMessage: "App name",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 152,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 152,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Input, {
        type: "text",
        placeholder: intl.formatMessage(messages.namePlaceholder),
        onChange: handleParamChange('client_name'),
        value: params.client_name,
        required: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 153,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "app_create.website_label",
            defaultMessage: "Website",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 162,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 162,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Input, {
        type: "text",
        placeholder: "https://soapbox.pub",
        onChange: handleParamChange('website'),
        value: params.website,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 163,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "app_create.redirect_uri_label",
            defaultMessage: "Redirect URIs",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 171,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 171,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Input, {
        type: "text",
        placeholder: "https://example.com",
        onChange: handleParamChange('redirect_uris'),
        value: params.redirect_uris,
        required: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 172,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "app_create.scopes_label",
            defaultMessage: "Scopes",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 181,
                columnNumber: 31
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 181,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Input, {
        type: "text",
        placeholder: intl.formatMessage(messages.scopesPlaceholder),
        onChange: handleParamChange('scopes'),
        value: params.scopes,
        required: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 182,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 191,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        theme: "primary",
        type: "submit",
        disabled: isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 192,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "app_create.submit",
        defaultMessage: "Create app",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 193,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (CreateApp);


/***/ }),

/***/ 2416:
/*!******************************************************************!*\
  !*** ./app/soapbox/features/developers/developers-challenge.tsx ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui/components/column */ 963);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/developers/developers-challenge.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    heading: {
        "id": "column.developers",
        "defaultMessage": "Developers"
    },
    answerLabel: {
        "id": "developers.challenge.answer_label",
        "defaultMessage": "Answer"
    },
    answerPlaceholder: {
        "id": "developers.challenge.answer_placeholder",
        "defaultMessage": "Your answer"
    },
    success: {
        "id": "developers.challenge.success",
        "defaultMessage": "You are now a developer"
    },
    fail: {
        "id": "developers.challenge.fail",
        "defaultMessage": "Wrong answer"
    }
});
var DevelopersChallenge = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(''), answer = _a[0], setAnswer = _a[1];
    var handleChangeAnswer = function (e) {
        setAnswer(e.target.value);
    };
    var handleSubmit = function () {
        if (answer === 'boxsoap') {
            dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__.changeSettingImmediate)(['isDeveloper'], true));
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(intl.formatMessage(messages.success)));
        }
        else {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].error(intl.formatMessage(messages.fail)));
        }
    };
    var challenge = "function soapbox() {\n  return 'soap|box'.split('|').reverse().join('');\n}";
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_6__["default"], {
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "developers.challenge.message",
        defaultMessage: "What is the result of calling {function}?",
        values: {
            function: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
                className: "font-mono",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 49,
                    columnNumber: 33
                }
            }, "soapbox()")
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        tag: "pre",
        family: "mono",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 9
        }
    }, challenge), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormGroup, {
        labelText: intl.formatMessage(messages.answerLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
        name: "answer",
        placeholder: intl.formatMessage(messages.answerPlaceholder),
        onChange: handleChangeAnswer,
        value: answer,
        type: "text",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        theme: "primary",
        type: "submit",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "developers.challenge.submit",
        defaultMessage: "Become a developer",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (DevelopersChallenge);


/***/ }),

/***/ 2417:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/developers/developers-menu.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui/icon/svg-icon */ 70);
/* harmony import */ var soapbox_utils_code__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/utils/code */ 98);
/* harmony import */ var soapbox_utils_code__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(soapbox_utils_code__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ui/components/column */ 963);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/developers/developers-menu.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.developers",
        "defaultMessage": "Developers"
    },
    leave: {
        "id": "developers.leave",
        "defaultMessage": "You have left developers"
    }
});
var DashWidget = function (_ref) {
    var to = _ref.to, onClick = _ref.onClick, children = _ref.children;
    var className = 'bg-gray-200 dark:bg-gray-600 p-4 rounded flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform';
    if (to) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_9__.Link, {
            className: className,
            to: to,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
                columnNumber: 12
            }
        }, children);
    }
    else {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
            className: className,
            onClick: onClick,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 31,
                columnNumber: 12
            }
        }, children);
    }
};
var Developers = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__["default"])();
    var leaveDevelopers = function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_2__.changeSettingImmediate)(['isDeveloper'], false));
        dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__["default"].success(intl.formatMessage(messages.leave)));
        history.push('/');
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_7__["default"], {
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DashWidget, {
        to: "/developers/apps/create",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: __webpack_require__(/*! @tabler/icons/apps.svg */ 2418),
        className: "dark:text-gray-100",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "developers.navigation.app_create_label",
        defaultMessage: "Create an app",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DashWidget, {
        to: "/developers/settings_store",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: __webpack_require__(/*! @tabler/icons/code-plus.svg */ 2419),
        className: "dark:text-gray-100",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "developers.navigation.settings_store_label",
        defaultMessage: "Settings store",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DashWidget, {
        to: "/developers/timeline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: __webpack_require__(/*! @tabler/icons/home.svg */ 288),
        className: "dark:text-gray-100",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "developers.navigation.test_timeline_label",
        defaultMessage: "Test timeline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DashWidget, {
        to: "/error",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: __webpack_require__(/*! @tabler/icons/mood-sad.svg */ 2420),
        className: "dark:text-gray-100",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "developers.navigation.intentional_error_label",
        defaultMessage: "Trigger an error",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DashWidget, {
        to: "/error/network",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: __webpack_require__(/*! @tabler/icons/refresh.svg */ 1054),
        className: "dark:text-gray-100",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "developers.navigation.network_error_label",
        defaultMessage: "Network error",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(DashWidget, {
        onClick: leaveDevelopers,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui_icon_svg_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: __webpack_require__(/*! @tabler/icons/logout.svg */ 970),
        className: "dark:text-gray-100",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "developers.navigation.leave_developers_label",
        defaultMessage: "Leave developers",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 15
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "p-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        align: "center",
        theme: "subtle",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 103,
            columnNumber: 9
        }
    }, (soapbox_utils_code__WEBPACK_IMPORTED_MODULE_6___default().displayName), " ", (soapbox_utils_code__WEBPACK_IMPORTED_MODULE_6___default().version))));
};
/* harmony default export */ __webpack_exports__["default"] = (Developers);


/***/ }),

/***/ 1662:
/*!***************************************************!*\
  !*** ./app/soapbox/features/developers/index.tsx ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _developers_challenge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./developers-challenge */ 2416);
/* harmony import */ var _developers_menu__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./developers-menu */ 2417);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/developers/index.tsx";





var Developers = function () {
    var isDeveloper = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__.getSettings)(state).get('isDeveloper'); });
    return isDeveloper ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_developers_menu__WEBPACK_IMPORTED_MODULE_4__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 24
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_developers_challenge__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 45
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (Developers);


/***/ }),

/***/ 1664:
/*!************************************************************!*\
  !*** ./app/soapbox/features/developers/settings-store.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_alerts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/alerts */ 75);
/* harmony import */ var soapbox_actions_me__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/me */ 64);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/list */ 965);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/notifications/components/setting_toggle */ 1039);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/developers/settings-store.tsx";










var isJSONValid = function (text) {
    try {
        JSON.parse(text);
        return true;
    }
    catch (_a) {
        return false;
    }
};
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    heading: {
        "id": "column.settings_store",
        "defaultMessage": "Settings store"
    },
    hint: {
        "id": "developers.settings_store.hint",
        "defaultMessage": "It is possible to directly edit your user settings here. BE CAREFUL! Editing this section can break your account, and you will only be able to recover through the API."
    }
});
var SettingsStore = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppDispatch)();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useSettings)();
    var settingsStore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.get('settings'); });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(JSON.stringify(settingsStore, null, 2)), rawJSON = _a[0], setRawJSON = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), jsonValid = _b[0], setJsonValid = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), isLoading = _c[0], setLoading = _c[1];
    var handleEditJSON = function (_ref) {
        var target = _ref.target;
        var rawJSON = target.value;
        setRawJSON(rawJSON);
        setJsonValid(isJSONValid(rawJSON));
    };
    var onToggleChange = function (key, checked) {
        dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_4__.changeSetting)(key, checked, {
            showAlert: true
        }));
    };
    var handleSubmit = function (e) {
        var _a;
        var settings = JSON.parse(rawJSON);
        setLoading(true);
        dispatch((0,soapbox_actions_me__WEBPACK_IMPORTED_MODULE_3__.patchMe)({
            pleroma_settings_store: (_a = {},
                _a[soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_4__.FE_NAME] = settings,
                _a)
        })).then(function (response) {
            dispatch({
                type: soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_4__.SETTINGS_UPDATE,
                settings: settings
            });
            setLoading(false);
        }).catch(function (error) {
            dispatch((0,soapbox_actions_alerts__WEBPACK_IMPORTED_MODULE_2__.showAlertForError)(error));
            setLoading(false);
        });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        setRawJSON(JSON.stringify(settingsStore, null, 2));
        setJsonValid(true);
    }, [settingsStore]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Column, {
        label: intl.formatMessage(messages.heading),
        backHref: "/developers",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        hintText: intl.formatMessage(messages.hint),
        errors: jsonValid ? [] : ['is invalid'],
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Textarea, {
        value: rawJSON,
        onChange: handleEditJSON,
        disabled: isLoading,
        rows: 12,
        isCodeEditor: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        theme: "primary",
        type: "submit",
        disabled: !jsonValid || isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "soapbox_config.save",
        defaultMessage: "Save",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 13
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardTitle, {
        title: "Advanced settings",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.notifications.advanced",
            defaultMessage: "Show all notification categories",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 105,
                columnNumber: 26
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 105,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['notifications', 'quickFilter', 'advanced'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 106,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.fields.unfollow_modal_label",
            defaultMessage: "Show confirmation dialog before unfollowing someone",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 109,
                columnNumber: 26
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['unfollowModal'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.fields.missing_description_modal_label",
            defaultMessage: "Show confirmation dialog before sending a post without media descriptions",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 113,
                columnNumber: 26
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['missingDescriptionModal'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.fields.reduce_motion_label",
            defaultMessage: "Reduce motion in animations",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 117,
                columnNumber: 26
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 117,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['reduceMotion'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.fields.underline_links_label",
            defaultMessage: "Always underline links in posts",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 121,
                columnNumber: 26
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['underlineLinks'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.fields.system_font_label",
            defaultMessage: "Use system's default font",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 125,
                columnNumber: 26
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['systemFont'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "dyslexic",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.fields.dyslexic_font_label",
            defaultMessage: "Dyslexic mode",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 130,
                columnNumber: 28
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 130,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['dyslexicFont'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 131,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_5__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.fields.demetricator_label",
            defaultMessage: "Use Demetricator",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 143,
                columnNumber: 18
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "preferences.hints.demetricator",
            defaultMessage: "Decrease social media anxiety by hiding all numbers from the site.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 144,
                columnNumber: 17
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 142,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_notifications_components_setting_toggle__WEBPACK_IMPORTED_MODULE_7__["default"], {
        settings: settings,
        settingPath: ['demetricator'],
        onChange: onToggleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 146,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (SettingsStore);


/***/ }),

/***/ 2418:
/*!***************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/apps.svg ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/apps-076fd39c.svg";

/***/ }),

/***/ 2419:
/*!********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/code-plus.svg ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/code-plus-890aad81.svg";

/***/ }),

/***/ 2420:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/mood-sad.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/mood-sad-fff5a232.svg";

/***/ })

}]);
//# sourceMappingURL=developers-b0601d997f3976136c01.chunk.js.map