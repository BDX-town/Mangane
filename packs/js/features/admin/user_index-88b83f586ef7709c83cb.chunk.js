"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[10],{

/***/ 1628:
/*!**************************************************!*\
  !*** ./app/soapbox/features/admin/user_index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ UserIndex; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-pure-component */ 136);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/admin */ 74);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 904);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/containers/account_container */ 135);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/features/forms */ 907);
/* harmony import */ var soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/features/ui/components/column */ 905);
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
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/user_index.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }












var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__.defineMessages)({
    heading: {
        "id": "column.admin.users",
        "defaultMessage": "Users"
    },
    empty: {
        "id": "admin.user_index.empty",
        "defaultMessage": "No users found."
    },
    searchPlaceholder: {
        "id": "admin.user_index.search_input_placeholder",
        "defaultMessage": "Who are you looking for?"
    }
});
var UserIndex = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.connect)(), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(UserIndex, _super);
    function UserIndex() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            isLoading: true,
            filters: (0,immutable__WEBPACK_IMPORTED_MODULE_13__.Set)(['local', 'active']),
            accountIds: (0,immutable__WEBPACK_IMPORTED_MODULE_13__.OrderedSet)(),
            total: Infinity,
            pageSize: 50,
            page: 0,
            query: '',
            nextLink: undefined
        });
        _defineProperty(_this, "clearState", function (callback) {
            _this.setState({
                isLoading: true,
                accountIds: (0,immutable__WEBPACK_IMPORTED_MODULE_13__.OrderedSet)(),
                page: 0
            }, callback);
        });
        _defineProperty(_this, "fetchNextPage", function () {
            var _a = _this.state, filters = _a.filters, page = _a.page, query = _a.query, pageSize = _a.pageSize, nextLink = _a.nextLink;
            var nextPage = page + 1;
            _this.props.dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_6__.fetchUsers)(filters, nextPage, query, pageSize, nextLink)).then(function (_ref) {
                var users = _ref.users, count = _ref.count, next = _ref.next;
                var newIds = users.map(function (user) { return user.id; });
                _this.setState({
                    isLoading: false,
                    accountIds: _this.state.accountIds.union(newIds),
                    total: count,
                    page: nextPage,
                    nextLink: next
                });
            }).catch(function () { });
        });
        _defineProperty(_this, "refresh", function () {
            _this.clearState(function () {
                _this.fetchNextPage();
            });
        });
        _defineProperty(_this, "handleLoadMore", lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(function () {
            _this.fetchNextPage();
        }, 2000, {
            leading: true
        }));
        _defineProperty(_this, "updateQuery", lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(function (query) {
            _this.setState({
                query: query
            });
        }, 900));
        _defineProperty(_this, "handleQueryChange", function (e) {
            _this.updateQuery(e.target.value);
        });
        return _this;
    }
    UserIndex.prototype.componentDidMount = function () {
        this.fetchNextPage();
    };
    UserIndex.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this.state, filters = _a.filters, query = _a.query;
        var filtersChanged = !(0,immutable__WEBPACK_IMPORTED_MODULE_13__.is)(filters, prevState.filters);
        var queryChanged = query !== prevState.query;
        if (filtersChanged || queryChanged) {
            this.refresh();
        }
    };
    UserIndex.prototype.render = function () {
        var _this = this;
        var intl = this.props.intl;
        var _a = this.state, accountIds = _a.accountIds, isLoading = _a.isLoading;
        var hasMore = accountIds.count() < this.state.total && this.state.nextLink !== false;
        var showLoading = isLoading && accountIds.isEmpty();
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_10__["default"], {
            label: intl.formatMessage(messages.heading),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 107,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_9__.SimpleForm, {
            style: {
                paddingBottom: 0
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 108,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_9__.TextInput, {
            onChange: this.handleQueryChange,
            placeholder: intl.formatMessage(messages.searchPlaceholder),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 109,
                columnNumber: 11
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_7__["default"], {
            scrollKey: "user-index",
            hasMore: hasMore,
            isLoading: isLoading,
            showLoading: showLoading,
            onLoadMore: this.handleLoadMore,
            emptyMessage: intl.formatMessage(messages.empty),
            className: "mt-4",
            itemClassName: "pb-4",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 114,
                columnNumber: 9
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_8__["default"], {
            key: id,
            id: id,
            withDate: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 125,
                columnNumber: 13
            }
        }); })));
    };
    return UserIndex;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__["default"])), _defineProperty(_class2, "propTypes", {
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired)
}), _class2)) || _class) || _class);



/***/ })

}]);
//# sourceMappingURL=user_index-88b83f586ef7709c83cb.chunk.js.map