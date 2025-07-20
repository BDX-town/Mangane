"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[14],{

/***/ 2114:
/*!********************************************************!*\
  !*** ./app/soapbox/features/auth_token_list/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_actions_security__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/security */ 357);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/auth_token_list/index.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    header: {
        "id": "security.headers.tokens",
        "defaultMessage": "Sessions"
    },
    revoke: {
        "id": "security.tokens.revoke",
        "defaultMessage": "Revoke"
    }
});
var AuthToken = function (_ref) {
    var token = _ref.token;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var handleRevoke = function () {
        dispatch((0,soapbox_actions_security__WEBPACK_IMPORTED_MODULE_1__.revokeOAuthTokenById)(token.id));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "p-4 rounded-lg bg-gray-100 dark:bg-slate-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        size: "md",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 11
        }
    }, token.app_name), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        size: "sm",
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__.FormattedDate, {
        value: new Date(token.valid_until),
        hour12: false,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex justify-end",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
        theme: "primary",
        onClick: handleRevoke,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.revoke)))));
};
var AuthTokenList = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var tokens = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.security.get('tokens').reverse(); });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_security__WEBPACK_IMPORTED_MODULE_1__.fetchOAuthTokens)());
    }, []);
    var body = tokens ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 5
        }
    }, tokens.map(function (token) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(AuthToken, {
        key: token.id,
        token: token,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 9
        }
    }); })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 7
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Column, {
        label: intl.formatMessage(messages.header),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Card, {
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
        backHref: "/settings",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardTitle, {
        title: intl.formatMessage(messages.header),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 9
        }
    }, body)));
};
/* harmony default export */ __webpack_exports__["default"] = (AuthTokenList);


/***/ })

}]);
//# sourceMappingURL=auth_token_list-bf558c61f6801874e15c.chunk.js.map