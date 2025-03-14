import { Graphics, Text, TextStyle } from "pixi.js";
import { Component } from "../../core/Component";
import { DecreaseButton, IncreaseButton } from "../../templates/UITemplate";

export class BetControl extends Component{
    private betFrame: Graphics
    private betMask: Graphics
    private betTextStyle: TextStyle
    private betAmountStyle: TextStyle
    private decreaseButton: DecreaseButton
    private increaseButton: IncreaseButton

    constructor() {
        super()

        this.betFrame = new Graphics()
            .roundRect(0, 0, 250, 100, 25)
            .fill(0x000000)
            .stroke({
                width: 5,
                color: 0xfdf9ed,
                alignment: 1
            })


        this.betMask = new Graphics()
            .roundRect(0, 0, 250, 100, 25)
            .fill(0xFFFFFF)
    

        this.betTextStyle = new TextStyle({
            fill: '#fdf9ed',
            fontFamily: 'Nanum Gothic Coding',
            fontWeight: "700",
            fontSize: 22,
            dropShadow: {
                color: '#000000',
                blur: 8,
                angle: Math.PI / 6,
                distance: 5
            }
        })


        this.betAmountStyle = new TextStyle({
            fill: '#fdf9ed',
            fontFamily: 'Nanum Gothic Coding',
            fontSize: 32,
            dropShadow: {
                color: '#000000',
                blur: 10,
                angle: Math.PI / 6,
                distance: 7
            }
        })

        this.decreaseButton = new DecreaseButton("-")
        this.increaseButton = new IncreaseButton("+")
    }

    public async init(): Promise<void>{
        await this.decreaseButton.init()
        await this.increaseButton.init()

        this.position.set(
            (window.innerWidth/2)+140,
            window.innerHeight-135
        )

        this.betFrame.alpha = 0.5
        this.mask = this.betMask
        this.addChild(this.betFrame)
        this.addChild(this.betMask)

        const betLabel = new Text({
            text: "BET",
            style: this.betTextStyle
        })
        betLabel.position.set(25, 15)
        this.addChild(betLabel)


        // bet amount state
        let betAmount: {value: number} = {value: 5}

        const betAmountText = new Text({
            text: betAmount.value.toString(),
            style: this.betAmountStyle
        })
        betAmountText.anchor.set(0.5)
        betAmountText.position.set(150, 50)
        this.addChild(this.decreaseButton)
        this.decreaseButton.position.set(100, 60)

        this.addChild(betAmountText)
        this.addChild(this.increaseButton)
        this.increaseButton.position.set(200, 60)

        this.decreaseButton.on("pointerdown", this.buttonDown.bind(this.decreaseButton))
        this.decreaseButton.on("pointerup", this.buttonUp.bind(this.decreaseButton))
        this.decreaseButton.on("pointerupoutside", this.buttonUp.bind(this.decreaseButton))

        this.increaseButton.on("pointerdown", this.buttonDown.bind(this.increaseButton))
        this.increaseButton.on("pointerup", this.buttonUp.bind(this.increaseButton))
        this.increaseButton.on("pointerupoutside", this.buttonUp.bind(this.increaseButton))
    }

    public update(): void {}


    private buttonDown():void {
        this.scale.set(.90)
    }

    private buttonUp():void {
        this.scale.set(1)
    }

    protected recalculateLayout(width: number, height: number): void {
        this.position.set(
            (window.innerWidth/2)+140,
            window.innerHeight-135
        )
    }
}