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
        backgroundColor: 0xffea00
    })

    app.canvas.style.position = "absolute";

    document.body.appendChild(app.canvas)
})()