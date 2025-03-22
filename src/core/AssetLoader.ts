import { 
    Application, 
    Assets, 
    Container, 
    Graphics, 
    Text, 
    Texture 
} from "pixi.js";
import { Logo } from "../components/view/Logo";

export class AssetPreloader {
    private static textures: Texture[] = [];
    private static buttonTexture: Texture;
    private static petalTexture: Texture;
    private static coinTexture: Texture;
    private static logo: Logo;
    
    private static app: Application;
    private static progressBar: Graphics;
    private static progressText: Text;
    private static loadingContainer: Container;
    private static titleText: Text;
    private static progressBarBg: Graphics;

    constructor() {
        
    }
    
    public static async init(app: Application): Promise<void> {
        this.app = app;

        this.logo = new Logo();
        await this.logo.init();
        
        this.setupLoadingScreen();
        
        // add window resize event listener
        window.addEventListener('resize', this.handleResize.bind(this));
        
        await this.loadAllAssets();
        this.hideLoadingScreen();
        
        // remove event listener when loading is complete
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
    
    private static handleResize(): void {
        // update app renderer size to match the new window dimensions
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        
        // reposition all elements based on new screen dimensions
        this.repositionElements();
    }
    
    private static repositionElements(): void {
        // update background size
        const background = this.loadingContainer.getChildAt(0) as Graphics;
        background.clear();
        background.beginFill(0x022c3c, 0.7);
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        
        // reposition title text
        this.titleText.x = this.app.screen.width / 2;
        this.titleText.y = this.app.screen.height / 2 + this.getResponsiveValue(105);
        
        // adjust text size based on screen width
        this.titleText.style.fontSize = this.getResponsiveValue(30);
        this.progressText.style.fontSize = this.getResponsiveValue(24);
        
        // reposition and rescale progress bar background
        const progressBarWidth = this.getResponsiveValue(400);
        const progressBarHeight = this.getResponsiveValue(20);
        const progressBarRadius = this.getResponsiveValue(15);
        
        this.progressBarBg.clear();
        this.progressBarBg.beginFill(0x333333);
        this.progressBarBg.roundRect(
            this.app.screen.width / 2 - progressBarWidth / 2,
            this.app.screen.height / 2 + this.getResponsiveValue(155),
            progressBarWidth,
            progressBarHeight,
            progressBarRadius
        );
        this.progressBarBg.endFill();
        
        // reposition and rescale progress bar (keep the same progress percentage)
        const currentProgress = parseInt(this.progressText.text) / 100;
        this.updateProgress(currentProgress);
        
        // reposition progress text
        this.progressText.x = this.app.screen.width / 2;
        this.progressText.y = this.app.screen.height / 2 + this.getResponsiveValue(215);
        
        // trigger the recalculateLayout method
        if (this.logo && typeof this.logo['recalculateLayout'] === 'function') {
            this.logo['recalculateLayout'](this.app.screen.width);
        }
    }
    
    // helper method to calculate responsive values based on screen size
    private static getResponsiveValue(baseValue: number): number {
        const baseWidth = 1920; // reference width
        const scaleFactor = Math.min(this.app.screen.width / baseWidth, 1);
        return Math.max(baseValue * scaleFactor, baseValue * 0.5); // ensure minimum size
    }
    
    private static setupLoadingScreen(): void {
        // create container for loading elements
        this.loadingContainer = new Container();
        this.app.stage.addChild(this.loadingContainer);

        // create background
        const background = new Graphics();
        background.beginFill(0x022c3c, 0.7);
        background.rect(0, 0, this.app.screen.width, this.app.screen.height);
        background.endFill();
        this.loadingContainer.addChild(background);
        
        // adds top margin to the logo
        this.logo.position._y = 70
        // add logo to the container
        this.loadingContainer.addChild(this.logo);
        
        // create title text
        this.titleText = new Text({
            text: "Loading...",
            style: {
                fontFamily: "Arial",
                fontSize: this.getResponsiveValue(30),
                fill: 0xffffff,
                align: "center"
            }
        });
        this.titleText.anchor.set(0.5);
        this.titleText.x = this.app.screen.width / 2;
        this.titleText.y = this.app.screen.height / 2 + this.getResponsiveValue(105);
        this.loadingContainer.addChild(this.titleText);
        
        // calculate responsive dimensions for progress bar
        const progressBarWidth = this.getResponsiveValue(400);
        const progressBarHeight = this.getResponsiveValue(20);
        const progressBarRadius = this.getResponsiveValue(15);
        
        // create progress bar background
        this.progressBarBg = new Graphics();
        this.progressBarBg.beginFill(0x333333);
        this.progressBarBg.roundRect(
            this.app.screen.width / 2 - progressBarWidth / 2,
            this.app.screen.height / 2 + this.getResponsiveValue(155),
            progressBarWidth,
            progressBarHeight,
            progressBarRadius
        );
        this.progressBarBg.endFill();
        this.loadingContainer.addChild(this.progressBarBg);
        
        // create progress bar
        this.progressBar = new Graphics();
        this.progressBar.beginFill(0xdf535c);
        this.progressBar.roundRect(
            this.app.screen.width / 2 - progressBarWidth / 2,
            this.app.screen.height / 2 + this.getResponsiveValue(155),
            0, // initial width is 0
            progressBarHeight,
            progressBarRadius
        );
        this.progressBar.endFill();
        this.loadingContainer.addChild(this.progressBar);
        
        // create progress text
        this.progressText = new Text({
            text: "0%",
            style: {
                fontFamily: "Arial",
                fontSize: this.getResponsiveValue(24),
                fill: 0xffffff,
                align: "center"
            }
        });
        this.progressText.anchor.set(0.5);
        this.progressText.x = this.app.screen.width / 2;
        this.progressText.y = this.app.screen.height / 2 + this.getResponsiveValue(215);
        this.loadingContainer.addChild(this.progressText);
    }
    
    private static updateProgress(progress: number): void {
        // calculate responsive dimensions
        const progressBarWidth = this.getResponsiveValue(400);
        const progressBarHeight = this.getResponsiveValue(20);
        const progressBarRadius = this.getResponsiveValue(15);
        
        // update progress bar width
        const width = Math.floor(progressBarWidth * progress);
        this.progressBar.clear();
        this.progressBar.beginFill(0xdf535c);
        this.progressBar.roundRect(
            this.app.screen.width / 2 - progressBarWidth / 2,
            this.app.screen.height / 2 + this.getResponsiveValue(155),
            width,
            progressBarHeight,
            progressBarRadius
        );
        this.progressBar.endFill();
        
        // update progress text
        const percentage = Math.floor(progress * 100);
        this.progressText.text = `${percentage}%`;
    }
    
    private static hideLoadingScreen(): void {
        if (this.loadingContainer && this.loadingContainer.parent) {
            this.app.stage.removeChild(this.loadingContainer);
        }
    }
    
    public static async loadAllAssets(): Promise<void> {
        // register all assets
        const texturePaths = [
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
            "../assets/japanese_theme/others/button.png",
            "../assets/japanese_theme/others/petals.png",
            "../assets/japanese_theme/others/coin-icon.png"
        ];
        
        const bundleId = "gameAssets";
        
        // type the bundle object with an index signature
        Assets.addBundle(bundleId, texturePaths.reduce<Record<string, string>>((bundle, path) => {
            // extract the filename from the path as the asset name
            const name = path.split('/').pop()!.split('.')[0];
            bundle[name] = path;
            return bundle;
        }, {}));
        
        // load all assets at once with progress tracking
        const bundle = await Assets.loadBundle(bundleId, (progress) => {
            this.updateProgress(progress);
        });
        
        // store textures for later use
        this.textures = [
            bundle["mask1"],
            bundle["mask2"],
            bundle["mask3"],
            bundle["mask4"],
            bundle["bonus"],
            bundle["wild"],
            bundle["9"],
            bundle["10"],
            bundle["A"],
            bundle["J"],
            bundle["K"],
            bundle["Q"]
        ];
        
        this.buttonTexture = bundle["button"];
        this.petalTexture = bundle["petals"];
        this.coinTexture = bundle["coin-icon"];
    }
    
    public static getTextures(): Texture[] {
        return this.textures;
    }
    
    public static getButtonTexture(): Texture {
        return this.buttonTexture;
    }
    
    public static getPetalTexture(): Texture {
        return this.petalTexture;
    }
    
    public static getCoinTexture(): Texture {
        return this.coinTexture;
    }
}