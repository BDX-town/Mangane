"use strict";
(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[11],{

/***/ 1357:
/*!******************************************************!*\
  !*** ./app/soapbox/features/ads/providers/rumble.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! soapbox/actions/settings */ 26);
/* harmony import */ var soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/soapbox */ 66);
/* harmony import */ var soapbox_normalizers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/normalizers */ 33);
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



/** Provides ads from Soapbox Config. */
var RumbleAdProvider = {
    getAds: function (getState) { return __awaiter(void 0, void 0, void 0, function () {
        var state, settings, soapboxConfig, endpoint, response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = getState();
                    settings = (0,soapbox_actions_settings__WEBPACK_IMPORTED_MODULE_0__.getSettings)(state);
                    soapboxConfig = (0,soapbox_actions_soapbox__WEBPACK_IMPORTED_MODULE_1__.getSoapboxConfig)(state);
                    endpoint = soapboxConfig.extensions.getIn(['ads', 'endpoint']);
                    if (!endpoint) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch(endpoint, {
                            headers: {
                                'Accept-Language': settings.get('locale', '*')
                            }
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.ads.map(function (item) { return ({
                            impression: item.impression,
                            card: (0,soapbox_normalizers__WEBPACK_IMPORTED_MODULE_2__.normalizeCard)({
                                type: item.type === 1 ? 'link' : 'rich',
                                image: item.asset,
                                url: item.click
                            })
                        }); })];
                case 3: return [2 /*return*/, []];
            }
        });
    }); }
};
/* harmony default export */ __webpack_exports__["default"] = (RumbleAdProvider);


/***/ })

}]);
//# sourceMappingURL=rumble-58b63f5d81dda37d0041.chunk.js.map