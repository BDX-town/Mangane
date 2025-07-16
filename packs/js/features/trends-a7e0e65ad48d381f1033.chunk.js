"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[72],{

/***/ 2207:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/ui/components/trends-panel.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_hashtag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/hashtag */ 1809);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_queries_trends__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/queries/trends */ 2373);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/trends-panel.tsx";





var TrendsPanel = function (_ref) {
    var limit = _ref.limit;
    var _a = (0,soapbox_queries_trends__WEBPACK_IMPORTED_MODULE_3__["default"])(), trends = _a.data, isFetching = _a.isFetching;
    if ((trends === null || trends === void 0 ? void 0 : trends.length) === 0 || isFetching) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
            id: "trends.title",
            defaultMessage: "Trends",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 20,
                columnNumber: 20
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    }, trends === null || trends === void 0 ? void 0 : trends.slice(0, limit).map(function (hashtag) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_hashtag__WEBPACK_IMPORTED_MODULE_1__["default"], {
        key: hashtag.name,
        hashtag: hashtag,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (TrendsPanel);


/***/ }),

/***/ 2373:
/*!***************************************!*\
  !*** ./app/soapbox/queries/trends.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ useTrends; }
/* harmony export */ });
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ 236);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var soapbox_actions_trends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! soapbox/actions/trends */ 867);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_normalizers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/normalizers */ 32);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




function useTrends() {
    var _this = this;
    var api = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_1__.useApi)();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_1__.useAppDispatch)();
    var getTrends = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, normalizedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/api/v1/trends')];
                case 1:
                    data = (_a.sent()).data;
                    dispatch((0,soapbox_actions_trends__WEBPACK_IMPORTED_MODULE_0__.fetchTrendsSuccess)(data));
                    normalizedData = data.map(function (tag) { return (0,soapbox_normalizers__WEBPACK_IMPORTED_MODULE_2__.normalizeTag)(tag); });
                    return [2 /*return*/, normalizedData];
            }
        });
    }); };
    var result = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useQuery)(['trends'], getTrends, {
        placeholderData: [],
        staleTime: 600000 // 10 minutes
    });
    return result;
}


/***/ })

}]);
//# sourceMappingURL=trends-a7e0e65ad48d381f1033.chunk.js.map