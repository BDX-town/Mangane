"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[22],{

/***/ 1892:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/chats/components/audio-toggle.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_toggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-toggle */ 834);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/components/audio-toggle.tsx";






var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    switchOn: {
        "id": "chats.audio_toggle_on",
        "defaultMessage": "Audio notification on"
    },
    switchOff: {
        "id": "chats.audio_toggle_off",
        "defaultMessage": "Audio notification off"
    }
});
var AudioToggle = function (_ref) {
    var showLabel = _ref.showLabel;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var checked = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return !!(0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__.getSettings)(state).getIn(['chats', 'sound']); });
    var handleToggleAudio = function () {
        dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__.changeSetting)(['chats', 'sound'], !checked));
    };
    var id = 'chats-audio-toggle';
    var label = intl.formatMessage(checked ? messages.switchOff : messages.switchOn);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "audio-toggle react-toggle--mini",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "setting-toggle",
        "aria-label": label,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: id,
        checked: checked,
        onChange: handleToggleAudio // onKeyDown={this.onKeyDown}
        ,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 9
        }
    }), showLabel && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("label", {
        htmlFor: id,
        className: "setting-toggle__label",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 24
        }
    }, label)));
};
/* harmony default export */ __webpack_exports__["default"] = (AudioToggle);


/***/ }),

/***/ 1584:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/chats/components/chat-panes.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! reselect */ 63);
/* harmony import */ var soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/chats */ 55);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/account_search */ 1363);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_chats_components_audio_toggle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/chats/components/audio-toggle */ 1892);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _chat_list__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./chat-list */ 1374);
/* harmony import */ var _chat_window__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./chat-window */ 1893);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/components/chat-panes.tsx";













var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__.defineMessages)({
    searchPlaceholder: {
        "id": "chats.search_placeholder",
        "defaultMessage": "Start a chat with\u2026"
    }
});
var getChatsUnreadCount = function (state) {
    var chats = state.chats.items;
    return chats.reduce(function (acc, curr) { return acc + Math.min(curr.get('unread', 0), 1); }, 0);
}; // Filter out invalid chats
var normalizePanes = function (chats) {
    var panes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0,immutable__WEBPACK_IMPORTED_MODULE_11__.List)();
    return panes.filter(function (pane) { return chats.get(pane.get('chat_id')); });
};
var makeNormalizeChatPanes = function () { return (0,reselect__WEBPACK_IMPORTED_MODULE_1__.createSelector)([function (state) { return state.chats.items; }, function (state) { return (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__.getSettings)(state).getIn(['chats', 'panes']); }], normalizePanes); };
var normalizeChatPanes = makeNormalizeChatPanes();
var ChatPanes = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_13__.useHistory)();
    var panes = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return normalizeChatPanes(state); });
    var mainWindowState = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useSettings)().getIn(['chats', 'mainWindow']);
    var unreadCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return getChatsUnreadCount(state); });
    var handleClickChat = function (chat) {
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__.openChat)(chat.id));
    };
    var handleSuggestion = function (accountId) {
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__.launchChat)(accountId, history));
    };
    var handleMainWindowToggle = function () {
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__.toggleMainWindow)());
    };
    var open = mainWindowState === 'open';
    var mainWindowPane = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pane pane--main pane--".concat(mainWindowState),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pane__header",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 7
        }
    }, unreadCount > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mr-2 flex-none",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Counter, {
        count: unreadCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
        className: "pane__title",
        onClick: handleMainWindowToggle,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
        id: "chat_panels.main_window.title",
        defaultMessage: "Chats",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_chats_components_audio_toggle__WEBPACK_IMPORTED_MODULE_6__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pane__content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 7
        }
    }, open && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chat_list__WEBPACK_IMPORTED_MODULE_8__["default"], {
        onClickChat: handleClickChat,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_4__["default"], {
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        onSelected: handleSuggestion,
        resultsPosition: "above",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 13
        }
    }))));
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "chat-panes",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 5
        }
    }, mainWindowPane, panes.map(function (pane, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chat_window__WEBPACK_IMPORTED_MODULE_9__["default"], {
        idx: i,
        key: pane.get('chat_id'),
        chatId: pane.get('chat_id'),
        windowState: pane.get('state'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (ChatPanes);


/***/ }),

/***/ 1893:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/chats/components/chat-window.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/chats */ 55);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/avatar */ 407);
/* harmony import */ var soapbox_components_hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/hover_ref_wrapper */ 260);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon_button */ 405);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/utils/accounts */ 122);
/* harmony import */ var soapbox_utils_state__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/utils/state */ 145);
/* harmony import */ var _chat_box__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./chat-box */ 1375);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/components/chat-window.tsx";












var getChat = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetChat)();
/** Floating desktop chat window. */
var ChatWindow = function (_ref) {
    var idx = _ref.idx, chatId = _ref.chatId, windowState = _ref.windowState;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var displayFqn = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(soapbox_utils_state__WEBPACK_IMPORTED_MODULE_9__.displayFqn);
    var chat = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var chat = state.chats.items.get(chatId);
        return chat ? getChat(state, chat.toJS()) : undefined;
    });
    var inputElem = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var handleChatClose = function (chatId) {
        return function () {
            dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_1__.closeChat)(chatId));
        };
    };
    var handleChatToggle = function (chatId) {
        return function () {
            dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_1__.toggleChat)(chatId));
        };
    };
    var handleInputRef = function (el) {
        inputElem.current = el;
    };
    var focusInput = function () {
        var _inputElem$current;
        (_inputElem$current = inputElem.current) === null || _inputElem$current === void 0 ? void 0 : _inputElem$current.focus();
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        if (windowState === 'open') {
            focusInput();
        }
    }, [windowState]);
    if (!chat)
        return null;
    var account = chat.account;
    var right = 285 * (idx + 1) + 20;
    var unreadCount = chat.unread;
    var unreadIcon = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mr-2 flex-none",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Counter, {
        count: unreadCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 7
        }
    }));
    var avatar = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_3__["default"], {
        accountId: account.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.Link, {
        to: "/@".concat(account.acct),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_2__["default"], {
        account: account,
        size: 18,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 9
        }
    })));
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pane pane--".concat(windowState),
        style: {
            right: "".concat(right, "px")
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        space: 2,
        className: "pane__header",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 7
        }
    }, unreadCount > 0 ? unreadIcon : avatar, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
        className: "pane__title",
        onClick: handleChatToggle(chat.id),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 9
        }
    }, "@", (0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_8__.getAcct)(account, displayFqn)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pane__close",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
        title: "Close chat",
        onClick: handleChatClose(chat.id),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pane__content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_chat_box__WEBPACK_IMPORTED_MODULE_10__["default"], {
        chatId: chat.id,
        onSetInputRef: handleInputRef,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 105,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ChatWindow);


/***/ })

}]);
//# sourceMappingURL=chat_panes-eb01d0699659696946a0.chunk.js.map