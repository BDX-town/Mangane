"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[210],{

/***/ 2095:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/ui/components/mute_modal.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_toggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-toggle */ 1498);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_mutes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/mutes */ 252);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/mute_modal.tsx";









var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetAccount)();
var MuteModal = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return getAccount(state, state.mutes.new.accountId); });
    var notifications = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.mutes.new.notifications; });
    if (!account)
        return null;
    var handleClick = function () {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.closeModal)());
        dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__.muteAccount)(account.id, notifications));
    };
    var handleCancel = function () {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.closeModal)());
    };
    var toggleNotifications = function () {
        dispatch((0,soapbox_actions_mutes__WEBPACK_IMPORTED_MODULE_4__.toggleHideNotifications)());
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "confirmations.mute.heading",
            defaultMessage: "Mute @{name}",
            values: {
                name: account.acct
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 38,
                columnNumber: 9
            }
        }),
        onClose: handleCancel,
        confirmationAction: handleClick,
        confirmationText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "confirmations.mute.confirm",
            defaultMessage: "Mute",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 46,
                columnNumber: 25
            }
        }),
        cancelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "confirmation_modal.cancel",
            defaultMessage: "Cancel",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 19
            }
        }),
        cancelAction: handleCancel,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "confirmations.mute.message",
        defaultMessage: "Are you sure you want to mute {name}?",
        values: {
            name: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 55,
                    columnNumber: 29
                }
            }, "@", account.acct)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        alignItems: "center",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        tag: "span",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "mute_modal.hide_notifications",
        defaultMessage: "Hide notifications from this user?",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_1__["default"], {
        checked: notifications,
        onChange: toggleNotifications,
        icons: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (MuteModal);


/***/ })

}]);
//# sourceMappingURL=mute_modal-8ec026ab2fc45bfb9280.chunk.js.map