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
exports.Petals = void 0;
var pixi_js_1 = require("pixi.js");
var AssetLoader_ts_1 = require("../../core/AssetLoader.ts");
var Component_ts_1 = require("../../core/Component.ts");
var Petal = /** @class */ (function (_super) {
    __extends(Petal, _super);
    function Petal(texture) {
        var _this = _super.call(this, texture) || this;
        // Randomize petal properties
        _this.width = Math.random() * 25 + 10;
        _this.height = _this.width;
        _this.alpha = Math.random() * 0.7 + 0.4;
        // Starting position
        _this.x = Math.random() * window.innerWidth;
        _this.y = -50; // Start above the screen
        // Movement properties
        _this.speed = Math.random() * 1.7 + 1;
        _this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        _this.wobble = Math.random() * Math.PI * 2;
        _this.wobbleSpeed = Math.random() * 0.05 + 0.01;
        return _this;
    }
    Petal.prototype.update = function () {
        // Falling movement
        this.y += this.speed;
        // Rotation
        this.rotation += this.rotationSpeed;
        // Wobble effect (side-to-side movement)
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 2;
        // Reset if out of screen
        if (this.y > window.innerHeight + 50) {
            this.y = -50;
            this.x = Math.random() * window.innerWidth;
        }
    };
    return Petal;
}(pixi_js_1.Sprite));
var Petals = /** @class */ (function (_super) {
    __extends(Petals, _super);
    function Petals() {
        var _this = _super.call(this) || this;
        _this.petals = [];
        _this.tweening = [];
        _this.PETAL_COUNT = 50;
        _this.petalsContainer = new pixi_js_1.Container();
        _this.addChild(_this.petalsContainer);
        return _this;
    }
    Petals.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var petalTexture;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AssetLoader_ts_1.AssetPreloader.loadPetalTexture()];
                    case 1:
                        petalTexture = _a.sent();
                        // Spawn Petals
                        this.petals = Array.from({ length: this.PETAL_COUNT }, function () {
                            var petal = new Petal(petalTexture);
                            _this.petalsContainer.addChild(petal);
                            return petal;
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // Match the Component abstract method signature: update(delta: number)
    Petals.prototype.update = function (delta) {
        // Update all petals
        for (var _i = 0, _a = this.petals; _i < _a.length; _i++) {
            var petal = _a[_i];
            petal.update();
        }
        // Update tweens
        var now = Date.now();
        var remove = [];
        for (var i = 0; i < this.tweening.length; i++) {
            var t = this.tweening[i];
            var phase = Math.min(1, (now - t.start) / t.time);
            t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change)
                t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete)
                    t.complete(t);
                remove.push(t);
            }
        }
        for (var i = 0; i < remove.length; i++) {
            this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
        }
    };
    // Utility function for linear interpolation
    Petals.prototype.lerp = function (start, end, amount) {
        return start + (end - start) * amount;
    };
    // Add a new tween
    Petals.prototype.addTween = function (tween) {
        this.tweening.push(tween);
    };
    // Override the recalculateLayout method to handle resize
    Petals.prototype.recalculateLayout = function (width, height) {
        // Adjust petals position if needed when window is resized
        for (var _i = 0, _a = this.petals; _i < _a.length; _i++) {
            var petal = _a[_i];
            // Keep petals within the new window width if they're outside
            if (petal.x > width) {
                petal.x = Math.random() * width;
            }
        }
    };
    return Petals;
}(Component_ts_1.Component));
exports.Petals = Petals;
