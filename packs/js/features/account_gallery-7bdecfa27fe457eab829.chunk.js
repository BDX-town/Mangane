"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[6],{

/***/ 2040:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/account_gallery/components/media_item.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/blurhash */ 264);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/icon */ 26);
/* harmony import */ var soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/still_image */ 186);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/is_mobile */ 82);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/account_gallery/components/media_item.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }









var MediaItem = function (_ref) {
    var _attachment$status;
    var attachment = _ref.attachment, displayWidth = _ref.displayWidth, onOpenMedia = _ref.onOpenMedia;
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useSettings)();
    var autoPlayGif = settings.get('autoPlayGif');
    var displayMedia = settings.get('displayMedia');
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(displayMedia !== 'hide_all' && !((_attachment$status = attachment.status) !== null && _attachment$status !== void 0 && _attachment$status.sensitive) || displayMedia === 'show_all'), visible = _a[0], setVisible = _a[1];
    var handleMouseEnter = function (e) {
        var video = e.target;
        if (hoverToPlay()) {
            video.play();
        }
    };
    var handleMouseLeave = function (e) {
        var video = e.target;
        if (hoverToPlay()) {
            video.pause();
            video.currentTime = 0;
        }
    };
    var hoverToPlay = function () {
        return !autoPlayGif && ['gifv', 'video'].includes(attachment.type);
    };
    var handleClick = function (e) {
        if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (visible) {
                onOpenMedia(attachment);
            }
            else {
                setVisible(true);
            }
        }
    };
    var width = "".concat(Math.floor((displayWidth - 4) / 3) - 4, "px");
    var height = width;
    var status = attachment.get('status');
    var title = status.get('spoiler_text') || attachment.get('description');
    var thumbnail = '';
    var icon;
    if (attachment.type === 'unknown') { // Skip
    }
    else if (attachment.type === 'image') {
        var focusX = Number(attachment.getIn(['meta', 'focus', 'x'])) || 0;
        var focusY = Number(attachment.getIn(['meta', 'focus', 'y'])) || 0;
        var x = (focusX / 2 + .5) * 100;
        var y = (focusY / -2 + .5) * 100;
        thumbnail = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_6__["default"], {
            src: attachment.preview_url,
            alt: attachment.description,
            style: {
                objectPosition: "".concat(x, "% ").concat(y, "%")
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 73,
                columnNumber: 7
            }
        });
    }
    else if (['gifv', 'video'].indexOf(attachment.type) !== -1) {
        var conditionalAttributes = {};
        if ((0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_8__.isIOS)()) {
            conditionalAttributes.playsInline = true;
        }
        if (autoPlayGif) {
            conditionalAttributes.autoPlay = true;
        }
        thumbnail = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('media-gallery__gifv', {
                autoplay: autoPlayGif
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 88,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("video", _extends({
            className: "media-gallery__item-gifv-thumbnail",
            "aria-label": attachment.description,
            title: attachment.description,
            role: "application",
            src: attachment.url,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            loop: true,
            muted: true
        }, conditionalAttributes, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 89,
                columnNumber: 9
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
            className: "media-gallery__gifv__label",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 102,
                columnNumber: 9
            }
        }, "GIF"));
    }
    else if (attachment.type === 'audio') {
        var remoteURL = attachment.remote_url || '';
        var fileExtensionLastIndex = remoteURL.lastIndexOf('.');
        var fileExtension = remoteURL.substr(fileExtensionLastIndex + 1).toUpperCase();
        thumbnail = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "media-gallery__item-thumbnail",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 110,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
            className: "media-gallery__item__icons",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 111,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
            src: __webpack_require__(/*! @tabler/icons/volume.svg */ 669),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 111,
                columnNumber: 54
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
            className: "media-gallery__file-extension__label",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 112,
                columnNumber: 9
            }
        }, fileExtension));
    }
    if (!visible) {
        icon = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
            className: "account-gallery__item__icons",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 119,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
            src: __webpack_require__(/*! @tabler/icons/eye-off.svg */ 152),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 120,
                columnNumber: 9
            }
        }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "account-gallery__item",
        style: {
            width: width,
            height: height
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
        className: "media-gallery__item-thumbnail rounded overflow-hidden",
        href: status.get('url'),
        target: "_blank",
        onClick: handleClick,
        title: title,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_4__["default"], {
        hash: attachment.get('blurhash'),
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('media-gallery__preview', {
            'media-gallery__preview--hidden': visible
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 9
        }
    }), visible && thumbnail, !visible && icon));
};
/* harmony default export */ __webpack_exports__["default"] = (MediaItem);


/***/ }),

/***/ 1856:
/*!********************************************************!*\
  !*** ./app/soapbox/features/account_gallery/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/timelines */ 38);
/* harmony import */ var soapbox_components_load_more__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/load_more */ 973);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1687);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var _components_media_item__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/media_item */ 2040);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/account_gallery/index.tsx";














var LoadMoreMedia = function (_ref) {
    var maxId = _ref.maxId, onLoadMore = _ref.onLoadMore;
    var handleLoadMore = function () {
        onLoadMore(maxId);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_load_more__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onClick: handleLoadMore,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 5
        }
    });
};
var AccountGallery = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppDispatch)();
    var username = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_12__.useParams)().username;
    var _a = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) {
        var _state$accounts$get, _state$relationships$;
        var me = state.me;
        var accountFetchError = (((_state$accounts$get = state.accounts.get(-1)) === null || _state$accounts$get === void 0 ? void 0 : _state$accounts$get.username) || '').toLowerCase() === username.toLowerCase();
        var features = (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_10__.getFeatures)(state.instance);
        var accountId = -1;
        var accountUsername = username;
        if (accountFetchError) {
            accountId = null;
        }
        else {
            var account = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_9__.findAccountByUsername)(state, username);
            accountId = account ? account.id || null : -1;
            accountUsername = (account === null || account === void 0 ? void 0 : account.acct) || '';
        }
        var isBlocked = ((_state$relationships$ = state.relationships.get(String(accountId))) === null || _state$relationships$ === void 0 ? void 0 : _state$relationships$.blocked_by) || false;
        return {
            accountId: accountId,
            unavailable: me === accountId ? false : isBlocked && !features.blockersVisible,
            accountUsername: accountUsername
        };
    }), accountId = _a.accountId, unavailable = _a.unavailable, accountUsername = _a.accountUsername;
    var isAccount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return !!state.accounts.get(accountId); });
    var attachments = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_9__.getAccountGallery)(state, accountId); });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) {
        var _state$timelines$get;
        return (_state$timelines$get = state.timelines.get("account:".concat(accountId, ":media"))) === null || _state$timelines$get === void 0 ? void 0 : _state$timelines$get.isLoading;
    });
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) {
        var _state$timelines$get2;
        return (_state$timelines$get2 = state.timelines.get("account:".concat(accountId, ":media"))) === null || _state$timelines$get2 === void 0 ? void 0 : _state$timelines$get2.hasMore;
    });
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(323), width = _b[0], setWidth = _b[1];
    var handleRef = function (c) {
        if (c)
            setWidth(c.offsetWidth);
    };
    var handleScrollToBottom = function () {
        if (hasMore) {
            handleLoadMore(attachments.size > 0 ? attachments.last().status.id : undefined);
        }
    };
    var handleLoadMore = function (maxId) {
        if (accountId && accountId !== -1) {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__.expandAccountMediaTimeline)(accountId, {
                maxId: maxId
            }));
        }
    };
    var handleLoadOlder = function (e) {
        e.preventDefault();
        handleScrollToBottom();
    };
    var handleOpenMedia = function (attachment) {
        if (attachment.type === 'video') {
            dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('VIDEO', {
                media: attachment,
                status: attachment.status,
                account: attachment.account
            }));
        }
        else {
            var media = attachment.status.media_attachments;
            var index = media.findIndex(function (x) { return x.id === attachment.id; });
            dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('MEDIA', {
                media: media,
                index: index,
                status: attachment.status,
                account: attachment.account
            }));
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (accountId && accountId !== -1) {
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__.fetchAccount)(accountId));
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__.expandAccountMediaTimeline)(accountId));
        }
        else {
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__.fetchAccountByUsername)(username));
        }
    }, [accountId]);
    if (!isAccount && accountId !== -1) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_6__["default"], {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 114,
                columnNumber: 7
            }
        });
    }
    if (accountId === -1 || !attachments && isLoading) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Column, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 120,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 121,
                columnNumber: 9
            }
        }));
    }
    var loadOlder = null;
    if (hasMore && !(isLoading && attachments.size === 0)) {
        loadOlder = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_load_more__WEBPACK_IMPORTED_MODULE_5__["default"], {
            visible: !isLoading,
            onClick: handleLoadOlder,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 129,
                columnNumber: 17
            }
        });
    }
    if (unavailable) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Column, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 134,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "empty-column-indicator",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 135,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
            id: "empty_column.account_unavailable",
            defaultMessage: "Profile unavailable",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 136,
                columnNumber: 11
            }
        })));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Column, {
        label: "@".concat(accountUsername),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 143,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        role: "feed",
        className: "account-gallery__container",
        ref: handleRef,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 144,
            columnNumber: 7
        }
    }, attachments.map(function (attachment, index) {
        var _attachments$get, _attachments$get2;
        return attachment === null ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(LoadMoreMedia, {
            key: 'more:' + ((_attachments$get = attachments.get(index + 1)) === null || _attachments$get === void 0 ? void 0 : _attachments$get.id),
            maxId: index > 0 ? ((_attachments$get2 = attachments.get(index - 1)) === null || _attachments$get2 === void 0 ? void 0 : _attachments$get2.id) || null : null,
            onLoadMore: handleLoadMore,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 146,
                columnNumber: 11
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_media_item__WEBPACK_IMPORTED_MODULE_11__["default"], {
            key: "".concat(attachment.status.id, "+").concat(attachment.id),
            attachment: attachment,
            displayWidth: width,
            onOpenMedia: handleOpenMedia,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 148,
                columnNumber: 11
            }
        });
    }), !isLoading && attachments.size === 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "empty-column-indicator",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 157,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "account_gallery.none",
        defaultMessage: "No media to show.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 158,
            columnNumber: 13
        }
    })), loadOlder), isLoading && attachments.size === 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "slist__append",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 166,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 167,
            columnNumber: 11
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (AccountGallery);


/***/ }),

/***/ 1920:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/profile_media_panel.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/timelines */ 38);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var _account_gallery_components_media_item__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../account_gallery/components/media_item */ 2040);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/profile_media_panel.tsx";











var ProfileMediaPanel = function (_ref) {
    var account = _ref.account;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_2__.useDispatch)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), loading = _a[0], setLoading = _a[1];
    var attachments = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return account ? (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.getAccountGallery)(state, account === null || account === void 0 ? void 0 : account.id) : (0,immutable__WEBPACK_IMPORTED_MODULE_9__.List)(); });
    var handleOpenMedia = function (attachment) {
        if (attachment.type === 'video') {
            dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('VIDEO', {
                media: attachment,
                status: attachment.status
            }));
        }
        else {
            var media = attachment.getIn(['status', 'media_attachments']);
            var index = media.findIndex(function (x) { return x.id === attachment.id; });
            dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_3__.openModal)('MEDIA', {
                media: media,
                index: index,
                status: attachment.status,
                account: attachment.account
            }));
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        setLoading(true);
        if (account) {
            dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_4__.expandAccountMediaTimeline)(account.id)) // @ts-ignore yes it does
                .then(function () { return setLoading(false); }).catch(function () { });
        }
    }, [account === null || account === void 0 ? void 0 : account.id]);
    var renderAttachments = function () {
        var publicAttachments = attachments.filter(function (attachment) { return attachment.getIn(['status', 'visibility']) === 'public'; });
        var nineAttachments = publicAttachments.slice(0, 9);
        if (!nineAttachments.isEmpty()) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "media-panel__list",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 55,
                    columnNumber: 9
                }
            }, nineAttachments.map(function (attachment, _index) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(_account_gallery_components_media_item__WEBPACK_IMPORTED_MODULE_8__["default"], {
                key: "".concat(attachment.getIn(['status', 'id']), "+").concat(attachment.id),
                attachment: attachment,
                displayWidth: 255,
                onOpenMedia: handleOpenMedia,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 57,
                    columnNumber: 13
                }
            }); }));
        }
        else {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "media-panel__empty",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 68,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
                id: "media_panel.empty_message",
                defaultMessage: "No media found.",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 69,
                    columnNumber: 11
                }
            }));
        }
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "media_panel.title",
            defaultMessage: "Media",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 76,
                columnNumber: 20
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 5
        }
    }, account && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "media-panel__content",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 9
        }
    }, loading ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 13
        }
    }) : renderAttachments()));
};
/* harmony default export */ __webpack_exports__["default"] = (ProfileMediaPanel);


/***/ })

}]);
//# sourceMappingURL=account_gallery-7bdecfa27fe457eab829.chunk.js.map