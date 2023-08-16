"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[77],{

/***/ 2089:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/verification/waitlist_page.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ 28);
/* harmony import */ var soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/auth */ 32);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_landing_gradient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/landing-gradient */ 368);
/* harmony import */ var soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/site-logo */ 358);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/verification/waitlist_page.tsx";









var WaitlistPage = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var title = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.instance.title; });
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useOwnAccount)();
    var isSmsVerified = me === null || me === void 0 ? void 0 : me.source.get('sms_verified');
    var onClickLogOut = function (event) {
        event.preventDefault();
        dispatch((0,soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_2__.logOut)());
    };
    var openVerifySmsModal = function () { return dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('VERIFY_SMS')); };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        if (!isSmsVerified) {
            openVerifySmsModal();
        }
    }, []);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_landing_gradient__WEBPACK_IMPORTED_MODULE_4__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("main", {
        className: "relative flex flex-col h-screen max-w-7xl mx-auto px-2 sm:px-6 lg:px-8",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("header", {
        className: "relative flex justify-between h-16",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-1 flex items-stretch justify-center relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_8__.Link, {
        to: "/",
        className: "cursor-pointer flex-shrink-0 flex items-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_5__["default"], {
        alt: "Logo",
        className: "h-7",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "absolute inset-y-0 right-0 flex items-center pr-2 space-x-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        onClick: onClickLogOut,
        theme: "primary",
        to: "/logout",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 15
        }
    }, "Sign out")))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "-mt-16 flex flex-col justify-center items-center h-full",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "max-w-xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
        src: "/instance/images/waitlist.png",
        className: "mx-auto w-32 h-32",
        alt: "Waitlisted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        size: "lg",
        theme: "muted",
        align: "center",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 17
        }
    }, "Welcome back to ", title, "! You were previously placed on our waitlist. Please verify your phone number to receive immediate access to your account!"), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "text-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        onClick: openVerifySmsModal,
        theme: "primary",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 19
        }
    }, "Verify phone number"))))))));
};
/* harmony default export */ __webpack_exports__["default"] = (WaitlistPage);


/***/ })

}]);
//# sourceMappingURL=verification-ebf160e750d86085606a.chunk.js.map