import { Sprite } from "pixi.js";
import { AssetPreloader } from "../../core/AssetLoader";
import { Component } from "../../core/Component";
import { Pulsing, Rotate } from "../../utils/Animation";
import { GameState } from "../../core/Game";

export class SpinButton extends Component {
  private buttonSprite!: Sprite;
  private pulsingAnimation!: Pulsing;
  private rotatingAnim!: Rotate;
  private gameState: GameState;
  private scale_: number = 1;
  private baseButtonScale: number = 0.23;

  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;
  }

  public async init(): Promise<void> {
    this.cursor = "pointer";
    this.zIndex = 20;
    this.interactive = true;

    const spinButtonTexture = AssetPreloader.getButtonTexture();
    this.buttonSprite = new Sprite(spinButtonTexture);
    this.buttonSprite.anchor.set(0.5);
    this.buttonSprite.scale.set(this.baseButtonScale);
    
    this.addChild(this.buttonSprite);
    
    // Initialize the animations
    this.pulsingAnimation = new Pulsing(this.gameState, this.buttonSprite, 0.07, 0.05);
    this.rotatingAnim = new Rotate(this.gameState, this.buttonSprite, 0.01);
    
    // Start the pulsing animation
    this.pulsingAnimation.start();
    
    // Add pointer interactions
    this.on('pointerdown', this.onButtonDown.bind(this));
    this.on('pointerup', this.onButtonUp.bind(this));
    this.on('pointerupoutside', this.onButtonUp.bind(this));
    
    // Initial layout calculation
    this.recalculateLayout(window.innerWidth, window.innerHeight);
    
    // Add window resize event listener
    window.addEventListener('resize', () => {
      this.recalculateLayout(window.innerWidth, window.innerHeight);
    });
  }

  private onButtonDown(): void {
    this.pulsingAnimation.stop();
    // Scale down slightly when pressed, relative to current scale
    this.scale.set(this.scale_ * 0.9);
  }

  private onButtonUp(): void {
    this.pulsingAnimation.start();
    this.scale.set(this.scale_);
  }

  public update(deltaTime: number): void {
    // Update the animations
    this.pulsingAnimation.update(deltaTime);
    this.rotatingAnim.update(deltaTime);
  }

  protected recalculateLayout(width: number, height: number): void {
    // Calculate appropriate scale based on screen size
    const referenceWidth = 1920; 
    const referenceHeight = 1080; 
    
    // Calculate scale based on how much the actual screen differs from reference
    const widthRatio = width / referenceWidth;
    const heightRatio = height / referenceHeight;
    
    // Use the smaller ratio to ensure everything fits
    this.scale_ = Math.min(widthRatio, heightRatio);
    
    // Limit scaling to reasonable bounds
    this.scale_ = Math.max(0.5, Math.min(this.scale_, 1.5));
    
    // Apply the scaling
    this.scale.set(this.scale_);
    
    // Position the button at the center horizontally and at 90% from the top vertically
    this.position.set(
      width * 0.5,
      height * 0.9  
    );
    
    // Adjust the base button sprite scale according to screen size
    const responsiveButtonScale = this.baseButtonScale * (1 + (width / referenceWidth - 1) * 0.5);
    this.buttonSprite.scale.set(
      Math.min(Math.max(responsiveButtonScale, this.baseButtonScale * 0.8), this.baseButtonScale * 1.2)
    );
  }
}