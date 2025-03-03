import {
    Application,
    Assets,
    BlurFilter,
    Color,
    Container,
    FillGradient,
    Graphics,
    Sprite,
    Text,
    TextStyle,
    Texture,
} from 'pixi.js';

interface Reel {
    container: Container;
    symbols: Sprite[];
    position: number;
    previousPosition: number;
    blur: BlurFilter;
}

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

// Create a new application
(async () => {
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the textures
    await Assets.load([
        'https://pixijs.com/assets/eggHead.png',
        'https://pixijs.com/assets/flowerTop.png',
        'https://pixijs.com/assets/helmlok.png',
        'https://pixijs.com/assets/skully.png',
    ]);

    // Create different slot symbols
    const slotTextures: Texture[] = [
        Texture.from('https://pixijs.com/assets/eggHead.png'),
        Texture.from('https://pixijs.com/assets/flowerTop.png'),
        Texture.from('https://pixijs.com/assets/helmlok.png'),
        Texture.from('https://pixijs.com/assets/skully.png'),
    ];

    // Build the reels
    const reels: Reel[] = [];
    const reelContainer = new Container();

    for (let i = 0; i < 5; i++) {
        const rc = new Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel: Reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new BlurFilter(),
        };

        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (let j = 0; j < 4; j++) {
            const symbol = new Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
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
    
    const top = new Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 0x0 });
    const bottom = new Graphics().rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin).fill({ color: 0x0 });

    // Create gradient fill
    const fill = new FillGradient(0, 0, 0, 2);
    const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());
    colors.forEach((number, index) => fill.addColorStop(index / colors.length, number));

    // Add play text
    const style = new TextStyle({
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

    const playText = new Text('Spin the wheels!', style);
    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);

    // Add header text
    const headerText = new Text('PIXI MONSTER SLOTS!', style);
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
    function startPlay(): void {
        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;

            tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }

    function reelsComplete(): void {
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

    // Tweening utility function
    interface Tween {
        object: any;
        property: string;
        propertyBeginValue: number;
        target: number;
        easing: (t: number) => number;
        time: number;
        change?: (() => void) | null;
        complete?: (() => void) | null;
        start: number;
    }

    const tweening: Tween[] = [];

    function tweenTo(
        object: any,
        property: string,
        target: number,
        time: number,
        easing: (t: number) => number,
        onchange?: (() => void) | null,
        oncomplete?: (() => void) | null
    ): void {
        const tween: Tween = {
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
        const remove: Tween[] = [];

        for (const t of tweening) {
            const phase = Math.min(1, (now - t.start) / t.time);
            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));

            if (t.change) t.change();
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete();
                remove.push(t);
            }
        }

        for (const t of remove) {
            tweening.splice(tweening.indexOf(t), 1);
        }
    });

    function lerp(a1: number, a2: number, t: number): number {
        return a1 * (1 - t) + a2 * t;
    }

    function backout(amount: number): (t: number) => number {
        return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
    }
})();
