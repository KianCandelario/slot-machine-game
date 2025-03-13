import { Component } from "../../../core/Component";
import { Graphics } from "pixi.js";
import { TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT } from "../../../lib/reelconfig";
import { ReelsContainer } from "./ReelsContainer";

export class ReelsViewport extends Component {
  private reelsContainer: ReelsContainer; // Use camelCase for instance variables
  private reelMask: Graphics;

  constructor() {
    super();

    // Create the mask for the reels area
    this.reelMask = new Graphics()
      .roundRect(0, 45, TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT, 15)
      .fill(0xffffff);

    // Create the reels container
    this.reelsContainer = new ReelsContainer();
  }

  public async init(): Promise<void> {
    // Set the position of the viewport
    this.position.set(15, 15);

    // Add the mask to the viewport
    this.addChild(this.reelMask);
    this.mask = this.reelMask;

    // Initialize and add the reels container
    await this.reelsContainer.init();
    this.addChild(this.reelsContainer);
  }

  public update(delta: number): void {
    // Update logic for the reels viewport (if needed)
  }
}