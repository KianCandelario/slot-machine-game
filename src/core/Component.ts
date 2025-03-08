import { Container } from 'pixi.js'

export abstract class Component extends Container {
    constructor() {
        super();
    }

    public abstract init(): Promise<void>
    public abstract update(delta: number): void
}