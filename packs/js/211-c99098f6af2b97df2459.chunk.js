"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[211],{

/***/ 1536:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/authorize_interaction/index.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ AuthorizeInteraction; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 28);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/utils/accounts */ 97);
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/authorize_interaction/index.tsx";





function AuthorizeInteraction() {
    var acct = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)((0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_3__.getAcctFormURL)(new URLSearchParams(window.location.search).get('uri')));
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_4__.Redirect, {
        to: !acct.current ? '/404' : "/".concat(acct.current),
        __self: this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 5
        }
    });
}


/***/ })

}]);
//# sourceMappingURL=211-c99098f6af2b97df2459.chunk.js.map