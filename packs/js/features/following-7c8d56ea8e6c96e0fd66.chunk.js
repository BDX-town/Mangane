"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[45],{

/***/ 2088:
/*!*************************************************!*\
  !*** ./app/soapbox/features/following/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Following; }
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
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-intl */ 178);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1920);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1565);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/containers/account_container */ 243);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/utils/accounts */ 222);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../ui/components/column */ 1566);
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
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/following/index.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }
















var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_16__.defineMessages)({
    heading: {
        "id": "column.following",
        "defaultMessage": "Following"
    }
});
var mapStateToProps = function (state, _ref) {
    var _state$user_lists$fol, _state$user_lists$fol2;
    var params = _ref.params, _a = _ref.withReplies, withReplies = _a === void 0 ? false : _a;
    var username = params.username || '';
    var me = state.get('me');
    var accountFetchError = (state.getIn(['accounts', -1, 'username']) || '').toLowerCase() === username.toLowerCase();
    var features = (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_14__.getFeatures)(state.get('instance'));
    var accountId = -1;
    if (accountFetchError) {
        accountId = null;
    }
    else {
        var account = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_12__.findAccountByUsername)(state, username);
        accountId = account ? account.getIn(['id'], null) : -1;
    }
    var diffCount = (0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_13__.getFollowDifference)(state, accountId, 'following');
    var isBlocked = state.getIn(['relationships', accountId, 'blocked_by'], false);
    var unavailable = me === accountId ? false : isBlocked && !features.blockersVisible;
    return {
        accountId: accountId,
        unavailable: unavailable,
        isAccount: !!state.getIn(['accounts', accountId]),
        accountIds: (_state$user_lists$fol = state.user_lists.following.get(accountId)) === null || _state$user_lists$fol === void 0 ? void 0 : _state$user_lists$fol.items,
        hasMore: !!((_state$user_lists$fol2 = state.user_lists.following.get(accountId)) !== null && _state$user_lists$fol2 !== void 0 && _state$user_lists$fol2.next),
        diffCount: diffCount
    };
};
var Following = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_17__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Following, _super);
    function Following() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "handleLoadMore", lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(function () {
            if (_this.props.accountId && _this.props.accountId !== -1) {
                _this.props.dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.expandFollowing)(_this.props.accountId));
            }
        }, 300, {
            leading: true
        }));
        return _this;
    }
    Following.prototype.componentDidMount = function () {
        var _a = this.props, username = _a.params.username, accountId = _a.accountId;
        if (accountId && accountId !== -1) {
            this.props.dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchAccount)(accountId));
            this.props.dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchFollowing)(accountId));
        }
        else {
            this.props.dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchAccountByUsername)(username));
        }
    };
    Following.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, accountId = _a.accountId, dispatch = _a.dispatch;
        if (accountId && accountId !== -1 && accountId !== prevProps.accountId && accountId) {
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchAccount)(accountId));
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_7__.fetchFollowing)(accountId));
        }
    };
    Following.prototype.render = function () {
        var _this = this;
        var _a = this.props, intl = _a.intl, accountIds = _a.accountIds, hasMore = _a.hasMore, isAccount = _a.isAccount, diffCount = _a.diffCount, accountId = _a.accountId, unavailable = _a.unavailable;
        if (!isAccount && accountId !== -1) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_8__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 102,
                    columnNumber: 9
                }
            });
        }
        if (accountId === -1 || !accountIds) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Spinner, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 108,
                    columnNumber: 9
                }
            });
        }
        if (unavailable) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                className: "empty-column-indicator",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 114,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_18__["default"], {
                id: "empty_column.account_unavailable",
                defaultMessage: "Profile unavailable",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 115,
                    columnNumber: 11
                }
            }));
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_15__["default"], {
            label: intl.formatMessage(messages.heading),
            transparent: true,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 121,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_9__["default"], {
            scrollKey: "following",
            hasMore: hasMore,
            diffCount: diffCount,
            onLoadMore: this.handleLoadMore,
            emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_18__["default"], {
                id: "account.follows.empty",
                defaultMessage: "This user doesn't follow anyone yet.",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 127,
                    columnNumber: 25
                }
            }),
            itemClassName: "pb-4",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 122,
                columnNumber: 9
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_11__["default"], {
            key: id,
            id: id,
            withNote: false,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 131,
                columnNumber: 13
            }
        }); })));
    };
    return Following;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__["default"])), _defineProperty(_class2, "propTypes", {
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
    params: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
    accountIds: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().orderedSet),
    hasMore: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    isAccount: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    unavailable: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    diffCount: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number)
}), _class2)) || _class) || _class);



/***/ })

}]);
//# sourceMappingURL=following-7c8d56ea8e6c96e0fd66.chunk.js.map