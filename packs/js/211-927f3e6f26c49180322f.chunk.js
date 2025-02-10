"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[211],{

/***/ 1609:
/*!******************************************************!*\
  !*** ./app/soapbox/features/followed_tags/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_tags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/tags */ 438);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 904);
/* harmony import */ var soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/sub_navigation */ 618);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/followed_tags/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    heading: {
        "id": "column.tags",
        "defaultMessage": "Followed hashtags"
    }
});
var FollowButton = function (_ref) {
    var id = _ref.id;
    var isFollow = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return ({
        isFollow: state.tags.list.find(function (t) { return t.name === id; })
    }); }).isFollow;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var onClick = react__WEBPACK_IMPORTED_MODULE_1__.useCallback(function () {
        var action = isFollow ? soapbox_actions_tags__WEBPACK_IMPORTED_MODULE_2__.unfollowTag : soapbox_actions_tags__WEBPACK_IMPORTED_MODULE_2__.followTag;
        dispatch(action(id));
    }, [isFollow, id]);
    var text = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        return isFollow ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "hashtag_timeline.unfollow",
            defaultMessage: "Unfollow",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
                columnNumber: 7
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "hashtag_timeline.follow",
            defaultMessage: "Follow",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 33,
                columnNumber: 7
            }
        });
    }, [isFollow]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        theme: "ghost",
        classNames: "text-xs gap-1 flex-row-reverse",
        style: {
            background: 'transparent'
        },
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: isFollow ? __webpack_require__(/*! @tabler/icons/minus.svg */ 649) : __webpack_require__(/*! @tabler/icons/plus.svg */ 244),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }), text);
};
var FollowedHashtags = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var _a = react__WEBPACK_IMPORTED_MODULE_1__.useState(null), tags = _a[0], setTags = _a[1];
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var _b = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return ({
        tags: state.tags.list,
        loading: state.tags.loading
    }); }), serverTags = _b.tags, loading = _b.loading; // we want to keep our own list to allow user to refollow instantly if unfollow was a mistake
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        if (loading || tags)
            return;
        setTags(serverTags);
    }, [serverTags, tags, loading]);
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        dispatch((0,soapbox_actions_tags__WEBPACK_IMPORTED_MODULE_2__.fetchTags)());
    }, [dispatch]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Column, {
        label: intl.formatMessage(messages.heading),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "px-4 pt-4 sm:p-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_5__["default"], {
        message: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 9
        }
    })), !tags ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 11
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_4__["default"], {
        className: "flex flex-col gap-2",
        scrollKey: "followed_hashtags",
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "column.tags.empty",
            defaultMessage: "You don't follow any hashtag yet.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 78,
                columnNumber: 27
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 11
        }
    }, tags === null || tags === void 0 ? void 0 : tags.map(function (tag) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "p-3 bg-white dark:bg-slate-800 shadow-sm dark:shadow-inset rounded-lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-center grow pl-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        tag: "span",
        weight: "semibold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 21
        }
    }, "#", tag.name)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("hr", {
        className: "bg-gray-100 dark:border-slate-800 mt-1 mb-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-center gap-1 grow shrink justify-between mt-1 text-sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(FollowButton, {
        id: tag.name,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 21
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        theme: "primary",
        to: "/tag/".concat(tag.name),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 21
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-center text-xs",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 23
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "column.tags.see",
        defaultMessage: "See",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 25
        }
    }), "\xA0", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: __webpack_require__(/*! @tabler/icons/arrow-right.svg */ 648),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 25
        }
    }))))); })));
};
/* harmony default export */ __webpack_exports__["default"] = (FollowedHashtags);


/***/ })

}]);
//# sourceMappingURL=211-927f3e6f26c49180322f.chunk.js.map