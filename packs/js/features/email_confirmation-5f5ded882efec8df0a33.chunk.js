"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[33],{

/***/ 1503:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/email_confirmation/index.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 28);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_security__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/security */ 309);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_errors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/utils/errors */ 872);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/email_confirmation/index.tsx";










var Statuses = {
    IDLE: 'IDLE',
    SUCCESS: 'SUCCESS',
    FAIL: 'FAIL'
};
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    success: {
        "id": "email_confirmation.success",
        "defaultMessage": "Your email has been confirmed!"
    }
});
var token = new URLSearchParams(window.location.search).get('confirmation_token');
var EmailConfirmation = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var _a = react__WEBPACK_IMPORTED_MODULE_2__.useState(Statuses.IDLE), status = _a[0], setStatus = _a[1];
    react__WEBPACK_IMPORTED_MODULE_2__.useEffect(function () {
        if (token) {
            dispatch((0,soapbox_actions_security__WEBPACK_IMPORTED_MODULE_3__.confirmChangedEmail)(token)).then(function () {
                setStatus(Statuses.SUCCESS);
                dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(intl.formatMessage(messages.success)));
            }).catch(function (error) {
                setStatus(Statuses.FAIL);
                if (error.response.data.error) {
                    var message = (0,soapbox_utils_errors__WEBPACK_IMPORTED_MODULE_7__.buildErrorMessage)(error.response.data.error);
                    dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].error(message // intl.formatMessage({
                    //   id: 'email_confirmation.fail',
                    //   defaultMessage,
                    // }),
                    ));
                }
            });
        }
    }, [token]);
    if (!token || status === Statuses.SUCCESS || status === Statuses.FAIL) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_10__.Redirect, {
            to: "/",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 62,
                columnNumber: 12
            }
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (EmailConfirmation);


/***/ })

}]);
//# sourceMappingURL=email_confirmation-5f5ded882efec8df0a33.chunk.js.map