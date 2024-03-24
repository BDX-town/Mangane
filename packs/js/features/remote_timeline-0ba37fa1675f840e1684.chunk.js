"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[64],{

/***/ 2370:
/*!************************************************!*\
  !*** ./app/soapbox/actions/remote_timeline.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pinHost": function() { return /* binding */ pinHost; },
/* harmony export */   "unpinHost": function() { return /* binding */ unpinHost; }
/* harmony export */ });
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! soapbox/actions/settings */ 22);

var getPinnedHosts = function (state) {
    var settings = (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_0__.getSettings)(state);
    return settings.getIn(['remote_timeline', 'pinnedHosts']);
};
var pinHost = function (host) { return function (dispatch, getState) {
    var state = getState();
    var pinnedHosts = getPinnedHosts(state);
    return dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_0__.changeSetting)(['remote_timeline', 'pinnedHosts'], pinnedHosts.add(host)));
}; };
var unpinHost = function (host) { return function (dispatch, getState) {
    var state = getState();
    var pinnedHosts = getPinnedHosts(state);
    return dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_0__.changeSetting)(['remote_timeline', 'pinnedHosts'], pinnedHosts.remove(host)));
}; };



/***/ }),

/***/ 2031:
/*!********************************************************!*\
  !*** ./app/soapbox/features/remote_timeline/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/streaming */ 89);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/timelines */ 46);
/* harmony import */ var soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/ui/components/column */ 1497);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/is_mobile */ 90);
/* harmony import */ var _ui_components_timeline__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui/components/timeline */ 1879);
/* harmony import */ var _components_pinned_hosts_picker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/pinned_hosts_picker */ 1884);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/remote_timeline/index.tsx";









var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    title: {
        "id": "remote_timeline.filter_message",
        "defaultMessage": "You are viewing the timeline of {instance}."
    }
});
/** View statuses from a remote instance. */
var RemoteTimeline = function (_ref) {
    var params = _ref.params;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var instance = params === null || params === void 0 ? void 0 : params.instance;
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useSettings)();
    var stream = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    var timelineId = 'remote';
    var onlyMedia = !!settings.getIn(['remote', 'other', 'onlyMedia']);
    var disconnect = function () {
        if (stream.current) {
            stream.current();
        }
    };
    var handleLoadMore = function (maxId) {
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_2__.expandRemoteTimeline)(instance, {
            maxId: maxId,
            onlyMedia: onlyMedia
        }));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        disconnect();
        dispatch((0,soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_2__.expandRemoteTimeline)(instance, {
            onlyMedia: onlyMedia,
            maxId: undefined
        }));
        if (!(0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_5__.isMobile)(window.innerWidth)) {
            stream.current = dispatch((0,soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_1__.connectRemoteStream)(instance, {
                onlyMedia: onlyMedia
            }));
            return function () {
                disconnect();
                stream.current = null;
            };
        }
    }, [onlyMedia]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pt-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_3__["default"], {
        label: instance,
        heading: intl.formatMessage(messages.title, {
            instance: instance
        }),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 7
        }
    }, instance && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_pinned_hosts_picker__WEBPACK_IMPORTED_MODULE_7__["default"], {
        host: instance,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 22
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_timeline__WEBPACK_IMPORTED_MODULE_6__["default"], {
        scrollKey: "".concat(timelineId, "_").concat(instance, "_timeline"),
        timelineId: "".concat(timelineId).concat(onlyMedia ? ':media' : '', ":").concat(instance),
        onLoadMore: handleLoadMore,
        emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
            id: "empty_column.remote",
            defaultMessage: "There is nothing here! Manually follow users from {instance} to fill it up.",
            values: {
                instance: instance
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 70,
                columnNumber: 13
            }
        }),
        divideType: "space",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (RemoteTimeline);


/***/ }),

/***/ 2115:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/instance_info_panel.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/remote_timeline */ 2370);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/selectors */ 31);

var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/instance_info_panel.tsx";







var getRemoteInstance = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__.makeGetRemoteInstance)();
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    pinHost: {
        "id": "remote_instance.pin_host",
        "defaultMessage": "Pin {host}"
    },
    unpinHost: {
        "id": "remote_instance.unpin_host",
        "defaultMessage": "Unpin {host}"
    }
});
/** Widget that displays information about a remote instance to users. */
var InstanceInfoPanel = function (_ref) {
    var host = _ref.host;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useSettings)();
    var remoteInstance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return getRemoteInstance(state, host); });
    var pinned = settings.getIn(['remote_timeline', 'pinnedHosts']).includes(host);
    var handlePinHost = function () {
        if (!pinned) {
            dispatch((0,soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__.pinHost)(host));
        }
        else {
            dispatch((0,soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__.unpinHost)(host));
        }
    };
    if (!remoteInstance)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Widget, {
        title: remoteInstance.get('host'),
        onActionClick: handlePinHost,
        actionIcon: pinned ? __webpack_require__(/*! @tabler/icons/pinned-off.svg */ 1622) : __webpack_require__(/*! @tabler/icons/pin.svg */ 1623),
        actionTitle: intl.formatMessage(pinned ? messages.unpinHost : messages.pinHost, {
            host: host
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 5
        }
    });
};
/* harmony default export */ __webpack_exports__["default"] = (InstanceInfoPanel);


/***/ }),

/***/ 2116:
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/instance_moderation_panel.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/containers/dropdown_menu_container */ 189);
/* harmony import */ var soapbox_features_federation_restrictions_components_instance_restrictions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/federation_restrictions/components/instance_restrictions */ 1894);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/selectors */ 31);

var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/instance_moderation_panel.tsx";








var getRemoteInstance = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__.makeGetRemoteInstance)();
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    editFederation: {
        "id": "remote_instance.edit_federation",
        "defaultMessage": "Edit federation"
    }
});
/** Widget for moderators to manage a remote instance. */
var InstanceModerationPanel = function (_ref) {
    var host = _ref.host;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useOwnAccount)();
    var remoteInstance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return getRemoteInstance(state, host); });
    var handleEditFederation = function () {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__.openModal)('EDIT_FEDERATION', {
            host: host
        }));
    };
    var makeMenu = function () {
        return [{
                text: intl.formatMessage(messages.editFederation),
                action: handleEditFederation,
                icon: __webpack_require__(/*! @tabler/icons/edit.svg */ 1513)
            }];
    };
    var menu = makeMenu();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "remote_instance.federation_panel.heading",
            defaultMessage: "Federation Restrictions",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 48,
                columnNumber: 14
            }
        }),
        action: account !== null && account !== void 0 && account.admin ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_3__["default"], {
            items: menu,
            src: __webpack_require__(/*! @tabler/icons/dots-vertical.svg */ 1515),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 50,
                columnNumber: 9
            }
        }) : undefined,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_federation_restrictions_components_instance_restrictions__WEBPACK_IMPORTED_MODULE_4__["default"], {
        remoteInstance: remoteInstance,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (InstanceModerationPanel);


/***/ })

}]);
//# sourceMappingURL=remote_timeline-0ba37fa1675f840e1684.chunk.js.map