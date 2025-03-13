import { Application } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Background } from "../components/view/Background.ts";
import { Logo } from "../components/view/Logo.ts";
import { GameArea } from "../components/ui/containers/GameArea.ts"
import { SpinButton } from "../components/ui/SpinButton.ts";
import { Petals } from "../components/view/Petals.ts";
import { Balance } from "../components/ui/Balance.ts";
import { BetControl } from "../components/ui/BetControl.ts";

export class Game {
    private app: Application;
    private background: Background;
    private logo: Logo;
    private gameArea: GameArea;
    private spinButton: SpinButton;
    private petalsComponent: Petals;
    private balance: Balance;
    private betControl: BetControl;

    constructor() {
        this.app = new Application();
        this.background = new Background();
        this.petalsComponent = new Petals();
        this.logo = new Logo();
        this.gameArea = new GameArea();
        this.spinButton = new SpinButton();
        this.balance = new Balance();
        this.betControl = new BetControl()
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
            await this.balance.init()
            await this.betControl.init()

            // Add to the stage
            this.app.stage.addChild(this.background);
            this.app.stage.addChild(this.petalsComponent);
            this.app.stage.addChild(this.logo);
            this.app.stage.addChild(this.gameArea);
            this.app.stage.addChild(this.spinButton);
            this.app.stage.addChild(this.balance);
            this.app.stage.addChild(this.betControl);
            

            // Initialize the component
            await this.petalsComponent.init();

            // Add the component's update method to the ticker
            this.app.ticker.add((ticker) => {
                this.petalsComponent.update(ticker.deltaTime);
            });

            } catch (error) {
                console.error("Failed to initialize components:", error);
            }
        }

    // Game loop update function
    private update = (delta: number): void => {};

    // Clean up event listeners and components when needed
    public destroy(): void {
        // The background and logo components now handle their own cleanup
        this.background.destroy();
        this.logo.destroy();

        // Clean up the application
        this.app.destroy();
    }
}