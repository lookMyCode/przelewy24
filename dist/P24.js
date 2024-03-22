"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.P24 = void 0;
var axios_1 = __importDefault(require("axios"));
var CONFIG_DEFAULT_VALUES_1 = require("./constants/CONFIG_DEFAULT_VALUES");
var PRZELEWY24_IP_LIST_1 = require("./constants/PRZELEWY24_IP_LIST");
var SignUtils_1 = require("./SignUtils");
var PROD_BASE_URL = 'https://secure.przelewy24.pl';
var PROD_API_BASE_URL = PROD_BASE_URL + '/api/v1';
var DEV_BASE_URL = 'https://sandbox.przelewy24.pl';
var DEV_API_BASE_URL = DEV_BASE_URL + '/api/v1';
var P24 = (function () {
    function P24(data) {
        this.prod = data.prod;
        this.baseURL = data.prod ? PROD_BASE_URL : DEV_BASE_URL;
        this.baseApiURL = data.prod ? PROD_API_BASE_URL : DEV_API_BASE_URL;
        this.merchantId = data.merchantId;
        this.posId = data.posId ? data.posId : data.merchantId;
        this.apiKey = data.apiKey;
        this.crc = data.crc;
        this.defaultValues = __assign(__assign({}, CONFIG_DEFAULT_VALUES_1.CONFIG_DEFAULT_VALUES), data.defaultValues);
        this.createAxiosInstance();
        this.signUtils = new SignUtils_1.SignUtils({
            merchantId: this.merchantId,
            posId: this.posId,
            crc: this.crc,
        });
    }
    P24.prototype.testAccess = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.axiosInstance.get('/testAccess')];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    P24.prototype.getPaymentMethods = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var lang, params, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lang = data.lang, params = __rest(data, ["lang"]);
                        return [4, this.axiosInstance.get("/payment/methods/".concat(lang), { params: params })];
                    case 1:
                        res = _a.sent();
                        return [2, res.data];
                }
            });
        });
    };
    P24.prototype.registerTransaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var req, res, resData, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = __assign(__assign({}, data), { merchantId: this.merchantId, posId: this.posId, sign: '' });
                        if (!req.country && this.defaultValues.country)
                            req.country = this.defaultValues.country;
                        if (!req.language && this.defaultValues.language)
                            req.language = this.defaultValues.language;
                        if (!req.waitForResult && req.waitForResult !== false && typeof (this.defaultValues.waitForResult) === 'boolean')
                            req.waitForResult = this.defaultValues.waitForResult;
                        if (!req.regulationAccept && req.regulationAccept !== false && typeof (this.defaultValues.regulationAccept) === 'boolean')
                            req.regulationAccept = this.defaultValues.regulationAccept;
                        req.sign = this.signUtils.getRegisterTransactionSign({
                            sessionId: req.sessionId,
                            amount: req.amount,
                            currency: req.currency,
                        });
                        return [4, this.axiosInstance.post('/transaction/register', req)];
                    case 1:
                        res = _a.sent();
                        resData = res.data;
                        token = resData.data.token;
                        return [2, {
                                token: token,
                                redirectUrl: "".concat(this.baseURL, "/trnRequest/").concat(token),
                            }];
                }
            });
        });
    };
    P24.prototype.validateIP = function (ip) {
        return PRZELEWY24_IP_LIST_1.PRZELEWY24_IP_LIST.includes(ip);
    };
    P24.prototype.verifyTransactionNotification = function (data) {
        var notificationData = __assign({}, data);
        var sign = this.signUtils.getTransactionNotificationSign(notificationData);
        return sign === data.sign;
    };
    P24.prototype.verifyTransaction = function (data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var verifyData, req, res, status;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        verifyData = __assign({}, data);
                        req = __assign(__assign({}, verifyData), { merchantId: this.merchantId, posId: this.posId, sign: this.signUtils.getVerifySign(verifyData) });
                        return [4, this.axiosInstance.put('/transaction/verify', req)];
                    case 1:
                        res = _c.sent();
                        status = (_b = (_a = res.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status;
                        return [2, status === 'success'];
                }
            });
        });
    };
    P24.prototype.verifyNotificationAndTransaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isValid = this.verifyTransactionNotification({
                            sessionId: data.sessionId,
                            amount: data.amount,
                            originAmount: data.originAmount,
                            currency: data.currency,
                            methodId: data.methodId,
                            orderId: data.orderId,
                            statement: data.statement,
                            sign: data.sign,
                        });
                        if (!isValid)
                            return [2, false];
                        return [4, this.verifyTransaction({
                                sessionId: data.sessionId,
                                amount: data.amount,
                                currency: data.currency,
                                orderId: data.orderId,
                            })];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    P24.prototype.refund = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.axiosInstance.post('/transaction/refund', data)];
                    case 1:
                        res = _a.sent();
                        return [2, res.data.data];
                }
            });
        });
    };
    P24.prototype.verifyRefundNotification = function (data) {
        var notificationData = __assign({}, data);
        var sign = this.signUtils.getRefundNotificationSign(notificationData);
        return sign === data.sign;
    };
    P24.prototype.payWithCard = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var res, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.axiosInstance.post('/card/pay', data)];
                    case 1:
                        res = _a.sent();
                        resp = __assign(__assign({}, res.data.data), { requires3DSRedirection: res.status === 201 });
                        return [2, resp];
                }
            });
        });
    };
    P24.prototype.createAxiosInstance = function () {
        this.axiosInstance = axios_1.default.create({
            baseURL: this.baseApiURL,
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: this.posId.toString(),
                password: this.apiKey,
            },
        });
    };
    return P24;
}());
exports.P24 = P24;
//# sourceMappingURL=P24.js.map