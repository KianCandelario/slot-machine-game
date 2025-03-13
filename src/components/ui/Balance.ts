import {
    Graphics,
    Sprite,
    Text,
    TextStyle,
  } from "pixi.js";
  import { Component } from "../../core/Component";
  import { AssetPreloader } from "../../core/AssetLoader";
  
  export class Balance extends Component {
    private textFrame: Graphics;
    private textContainerMask: Graphics;
  
    constructor() {
      super();
  
      this.textFrame = new Graphics()
        .roundRect(0, 0, 250, 100, 25)
        .fill(0x00000)
        .stroke({
          width: 5,
          color: 0xfdf9ed,
          alignment: 1,
        });
  
      this.textContainerMask = new Graphics()
        .roundRect(0, 0, 250, 100, 20)
        .fill(0xffffff);
    }
  
    public async init(): Promise<void> {
      this.position.set(window.innerWidth / 2 - 400, window.innerHeight - 130);
  
      this.textFrame.alpha = 0.5;
      const coinTexture = await AssetPreloader.loadCoinTexture();
      const coinIcon = new Sprite(coinTexture);
  
      coinIcon.scale = 0.13;
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
  
      let balance: { value: number } = { value: 1000 };
  
      let money = new Text({
          text: balance.value.toString(), 
          style: style
      });
      money.position.x += 105;
      money.position.y += 32;
      
  
      // Add the money text to the display list
      this.addChild(money);
    }
  
    public update(): void {}
  
    protected recalculateLayout(width: number, height: number): void {
      this.position.set(window.innerWidth / 2 - 400, window.innerHeight - 130);
    }
  }