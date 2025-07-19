"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[16],{

/***/ 1563:
/*!***********************************************!*\
  !*** ./app/soapbox/features/blocks/index.tsx ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/blocks */ 909);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 726);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/containers/account_container */ 130);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/blocks/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.blocks",
        "defaultMessage": "Blocked users"
    }
});
var handleLoadMore = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function (dispatch) {
    dispatch((0,soapbox_actions_blocks__WEBPACK_IMPORTED_MODULE_3__.expandBlocks)());
}, 300, {
    leading: true
});
var Blocks = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.user_lists.blocks.items; });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return !!state.user_lists.blocks.next; });
    var loading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.user_lists.blocks.isLoading; });
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        dispatch((0,soapbox_actions_blocks__WEBPACK_IMPORTED_MODULE_3__.fetchBlocks)());
    }, []);
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "empty_column.blocks",
        defaultMessage: "You haven't blocked any users yet.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_4__["default"], {
        scrollKey: "blocks",
        onLoadMore: function () { return handleLoadMore(dispatch); },
        hasMore: hasMore,
        emptyMessage: emptyMessage,
        itemClassName: "flex flex-col gap-3 pb-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 7
        }
    }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_6__["default"], {
        key: id,
        id: id,
        actionType: "blocking",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 11
        }
    }); }), loading && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 22
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Blocks);


/***/ })

}]);
//# sourceMappingURL=blocks-72834ba1b642d2f20de8.chunk.js.map