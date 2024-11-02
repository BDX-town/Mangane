"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[51],{

/***/ 1908:
/*!********************************************!*\
  !*** ./app/soapbox/actions/import_data.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IMPORT_BLOCKS_FAIL": function() { return /* binding */ IMPORT_BLOCKS_FAIL; },
/* harmony export */   "IMPORT_BLOCKS_REQUEST": function() { return /* binding */ IMPORT_BLOCKS_REQUEST; },
/* harmony export */   "IMPORT_BLOCKS_SUCCESS": function() { return /* binding */ IMPORT_BLOCKS_SUCCESS; },
/* harmony export */   "IMPORT_FOLLOWS_FAIL": function() { return /* binding */ IMPORT_FOLLOWS_FAIL; },
/* harmony export */   "IMPORT_FOLLOWS_REQUEST": function() { return /* binding */ IMPORT_FOLLOWS_REQUEST; },
/* harmony export */   "IMPORT_FOLLOWS_SUCCESS": function() { return /* binding */ IMPORT_FOLLOWS_SUCCESS; },
/* harmony export */   "IMPORT_MUTES_FAIL": function() { return /* binding */ IMPORT_MUTES_FAIL; },
/* harmony export */   "IMPORT_MUTES_REQUEST": function() { return /* binding */ IMPORT_MUTES_REQUEST; },
/* harmony export */   "IMPORT_MUTES_SUCCESS": function() { return /* binding */ IMPORT_MUTES_SUCCESS; },
/* harmony export */   "importBlocks": function() { return /* binding */ importBlocks; },
/* harmony export */   "importFollows": function() { return /* binding */ importFollows; },
/* harmony export */   "importMutes": function() { return /* binding */ importMutes; }
/* harmony export */ });
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api */ 9);



var IMPORT_FOLLOWS_REQUEST = 'IMPORT_FOLLOWS_REQUEST';
var IMPORT_FOLLOWS_SUCCESS = 'IMPORT_FOLLOWS_SUCCESS';
var IMPORT_FOLLOWS_FAIL = 'IMPORT_FOLLOWS_FAIL';
var IMPORT_BLOCKS_REQUEST = 'IMPORT_BLOCKS_REQUEST';
var IMPORT_BLOCKS_SUCCESS = 'IMPORT_BLOCKS_SUCCESS';
var IMPORT_BLOCKS_FAIL = 'IMPORT_BLOCKS_FAIL';
var IMPORT_MUTES_REQUEST = 'IMPORT_MUTES_REQUEST';
var IMPORT_MUTES_SUCCESS = 'IMPORT_MUTES_SUCCESS';
var IMPORT_MUTES_FAIL = 'IMPORT_MUTES_FAIL';
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    blocksSuccess: {
        "id": "import_data.success.blocks",
        "defaultMessage": "Blocks imported successfully"
    },
    followersSuccess: {
        "id": "import_data.success.followers",
        "defaultMessage": "Followers imported successfully"
    },
    mutesSuccess: {
        "id": "import_data.success.mutes",
        "defaultMessage": "Mutes imported successfully"
    }
});
var importFollows = function (params) { return function (dispatch, getState) {
    dispatch({
        type: IMPORT_FOLLOWS_REQUEST
    });
    return (0,_api__WEBPACK_IMPORTED_MODULE_1__["default"])(getState).post('/api/pleroma/follow_import', params).then(function (response) {
        dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_0__["default"].success(messages.followersSuccess));
        dispatch({
            type: IMPORT_FOLLOWS_SUCCESS,
            config: response.data
        });
    }).catch(function (error) {
        dispatch({
            type: IMPORT_FOLLOWS_FAIL,
            error: error
        });
    });
}; };
var importBlocks = function (params) { return function (dispatch, getState) {
    dispatch({
        type: IMPORT_BLOCKS_REQUEST
    });
    return (0,_api__WEBPACK_IMPORTED_MODULE_1__["default"])(getState).post('/api/pleroma/blocks_import', params).then(function (response) {
        dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_0__["default"].success(messages.blocksSuccess));
        dispatch({
            type: IMPORT_BLOCKS_SUCCESS,
            config: response.data
        });
    }).catch(function (error) {
        dispatch({
            type: IMPORT_BLOCKS_FAIL,
            error: error
        });
    });
}; };
var importMutes = function (params) { return function (dispatch, getState) {
    dispatch({
        type: IMPORT_MUTES_REQUEST
    });
    return (0,_api__WEBPACK_IMPORTED_MODULE_1__["default"])(getState).post('/api/pleroma/mutes_import', params).then(function (response) {
        dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_0__["default"].success(messages.mutesSuccess));
        dispatch({
            type: IMPORT_MUTES_SUCCESS,
            config: response.data
        });
    }).catch(function (error) {
        dispatch({
            type: IMPORT_MUTES_FAIL,
            error: error
        });
    });
}; };


/***/ }),

/***/ 1909:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/import_data/components/csv_importer.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/import_data/components/csv_importer.tsx";





var CSVImporter = function (_ref) {
    var messages = _ref.messages, action = _ref.action;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null), file = _b[0], setFile = _b[1];
    var handleSubmit = function (event) {
        var params = new FormData();
        params.append('list', file);
        setIsLoading(true);
        dispatch(action(params)).then(function () {
            setIsLoading(false);
        }).catch(function () {
            setIsLoading(false);
        });
        event.preventDefault();
    };
    var handleFileChange = function (e) {
        var _e$target$files;
        var file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files.item(0);
        setFile(file);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        size: "xl",
        weight: "bold",
        tag: "label",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.input_label)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.FormGroup, {
        hintText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
            theme: "muted",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 48,
                columnNumber: 19
            }
        }, intl.formatMessage(messages.input_hint)),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.FileInput, {
        accept: ".csv,text/csv",
        onChange: handleFileChange,
        required: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
        type: "submit",
        theme: "primary",
        disabled: isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.submit))));
};
/* harmony default export */ __webpack_exports__["default"] = (CSVImporter);


/***/ }),

/***/ 1531:
/*!****************************************************!*\
  !*** ./app/soapbox/features/import_data/index.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_import_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/import_data */ 1908);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/components/column */ 875);
/* harmony import */ var _components_csv_importer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/csv_importer */ 1909);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/import_data/index.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    heading: {
        "id": "column.import_data",
        "defaultMessage": "Import data"
    },
    submit: {
        "id": "import_data.actions.import",
        "defaultMessage": "Import"
    }
});
var followMessages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    input_label: {
        "id": "import_data.follows_label",
        "defaultMessage": "Follows"
    },
    input_hint: {
        "id": "import_data.hints.follows",
        "defaultMessage": "CSV file containing a list of followed accounts"
    },
    submit: {
        "id": "import_data.actions.import_follows",
        "defaultMessage": "Import follows"
    }
});
var blockMessages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    input_label: {
        "id": "import_data.blocks_label",
        "defaultMessage": "Blocks"
    },
    input_hint: {
        "id": "import_data.hints.blocks",
        "defaultMessage": "CSV file containing a list of blocked accounts"
    },
    submit: {
        "id": "import_data.actions.import_blocks",
        "defaultMessage": "Import blocks"
    }
});
var muteMessages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    input_label: {
        "id": "import_data.mutes_label",
        "defaultMessage": "Mutes"
    },
    input_hint: {
        "id": "import_data.hints.mutes",
        "defaultMessage": "CSV file containing a list of muted accounts"
    },
    submit: {
        "id": "import_data.actions.import_mutes",
        "defaultMessage": "Import mutes"
    }
});
var ImportData = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_2__["default"], {
        icon: "cloud-upload-alt",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_csv_importer__WEBPACK_IMPORTED_MODULE_3__["default"], {
        action: soapbox_actions_import_data__WEBPACK_IMPORTED_MODULE_1__.importFollows,
        messages: followMessages,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_csv_importer__WEBPACK_IMPORTED_MODULE_3__["default"], {
        action: soapbox_actions_import_data__WEBPACK_IMPORTED_MODULE_1__.importBlocks,
        messages: blockMessages,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_csv_importer__WEBPACK_IMPORTED_MODULE_3__["default"], {
        action: soapbox_actions_import_data__WEBPACK_IMPORTED_MODULE_1__.importMutes,
        messages: muteMessages,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ImportData);


/***/ })

}]);
//# sourceMappingURL=import_data-9a5aaef0a6b30c04f142.chunk.js.map