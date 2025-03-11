import { Component } from "../../../core/Component";
import { Graphics } from "pixi.js";
import { TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT } from "../../../lib/reelconfig";

export class ReelsViewport extends Component {
  constructor() {
    super();
  }

  public async init(): Promise<void> {
    this.position.set(15, 15);

    const reelMask = new Graphics()
      .roundRect(0, 45, TOTAL_REEL_WIDTH, TOTAL_REEL_HEIGHT, 15)
      .fill(0xffffff);
    this.addChild(reelMask);
    this.mask = reelMask;
  }

  public update(): void {}
}
