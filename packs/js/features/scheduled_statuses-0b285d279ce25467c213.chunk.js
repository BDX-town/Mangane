"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[63],{

/***/ 2394:
/*!*************************************************************!*\
  !*** ./app/soapbox/features/scheduled_statuses/builder.tsx ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "buildStatus": function() { return /* binding */ buildStatus; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var soapbox_normalizers_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/normalizers/status */ 251);
/* harmony import */ var soapbox_reducers_statuses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/reducers/statuses */ 450);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/selectors */ 30);





var buildStatus = function (state, scheduledStatus) {
    var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_3__.makeGetAccount)();
    var me = state.me;
    var account = getAccount(state, me);
    if (!scheduledStatus)
        return null;
    var status = (0,immutable__WEBPACK_IMPORTED_MODULE_4__.Map)({
        account: account,
        // eslint-disable-next-line no-control-regex
        content: scheduledStatus.text.replace(new RegExp('\n', 'g'), '<br>'),
        created_at: scheduledStatus.scheduled_at,
        id: scheduledStatus.id,
        in_reply_to_id: scheduledStatus.in_reply_to_id,
        media_attachments: scheduledStatus.media_attachments,
        poll: scheduledStatus.poll,
        sensitive: scheduledStatus.sensitive,
        uri: "/scheduled_statuses/".concat(scheduledStatus.id),
        url: "/scheduled_statuses/".concat(scheduledStatus.id),
        visibility: scheduledStatus.visibility
    });
    return (0,soapbox_reducers_statuses__WEBPACK_IMPORTED_MODULE_2__.calculateStatus)((0,soapbox_normalizers_status__WEBPACK_IMPORTED_MODULE_1__.normalizeStatus)(status));
};


/***/ }),

/***/ 2393:
/*!*********************************************************************************!*\
  !*** ./app/soapbox/features/scheduled_statuses/components/scheduled_status.tsx ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/attachment-thumbs */ 408);
/* harmony import */ var soapbox_components_status_reply_mentions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/status-reply-mentions */ 427);
/* harmony import */ var soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/status_content */ 396);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/containers/account_container */ 122);
/* harmony import */ var soapbox_features_ui_components_poll_preview__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/ui/components/poll_preview */ 932);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _builder__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../builder */ 2394);
/* harmony import */ var _scheduled_status_action_bar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./scheduled_status_action_bar */ 2395);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/scheduled_statuses/components/scheduled_status.tsx";
var _excluded = ["statusId"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }











var ScheduledStatus = function (_ref) {
    var statusId = _ref.statusId, other = _objectWithoutProperties(_ref, _excluded);
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return (0,_builder__WEBPACK_IMPORTED_MODULE_9__.buildStatus)(state, state.scheduled_statuses.get(statusId)); });
    if (!status)
        return null;
    var account = status.account;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('status__wrapper', "status__wrapper-".concat(status.visibility), {
            'status__wrapper-reply': !!status.in_reply_to_id
        }),
        tabIndex: 0,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('status', "status-".concat(status.visibility), {
            'status-reply': !!status.in_reply_to_id
        }),
        "data-id": status.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mb-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        justifyContent: "between",
        alignItems: "start",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_6__["default"], {
        key: account.id,
        id: account.id,
        timestamp: status.created_at,
        futureTimestamp: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_reply_mentions__WEBPACK_IMPORTED_MODULE_3__["default"], {
        status: status,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_4__["default"], {
        status: status,
        expanded: true,
        collapsable: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    }), status.media_attachments.size > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_2__["default"], {
        media: status.media_attachments,
        sensitive: status.sensitive,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 11
        }
    }), status.poll && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_poll_preview__WEBPACK_IMPORTED_MODULE_7__["default"], {
        pollId: status.poll,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 25
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_scheduled_status_action_bar__WEBPACK_IMPORTED_MODULE_10__["default"], _extends({
        status: status
    }, other, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 9
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (ScheduledStatus);


/***/ }),

/***/ 2395:
/*!********************************************************************************************!*\
  !*** ./app/soapbox/features/scheduled_statuses/components/scheduled_status_action_bar.tsx ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_scheduled_statuses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/scheduled_statuses */ 254);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon_button */ 389);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/scheduled_statuses/components/scheduled_status_action_bar.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    cancel: {
        "id": "scheduled_status.cancel",
        "defaultMessage": "Cancel"
    },
    deleteConfirm: {
        "id": "confirmations.scheduled_status_delete.confirm",
        "defaultMessage": "Cancel"
    },
    deleteHeading: {
        "id": "confirmations.scheduled_status_delete.heading",
        "defaultMessage": "Cancel scheduled post"
    },
    deleteMessage: {
        "id": "confirmations.scheduled_status_delete.message",
        "defaultMessage": "Are you sure you want to cancel this scheduled post?"
    }
});
var ScheduledStatusActionBar = function (_ref) {
    var status = _ref.status;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var handleCancelClick = function () {
        dispatch(function (_, getState) {
            var deleteModal = (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_3__.getSettings)(getState()).get('deleteModal');
            if (!deleteModal) {
                dispatch((0,soapbox_actions_scheduled_statuses__WEBPACK_IMPORTED_MODULE_2__.cancelScheduledStatus)(status.id));
            }
            else {
                dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__.openModal)('CONFIRM', {
                    icon: __webpack_require__(/*! @tabler/icons/calendar-stats.svg */ 936),
                    heading: intl.formatMessage(messages.deleteHeading),
                    message: intl.formatMessage(messages.deleteMessage),
                    confirm: intl.formatMessage(messages.deleteConfirm),
                    onConfirm: function () { return dispatch((0,soapbox_actions_scheduled_statuses__WEBPACK_IMPORTED_MODULE_2__.cancelScheduledStatus)(status.id)); }
                }));
            }
        });
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        justifyContent: "end",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        title: intl.formatMessage(messages.cancel),
        text: intl.formatMessage(messages.cancel),
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
        onClick: handleCancelClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ScheduledStatusActionBar);


/***/ }),

/***/ 2225:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/scheduled_statuses/index.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_scheduled_statuses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/scheduled_statuses */ 254);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 799);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui/components/column */ 800);
/* harmony import */ var _components_scheduled_status__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/scheduled_status */ 2393);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/scheduled_statuses/index.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    heading: {
        "id": "column.scheduled_statuses",
        "defaultMessage": "Scheduled Posts"
    }
});
var handleLoadMore = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(function (dispatch) {
    dispatch((0,soapbox_actions_scheduled_statuses__WEBPACK_IMPORTED_MODULE_2__.expandScheduledStatuses)());
}, 300, {
    leading: true
});
var ScheduledStatuses = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var statusIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.status_lists.get('scheduled_statuses').items; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.status_lists.get('scheduled_statuses').isLoading; });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return !!state.status_lists.get('scheduled_statuses').next; });
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_scheduled_statuses__WEBPACK_IMPORTED_MODULE_2__.fetchScheduledStatuses)());
    }, []);
    var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "empty_column.scheduled_statuses",
        defaultMessage: "You don't have any scheduled statuses yet. When you add one, it will show up here.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 24
        }
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_5__["default"], {
        icon: "calendar",
        label: intl.formatMessage(messages.heading),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        scrollKey: "scheduled_statuses",
        hasMore: hasMore,
        isLoading: typeof isLoading === 'boolean' ? isLoading : true,
        onLoadMore: function () { return handleLoadMore(dispatch); },
        emptyMessage: emptyMessage,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }, statusIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_scheduled_status__WEBPACK_IMPORTED_MODULE_6__["default"], {
        key: id,
        statusId: id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 40
        }
    }); })));
};
/* harmony default export */ __webpack_exports__["default"] = (ScheduledStatuses);


/***/ })

}]);
//# sourceMappingURL=scheduled_statuses-0b285d279ce25467c213.chunk.js.map