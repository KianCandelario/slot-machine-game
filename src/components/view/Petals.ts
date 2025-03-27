import { Container, Sprite, Texture } from "pixi.js";
import { AssetPreloader } from "../../core/AssetLoader";
import { Component } from "../../core/Component";

class Petal extends Sprite {
    speed: number
    rotationSpeed: number
    wobble: number
    wobbleSpeed: number

    constructor(texture: Texture) {
        super(texture)
        
        // randomize petal properties
        this.width = Math.random() * 25 + 10
        this.height = this.width
        this.alpha = Math.random() * 0.7 + 0.4 

        // starting position
        this.x = Math.random() * window.innerWidth
        this.y = -50  // start above the screen

        // movement properties
        this.speed = Math.random() * 1.7 + 1 
        this.rotationSpeed = (Math.random() - 0.5) * 0.1 
        this.wobble = Math.random() * Math.PI * 2 
        this.wobbleSpeed = Math.random() * 0.05 + 0.01 
    }

    update() {
        // falling movement
        this.y += this.speed

        // rotation
        this.rotation += this.rotationSpeed

        // wobble effect (side-to-side movement)
        this.wobble += this.wobbleSpeed
        this.x += Math.sin(this.wobble) * 2

        // reset if out of screen
        if (this.y > window.innerHeight + 50) {
            this.y = -50
            this.x = Math.random() * window.innerWidth
        }
    }
}

interface Tween {
    object: any;
    property: string;
    propertyBeginValue: number;
    target: number;
    start: number;
    time: number;
    easing: (t: number) => number;
    change?: (tween: Tween) => void;
    complete?: (tween: Tween) => void;
}

export class Petals extends Component {
    private petals: Petal[] = [];
    private tweening: Tween[] = [];
    private petalsContainer: Container;
    private PETAL_COUNT = 50;

    constructor() {
        super();
        this.petalsContainer = new Container();
        this.addChild(this.petalsContainer);
    }

    public async init(): Promise<void> {
        const petalTexture = AssetPreloader.getPetalTexture();
        
        // spawn Petals
        this.petals = Array.from({ length: this.PETAL_COUNT }, () => {
            const petal = new Petal(petalTexture);
            this.petalsContainer.addChild(petal);
            return petal;
        });
    }

    // match the Component abstract method signature: update(delta: number)
    public update(delta: number): void {
        // update all petals
        for (const petal of this.petals) {
            petal.update();
        }
        
        // update tweens
        const now = Date.now();
        const remove = [];

        for (let i = 0; i < this.tweening.length; i++) {
            const t = this.tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        
        for (let i = 0; i < remove.length; i++) {
            this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
        }
    }

    // utility function for linear interpolation
    private lerp(start: number, end: number, amount: number): number {
        return start + (end - start) * amount;
    }

    // add a new tween
    public addTween(tween: Tween): void {
        this.tweening.push(tween);
    }

    // override the recalculateLayout method to handle resize
    protected recalculateLayout(width: number, height: number): void {
        // adjust petals position if needed when window is resized
        for (const petal of this.petals) {
            // keep petals within the new window width if they're outside
            if (petal.x > width) {
                petal.x = Math.random() * width;
            }
        }
    }
}