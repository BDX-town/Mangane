"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[21],{

/***/ 2100:
/*!**************************************************!*\
  !*** ./app/soapbox/features/chats/chat-room.tsx ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/chats */ 59);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/selectors */ 31);
/* harmony import */ var soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/utils/accounts */ 125);
/* harmony import */ var soapbox_utils_state__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/utils/state */ 147);
/* harmony import */ var _components_chat_box__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/chat-box */ 1892);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/chat-room.tsx";









var getChat = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__.makeGetChat)();
/** Fullscreen chat UI. */
var ChatRoom = function (_ref) {
    var params = _ref.params;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var displayFqn = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(soapbox_utils_state__WEBPACK_IMPORTED_MODULE_6__.displayFqn);
    var inputElem = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var chat = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) {
        var chat = state.chats.items.get(params.chatId, (0,immutable__WEBPACK_IMPORTED_MODULE_8__.Map)()).toJS();
        return getChat(state, chat);
    });
    var focusInput = function () {
        var _inputElem$current;
        (_inputElem$current = inputElem.current) === null || _inputElem$current === void 0 ? void 0 : _inputElem$current.focus();
    };
    var handleInputRef = function (el) {
        inputElem.current = el;
        focusInput();
    };
    var markRead = function () {
        if (!chat)
            return;
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_1__.markChatRead)(chat.id));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_1__.fetchChat)(params.chatId));
        markRead();
    }, [params.chatId]); // If this component is loaded at all, we can instantly mark new messages as read.
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        markRead();
    }, [chat === null || chat === void 0 ? void 0 : chat.unread]);
    if (!chat)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Column, {
        label: "@".concat((0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_5__.getAcct)(chat.account, displayFqn)),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_chat_box__WEBPACK_IMPORTED_MODULE_7__["default"], {
        chatId: chat.id,
        onSetInputRef: handleInputRef,
        autosize: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ChatRoom);


/***/ })

}]);
//# sourceMappingURL=chat_room-acf44c816d1521bd6d50.chunk.js.map