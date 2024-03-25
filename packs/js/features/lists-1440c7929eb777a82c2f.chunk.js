"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[55],{

/***/ 1581:
/*!**********************************************!*\
  !*** ./app/soapbox/features/lists/index.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-router-dom */ 27);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! reselect */ 66);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/lists */ 173);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/icon */ 28);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1020);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../ui/components/column */ 1021);
/* harmony import */ var _components_new_list_form__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/new_list_form */ 1424);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/lists/index.tsx";













var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__.defineMessages)({
    heading: {
        "id": "column.lists",
        "defaultMessage": "Lists"
    },
    subheading: {
        "id": "lists.subheading",
        "defaultMessage": "Your lists"
    },
    add: {
        "id": "lists.new.create",
        "defaultMessage": "Add list"
    },
    deleteHeading: {
        "id": "confirmations.delete_list.heading",
        "defaultMessage": "Delete list"
    },
    deleteMessage: {
        "id": "confirmations.delete_list.message",
        "defaultMessage": "Are you sure you want to permanently delete this list?"
    },
    deleteConfirm: {
        "id": "confirmations.delete_list.confirm",
        "defaultMessage": "Delete"
    },
    editList: {
        "id": "lists.edit",
        "defaultMessage": "Edit list"
    },
    deleteList: {
        "id": "lists.delete",
        "defaultMessage": "Delete list"
    }
});
var getOrderedLists = (0,reselect__WEBPACK_IMPORTED_MODULE_2__.createSelector)([function (state) { return state.lists; }], function (lists) {
    if (!lists) {
        return lists;
    }
    return lists.toList().filter(function (item) { return !!item; }).sort(function (a, b) { return a.get('title').localeCompare(b.get('title')); });
});
var Lists = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__["default"])();
    var lists = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return getOrderedLists(state); });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_3__.fetchLists)());
    }, []);
    if (!lists) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_9__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 51,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 52,
                columnNumber: 9
            }
        }));
    }
    var handleEditClick = function (id) { return function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_4__.openModal)('LIST_EDITOR', {
            listId: id
        }));
    }; };
    var handleDeleteClick = function (id) { return function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_4__.openModal)('CONFIRM', {
            heading: intl.formatMessage(messages.deleteHeading),
            message: intl.formatMessage(messages.deleteMessage),
            confirm: intl.formatMessage(messages.deleteConfirm),
            onConfirm: function () {
                dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_3__.deleteList)(id));
            }
        }));
    }; };
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "empty_column.lists",
        defaultMessage: "You don't have any lists yet. When you create one, it will show up here.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_9__["default"], {
        icon: "list-ul",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.CardTitle, {
        title: intl.formatMessage(messages.add),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_new_list_form__WEBPACK_IMPORTED_MODULE_10__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.CardTitle, {
        title: intl.formatMessage(messages.subheading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_6__["default"], {
        scrollKey: "lists",
        emptyMessage: emptyMessage,
        itemClassName: "py-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 7
        }
    }, lists.map(function (list) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Link, {
        key: list.id,
        to: "/list/".concat(list.id),
        className: "flex items-center gap-1.5 p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: __webpack_require__(/*! @tabler/icons/list.svg */ 411),
        fixedWidth: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "flex-grow",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 13
        }
    }, list.title), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.IconButton, {
        iconClassName: "h-5 w-5",
        src: __webpack_require__(/*! @tabler/icons/pencil.svg */ 415),
        onClick: handleEditClick(list.id),
        title: intl.formatMessage(messages.editList),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.IconButton, {
        iconClassName: "h-5 w-5",
        src: __webpack_require__(/*! @tabler/icons/trash.svg */ 252),
        onClick: handleDeleteClick(list.id),
        title: intl.formatMessage(messages.deleteList),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 13
        }
    })); })));
};
/* harmony default export */ __webpack_exports__["default"] = (Lists);


/***/ })

}]);
//# sourceMappingURL=lists-1440c7929eb777a82c2f.chunk.js.map