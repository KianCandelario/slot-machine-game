import { Container } from "pixi.js";

export abstract class Component extends Container {
  constructor() {
    super();

		this.pivot.set(0.5);
    // Bind the resize handler to the class instance
    this.onResize = this.onResize.bind(this);

    // Add a resize event listener
    window.addEventListener("resize", this.onResize);
  }

  public abstract init(): Promise<void>;
  public abstract update(delta: number): void;

  protected onResize(): void {
    // recalculate positions, sizes, or scales based on the new window dimensions
    this.recalculateLayout(window.innerWidth, window.innerHeight);
  }

  protected recalculateLayout(width: number, height: number): void {
    // child classes will override this method to implement specific responsive behavior
  }

  // Cleanup method
  public destroy(): void {
    // Remove the resize event listener
    window.removeEventListener("resize", this.onResize);

    // Destroy the container and its children
    super.destroy();
  }
}
