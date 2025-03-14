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
  private gameState: GameState;

  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;

    this.frame = new Graphics()
      .roundRect(0, 65, TOTAL_REEL_WIDTH + 20, TOTAL_REEL_HEIGHT + 20, 20)
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

    this.recalculateLayout(window.innerWidth, window.innerHeight);
  }

  public startSpin(): void {
    this.reelsViewport.startSpin();
  }

  public update(delta: number): void {
    this.reelsViewport.update(delta);
  }

  protected recalculateLayout(width: number, height: number): void {
    this.frame.position.set(
      (width - TOTAL_REEL_WIDTH) / 2 - 40,
      (height - TOTAL_REEL_HEIGHT) / 2
    );

    // Position the ReelsViewport relative to the frame
    this.reelsViewport.position.set(
      this.frame.position.x + 10, // Adjust for padding
      this.frame.position.y + 10  // Adjust for padding
    );
  }
}