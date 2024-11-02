(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[49],{

/***/ 1797:
/*!****************************************!*\
  !*** ./node_modules/lodash/isEqual.js ***!
  \****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(/*! ./_baseIsEqual */ 298);
/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */


function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;

/***/ }),

/***/ 1821:
/*!*************************************************!*\
  !*** ./app/soapbox/components/column_header.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ColumnHeader; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/sub_navigation */ 782);

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
var _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/column_header.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }


 // import classNames from 'classnames';
// import { injectIntl, defineMessages } from 'react-intl';
// import Icon from 'soapbox/components/icon';
 // const messages = defineMessages({
//   show: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
//   hide: { id: 'column_header.hide_settings', defaultMessage: 'Hide settings' },
// });
var ColumnHeader = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.withRouter)(_class = (_class2 = /** @class */ (function (_super) {
    __extends(ColumnHeader, _super);
    function ColumnHeader() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            collapsed: true,
            animating: false
        });
        _defineProperty(_this, "historyBack", function () {
            var _window$history;
            if (((_window$history = window.history) === null || _window$history === void 0 ? void 0 : _window$history.length) === 1) {
                _this.props.history.push('/');
            }
            else {
                _this.props.history.goBack();
            }
        });
        _defineProperty(_this, "handleToggleClick", function (e) {
            e.stopPropagation();
            _this.setState({
                collapsed: !_this.state.collapsed,
                animating: true
            });
        });
        _defineProperty(_this, "handleBackClick", function () {
            _this.historyBack();
        });
        _defineProperty(_this, "handleTransitionEnd", function () {
            _this.setState({
                animating: false
            });
        });
        return _this;
    }
    ColumnHeader.prototype.render = function () {
        var title = this.props.title;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_3__["default"], {
            message: title,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 59,
                columnNumber: 12
            }
        });
    }; // render() {
    return ColumnHeader;
}(react__WEBPACK_IMPORTED_MODULE_2__.PureComponent)), _defineProperty(_class2, "propTypes", {
    // intl: PropTypes.object.isRequired,
    title: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node),
    icon: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    active: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
    extraButton: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node),
    children: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().node),
    history: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)
}), _class2)) || _class;



/***/ }),

/***/ 1603:
/*!*********************************************************!*\
  !*** ./app/soapbox/features/hashtag_timeline/index.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/isEqual */ 1797);
/* harmony import */ var lodash_isEqual__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_isEqual__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_tags__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/tags */ 445);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _actions_streaming__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../actions/streaming */ 127);
/* harmony import */ var _actions_timelines__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../actions/timelines */ 45);
/* harmony import */ var _components_column_header__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/column_header */ 1821);
/* harmony import */ var _components_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../components/ui */ 1);
/* harmony import */ var _ui_components_timeline__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../ui/components/timeline */ 1448);
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/hashtag_timeline/index.tsx";














var FollowButton = function (_ref) {
    var id = _ref.id;
    var _a = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return ({
        loading: state.tags.loading,
        isFollow: state.tags.list.find(function (t) { return t.name.toLowerCase() === id.toLowerCase(); })
    }); }), isFollow = _a.isFollow, loading = _a.loading;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var onClick = react__WEBPACK_IMPORTED_MODULE_3__.useCallback(function () {
        var action = isFollow ? soapbox_actions_tags__WEBPACK_IMPORTED_MODULE_4__.unfollowTag : soapbox_actions_tags__WEBPACK_IMPORTED_MODULE_4__.followTag;
        dispatch(action(id));
    }, [isFollow, id]);
    var text = react__WEBPACK_IMPORTED_MODULE_3__.useMemo(function () {
        if (loading)
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
                id: "hashtag_timeline.loading",
                defaultMessage: "Loading...",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 30,
                    columnNumber: 25
                }
            });
        return isFollow ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
            id: "hashtag_timeline.unfollow",
            defaultMessage: "Unfollow tag",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 32,
                columnNumber: 7
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
            id: "hashtag_timeline.follow",
            defaultMessage: "Follow this tag",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
                columnNumber: 7
            }
        });
    }, [loading, isFollow]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_10__.Button, {
        disabled: loading,
        theme: isFollow ? 'secondary' : 'primary',
        size: "sm",
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 5
        }
    }, loading ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_10__.Spinner, {
        withText: false,
        size: 16,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 19
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        src: isFollow ? __webpack_require__(/*! @tabler/icons/minus.svg */ 813) : __webpack_require__(/*! @tabler/icons/plus.svg */ 263),
        className: "mr-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 60
        }
    }), "\xA0", text);
};
var HashtagTimeline = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var disconnects = react__WEBPACK_IMPORTED_MODULE_3__.useRef([]);
    var _a = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_13__.useParams)(), id = _a.id, tags = _a.tags;
    var prevParams = react__WEBPACK_IMPORTED_MODULE_3__.useRef({
        id: id,
        tags: tags
    });
    var isLoggedIn = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.me; });
    var hasUnread = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.getIn(['timelines', "hashtag:".concat(id), 'unread']) > 0; }); // TODO: wtf is this?
    // It exists in Mastodon's codebase, but undocumented
    var additionalFor = react__WEBPACK_IMPORTED_MODULE_3__.useCallback(function (mode) {
        if (tags && (tags[mode] || []).length > 0) {
            return tags[mode].map(function (tag) { return tag.value; }).join('/');
        }
        else {
            return '';
        }
    }, [tags]);
    var title = react__WEBPACK_IMPORTED_MODULE_3__.useMemo(function () {
        var t = ["#".concat(id)]; // TODO: wtf is all this?
        // It exists in Mastodon's codebase, but undocumented
        if (additionalFor('any')) {
            t.push(' ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
                key: "any",
                id: "hashtag.column_header.tag_mode.any",
                values: {
                    additional: additionalFor('any')
                },
                defaultMessage: "or {additional}",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 78,
                    columnNumber: 19
                }
            }));
        }
        if (additionalFor('all')) {
            t.push(' ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
                key: "all",
                id: "hashtag.column_header.tag_mode.all",
                values: {
                    additional: additionalFor('all')
                },
                defaultMessage: "and {additional}",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 82,
                    columnNumber: 19
                }
            }));
        }
        if (additionalFor('none')) {
            t.push(' ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
                key: "none",
                id: "hashtag.column_header.tag_mode.none",
                values: {
                    additional: additionalFor('none')
                },
                defaultMessage: "without {additional}",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 86,
                    columnNumber: 19
                }
            }));
        }
        return t;
    }, [id, additionalFor]);
    var subscribe = react__WEBPACK_IMPORTED_MODULE_3__.useCallback(function (dispatch, _id) {
        var tags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var any = (tags.any || []).map(function (tag) { return tag.value; });
        var all = (tags.all || []).map(function (tag) { return tag.value; });
        var none = (tags.none || []).map(function (tag) { return tag.value; });
        __spreadArray([_id], any, true).map(function (tag) {
            disconnects.current.push(dispatch((0,_actions_streaming__WEBPACK_IMPORTED_MODULE_7__.connectHashtagStream)(_id, tag, function (status) {
                var tags = status.tags.map(function (tag) { return tag.name; });
                return all.filter(function (tag) { return tags.includes(tag); }).length === all.length && none.filter(function (tag) { return tags.includes(tag); }).length === 0;
            })));
        });
    }, []);
    var unsubscribe = react__WEBPACK_IMPORTED_MODULE_3__.useCallback(function () {
        disconnects.current.map(function (d) { return d(); });
        disconnects.current = [];
    }, []);
    react__WEBPACK_IMPORTED_MODULE_3__.useEffect(function () {
        var _a = prevParams.current, prevId = _a.id, prevTags = _a.tags;
        if (id !== prevId || !lodash_isEqual__WEBPACK_IMPORTED_MODULE_2___default()(tags, prevTags)) {
            dispatch((0,_actions_timelines__WEBPACK_IMPORTED_MODULE_8__.clearTimeline)("hashtag:".concat(id)));
        }
        subscribe(dispatch, id, tags);
        dispatch((0,_actions_timelines__WEBPACK_IMPORTED_MODULE_8__.expandHashtagTimeline)(id, {
            tags: tags
        }));
        return function () {
            unsubscribe();
        };
    }, [dispatch, tags, id, subscribe, unsubscribe]);
    var handleLoadMore = react__WEBPACK_IMPORTED_MODULE_3__.useCallback(function (maxId) {
        dispatch((0,_actions_timelines__WEBPACK_IMPORTED_MODULE_8__.expandHashtagTimeline)(id, {
            maxId: maxId,
            tags: tags
        }));
    }, [dispatch, id, tags]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_10__.Column, {
        label: "#".concat(id),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "px-4 pt-4 sm:p-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 135,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_column_header__WEBPACK_IMPORTED_MODULE_9__["default"], {
        active: hasUnread,
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "flex justify-between items-center",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 139,
                columnNumber: 13
            }
        }, title, isLoggedIn && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(FollowButton, {
            id: id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 143,
                columnNumber: 19
            }
        })),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 136,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_timeline__WEBPACK_IMPORTED_MODULE_11__["default"], {
        scrollKey: "hashtag_timeline",
        timelineId: "hashtag:".concat(id),
        onLoadMore: handleLoadMore,
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
            id: "empty_column.hashtag",
            defaultMessage: "There is nothing in this hashtag yet.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 154,
                columnNumber: 23
            }
        }),
        divideType: "space",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 150,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (HashtagTimeline);


/***/ })

}]);
//# sourceMappingURL=hashtag_timeline-00b1f4fd5930a8a655c7.chunk.js.map