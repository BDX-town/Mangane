"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[41],{

/***/ 1675:
/*!*******************************************************************************!*\
  !*** ./app/soapbox/features/follow_requests/components/account_authorize.tsx ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/avatar */ 402);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/display-name */ 406);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/icon_button */ 400);
/* harmony import */ var soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/permalink */ 626);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/follow_requests/components/account_authorize.tsx";











var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__.defineMessages)({
    authorize: {
        "id": "follow_request.authorize",
        "defaultMessage": "Authorize"
    },
    reject: {
        "id": "follow_request.reject",
        "defaultMessage": "Reject"
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_9__.makeGetAccount)();
var AccountAuthorize = function (_ref) {
    var id = _ref.id;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__["default"])();
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return getAccount(state, id); });
    var onAuthorize = function () {
        dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__.authorizeFollowRequest)(id));
    };
    var onReject = function () {
        dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__.rejectFollowRequest)(id));
    };
    if (!account)
        return null;
    var content = {
        __html: account.note_emojified
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account-authorize__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account-authorize",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_6__["default"], {
        href: "/@".concat(account.acct),
        to: "/@".concat(account.acct),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account-authorize__avatar",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_3__["default"], {
        account: account,
        size: 48,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 54
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_4__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
        className: "account__header__content",
        dangerouslySetInnerHTML: content,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account--panel",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account--panel__button",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_5__["default"], {
        title: intl.formatMessage(messages.reject),
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
        onClick: onReject,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 49
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account--panel__button",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_5__["default"], {
        title: intl.formatMessage(messages.authorize),
        src: __webpack_require__(/*! @tabler/icons/check.svg */ 131),
        onClick: onAuthorize,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 49
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (AccountAuthorize);


/***/ }),

/***/ 1507:
/*!********************************************************!*\
  !*** ./app/soapbox/features/follow_requests/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 904);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../ui/components/column */ 905);
/* harmony import */ var _components_account_authorize__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/account_authorize */ 1675);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/follow_requests/index.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    heading: {
        "id": "column.follow_requests",
        "defaultMessage": "Follow requests"
    }
});
var handleLoadMore = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function (dispatch) {
    dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_3__.expandFollowRequests)());
}, 300, {
    leading: true
});
var FollowRequests = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.user_lists.follow_requests.items; });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return !!state.user_lists.follow_requests.next; });
    var loading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.user_lists.mutes.isLoading; });
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_3__.fetchFollowRequests)());
    }, []);
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "empty_column.follow_requests",
        defaultMessage: "You don't have any follow requests yet. When you receive one, it will show up here.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_7__["default"], {
        icon: "user-plus",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_4__["default"], {
        className: "flex flex-col gap-3",
        scrollKey: "follow_requests",
        onLoadMore: function () { return handleLoadMore(dispatch); },
        hasMore: hasMore,
        emptyMessage: emptyMessage,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 7
        }
    }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_account_authorize__WEBPACK_IMPORTED_MODULE_8__["default"], {
        key: id,
        id: id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 11
        }
    }); }), loading && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 22
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (FollowRequests);


/***/ })

}]);
//# sourceMappingURL=follow_requests-5aa4ad19687507615714.chunk.js.map