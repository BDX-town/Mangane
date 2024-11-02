"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[61],{

/***/ 1685:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/pinned_accounts_panel.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/containers/account_container */ 155);
/* harmony import */ var soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/ui/containers/bundle_container */ 53);
/* harmony import */ var soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/features/ui/util/async-components */ 42);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/pinned_accounts_panel.tsx";









var PinnedAccountsPanel = function (_ref) {
    var account = _ref.account, limit = _ref.limit;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var pinned = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$user_lists$pin;
        return ((_state$user_lists$pin = state.user_lists.pinned.get(account.id)) === null || _state$user_lists$pin === void 0 ? void 0 : _state$user_lists$pin.items) || (0,immutable__WEBPACK_IMPORTED_MODULE_7__.OrderedSet)();
    }).slice(0, limit);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__.fetchPinnedAccounts)(account.id));
    }, []);
    if (pinned.isEmpty()) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_4__["default"], {
            fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.WhoToFollowPanel,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
                columnNumber: 7
            }
        }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, {
            limit: limit,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
                columnNumber: 23
            }
        }); });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "pinned_accounts.title",
            defaultMessage: "{name}\u2019s choices",
            values: {
                name: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
                    dangerouslySetInnerHTML: {
                        __html: account.display_name_html
                    },
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 41,
                        columnNumber: 17
                    }
                })
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 37,
                columnNumber: 14
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, pinned && pinned.map(function (suggestion) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__["default"], {
        key: suggestion,
        id: suggestion,
        withRelationship: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (PinnedAccountsPanel);


/***/ })

}]);
//# sourceMappingURL=pinned_accounts-15d4e4b73996ae48d09c.chunk.js.map