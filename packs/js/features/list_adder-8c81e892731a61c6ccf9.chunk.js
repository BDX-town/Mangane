"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[52],{

/***/ 2337:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/list_adder/components/account.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/display-name */ 429);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_adder/components/account.tsx";





var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__.makeGetAccount)();
var Account = function (_ref) {
    var accountId = _ref.accountId;
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return getAccount(state, accountId); });
    if (!account)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Avatar, {
        src: account.avatar,
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 52
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_1__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (Account);


/***/ }),

/***/ 2338:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/list_adder/components/list.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/lists */ 169);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon_button */ 423);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_adder/components/list.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    remove: {
        "id": "lists.account.remove",
        "defaultMessage": "Remove from list"
    },
    add: {
        "id": "lists.account.add",
        "defaultMessage": "Add to list"
    }
});
var List = function (_ref) {
    var listId = _ref.listId;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var list = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.lists.get(listId); });
    var added = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.listAdder.lists.items.includes(listId); });
    var onRemove = function () { return dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.removeFromListAdder)(listId)); };
    var onAdd = function () { return dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.addToListAdder)(listId)); };
    if (!list)
        return null;
    var button;
    if (added) {
        button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
            iconClassName: "h-5 w-5",
            src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
            title: intl.formatMessage(messages.remove),
            onClick: onRemove,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 33,
                columnNumber: 14
            }
        });
    }
    else {
        button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
            iconClassName: "h-5 w-5",
            src: __webpack_require__(/*! @tabler/icons/plus.svg */ 244),
            title: intl.formatMessage(messages.add),
            onClick: onAdd,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
                columnNumber: 14
            }
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-center gap-1.5 px-2 py-4 text-black dark:text-white",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: __webpack_require__(/*! @tabler/icons/list.svg */ 436),
        fixedWidth: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "flex-grow",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 7
        }
    }, list.title), button);
};
/* harmony default export */ __webpack_exports__["default"] = (List);


/***/ }),

/***/ 2116:
/*!***************************************************!*\
  !*** ./app/soapbox/features/list_adder/index.tsx ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reselect */ 63);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/lists */ 169);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _lists_components_new_list_form__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lists/components/new_list_form */ 908);
/* harmony import */ var _components_account__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/account */ 2337);
/* harmony import */ var _components_list__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/list */ 2338);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_adder/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    close: {
        "id": "lightbox.close",
        "defaultMessage": "Close"
    },
    subheading: {
        "id": "lists.subheading",
        "defaultMessage": "Your lists"
    },
    add: {
        "id": "lists.new.create",
        "defaultMessage": "Add List"
    }
}); // hack
var getOrderedLists = (0,reselect__WEBPACK_IMPORTED_MODULE_1__.createSelector)([function (state) { return state.lists; }], function (lists) {
    if (!lists) {
        return lists;
    }
    return lists.toList().filter(function (item) { return !!item; }).sort(function (a, b) { return a.title.localeCompare(b.title); });
});
var ListAdder = function (_ref) {
    var accountId = _ref.accountId, onClose = _ref.onClose;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var listIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return getOrderedLists(state).map(function (list) { return list.id; }); });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.setupListAdder)(accountId));
        return function () {
            dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_2__.resetListAdder)());
        };
    }, []);
    var onClickClose = function () {
        onClose('LIST_ADDER');
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "list_adder.header_title",
            defaultMessage: "Add or Remove from Lists",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 58,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_account__WEBPACK_IMPORTED_MODULE_6__["default"], {
        accountId: accountId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardTitle, {
        title: intl.formatMessage(messages.add),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_lists_components_new_list_form__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardTitle, {
        title: intl.formatMessage(messages.subheading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 7
        }
    }, listIds.map(function (ListId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_list__WEBPACK_IMPORTED_MODULE_7__["default"], {
        key: ListId,
        listId: ListId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 32
        }
    }); })));
};
/* harmony default export */ __webpack_exports__["default"] = (ListAdder);


/***/ })

}]);
//# sourceMappingURL=list_adder-8c81e892731a61c6ccf9.chunk.js.map