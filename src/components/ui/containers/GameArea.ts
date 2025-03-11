import { Graphics } from "pixi.js";
import { Component } from "../../../core/Component.ts";
import {
  TOTAL_REEL_HEIGHT,
  TOTAL_REEL_WIDTH,
} from "../../../lib/reelconfig.ts";

export class GameArea extends Component {
  private frame: Graphics;
  constructor() {
    super();

    this.frame = new Graphics()
      .roundRect(0, 70, TOTAL_REEL_WIDTH + 20, TOTAL_REEL_HEIGHT + 20, 20)
      .fill(0x000000)
      .stroke({
        width: 7,
        color: 0xfdf9ed,
        alignment: 1,
      });
  }

  public async init(): Promise<void> {
    this.frame.alpha = 0.5;
    this.addChild(this.frame);

    this.recalculateLayout(window.innerWidth, window.innerHeight);
  }

  public update(): void {}

  protected recalculateLayout(width: number, height: number): void {
    this.frame.position.set(
      (window.innerWidth - TOTAL_REEL_WIDTH) / 2 - 40,
      (window.innerHeight - TOTAL_REEL_HEIGHT) / 2
    );
  }

  public destroy(): void {}
}
