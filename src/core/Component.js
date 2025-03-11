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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var pixi_js_1 = require("pixi.js");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        var _this = _super.call(this) || this;
        // Bind the resize handler to the class instance
        _this.onResize = _this.onResize.bind(_this);
        // Add a resize event listener
        window.addEventListener("resize", _this.onResize);
        return _this;
    }
    Component.prototype.onResize = function () {
        // Recalculate positions, sizes, or scales based on the new window dimensions
        this.recalculateLayout(window.innerWidth, window.innerHeight);
    };
    Component.prototype.recalculateLayout = function (width, height) {
        // child classes will override this method to implement specific responsive behavior
    };
    // Cleanup method
    Component.prototype.destroy = function () {
        // Remove the resize event listener
        window.removeEventListener("resize", this.onResize);
        // Destroy the container and its children
        _super.prototype.destroy.call(this);
    };
    return Component;
}(pixi_js_1.Container));
exports.Component = Component;
