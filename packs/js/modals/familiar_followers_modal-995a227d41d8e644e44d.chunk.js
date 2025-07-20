"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[207],{

/***/ 2116:
/*!*************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/familiar_followers_modal.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 835);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/containers/account_container */ 127);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/selectors */ 30);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/familiar_followers_modal.tsx";








var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__.makeGetAccount)();
var FamiliarFollowersModal = function (_ref) {
    var accountId = _ref.accountId, onClose = _ref.onClose;
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return getAccount(state, accountId); });
    var familiarFollowerIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var _state$user_lists$fam;
        return ((_state$user_lists$fam = state.user_lists.familiar_followers.get(accountId)) === null || _state$user_lists$fam === void 0 ? void 0 : _state$user_lists$fam.items) || (0,immutable__WEBPACK_IMPORTED_MODULE_6__.OrderedSet)();
    });
    var onClickClose = function () {
        onClose('FAMILIAR_FOLLOWERS');
    };
    var body;
    if (!account || !familiarFollowerIds) {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
                columnNumber: 12
            }
        });
    }
    else {
        var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "account.familiar_followers.empty",
            defaultMessage: "No one you know follows {name}.",
            values: {
                name: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
                    dangerouslySetInnerHTML: {
                        __html: account.display_name_html
                    },
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 31,
                        columnNumber: 147
                    }
                })
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 31,
                columnNumber: 26
            }
        });
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_1__["default"], {
            scrollKey: "familiar_followers",
            emptyMessage: emptyMessage,
            itemClassName: "pb-3",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 34,
                columnNumber: 7
            }
        }, familiarFollowerIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__["default"], {
            key: id,
            id: id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 40,
                columnNumber: 11
            }
        }); }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "column.familiar_followers",
            defaultMessage: "People you know following {name}",
            values: {
                name: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
                    dangerouslySetInnerHTML: {
                        __html: (account === null || account === void 0 ? void 0 : account.display_name_html) || ''
                    },
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 48,
                        columnNumber: 129
                    }
                })
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 48,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 5
        }
    }, body);
};
/* harmony default export */ __webpack_exports__["default"] = (FamiliarFollowersModal);


/***/ })

}]);
//# sourceMappingURL=familiar_followers_modal-995a227d41d8e644e44d.chunk.js.map