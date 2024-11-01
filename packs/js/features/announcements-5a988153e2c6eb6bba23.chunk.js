"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[14],{

/***/ 2496:
/*!****************************************************!*\
  !*** ./app/soapbox/components/animated-number.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-motion */ 86);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/animated-number.tsx";





var obfuscatedCount = function (count) {
    if (count < 0) {
        return 0;
    }
    else if (count <= 1) {
        return count;
    }
    else {
        return '1+';
    }
};
var AnimatedNumber = function (_ref) {
    var value = _ref.value, obfuscate = _ref.obfuscate;
    var reduceMotion = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useSettings)().get('reduceMotion');
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1), direction = _a[0], setDirection = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(value), displayedValue = _b[0], setDisplayedValue = _b[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (displayedValue !== undefined) {
            if (value > displayedValue)
                setDirection(1);
            else if (value < displayedValue)
                setDirection(-1);
        }
        setDisplayedValue(value);
    }, [value]);
    var willEnter = function () { return ({
        y: -1 * direction
    }); };
    var willLeave = function () { return ({
        y: (0,react_motion__WEBPACK_IMPORTED_MODULE_2__.spring)(1 * direction, {
            damping: 35,
            stiffness: 400
        })
    }); };
    if (reduceMotion) {
        return obfuscate ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, obfuscatedCount(displayedValue)) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__.FormattedNumber, {
            value: displayedValue,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 41,
                columnNumber: 65
            }
        });
    }
    var styles = [{
            key: "".concat(displayedValue),
            data: displayedValue,
            style: {
                y: (0,react_motion__WEBPACK_IMPORTED_MODULE_2__.spring)(0, {
                    damping: 35,
                    stiffness: 400
                })
            }
        }];
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_motion__WEBPACK_IMPORTED_MODULE_2__.TransitionMotion, {
        styles: styles,
        willEnter: willEnter,
        willLeave: willLeave,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 5
        }
    }, function (items) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "inline-flex flex-col items-stretch relative overflow-hidden",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 9
        }
    }, items.map(function (_ref2) {
        var key = _ref2.key, data = _ref2.data, style = _ref2.style;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
            key: key,
            style: {
                position: direction * style.y > 0 ? 'absolute' : 'static',
                transform: "translateY(".concat(style.y * 100, "%)")
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 55,
                columnNumber: 13
            }
        }, obfuscate ? obfuscatedCount(data) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__.FormattedNumber, {
            value: data,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 55,
                columnNumber: 182
            }
        }));
    })); });
};
/* harmony default export */ __webpack_exports__["default"] = (AnimatedNumber);


/***/ }),

/***/ 2493:
/*!***********************************************************************!*\
  !*** ./app/soapbox/components/announcements/announcement-content.tsx ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ 13);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/announcements/announcement-content.tsx";



var AnnouncementContent = function (_ref) {
    var announcement = _ref.announcement;
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useHistory)();
    var node = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        updateLinks();
    });
    var onMentionClick = function (mention, e) {
        if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            e.stopPropagation();
            history.push("/@".concat(mention.acct));
        }
    };
    var onHashtagClick = function (hashtag, e) {
        hashtag = hashtag.replace(/^#/, '').toLowerCase();
        if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            e.stopPropagation();
            history.push("/tag/".concat(hashtag));
        }
    };
    var onStatusClick = function (status, e) {
        if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            history.push(status);
        }
    };
    var updateLinks = function () {
        if (!node.current)
            return;
        var links = node.current.querySelectorAll('a');
        links.forEach(function (link) {
            var _link$textContent, _link$previousSibling, _link$previousSibling2;
            // Skip already processed
            if (link.classList.contains('status-link'))
                return; // Add attributes
            link.classList.add('status-link');
            link.setAttribute('rel', 'nofollow noopener');
            link.setAttribute('target', '_blank');
            var mention = announcement.mentions.find(function (mention) { return link.href === "".concat(mention.url); }); // Add event listeners on mentions, hashtags and statuses
            if (mention) {
                link.addEventListener('click', onMentionClick.bind(link, mention), false);
                link.setAttribute('title', mention.acct);
            }
            else if (((_link$textContent = link.textContent) === null || _link$textContent === void 0 ? void 0 : _link$textContent.charAt(0)) === '#' || ((_link$previousSibling = link.previousSibling) === null || _link$previousSibling === void 0 ? void 0 : (_link$previousSibling2 = _link$previousSibling.textContent) === null || _link$previousSibling2 === void 0 ? void 0 : _link$previousSibling2.charAt(link.previousSibling.textContent.length - 1)) === '#') {
                link.addEventListener('click', onHashtagClick.bind(link, link.text), false);
            }
            else {
                var status = announcement.statuses.get(link.href);
                if (status) {
                    link.addEventListener('click', onStatusClick.bind(_this, status), false);
                }
                link.setAttribute('title', link.href);
                link.classList.add('unhandled-link');
            }
        });
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "translate text-sm",
        ref: node,
        dangerouslySetInnerHTML: {
            __html: announcement.contentHtml
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (AnnouncementContent);


/***/ }),

/***/ 2492:
/*!***************************************************************!*\
  !*** ./app/soapbox/components/announcements/announcement.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _announcement_content__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./announcement-content */ 2493);
/* harmony import */ var _reactions_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reactions-bar */ 2494);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/announcements/announcement.tsx";






var Announcement = function (_ref) {
    var announcement = _ref.announcement, addReaction = _ref.addReaction, removeReaction = _ref.removeReaction, emojiMap = _ref.emojiMap;
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useFeatures)();
    var startsAt = announcement.starts_at && new Date(announcement.starts_at);
    var endsAt = announcement.ends_at && new Date(announcement.ends_at);
    var now = new Date();
    var hasTimeRange = startsAt && endsAt;
    var skipYear = hasTimeRange && startsAt.getFullYear() === endsAt.getFullYear() && endsAt.getFullYear() === now.getFullYear();
    var skipEndDate = hasTimeRange && startsAt.getDate() === endsAt.getDate() && startsAt.getMonth() === endsAt.getMonth() && startsAt.getFullYear() === endsAt.getFullYear();
    var skipTime = announcement.all_day;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        className: "w-full",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 5
        }
    }, hasTimeRange && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__.FormattedDate, {
        value: startsAt,
        hour12: false,
        year: skipYear || startsAt.getFullYear() === now.getFullYear() ? undefined : 'numeric',
        month: "short",
        day: "2-digit",
        hour: skipTime ? undefined : '2-digit',
        minute: skipTime ? undefined : '2-digit',
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 11
        }
    }), ' ', "-", ' ', /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__.FormattedDate, {
        value: endsAt,
        hour12: false,
        year: skipYear || endsAt.getFullYear() === now.getFullYear() ? undefined : 'numeric',
        month: skipEndDate ? undefined : 'short',
        day: skipEndDate ? undefined : '2-digit',
        hour: skipTime ? undefined : '2-digit',
        minute: skipTime ? undefined : '2-digit',
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_announcement_content__WEBPACK_IMPORTED_MODULE_3__["default"], {
        announcement: announcement,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 7
        }
    }), features.announcementsReactions && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_reactions_bar__WEBPACK_IMPORTED_MODULE_4__["default"], {
        reactions: announcement.reactions,
        announcementId: announcement.id,
        addReaction: addReaction,
        removeReaction: removeReaction,
        emojiMap: emojiMap,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 9
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (Announcement);


/***/ }),

/***/ 1634:
/*!**********************************************************************!*\
  !*** ./app/soapbox/components/announcements/announcements-panel.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_swipeable_views__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-swipeable-views */ 1365);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! reselect */ 63);
/* harmony import */ var soapbox_actions_announcements__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/announcements */ 280);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _announcement__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./announcement */ 2492);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/announcements/announcements-panel.tsx";











var customEmojiMap = (0,reselect__WEBPACK_IMPORTED_MODULE_4__.createSelector)([function (state) { return state.custom_emojis; }], function (items) { return items.reduce(function (map, emoji) { return map.set(emoji.get('shortcode'), emoji); }, (0,immutable__WEBPACK_IMPORTED_MODULE_9__.Map)()); });
var AnnouncementsPanel = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var emojiMap = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return customEmojiMap(state); });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(0), index = _a[0], setIndex = _a[1];
    var announcements = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return state.announcements.items; });
    var addReaction = function (id, name) { return dispatch((0,soapbox_actions_announcements__WEBPACK_IMPORTED_MODULE_5__.addReaction)(id, name)); };
    var removeReaction = function (id, name) { return dispatch((0,soapbox_actions_announcements__WEBPACK_IMPORTED_MODULE_5__.removeReaction)(id, name)); };
    if (announcements.size === 0)
        return null;
    var handleChangeIndex = function (index) {
        setIndex(index % announcements.size);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "announcements.title",
            defaultMessage: "Announcements",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
                columnNumber: 20
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Card, {
        className: "relative",
        size: "md",
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_swipeable_views__WEBPACK_IMPORTED_MODULE_3__["default"], {
        animateHeight: true,
        index: index,
        onChangeIndex: handleChangeIndex,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 9
        }
    }, announcements.map(function (announcement) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement(_announcement__WEBPACK_IMPORTED_MODULE_8__["default"], {
        key: announcement.id,
        announcement: announcement,
        emojiMap: emojiMap,
        addReaction: addReaction,
        removeReaction: removeReaction,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 13
        }
    }); }).reverse()), announcements.size > 1 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.HStack, {
        space: 2,
        alignItems: "center",
        justifyContent: "center",
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 11
        }
    }, announcements.map(function (_, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", {
        key: i,
        tabIndex: 0,
        onClick: function () { return setIndex(i); },
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
            'w-2 h-2 rounded-full focus:ring-primary-600 focus:ring-2 focus:ring-offset-2': true,
            'bg-gray-200 hover:bg-gray-300': i !== index,
            'bg-primary-600': i === index
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 15
        }
    }); }))));
};
/* harmony default export */ __webpack_exports__["default"] = (AnnouncementsPanel);


/***/ }),

/***/ 2497:
/*!********************************************************!*\
  !*** ./app/soapbox/components/announcements/emoji.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/features/emoji/emoji_unicode_mapping_light */ 262);
/* harmony import */ var soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_static__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/utils/static */ 190);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/announcements/emoji.tsx";




var Emoji = function (_ref) {
    var emoji = _ref.emoji, emojiMap = _ref.emojiMap, hovered = _ref.hovered;
    var autoPlayGif = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSettings)().get('autoPlayGif'); // @ts-ignore
    if ((soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_1___default())[emoji]) {
        // @ts-ignore
        var _a = (soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_1___default())[emoji], filename = _a.filename, shortCode = _a.shortCode;
        var title = shortCode ? ":".concat(shortCode, ":") : '';
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
            draggable: "false",
            className: "emojione block m-0",
            alt: emoji,
            title: title,
            src: (0,soapbox_utils_static__WEBPACK_IMPORTED_MODULE_3__.joinPublicPath)("packs/emoji/".concat(filename, ".svg")),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 25,
                columnNumber: 7
            }
        });
    }
    else if (emojiMap.get(emoji)) {
        var filename = autoPlayGif || hovered ? emojiMap.getIn([emoji, 'url']) : emojiMap.getIn([emoji, 'static_url']);
        var shortCode = ":".concat(emoji, ":");
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
            draggable: "false",
            className: "emojione block m-0",
            alt: shortCode,
            title: shortCode,
            src: filename,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 38,
                columnNumber: 7
            }
        });
    }
    else {
        return null;
    }
};
/* harmony default export */ __webpack_exports__["default"] = (Emoji);


/***/ }),

/***/ 2495:
/*!***********************************************************!*\
  !*** ./app/soapbox/components/announcements/reaction.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_animated_number__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/animated-number */ 2496);
/* harmony import */ var soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/emoji/emoji_unicode_mapping_light */ 262);
/* harmony import */ var soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _emoji__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./emoji */ 2497);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/announcements/reaction.tsx";






var Reaction = function (_ref) {
    var announcementId = _ref.announcementId, reaction = _ref.reaction, addReaction = _ref.addReaction, removeReaction = _ref.removeReaction, emojiMap = _ref.emojiMap, style = _ref.style;
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), hovered = _a[0], setHovered = _a[1];
    var handleClick = function () {
        if (reaction.me) {
            removeReaction(announcementId, reaction.name);
        }
        else {
            addReaction(announcementId, reaction.name);
        }
    };
    var handleMouseEnter = function () { return setHovered(true); };
    var handleMouseLeave = function () { return setHovered(false); };
    var shortCode = reaction.name; // @ts-ignore
    if ((soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_4___default())[shortCode]) {
        // @ts-ignore
        shortCode = (soapbox_features_emoji_emoji_unicode_mapping_light__WEBPACK_IMPORTED_MODULE_4___default())[shortCode].shortCode;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('flex shrink-0 items-center gap-1.5 bg-gray-100 dark:bg-primary-900 rounded-sm px-1.5 py-1 transition-colors', {
            'bg-gray-200 dark:bg-primary-800': hovered,
            'bg-primary-200 dark:bg-primary-500': reaction.me
        }),
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        title: ":".concat(shortCode, ":"),
        style: style,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("span", {
        className: "block h-4 w-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_emoji__WEBPACK_IMPORTED_MODULE_5__["default"], {
        hovered: hovered,
        emoji: reaction.name,
        emojiMap: emojiMap,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("span", {
        className: "block min-w-[9px] text-center text-xs font-medium text-primary-600 dark:text-white",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_animated_number__WEBPACK_IMPORTED_MODULE_3__["default"], {
        value: reaction.count,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Reaction);


/***/ }),

/***/ 2494:
/*!****************************************************************!*\
  !*** ./app/soapbox/components/announcements/reactions-bar.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-motion */ 86);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_emoji_picker_dropdown_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/emoji_picker_dropdown_container */ 554);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _reaction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./reaction */ 2495);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/announcements/reactions-bar.tsx";








var ReactionsBar = function (_ref) {
    var announcementId = _ref.announcementId, reactions = _ref.reactions, addReaction = _ref.addReaction, removeReaction = _ref.removeReaction, emojiMap = _ref.emojiMap;
    var reduceMotion = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useSettings)().get('reduceMotion');
    var handleEmojiPick = function (data) {
        addReaction(announcementId, data.native.replace(/:/g, ''));
    };
    var willEnter = function () { return ({
        scale: reduceMotion ? 1 : 0
    }); };
    var willLeave = function () { return ({
        scale: reduceMotion ? 0 : (0,react_motion__WEBPACK_IMPORTED_MODULE_3__.spring)(0, {
            stiffness: 170,
            damping: 26
        })
    }); };
    var visibleReactions = reactions.filter(function (x) { return x.count > 0; });
    var styles = visibleReactions.map(function (reaction) { return ({
        key: reaction.name,
        data: reaction,
        style: {
            scale: reduceMotion ? 1 : (0,react_motion__WEBPACK_IMPORTED_MODULE_3__.spring)(1, {
                stiffness: 150,
                damping: 13
            })
        }
    }); }).toArray();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_motion__WEBPACK_IMPORTED_MODULE_3__.TransitionMotion, {
        styles: styles,
        willEnter: willEnter,
        willLeave: willLeave,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 5
        }
    }, function (items) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('flex flex-wrap items-center gap-1', {
            'reactions-bar--empty': visibleReactions.isEmpty()
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 9
        }
    }, items.map(function (_ref2) {
        var key = _ref2.key, data = _ref2.data, style = _ref2.style;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_reaction__WEBPACK_IMPORTED_MODULE_7__["default"], {
            key: key,
            reaction: data,
            style: {
                transform: "scale(".concat(style.scale, ")"),
                position: style.scale < 0.5 ? 'absolute' : 'static'
            },
            announcementId: announcementId,
            addReaction: addReaction,
            removeReaction: removeReaction,
            emojiMap: emojiMap,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 13
            }
        });
    }), visibleReactions.size < 8 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_containers_emoji_picker_dropdown_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        onPickEmoji: handleEmojiPick,
        button: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Icon, {
            className: "h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-white",
            src: __webpack_require__(/*! @tabler/icons/plus.svg */ 248),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 58,
                columnNumber: 100
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 41
        }
    })); });
};
/* harmony default export */ __webpack_exports__["default"] = (ReactionsBar);


/***/ })

}]);
//# sourceMappingURL=announcements-5a988153e2c6eb6bba23.chunk.js.map