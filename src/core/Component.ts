import { Container } from "pixi.js";

export abstract class Component extends Container {
  constructor() {
    super();

    // Bind the resize handler to the class instance
    this.onResize = this.onResize.bind(this);

    // Add a resize event listener
    window.addEventListener("resize", this.onResize);
  }

  public abstract init(): Promise<void>;
  public abstract update(delta: number): void;

  protected onResize(): void {
    const width = window.innerWidth
    const height = window.innerHeight
    // recalculate positions, sizes, or scales based on the new window dimensions
    this.recalculateLayout(width, height);
  }

  protected recalculateLayout(width: number, height: number): void {
    // child classes will override this method to implement specific responsive behavior
  }

  // cleanup method
  public destroy(): void {
    // remove the resize event listener
    window.removeEventListener("resize", this.onResize);

    // destroy the container and its children
    super.destroy();
  }
}