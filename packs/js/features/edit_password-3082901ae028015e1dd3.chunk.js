"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[31],{

/***/ 1519:
/*!******************************************************!*\
  !*** ./app/soapbox/features/edit_password/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.promise.finally.js */ 269);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/auth */ 35);
/* harmony import */ var soapbox_actions_security__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/security */ 267);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _verification_components_password_indicator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../verification/components/password-indicator */ 667);
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
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/edit_password/index.tsx";
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










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    updatePasswordSuccess: {
        "id": "security.update_password.success",
        "defaultMessage": "Password successfully updated."
    },
    updatePasswordFail: {
        "id": "security.update_password.fail",
        "defaultMessage": "Update password failed."
    },
    oldPasswordFieldLabel: {
        "id": "security.fields.old_password.label",
        "defaultMessage": "Current password"
    },
    newPasswordFieldLabel: {
        "id": "security.fields.new_password.label",
        "defaultMessage": "New password"
    },
    confirmationFieldLabel: {
        "id": "security.fields.password_confirmation.label",
        "defaultMessage": "New password (again)"
    },
    header: {
        "id": "edit_password.header",
        "defaultMessage": "Change Password"
    },
    submit: {
        "id": "security.submit",
        "defaultMessage": "Save changes"
    },
    cancel: {
        "id": "common.cancel",
        "defaultMessage": "Cancel"
    }
});
var initialState = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
};
var EditPassword = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var passwordRequirements = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useFeatures)().passwordRequirements;
    var _a = react__WEBPACK_IMPORTED_MODULE_2__.useState(initialState), state = _a[0], setState = _a[1];
    var _b = react__WEBPACK_IMPORTED_MODULE_2__.useState(false), isLoading = _b[0], setLoading = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_2__.useState(passwordRequirements ? false : true), hasValidPassword = _c[0], setHasValidPassword = _c[1];
    var currentPassword = state.currentPassword, newPassword = state.newPassword, newPasswordConfirmation = state.newPasswordConfirmation;
    var resetState = function () { return setState(initialState); };
    var handleInputChange = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(function (event) {
        event.persist();
        setState(function (prevState) {
            var _a;
            return _objectSpread(_objectSpread({}, prevState), {}, (_a = {},
                _a[event.target.name] = event.target.value,
                _a));
        });
    }, []);
    var handleSubmit = react__WEBPACK_IMPORTED_MODULE_2__.useCallback(function () {
        setLoading(true);
        dispatch((0,soapbox_actions_security__WEBPACK_IMPORTED_MODULE_4__.changePassword)(currentPassword, newPassword, newPasswordConfirmation)).then(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resetState();
                        return [4 /*yield*/, dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_5__["default"].success(intl.formatMessage(messages.updatePasswordSuccess)))];
                    case 1:
                        _a.sent();
                        dispatch((0,soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_3__.logOut)());
                        return [2 /*return*/];
                }
            });
        }); }).finally(function () {
            setLoading(false);
        }).catch(function () {
            resetState();
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_5__["default"].error(intl.formatMessage(messages.updatePasswordFail)));
        });
    }, [currentPassword, newPassword, newPasswordConfirmation, dispatch, intl]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Column, {
        label: intl.formatMessage(messages.header),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Card, {
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardHeader, {
        backHref: "/settings",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardTitle, {
        title: intl.formatMessage(messages.header),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: intl.formatMessage(messages.oldPasswordFieldLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Input, {
        type: "password",
        name: "currentPassword",
        onChange: handleInputChange,
        value: currentPassword,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: intl.formatMessage(messages.newPasswordFieldLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Input, {
        type: "password",
        name: "newPassword",
        onChange: handleInputChange,
        value: newPassword,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 15
        }
    }), passwordRequirements && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_verification_components_password_indicator__WEBPACK_IMPORTED_MODULE_8__["default"], {
        password: newPassword,
        onChange: setHasValidPassword,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: intl.formatMessage(messages.confirmationFieldLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Input, {
        type: "password",
        name: "newPasswordConfirmation",
        onChange: handleInputChange,
        value: newPasswordConfirmation,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 99,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        to: "/settings",
        theme: "ghost",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 15
        }
    }, intl.formatMessage(messages.cancel)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        type: "submit",
        theme: "primary",
        disabled: isLoading || !hasValidPassword,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 15
        }
    }, intl.formatMessage(messages.submit)))))));
};
/* harmony default export */ __webpack_exports__["default"] = (EditPassword);


/***/ })

}]);
//# sourceMappingURL=edit_password-3082901ae028015e1dd3.chunk.js.map