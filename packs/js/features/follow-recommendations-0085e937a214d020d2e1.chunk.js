"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[41],{

/***/ 1570:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/follow-recommendations/index.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/suggestions */ 426);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 874);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/account_container */ 150);
/* harmony import */ var soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/ui/components/column */ 875);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/follow-recommendations/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "followRecommendations.heading",
        "defaultMessage": "Suggested profiles"
    }
});
var FollowRecommendations = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useFeatures)();
    var suggestions = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.suggestions.items; });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return !!state.suggestions.next; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.suggestions.isLoading; });
    var handleLoadMore = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function () {
        if (isLoading) {
            return null;
        }
        return dispatch((0,soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__.fetchSuggestions)({
            limit: 20
        }));
    }, 300);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__.fetchSuggestions)({
            limit: 20
        }));
    }, []);
    if (suggestions.size === 0 && !isLoading) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_6__["default"], {
            label: intl.formatMessage(messages.heading),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 39,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
            align: "center",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 40,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "empty_column.follow_recommendations",
            defaultMessage: "Looks like no suggestions could be generated for you. You can try using search to look for people you might know or explore trending hashtags.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 41,
                columnNumber: 11
            }
        })));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_6__["default"], {
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        isLoading: isLoading,
        scrollKey: "suggestions",
        onLoadMore: handleLoadMore,
        hasMore: hasMore,
        itemClassName: "pb-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 9
        }
    }, features.truthSuggestions ? suggestions.map(function (suggestedProfile) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: suggestedProfile.account,
        id: suggestedProfile.account,
        withAccountNote: true,
        showProfileHoverCard: false,
        actionAlignment: "top",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 15
        }
    }); }) : suggestions.map(function (suggestion) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: suggestion.account,
        id: suggestion.account,
        withAccountNote: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 15
        }
    }); }))));
};
/* harmony default export */ __webpack_exports__["default"] = (FollowRecommendations);


/***/ })

}]);
//# sourceMappingURL=follow-recommendations-0085e937a214d020d2e1.chunk.js.map