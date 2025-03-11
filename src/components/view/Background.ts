import { Assets, Texture, Sprite, BlurFilter } from "pixi.js";
import { Component } from "../../core/Component.ts";

export class Background extends Component {
  private backgroundTexture!: Texture;
  private background!: Sprite;

  constructor() {
    super();
  }

  public async init(): Promise<void> {
    try {
      // Load and setup background
      this.backgroundTexture = await Assets.load(
        "../assets/japanese_theme/bg/bg.jpg"
      );
      this.background = new Sprite(this.backgroundTexture);

      this.background.height = window.innerHeight;
      this.background.width = window.innerWidth;

      const blur_filter = new BlurFilter();
      blur_filter.strengthX = 1;
      blur_filter.strengthY = 1;
      this.background.filters = [blur_filter];

      this.addChild(this.background);

      // Set up resize listener
      window.addEventListener("resize", this.resize);
    } catch (error) {
      console.error("Failed to load background:", error);
      throw error;
    }
  }

  public update(delta: number): void {}

  // Method to handle window resize events
  public resize = (): void => {
    if (this.background) {
      this.background.height = window.innerHeight;
      this.background.width = window.innerWidth;
    }
  };

  public destroy(): void {
    window.removeEventListener("resize", this.resize);
    super.destroy();
  }
}
