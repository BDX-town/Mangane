"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[58],{

/***/ 1644:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/onboarding/onboarding-wizard.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_swipeable_views__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-swipeable-views */ 1381);
/* harmony import */ var soapbox_actions_onboarding__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/onboarding */ 188);
/* harmony import */ var soapbox_components_landing_gradient__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/landing-gradient */ 266);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var _steps_avatar_selection_step__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./steps/avatar-selection-step */ 2476);
/* harmony import */ var _steps_bio_step__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./steps/bio-step */ 2477);
/* harmony import */ var _steps_completed_step__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./steps/completed-step */ 2478);
/* harmony import */ var _steps_cover_photo_selection_step__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./steps/cover-photo-selection-step */ 2480);
/* harmony import */ var _steps_display_name_step__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./steps/display-name-step */ 2481);
/* harmony import */ var _steps_feeds__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./steps/feeds */ 2482);
/* harmony import */ var _steps_how_it_works__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./steps/how-it-works */ 2483);
/* harmony import */ var _steps_privacy__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./steps/privacy */ 2484);
/* harmony import */ var _steps_welcome__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./steps/welcome */ 2485);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/onboarding-wizard.tsx";

















var OnboardingWizard = function () {
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();
    var _a = react__WEBPACK_IMPORTED_MODULE_2__.useState(0), currentStep = _a[0], setCurrentStep = _a[1];
    var handleSwipe = function (nextStep) {
        setCurrentStep(nextStep);
    };
    var handlePreviousStep = function () {
        setCurrentStep(function (prevStep) { return Math.max(0, prevStep - 1); });
    };
    var handleNextStep = function () {
        setCurrentStep(function (prevStep) { return Math.min(prevStep + 1, steps.length - 1); });
    };
    var handleComplete = function () {
        dispatch((0,soapbox_actions_onboarding__WEBPACK_IMPORTED_MODULE_5__.endOnboarding)());
    };
    var steps = [/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_welcome__WEBPACK_IMPORTED_MODULE_16__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 42,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_avatar_selection_step__WEBPACK_IMPORTED_MODULE_8__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 43,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_display_name_step__WEBPACK_IMPORTED_MODULE_12__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 44,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_bio_step__WEBPACK_IMPORTED_MODULE_9__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 45,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_cover_photo_selection_step__WEBPACK_IMPORTED_MODULE_11__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 46,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_how_it_works__WEBPACK_IMPORTED_MODULE_14__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_feeds__WEBPACK_IMPORTED_MODULE_13__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 48,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_privacy__WEBPACK_IMPORTED_MODULE_15__["default"], {
            onNext: handleNextStep,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 49,
                columnNumber: 5
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_steps_completed_step__WEBPACK_IMPORTED_MODULE_10__["default"], {
            onComplete: handleComplete,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 50,
                columnNumber: 5
            }
        })];
    var handleKeyUp = function (_ref) {
        var key = _ref.key;
        switch (key) {
            case 'ArrowLeft':
                handlePreviousStep();
                break;
            case 'ArrowRight':
                handleNextStep();
                break;
        }
    };
    var handleDotClick = function (nextStep) {
        setCurrentStep(nextStep);
    };
    react__WEBPACK_IMPORTED_MODULE_2__.useEffect(function () {
        document.addEventListener('keyup', handleKeyUp);
        return function () {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        "data-testid": "onboarding-wizard",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_landing_gradient__WEBPACK_IMPORTED_MODULE_6__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("main", {
        className: "h-screen flex flex-col overflow-x-hidden",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "flex flex-col justify-center items-center h-full",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_swipeable_views__WEBPACK_IMPORTED_MODULE_4__["default"], {
        animateHeight: true,
        index: currentStep,
        onChangeIndex: handleSwipe,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 11
        }
    }, steps.map(function (step, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        key: i,
        className: "py-6 sm:mx-auto w-full max-w-[100vw] sm:max-w-lg md:max-w-2xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
            'transition-opacity ease-linear': true,
            'opacity-0 duration-500': currentStep !== i,
            'opacity-100 duration-75': currentStep === i
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 17
        }
    }, step)); })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_7__.HStack, {
        space: 3,
        alignItems: "center",
        justifyContent: "center",
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 11
        }
    }, steps.map(function (_, i) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", {
        key: i,
        tabIndex: 0,
        onClick: function () { return handleDotClick(i); },
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
            'w-5 h-5 rounded-full focus:ring-primary-600 focus:ring-2 focus:ring-offset-2': true,
            'bg-gray-200 hover:bg-gray-300': i !== currentStep,
            'bg-primary-600': i === currentStep
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 15
        }
    }); })))));
};
/* harmony default export */ __webpack_exports__["default"] = (OnboardingWizard);


/***/ }),

/***/ 2476:
/*!*************************************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/avatar-selection-step.tsx ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url.js */ 46);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 28);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_me__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/actions/me */ 64);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_resize_image__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/utils/resize_image */ 917);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/avatar-selection-step.tsx";













/** Default avatar filenames from various backends */
var DEFAULT_AVATARS = ['/avatars/original/missing.png',
    '/images/avi.png' // Pleroma
];
/** Check if the avatar is a default avatar */
var isDefaultAvatar = function (url) {
    return DEFAULT_AVATARS.every(function (avatar) { return url.endsWith(avatar); });
};
var AvatarSelectionStep = function (_ref) {
    var onNext = _ref.onNext;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.useDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useOwnAccount)();
    var fileInput = react__WEBPACK_IMPORTED_MODULE_5__.useRef(null);
    var _a = react__WEBPACK_IMPORTED_MODULE_5__.useState(), selectedFile = _a[0], setSelectedFile = _a[1];
    var _b = react__WEBPACK_IMPORTED_MODULE_5__.useState(false), isSubmitting = _b[0], setSubmitting = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_5__.useState(true), isDisabled = _c[0], setDisabled = _c[1];
    var isDefault = account ? isDefaultAvatar(account.avatar) : false;
    var openFilePicker = function () {
        var _fileInput$current;
        (_fileInput$current = fileInput.current) === null || _fileInput$current === void 0 ? void 0 : _fileInput$current.click();
    };
    var handleFileChange = function (event) {
        var _event$target$files;
        var maxPixels = 400 * 400;
        var rawFile = (_event$target$files = event.target.files) === null || _event$target$files === void 0 ? void 0 : _event$target$files.item(0);
        if (!rawFile)
            return;
        (0,soapbox_utils_resize_image__WEBPACK_IMPORTED_MODULE_11__["default"])(rawFile, maxPixels).then(function (file) {
            var url = file ? URL.createObjectURL(file) : account === null || account === void 0 ? void 0 : account.avatar;
            setSelectedFile(url);
            setSubmitting(true);
            var formData = new FormData();
            formData.append('avatar', rawFile);
            var credentials = dispatch((0,soapbox_actions_me__WEBPACK_IMPORTED_MODULE_7__.patchMe)(formData));
            Promise.all([credentials]).then(function () {
                setDisabled(false);
                setSubmitting(false);
                onNext();
            }).catch(function (error) {
                var _error$response;
                setSubmitting(false);
                setDisabled(false);
                setSelectedFile(null);
                if (((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 422) {
                    dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_8__["default"].error(error.response.data.error.replace('Validation failed: ', '')));
                }
                else {
                    dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_8__["default"].error('An unexpected error occurred. Please try again or skip this step.'));
                }
            });
        }).catch(console.error);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-slate-900/50 border-solid -mx-4 sm:-mx-10",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Text, {
        size: "2xl",
        align: "center",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "onboarding.avatar.title",
        defaultMessage: "Choose a profile picture",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Text, {
        theme: "muted",
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "onboarding.avatar.subtitle",
        defaultMessage: "Just have fun with it.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 17
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Stack, {
        space: 10,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "bg-gray-200 rounded-full relative mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 15
        }
    }, account && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Avatar, {
        src: selectedFile || account.avatar,
        size: 175,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 19
        }
    }), isSubmitting && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "absolute inset-0 rounded-full flex justify-center items-center bg-white/80",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Spinner, {
        withText: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 21
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("button", {
        onClick: openFilePicker,
        type: "button",
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()({
            'absolute bottom-3 right-2 p-1 bg-primary-600 rounded-full ring-2 ring-white dark:ring-slate-800 hover:bg-primary-700': true,
            'opacity-50 pointer-events-none': isSubmitting
        }),
        disabled: isSubmitting,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Icon, {
        src: __webpack_require__(/*! @tabler/icons/plus.svg */ 250),
        className: "text-white w-5 h-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 111,
            columnNumber: 19
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("input", {
        type: "file",
        className: "hidden",
        ref: fileInput,
        onChange: handleFileChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Stack, {
        justifyContent: "center",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 117,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Button, {
        block: true,
        theme: "primary",
        type: "button",
        onClick: onNext,
        disabled: isDefault && isDisabled || isSubmitting,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 17
        }
    }, isSubmitting ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "onboarding.saving",
        defaultMessage: "Saving\u2026",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 120,
            columnNumber: 21
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 21
        }
    })), isDisabled && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_9__.Button, {
        block: true,
        theme: "link",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "onboarding.skip",
        defaultMessage: "Skip for now",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 21
        }
    }))))))));
};
/* harmony default export */ __webpack_exports__["default"] = (AvatarSelectionStep);


/***/ }),

/***/ 2477:
/*!************************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/bio-step.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_me__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/me */ 64);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/bio-step.tsx";









var BioStep = function (_ref) {
    var onNext = _ref.onNext;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useOwnAccount)();
    var _a = react__WEBPACK_IMPORTED_MODULE_2__.useState((account === null || account === void 0 ? void 0 : account.source.get('note')) || ''), value = _a[0], setValue = _a[1];
    var _b = react__WEBPACK_IMPORTED_MODULE_2__.useState(false), isSubmitting = _b[0], setSubmitting = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_2__.useState([]), errors = _c[0], setErrors = _c[1];
    var trimmedValue = value.trim();
    var isValid = trimmedValue.length > 0;
    var isDisabled = !isValid;
    var handleSubmit = function () {
        setSubmitting(true);
        var credentials = dispatch((0,soapbox_actions_me__WEBPACK_IMPORTED_MODULE_4__.patchMe)({
            note: value
        }));
        Promise.all([credentials]).then(function () {
            setSubmitting(false);
            onNext();
        }).catch(function (error) {
            var _error$response;
            setSubmitting(false);
            if (((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 422) {
                setErrors([error.response.data.error.replace('Validation failed: ', '')]);
            }
            else {
                dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_5__["default"].error('An unexpected error occurred. Please try again or skip this step.'));
            }
        });
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-600 border-solid -mx-4 sm:-mx-10",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        size: "2xl",
        align: "center",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.note.title",
        defaultMessage: "Write a short bio",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "muted",
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.note.subtitle",
        defaultMessage: "You can always edit this later.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 17
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 5,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        hintText: "Max 500 characters",
        labelText: "Bio",
        errors: errors,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Textarea, {
        onChange: function (event) { return setValue(event.target.value); },
        placeholder: "Tell the world a little about yourself\u2026",
        value: value,
        maxLength: 500,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 17
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        justifyContent: "center",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        block: true,
        theme: "primary",
        type: "submit",
        disabled: isDisabled || isSubmitting,
        onClick: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 17
        }
    }, isSubmitting ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.saving",
        defaultMessage: "Saving\u2026",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 21
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 21
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        block: true,
        theme: "link",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.skip",
        defaultMessage: "Skip for now",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 19
        }
    }))))))));
};
/* harmony default export */ __webpack_exports__["default"] = (BioStep);


/***/ }),

/***/ 2478:
/*!******************************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/completed-step.tsx ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/completed-step.tsx";



var CompletedStep = function (_ref) {
    var onComplete = _ref.onComplete;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 7,
            columnNumber: 3
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 8,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 9,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Icon, {
        strokeWidth: 1,
        src: __webpack_require__(/*! @tabler/icons/confetti.svg */ 2479),
        className: "w-16 h-16 mx-auto text-primary-600 dark:text-primary-400",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 10,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        size: "2xl",
        align: "center",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.finished.title",
        defaultMessage: "Onboarding complete",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "muted",
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.finished.message",
        defaultMessage: "We are very excited to welcome you to our community! Tap the button below to get started.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        justifyContent: "center",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        block: true,
        theme: "primary",
        onClick: onComplete,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.view_feed",
        defaultMessage: "View Feed",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 13
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (CompletedStep);


/***/ }),

/***/ 2480:
/*!******************************************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/cover-photo-selection-step.tsx ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.url.js */ 46);
/* harmony import */ var core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/web.url-search-params.js */ 28);
/* harmony import */ var core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_url_search_params_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ 7);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_me__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/actions/me */ 64);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/still_image */ 177);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_resize_image__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! soapbox/utils/resize_image */ 917);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/cover-photo-selection-step.tsx";














/** Default header filenames from various backends */
var DEFAULT_HEADERS = ['/headers/original/missing.png',
    '/images/banner.png' // Pleroma
];
/** Check if the avatar is a default avatar */
var isDefaultHeader = function (url) {
    return DEFAULT_HEADERS.every(function (header) { return url.endsWith(header); });
};
var CoverPhotoSelectionStep = function (_ref) {
    var onNext = _ref.onNext;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_6__.useDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_11__.useOwnAccount)();
    var fileInput = react__WEBPACK_IMPORTED_MODULE_5__.useRef(null);
    var _a = react__WEBPACK_IMPORTED_MODULE_5__.useState(), selectedFile = _a[0], setSelectedFile = _a[1];
    var _b = react__WEBPACK_IMPORTED_MODULE_5__.useState(false), isSubmitting = _b[0], setSubmitting = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_5__.useState(true), isDisabled = _c[0], setDisabled = _c[1];
    var isDefault = account ? isDefaultHeader(account.header) : false;
    var openFilePicker = function () {
        var _fileInput$current;
        (_fileInput$current = fileInput.current) === null || _fileInput$current === void 0 ? void 0 : _fileInput$current.click();
    };
    var handleFileChange = function (event) {
        var _event$target$files;
        var maxPixels = 1920 * 1080;
        var rawFile = (_event$target$files = event.target.files) === null || _event$target$files === void 0 ? void 0 : _event$target$files.item(0);
        if (!rawFile)
            return;
        (0,soapbox_utils_resize_image__WEBPACK_IMPORTED_MODULE_12__["default"])(rawFile, maxPixels).then(function (file) {
            var url = file ? URL.createObjectURL(file) : account === null || account === void 0 ? void 0 : account.header;
            setSelectedFile(url);
            setSubmitting(true);
            var formData = new FormData();
            formData.append('header', file);
            var credentials = dispatch((0,soapbox_actions_me__WEBPACK_IMPORTED_MODULE_7__.patchMe)(formData));
            Promise.all([credentials]).then(function () {
                setDisabled(false);
                setSubmitting(false);
                onNext();
            }).catch(function (error) {
                var _error$response;
                setSubmitting(false);
                setDisabled(false);
                setSelectedFile(null);
                if (((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 422) {
                    dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_8__["default"].error(error.response.data.error.replace('Validation failed: ', '')));
                }
                else {
                    dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_8__["default"].error('An unexpected error occurred. Please try again or skip this step.'));
                }
            });
        }).catch(console.error);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 76,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-600 border-solid -mx-4 sm:-mx-10",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Text, {
        size: "2xl",
        align: "center",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "onboarding.header.title",
        defaultMessage: "Pick a cover image",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Text, {
        theme: "muted",
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "onboarding.header.subtitle",
        defaultMessage: "This will be shown at the top of your profile.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 17
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Stack, {
        space: 10,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "border border-solid border-gray-200 rounded-lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        role: "button",
        className: "relative h-24 bg-primary-100 rounded-t-md flex items-center justify-center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 17
        }
    }, selectedFile || (account === null || account === void 0 ? void 0 : account.header) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_9__["default"], {
        src: selectedFile || account.header,
        alt: "Profile Header",
        className: "absolute inset-0 object-cover rounded-t-md",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 99,
            columnNumber: 21
        }
    }), isSubmitting && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "absolute inset-0 rounded-t-md flex justify-center items-center bg-white/80",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 107,
            columnNumber: 21
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Spinner, {
        withText: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 23
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("button", {
        onClick: openFilePicker,
        type: "button",
        className: classnames__WEBPACK_IMPORTED_MODULE_4___default()({
            'absolute -top-3 -right-3 p-1 bg-primary-600 rounded-full ring-2 ring-white hover:bg-primary-700': true,
            'opacity-50 pointer-events-none': isSubmitting
        }),
        disabled: isSubmitting,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Icon, {
        src: __webpack_require__(/*! @tabler/icons/plus.svg */ 250),
        className: "text-white w-5 h-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 123,
            columnNumber: 21
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("input", {
        type: "file",
        className: "hidden",
        ref: fileInput,
        onChange: handleFileChange,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 19
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement("div", {
        className: "flex flex-col px-4 pb-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 17
        }
    }, account && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Avatar, {
        src: account.avatar,
        size: 64,
        className: "ring-2 ring-white -mt-8 mb-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 131,
            columnNumber: 21
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Text, {
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 19
        }
    }, account === null || account === void 0 ? void 0 : account.display_name), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Text, {
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 135,
            columnNumber: 19
        }
    }, "@", account === null || account === void 0 ? void 0 : account.username))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Stack, {
        justifyContent: "center",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 139,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Button, {
        block: true,
        theme: "primary",
        type: "button",
        onClick: onNext,
        disabled: isDefault && isDisabled || isSubmitting,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 140,
            columnNumber: 17
        }
    }, isSubmitting ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "onboarding.saving",
        defaultMessage: "Saving\u2026",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 142,
            columnNumber: 21
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 144,
            columnNumber: 21
        }
    })), isDisabled && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_10__.Button, {
        block: true,
        theme: "link",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 149,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_5__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "onboarding.skip",
        defaultMessage: "Skip for now",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 150,
            columnNumber: 21
        }
    }))))))));
};
/* harmony default export */ __webpack_exports__["default"] = (CoverPhotoSelectionStep);


/***/ }),

/***/ 2481:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/display-name-step.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 2);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_me__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/me */ 64);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/snackbar */ 31);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/display-name-step.tsx";









var DisplayNameStep = function (_ref) {
    var onNext = _ref.onNext;
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useOwnAccount)();
    var _a = react__WEBPACK_IMPORTED_MODULE_2__.useState((account === null || account === void 0 ? void 0 : account.display_name) || ''), value = _a[0], setValue = _a[1];
    var _b = react__WEBPACK_IMPORTED_MODULE_2__.useState(false), isSubmitting = _b[0], setSubmitting = _b[1];
    var _c = react__WEBPACK_IMPORTED_MODULE_2__.useState([]), errors = _c[0], setErrors = _c[1];
    var trimmedValue = value.trim();
    var isValid = trimmedValue.length > 0;
    var isDisabled = !isValid || value.length > 30;
    var hintText = react__WEBPACK_IMPORTED_MODULE_2__.useMemo(function () {
        var charsLeft = 30 - value.length;
        var suffix = charsLeft === 1 ? 'character remaining' : 'characters remaining';
        return "".concat(charsLeft, " ").concat(suffix);
    }, [value]);
    var handleSubmit = function () {
        setSubmitting(true);
        var credentials = dispatch((0,soapbox_actions_me__WEBPACK_IMPORTED_MODULE_4__.patchMe)({
            display_name: value
        }));
        Promise.all([credentials]).then(function () {
            setSubmitting(false);
            onNext();
        }).catch(function (error) {
            var _error$response;
            setSubmitting(false);
            if (((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 422) {
                setErrors([error.response.data.error.replace('Validation failed: ', '')]);
            }
            else {
                dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_5__["default"].error('An unexpected error occurred. Please try again or skip this step.'));
            }
        });
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-gray-600 border-solid -mx-4 sm:-mx-10",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        size: "2xl",
        align: "center",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.display_name.title",
        defaultMessage: "Choose a display name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Text, {
        theme: "muted",
        align: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 61,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.display_name.subtitle",
        defaultMessage: "You can always edit this later.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 17
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        space: 5,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.FormGroup, {
        hintText: hintText,
        labelText: "Display name",
        errors: errors,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Input, {
        onChange: function (event) { return setValue(event.target.value); },
        placeholder: "Eg. John Smith",
        type: "text",
        value: value,
        maxLength: 30,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 74,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Stack, {
        justifyContent: "center",
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        block: true,
        theme: "primary",
        type: "submit",
        disabled: isDisabled || isSubmitting,
        onClick: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 84,
            columnNumber: 17
        }
    }, isSubmitting ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.saving",
        defaultMessage: "Saving\u2026",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 21
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 21
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_6__.Button, {
        block: true,
        theme: "link",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "onboarding.skip",
        defaultMessage: "Skip for now",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 99,
            columnNumber: 19
        }
    }))))))));
};
/* harmony default export */ __webpack_exports__["default"] = (DisplayNameStep);


/***/ }),

/***/ 2482:
/*!*********************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/feeds.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/feeds.tsx";




var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__.defineMessages)({
    col1: {
        "id": "onboarding.feeds.col1",
        "defaultMessage": "Here you are on familiar ground: only your publications and those of the people you follow will be displayed on this thread."
    },
    col2: {
        "id": "onboarding.feeds.col2",
        "defaultMessage": "Here is a bit like your neighborhood: you will only find publications from members of this server, whether you follow them or not."
    },
    col3: {
        "id": "onboarding.feeds.col3",
        "defaultMessage": "Think outside the box and go explore the rest of the world: this thread displays posts from all known instances."
    }
});
var Feeds = function (_ref) {
    var onNext = _ref.onNext;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])();
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance; });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "enlistment__step2 mx-auto py-10 px-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex mt-3 gap-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-grow-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
        className: "text-xl font-bold mb-2 text-primary-500",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "onboarding.feeds.title1",
        defaultMessage: "Home",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        dangerouslySetInnerHTML: {
            __html: intl.formatMessage(messages.col1)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        className: "mt-4 italic",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "onboarding.feeds.explanation1",
        defaultMessage: "At first it will be a little empty but don't worry we can help you fill it!",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 17
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-grow-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
        className: "text-xl font-bold mb-2 text-primary-500",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 15
        }
    }, instance.get('title')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        dangerouslySetInnerHTML: {
            __html: intl.formatMessage(messages.col2)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        className: "mt-4 italic",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "onboarding.feeds.explanation2",
        defaultMessage: 'We usually call it "local" thread',
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 17
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-grow-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
        className: "text-xl font-bold mb-2 text-primary-500",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "onboarding.feeds.title3",
        defaultMessage: "Explore",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        dangerouslySetInnerHTML: {
            __html: intl.formatMessage(messages.col3)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        className: "mt-4 italic",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "onboarding.feeds.explanation3",
        defaultMessage: 'We usually call it "global" or "federated" thread',
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 17
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        block: true,
        theme: "primary",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (Feeds);


/***/ }),

/***/ 2483:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/how-it-works.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/how-it-works.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    right: {
        "id": "onboarding.how-it-works.right",
        "defaultMessage": "If you exchange with a person from another instance, you must mention them with their <span class='font-bold'>@pseudo@instance</span><br/><br/> ex: <a href=' https://oslo.town/@matt'>@matt@oslo.town</a>, if you want to talk to the Oslo.town admin"
    }
});
var HowItWorks = function (_ref) {
    var onNext = _ref.onNext;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.instance; });
    var contactName = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return "@".concat(instance.get('email').replace(/@.+/, '')); }, [instance]);
    var contactUrl = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(function () { return "".concat(instance.get('uri'), "/").concat(contactName); }, [contactName]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "enlistment__step1 mx-auto py-10 px-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("h3", {
        className: "text-2xl font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "onboarding.how-it-works.title",
        defaultMessage: "How it works ?",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 13
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex gap-12 mt-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex-grow-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "onboarding.how-it-works.left",
        defaultMessage: "Here you are on {title}. If you exchange with people from the same instance as you, you can simply mention them with {username}{br}{br}ex: {contact}, if you want to talk to the admin of {title}",
        values: {
            title: instance.get('title'),
            username: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
                className: "font-bold",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 35,
                    columnNumber: 23
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
                id: "onboarding.how-it-works.username",
                defaultMessage: "@username",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 35,
                    columnNumber: 51
                }
            })),
            contact: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("a", {
                href: contactUrl,
                target: "_blank",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 38,
                    columnNumber: 23
                }
            }, contactName),
            br: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("br", {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 42,
                    columnNumber: 25
                }
            })
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 17
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "flex-grow-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", {
        dangerouslySetInnerHTML: {
            __html: intl.formatMessage(messages.right)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "italic mt-8",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "onboarding.how-it-works.explanation",
        defaultMessage: "Don't worry though, when writing a post, autosuggestion will help you find the right mention! Moreover, if you reply to a post, the mention will automatically be written in the right way.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
        block: true,
        theme: "primary",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (HowItWorks);


/***/ }),

/***/ 2484:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/privacy.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 1);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/privacy.tsx";



var Privacy = function (_ref) {
    var onNext = _ref.onNext;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 8,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 9,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "enlistment__step3 mx-auto py-10 px-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 10,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 11,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h3", {
        className: "text-2xl font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 12,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.title",
        defaultMessage: "Privacy",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.description",
        defaultMessage: "This site offers precise control over who can see your posts and therefore interact with you.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mt-10",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex gap-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-grow-1 w-1/2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", {
        className: "items-center text-xl font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Icon, {
        className: "inline-block text-primary-500 align-middle mr-1 w-6 h-6",
        src: __webpack_require__(/*! @tabler/icons/world.svg */ 180),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "align-middle",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.public-title",
        defaultMessage: "Public",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 21
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.public-description",
        defaultMessage: "The post is displayed on all feeds, including other instances.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 19
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-grow-1 w-1/2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", {
        className: "items-center text-xl font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Icon, {
        className: "inline-block text-primary-500 align-middle mr-1 w-6 h-6",
        src: __webpack_require__(/*! @tabler/icons/eye-off.svg */ 139),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "align-middle",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.unlisted-title",
        defaultMessage: "Unlisted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 21
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.unlisted-description",
        defaultMessage: "The post is public but only appears in your subscribers' feeds and on your profile",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 19
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "mt-10 flex gap-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-grow-1 w-1/2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", {
        className: "items-center text-xl font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Icon, {
        className: "inline-block text-primary-500 align-middle mr-1 w-6 h-6",
        src: __webpack_require__(/*! @tabler/icons/lock.svg */ 141),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "align-middle",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.followers-title",
        defaultMessage: "Followers only",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 21
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.followers-description",
        defaultMessage: "The post is not displayed on any public feeds and is only visible to people who follow you",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 19
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex-grow-1 w-1/2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", {
        className: "items-center text-xl font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Icon, {
        className: "inline-block text-primary-500 align-middle mr-1 w-6 h-6",
        src: __webpack_require__(/*! @tabler/icons/mail.svg */ 118),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 19
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
        className: "align-middle",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.direct-title",
        defaultMessage: "Direct",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 21
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.privacy.direct-description",
        defaultMessage: "The post is only visible to people mentioned via @username@instance",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 19
        }
    })))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        block: true,
        theme: "primary",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (Privacy);


/***/ }),

/***/ 2485:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/onboarding/steps/welcome.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ 4);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 8);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 1);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/onboarding/steps/welcome.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    title: {
        "id": "onboarding.welcome.title",
        "defaultMessage": "Welcome on the Fediverse"
    },
    body1: {
        "id": "onboarding.welcome.body1",
        "defaultMessage": "This website is your gateway to a network of independent servers that communicate together to form a larger social network: the fediverse."
    },
    body2: {
        "id": "onboarding.welcome.body2",
        "defaultMessage": "Each server is called an \u201Cinstance\u201D. Your instance is simply this site: "
    },
    username: {
        "id": "onboarding.welcome.username",
        "defaultMessage": "You full username"
    },
    explanation: {
        "id": "onboarding.welcome.explanation",
        "defaultMessage": "It is this identifier that you can share on the fediverse"
    }
});
var Welcome = function (_ref) {
    var onNext = _ref.onNext;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useOwnAccount)();
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.instance; });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Card, {
        variant: "rounded",
        size: "xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 21,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "enlistment__step0 mx-auto py-10 px-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("h3", {
        className: "text-2xl font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.title)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", {
        className: "mt-3 mb-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "text-gray-400 mb-3",
        dangerouslySetInnerHTML: {
            __html: intl.formatMessage(messages.body1)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        dangerouslySetInnerHTML: {
            __html: intl.formatMessage(messages.body2)
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 13
        }
    }), "\xA0", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", {
        className: "font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 13
        }
    }, instance.get('uri').replace(/https?:\/\//, ''))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("h4", {
        className: "uppercase text-lg",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.username)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "enlisted__step0__username inline-block rounded p-1 text-primary-500 text-lg font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 11
        }
    }, "@", account === null || account === void 0 ? void 0 : account.acct, "@", instance.get('uri').replace(/https?:\/\//, '')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "italic mt-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.explanation))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
        block: true,
        theme: "primary",
        type: "button",
        onClick: onNext,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "onboarding.next",
        defaultMessage: "Next",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (Welcome);


/***/ }),

/***/ 2479:
/*!*******************************************************!*\
  !*** ./node_modules/@tabler/icons/icons/confetti.svg ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "packs/icons/confetti-630b49be.svg";

/***/ })

}]);
//# sourceMappingURL=onboarding-1798583af15400498fc5.chunk.js.map