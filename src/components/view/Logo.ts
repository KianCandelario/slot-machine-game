import { Assets, Sprite, Texture } from "pixi.js";
import { Component } from "../../core/Component";

export class Logo extends Component {
  private logoShadowTexture!: Texture;
  private logoShadow!: Sprite;

  private logoTexture!: Texture;
  private logo!: Sprite;

  // Base dimensions for the logo
  private baseWidth: number = 380;
  private baseHeight: number = 190;
  
  private screenWidthPercentage: number = 0.3; // 30% of screen width
  
  // ensure it doesn't get too small or too large
  private minWidth: number = 200;
  private maxWidth: number = 600;

  constructor() {
    super();
  }

  public async init(): Promise<void> {
    // Load textures
    this.logoShadowTexture = await Assets.load(
      "../assets/japanese_theme/others/logo.png"
    );
    this.logoTexture = await Assets.load(
      "../assets/japanese_theme/others/logo.png"
    );

    // Create sprites
    this.logoShadow = new Sprite(this.logoShadowTexture);
    this.logo = new Sprite(this.logoTexture);

    // Configure shadow sprite
    this.logoShadow.tint = 0x000000;
    this.logoShadow.alpha = 0.5;

    // Add sprites to the container
    this.addChild(this.logoShadow);
    this.addChild(this.logo);

    // Set initial layout
    this.recalculateLayout(window.innerWidth);
    
    // Add resize listener
    window.addEventListener('resize', () => {
      this.recalculateLayout(window.innerWidth);
    });
  }

  public update(delta: number): void {
    // Animation updates can go here if needed
  }

  protected recalculateLayout(width: number): void {
    // Calculate new width based on screen percentage
    let newWidth = Math.floor(width * this.screenWidthPercentage);
    
    // Apply min/max constraints
    newWidth = Math.max(this.minWidth, Math.min(newWidth, this.maxWidth));
    
    // Calculate height proportionally to maintain aspect ratio
    const aspectRatio = this.baseHeight / this.baseWidth;
    const newHeight = Math.floor(newWidth * aspectRatio);
    
    // Update logo dimensions
    this.logo.width = newWidth;
    this.logo.height = newHeight;
    
    // Update shadow dimensions (same as logo)
    this.logoShadow.width = newWidth;
    this.logoShadow.height = newHeight;

    // Center the logo horizontally
    const topMargin = 35;
    const horizontalCenter = (width - newWidth) / 2;
    
    // Position logo and shadow (shadow slightly offset)
    this.logo.position.set(horizontalCenter, topMargin);
    this.logoShadow.position.set(horizontalCenter + 5, topMargin + 5);
  }

  public destroy(): void {
    // Clean up event listener
    window.removeEventListener('resize', () => {
      this.recalculateLayout(window.innerWidth);
    });
  }
}