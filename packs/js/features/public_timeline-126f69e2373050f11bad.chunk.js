"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[63],{

/***/ 2069:
/*!********************************************************!*\
  !*** ./app/soapbox/features/public_timeline/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ 25);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/settings */ 27);
/* harmony import */ var soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/streaming */ 211);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/timelines */ 169);
/* harmony import */ var soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/pull-to-refresh */ 447);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var _remote_timeline_components_pinned_hosts_picker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../remote_timeline/components/pinned_hosts_picker */ 2500);
/* harmony import */ var _ui_components_timeline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ui/components/timeline */ 1921);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/public_timeline/index.tsx";











var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    title: {
        "id": "column.public",
        "defaultMessage": "Explore"
    }
});
var CommunityTimeline = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useSettings)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useOwnAccount)();
    var onlyMedia = settings.getIn(['public', 'other', 'onlyMedia']);
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.instance.title; });
    var showExplanationBox = settings.get('showExplanationBox');
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useFeatures)();
    var bubbleTimeline = account && features.bubbleTimeline && settings.getIn(['public', 'bubble']);
    var timelineId = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () { return !bubbleTimeline ? 'public' : 'bubble'; }, [bubbleTimeline]);
    var dismissExplanationBox = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function () {
        dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__.changeSetting)(['showExplanationBox'], false));
    }, [dispatch]);
    var handleLoadMore = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function (maxId) {
        if (!bubbleTimeline) {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandPublicTimeline)({
                maxId: maxId,
                onlyMedia: onlyMedia
            }));
        }
        else {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandBubbleTimeline)({
                maxId: maxId,
                onlyMedia: onlyMedia
            }));
        }
    }, [bubbleTimeline, dispatch, onlyMedia]);
    var handleRefresh = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function () {
        if (!bubbleTimeline) {
            return dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandPublicTimeline)({
                onlyMedia: onlyMedia
            }));
        }
        else {
            return dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandBubbleTimeline)({
                onlyMedia: onlyMedia
            }));
        }
    }, [bubbleTimeline, dispatch, onlyMedia]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        if (!bubbleTimeline) {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandPublicTimeline)({
                onlyMedia: onlyMedia
            }));
            var disconnect_1 = dispatch((0,soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_2__.connectPublicStream)({
                onlyMedia: onlyMedia
            }));
            return function () {
                disconnect_1();
            };
        }
        else {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandBubbleTimeline)({
                onlyMedia: onlyMedia
            })); // bubble timeline doesnt have streaming for now
        }
    }, [onlyMedia, bubbleTimeline]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
        label: intl.formatMessage(messages.title),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_remote_timeline_components_pinned_hosts_picker__WEBPACK_IMPORTED_MODULE_7__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 7
        }
    }), showExplanationBox && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mb-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 30
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        size: "lg",
        weight: "bold",
        className: "mb-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "fediverse_tab.explanation_box.title",
        defaultMessage: "What is the Fediverse?",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "fediverse_tab.explanation_box.explanation",
        defaultMessage: "{site_title} is part of the Fediverse, a social network made up of thousands of independent social media sites (aka \"servers\"). The posts you see here are from 3rd-party servers. You have the freedom to engage with them, or to block any server you don't like. Pay attention to the full username after the second @ symbol to know which server a post is from. To see only {site_title} posts, visit {local}.",
        values: {
            site_title: siteTitle,
            local: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.Link, {
                to: "/timeline/local",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 84,
                    columnNumber: 17
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
                id: "empty_column.home.local_tab",
                defaultMessage: "the {site_title} tab",
                values: {
                    site_title: siteTitle
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 85,
                    columnNumber: 19
                }
            }))
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 11
        }
    }), bubbleTimeline && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        className: "mt-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "fediverse_tab.explanation_box.bubble",
        defaultMessage: "This timeline shows you all the statuses published on a selection of other instances curated by your moderators.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "text-right",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Button, {
        theme: "link",
        onClick: dismissExplanationBox,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "fediverse_tab.explanation_box.dismiss",
        defaultMessage: "Don\\'t show again",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 103,
            columnNumber: 15
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onRefresh: handleRefresh,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 107,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_timeline__WEBPACK_IMPORTED_MODULE_8__["default"], {
        scrollKey: "".concat(timelineId, "_timeline"),
        timelineId: "".concat(timelineId).concat(onlyMedia ? ':media' : ''),
        onLoadMore: handleLoadMore,
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "empty_column.public",
            defaultMessage: "There is nothing here! Write something publicly, or manually follow users from other servers to fill it up",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 112,
                columnNumber: 25
            }
        }),
        divideType: "space",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 108,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (CommunityTimeline);


/***/ })

}]);
//# sourceMappingURL=public_timeline-126f69e2373050f11bad.chunk.js.map