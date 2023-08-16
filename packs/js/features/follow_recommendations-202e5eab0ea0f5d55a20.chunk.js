"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[42],{

/***/ 2077:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/who-to-follow-panel.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/suggestions */ 467);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/containers/account_container */ 266);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/who-to-follow-panel.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    dismissSuggestion: {
        "id": "suggestions.dismiss",
        "defaultMessage": "Dismiss suggestion"
    }
});
var WhoToFollowPanel = function (_ref) {
    var limit = _ref.limit;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var suggestions = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.suggestions.items; });
    var suggestionsToRender = suggestions.slice(0, limit);
    var handleDismiss = function (account) {
        dispatch((0,soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__.dismissSuggestion)(account.id));
    };
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
        dispatch((0,soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__.fetchSuggestions)());
    }, []);
    if (suggestionsToRender.isEmpty()) {
        return null;
    } // FIXME: This page actually doesn't look good right now
    // const handleAction = () => {
    //   history.push('/suggestions');
    // };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "who_to_follow.title",
            defaultMessage: "People To Follow",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 46,
                columnNumber: 14
            }
        }) // onAction={handleAction}
        ,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 5
        }
    }, suggestionsToRender.map(function (suggestion) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_4__["default"], {
        key: suggestion.account // @ts-ignore: TS thinks `id` is passed to <Account>, but it isn't
        ,
        id: suggestion.account,
        actionIcon: __webpack_require__(/*! @tabler/icons/x.svg */ 56),
        actionTitle: intl.formatMessage(messages.dismissSuggestion),
        onActionClick: handleDismiss,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (WhoToFollowPanel);


/***/ })

}]);
//# sourceMappingURL=follow_recommendations-202e5eab0ea0f5d55a20.chunk.js.map