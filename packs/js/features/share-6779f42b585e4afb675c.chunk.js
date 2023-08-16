"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[70],{

/***/ 2080:
/*!**********************************************!*\
  !*** ./app/soapbox/features/share/index.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 25);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/compose */ 30);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/share/index.tsx";






var Share = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var search = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useLocation)().search;
    var params = new URLSearchParams(search);
    var text = [params.get('title'), params.get('text'), params.get('url')].filter(function (v) { return v; }).join('\n\n');
    if (text) {
        dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_3__.openComposeWithText)(text));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_5__.Redirect, {
        to: "/",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (Share);


/***/ })

}]);
//# sourceMappingURL=share-6779f42b585e4afb675c.chunk.js.map