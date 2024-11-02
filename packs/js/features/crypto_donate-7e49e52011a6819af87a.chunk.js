(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[26],Array(1330).concat([
/* 1330 */
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/components/crypto_address.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/features/forms */ 626);
/* harmony import */ var _utils_block_explorer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/block_explorer */ 1827);
/* harmony import */ var _utils_coin_db__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/coin_db */ 1828);
/* harmony import */ var _crypto_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./crypto_icon */ 1829);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/crypto_donate/components/crypto_address.tsx";








var CryptoAddress = function (props) {
    var address = props.address, ticker = props.ticker, note = props.note;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.useDispatch)();
    var handleModalClick = function (e) {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('CRYPTO_DONATE', props));
        e.preventDefault();
    };
    var title = (0,_utils_coin_db__WEBPACK_IMPORTED_MODULE_6__.getTitle)(ticker);
    var explorerUrl = (0,_utils_block_explorer__WEBPACK_IMPORTED_MODULE_5__.getExplorerUrl)(ticker, address);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        alignItems: "center",
        className: "mb-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_crypto_icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
        className: "flex items-start justify-center w-6 mr-2.5",
        ticker: ticker,
        title: title,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 9
        }
    }, title || ticker.toUpperCase()), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.HStack, {
        alignItems: "center",
        className: "ml-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        className: "text-gray-500 ml-1",
        href: "#",
        onClick: handleModalClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Icon, {
        src: __webpack_require__(/*! @tabler/icons/qrcode.svg */ 2404),
        size: 20,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 13
        }
    })), explorerUrl && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        className: "text-gray-500 ml-1",
        href: explorerUrl,
        target: "_blank",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Icon, {
        src: __webpack_require__(/*! @tabler/icons/external-link.svg */ 448),
        size: 20,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 15
        }
    })))), note && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    }, note), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "crypto-address__address simple_form",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_4__.CopyableInput, {
        value: address,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (CryptoAddress);


/***/ }),
/* 1331 */,
/* 1332 */,
/* 1333 */,
/* 1334 */,
/* 1335 */,
/* 1336 */,
/* 1337 */,
/* 1338 */,
/* 1339 */,
/* 1340 */,
/* 1341 */,
/* 1342 */,
/* 1343 */,
/* 1344 */,
/* 1345 */,
/* 1346 */,
/* 1347 */,
/* 1348 */,
/* 1349 */,
/* 1350 */,
/* 1351 */,
/* 1352 */,
/* 1353 */,
/* 1354 */,
/* 1355 */,
/* 1356 */,
/* 1357 */,
/* 1358 */,
/* 1359 */,
/* 1360 */,
/* 1361 */,
/* 1362 */,
/* 1363 */,
/* 1364 */,
/* 1365 */,
/* 1366 */,
/* 1367 */,
/* 1368 */,
/* 1369 */,
/* 1370 */,
/* 1371 */,
/* 1372 */,
/* 1373 */,
/* 1374 */,
/* 1375 */,
/* 1376 */,
/* 1377 */,
/* 1378 */,
/* 1379 */,
/* 1380 */,
/* 1381 */,
/* 1382 */,
/* 1383 */,
/* 1384 */,
/* 1385 */,
/* 1386 */,
/* 1387 */,
/* 1388 */,
/* 1389 */,
/* 1390 */,
/* 1391 */,
/* 1392 */,
/* 1393 */,
/* 1394 */,
/* 1395 */,
/* 1396 */,
/* 1397 */,
/* 1398 */,
/* 1399 */,
/* 1400 */,
/* 1401 */,
/* 1402 */,
/* 1403 */,
/* 1404 */,
/* 1405 */,
/* 1406 */,
/* 1407 */,
/* 1408 */,
/* 1409 */,
/* 1410 */,
/* 1411 */,
/* 1412 */,
/* 1413 */,
/* 1414 */,
/* 1415 */,
/* 1416 */,
/* 1417 */,
/* 1418 */,
/* 1419 */,
/* 1420 */,
/* 1421 */,
/* 1422 */,
/* 1423 */,
/* 1424 */,
/* 1425 */,
/* 1426 */,
/* 1427 */,
/* 1428 */,
/* 1429 */,
/* 1430 */,
/* 1431 */,
/* 1432 */,
/* 1433 */,
/* 1434 */,
/* 1435 */,
/* 1436 */,
/* 1437 */,
/* 1438 */,
/* 1439 */,
/* 1440 */,
/* 1441 */,
/* 1442 */,
/* 1443 */,
/* 1444 */,
/* 1445 */,
/* 1446 */,
/* 1447 */,
/* 1448 */,
/* 1449 */,
/* 1450 */,
/* 1451 */,
/* 1452 */,
/* 1453 */,
/* 1454 */,
/* 1455 */,
/* 1456 */,
/* 1457 */,
/* 1458 */,
/* 1459 */,
/* 1460 */,
/* 1461 */,
/* 1462 */,
/* 1463 */,
/* 1464 */,
/* 1465 */,
/* 1466 */,
/* 1467 */,
/* 1468 */,
/* 1469 */,
/* 1470 */,
/* 1471 */,
/* 1472 */,
/* 1473 */,
/* 1474 */,
/* 1475 */,
/* 1476 */,
/* 1477 */,
/* 1478 */,
/* 1479 */,
/* 1480 */,
/* 1481 */,
/* 1482 */,
/* 1483 */,
/* 1484 */,
/* 1485 */,
/* 1486 */,
/* 1487 */,
/* 1488 */,
/* 1489 */,
/* 1490 */,
/* 1491 */,
/* 1492 */,
/* 1493 */,
/* 1494 */,
/* 1495 */,
/* 1496 */,
/* 1497 */,
/* 1498 */,
/* 1499 */,
/* 1500 */,
/* 1501 */,
/* 1502 */,
/* 1503 */,
/* 1504 */,
/* 1505 */,
/* 1506 */,
/* 1507 */,
/* 1508 */,
/* 1509 */,
/* 1510 */,
/* 1511 */,
/* 1512 */,
/* 1513 */,
/* 1514 */,
/* 1515 */,
/* 1516 */,
/* 1517 */,
/* 1518 */,
/* 1519 */,
/* 1520 */,
/* 1521 */,
/* 1522 */,
/* 1523 */,
/* 1524 */,
/* 1525 */,
/* 1526 */,
/* 1527 */,
/* 1528 */,
/* 1529 */,
/* 1530 */,
/* 1531 */,
/* 1532 */,
/* 1533 */,
/* 1534 */,
/* 1535 */,
/* 1536 */,
/* 1537 */,
/* 1538 */,
/* 1539 */,
/* 1540 */,
/* 1541 */,
/* 1542 */,
/* 1543 */,
/* 1544 */,
/* 1545 */,
/* 1546 */,
/* 1547 */,
/* 1548 */,
/* 1549 */,
/* 1550 */,
/* 1551 */,
/* 1552 */,
/* 1553 */,
/* 1554 */,
/* 1555 */,
/* 1556 */,
/* 1557 */,
/* 1558 */,
/* 1559 */,
/* 1560 */
/*!******************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/index.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_ui_components_accordion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/ui/components/accordion */ 1683);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _components_site_wallet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/site_wallet */ 1826);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/crypto_donate/index.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    heading: {
        "id": "column.crypto_donate",
        "defaultMessage": "Donate Cryptocurrency"
    }
});
var CryptoDonate = function () {
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true), explanationBoxExpanded = _a[0], toggleExplanationBox = _a[1];
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.instance.title; });
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Column, {
        label: intl.formatMessage(messages.heading),
        withHeader: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 5,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_ui_components_accordion__WEBPACK_IMPORTED_MODULE_3__["default"], {
        headline: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "crypto_donate.explanation_box.title",
            defaultMessage: "Sending cryptocurrency donations",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 23,
                columnNumber: 21
            }
        }),
        expanded: explanationBoxExpanded,
        onToggle: toggleExplanationBox,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "crypto_donate.explanation_box.message",
        defaultMessage: "{siteTitle} accepts cryptocurrency donations. You may send a donation to any of the addresses below. Thank you for your support!",
        values: {
            siteTitle: siteTitle
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_components_site_wallet__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (CryptoDonate);


/***/ }),
/* 1561 */
/*!*******************************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/components/crypto_donate_panel.tsx ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _site_wallet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./site_wallet */ 1826);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/crypto_donate/components/crypto_donate_panel.tsx";






var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    actionTitle: {
        "id": "crypto_donate_panel.actions.view",
        "defaultMessage": "Click to see {count} {count, plural, one {wallet} other {wallets}}"
    }
});
var CryptoDonatePanel = function (_ref) {
    var _a = _ref.limit, limit = _a === void 0 ? 3 : _a;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useHistory)();
    var addresses = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSoapboxConfig)().get('cryptoAddresses');
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance.title; });
    if (limit === 0 || addresses.size === 0) {
        return null;
    }
    var handleAction = function () {
        history.push('/donate/crypto');
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "crypto_donate_panel.heading",
            defaultMessage: "Donate Cryptocurrency",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
                columnNumber: 14
            }
        }),
        onActionClick: handleAction,
        actionTitle: intl.formatMessage(messages.actionTitle, {
            count: addresses.size
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: "crypto_donate_panel.intro.message",
        defaultMessage: "{siteTitle} accepts cryptocurrency donations to fund our service. Thank you for your support!",
        values: {
            siteTitle: siteTitle
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_site_wallet__WEBPACK_IMPORTED_MODULE_3__["default"], {
        limit: limit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (CryptoDonatePanel);


/***/ }),
/* 1562 */
/*!********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/crypto_donate_modal.tsx ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_features_crypto_donate_components_detailed_crypto_address__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/features/crypto_donate/components/detailed_crypto_address */ 2405);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/crypto_donate_modal.tsx";
var _excluded = ["onClose"];
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null)
    return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
            continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
            continue;
        target[key] = source[key];
    }
} return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null)
    return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
        continue;
    target[key] = source[key];
} return target; }



var CryptoDonateModal = function (_ref) {
    var onClose = _ref.onClose, props = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        onClose: onClose,
        width: "xs",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "crypto-donate-modal",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_crypto_donate_components_detailed_crypto_address__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, props, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 9
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (CryptoDonateModal);


/***/ }),
/* 1563 */,
/* 1564 */,
/* 1565 */,
/* 1566 */,
/* 1567 */,
/* 1568 */,
/* 1569 */,
/* 1570 */,
/* 1571 */,
/* 1572 */,
/* 1573 */,
/* 1574 */,
/* 1575 */,
/* 1576 */,
/* 1577 */,
/* 1578 */,
/* 1579 */,
/* 1580 */,
/* 1581 */,
/* 1582 */,
/* 1583 */,
/* 1584 */,
/* 1585 */,
/* 1586 */,
/* 1587 */,
/* 1588 */,
/* 1589 */,
/* 1590 */,
/* 1591 */,
/* 1592 */,
/* 1593 */,
/* 1594 */,
/* 1595 */,
/* 1596 */,
/* 1597 */,
/* 1598 */,
/* 1599 */,
/* 1600 */,
/* 1601 */,
/* 1602 */,
/* 1603 */,
/* 1604 */,
/* 1605 */,
/* 1606 */,
/* 1607 */,
/* 1608 */,
/* 1609 */,
/* 1610 */,
/* 1611 */,
/* 1612 */,
/* 1613 */,
/* 1614 */,
/* 1615 */,
/* 1616 */,
/* 1617 */,
/* 1618 */,
/* 1619 */,
/* 1620 */,
/* 1621 */,
/* 1622 */,
/* 1623 */
/*!*********************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/manifest.json ***!
  \*********************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('[{"symbol":"$PAC","name":"PACcoin","color":"#f5eb16"},{"symbol":"0XBTC","name":"0xBitcoin","color":"#ff914d"},{"symbol":"2GIVE","name":"2Give","color":"#f1cb60"},{"symbol":"AAVE","name":"AAVE","color":"#2ebac6"},{"symbol":"ABT","name":"Arcblock","color":"#3effff"},{"symbol":"ACT","name":"Achain","color":"#767dff"},{"symbol":"ACTN","name":"Action Coin","color":"#ffffff"},{"symbol":"ADA","name":"Cardano","color":"#0d1e30"},{"symbol":"ADD","name":"ADD Token","color":"#fec807"},{"symbol":"ADX","name":"AdEx","color":"#1b75bc"},{"symbol":"AE","name":"Aeternity","color":"#de3f6b"},{"symbol":"AEON","name":"Aeon","color":"#134451"},{"symbol":"AEUR","name":"Augmint Euro Token","color":"#051d2d"},{"symbol":"AGI","name":"SingularityNET","color":"#6916ff"},{"symbol":"AGRS","name":"Agoras Tauchain","color":"#f49e00"},{"symbol":"AION","name":"Aion","color":"#00bfec"},{"symbol":"ALGO","name":"Algorand","color":"#000000"},{"symbol":"AMB","name":"Ambrosus","color":"#3c5be0"},{"symbol":"AMP","name":"HyperSpace (Synereo)","color":"#2daee4"},{"symbol":"AMPL","name":"Ampleforth","color":"#000000"},{"symbol":"ANKR","name":"Ankr Network","color":"#2e6bf6"},{"symbol":"ANT","name":"Aragon","color":"#2cd3e1"},{"symbol":"APPC","name":"AppCoins","color":"#fd875e"},{"symbol":"ARDR","name":"Ardor","color":"#3c87c7"},{"symbol":"ARG","name":"Argentum","color":"#a71435"},{"symbol":"ARK","name":"Ark","color":"#f70000"},{"symbol":"ARN","name":"Aeron","color":"#0092b5"},{"symbol":"ARNX","name":"Aeron","color":"#436697"},{"symbol":"ARY","name":"Block Array","color":"#343434"},{"symbol":"AST","name":"AirSwap","color":"#0061ff"},{"symbol":"ATM","name":"ATMChain","color":"#346fce"},{"symbol":"ATOM","name":"Cosmos","color":"#2e3148"},{"symbol":"AUDR","name":"AUDRamp","color":"#34318a"},{"symbol":"AUTO","name":"Cube","color":"#fab431"},{"symbol":"AYWA","name":"Aywa","color":"#3355b5"},{"symbol":"BAB","name":"Bitcoin Cash ABC","color":"#f19f13"},{"symbol":"BAL","name":"Balancer","color":"#1e1e1e"},{"symbol":"BAND","name":"Band Protocol","color":"#516aff"},{"symbol":"BAT","name":"Basic Attention Token","color":"#ff5000"},{"symbol":"BAY","name":"BitBay","color":"#6356ab"},{"symbol":"BCBC","name":"BCBC","color":"#004ab5"},{"symbol":"BCC","name":"BCC","color":"#f7931c"},{"symbol":"BCD","name":"Bitcoin Diamond","color":"#fcc339"},{"symbol":"BCH","name":"Bitcoin Cash","color":"#8dc351"},{"symbol":"BCIO","name":"Blockchain.io","color":"#3f43ad"},{"symbol":"BCN","name":"Bytecoin","color":"#f04086"},{"symbol":"BCO","name":"BananaCoin","color":"#2c76b7"},{"symbol":"BCPT","name":"BlockMason Credit Protocol","color":"#404040"},{"symbol":"BDL","name":"Bitdeal","color":"#e54c40"},{"symbol":"BEAM","name":"Beam","color":"#0b76ff"},{"symbol":"BELA","name":"Belacoin","color":"#13a0f6"},{"symbol":"BIX","name":"Bibox Token","color":"#000000"},{"symbol":"BLCN","name":"BLCN","color":"#2aabe4"},{"symbol":"BLK","name":"BlackCoin","color":"#181818"},{"symbol":"BLOCK","name":"Blocknet","color":"#101341"},{"symbol":"BLZ","name":"Blazecoin","color":"#18578c"},{"symbol":"BNB","name":"Binance Coin","color":"#f3ba2f"},{"symbol":"BNT","name":"Bancor Network Token","color":"#000d2b"},{"symbol":"BNTY","name":"Bounty0x","color":"#fd7a3d"},{"symbol":"BOOTY","name":"Booty","color":"#00b4f4"},{"symbol":"BOS","name":"BOScoin","color":"#00a8d6"},{"symbol":"BPT","name":"Blockport","color":"#0f63d8"},{"symbol":"BQ","name":"bitqy","color":"#1d1d1d"},{"symbol":"BRD","name":"Bread","color":"#fe5d86"},{"symbol":"BSD","name":"BitSend","color":"#000000"},{"symbol":"BSV","name":"BitcoinSV","color":"#eab304"},{"symbol":"BTC","name":"Bitcoin","color":"#f7931a"},{"symbol":"BTCD","name":"BitcoinDark","color":"#ff6600"},{"symbol":"BTCH","name":"Bitcoin Hush","color":"#4700c2"},{"symbol":"BTCP","name":"Bitcoin Private","color":"#272d63"},{"symbol":"BTCZ","name":"BitcoinZ","color":"#f8c24a"},{"symbol":"BTDX","name":"Bitcloud","color":"#00aaff"},{"symbol":"BTG","name":"Bitcoin Gold","color":"#eba809"},{"symbol":"BTM","name":"Bytom","color":"#504c4c"},{"symbol":"BTS","name":"BitShares","color":"#35baeb"},{"symbol":"BTT","name":"BitTorrent","color":"#000000"},{"symbol":"BTX","name":"Bitcore","color":"#fb2ea3"},{"symbol":"BURST","name":"Burst","color":"#2d2d2d"},{"symbol":"BZE","name":"BZEdge","color":"#00aeef"},{"symbol":"CALL","name":"Capital","color":"#fbb413"},{"symbol":"CC","name":"CoinCollect","color":"#36b0f3"},{"symbol":"CDN","name":"Canada eCoin","color":"#f70808"},{"symbol":"CDT","name":"Blox","color":"#272731"},{"symbol":"CHAIN","name":"Chainmakers","color":"#00aced"},{"symbol":"CHAT","name":"ChatCoin","color":"#1c98f7"},{"symbol":"CHIPS","name":"CHIPS","color":"#598182"},{"symbol":"CHSB","name":"SwissBorg","color":"#01c38d"},{"symbol":"CIX","name":"Cryptonetix","color":"#0576b4"},{"symbol":"CLAM","name":"Clams","color":"#20c5d3"},{"symbol":"CLOAK","name":"Cloakcoin","color":"#ff3a00"},{"symbol":"CMM","name":"Commercium","color":"#2fd2e5"},{"symbol":"CMT","name":"Comet","color":"#c1a05c"},{"symbol":"CND","name":"Cindicator","color":"#383939"},{"symbol":"CNX","name":"Cryptonex","color":"#4c6bae"},{"symbol":"CNY","name":"CNY","color":"#ff4314"},{"symbol":"COB","name":"Cobinhood","color":"#13bf99"},{"symbol":"COLX","name":"ColossusXT","color":"#77c3b0"},{"symbol":"COMP","name":"Compound","color":"#00d395"},{"symbol":"COQUI","name":"COQUI Cash","color":"#71c800"},{"symbol":"CRED","name":"Verify","color":"#37e8a3"},{"symbol":"CRPT","name":"Crypterium","color":"#00bdcd"},{"symbol":"CRV","name":"Curve DAO Token","color":"#40649f"},{"symbol":"CRW","name":"Crown","color":"#0f1529"},{"symbol":"CS","name":"CREDITS","color":"#262626"},{"symbol":"CTR","name":"Centra","color":"#fdde6c"},{"symbol":"CTXC","name":"Cortex","color":"#000000"},{"symbol":"CVC","name":"Civic","color":"#3ab03e"},{"symbol":"D","name":"Denarius","color":"#b8b8b8"},{"symbol":"DAI","name":"Dai","color":"#f4b731"},{"symbol":"DASH","name":"Dash","color":"#008ce7"},{"symbol":"DASH","name":"Dash","color":"#008ce7"},{"symbol":"DAT","name":"Datum","color":"#2d9cdb"},{"symbol":"DATA","name":"Streamr DATAcoin","color":"#e9570f"},{"symbol":"DBC","name":"DeepBrain Chain","color":"#5bc1d4"},{"symbol":"DCN","name":"Dentacoin","color":"#136485"},{"symbol":"DCR","name":"Decred","color":"#2ed6a1"},{"symbol":"DEEZ","name":"DeezNuts","color":"#939393"},{"symbol":"DENT","name":"Dent","color":"#666666"},{"symbol":"DEW","name":"DEW","color":"#fec907"},{"symbol":"DGB","name":"DigiByte","color":"#006ad2"},{"symbol":"DGD","name":"DigixDAO","color":"#f4d029"},{"symbol":"DLT","name":"Agrello","color":"#f4ae95"},{"symbol":"DNT","name":"district0x","color":"#2c398f"},{"symbol":"DOCK","name":"Dock","color":"#786dbc"},{"symbol":"DOGE","name":"Dogecoin","color":"#c3a634"},{"symbol":"DOT","name":"Polkadot","color":"#e6007a"},{"symbol":"DRGN","name":"Dragonchain","color":"#c91111"},{"symbol":"DROP","name":"Dropil","color":"#242d3d"},{"symbol":"DTA","name":"DATA","color":"#74d269"},{"symbol":"DTH","name":"Dether","color":"#3c80f1"},{"symbol":"DTR","name":"Dynamic Trading Rights","color":"#121747"},{"symbol":"EBST","name":"eBoost","color":"#1693d4"},{"symbol":"ECA","name":"Electra","color":"#aa15dd"},{"symbol":"EDG","name":"Edgeless","color":"#2b1544"},{"symbol":"EDO","name":"Eidoo","color":"#242424"},{"symbol":"EDOGE","name":"EtherDoge","color":"#0facf3"},{"symbol":"ELA","name":"Elastos","color":"#3fbadf"},{"symbol":"ELEC","name":"Electrify.Asia","color":"#ff9900"},{"symbol":"ELF","name":"aelf","color":"#2b5ebb"},{"symbol":"ELIX","name":"Elixir","color":"#00aded"},{"symbol":"ELLA","name":"Ellaism","color":"#396a28"},{"symbol":"EMB","name":"Emblem","color":"#f6c054"},{"symbol":"EMC","name":"EmerCoin","color":"#b49ffc"},{"symbol":"EMC2","name":"Einsteinium","color":"#00ccff"},{"symbol":"ENG","name":"Enigma","color":"#2f2f2f"},{"symbol":"ENJ","name":"Enjin Coin","color":"#624dbf"},{"symbol":"ENTRP","name":"Hut34 Entropy","color":"#fa5836"},{"symbol":"EON","name":"EOS Network","color":"#443f54"},{"symbol":"EOP","name":"EOP","color":"#35a7df"},{"symbol":"EOS","name":"EOS","color":"#000000"},{"symbol":"EQLI","name":"Equaliser","color":"#c9a35e"},{"symbol":"EQUA","name":"EQUA","color":"#f68922"},{"symbol":"ETC","name":"Ethereum Classic","color":"#328332"},{"symbol":"ETH","name":"Ethereum","color":"#627eea"},{"symbol":"ETHOS","name":"Ethos","color":"#00ffba"},{"symbol":"ETN","name":"Electroneum","color":"#23bee2"},{"symbol":"ETP","name":"Metaverse ETP","color":"#00a5ff"},{"symbol":"EUR","name":"EUR","color":"#0f8ff8"},{"symbol":"EVX","name":"Everex","color":"#044aac"},{"symbol":"EXMO","name":"EXMO","color":"#347ffb"},{"symbol":"EXP","name":"Expanse","color":"#ffaa5c"},{"symbol":"FAIR","name":"Faircoin","color":"#c99705"},{"symbol":"FCT","name":"Factom","color":"#417ba4"},{"symbol":"FIL","name":"Filecoin [IOU]","color":"#42c1ca"},{"symbol":"FJC","name":"Fujicoin","color":"#00afec"},{"symbol":"FLDC","name":"Foldingcoin","color":"#c40e09"},{"symbol":"FLO","name":"FLO","color":"#2080a2"},{"symbol":"FLUX","name":"Flux","color":"#2b61d1"},{"symbol":"FSN","name":"FUSION","color":"#1d9ad7"},{"symbol":"FTC","name":"Feathercoin","color":"#27323a"},{"symbol":"FUEL","name":"Etherparty","color":"#4096d0"},{"symbol":"FUN","name":"FunFair","color":"#ed1968"},{"symbol":"GAME","name":"GameCredits","color":"#2d475b"},{"symbol":"GAS","name":"Gas","color":"#58bf00"},{"symbol":"GBP","name":"GBP","color":"#bc3fe0"},{"symbol":"GBX","name":"Globitex","color":"#1666af"},{"symbol":"GBYTE","name":"Obyte","color":"#302c2c"},{"symbol":"GENERIC","name":"GENERIC","color":"#efb914"},{"symbol":"GIN","name":"GINcoin","color":"#008dde"},{"symbol":"GLXT","name":"GLX Token","color":"#005396"},{"symbol":"GMR","name":"Gimmer","color":"#372d2c"},{"symbol":"GNO","name":"Gnosis","color":"#00a6c4"},{"symbol":"GNT","name":"Golem","color":"#001d57"},{"symbol":"GOLD","name":"Dragonereum Gold","color":"#f1b32b"},{"symbol":"GRC","name":"Gridcoin","color":"#5411b3"},{"symbol":"GRIN","name":"Grin","color":"#fff300"},{"symbol":"GRS","name":"Groestlcoin","color":"#377e96"},{"symbol":"GRT","name":"The Graph","color":"#5942cc"},{"symbol":"GSC","name":"Global Social Chain","color":"#ff0060"},{"symbol":"GTO","name":"Gifto","color":"#7f27ff"},{"symbol":"GUP","name":"Guppy","color":"#37dcd8"},{"symbol":"GUSD","name":"Gemini dollar","color":"#00dcfa"},{"symbol":"GVT","name":"Genesis Vision","color":"#16b9ad"},{"symbol":"GXS","name":"GXChain","color":"#35a5f3"},{"symbol":"GZR","name":"Gizer","color":"#56c9e9"},{"symbol":"HIGHT","name":"Highcoin","color":"#117fc0"},{"symbol":"HNS","name":"Handshake","color":"#000000"},{"symbol":"HODL","name":"HOdlcoin","color":"#d59143"},{"symbol":"HOT","name":"Holo","color":"#8834ff"},{"symbol":"HPB","name":"High Performance Blockchain","color":"#1591ca"},{"symbol":"HSR","name":"HShare","color":"#56428e"},{"symbol":"HT","name":"HOTTO","color":"#2a3069"},{"symbol":"HTML","name":"HTMLCOIN","color":"#cfa967"},{"symbol":"HUC","name":"Huntercoin","color":"#ffc018"},{"symbol":"HUSD","name":"HUSD","color":"#005ffa"},{"symbol":"HUSH","name":"Hush","color":"#292929"},{"symbol":"ICN","name":"Iconomi","color":"#4c6f8c"},{"symbol":"ICP","name":"Internet Computer","color":"#292a2e"},{"symbol":"ICX","name":"ICON","color":"#1fc5c9"},{"symbol":"IGNIS","name":"Ignis","color":"#f9c011"},{"symbol":"ILK","name":"Inlock Token","color":"#98c23a"},{"symbol":"INK","name":"Ink","color":"#df1a14"},{"symbol":"INS","name":"Insolar","color":"#b2a3f6"},{"symbol":"ION","name":"ION","color":"#57beea"},{"symbol":"IOP","name":"Internet of People","color":"#0cafa5"},{"symbol":"IOST","name":"IOStoken","color":"#1c1c1c"},{"symbol":"IOTX","name":"IoTeX","color":"#00d4d5"},{"symbol":"IQ","name":"Everipedia","color":"#55ddff"},{"symbol":"ITC","name":"IoT Chain","color":"#102044"},{"symbol":"JNT","name":"Jibrel Network","color":"#0050db"},{"symbol":"JPY","name":"JPY","color":"#eac749"},{"symbol":"KCS","name":"KuCoin Shares","color":"#0093dd"},{"symbol":"KIN","name":"Kin","color":"#005fff"},{"symbol":"KLOWN","name":"Ether Clown","color":"#ea0017"},{"symbol":"KMD","name":"Komodo","color":"#2b6680"},{"symbol":"KNC","name":"Kyber Network","color":"#31cb9e"},{"symbol":"KRB","name":"Karbo","color":"#00aeef"},{"symbol":"KSM","name":"Kusama","color":"#000000"},{"symbol":"LBC","name":"LBRY Credits","color":"#006149"},{"symbol":"LEND","name":"ETHLend","color":"#0fa9c9"},{"symbol":"LEO","name":"Unus Sed LEO","color":"#11021e"},{"symbol":"LINK","name":"ChainLink","color":"#2a5ada"},{"symbol":"LKK","name":"Lykke","color":"#9d01eb"},{"symbol":"LOOM","name":"Loom Network","color":"#48beff"},{"symbol":"LPT","name":"Livepeer Token","color":"#000000"},{"symbol":"LRC","name":"Loopring","color":"#2ab6f6"},{"symbol":"LSK","name":"Lisk","color":"#0d4ea0"},{"symbol":"LTC","name":"Litecoin","color":"#bfbbbb"},{"symbol":"LUN","name":"Lunyr","color":"#f55749"},{"symbol":"MAID","name":"MaidSafeCoin","color":"#5592d7"},{"symbol":"MANA","name":"Decentraland","color":"#ff2d55"},{"symbol":"MATIC","name":"Polygon","color":"#6f41d8"},{"symbol":"MATIC","name":"Polygon","color":"#6f41d8"},{"symbol":"MAX","name":"MAX Token","color":"#2d4692"},{"symbol":"MCAP","name":"MCAP","color":"#033b4a"},{"symbol":"MCO","name":"Crypto.com","color":"#103f68"},{"symbol":"MDA","name":"Moeda Loyalty Points","color":"#01a64f"},{"symbol":"MDS","name":"MediShares","color":"#1e252c"},{"symbol":"MED","name":"Medibloc","color":"#00b0ff"},{"symbol":"MEETONE","name":"MEET.ONE","color":"#000000"},{"symbol":"MFT","name":"Mainframe","color":"#da1157"},{"symbol":"MIOTA","name":"IOTA","color":"#242424"},{"symbol":"MITH","name":"Mithril","color":"#00316d"},{"symbol":"MKR","name":"Maker","color":"#1aab9b"},{"symbol":"MLN","name":"Melon","color":"#0b1529"},{"symbol":"MNX","name":"MinexCoin","color":"#00adef"},{"symbol":"MNZ","name":"MNZ","color":"#7f368a"},{"symbol":"MOAC","name":"MOAC","color":"#000000"},{"symbol":"MOD","name":"Modum","color":"#09547d"},{"symbol":"MONA","name":"MonaCoin","color":"#dec799"},{"symbol":"MSR","name":"Masari","color":"#47b95c"},{"symbol":"MTH","name":"Monetha","color":"#104fca"},{"symbol":"MTL","name":"Metal","color":"#1e1f25"},{"symbol":"MUSIC","name":"Musicoin","color":"#ffffff"},{"symbol":"MZC","name":"MAZA","color":"#ffaa05"},{"symbol":"NANO","name":"Nano","color":"#4a90e2"},{"symbol":"NAS","name":"Nebulas","color":"#222222"},{"symbol":"NAV","name":"NavCoin","color":"#7d59b5"},{"symbol":"NCASH","name":"Nucleus Vision","color":"#36a9cf"},{"symbol":"NDZ","name":"NDZ","color":"#622fba"},{"symbol":"NEBL","name":"Neblio","color":"#50479e"},{"symbol":"NEO","name":"NEO","color":"#58bf00"},{"symbol":"NEOS","name":"Neoscoin","color":"#e5f300"},{"symbol":"NEU","name":"Neumark","color":"#b3ba00"},{"symbol":"NEXO","name":"Nexo","color":"#1a4199"},{"symbol":"NGC","name":"NAGA","color":"#f80000"},{"symbol":"NIO","name":"Autonio","color":"#70c9c9"},{"symbol":"NKN","name":"NKN","color":"#23336f"},{"symbol":"NLC2","name":"NoLimitCoin","color":"#f28f01"},{"symbol":"NLG","name":"Gulden","color":"#2ab0fd"},{"symbol":"NMC","name":"Namecoin","color":"#186c9d"},{"symbol":"NMR","name":"Numeraire","color":"#050708"},{"symbol":"NPXS","name":"Pundi X","color":"#f5d100"},{"symbol":"NTBC","name":"Note Blockchain","color":"#eec315"},{"symbol":"NULS","name":"Nuls","color":"#82bd39"},{"symbol":"NXS","name":"Nexus","color":"#4099cd"},{"symbol":"NXT","name":"NXT","color":"#008fbb"},{"symbol":"OAX","name":"OpenANX","color":"#164b79"},{"symbol":"OK","name":"OKCash","color":"#000000"},{"symbol":"OMG","name":"OMG Network","color":"#101010"},{"symbol":"OMNI","name":"Omni","color":"#1c347a"},{"symbol":"ONE","name":"Harmony","color":"#00aee9"},{"symbol":"ONG","name":"SoMee.Social","color":"#000000"},{"symbol":"ONT","name":"Ontology","color":"#32a4be"},{"symbol":"OOT","name":"Utrum","color":"#25aae1"},{"symbol":"OST","name":"OST","color":"#34445b"},{"symbol":"OST","name":"OST","color":"#34445b"},{"symbol":"OX","name":"OX Fina","color":"#4392cd"},{"symbol":"OXT","name":"Orchid","color":"#5f45ba"},{"symbol":"PART","name":"Particl","color":"#65cb8d"},{"symbol":"PASC","name":"Pascalcoin","color":"#f7931e"},{"symbol":"PASL","name":"Pascal Lite","color":"#00acff"},{"symbol":"PAX","name":"PAX Token","color":"#398260"},{"symbol":"PAXG","name":"PAX Gold","color":"#e4ce4d"},{"symbol":"PAY","name":"TenX","color":"#302c2c"},{"symbol":"PAYX","name":"Paypex","color":"#663300"},{"symbol":"PINK","name":"Pinkcoin","color":"#ed79aa"},{"symbol":"PIRL","name":"Pirl","color":"#96b73d"},{"symbol":"PIVX","name":"PIVX","color":"#5e4778"},{"symbol":"PLR","name":"Pillar","color":"#00bfff"},{"symbol":"POA","name":"POA Network","color":"#444fa1"},{"symbol":"POE","name":"Po.et","color":"#dcd6cc"},{"symbol":"POLIS","name":"Polis","color":"#2c3e50"},{"symbol":"POLY","name":"Polymath Network","color":"#4c5a95"},{"symbol":"POT","name":"Potcoin","color":"#105b2f"},{"symbol":"POWR","name":"Power Ledger","color":"#05bca9"},{"symbol":"PPC","name":"Peercoin","color":"#3cb054"},{"symbol":"PPP","name":"PayPie","color":"#348f8d"},{"symbol":"PPT","name":"Populous","color":"#152743"},{"symbol":"PRE","name":"Presearch","color":"#3a8cbd"},{"symbol":"PRL","name":"Oyster","color":"#1061e3"},{"symbol":"PUNGO","name":"Pungo Token","color":"#22b573"},{"symbol":"PURA","name":"Pura","color":"#333333"},{"symbol":"QASH","name":"QASH","color":"#1347e8"},{"symbol":"QIWI","name":"QIWI","color":"#ff8c00"},{"symbol":"QLC","name":"QLC Chain","color":"#610089"},{"symbol":"QRL","name":"Quantum Resistant Ledger","color":"#252525"},{"symbol":"QSP","name":"Quantstamp","color":"#454545"},{"symbol":"QTUM","name":"Qtum","color":"#2e9ad0"},{"symbol":"R","name":"Revain","color":"#771a4e"},{"symbol":"RADS","name":"Radium","color":"#9d4bef"},{"symbol":"RAP","name":"Rapture","color":"#000000"},{"symbol":"RCN","name":"Rcoin","color":"#3555f9"},{"symbol":"RDD","name":"Reddcoin","color":"#e30613"},{"symbol":"RDN","name":"Raiden Network Token","color":"#2a2a2a"},{"symbol":"REN","name":"Ren","color":"#080817"},{"symbol":"REP","name":"Augur","color":"#602a52"},{"symbol":"REPV2","name":"Augur","color":"#0e0e21"},{"symbol":"REQ","name":"Request","color":"#00e6a0"},{"symbol":"RHOC","name":"RChain","color":"#cc1e46"},{"symbol":"RIC","name":"Riecoin","color":"#60e4dd"},{"symbol":"RISE","name":"Rise","color":"#f49352"},{"symbol":"RLC","name":"iExec RLC","color":"#ffd800"},{"symbol":"RPX","name":"RPX","color":"#8d181b"},{"symbol":"RUB","name":"RUB","color":"#64d1ff"},{"symbol":"RVN","name":"Ravencoin","color":"#384182"},{"symbol":"RYO","name":"Ryo Currency","color":"#3d58b0"},{"symbol":"SAFE","name":"Safe","color":"#00688c"},{"symbol":"SAFEMOON","name":"SafeMoon","color":"#00a79d"},{"symbol":"SAI","name":"Single Collateral DAI","color":"#b68900"},{"symbol":"SALT","name":"SALT","color":"#1beef4"},{"symbol":"SAN","name":"Santiment Network Token","color":"#2b77b3"},{"symbol":"SAND","name":"The Sandbox","color":"#04adef"},{"symbol":"SBD","name":"Steem Dollars","color":"#4ba2f2"},{"symbol":"SBERBANK","name":"SBERBANK","color":"#48b254"},{"symbol":"SC","name":"Siacoin","color":"#20ee82"},{"symbol":"SHIFT","name":"Shift","color":"#964b9c"},{"symbol":"SIB","name":"SIBCoin","color":"#057bc1"},{"symbol":"SIN","name":"SINOVATE","color":"#f5342e"},{"symbol":"SKL","name":"SKALE Network","color":"#000000"},{"symbol":"SKY","name":"Skycoin","color":"#0072ff"},{"symbol":"SLR","name":"Solarcoin","color":"#fda616"},{"symbol":"SLS","name":"SaluS","color":"#8e9495"},{"symbol":"SMART","name":"SmartCash","color":"#fec60d"},{"symbol":"SMART","name":"SmartCash","color":"#fec60d"},{"symbol":"SNGLS","name":"SingularDTV","color":"#b30d23"},{"symbol":"SNM","name":"SONM","color":"#0b1c26"},{"symbol":"SNT","name":"Status","color":"#5b6dee"},{"symbol":"SNX","name":"Synthetix","color":"#5fcdf9"},{"symbol":"SOC","name":"All Sports","color":"#199248"},{"symbol":"SOL","name":"Solana","color":"#66f9a1"},{"symbol":"SPACEHBIT","name":"HashBit Blockchain","color":"#0971fe"},{"symbol":"SPANK","name":"SpankChain","color":"#ff3b81"},{"symbol":"SPHTX","name":"SophiaTX","color":"#00b098"},{"symbol":"SRN","name":"Sirin Labs Token","color":"#1c1c1c"},{"symbol":"STAK","name":"STRAKS","color":"#f2941b"},{"symbol":"START","name":"Startcoin","color":"#01aef0"},{"symbol":"STEEM","name":"Steem","color":"#4ba2f2"},{"symbol":"STORJ","name":"Storj","color":"#2683ff"},{"symbol":"STORM","name":"Storm","color":"#080d98"},{"symbol":"STOX","name":"Stox","color":"#7324f0"},{"symbol":"STQ","name":"Storiqa","color":"#2dc4e7"},{"symbol":"STRAT","name":"Stratis","color":"#1387c9"},{"symbol":"STX","name":"Stacks","color":"#5546ff"},{"symbol":"SUB","name":"Substratum","color":"#e53431"},{"symbol":"SUMO","name":"Sumokoin","color":"#2d9cdb"},{"symbol":"SUSHI","name":"SushiSwap","color":"#d65892"},{"symbol":"SYS","name":"Syscoin","color":"#0082c6"},{"symbol":"TAAS","name":"TaaS","color":"#002342"},{"symbol":"TAU","name":"Lamden","color":"#7b346e"},{"symbol":"TBX","name":"Tokenbox","color":"#5244d4"},{"symbol":"TEL","name":"Telcoin","color":"#14c8ff"},{"symbol":"TEN","name":"Tokenomy","color":"#0899cd"},{"symbol":"TERN","name":"Ternio","color":"#f4c257"},{"symbol":"TGCH","name":"TrueGalaxyCash","color":"#434247"},{"symbol":"THETA","name":"Theta Network","color":"#2ab8e6"},{"symbol":"TIX","name":"Blocktix","color":"#ef494d"},{"symbol":"TKN","name":"TokenCard","color":"#24dd7b"},{"symbol":"TKS","name":"Tokes Platform","color":"#895af8"},{"symbol":"TNB","name":"Time New Bank","color":"#ffc04e"},{"symbol":"TNC","name":"Trinity Network Credit","color":"#ff439b"},{"symbol":"TNT","name":"Tierion","color":"#ff4081"},{"symbol":"TOMO","name":"TomoChain","color":"#1a1f36"},{"symbol":"TPAY","name":"TokenPay","color":"#3058a6"},{"symbol":"TRIG","name":"Triggers","color":"#30c0f2"},{"symbol":"TRTL","name":"TurtleCoin","color":"#00843d"},{"symbol":"TRX","name":"TRON","color":"#ef0027"},{"symbol":"TUSD","name":"TrueUSD","color":"#2b2e7f"},{"symbol":"TZC","name":"TrezarCoin","color":"#374851"},{"symbol":"UBQ","name":"Ubiq","color":"#00ea90"},{"symbol":"UMA","name":"UMA","color":"#ff4a4a"},{"symbol":"UNI","name":"Uniswap","color":"#ff007a"},{"symbol":"UNITY","name":"SuperNET","color":"#f58634"},{"symbol":"USD","name":"USD","color":"#6cde07"},{"symbol":"USDC","name":"USD Coin","color":"#3e73c4"},{"symbol":"USDT","name":"Tether","color":"#26a17b"},{"symbol":"UTK","name":"UTRUST","color":"#30367a"},{"symbol":"VERI","name":"Veritaseum","color":"#ff9933"},{"symbol":"VET","name":"VeChain","color":"#15bdff"},{"symbol":"VIA","name":"Viacoin","color":"#565656"},{"symbol":"VIB","name":"Viberate","color":"#ff1f43"},{"symbol":"VIBE","name":"VIBE","color":"#338be5"},{"symbol":"VIVO","name":"VIVO","color":"#408af1"},{"symbol":"VRC","name":"VeriCoin","color":"#418bca"},{"symbol":"VRSC","name":"VerusCoin","color":"#3165d4"},{"symbol":"VRSC","name":"VerusCoin","color":"#3165d4"},{"symbol":"VTC","name":"Vertcoin","color":"#048657"},{"symbol":"VTHO","name":"VeThor Token","color":"#2a5284"},{"symbol":"WABI","name":"Tael","color":"#399b32"},{"symbol":"WAN","name":"Wanchain","color":"#136aad"},{"symbol":"WAVES","name":"Waves","color":"#0155ff"},{"symbol":"WAX","name":"WAX","color":"#f89022"},{"symbol":"WBTC","name":"Wrapped Bitcoin","color":"#201a2d"},{"symbol":"WGR","name":"Wagerr","color":"#b80000"},{"symbol":"WICC","name":"WaykiChain","color":"#5783cb"},{"symbol":"WINGS","name":"Wings","color":"#0dc9f7"},{"symbol":"WPR","name":"WePower","color":"#ffe600"},{"symbol":"WTC","name":"Waltonchain","color":"#8200ff"},{"symbol":"X","name":"GLX Equity Token","color":"#3b5998"},{"symbol":"XAS","name":"Asch","color":"#faa00d"},{"symbol":"XBC","name":"Bitcoin Plus","color":"#f7931a"},{"symbol":"XBP","name":"BlitzPredict","color":"#21af67"},{"symbol":"XBY","name":"XtraBYtes","color":"#56f4f1"},{"symbol":"XCP","name":"Counterparty","color":"#ed1650"},{"symbol":"XDN","name":"DigitalNote","color":"#4f7aa2"},{"symbol":"XEM","name":"NEM","color":"#67b2e8"},{"symbol":"XIN","name":"Infinity Economics","color":"#1eb5fa"},{"symbol":"XLM","name":"Stellar","color":"#000000"},{"symbol":"XMCC","name":"Monoeci","color":"#dd0632"},{"symbol":"XMG","name":"Magi","color":"#004a80"},{"symbol":"XMO","name":"Monero Original","color":"#ff6600"},{"symbol":"XMR","name":"Monero","color":"#ff6600"},{"symbol":"XMY","name":"Myriad","color":"#ec1076"},{"symbol":"XP","name":"XP","color":"#008200"},{"symbol":"XPA","name":"XPA","color":"#4fa784"},{"symbol":"XPM","name":"Primecoin","color":"#ffd81b"},{"symbol":"XPR","name":"Proton","color":"#7543e3"},{"symbol":"XRP","name":"XRP","color":"#23292f"},{"symbol":"XSG","name":"SnowGem","color":"#d21e2b"},{"symbol":"XTZ","name":"Tezos","color":"#a6e000"},{"symbol":"XUC","name":"Exchange Union","color":"#25aae3"},{"symbol":"XVC","name":"Vcash","color":"#b50126"},{"symbol":"XVG","name":"Verge","color":"#00cbff"},{"symbol":"XZC","name":"Zcoin","color":"#23b852"},{"symbol":"YFI","name":"yearn.finance","color":"#006ae3"},{"symbol":"YOYOW","name":"YOYOW","color":"#21a5de"},{"symbol":"ZCL","name":"Zclassic","color":"#c87035"},{"symbol":"ZEC","name":"Zcash","color":"#ecb244"},{"symbol":"ZEL","name":"ZelCash","color":"#183c87"},{"symbol":"ZEN","name":"Horizen","color":"#00eaab"},{"symbol":"ZEST","name":"Zest","color":"#07bc9c"},{"symbol":"ZEST","name":"Zest","color":"#07bc9c"},{"symbol":"ZIL","name":"Zilliqa","color":"#49c1bf"},{"symbol":"ZILLA","name":"Chainzilla","color":"#00004d"},{"symbol":"ZRX","name":"0x","color":"#302c2c"}]');

/***/ }),
/* 1624 */,
/* 1625 */,
/* 1626 */,
/* 1627 */,
/* 1628 */,
/* 1629 */,
/* 1630 */,
/* 1631 */,
/* 1632 */,
/* 1633 */,
/* 1634 */,
/* 1635 */,
/* 1636 */,
/* 1637 */,
/* 1638 */,
/* 1639 */,
/* 1640 */,
/* 1641 */,
/* 1642 */,
/* 1643 */,
/* 1644 */,
/* 1645 */,
/* 1646 */,
/* 1647 */,
/* 1648 */,
/* 1649 */,
/* 1650 */,
/* 1651 */,
/* 1652 */,
/* 1653 */,
/* 1654 */,
/* 1655 */,
/* 1656 */,
/* 1657 */,
/* 1658 */,
/* 1659 */,
/* 1660 */,
/* 1661 */,
/* 1662 */,
/* 1663 */,
/* 1664 */,
/* 1665 */,
/* 1666 */,
/* 1667 */,
/* 1668 */,
/* 1669 */,
/* 1670 */,
/* 1671 */,
/* 1672 */,
/* 1673 */,
/* 1674 */,
/* 1675 */,
/* 1676 */,
/* 1677 */,
/* 1678 */,
/* 1679 */,
/* 1680 */,
/* 1681 */,
/* 1682 */,
/* 1683 */,
/* 1684 */,
/* 1685 */,
/* 1686 */,
/* 1687 */,
/* 1688 */,
/* 1689 */,
/* 1690 */,
/* 1691 */,
/* 1692 */,
/* 1693 */,
/* 1694 */,
/* 1695 */,
/* 1696 */,
/* 1697 */,
/* 1698 */,
/* 1699 */,
/* 1700 */,
/* 1701 */,
/* 1702 */,
/* 1703 */,
/* 1704 */,
/* 1705 */,
/* 1706 */,
/* 1707 */,
/* 1708 */,
/* 1709 */,
/* 1710 */,
/* 1711 */,
/* 1712 */,
/* 1713 */,
/* 1714 */,
/* 1715 */,
/* 1716 */,
/* 1717 */,
/* 1718 */,
/* 1719 */,
/* 1720 */,
/* 1721 */,
/* 1722 */,
/* 1723 */,
/* 1724 */,
/* 1725 */,
/* 1726 */,
/* 1727 */,
/* 1728 */,
/* 1729 */,
/* 1730 */,
/* 1731 */,
/* 1732 */,
/* 1733 */,
/* 1734 */,
/* 1735 */,
/* 1736 */,
/* 1737 */,
/* 1738 */,
/* 1739 */,
/* 1740 */,
/* 1741 */,
/* 1742 */,
/* 1743 */,
/* 1744 */,
/* 1745 */,
/* 1746 */,
/* 1747 */,
/* 1748 */,
/* 1749 */,
/* 1750 */,
/* 1751 */,
/* 1752 */,
/* 1753 */,
/* 1754 */,
/* 1755 */,
/* 1756 */,
/* 1757 */,
/* 1758 */,
/* 1759 */,
/* 1760 */,
/* 1761 */,
/* 1762 */,
/* 1763 */,
/* 1764 */,
/* 1765 */,
/* 1766 */,
/* 1767 */,
/* 1768 */,
/* 1769 */,
/* 1770 */,
/* 1771 */,
/* 1772 */,
/* 1773 */,
/* 1774 */,
/* 1775 */,
/* 1776 */,
/* 1777 */,
/* 1778 */,
/* 1779 */,
/* 1780 */,
/* 1781 */,
/* 1782 */,
/* 1783 */,
/* 1784 */,
/* 1785 */,
/* 1786 */,
/* 1787 */,
/* 1788 */,
/* 1789 */,
/* 1790 */,
/* 1791 */,
/* 1792 */,
/* 1793 */,
/* 1794 */,
/* 1795 */,
/* 1796 */,
/* 1797 */,
/* 1798 */,
/* 1799 */,
/* 1800 */,
/* 1801 */,
/* 1802 */,
/* 1803 */,
/* 1804 */,
/* 1805 */,
/* 1806 */,
/* 1807 */,
/* 1808 */,
/* 1809 */,
/* 1810 */,
/* 1811 */,
/* 1812 */,
/* 1813 */,
/* 1814 */,
/* 1815 */,
/* 1816 */,
/* 1817 */,
/* 1818 */,
/* 1819 */,
/* 1820 */,
/* 1821 */,
/* 1822 */,
/* 1823 */,
/* 1824 */,
/* 1825 */,
/* 1826 */
/*!***********************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/components/site_wallet.tsx ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _crypto_address__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./crypto_address */ 1330);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/crypto_donate/components/site_wallet.tsx";




var SiteWallet = function (_ref) {
    var limit = _ref.limit;
    var cryptoAddresses = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSoapboxConfig)().cryptoAddresses;
    var addresses = typeof limit === 'number' ? cryptoAddresses.take(limit) : cryptoAddresses;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 5
        }
    }, addresses.map(function (address) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_crypto_address__WEBPACK_IMPORTED_MODULE_3__["default"], {
        key: address.ticker,
        address: address.address,
        ticker: address.ticker,
        note: address.note,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (SiteWallet);


/***/ }),
/* 1827 */
/*!********************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/utils/block_explorer.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getExplorerUrl": function() { return /* binding */ getExplorerUrl; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_explorers_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block_explorers.json */ 1931);


var getExplorerUrl = function (ticker, address) {
    var template = _block_explorers_json__WEBPACK_IMPORTED_MODULE_1__[ticker];
    if (!template)
        return null;
    return template.replace('{address}', address);
};


/***/ }),
/* 1828 */
/*!*************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/utils/coin_db.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTitle": function() { return /* binding */ getTitle; }
/* harmony export */ });
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var _manifest_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./manifest_map */ 1932);

 // All this does is converts the result from manifest_map.js into an ImmutableMap
var coinDB = (0,immutable__WEBPACK_IMPORTED_MODULE_1__.fromJS)(_manifest_map__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (coinDB);
/** Get title from CoinDB based on ticker symbol */
var getTitle = function (ticker) {
    var title = coinDB.getIn([ticker, 'name']);
    return typeof title === 'string' ? title : '';
};


/***/ }),
/* 1829 */
/*!***********************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/components/crypto_icon.tsx ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/crypto_donate/components/crypto_icon.tsx";

/** Get crypto icon URL by ticker symbol, or fall back to generic icon */
var getIcon = function (ticker) {
    try {
        return __webpack_require__(1933)("./".concat(ticker.toLowerCase(), ".svg"));
    }
    catch (_a) {
        return __webpack_require__(/*! cryptocurrency-icons/svg/color/generic.svg */ 1830);
    }
};
var CryptoIcon = function (_ref) {
    var ticker = _ref.ticker, title = _ref.title, className = _ref.className;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: className,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("img", {
        src: getIcon(ticker),
        alt: title || ticker,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (CryptoIcon);


/***/ }),
/* 1830 */
/*!*****************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/generic.svg ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/generic-43216508.svg";

/***/ }),
/* 1831 */,
/* 1832 */,
/* 1833 */,
/* 1834 */,
/* 1835 */,
/* 1836 */,
/* 1837 */,
/* 1838 */,
/* 1839 */,
/* 1840 */,
/* 1841 */,
/* 1842 */,
/* 1843 */,
/* 1844 */,
/* 1845 */,
/* 1846 */,
/* 1847 */,
/* 1848 */,
/* 1849 */,
/* 1850 */,
/* 1851 */,
/* 1852 */,
/* 1853 */,
/* 1854 */,
/* 1855 */,
/* 1856 */,
/* 1857 */,
/* 1858 */,
/* 1859 */,
/* 1860 */,
/* 1861 */,
/* 1862 */,
/* 1863 */,
/* 1864 */,
/* 1865 */,
/* 1866 */,
/* 1867 */,
/* 1868 */,
/* 1869 */,
/* 1870 */,
/* 1871 */,
/* 1872 */,
/* 1873 */,
/* 1874 */,
/* 1875 */,
/* 1876 */,
/* 1877 */,
/* 1878 */,
/* 1879 */,
/* 1880 */,
/* 1881 */,
/* 1882 */,
/* 1883 */,
/* 1884 */,
/* 1885 */,
/* 1886 */,
/* 1887 */,
/* 1888 */,
/* 1889 */,
/* 1890 */,
/* 1891 */,
/* 1892 */,
/* 1893 */,
/* 1894 */,
/* 1895 */,
/* 1896 */,
/* 1897 */,
/* 1898 */,
/* 1899 */,
/* 1900 */,
/* 1901 */,
/* 1902 */,
/* 1903 */,
/* 1904 */,
/* 1905 */,
/* 1906 */,
/* 1907 */,
/* 1908 */,
/* 1909 */,
/* 1910 */,
/* 1911 */,
/* 1912 */,
/* 1913 */,
/* 1914 */,
/* 1915 */,
/* 1916 */,
/* 1917 */,
/* 1918 */,
/* 1919 */,
/* 1920 */,
/* 1921 */,
/* 1922 */,
/* 1923 */,
/* 1924 */,
/* 1925 */,
/* 1926 */,
/* 1927 */,
/* 1928 */,
/* 1929 */,
/* 1930 */,
/* 1931 */
/*!***********************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/utils/block_explorers.json ***!
  \***********************************************************************/
/***/ (function(module) {

"use strict";
module.exports = JSON.parse('{"aave":"https://etherscan.io/address/{address}","bat":"https://etherscan.io/address/{address}","bch":"https://explorer.bitcoin.com/bch/address/{address}","btc":"https://explorer.bitcoin.com/btc/address/{address}","btg":"https://btgexplorer.com/address/{address}","comp":"https://etherscan.io/address/{address}","dash":"https://dashblockexplorer.com/address/{address}","dgb":"https://digiexplorer.info/address/{address}","doge":"https://dogechain.info/address/{address}","etc":"https://etcblockexplorer.com/address/{address}","eth":"https://etherscan.io/address/{address}","grans":"https://ubiqscan.io/address/{address}","link":"https://etherscan.io/address/{address}","ltc":"https://litecoinblockexplorer.net/address/{address}","mkr":"https://etherscan.io/address/{address}","oxt":"https://etherscan.io/address/{address}","sushi":"https://etherscan.io/address/{address}","ubq":"https://ubiqscan.io/address/{address}","uni":"https://etherscan.io/address/{address}","usdc":"https://etherscan.io/address/{address}","vtc":"https://vtcblocks.com/address/{address}","xmr":"https://monerohash.com/explorer/search?value={address}","xrp":"https://xrpscan.com/account/{address}","zec":"https://zecblockexplorer.com/address/{address}"}');

/***/ }),
/* 1932 */
/*!******************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/utils/manifest_map.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var cryptocurrency_icons_manifest_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cryptocurrency-icons/manifest.json */ 1623);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! immutable */ 5);
// Converts cryptocurrency-icon's manifest file from a list to a map.
// See: https://github.com/spothq/cryptocurrency-icons/blob/master/manifest.json


var manifestMap = (0,immutable__WEBPACK_IMPORTED_MODULE_1__.fromJS)(cryptocurrency_icons_manifest_json__WEBPACK_IMPORTED_MODULE_0__).reduce(function (acc, entry) {
    return acc.set(entry.get('symbol').toLowerCase(), entry);
}, (0,immutable__WEBPACK_IMPORTED_MODULE_1__.Map)());
/* harmony default export */ __webpack_exports__["default"] = (manifestMap.toJS());


/***/ }),
/* 1933 */
/*!*************************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ sync ^\.\/.*\.svg$ ***!
  \*************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./$pac.svg": 1934,
	"./0xbtc.svg": 1935,
	"./2give.svg": 1936,
	"./aave.svg": 1937,
	"./abt.svg": 1938,
	"./act.svg": 1939,
	"./actn.svg": 1940,
	"./ada.svg": 1941,
	"./add.svg": 1942,
	"./adx.svg": 1943,
	"./ae.svg": 1944,
	"./aeon.svg": 1945,
	"./aeur.svg": 1946,
	"./agi.svg": 1947,
	"./agrs.svg": 1948,
	"./aion.svg": 1949,
	"./algo.svg": 1950,
	"./amb.svg": 1951,
	"./amp.svg": 1952,
	"./ampl.svg": 1953,
	"./ankr.svg": 1954,
	"./ant.svg": 1955,
	"./apex.svg": 1956,
	"./appc.svg": 1957,
	"./ardr.svg": 1958,
	"./arg.svg": 1959,
	"./ark.svg": 1960,
	"./arn.svg": 1961,
	"./arnx.svg": 1962,
	"./ary.svg": 1963,
	"./ast.svg": 1964,
	"./atm.svg": 1965,
	"./atom.svg": 1966,
	"./audr.svg": 1967,
	"./auto.svg": 1968,
	"./aywa.svg": 1969,
	"./bab.svg": 1970,
	"./bal.svg": 1971,
	"./band.svg": 1972,
	"./bat.svg": 1973,
	"./bay.svg": 1974,
	"./bcbc.svg": 1975,
	"./bcc.svg": 1976,
	"./bcd.svg": 1977,
	"./bch.svg": 1978,
	"./bcio.svg": 1979,
	"./bcn.svg": 1980,
	"./bco.svg": 1981,
	"./bcpt.svg": 1982,
	"./bdl.svg": 1983,
	"./beam.svg": 1984,
	"./bela.svg": 1985,
	"./bix.svg": 1986,
	"./blcn.svg": 1987,
	"./blk.svg": 1988,
	"./block.svg": 1989,
	"./blz.svg": 1990,
	"./bnb.svg": 1991,
	"./bnt.svg": 1992,
	"./bnty.svg": 1993,
	"./booty.svg": 1994,
	"./bos.svg": 1995,
	"./bpt.svg": 1996,
	"./bq.svg": 1997,
	"./brd.svg": 1998,
	"./bsd.svg": 1999,
	"./bsv.svg": 2000,
	"./btc.svg": 2001,
	"./btcd.svg": 2002,
	"./btch.svg": 2003,
	"./btcp.svg": 2004,
	"./btcz.svg": 2005,
	"./btdx.svg": 2006,
	"./btg.svg": 2007,
	"./btm.svg": 2008,
	"./bts.svg": 2009,
	"./btt.svg": 2010,
	"./btx.svg": 2011,
	"./burst.svg": 2012,
	"./bze.svg": 2013,
	"./call.svg": 2014,
	"./cc.svg": 2015,
	"./cdn.svg": 2016,
	"./cdt.svg": 2017,
	"./cenz.svg": 2018,
	"./chain.svg": 2019,
	"./chat.svg": 2020,
	"./chips.svg": 2021,
	"./chsb.svg": 2022,
	"./cix.svg": 2023,
	"./clam.svg": 2024,
	"./cloak.svg": 2025,
	"./cmm.svg": 2026,
	"./cmt.svg": 2027,
	"./cnd.svg": 2028,
	"./cnx.svg": 2029,
	"./cny.svg": 2030,
	"./cob.svg": 2031,
	"./colx.svg": 2032,
	"./comp.svg": 2033,
	"./coqui.svg": 2034,
	"./cred.svg": 2035,
	"./crpt.svg": 2036,
	"./crv.svg": 2037,
	"./crw.svg": 2038,
	"./cs.svg": 2039,
	"./ctr.svg": 2040,
	"./ctxc.svg": 2041,
	"./cvc.svg": 2042,
	"./d.svg": 2043,
	"./dai.svg": 2044,
	"./dash.svg": 2045,
	"./dat.svg": 2046,
	"./data.svg": 2047,
	"./dbc.svg": 2048,
	"./dcn.svg": 2049,
	"./dcr.svg": 2050,
	"./deez.svg": 2051,
	"./dent.svg": 2052,
	"./dew.svg": 2053,
	"./dgb.svg": 2054,
	"./dgd.svg": 2055,
	"./dlt.svg": 2056,
	"./dnt.svg": 2057,
	"./dock.svg": 2058,
	"./doge.svg": 2059,
	"./dot.svg": 2060,
	"./drgn.svg": 2061,
	"./drop.svg": 2062,
	"./dta.svg": 2063,
	"./dth.svg": 2064,
	"./dtr.svg": 2065,
	"./ebst.svg": 2066,
	"./eca.svg": 2067,
	"./edg.svg": 2068,
	"./edo.svg": 2069,
	"./edoge.svg": 2070,
	"./ela.svg": 2071,
	"./elec.svg": 2072,
	"./elf.svg": 2073,
	"./elix.svg": 2074,
	"./ella.svg": 2075,
	"./emb.svg": 2076,
	"./emc.svg": 2077,
	"./emc2.svg": 2078,
	"./eng.svg": 2079,
	"./enj.svg": 2080,
	"./entrp.svg": 2081,
	"./eon.svg": 2082,
	"./eop.svg": 2083,
	"./eos.svg": 2084,
	"./eqli.svg": 2085,
	"./equa.svg": 2086,
	"./etc.svg": 2087,
	"./eth.svg": 2088,
	"./ethos.svg": 2089,
	"./etn.svg": 2090,
	"./etp.svg": 2091,
	"./eur.svg": 2092,
	"./evx.svg": 2093,
	"./exmo.svg": 2094,
	"./exp.svg": 2095,
	"./fair.svg": 2096,
	"./fct.svg": 2097,
	"./fil.svg": 2098,
	"./fjc.svg": 2099,
	"./fldc.svg": 2100,
	"./flo.svg": 2101,
	"./flux.svg": 2102,
	"./fsn.svg": 2103,
	"./ftc.svg": 2104,
	"./fuel.svg": 2105,
	"./fun.svg": 2106,
	"./game.svg": 2107,
	"./gas.svg": 2108,
	"./gbp.svg": 2109,
	"./gbx.svg": 2110,
	"./gbyte.svg": 2111,
	"./generic.svg": 1830,
	"./gin.svg": 2112,
	"./glxt.svg": 2113,
	"./gmr.svg": 2114,
	"./gno.svg": 2115,
	"./gnt.svg": 2116,
	"./gold.svg": 2117,
	"./grc.svg": 2118,
	"./grin.svg": 2119,
	"./grs.svg": 2120,
	"./grt.svg": 2121,
	"./gsc.svg": 2122,
	"./gto.svg": 2123,
	"./gup.svg": 2124,
	"./gusd.svg": 2125,
	"./gvt.svg": 2126,
	"./gxs.svg": 2127,
	"./gzr.svg": 2128,
	"./hight.svg": 2129,
	"./hns.svg": 2130,
	"./hodl.svg": 2131,
	"./hot.svg": 2132,
	"./hpb.svg": 2133,
	"./hsr.svg": 2134,
	"./ht.svg": 2135,
	"./html.svg": 2136,
	"./huc.svg": 2137,
	"./husd.svg": 2138,
	"./hush.svg": 2139,
	"./icn.svg": 2140,
	"./icp.svg": 2141,
	"./icx.svg": 2142,
	"./ignis.svg": 2143,
	"./ilk.svg": 2144,
	"./ink.svg": 2145,
	"./ins.svg": 2146,
	"./ion.svg": 2147,
	"./iop.svg": 2148,
	"./iost.svg": 2149,
	"./iotx.svg": 2150,
	"./iq.svg": 2151,
	"./itc.svg": 2152,
	"./jnt.svg": 2153,
	"./jpy.svg": 2154,
	"./kcs.svg": 2155,
	"./kin.svg": 2156,
	"./klown.svg": 2157,
	"./kmd.svg": 2158,
	"./knc.svg": 2159,
	"./krb.svg": 2160,
	"./ksm.svg": 2161,
	"./lbc.svg": 2162,
	"./lend.svg": 2163,
	"./leo.svg": 2164,
	"./link.svg": 2165,
	"./lkk.svg": 2166,
	"./loom.svg": 2167,
	"./lpt.svg": 2168,
	"./lrc.svg": 2169,
	"./lsk.svg": 2170,
	"./ltc.svg": 2171,
	"./lun.svg": 2172,
	"./maid.svg": 2173,
	"./mana.svg": 2174,
	"./matic.svg": 2175,
	"./max.svg": 2176,
	"./mcap.svg": 2177,
	"./mco.svg": 2178,
	"./mda.svg": 2179,
	"./mds.svg": 2180,
	"./med.svg": 2181,
	"./meetone.svg": 2182,
	"./mft.svg": 2183,
	"./miota.svg": 2184,
	"./mith.svg": 2185,
	"./mkr.svg": 2186,
	"./mln.svg": 2187,
	"./mnx.svg": 2188,
	"./mnz.svg": 2189,
	"./moac.svg": 2190,
	"./mod.svg": 2191,
	"./mona.svg": 2192,
	"./msr.svg": 2193,
	"./mth.svg": 2194,
	"./mtl.svg": 2195,
	"./music.svg": 2196,
	"./mzc.svg": 2197,
	"./nano.svg": 2198,
	"./nas.svg": 2199,
	"./nav.svg": 2200,
	"./ncash.svg": 2201,
	"./ndz.svg": 2202,
	"./nebl.svg": 2203,
	"./neo.svg": 2204,
	"./neos.svg": 2205,
	"./neu.svg": 2206,
	"./nexo.svg": 2207,
	"./ngc.svg": 2208,
	"./nio.svg": 2209,
	"./nkn.svg": 2210,
	"./nlc2.svg": 2211,
	"./nlg.svg": 2212,
	"./nmc.svg": 2213,
	"./nmr.svg": 2214,
	"./npxs.svg": 2215,
	"./ntbc.svg": 2216,
	"./nuls.svg": 2217,
	"./nxs.svg": 2218,
	"./nxt.svg": 2219,
	"./oax.svg": 2220,
	"./ok.svg": 2221,
	"./omg.svg": 2222,
	"./omni.svg": 2223,
	"./one.svg": 2224,
	"./ong.svg": 2225,
	"./ont.svg": 2226,
	"./oot.svg": 2227,
	"./ost.svg": 2228,
	"./ox.svg": 2229,
	"./oxt.svg": 2230,
	"./part.svg": 2231,
	"./pasc.svg": 2232,
	"./pasl.svg": 2233,
	"./pax.svg": 2234,
	"./paxg.svg": 2235,
	"./pay.svg": 2236,
	"./payx.svg": 2237,
	"./pink.svg": 2238,
	"./pirl.svg": 2239,
	"./pivx.svg": 2240,
	"./plr.svg": 2241,
	"./poa.svg": 2242,
	"./poe.svg": 2243,
	"./polis.svg": 2244,
	"./poly.svg": 2245,
	"./pot.svg": 2246,
	"./powr.svg": 2247,
	"./ppc.svg": 2248,
	"./ppp.svg": 2249,
	"./ppt.svg": 2250,
	"./pre.svg": 2251,
	"./prl.svg": 2252,
	"./pungo.svg": 2253,
	"./pura.svg": 2254,
	"./qash.svg": 2255,
	"./qiwi.svg": 2256,
	"./qlc.svg": 2257,
	"./qrl.svg": 2258,
	"./qsp.svg": 2259,
	"./qtum.svg": 2260,
	"./r.svg": 2261,
	"./rads.svg": 2262,
	"./rap.svg": 2263,
	"./rcn.svg": 2264,
	"./rdd.svg": 2265,
	"./rdn.svg": 2266,
	"./ren.svg": 2267,
	"./rep.svg": 2268,
	"./repv2.svg": 2269,
	"./req.svg": 2270,
	"./rhoc.svg": 2271,
	"./ric.svg": 2272,
	"./rise.svg": 2273,
	"./rlc.svg": 2274,
	"./rpx.svg": 2275,
	"./rub.svg": 2276,
	"./rvn.svg": 2277,
	"./ryo.svg": 2278,
	"./safe.svg": 2279,
	"./safemoon.svg": 2280,
	"./sai.svg": 2281,
	"./salt.svg": 2282,
	"./san.svg": 2283,
	"./sand.svg": 2284,
	"./sbd.svg": 2285,
	"./sberbank.svg": 2286,
	"./sc.svg": 2287,
	"./shift.svg": 2288,
	"./sib.svg": 2289,
	"./sin.svg": 2290,
	"./skl.svg": 2291,
	"./sky.svg": 2292,
	"./slr.svg": 2293,
	"./sls.svg": 2294,
	"./smart.svg": 2295,
	"./sngls.svg": 2296,
	"./snm.svg": 2297,
	"./snt.svg": 2298,
	"./snx.svg": 2299,
	"./soc.svg": 2300,
	"./sol.svg": 2301,
	"./spacehbit.svg": 2302,
	"./spank.svg": 2303,
	"./sphtx.svg": 2304,
	"./srn.svg": 2305,
	"./stak.svg": 2306,
	"./start.svg": 2307,
	"./steem.svg": 2308,
	"./storj.svg": 2309,
	"./storm.svg": 2310,
	"./stox.svg": 2311,
	"./stq.svg": 2312,
	"./strat.svg": 2313,
	"./stx.svg": 2314,
	"./sub.svg": 2315,
	"./sumo.svg": 2316,
	"./sushi.svg": 2317,
	"./sys.svg": 2318,
	"./taas.svg": 2319,
	"./tau.svg": 2320,
	"./tbx.svg": 2321,
	"./tel.svg": 2322,
	"./ten.svg": 2323,
	"./tern.svg": 2324,
	"./tgch.svg": 2325,
	"./theta.svg": 2326,
	"./tix.svg": 2327,
	"./tkn.svg": 2328,
	"./tks.svg": 2329,
	"./tnb.svg": 2330,
	"./tnc.svg": 2331,
	"./tnt.svg": 2332,
	"./tomo.svg": 2333,
	"./tpay.svg": 2334,
	"./trig.svg": 2335,
	"./trtl.svg": 2336,
	"./trx.svg": 2337,
	"./tusd.svg": 2338,
	"./tzc.svg": 2339,
	"./ubq.svg": 2340,
	"./uma.svg": 2341,
	"./uni.svg": 2342,
	"./unity.svg": 2343,
	"./usd.svg": 2344,
	"./usdc.svg": 2345,
	"./usdt.svg": 2346,
	"./utk.svg": 2347,
	"./veri.svg": 2348,
	"./vet.svg": 2349,
	"./via.svg": 2350,
	"./vib.svg": 2351,
	"./vibe.svg": 2352,
	"./vivo.svg": 2353,
	"./vrc.svg": 2354,
	"./vrsc.svg": 2355,
	"./vtc.svg": 2356,
	"./vtho.svg": 2357,
	"./wabi.svg": 2358,
	"./wan.svg": 2359,
	"./waves.svg": 2360,
	"./wax.svg": 2361,
	"./wbtc.svg": 2362,
	"./wgr.svg": 2363,
	"./wicc.svg": 2364,
	"./wings.svg": 2365,
	"./wpr.svg": 2366,
	"./wtc.svg": 2367,
	"./x.svg": 2368,
	"./xas.svg": 2369,
	"./xbc.svg": 2370,
	"./xbp.svg": 2371,
	"./xby.svg": 2372,
	"./xcp.svg": 2373,
	"./xdn.svg": 2374,
	"./xem.svg": 2375,
	"./xin.svg": 2376,
	"./xlm.svg": 2377,
	"./xmcc.svg": 2378,
	"./xmg.svg": 2379,
	"./xmo.svg": 2380,
	"./xmr.svg": 2381,
	"./xmy.svg": 2382,
	"./xp.svg": 2383,
	"./xpa.svg": 2384,
	"./xpm.svg": 2385,
	"./xpr.svg": 2386,
	"./xrp.svg": 2387,
	"./xsg.svg": 2388,
	"./xtz.svg": 2389,
	"./xuc.svg": 2390,
	"./xvc.svg": 2391,
	"./xvg.svg": 2392,
	"./xzc.svg": 2393,
	"./yfi.svg": 2394,
	"./yoyow.svg": 2395,
	"./zcl.svg": 2396,
	"./zec.svg": 2397,
	"./zel.svg": 2398,
	"./zen.svg": 2399,
	"./zest.svg": 2400,
	"./zil.svg": 2401,
	"./zilla.svg": 2402,
	"./zrx.svg": 2403
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 1933;

/***/ }),
/* 1934 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/$pac.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/$pac-16d59c29.svg";

/***/ }),
/* 1935 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/0xbtc.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/0xbtc-2062c6f3.svg";

/***/ }),
/* 1936 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/2give.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/2give-84362bf5.svg";

/***/ }),
/* 1937 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/aave.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/aave-a99a7843.svg";

/***/ }),
/* 1938 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/abt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/abt-b335d7ea.svg";

/***/ }),
/* 1939 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/act.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/act-85dcc32a.svg";

/***/ }),
/* 1940 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/actn.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/actn-8146d4f0.svg";

/***/ }),
/* 1941 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ada.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ada-51c7340a.svg";

/***/ }),
/* 1942 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/add.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/add-d7d758e6.svg";

/***/ }),
/* 1943 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/adx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/adx-f1aa2aff.svg";

/***/ }),
/* 1944 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ae.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ae-a7e525c0.svg";

/***/ }),
/* 1945 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/aeon.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/aeon-2ff91e23.svg";

/***/ }),
/* 1946 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/aeur.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/aeur-957173d8.svg";

/***/ }),
/* 1947 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/agi.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/agi-22629d5c.svg";

/***/ }),
/* 1948 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/agrs.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/agrs-3b12c9a6.svg";

/***/ }),
/* 1949 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/aion.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/aion-a2d067b3.svg";

/***/ }),
/* 1950 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/algo.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/algo-e13d584d.svg";

/***/ }),
/* 1951 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/amb.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/amb-48585986.svg";

/***/ }),
/* 1952 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/amp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/amp-7ee834b9.svg";

/***/ }),
/* 1953 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ampl.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ampl-b6306660.svg";

/***/ }),
/* 1954 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ankr.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ankr-f256be4b.svg";

/***/ }),
/* 1955 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ant.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ant-dc6a9bb5.svg";

/***/ }),
/* 1956 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/apex.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/apex-fc632b0c.svg";

/***/ }),
/* 1957 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/appc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/appc-b4be54ec.svg";

/***/ }),
/* 1958 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ardr.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ardr-52b55437.svg";

/***/ }),
/* 1959 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/arg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/arg-1179bc59.svg";

/***/ }),
/* 1960 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ark.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ark-d0d99bb4.svg";

/***/ }),
/* 1961 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/arn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/arn-24fe0bee.svg";

/***/ }),
/* 1962 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/arnx.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/arnx-a3689bb6.svg";

/***/ }),
/* 1963 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ary.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ary-10e3f625.svg";

/***/ }),
/* 1964 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ast.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ast-5694bad9.svg";

/***/ }),
/* 1965 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/atm.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/atm-cfc51995.svg";

/***/ }),
/* 1966 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/atom.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/atom-69af2bb1.svg";

/***/ }),
/* 1967 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/audr.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/audr-97b5dc04.svg";

/***/ }),
/* 1968 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/auto.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/auto-b017caca.svg";

/***/ }),
/* 1969 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/aywa.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/aywa-4338c6f2.svg";

/***/ }),
/* 1970 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bab.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bab-cab35529.svg";

/***/ }),
/* 1971 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bal.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bal-b2741c6a.svg";

/***/ }),
/* 1972 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/band.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/band-86fa30e7.svg";

/***/ }),
/* 1973 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bat.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bat-295acb23.svg";

/***/ }),
/* 1974 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bay.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bay-b70ae0ff.svg";

/***/ }),
/* 1975 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bcbc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bcbc-6335b921.svg";

/***/ }),
/* 1976 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bcc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bcc-8f046891.svg";

/***/ }),
/* 1977 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bcd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bcd-23a30555.svg";

/***/ }),
/* 1978 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bch.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bch-e82f70d9.svg";

/***/ }),
/* 1979 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bcio.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bcio-7370f484.svg";

/***/ }),
/* 1980 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bcn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bcn-cedd6f75.svg";

/***/ }),
/* 1981 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bco.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bco-29134873.svg";

/***/ }),
/* 1982 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bcpt.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bcpt-418ad32f.svg";

/***/ }),
/* 1983 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bdl.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bdl-548cfd60.svg";

/***/ }),
/* 1984 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/beam.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/beam-0eff59bb.svg";

/***/ }),
/* 1985 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bela.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bela-b2c624d9.svg";

/***/ }),
/* 1986 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bix.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bix-b64ecf8c.svg";

/***/ }),
/* 1987 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/blcn.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/blcn-d3cfa12e.svg";

/***/ }),
/* 1988 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/blk.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/blk-71c886a8.svg";

/***/ }),
/* 1989 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/block.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/block-541c6fae.svg";

/***/ }),
/* 1990 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/blz.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/blz-c628fe85.svg";

/***/ }),
/* 1991 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bnb.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bnb-158a46aa.svg";

/***/ }),
/* 1992 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bnt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bnt-7a7ea8b8.svg";

/***/ }),
/* 1993 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bnty.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bnty-c3fd35b3.svg";

/***/ }),
/* 1994 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/booty.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/booty-f9352230.svg";

/***/ }),
/* 1995 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bos.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bos-f0a9d42a.svg";

/***/ }),
/* 1996 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bpt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bpt-09532cf4.svg";

/***/ }),
/* 1997 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bq.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bq-1f0bba93.svg";

/***/ }),
/* 1998 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/brd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/brd-2eca6cb7.svg";

/***/ }),
/* 1999 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bsd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bsd-47bfb638.svg";

/***/ }),
/* 2000 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bsv.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bsv-9bbf53c8.svg";

/***/ }),
/* 2001 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btc-0a74ea3b.svg";

/***/ }),
/* 2002 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btcd.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btcd-6edb4743.svg";

/***/ }),
/* 2003 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btch.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btch-af25f646.svg";

/***/ }),
/* 2004 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btcp.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btcp-35b8ab70.svg";

/***/ }),
/* 2005 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btcz.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btcz-dd694c26.svg";

/***/ }),
/* 2006 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btdx.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btdx-9aa43a51.svg";

/***/ }),
/* 2007 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btg-9dad3f97.svg";

/***/ }),
/* 2008 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btm.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btm-d31bcc04.svg";

/***/ }),
/* 2009 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bts.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bts-6bd6d415.svg";

/***/ }),
/* 2010 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btt-4c550860.svg";

/***/ }),
/* 2011 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/btx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/btx-3bf8f939.svg";

/***/ }),
/* 2012 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/burst.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/burst-0676ae0c.svg";

/***/ }),
/* 2013 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/bze.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/bze-6b663423.svg";

/***/ }),
/* 2014 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/call.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/call-9c1f57d7.svg";

/***/ }),
/* 2015 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cc.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cc-cafbe0cd.svg";

/***/ }),
/* 2016 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cdn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cdn-8c8da6de.svg";

/***/ }),
/* 2017 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cdt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cdt-e4535602.svg";

/***/ }),
/* 2018 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cenz.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cenz-cdf5d384.svg";

/***/ }),
/* 2019 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/chain.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/chain-188d5d32.svg";

/***/ }),
/* 2020 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/chat.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/chat-180c5ab3.svg";

/***/ }),
/* 2021 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/chips.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/chips-81e9d53f.svg";

/***/ }),
/* 2022 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/chsb.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/chsb-12c084ce.svg";

/***/ }),
/* 2023 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cix.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cix-020d533d.svg";

/***/ }),
/* 2024 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/clam.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/clam-df471d63.svg";

/***/ }),
/* 2025 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cloak.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cloak-28c21b17.svg";

/***/ }),
/* 2026 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cmm.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cmm-1f0286a4.svg";

/***/ }),
/* 2027 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cmt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cmt-3752df78.svg";

/***/ }),
/* 2028 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cnd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cnd-34c5d18c.svg";

/***/ }),
/* 2029 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cnx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cnx-db98c7f9.svg";

/***/ }),
/* 2030 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cny.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cny-574902ab.svg";

/***/ }),
/* 2031 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cob.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cob-3f713224.svg";

/***/ }),
/* 2032 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/colx.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/colx-47ffed3a.svg";

/***/ }),
/* 2033 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/comp.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/comp-7157b9e2.svg";

/***/ }),
/* 2034 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/coqui.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/coqui-47f10334.svg";

/***/ }),
/* 2035 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cred.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cred-b29696be.svg";

/***/ }),
/* 2036 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/crpt.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/crpt-82b907b9.svg";

/***/ }),
/* 2037 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/crv.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/crv-e23ede56.svg";

/***/ }),
/* 2038 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/crw.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/crw-2f1368ed.svg";

/***/ }),
/* 2039 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cs.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cs-c525e5f2.svg";

/***/ }),
/* 2040 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ctr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ctr-6cadaffb.svg";

/***/ }),
/* 2041 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ctxc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ctxc-4e3dfce7.svg";

/***/ }),
/* 2042 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/cvc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/cvc-d35b11af.svg";

/***/ }),
/* 2043 */
/*!***********************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/d.svg ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/d-58881ef1.svg";

/***/ }),
/* 2044 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dai.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dai-8e963c57.svg";

/***/ }),
/* 2045 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dash.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dash-0a88c68a.svg";

/***/ }),
/* 2046 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dat.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dat-c28325db.svg";

/***/ }),
/* 2047 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/data.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/data-c66b0683.svg";

/***/ }),
/* 2048 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dbc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dbc-801eab9c.svg";

/***/ }),
/* 2049 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dcn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dcn-c16bdce9.svg";

/***/ }),
/* 2050 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dcr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dcr-87b08901.svg";

/***/ }),
/* 2051 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/deez.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/deez-c3a4f7d7.svg";

/***/ }),
/* 2052 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dent.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dent-b8216efd.svg";

/***/ }),
/* 2053 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dew.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dew-4164d159.svg";

/***/ }),
/* 2054 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dgb.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dgb-56c94e31.svg";

/***/ }),
/* 2055 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dgd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dgd-e29e2e82.svg";

/***/ }),
/* 2056 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dlt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dlt-6c5d6477.svg";

/***/ }),
/* 2057 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dnt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dnt-b29827fa.svg";

/***/ }),
/* 2058 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dock.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dock-3bda9932.svg";

/***/ }),
/* 2059 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/doge.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/doge-3fee23fc.svg";

/***/ }),
/* 2060 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dot.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dot-0d26bccf.svg";

/***/ }),
/* 2061 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/drgn.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/drgn-304e0933.svg";

/***/ }),
/* 2062 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/drop.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/drop-ad33e71f.svg";

/***/ }),
/* 2063 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dta.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dta-c564e7ab.svg";

/***/ }),
/* 2064 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dth.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dth-ae8002cd.svg";

/***/ }),
/* 2065 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/dtr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/dtr-f459bfa8.svg";

/***/ }),
/* 2066 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ebst.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ebst-69ec90a5.svg";

/***/ }),
/* 2067 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eca.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eca-577f9531.svg";

/***/ }),
/* 2068 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/edg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/edg-e2e90025.svg";

/***/ }),
/* 2069 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/edo.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/edo-3aae903d.svg";

/***/ }),
/* 2070 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/edoge.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/edoge-a1355839.svg";

/***/ }),
/* 2071 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ela.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ela-8f020c43.svg";

/***/ }),
/* 2072 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/elec.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/elec-61ed0695.svg";

/***/ }),
/* 2073 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/elf.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/elf-e0447215.svg";

/***/ }),
/* 2074 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/elix.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/elix-c4c28843.svg";

/***/ }),
/* 2075 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ella.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ella-af8a1a6d.svg";

/***/ }),
/* 2076 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/emb.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/emb-7166b71c.svg";

/***/ }),
/* 2077 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/emc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/emc-cf907c8e.svg";

/***/ }),
/* 2078 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/emc2.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/emc2-c4f39c8e.svg";

/***/ }),
/* 2079 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eng.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eng-67270614.svg";

/***/ }),
/* 2080 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/enj.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/enj-26848a34.svg";

/***/ }),
/* 2081 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/entrp.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/entrp-f0e9efde.svg";

/***/ }),
/* 2082 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eon.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eon-3a24de62.svg";

/***/ }),
/* 2083 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eop.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eop-6f35a8d2.svg";

/***/ }),
/* 2084 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eos.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eos-67981bbf.svg";

/***/ }),
/* 2085 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eqli.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eqli-00ad387f.svg";

/***/ }),
/* 2086 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/equa.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/equa-b84ef728.svg";

/***/ }),
/* 2087 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/etc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/etc-efbf5856.svg";

/***/ }),
/* 2088 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eth.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eth-c378096f.svg";

/***/ }),
/* 2089 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ethos.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ethos-02633485.svg";

/***/ }),
/* 2090 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/etn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/etn-5878c960.svg";

/***/ }),
/* 2091 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/etp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/etp-f5b98be3.svg";

/***/ }),
/* 2092 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/eur.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/eur-ab85efd2.svg";

/***/ }),
/* 2093 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/evx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/evx-0a4d9f64.svg";

/***/ }),
/* 2094 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/exmo.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/exmo-6422fd89.svg";

/***/ }),
/* 2095 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/exp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/exp-c688263d.svg";

/***/ }),
/* 2096 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fair.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fair-b61a8bd7.svg";

/***/ }),
/* 2097 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fct.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fct-389c5490.svg";

/***/ }),
/* 2098 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fil.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fil-a267769c.svg";

/***/ }),
/* 2099 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fjc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fjc-101a2f06.svg";

/***/ }),
/* 2100 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fldc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fldc-535b7c32.svg";

/***/ }),
/* 2101 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/flo.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/flo-a37ca4b2.svg";

/***/ }),
/* 2102 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/flux.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/flux-ef1c731a.svg";

/***/ }),
/* 2103 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fsn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fsn-1f81e27a.svg";

/***/ }),
/* 2104 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ftc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ftc-f69c1cd2.svg";

/***/ }),
/* 2105 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fuel.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fuel-27820fcb.svg";

/***/ }),
/* 2106 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/fun.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/fun-cb70d9c7.svg";

/***/ }),
/* 2107 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/game.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/game-fd3ee6b1.svg";

/***/ }),
/* 2108 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gas.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gas-162c83f4.svg";

/***/ }),
/* 2109 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gbp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gbp-699f3694.svg";

/***/ }),
/* 2110 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gbx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gbx-108e27b0.svg";

/***/ }),
/* 2111 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gbyte.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gbyte-374cbbd5.svg";

/***/ }),
/* 2112 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gin.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gin-9264b937.svg";

/***/ }),
/* 2113 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/glxt.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/glxt-12034b86.svg";

/***/ }),
/* 2114 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gmr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gmr-c3508d5c.svg";

/***/ }),
/* 2115 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gno.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gno-f98f395f.svg";

/***/ }),
/* 2116 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gnt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gnt-09af7cc3.svg";

/***/ }),
/* 2117 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gold.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gold-31ef4ff5.svg";

/***/ }),
/* 2118 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/grc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/grc-6c5cb432.svg";

/***/ }),
/* 2119 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/grin.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/grin-ede12e24.svg";

/***/ }),
/* 2120 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/grs.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/grs-df34763d.svg";

/***/ }),
/* 2121 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/grt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/grt-5198e609.svg";

/***/ }),
/* 2122 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gsc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gsc-4163b722.svg";

/***/ }),
/* 2123 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gto.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gto-01398c58.svg";

/***/ }),
/* 2124 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gup.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gup-9d9de852.svg";

/***/ }),
/* 2125 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gusd.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gusd-1829f2be.svg";

/***/ }),
/* 2126 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gvt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gvt-4737ffc8.svg";

/***/ }),
/* 2127 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gxs.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gxs-2ab1dce3.svg";

/***/ }),
/* 2128 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/gzr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/gzr-60a07ba8.svg";

/***/ }),
/* 2129 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/hight.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/hight-aca9da16.svg";

/***/ }),
/* 2130 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/hns.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/hns-a4d1790a.svg";

/***/ }),
/* 2131 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/hodl.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/hodl-e61456c0.svg";

/***/ }),
/* 2132 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/hot.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/hot-e55ca6c8.svg";

/***/ }),
/* 2133 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/hpb.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/hpb-b01a8b8f.svg";

/***/ }),
/* 2134 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/hsr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/hsr-984531a4.svg";

/***/ }),
/* 2135 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ht.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ht-94827edf.svg";

/***/ }),
/* 2136 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/html.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/html-bc9ef668.svg";

/***/ }),
/* 2137 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/huc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/huc-dd5b80c4.svg";

/***/ }),
/* 2138 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/husd.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/husd-7c2d8edd.svg";

/***/ }),
/* 2139 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/hush.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/hush-b3b5d25b.svg";

/***/ }),
/* 2140 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/icn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/icn-71cbc7da.svg";

/***/ }),
/* 2141 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/icp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/icp-34fe2840.svg";

/***/ }),
/* 2142 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/icx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/icx-d4726ba4.svg";

/***/ }),
/* 2143 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ignis.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ignis-403a33aa.svg";

/***/ }),
/* 2144 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ilk.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ilk-8b10e4a0.svg";

/***/ }),
/* 2145 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ink.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ink-d374eab2.svg";

/***/ }),
/* 2146 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ins.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ins-605bae8e.svg";

/***/ }),
/* 2147 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ion.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ion-48eb1d79.svg";

/***/ }),
/* 2148 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/iop.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/iop-955a5526.svg";

/***/ }),
/* 2149 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/iost.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/iost-3a33e41a.svg";

/***/ }),
/* 2150 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/iotx.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/iotx-804ed46a.svg";

/***/ }),
/* 2151 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/iq.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/iq-01284297.svg";

/***/ }),
/* 2152 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/itc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/itc-641f6987.svg";

/***/ }),
/* 2153 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/jnt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/jnt-b4676777.svg";

/***/ }),
/* 2154 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/jpy.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/jpy-01d086c8.svg";

/***/ }),
/* 2155 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/kcs.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/kcs-abb4b537.svg";

/***/ }),
/* 2156 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/kin.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/kin-e58f117e.svg";

/***/ }),
/* 2157 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/klown.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/klown-b5601fc7.svg";

/***/ }),
/* 2158 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/kmd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/kmd-c97be842.svg";

/***/ }),
/* 2159 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/knc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/knc-60f51407.svg";

/***/ }),
/* 2160 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/krb.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/krb-87eb071a.svg";

/***/ }),
/* 2161 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ksm.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ksm-5a5e51f6.svg";

/***/ }),
/* 2162 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/lbc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/lbc-72513205.svg";

/***/ }),
/* 2163 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/lend.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/lend-7c66149c.svg";

/***/ }),
/* 2164 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/leo.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/leo-8f51da3c.svg";

/***/ }),
/* 2165 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/link.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/link-3ebc2e0b.svg";

/***/ }),
/* 2166 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/lkk.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/lkk-b5ef3da1.svg";

/***/ }),
/* 2167 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/loom.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/loom-018a0d71.svg";

/***/ }),
/* 2168 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/lpt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/lpt-04f48778.svg";

/***/ }),
/* 2169 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/lrc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/lrc-16047b3a.svg";

/***/ }),
/* 2170 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/lsk.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/lsk-3615c313.svg";

/***/ }),
/* 2171 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ltc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ltc-838ffb04.svg";

/***/ }),
/* 2172 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/lun.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/lun-9ff9d894.svg";

/***/ }),
/* 2173 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/maid.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/maid-b283aa98.svg";

/***/ }),
/* 2174 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mana.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mana-87f6731c.svg";

/***/ }),
/* 2175 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/matic.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/matic-a3d0c752.svg";

/***/ }),
/* 2176 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/max.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/max-05e288e8.svg";

/***/ }),
/* 2177 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mcap.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mcap-f9c198ab.svg";

/***/ }),
/* 2178 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mco.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mco-38541ea5.svg";

/***/ }),
/* 2179 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mda.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mda-7d21a9fb.svg";

/***/ }),
/* 2180 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mds.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mds-91a352e7.svg";

/***/ }),
/* 2181 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/med.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/med-8fa084fb.svg";

/***/ }),
/* 2182 */
/*!*****************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/meetone.svg ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/meetone-ef2cafdf.svg";

/***/ }),
/* 2183 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mft.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mft-e48b8d36.svg";

/***/ }),
/* 2184 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/miota.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/miota-3509dfd9.svg";

/***/ }),
/* 2185 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mith.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mith-56065d97.svg";

/***/ }),
/* 2186 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mkr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mkr-a8589c3c.svg";

/***/ }),
/* 2187 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mln.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mln-97903757.svg";

/***/ }),
/* 2188 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mnx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mnx-9ada20c9.svg";

/***/ }),
/* 2189 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mnz.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mnz-05371820.svg";

/***/ }),
/* 2190 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/moac.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/moac-478fad90.svg";

/***/ }),
/* 2191 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mod.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mod-9a6cd85c.svg";

/***/ }),
/* 2192 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mona.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mona-9823b12c.svg";

/***/ }),
/* 2193 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/msr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/msr-b6ea3b97.svg";

/***/ }),
/* 2194 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mth.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mth-f76e7f24.svg";

/***/ }),
/* 2195 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mtl.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mtl-ca19fdf1.svg";

/***/ }),
/* 2196 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/music.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/music-1c559796.svg";

/***/ }),
/* 2197 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/mzc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/mzc-7fa8752f.svg";

/***/ }),
/* 2198 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nano.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nano-ed8bb567.svg";

/***/ }),
/* 2199 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nas.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nas-f5895d63.svg";

/***/ }),
/* 2200 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nav.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nav-5fd3e8dd.svg";

/***/ }),
/* 2201 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ncash.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ncash-c066b7e3.svg";

/***/ }),
/* 2202 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ndz.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ndz-74b0fc86.svg";

/***/ }),
/* 2203 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nebl.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nebl-7cb5a94b.svg";

/***/ }),
/* 2204 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/neo.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/neo-162c83f4.svg";

/***/ }),
/* 2205 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/neos.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/neos-9036ac89.svg";

/***/ }),
/* 2206 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/neu.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/neu-d0de1aeb.svg";

/***/ }),
/* 2207 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nexo.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nexo-0b1c4fbb.svg";

/***/ }),
/* 2208 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ngc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ngc-da961611.svg";

/***/ }),
/* 2209 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nio.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nio-d1bfe1d3.svg";

/***/ }),
/* 2210 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nkn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nkn-5423d714.svg";

/***/ }),
/* 2211 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nlc2.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nlc2-87e6beb2.svg";

/***/ }),
/* 2212 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nlg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nlg-b2c01f87.svg";

/***/ }),
/* 2213 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nmc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nmc-a011c155.svg";

/***/ }),
/* 2214 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nmr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nmr-7eed86f9.svg";

/***/ }),
/* 2215 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/npxs.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/npxs-fc1fdf9f.svg";

/***/ }),
/* 2216 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ntbc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ntbc-46e85fbb.svg";

/***/ }),
/* 2217 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nuls.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nuls-a955e332.svg";

/***/ }),
/* 2218 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nxs.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nxs-46a7b657.svg";

/***/ }),
/* 2219 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/nxt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/nxt-94189e67.svg";

/***/ }),
/* 2220 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/oax.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/oax-9bf537de.svg";

/***/ }),
/* 2221 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ok.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ok-66b72e6a.svg";

/***/ }),
/* 2222 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/omg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/omg-58716e4c.svg";

/***/ }),
/* 2223 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/omni.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/omni-a7ef4ca1.svg";

/***/ }),
/* 2224 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/one.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/one-9bda9cbf.svg";

/***/ }),
/* 2225 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ong.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ong-f702beed.svg";

/***/ }),
/* 2226 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ont.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ont-1e16c71a.svg";

/***/ }),
/* 2227 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/oot.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/oot-39ebcc91.svg";

/***/ }),
/* 2228 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ost.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ost-2e593081.svg";

/***/ }),
/* 2229 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ox.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ox-b35995a3.svg";

/***/ }),
/* 2230 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/oxt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/oxt-3a6f46a1.svg";

/***/ }),
/* 2231 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/part.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/part-94375934.svg";

/***/ }),
/* 2232 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pasc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pasc-e03edb7b.svg";

/***/ }),
/* 2233 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pasl.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pasl-885b2a28.svg";

/***/ }),
/* 2234 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pax.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pax-c0ad073f.svg";

/***/ }),
/* 2235 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/paxg.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/paxg-a804c487.svg";

/***/ }),
/* 2236 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pay.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pay-1dfce236.svg";

/***/ }),
/* 2237 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/payx.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/payx-a38aef6d.svg";

/***/ }),
/* 2238 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pink.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pink-d0234539.svg";

/***/ }),
/* 2239 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pirl.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pirl-295db266.svg";

/***/ }),
/* 2240 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pivx.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pivx-b3e78275.svg";

/***/ }),
/* 2241 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/plr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/plr-0508dc91.svg";

/***/ }),
/* 2242 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/poa.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/poa-dfe1a59a.svg";

/***/ }),
/* 2243 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/poe.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/poe-90807e65.svg";

/***/ }),
/* 2244 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/polis.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/polis-bf27dacc.svg";

/***/ }),
/* 2245 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/poly.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/poly-3b28f3bd.svg";

/***/ }),
/* 2246 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pot.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pot-2edf9779.svg";

/***/ }),
/* 2247 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/powr.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/powr-3028e398.svg";

/***/ }),
/* 2248 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ppc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ppc-9b40716f.svg";

/***/ }),
/* 2249 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ppp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ppp-dd65f85e.svg";

/***/ }),
/* 2250 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ppt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ppt-103400ce.svg";

/***/ }),
/* 2251 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pre.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pre-f4d632b8.svg";

/***/ }),
/* 2252 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/prl.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/prl-7e69ad24.svg";

/***/ }),
/* 2253 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pungo.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pungo-3c05198e.svg";

/***/ }),
/* 2254 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/pura.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/pura-5cd3ee99.svg";

/***/ }),
/* 2255 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/qash.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/qash-937f2a50.svg";

/***/ }),
/* 2256 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/qiwi.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/qiwi-c7c88f5f.svg";

/***/ }),
/* 2257 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/qlc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/qlc-b012439f.svg";

/***/ }),
/* 2258 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/qrl.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/qrl-809b85a1.svg";

/***/ }),
/* 2259 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/qsp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/qsp-94a7a41c.svg";

/***/ }),
/* 2260 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/qtum.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/qtum-398da1c3.svg";

/***/ }),
/* 2261 */
/*!***********************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/r.svg ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/r-d5368f40.svg";

/***/ }),
/* 2262 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rads.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rads-a84b77e8.svg";

/***/ }),
/* 2263 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rap.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rap-de9e33b7.svg";

/***/ }),
/* 2264 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rcn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rcn-40ea594a.svg";

/***/ }),
/* 2265 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rdd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rdd-c1e19dcc.svg";

/***/ }),
/* 2266 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rdn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rdn-e79bc7fd.svg";

/***/ }),
/* 2267 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ren.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ren-7de2a1e0.svg";

/***/ }),
/* 2268 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rep.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rep-27b6fcdc.svg";

/***/ }),
/* 2269 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/repv2.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/repv2-41091c07.svg";

/***/ }),
/* 2270 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/req.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/req-0e178299.svg";

/***/ }),
/* 2271 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rhoc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rhoc-fdfd655e.svg";

/***/ }),
/* 2272 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ric.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ric-d27416d0.svg";

/***/ }),
/* 2273 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rise.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rise-e35f475e.svg";

/***/ }),
/* 2274 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rlc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rlc-beed0bcc.svg";

/***/ }),
/* 2275 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rpx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rpx-ee67d2b4.svg";

/***/ }),
/* 2276 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rub.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rub-9aac553d.svg";

/***/ }),
/* 2277 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/rvn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/rvn-253e4a2c.svg";

/***/ }),
/* 2278 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ryo.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ryo-40018dbd.svg";

/***/ }),
/* 2279 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/safe.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/safe-0cf7e8e7.svg";

/***/ }),
/* 2280 */
/*!******************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/safemoon.svg ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/safemoon-a4ea7a54.svg";

/***/ }),
/* 2281 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sai.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sai-7204949e.svg";

/***/ }),
/* 2282 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/salt.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/salt-8c1c0ebb.svg";

/***/ }),
/* 2283 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/san.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/san-db99b5ff.svg";

/***/ }),
/* 2284 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sand.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sand-90b5d812.svg";

/***/ }),
/* 2285 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sbd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sbd-f0b46acf.svg";

/***/ }),
/* 2286 */
/*!******************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sberbank.svg ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sberbank-f245b107.svg";

/***/ }),
/* 2287 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sc.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sc-c6076ab0.svg";

/***/ }),
/* 2288 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/shift.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/shift-511b26aa.svg";

/***/ }),
/* 2289 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sib.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sib-1045a353.svg";

/***/ }),
/* 2290 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sin.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sin-30eb2911.svg";

/***/ }),
/* 2291 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/skl.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/skl-d3869298.svg";

/***/ }),
/* 2292 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sky.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sky-947f30d8.svg";

/***/ }),
/* 2293 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/slr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/slr-ee6b4554.svg";

/***/ }),
/* 2294 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sls.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sls-dd84ceec.svg";

/***/ }),
/* 2295 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/smart.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/smart-97760a63.svg";

/***/ }),
/* 2296 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sngls.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sngls-f2ce5234.svg";

/***/ }),
/* 2297 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/snm.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/snm-321b671d.svg";

/***/ }),
/* 2298 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/snt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/snt-1ebd0d12.svg";

/***/ }),
/* 2299 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/snx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/snx-b44a74ce.svg";

/***/ }),
/* 2300 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/soc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/soc-7246c72b.svg";

/***/ }),
/* 2301 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sol.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sol-8cb1b5ca.svg";

/***/ }),
/* 2302 */
/*!*******************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/spacehbit.svg ***!
  \*******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/spacehbit-94cf4e43.svg";

/***/ }),
/* 2303 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/spank.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/spank-a8d93592.svg";

/***/ }),
/* 2304 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sphtx.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sphtx-1cdd3adc.svg";

/***/ }),
/* 2305 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/srn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/srn-f584a326.svg";

/***/ }),
/* 2306 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/stak.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/stak-57d1e4b6.svg";

/***/ }),
/* 2307 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/start.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/start-37ac5441.svg";

/***/ }),
/* 2308 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/steem.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/steem-0264d211.svg";

/***/ }),
/* 2309 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/storj.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/storj-897da608.svg";

/***/ }),
/* 2310 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/storm.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/storm-afb6bbd2.svg";

/***/ }),
/* 2311 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/stox.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/stox-7769f1cf.svg";

/***/ }),
/* 2312 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/stq.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/stq-be3b6387.svg";

/***/ }),
/* 2313 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/strat.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/strat-d4bfc97c.svg";

/***/ }),
/* 2314 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/stx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/stx-0279fff2.svg";

/***/ }),
/* 2315 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sub.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sub-55eebc93.svg";

/***/ }),
/* 2316 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sumo.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sumo-49d70d19.svg";

/***/ }),
/* 2317 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sushi.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sushi-577909b6.svg";

/***/ }),
/* 2318 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/sys.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/sys-e713b050.svg";

/***/ }),
/* 2319 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/taas.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/taas-4498e245.svg";

/***/ }),
/* 2320 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tau.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tau-5acf1177.svg";

/***/ }),
/* 2321 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tbx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tbx-81cd1bbb.svg";

/***/ }),
/* 2322 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tel.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tel-a9928fe6.svg";

/***/ }),
/* 2323 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ten.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ten-50961cb5.svg";

/***/ }),
/* 2324 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tern.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tern-a9ab6a29.svg";

/***/ }),
/* 2325 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tgch.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tgch-0e1668c2.svg";

/***/ }),
/* 2326 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/theta.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/theta-21475b4c.svg";

/***/ }),
/* 2327 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tix.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tix-ecd1fe1a.svg";

/***/ }),
/* 2328 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tkn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tkn-1569505f.svg";

/***/ }),
/* 2329 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tks.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tks-edac1f4b.svg";

/***/ }),
/* 2330 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tnb.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tnb-4c93c507.svg";

/***/ }),
/* 2331 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tnc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tnc-8564fcdf.svg";

/***/ }),
/* 2332 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tnt.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tnt-e31024ea.svg";

/***/ }),
/* 2333 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tomo.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tomo-cadc8975.svg";

/***/ }),
/* 2334 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tpay.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tpay-e203fa16.svg";

/***/ }),
/* 2335 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/trig.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/trig-377b119f.svg";

/***/ }),
/* 2336 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/trtl.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/trtl-cabdc0f2.svg";

/***/ }),
/* 2337 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/trx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/trx-af76acb3.svg";

/***/ }),
/* 2338 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tusd.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tusd-93a09e0f.svg";

/***/ }),
/* 2339 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/tzc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/tzc-1010b872.svg";

/***/ }),
/* 2340 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/ubq.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/ubq-5bee7522.svg";

/***/ }),
/* 2341 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/uma.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/uma-13e117ba.svg";

/***/ }),
/* 2342 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/uni.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/uni-ab4db51d.svg";

/***/ }),
/* 2343 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/unity.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/unity-f632401a.svg";

/***/ }),
/* 2344 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/usd.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/usd-56b672ee.svg";

/***/ }),
/* 2345 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/usdc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/usdc-181a0b4d.svg";

/***/ }),
/* 2346 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/usdt.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/usdt-2c1060db.svg";

/***/ }),
/* 2347 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/utk.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/utk-ca265221.svg";

/***/ }),
/* 2348 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/veri.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/veri-76f80554.svg";

/***/ }),
/* 2349 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vet.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vet-a454f53d.svg";

/***/ }),
/* 2350 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/via.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/via-b8570da9.svg";

/***/ }),
/* 2351 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vib.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vib-df6b08c7.svg";

/***/ }),
/* 2352 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vibe.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vibe-f46e82ca.svg";

/***/ }),
/* 2353 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vivo.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vivo-55f9eed6.svg";

/***/ }),
/* 2354 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vrc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vrc-b5938a64.svg";

/***/ }),
/* 2355 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vrsc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vrsc-12aafadf.svg";

/***/ }),
/* 2356 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vtc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vtc-c21a0962.svg";

/***/ }),
/* 2357 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/vtho.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/vtho-2a7b6a66.svg";

/***/ }),
/* 2358 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wabi.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wabi-fd1a8196.svg";

/***/ }),
/* 2359 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wan.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wan-668a2025.svg";

/***/ }),
/* 2360 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/waves.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/waves-2c95a006.svg";

/***/ }),
/* 2361 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wax.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wax-81539a06.svg";

/***/ }),
/* 2362 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wbtc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wbtc-2d930bb6.svg";

/***/ }),
/* 2363 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wgr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wgr-82a670d5.svg";

/***/ }),
/* 2364 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wicc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wicc-a050e9eb.svg";

/***/ }),
/* 2365 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wings.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wings-a66b697a.svg";

/***/ }),
/* 2366 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wpr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wpr-984ebcaa.svg";

/***/ }),
/* 2367 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/wtc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/wtc-18a1969e.svg";

/***/ }),
/* 2368 */
/*!***********************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/x.svg ***!
  \***********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/x-aba130a6.svg";

/***/ }),
/* 2369 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xas.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xas-af1e613c.svg";

/***/ }),
/* 2370 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xbc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xbc-df375823.svg";

/***/ }),
/* 2371 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xbp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xbp-7c5f8ab2.svg";

/***/ }),
/* 2372 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xby.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xby-6d6b1878.svg";

/***/ }),
/* 2373 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xcp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xcp-195c2846.svg";

/***/ }),
/* 2374 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xdn.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xdn-1d79075c.svg";

/***/ }),
/* 2375 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xem.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xem-87079f2e.svg";

/***/ }),
/* 2376 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xin.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xin-0a574d07.svg";

/***/ }),
/* 2377 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xlm.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xlm-c977c23c.svg";

/***/ }),
/* 2378 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xmcc.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xmcc-fda7af63.svg";

/***/ }),
/* 2379 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xmg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xmg-26e90c14.svg";

/***/ }),
/* 2380 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xmo.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xmo-24988196.svg";

/***/ }),
/* 2381 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xmr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xmr-111bce71.svg";

/***/ }),
/* 2382 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xmy.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xmy-4f98f317.svg";

/***/ }),
/* 2383 */
/*!************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xp.svg ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xp-6b56d1b5.svg";

/***/ }),
/* 2384 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xpa.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xpa-0bddb65b.svg";

/***/ }),
/* 2385 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xpm.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xpm-bfa051f3.svg";

/***/ }),
/* 2386 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xpr.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xpr-c621c771.svg";

/***/ }),
/* 2387 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xrp.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xrp-d8e11d09.svg";

/***/ }),
/* 2388 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xsg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xsg-3d35e0df.svg";

/***/ }),
/* 2389 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xtz.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xtz-497d0566.svg";

/***/ }),
/* 2390 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xuc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xuc-8d43a9fa.svg";

/***/ }),
/* 2391 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xvc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xvc-1b59bc17.svg";

/***/ }),
/* 2392 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xvg.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xvg-cb3eb231.svg";

/***/ }),
/* 2393 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/xzc.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/xzc-85037395.svg";

/***/ }),
/* 2394 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/yfi.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/yfi-421d02f2.svg";

/***/ }),
/* 2395 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/yoyow.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/yoyow-d75f57e1.svg";

/***/ }),
/* 2396 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zcl.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zcl-034cdefa.svg";

/***/ }),
/* 2397 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zec.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zec-9ae3ebd3.svg";

/***/ }),
/* 2398 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zel.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zel-8095f7aa.svg";

/***/ }),
/* 2399 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zen.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zen-6abc0325.svg";

/***/ }),
/* 2400 */
/*!**************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zest.svg ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zest-1bc0c098.svg";

/***/ }),
/* 2401 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zil.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zil-558c2d56.svg";

/***/ }),
/* 2402 */
/*!***************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zilla.svg ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zilla-dce6b094.svg";

/***/ }),
/* 2403 */
/*!*************************************************************!*\
  !*** ./node_modules/cryptocurrency-icons/svg/color/zrx.svg ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/images/crypto/zrx-e61d1eb1.svg";

/***/ }),
/* 2404 */
/*!*****************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/qrcode.svg ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
module.exports = __webpack_require__.p + "packs/icons/qrcode-2f0624c5.svg";

/***/ }),
/* 2405 */
/*!***********************************************************************************!*\
  !*** ./app/soapbox/features/crypto_donate/components/detailed_crypto_address.tsx ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var qrcode_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! qrcode.react */ 1689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/forms */ 626);
/* harmony import */ var _utils_block_explorer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/block_explorer */ 1827);
/* harmony import */ var _utils_coin_db__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/coin_db */ 1828);
/* harmony import */ var _crypto_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./crypto_icon */ 1829);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/crypto_donate/components/detailed_crypto_address.tsx";







var DetailedCryptoAddress = function (_ref) {
    var address = _ref.address, ticker = _ref.ticker, note = _ref.note;
    var title = (0,_utils_coin_db__WEBPACK_IMPORTED_MODULE_5__.getTitle)(ticker);
    var explorerUrl = (0,_utils_block_explorer__WEBPACK_IMPORTED_MODULE_4__.getExplorerUrl)(ticker, address);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "crypto-address",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "crypto-address__head",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(_crypto_icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
        className: "crypto-address__icon",
        ticker: ticker,
        title: title,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "crypto-address__title",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 9
        }
    }, title || ticker.toUpperCase()), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "crypto-address__actions",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 9
        }
    }, explorerUrl && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
        href: explorerUrl,
        target: "_blank",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 27
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
        src: __webpack_require__(/*! @tabler/icons/external-link.svg */ 448),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 13
        }
    })))), note && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "crypto-address__note",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 16
        }
    }, note), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "crypto-address__qrcode",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(qrcode_react__WEBPACK_IMPORTED_MODULE_0__.QRCodeCanvas, {
        value: address,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "crypto-address__address simple_form",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.CopyableInput, {
        value: address,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (DetailedCryptoAddress);


/***/ })
])]);
//# sourceMappingURL=crypto_donate-7e49e52011a6819af87a.chunk.js.map