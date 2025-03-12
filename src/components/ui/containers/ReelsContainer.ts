import { BlurFilter, Container, Sprite } from "pixi.js";
import { Component } from "../../../core/Component.ts";
import {
  REEL_WIDTH,
  REEL_GAP,
  NUM_REEL,
  NUM_SYMBOLS,
  SYMBOL_GAP,
  SYMBOL_SIZE,
  SYMBOL_TO_SHOW,
} from "../../../lib/reelconfig.ts";
import { ReelConfig, REELCONFIG } from "../../../lib/types.ts"; // Import both types
import { AssetPreloader } from "../../../core/AssetLoader.ts";

export class ReelsContainer extends Component {
  private reels: REELCONFIG = []; // Array of ReelConfig objects

  constructor() {
    super();
  }

  public async init(): Promise<void> {
    // Load textures using the AssetPreloader
    await AssetPreloader.loadTextures();
    const slotTextures = AssetPreloader.getTextures();

    // Set the position of the reels container
    this.position.set(0, 100); // Adjusted to show exactly 3 rows

    for (let i = 0; i < NUM_REEL; i++) {
      // Create a container for this reel
      const reelContainer = new Container();
      reelContainer.position.set(i * (REEL_WIDTH + REEL_GAP), 0);
      this.addChild(reelContainer);

      // Create the reel object to track its properties
      const reel: ReelConfig = {
        container: reelContainer,
        symbols: [],
        position: 0,
        prevPosition: 0,
        blur: new BlurFilter(),
      };

      // No blur by default
      reel.blur.strengthX = 0;
      reel.blur.strengthY = 0;
      reelContainer.filters = [reel.blur];

      // Create the symbols for the reel
      for (let j = 0; j < NUM_SYMBOLS; j++) {
        // Select a random symbol
        const symbolIndex = Math.floor(Math.random() * slotTextures.length);
        const symbol = new Sprite(slotTextures[symbolIndex]);

        // Scale to fit the symbol size
        symbol.scale.x = symbol.scale.y = Math.min(
          SYMBOL_SIZE / symbol.width,
          SYMBOL_SIZE / symbol.height
        );

        // Center the symbol horizontally within the reel
        symbol.x = (REEL_WIDTH - symbol.width * symbol.scale.x) / 2;

        // Position vertically
        symbol.y = j * (SYMBOL_SIZE + SYMBOL_GAP);

        // Hide symbols that are outside the visible 3-row area
        symbol.visible = j < SYMBOL_TO_SHOW;

        // Add directly to the reel container
        reelContainer.addChild(symbol);
        reel.symbols.push(symbol);
      }

      this.reels.push(reel); // Push the ReelConfig object into the REELCONFIG array
    }
  }

  public update(delta: number): void {
    // Update logic for the reels (if needed)
  }
}