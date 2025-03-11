import { Assets, Texture, Sprite, Container } from 'pixi.js';
import { Component } from '../../core/Component.ts';

// Petal Class
class Petal extends Sprite {
    speed: number;
    rotationSpeed: number;
    wobble: number;
    wobbleSpeed: number;

    constructor(texture: Texture) {
        super(texture);
        
        // Randomize petal properties
        this.width = Math.random() * 25 + 10;
        this.height = this.width;
        this.alpha = Math.random() * 0.7 + 0.4;
        console.log('Petal alpha:', this.alpha); // Debug alpha

        // Starting position
        this.x = Math.random() * window.innerWidth;
        this.y = -50;  // Start above the screen

        // Movement properties
        this.speed = Math.random() * 1.7 + 1;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.01;
    }

    update() {
        // Falling movement
        this.y += this.speed;

        // Rotation
        this.rotation += this.rotationSpeed;

        // Wobble effect (side-to-side movement)
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 2;

        // Reset if out of screen
        if (this.y > window.innerHeight + 50) {
            this.y = -50;
            this.x = Math.random() * window.innerWidth;
        }
    }
}

export class PetalsComponent extends Component {
    private petals: Petal[] = [];
    private PETAL_COUNT = 50;
    private petalTexture!: Texture;

    constructor() {
        super();
    }

    public async init(): Promise<void> {
        try {
            // Load petal texture
            this.petalTexture = await Assets.load('../assets/japanese_theme/others/petals.png');
            console.log('Petal texture loaded:', this.petalTexture); // Debug texture loading
            
            // Create petals
            this.petals = Array.from({ length: this.PETAL_COUNT }, () => {
                const petal = new Petal(this.petalTexture);
                this.addChild(petal);
                return petal;
            });
        } catch (error) {
            console.error('Failed to load petals:', error);
            throw error;
        }
    }

    public update(delta: number): void {
        console.log('Updating petals...'); // Debug update loop
        for (const petal of this.petals) {
            petal.update();
        }
    }

    // Method to handle window resize events
    public resize = (): void => {
        // Reset petal positions if needed
        for (const petal of this.petals) {
            if (petal.x > window.innerWidth) {
                petal.x = Math.random() * window.innerWidth;
            }
        }
    }

    public destroy(): void {
        window.removeEventListener('resize', this.resize);
        super.destroy();
    }
}