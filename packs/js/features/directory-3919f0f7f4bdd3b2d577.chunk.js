"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[30],{

/***/ 2534:
/*!********************************************************************!*\
  !*** ./app/soapbox/features/directory/components/account_card.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/settings */ 22);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/avatar */ 393);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/display-name */ 394);
/* harmony import */ var soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/permalink */ 1509);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_features_ui_components_action_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/ui/components/action-button */ 274);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/selectors */ 31);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/directory/components/account_card.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }











var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_9__.makeGetAccount)();
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__.defineMessages)({
    today: {
        "id": "account.today",
        "defaultMessage": "Today"
    },
    yesterday: {
        "id": "account.yesterday",
        "defaultMessage": "Yesterday"
    },
    days: {
        "id": "account.days",
        "defaultMessage": "Days"
    }
});
var AccountCard = function (_ref) {
    var _account$relationship;
    var id = _ref.id;
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return state.me; });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return getAccount(state, id); });
    var autoPlayGif = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_8__.useAppSelector)(function (state) { return (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_2__.getSettings)(state).get('autoPlayGif'); });
    var followedBy = me !== account.id && ((_account$relationship = account.relationship) === null || _account$relationship === void 0 ? void 0 : _account$relationship.followed_by);
    var ago = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        if (!account)
            return 0;
        var date = new Date(account.last_status_at).valueOf();
        var today = new Date().valueOf();
        var diffInDays = Math.floor((today - date) / 1000 / 60 / 60 / 24);
        return diffInDays;
    }, [account]);
    if (!account)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "directory__card shadow dark:bg-slate-700 flex flex-col",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 5
        }
    }, followedBy && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "directory__card__info",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "bg-white rounded p-1 mt-1 text-[8px] opacity-90 uppercase dark:text-white dark:bg-slate-800",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "account.follows_you",
        defaultMessage: "Follows you",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "directory__card__img",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("img", {
        src: autoPlayGif ? account.header : account.header_static,
        alt: "",
        className: "parallax",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "px-4 py-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_5__["default"], {
        href: account.url,
        to: "/@".concat(account.acct),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex justify-between items-end min-h-[30px]",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_3__["default"], {
        className: "absolute border-solid border-4 border-white dark:border-slate-700",
        account: account,
        size: 100,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "text-right grow",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_action_button__WEBPACK_IMPORTED_MODULE_7__["default"], {
        account: account,
        small: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        className: "mt-3 leading-5",
        size: "lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_4__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 13
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "h-24 overflow-hidden px-4 py-3 grow",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        size: "sm",
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('italic account__header__content', (account.note.length === 0 || account.note === '<p></p>') && 'empty'),
        dangerouslySetInnerHTML: {
            __html: account.note_emojified
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex items-center justify-between px-4 py-3 mt-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "primary",
        size: "xs",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "account.posts",
        defaultMessage: "Posts",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        weight: "bold",
        size: "lg",
        className: "leading-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_10__.FormattedNumber, {
        value: account.statuses_count,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 63
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "accounts-table__count text-right",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "primary",
        size: "xs",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "account.last_status",
        defaultMessage: "Last active",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 43
        }
    })), account.last_status_at === null ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        weight: "bold",
        size: "lg",
        className: "leading-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
        id: "account.never_active",
        defaultMessage: "Never",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 67
        }
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        weight: "bold",
        size: "lg",
        className: "leading-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 15
        }
    }, ago < 1 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], _extends({}, messages.today, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 30
        }
    })), ago >= 1 && ago < 2 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], _extends({}, messages.yesterday, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 42
        }
    })), ago >= 2 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, ago, " ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], _extends({}, messages.days, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 39
        }
    })))))));
};
/* harmony default export */ __webpack_exports__["default"] = (AccountCard);


/***/ }),

/***/ 2135:
/*!**************************************************!*\
  !*** ./app/soapbox/features/directory/index.tsx ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 25);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_directory__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/directory */ 1573);
/* harmony import */ var soapbox_components_load_more__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/load_more */ 1540);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 3);
/* harmony import */ var soapbox_components_ui_toggle_toggle__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/ui/toggle/toggle */ 1533);
/* harmony import */ var soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/features/ui/components/column */ 1497);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/hooks */ 2);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var _components_account_card__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/account_card */ 2534);
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
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/directory/index.tsx";















var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_13__.defineMessages)({
    title: {
        "id": "column.directory",
        "defaultMessage": "Browse profiles"
    },
    recentlyActive: {
        "id": "directory.recently_active",
        "defaultMessage": "Recently active"
    },
    newArrivals: {
        "id": "directory.new_arrivals",
        "defaultMessage": "New arrivals"
    },
    local: {
        "id": "directory.local",
        "defaultMessage": "From {domain} only"
    },
    federated: {
        "id": "directory.federated",
        "defaultMessage": "From known fediverse"
    },
    description: {
        "id": "directory.description",
        "defaultMessage": "Only accounts that have consented to appear here are displayed."
    }
});
var Directory = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_14__["default"])();
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_4__.useDispatch)();
    var search = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_15__.useLocation)().search;
    var params = new URLSearchParams(search);
    var _a = react__WEBPACK_IMPORTED_MODULE_3__.useState(true), loading = _a[0], setLoading = _a[1];
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.user_lists.directory.items; });
    var title = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.instance.get('title'); });
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_11__.getFeatures)(state.instance); });
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(params.get('order') || 'active'), order = _b[0], setOrder = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(!!params.get('local')), local = _c[0], setLocal = _c[1];
    var load = react__WEBPACK_IMPORTED_MODULE_3__.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, dispatch((0,soapbox_actions_directory__WEBPACK_IMPORTED_MODULE_5__.fetchDirectory)({
                            order: order || 'active',
                            local: local || false
                        }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [order, local]);
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
        load();
    }, [load]);
    var handleChangeOrder = function (e) {
        if (e.target.checked)
            setOrder('new');
        else
            setOrder('active');
    };
    var handleChangeLocal = function (e) {
        if (e.target.checked)
            setLocal(true);
        else
            setLocal(false);
    };
    var handleLoadMore = react__WEBPACK_IMPORTED_MODULE_3__.useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, dispatch((0,soapbox_actions_directory__WEBPACK_IMPORTED_MODULE_5__.expandDirectory)({
                            order: order || 'active',
                            local: local || false
                        }))];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [order, local]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_ui_components_column__WEBPACK_IMPORTED_MODULE_9__["default"], {
        icon: "address-book-o",
        label: intl.formatMessage(messages.title),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "my-4 text-gray-700 dark:text-gray-400",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 7
        }
    }, intl.formatMessage(messages.description)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "directory__filter-form flex items-center gap-4 my-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "directory__filter-form__column flex items-center gap-2",
        role: "group",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui_toggle_toggle__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "new-arrivals",
        checked: order === 'new',
        onChange: handleChangeOrder,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 11
        }
    }), " ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("label", {
        htmlFor: "new-arrivals",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 95
        }
    }, intl.formatMessage(messages.newArrivals))), features.federating && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "directory__filter-form__column flex items-center gap-2",
        role: "group",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui_toggle_toggle__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "local",
        checked: local,
        onChange: handleChangeLocal,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 13
        }
    }), " ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("label", {
        htmlFor: "new-arrivals",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 80
        }
    }, intl.formatMessage(messages.local, {
        domain: title
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()('directory__list'),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 7
        }
    }, accountIds.map(function (accountId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_account_card__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: accountId,
        key: accountId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 40
        }
    }); })), loading && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "my-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 20
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Spinner, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 42
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
        className: "mt-4 mt-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_load_more__WEBPACK_IMPORTED_MODULE_6__["default"], {
        disabled: loading,
        onClick: handleLoadMore,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (Directory);


/***/ })

}]);
//# sourceMappingURL=directory-3919f0f7f4bdd3b2d577.chunk.js.map