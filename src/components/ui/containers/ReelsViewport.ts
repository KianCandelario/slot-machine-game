import { Component } from "../../../core/Component";
import { Graphics } from "pixi.js";
import { TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT } from "../../../lib/reelconfig";
import { ReelsContainer } from "./ReelsContainer";
import { GameState } from "../../../core/Game";

export class ReelsViewport extends Component {
  private reelsContainer: ReelsContainer;
  private reelMask: Graphics;
  private gameState: GameState;

  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;

    // Create the mask for the reels area
    this.reelMask = new Graphics()
      .roundRect(0, 45, TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT, 15)
      .fill(0xffffff);

    // Create the reels container with gameState
    this.reelsContainer = new ReelsContainer(gameState);
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

  public startSpin(): void {
    this.reelsContainer.startSpin();
  }

  public update(delta: number): void {
    this.reelsContainer.update(delta);
  }
}