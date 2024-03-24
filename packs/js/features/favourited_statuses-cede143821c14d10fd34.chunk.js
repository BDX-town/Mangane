"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[38],{

/***/ 2091:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/favourited_statuses/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Favourites; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/debounce */ 168);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-proptypes */ 276);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-immutable-pure-component */ 244);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 178);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_favourites__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/actions/favourites */ 1604);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1920);
/* harmony import */ var soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/status_list */ 1504);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../ui/components/column */ 1566);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/favourited_statuses/index.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }















var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_15__.defineMessages)({
    heading: {
        "id": "column.favourited_statuses",
        "defaultMessage": "Liked posts"
    }
});
var mapStateToProps = function (state, _ref) {
    var _state$status_lists$g, _state$status_lists$g2, _state$status_lists$g3;
    var params = _ref.params;
    var username = params.username || '';
    var me = state.get('me');
    var meUsername = state.getIn(['accounts', me, 'username'], '');
    var isMyAccount = username.toLowerCase() === meUsername.toLowerCase();
    var features = (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_13__.getFeatures)(state.get('instance'));
    if (isMyAccount) {
        return {
            isMyAccount: isMyAccount,
            statusIds: state.status_lists.get('favourites').items,
            isLoading: state.status_lists.get('favourites').isLoading,
            hasMore: !!state.status_lists.get('favourites').next
        };
    }
    var accountFetchError = (state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase();
    var accountId = -1;
    if (accountFetchError) {
        accountId = null;
    }
    else {
        var account = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_12__.findAccountByUsername)(state, username);
        accountId = account ? account.getIn(['id'], null) : -1;
    }
    var isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
    var unavailable = me === accountId ? false : isBlocked && !features.blockersVisible;
    return {
        isMyAccount: isMyAccount,
        accountId: accountId,
        unavailable: unavailable,
        username: username,
        isAccount: !!state.getIn(['accounts', accountId]),
        statusIds: ((_state$status_lists$g = state.status_lists.get("favourites:".concat(accountId))) === null || _state$status_lists$g === void 0 ? void 0 : _state$status_lists$g.items) || [],
        isLoading: (_state$status_lists$g2 = state.status_lists.get("favourites:".concat(accountId))) === null || _state$status_lists$g2 === void 0 ? void 0 : _state$status_lists$g2.isLoading,
        hasMore: !!((_state$status_lists$g3 = state.status_lists.get("favourites:".concat(accountId))) !== null && _state$status_lists$g3 !== void 0 && _state$status_lists$g3.next)
    };
};
var Favourites = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_16__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Favourites, _super);
    function Favourites() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "handleLoadMore", lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(function () {
            var _a = _this.props, accountId = _a.accountId, isMyAccount = _a.isMyAccount;
            if (isMyAccount) {
                _this.props.dispatch((0,soapbox_actions_favourites__WEBPACK_IMPORTED_MODULE_8__.expandFavouritedStatuses)());
            }
            else {
                _this.props.dispatch((0,soapbox_actions_favourites__WEBPACK_IMPORTED_MODULE_8__.expandAccountFavouritedStatuses)(accountId));
            }
        }, 300, {
            leading: true
        }));
        return _this;
    }
    Favourites.prototype.componentDidMount = function () {
        var _a = this.props, accountId = _a.accountId, isMyAccount = _a.isMyAccount, username = _a.username;
        if (isMyAccount)
            this.props.dispatch((0,soapbox_actions_favourites__WEBPACK_IMPORTED_MODULE_8__.fetchFavouritedStatuses)());
        else {
            if (accountId && accountId !== -1) {
                this.props.dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchAccount)(accountId));
                this.props.dispatch((0,soapbox_actions_favourites__WEBPACK_IMPORTED_MODULE_8__.fetchAccountFavouritedStatuses)(accountId));
            }
            else {
                this.props.dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchAccountByUsername)(username));
            }
        }
    };
    Favourites.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, accountId = _a.accountId, isMyAccount = _a.isMyAccount;
        if (!isMyAccount && accountId && accountId !== -1 && accountId !== prevProps.accountId && accountId) {
            this.props.dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchAccount)(accountId));
            this.props.dispatch((0,soapbox_actions_favourites__WEBPACK_IMPORTED_MODULE_8__.fetchAccountFavouritedStatuses)(accountId));
        }
    };
    Favourites.prototype.render = function () {
        var _a = this.props, intl = _a.intl, statusIds = _a.statusIds, isLoading = _a.isLoading, hasMore = _a.hasMore, isMyAccount = _a.isMyAccount, isAccount = _a.isAccount, accountId = _a.accountId, unavailable = _a.unavailable;
        if (!isMyAccount && !isAccount && accountId !== -1) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_9__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 118,
                    columnNumber: 9
                }
            });
        }
        if (accountId === -1) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_14__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 124,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_11__.Spinner, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 125,
                    columnNumber: 11
                }
            }));
        }
        if (unavailable) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_14__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 132,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                className: "empty-column-indicator",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 133,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
                id: "empty_column.account_unavailable",
                defaultMessage: "Profile unavailable",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 134,
                    columnNumber: 13
                }
            })));
        }
        var emptyMessage = isMyAccount ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "empty_column.favourited_statuses",
            defaultMessage: "You don't have any liked posts yet. When you like one, it will show up here.",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 141,
                columnNumber: 9
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "empty_column.account_favourited_statuses",
            defaultMessage: "This user doesn't have any liked posts yet.",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 142,
                columnNumber: 9
            }
        });
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_14__["default"], {
            label: intl.formatMessage(messages.heading),
            withHeader: false,
            transparent: true,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 145,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_status_list__WEBPACK_IMPORTED_MODULE_10__["default"], {
            statusIds: statusIds,
            scrollKey: "favourited_statuses",
            hasMore: hasMore,
            isLoading: typeof isLoading === 'boolean' ? isLoading : true,
            onLoadMore: this.handleLoadMore,
            emptyMessage: emptyMessage,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 146,
                columnNumber: 9
            }
        }));
    };
    return Favourites;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__["default"])), _defineProperty(_class2, "propTypes", {
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
    statusIds: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().orderedSet.isRequired),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
    hasMore: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    isLoading: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    isMyAccount: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool.isRequired)
}), _class2)) || _class) || _class);



/***/ }),

/***/ 2151:
/*!*******************************************************!*\
  !*** ./app/soapbox/features/profile_fields/index.tsx ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1920);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/ui/containers/bundle_container */ 180);
/* harmony import */ var soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/features/ui/util/async-components */ 167);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/profile_fields/index.tsx";










var ProfileFields = function () {
    var username = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useParams)().username;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var account = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.findAccountByUsername)(state, username);
        if (!account) {
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__.fetchAccountByUsername)(username));
        }
        return account;
    });
    var isAccount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return !!state.getIn(['accounts', account === null || account === void 0 ? void 0 : account.id]); });
    if (!isAccount) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_2__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 34,
                columnNumber: 7
            }
        });
    }
    return account.fields.isEmpty() ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mt-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        variant: "rounded",
        size: "lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "account.no_fields",
        defaultMessage: "This section is empty for now.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 11
        }
    }))) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_4__["default"], {
        fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ProfileFieldsPanel,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 7
        }
    }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 23
        }
    }); });
};
/* harmony default export */ __webpack_exports__["default"] = (ProfileFields);


/***/ })

}]);
//# sourceMappingURL=favourited_statuses-cede143821c14d10fd34.chunk.js.map