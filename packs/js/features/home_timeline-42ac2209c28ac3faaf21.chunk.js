"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[50],{

/***/ 1598:
/*!******************************************************!*\
  !*** ./app/soapbox/features/home_timeline/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/suggestions */ 425);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../actions/timelines */ 45);
/* harmony import */ var soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/pull-to-refresh */ 416);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_ui_components_timeline__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/ui/components/timeline */ 1448);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/home_timeline/index.tsx";











var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    title: {
        "id": "column.home",
        "defaultMessage": "Home"
    }
});
var HomeTimeline = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useFeatures)();
    var polling = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var isPartial = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) {
        var _state$timelines$get;
        return ((_state$timelines$get = state.timelines.get('home')) === null || _state$timelines$get === void 0 ? void 0 : _state$timelines$get.isPartial) === true;
    });
    var currentAccountId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) {
        var _state$timelines$get2;
        return (_state$timelines$get2 = state.timelines.get('home')) === null || _state$timelines$get2 === void 0 ? void 0 : _state$timelines$get2.feedAccountId;
    });
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.instance.title; });
    var currentAccountRelationship = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return currentAccountId ? state.relationships.get(currentAccountId) : null; });
    var handleLoadMore = function (maxId) {
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandHomeTimeline)({
            maxId: maxId,
            accountId: currentAccountId
        }));
    }; // Mastodon generates the feed in Redis, and can return a partial timeline
    // (HTTP 206) for new users. Poll until we get a full page of results.
    var checkIfReloadNeeded = function () {
        if (isPartial) {
            polling.current = setInterval(function () {
                dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandHomeTimeline)());
            }, 3000);
        }
        else {
            stopPolling();
        }
    };
    var stopPolling = function () {
        if (polling.current) {
            clearInterval(polling.current);
            polling.current = null;
        }
    };
    var handleRefresh = function () {
        return dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandHomeTimeline)({
            maxId: null,
            accountId: currentAccountId
        }));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        checkIfReloadNeeded();
        return function () {
            stopPolling();
        };
    }, [isPartial]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        // Check to see if we still follow the user that is selected in the Feed Carousel.
        if (currentAccountId) {
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__.fetchRelationships)([currentAccountId]));
        }
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        // If we unfollowed the currently selected user from the Feed Carousel,
        // let's clear the feed filter and refetch fresh timeline data.
        if (currentAccountRelationship && !(currentAccountRelationship !== null && currentAccountRelationship !== void 0 && currentAccountRelationship.following)) {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.clearFeedAccountId)());
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_3__.expandHomeTimeline)({}, function () {
                dispatch((0,soapbox_actions_suggestions__WEBPACK_IMPORTED_MODULE_2__.fetchSuggestionsForTimeline)());
            }));
        }
    }, [currentAccountId]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
        label: intl.formatMessage(messages.title),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onRefresh: handleRefresh,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_components_timeline__WEBPACK_IMPORTED_MODULE_6__["default"], {
        scrollKey: "home_timeline",
        onLoadMore: handleLoadMore,
        timelineId: "home",
        divideType: "space",
        showAds: true,
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Stack, {
            space: 1,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 95,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
            size: "xl",
            weight: "medium",
            align: "center",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 96,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "empty_column.home.title",
            defaultMessage: "You're not following anyone yet",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 97,
                columnNumber: 17
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
            theme: "muted",
            align: "center",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 103,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "empty_column.home.subtitle",
            defaultMessage: "{siteTitle} gets more interesting once you follow other users.",
            values: {
                siteTitle: siteTitle
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 104,
                columnNumber: 17
            }
        })), features.federating && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
            theme: "muted",
            align: "center",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 112,
                columnNumber: 17
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "empty_column.home",
            defaultMessage: "Or you can visit {public} to get started and meet other users.",
            values: {
                public: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.Link, {
                    to: "/timeline/local",
                    className: "text-primary-600 dark:text-primary-400 hover:underline",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 118,
                        columnNumber: 25
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
                    id: "empty_column.home.local_tab",
                    defaultMessage: "the {site_title} tab",
                    values: {
                        site_title: siteTitle
                    },
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 119,
                        columnNumber: 27
                    }
                }))
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 113,
                columnNumber: 19
            }
        }))),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (HomeTimeline);


/***/ })

}]);
//# sourceMappingURL=home_timeline-42ac2209c28ac3faaf21.chunk.js.map