"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[76],{

/***/ 1513:
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/modals/landing-page-modal.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/site-logo */ 421);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modals/landing-page-modal.tsx";






var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    download: {
        "id": "landing_page_modal.download",
        "defaultMessage": "Download"
    },
    helpCenter: {
        "id": "landing_page_modal.helpCenter",
        "defaultMessage": "Help Center"
    },
    login: {
        "id": "header.login.label",
        "defaultMessage": "Log in"
    },
    register: {
        "id": "header.register.label",
        "defaultMessage": "Register"
    }
});
/** Login and links to display from the hamburger menu of the homepage. */
var LandingPageModal = function (_ref) {
    var onClose = _ref.onClose;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var soapboxConfig = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useSoapboxConfig)();
    var pepeEnabled = soapboxConfig.getIn(['extensions', 'pepe', 'enabled']) === true;
    var links = soapboxConfig.links;
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.instance; });
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useFeatures)();
    var isOpen = features.accountCreation && instance.registrations;
    var pepeOpen = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.verification.instance.get('registrations') === true; });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_2__["default"], {
            alt: "Logo",
            className: "h-6 w-auto cursor-pointer",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 36,
                columnNumber: 14
            }
        }),
        onClose: function () { return onClose('LANDING_PAGE'); },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mt-4 divide-y divide-solid divide-gray-200 dark:divide-slate-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 7
        }
    }, links.get('help') && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("nav", {
        className: "grid gap-y-8 mb-6",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
        href: links.get('help'),
        target: "_blank",
        className: "p-3 space-x-3 flex items-center rounded-md dark:hover:bg-slate-900/50 hover:bg-gray-50",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Icon, {
        src: __webpack_require__(/*! @tabler/icons/lifebuoy.svg */ 1854),
        className: "flex-shrink-0 h-6 w-6 text-gray-600 dark:text-gray-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 15
        }
    }, intl.formatMessage(messages.helpCenter)))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('pt-6 grid gap-4', {
            'grid-cols-2': isOpen,
            'grid-cols-1': !isOpen
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        to: "/login",
        theme: "secondary",
        block: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.login)), (isOpen || pepeEnabled && pepeOpen) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Button, {
        to: "/signup",
        theme: "primary",
        block: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 13
        }
    }, intl.formatMessage(messages.register)))));
};
/* harmony default export */ __webpack_exports__["default"] = (LandingPageModal);


/***/ }),

/***/ 1854:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/lifebuoy.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/lifebuoy-eb781501.svg";

/***/ })

}]);
//# sourceMappingURL=landing-page-modal-d2390f3ef978e12e3d97.chunk.js.map