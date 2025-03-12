"use strict";
var __extends = (this && this.__extends) || (function () {
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balance = void 0;
var pixi_js_1 = require("pixi.js");
var Component_ts_1 = require("../../core/Component.ts");
var AssetLoader_ts_1 = require("../../core/AssetLoader.ts");
var Balance = /** @class */ (function (_super) {
    __extends(Balance, _super);
    function Balance() {
        var _this = _super.call(this) || this;
        _this.textFrame = new pixi_js_1.Graphics()
            .roundRect(0, 0, 250, 100, 25)
            .fill(0x00000)
            .stroke({
            width: 5,
            color: 0xfdf9ed,
            alignment: 1,
        });
        _this.textContainerMask = new pixi_js_1.Graphics()
            .roundRect(0, 0, 250, 100, 20)
            .fill(0xffffff);
        return _this;
    }
    Balance.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var coinTexture, coinIcon, style, balance, money;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.position.set(window.innerWidth / 2 - 400, window.innerHeight - 130);
                        this.textFrame.alpha = 0.5;
                        return [4 /*yield*/, AssetLoader_ts_1.AssetPreloader.loadCoinTexture()];
                    case 1:
                        coinTexture = _a.sent();
                        coinIcon = new pixi_js_1.Sprite(coinTexture);
                        coinIcon.scale = 0.13;
                        coinIcon.x = 23;
                        coinIcon.y = 14;
                        this.addChild(this.textContainerMask);
                        this.addChild(this.textFrame);
                        this.addChild(coinIcon);
                        this.mask = this.textContainerMask;
                        style = new pixi_js_1.TextStyle({
                            fill: "#fdf9ed",
                            fontFamily: "Nanum Gothic Coding",
                            fontSize: 30,
                            dropShadow: {
                                color: "#000000",
                                blur: 10,
                                angle: Math.PI / 6,
                                distance: 7,
                            },
                        });
                        balance = { value: 1000 };
                        money = new pixi_js_1.Text(balance.value.toString(), style);
                        money.position.x += 105;
                        money.position.y += 32;
                        // Add the money text to the display list
                        this.addChild(money);
                        return [2 /*return*/];
                }
            });
        });
    };
    Balance.prototype.update = function () { };
    Balance.prototype.recalculateLayout = function (width, height) {
        this.position.set(window.innerWidth / 2 - 400, window.innerHeight - 130);
    };
    return Balance;
}(Component_ts_1.Component));
exports.Balance = Balance;
