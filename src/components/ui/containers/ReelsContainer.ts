import { BlurFilter, Container, Sprite, Texture } from "pixi.js";
import { Component } from "../../../core/Component";
import {
  REEL_WIDTH,
  REEL_GAP,
  NUM_REEL,
  NUM_SYMBOLS,
  SYMBOL_GAP,
  SYMBOL_SIZE,
  SYMBOL_TO_SHOW,
} from "../../../lib/reelconfig.ts";
import { ReelConfig, REELCONFIG } from "../../../lib/types";
import { AssetPreloader } from "../../../core/AssetLoader";
import { GameState } from "../../../core/Game";
import { Tweening } from "../../../utils/Animation";

export class ReelsContainer extends Component {
  private reels: REELCONFIG = []; // Array of ReelConfig objects
  private gameState: GameState;
  private tweening_: Tweening;
  private reelSet: string[][] = [
    [ "hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2" ],
    [ "hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4",  "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2" ],
    [ "lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3",  "hv2", "hv4", "hv1",  "lv2", "lv4" ],
    [ "hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2" ],
    [ "lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2",  "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4" ],
  ];
  private reelPositions: number[] = [];
  private screen: string[][] = [
    [], 
    [], 
    []
  ];
  private symbolCodeMap = new Map<Sprite, string>();

  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;
    this.tweening_ = new Tweening();
  }

  public async init(): Promise<void> {
    // Load textures using the AssetPreloader
    await AssetPreloader.loadAllAssets();
    const slotTextures = AssetPreloader.getTextures();

    // Create a mapping between symbol codes and textures
    const textureMap = new Map<string, Texture>();
    // Assuming first 4 textures are mask (high value)
    textureMap.set("hv1", slotTextures[0]); // mask1
    textureMap.set("hv2", slotTextures[1]); // mask2
    textureMap.set("hv3", slotTextures[2]); // mask3
    textureMap.set("hv4", slotTextures[3]); // mask4
    // bonus and wild are special symbols
    textureMap.set("lv1", slotTextures[6]); // 9
    textureMap.set("lv2", slotTextures[7]); // 10
    textureMap.set("lv3", slotTextures[8]); // A
    textureMap.set("lv4", slotTextures[9]); // J

    // Set the position of the reels container
    this.position.set(10, 90);

    // Initialize reel positions with random values
    for (let i = 0; i < NUM_REEL; i++) {
      this.reelPositions.push(this.randomInt(0, this.reelSet[i].length - 1));
    }

    // Create the reels
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

      // Create the symbols for the reel based on the reel set
      for (let j = 0; j < NUM_SYMBOLS; j++) {
        // Get the symbol from the reel set based on initial position
        const symbolIdx = (this.reelPositions[i] + j) % this.reelSet[i].length;
        const symbolCode = this.reelSet[i][symbolIdx];
        const symbolTexture = textureMap.get(symbolCode) || slotTextures[0]; // Fallback to first texture

        const symbol = new Sprite(symbolTexture);
        this.symbolCodeMap.set(symbol, symbolCode);

        // Center the anchor point so scaling works from the center
        symbol.anchor.set(0.5);

        // Scale to fit within the symbol area while maintaining aspect ratio
        const maxWidth = SYMBOL_SIZE;
        const maxHeight = SYMBOL_SIZE;

        // Calculate scale to fit within our boundaries
        const scaleX = maxWidth / symbol.width;
        const scaleY = maxHeight / symbol.height;
        const scale = Math.min(scaleX, scaleY);

        // Apply uniform scaling
        symbol.scale.set(scale);

        // Position in the center of the symbol area
        symbol.x = REEL_WIDTH / 2;
        symbol.y = j * (SYMBOL_SIZE + SYMBOL_GAP) + SYMBOL_SIZE / 2;

        // Hide symbols that are outside the visible area
        symbol.visible = j < SYMBOL_TO_SHOW;

        // Add directly to the reel container
        reelContainer.addChild(symbol);
        reel.symbols.push(symbol);
      }

      this.reels.push(reel);
    }

    // Initialize the screen array
    this.updateScreenArray();
  }

  // Helper method to generate random integer
  private randomInt(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  // Method to update the screen array based on current reel positions
  private updateScreenArray(): void {
    this.screen = [[], [], []];

    for (let col = 0; col < this.reelPositions.length; col++) {
      const reelStop = this.reelPositions[col];
      for (let row = 0; row < 3; row++) {
        let idx = (reelStop + row) % this.reelSet[col].length;
        this.screen[row][col] = this.reelSet[col][idx];
      }
    }

    // You can log the screen for debugging
    this.displayScreen(this.screen);
  }

  // helper method for debugging
  private displayScreen(screen: string[][]): void {
    console.log("Current Screen:");
    for (let row = 0; row < screen.length; row++) {
      console.log(screen[row].join(" "));
    }
  }

  public startSpin(): void {
    if (this.gameState.running) return; // If already spinning, do nothing

    this.gameState.running = true;

    // Make all symbols visible before spinning
    for (const reel of this.reels) {
      for (const symbol of reel.symbols) {
        symbol.visible = true;
      }
    }

    // Generate new random positions for each reel
    this.reelPositions = [];
    for (let i = 0; i < NUM_REEL; i++) {
      this.reelPositions.push(this.randomInt(0, this.reelSet[i].length - 1));
    }

    // Start spinning animation for each reel with proper delays
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      // Calculate a new target position that will end with the symbol
      // from reelPositions showing at the top of the visible area
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 7 + i * 5 + extra;

      // Calculate time based on reel index for sequential stopping
      const time = 3500 + i * 600 + extra * 600;

      this.tweening_.tweenTo(
        r,
        "position",
        target,
        time,
        this.tweening_.backout(0.5),
        undefined,
        i === this.reels.length - 1
          ? () => {
              // All reels stopped
              this.gameState.running = false;

              // Update the screen array with the new positions
              this.updateScreenArray();

              // Update visible symbols based on our reel set
              this.updateVisibleSymbols();

              // this.checkWins();
            }
          : undefined
      );
    }
  }

  // Method to update visible symbols based on reel positions
  private updateVisibleSymbols(): void {
    const textureMap = new Map<string, Texture>();
    const slotTextures = AssetPreloader.getTextures();

    // Set up the texture map
    textureMap.set("hv1", slotTextures[0]);
    textureMap.set("hv2", slotTextures[1]);
    textureMap.set("hv3", slotTextures[2]);
    textureMap.set("hv4", slotTextures[3]);
    textureMap.set("lv1", slotTextures[6]);
    textureMap.set("lv2", slotTextures[7]);
    textureMap.set("lv3", slotTextures[8]);
    textureMap.set("lv4", slotTextures[9]);

    for (let i = 0; i < this.reels.length; i++) {
      const reel = this.reels[i];

      // Update the first SYMBOL_TO_SHOW (3) symbols of each reel
      // to show the correct symbols based on the screen array
      for (let j = 0; j < SYMBOL_TO_SHOW; j++) {
        const symbol = reel.symbols[j];
        const symbolCode = this.screen[j][i];
        const symbolTexture = textureMap.get(symbolCode) || slotTextures[0];

        symbol.texture = symbolTexture;
        this.symbolCodeMap.set(symbol, symbolCode);

        // Calculate scale to fit within our boundaries while maintaining aspect ratio
        const maxWidth = SYMBOL_SIZE;
        const maxHeight = SYMBOL_SIZE;
        const scaleX = maxWidth / symbol.texture.width;
        const scaleY = maxHeight / symbol.texture.height;
        const scale = Math.min(scaleX, scaleY);

        // Apply uniform scaling
        symbol.scale.set(scale);

        // Position in the center of the symbol area
        symbol.x = REEL_WIDTH / 2;
        symbol.y = j * (SYMBOL_SIZE + SYMBOL_GAP) + SYMBOL_SIZE / 2;

        symbol.visible = true;
      }

      // Hide symbols outside the visible area
      for (let j = SYMBOL_TO_SHOW; j < reel.symbols.length; j++) {
        reel.symbols[j].visible = false;
      }
    }
  }

  public update(delta: number): void {
    // Process all active tweens
    const now = Date.now();
    const remove = [];

    for (let i = 0; i < this.tweening_.tweening.length; i++) {
      const t = this.tweening_.tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = this.tweening_.lerp(
        t.propertyBeginValue,
        t.target,
        t.easing(phase)
      );
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }

    for (let i = 0; i < remove.length; i++) {
      this.tweening_.tweening.splice(
        this.tweening_.tweening.indexOf(remove[i]),
        1
      );
    }

    // Update the slots
    const slotTextures = AssetPreloader.getTextures();
    const textureMap = new Map<string, Texture>();

    // Set up the texture map
    textureMap.set("hv1", slotTextures[0]);
    textureMap.set("hv2", slotTextures[1]);
    textureMap.set("hv3", slotTextures[2]);
    textureMap.set("hv4", slotTextures[3]);
    textureMap.set("lv1", slotTextures[6]);
    textureMap.set("lv2", slotTextures[7]);
    textureMap.set("lv3", slotTextures[8]);
    textureMap.set("lv4", slotTextures[9]);

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];

      // Skip update if the reel position hasn't changed
      if (r.position === r.prevPosition) continue;

      // Update blur filter based on speed
      const speed = Math.abs(r.position - r.prevPosition);
      r.blur.strengthY = speed * 100;
      r.prevPosition = r.position;

      // Total height of a single symbol slot (including gap)
      const slotHeight = SYMBOL_SIZE + SYMBOL_GAP;

      // Update symbol positions
      for (let j = 0; j < r.symbols.length; j++) {
        const symbol = r.symbols[j];
        const prevY = symbol.y;

        // Move symbol based on reel position
        symbol.y = ((r.position + j) % r.symbols.length) * slotHeight;

        // Control visibility during spinning - only show symbols in the visible area
        if (this.gameState.running) {
          symbol.visible =
            symbol.y >= 0 && symbol.y < SYMBOL_TO_SHOW * slotHeight;
        }

        // If symbol moves below visible area, recycle it to the top with new texture
        if (symbol.y < 0 && prevY > slotHeight) {
          // Get a new symbol from the reel set based on the current position
          const reelIndex = i;
          const symbolIndex =
            (this.reelPositions[reelIndex] + j) %
            this.reelSet[reelIndex].length;
          const symbolCode = this.reelSet[reelIndex][symbolIndex];
          const symbolTexture = textureMap.get(symbolCode) || slotTextures[0];

          symbol.texture = symbolTexture;
          this.symbolCodeMap.set(symbol, symbolCode);

          // Calculate scale to fit within our boundaries while maintaining aspect ratio
          const maxWidth = SYMBOL_SIZE;
          const maxHeight = SYMBOL_SIZE;
          const scaleX = maxWidth / symbol.texture.width;
          const scaleY = maxHeight / symbol.texture.height;
          const scale = Math.min(scaleX, scaleY);

          // Apply uniform scaling
          symbol.scale.set(scale);
        }
      }
    }
  }
}
