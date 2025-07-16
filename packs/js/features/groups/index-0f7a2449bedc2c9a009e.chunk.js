"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[45],{

/***/ 2286:
/*!***************************************************!*\
  !*** ./app/soapbox/features/groups/index/card.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ GroupCard; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-immutable-proptypes */ 251);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-immutable-pure-component */ 222);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var _utils_numbers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../utils/numbers */ 208);
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
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/groups/index/card.js";
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__.defineMessages)({
    members: {
        "id": "groups.card.members",
        "defaultMessage": "Members"
    },
    view: {
        "id": "groups.card.view",
        "defaultMessage": "View"
    },
    join: {
        "id": "groups.card.join",
        "defaultMessage": "Join"
    },
    role_member: {
        "id": "groups.card.roles.member",
        "defaultMessage": "You're a member"
    },
    role_admin: {
        "id": "groups.card.roles.admin",
        "defaultMessage": "You're an admin"
    }
});
var mapStateToProps = function (state, _ref) {
    var id = _ref.id;
    return {
        group: state.getIn(['groups', id]),
        relationships: state.getIn(['group_relationships', id])
    };
};
var GroupCard = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.connect)(mapStateToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(GroupCard, _super);
    function GroupCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupCard.prototype.getRole = function () {
        var _a = this.props, intl = _a.intl, relationships = _a.relationships;
        if (relationships.get('admin'))
            return intl.formatMessage(messages.role_admin);
        if (relationships.get('member'))
            return intl.formatMessage(messages.role_member);
        return null;
    };
    GroupCard.prototype.render = function () {
        var _a = this.props, intl = _a.intl, group = _a.group;
        var coverImageUrl = group.get('cover_image_url');
        var role = this.getRole();
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_7__.Link, {
            to: "/groups/".concat(group.get('id')),
            className: "group-card",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 46,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "group-card__header",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 11
            }
        }, coverImageUrl && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
            alt: "",
            src: coverImageUrl,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 65
            }
        })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "group-card__content",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 48,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "group-card__title",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 49,
                columnNumber: 13
            }
        }, group.get('title')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "group-card__meta",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 50,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 50,
                columnNumber: 47
            }
        }, (0,_utils_numbers__WEBPACK_IMPORTED_MODULE_4__.shortNumberFormat)(group.get('member_count'))), " ", intl.formatMessage(messages.members), role && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 50,
                columnNumber: 158
            }
        }, " \xB7 ", role)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "group-card__description",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 51,
                columnNumber: 13
            }
        }, group.get('description'))));
    };
    return GroupCard;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_2__["default"])), _defineProperty(_class2, "propTypes", {
    group: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_1___default().map),
    relationships: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_1___default().map)
}), _class2)) || _class) || _class);



/***/ }),

/***/ 2041:
/*!****************************************************!*\
  !*** ./app/soapbox/features/groups/index/index.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Groups; }
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-immutable-proptypes */ 251);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-pure-component */ 222);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-router-dom */ 23);
/* harmony import */ var _actions_groups__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/groups */ 226);
/* harmony import */ var _create__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../create */ 1606);
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./card */ 2286);
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
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/groups/index/index.js";
function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }











var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    heading: {
        "id": "column.groups",
        "defaultMessage": "Groups"
    },
    create: {
        "id": "groups.create",
        "defaultMessage": "Create group"
    },
    tab_featured: {
        "id": "groups.tab_featured",
        "defaultMessage": "Featured"
    },
    tab_member: {
        "id": "groups.tab_member",
        "defaultMessage": "Member"
    },
    tab_admin: {
        "id": "groups.tab_admin",
        "defaultMessage": "Manage"
    }
});
var mapStateToProps = function (state, _ref) {
    var activeTab = _ref.activeTab;
    return {
        groupIds: state.getIn(['group_lists', activeTab])
    };
};
var Groups = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.connect)(mapStateToProps), _dec(_class = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Groups, _super);
    function Groups() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Groups.prototype.componentDidMount = function () {
        this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_6__.fetchGroups)(this.props.activeTab));
    };
    Groups.prototype.componentDidUpdate = function (oldProps) {
        if (this.props.activeTab && this.props.activeTab !== oldProps.activeTab) {
            this.props.dispatch((0,_actions_groups__WEBPACK_IMPORTED_MODULE_6__.fetchGroups)(this.props.activeTab));
        }
    };
    Groups.prototype.renderHeader = function () {
        var _a = this.props, intl = _a.intl, activeTab = _a.activeTab;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "group-column-header",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 55,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "group-column-header__cta",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 56,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.Link, {
            to: "/groups/create",
            className: "button standard-small",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 56,
                columnNumber: 51
            }
        }, intl.formatMessage(messages.create))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "group-column-header__title",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 57,
                columnNumber: 9
            }
        }, intl.formatMessage(messages.heading)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "column-header__wrapper",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 59,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("h1", {
            className: "column-header",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 60,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.Link, {
            to: "/groups",
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('btn grouped', {
                'active': 'featured' === activeTab
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 61,
                columnNumber: 13
            }
        }, intl.formatMessage(messages.tab_featured)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.Link, {
            to: "/groups/browse/member",
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('btn grouped', {
                'active': 'member' === activeTab
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 65,
                columnNumber: 13
            }
        }, intl.formatMessage(messages.tab_member)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_11__.Link, {
            to: "/groups/browse/admin",
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('btn grouped', {
                'active': 'admin' === activeTab
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 69,
                columnNumber: 13
            }
        }, intl.formatMessage(messages.tab_admin)))));
    };
    Groups.prototype.render = function () {
        var _this = this;
        var _a = this.props, groupIds = _a.groupIds, showCreateForm = _a.showCreateForm;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 82,
                columnNumber: 7
            }
        }, !showCreateForm && this.renderHeader(), showCreateForm && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_create__WEBPACK_IMPORTED_MODULE_7__["default"], {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 84,
                columnNumber: 28
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "group-card-list",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 86,
                columnNumber: 9
            }
        }, groupIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement(_card__WEBPACK_IMPORTED_MODULE_8__["default"], {
            key: id,
            id: id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 87,
                columnNumber: 31
            }
        }); })));
    };
    return Groups;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__["default"])), _defineProperty(_class2, "propTypes", {
    params: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired),
    activeTab: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
    showCreateForm: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
    dispatch: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    groups: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map),
    groupIds: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().list),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().object.isRequired)
}), _class2)) || _class) || _class);



/***/ })

}]);
//# sourceMappingURL=index-0f7a2449bedc2c9a009e.chunk.js.map