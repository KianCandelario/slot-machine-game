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

    constructor() {
        
    }
    
    
    public static async init(app: Application): Promise<void> {
        this.app = app;


        this.logo = new Logo()
        await this.logo.init()
        

        this.setupLoadingScreen();
        await this.loadAllAssets();
        this.hideLoadingScreen();
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
        
        // create title text
        const titleText = new Text({
            text: "Loading...",
            style: {
                fontFamily: "Arial",
                fontSize: 30,
                fill: 0xffffff,
                align: "center"
                }
            });
        titleText.anchor.set(0.5);
        titleText.x = this.app.screen.width / 2;
        titleText.y = this.app.screen.height / 2 + 105;
        this.loadingContainer.addChild(titleText);
        
        // create progress bar background
        const progressBarBg = new Graphics();
        progressBarBg.beginFill(0x333333);
        progressBarBg.roundRect(
            this.app.screen.width / 2 - 200,
            this.app.screen.height / 2 + 155,
            400,
            20,
            15
        );
        progressBarBg.endFill();
        this.loadingContainer.addChild(progressBarBg);
        
        // create progress bar
        this.progressBar = new Graphics();
        this.progressBar.beginFill(0xdf535c);
        this.progressBar.roundRect(
            this.app.screen.width / 2 - 200,
            this.app.screen.height / 2 + 155,
            0, // initial width is 0
            20,
            15
        );
        this.progressBar.endFill();
        this.loadingContainer.addChild(this.progressBar);
        
        // create progress text
        this.progressText = new Text({
            text: "0%",
            style: {
                fontFamily: "Arial",
                fontSize: 24,
                fill: 0xffffff,
                align: "center"
            }
        });
        this.progressText.anchor.set(0.5);
        this.progressText.x = this.app.screen.width / 2;
        this.progressText.y = this.app.screen.height / 2 + 215;
        this.loadingContainer.addChild(this.progressText);

        const logoContainer = new Container()
        logoContainer.addChild(this.logo)
        
        logoContainer.position._y=150

        this.loadingContainer.addChild(logoContainer)
    }
    
    private static updateProgress(progress: number): void {
        // update progress bar width
        const width = Math.floor(400 * progress);
        this.progressBar.clear();
        this.progressBar.beginFill(0xdf535c);
        this.progressBar.roundRect(
            this.app.screen.width / 2 - 200,
            this.app.screen.height / 2 + 155,
            width,
            20,
            15
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