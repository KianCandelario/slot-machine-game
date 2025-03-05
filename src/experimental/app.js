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
    // ---------------
    // styling functions
    // ---------------
    // Adding BG
    const background = await texture('../assets/background/bg.jpg');
    // Set the width and height of the background to the width and height of the window
    background.height = window.innerHeight;
    background.width = window.innerWidth;
    // Add the background to the stage
    app.stage.addChild(background);
    // ---------------
    // Moving Clouds
    const clouds_texture = await texture('../assets/background/cloud_bg-removebg-preview.png');
    const moving_clouds = tiling_sprite(clouds_texture.texture);
    let elapsedTime = 0;
    const horizontalSpeed = 1; // Horizontal movement speed
    app.ticker.add((ticker) => {
        elapsedTime += ticker.deltaTime;
        // Horizontal movement (parallax scrolling)
        moving_clouds.tilePosition.x += horizontalSpeed;
    });
    // Add the background to the stage
    app.stage.addChild(moving_clouds);
    document.body.appendChild(app.canvas);
    // ---------------
    // Functions
    // Texture function to make sure that the background is available for use
    async function texture(asset) {
        const texture = await pixi_js_1.Assets.load(asset);
        return new pixi_js_1.Sprite(texture); // Created a sprite to allow PixiJS to display the bg
    }
    function tiling_sprite(texture) {
        return new pixi_js_1.TilingSprite({
            texture,
            width: app.screen.width
        });
    }
})();
