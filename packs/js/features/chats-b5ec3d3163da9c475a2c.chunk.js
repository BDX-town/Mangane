"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[18],{

/***/ 2065:
/*!**********************************************!*\
  !*** ./app/soapbox/features/chats/index.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/chats */ 55);
/* harmony import */ var soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/account_search */ 1845);
/* harmony import */ var _components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/ui */ 1);
/* harmony import */ var _components_chat_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/chat-list */ 1856);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/chats/index.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    title: {
        "id": "column.chats",
        "defaultMessage": "Chats"
    },
    searchPlaceholder: {
        "id": "chats.search_placeholder",
        "defaultMessage": "Start a chat with\u2026"
    }
});
var ChatIndex = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useHistory)();
    var handleSuggestion = function (accountId) {
        dispatch((0,soapbox_actions_chats__WEBPACK_IMPORTED_MODULE_2__.launchChat)(accountId, history, true));
    };
    var handleClickChat = function (chat) {
        history.push("/chats/".concat(chat.id));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_ui__WEBPACK_IMPORTED_MODULE_4__.Column, {
        withHeader: false,
        label: intl.formatMessage(messages.title),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "my-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_account_search__WEBPACK_IMPORTED_MODULE_3__["default"], {
        placeholder: intl.formatMessage(messages.searchPlaceholder),
        onSelected: handleSuggestion,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_chat_list__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onClickChat: handleClickChat,
        useWindowScroll: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ChatIndex);


/***/ })

}]);
//# sourceMappingURL=chats-b5ec3d3163da9c475a2c.chunk.js.map