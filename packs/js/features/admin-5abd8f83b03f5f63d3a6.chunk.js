"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[8],{

/***/ 1713:
/*!*******************************************!*\
  !*** ./app/soapbox/actions/email_list.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCombinedCsv": function() { return /* binding */ getCombinedCsv; },
/* harmony export */   "getSubscribersCsv": function() { return /* binding */ getSubscribersCsv; },
/* harmony export */   "getUnsubscribersCsv": function() { return /* binding */ getUnsubscribersCsv; }
/* harmony export */ });
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ 9);

var getSubscribersCsv = function () { return function (dispatch, getState) { return (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(getState).get('/api/v1/pleroma/admin/email_list/subscribers.csv'); }; };
var getUnsubscribersCsv = function () { return function (dispatch, getState) { return (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(getState).get('/api/v1/pleroma/admin/email_list/unsubscribers.csv'); }; };
var getCombinedCsv = function () { return function (dispatch, getState) { return (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(getState).get('/api/v1/pleroma/admin/email_list/combined.csv'); }; };



/***/ }),

/***/ 1709:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/admin/components/admin-tabs.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/components/admin-tabs.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__.defineMessages)({
    dashboard: {
        "id": "admin_nav.dashboard",
        "defaultMessage": "Dashboard"
    },
    reports: {
        "id": "admin_nav.reports",
        "defaultMessage": "Reports"
    },
    waitlist: {
        "id": "admin_nav.awaiting_approval",
        "defaultMessage": "Waitlist"
    }
});
var AdminTabs = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var match = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_5__.useRouteMatch)();
    var approvalCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.admin.awaitingApproval.count(); });
    var reportsCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.admin.openReports.count(); });
    var tabs = [{
            name: '/soapbox/admin',
            text: intl.formatMessage(messages.dashboard),
            to: '/soapbox/admin'
        }, {
            name: '/soapbox/admin/reports',
            text: intl.formatMessage(messages.reports),
            to: '/soapbox/admin/reports',
            count: reportsCount
        }, {
            name: '/soapbox/admin/approval',
            text: intl.formatMessage(messages.waitlist),
            to: '/soapbox/admin/approval',
            count: approvalCount
        }];
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Tabs, {
        items: tabs,
        activeItem: match.path,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 10
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (AdminTabs);


/***/ }),

/***/ 1545:
/*!*************************************************************************!*\
  !*** ./app/soapbox/features/admin/components/latest_accounts_panel.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/admin */ 113);
/* harmony import */ var soapbox_compare_id__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/compare_id */ 644);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/account_container */ 157);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/components/latest_accounts_panel.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    title: {
        "id": "admin.latest_accounts_panel.title",
        "defaultMessage": "Latest Accounts"
    },
    expand: {
        "id": "admin.latest_accounts_panel.more",
        "defaultMessage": "Click to see {count} {count, plural, one {account} other {accounts}}"
    }
});
var LatestAccountsPanel = function (_ref) {
    var _a = _ref.limit, limit = _a === void 0 ? 5 : _a;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useHistory)();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.admin.get('latestUsers').take(limit); });
    var hasDates = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return accountIds.every(function (id) { return !!state.accounts.getIn([id, 'created_at']); }); });
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(accountIds.size), total = _b[0], setTotal = _b[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__.fetchUsers)(['local', 'active'], 1, null, limit)).then(function (value) {
            setTotal(value.count);
        }).catch(function () { });
    }, []);
    var sortedIds = accountIds.sort(soapbox_compare_id__WEBPACK_IMPORTED_MODULE_3__["default"]).reverse();
    var isSorted = hasDates && (0,immutable__WEBPACK_IMPORTED_MODULE_10__.is)(accountIds, sortedIds);
    if (!isSorted || !accountIds || accountIds.isEmpty()) {
        return null;
    }
    var handleAction = function () {
        history.push('/soapbox/admin/users');
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Widget, {
        title: intl.formatMessage(messages.title),
        onActionClick: handleAction,
        actionTitle: intl.formatMessage(messages.expand, {
            count: total
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 5
        }
    }, accountIds.take(limit).map(function (account) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: account,
        id: account,
        withRelationship: false,
        withDate: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (LatestAccountsPanel);


/***/ }),

/***/ 1714:
/*!****************************************************************************!*\
  !*** ./app/soapbox/features/admin/components/registration_mode_picker.tsx ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/admin */ 113);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/forms */ 873);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/components/registration_mode_picker.tsx";






var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    saved: {
        "id": "admin.dashboard.settings_saved",
        "defaultMessage": "Settings saved!"
    }
});
var generateConfig = function (mode) {
    var configMap = {
        open: [{
                tuple: [':registrations_open', true]
            }, {
                tuple: [':account_approval_required', false]
            }],
        approval: [{
                tuple: [':registrations_open', true]
            }, {
                tuple: [':account_approval_required', true]
            }],
        closed: [{
                tuple: [':registrations_open', false]
            }]
    };
    return [{
            group: ':pleroma',
            key: ':instance',
            value: configMap[mode]
        }];
};
var modeFromInstance = function (instance) {
    if (instance.approval_required && instance.registrations)
        return 'approval';
    return instance.registrations ? 'open' : 'closed';
};
/** Allows changing the registration mode of the instance, eg "open", "closed", "approval" */
var RegistrationModePicker = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var mode = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return modeFromInstance(state.instance); });
    var onChange = function (e) {
        var config = generateConfig(e.target.value);
        dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_1__.updateConfig)(config)).then(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_2__["default"].success(intl.formatMessage(messages.saved)));
        }).catch(function () { });
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.SimpleForm, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.FieldsGroup, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.RadioGroup, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "admin.dashboard.registration_mode_label",
            defaultMessage: "Registrations",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 59,
                columnNumber: 18
            }
        }),
        onChange: onChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.RadioItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "admin.dashboard.registration_mode.open_label",
            defaultMessage: "Open",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 63,
                columnNumber: 20
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "admin.dashboard.registration_mode.open_hint",
            defaultMessage: "Anyone can join.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 64,
                columnNumber: 19
            }
        }),
        checked: mode === 'open',
        value: "open",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.RadioItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "admin.dashboard.registration_mode.approval_label",
            defaultMessage: "Approval Required",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 69,
                columnNumber: 20
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "admin.dashboard.registration_mode.approval_hint",
            defaultMessage: "Users can sign up, but their account only gets activated when an admin approves it.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 70,
                columnNumber: 19
            }
        }),
        checked: mode === 'approval',
        value: "approval",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.RadioItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "admin.dashboard.registration_mode.closed_label",
            defaultMessage: "Closed",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 75,
                columnNumber: 20
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "admin.dashboard.registration_mode.closed_hint",
            defaultMessage: "Nobody can sign up. You can still invite people.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 76,
                columnNumber: 19
            }
        }),
        checked: mode === 'closed',
        value: "closed",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (RegistrationModePicker);


/***/ }),

/***/ 1716:
/*!**********************************************************!*\
  !*** ./app/soapbox/features/admin/components/report.tsx ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/admin */ 113);
/* harmony import */ var soapbox_actions_moderation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/moderation */ 615);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/avatar */ 602);
/* harmony import */ var soapbox_components_hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/hover_ref_wrapper */ 271);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/containers/dropdown_menu_container */ 272);
/* harmony import */ var soapbox_features_ui_components_accordion__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/features/ui/components/accordion */ 1308);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _report_status__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./report_status */ 1866);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/components/report.tsx";














var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__.defineMessages)({
    reportClosed: {
        "id": "admin.reports.report_closed_message",
        "defaultMessage": "Report on @{name} was closed"
    },
    deactivateUser: {
        "id": "admin.users.actions.deactivate_user",
        "defaultMessage": "Deactivate @{name}"
    },
    deleteUser: {
        "id": "admin.users.actions.delete_user",
        "defaultMessage": "Delete @{name}"
    }
});
var Report = function (_ref) {
    var report = _ref.report;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_13__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppDispatch)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), accordionExpanded = _a[0], setAccordionExpanded = _a[1];
    var account = report.account;
    var targetAccount = report.target_account;
    var makeMenu = function () {
        return [{
                text: intl.formatMessage(messages.deactivateUser, {
                    name: targetAccount.username
                }),
                action: handleDeactivateUser,
                icon: __webpack_require__(/*! @tabler/icons/user-off.svg */ 285)
            }, {
                text: intl.formatMessage(messages.deleteUser, {
                    name: targetAccount.username
                }),
                action: handleDeleteUser,
                icon: __webpack_require__(/*! @tabler/icons/user-minus.svg */ 308)
            }];
    };
    var handleCloseReport = function () {
        dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__.closeReports)([report.id])).then(function () {
            var message = intl.formatMessage(messages.reportClosed, {
                name: targetAccount.username
            });
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(message));
        }).catch(function () { });
    };
    var handleDeactivateUser = function () {
        var accountId = targetAccount.id;
        dispatch((0,soapbox_actions_moderation__WEBPACK_IMPORTED_MODULE_3__.deactivateUserModal)(intl, accountId, function () { return handleCloseReport(); }));
    };
    var handleDeleteUser = function () {
        var accountId = targetAccount.id;
        dispatch((0,soapbox_actions_moderation__WEBPACK_IMPORTED_MODULE_3__.deleteUserModal)(intl, accountId, function () { return handleCloseReport(); }));
    };
    var handleAccordionToggle = function (setting) {
        setAccordionExpanded(setting);
    };
    var menu = makeMenu();
    var statuses = report.statuses;
    var statusCount = statuses.count();
    var acct = targetAccount.acct;
    var reporterAcct = account.acct;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report",
        key: report.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report__avatar",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_6__["default"], {
        accountId: targetAccount.id,
        inline: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Link, {
        to: "/@".concat(acct),
        title: acct,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_5__["default"], {
        account: targetAccount,
        size: 32,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 13
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report__content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("h4", {
        className: "admin-report__title",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
        id: "admin.reports.report_title",
        defaultMessage: "Report on {acct}",
        values: {
            acct: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_6__["default"], {
                accountId: account.id,
                inline: true,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 93,
                    columnNumber: 15
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Link, {
                to: "/@".concat(acct),
                title: acct,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 94,
                    columnNumber: 17
                }
            }, "@", acct))
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report__statuses",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 99,
            columnNumber: 9
        }
    }, statusCount > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_accordion__WEBPACK_IMPORTED_MODULE_9__["default"], {
        headline: "Reported posts (".concat(statusCount, ")"),
        expanded: accordionExpanded,
        onToggle: handleAccordionToggle,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 13
        }
    }, statuses.map(function (status) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_report_status__WEBPACK_IMPORTED_MODULE_11__["default"], {
        report: report,
        status: status,
        key: status.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 106,
            columnNumber: 39
        }
    }); }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report__quote",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 9
        }
    }, (report.comment || '').length > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("blockquote", {
        className: "md",
        dangerouslySetInnerHTML: {
            __html: report.comment
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 112,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "byline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 11
        }
    }, "\u2014", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_6__["default"], {
        accountId: account.id,
        inline: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 116,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Link, {
        to: "/@".concat(reporterAcct),
        title: reporterAcct,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 117,
            columnNumber: 15
        }
    }, "@", reporterAcct))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.HStack, {
        space: 2,
        alignItems: "start",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Button, {
        onClick: handleCloseReport,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 123,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
        id: "admin.reports.actions.close",
        defaultMessage: "Close",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 124,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_8__["default"], {
        items: menu,
        src: __webpack_require__(/*! @tabler/icons/dots-vertical.svg */ 878),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Report);


/***/ }),

/***/ 1866:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/admin/components/report_status.tsx ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash/noop */ 413);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_noop__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_moderation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/moderation */ 615);
/* harmony import */ var soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/status_content */ 605);
/* harmony import */ var soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/dropdown_menu_container */ 272);
/* harmony import */ var soapbox_features_ui_components_bundle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/ui/components/bundle */ 205);
/* harmony import */ var soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/ui/util/async-components */ 42);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/components/report_status.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    viewStatus: {
        "id": "admin.reports.actions.view_status",
        "defaultMessage": "View post"
    },
    deleteStatus: {
        "id": "admin.statuses.actions.delete_status",
        "defaultMessage": "Delete post"
    }
});
var ReportStatus = function (_ref) {
    var status = _ref.status;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppDispatch)();
    var handleOpenMedia = function (media, index) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('MEDIA', {
            media: media,
            index: index
        }));
    };
    var handleDeleteStatus = function () {
        dispatch((0,soapbox_actions_moderation__WEBPACK_IMPORTED_MODULE_3__.deleteStatusModal)(intl, status.id));
    };
    var makeMenu = function () {
        var acct = status.getIn(['account', 'acct']);
        return [{
                text: intl.formatMessage(messages.viewStatus, {
                    acct: "@".concat(acct)
                }),
                to: "/@".concat(acct, "/posts/").concat(status.id),
                icon: __webpack_require__(/*! @tabler/icons/pencil.svg */ 613)
            }, {
                text: intl.formatMessage(messages.deleteStatus, {
                    acct: "@".concat(acct)
                }),
                action: handleDeleteStatus,
                icon: __webpack_require__(/*! @tabler/icons/trash.svg */ 268),
                destructive: true
            }];
    };
    var getMedia = function () {
        var firstAttachment = status.media_attachments.get(0);
        if (firstAttachment) {
            if (status.media_attachments.some(function (item) { return item.type === 'unknown'; })) { // Do nothing
            }
            else if (firstAttachment.type === 'video') {
                var video_1 = firstAttachment;
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_bundle__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_7__.Video,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 62,
                        columnNumber: 11
                    }
                }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(Component, {
                    preview: video_1.preview_url,
                    blurhash: video_1.blurhash,
                    src: video_1.url,
                    alt: video_1.description,
                    aspectRatio: video_1.meta.getIn(['original', 'aspect']),
                    width: 239,
                    height: 110,
                    inline: true,
                    sensitive: status.sensitive,
                    onOpenVideo: (lodash_noop__WEBPACK_IMPORTED_MODULE_0___default()),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 64,
                        columnNumber: 15
                    }
                }); });
            }
            else if (firstAttachment.type === 'audio') {
                var audio_1 = firstAttachment;
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_bundle__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_7__.Audio,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 83,
                        columnNumber: 11
                    }
                }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(Component, {
                    src: audio_1.url,
                    alt: audio_1.description,
                    inline: true,
                    sensitive: status.sensitive,
                    onOpenAudio: (lodash_noop__WEBPACK_IMPORTED_MODULE_0___default()),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 85,
                        columnNumber: 15
                    }
                }); });
            }
            else {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_bundle__WEBPACK_IMPORTED_MODULE_6__["default"], {
                    fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_7__.MediaGallery,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 97,
                        columnNumber: 11
                    }
                }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(Component, {
                    media: status.media_attachments,
                    sensitive: status.sensitive,
                    height: 110,
                    onOpenMedia: handleOpenMedia,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 99,
                        columnNumber: 15
                    }
                }); });
            }
        }
        return null;
    };
    var media = getMedia();
    var menu = makeMenu();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report__status",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report__status-content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 119,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_4__["default"], {
        status: status,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 120,
            columnNumber: 9
        }
    }), media), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "admin-report__status-actions",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 123,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        items: menu,
        src: __webpack_require__(/*! @tabler/icons/dots-vertical.svg */ 878),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 124,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ReportStatus);


/***/ }),

/***/ 1711:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/admin/components/unapproved_account.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/admin */ 113);
/* harmony import */ var soapbox_actions_moderation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/moderation */ 615);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/icon_button */ 600);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/components/unapproved_account.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    approved: {
        "id": "admin.awaiting_approval.approved_message",
        "defaultMessage": "{acct} was approved!"
    },
    rejected: {
        "id": "admin.awaiting_approval.rejected_message",
        "defaultMessage": "{acct} was rejected."
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__.makeGetAccount)();
/** Displays an unapproved account for moderation purposes. */
var UnapprovedAccount = function (_ref) {
    var accountId = _ref.accountId;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return getAccount(state, accountId); });
    var adminAccount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.admin.users.get(accountId); });
    if (!account)
        return null;
    var handleApprove = function () {
        dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_1__.approveUsers)([account.id])).then(function () {
            var message = intl.formatMessage(messages.approved, {
                acct: "@".concat(account.acct)
            });
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__["default"].success(message));
        }).catch(function () { });
    };
    var handleReject = function () {
        dispatch((0,soapbox_actions_moderation__WEBPACK_IMPORTED_MODULE_2__.rejectUserModal)(intl, account.id, function () {
            var message = intl.formatMessage(messages.rejected, {
                acct: "@".concat(account.acct)
            });
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__["default"].info(message));
        }));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "unapproved-account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "unapproved-account__bio",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "unapproved-account__nickname",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 9
        }
    }, "@", account.get('acct')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("blockquote", {
        className: "md",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 9
        }
    }, (adminAccount === null || adminAccount === void 0 ? void 0 : adminAccount.invite_request) || '')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "unapproved-account__actions",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        src: __webpack_require__(/*! @tabler/icons/check.svg */ 159),
        onClick: handleApprove,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
        onClick: handleReject,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (UnapprovedAccount);


/***/ }),

/***/ 1530:
/*!**********************************************!*\
  !*** ./app/soapbox/features/admin/index.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/components/column */ 872);
/* harmony import */ var _components_admin_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/admin-tabs */ 1709);
/* harmony import */ var _tabs_awaiting_approval__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./tabs/awaiting-approval */ 1710);
/* harmony import */ var _tabs_dashboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tabs/dashboard */ 1712);
/* harmony import */ var _tabs_reports__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tabs/reports */ 1715);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    heading: {
        "id": "column.admin.dashboard",
        "defaultMessage": "Dashboard"
    }
});
var Admin = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_1__.useOwnAccount)();
    if (!account)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_2__["default"], {
        label: intl.formatMessage(messages.heading),
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_admin_tabs__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_9__.Switch, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_9__.Route, {
        path: "/soapbox/admin",
        exact: true,
        component: _tabs_dashboard__WEBPACK_IMPORTED_MODULE_5__["default"],
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_9__.Route, {
        path: "/soapbox/admin/reports",
        exact: true,
        component: _tabs_reports__WEBPACK_IMPORTED_MODULE_6__["default"],
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_9__.Route, {
        path: "/soapbox/admin/approval",
        exact: true,
        component: _tabs_awaiting_approval__WEBPACK_IMPORTED_MODULE_4__["default"],
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Admin);


/***/ }),

/***/ 1710:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/admin/tabs/awaiting-approval.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/admin */ 113);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 871);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _components_unapproved_account__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/unapproved_account */ 1711);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/tabs/awaiting-approval.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    heading: {
        "id": "column.admin.awaiting_approval",
        "defaultMessage": "Awaiting Approval"
    },
    emptyMessage: {
        "id": "admin.awaiting_approval.empty_message",
        "defaultMessage": "There is nobody waiting for approval. When a new user signs up, you can review them here."
    }
});
var AwaitingApproval = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.admin.awaitingApproval; });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), isLoading = _a[0], setLoading = _a[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__.fetchUsers)(['local', 'need_approval'])).then(function () { return setLoading(false); }).catch(function () { });
    }, []);
    var showLoading = isLoading && accountIds.count() === 0;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        isLoading: isLoading,
        showLoading: showLoading,
        scrollKey: "awaiting-approval",
        emptyMessage: intl.formatMessage(messages.emptyMessage),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 5
        }
    }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_unapproved_account__WEBPACK_IMPORTED_MODULE_5__["default"], {
        accountId: id,
        key: id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (AwaitingApproval);


/***/ }),

/***/ 1712:
/*!*******************************************************!*\
  !*** ./app/soapbox/features/admin/tabs/dashboard.tsx ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url.js */ 46);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 28);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_actions_email_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/email_list */ 1713);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_code__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/utils/code */ 141);
/* harmony import */ var soapbox_utils_code__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(soapbox_utils_code__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/utils/numbers */ 140);
/* harmony import */ var _components_registration_mode_picker__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../components/registration_mode_picker */ 1714);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/tabs/dashboard.tsx";













/** Download the file from the response instead of opening it in a tab. */
// https://stackoverflow.com/a/53230807
var download = function (response, filename) {
    var url = URL.createObjectURL(new Blob([response.data]));
    var link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
var Dashboard = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.instance; });
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useFeatures)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useOwnAccount)();
    var handleSubscribersClick = function (e) {
        dispatch((0,soapbox_actions_email_list__WEBPACK_IMPORTED_MODULE_4__.getSubscribersCsv)()).then(function (response) {
            download(response, 'subscribers.csv');
        }).catch(function () { });
        e.preventDefault();
    };
    var handleUnsubscribersClick = function (e) {
        dispatch((0,soapbox_actions_email_list__WEBPACK_IMPORTED_MODULE_4__.getUnsubscribersCsv)()).then(function (response) {
            download(response, 'unsubscribers.csv');
        }).catch(function () { });
        e.preventDefault();
    };
    var handleCombinedClick = function (e) {
        dispatch((0,soapbox_actions_email_list__WEBPACK_IMPORTED_MODULE_4__.getCombinedCsv)()).then(function (response) {
            download(response, 'combined.csv');
        }).catch(function () { });
        e.preventDefault();
    };
    var v = (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_8__.parseVersion)(instance.version);
    var userCount = instance.stats.get('user_count');
    var statusCount = instance.stats.get('status_count');
    var domainCount = instance.stats.get('domain_count');
    var mau = instance.pleroma.getIn(['stats', 'mau']);
    var retention = userCount && mau ? Math.round(mau / userCount * 100) : null;
    if (!account)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "dashcounters mt-8",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 7
        }
    }, (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__.isNumber)(mau) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "dashcounter",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        size: "2xl",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__.FormattedNumber, {
        value: mau,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "admin.dashcounters.mau_label",
        defaultMessage: "monthly active users",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 15
        }
    }))), (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__.isNumber)(userCount) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.Link, {
        className: "dashcounter",
        to: "/soapbox/admin/users",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        size: "2xl",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__.FormattedNumber, {
        value: userCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "admin.dashcounters.user_count_label",
        defaultMessage: "total users",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 15
        }
    }))), (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__.isNumber)(retention) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "dashcounter",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        size: "2xl",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 13
        }
    }, retention, "%"), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "admin.dashcounters.retention_label",
        defaultMessage: "user retention",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 15
        }
    }))), (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__.isNumber)(statusCount) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.Link, {
        className: "dashcounter",
        to: "/timeline/local",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        size: "2xl",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__.FormattedNumber, {
        value: statusCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "admin.dashcounters.status_count_label",
        defaultMessage: "posts",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 105,
            columnNumber: 15
        }
    }))), (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__.isNumber)(domainCount) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "dashcounter",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        size: "2xl",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 111,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__.FormattedNumber, {
        value: domainCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 112,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "admin.dashcounters.domain_count_label",
        defaultMessage: "peers",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 115,
            columnNumber: 15
        }
    })))), account.admin && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_registration_mode_picker__WEBPACK_IMPORTED_MODULE_10__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 25
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "dashwidgets",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 123,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "dashwidget",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 124,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("h4", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "admin.dashwidgets.software_header",
        defaultMessage: "Software",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("ul", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 13
        }
    }, (soapbox_utils_code__WEBPACK_IMPORTED_MODULE_7___default().displayName), " ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
        className: "pull-right",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 42
        }
    }, (soapbox_utils_code__WEBPACK_IMPORTED_MODULE_7___default().version))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 13
        }
    }, v.software + (v.build ? "+".concat(v.build) : ''), " ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
        className: "pull-right",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 63
        }
    }, v.version)))), features.emailList && account.admin && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "dashwidget",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 132,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("h4", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 133,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "admin.dashwidgets.email_list_header",
        defaultMessage: "Email list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 133,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("ul", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 135,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
        href: "#",
        onClick: handleSubscribersClick,
        target: "_blank",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 135,
            columnNumber: 19
        }
    }, "subscribers.csv")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 136,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
        href: "#",
        onClick: handleUnsubscribersClick,
        target: "_blank",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 136,
            columnNumber: 19
        }
    }, "unsubscribers.csv")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 137,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
        href: "#",
        onClick: handleCombinedClick,
        target: "_blank",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 137,
            columnNumber: 19
        }
    }, "combined.csv"))))));
};
/* harmony default export */ __webpack_exports__["default"] = (Dashboard);


/***/ }),

/***/ 1715:
/*!*****************************************************!*\
  !*** ./app/soapbox/features/admin/tabs/reports.tsx ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/admin */ 113);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 871);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var _components_report__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/report */ 1716);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/admin/tabs/reports.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    heading: {
        "id": "column.admin.reports",
        "defaultMessage": "Reports"
    },
    modlog: {
        "id": "column.admin.reports.menu.moderation_log",
        "defaultMessage": "Moderation Log"
    },
    emptyMessage: {
        "id": "admin.reports.empty_message",
        "defaultMessage": "There are no open reports. If a user gets reported, they will show up here."
    }
});
var getReport = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__.makeGetReport)();
var Reports = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), isLoading = _a[0], setLoading = _a[1];
    var reports = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var ids = state.admin.openReports;
        return ids.toList().map(function (id) { return getReport(state, id); });
    });
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_admin__WEBPACK_IMPORTED_MODULE_2__.fetchReports)()).then(function () { return setLoading(false); }).catch(function () { });
    }, []);
    var showLoading = isLoading && reports.count() === 0;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        isLoading: isLoading,
        showLoading: showLoading,
        scrollKey: "admin-reports",
        emptyMessage: intl.formatMessage(messages.emptyMessage),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, reports.map(function (report) { return report && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_report__WEBPACK_IMPORTED_MODULE_6__["default"], {
        report: report,
        key: report === null || report === void 0 ? void 0 : report.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 40
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (Reports);


/***/ })

}]);
//# sourceMappingURL=admin-5abd8f83b03f5f63d3a6.chunk.js.map