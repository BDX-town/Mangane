"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[66],{

/***/ 1835:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/compose/components/search_results.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_search__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/search */ 198);
/* harmony import */ var soapbox_actions_trending_statuses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/trending_statuses */ 900);
/* harmony import */ var soapbox_components_hashtag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/hashtag */ 1371);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/icon_button */ 405);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 828);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/containers/account_container */ 142);
/* harmony import */ var soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/containers/status_container */ 837);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_account__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_account */ 1836);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_hashtag__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_hashtag */ 1837);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_status */ 847);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/compose/components/search_results.tsx";















var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_14__.defineMessages)({
    accounts: {
        "id": "search_results.accounts",
        "defaultMessage": "People"
    },
    statuses: {
        "id": "search_results.statuses",
        "defaultMessage": "Posts"
    },
    hashtags: {
        "id": "search_results.hashtags",
        "defaultMessage": "Hashtags"
    }
});
var SearchResults = function () {
    var _searchResults;
    var node = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_15__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppDispatch)();
    var value = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.search.submittedValue; });
    var results = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.search.results; });
    var suggestions = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.suggestions.items; });
    var trendingStatuses = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.trending_statuses.items; });
    var trends = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.trends.items; });
    var submitted = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.search.submitted; });
    var selectedFilter = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.search.filter; });
    var filterByAccount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.search.accountId; });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) {
        var _state$accounts$get;
        return (_state$accounts$get = state.accounts.get(filterByAccount)) === null || _state$accounts$get === void 0 ? void 0 : _state$accounts$get.acct;
    });
    var handleLoadMore = function () { return dispatch((0,soapbox_actions_search__WEBPACK_IMPORTED_MODULE_2__.expandSearch)(selectedFilter)); };
    var handleClearSearch = function () { return dispatch((0,soapbox_actions_search__WEBPACK_IMPORTED_MODULE_2__.clearSearch)()); };
    var selectFilter = function (newActiveFilter) { return dispatch((0,soapbox_actions_search__WEBPACK_IMPORTED_MODULE_2__.setFilter)(newActiveFilter)); };
    var renderFilterBar = function () {
        var items = [{
                text: intl.formatMessage(messages.statuses),
                action: function () { return selectFilter('statuses'); },
                name: 'statuses'
            }, {
                text: intl.formatMessage(messages.accounts),
                action: function () { return selectFilter('accounts'); },
                name: 'accounts'
            }, {
                text: intl.formatMessage(messages.hashtags),
                action: function () { return selectFilter('hashtags'); },
                name: 'hashtags'
            }];
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Tabs, {
            items: items,
            activeItem: selectedFilter,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 69,
                columnNumber: 12
            }
        });
    };
    var getCurrentIndex = function (id) {
        var _resultsIds;
        return (_resultsIds = resultsIds) === null || _resultsIds === void 0 ? void 0 : _resultsIds.keySeq().findIndex(function (key) { return key === id; });
    };
    var handleMoveUp = function (id) {
        if (!resultsIds)
            return;
        var elementIndex = getCurrentIndex(id) - 1;
        selectChild(elementIndex);
    };
    var handleMoveDown = function (id) {
        if (!resultsIds)
            return;
        var elementIndex = getCurrentIndex(id) + 1;
        selectChild(elementIndex);
    };
    var selectChild = function (index) {
        var _node$current;
        (_node$current = node.current) === null || _node$current === void 0 ? void 0 : _node$current.scrollIntoView({
            index: index,
            behavior: 'smooth',
            done: function () {
                var element = document.querySelector("#search-results [data-index=\"".concat(index, "\"] .focusable"));
                element === null || element === void 0 ? void 0 : element.focus();
            }
        });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_trending_statuses__WEBPACK_IMPORTED_MODULE_3__.fetchTrendingStatuses)());
    }, []);
    var searchResults;
    var hasMore = false;
    var loaded;
    var noResultsMessage;
    var placeholderComponent = soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_12__["default"];
    var resultsIds;
    if (selectedFilter === 'accounts') {
        hasMore = results.accountsHasMore;
        loaded = results.accountsLoaded;
        placeholderComponent = soapbox_features_placeholder_components_placeholder_account__WEBPACK_IMPORTED_MODULE_10__["default"];
        if (results.accounts && results.accounts.size > 0) {
            searchResults = results.accounts.map(function (accountId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_8__["default"], {
                key: accountId,
                id: accountId,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 118,
                    columnNumber: 57
                }
            }); });
        }
        else if (!submitted && suggestions && !suggestions.isEmpty()) {
            searchResults = suggestions.map(function (suggestion) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_8__["default"], {
                key: suggestion.account,
                id: suggestion.account,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 120,
                    columnNumber: 53
                }
            }); });
        }
        else if (loaded) {
            noResultsMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "empty-column-indicator",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 123,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__["default"], {
                id: "empty_column.search.accounts",
                defaultMessage: "There are no people results for \"{term}\"",
                values: {
                    term: value
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 124,
                    columnNumber: 11
                }
            }));
        }
    }
    if (selectedFilter === 'statuses') {
        hasMore = results.statusesHasMore;
        loaded = results.statusesLoaded;
        if (results.statuses && results.statuses.size > 0) {
            searchResults = results.statuses.map(function (statusId) {
                /*#__PURE__*/
                // @ts-ignore
                return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_9__["default"], {
                    key: statusId,
                    id: statusId,
                    onMoveUp: handleMoveUp,
                    onMoveDown: handleMoveDown,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 141,
                        columnNumber: 9
                    }
                });
            });
            resultsIds = results.statuses;
        }
        else if (!submitted && trendingStatuses && !trendingStatuses.isEmpty()) {
            searchResults = trendingStatuses.map(function (statusId) {
                /*#__PURE__*/
                // @ts-ignore
                return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_9__["default"], {
                    key: statusId,
                    id: statusId,
                    onMoveUp: handleMoveUp,
                    onMoveDown: handleMoveDown,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 152,
                        columnNumber: 9
                    }
                });
            });
            resultsIds = trendingStatuses;
        }
        else if (loaded) {
            noResultsMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "empty-column-indicator",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 162,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__["default"], {
                id: "empty_column.search.statuses",
                defaultMessage: "There are no posts results for \"{term}\"",
                values: {
                    term: value
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 163,
                    columnNumber: 11
                }
            }));
        }
    }
    if (selectedFilter === 'hashtags') {
        hasMore = results.hashtagsHasMore;
        loaded = results.hashtagsLoaded;
        placeholderComponent = soapbox_features_placeholder_components_placeholder_hashtag__WEBPACK_IMPORTED_MODULE_11__["default"];
        if (results.hashtags && results.hashtags.size > 0) {
            searchResults = results.hashtags.map(function (hashtag) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_hashtag__WEBPACK_IMPORTED_MODULE_4__["default"], {
                key: hashtag.name,
                hashtag: hashtag,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 179,
                    columnNumber: 55
                }
            }); });
        }
        else if (!submitted && suggestions && !suggestions.isEmpty()) {
            searchResults = trends.map(function (hashtag) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_hashtag__WEBPACK_IMPORTED_MODULE_4__["default"], {
                key: hashtag.name,
                hashtag: hashtag,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 181,
                    columnNumber: 45
                }
            }); });
        }
        else if (loaded) {
            noResultsMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "empty-column-indicator",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 184,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__["default"], {
                id: "empty_column.search.hashtags",
                defaultMessage: "There are no hashtags results for \"{term}\"",
                values: {
                    term: value
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 185,
                    columnNumber: 11
                }
            }));
        }
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, filterByAccount ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.HStack, {
        className: "mb-4 pb-4 px-2 border-solid border-b border-gray-200 dark:border-gray-800",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 198,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_5__["default"], {
        iconClassName: "h-5 w-5",
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
        onClick: handleClearSearch,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 199,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 200,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__["default"], {
        id: "search_results.filter_message",
        defaultMessage: "You are searching for posts from @{acct}.",
        values: {
            acct: account
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 201,
            columnNumber: 13
        }
    }))) : renderFilterBar(), noResultsMessage || /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "search-results",
        ref: node,
        key: selectedFilter,
        scrollKey: "".concat(selectedFilter, ":").concat(value),
        isLoading: submitted && !loaded,
        showLoading: submitted && !loaded && ((_searchResults = searchResults) === null || _searchResults === void 0 ? void 0 : _searchResults.isEmpty()),
        hasMore: hasMore,
        onLoadMore: handleLoadMore,
        placeholderComponent: placeholderComponent,
        placeholderCount: 20,
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()({
            'divide-gray-200 dark:divide-slate-700 divide-solid divide-y': selectedFilter === 'statuses'
        }),
        itemClassName: classnames__WEBPACK_IMPORTED_MODULE_0___default()({
            'pb-4': selectedFilter === 'accounts',
            'pb-3': selectedFilter === 'hashtags'
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 211,
            columnNumber: 9
        }
    }, searchResults || []));
};
/* harmony default export */ __webpack_exports__["default"] = (SearchResults);


/***/ }),

/***/ 1836:
/*!*****************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_account.tsx ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _placeholder_avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./placeholder_avatar */ 274);
/* harmony import */ var _placeholder_display_name__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeholder_display_name */ 446);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_account.tsx";



/** Fake account to display while data is loading. */
var PlaceholderAccount = function () {
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 9,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 10,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_avatar__WEBPACK_IMPORTED_MODULE_1__["default"], {
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_display_name__WEBPACK_IMPORTED_MODULE_2__["default"], {
        minLength: 3,
        maxLength: 25,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (PlaceholderAccount);


/***/ }),

/***/ 1837:
/*!*****************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_hashtag.tsx ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ 211);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_hashtag.tsx";


/** Fake hashtag to display while data is loading. */
var PlaceholderHashtag = function () {
    var length = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.randomIntFromInterval)(15, 30);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "placeholder-hashtag",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 10,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "trends__item",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "trends__item__name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 9
        }
    }, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.generateText)(length))));
};
/* harmony default export */ __webpack_exports__["default"] = (PlaceholderHashtag);


/***/ }),

/***/ 1567:
/*!***********************************************!*\
  !*** ./app/soapbox/features/search/index.tsx ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_compose_components_search__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/features/compose/components/search */ 947);
/* harmony import */ var soapbox_features_compose_components_search_results__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/compose/components/search_results */ 1835);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/search/index.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    heading: {
        "id": "column.search",
        "defaultMessage": "Search"
    }
});
var SearchPage = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Column, {
        withHeader: false,
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "space-y-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_compose_components_search__WEBPACK_IMPORTED_MODULE_2__["default"], {
        autoFocus: true,
        autoSubmit: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_compose_components_search_results__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (SearchPage);


/***/ })

}]);
//# sourceMappingURL=search-149420b7ec95e3068331.chunk.js.map