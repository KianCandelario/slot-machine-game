import { Sprite } from "pixi.js";
import { AssetPreloader } from "../../core/AssetLoader";
import { Component } from "../../core/Component";
import { Pulsing, Rotate } from "../../utils/Animation";
import { GameState } from "../../core/Game";

export class SpinButton extends Component {
  private buttonSprite!: Sprite;
  private pulsingAnimation!: Pulsing;
  private rotatingAnim!: Rotate;
  private gameState: GameState

  constructor(gameState: GameState) {
    super();

    this.gameState = gameState
  }

  public async init(): Promise<void> {
    this.position.set(window.innerWidth/2, window.innerHeight-85);
    this.cursor = "pointer";
    this.zIndex = 20;
    this.interactive = true;

    const spinButtonTexture = await AssetPreloader.loadButtonTexture();
    this.buttonSprite = new Sprite(spinButtonTexture);
    this.buttonSprite.anchor.set(0.5);
    this.buttonSprite.scale.set(.20);
    
    this.addChild(this.buttonSprite);
    
    // Initialize the animations
    this.pulsingAnimation = new Pulsing(this.gameState, this.buttonSprite, 0.07, 0.05);
    this.rotatingAnim = new Rotate(this.gameState, this.buttonSprite, 0.01)
    
    // Start the pulsing animation
    this.pulsingAnimation.start();
    
    // Add pointer interactions if needed
    this.on('pointerdown', this.onButtonDown.bind(this));
    this.on('pointerup', this.onButtonUp.bind(this));
    this.on('pointerupoutside', this.onButtonUp.bind(this));
  }

  private onButtonDown(): void {
    this.pulsingAnimation.stop();
    this.scale.set(0.90)
  }

  private onButtonUp(): void {
    this.pulsingAnimation.start();
    this.scale.set(1)
  }

  public update(deltaTime: number): void {
    // Update the pulsing animation
    this.pulsingAnimation.update(deltaTime);
    this.rotatingAnim.update(deltaTime)
  }

  protected recalculateLayout(width: number, height: number): void {
    this.position.set(
        window.innerWidth/2, 
        window.innerHeight-85
    );
  }
}