"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[29],{

/***/ 1469:
/*!********************************************************!*\
  !*** ./app/soapbox/features/direct_timeline/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 27);
/* harmony import */ var soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/streaming */ 85);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/timelines */ 45);
/* harmony import */ var soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/account_search */ 1682);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_timeline__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ui/components/timeline */ 1680);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/direct_timeline/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    title: {
        "id": "column.direct",
        "defaultMessage": "Direct messages"
    },
    searchPlaceholder: {
        "id": "direct.search_placeholder",
        "defaultMessage": "Send a message to\u2026"
    }
});
var DirectTimeline = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var hasUnread = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$timelines$get;
        return (((_state$timelines$get = state.timelines.get('direct')) === null || _state$timelines$get === void 0 ? void 0 : _state$timelines$get.unread) || 0) > 0;
    });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandDirectTimeline)());
        var disconnect = dispatch((0,soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_2__.connectDirectStream)());
        return function () {
            disconnect();
        };
    }, []);
    var handleSuggestion = function (accountId) {
        dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.directComposeById)(accountId));
    };
    var handleLoadMore = function (maxId) {
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandDirectTimeline)({
            maxId: maxId
        }));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
        label: intl.formatMessage(messages.title),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "my-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_4__["default"], {
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        onSelected: handleSuggestion,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_timeline__WEBPACK_IMPORTED_MODULE_7__["default"], {
        scrollKey: "direct_timeline",
        timelineId: "direct",
        onLoadMore: handleLoadMore,
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "empty_column.direct",
            defaultMessage: "You don't have any direct messages yet. When you send or receive one, it will show up here.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 55,
                columnNumber: 23
            }
        }),
        divideType: "space",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (DirectTimeline);


/***/ })

}]);
//# sourceMappingURL=direct_timeline-1138f37b0f62cc558bef.chunk.js.map