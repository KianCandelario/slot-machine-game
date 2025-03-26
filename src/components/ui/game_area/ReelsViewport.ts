import { Component } from "../../../core/Component";
import { Graphics } from "pixi.js";
import { TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT } from "../../../lib/reelconfig";
import { ReelsContainer } from "./ReelsContainer";
import { GameState } from "../../../core/Game";

export class ReelsViewport extends Component {
  private reelsContainer: ReelsContainer;
  private reelMask: Graphics;

  constructor(gameState: GameState) {
    super();

    // create the mask for the reels area
    this.reelMask = new Graphics()
      .roundRect(0, 45, TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT, 15)
      .fill(0xffffff);

    // create the reels container with gameState
    this.reelsContainer = new ReelsContainer(gameState);
  }

  public async init(): Promise<void> {
    // set the position of the viewport
    this.position.set(15, 15);

    // add the mask to the viewport
    this.addChild(this.reelMask);
    this.mask = this.reelMask;

    // initialize and add the reels container
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