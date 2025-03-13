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
exports.BetControl = void 0;
var pixi_js_1 = require("pixi.js");
var Component_ts_1 = require("../../core/Component.ts");
var BetControl = /** @class */ (function (_super) {
    __extends(BetControl, _super);
    function BetControl() {
        var _this = _super.call(this) || this;
        _this.betFrame = new pixi_js_1.Graphics()
            .roundRect(0, 0, 250, 100, 25)
            .fill(0x000000)
            .stroke({
            width: 5,
            color: 0xfdf9ed,
            alignment: 1
        });
        _this.betMask = new pixi_js_1.Graphics()
            .roundRect(0, 0, 250, 100, 25)
            .fill(0xFFFFFF);
        _this.betTextStyle = new pixi_js_1.TextStyle({
            fill: '#fdf9ed',
            fontFamily: 'Nanum Gothic Coding',
            fontWeight: "700",
            fontSize: 22,
            dropShadow: {
                color: '#000000',
                blur: 8,
                angle: Math.PI / 6,
                distance: 5
            }
        });
        _this.betAmountStyle = new pixi_js_1.TextStyle({
            fill: '#fdf9ed',
            fontFamily: 'Nanum Gothic Coding',
            fontSize: 32,
            dropShadow: {
                color: '#000000',
                blur: 10,
                angle: Math.PI / 6,
                distance: 7
            }
        });
        return _this;
    }
    BetControl.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var betLabel, betAmount, betAmountText;
            return __generator(this, function (_a) {
                this.position.set((window.innerWidth / 2) + 140, window.innerHeight - 135);
                this.betFrame.alpha = 0.5;
                this.mask = this.betMask;
                this.addChild(this.betFrame);
                this.addChild(this.betMask);
                betLabel = new pixi_js_1.Text({
                    text: "BET",
                    style: this.betTextStyle
                });
                betLabel.position.set(25, 15);
                this.addChild(betLabel);
                betAmount = { value: 5 };
                betAmountText = new pixi_js_1.Text({
                    text: betAmount.value.toString(),
                    style: this.betAmountStyle
                });
                betAmountText.anchor.set(0.5);
                betAmountText.position.set(150, 50);
                this.addChild(betAmountText);
                return [2 /*return*/];
            });
        });
    };
    BetControl.prototype.update = function () { };
    BetControl.prototype.recalculateLayout = function (width, height) {
        this.position.set((window.innerWidth / 2) + 140, window.innerHeight - 135);
    };
    return BetControl;
}(Component_ts_1.Component));
exports.BetControl = BetControl;
