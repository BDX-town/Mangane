"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[40],{

/***/ 1588:
/*!************************************************!*\
  !*** ./app/soapbox/features/filters/index.tsx ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_filters__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/filters */ 295);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/snackbar */ 24);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon */ 29);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/forms */ 908);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/filters/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.filters",
        "defaultMessage": "Muted words"
    },
    subheading_add_new: {
        "id": "column.filters.subheading_add_new",
        "defaultMessage": "Add New Filter"
    },
    keyword: {
        "id": "column.filters.keyword",
        "defaultMessage": "Keyword or phrase"
    },
    expires: {
        "id": "column.filters.expires",
        "defaultMessage": "Expire after"
    },
    expires_hint: {
        "id": "column.filters.expires_hint",
        "defaultMessage": "Expiration dates are not currently supported"
    },
    home_timeline: {
        "id": "column.filters.home_timeline",
        "defaultMessage": "Home timeline"
    },
    public_timeline: {
        "id": "column.filters.public_timeline",
        "defaultMessage": "Public timeline"
    },
    notifications: {
        "id": "column.filters.notifications",
        "defaultMessage": "Also apply for notifications"
    },
    conversations: {
        "id": "column.filters.conversations",
        "defaultMessage": "Conversations"
    },
    drop_notifications: {
        "id": "column.filters.drop_notifications",
        "defaultMessage": "Will also hide status in notifications"
    },
    drop_header: {
        "id": "column.filters.drop_header",
        "defaultMessage": "Drop instead of hide"
    },
    drop_hint: {
        "id": "column.filters.drop_hint",
        "defaultMessage": "Filtered posts will disappear irreversibly, even if filter is later removed"
    },
    whole_word_header: {
        "id": "column.filters.whole_word_header",
        "defaultMessage": "Whole word"
    },
    whole_word_hint: {
        "id": "column.filters.whole_word_hint",
        "defaultMessage": "When the keyword or phrase is alphanumeric only, it will only be applied if it matches the whole word"
    },
    add_new: {
        "id": "column.filters.add_new",
        "defaultMessage": "Add New Filter"
    },
    create_error: {
        "id": "column.filters.create_error",
        "defaultMessage": "Error adding filter"
    },
    delete_error: {
        "id": "column.filters.delete_error",
        "defaultMessage": "Error deleting filter"
    },
    subheading_filters: {
        "id": "column.filters.subheading_filters",
        "defaultMessage": "Current Filters"
    },
    delete: {
        "id": "column.filters.delete",
        "defaultMessage": "Delete"
    }
});
var Filters = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var filters = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.filters; });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(''), phrase = _a[0], setPhrase = _a[1];
    var expiresAt = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)('')[0];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), irreversible = _b[0], setIrreversible = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), wholeWord = _c[0], setWholeWord = _c[1];
    var handleAddNew = function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_filters__WEBPACK_IMPORTED_MODULE_2__.createFilter)(phrase, expiresAt, [], wholeWord, irreversible)).then(function () {
            return dispatch((0,soapbox_actions_filters__WEBPACK_IMPORTED_MODULE_2__.fetchFilters)());
        }).catch(function (error) {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__["default"].error(intl.formatMessage(messages.create_error)));
        });
    };
    var handleFilterDelete = function (filter) {
        dispatch((0,soapbox_actions_filters__WEBPACK_IMPORTED_MODULE_2__.deleteFilter)(filter.id)).then(function () {
            return dispatch((0,soapbox_actions_filters__WEBPACK_IMPORTED_MODULE_2__.fetchFilters)());
        }).catch(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__["default"].error(intl.formatMessage(messages.delete_error)));
        });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_filters__WEBPACK_IMPORTED_MODULE_2__.fetchFilters)());
    }, []);
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "empty_column.filters",
        defaultMessage: "You haven't created any muted words yet.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
        className: "filter-settings-panel",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.CardTitle, {
        title: intl.formatMessage(messages.subheading_add_new),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Form, {
        onSubmit: handleAddNew,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormGroup, {
        labelText: intl.formatMessage(messages.keyword),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Input, {
        required: true,
        type: "text",
        name: "phrase",
        onChange: function (_ref) {
            var target = _ref.target;
            return setPhrase(target.value);
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_6__.FieldsGroup, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex flex-col gap-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_6__.Checkbox, {
        label: intl.formatMessage(messages.drop_header),
        hint: intl.formatMessage(messages.drop_hint),
        name: "irreversible",
        checked: irreversible,
        onChange: function (_ref2) {
            var target = _ref2.target;
            return setIrreversible(target.checked);
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_6__.Checkbox, {
        label: intl.formatMessage(messages.whole_word_header),
        hint: intl.formatMessage(messages.whole_word_hint),
        name: "whole_word",
        checked: wholeWord,
        onChange: function (_ref3) {
            var target = _ref3.target;
            return setWholeWord(target.checked);
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        type: "submit",
        theme: "primary",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 105,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.add_new)))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.CardTitle, {
        title: intl.formatMessage(messages.subheading_filters),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 7
        }
    }, filters.size === 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 115,
            columnNumber: 33
        }
    }, emptyMessage), filters.map(function (filter, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        key: i,
        className: "filter__container rounded bg-gray-100 dark:bg-slate-900 p-2 my-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 119,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mb-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 120,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "pr-1 text-gray-600 dark:text-gray-400",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "filters.filters_list_phrase_label",
        defaultMessage: "Keyword or phrase:",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 73
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "filter__list-value",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 17
        }
    }, filter.phrase)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 124,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "pr-1 text-gray-600 dark:text-gray-400",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "filters.filters_list_details_label",
        defaultMessage: "Filter settings:",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 73
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "filter__list-value",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 17
        }
    }, filter.irreversible ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 21
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "filters.filters_list_drop",
        defaultMessage: "Drop",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 27
        }
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 21
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "filters.filters_list_hide",
        defaultMessage: "Hide",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 27
        }
    })), filter.whole_word && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 132,
            columnNumber: 21
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "filters.filters_list_whole-word",
        defaultMessage: "Whole word",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 132,
            columnNumber: 27
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 137,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        theme: "ghost",
        onClick: function () { return handleFilterDelete(filter); },
        "aria-label": intl.formatMessage(messages.delete),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 138,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-end gap-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 139,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "filters.filters_list_delete",
        defaultMessage: "Delete",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 140,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_4__["default"], {
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 56),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 141,
            columnNumber: 19
        }
    }))))); })));
};
/* harmony default export */ __webpack_exports__["default"] = (Filters);


/***/ })

}]);
//# sourceMappingURL=filters-ef73691519290915097e.chunk.js.map