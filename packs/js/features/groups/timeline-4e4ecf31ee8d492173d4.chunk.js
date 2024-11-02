"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[48],{

/***/ 1610:
/*!***************************************************!*\
  !*** ./app/soapbox/features/groups/edit/index.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Edit; }
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-immutable-proptypes */ 193);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/missing_indicator */ 1447);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var _actions_group_editor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/group_editor */ 299);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/groups/edit/index.js";
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    title: {
        "id": "groups.form.title",
        "defaultMessage": "Title"
    },
    description: {
        "id": "groups.form.description",
        "defaultMessage": "Description"
    },
    coverImage: {
        "id": "groups.form.coverImage",
        "defaultMessage": "Upload new banner image (optional)"
    },
    coverImageChange: {
        "id": "groups.form.coverImageChange",
        "defaultMessage": "Banner image selected"
    },
    update: {
        "id": "groups.form.update",
        "defaultMessage": "Update group"
    }
});
var mapStateToProps = function (state, props) { return ({
    group: state.getIn(['groups', props.params.id]),
    title: state.getIn(['group_editor', 'title']),
    description: state.getIn(['group_editor', 'description']),
    coverImage: state.getIn(['group_editor', 'coverImage']),
    disabled: state.getIn(['group_editor', 'isSubmitting'])
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onTitleChange: function (value) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_7__.changeValue)('title', value)); },
    onDescriptionChange: function (value) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_7__.changeValue)('description', value)); },
    onCoverImageChange: function (value) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_7__.changeValue)('coverImage', value)); },
    onSubmit: function (routerHistory) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_7__.submit)(routerHistory)); },
    setUp: function (group) { return dispatch((0,_actions_group_editor__WEBPACK_IMPORTED_MODULE_7__.setUp)(group)); }
}); };
var Edit = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_4__.connect)(mapStateToProps, mapDispatchToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])(_class = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.withRouter)(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Edit, _super);
    function Edit(props) {
        var _this = _super.call(this, props) || this;
        _defineProperty(_this, "handleTitleChange", function (e) {
            _this.props.onTitleChange(e.target.value);
        });
        _defineProperty(_this, "handleDescriptionChange", function (e) {
            _this.props.onDescriptionChange(e.target.value);
        });
        _defineProperty(_this, "handleCoverImageChange", function (e) {
            _this.props.onCoverImageChange(e.target.files[0]);
        });
        _defineProperty(_this, "handleSubmit", function (e) {
            e.preventDefault();
            _this.props.onSubmit(_this.props.history);
        });
        _defineProperty(_this, "handleClick", function () {
            _this.props.onSubmit(_this.props.history);
        });
        if (props.group)
            props.setUp(props.group);
        return _this;
    }
    Edit.prototype.componentDidUpdate = function (prevProps) {
        if (!prevProps.group && this.props.group) {
            this.props.setUp(this.props.group);
        }
    };
    Edit.prototype.render = function () {
        var _a = this.props, group = _a.group, title = _a.title, description = _a.description, coverImage = _a.coverImage, disabled = _a.disabled, intl = _a.intl;
        if (typeof group === 'undefined') {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Column, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 95,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Spinner, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 96,
                    columnNumber: 11
                }
            }));
        }
        else if (group === false) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_missing_indicator__WEBPACK_IMPORTED_MODULE_5__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 101,
                    columnNumber: 9
                }
            });
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("form", {
            className: "group-form",
            method: "post",
            onSubmit: this.handleSubmit,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 106,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 107,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("input", {
            className: "standard",
            type: "text",
            value: title,
            disabled: disabled,
            onChange: this.handleTitleChange,
            placeholder: intl.formatMessage(messages.title),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 108,
                columnNumber: 11
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 118,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("textarea", {
            className: "standard",
            type: "text",
            value: description,
            disabled: disabled,
            onChange: this.handleDescriptionChange,
            placeholder: intl.formatMessage(messages.description),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 119,
                columnNumber: 11
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 129,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("label", {
            htmlFor: "group_cover_image",
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('group-form__file-label', {
                'group-form__file-label--selected': coverImage !== null
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 130,
                columnNumber: 11
            }
        }, intl.formatMessage(coverImage === null ? messages.coverImage : messages.coverImageChange)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("input", {
            type: "file",
            className: "group-form__file",
            id: "group_cover_image",
            disabled: disabled,
            onChange: this.handleCoverImageChange,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 134,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 142,
                columnNumber: 11
            }
        }, intl.formatMessage(messages.update))));
    };
    return Edit;
}(react__WEBPACK_IMPORTED_MODULE_2__.PureComponent)), _defineProperty(_class2, "propTypes", {
    group: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map),
    title: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
    description: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
    coverImage: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object),
    disabled: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired),
    onTitleChange: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    onSubmit: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    onDescriptionChange: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    onCoverImageChange: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    setUp: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    history: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object)
}), _class2)) || _class) || _class) || _class);



/***/ }),

/***/ 1608:
/*!******************************************************!*\
  !*** ./app/soapbox/features/groups/members/index.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ GroupMembers; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-proptypes */ 193);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-immutable-pure-component */ 156);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var _actions_groups__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../actions/groups */ 160);
/* harmony import */ var _components_scrollable_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../components/scrollable_list */ 843);
/* harmony import */ var _containers_account_container__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../containers/account_container */ 155);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../ui/components/column */ 844);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/groups/members/index.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }












var mapStateToProps = function (state, _ref) {
    var _state$user_lists$gro, _state$user_lists$gro2;
    var id = _ref.params.id;
    return {
        group: state.getIn(['groups', id]),
        accountIds: (_state$user_lists$gro = state.user_lists.groups.get(id)) === null || _state$user_lists$gro === void 0 ? void 0 : _state$user_lists$gro.items,
        hasMore: !!((_state$user_lists$gro2 = state.user_lists.groups.get(id)) !== null && _state$user_lists$gro2 !== void 0 && _state$user_lists$gro2.next)
    };
};
var GroupMembers = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps), _dec(_class = (_class2 = /** @class */ (function (_super) {
    __extends(GroupMembers, _super);
    function GroupMembers() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "handleLoadMore", lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(function () {
            _this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_8__.expandMembers)(_this.props.params.id));
        }, 300, {
            leading: true
        }));
        return _this;
    }
    GroupMembers.prototype.componentDidMount = function () {
        var id = this.props.params.id;
        this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_8__.fetchMembers)(id));
    };
    GroupMembers.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.params.id !== prevProps.params.id) {
            this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_8__.fetchMembers)(this.props.params.id));
        }
    };
    GroupMembers.prototype.render = function () {
        var _this = this;
        var _a = this.props, accountIds = _a.accountIds, hasMore = _a.hasMore, group = _a.group;
        if (!group || !accountIds) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_11__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 56,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Spinner, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 57,
                    columnNumber: 11
                }
            }));
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_11__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 63,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_scrollable_list__WEBPACK_IMPORTED_MODULE_9__["default"], {
            scrollKey: "members",
            hasMore: hasMore,
            onLoadMore: this.handleLoadMore,
            emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
                id: "group.members.empty",
                defaultMessage: "This group does not has any members.",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 68,
                    columnNumber: 25
                }
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 64,
                columnNumber: 9
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(_containers_account_container__WEBPACK_IMPORTED_MODULE_10__["default"], {
            key: id,
            id: id,
            withNote: false,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 70,
                columnNumber: 33
            }
        }); })));
    };
    return GroupMembers;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__["default"])), _defineProperty(_class2, "propTypes", {
    params: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
    accountIds: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().orderedSet),
    hasMore: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool)
}), _class2)) || _class);



/***/ }),

/***/ 1609:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/groups/removed_accounts/index.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ GroupRemovedAccounts; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/debounce */ 44);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-proptypes */ 193);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-immutable-pure-component */ 156);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var _actions_groups__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../actions/groups */ 160);
/* harmony import */ var _components_scrollable_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../components/scrollable_list */ 843);
/* harmony import */ var _containers_account_container__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../containers/account_container */ 155);
/* harmony import */ var _ui_components_column__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../ui/components/column */ 844);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/groups/removed_accounts/index.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }












var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__.defineMessages)({
    remove: {
        "id": "groups.removed_accounts",
        "defaultMessage": "Allow joining"
    }
});
var mapStateToProps = function (state, _ref) {
    var _state$user_lists$gro, _state$user_lists$gro2;
    var id = _ref.params.id;
    return {
        group: state.getIn(['groups', id]),
        accountIds: (_state$user_lists$gro = state.user_lists.groups_removed_accounts.get(id)) === null || _state$user_lists$gro === void 0 ? void 0 : _state$user_lists$gro.items,
        hasMore: !!((_state$user_lists$gro2 = state.user_lists.groups_removed_accounts.get(id)) !== null && _state$user_lists$gro2 !== void 0 && _state$user_lists$gro2.next)
    };
};
var GroupRemovedAccounts = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_13__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(GroupRemovedAccounts, _super);
    function GroupRemovedAccounts() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "handleLoadMore", lodash_debounce__WEBPACK_IMPORTED_MODULE_1___default()(function () {
            _this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_8__.expandRemovedAccounts)(_this.props.params.id));
        }, 300, {
            leading: true
        }));
        _defineProperty(_this, "handleOnActionClick", function (group, id) {
            return function () {
                _this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_8__.removeRemovedAccount)(group.get('id'), id));
            };
        });
        return _this;
    }
    GroupRemovedAccounts.prototype.componentDidMount = function () {
        var id = this.props.params.id;
        this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_8__.fetchRemovedAccounts)(id));
    };
    GroupRemovedAccounts.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.params.id !== prevProps.params.id) {
            this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_8__.fetchRemovedAccounts)(this.props.params.id));
        }
    };
    GroupRemovedAccounts.prototype.render = function () {
        var _this = this;
        var _a = this.props, accountIds = _a.accountIds, hasMore = _a.hasMore, group = _a.group, intl = _a.intl;
        if (!group || !accountIds) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_11__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 68,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.Spinner, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 69,
                    columnNumber: 11
                }
            }));
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui_components_column__WEBPACK_IMPORTED_MODULE_11__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 75,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_components_scrollable_list__WEBPACK_IMPORTED_MODULE_9__["default"], {
            scrollKey: "removed_accounts",
            hasMore: hasMore,
            onLoadMore: this.handleLoadMore,
            emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
                id: "group.removed_accounts.empty",
                defaultMessage: "This group does not has any removed accounts.",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 80,
                    columnNumber: 25
                }
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 76,
                columnNumber: 9
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(_containers_account_container__WEBPACK_IMPORTED_MODULE_10__["default"], {
            key: id,
            id: id,
            actionIcon: __webpack_require__(/*! @tabler/icons/x.svg */ 52),
            onActionClick: _this.handleOnActionClick(group, id),
            actionTitle: intl.formatMessage(messages.remove),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 82,
                columnNumber: 34
            }
        }); })));
    };
    return GroupRemovedAccounts;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__["default"])), _defineProperty(_class2, "propTypes", {
    params: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
    accountIds: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().orderedSet),
    hasMore: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool)
}), _class2)) || _class) || _class);



/***/ }),

/***/ 1607:
/*!*******************************************************!*\
  !*** ./app/soapbox/features/groups/timeline/index.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ GroupTimeline; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-immutable-proptypes */ 193);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var _soapbox_features_compose_containers_compose_form_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../soapbox/features/compose/containers/compose_form_container */ 1455);
/* harmony import */ var _actions_streaming__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../actions/streaming */ 127);
/* harmony import */ var _actions_timelines__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../actions/timelines */ 45);
/* harmony import */ var _components_avatar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../components/avatar */ 412);
/* harmony import */ var _components_missing_indicator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../components/missing_indicator */ 1447);
/* harmony import */ var _ui_components_timeline__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../ui/components/timeline */ 1448);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/groups/timeline/index.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }













var mapStateToProps = function (state, props) {
    var me = state.get('me');
    return {
        account: state.getIn(['accounts', me]),
        group: state.getIn(['groups', props.params.id]),
        relationships: state.getIn(['group_relationships', props.params.id]),
        hasUnread: state.getIn(['timelines', "group:".concat(props.params.id), 'unread']) > 0
    };
};
var GroupTimeline = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_4__.connect)(mapStateToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(GroupTimeline, _super);
    function GroupTimeline() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "handleLoadMore", function (maxId) {
            var id = _this.props.params.id;
            _this.props.dispatch((0,_actions_timelines__WEBPACK_IMPORTED_MODULE_8__.expandGroupTimeline)(id, {
                maxId: maxId
            }));
        });
        return _this;
    }
    GroupTimeline.prototype.componentDidMount = function () {
        var dispatch = this.props.dispatch;
        var id = this.props.params.id;
        dispatch((0,_actions_timelines__WEBPACK_IMPORTED_MODULE_8__.expandGroupTimeline)(id));
        this.disconnect = dispatch((0,_actions_streaming__WEBPACK_IMPORTED_MODULE_7__.connectGroupStream)(id));
    };
    GroupTimeline.prototype.componentWillUnmount = function () {
        if (this.disconnect) {
            this.disconnect();
            this.disconnect = null;
        }
    };
    GroupTimeline.prototype.render = function () {
        var _a = this.props, columnId = _a.columnId, group = _a.group, relationships = _a.relationships, account = _a.account;
        var id = this.props.params.id;
        if (typeof group === 'undefined' || !relationships) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Column, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 69,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Spinner, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 70,
                    columnNumber: 11
                }
            }));
        }
        else if (group === false) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_components_missing_indicator__WEBPACK_IMPORTED_MODULE_10__["default"], {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 75,
                    columnNumber: 9
                }
            });
        }
        var acct = account ? account.get('acct') : '';
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 82,
                columnNumber: 7
            }
        }, relationships.get('member') && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "timeline-compose-block",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 84,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.Link, {
            className: "timeline-compose-block__avatar",
            to: "/@".concat(acct),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 85,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_components_avatar__WEBPACK_IMPORTED_MODULE_9__["default"], {
            account: account,
            size: 46,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 86,
                columnNumber: 15
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_soapbox_features_compose_containers_compose_form_container__WEBPACK_IMPORTED_MODULE_6__["default"], {
            group: group,
            shouldCondense: true,
            autoFocus: false,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 88,
                columnNumber: 13
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "group__feed",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 92,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui_components_timeline__WEBPACK_IMPORTED_MODULE_11__["default"], {
            alwaysPrepend: true,
            scrollKey: "group_timeline-".concat(columnId),
            timelineId: "group:".concat(id),
            onLoadMore: this.handleLoadMore,
            group: group,
            withGroupAdmin: relationships && relationships.get('admin'),
            emptyMessage: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_14__["default"], {
                id: "empty_column.group",
                defaultMessage: "There is nothing in this group yet. When members of this group make new posts, they will appear here.",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 100,
                    columnNumber: 27
                }
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 93,
                columnNumber: 11
            }
        })));
    };
    return GroupTimeline;
}(react__WEBPACK_IMPORTED_MODULE_2__.PureComponent)), _defineProperty(_class2, "propTypes", {
    params: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired),
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    columnId: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    hasUnread: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
    group: prop_types__WEBPACK_IMPORTED_MODULE_1___default().oneOfType([(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map), (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool)]),
    relationships: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map),
    account: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().record),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired)
}), _class2)) || _class) || _class);



/***/ })

}]);
//# sourceMappingURL=timeline-4e4ecf31ee8d492173d4.chunk.js.map