"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[206],{

/***/ 1594:
/*!************************************************************!*\
  !*** ./app/soapbox/features/ui/components/embed_modal.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/api */ 9);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/embed_modal.tsx";






var fetchEmbed = function (url) {
    return function (dispatch, getState) {
        return (0,soapbox_api__WEBPACK_IMPORTED_MODULE_2__["default"])(getState).get('/api/oembed', {
            params: {
                url: url
            }
        });
    };
};
var EmbedModal = function (_ref) {
    var url = _ref.url, onError = _ref.onError;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var iframe = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null), oembed = _a[0], setOembed = _a[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch(fetchEmbed(url)).then(function (_ref2) {
            var _iframe$current;
            var data = _ref2.data;
            if (!((_iframe$current = iframe.current) !== null && _iframe$current !== void 0 && _iframe$current.contentWindow))
                return;
            setOembed(data);
            var iframeDocument = iframe.current.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write(data.html);
            iframeDocument.close();
            var innerFrame = iframeDocument.querySelector('iframe');
            iframeDocument.body.style.margin = '0';
            if (innerFrame) {
                innerFrame.width = '100%';
            }
        }).catch(function (error) {
            onError(error);
        });
    }, [!!iframe.current]);
    var handleInputClick = function (e) {
        e.currentTarget.select();
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
            id: "status.embed",
            defaultMessage: "Embed",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 56,
                columnNumber: 19
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "embed.instructions",
        defaultMessage: "Embed this post on your website by copying the code below.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Input, {
        type: "text",
        readOnly: true,
        value: (oembed === null || oembed === void 0 ? void 0 : oembed.html) || '',
        onClick: handleInputClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("iframe", {
        className: "inline-flex rounded-xl overflow-hidden max-w-full",
        frameBorder: "0",
        ref: iframe,
        sandbox: "allow-same-origin",
        title: "preview",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (EmbedModal);


/***/ })

}]);
//# sourceMappingURL=embed_modal-8a584e53d872b65c5a52.chunk.js.map