"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[67],{

/***/ 2353:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/security/mfa/disable_otp_form.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.promise.finally.js */ 261);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/mfa */ 1500);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 24);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/security/mfa/disable_otp_form.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    mfa_setup_disable_button: {
        "id": "column.mfa_disable_button",
        "defaultMessage": "Disable"
    },
    disableFail: {
        "id": "security.disable.fail",
        "defaultMessage": "Incorrect password. Try again."
    },
    mfaDisableSuccess: {
        "id": "mfa.disable.success_message",
        "defaultMessage": "MFA disabled"
    },
    passwordPlaceholder: {
        "id": "mfa.mfa_setup.password_placeholder",
        "defaultMessage": "Password"
    }
});
var DisableOtpForm = function () {
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(''), password = _b[0], setPassword = _b[1];
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useHistory)();
    var handleSubmit = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function () {
        setIsLoading(true);
        dispatch((0,soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_3__.disableMfa)('totp', password)).then(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(intl.formatMessage(messages.mfaDisableSuccess)));
            history.push('../auth/edit');
        }).finally(function () {
            setIsLoading(false);
        }).catch(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].error(intl.formatMessage(messages.disableFail)));
        });
    }, [password, dispatch, intl]);
    var handleInputChange = function (event) {
        setPassword(event.target.value);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "mfa.otp_enabled_title",
        defaultMessage: "OTP Enabled",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "mfa.otp_enabled_description",
        defaultMessage: "You have enabled two-factor authentication via OTP.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormGroup, {
        labelText: intl.formatMessage(messages.passwordPlaceholder),
        hintText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "mfa.mfa_disable_enter_password",
            defaultMessage: "Enter your current password to disable two-factor auth.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 55,
                columnNumber: 19
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
        type: "password",
        placeholder: intl.formatMessage(messages.passwordPlaceholder),
        name: "password",
        onChange: handleInputChange,
        disabled: isLoading,
        value: password,
        required: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        disabled: isLoading,
        theme: "danger",
        type: "submit",
        text: intl.formatMessage(messages.mfa_setup_disable_button),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (DisableOtpForm);


/***/ }),

/***/ 2354:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/security/mfa/enable_otp_form.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/mfa */ 1500);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/snackbar */ 24);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/security/mfa/enable_otp_form.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    mfaCancelButton: {
        "id": "column.mfa_cancel",
        "defaultMessage": "Cancel"
    },
    mfaSetupButton: {
        "id": "column.mfa_setup",
        "defaultMessage": "Proceed to Setup"
    },
    codesFail: {
        "id": "security.codes.fail",
        "defaultMessage": "Failed to fetch backup codes"
    }
});
var EnableOtpForm = function (_ref) {
    var displayOtpForm = _ref.displayOtpForm, handleSetupProceedClick = _ref.handleSetupProceedClick;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useHistory)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]), backupCodes = _a[0], setBackupCodes = _a[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_2__.fetchBackupCodes)()).then(function (_ref2) {
            var backupCodes = _ref2.codes;
            setBackupCodes(backupCodes);
        }).catch(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__["default"].error(intl.formatMessage(messages.codesFail)));
        });
    }, []);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "mfa.setup_warning",
        defaultMessage: "Write these codes down or save them somewhere secure - otherwise you won't see them again. If you lose access to your 2FA app and recovery codes you'll be locked out of your account.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "bg-gray-100 dark:bg-slate-900/50 rounded-lg p-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        space: 3,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        weight: "medium",
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "mfa.setup_recoverycodes",
        defaultMessage: "Recovery codes",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 15
        }
    })), backupCodes.length > 0 ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "grid gap-3 grid-cols-2 rounded-lg text-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 15
        }
    }, backupCodes.map(function (code, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        key: i,
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 19
        }
    }, code); })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 15
        }
    })))), !displayOtpForm && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        theme: "ghost",
        text: intl.formatMessage(messages.mfaCancelButton),
        onClick: function () { return history.push('../auth/edit'); },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 11
        }
    }), backupCodes.length > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        theme: "primary",
        text: intl.formatMessage(messages.mfaSetupButton),
        onClick: handleSetupProceedClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 13
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (EnableOtpForm);


/***/ }),

/***/ 2355:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/security/mfa/otp_confirm_form.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! qrcode.react */ 1890);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/mfa */ 1500);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 24);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/security/mfa/otp_confirm_form.tsx";
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









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    mfaCancelButton: {
        "id": "column.mfa_cancel",
        "defaultMessage": "Cancel"
    },
    mfaSetupConfirmButton: {
        "id": "column.mfa_confirm_button",
        "defaultMessage": "Confirm"
    },
    confirmFail: {
        "id": "security.confirm.fail",
        "defaultMessage": "Incorrect code or password. Try again."
    },
    qrFail: {
        "id": "security.qr.fail",
        "defaultMessage": "Failed to fetch setup key"
    },
    mfaConfirmSuccess: {
        "id": "mfa.confirm.success_message",
        "defaultMessage": "MFA confirmed"
    },
    codePlaceholder: {
        "id": "mfa.mfa_setup.code_placeholder",
        "defaultMessage": "Code"
    },
    passwordPlaceholder: {
        "id": "mfa.mfa_setup.password_placeholder",
        "defaultMessage": "Password"
    }
});
var OtpConfirmForm = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useHistory)();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({
        password: '',
        isLoading: false,
        code: '',
        qrCodeURI: '',
        confirmKey: ''
    }), state = _a[0], setState = _a[1];
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        dispatch((0,soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_3__.setupMfa)('totp')).then(function (data) {
            setState(function (prevState) { return _objectSpread(_objectSpread({}, prevState), {}, {
                qrCodeURI: data.provisioning_uri,
                confirmKey: data.key
            }); });
        }).catch(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].error(intl.formatMessage(messages.qrFail)));
        });
    }, []);
    var handleInputChange = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function (event) {
        event.persist();
        setState(function (prevState) {
            var _a;
            return _objectSpread(_objectSpread({}, prevState), {}, (_a = {},
                _a[event.target.name] = event.target.value,
                _a));
        });
    }, []);
    var handleSubmit = function (e) {
        setState(function (prevState) { return _objectSpread(_objectSpread({}, prevState), {}, {
            isLoading: true
        }); });
        dispatch((0,soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_3__.confirmMfa)('totp', state.code, state.password)).then(function (r) {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(intl.formatMessage(messages.mfaConfirmSuccess)));
            history.push('../auth/edit');
        }).catch(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].error(intl.formatMessage(messages.confirmFail)));
            setState(function (prevState) { return _objectSpread(_objectSpread({}, prevState), {}, {
                isLoading: false
            }); });
        });
        e.preventDefault();
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("hr", {
        className: "mt-4 dark:border-slate-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        weight: "semibold",
        size: "lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 11
        }
    }, "1. ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "mfa.mfa_setup_scan_title",
        defaultMessage: "Scan",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 16
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "mfa.mfa_setup_scan_description",
        defaultMessage: "Using your two-factor app, scan this QR code or enter the text key.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(qrcode_react__WEBPACK_IMPORTED_MODULE_1__.QRCodeCanvas, {
        value: state.qrCodeURI,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 9
        }
    }), state.confirmKey, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        weight: "semibold",
        size: "lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 9
        }
    }, "2. ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "mfa.mfa_setup_verify_title",
        defaultMessage: "Verify",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 14
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormGroup, {
        labelText: intl.formatMessage(messages.codePlaceholder),
        hintText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "mfa.mfa_setup.code_hint",
            defaultMessage: "Enter the code from your two-factor app.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 89,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
        name: "code",
        placeholder: intl.formatMessage(messages.codePlaceholder),
        onChange: handleInputChange,
        autoComplete: "off",
        disabled: state.isLoading,
        value: state.code,
        type: "text",
        required: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormGroup, {
        labelText: intl.formatMessage(messages.passwordPlaceholder),
        hintText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "mfa.mfa_setup.password_hint",
            defaultMessage: "Enter your current password to confirm your identity.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 105,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 103,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
        type: "password",
        name: "password",
        placeholder: intl.formatMessage(messages.passwordPlaceholder),
        onChange: handleInputChange,
        disabled: state.isLoading,
        value: state.password,
        required: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 107,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        type: "button",
        theme: "ghost",
        text: intl.formatMessage(messages.mfaCancelButton),
        onClick: function () { return history.push('../auth/edit'); },
        disabled: state.isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 119,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        type: "submit",
        theme: "primary",
        text: intl.formatMessage(messages.mfaSetupConfirmButton),
        disabled: state.isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (OtpConfirmForm);


/***/ }),

/***/ 2098:
/*!****************************************************!*\
  !*** ./app/soapbox/features/security/mfa_form.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/mfa */ 1500);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var _mfa_disable_otp_form__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mfa/disable_otp_form */ 2353);
/* harmony import */ var _mfa_enable_otp_form__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./mfa/enable_otp_form */ 2354);
/* harmony import */ var _mfa_otp_confirm_form__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./mfa/otp_confirm_form */ 2355);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/security/mfa_form.tsx";









/*
Security settings page for user account
Routed to /settings/mfa
Includes following features:
- Set up Multi-factor Auth
*/
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.mfa",
        "defaultMessage": "Multi-Factor Authentication"
    }
});
var MfaForm = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), displayOtpForm = _a[0], setDisplayOtpForm = _a[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_2__.fetchMfa)());
    }, []);
    var handleSetupProceedClick = function (event) {
        event.preventDefault();
        setDisplayOtpForm(true);
    };
    var mfa = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.security.get('mfa'); });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Column, {
        label: intl.formatMessage(messages.heading),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardHeader, {
        backHref: "/settings",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardTitle, {
        title: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 9
        }
    }, mfa.getIn(['settings', 'totp']) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_mfa_disable_otp_form__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 13
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_mfa_enable_otp_form__WEBPACK_IMPORTED_MODULE_6__["default"], {
        displayOtpForm: displayOtpForm,
        handleSetupProceedClick: handleSetupProceedClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 15
        }
    }), displayOtpForm && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_mfa_otp_confirm_form__WEBPACK_IMPORTED_MODULE_7__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 34
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (MfaForm);


/***/ })

}]);
//# sourceMappingURL=mfa_form-8f700cf70d4f8e6cd4a7.chunk.js.map