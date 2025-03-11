import { Container } from "pixi.js";
import { Component } from "../../../core/Component";
import { REEL_WIDTH, REEL_GAP, NUM_REEL } from "../../../lib/reelconfig"

export class ReelsContainer extends Component {
    private REEL = {
        NUM_REEL,
        REEL_WIDTH,
        REEL_GAP
    }
    constructor() {
        super()
    }

    public async init(): Promise<void> {
        this.position.set(0, 100)
        
        for (let i = 0; i < NUM_REEL; i++) {
            const reelContainer = new Container()
            reelContainer.position.set(i*(this.REEL.REEL_WIDTH, this.REEL.REEL_GAP), 0)
            this.addChild(reelContainer)
        }
        

    }


    public update(): void {

    }
}