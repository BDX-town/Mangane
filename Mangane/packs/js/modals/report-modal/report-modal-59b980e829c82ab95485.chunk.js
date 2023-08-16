"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[211],{

/***/ 1775:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/report/components/status_check_box.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/noop */ 452);
/* harmony import */ var lodash_noop__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_noop__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_toggle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-toggle */ 911);
/* harmony import */ var soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/reports */ 195);
/* harmony import */ var soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/status_content */ 417);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _ui_components_bundle__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../ui/components/bundle */ 206);
/* harmony import */ var _ui_util_async_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../ui/util/async-components */ 44);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/report/components/status_check_box.tsx";









var StatusCheckBox = function (_ref) {
    var id = _ref.id, disabled = _ref.disabled;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.statuses.get(id); });
    var checked = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.reports.new.status_ids.includes(id); });
    var onToggle = function (e) { return dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_4__.toggleStatusReport)(id, e.target.checked)); };
    if (!status || status.reblog) {
        return null;
    }
    var media;
    if (status.media_attachments.size > 0) {
        var _status$media_attachm, _status$media_attachm2;
        if (status.media_attachments.some(function (item) { return item.type === 'unknown'; })) { // Do nothing
        }
        else if (((_status$media_attachm = status.media_attachments.get(0)) === null || _status$media_attachm === void 0 ? void 0 : _status$media_attachm.type) === 'video') {
            var video_1 = status.media_attachments.get(0);
            if (video_1) {
                media = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui_components_bundle__WEBPACK_IMPORTED_MODULE_7__["default"], {
                    fetchComponent: _ui_util_async_components__WEBPACK_IMPORTED_MODULE_8__.Video,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 38,
                        columnNumber: 11
                    }
                }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement(Component, {
                    preview: video_1.preview_url,
                    blurhash: video_1.blurhash,
                    src: video_1.url,
                    alt: video_1.description,
                    aspectRatio: video_1.meta.getIn(['original', 'aspect']),
                    width: 239,
                    height: 110,
                    inline: true,
                    sensitive: status.sensitive,
                    onOpenVideo: (lodash_noop__WEBPACK_IMPORTED_MODULE_1___default()),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 40,
                        columnNumber: 15
                    }
                }); });
            }
        }
        else if (((_status$media_attachm2 = status.media_attachments.get(0)) === null || _status$media_attachm2 === void 0 ? void 0 : _status$media_attachm2.type) === 'audio') {
            var audio_1 = status.media_attachments.get(0);
            if (audio_1) {
                media = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui_components_bundle__WEBPACK_IMPORTED_MODULE_7__["default"], {
                    fetchComponent: _ui_util_async_components__WEBPACK_IMPORTED_MODULE_8__.Audio,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 61,
                        columnNumber: 11
                    }
                }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement(Component, {
                    src: audio_1.url,
                    alt: audio_1.description,
                    inline: true,
                    sensitive: status.sensitive,
                    onOpenAudio: (lodash_noop__WEBPACK_IMPORTED_MODULE_1___default()),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 63,
                        columnNumber: 15
                    }
                }); });
            }
        }
        else {
            media = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui_components_bundle__WEBPACK_IMPORTED_MODULE_7__["default"], {
                fetchComponent: _ui_util_async_components__WEBPACK_IMPORTED_MODULE_8__.MediaGallery,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 76,
                    columnNumber: 9
                }
            }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement(Component, {
                media: status.media_attachments,
                sensitive: status.sensitive,
                height: 110,
                onOpenMedia: (lodash_noop__WEBPACK_IMPORTED_MODULE_1___default()),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 77,
                    columnNumber: 32
                }
            }); });
        }
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "status-check-box",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "status-check-box__status",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_5__["default"], {
        status: status,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 9
        }
    }), media), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "status-check-box-toggle",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_3__["default"], {
        checked: checked,
        onChange: onToggle,
        disabled: disabled,
        icons: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (StatusCheckBox);


/***/ }),

/***/ 1589:
/*!*********************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/modals/report-modal/report-modal.tsx ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/reports */ 195);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/timelines */ 46);
/* harmony import */ var soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/attachment-thumbs */ 430);
/* harmony import */ var soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/status_content */ 417);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/containers/account_container */ 159);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _steps_confirmation_step__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./steps/confirmation-step */ 1773);
/* harmony import */ var _steps_other_actions_step__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./steps/other-actions-step */ 1774);
/* harmony import */ var _steps_reason_step__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./steps/reason-step */ 1776);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modals/report-modal/report-modal.tsx";














var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_13__.defineMessages)({
    blankslate: {
        "id": "report.reason.blankslate",
        "defaultMessage": "You have removed all statuses from being selected."
    },
    done: {
        "id": "report.done",
        "defaultMessage": "Done"
    },
    next: {
        "id": "report.next",
        "defaultMessage": "Next"
    },
    close: {
        "id": "lightbox.close",
        "defaultMessage": "Close"
    },
    placeholder: {
        "id": "report.placeholder",
        "defaultMessage": "Additional comments"
    },
    submit: {
        "id": "report.submit",
        "defaultMessage": "Submit"
    }
});
var Steps;
(function (Steps) {
    Steps["ONE"] = "ONE";
    Steps["TWO"] = "TWO";
    Steps["THREE"] = "THREE";
})(Steps || (Steps = {}));
var reportSteps = {
    ONE: _steps_reason_step__WEBPACK_IMPORTED_MODULE_12__["default"],
    TWO: _steps_other_actions_step__WEBPACK_IMPORTED_MODULE_11__["default"],
    THREE: _steps_confirmation_step__WEBPACK_IMPORTED_MODULE_10__["default"]
};
var SelectedStatus = function (_ref) {
    var statusId = _ref.statusId;
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.statuses.get(statusId); });
    if (!status) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Stack, {
        space: 2,
        className: "p-4 rounded-lg bg-gray-100 dark:bg-slate-700",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: status.account,
        showProfileHoverCard: false,
        withLinkToProfile: false,
        timestamp: status.created_at,
        hideActions: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_6__["default"], {
        status: status,
        expanded: true,
        collapsable: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 7
        }
    }), status.media_attachments.size > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_attachment_thumbs__WEBPACK_IMPORTED_MODULE_5__["default"], {
        media: status.media_attachments,
        sensitive: status.sensitive,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 9
        }
    }));
};
var ReportModal = function (_ref2) {
    var onClose = _ref2.onClose;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_14__["default"])();
    var accountId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.reports.new.account_id; });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAccount)(accountId);
    var isBlocked = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.reports.new.block; });
    var isSubmitting = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.reports.new.isSubmitting; });
    var rules = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.rules.items; });
    var ruleIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.reports.new.rule_ids; });
    var selectedStatusIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.reports.new.status_ids; });
    var isReportingAccount = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return selectedStatusIds.size === 0; }, []);
    var shouldRequireRule = rules.length > 0;
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(Steps.ONE), currentStep = _a[0], setCurrentStep = _a[1];
    var handleSubmit = function () {
        dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_3__.submitReport)()).then(function () { return setCurrentStep(Steps.THREE); }).catch(function (error) { return dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_3__.submitReportFail)(error)); });
        if (isBlocked && account) {
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__.blockAccount)(account.id));
        }
    };
    var handleNextStep = function () {
        switch (currentStep) {
            case Steps.ONE:
                setCurrentStep(Steps.TWO);
                break;
            case Steps.TWO:
                handleSubmit();
                break;
            case Steps.THREE:
                dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_3__.submitReportSuccess)());
                onClose();
                break;
            default:
                break;
        }
    };
    var renderSelectedStatuses = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function () {
        switch (selectedStatusIds.size) {
            case 0:
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                    className: "bg-gray-100 dark:bg-slate-700 p-4 rounded-lg flex items-center justify-center w-full",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 126,
                        columnNumber: 11
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 127,
                        columnNumber: 13
                    }
                }, intl.formatMessage(messages.blankslate)));
            default:
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(SelectedStatus, {
                    statusId: selectedStatusIds.first(),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 131,
                        columnNumber: 16
                    }
                });
        }
    }, [selectedStatusIds.size]);
    var confirmationText = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () {
        switch (currentStep) {
            case Steps.TWO:
                return intl.formatMessage(messages.submit);
            case Steps.THREE:
                return intl.formatMessage(messages.done);
            default:
                return intl.formatMessage(messages.next);
        }
    }, [currentStep]);
    var isConfirmationButtonDisabled = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () {
        if (currentStep === Steps.THREE) {
            return false;
        }
        return isSubmitting || shouldRequireRule && ruleIds.isEmpty() || !isReportingAccount && selectedStatusIds.size === 0;
    }, [currentStep, isSubmitting, shouldRequireRule, ruleIds, selectedStatusIds.size, isReportingAccount]);
    var calculateProgress = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(function () {
        switch (currentStep) {
            case Steps.ONE:
                return 0.33;
            case Steps.TWO:
                return 0.66;
            case Steps.THREE:
                return 1;
            default:
                return 0;
        }
    }, [currentStep]);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (account) {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__.expandAccountTimeline)(account.id, {
                withReplies: true,
                maxId: null
            }));
        }
    }, [account]);
    if (!account) {
        return null;
    }
    var StepToRender = reportSteps[currentStep];
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "report.target",
            defaultMessage: "Reporting {target}",
            values: {
                target: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("strong", {
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 181,
                        columnNumber: 105
                    }
                }, "@", account.acct)
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 181,
                columnNumber: 14
            }
        }),
        onClose: onClose,
        cancelAction: currentStep === Steps.THREE ? undefined : onClose,
        confirmationAction: handleNextStep,
        confirmationText: confirmationText,
        confirmationDisabled: isConfirmationButtonDisabled,
        skipFocus: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 180,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 189,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.ProgressBar, {
        progress: calculateProgress(),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 190,
            columnNumber: 9
        }
    }), currentStep !== Steps.THREE && !isReportingAccount && renderSelectedStatuses(), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(StepToRender, {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 194,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ReportModal);


/***/ }),

/***/ 1773:
/*!********************************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/modals/report-modal/steps/confirmation-step.tsx ***!
  \********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/soapbox */ 68);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modals/report-modal/steps/confirmation-step.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    title: {
        "id": "report.confirmation.title",
        "defaultMessage": "Thanks for submitting your report."
    },
    content: {
        "id": "report.confirmation.content",
        "defaultMessage": "If we find that this account is violating the {link} we will take further action on the matter."
    }
});
var termsOfServiceText = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
    id: "shared.tos",
    defaultMessage: "Terms of Service",
    __self: undefined,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 19,
        columnNumber: 29
    }
});
var renderTermsOfServiceLink = function (href) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
    href: href,
    target: "_blank",
    className: "hover:underline text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-500",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 25,
        columnNumber: 3
    }
}, termsOfServiceText); };
var ConfirmationStep = function (_ref) {
    var account = _ref.account;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])();
    var links = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return (0,soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_1__.getSoapboxConfig)(state).get('links'); });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        weight: "semibold",
        tag: "h1",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.title)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.content, {
        link: links.get('termsOfService') ? renderTermsOfServiceLink(links.get('termsOfService')) : termsOfServiceText
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ConfirmationStep);


/***/ }),

/***/ 1774:
/*!*********************************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/modals/report-modal/steps/other-actions-step.tsx ***!
  \*********************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_toggle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-toggle */ 911);
/* harmony import */ var soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/reports */ 195);
/* harmony import */ var soapbox_actions_rules__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/rules */ 939);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_features_report_components_status_check_box__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/report/components/status_check_box */ 1775);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/utils/accounts */ 143);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modals/report-modal/steps/other-actions-step.tsx";












var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__.defineMessages)({
    addAdditionalStatuses: {
        "id": "report.otherActions.addAdditionl",
        "defaultMessage": "Would you like to add additional statuses to this report?"
    },
    addMore: {
        "id": "report.otherActions.addMore",
        "defaultMessage": "Add more"
    },
    furtherActions: {
        "id": "report.otherActions.furtherActions",
        "defaultMessage": "Further actions:"
    },
    hideAdditonalStatuses: {
        "id": "report.otherActions.hideAdditional",
        "defaultMessage": "Hide additional statuses"
    },
    otherStatuses: {
        "id": "report.otherActions.otherStatuses",
        "defaultMessage": "Include other statuses?"
    }
});
var OtherActionsStep = function (_ref) {
    var account = _ref.account;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useFeatures)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__["default"])();
    var statusIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return (0,immutable__WEBPACK_IMPORTED_MODULE_12__.OrderedSet)(state.timelines.get("account:".concat(account.id, ":with_replies")).items).union(state.reports.new.status_ids); });
    var isBlocked = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.reports.new.block; });
    var isForward = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.reports.new.forward; });
    var canForward = (0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_9__.isRemote)(account) && features.federating;
    var isSubmitting = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.reports.new.isSubmitting; });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), showAdditionalStatuses = _a[0], setShowAdditionalStatuses = _a[1];
    var handleBlockChange = function (event) {
        dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_4__.changeReportBlock)(event.target.checked));
    };
    var handleForwardChange = function (event) {
        dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_4__.changeReportForward)(event.target.checked));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        dispatch((0,soapbox_actions_rules__WEBPACK_IMPORTED_MODULE_5__.fetchRules)());
    }, []);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 5
        }
    }, features.reportMultipleStatuses && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        tag: "h1",
        size: "xl",
        weight: "semibold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.otherStatuses)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: intl.formatMessage(messages.addAdditionalStatuses),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 11
        }
    }, showAdditionalStatuses ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "bg-gray-100 dark:bg-slate-600 rounded-lg p-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 17
        }
    }, statusIds.map(function (statusId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_report_components_status_check_box__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: statusId,
        key: statusId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 48
        }
    }); })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        icon: __webpack_require__(/*! @tabler/icons/arrows-minimize.svg */ 1103),
        theme: "secondary",
        size: "sm",
        onClick: function () { return setShowAdditionalStatuses(false); },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 19
        }
    }, intl.formatMessage(messages.hideAdditonalStatuses)))) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        icon: __webpack_require__(/*! @tabler/icons/plus.svg */ 263),
        theme: "secondary",
        size: "sm",
        onClick: function () { return setShowAdditionalStatuses(true); },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 15
        }
    }, intl.formatMessage(messages.addMore)))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        tag: "h1",
        size: "xl",
        weight: "semibold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 9
        }
    }, intl.formatMessage(messages.furtherActions)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
            id: "report.block_hint",
            defaultMessage: "Do you also want to block this account?",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 99,
                columnNumber: 22
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_3__["default"], {
        checked: isBlocked,
        onChange: handleBlockChange,
        icons: false,
        id: "report-block",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "muted",
        tag: "label",
        size: "sm",
        htmlFor: "report-block",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "report.block",
        defaultMessage: "Block {target}",
        values: {
            target: "@".concat(account.get('acct'))
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 15
        }
    })))), canForward && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
            id: "report.forward_hint",
            defaultMessage: "The account is from another server. Send a copy of the report there as well?",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 117,
                columnNumber: 24
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 116,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 119,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_3__["default"], {
        checked: isForward,
        onChange: handleForwardChange,
        icons: false,
        id: "report-forward",
        disabled: isSubmitting,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 120,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "muted",
        tag: "label",
        size: "sm",
        htmlFor: "report-forward",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "report.forward",
        defaultMessage: "Forward to {target}",
        values: {
            target: (0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_9__.getDomain)(account)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 17
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (OtherActionsStep);


/***/ }),

/***/ 1776:
/*!**************************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/modals/report-modal/steps/reason-step.tsx ***!
  \**************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/reports */ 195);
/* harmony import */ var soapbox_actions_rules__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/rules */ 939);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modals/report-modal/steps/reason-step.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    placeholder: {
        "id": "report.placeholder",
        "defaultMessage": "Additional comments"
    },
    reasonForReporting: {
        "id": "report.reason.title",
        "defaultMessage": "Reason for reporting"
    }
});
var RULES_HEIGHT = 385;
var ReasonStep = function (_props) {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_4__.useDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var rulesListRef = (0,react__WEBPACK_IMPORTED_MODULE_3__.useRef)(null);
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false), isNearBottom = _a[0], setNearBottom = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(true), isNearTop = _b[0], setNearTop = _b[1];
    var comment = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.reports.new.comment; });
    var rules = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.rules.items; });
    var ruleIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.reports.new.rule_ids; });
    var shouldRequireRule = rules.length > 0;
    var selectedStatusIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.reports.new.status_ids; });
    var isReportingAccount = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function () { return selectedStatusIds.size === 0; }, []);
    var handleCommentChange = function (event) {
        dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_5__.changeReportComment)(event.target.value));
    };
    var handleRulesScrolling = function () {
        if (rulesListRef.current) {
            var _a = rulesListRef.current, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
            if (scrollTop + clientHeight > scrollHeight - 24) {
                setNearBottom(true);
            }
            else {
                setNearBottom(false);
            }
            if (scrollTop < 24) {
                setNearTop(true);
            }
            else {
                setNearTop(false);
            }
        }
    };
    var filterRuleType = function (rule) {
        var ruleTypeToFilter = isReportingAccount ? 'account' : 'content';
        if (rule.rule_type) {
            return rule.rule_type === ruleTypeToFilter;
        }
        return true;
    };
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
        dispatch((0,soapbox_actions_rules__WEBPACK_IMPORTED_MODULE_6__.fetchRules)());
    }, []);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
        if (rules.length > 0 && rulesListRef.current) {
            var clientHeight = rulesListRef.current.clientHeight;
            if (clientHeight <= RULES_HEIGHT) {
                setNearBottom(true);
            }
        }
    }, [rules, rulesListRef.current]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 5
        }
    }, shouldRequireRule && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
        size: "xl",
        weight: "semibold",
        tag: "h1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.reasonForReporting)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        style: {
            maxHeight: RULES_HEIGHT
        },
        className: "rounded-lg -space-y-px overflow-y-auto",
        onScroll: handleRulesScrolling,
        ref: rulesListRef,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 13
        }
    }, rules.filter(filterRuleType).map(function (rule, idx) {
        var isSelected = ruleIds.includes(String(rule.id));
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("button", {
            key: idx,
            "data-testid": "rule-".concat(rule.id),
            onClick: function () { return dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_5__.changeReportRule)(rule.id)); },
            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
                'relative border border-solid border-gray-200 dark:border-slate-900/75 hover:bg-gray-50 dark:hover:bg-slate-900/50 text-left w-full p-4 flex justify-between items-center cursor-pointer': true,
                'rounded-tl-lg rounded-tr-lg': idx === 0,
                'rounded-bl-lg rounded-br-lg': idx === rules.length - 1,
                'bg-gray-50 dark:bg-slate-900': isSelected
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 106,
                columnNumber: 19
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Stack, {
            className: "mr-3",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 117,
                columnNumber: 21
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
            tag: "span",
            size: "sm",
            weight: "medium",
            theme: isSelected ? 'primary' : 'default',
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 118,
                columnNumber: 23
            }
        }, rule.text), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Text, {
            tag: "span",
            theme: "muted",
            size: "sm",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 126,
                columnNumber: 23
            }
        }, rule.subtext)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("input", {
            name: "reason",
            type: "checkbox",
            value: rule.id,
            checked: isSelected,
            readOnly: true,
            className: "h-4 w-4 cursor-pointer text-primary-600 dark:text-primary-400 border-gray-300 rounded focus:ring-primary-500",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 129,
                columnNumber: 21
            }
        }));
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('inset-x-0 top-0 flex rounded-t-lg justify-center bg-gradient-to-b from-white pb-12 pt-8 pointer-events-none dark:from-slate-900 absolute transition-opacity duration-500', {
            'opacity-0': isNearTop,
            'opacity-100': !isNearTop
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 142,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('inset-x-0 bottom-0 flex rounded-b-lg justify-center bg-gradient-to-t from-white pt-12 pb-8 pointer-events-none dark:from-slate-900 absolute transition-opacity duration-500', {
            'opacity-0': isNearBottom,
            'opacity-100': !isNearBottom
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 148,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.FormGroup, {
        labelText: intl.formatMessage(messages.placeholder),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 158,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Textarea, {
        placeholder: intl.formatMessage(messages.placeholder),
        value: comment,
        onChange: handleCommentChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 159,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ReasonStep);


/***/ })

}]);
//# sourceMappingURL=report-modal-59b980e829c82ab95485.chunk.js.map