"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[72],{

/***/ 2284:
/*!*******************************************!*\
  !*** ./app/soapbox/components/sticky.tsx ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/sticky.tsx";


;
var Sticky = function (_ref) {
    var className = _ref.className, stickyClassName = _ref.stickyClassName, children = _ref.children;
    var root = react__WEBPACK_IMPORTED_MODULE_1__.useRef();
    var node = react__WEBPACK_IMPORTED_MODULE_1__.useRef();
    var _a = react__WEBPACK_IMPORTED_MODULE_1__.useState(false), sticky = _a[0], setSticky = _a[1];
    var onSticky = react__WEBPACK_IMPORTED_MODULE_1__.useCallback(function (e) {
        if (e.find(function (entry) { return entry.isIntersecting == false; }))
            setSticky(true);
        else
            setSticky(false);
    }, []);
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () {
        var observer = new IntersectionObserver(onSticky, {
            threshold: [0, 1.0]
        });
        observer.observe(root.current);
        return function () {
            observer.disconnect();
        };
    }, [onSticky]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        ref: root,
        className: className,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 13
        }
    }, children), sticky && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        ref: node,
        className: "component-sticky__fixed fixed top-0 z-50 ".concat(stickyClassName),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 21
        }
    }, children));
};
/* harmony default export */ __webpack_exports__["default"] = (Sticky);


/***/ }),

/***/ 2285:
/*!**********************************************!*\
  !*** ./app/soapbox/components/tombstone.tsx ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_hotkeys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-hotkeys */ 405);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/tombstone.tsx";




/** Represents a deleted item. */
var Tombstone = function (_ref) {
    var id = _ref.id, onMoveUp = _ref.onMoveUp, onMoveDown = _ref.onMoveDown;
    var handlers = {
        moveUp: function () { return onMoveUp(id); },
        moveDown: function () { return onMoveDown(id); }
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_hotkeys__WEBPACK_IMPORTED_MODULE_1__.HotKeys, {
        handlers: handlers,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "p-9 flex items-center justify-center sm:rounded-xl bg-gray-100 border border-solid border-gray-200 dark:bg-slate-900 dark:border-slate-700 focusable",
        tabIndex: 0,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "statuses.tombstone",
        defaultMessage: "One or more posts are unavailable.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (Tombstone);


/***/ }),

/***/ 2286:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/status/components/detailed-status.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/settings */ 22);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/icon */ 29);
/* harmony import */ var soapbox_components_status_media__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/status-media */ 1351);
/* harmony import */ var soapbox_components_status_reply_mentions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/status-reply-mentions */ 422);
/* harmony import */ var soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/status_content */ 397);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/containers/account_container */ 144);
/* harmony import */ var soapbox_features_status_containers_quoted_status_container__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/features/status/containers/quoted_status_container */ 1350);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var soapbox_utils_status__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/utils/status */ 194);
/* harmony import */ var _status_interaction_bar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./status-interaction-bar */ 2287);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/status/components/detailed-status.tsx";














var DetailedStatus = function (_ref) {
    var status = _ref.status, onToggleHidden = _ref.onToggleHidden, onOpenCompareHistoryModal = _ref.onOpenCompareHistoryModal, onToggleMediaVisibility = _ref.onToggleMediaVisibility, onTranslate = _ref.onTranslate, showMedia = _ref.showMedia;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_13__["default"])();
    var node = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var ownAccount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useOwnAccount)();
    var locale = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__.getSettings)(state).get('locale'); });
    var localeTranslated = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () { return new Intl.DisplayNames([locale], {
        type: 'language'
    }).of(locale); }, [locale]);
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_10__.getFeatures)(state.instance); });
    var logo = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useLogo)();
    var actualStatus = (0,soapbox_utils_status__WEBPACK_IMPORTED_MODULE_11__.getActualStatus)(status);
    var account = actualStatus.account;
    var canTranslate = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () { return ownAccount && features.translations && actualStatus.language !== locale; }, [ownAccount, features, actualStatus]);
    var handleExpandedToggle = function () {
        onToggleHidden(status);
    };
    var handleOpenCompareHistoryModal = function () {
        onOpenCompareHistoryModal(status);
    };
    var handleTranslateStatus = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function () {
        onTranslate(status, locale);
    }, [status, locale]);
    var privacyIcon = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
        switch (actualStatus === null || actualStatus === void 0 ? void 0 : actualStatus.visibility) {
            default:
            case 'public':
                return __webpack_require__(/*! @tabler/icons/world.svg */ 190);
            case 'unlisted':
                return __webpack_require__(/*! @tabler/icons/eye-off.svg */ 148);
            case 'local':
                return logo;
            case 'private':
                return __webpack_require__(/*! @tabler/icons/lock.svg */ 150);
            case 'direct':
                return __webpack_require__(/*! @tabler/icons/mail.svg */ 92);
        }
    }, [actualStatus === null || actualStatus === void 0 ? void 0 : actualStatus.visibility]);
    if (!actualStatus)
        return null;
    if (!account || typeof account !== 'object')
        return null;
    var quote;
    if (actualStatus.quote) {
        if (actualStatus.pleroma.get('quote_visible', true) === false) {
            quote = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
                className: "quoted-actualStatus-tombstone",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 91,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 92,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
                id: "actualStatuses.quote_tombstone",
                defaultMessage: "Post is unavailable.",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 92,
                    columnNumber: 14
                }
            })));
        }
        else {
            quote = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_status_containers_quoted_status_container__WEBPACK_IMPORTED_MODULE_8__["default"], {
                statusId: actualStatus.quote,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 96,
                    columnNumber: 15
                }
            });
        }
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "border-box",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 103,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        ref: node,
        className: "detailed-actualStatus",
        tabIndex: -1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mb-4 flex items-center justify-between gap-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 105,
            columnNumber: 9
        }
    }, canTranslate ? !actualStatus.translations.get(locale) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        theme: "link",
        size: "sm",
        onClick: handleTranslateStatus,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
        className: "mr-1",
        src: __webpack_require__(/*! @tabler/icons/language.svg */ 2288),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
        id: "actualStatuses.translate",
        defaultMessage: "Translate",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 111,
            columnNumber: 19
        }
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "subtle",
        className: "flex items-center",
        size: "xs",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
        className: "mr-1",
        src: __webpack_require__(/*! @tabler/icons/check.svg */ 146),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 115,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
        id: "actualStatuses.translated",
        defaultMessage: "Translate",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 116,
            columnNumber: 19
        }
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
        className: "text-gray-300 dark:text-slate-500",
        src: __webpack_require__(/*! @tabler/icons/note.svg */ 2289),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 120,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
        "aria-hidden": true,
        src: privacyIcon,
        className: "h-5 w-5 shrink-0 text-gray-400 dark:text-gray-600",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 123,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mb-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_7__["default"], {
        key: account.id,
        id: account.id,
        timestamp: actualStatus.created_at,
        avatarSize: 42,
        hideActions: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_status_reply_mentions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        status: actualStatus,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 136,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_status_content__WEBPACK_IMPORTED_MODULE_5__["default"], {
        status: actualStatus,
        expanded: !actualStatus.hidden,
        onExpandedToggle: handleExpandedToggle,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 138,
            columnNumber: 9
        }
    }), actualStatus.translations.get(locale) && !actualStatus.hidden && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("hr", {
        className: "my-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        className: "mb-1",
        size: "md",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 148,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
        id: "actualStatuses.translate_done",
        defaultMessage: "Status translated to {locale}",
        values: {
            locale: localeTranslated
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 149,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "status__content",
        lang: locale,
        dangerouslySetInnerHTML: {
            __html: actualStatus.translations.get(locale)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 155,
            columnNumber: 15
        }
    })), !actualStatus.hidden && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_status_media__WEBPACK_IMPORTED_MODULE_3__["default"], {
        status: actualStatus,
        showMedia: showMedia,
        onToggleVisibility: onToggleMediaVisibility,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 166,
            columnNumber: 13
        }
    }), quote), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.HStack, {
        justifyContent: "between",
        alignItems: "center",
        className: "py-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 175,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_status_interaction_bar__WEBPACK_IMPORTED_MODULE_12__["default"], {
        status: actualStatus,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 176,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 1,
        className: "items-end mb-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 178,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 179,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        href: actualStatus.url,
        target: "_blank",
        rel: "noopener",
        className: "hover:underline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 180,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        tag: "span",
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 181,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__.FormattedDate, {
        value: new Date(actualStatus.created_at),
        hour12: false,
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 182,
            columnNumber: 19
        }
    }))), actualStatus.edited_at && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, ' · ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "inline hover:underline",
        onClick: handleOpenCompareHistoryModal,
        role: "button",
        tabIndex: 0,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 189,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        tag: "span",
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 195,
            columnNumber: 21
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
        id: "actualStatus.edited",
        defaultMessage: "Edited {date}",
        values: {
            date: intl.formatDate(new Date(actualStatus.edited_at), {
                hour12: false,
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 196,
            columnNumber: 23
        }
    })))))))));
};
/* harmony default export */ __webpack_exports__["default"] = (DetailedStatus);


/***/ }),

/***/ 2287:
/*!***************************************************************************!*\
  !*** ./app/soapbox/features/status/components/status-interaction-bar.tsx ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_utils_emoji_reacts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/utils/emoji_reacts */ 292);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/status/components/status-interaction-bar.tsx";









var StatusInteractionBar = function (_ref) {
    var status = _ref.status;
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (_ref2) {
        var me = _ref2.me;
        return me;
    });
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useFeatures)();
    var account = status.account;
    var onOpenUnauthorizedModal = function () {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('UNAUTHORIZED'));
    };
    var onOpenReblogsModal = function (username, statusId) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('REBLOGS', {
            username: username,
            statusId: statusId
        }));
    };
    var onOpenFavouritesModal = function (username, statusId) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('FAVOURITES', {
            username: username,
            statusId: statusId
        }));
    };
    var onOpenReactionsModal = function (username, statusId, reaction) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('REACTIONS', {
            username: username,
            statusId: statusId,
            reaction: reaction
        }));
    };
    var getNormalizedReacts = react__WEBPACK_IMPORTED_MODULE_1__.useCallback(function () {
        return (0,soapbox_utils_emoji_reacts__WEBPACK_IMPORTED_MODULE_6__.reduceEmoji)((0,immutable__WEBPACK_IMPORTED_MODULE_7__.List)(status.pleroma.get('emoji_reactions')), status.favourites_count, status.favourited, null // we dont want to filter them
        ).reverse();
    }, [status]);
    if (!account || typeof account !== 'object')
        return null;
    var handleOpenReblogsModal = function (e) {
        e.preventDefault();
        if (!me)
            onOpenUnauthorizedModal();
        else
            onOpenReblogsModal(account.acct, status.id);
    };
    var getReposts = function () {
        if (status.reblogs_count) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
                space: 0.5,
                alignItems: "center",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 73,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
                className: "text-success-600 cursor-pointer",
                src: __webpack_require__(/*! @tabler/icons/repeat.svg */ 260),
                role: "presentation",
                onClick: handleOpenReblogsModal,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 74,
                    columnNumber: 11
                }
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
                theme: "muted",
                size: "sm",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 81,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__.FormattedNumber, {
                value: status.reblogs_count,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 82,
                    columnNumber: 13
                }
            })));
        }
        return '';
    };
    var handleOpenFavouritesModal = function (e) {
        e.preventDefault();
        if (!me)
            onOpenUnauthorizedModal();
        else
            onOpenFavouritesModal(account.acct, status.id);
    };
    var getFavourites = function () {
        if (status.favourites_count) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
                space: 0.5,
                alignItems: "center",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 101,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.IconButton, {
                className: classnames__WEBPACK_IMPORTED_MODULE_0___default()({
                    'text-accent-300': true,
                    'cursor-default': !features.exposableReactions
                }),
                src: __webpack_require__(/*! @tabler/icons/heart.svg */ 1508),
                iconClassName: "fill-accent-300",
                role: "presentation",
                onClick: features.exposableReactions ? handleOpenFavouritesModal : undefined,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 102,
                    columnNumber: 11
                }
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
                theme: "muted",
                size: "sm",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 113,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__.FormattedNumber, {
                value: status.favourites_count,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 114,
                    columnNumber: 13
                }
            })));
        }
        return '';
    };
    var handleOpenReactionsModal = function (reaction) { return function () {
        if (!me)
            onOpenUnauthorizedModal();
        else
            onOpenReactionsModal(account.acct, status.id, String(reaction.get('name')));
    }; };
    var getEmojiReacts = function () {
        var emojiReacts = getNormalizedReacts();
        var count = emojiReacts.reduce(function (acc, cur) { return acc + cur.get('count'); }, 0);
        if (count > 0) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
                space: 0.5,
                className: "emoji-reacts-container",
                alignItems: "center",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 136,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "emoji-reacts",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 137,
                    columnNumber: 11
                }
            }, emojiReacts.map(function (e, i) {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
                    space: 0.5,
                    className: "emoji-react p-1",
                    alignItems: "center",
                    key: i,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 140,
                        columnNumber: 17
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.EmojiReact, {
                    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('emoji-react__emoji w-5 h-5 flex-none', {
                        'cursor-pointer': features.exposableReactions
                    }),
                    emoji: e,
                    onClick: features.exposableReactions ? handleOpenReactionsModal(e) : undefined,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 141,
                        columnNumber: 19
                    }
                }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
                    theme: "muted",
                    size: "sm",
                    className: "emoji-react__count",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 146,
                        columnNumber: 19
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__.FormattedNumber, {
                    value: e.get('count'),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 147,
                        columnNumber: 21
                    }
                })));
            })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
                theme: "muted",
                size: "sm",
                className: "emoji-reacts__count",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 154,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__.FormattedNumber, {
                value: count,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 155,
                    columnNumber: 13
                }
            })));
        }
        return '';
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        space: 3,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 165,
            columnNumber: 5
        }
    }, features.emojiReacts ? getEmojiReacts() : getFavourites(), getReposts());
};
/* harmony default export */ __webpack_exports__["default"] = (StatusInteractionBar);


/***/ }),

/***/ 2290:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/status/components/thread-login-cta.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/status/components/thread-login-cta.tsx";




/** Prompts logged-out users to log in when viewing a thread. */
var ThreadLoginCta = function () {
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance.title; });
    var registrationOpen = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance.registrations; });
    if (!registrationOpen)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        className: "px-6 py-12 space-y-6 text-center",
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.CardTitle, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
            id: "thread_login.title",
            defaultMessage: "Continue the conversation",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 18,
                columnNumber: 27
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "thread_login.message",
        defaultMessage: "Join {siteTitle} to get the full story and details.",
        values: {
            siteTitle: siteTitle
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        space: 4,
        className: "max-w-xs mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        theme: "secondary",
        to: "/login",
        block: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "thread_login.login",
        defaultMessage: "Log in",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        to: "/signup",
        block: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "thread_login.signup",
        defaultMessage: "Sign up",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (ThreadLoginCta);


/***/ }),

/***/ 2291:
/*!******************************************************************!*\
  !*** ./app/soapbox/features/status/components/thread-status.tsx ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/containers/status_container */ 1504);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_status */ 1514);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/status/components/thread-status.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }






/** Status with reply-connector in threads. */
var ThreadStatus = function (props) {
    var id = props.id, focusedStatusId = props.focusedStatusId;
    var replyToId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.contexts.inReplyTos.get(id); });
    var replyCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.contexts.replies.get(id, (0,immutable__WEBPACK_IMPORTED_MODULE_5__.OrderedSet)()).size; });
    var isLoaded = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return Boolean(state.statuses.get(id)); });
    var renderConnector = function () {
        var isConnectedTop = replyToId && replyToId !== focusedStatusId;
        var isConnectedBottom = replyCount > 0;
        var isConnected = isConnectedTop || isConnectedBottom;
        if (!isConnected)
            return null;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('thread__connector', {
                'thread__connector--top': isConnectedTop,
                'thread__connector--bottom': isConnectedBottom
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 32,
                columnNumber: 7
            }
        });
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "thread__status",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 5
        }
    }, renderConnector(), isLoaded ?
        /*#__PURE__*/
        // @ts-ignore FIXME
        react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, props, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 46,
                columnNumber: 9
            }
        })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_3__["default"], {
        thread: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 9
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ThreadStatus);


/***/ }),

/***/ 2044:
/*!***********************************************!*\
  !*** ./app/soapbox/features/status/index.tsx ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/web.immediate.js */ 1552);
/* harmony import */ var core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_immediate_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash */ 395);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_hotkeys__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-hotkeys */ 405);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! reselect */ 66);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/actions/compose */ 30);
/* harmony import */ var soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/actions/interactions */ 126);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/actions/settings */ 22);
/* harmony import */ var soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/actions/statuses */ 58);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1878);
/* harmony import */ var soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! soapbox/components/pull-to-refresh */ 396);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1496);
/* harmony import */ var soapbox_components_status_action_bar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! soapbox/components/status-action-bar */ 1621);
/* harmony import */ var soapbox_components_sticky__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! soapbox/components/sticky */ 2284);
/* harmony import */ var soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! soapbox/components/sub_navigation */ 1507);
/* harmony import */ var soapbox_components_tombstone__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! soapbox/components/tombstone */ 2285);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_status */ 1514);
/* harmony import */ var soapbox_features_ui_components_pending_status__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! soapbox/features/ui/components/pending_status */ 1627);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! soapbox/selectors */ 31);
/* harmony import */ var soapbox_utils_status__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! soapbox/utils/status */ 194);
/* harmony import */ var _components_detailed_status__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./components/detailed-status */ 2286);
/* harmony import */ var _components_thread_login_cta__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/thread-login-cta */ 2290);
/* harmony import */ var _components_thread_status__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./components/thread-status */ 2291);
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
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/status/index.tsx";

































var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_30__.defineMessages)({
    title: {
        "id": "status.title",
        "defaultMessage": "@{username}'s Post"
    },
    titleDirect: {
        "id": "status.title_direct",
        "defaultMessage": "Direct message"
    },
    deleteConfirm: {
        "id": "confirmations.delete.confirm",
        "defaultMessage": "Delete"
    },
    deleteHeading: {
        "id": "confirmations.delete.heading",
        "defaultMessage": "Delete post"
    },
    deleteMessage: {
        "id": "confirmations.delete.message",
        "defaultMessage": "Are you sure you want to delete this post?"
    },
    redraftConfirm: {
        "id": "confirmations.redraft.confirm",
        "defaultMessage": "Delete & redraft"
    },
    redraftHeading: {
        "id": "confirmations.redraft.heading",
        "defaultMessage": "Delete & redraft"
    },
    redraftMessage: {
        "id": "confirmations.redraft.message",
        "defaultMessage": "Are you sure you want to delete this post and re-draft it? Favorites and reposts will be lost, and replies to the original post will be orphaned."
    },
    blockConfirm: {
        "id": "confirmations.block.confirm",
        "defaultMessage": "Block"
    },
    revealAll: {
        "id": "status.show_more_all",
        "defaultMessage": "Show more for all"
    },
    hideAll: {
        "id": "status.show_less_all",
        "defaultMessage": "Show less for all"
    },
    detailedStatus: {
        "id": "status.detailed_status",
        "defaultMessage": "Detailed conversation view"
    },
    replyConfirm: {
        "id": "confirmations.reply.confirm",
        "defaultMessage": "Reply"
    },
    replyMessage: {
        "id": "confirmations.reply.message",
        "defaultMessage": "Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?"
    },
    blockAndReport: {
        "id": "confirmations.block.block_and_report",
        "defaultMessage": "Block & Report"
    }
});
var getStatus = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_25__.makeGetStatus)();
var getAncestorsIds = (0,reselect__WEBPACK_IMPORTED_MODULE_8__.createSelector)([function (_, statusId) { return statusId; }, function (state) { return state.contexts.inReplyTos; }], function (statusId, inReplyTos) {
    var ancestorsIds = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.OrderedSet)();
    var id = statusId;
    while (id && !ancestorsIds.includes(id)) {
        ancestorsIds = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.OrderedSet)([id]).union(ancestorsIds);
        id = inReplyTos.get(id);
    }
    return ancestorsIds;
});
var getDescendantsIds = (0,reselect__WEBPACK_IMPORTED_MODULE_8__.createSelector)([function (_, statusId) { return statusId; }, function (state) { return state.contexts.replies; }], function (statusId, contextReplies) {
    var descendantsIds = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.OrderedSet)();
    var ids = [statusId];
    while (ids.length > 0) {
        var id = ids.shift();
        if (!id)
            break;
        var replies = contextReplies.get(id);
        if (descendantsIds.includes(id)) {
            break;
        }
        if (statusId !== id) {
            descendantsIds = descendantsIds.union([id]);
        }
        if (replies) {
            replies.reverse().forEach(function (reply) {
                ids.unshift(reply);
            });
        }
    }
    return descendantsIds;
});
var Thread = function (props) {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_32__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_33__.useHistory)();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_24__.useAppDispatch)();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_24__.useSettings)();
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_24__.useAppSelector)(function (state) { return state.me; });
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_24__.useAppSelector)(function (state) { return getStatus(state, {
        id: props.params.statusId
    }); });
    var displayMedia = settings.get('displayMedia');
    var askReplyConfirmation = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_24__.useAppSelector)(function (state) { return state.compose.text.trim().length !== 0; });
    var _a = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_24__.useAppSelector)(function (state) {
        var ancestorsIds = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.OrderedSet)();
        var descendantsIds = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.OrderedSet)();
        if (status) {
            var statusId = status.id;
            ancestorsIds = getAncestorsIds(state, state.contexts.inReplyTos.get(statusId));
            descendantsIds = getDescendantsIds(state, statusId);
            ancestorsIds = ancestorsIds.delete(statusId).subtract(descendantsIds);
            descendantsIds = descendantsIds.delete(statusId).subtract(ancestorsIds);
        }
        return {
            status: status,
            ancestorsIds: ancestorsIds,
            descendantsIds: descendantsIds
        };
    }), ancestorsIds = _a.ancestorsIds, descendantsIds = _a.descendantsIds;
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)((0,soapbox_utils_status__WEBPACK_IMPORTED_MODULE_26__.defaultMediaVisibility)(status, displayMedia)), showMedia = _b[0], setShowMedia = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(!!status), isLoaded = _c[0], setIsLoaded = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(), next = _d[0], setNext = _d[1];
    var node = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
    var statusRef = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
    var scroller = (0,react__WEBPACK_IMPORTED_MODULE_6__.useRef)(null);
    /** Fetch the status (and context) from the API. */
    var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, statusId, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = props.params;
                    statusId = params.statusId;
                    return [4 /*yield*/, dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_13__.fetchStatusWithContext)(statusId))];
                case 1:
                    next = (_a.sent()).next;
                    setNext(next);
                    return [2 /*return*/];
            }
        });
    }); }; // Load data.
    (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(function () {
        fetchData().then(function () {
            setIsLoaded(true);
        }).catch(function (error) {
            setIsLoaded(true);
        });
    }, [props.params.statusId]);
    var handleToggleMediaVisibility = function () {
        setShowMedia(!showMedia);
    };
    var handleHotkeyReact = function () {
        if (statusRef.current) {
            var firstEmoji = statusRef.current.querySelector('.emoji-react-selector .emoji-react-selector__emoji');
            firstEmoji === null || firstEmoji === void 0 ? void 0 : firstEmoji.focus();
        }
    };
    var handleFavouriteClick = function (status) {
        if (status.favourited) {
            dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_10__.unfavourite)(status));
        }
        else {
            dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_10__.favourite)(status));
        }
    };
    var handleReplyClick = function (status) {
        if (askReplyConfirmation) {
            dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_11__.openModal)('CONFIRM', {
                message: intl.formatMessage(messages.replyMessage),
                confirm: intl.formatMessage(messages.replyConfirm),
                onConfirm: function () { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_9__.replyCompose)(status)); }
            }));
        }
        else {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_9__.replyCompose)(status));
        }
    };
    var handleModalReblog = function (status) {
        dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_10__.reblog)(status));
    };
    var handleReblogClick = function (status, e) {
        dispatch(function (_, getState) {
            var boostModal = (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_12__.getSettings)(getState()).get('boostModal');
            if (status.reblogged) {
                dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_10__.unreblog)(status));
            }
            else {
                if (e && e.shiftKey || !boostModal) {
                    handleModalReblog(status);
                }
                else {
                    dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_11__.openModal)('BOOST', {
                        status: status,
                        onReblog: handleModalReblog
                    }));
                }
            }
        });
    };
    var handleMentionClick = function (account) {
        dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_9__.mentionCompose)(account));
    };
    var handleOpenMedia = function (media, index) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_11__.openModal)('MEDIA', {
            media: media,
            index: index
        }));
    };
    var handleOpenVideo = function (media, time) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_11__.openModal)('VIDEO', {
            media: media,
            time: time
        }));
    };
    var handleHotkeyOpenMedia = function (e) {
        var onOpenMedia = props.onOpenMedia, onOpenVideo = props.onOpenVideo;
        var firstAttachment = status === null || status === void 0 ? void 0 : status.media_attachments.get(0);
        e === null || e === void 0 ? void 0 : e.preventDefault();
        if (status && firstAttachment) {
            if (firstAttachment.type === 'video') {
                onOpenVideo(firstAttachment, 0);
            }
            else {
                onOpenMedia(status.media_attachments, 0);
            }
        }
    };
    var handleToggleHidden = function (status) {
        if (status.hidden) {
            dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_13__.revealStatus)(status.id));
        }
        else {
            dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_13__.hideStatus)(status.id));
        }
    };
    var handleHotkeyMoveUp = function () {
        handleMoveUp(status.id);
    };
    var handleHotkeyMoveDown = function () {
        handleMoveDown(status.id);
    };
    var handleHotkeyReply = function (e) {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        handleReplyClick(status);
    };
    var handleHotkeyFavourite = function () {
        handleFavouriteClick(status);
    };
    var handleHotkeyBoost = function () {
        handleReblogClick(status);
    };
    var handleHotkeyMention = function (e) {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        var account = status.account;
        if (!account || typeof account !== 'object')
            return;
        handleMentionClick(account);
    };
    var handleHotkeyOpenProfile = function () {
        history.push("/@".concat(status.getIn(['account', 'acct'])));
    };
    var handleHotkeyToggleHidden = function () {
        handleToggleHidden(status);
    };
    var handleHotkeyToggleSensitive = function () {
        handleToggleMediaVisibility();
    };
    var handleTranslate = react__WEBPACK_IMPORTED_MODULE_6__.useCallback(function (status, language) {
        dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_13__.translateStatus)(status.id, language));
    }, []);
    var handleMoveUp = function (id) {
        if (id === (status === null || status === void 0 ? void 0 : status.id)) {
            _selectChild(ancestorsIds.size - 1);
        }
        else {
            var index = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.List)(ancestorsIds).indexOf(id);
            if (index === -1) {
                index = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.List)(descendantsIds).indexOf(id);
                _selectChild(ancestorsIds.size + index);
            }
            else {
                _selectChild(index - 1);
            }
        }
    };
    var handleMoveDown = function (id) {
        if (id === (status === null || status === void 0 ? void 0 : status.id)) {
            _selectChild(ancestorsIds.size + 1);
        }
        else {
            var index = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.List)(ancestorsIds).indexOf(id);
            if (index === -1) {
                index = (0,immutable__WEBPACK_IMPORTED_MODULE_31__.List)(descendantsIds).indexOf(id);
                _selectChild(ancestorsIds.size + index + 2);
            }
            else {
                _selectChild(index + 1);
            }
        }
    };
    var _selectChild = function (index) {
        var _scroller$current;
        (_scroller$current = scroller.current) === null || _scroller$current === void 0 ? void 0 : _scroller$current.scrollIntoView({
            index: index,
            behavior: 'smooth',
            done: function () {
                var element = document.querySelector("#thread [data-index=\"".concat(index, "\"] .focusable"));
                if (element) {
                    element.focus();
                }
            }
        });
    };
    var renderTombstone = function (id) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement("div", {
            className: "py-4 pb-8",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 362,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_tombstone__WEBPACK_IMPORTED_MODULE_20__["default"], {
            key: id,
            id: id,
            onMoveUp: handleMoveUp,
            onMoveDown: handleMoveDown,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 363,
                columnNumber: 9
            }
        }));
    };
    var renderStatus = function (id) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(_components_thread_status__WEBPACK_IMPORTED_MODULE_29__["default"], {
            key: id,
            id: id,
            focusedStatusId: status.id,
            onMoveUp: handleMoveUp,
            onMoveDown: handleMoveDown,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 375,
                columnNumber: 7
            }
        });
    };
    var renderPendingStatus = function (id) {
        var idempotencyKey = id.replace(/^末pending-/, '');
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_features_ui_components_pending_status__WEBPACK_IMPORTED_MODULE_23__["default"], {
            className: "thread__status",
            key: id,
            idempotencyKey: idempotencyKey,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 389,
                columnNumber: 7
            }
        });
    };
    var renderChildren = function (list) {
        return list.map(function (id) {
            if (id.endsWith('-tombstone')) {
                return renderTombstone(id);
            }
            else if (id.startsWith('末pending-')) {
                return renderPendingStatus(id);
            }
            else {
                return renderStatus(id);
            }
        });
    }; // Reset media visibility if status changes.
    (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(function () {
        setShowMedia((0,soapbox_utils_status__WEBPACK_IMPORTED_MODULE_26__.defaultMediaVisibility)(status, displayMedia));
    }, [status === null || status === void 0 ? void 0 : status.id]); // Scroll focused status into view when thread updates.
    (0,react__WEBPACK_IMPORTED_MODULE_6__.useEffect)(function () {
        var _scroller$current2;
        (_scroller$current2 = scroller.current) === null || _scroller$current2 === void 0 ? void 0 : _scroller$current2.scrollToIndex({
            index: ancestorsIds.size,
            offset: -80
        });
        setImmediate(function () {
            var _statusRef$current, _statusRef$current$qu;
            return (_statusRef$current = statusRef.current) === null || _statusRef$current === void 0 ? void 0 : (_statusRef$current$qu = _statusRef$current.querySelector('.detailed-status')) === null || _statusRef$current$qu === void 0 ? void 0 : _statusRef$current$qu.focus();
        });
    }, [props.params.statusId, status === null || status === void 0 ? void 0 : status.id, ancestorsIds.size, isLoaded]);
    var handleRefresh = function () {
        return fetchData();
    };
    var handleLoadMore = (0,react__WEBPACK_IMPORTED_MODULE_6__.useCallback)((0,lodash__WEBPACK_IMPORTED_MODULE_5__.debounce)(function () {
        if (next && status) {
            dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_13__.fetchNext)(status.id, next)).then(function (_ref) {
                var next = _ref.next;
                setNext(next);
            }).catch(function () { });
        }
    }, 300, {
        leading: true
    }), [next, status]);
    var handleOpenCompareHistoryModal = function (status) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_11__.openModal)('COMPARE_HISTORY', {
            statusId: status.id
        }));
    };
    var hasAncestors = ancestorsIds.size > 0;
    var hasDescendants = descendantsIds.size > 0;
    if (!status && isLoaded) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_14__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 447,
                columnNumber: 7
            }
        });
    }
    else if (!status) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_22__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 451,
                columnNumber: 7
            }
        });
    }
    var handlers = {
        moveUp: handleHotkeyMoveUp,
        moveDown: handleHotkeyMoveDown,
        reply: handleHotkeyReply,
        favourite: handleHotkeyFavourite,
        boost: handleHotkeyBoost,
        mention: handleHotkeyMention,
        openProfile: handleHotkeyOpenProfile,
        toggleHidden: handleHotkeyToggleHidden,
        toggleSensitive: handleHotkeyToggleSensitive,
        openMedia: handleHotkeyOpenMedia,
        react: handleHotkeyReact
    };
    var username = String(status.getIn(['account', 'acct']));
    var titleMessage = status.visibility === 'direct' ? messages.titleDirect : messages.title;
    var focusedStatus = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('thread__detailed-status', {
            'pb-4': hasDescendants
        }),
        key: status.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 475,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(react_hotkeys__WEBPACK_IMPORTED_MODULE_7__.HotKeys, {
        handlers: handlers,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 476,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement("div", {
        ref: statusRef,
        className: "detailed-status__wrapper focusable",
        tabIndex: 0 // FIXME: no "reblogged by" text is added for the screen reader
        ,
        "aria-label": (0,soapbox_utils_status__WEBPACK_IMPORTED_MODULE_26__.textForScreenReader)(intl, status),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 477,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(_components_detailed_status__WEBPACK_IMPORTED_MODULE_27__["default"], {
        status: status,
        onOpenVideo: handleOpenVideo,
        onOpenMedia: handleOpenMedia,
        onToggleHidden: handleToggleHidden,
        showMedia: showMedia,
        onToggleMediaVisibility: handleToggleMediaVisibility,
        onOpenCompareHistoryModal: handleOpenCompareHistoryModal,
        onTranslate: handleTranslate,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 484,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement("hr", {
        className: "mb-2 dark:border-slate-600",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 495,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_status_action_bar__WEBPACK_IMPORTED_MODULE_17__["default"], {
        status: status,
        expandable: false,
        space: "expand",
        withLabels: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 497,
            columnNumber: 11
        }
    }))), hasDescendants && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement("hr", {
        className: "mt-2 dark:border-slate-600",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 507,
            columnNumber: 9
        }
    }));
    var children = [];
    if (hasAncestors) {
        children.push.apply(children, renderChildren(ancestorsIds).toArray());
    }
    children.push(focusedStatus);
    if (hasDescendants) {
        children.push.apply(children, renderChildren(descendantsIds).toArray());
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_21__.Column, {
        label: intl.formatMessage(titleMessage, {
            username: username
        }),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 525,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_sticky__WEBPACK_IMPORTED_MODULE_18__["default"], {
        stickyClassName: "sm:hidden w-full shadow-lg before:-z-10 before:bg-gradient-sm before:w-full before:h-full before:absolute before:top-0 before:left-0  bg-white dark:bg-slate-900",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 526,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement("div", {
        className: "px-4 pt-4 sm:p-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 527,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_19__["default"], {
        message: intl.formatMessage(titleMessage, {
            username: username
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 528,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_15__["default"], {
        onRefresh: handleRefresh,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 532,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_21__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 533,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement("div", {
        ref: node,
        className: "thread",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 534,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_16__["default"], {
        id: "thread",
        ref: scroller,
        hasMore: !!next,
        onLoadMore: handleLoadMore,
        placeholderComponent: function () { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_6__.createElement(soapbox_features_placeholder_components_placeholder_status__WEBPACK_IMPORTED_MODULE_22__["default"], {
            thread: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 540,
                columnNumber: 43
            }
        }); },
        initialTopMostItemIndex: ancestorsIds.size,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 535,
            columnNumber: 13
        }
    }, children)), !me && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_6__.createElement(_components_thread_login_cta__WEBPACK_IMPORTED_MODULE_28__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 547,
            columnNumber: 19
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (Thread);


/***/ }),

/***/ 2288:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/language.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/language-796e96c4.svg";

/***/ }),

/***/ 2289:
/*!***************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/note.svg ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/note-7d075c16.svg";

/***/ })

}]);
//# sourceMappingURL=status-cd2aa943afa8015fad35.chunk.js.map