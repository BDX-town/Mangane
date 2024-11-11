"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[64],{

/***/ 2064:
/*!********************************************************!*\
  !*** ./app/soapbox/features/remote_timeline/index.tsx ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/streaming */ 97);
/* harmony import */ var soapbox_actions_timelines__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/timelines */ 45);
/* harmony import */ var soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/sub_navigation */ 692);
/* harmony import */ var soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/ui/components/column */ 1106);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/is_mobile */ 65);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 30);
/* harmony import */ var _ui_components_timeline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ui/components/timeline */ 902);
/* harmony import */ var _components_button_pin__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/button-pin */ 906);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/remote_timeline/index.tsx";











var Heading = function (_ref) {
    var instance = _ref.instance;
    var getRemoteInstance = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetRemoteInstance)();
    var meta = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (s) { return getRemoteInstance(s, instance); });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex gap-2 items-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 5
        }
    }, meta.get('favicon') && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
        alt: "".concat(instance, " favicon"),
        src: meta.get('favicon'),
        width: 24,
        height: 24,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 32
        }
    }), instance, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_components_button_pin__WEBPACK_IMPORTED_MODULE_9__.ButtonPin, {
        instance: instance,
        width: 20,
        height: 20,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 7
        }
    }));
};
/** View statuses from a remote instance. */
var RemoteTimeline = function (_ref2) {
    var params = _ref2.params;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var instance = params === null || params === void 0 ? void 0 : params.instance;
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useSettings)();
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
        if (!(0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_6__.isMobile)(window.innerWidth)) {
            stream.current = dispatch((0,soapbox_actions_streaming__WEBPACK_IMPORTED_MODULE_1__.connectRemoteStream)(instance, {
                onlyMedia: onlyMedia
            }));
            return function () {
                disconnect();
                stream.current = null;
            };
        }
    }, [onlyMedia]);
    var completeTimelineId = "".concat(timelineId).concat(onlyMedia ? ':media' : '', ":").concat(instance);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pt-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: instance,
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "px-4 pt-1 sm:p-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_sub_navigation__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Heading, {
        instance: instance,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mb-4 px-4 sm:p-0",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 9
        }
    }, instance && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: "remote_timeline.filter_message",
        defaultMessage: "You are viewing the local timeline of {instance}.",
        values: {
            instance: instance
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 25
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ui_components_timeline__WEBPACK_IMPORTED_MODULE_8__["default"], {
        scrollKey: "".concat(timelineId, "_").concat(instance, "_timeline"),
        timelineId: completeTimelineId,
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
                lineNumber: 90,
                columnNumber: 13
            }
        }),
        divideType: "space",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (RemoteTimeline);


/***/ }),

/***/ 2149:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/instance_info_panel.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_remote_timeline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/remote_timeline */ 460);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/selectors */ 30);

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
        actionIcon: pinned ? __webpack_require__(/*! @tabler/icons/pinned-off.svg */ 1148) : __webpack_require__(/*! @tabler/icons/pin.svg */ 1149),
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

/***/ 2150:
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/instance_moderation_panel.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_dropdown_menu_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/containers/dropdown_menu_container */ 254);
/* harmony import */ var soapbox_features_federation_restrictions_components_instance_restrictions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/federation_restrictions/components/instance_restrictions */ 1927);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/selectors */ 30);

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
                icon: __webpack_require__(/*! @tabler/icons/edit.svg */ 1111)
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
            src: __webpack_require__(/*! @tabler/icons/dots-vertical.svg */ 1112),
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
//# sourceMappingURL=remote_timeline-194ed0d45628324fc14a.chunk.js.map