"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[36],{

/***/ 1815:
/*!********************************************!*\
  !*** ./app/soapbox/actions/export_data.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EXPORT_BLOCKS_FAIL": function() { return /* binding */ EXPORT_BLOCKS_FAIL; },
/* harmony export */   "EXPORT_BLOCKS_REQUEST": function() { return /* binding */ EXPORT_BLOCKS_REQUEST; },
/* harmony export */   "EXPORT_BLOCKS_SUCCESS": function() { return /* binding */ EXPORT_BLOCKS_SUCCESS; },
/* harmony export */   "EXPORT_FOLLOWS_FAIL": function() { return /* binding */ EXPORT_FOLLOWS_FAIL; },
/* harmony export */   "EXPORT_FOLLOWS_REQUEST": function() { return /* binding */ EXPORT_FOLLOWS_REQUEST; },
/* harmony export */   "EXPORT_FOLLOWS_SUCCESS": function() { return /* binding */ EXPORT_FOLLOWS_SUCCESS; },
/* harmony export */   "EXPORT_MUTES_FAIL": function() { return /* binding */ EXPORT_MUTES_FAIL; },
/* harmony export */   "EXPORT_MUTES_REQUEST": function() { return /* binding */ EXPORT_MUTES_REQUEST; },
/* harmony export */   "EXPORT_MUTES_SUCCESS": function() { return /* binding */ EXPORT_MUTES_SUCCESS; },
/* harmony export */   "exportBlocks": function() { return /* binding */ exportBlocks; },
/* harmony export */   "exportFollows": function() { return /* binding */ exportFollows; },
/* harmony export */   "exportMutes": function() { return /* binding */ exportMutes; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/snackbar */ 24);
/* harmony import */ var soapbox_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/api */ 9);
/* harmony import */ var soapbox_normalizers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/normalizers */ 33);
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





var EXPORT_FOLLOWS_REQUEST = 'EXPORT_FOLLOWS_REQUEST';
var EXPORT_FOLLOWS_SUCCESS = 'EXPORT_FOLLOWS_SUCCESS';
var EXPORT_FOLLOWS_FAIL = 'EXPORT_FOLLOWS_FAIL';
var EXPORT_BLOCKS_REQUEST = 'EXPORT_BLOCKS_REQUEST';
var EXPORT_BLOCKS_SUCCESS = 'EXPORT_BLOCKS_SUCCESS';
var EXPORT_BLOCKS_FAIL = 'EXPORT_BLOCKS_FAIL';
var EXPORT_MUTES_REQUEST = 'EXPORT_MUTES_REQUEST';
var EXPORT_MUTES_SUCCESS = 'EXPORT_MUTES_SUCCESS';
var EXPORT_MUTES_FAIL = 'EXPORT_MUTES_FAIL';
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    blocksSuccess: {
        "id": "export_data.success.blocks",
        "defaultMessage": "Blocks exported successfully"
    },
    followersSuccess: {
        "id": "export_data.success.followers",
        "defaultMessage": "Followers exported successfully"
    },
    mutesSuccess: {
        "id": "export_data.success.mutes",
        "defaultMessage": "Mutes exported successfully"
    }
});
function fileExport(content, fileName) {
    var fileToDownload = document.createElement('a');
    fileToDownload.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(content));
    fileToDownload.setAttribute('download', fileName);
    fileToDownload.style.display = 'none';
    document.body.appendChild(fileToDownload);
    fileToDownload.click();
    document.body.removeChild(fileToDownload);
}
var listAccounts = function (getState) { return function (apiResponse) { return __awaiter(void 0, void 0, void 0, function () {
    var followings, accounts, next;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                followings = apiResponse.data;
                accounts = [];
                next = (0,soapbox_api__WEBPACK_IMPORTED_MODULE_2__.getLinks)(apiResponse).refs.find(function (link) { return link.rel === 'next'; });
                _a.label = 1;
            case 1:
                if (!next) return [3 /*break*/, 3];
                return [4 /*yield*/, (0,soapbox_api__WEBPACK_IMPORTED_MODULE_2__["default"])(getState).get(next.uri)];
            case 2:
                apiResponse = _a.sent();
                next = (0,soapbox_api__WEBPACK_IMPORTED_MODULE_2__.getLinks)(apiResponse).refs.find(function (link) { return link.rel === 'next'; });
                Array.prototype.push.apply(followings, apiResponse.data);
                return [3 /*break*/, 1];
            case 3:
                accounts = followings.map(function (account) { return (0,soapbox_normalizers__WEBPACK_IMPORTED_MODULE_3__.normalizeAccount)(account).fqn; });
                return [2 /*return*/, Array.from(new Set(accounts))];
        }
    });
}); }; };
var exportFollows = function () { return function (dispatch, getState) {
    dispatch({
        type: EXPORT_FOLLOWS_REQUEST
    });
    var me = getState().me;
    return (0,soapbox_api__WEBPACK_IMPORTED_MODULE_2__["default"])(getState).get("/api/v1/accounts/".concat(me, "/following?limit=40")).then(listAccounts(getState)).then(function (followings) {
        followings = followings.map(function (fqn) { return fqn + ',true'; });
        followings.unshift('Account address,Show boosts');
        fileExport(followings.join('\n'), 'export_followings.csv');
        dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_1__["default"].success(messages.followersSuccess));
        dispatch({
            type: EXPORT_FOLLOWS_SUCCESS
        });
    }).catch(function (error) {
        dispatch({
            type: EXPORT_FOLLOWS_FAIL,
            error: error
        });
    });
}; };
var exportBlocks = function () { return function (dispatch, getState) {
    dispatch({
        type: EXPORT_BLOCKS_REQUEST
    });
    return (0,soapbox_api__WEBPACK_IMPORTED_MODULE_2__["default"])(getState).get('/api/v1/blocks?limit=40').then(listAccounts(getState)).then(function (blocks) {
        fileExport(blocks.join('\n'), 'export_block.csv');
        dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_1__["default"].success(messages.blocksSuccess));
        dispatch({
            type: EXPORT_BLOCKS_SUCCESS
        });
    }).catch(function (error) {
        dispatch({
            type: EXPORT_BLOCKS_FAIL,
            error: error
        });
    });
}; };
var exportMutes = function () { return function (dispatch, getState) {
    dispatch({
        type: EXPORT_MUTES_REQUEST
    });
    return (0,soapbox_api__WEBPACK_IMPORTED_MODULE_2__["default"])(getState).get('/api/v1/mutes?limit=40').then(listAccounts(getState)).then(function (mutes) {
        fileExport(mutes.join('\n'), 'export_mutes.csv');
        dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_1__["default"].success(messages.mutesSuccess));
        dispatch({
            type: EXPORT_MUTES_SUCCESS
        });
    }).catch(function (error) {
        dispatch({
            type: EXPORT_MUTES_FAIL,
            error: error
        });
    });
}; };


/***/ }),

/***/ 1816:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/export_data/components/csv_exporter.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/export_data/components/csv_exporter.tsx";





var CSVExporter = function (_ref) {
    var messages = _ref.messages, action = _ref.action;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var handleClick = function (event) {
        setIsLoading(true);
        dispatch(action()).then(function () {
            setIsLoading(false);
        }).catch(function () {
            setIsLoading(false);
        });
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Form, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        size: "xl",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.input_label)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.input_hint)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
        theme: "primary",
        onClick: handleClick,
        disabled: isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.submit))));
};
/* harmony default export */ __webpack_exports__["default"] = (CSVExporter);


/***/ }),

/***/ 1626:
/*!****************************************************!*\
  !*** ./app/soapbox/features/export_data/index.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_actions_export_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/export_data */ 1815);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/components/column */ 907);
/* harmony import */ var _components_csv_exporter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/csv_exporter */ 1816);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/export_data/index.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    heading: {
        "id": "column.export_data",
        "defaultMessage": "Export data"
    },
    submit: {
        "id": "export_data.actions.export",
        "defaultMessage": "Export"
    }
});
var followMessages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    input_label: {
        "id": "export_data.follows_label",
        "defaultMessage": "Follows"
    },
    input_hint: {
        "id": "export_data.hints.follows",
        "defaultMessage": "Get a CSV file containing a list of followed accounts"
    },
    submit: {
        "id": "export_data.actions.export_follows",
        "defaultMessage": "Export follows"
    }
});
var blockMessages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    input_label: {
        "id": "export_data.blocks_label",
        "defaultMessage": "Blocks"
    },
    input_hint: {
        "id": "export_data.hints.blocks",
        "defaultMessage": "Get a CSV file containing a list of blocked accounts"
    },
    submit: {
        "id": "export_data.actions.export_blocks",
        "defaultMessage": "Export blocks"
    }
});
var muteMessages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    input_label: {
        "id": "export_data.mutes_label",
        "defaultMessage": "Mutes"
    },
    input_hint: {
        "id": "export_data.hints.mutes",
        "defaultMessage": "Get a CSV file containing a list of muted accounts"
    },
    submit: {
        "id": "export_data.actions.export_mutes",
        "defaultMessage": "Export mutes"
    }
});
var ExportData = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_2__["default"], {
        icon: "cloud-download-alt",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_csv_exporter__WEBPACK_IMPORTED_MODULE_3__["default"], {
        action: soapbox_actions_export_data__WEBPACK_IMPORTED_MODULE_1__.exportFollows,
        messages: followMessages,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_csv_exporter__WEBPACK_IMPORTED_MODULE_3__["default"], {
        action: soapbox_actions_export_data__WEBPACK_IMPORTED_MODULE_1__.exportBlocks,
        messages: blockMessages,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_csv_exporter__WEBPACK_IMPORTED_MODULE_3__["default"], {
        action: soapbox_actions_export_data__WEBPACK_IMPORTED_MODULE_1__.exportMutes,
        messages: muteMessages,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ExportData);


/***/ })

}]);
//# sourceMappingURL=export_data-ed09ac2e020aaffa9f23.chunk.js.map