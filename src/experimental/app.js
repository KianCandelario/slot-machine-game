"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const devtools_1 = require("@pixi/devtools");
(async () => {
    const app = new pixi_js_1.Application();
    (0, devtools_1.initDevtools)({ app });
    await app.init({
        resizeTo: window,
        backgroundColor: 0x000000
    });
    app.canvas.style.position = "absolute";
    // ---------------
    // Background
    const backgroundTexture = await pixi_js_1.Assets.load('../assets/japanese_theme/bg/bg.jpg');
    const background = new pixi_js_1.Sprite(backgroundTexture);
    background.height = window.innerHeight;
    background.width = window.innerWidth;
    app.stage.addChild(background);
    // Blur
    const blur_filter = new pixi_js_1.BlurFilter();
    blur_filter.blurX = 1;
    blur_filter.blurY = 1;
    background.filters = [blur_filter];
    // ---------------
    // Logo with Drop Shadow
    const logoShadowTexture = await pixi_js_1.Assets.load('../assets/japanese_theme/others/logo.png');
    const logoShadow = new pixi_js_1.Sprite(logoShadowTexture);
    logoShadow.height = 220;
    logoShadow.width = 420;
    logoShadow.x = (window.innerWidth - 400) / 2 + 5;
    logoShadow.y = 35 + 5;
    logoShadow.tint = 0x000000; // shadow black
    logoShadow.alpha = 0.5; // shadow semi-transparent
    // Create the actual logo
    const logoTexture = await pixi_js_1.Assets.load('../assets/japanese_theme/others/logo.png');
    const logo = new pixi_js_1.Sprite(logoTexture);
    logo.height = 220;
    logo.width = 420;
    logo.x = (window.innerWidth - 400) / 2;
    logo.y = 35;
    // Logo on top of the falling petals
    logoShadow.zIndex = 10;
    logo.zIndex = 10;
    // Shadow first, then logo
    app.stage.addChild(logoShadow);
    app.stage.addChild(logo);
    // ---------------
    // Reel
    // Load the textures
    await pixi_js_1.Assets.load([
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
    ]);
    // Create textures for every slot
    const slot_textures = [
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/masks/mask1.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/masks/mask2.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/masks/mask3.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/masks/mask4.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/others/bonus.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/others/wild.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/chars/9.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/chars/10.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/chars/A.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/chars/J.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/chars/K.png"),
        pixi_js_1.Texture.from("../assets/japanese_theme/slot_symbols/chars/Q.png"),
    ];
    // ---------------
    // Main Game Area
    // Container for the entire game area
    const gameArea = new pixi_js_1.Container();
    gameArea.position.set((window.innerWidth - 1050) / 2, (window.innerHeight - 530) / 2);
    gameArea.zIndex = 10;
    app.stage.addChild(gameArea);
    // Reel configuration
    const numReels = 5;
    const reelWidth = 180;
    const reelGap = 20;
    const symbolSize = 120;
    const symbolGap = 30;
    const symbolsToShow = 3; // visible symbols per reel
    const totalReelHeight = symbolsToShow * (symbolSize + symbolGap) + symbolGap;
    const totalReelWidth = numReels * (reelWidth + reelGap) + reelGap;
    // Frame background - fit exactly 5x3 grid
    const frame = new pixi_js_1.Graphics()
        .roundRect(0, 70, totalReelWidth + 40, totalReelHeight + 20, 20)
        .fill(0x000000)
        .stroke({
        width: 7,
        color: 0xfdf9ed,
        alignment: 1
    });
    frame.alpha = 0.5;
    gameArea.addChild(frame);
    // Container for the reels that will be masked
    const reelsViewport = new pixi_js_1.Container();
    reelsViewport.position.set(15, 15); // Adjusted position to center in frame
    gameArea.addChild(reelsViewport);
    // Create the mask for the reels area - match 5x3 grid
    const reelsMask = new pixi_js_1.Graphics()
        .roundRect(0, 45, totalReelWidth, totalReelHeight, 15)
        .fill(0xFFFFFF);
    reelsViewport.addChild(reelsMask);
    reelsViewport.mask = reelsMask;
    // Create a container for all reels
    const reelsContainer = new pixi_js_1.Container();
    reelsContainer.position.set(0, 100); // position to show exactly 3 rows
    reelsViewport.addChild(reelsContainer);
    const reels = [];
    for (let i = 0; i < numReels; i++) {
        // Create a container for this reel
        const reelContainer = new pixi_js_1.Container();
        reelContainer.position.set(i * (reelWidth + reelGap), 0);
        reelsContainer.addChild(reelContainer);
        // Create the reel object to track its properties
        const reel = {
            container: reelContainer,
            symbols: [],
            position: 0,
            prevPosition: 0,
            blur: new pixi_js_1.BlurFilter()
        };
        // No blur by default
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        reelContainer.filters = [reel.blur];
        // Create the symbols for the reel - we need more symbols to create a smooth animation
        // But only 3 will be visible at a time
        const numSymbols = 5; // Create 5 symbols per reel for smooth scrolling
        for (let j = 0; j < numSymbols; j++) {
            // Select a random symbol
            const symbolIndex = Math.floor(Math.random() * slot_textures.length);
            const symbol = new pixi_js_1.Sprite(slot_textures[symbolIndex]);
            // Scale to fit the symbol size
            symbol.scale.x = symbol.scale.y = Math.min(symbolSize / symbol.width, symbolSize / symbol.height);
            // Center the symbol horizontally within the reel
            symbol.x = (reelWidth - symbol.width * symbol.scale.x) / 2;
            // Position vertically - start with standard positions but only 3 will be visible
            symbol.y = j * (symbolSize + symbolGap);
            // Hide symbols that are outside the visible 3-row area
            symbol.visible = j < symbolsToShow;
            // Add directly to the reel container
            reelContainer.addChild(symbol);
            reel.symbols.push(symbol);
        }
        reels.push(reel);
    }
    // ---------------
    // Spin Button Functionality
    const buttonContainer = new pixi_js_1.Container();
    buttonContainer.position.set(window.innerWidth / 2, window.innerHeight - 85);
    buttonContainer.cursor = "pointer";
    buttonContainer.zIndex = 20;
    const buttonSymbolTexture = await pixi_js_1.Assets.load("../assets/japanese_theme/others/button.png");
    const buttonSymbol = new pixi_js_1.Sprite(buttonSymbolTexture);
    buttonSymbol.anchor.set(0.5);
    buttonSymbol.scale.set(.20);
    buttonContainer.interactive = true;
    buttonContainer.addChild(buttonSymbol);
    app.stage.addChild(buttonContainer);
    // ---------------
    // Utility functions
    // for smooth animations
    const tweening = [];
    function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
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
    function lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }
    // Backout easing function for realistic slot machine deceleration
    function backout(amount) {
        return (t) => --t * t * ((amount + 1) * t + amount) + 1;
    }
    // ---------------
    // Petals
    const petalsContainer = new pixi_js_1.Container();
    app.stage.addChild(petalsContainer);
    // Petal Spawning
    const petalTexture = await pixi_js_1.Assets.load('../assets/japanese_theme/others/petals.png');
    const PETAL_COUNT = 50; // Number of petals
    // Petal Class
    class Petal extends pixi_js_1.Sprite {
        speed;
        rotationSpeed;
        wobble;
        wobbleSpeed;
        constructor(texture) {
            super(texture);
            // Randomize petal properties
            this.width = Math.random() * 25 + 10;
            this.height = this.width;
            this.alpha = Math.random() * 0.7 + 0.4;
            // Starting position
            this.x = Math.random() * window.innerWidth;
            this.y = -50; // Start above the screen
            // Movement properties
            this.speed = Math.random() * 1.7 + 1;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.01;
        }
        update() {
            // Falling movement
            this.y += this.speed;
            // Rotation
            this.rotation += this.rotationSpeed;
            // Wobble effect (side-to-side movement)
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 2;
            // Reset if out of screen
            if (this.y > window.innerHeight + 50) {
                this.y = -50;
                this.x = Math.random() * window.innerWidth;
            }
        }
    }
    // Spawn Petals
    const petals = Array.from({ length: PETAL_COUNT }, () => {
        const petal = new Petal(petalTexture);
        petalsContainer.addChild(petal);
        return petal;
    });
    // Update the ticker to process tweens
    app.ticker.add(() => {
        const now = Date.now();
        const remove = [];
        for (let i = 0; i < tweening.length; i++) {
            const t = tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);
            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change)
                t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete)
                    t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
        }
    });
    // ---------------
    // Coin Functionality
    const textContainer = new pixi_js_1.Container();
    textContainer.position.set((window.innerWidth / 2) - 400, window.innerHeight - 130);
    const textFrame = new pixi_js_1.Graphics()
        .roundRect(0, 0, 200, 100, 25)
        .fill(0x00000)
        .stroke({
        width: 5,
        color: 0xfdf9ed,
        alignment: 1
    });
    textFrame.alpha = 0.5;
    const coinTexture = await pixi_js_1.Assets.load('../assets/japanese_theme/others/coin-icon.png');
    const coinIcon = new pixi_js_1.Sprite(coinTexture);
    coinIcon.scale = 0.13;
    coinIcon.x = 23;
    coinIcon.y = 14;
    const textContainerMask = new pixi_js_1.Graphics()
        .roundRect(0, 0, 200, 100, 20)
        .fill(0xFFFFFF);
    textContainer.addChild(textContainerMask);
    textContainer.addChild(textFrame);
    textContainer.addChild(coinIcon);
    textContainer.mask = textContainerMask;
    const style = new pixi_js_1.TextStyle({
        fill: '#fdf9ed',
        fontFamily: 'Nanum Gothic Coding',
        fontSize: 30,
        dropShadow: {
            color: '#000000',
            blur: 10,
            angle: Math.PI / 6,
            distance: 7
        }
    });
    let balance = { value: 1000 };
    let money = new pixi_js_1.Text({
        text: balance.value.toString(),
        style
    });
    money.position.x += 105;
    money.position.y += 32;
    textContainer.addChild(money);
    app.stage.addChild(textContainer);
    // ---------------
    // Bet box
    const betContainer = new pixi_js_1.Container();
    betContainer.position.set((window.innerWidth / 2) + 200, window.innerHeight - 135);
    const betFrame = new pixi_js_1.Graphics()
        .roundRect(0, 0, 300, 110, 25)
        .fill(0x00000)
        .stroke({
        width: 5,
        color: 0xfdf9ed,
        alignment: 1
    });
    betFrame.alpha = 0.5;
    const betMask = new pixi_js_1.Graphics()
        .roundRect(0, 0, 300, 110, 25)
        .fill(0xFFFFFF);
    betContainer.addChild(betFrame);
    betContainer.addChild(betMask);
    betContainer.mask = betMask;
    // Add bet functionality
    // Create a text style for bet-related text
    const betTextStyle = new pixi_js_1.TextStyle({
        fill: '#fdf9ed',
        fontFamily: 'Nanum Gothic Coding',
        fontSize: 22,
        dropShadow: {
            color: '#000000',
            blur: 8,
            angle: Math.PI / 6,
            distance: 5
        }
    });
    const betLabel = new pixi_js_1.Text({
        text: "BET",
        style: betTextStyle
    });
    betLabel.position.set(25, 15);
    betContainer.addChild(betLabel);
    // bet amount state
    let betAmount = { value: 5 };
    // Current bet amount display
    const betAmountStyle = new pixi_js_1.TextStyle({
        fill: '#fdf9ed',
        fontFamily: 'Nanum Gothic Coding',
        fontSize: 32,
        dropShadow: {
            color: '#000000',
            blur: 10,
            angle: Math.PI / 6,
            distance: 7
        }
    });
    const betAmountText = new pixi_js_1.Text({
        text: betAmount.value.toString(),
        style: betAmountStyle
    });
    betAmountText.anchor.set(0.5);
    betAmountText.position.set(150, 35);
    betContainer.addChild(betAmountText);
    // Create decrease bet button
    const decreaseBetButton = new pixi_js_1.Container();
    decreaseBetButton.position.set(80, 70);
    decreaseBetButton.cursor = "pointer";
    decreaseBetButton.interactive = true;
    const decreaseButtonBg = new pixi_js_1.Graphics()
        .circle(0, 0, 20)
        .fill(0x880000)
        .stroke({
        width: 2,
        color: 0xfdf9ed,
        alignment: 0
    });
    const decreaseButtonText = new pixi_js_1.Text({
        text: "-",
        style: new pixi_js_1.TextStyle({
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontSize: 28,
            fontWeight: 'bold'
        })
    });
    decreaseButtonText.anchor.set(0.5);
    decreaseButtonText.position.set(0, -2);
    decreaseBetButton.addChild(decreaseButtonBg);
    decreaseBetButton.addChild(decreaseButtonText);
    betContainer.addChild(decreaseBetButton);
    // Create increase bet button
    const increaseBetButton = new pixi_js_1.Container();
    increaseBetButton.position.set(220, 70);
    increaseBetButton.cursor = "pointer";
    increaseBetButton.interactive = true;
    const increaseButtonBg = new pixi_js_1.Graphics()
        .circle(0, 0, 20)
        .fill(0x008800)
        .stroke({
        width: 2,
        color: 0xfdf9ed,
        alignment: 0
    });
    const increaseButtonText = new pixi_js_1.Text({
        text: "+",
        style: new pixi_js_1.TextStyle({
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontSize: 28,
            fontWeight: 'bold'
        })
    });
    increaseButtonText.anchor.set(0.5);
    increaseButtonText.position.set(0, -2);
    increaseBetButton.addChild(increaseButtonBg);
    increaseBetButton.addChild(increaseButtonText);
    betContainer.addChild(increaseBetButton);
    // Add event handlers for the buttons
    decreaseBetButton.on("pointerdown", () => {
        // Minimum bet is 1
        if (betAmount.value > 1) {
            betAmount.value -= 1;
            betAmountText.text = betAmount.value.toString();
            // Create a quick scale animation for feedback
            decreaseButtonBg.scale.set(0.9);
            setTimeout(() => {
                decreaseButtonBg.scale.set(1);
            }, 100);
        }
    });
    increaseBetButton.on("pointerdown", () => {
        // Maximum bet is balance or 100, whichever is smaller
        const maxBet = Math.min(balance.value, 100);
        if (betAmount.value < maxBet) {
            betAmount.value += 1;
            betAmountText.text = betAmount.value.toString();
            // Create a quick scale animation for feedback
            increaseButtonBg.scale.set(0.9);
            setTimeout(() => {
                increaseButtonBg.scale.set(1);
            }, 100);
        }
    });
    app.stage.addChild(betContainer);
    // Spin Functionality
    let running = false;
    let buttonRotationSpeed = 0;
    let pulseTime = 0;
    function startSpin() {
        if (running)
            return; // If the button is still spinning, do nothing
        // Check if player has enough balance for the current bet
        if (balance.value < betAmount.value) {
            // Flash the balance display red to indicate insufficient funds
            const originalColor = money.style.fill;
            money.style.fill = '#ff0000';
            setTimeout(() => {
                money.style.fill = originalColor;
            }, 500);
            return;
        }
        running = true;
        // Deduct the bet amount from balance
        balance.value -= betAmount.value;
        money.text = balance.value.toString();
        // Disable button during spin
        buttonContainer.interactive = false;
        // Start button rotation animation
        buttonRotationSpeed = 0.15;
        // Reset button scale to normal before spinning
        buttonSymbol.scale.set(.25);
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
            // tweening function for smoother animation
            tweenTo(r, 'position', target, time, backout(0.5), undefined, i === reels.length - 1 ? () => {
                // All reels stopped
                running = false;
                buttonContainer.interactive = true;
                // Stop button rotation when spinning ends
                buttonRotationSpeed = 0;
                // Reset button rotation to original position with a smooth animation
                tweenTo(buttonSymbol, 'rotation', 0, 500, backout(0.5));
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
            } : undefined);
        }
    }
    app.ticker.add(() => {
        // Update the petals animation
        petals.forEach(petal => petal.update());
        // Pulsing animation when not spinning
        if (!running) {
            // Update the pulse time
            pulseTime += 0.08;
            // Calculate pulse scale factor using sine wave
            const pulseFactor = 0.25 + Math.sin(pulseTime) * 0.010;
            // Apply pulse scaling
            buttonSymbol.scale.set(pulseFactor);
            // Add a slight wobble for more dynamic effect
            buttonSymbol.rotation = Math.sin(pulseTime * 0.5) * 0.03;
        }
        // Rotate the button when spinning
        if (buttonRotationSpeed > 0) {
            buttonSymbol.rotation += buttonRotationSpeed;
        }
        // Update the slots
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Skip update if the reel position hasn't changed
            if (r.position === r.prevPosition)
                continue;
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
                    symbol.scale.x = symbol.scale.y = Math.min(symbolSize / symbol.width, symbolSize / symbol.height);
                    // Center the symbol horizontally within the reel
                    symbol.x = (reelWidth - symbol.width * symbol.scale.x) / 2;
                }
            }
        }
    });
    buttonContainer.on("pointerdown", startSpin);
    document.body.appendChild(app.canvas);
})();
