"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[13],{

/***/ 2440:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/aliases/components/account.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/aliases */ 1280);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/avatar */ 402);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/display-name */ 404);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/icon_button */ 400);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/utils/features */ 19);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/aliases/components/account.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    add: {
        "id": "aliases.account.add",
        "defaultMessage": "Create alias"
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetAccount)();
var Account = function (_ref) {
    var accountId = _ref.accountId, aliases = _ref.aliases;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return getAccount(state, accountId); });
    var added = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var instance = state.instance;
        var features = (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_8__.getFeatures)(instance);
        var account = getAccount(state, accountId);
        var apId = account === null || account === void 0 ? void 0 : account.pleroma.get('ap_id');
        var name = features.accountMoving ? account === null || account === void 0 ? void 0 : account.acct : apId;
        return aliases.includes(name);
    });
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.me; });
    var handleOnAdd = function () { return dispatch((0,soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_2__.addToAliases)(account)); };
    if (!account)
        return null;
    var button;
    if (!added && accountId !== me) {
        button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "account__relationship",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 50,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_5__["default"], {
            src: __webpack_require__(/*! @tabler/icons/plus.svg */ 249),
            title: intl.formatMessage(messages.add),
            onClick: handleOnAdd,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 51,
                columnNumber: 9
            }
        }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_3__["default"], {
        account: account,
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 52
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_4__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 11
        }
    })), button));
};
/* harmony default export */ __webpack_exports__["default"] = (Account);


/***/ }),

/***/ 2441:
/*!************************************************************!*\
  !*** ./app/soapbox/features/aliases/components/search.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/aliases */ 1280);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/aliases/components/search.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    search: {
        "id": "aliases.search",
        "defaultMessage": "Search your old account"
    },
    searchTitle: {
        "id": "tabs_bar.search",
        "defaultMessage": "Search"
    }
});
var Search = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var value = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.aliases.suggestions.value; });
    var handleChange = function (e) {
        dispatch((0,soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_3__.changeAliasesSuggestions)(e.target.value));
    };
    var handleKeyUp = function (e) {
        if (e.keyCode === 13) {
            dispatch((0,soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_3__.fetchAliasesSuggestions)(value));
        }
    };
    var handleSubmit = function () {
        dispatch((0,soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_3__.fetchAliasesSuggestions)(value));
    };
    var handleClear = function () {
        dispatch((0,soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_3__.clearAliasesSuggestions)());
    };
    var hasValue = value.length > 0;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-center gap-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("label", {
        className: "flex-grow relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        style: {
            display: 'none'
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.search)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {
        className: "block w-full sm:text-sm dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500 rounded-full",
        type: "text",
        value: value,
        onChange: handleChange,
        onKeyUp: handleKeyUp,
        placeholder: intl.formatMessage(messages.search),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        role: "button",
        tabIndex: 0,
        className: "search__icon",
        onClick: handleClear,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_4__["default"], {
        src: __webpack_require__(/*! @tabler/icons/backspace.svg */ 1309),
        "aria-label": intl.formatMessage(messages.search),
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('svg-icon--backspace', {
            active: hasValue
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        onClick: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.searchTitle)));
};
/* harmony default export */ __webpack_exports__["default"] = (Search);


/***/ }),

/***/ 2124:
/*!************************************************!*\
  !*** ./app/soapbox/features/aliases/index.tsx ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/aliases */ 1280);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1264);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var _components_account__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/account */ 2440);
/* harmony import */ var _components_search__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/search */ 2441);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/aliases/index.tsx";











var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__.defineMessages)({
    heading: {
        "id": "column.aliases",
        "defaultMessage": "Account aliases"
    },
    subheading_add_new: {
        "id": "column.aliases.subheading_add_new",
        "defaultMessage": "Add New Alias"
    },
    create_error: {
        "id": "column.aliases.create_error",
        "defaultMessage": "Error creating alias"
    },
    delete_error: {
        "id": "column.aliases.delete_error",
        "defaultMessage": "Error deleting alias"
    },
    subheading_aliases: {
        "id": "column.aliases.subheading_aliases",
        "defaultMessage": "Current aliases"
    },
    delete: {
        "id": "column.aliases.delete",
        "defaultMessage": "Delete"
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__.makeGetAccount)();
var Aliases = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var aliases = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) {
        var me = state.me;
        var account = getAccount(state, me);
        var instance = state.instance;
        var features = (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_7__.getFeatures)(instance);
        if (features.accountMoving)
            return state.aliases.aliases.items;
        return account.pleroma.get('also_known_as');
    });
    var searchAccountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.aliases.suggestions.items; });
    var loaded = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.aliases.suggestions.loaded; });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch(soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_1__.fetchAliases);
    }, []);
    var handleFilterDelete = function (e) {
        dispatch((0,soapbox_actions_aliases__WEBPACK_IMPORTED_MODULE_1__.removeFromAliases)(e.currentTarget.dataset.value));
    };
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "empty_column.aliases",
        defaultMessage: "You haven't created any account alias yet.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Column, {
        className: "aliases-settings-panel",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardTitle, {
        title: intl.formatMessage(messages.subheading_add_new),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_search__WEBPACK_IMPORTED_MODULE_9__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 7
        }
    }), loaded && searchAccountIds.size === 0 ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "aliases__accounts empty-column-indicator",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "empty_column.aliases.suggestions",
        defaultMessage: "There are no account suggestions available for the provided term.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 13
        }
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "aliases__accounts",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 11
        }
    }, searchAccountIds.map(function (accountId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_account__WEBPACK_IMPORTED_MODULE_8__["default"], {
        key: accountId,
        accountId: accountId,
        aliases: aliases,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 48
        }
    }); })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardTitle, {
        title: intl.formatMessage(messages.subheading_aliases),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "aliases-settings-panel",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        scrollKey: "aliases",
        emptyMessage: emptyMessage,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 9
        }
    }, aliases.map(function (alias, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        alignItems: "center",
        justifyContent: "between",
        space: 1,
        key: i,
        className: "p-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        tag: "span",
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "aliases.account_label",
        defaultMessage: "Old account:",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 48
        }
    })), ' ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        tag: "span",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 17
        }
    }, alias)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex items-center",
        role: "button",
        tabIndex: 0,
        onClick: handleFilterDelete,
        "data-value": alias,
        "aria-label": intl.formatMessage(messages.delete),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
        className: "mr-1.5",
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 17
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        weight: "bold",
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "aliases.aliases_list_delete",
        defaultMessage: "Unlink alias",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 51
        }
    })))); }))));
};
/* harmony default export */ __webpack_exports__["default"] = (Aliases);


/***/ })

}]);
//# sourceMappingURL=aliases-f8f34421afe4537e5918.chunk.js.map