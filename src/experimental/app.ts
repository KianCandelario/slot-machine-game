import { 
    Application,
    Assets,
    Sprite,
    Texture,
    Container,
    Graphics,
    BlurFilter,
    ContainerChild
} from "pixi.js"
import { initDevtools } from "@pixi/devtools"

(async () => {
    const app = new Application()

    initDevtools({app})

    await app.init({
        resizeTo: window,
        backgroundColor: 0x000000
    })

    app.canvas.style.position = "absolute";





    // ---------------
    // Background
    const backgroundTexture = await Assets.load('../assets/japanese_theme/bg/bg.jpg')
    const background = new Sprite(backgroundTexture)
    background.height = window.innerHeight
    background.width = window.innerWidth
    app.stage.addChild(background)

    // Blur
    const blur_filter = new BlurFilter()
    blur_filter.blurX = 1
    blur_filter.blurY = 1
    background.filters = [blur_filter]





    // ---------------
    // Logo with Drop Shadow
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

    // Logo on top of the falling petals
    logoShadow.zIndex = 10
    logo.zIndex = 10

    // Shadow first, then logo
    app.stage.addChild(logoShadow)
    app.stage.addChild(logo)





    // ---------------
    // Reel
    // Load the textures
    await Assets.load([
        "../assets/japanese_theme/slot_symbols/masks/mask1.png",
        "../assets/japanese_theme/slot_symbols/masks/mask2.png",
        "../assets/japanese_theme/slot_symbols/masks/mask3.png",
        "../assets/japanese_theme/slot_symbols/masks/mask4.png",
        "../assets/japanese_theme/slot_symbols/others/bonus.png",
        "../assets/japanese_theme/slot_symbols/others/wild.png",
        "../assets/japanese_theme/slot_symbols/chars/9.png",
        "../assets/japanese_theme/slot_symbols/chars/10.png",
        "../assets/japanese_theme/slot_symbols/chars/A.png",
        "../assets/japanese_theme/slot_symbols/chars/J.png",
        "../assets/japanese_theme/slot_symbols/chars/K.png",
        "../assets/japanese_theme/slot_symbols/chars/Q.png",
    ])

    // Create textures for every slot
    const slot_textures = [
        Texture.from("../assets/japanese_theme/slot_symbols/masks/mask1.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/masks/mask2.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/masks/mask3.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/masks/mask4.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/others/bonus.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/others/wild.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/chars/9.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/chars/10.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/chars/A.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/chars/J.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/chars/K.png"),
        Texture.from("../assets/japanese_theme/slot_symbols/chars/Q.png"),
    ]
    
    // ---------------
    // Main Game Area
    // Container for the entire game area
    const gameArea = new Container()
    gameArea.position.set(
        (window.innerWidth-1050)/2, 
        (window.innerHeight-530)/2
    )
    gameArea.zIndex = 10
    app.stage.addChild(gameArea)
    
    // Reel configuration
    const numReels = 5
    const reelWidth = 180
    const reelGap = 20
    const symbolSize = 120
    const symbolGap = 30
    const symbolsToShow = 3 // Number of visible symbols per reel
    const totalReelHeight = symbolsToShow * (symbolSize + symbolGap) + symbolGap
    const totalReelWidth = numReels * (reelWidth + reelGap) + reelGap
    
    // Frame background - adjusted to fit exactly 5x3 grid
    const frame = new Graphics()
        .roundRect(0, 70, totalReelWidth + 40, totalReelHeight + 20, 20)
        .fill(0x000000)
    frame.alpha = 0.5
    gameArea.addChild(frame)
    
    // Container for the reels that will be masked
    const reelsViewport = new Container()
    reelsViewport.position.set(15, 15) // Adjusted position to center in frame
    gameArea.addChild(reelsViewport)
    
    // Create the mask for the reels area - adjusted to match 5x3 grid
    const reelsMask = new Graphics()
        .roundRect(0, 45, totalReelWidth, totalReelHeight, 15)
        .fill(0xFFFFFF)
    reelsViewport.addChild(reelsMask)
    reelsViewport.mask = reelsMask
    
    // Create a container for all reels
    const reelsContainer = new Container()
    reelsContainer.position.set(0, 100) // Position to show exactly 3 rows
    reelsViewport.addChild(reelsContainer)
    
    const reels: { 
        container: Container<ContainerChild>; 
        symbols: Sprite[]; position: number; 
        prevPosition: number; 
        blur: BlurFilter 
    }[] = []
    
    for (let i = 0; i < numReels; i++) {
        // Create a container for this reel
        const reelContainer = new Container()
        reelContainer.position.set(i * (reelWidth + reelGap), 0)
        reelsContainer.addChild(reelContainer)
        
        // Create the reel object to track its properties
        const reel = {
            container: reelContainer,
            symbols: [] as Sprite[],
            position: 0,
            prevPosition: 0,
            blur: new BlurFilter()
        }
        
        // No blur by default
        reel.blur.blurX = 0
        reel.blur.blurY = 0
        reelContainer.filters = [reel.blur]
        
        // Create the symbols for the reel - we need more symbols to create a smooth animation
        // But only 3 will be visible at a time
        const numSymbols = 5; // Create 5 symbols per reel for smooth scrolling
        
        for (let j = 0; j < numSymbols; j++) {
            // Select a random symbol
            const symbolIndex = Math.floor(Math.random() * slot_textures.length)
            const symbol = new Sprite(slot_textures[symbolIndex])
            
            // Scale to fit the symbol size
            symbol.scale.x = symbol.scale.y = Math.min(
                symbolSize / symbol.width,
                symbolSize / symbol.height
            )
            
            // Center the symbol horizontally within the reel
            symbol.x = (reelWidth - symbol.width * symbol.scale.x) / 2
            
            // Position vertically - start with standard positions but only 3 will be visible
            symbol.y = j * (symbolSize + symbolGap)
            
            // Hide symbols that are outside the visible 3-row area
            symbol.visible = j < symbolsToShow
            
            // Add directly to the reel container
            reelContainer.addChild(symbol)
            reel.symbols.push(symbol)
        }
        
        reels.push(reel)
    }




    // ---------------
    // Spin Button
    const buttonContainer = new Container();
    buttonContainer.position.set(window.innerWidth / 2, window.innerHeight - 85);
    buttonContainer.cursor = "pointer";
    buttonContainer.zIndex = 20;


    const buttonSymbolTexture = await Assets.load("../assets/japanese_theme/others/button.png");
    const buttonSymbol = new Sprite(buttonSymbolTexture);
    buttonSymbol.anchor.set(0.5);
    buttonSymbol.scale.set(.25);
    buttonContainer.interactive = true;
    buttonContainer.addChild(buttonSymbol);

    app.stage.addChild(buttonContainer);




    // ---------------
    // Utility functions
    // for smooth animations
    const tweening: {
        object: any;
        property: string;
        propertyBeginValue: number;
        target: number;
        easing: (t: number) => number;
        time: number;
        change?: (t: any) => void;
        complete?: (t: any) => void;
        start: number;
    }[] = [];

    function tweenTo(object: any, property: string, target: number, time: number, 
                    easing: (t: number) => number, onchange?: (t: any) => void, 
                    oncomplete?: (t: any) => void) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };

        tweening.push(tween);
        return tween;
    }

    // Linear interpolation function
    function lerp(a1: number, a2: number, t: number) {
        return a1 * (1 - t) + a2 * t;
    }

    // Backout easing function for realistic slot machine deceleration
    function backout(amount: number) {
        return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
    }

    // Update the ticker to process tweens
    app.ticker.add(() => {
        const now = Date.now();
        const remove = [];

        for (let i = 0; i < tweening.length; i++) {
            const t = tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
        }
    });

    




    // Spin Functionality
    let running = false;

    // Improved startSpin function
    function startSpin() {
        if (running) return;
        running = true;
        
        // Disable button during spin
        buttonContainer.interactive = false;
        
        // Prepare all reels for spinning
        for (const reel of reels) {
            // Make all symbols visible before spinning
            for (const symbol of reel.symbols) {
                symbol.visible = true;
            }
        }
        
        // Start each reel with a delay and smoother animation
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Random number of rotations plus offset based on reel position
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            // Calculate time based on reel index for sequential stopping
            const time = 2500 + i * 600 + extra * 600;
            
            // Use the tweening function for smoother animation
            tweenTo(
                r,
                'position',
                target,
                time,
                backout(0.5),
                undefined,
                i === reels.length - 1 ? () => {
                    // All reels stopped
                    running = false;
                    buttonContainer.interactive = true;
                    
                    // Ensure only 3 symbols are visible per reel when stopped
                    for (const reel of reels) {
                        for (let j = 0; j < reel.symbols.length; j++) {
                            const symbol = reel.symbols[j];
                            // Calculate if this symbol should be in the visible 3-row area
                            const slotHeight = symbolSize + symbolGap;
                            const symbolPosition = ((reel.position + j) % reel.symbols.length) * slotHeight;
                            symbol.visible = symbolPosition >= 0 && symbolPosition < symbolsToShow * slotHeight;
                        }
                    }
                    
                    // TODO: Check for winning combinations here
                } : undefined
            );
        }
    }

    // Updated ticker function for proper symbol movement and containment
    app.ticker.add(() => {
        // Update the petals animation
        petals.forEach(petal => petal.update());
        
        // Update the slots
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            
            // Skip update if the reel position hasn't changed
            if (r.position === r.prevPosition) continue;
            
            // Update blur filter based on speed
            const speed = Math.abs(r.position - r.prevPosition);
            r.blur.blurY = speed * 8;
            r.prevPosition = r.position;
            
            // Total height of a single symbol slot (including gap)
            const slotHeight = symbolSize + symbolGap;
            
            // Update symbol positions
            for (let j = 0; j < r.symbols.length; j++) {
                const symbol = r.symbols[j];
                const prevY = symbol.y;
                
                // Move symbol based on reel position
                symbol.y = ((r.position + j) % r.symbols.length) * slotHeight;
                
                // Control visibility during spinning - only show symbols in the visible area
                if (running) {
                    symbol.visible = symbol.y >= 0 && symbol.y < symbolsToShow * slotHeight;
                }
                
                // If symbol moves below visible area, recycle it to the top with new texture
                if (symbol.y < 0 && prevY > slotHeight) {
                    // Swap in a new random texture
                    symbol.texture = slot_textures[Math.floor(Math.random() * slot_textures.length)];
                    // Adjust scale to maintain proper sizing
                    symbol.scale.x = symbol.scale.y = Math.min(
                        symbolSize / symbol.width,
                        symbolSize / symbol.height
                    );
                    // Center the symbol horizontally within the reel
                    symbol.x = (reelWidth - symbol.width * symbol.scale.x) / 2;
                }
            }
        }
    });

    buttonContainer.on("pointerdown", startSpin);



    // ---------------
    // Coin Functionality
    // --- here --- 




    // ---------------
    // Petals
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
            this.speed = Math.random() * 1.7 + 1  // Falling speed
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

    document.body.appendChild(app.canvas)
})()