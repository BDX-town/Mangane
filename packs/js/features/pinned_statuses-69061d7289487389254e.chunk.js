"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[60],{

/***/ 1567:
/*!********************************************************!*\
  !*** ./app/soapbox/features/pinned_statuses/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_pin_statuses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/pin_statuses */ 996);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1399);
/* harmony import */ var soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/status_list */ 630);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui/components/column */ 963);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/pinned_statuses/index.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    heading: {
        "id": "column.pins",
        "defaultMessage": "Pinned posts"
    }
});
var PinnedStatuses = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var username = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useParams)().username;
    var meUsername = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var _state$accounts$get;
        return ((_state$accounts$get = state.accounts.get(state.me)) === null || _state$accounts$get === void 0 ? void 0 : _state$accounts$get.username) || '';
    });
    var statusIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.status_lists.get('pins').items; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return !!state.status_lists.get('pins').isLoading; });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return !!state.status_lists.get('pins').next; });
    var isMyAccount = username.toLowerCase() === meUsername.toLowerCase();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_pin_statuses__WEBPACK_IMPORTED_MODULE_1__.fetchPinnedStatuses)());
    }, []);
    if (!isMyAccount) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_2__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 34,
                columnNumber: 7
            }
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_5__["default"], {
        label: intl.formatMessage(messages.heading),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        statusIds: statusIds,
        scrollKey: "pinned_statuses",
        hasMore: hasMore,
        isLoading: isLoading,
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "pinned_statuses.none",
            defaultMessage: "No pins to show.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 45,
                columnNumber: 23
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (PinnedStatuses);


/***/ })

}]);
//# sourceMappingURL=pinned_statuses-69061d7289487389254e.chunk.js.map