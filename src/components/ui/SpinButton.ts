import { Sprite } from "pixi.js";
import { AssetPreloader } from "../../core/AssetLoader";
import { Component } from "../../core/Component";
import { Pulsing } from "../../utils/Animation";

export class SpinButton extends Component {
  private buttonSprite!: Sprite;
  private pulsingAnimation!: Pulsing;

  constructor() {
    super();
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
    
    // Initialize the pulsing animation
    this.pulsingAnimation = new Pulsing(this.buttonSprite, 0.07, 0.05);
    
    // Start the pulsing animation
    this.pulsingAnimation.start();
    
    // Add pointer interactions if needed
    this.on('pointerdown', this.onButtonDown.bind(this));
    this.on('pointerup', this.onButtonUp.bind(this));
    this.on('pointerupoutside', this.onButtonUp.bind(this));
  }

  private onButtonDown(): void {
    // Temporarily stop pulsing and scale down for click effect
    this.pulsingAnimation.stop();
    this.buttonSprite.scale.set(0.18, 0.18); // A bit smaller when clicked
  }

  private onButtonUp(): void {
    // Reset scale and restart pulsing
    this.buttonSprite.scale.set(0.20, 0.20);
    this.pulsingAnimation.start();
    
    // You can add your spin logic here
    console.log("Spin button clicked!");
  }

  public update(deltaTime: number): void {
    // Update the pulsing animation
    this.pulsingAnimation.update(deltaTime);
  }

  protected recalculateLayout(width: number, height: number): void {
    this.position.set(
        window.innerWidth/2, 
        window.innerHeight-85
    );
  }
}