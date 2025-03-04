"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const devtools_1 = require("@pixi/devtools");
const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;
// Create a new application
(async () => {
    const app = new pixi_js_1.Application();
    (0, devtools_1.initDevtools)({ app });
    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });
    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);
    // Load the textures
    await pixi_js_1.Assets.load([
        '../assets/cleaned/S/angry_cowboy_cat-removebg-preview.png',
        '../assets/cleaned/S/cat_shades-removebg-preview.png',
        '../assets/cleaned/S/smiling_cat-removebg-preview.png',
        '../assets/cleaned/S/white_cat-removebg-preview.png',
        '../assets/cleaned/others/cat_bonus.png',
        '../assets/cleaned/others/wild_cat.png',
        '../assets/cleaned/lettersNum/9.png',
        '../assets/cleaned/lettersNum/cat_placard_10.png',
        '../assets/cleaned/lettersNum/cat_placard_a.png',
        '../assets/cleaned/lettersNum/cat_placard_j.png',
        '../assets/cleaned/lettersNum/cat_placard_k.png',
        '../assets/cleaned/lettersNum/cat_placard_q.png',
    ]);
    // Create different slot symbols
    const slotTextures = [
        pixi_js_1.Texture.from('../assets/cleaned/S/angry_cowboy_cat-removebg-preview.png'),
        pixi_js_1.Texture.from('../assets/cleaned/S/cat_shades-removebg-preview.png'),
        pixi_js_1.Texture.from('../assets/cleaned/S/smiling_cat-removebg-preview.png'),
        pixi_js_1.Texture.from('../assets/cleaned/S/white_cat-removebg-preview.png'),
        pixi_js_1.Texture.from('../assets/cleaned/others/cat_bonus.png'),
        pixi_js_1.Texture.from('../assets/cleaned/others/wild_cat.png'),
        pixi_js_1.Texture.from('../assets/cleaned/lettersNum/9.png'),
        pixi_js_1.Texture.from('../assets/cleaned/lettersNum/cat_placard_10.png'),
        pixi_js_1.Texture.from('../assets/cleaned/lettersNum/cat_placard_a.png'),
        pixi_js_1.Texture.from('../assets/cleaned/lettersNum/cat_placard_j.png'),
        pixi_js_1.Texture.from('../assets/cleaned/lettersNum/cat_placard_k.png'),
        pixi_js_1.Texture.from('../assets/cleaned/lettersNum/cat_placard_q.png'),
    ];
    // Build the reels
    const reels = [];
    const reelContainer = new pixi_js_1.Container();
    for (let i = 0; i < 5; i++) {
        const rc = new pixi_js_1.Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);
        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new pixi_js_1.BlurFilter(),
        };
        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];
        // Build the symbols
        for (let j = 0; j < 4; j++) {
            const symbol = new pixi_js_1.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);
    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    const top = new pixi_js_1.Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 0x0 });
    const bottom = new pixi_js_1.Graphics().rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin).fill({ color: 0x0 });
    // Create gradient fill
    const fill = new pixi_js_1.FillGradient(0, 0, 0, 2);
    const colors = [0xffffff, 0x00ff99].map((color) => pixi_js_1.Color.shared.setValue(color).toNumber());
    colors.forEach((number, index) => fill.addColorStop(index / colors.length, number));
    // Add play text
    const style = new pixi_js_1.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: { fill },
        stroke: { color: 0x4a1850, width: 5 },
        dropShadow: {
            color: 0x000000,
            angle: Math.PI / 6,
            blur: 4,
            distance: 6,
        },
        wordWrap: true,
        wordWrapWidth: 440,
    });
    const playText = new pixi_js_1.Text('Spin the wheels!', style);
    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);
    // Add header text
    const headerText = new pixi_js_1.Text('PIXI MONSTER SLOTS!', style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);
    app.stage.addChild(top);
    app.stage.addChild(bottom);
    // Set the interactivity
    bottom.eventMode = 'static';
    bottom.cursor = 'pointer';
    bottom.addListener('pointerdown', () => startPlay());
    let running = false;
    // Function to start playing
    function startPlay() {
        if (running)
            return;
        running = true;
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }
    function reelsComplete() {
        running = false;
    }
    // Update the slots
    app.ticker.add(() => {
        for (const r of reels) {
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;
            for (const s of r.symbols) {
                const prevy = s.y;
                s.y = ((r.position + r.symbols.indexOf(s)) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });
    const tweening = [];
    function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange ?? undefined,
            complete: oncomplete ?? undefined,
            start: Date.now(),
        };
        tweening.push(tween);
    }
    app.ticker.add(() => {
        const now = Date.now();
        const remove = [];
        for (const t of tweening) {
            const phase = Math.min(1, (now - t.start) / t.time);
            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change)
                t.change();
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete)
                    t.complete();
                remove.push(t);
            }
        }
        for (const t of remove) {
            tweening.splice(tweening.indexOf(t), 1);
        }
    });
    function lerp(a1, a2, t) {
        return a1 * (1 - t) + a2 * t;
    }
    function backout(amount) {
        return (t) => --t * t * ((amount + 1) * t + amount) + 1;
    }
})();
