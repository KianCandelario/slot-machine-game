import { Application } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Background } from "../components/view/Background";
import { Logo } from "../components/view/Logo";
import { GameArea } from "../components/ui/containers/GameArea"
import { SpinButton } from "../components/ui/SpinButton";
import { Petals } from "../components/view/Petals";
import { Balance } from "../components/ui/Balance";
import { BetControl } from "../components/ui/BetControl";

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
            await this.balance.init()
            await this.betControl.init()
            await this.spinButton.init();
            // Add to the stage
            this.app.stage.addChild(this.background);
            this.app.stage.addChild(this.petalsComponent);
            this.app.stage.addChild(this.logo);
            this.app.stage.addChild(this.gameArea);
            this.app.stage.addChild(this.balance);
            this.app.stage.addChild(this.betControl);
            this.app.stage.addChild(this.spinButton);
            

            // Initialize the component
            await this.petalsComponent.init();

            // Add the component's update method to the ticker
            this.app.ticker.add((ticker) => {
                this.petalsComponent.update(ticker.deltaTime);
                this.spinButton.update(ticker.deltaTime);
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