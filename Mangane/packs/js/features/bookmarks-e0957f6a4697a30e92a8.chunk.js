"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[19],{

/***/ 1574:
/*!**************************************************!*\
  !*** ./app/soapbox/features/bookmarks/index.tsx ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 45);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_bookmarks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/bookmarks */ 1038);
/* harmony import */ var soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/pull-to-refresh */ 416);
/* harmony import */ var soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/status_list */ 920);
/* harmony import */ var soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/sub_navigation */ 917);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/bookmarks/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.bookmarks",
        "defaultMessage": "Bookmarks"
    }
});
var handleLoadMore = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function (dispatch) {
    dispatch((0,soapbox_actions_bookmarks__WEBPACK_IMPORTED_MODULE_2__.expandBookmarkedStatuses)());
}, 300, {
    leading: true
});
var Bookmarks = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var statusIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.status_lists.get('bookmarks').items; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.status_lists.get('bookmarks').isLoading; });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return !!state.status_lists.get('bookmarks').next; });
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        dispatch((0,soapbox_actions_bookmarks__WEBPACK_IMPORTED_MODULE_2__.fetchBookmarkedStatuses)());
    }, []);
    var handleRefresh = function () {
        return dispatch((0,soapbox_actions_bookmarks__WEBPACK_IMPORTED_MODULE_2__.fetchBookmarkedStatuses)());
    };
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "empty_column.bookmarks",
        defaultMessage: "You don't have any bookmarks yet. When you add one, it will show up here.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Column, {
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "px-4 pt-4 sm:p-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_5__["default"], {
        message: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_3__["default"], {
        onRefresh: handleRefresh,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_4__["default"], {
        statusIds: statusIds,
        scrollKey: "bookmarked_statuses",
        hasMore: hasMore,
        isLoading: typeof isLoading === 'boolean' ? isLoading : true,
        onLoadMore: function () { return handleLoadMore(dispatch); },
        emptyMessage: emptyMessage,
        divideType: "space",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Bookmarks);


/***/ })

}]);
//# sourceMappingURL=bookmarks-e0957f6a4697a30e92a8.chunk.js.map