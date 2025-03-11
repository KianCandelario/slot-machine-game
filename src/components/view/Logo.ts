import { Assets, Sprite, Texture } from "pixi.js";
import { Component } from "../../core/Component.ts";

export class Logo extends Component {
  private logoShadowTexture!: Texture;
  private logoShadow!: Sprite;

  private logoTexture!: Texture;
  private logo!: Sprite;

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

    // Configure sprites
    this.logoShadow.height = 220;
    this.logoShadow.width = 420;
    this.logoShadow.tint = 0x000000;
    this.logoShadow.alpha = 0.5;

    this.logo.height = 220;
    this.logo.width = 420;

    // Add sprites to the container
    this.addChild(this.logoShadow);
    this.addChild(this.logo);

    // Set initial layout
    this.recalculateLayout(window.innerWidth);
  }

  public update(delta: number): void {
    // Update logic here (if needed)
  }

  protected recalculateLayout(width: number): void {
    // Reposition the logo and its shadow
    this.logoShadow.position.set((width - 400) / 2 + 5, 35 + 5);
    this.logo.position.set((width - 400) / 2, 35);
  }

  public destroy(): void {}
}
