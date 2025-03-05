// Imports
import { 
    Application,
    Assets,
    Sprite,
    Texture,
    TilingSprite,
    Filter
 } from "pixi.js"
import { initDevtools } from "@pixi/devtools"
import { DropShadowFilter } from '@pixi/filter-drop-shadow'; 



(async () => {
    const app = new Application()

    initDevtools({app})

    await app.init({
        resizeTo: window,
    })

    app.canvas.style.position = "absolute";

    // ---------------
    // styling functions
    
        

    // ---------------
    // Adding BG
    const background = await texture('../assets/background/bg.jpg')
    // Set the width and height of the background to the width and height of the window
    background.height = window.innerHeight
    background.width = window.innerWidth

    // Add the background to the stage
    app.stage.addChild(background)


    // ---------------
    // Moving Clouds
    const clouds_texture = await texture('../assets/background/cloud_bg-removebg-preview.png')
    const moving_clouds = tiling_sprite(clouds_texture.texture)

    let elapsedTime = 0
    const horizontalSpeed = 1   // Horizontal movement speed

    app.ticker.add((ticker) => {

        elapsedTime += ticker.deltaTime
        // Horizontal movement (parallax scrolling)
        moving_clouds.tilePosition.x += horizontalSpeed
    })
    // Add the background to the stage
    app.stage.addChild(moving_clouds)



    document.body.appendChild(app.canvas)



    // ---------------
    // Functions
    // Texture function to make sure that the background is available for use
    async function texture(asset: string) {
        const texture = await Assets.load(asset)
        return new Sprite(texture)  // Created a sprite to allow PixiJS to display the bg
    }

    function tiling_sprite(texture: Texture) {
        return new TilingSprite({ 
            texture,
            width: app.screen.width
         })
    }
})()