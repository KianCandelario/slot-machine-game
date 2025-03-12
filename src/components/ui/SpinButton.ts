import { Sprite } from "pixi.js";
import { AssetPreloader } from "../../core/AssetLoader.ts";
import { Component } from "../../core/Component.ts";


export class SpinButton extends Component {
  constructor() {
    super();
  }

  public async init(): Promise<void> {
    this.position.set(window.innerWidth/2, window.innerHeight-85)
    this.cursor = "pointer"
    this.zIndex = 20
    this.interactive = true

    const spinButtonTexture = await AssetPreloader.loadButtonTexture()
    const spinButton = new Sprite(spinButtonTexture)
    spinButton.anchor.set(0.5)
    spinButton.scale.set(.20)
    
    this.addChild(spinButton)
  }

  public update(): void {}

  protected recalculateLayout(width: number, height: number): void {
    this.position.set(
        window.innerWidth/2, 
        window.innerHeight-85
    )
  }
}
