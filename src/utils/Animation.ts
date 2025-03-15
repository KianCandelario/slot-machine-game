import { GameState } from "../core/Game";

export class Pulsing {
    private target: any;
    private originalScale: { x: number; y: number };
    private pulseFactor: number;
    private pulseSpeed: number;
    private time: number = 0;
    private active: boolean = false;

    constructor(gameState: GameState, target: any, pulseFactor: number = 0.1, pulseSpeed: number = 0.05) {
        this.target = target;
        this.originalScale = { x: target.scale.x, y: target.scale.y };
        this.pulseFactor = pulseFactor;
        this.pulseSpeed = pulseSpeed;
    }

    public start(): void {
        this.active = true;
        
        
    }

    public stop(): void {
        this.active = false;
        // Reset scale to original
        this.target.scale.set(this.originalScale.x, this.originalScale.y);
    }

    public update(deltaTime: number): void {
        if (!this.active) return;
        
        this.time += this.pulseSpeed * deltaTime;
        
        // Calculate pulse amount using sine wave
        const pulseAmount = Math.sin(this.time) * this.pulseFactor + 1;
        
        // Apply pulse to scale
        this.target.scale.set(
            this.originalScale.x * pulseAmount,
            this.originalScale.y * pulseAmount
        );
    }

    public isActive(): boolean {
        return this.active;
    }
}



export class Rotate {
    private target: any
    private rotationSpeed: number
    private gameState: GameState

    constructor(gameState: GameState, target: any, rotationSpeed: number) {
        this.target = target
        this.rotationSpeed = rotationSpeed
        this.gameState = gameState
    }

    public update(time: number): void {
        if (this.gameState.running) {
            this.target.rotation -= (this.rotationSpeed+0.13) * time
        }
        this.target.rotation -= this.rotationSpeed * time
    }
}


export class Tweening {
    // For smooth animations
    public tweening: {
        object: any;
        property: string;
        propertyBeginValue: number;
        target: number;
        easing: (t: number) => number;
        time: number;
        change?: (t: any) => void;
        complete?: (t: any) => void;
        start: number;
    }[] = [];

    public  tweenTo(
    object: any, 
    property: string, 
    target: number, 
    time: number, 
    easing: (t: number) => number, 
    onchange?: (t: any) => void, 
    oncomplete?: (t: any) => void
    ) {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };

        this.tweening.push(tween);
        return tween;
    }

    // Linear interpolation function
    public lerp(a1: number, a2: number, t: number) {
        return a1 * (1 - t) + a2 * t;
    }

    // Backout easing function for realistic slot machine deceleration
    public backout(amount: number) {
        return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
    }
}