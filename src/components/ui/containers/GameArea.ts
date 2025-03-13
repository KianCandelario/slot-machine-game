import { Graphics } from "pixi.js";
import { Component } from "../../../core/Component";
import {
  TOTAL_REEL_HEIGHT,
  TOTAL_REEL_WIDTH,
} from "../../../lib/reelconfig";
import { ReelsViewport } from "./ReelsViewport"

export class GameArea extends Component {
  private frame: Graphics;
  private reelsViewport: ReelsViewport;

  constructor() {
    super();

    this.frame = new Graphics()
      .roundRect(0, 65, TOTAL_REEL_WIDTH + 20, TOTAL_REEL_HEIGHT + 20, 20)
      .fill(0x000000)
      .stroke({
        width: 7,
        color: 0xfdf9ed,
        alignment: 1,
      });

    this.reelsViewport = new ReelsViewport()
  }

  public async init(): Promise<void> {
    this.frame.alpha = 0.5
    this.addChild(this.frame)
    // Initialize the ReelsViewport before adding it
    await this.reelsViewport.init();
    this.addChild(this.reelsViewport);
    

    this.recalculateLayout(window.innerWidth, window.innerHeight);
  }

  public update(): void {}

  protected recalculateLayout(width: number, height: number): void {
    this.frame.position.set(
      (window.innerWidth - TOTAL_REEL_WIDTH) / 2 - 40,
      (window.innerHeight - TOTAL_REEL_HEIGHT) / 2
    );

    // Position the ReelsViewport relative to the frame
    this.reelsViewport.position.set(
      this.frame.position.x + 10, // Adjust for padding
      this.frame.position.y + 10  // Adjust for padding
    );
  }

  public destroy(): void {}
}
