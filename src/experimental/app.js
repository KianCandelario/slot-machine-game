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
    });
    app.canvas.style.position = "absolute";
    // Created the texture to make sure that the background is available for use
    const texture = await pixi_js_1.Assets.load('../assets/background/bg.jpg');
    const background = new pixi_js_1.Sprite(texture); // Created a sprite to allow PixiJS to display the bg
    // Set the width and height of the background to the width and height of the window
    background.height = window.innerHeight;
    background.width = window.innerWidth;
    // Add the background to the stage
    app.stage.addChild(background);
    document.body.appendChild(app.canvas);
})();
