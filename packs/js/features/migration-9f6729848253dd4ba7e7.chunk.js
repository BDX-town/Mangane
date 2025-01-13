"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[54],{

/***/ 1559:
/*!*************************************************!*\
  !*** ./app/soapbox/features/migration/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Migration; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-immutable-pure-component */ 158);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_actions_security__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/security */ 267);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
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
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/migration/index.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }







 // import Column from 'soapbox/features/ui/components/column';

var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.migration",
        "defaultMessage": "Account migration"
    },
    submit: {
        "id": "migration.submit",
        "defaultMessage": "Move followers"
    },
    moveAccountSuccess: {
        "id": "migration.move_account.success",
        "defaultMessage": "Account successfully moved."
    },
    moveAccountFail: {
        "id": "migration.move_account.fail",
        "defaultMessage": "Account migration failed."
    },
    acctFieldLabel: {
        "id": "migration.fields.acct.label",
        "defaultMessage": "Handle of the new account"
    },
    acctFieldPlaceholder: {
        "id": "migration.fields.acct.placeholder",
        "defaultMessage": "username@domain"
    },
    currentPasswordFieldLabel: {
        "id": "migration.fields.confirm_password.label",
        "defaultMessage": "Current password"
    }
});
var Migration = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_4__.connect)(), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Migration, _super);
    function Migration() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            targetAccount: '',
            password: '',
            isLoading: false
        });
        _defineProperty(_this, "handleInputChange", function (e) {
            var _a;
            _this.setState((_a = {},
                _a[e.target.name] = e.target.value,
                _a));
        });
        _defineProperty(_this, "clearForm", function () {
            _this.setState({
                targetAccount: '',
                password: ''
            });
        });
        _defineProperty(_this, "handleSubmit", function (e) {
            var _a = _this.state, targetAccount = _a.targetAccount, password = _a.password;
            var _b = _this.props, dispatch = _b.dispatch, intl = _b.intl;
            _this.setState({
                isLoading: true
            });
            return dispatch((0,soapbox_actions_security__WEBPACK_IMPORTED_MODULE_5__.moveAccount)(targetAccount, password)).then(function () {
                _this.clearForm();
                dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].success(intl.formatMessage(messages.moveAccountSuccess)));
            }).catch(function (error) {
                dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].error(intl.formatMessage(messages.moveAccountFail)));
            }).then(function () {
                _this.setState({
                    isLoading: false
                });
            });
        });
        return _this;
    }
    Migration.prototype.render = function () {
        var intl = this.props.intl;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Column, {
            label: intl.formatMessage(messages.heading),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 64,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Form, {
            onSubmit: this.handleSubmit,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 65,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
            theme: "muted",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 66,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "migration.hint",
            defaultMessage: "This will move your followers to the new account. No other data will be moved. To perform migration, you need to {link} on your new account first.",
            values: {
                link: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.Link, {
                    className: "hover:underline text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-500",
                    to: "/settings/aliases",
                    __self: this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 72,
                        columnNumber: 19
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
                    id: "migration.hint.link",
                    defaultMessage: "create an account alias",
                    __self: this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 76,
                        columnNumber: 21
                    }
                }))
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 67,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.FormGroup, {
            labelText: intl.formatMessage(messages.acctFieldLabel),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 85,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Input, {
            name: "targetAccount",
            placeholder: intl.formatMessage(messages.acctFieldPlaceholder),
            onChange: this.handleInputChange,
            value: this.state.targetAccount,
            required: true,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 88,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.FormGroup, {
            labelText: intl.formatMessage(messages.currentPasswordFieldLabel),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 96,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Input, {
            type: "password",
            name: "password",
            onChange: this.handleInputChange,
            value: this.state.password,
            required: true,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 99,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.FormActions, {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 107,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Button, {
            theme: "primary",
            text: intl.formatMessage(messages.submit),
            onClick: this.handleSubmit,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 108,
                columnNumber: 13
            }
        }))));
    };
    return Migration;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_3__["default"])), _defineProperty(_class2, "propTypes", {
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired)
}), _class2)) || _class) || _class);



/***/ })

}]);
//# sourceMappingURL=migration-9f6729848253dd4ba7e7.chunk.js.map