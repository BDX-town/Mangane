"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[205],{

/***/ 1646:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/compare_history_modal.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_history__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/history */ 962);
/* harmony import */ var soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/attachment-thumbs */ 424);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/compare_history_modal.tsx";







var CompareHistoryModal = function (_ref) {
    var onClose = _ref.onClose, statusId = _ref.statusId;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var loading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.history.getIn([statusId, 'loading']); }); // @ts-ignore
    var versions = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.history.getIn([statusId, 'items']); });
    var onClickClose = function () {
        onClose('COMPARE_HISTORY');
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_history__WEBPACK_IMPORTED_MODULE_2__.fetchHistory)(statusId));
    }, [statusId]);
    var body;
    if (loading) {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 36,
                columnNumber: 12
            }
        });
    }
    else {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "divide-y divide-solid divide-gray-200 dark:divide-slate-700",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 39,
                columnNumber: 7
            }
        }, versions === null || versions === void 0 ? void 0 : versions.map(function (version) {
            var _version$spoiler_text;
            var content = {
                __html: version.contentHtml
            };
            var spoilerContent = {
                __html: version.spoilerHtml
            };
            var poll = typeof version.poll !== 'string' && version.poll;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "flex flex-col py-2 first:pt-0 last:pb-0",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 47,
                    columnNumber: 13
                }
            }, ((_version$spoiler_text = version.spoiler_text) === null || _version$spoiler_text === void 0 ? void 0 : _version$spoiler_text.length) > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
                dangerouslySetInnerHTML: spoilerContent,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 50,
                    columnNumber: 19
                }
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("hr", {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 51,
                    columnNumber: 19
                }
            })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "status__content",
                dangerouslySetInnerHTML: content,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 55,
                    columnNumber: 15
                }
            }), poll && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "poll",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 58,
                    columnNumber: 17
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 59,
                    columnNumber: 19
                }
            }, version.poll.options.map(function (option) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
                alignItems: "center",
                className: "p-1 text-gray-900 dark:text-gray-300",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 61,
                    columnNumber: 23
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
                className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('inline-block w-4 h-4 flex-none mr-2.5 border border-solid border-primary-600 rounded-full', {
                    'rounded': poll.multiple
                }),
                tabIndex: 0,
                role: poll.multiple ? 'checkbox' : 'radio',
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 62,
                    columnNumber: 25
                }
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
                dangerouslySetInnerHTML: {
                    __html: option.title_emojified
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 70,
                    columnNumber: 25
                }
            })); }))), version.media_attachments.size > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_3__["default"], {
                media: version.media_attachments,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 78,
                    columnNumber: 17
                }
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
                align: "right",
                tag: "span",
                theme: "muted",
                size: "sm",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 81,
                    columnNumber: 15
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__.FormattedDate, {
                value: new Date(version.created_at),
                hour12: false,
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 82,
                    columnNumber: 17
                }
            })));
        }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "compare_history_modal.header",
            defaultMessage: "Edit history",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 93,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 5
        }
    }, body);
};
/* harmony default export */ __webpack_exports__["default"] = (CompareHistoryModal);


/***/ })

}]);
//# sourceMappingURL=compare_history_modal-15230f91e2b19e82d3c8.chunk.js.map