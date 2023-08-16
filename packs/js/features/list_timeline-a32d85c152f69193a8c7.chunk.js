"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[54],{

/***/ 1980:
/*!******************************************************!*\
  !*** ./app/soapbox/features/list_timeline/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/lists */ 298);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/streaming */ 89);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/timelines */ 46);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1822);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/ui/components/column */ 686);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_timeline__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../ui/components/timeline */ 1823);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/list_timeline/index.tsx";











 // const messages = defineMessages({
//   deleteHeading: { id: 'confirmations.delete_list.heading', defaultMessage: 'Delete list' },
//   deleteMessage: { id: 'confirmations.delete_list.message', defaultMessage: 'Are you sure you want to permanently delete this list?' },
//   deleteConfirm: { id: 'confirmations.delete_list.confirm', defaultMessage: 'Delete' },
// });
var ListTimeline = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppDispatch)();
    var id = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useParams)().id; // const intl = useIntl();
    // const history = useHistory();
    var list = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.lists.get(id); }); // const hasUnread = useAppSelector((state) => state.timelines.get(`list:${props.params.id}`)?.unread > 0);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_lists__WEBPACK_IMPORTED_MODULE_1__.fetchList)(id));
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__.expandListTimeline)(id));
        var disconnect = dispatch((0,soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_3__.connectListStream)(id));
        return function () {
            disconnect();
        };
    }, [id]);
    var handleLoadMore = function (maxId) {
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__.expandListTimeline)(id, {
            maxId: maxId
        }));
    };
    var handleEditClick = function () {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('LIST_EDITOR', {
            listId: id
        }));
    }; // const handleDeleteClick = () => {
    //   dispatch(openModal('CONFIRM', {
    //     icon: require('@tabler/icons/trash.svg'),
    //     heading: intl.formatMessage(messages.deleteHeading),
    //     message: intl.formatMessage(messages.deleteMessage),
    //     confirm: intl.formatMessage(messages.deleteConfirm),
    //     onConfirm: () => {
    //       dispatch(deleteList(id));
    //       history.push('/lists');
    //     },
    //   }));
    // };
    var title = list ? list.title : id;
    if (typeof list === 'undefined') {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_7__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 67,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 68,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 69,
                columnNumber: 11
            }
        })));
    }
    else if (list === false) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_5__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 75,
                columnNumber: 7
            }
        });
    }
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "empty_column.list",
        defaultMessage: "There is nothing in this list yet. When members of this list create new posts, they will appear here.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("br", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        onClick: handleEditClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "list.click_to_add",
        defaultMessage: "Click here to add people",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 41
        }
    })));
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_7__["default"], {
        label: title,
        heading: title,
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_timeline__WEBPACK_IMPORTED_MODULE_9__["default"], {
        scrollKey: "list_timeline",
        timelineId: "list:".concat(id),
        onLoadMore: handleLoadMore,
        emptyMessage: emptyMessage,
        divideType: "space",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 108,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ListTimeline);


/***/ })

}]);
//# sourceMappingURL=list_timeline-a32d85c152f69193a8c7.chunk.js.map