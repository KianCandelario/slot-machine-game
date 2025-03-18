import { Graphics } from "pixi.js";
import { Component } from "../../../core/Component";
import {
  TOTAL_REEL_HEIGHT,
  TOTAL_REEL_WIDTH,
} from "../../../lib/reelconfig";
import { ReelsViewport } from "./ReelsViewport";
import { GameState } from "../../../core/Game";

export class GameArea extends Component {
  private frame: Graphics;
  private reelsViewport: ReelsViewport;
  private baseWidth: number = TOTAL_REEL_WIDTH + 20;
  private baseHeight: number = TOTAL_REEL_HEIGHT + 20;
  private scale_: number = 1;

  constructor(gameState: GameState) {
    super();
    
    this.frame = new Graphics()
      .roundRect(0, 65, this.baseWidth, this.baseHeight, 20)
      .fill(0x000000)
      .stroke({
        width: 7,
        color: 0xfdf9ed,
        alignment: 1,
      });

    this.reelsViewport = new ReelsViewport(gameState);
  }

  public async init(): Promise<void> {
    this.frame.alpha = 0.5;
    this.addChild(this.frame);
    
    // Initialize the ReelsViewport before adding it
    await this.reelsViewport.init();
    this.addChild(this.reelsViewport);

    // Initial layout calculation
    this.recalculateLayout(window.innerWidth, window.innerHeight);
    
    // Add window resize event listener
    window.addEventListener('resize', () => {
      this.recalculateLayout(window.innerWidth, window.innerHeight);
    });
  }

  public startSpin(): void {
    this.reelsViewport.startSpin();
  }

  public update(delta: number): void {
    this.reelsViewport.update(delta);
  }

  protected recalculateLayout(width: number, height: number): void {
    const targetWidthPercentage = 0.8; // 80% of window width
    const targetHeightPercentage = 0.5; // 50% of window height
    
    // Calculate dimensions based on window percentages
    const targetWidth = width * targetWidthPercentage;
    const targetHeight = height * targetHeightPercentage;
    
    // Calculate the scaling factor to fit game area within the target dimensions while maintaining aspect ratio
    const horizontalScale = targetWidth / this.baseWidth;
    const verticalScale = targetHeight / this.baseHeight;
    
    // Use the smaller scale to ensure everything fits (maintain aspect ratio)
    this.scale_ = Math.min(horizontalScale, verticalScale);
    
    // Apply minimum and maximum scaling constraints
    this.scale_ = Math.max(0.5, Math.min(this.scale_, 1.5));
    
    // Round to 2 decimal places for cleaner scaling
    this.scale_ = Math.floor(this.scale_ * 100) / 100;
    
    // Calculate the scaled dimensions
    const scaledWidth = this.baseWidth * this.scale_;
    const scaledHeight = this.baseHeight * this.scale_;
    
    // Position the frame in the center of the window
    this.frame.position.set(
      (width - scaledWidth) / 2,
      (height - scaledHeight) / 2
    );
    
    // Apply scaling to components
    this.frame.scale.set(this.scale_);
    this.reelsViewport.scale.set(this.scale_);
    
    // Position the ReelsViewport relative to the frame
    this.reelsViewport.position.set(
      this.frame.position.x + 10 * this.scale_,
      this.frame.position.y + 10 * this.scale_ 
    );
  }
}