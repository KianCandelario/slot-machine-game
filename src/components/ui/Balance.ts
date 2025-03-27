import {
    Graphics,
    Sprite,
    Text,
    TextStyle,
  } from "pixi.js";
import { Component } from "../../core/Component";
import { AssetPreloader } from "../../core/AssetLoader";
import { GameState } from "../../core/Game";
  
export class Balance extends Component {
  private textFrame: Graphics;
  private textContainerMask: Graphics;
  private money!: Text;
  private gameState: GameState;
  private baseWidth: number = 250;
  private baseHeight: number = 100;
  private scale_: number = 1;
  
  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;
  
    this.textFrame = new Graphics()
      .roundRect(0, 0, this.baseWidth, this.baseHeight, 25)
      .fill(0x00000)
      .stroke({
        width: 5,
        color: 0xfdf9ed,
        alignment: 1,
      });
  
    this.textContainerMask = new Graphics()
      .roundRect(0, 0, this.baseWidth, this.baseHeight, 20)
      .fill(0xffffff);
  }
  
  public async init(): Promise<void> {
    this.textFrame.alpha = 0.5;
    const coinTexture = AssetPreloader.getCoinTexture();
    const coinIcon = new Sprite(coinTexture);
  
    coinIcon.scale.set(0.13);
    coinIcon.x = 23;
    coinIcon.y = 14;
  
    this.addChild(this.textContainerMask);
    this.addChild(this.textFrame);
    this.addChild(coinIcon);
    this.mask = this.textContainerMask;
  
    const style = new TextStyle({
      fill: "#fdf9ed",
      fontFamily: "Nanum Gothic Coding",
      fontSize: 30,
      dropShadow: {
        color: "#000000",
        blur: 10,
        angle: Math.PI / 6,
        distance: 7,
      },
    });
  
    this.money = new Text({
        text: this.gameState.balance.value.toString(), 
        style: style
    });
    this.money.position.x += 105;
    this.money.position.y += 32;
    
    // add the money text to the display list
    this.addChild(this.money);
    
    this.onResize()
  }

  public updateBalance():void {
    if (this.money) {
      this.money.text = this.gameState.balance.value.toString();
    }
  }
  
  public update(): void {
    this.updateBalance();
  }
  
  protected recalculateLayout(width: number, height: number): void {
    // calculate appropriate scale based on screen size
    const referenceWidth = 1920; 
    const referenceHeight = 980; 
    
    // calculate scale based on how much the actual screen differs from reference
    const widthRatio = width / referenceWidth;
    const heightRatio = height / referenceHeight;
    
    // use the smaller ratio to ensure everything fits
    this.scale_ = Math.min(widthRatio, heightRatio);
    
    // limit scaling to reasonable bounds
    this.scale_ = Math.max(0.7, Math.min(this.scale_, 1.5));
    
    // apply the scaling
    this.scale.set(this.scale_);
    
    // position at 34% from left edge, 85% from top edge
    this.position.set(
      width * 0.34 - (this.baseWidth * this.scale_ / 2),
      height * 0.85
    );
  }
}