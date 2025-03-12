"use strict";
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
exports.Game = void 0;
var pixi_js_1 = require("pixi.js");
var devtools_1 = require("@pixi/devtools");
var Background_ts_1 = require("../components/view/Background.ts");
var Logo_ts_1 = require("../components/view/Logo.ts");
var GameArea_ts_1 = require("../components/ui/containers/GameArea.ts");
var SpinButton_ts_1 = require("../components/ui/SpinButton.ts");
var Petals_ts_1 = require("../components/view/Petals.ts");
var Balance_ts_1 = require("../components/ui/Balance.ts");
var Game = /** @class */ (function () {
    function Game() {
        // Game loop update function
        this.update = function (delta) { };
        this.app = new pixi_js_1.Application();
        this.background = new Background_ts_1.Background();
        this.petalsComponent = new Petals_ts_1.Petals();
        this.logo = new Logo_ts_1.Logo();
        this.gameArea = new GameArea_ts_1.GameArea();
        this.spinButton = new SpinButton_ts_1.SpinButton();
        this.balance = new Balance_ts_1.Balance();
    }
    Game.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Initialize devtools
                        (0, devtools_1.initDevtools)({ app: this.app });
                        // Initialize the application
                        return [4 /*yield*/, this.app.init({
                                resizeTo: window,
                                backgroundColor: 0x000000,
                            })];
                    case 1:
                        // Initialize the application
                        _a.sent();
                        this.app.canvas.style.position = "absolute";
                        // Add the canvas to the document
                        document.body.appendChild(this.app.canvas);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        return [4 /*yield*/, this.background.init()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.logo.init()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.gameArea.init()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.spinButton.init()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.balance.init()
                            // Add to the stage
                        ];
                    case 7:
                        _a.sent();
                        // Add to the stage
                        this.app.stage.addChild(this.background);
                        this.app.stage.addChild(this.petalsComponent);
                        this.app.stage.addChild(this.logo);
                        this.app.stage.addChild(this.gameArea);
                        this.app.stage.addChild(this.spinButton);
                        this.app.stage.addChild(this.balance);
                        // Initialize the component
                        return [4 /*yield*/, this.petalsComponent.init()];
                    case 8:
                        // Initialize the component
                        _a.sent();
                        // Add the component's update method to the ticker
                        this.app.ticker.add(function (ticker) {
                            _this.petalsComponent.update(ticker.deltaTime);
                        });
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.error("Failed to initialize components:", error_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    // Clean up event listeners and components when needed
    Game.prototype.destroy = function () {
        // The background and logo components now handle their own cleanup
        this.background.destroy();
        this.logo.destroy();
        // Clean up the application
        this.app.destroy();
    };
    return Game;
}());
exports.Game = Game;
