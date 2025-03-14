import { Application } from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Background } from "../components/view/Background";
import { Logo } from "../components/view/Logo";
import { GameArea } from "../components/ui/containers/GameArea";
import { SpinButton } from "../components/ui/SpinButton";
import { Petals } from "../components/view/Petals";
import { Balance } from "../components/ui/Balance";
import { BetControl } from "../components/ui/BetControl";

export interface GameState {
  balance: { value: number };
  bet: { value: number };
  running: boolean;
}

export class Game {
  private app: Application;
  private background: Background;
  private logo: Logo;
  private gameArea: GameArea;
  private spinButton: SpinButton;
  private petalsComponent: Petals;
  private balance: Balance;
  private betControl: BetControl;

  public gameState: GameState;

  constructor() {
    this.app = new Application();
    this.background = new Background();
    this.petalsComponent = new Petals();
    this.logo = new Logo();

    this.gameState = {
      balance: { value: 1000 },
      bet: { value: 5 },
      running: false
    };

    // Initialize components with gameState
    this.gameArea = new GameArea(this.gameState);
    this.spinButton = new SpinButton();
    this.balance = new Balance(this.gameState);
    this.betControl = new BetControl(this.gameState);
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
      await this.balance.init();
      await this.betControl.init();
      await this.spinButton.init();
      
      this.app.stage.addChild(this.background);
      this.app.stage.addChild(this.petalsComponent);
      this.app.stage.addChild(this.logo);
      this.app.stage.addChild(this.gameArea);
      this.app.stage.addChild(this.balance);
      this.app.stage.addChild(this.betControl);
      this.app.stage.addChild(this.spinButton);
      
      this.spinButton.on("pointerdown", this.handleSpin.bind(this));
      
      await this.petalsComponent.init();

      // Add the component's update method to the ticker
      this.app.ticker.add((ticker) => {
        const delta = ticker.deltaTime;
        this.petalsComponent.update(delta);
        this.spinButton.update(delta);
        this.gameArea.update(delta);
        this.balance.update();
        this.betControl.update();
      });
    } catch (error) {
      console.error("Failed to initialize components:", error);
    }
  }

  private handleSpin = (): void => {
    // Don't start a new spin if one is already in progress
    if (this.gameState.running) return;
    
    // Check if player has enough balance
    if (this.gameState.balance.value >= this.gameState.bet.value) {
      // Deduct the bet from balance
      this.gameState.balance.value -= this.gameState.bet.value;
      this.balance.updateBalance();
      
      // Start the spin
      this.gameArea.startSpin();
    } else {
      
    }
  };

  // Clean up event listeners and components when needed
  public destroy(): void {
    // The background and logo components now handle their own cleanup
    this.background.destroy();
    this.logo.destroy();
    this.gameArea.destroy();
    this.balance.destroy();
    this.betControl.destroy();
    this.spinButton.destroy();
    this.petalsComponent.destroy();

    // Clean up the application
    this.app.destroy();
  }
}