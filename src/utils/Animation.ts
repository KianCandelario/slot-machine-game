export class Pulsing {
    private target: any;
    private originalScale: { x: number; y: number };
    private pulseFactor: number;
    private pulseSpeed: number;
    private time: number = 0;
    private active: boolean = false;

    constructor(target: any, pulseFactor: number = 0.1, pulseSpeed: number = 0.05) {
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
    constructor() {

    }
}