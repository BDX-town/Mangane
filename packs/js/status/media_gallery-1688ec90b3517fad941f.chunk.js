"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[210],{

/***/ 2025:
/*!*************************************************!*\
  !*** ./app/soapbox/components/media_gallery.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MediaGallery; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-proptypes */ 300);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 51);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/blurhash */ 377);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/icon */ 25);
/* harmony import */ var soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/still_image */ 303);
/* harmony import */ var soapbox_features_compose_components_upload__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/features/compose/components/upload */ 974);
/* harmony import */ var soapbox_utils_media__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/utils/media */ 510);
/* harmony import */ var _is_mobile__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../is_mobile */ 65);
/* harmony import */ var _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/media_aspect_ratio */ 980);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ui */ 1);
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
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/media_gallery.js", _dec2, _class3, _class4;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }
















var ATTACHMENT_LIMIT = 4;
var MAX_FILENAME_LENGTH = 45;
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_15__.defineMessages)({
    toggle_visible: {
        "id": "media_gallery.toggle_visible",
        "defaultMessage": "Hide"
    }
});
var mapStateToItemProps = function (state) { return ({
    autoPlayGif: (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_6__.getSettings)(state).get('autoPlayGif')
}); };
var withinLimits = function (aspectRatio) {
    return aspectRatio >= _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.minimumAspectRatio && aspectRatio <= _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio;
};
var shouldLetterbox = function (attachment) {
    var aspectRatio = attachment.getIn(['meta', 'original', 'aspect']);
    if (!aspectRatio)
        return true;
    return !withinLimits(aspectRatio);
};
var Item = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.connect)(mapStateToItemProps), _dec(_class = (_class2 = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            loaded: false
        });
        _defineProperty(_this, "handleMouseEnter", function (e) {
            if (_this.hoverToPlay()) {
                e.target.play();
            }
        });
        _defineProperty(_this, "handleMouseLeave", function (e) {
            if (_this.hoverToPlay()) {
                e.target.pause();
                e.target.currentTime = 0;
            }
        });
        _defineProperty(_this, "handleClick", function (e) {
            var _a = _this.props, index = _a.index, onClick = _a.onClick;
            if ((0,_is_mobile__WEBPACK_IMPORTED_MODULE_12__.isIOS)() && !e.target.autoPlay) {
                e.target.autoPlay = true;
                e.preventDefault();
            }
            else {
                if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
                    if (_this.hoverToPlay()) {
                        e.target.pause();
                        e.target.currentTime = 0;
                    }
                    e.preventDefault();
                    onClick(index);
                }
            }
            e.stopPropagation();
        });
        _defineProperty(_this, "handleImageLoad", function () {
            _this.setState({
                loaded: true
            });
        });
        _defineProperty(_this, "handleVideoHover", function (_ref) {
            var video = _ref.target;
            video.playbackRate = 3.0;
            video.play();
        });
        _defineProperty(_this, "handleVideoLeave", function (_ref2) {
            var video = _ref2.target;
            video.pause();
            video.currentTime = 0;
        });
        return _this;
    }
    Item.prototype.hoverToPlay = function () {
        var _a = this.props, attachment = _a.attachment, autoPlayGif = _a.autoPlayGif;
        return !autoPlayGif && attachment.get('type') === 'gifv';
    };
    Item.prototype.render = function () {
        var _a = this.props, attachment = _a.attachment, standalone = _a.standalone, visible = _a.visible, dimensions = _a.dimensions, autoPlayGif = _a.autoPlayGif, last = _a.last, total = _a.total;
        var width = 100;
        var height = '100%';
        var top = 'auto';
        var left = 'auto';
        var bottom = 'auto';
        var right = 'auto';
        var float = 'left';
        var position = 'relative';
        if (dimensions) {
            width = dimensions.w;
            height = dimensions.h;
            top = dimensions.t || 'auto';
            right = dimensions.r || 'auto';
            bottom = dimensions.b || 'auto';
            left = dimensions.l || 'auto';
            float = dimensions.float || 'left';
            position = dimensions.pos || 'relative';
        }
        var thumbnail = '';
        if (attachment.get('type') === 'unknown') {
            var filename = (0,soapbox_utils_media__WEBPACK_IMPORTED_MODULE_11__.truncateFilename)(attachment.get('remote_url'), MAX_FILENAME_LENGTH);
            var attachmentIcon = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
                className: "h-16 w-16 text-gray-800 dark:text-gray-200",
                src: soapbox_features_compose_components_upload__WEBPACK_IMPORTED_MODULE_10__.MIMETYPE_ICONS[attachment.getIn(['pleroma', 'mime_type'])] || __webpack_require__(/*! @tabler/icons/paperclip.svg */ 322),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 150,
                    columnNumber: 9
                }
            });
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery__item', {
                    standalone: standalone
                }),
                key: attachment.get('id'),
                style: {
                    position: position,
                    float: float,
                    left: left,
                    top: top,
                    right: right,
                    bottom: bottom,
                    height: height,
                    width: "".concat(width, "%")
                },
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 157,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
                className: "media-gallery__item-thumbnail",
                href: attachment.get('remote_url'),
                target: "_blank",
                style: {
                    cursor: 'pointer'
                },
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 158,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_7__["default"], {
                hash: attachment.get('blurhash'),
                className: "media-gallery__preview",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 159,
                    columnNumber: 13
                }
            }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
                className: "media-gallery__item__icons",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 160,
                    columnNumber: 13
                }
            }, attachmentIcon), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
                className: "media-gallery__filename__label",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 161,
                    columnNumber: 13
                }
            }, filename)));
        }
        else if (attachment.get('type') === 'image') {
            var originalUrl = attachment.get('url');
            var letterboxed = shouldLetterbox(attachment);
            thumbnail = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
                className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery__item-thumbnail', {
                    letterboxed: letterboxed
                }),
                href: attachment.get('remote_url') || originalUrl,
                onClick: this.handleClick,
                target: "_blank",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 170,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_9__["default"], {
                src: originalUrl,
                alt: attachment.get('description'),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 176,
                    columnNumber: 11
                }
            }));
        }
        else if (attachment.get('type') === 'gifv') {
            var conditionalAttributes = {};
            if ((0,_is_mobile__WEBPACK_IMPORTED_MODULE_12__.isIOS)()) {
                conditionalAttributes.playsInline = '1';
            }
            if (autoPlayGif) {
                conditionalAttributes.autoPlay = '1';
            }
            thumbnail = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
                className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery__gifv', {
                    autoplay: autoPlayGif
                }),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 189,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("video", _extends({
                className: "media-gallery__item-gifv-thumbnail",
                "aria-label": attachment.get('description'),
                title: attachment.get('description'),
                role: "application",
                src: attachment.get('url'),
                onClick: this.handleClick,
                onMouseEnter: this.handleMouseEnter,
                onMouseLeave: this.handleMouseLeave,
                loop: true,
                muted: true
            }, conditionalAttributes, {
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 190,
                    columnNumber: 11
                }
            })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
                className: "media-gallery__gifv__label",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 204,
                    columnNumber: 11
                }
            }, "GIF"));
        }
        else if (attachment.get('type') === 'audio') {
            var ext = attachment.get('url').split('.').pop().toUpperCase();
            thumbnail = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
                className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery__item-thumbnail'),
                href: attachment.get('url'),
                onClick: this.handleClick,
                target: "_blank",
                alt: attachment.get('description'),
                title: attachment.get('description'),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 210,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
                className: "media-gallery__item__icons",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 218,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
                src: __webpack_require__(/*! @tabler/icons/volume.svg */ 498),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 218,
                    columnNumber: 56
                }
            })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
                className: "media-gallery__file-extension__label",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 219,
                    columnNumber: 11
                }
            }, ext));
        }
        else if (attachment.get('type') === 'video') {
            var ext = attachment.get('url').split('.').pop().toUpperCase();
            thumbnail = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
                className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery__item-thumbnail'),
                href: attachment.get('url'),
                onClick: this.handleClick,
                target: "_blank",
                alt: attachment.get('description'),
                title: attachment.get('description'),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 225,
                    columnNumber: 9
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("video", {
                muted: true,
                loop: true,
                onMouseOver: this.handleVideoHover,
                onMouseOut: this.handleVideoLeave,
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 233,
                    columnNumber: 11
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("source", {
                src: attachment.get('url'),
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 239,
                    columnNumber: 13
                }
            })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("span", {
                className: "media-gallery__file-extension__label",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 241,
                    columnNumber: 11
                }
            }, ext));
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery__item', "media-gallery__item--".concat(attachment.get('type')), {
                standalone: standalone
            }),
            key: attachment.get('id'),
            style: {
                position: position,
                float: float,
                left: left,
                top: top,
                right: right,
                bottom: bottom,
                height: height,
                width: "".concat(width, "%")
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 247,
                columnNumber: 7
            }
        }, last && total > ATTACHMENT_LIMIT && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "media-gallery__item-overflow",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 249,
                columnNumber: 11
            }
        }, "+", total - ATTACHMENT_LIMIT + 1), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_blurhash__WEBPACK_IMPORTED_MODULE_7__["default"], {
            hash: attachment.get('blurhash'),
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery__preview', {
                'media-gallery__preview--hidden': visible && this.state.loaded
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 253,
                columnNumber: 9
            }
        }), visible && thumbnail);
    };
    return Item;
}(react__WEBPACK_IMPORTED_MODULE_3__.PureComponent)), _defineProperty(_class2, "propTypes", {
    attachment: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().record.isRequired),
    standalone: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    index: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number.isRequired),
    size: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number.isRequired),
    onClick: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
    displayWidth: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
    visible: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool.isRequired),
    dimensions: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object),
    autoPlayGif: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    last: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    total: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number)
}), _defineProperty(_class2, "defaultProps", {
    standalone: false,
    index: 0,
    size: 1
}), _class2)) || _class);
var mapStateToMediaGalleryProps = function (state) { return ({
    displayMedia: (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_6__.getSettings)(state).get('displayMedia')
}); };
var MediaGallery = (_dec2 = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.connect)(mapStateToMediaGalleryProps), _dec2(_class3 = (0,react_intl__WEBPACK_IMPORTED_MODULE_16__["default"])(_class3 = (_class4 = /** @class */ (function (_super) {
    __extends(MediaGallery, _super);
    function MediaGallery() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            visible: _this.props.visible !== undefined ? _this.props.visible : _this.props.displayMedia !== 'hide_all' && !_this.props.sensitive || _this.props.displayMedia === 'show_all',
            width: _this.props.defaultWidth
        });
        _defineProperty(_this, "handleOpen", function (e) {
            e.stopPropagation();
            if (_this.props.onToggleVisibility) {
                _this.props.onToggleVisibility();
            }
            else {
                _this.setState({
                    visible: !_this.state.visible
                });
            }
        });
        _defineProperty(_this, "handleClick", function (index) {
            _this.props.onOpenMedia(_this.props.media, index);
        });
        _defineProperty(_this, "handleRef", function (node) {
            if (node) {
                // offsetWidth triggers a layout, so only calculate when we need to
                if (_this.props.cacheWidth)
                    _this.props.cacheWidth(node.offsetWidth);
                _this.setState({
                    width: node.offsetWidth
                });
            }
        });
        _defineProperty(_this, "getSizeDataSingle", function () {
            var _a = _this.props, media = _a.media, defaultWidth = _a.defaultWidth;
            var width = _this.state.width || defaultWidth;
            var aspectRatio = media.getIn([0, 'meta', 'original', 'aspect']);
            var getHeight = function () {
                if (!aspectRatio)
                    return width * 9 / 16;
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(aspectRatio))
                    return Math.floor(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio);
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(aspectRatio))
                    return Math.floor(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.minimumAspectRatio);
                return Math.floor(width / aspectRatio);
            };
            return (0,immutable__WEBPACK_IMPORTED_MODULE_17__.Map)({
                style: {
                    height: getHeight()
                },
                itemsDimensions: [],
                size: 1,
                width: width
            });
        });
        _defineProperty(_this, "getSizeDataMultiple", function (size) {
            var _a = _this.props, media = _a.media, defaultWidth = _a.defaultWidth;
            var width = _this.state.width || defaultWidth;
            var panoSize = Math.floor(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio);
            var panoSize_px = "".concat(Math.floor(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio), "px");
            var style = {};
            var itemsDimensions = [];
            var ratios = Array(size).fill().map(function (_, i) { return media.getIn([i, 'meta', 'original', 'aspect']); });
            var ar1 = ratios[0], ar2 = ratios[1], ar3 = ratios[2], ar4 = ratios[3];
            if (size === 2) {
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2)) {
                    style.height = width - width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio;
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2)) {
                    style.height = panoSize * 2;
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2)) {
                    style.height = width * 0.6 + width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio;
                }
                else {
                    style.height = width / 2;
                } //
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2)) {
                    itemsDimensions = [{
                            w: 50,
                            h: '100%',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '100%',
                            l: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2)) {
                    itemsDimensions = [{
                            w: 100,
                            h: panoSize_px,
                            b: '2px'
                        }, {
                            w: 100,
                            h: panoSize_px,
                            t: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2)) {
                    itemsDimensions = [{
                            w: 100,
                            h: "".concat(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio, "px"),
                            b: '2px'
                        }, {
                            w: 100,
                            h: "".concat(width * 0.6, "px"),
                            t: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2)) {
                    itemsDimensions = [{
                            w: 100,
                            h: "".concat(width * 0.6, "px"),
                            b: '2px'
                        }, {
                            w: 100,
                            h: "".concat(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.maximumAspectRatio, "px"),
                            t: '2px'
                        }];
                }
                else {
                    itemsDimensions = [{
                            w: 50,
                            h: '100%',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '100%',
                            l: '2px'
                        }];
                }
            }
            else if (size === 3) {
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3)) {
                    style.height = panoSize * 3;
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3)) {
                    style.height = Math.floor(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.minimumAspectRatio);
                }
                else {
                    style.height = width;
                } //
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3)) {
                    itemsDimensions = [{
                            w: 100,
                            h: '50%',
                            b: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            t: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            t: '2px',
                            l: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3)) {
                    itemsDimensions = [{
                            w: 100,
                            h: panoSize_px,
                            b: '4px'
                        }, {
                            w: 100,
                            h: panoSize_px
                        }, {
                            w: 100,
                            h: panoSize_px,
                            t: '4px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3)) {
                    itemsDimensions = [{
                            w: 50,
                            h: '100%',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            b: '2px',
                            l: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            t: '2px',
                            l: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3)) {
                    itemsDimensions = [{
                            w: 50,
                            h: '50%',
                            b: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            l: '-2px',
                            b: '-2px',
                            pos: 'absolute',
                            float: 'none'
                        }, {
                            w: 50,
                            h: '100%',
                            r: '-2px',
                            t: '0px',
                            b: '0px',
                            pos: 'absolute',
                            float: 'none'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3)) {
                    itemsDimensions = [{
                            w: 50,
                            h: '50%',
                            b: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '100%',
                            l: '2px',
                            float: 'right'
                        }, {
                            w: 50,
                            h: '50%',
                            t: '2px',
                            r: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3)) {
                    itemsDimensions = [{
                            w: 50,
                            h: panoSize_px,
                            b: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: panoSize_px,
                            b: '2px',
                            l: '2px'
                        }, {
                            w: 100,
                            h: "".concat(width - panoSize, "px"),
                            t: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3)) {
                    itemsDimensions = [{
                            w: 100,
                            h: "".concat(width - panoSize, "px"),
                            b: '2px'
                        }, {
                            w: 50,
                            h: panoSize_px,
                            t: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: panoSize_px,
                            t: '2px',
                            l: '2px'
                        }];
                }
                else {
                    itemsDimensions = [{
                            w: 50,
                            h: '50%',
                            b: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            b: '2px',
                            l: '2px'
                        }, {
                            w: 100,
                            h: '50%',
                            t: '2px'
                        }];
                }
            }
            else if (size >= 4) {
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar4) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar4) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar4) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar4) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar4)) {
                    style.height = Math.floor(width / _utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.minimumAspectRatio);
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar4)) {
                    style.height = panoSize * 2;
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar4) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar4)) {
                    style.height = panoSize + width / 2;
                }
                else {
                    style.height = width;
                } //
                if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar4)) {
                    itemsDimensions = [{
                            w: 50,
                            h: panoSize_px,
                            b: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: panoSize_px,
                            b: '2px',
                            l: '2px'
                        }, {
                            w: 50,
                            h: "".concat(width / 2, "px"),
                            t: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: "".concat(width / 2, "px"),
                            t: '2px',
                            l: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar4)) {
                    itemsDimensions = [{
                            w: 50,
                            h: "".concat(width / 2, "px"),
                            b: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: "".concat(width / 2, "px"),
                            b: '2px',
                            l: '2px'
                        }, {
                            w: 50,
                            h: panoSize_px,
                            t: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: panoSize_px,
                            t: '2px',
                            l: '2px'
                        }];
                }
                else if ((0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isNonConformingRatio)(ar4) || (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPortrait)(ar1) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar2) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar3) && (0,_utils_media_aspect_ratio__WEBPACK_IMPORTED_MODULE_13__.isPanoramic)(ar4)) {
                    itemsDimensions = [{
                            w: 67,
                            h: '100%',
                            r: '2px'
                        }, {
                            w: 33,
                            h: '33%',
                            b: '4px',
                            l: '2px'
                        }, {
                            w: 33,
                            h: '33%',
                            l: '2px'
                        }, {
                            w: 33,
                            h: '33%',
                            t: '4px',
                            l: '2px'
                        }];
                }
                else {
                    itemsDimensions = [{
                            w: 50,
                            h: '50%',
                            b: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            b: '2px',
                            l: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            t: '2px',
                            r: '2px'
                        }, {
                            w: 50,
                            h: '50%',
                            t: '2px',
                            l: '2px'
                        }];
                }
            }
            return (0,immutable__WEBPACK_IMPORTED_MODULE_17__.Map)({
                style: style,
                itemsDimensions: itemsDimensions,
                size: size,
                width: width
            });
        });
        _defineProperty(_this, "getSizeData", function (size) {
            var _a = _this.props, height = _a.height, defaultWidth = _a.defaultWidth;
            var width = _this.state.width || defaultWidth;
            if (width) {
                if (size === 1)
                    return _this.getSizeDataSingle();
                if (size > 1)
                    return _this.getSizeDataMultiple(size);
            } // Default
            return (0,immutable__WEBPACK_IMPORTED_MODULE_17__.Map)({
                style: {
                    height: height
                },
                itemsDimensions: [],
                size: size,
                width: width
            });
        });
        return _this;
    }
    MediaGallery.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, media = _a.media, visible = _a.visible, sensitive = _a.sensitive;
        if (!(0,immutable__WEBPACK_IMPORTED_MODULE_17__.is)(media, prevProps.media) && visible === undefined) {
            this.setState({
                visible: prevProps.displayMedia !== 'hide_all' && !sensitive || prevProps.displayMedia === 'show_all'
            });
        }
        else if (!(0,immutable__WEBPACK_IMPORTED_MODULE_17__.is)(visible, prevProps.visible) && visible !== undefined) {
            this.setState({
                visible: visible
            });
        }
    };
    MediaGallery.prototype.render = function () {
        var _this = this;
        var _a = this.props, media = _a.media, intl = _a.intl, sensitive = _a.sensitive, compact = _a.compact;
        var visible = this.state.visible;
        var sizeData = this.getSizeData(media.size);
        var children = media.take(ATTACHMENT_LIMIT).map(function (attachment, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(Item, {
            key: attachment.get('id'),
            onClick: _this.handleClick,
            attachment: attachment,
            index: i,
            size: sizeData.get('size'),
            displayWidth: sizeData.get('width'),
            visible: visible,
            dimensions: sizeData.get('itemsDimensions')[i],
            last: i === ATTACHMENT_LIMIT - 1,
            total: media.size,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 576,
                columnNumber: 7
            }
        }); });
        var warning;
        if (sensitive) {
            warning = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_18__["default"], {
                id: "status.sensitive_warning",
                defaultMessage: "Sensitive content",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 593,
                    columnNumber: 17
                }
            });
        }
        else {
            warning = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_18__["default"], {
                id: "status.media_hidden",
                defaultMessage: "Media hidden",
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 595,
                    columnNumber: 17
                }
            });
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-gallery', {
                'media-gallery--compact': compact
            }),
            style: sizeData.get('style'),
            ref: this.handleRef,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 599,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('spoiler-button', {
                'spoiler-button--minified': visible || compact
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 600,
                columnNumber: 9
            }
        }, visible || compact ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui__WEBPACK_IMPORTED_MODULE_14__.Button, {
            text: intl.formatMessage(messages.toggle_visible),
            icon: visible ? __webpack_require__(/*! @tabler/icons/eye-off.svg */ 131) : __webpack_require__(/*! @tabler/icons/eye.svg */ 871),
            onClick: this.handleOpen,
            theme: "transparent",
            size: "sm",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 603,
                columnNumber: 15
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("button", {
            type: "button",
            onClick: this.handleOpen,
            className: "bg-transparent w-full h-full border-0",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 611,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "p-4 rounded-xl shadow-xl backdrop-blur-sm bg-white/75 dark:bg-slate-800/75 text-center inline-block space-y-4 max-w-[280px]",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 612,
                columnNumber: 17
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "space-y-1",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 613,
                columnNumber: 19
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui__WEBPACK_IMPORTED_MODULE_14__.Text, {
            weight: "semibold",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 614,
                columnNumber: 21
            }
        }, warning), sensitive && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui__WEBPACK_IMPORTED_MODULE_14__.Text, {
            size: "sm",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 617,
                columnNumber: 25
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_18__["default"], {
            id: "status.sensitive_warning.subtitle",
            defaultMessage: "This content may not be suitable for all audiences.",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 618,
                columnNumber: 27
            }
        }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_ui__WEBPACK_IMPORTED_MODULE_14__.Button, {
            type: "button",
            theme: "primary",
            size: "sm",
            icon: __webpack_require__(/*! @tabler/icons/eye.svg */ 871),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 623,
                columnNumber: 19
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_18__["default"], {
            id: "status.sensitive_warning.action",
            defaultMessage: "Show content",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 624,
                columnNumber: 21
            }
        }))))), children);
    };
    return MediaGallery;
}(react__WEBPACK_IMPORTED_MODULE_3__.PureComponent)), _defineProperty(_class4, "propTypes", {
    sensitive: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    standalone: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    media: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().list.isRequired),
    size: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object),
    height: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number.isRequired),
    onOpenMedia: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
    defaultWidth: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
    cacheWidth: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
    visible: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool),
    onToggleVisibility: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func),
    displayMedia: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    compact: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().bool)
}), _defineProperty(_class4, "defaultProps", {
    standalone: false
}), _class4)) || _class3) || _class3);



/***/ })

}]);
//# sourceMappingURL=media_gallery-1688ec90b3517fad941f.chunk.js.map