"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[25],{

/***/ 2275:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/conversations/components/conversation.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/conversations */ 453);
/* harmony import */ var soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/containers/status_container */ 1571);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/conversations/components/conversation.tsx";





var Conversation = function (_ref) {
    var conversationId = _ref.conversationId, onMoveUp = _ref.onMoveUp, onMoveDown = _ref.onMoveDown;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_4__.useHistory)();
    var _a = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) {
        var conversation = state.conversations.items.find(function (x) { return x.id === conversationId; });
        return {
            accounts: conversation.accounts.map(function (accountId) { return state.accounts.get(accountId, null); }),
            unread: conversation.unread,
            lastStatusId: conversation.last_status || null
        };
    }), accounts = _a.accounts, unread = _a.unread, lastStatusId = _a.lastStatusId;
    var handleClick = function () {
        if (unread) {
            dispatch((0,soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_1__.markConversationRead)(conversationId));
        }
        history.push("/statuses/".concat(lastStatusId));
    };
    var handleHotkeyMoveUp = function () {
        onMoveUp(conversationId);
    };
    var handleHotkeyMoveDown = function () {
        onMoveDown(conversationId);
    };
    if (lastStatusId === null) {
        return null;
    }
    return (
    /*#__PURE__*/
    // @ts-ignore
    react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: lastStatusId,
        unread: unread,
        otherAccounts: accounts,
        onMoveUp: handleHotkeyMoveUp,
        onMoveDown: handleHotkeyMoveDown,
        onClick: handleClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 5
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (Conversation);


/***/ }),

/***/ 2514:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/conversations/components/conversations_list.tsx ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 168);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/conversations */ 453);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1565);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var _components_conversation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/conversation */ 2275);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/conversations/components/conversations_list.tsx";







var ConversationsList = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var conversations = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.conversations.items; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.conversations.isLoading; });
    var getCurrentIndex = function (id) { return conversations.findIndex(function (x) { return x.id === id; }); };
    var handleMoveUp = function (id) {
        var elementIndex = getCurrentIndex(id) - 1;
        selectChild(elementIndex);
    };
    var handleMoveDown = function (id) {
        var elementIndex = getCurrentIndex(id) + 1;
        selectChild(elementIndex);
    };
    var selectChild = function (index) {
        var _ref$current;
        (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.scrollIntoView({
            index: index,
            behavior: 'smooth',
            done: function () {
                var element = document.querySelector("#direct-list [data-index=\"".concat(index, "\"] .focusable"));
                if (element) {
                    element.focus();
                }
            }
        });
    };
    var handleLoadOlder = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function () {
        var maxId = conversations.getIn([-1, 'id']);
        if (maxId)
            dispatch((0,soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_2__.expandConversations)({
                maxId: maxId
            }));
    }, 300, {
        leading: true
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        onLoadMore: handleLoadOlder,
        id: "direct-list",
        scrollKey: "direct",
        ref: ref,
        isLoading: isLoading,
        showLoading: isLoading && conversations.size === 0,
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
            id: "empty_column.direct",
            defaultMessage: "You don't have any direct messages yet. When you send or receive one, it will show up here.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 59,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 5
        }
    }, conversations.map(function (item) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_conversation__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: item.id,
        conversationId: item.id,
        onMoveUp: handleMoveUp,
        onMoveDown: handleMoveDown,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (ConversationsList);


/***/ }),

/***/ 2074:
/*!******************************************************!*\
  !*** ./app/soapbox/features/conversations/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 29);
/* harmony import */ var soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/conversations */ 453);
/* harmony import */ var soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/streaming */ 211);
/* harmony import */ var soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/account_search */ 1922);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var _components_conversations_list__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/conversations_list */ 2514);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/conversations/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    title: {
        "id": "column.direct",
        "defaultMessage": "Direct messages"
    },
    searchPlaceholder: {
        "id": "direct.search_placeholder",
        "defaultMessage": "Send a message to\u2026"
    }
});
var ConversationsTimeline = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_2__.mountConversations)());
        dispatch((0,soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_2__.expandConversations)());
        var disconnect = dispatch((0,soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_3__.connectDirectStream)());
        return function () {
            dispatch((0,soapbox_actions_conversations__WEBPACK_IMPORTED_MODULE_2__.unmountConversations)());
            disconnect();
        };
    }, []);
    var handleSuggestion = function (accountId) {
        dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.directComposeById)(accountId));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
        label: intl.formatMessage(messages.title),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_4__["default"], {
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        onSelected: handleSuggestion,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_conversations_list__WEBPACK_IMPORTED_MODULE_7__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ConversationsTimeline);


/***/ })

}]);
//# sourceMappingURL=conversations-8c2a03d5db9152f6e5b9.chunk.js.map