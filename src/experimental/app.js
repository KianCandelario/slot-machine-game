"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const pixi_js_1 = require("pixi.js");
const devtools_1 = require("@pixi/devtools");
(async () => {
    const app = new pixi_js_1.Application();
    (0, devtools_1.initDevtools)({ app });
    await app.init({
        resizeTo: window,
        backgroundColor: 0xffea00
    });
    app.canvas.style.position = "absolute";
    document.body.appendChild(app.canvas);
})();
