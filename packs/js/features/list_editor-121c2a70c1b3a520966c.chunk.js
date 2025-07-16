"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[51],{

/***/ 2307:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/list_editor/components/account.tsx ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/lists */ 252);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/display-name */ 450);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon_button */ 444);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_editor/components/account.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    remove: {
        "id": "lists.account.remove",
        "defaultMessage": "Remove from list"
    },
    add: {
        "id": "lists.account.add",
        "defaultMessage": "Add to list"
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetAccount)();
var Account = function (_ref) {
    var accountId = _ref.accountId;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return getAccount(state, accountId); });
    var isAdded = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.listEditor.accounts.items.includes(accountId); });
    var onRemove = function () { return dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.removeFromListEditor)(accountId)); };
    var onAdd = function () { return dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.addToListEditor)(accountId)); };
    if (!account)
        return null;
    var button;
    if (isAdded) {
        button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
            src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
            title: intl.formatMessage(messages.remove),
            onClick: onRemove,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 37,
                columnNumber: 14
            }
        });
    }
    else {
        button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
            src: __webpack_require__(/*! @tabler/icons/plus.svg */ 304),
            title: intl.formatMessage(messages.add),
            onClick: onAdd,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 39,
                columnNumber: 14
            }
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Avatar, {
        src: account.avatar,
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 52
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_3__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__relationship",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 9
        }
    }, button)));
};
/* harmony default export */ __webpack_exports__["default"] = (Account);


/***/ }),

/***/ 2308:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/list_editor/components/edit_list_form.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/lists */ 252);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_editor/components/edit_list_form.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    title: {
        "id": "lists.edit.submit",
        "defaultMessage": "Change title"
    },
    save: {
        "id": "lists.new.save_title",
        "defaultMessage": "Save Title"
    }
});
var ListForm = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var value = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.listEditor.title; });
    var disabled = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return !state.listEditor.isChanged; });
    var handleChange = function (e) {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__.changeListEditorTitle)(e.target.value));
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__.submitListEditor)(false));
    };
    var handleClick = function () {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__.submitListEditor)(false));
    };
    var save = intl.formatMessage(messages.save);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.HStack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Input, {
        outerClassName: "flex-grow",
        type: "text",
        value: value,
        onChange: handleChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: handleClick,
        disabled: disabled,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    }, save)));
};
/* harmony default export */ __webpack_exports__["default"] = (ListForm);


/***/ }),

/***/ 2309:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/list_editor/components/search.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/lists */ 252);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_editor/components/search.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    search: {
        "id": "lists.search",
        "defaultMessage": "Search among people you follow"
    },
    searchTitle: {
        "id": "tabs_bar.search",
        "defaultMessage": "Search"
    }
});
var Search = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var value = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.listEditor.suggestions.value; });
    var handleChange = function (e) {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.changeListSuggestions)(e.target.value));
    };
    var handleSubmit = function () {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.fetchListSuggestions)(value));
    };
    var handleClear = function () {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.clearListSuggestions)());
    };
    var hasValue = value.length > 0;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("label", {
        className: "flex-grow relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        style: {
            display: 'none'
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.search)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Input, {
        type: "text",
        value: value,
        onChange: handleChange,
        placeholder: intl.formatMessage(messages.search),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        role: "button",
        tabIndex: 0,
        className: "search__icon",
        onClick: handleClear,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: __webpack_require__(/*! @tabler/icons/backspace.svg */ 1509),
        "aria-label": intl.formatMessage(messages.search),
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('svg-icon--backspace', {
            active: hasValue
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        onClick: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.searchTitle))));
};
/* harmony default export */ __webpack_exports__["default"] = (Search);


/***/ }),

/***/ 2082:
/*!****************************************************!*\
  !*** ./app/soapbox/features/list_editor/index.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/lists */ 252);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _components_account__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/account */ 2307);
/* harmony import */ var _components_edit_list_form__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/edit_list_form */ 2308);
/* harmony import */ var _components_search__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/search */ 2309);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_editor/index.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    close: {
        "id": "lightbox.close",
        "defaultMessage": "Close"
    },
    changeTitle: {
        "id": "lists.edit.submit",
        "defaultMessage": "Change title"
    },
    addToList: {
        "id": "lists.account.add",
        "defaultMessage": "Add to list"
    },
    removeFromList: {
        "id": "lists.account.remove",
        "defaultMessage": "Remove from list"
    },
    editList: {
        "id": "lists.edit",
        "defaultMessage": "Edit list"
    }
});
var ListEditor = function (_ref) {
    var listId = _ref.listId, onClose = _ref.onClose;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.listEditor.accounts.items; });
    var searchAccountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.listEditor.suggestions.items; });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__.setupListEditor)(listId));
        return function () {
            dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__.resetListEditor)());
        };
    }, []);
    var onClickClose = function () {
        onClose('LIST_ADDER');
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "lists.edit",
            defaultMessage: "Edit list",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 46,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardTitle, {
        title: intl.formatMessage(messages.changeTitle),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_edit_list_form__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 7
        }
    }), accountIds.size > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardTitle, {
        title: intl.formatMessage(messages.removeFromList),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "max-h-48 overflow-y-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 11
        }
    }, accountIds.map(function (accountId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_account__WEBPACK_IMPORTED_MODULE_4__["default"], {
        key: accountId,
        accountId: accountId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 42
        }
    }); }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardTitle, {
        title: intl.formatMessage(messages.addToList),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_search__WEBPACK_IMPORTED_MODULE_6__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "max-h-48 overflow-y-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 7
        }
    }, searchAccountIds.map(function (accountId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_account__WEBPACK_IMPORTED_MODULE_4__["default"], {
        key: accountId,
        accountId: accountId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 44
        }
    }); })));
};
/* harmony default export */ __webpack_exports__["default"] = (ListEditor);


/***/ })

}]);
//# sourceMappingURL=list_editor-121c2a70c1b3a520966c.chunk.js.map