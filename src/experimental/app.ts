import { 
    Application,
    Assets,
    Sprite,
    Texture,
    Container,
    Graphics,
    BlurFilter
} from "pixi.js"
import { initDevtools } from "@pixi/devtools"

(async () => {
    const app = new Application()

    initDevtools({app})

    await app.init({
        resizeTo: window,
    })

    app.canvas.style.position = "absolute";

    // ---------------
    // Background
    const backgroundTexture = await Assets.load('../assets/japanese_theme/bg/bg1.jpg')
    const background = new Sprite(backgroundTexture)
    background.height = window.innerHeight
    background.width = window.innerWidth
    app.stage.addChild(background)

    // Blur
    const blur_filter = new BlurFilter()
    blur_filter.blurX = 0
    blur_filter.blurY = 0
    background.filters = [blur_filter]




    // ---------------
    // Logo with Drop Shadow
    // Create shadow sprite first
    const logoShadowTexture = await Assets.load('../assets/japanese_theme/others/logo.png')
    const logoShadow = new Sprite(logoShadowTexture)
    logoShadow.height = 220
    logoShadow.width = 420
    logoShadow.x = (window.innerWidth-400)/2 + 5
    logoShadow.y = 35 + 5
    logoShadow.tint = 0x000000  // Make shadow black
    logoShadow.alpha = 0.5      // Make shadow semi-transparent

    // Create the actual logo
    const logoTexture = await Assets.load('../assets/japanese_theme/others/logo.png')
    const logo = new Sprite(logoTexture)
    logo.height = 220
    logo.width = 420
    logo.x = (window.innerWidth-400)/2
    logo.y = 35

    logo.zIndex = 10
    logoShadow.zIndex = 10

    // Add shadow first, then logo
    app.stage.addChild(logoShadow)
    app.stage.addChild(logo)




    // ---------------
    // Window Frame
    const frame = new Graphics({
        x: (window.innerWidth-1000)/2,
        y: (window.innerHeight-600)/2
    })
    .roundRect(0, 100, 1000, 600, 20)
    .fill(0x000000)
    frame.alpha = 0.5
    frame.zIndex = 10
    app.stage.addChild(frame);

    // ---------------
    // Masking
    const mask = new Graphics()
    .roundRect(0, 100, 900, 500, 20)
    .fill(0xFFFFFF)

    const mask_container = new Container()
    mask_container.mask = mask
    mask_container.addChild(mask)
    mask_container.position.set(4,4)

    frame.addChild(mask_container)




    // ---------------
    // Petals Container
    const petalsContainer = new Container()
    app.stage.addChild(petalsContainer)

    // Petal Spawning
    const petalTexture = await Assets.load('../assets/japanese_theme/others/petals.png')
    const PETAL_COUNT = 50  // Number of petals

    // Petal Class
    class Petal extends Sprite {
        speed: number
        rotationSpeed: number
        wobble: number
        wobbleSpeed: number

        constructor(texture: Texture) {
            super(texture)
            
            // Randomize petal properties
            this.width = Math.random() * 25 + 10  // Random size between 10-35
            this.height = this.width
            this.alpha = Math.random() * 0.7 + 0.4  // Random opacity 0.4-1

            // Starting position
            this.x = Math.random() * window.innerWidth
            this.y = -50  // Start above the screen

            // Movement properties
            this.speed = Math.random() * 2 + 1  // Falling speed
            this.rotationSpeed = (Math.random() - 0.5) * 0.1  // Rotation
            this.wobble = Math.random() * Math.PI * 2  // Initial wobble phase
            this.wobbleSpeed = Math.random() * 0.05 + 0.01  // Wobble speed
        }

        update() {
            // Falling movement
            this.y += this.speed

            // Rotation
            this.rotation += this.rotationSpeed

            // Wobble effect (side-to-side movement)
            this.wobble += this.wobbleSpeed
            this.x += Math.sin(this.wobble) * 2

            // Reset if out of screen
            if (this.y > window.innerHeight + 50) {
                this.y = -50
                this.x = Math.random() * window.innerWidth
            }
        }
    }

    // Spawn Petals
    const petals = Array.from({ length: PETAL_COUNT }, () => {
        const petal = new Petal(petalTexture)
        petalsContainer.addChild(petal)
        return petal
    })

    // Animation Loop
    app.ticker.add(() => {
        petals.forEach(petal => petal.update())
    })



    // ---------------
    // Reel
    
    




    document.body.appendChild(app.canvas)
})()