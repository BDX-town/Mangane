"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[56],{

/***/ 2104:
/*!***************************************************!*\
  !*** ./app/soapbox/features/new_status/index.tsx ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/sub_navigation */ 837);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _compose_containers_compose_form_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../compose/containers/compose_form_container */ 1847);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/new_status/index.tsx";






var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    edit: {
        "id": "navigation_bar.compose_edit",
        "defaultMessage": "Edit post"
    },
    direct: {
        "id": "navigation_bar.compose_direct",
        "defaultMessage": "Direct message"
    },
    reply: {
        "id": "navigation_bar.compose_reply",
        "defaultMessage": "Reply to post"
    },
    quote: {
        "id": "navigation_bar.compose_quote",
        "defaultMessage": "Quote post"
    },
    compose: {
        "id": "navigation_bar.compose",
        "defaultMessage": "Compose new post"
    }
});
var NewStatus = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var statusId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.compose.id; });
    var privacy = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.compose.privacy; });
    var inReplyTo = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.compose.in_reply_to; });
    var quote = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.compose.quote; });
    var renderTitle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
        if (statusId) {
            return intl.formatMessage(messages.edit);
        }
        else if (privacy === 'direct') {
            return intl.formatMessage(messages.direct);
        }
        else if (inReplyTo) {
            return intl.formatMessage(messages.reply);
        }
        else if (quote) {
            return intl.formatMessage(messages.quote);
        }
        else {
            return intl.formatMessage(messages.compose);
        }
    }, [intl, statusId, privacy, inReplyTo, quote]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Column, {
        label: renderTitle,
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "px-4 pt-4 sm:p-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_1__["default"], {
        message: renderTitle,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "block w-full p-6 mx-auto text-left align-middle transition-all bg-white dark:bg-slate-800 text-black dark:text-white rounded-none sm:rounded-2xl pointer-events-auto max-w-xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_compose_containers_compose_form_container__WEBPACK_IMPORTED_MODULE_4__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (NewStatus);


/***/ })

}]);
//# sourceMappingURL=new_status-21e8fd9d08e7fd1299ab.chunk.js.map