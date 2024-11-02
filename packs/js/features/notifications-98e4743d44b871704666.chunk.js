"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[59],{

/***/ 1801:
/*!*******************************************************************************!*\
  !*** ./app/soapbox/features/notifications/components/clear_column_button.tsx ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/notifications/components/clear_column_button.tsx";



var ClearColumnButton = function (_ref) {
    var onClick = _ref.onClick;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        theme: "ghost",
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 3
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "notifications.clear",
        defaultMessage: "Clear notifications",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 5
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ClearColumnButton);


/***/ }),

/***/ 1800:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/notifications/components/filter_bar.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/notifications */ 149);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _clear_column_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./clear_column_button */ 1801);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/notifications/components/filter_bar.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    all: {
        "id": "notifications.filter.all",
        "defaultMessage": "All"
    },
    mentions: {
        "id": "notifications.filter.mentions",
        "defaultMessage": "Mentions"
    },
    favourites: {
        "id": "notifications.filter.favourites",
        "defaultMessage": "Likes"
    },
    boosts: {
        "id": "notifications.filter.boosts",
        "defaultMessage": "Reposts"
    },
    polls: {
        "id": "notifications.filter.polls",
        "defaultMessage": "Poll results"
    },
    follows: {
        "id": "notifications.filter.follows",
        "defaultMessage": "Follows"
    },
    emoji_reacts: {
        "id": "notifications.filter.emoji_reacts",
        "defaultMessage": "Emoji reacts"
    },
    statuses: {
        "id": "notifications.filter.statuses",
        "defaultMessage": "Updates from people you follow"
    },
    clearHeading: {
        "id": "notifications.clear_heading",
        "defaultMessage": "Clear notifications"
    },
    clearMessage: {
        "id": "notifications.clear_confirmation",
        "defaultMessage": "Are you sure you want to permanently clear all your notifications?"
    },
    clearConfirm: {
        "id": "notifications.clear",
        "defaultMessage": "Clear notifications"
    }
});
var NotificationFilterBar = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useSettings)();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useFeatures)();
    var selectedFilter = settings.getIn(['notifications', 'quickFilter', 'active']);
    var advancedMode = settings.getIn(['notifications', 'quickFilter', 'advanced']);
    var onClick = function (notificationType) { return function () { return dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_2__.setFilter)(notificationType)); }; };
    var onClear = react__WEBPACK_IMPORTED_MODULE_0__.useCallback(function () {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__.openModal)('CONFIRM', {
            icon: __webpack_require__(/*! @tabler/icons/eraser.svg */ 1802),
            heading: intl.formatMessage(messages.clearHeading),
            message: intl.formatMessage(messages.clearMessage),
            confirm: intl.formatMessage(messages.clearConfirm),
            onConfirm: function () { return dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_2__.clearNotifications)()); }
        }));
    }, [dispatch, soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__.openModal, soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_2__.clearNotifications]);
    var items = [{
            text: intl.formatMessage(messages.all),
            action: onClick('all'),
            name: 'all'
        }];
    if (!advancedMode) {
        items.push({
            text: intl.formatMessage(messages.mentions),
            action: onClick('mention'),
            name: 'mention'
        });
    }
    else {
        items.push({
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
                src: __webpack_require__(/*! @tabler/icons/at.svg */ 270),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 66,
                    columnNumber: 13
                }
            }),
            title: intl.formatMessage(messages.mentions),
            action: onClick('mention'),
            name: 'mention'
        });
        items.push({
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
                src: __webpack_require__(/*! @tabler/icons/heart.svg */ 840),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 72,
                    columnNumber: 13
                }
            }),
            title: intl.formatMessage(messages.favourites),
            action: onClick('favourite'),
            name: 'favourite'
        });
        if (features.emojiReacts)
            items.push({
                text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
                    src: __webpack_require__(/*! @tabler/icons/mood-smile.svg */ 1803),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 78,
                        columnNumber: 13
                    }
                }),
                title: intl.formatMessage(messages.emoji_reacts),
                action: onClick('pleroma:emoji_reaction'),
                name: 'pleroma:emoji_reaction'
            });
        items.push({
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
                src: __webpack_require__(/*! @tabler/icons/repeat.svg */ 254),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 84,
                    columnNumber: 13
                }
            }),
            title: intl.formatMessage(messages.boosts),
            action: onClick('reblog'),
            name: 'reblog'
        });
        items.push({
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
                src: __webpack_require__(/*! @tabler/icons/chart-bar.svg */ 872),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 90,
                    columnNumber: 13
                }
            }),
            title: intl.formatMessage(messages.polls),
            action: onClick('poll'),
            name: 'poll'
        });
        items.push({
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
                src: __webpack_require__(/*! @tabler/icons/bell-ringing.svg */ 870),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 96,
                    columnNumber: 13
                }
            }),
            title: intl.formatMessage(messages.statuses),
            action: onClick('status'),
            name: 'status'
        });
        items.push({
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
                src: __webpack_require__(/*! @tabler/icons/user-plus.svg */ 836),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 102,
                    columnNumber: 13
                }
            }),
            title: intl.formatMessage(messages.follows),
            action: onClick('follow'),
            name: 'follow'
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex justify-between items-center mb-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 111,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        className: "h-6 w-6 text-gray-500 dark:text-gray-400",
        src: __webpack_require__(/*! @tabler/icons/bell.svg */ 194),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 112,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_clear_column_button__WEBPACK_IMPORTED_MODULE_6__["default"], {
        onClick: onClear,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Tabs, {
        items: items,
        activeItem: selectedFilter,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 115,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (NotificationFilterBar);


/***/ }),

/***/ 1804:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/notifications/components/notification.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_hotkeys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-hotkeys */ 422);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/compose */ 27);
/* harmony import */ var soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/interactions */ 123);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/statuses */ 54);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/permalink */ 841);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/containers/account_container */ 142);
/* harmony import */ var soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/containers/status_container */ 837);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var soapbox_utils_notification__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! soapbox/utils/notification */ 1805);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/notifications/components/notification.tsx";


















var getNotification = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_13__.makeGetNotification)();
var notificationForScreenReader = function (intl, message, timestamp) {
    var output = [message];
    output.push(intl.formatDate(timestamp, {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
    }));
    return output.join(', ');
};
var buildLink = function (account) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement("bdi", {
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 35,
        columnNumber: 3
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_8__["default"], {
    className: "text-gray-800 dark:text-gray-200 font-bold hover:underline",
    href: "/@".concat(account.acct),
    title: account.acct,
    to: "/@".concat(account.acct),
    dangerouslySetInnerHTML: {
        __html: account.display_name_html
    },
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 36,
        columnNumber: 5
    }
})); };
var icons = {
    follow: __webpack_require__(/*! @tabler/icons/user-plus.svg */ 836),
    follow_request: __webpack_require__(/*! @tabler/icons/user-plus.svg */ 836),
    mention: __webpack_require__(/*! @tabler/icons/at.svg */ 270),
    favourite: __webpack_require__(/*! @tabler/icons/heart.svg */ 840),
    reblog: __webpack_require__(/*! @tabler/icons/repeat.svg */ 254),
    status: __webpack_require__(/*! @tabler/icons/bell-ringing.svg */ 870),
    poll: __webpack_require__(/*! @tabler/icons/chart-bar.svg */ 872),
    move: __webpack_require__(/*! @tabler/icons/briefcase.svg */ 951),
    'pleroma:chat_mention': __webpack_require__(/*! @tabler/icons/messages.svg */ 273),
    'pleroma:emoji_reaction': __webpack_require__(/*! @tabler/icons/mood-happy.svg */ 925),
    user_approved: __webpack_require__(/*! @tabler/icons/user-plus.svg */ 836),
    update: __webpack_require__(/*! @tabler/icons/pencil.svg */ 421)
};
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_15__.defineMessages)({
    follow: {
        "id": "notification.follow",
        "defaultMessage": "{name} followed you"
    },
    follow_request: {
        "id": "notification.follow_request",
        "defaultMessage": "{name} has requested to follow you"
    },
    mention: {
        "id": "notification.mentioned",
        "defaultMessage": "{name} mentioned you"
    },
    favourite: {
        "id": "notification.favourite",
        "defaultMessage": "{name} liked your post"
    },
    reblog: {
        "id": "notification.reblog",
        "defaultMessage": "{name} reposted your post"
    },
    status: {
        "id": "notification.status",
        "defaultMessage": "{name} just posted"
    },
    poll: {
        "id": "notification.poll",
        "defaultMessage": "A poll you have voted in has ended"
    },
    move: {
        "id": "notification.move",
        "defaultMessage": "{name} moved to {targetName}"
    },
    'pleroma:chat_mention': {
        "id": "notification.pleroma:chat_mention",
        "defaultMessage": "{name} sent you a message"
    },
    'pleroma:emoji_reaction': {
        "id": "notification.pleroma:emoji_reaction",
        "defaultMessage": "{name} reacted to your post"
    },
    user_approved: {
        "id": "notification.user_approved",
        "defaultMessage": "Welcome to {instance}!"
    },
    update: {
        "id": "notification.update",
        "defaultMessage": "{name} edited a post you interacted with"
    }
});
var buildMessage = function (intl, type, account, totalCount, targetName, instanceTitle) {
    var link = buildLink(account);
    var name = intl.formatMessage({
        id: 'notification.name',
        defaultMessage: '{link}{others}'
    }, {
        link: link,
        others: totalCount && totalCount > 0 ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__["default"], {
            id: "notification.others",
            defaultMessage: " + {count} {count, plural, one {other} other {others}}",
            values: {
                count: totalCount - 1
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 127,
                columnNumber: 7
            }
        }) : ''
    });
    return intl.formatMessage(messages[type], {
        name: name,
        targetName: targetName,
        instance: instanceTitle
    });
};
var Notification = function (props) {
    var _a = props.hidden, hidden = _a === void 0 ? false : _a, onMoveUp = props.onMoveUp, onMoveDown = props.onMoveDown;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_12__.useAppDispatch)();
    var notification = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_12__.useAppSelector)(function (state) { return getNotification(state, props.notification); });
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_17__.useHistory)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_18__["default"])();
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_12__.useAppSelector)(function (state) { return state.instance; });
    var type = notification.type;
    var account = notification.account, status = notification.status;
    var getHandlers = function () { return ({
        reply: handleMention,
        favourite: handleHotkeyFavourite,
        boost: handleHotkeyBoost,
        mention: handleMention,
        open: handleOpen,
        openProfile: handleOpenProfile,
        moveUp: handleMoveUp,
        moveDown: handleMoveDown,
        toggleHidden: handleHotkeyToggleHidden
    }); };
    var handleOpen = function () {
        if (status && typeof status === 'object' && account && typeof account === 'object') {
            history.push("/@".concat(account.acct, "/posts/").concat(status.id));
        }
        else {
            handleOpenProfile();
        }
    };
    var handleOpenProfile = function () {
        if (account && typeof account === 'object') {
            history.push("/@".concat(account.acct));
        }
    };
    var handleMention = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        if (account && typeof account === 'object') {
            dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_2__.mentionCompose)(account));
        }
    }, [account]);
    var handleHotkeyFavourite = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
        if (status && typeof status === 'object') {
            if (status.favourited) {
                dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_3__.unfavourite)(status));
            }
            else {
                dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_3__.favourite)(status));
            }
        }
    }, [status]);
    var handleHotkeyBoost = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
        if (status && typeof status === 'object') {
            dispatch(function (_, getState) {
                var boostModal = (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_5__.getSettings)(getState()).get('boostModal');
                if (status.reblogged) {
                    dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_3__.unreblog)(status));
                }
                else {
                    if (e !== null && e !== void 0 && e.shiftKey || !boostModal) {
                        dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_3__.reblog)(status));
                    }
                    else {
                        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_4__.openModal)('BOOST', {
                            status: status,
                            onReblog: function (status) {
                                dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_3__.reblog)(status));
                            }
                        }));
                    }
                }
            });
        }
    }, [status]);
    var handleHotkeyToggleHidden = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (e) {
        if (status && typeof status === 'object') {
            if (status.hidden) {
                dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_6__.revealStatus)(status.id));
            }
            else {
                dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_6__.hideStatus)(status.id));
            }
        }
    }, [status]);
    var handleMoveUp = function () {
        if (onMoveUp) {
            onMoveUp(notification.id);
        }
    };
    var handleMoveDown = function () {
        if (onMoveDown) {
            onMoveDown(notification.id);
        }
    };
    var renderIcon = function () {
        if (type === 'pleroma:emoji_reaction' && notification.emoji) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.EmojiReact, {
                emoji: (0,immutable__WEBPACK_IMPORTED_MODULE_19__.Map)({
                    name: notification.emoji,
                    url: notification.emoji_url
                }),
                className: "w-4 h-4 flex-none",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 254,
                    columnNumber: 9
                }
            });
        }
        else if ((0,soapbox_utils_notification__WEBPACK_IMPORTED_MODULE_14__.validType)(type)) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
                src: icons[type],
                className: "text-primary-600 dark:text-primary-400 flex-none",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 261,
                    columnNumber: 9
                }
            });
        }
        else {
            return null;
        }
    };
    var renderContent = function () {
        switch (type) {
            case 'follow':
            case 'user_approved':
                return account && typeof account === 'object' ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_10__["default"], {
                    id: account.id,
                    hidden: hidden,
                    avatarSize: 48,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 276,
                        columnNumber: 11
                    }
                }) : null;
            case 'follow_request':
                return account && typeof account === 'object' ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_10__["default"], {
                    id: account.id,
                    hidden: hidden,
                    avatarSize: 48,
                    actionType: "follow_request",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 284,
                        columnNumber: 11
                    }
                }) : null;
            case 'move':
                return account && typeof account === 'object' && notification.target && typeof notification.target === 'object' ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_10__["default"], {
                    id: notification.target.id,
                    hidden: hidden,
                    avatarSize: 48,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 293,
                        columnNumber: 11
                    }
                }) : null;
            case 'favourite':
            case 'mention':
            case 'reblog':
            case 'status':
            case 'poll':
            case 'update':
            case 'pleroma:emoji_reaction':
                return status && typeof status === 'object' ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_11__["default"], {
                    id: status.id,
                    withDismiss: true,
                    hidden: hidden,
                    onMoveDown: handleMoveDown,
                    onMoveUp: handleMoveUp,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 307,
                        columnNumber: 11
                    }
                }) : null;
            default:
                return null;
        }
    };
    var targetName = notification.target && typeof notification.target === 'object' ? notification.target.acct : '';
    var message = (0,soapbox_utils_notification__WEBPACK_IMPORTED_MODULE_14__.validType)(type) && account && typeof account === 'object' ? buildMessage(intl, type, account, notification.total_count, targetName, instance.title) : null;
    var ariaLabel = (0,soapbox_utils_notification__WEBPACK_IMPORTED_MODULE_14__.validType)(type) ? notificationForScreenReader(intl, intl.formatMessage(messages[type], {
        name: account && typeof account === 'object' ? account.acct : '',
        targetName: targetName
    }), notification.created_at) : '';
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_hotkeys__WEBPACK_IMPORTED_MODULE_1__.HotKeys, {
        handlers: getHandlers(),
        "data-testid": "notification",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 336,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "notification focusable",
        tabIndex: 0,
        "aria-label": ariaLabel,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 337,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "p-4 focusable",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 342,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mb-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 343,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.HStack, {
        alignItems: "center",
        space: 1.5,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 344,
            columnNumber: 13
        }
    }, renderIcon(), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "truncate",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 347,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Text, {
        theme: "muted",
        size: "sm",
        truncate: true,
        "data-testid": "message",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 348,
            columnNumber: 17
        }
    }, message)))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 360,
            columnNumber: 11
        }
    }, renderContent()))));
};
/* harmony default export */ __webpack_exports__["default"] = (Notification);


/***/ }),

/***/ 1510:
/*!******************************************************!*\
  !*** ./app/soapbox/features/notifications/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var reselect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! reselect */ 63);
/* harmony import */ var soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/notifications */ 149);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/pull-to-refresh */ 411);
/* harmony import */ var soapbox_components_scroll_top_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/scroll-top-button */ 963);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 828);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_placeholder_components_placeholder_notification__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/features/placeholder/components/placeholder_notification */ 1799);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _components_filter_bar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/filter_bar */ 1800);
/* harmony import */ var _components_notification__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/notification */ 1804);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/notifications/index.tsx";


















var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_16__.defineMessages)({
    title: {
        "id": "column.notifications",
        "defaultMessage": "Notifications"
    },
    queue: {
        "id": "notifications.queue_label",
        "defaultMessage": "Click to see {count} new {count, plural, one {notification} other {notifications}}"
    }
});
var getNotifications = (0,reselect__WEBPACK_IMPORTED_MODULE_5__.createSelector)([function (state) { return (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_7__.getSettings)(state).getIn(['notifications', 'quickFilter', 'show']); }, function (state) { return (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_7__.getSettings)(state).getIn(['notifications', 'quickFilter', 'active']); }, function (state) { return (0,immutable__WEBPACK_IMPORTED_MODULE_17__.List)((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_7__.getSettings)(state).getIn(['notifications', 'shows']).filter(function (item) { return !item; }).keys()); }, function (state) { return state.notifications.items.toList(); }], function (showFilterBar, allowedType, excludedTypes, notifications) {
    if (!showFilterBar || allowedType === 'all') {
        // used if user changed the notification settings after loading the notifications from the server
        // otherwise a list of notifications will come pre-filtered from the backend
        // we need to turn it off for FilterBar in order not to block ourselves from seeing a specific category
        return notifications.filterNot(function (item) { return item !== null && excludedTypes.includes(item.get('type')); });
    }
    return notifications.filter(function (item) { return item !== null && allowedType === item.get('type'); });
});
var Notifications = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_18__["default"])();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useSettings)();
    var showFilterBar = settings.getIn(['notifications', 'quickFilter', 'show']);
    var activeFilter = settings.getIn(['notifications', 'quickFilter', 'active']);
    var notifications = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return getNotifications(state); });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.notifications.isLoading; }); // const isUnread = useAppSelector(state => state.notifications.unread > 0);
    var hasMore = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.notifications.hasMore; });
    var totalQueuedNotificationsCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_13__.useAppSelector)(function (state) { return state.notifications.totalQueuedNotificationsCount || 0; });
    var node = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
    var column = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null);
    var scrollableContentRef = (0,react__WEBPACK_IMPORTED_MODULE_4__.useRef)(null); // const handleLoadGap = (maxId) => {
    //   dispatch(expandNotifications({ maxId }));
    // };
    var handleLoadOlder = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_3___default()(function () {
        var last = notifications.last();
        dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__.expandNotifications)({
            maxId: last && last.get('id')
        }));
    }, 300, {
        leading: true
    }), [notifications]);
    var handleScrollToTop = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_3___default()(function () {
        dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__.scrollTopNotifications)(true));
    }, 100), []);
    var handleScroll = (0,react__WEBPACK_IMPORTED_MODULE_4__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_3___default()(function () {
        dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__.scrollTopNotifications)(false));
    }, 100), []);
    var handleMoveUp = function (id) {
        var elementIndex = notifications.findIndex(function (item) { return item !== null && item.get('id') === id; }) - 1;
        _selectChild(elementIndex);
    };
    var handleMoveDown = function (id) {
        var elementIndex = notifications.findIndex(function (item) { return item !== null && item.get('id') === id; }) + 1;
        _selectChild(elementIndex);
    };
    var _selectChild = function (index) {
        var _node$current;
        (_node$current = node.current) === null || _node$current === void 0 ? void 0 : _node$current.scrollIntoView({
            index: index,
            behavior: 'smooth',
            done: function () {
                var container = column.current;
                var element = container === null || container === void 0 ? void 0 : container.querySelector("[data-index=\"".concat(index, "\"] .focusable"));
                if (element) {
                    element.focus();
                }
            }
        });
    };
    var handleDequeueNotifications = function () {
        dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__.dequeueNotifications)());
    };
    var handleRefresh = function () {
        return dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__.expandNotifications)());
    };
    (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(function () {
        handleDequeueNotifications();
        dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__.scrollTopNotifications)(true));
        return function () {
            handleLoadOlder.cancel();
            handleScrollToTop.cancel();
            handleScroll.cancel();
            dispatch((0,soapbox_actions_notifications__WEBPACK_IMPORTED_MODULE_6__.scrollTopNotifications)(false));
        };
    }, []);
    var emptyMessage = activeFilter === 'all' ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
        id: "empty_column.notifications",
        defaultMessage: "You don't have any notifications yet. Interact with others to start the conversation.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 7
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_19__["default"], {
        id: "empty_column.notifications_filtered",
        defaultMessage: "You don't have any notifications of this type yet.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 7
        }
    });
    var scrollableContent = null;
    var filterBarContainer = showFilterBar ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(_components_filter_bar__WEBPACK_IMPORTED_MODULE_14__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 8
        }
    }) : null;
    if (isLoading && scrollableContentRef.current) {
        scrollableContent = scrollableContentRef.current;
    }
    else if (notifications.size > 0 || hasMore) {
        scrollableContent = notifications.map(function (item) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_4__.createElement(_components_notification__WEBPACK_IMPORTED_MODULE_15__["default"], {
            key: item.id,
            notification: item,
            onMoveUp: handleMoveUp,
            onMoveDown: handleMoveDown,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 141,
                columnNumber: 7
            }
        }); });
    }
    else {
        scrollableContent = null;
    }
    scrollableContentRef.current = scrollableContent;
    var scrollContainer = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_10__["default"], {
        ref: node,
        scrollKey: "notifications",
        isLoading: isLoading,
        showLoading: isLoading && notifications.size === 0,
        hasMore: hasMore,
        emptyMessage: emptyMessage,
        placeholderComponent: soapbox_features_placeholder_components_placeholder_notification__WEBPACK_IMPORTED_MODULE_12__["default"],
        placeholderCount: 20,
        onLoadMore: handleLoadOlder,
        onScrollToTop: handleScrollToTop,
        onScroll: handleScroll,
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
            'divide-y divide-gray-200 dark:divide-gray-600 divide-solid': notifications.size > 0,
            'space-y-2': notifications.size === 0
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 155,
            columnNumber: 5
        }
    }, scrollableContent);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_11__.Column, {
        ref: column,
        label: intl.formatMessage(messages.title),
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 177,
            columnNumber: 5
        }
    }, filterBarContainer, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_scroll_top_button__WEBPACK_IMPORTED_MODULE_9__["default"], {
        onClick: handleDequeueNotifications,
        count: totalQueuedNotificationsCount,
        message: messages.queue,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 179,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(soapbox_components_pull_to_refresh__WEBPACK_IMPORTED_MODULE_8__["default"], {
        onRefresh: handleRefresh,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 184,
            columnNumber: 7
        }
    }, scrollContainer));
};
/* harmony default export */ __webpack_exports__["default"] = (Notifications);


/***/ }),

/***/ 1799:
/*!**********************************************************************************!*\
  !*** ./app/soapbox/features/placeholder/components/placeholder_notification.tsx ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _placeholder_avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./placeholder_avatar */ 274);
/* harmony import */ var _placeholder_display_name__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./placeholder_display_name */ 446);
/* harmony import */ var _placeholder_status_content__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./placeholder_status_content */ 964);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/placeholder/components/placeholder_notification.tsx";




/** Fake notification to display while data is loading. */
var PlaceholderNotification = function () { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "bg-white dark:bg-slate-800 px-4 py-6 sm:p-6",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 9,
        columnNumber: 3
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "w-full animate-pulse",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 10,
        columnNumber: 5
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "mb-2",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 11,
        columnNumber: 7
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_status_content__WEBPACK_IMPORTED_MODULE_3__["default"], {
    minLength: 20,
    maxLength: 20,
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 12,
        columnNumber: 9
    }
})), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 15,
        columnNumber: 7
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "flex space-x-3 items-center",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 16,
        columnNumber: 9
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "flex-shrink-0",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 11
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_avatar__WEBPACK_IMPORTED_MODULE_1__["default"], {
    size: 48,
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 18,
        columnNumber: 13
    }
})), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "min-w-0 flex-1",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 21,
        columnNumber: 11
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_display_name__WEBPACK_IMPORTED_MODULE_2__["default"], {
    minLength: 3,
    maxLength: 25,
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 22,
        columnNumber: 13
    }
})))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "mt-4",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 27,
        columnNumber: 7
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_placeholder_status_content__WEBPACK_IMPORTED_MODULE_3__["default"], {
    minLength: 5,
    maxLength: 120,
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 28,
        columnNumber: 9
    }
})))); };
/* harmony default export */ __webpack_exports__["default"] = (/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.memo(PlaceholderNotification));


/***/ }),

/***/ 1805:
/*!*******************************************!*\
  !*** ./app/soapbox/utils/notification.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NOTIFICATION_TYPES": function() { return /* binding */ NOTIFICATION_TYPES; },
/* harmony export */   "validType": function() { return /* binding */ validType; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);

/** Notification types known to Soapbox. */
var NOTIFICATION_TYPES = ['follow', 'follow_request', 'mention', 'reblog', 'favourite', 'poll', 'status', 'move', 'pleroma:chat_mention', 'pleroma:emoji_reaction', 'user_approved', 'update'];
/** Ensure the Notification is a valid, known type. */
var validType = function (type) { return NOTIFICATION_TYPES.includes(type); };



/***/ }),

/***/ 1802:
/*!*****************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/eraser.svg ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/eraser-11bc469c.svg";

/***/ }),

/***/ 1803:
/*!*********************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/mood-smile.svg ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/mood-smile-86d732ef.svg";

/***/ })

}]);
//# sourceMappingURL=notifications-98e4743d44b871704666.chunk.js.map