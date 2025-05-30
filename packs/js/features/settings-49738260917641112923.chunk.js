"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[67],{

/***/ 1822:
/*!*************************************************!*\
  !*** ./app/soapbox/features/settings/index.tsx ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/mfa */ 862);
/* harmony import */ var soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/list */ 864);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_config_db__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/utils/config_db */ 274);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/utils/features */ 19);
/* harmony import */ var _preferences__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../preferences */ 612);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/settings/index.tsx";











var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    settings: {
        "id": "settings.settings",
        "defaultMessage": "Settings"
    },
    profile: {
        "id": "settings.profile",
        "defaultMessage": "Profile"
    },
    security: {
        "id": "settings.security",
        "defaultMessage": "Security"
    },
    preferences: {
        "id": "settings.preferences",
        "defaultMessage": "Preferences"
    },
    editProfile: {
        "id": "settings.edit_profile",
        "defaultMessage": "Edit Profile"
    },
    changeEmail: {
        "id": "settings.change_email",
        "defaultMessage": "Change Email"
    },
    changePassword: {
        "id": "settings.change_password",
        "defaultMessage": "Change Password"
    },
    configureMfa: {
        "id": "settings.configure_mfa",
        "defaultMessage": "Configure MFA"
    },
    sessions: {
        "id": "settings.sessions",
        "defaultMessage": "Active sessions"
    },
    deleteAccount: {
        "id": "settings.delete_account",
        "defaultMessage": "Delete Account"
    },
    accountMigration: {
        "id": "settings.account_migration",
        "defaultMessage": "Move Account"
    },
    accountAliases: {
        "id": "navigation_bar.account_aliases",
        "defaultMessage": "Account aliases"
    },
    other: {
        "id": "settings.other",
        "defaultMessage": "Other options"
    },
    mfaEnabled: {
        "id": "mfa.enabled",
        "defaultMessage": "Enabled"
    },
    mfaDisabled: {
        "id": "mfa.disabled",
        "defaultMessage": "Disabled"
    },
    content: {
        "id": "settings.content",
        "defaultMessage": "Content"
    },
    blocks: {
        "id": "navigation_bar.blocks",
        "defaultMessage": "Blocked users"
    },
    domainBlocks: {
        "id": "navigation_bar.domain_blocks",
        "defaultMessage": "Hidden domains"
    },
    mutes: {
        "id": "navigation_bar.mutes",
        "defaultMessage": "Muted users"
    },
    filters: {
        "id": "navigation_bar.filters",
        "defaultMessage": "Muted words"
    },
    backups: {
        "id": "column.backups",
        "defaultMessage": "Backups"
    },
    importData: {
        "id": "navigation_bar.import_data",
        "defaultMessage": "Import data"
    },
    exportData: {
        "id": "column.export_data",
        "defaultMessage": "Export data"
    }
});
/** User settings page. */
var Settings = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.useHistory)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__["default"])();
    var mfa = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.security.get('mfa'); });
    var configuration = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.admin.get('configs'); });
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_7__.getFeatures)(state.instance); });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useOwnAccount)();
    var navigateToChangeEmail = function () { return history.push('/settings/email'); };
    var navigateToChangePassword = function () { return history.push('/settings/password'); };
    var navigateToMfa = function () { return history.push('/settings/mfa'); };
    var navigateToSessions = function () { return history.push('/settings/tokens'); };
    var navigateToEditProfile = function () { return history.push('/settings/profile'); };
    var navigateToDeleteAccount = function () { return history.push('/settings/account'); };
    var navigateToMoveAccount = function () { return history.push('/settings/migration'); };
    var navigateToAliases = function () { return history.push('/settings/aliases'); };
    var navigateToBackups = function () { return history.push('/settings/backups'); };
    var navigateToImportData = function () { return history.push('/settings/import'); };
    var navigateToExportData = function () { return history.push('/settings/export'); };
    var navigateToBlocks = function () { return history.push('/blocks'); };
    var navigateToMutes = function () { return history.push('/mutes'); };
    var navigateToDomainBlocks = function () { return history.push('/domain_blocks'); };
    var navigateToFilters = function () { return history.push('/filters'); };
    var isMfaEnabled = mfa.getIn(['settings', 'totp']);
    var isLdapEnabled = react__WEBPACK_IMPORTED_MODULE_0__.useMemo(function () {
        var _ConfigDB$find, _ConfigDB$find$get$fi;
        return (_ConfigDB$find = soapbox_utils_config_db__WEBPACK_IMPORTED_MODULE_6__.ConfigDB.find(configuration, ':pleroma', ':ldap')) === null || _ConfigDB$find === void 0 ? void 0 : (_ConfigDB$find$get$fi = _ConfigDB$find.get('value').find(function (e) { return e.get('tuple').get(0) === ':enabled'; })) === null || _ConfigDB$find$get$fi === void 0 ? void 0 : _ConfigDB$find$get$fi.getIn(['tuple', 1]);
    }, [configuration]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_mfa__WEBPACK_IMPORTED_MODULE_2__.fetchMfa)());
    }, [dispatch]);
    if (!account)
        return null;
    var displayName = account.display_name || account.username;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Column, {
        label: intl.formatMessage(messages.settings),
        transparent: true,
        withHeader: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Card, {
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardTitle, {
        title: intl.formatMessage(messages.profile),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.editProfile),
        onClick: navigateToEditProfile,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 15
        }
    }, displayName)))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardTitle, {
        title: intl.formatMessage(messages.content),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 99,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.blocks),
        onClick: navigateToBlocks,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.mutes),
        onClick: navigateToMutes,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 13
        }
    }), features.federating && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.domainBlocks),
        onClick: navigateToDomainBlocks,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 38
        }
    }), features.filters && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.filters),
        onClick: navigateToFilters,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 107,
            columnNumber: 35
        }
    }))), (features.security || features.sessions) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardTitle, {
        title: intl.formatMessage(messages.security),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 115,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 119,
            columnNumber: 15
        }
    }, features.security && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.changeEmail),
        onClick: navigateToChangeEmail,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 21
        }
    }), !isLdapEnabled && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.changePassword),
        onClick: navigateToChangePassword,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 25
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.configureMfa),
        onClick: navigateToMfa,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 21
        }
    }, isMfaEnabled ? intl.formatMessage(messages.mfaEnabled) : intl.formatMessage(messages.mfaDisabled))), features.sessions && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.sessions),
        onClick: navigateToSessions,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 136,
            columnNumber: 19
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 143,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardTitle, {
        title: intl.formatMessage(messages.preferences),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 144,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_preferences__WEBPACK_IMPORTED_MODULE_8__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 148,
            columnNumber: 11
        }
    })), (features.security || features.accountAliases) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 153,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardTitle, {
        title: intl.formatMessage(messages.other),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 154,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 157,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 158,
            columnNumber: 15
        }
    }, features.importData && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.importData),
        onClick: navigateToImportData,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 160,
            columnNumber: 19
        }
    }), features.exportData && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.exportData),
        onClick: navigateToExportData,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 164,
            columnNumber: 19
        }
    }), features.backups && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.backups),
        onClick: navigateToBackups,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 168,
            columnNumber: 19
        }
    }), features.federating && (features.accountMoving ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.accountMigration),
        onClick: navigateToMoveAccount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 172,
            columnNumber: 19
        }
    }) : features.accountAliases && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.accountAliases),
        onClick: navigateToAliases,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 174,
            columnNumber: 19
        }
    })), features.security && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_3__.ListItem, {
        label: intl.formatMessage(messages.deleteAccount),
        onClick: navigateToDeleteAccount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 178,
            columnNumber: 19
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (Settings);


/***/ }),

/***/ 1823:
/*!*********************************************************!*\
  !*** ./app/soapbox/features/settings/media_display.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_components_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/list */ 864);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/forms */ 860);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/settings/media_display.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    mediaDisplay: {
        "id": "preferences.fields.media_display_label",
        "defaultMessage": "Media display"
    },
    display_media_default: {
        "id": "preferences.fields.display_media.default",
        "defaultMessage": "Hide media marked as sensitive"
    },
    display_media_hide_all: {
        "id": "preferences.fields.display_media.hide_all",
        "defaultMessage": "Always hide media"
    },
    display_media_show_all: {
        "id": "preferences.fields.display_media.show_all",
        "defaultMessage": "Always show media"
    }
});
var MediaDisplay = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var settings = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__.getSettings)(state); });
    var displayMediaOptions = {
        default: intl.formatMessage(messages.display_media_default),
        hide_all: intl.formatMessage(messages.display_media_hide_all),
        show_all: intl.formatMessage(messages.display_media_show_all)
    };
    var onSelectChange = function (path) {
        return function (e) {
            dispatch((0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_1__.changeSettingImmediate)(path, e.target.value));
        };
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Card, {
        variant: "rounded",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardHeader, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardTitle, {
        title: intl.formatMessage(messages.mediaDisplay),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_4__.SimpleForm, {
        className: "p-0 space-y-3",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_2__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_list__WEBPACK_IMPORTED_MODULE_2__.ListItem, {
        label: intl.formatMessage(messages.mediaDisplay),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_4__.SelectDropdown, {
        items: displayMediaOptions,
        defaultValue: settings.get('displayMedia'),
        onChange: onSelectChange(['displayMedia']),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 15
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (MediaDisplay);


/***/ })

}]);
//# sourceMappingURL=settings-49738260917641112923.chunk.js.map