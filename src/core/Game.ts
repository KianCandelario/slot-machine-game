import { Application } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Background } from "../components/view/Background.ts";
import { Logo } from "../components/view/Logo.ts";
import { GameArea } from "../components/ui/containers/GameArea.ts"
import { SpinButton } from "../components/ui/SpinButton.ts";

export class Game {
    private app: Application;
    private background: Background;
    private logo: Logo;
    private gameArea: GameArea
    private spinButton: SpinButton

    constructor() {
        this.app = new Application();
        this.background = new Background();
        this.logo = new Logo();
        this.gameArea = new GameArea();
        this.spinButton = new SpinButton();
    }

    public async init(): Promise<void> {
        // Initialize devtools
        initDevtools({ app: this.app });

        // Initialize the application
        await this.app.init({
            resizeTo: window,
            backgroundColor: 0x000000,
        });

        this.app.canvas.style.position = "absolute";

        // Add the canvas to the document
        document.body.appendChild(this.app.canvas);

        // Initialize the components
        try {
            await this.background.init();
            await this.logo.init();
            await this.gameArea.init();
            await this.spinButton.init();

            // Add to the stage
            this.app.stage.addChild(this.background);
            this.app.stage.addChild(this.logo);
            this.app.stage.addChild(this.gameArea)
            this.app.stage.addChild(this.spinButton)
        } catch (error) {
            console.error("Failed to initialize components:", error);
        }
    }

    // Game loop update function
    private update = (delta: number): void => {
        // Update all components
        this.background.update(delta);
        this.logo.update(delta);
    };

    // Clean up event listeners and components when needed
    public destroy(): void {
        // The background and logo components now handle their own cleanup
        this.background.destroy();
        this.logo.destroy();

        // Clean up the application
        this.app.destroy();
    }
}