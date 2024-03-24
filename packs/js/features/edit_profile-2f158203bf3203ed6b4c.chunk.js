"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[34],{

/***/ 2529:
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/edit_profile/components/profile-preview.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/still_image */ 279);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_components_verification_badge__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/verification_badge */ 281);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/edit_profile/components/profile-preview.tsx";





/** Displays a preview of the user's account, including avatar, banner, etc. */
var ProfilePreview = function (_ref) {
    var account = _ref.account;
    var displayFqn = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useSoapboxConfig)().displayFqn;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "bg-white dark:bg-slate-800 rounded-lg text-black dark:text-white sm:shadow dark:sm:shadow-inset overflow-hidden",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "relative w-full h-32 md:rounded-t-lg bg-gray-200 dark:bg-slate-900/50",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_1__["default"], {
        alt: "",
        src: account.header,
        className: "absolute inset-0 object-cover md:rounded-t-lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.HStack, {
        space: 3,
        alignItems: "center",
        className: "p-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "h-12 w-12 bg-gray-400 rounded-full",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_1__["default"], {
        alt: "",
        className: "h-12 w-12 rounded-full",
        src: account.avatar,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 13
        }
    })), account.verified && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "absolute -top-1.5 -right-1.5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 32
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_verification_badge__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 78
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        className: "truncate",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        weight: "medium",
        size: "sm",
        truncate: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 11
        }
    }, account.display_name), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 11
        }
    }, "@", displayFqn ? account.fqn : account.acct))));
};
/* harmony default export */ __webpack_exports__["default"] = (ProfilePreview);


/***/ }),

/***/ 2128:
/*!*****************************************************!*\
  !*** ./app/soapbox/features/edit_profile/index.tsx ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url.js */ 37);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 20);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_me__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/me */ 191);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_birthday_input__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/birthday_input */ 1645);
/* harmony import */ var soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/list */ 1569);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_components_ui_streamfield_streamfield__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/ui/streamfield/streamfield */ 2502);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_normalizers__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/normalizers */ 33);
/* harmony import */ var soapbox_utils_resize_image__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! soapbox/utils/resize_image */ 1505);
/* harmony import */ var _components_profile_preview__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/profile-preview */ 2529);
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
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/edit_profile/index.tsx";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols);
} return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); });
} return target; }
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }
















/**
 * Whether the user is hiding their follows and/or followers.
 * Pleroma's config is granular, but we simplify it into one setting.
 */
var hidesNetwork = function (account) {
    var _a = account.pleroma.toJS(), hide_followers = _a.hide_followers, hide_follows = _a.hide_follows, hide_followers_count = _a.hide_followers_count, hide_follows_count = _a.hide_follows_count;
    return Boolean(hide_followers && hide_follows && hide_followers_count && hide_follows_count);
};
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_15__.defineMessages)({
    heading: {
        "id": "column.edit_profile",
        "defaultMessage": "Edit profile"
    },
    header: {
        "id": "edit_profile.header",
        "defaultMessage": "Edit Profile"
    },
    metaFieldLabel: {
        "id": "edit_profile.fields.meta_fields.label_placeholder",
        "defaultMessage": "Label"
    },
    metaFieldContent: {
        "id": "edit_profile.fields.meta_fields.content_placeholder",
        "defaultMessage": "Content"
    },
    success: {
        "id": "edit_profile.success",
        "defaultMessage": "Profile saved!"
    },
    error: {
        "id": "edit_profile.error",
        "defaultMessage": "Profile update failed"
    },
    bioPlaceholder: {
        "id": "edit_profile.fields.bio_placeholder",
        "defaultMessage": "Tell us about yourself."
    },
    displayNamePlaceholder: {
        "id": "edit_profile.fields.display_name_placeholder",
        "defaultMessage": "Name"
    },
    websitePlaceholder: {
        "id": "edit_profile.fields.website_placeholder",
        "defaultMessage": "Display a Link"
    },
    locationPlaceholder: {
        "id": "edit_profile.fields.location_placeholder",
        "defaultMessage": "Location"
    },
    statusExpiryPlaceholder: {
        "id": "edit_profile.fields.status_expiry_placeholder",
        "defaultMessage": "Number of days"
    },
    cancel: {
        "id": "common.cancel",
        "defaultMessage": "Cancel"
    }
});
/**
 * Profile metadata `name` and `value`.
 * (By default, max 4 fields and 255 characters per property/value)
 */
/** Convert an account into an update_credentials request object. */
var accountToCredentials = function (account) {
    var hideNetwork = hidesNetwork(account);
    return {
        discoverable: account.discoverable,
        bot: account.bot,
        display_name: account.display_name,
        note: account.source.get('note'),
        locked: account.locked,
        fields_attributes: __spreadArray([], account.source.get('fields', []).toJS(), true),
        stranger_notifications: account.getIn(['pleroma', 'notification_settings', 'block_from_strangers']) === true,
        accepts_email_list: account.getIn(['pleroma', 'accepts_email_list']) === true,
        hide_followers: hideNetwork,
        hide_follows: hideNetwork,
        hide_followers_count: hideNetwork,
        hide_follows_count: hideNetwork,
        website: account.website,
        location: account.location,
        birthday: account.birthday,
        status_ttl_days: account.akkoma.get('status_ttl_days')
    };
};
var ProfileField = function (_ref) {
    var value = _ref.value, onChange = _ref.onChange;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_16__["default"])();
    var handleChange = function (key) {
        return function (e) {
            var _a;
            onChange(_objectSpread(_objectSpread({}, value), {}, (_a = {},
                _a[key] = e.currentTarget.value,
                _a)));
        };
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.HStack, {
        space: 2,
        grow: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 154,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Input, {
        type: "text",
        outerClassName: "w-2/5 flex-grow",
        value: value.name,
        onChange: handleChange('name'),
        placeholder: intl.formatMessage(messages.metaFieldLabel),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 155,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Input, {
        type: "text",
        outerClassName: "w-3/5 flex-grow",
        value: value.value,
        onChange: handleChange('value'),
        placeholder: intl.formatMessage(messages.metaFieldContent),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 162,
            columnNumber: 7
        }
    }));
};
/** Edit profile page. */
var EditProfile = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_16__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__.useOwnAccount)();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__.useFeatures)();
    var maxFields = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__.useAppSelector)(function (state) { return state.instance.pleroma.getIn(['metadata', 'fields_limits', 'max_fields'], 4); });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false), isLoading = _a[0], setLoading = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)({}), data = _b[0], setData = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false), muteStrangers = _c[0], setMuteStrangers = _c[1];
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
        if (account) {
            var credentials = accountToCredentials(account);
            var strangerNotifications = account.getIn(['pleroma', 'notification_settings', 'block_from_strangers']) === true;
            setData(credentials);
            setMuteStrangers(strangerNotifications);
        }
    }, [account === null || account === void 0 ? void 0 : account.id]);
    /** Set a single key in the request data. */
    var updateData = function (key, value) {
        setData(function (prevData) {
            var _a;
            return _objectSpread(_objectSpread({}, prevData), {}, (_a = {},
                _a[key] = value,
                _a));
        });
    };
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    if (!features.muteStrangers) return [3 /*break*/, 3];
                    return [4 /*yield*/, dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_4__.updateNotificationSettings)({
                            block_from_strangers: muteStrangers
                        }))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, dispatch((0,soapbox_actions_me__WEBPACK_IMPORTED_MODULE_5__.patchMe)(_objectSpread(_objectSpread({}, data), {}, {
                        status_ttl_days: data.status_ttl_days === null ? -1 : data.status_ttl_days
                    }), true))];
                case 4:
                    _a.sent();
                    dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].success(intl.formatMessage(messages.success)));
                    return [3 /*break*/, 7];
                case 5:
                    e_1 = _a.sent();
                    console.error(e_1);
                    dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].error(intl.formatMessage(messages.error)));
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleCheckboxChange = function (key) {
        return function (e) {
            updateData(key, e.target.checked);
        };
    };
    var handleTextChange = function (key) {
        return function (e) {
            updateData(key, e.target.value);
        };
    };
    var handleNumberChange = function (key) {
        return function (e) {
            var num = parseInt(e.target.value, 10);
            if (Number.isNaN(num)) {
                updateData(key, null);
            }
            else {
                updateData(key, num);
            }
        };
    };
    var handleBirthdayChange = function (date) {
        updateData('birthday', date);
    };
    var handleHideNetworkChange = function (e) {
        var hide = e.target.checked;
        setData(function (prevData) {
            return _objectSpread(_objectSpread({}, prevData), {}, {
                hide_followers: hide,
                hide_follows: hide,
                hide_followers_count: hide,
                hide_follows_count: hide
            });
        });
    };
    var handleFileChange = function (name, maxPixels) {
        return function (e) {
            var _e$target$files;
            var f = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files.item(0);
            if (!f)
                return;
            (0,soapbox_utils_resize_image__WEBPACK_IMPORTED_MODULE_13__["default"])(f, maxPixels).then(function (file) {
                updateData(name, file);
            }).catch(console.error);
        };
    };
    var handleFieldsChange = function (fields) {
        updateData('fields_attributes', fields);
    };
    var handleAddField = function () {
        var oldFields = data.fields_attributes || [];
        var fields = __spreadArray(__spreadArray([], oldFields, true), [{
                name: '',
                value: ''
            }], false);
        updateData('fields_attributes', fields);
    };
    var handleRemoveField = function (i) {
        var oldFields = data.fields_attributes || [];
        var fields = __spreadArray([], oldFields, true);
        fields.splice(i, 1);
        updateData('fields_attributes', fields);
    };
    /** Memoized avatar preview URL. */
    var avatarUrl = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function () {
        return data.avatar ? URL.createObjectURL(data.avatar) : account === null || account === void 0 ? void 0 : account.avatar;
    }, [data.avatar, account === null || account === void 0 ? void 0 : account.avatar]);
    /** Memoized header preview URL. */
    var headerUrl = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function () {
        return data.header ? URL.createObjectURL(data.header) : account === null || account === void 0 ? void 0 : account.header;
    }, [data.header, account === null || account === void 0 ? void 0 : account.header]);
    /** Preview account data. */
    var previewAccount = (0,react__WEBPACK_IMPORTED_MODULE_3__.useMemo)(function () {
        return (0,soapbox_normalizers__WEBPACK_IMPORTED_MODULE_12__.normalizeAccount)(_objectSpread(_objectSpread(_objectSpread({}, account === null || account === void 0 ? void 0 : account.toJS()), data), {}, {
            avatar: avatarUrl,
            header: headerUrl
        }));
    }, [account === null || account === void 0 ? void 0 : account.id, data.display_name, avatarUrl, headerUrl]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Column, {
        label: intl.formatMessage(messages.header),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 325,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Form, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 326,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.display_name_label",
            defaultMessage: "Display name",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 328,
                columnNumber: 22
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 327,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Input, {
        type: "text",
        value: data.display_name,
        onChange: handleTextChange('display_name'),
        placeholder: intl.formatMessage(messages.displayNamePlaceholder),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 330,
            columnNumber: 11
        }
    })), features.birthdays && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.birthday_label",
            defaultMessage: "Birthday",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 340,
                columnNumber: 24
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 339,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_birthday_input__WEBPACK_IMPORTED_MODULE_7__["default"], {
        value: data.birthday,
        onChange: handleBirthdayChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 342,
            columnNumber: 13
        }
    })), features.accountLocation && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.location_label",
            defaultMessage: "Location",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 351,
                columnNumber: 24
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 350,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Input, {
        type: "text",
        value: data.location,
        onChange: handleTextChange('location'),
        placeholder: intl.formatMessage(messages.locationPlaceholder),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 353,
            columnNumber: 13
        }
    })), features.accountWebsite && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.website_label",
            defaultMessage: "Website",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 364,
                columnNumber: 24
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 363,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Input, {
        type: "text",
        value: data.website,
        onChange: handleTextChange('website'),
        placeholder: intl.formatMessage(messages.websitePlaceholder),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 366,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.bio_label",
            defaultMessage: "Bio",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 376,
                columnNumber: 22
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 375,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Textarea, {
        value: data.note,
        onChange: handleTextChange('note'),
        autoComplete: "off",
        placeholder: intl.formatMessage(messages.bioPlaceholder),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 378,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 386,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_profile_preview__WEBPACK_IMPORTED_MODULE_14__["default"], {
        account: previewAccount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 387,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "space-y-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 389,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.header_label",
            defaultMessage: "Choose Background Picture",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 391,
                columnNumber: 26
            }
        }),
        hintText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.header",
            defaultMessage: "PNG, GIF or JPG. Will be downscaled to {size}",
            values: {
                size: '1920x1080px'
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 392,
                columnNumber: 25
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 390,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FileInput, {
        onChange: handleFileChange('header', 1920 * 1080),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 394,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormGroup, {
        labelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.avatar_label",
            defaultMessage: "Choose Profile Picture",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 398,
                columnNumber: 26
            }
        }),
        hintText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.avatar",
            defaultMessage: "PNG, GIF or JPG. Will be downscaled to {size}",
            values: {
                size: '400x400px'
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 399,
                columnNumber: 25
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 397,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FileInput, {
        onChange: handleFileChange('avatar', 400 * 400),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 401,
            columnNumber: 15
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 406,
            columnNumber: 9
        }
    }, features.followRequests && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.locked_label",
            defaultMessage: "Lock account",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 409,
                columnNumber: 22
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.locked",
            defaultMessage: "Requires you to manually approve followers",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 410,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 408,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Toggle, {
        checked: data.locked,
        onChange: handleCheckboxChange('locked'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 412,
            columnNumber: 15
        }
    })), features.hideNetwork && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.hide_network_label",
            defaultMessage: "Hide network",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 421,
                columnNumber: 22
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.hide_network",
            defaultMessage: "Who you follow and who follows you will not be shown on your profile",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 422,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 420,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Toggle, {
        checked: account ? hidesNetwork(account) : false,
        onChange: handleHideNetworkChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 424,
            columnNumber: 15
        }
    })), features.bots && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.bot_label",
            defaultMessage: "This is a bot account",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 433,
                columnNumber: 22
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.bot",
            defaultMessage: "This account mainly performs automated actions and might not be monitored",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 434,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 432,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Toggle, {
        checked: data.bot,
        onChange: handleCheckboxChange('bot'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 436,
            columnNumber: 15
        }
    })), features.muteStrangers && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.stranger_notifications_label",
            defaultMessage: "Block notifications from strangers",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 445,
                columnNumber: 22
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.stranger_notifications",
            defaultMessage: "Only show notifications from people you follow",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 446,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 444,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Toggle, {
        checked: muteStrangers,
        onChange: function (e) { return setMuteStrangers(e.target.checked); },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 448,
            columnNumber: 15
        }
    })), features.profileDirectory && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.discoverable_label",
            defaultMessage: "Allow account discovery",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 457,
                columnNumber: 22
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.discoverable",
            defaultMessage: "Display account in profile directory and allow indexing by external services",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 458,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 456,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Toggle, {
        checked: data.discoverable,
        onChange: handleCheckboxChange('discoverable'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 460,
            columnNumber: 15
        }
    })), features.statusExpiry && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.status_expiry_label",
            defaultMessage: "Scheduled post deletion",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 469,
                columnNumber: 22
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.status_expiry",
            defaultMessage: "Delete posts after a set amount of days (let empty to disable)",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 470,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 468,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Input, {
        type: "number",
        value: data.status_ttl_days,
        onChange: handleNumberChange('status_ttl_days'),
        placeholder: intl.formatMessage(messages.statusExpiryPlaceholder),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 472,
            columnNumber: 15
        }
    })), features.emailList && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_8__.ListItem, {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.accepts_email_list_label",
            defaultMessage: "Subscribe to newsletter",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 483,
                columnNumber: 22
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.accepts_email_list",
            defaultMessage: "Opt-in to news and marketing updates.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 484,
                columnNumber: 21
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 482,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Toggle, {
        checked: data.accepts_email_list,
        onChange: handleCheckboxChange('accepts_email_list'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 486,
            columnNumber: 15
        }
    }))), features.profileFields && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui_streamfield_streamfield__WEBPACK_IMPORTED_MODULE_10__["default"], {
        label: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.fields.meta_fields_label",
            defaultMessage: "Profile fields",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 496,
                columnNumber: 20
            }
        }),
        hint: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
            id: "edit_profile.hints.meta_fields",
            defaultMessage: "You can have up to {count, plural, one {# custom field} other {# custom fields}} displayed on your profile.",
            values: {
                count: maxFields
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 497,
                columnNumber: 19
            }
        }),
        values: data.fields_attributes || [],
        onChange: handleFieldsChange,
        onAddItem: handleAddField,
        onRemoveItem: handleRemoveField,
        component: ProfileField,
        maxItems: maxFields,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 495,
            columnNumber: 11
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.FormActions, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 507,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Button, {
        to: "/settings",
        theme: "ghost",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 508,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.cancel)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Button, {
        theme: "primary",
        type: "submit",
        disabled: isLoading,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 512,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_17__["default"], {
        id: "edit_profile.save",
        defaultMessage: "Save",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 513,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (EditProfile);


/***/ })

}]);
//# sourceMappingURL=edit_profile-2f158203bf3203ed6b4c.chunk.js.map