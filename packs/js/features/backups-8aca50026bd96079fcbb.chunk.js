"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[17],{

/***/ 1532:
/*!************************************************!*\
  !*** ./app/soapbox/features/backups/index.tsx ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_backups__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/backups */ 901);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 874);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_better_column__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui/components/better_column */ 1910);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/backups/index.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    heading: {
        "id": "column.backups",
        "defaultMessage": "Backups"
    },
    create: {
        "id": "backups.actions.create",
        "defaultMessage": "Create backup"
    },
    emptyMessage: {
        "id": "backups.empty_message",
        "defaultMessage": "No backups found. {action}"
    },
    emptyMessageAction: {
        "id": "backups.empty_message.action",
        "defaultMessage": "Create one now?"
    },
    pending: {
        "id": "backups.pending",
        "defaultMessage": "Pending"
    }
});
var Backups = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var backups = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.backups.toList().sortBy(function (backup) { return backup.inserted_at; }); });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), isLoading = _a[0], setIsLoading = _a[1];
    var handleCreateBackup = function (e) {
        dispatch((0,soapbox_actions_backups__WEBPACK_IMPORTED_MODULE_2__.createBackup)());
        e.preventDefault();
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_backups__WEBPACK_IMPORTED_MODULE_2__.fetchBackups)()).then(function () {
            setIsLoading(false);
        }).catch(function () { });
    }, []);
    var showLoading = isLoading && backups.count() === 0;
    var emptyMessageAction = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
        href: "#",
        onClick: handleCreateBackup,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        tag: "span",
        theme: "primary",
        size: "sm",
        className: "hover:underline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.emptyMessageAction)));
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui_components_better_column__WEBPACK_IMPORTED_MODULE_6__["default"], {
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        isLoading: isLoading,
        showLoading: showLoading,
        scrollKey: "backups",
        emptyMessage: intl.formatMessage(messages.emptyMessage, {
            action: emptyMessageAction
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 7
        }
    }, backups.map(function (backup) {
        var insertedAt = new Date(backup.inserted_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "p-2 mb-3 rounded bg-gray-100 dark:bg-slate-900 flex justify-between items-center",
            key: backup.id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 59,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 63,
                columnNumber: 15
            }
        }, backup.processed ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
            href: backup.url,
            target: "_blank",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 65,
                columnNumber: 21
            }
        }, insertedAt) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
            theme: "subtle",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 66,
                columnNumber: 21
            }
        }, insertedAt, "\xA0-\xA0", intl.formatMessage(messages.pending))), !backup.processed && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
            withText: false,
            size: 15,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 70,
                columnNumber: 38
            }
        }));
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mt-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
        theme: "primary",
        disabled: isLoading,
        onClick: handleCreateBackup,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.create)))));
};
/* harmony default export */ __webpack_exports__["default"] = (Backups);


/***/ }),

/***/ 1910:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/ui/components/better_column.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/containers/dropdown_menu_container */ 269);
/* harmony import */ var _column_header__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./column_header */ 966);
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
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/better_column.js";
var _excluded = ["heading", "icon", "children", "active", "menu"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }




 // Yes, there are 3 types of columns at this point, but this one is better, I swear
var BetterColumn = /** @class */ (function (_super) {
    __extends(BetterColumn, _super);
    function BetterColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BetterColumn.prototype.render = function () {
        var _this$props = this.props, heading = _this$props.heading, icon = _this$props.icon, children = _this$props.children, active = _this$props.active, menu = _this$props.menu, rest = _objectWithoutProperties(_this$props, _excluded);
        var columnHeaderId = heading && heading.replace(/ /g, '-');
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Column, _extends({
            "aria-labelledby": columnHeaderId,
            className: "column--better"
        }, rest, {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 25,
                columnNumber: 7
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "column__top",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 26,
                columnNumber: 9
            }
        }, heading && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_column_header__WEBPACK_IMPORTED_MODULE_5__["default"], {
            icon: icon,
            active: active,
            type: heading,
            columnHeaderId: columnHeaderId,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 27,
                columnNumber: 23
            }
        }), menu && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "column__menu",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_4__["default"], {
            items: menu,
            icon: "ellipsis-v",
            size: 18,
            direction: "right",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
                columnNumber: 15
            }
        }))), children);
    };
    return BetterColumn;
}(react__WEBPACK_IMPORTED_MODULE_2__.PureComponent));
/* harmony default export */ __webpack_exports__["default"] = (BetterColumn);
_defineProperty(BetterColumn, "propTypes", {
    heading: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    icon: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    children: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node),
    active: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
    menu: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().array)
});


/***/ })

}]);
//# sourceMappingURL=backups-8aca50026bd96079fcbb.chunk.js.map