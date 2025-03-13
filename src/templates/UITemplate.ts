import { Graphics, Text, TextStyle } from "pixi.js";
import { Component } from "../core/Component";

export class DecreaseButton extends Component {
  private decreaseButtonBG: Graphics;
  private buttonText: string

  constructor(text: string) {
    super();

    this.decreaseButtonBG = new Graphics()
      .circle(0, 0, 20)
      .fill(0x880000)
      .stroke({
        width: 2,
        color: 0xfdf9ed,
        alignment: 0,
      });

    this.buttonText = text
  }

  public async init(): Promise<void> {
    const decreaseButtonText = new Text({
      text: this.buttonText,
      style: new TextStyle({
        fill: "#ffffff",
        fontFamily: "Nanum Gothic Coding",
        fontSize: 28,
        fontWeight: "bold",
      }),
    });
    decreaseButtonText.anchor.set(0.5)
    decreaseButtonText.position.set(0, -2)
    this.interactive = true
    this.cursor = "pointer"

    this.addChild(this.decreaseButtonBG)
    this.addChild(decreaseButtonText)
  }

  public update(): void {}
}

export class IncreaseButton extends Component {
    private increaseButtonBG: Graphics
    private buttonText: string

  constructor(text: string) {
    super();
    this.increaseButtonBG = new Graphics()
        .circle(0, 0, 20)
        .fill(0x008800)
        .stroke({
            width: 2,
            color: 0xfdf9ed,
            alignment: 0
        })

    this.buttonText = text
  }

  public async init(): Promise<void> {
    const increaseButtonText = new Text({
        text: this.buttonText,
        style: new TextStyle({
            fill: '#ffffff',
            fontFamily: 'Nanum Gothic Coding',
            fontSize: 28,
            fontWeight: 'bold'
        })
    })

    increaseButtonText.anchor.set(0.5)
    increaseButtonText.position.set(0, -2)
    this.interactive = true
    this.cursor = "pointer"

    this.addChild(this.increaseButtonBG)
    this.addChild(increaseButtonText)
  }

  public update(): void {}
}
