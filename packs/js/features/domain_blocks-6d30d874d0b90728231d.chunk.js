"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[31],{

/***/ 1834:
/*!*******************************************!*\
  !*** ./app/soapbox/components/domain.tsx ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_domain_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/domain_blocks */ 203);
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./icon */ 25);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/domain.tsx";






var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    unblockDomain: {
        "id": "account.unblock_domain",
        "defaultMessage": "Unhide {domain}"
    }
});
var Domain = function (_ref) {
    var domain = _ref.domain;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var handleDomainUnblock = function () {
        dispatch((0,soapbox_actions_domain_blocks__WEBPACK_IMPORTED_MODULE_2__.unblockDomain)(domain));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "domain",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "domain__wrapper flex justify-between items-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex gap-1 items-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: __webpack_require__(/*! @tabler/icons/world.svg */ 199),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", {
        className: "text-gray-700 dark:text-white",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 11
        }
    }, domain)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "domain__buttons",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        theme: "ghost",
        onClick: handleDomainUnblock,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex gap-1 items-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: __webpack_require__(/*! @tabler/icons/lock-open.svg */ 940),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 15
        }
    }, intl.formatMessage(messages.unblockDomain)))))));
};
/* harmony default export */ __webpack_exports__["default"] = (Domain);


/***/ }),

/***/ 1624:
/*!******************************************************!*\
  !*** ./app/soapbox/features/domain_blocks/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_domain_blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/domain_blocks */ 203);
/* harmony import */ var soapbox_components_domain__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/domain */ 1834);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 843);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ui/components/column */ 844);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/domain_blocks/index.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    heading: {
        "id": "column.domain_blocks",
        "defaultMessage": "Hidden domains"
    },
    unblockDomain: {
        "id": "account.unblock_domain",
        "defaultMessage": "Unhide {domain}"
    }
});
var handleLoadMore = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function (dispatch) {
    dispatch((0,soapbox_actions_domain_blocks__WEBPACK_IMPORTED_MODULE_3__.expandDomainBlocks)());
}, 300, {
    leading: true
});
var DomainBlocks = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var domains = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.domain_lists.blocks.items; });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return !!state.domain_lists.blocks.next; });
    var loading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.domain_lists.blocks.isLoading; });
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        dispatch((0,soapbox_actions_domain_blocks__WEBPACK_IMPORTED_MODULE_3__.fetchDomainBlocks)());
    }, []);
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "empty_column.domain_blocks",
        defaultMessage: "There are no hidden domains yet.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_8__["default"], {
        icon: "minus-circle",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_5__["default"], {
        scrollKey: "domain_blocks",
        onLoadMore: function () { return handleLoadMore(dispatch); },
        hasMore: hasMore,
        emptyMessage: emptyMessage,
        itemClassName: "flex flex-col gap-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }, domains.map(function (domain) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "rounded p-1 bg-gray-100 dark:bg-slate-900",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_domain__WEBPACK_IMPORTED_MODULE_4__["default"], {
        key: domain,
        domain: domain,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 13
        }
    })); }), loading && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 22
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (DomainBlocks);


/***/ })

}]);
//# sourceMappingURL=domain_blocks-6d30d874d0b90728231d.chunk.js.map