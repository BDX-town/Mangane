"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[30],{

/***/ 1589:
/*!***************************************************!*\
  !*** ./app/soapbox/features/edit_email/index.tsx ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.promise.finally.js */ 256);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_security__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/security */ 254);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/edit_email/index.tsx";
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
    header: {
        "id": "edit_email.header",
        "defaultMessage": "Change Email"
    },
    updateEmailSuccess: {
        "id": "security.update_email.success",
        "defaultMessage": "Email successfully updated."
    },
    updateEmailFail: {
        "id": "security.update_email.fail",
        "defaultMessage": "Update email failed."
    },
    emailFieldLabel: {
        "id": "security.fields.email.label",
        "defaultMessage": "Email address"
    },
    emailFieldPlaceholder: {
        "id": "edit_email.placeholder",
        "defaultMessage": "me@example.com"
    },
    passwordFieldLabel: {
        "id": "security.fields.password.label",
        "defaultMessage": "Password"
    },
    submit: {
        "id": "security.submit",
        "defaultMessage": "Save changes"
    },
    cancel: {
        "id": "common.cancel",
        "defaultMessage": "Cancel"
    },
    description: {
        "id": "edit_email.description",
        "defaultMessage": "To change your email, you must re-enter your password"
    }
});
var initialState = {
    email: '',
    password: ''
};
var EditEmail = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var _a = react__WEBPACK_IMPORTED_MODULE_2__.useState(initialState), state = _a[0], setState = _a[1];
    var _b = react__WEBPACK_IMPORTED_MODULE_2__.useState(false), isLoading = _b[0], setLoading = _b[1];
    var email = state.email, password = state.password;
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
        dispatch((0,soapbox_actions_security__WEBPACK_IMPORTED_MODULE_3__.changeEmail)(email, password)).then(function () {
            setState(initialState);
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(intl.formatMessage(messages.updateEmailSuccess)));
        }).finally(function () {
            setLoading(false);
        }).catch(function (msg) {
            console.error(msg);
            setState(function (prevState) { return _objectSpread(_objectSpread({}, prevState), {}, {
                password: ''
            }); });
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].error("".concat(intl.formatMessage(messages.updateEmailFail), ": ").concat(msg)));
        });
    }, [email, password, dispatch, intl]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
        label: intl.formatMessage(messages.header),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Card, {
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.CardHeader, {
        backHref: "/settings",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.CardTitle, {
        title: intl.formatMessage(messages.header),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("p", {
        className: "mb-2 text-gray-600 dark:text-gray-300",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.description)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormGroup, {
        labelText: intl.formatMessage(messages.emailFieldLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
        type: "text",
        placeholder: intl.formatMessage(messages.emailFieldPlaceholder),
        name: "email",
        autoComplete: "off",
        onChange: handleInputChange,
        value: email,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormGroup, {
        labelText: intl.formatMessage(messages.passwordFieldLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
        type: "password",
        name: "password",
        onChange: handleInputChange,
        value: password,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        to: "/settings",
        theme: "ghost",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 15
        }
    }, intl.formatMessage(messages.cancel)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        type: "submit",
        theme: "primary",
        disabled: isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 15
        }
    }, intl.formatMessage(messages.submit)))))));
};
/* harmony default export */ __webpack_exports__["default"] = (EditEmail);


/***/ })

}]);
//# sourceMappingURL=edit_email-8ac0ee33da0a2758b510.chunk.js.map