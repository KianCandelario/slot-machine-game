// Imports
import { 
    Application,
    Assets,
    Sprite
 } from "pixi.js"
import { initDevtools } from "@pixi/devtools"


(async () => {
    const app = new Application()

    initDevtools({app})

    await app.init({
        resizeTo: window,
    })

    app.canvas.style.position = "absolute";

    // Created the texture to make sure that the background is available for use
    const texture = await Assets.load('../assets/background/bg.jpg')
    const background = new Sprite(texture)  // Created a sprite to allow PixiJS to display the bg

    // Set the width and height of the background to the width and height of the window
    background.height = window.innerHeight
    background.width = window.innerWidth

    // Add the background to the stage
    app.stage.addChild(background)

    document.body.appendChild(app.canvas)
})()