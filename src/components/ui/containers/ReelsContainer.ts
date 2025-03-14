// For smooth animations
const tweening: {
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

function tweenTo(
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

  tweening.push(tween);
  return tween;
}

// Linear interpolation function
function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
}

// Backout easing function for realistic slot machine deceleration
function backout(amount: number) {
  return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}


import { BlurFilter, Container, Sprite } from "pixi.js";
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

// Add these utility functions at the top of your file or consider moving them to a separate utilities file
// (tweening, lerp, and backout functions as shown above)

export class ReelsContainer extends Component {
  private reels: REELCONFIG = []; // Array of ReelConfig objects
  private gameState: GameState;

  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;
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

  public startSpin(): void {
    if (this.gameState.running) return; // If already spinning, do nothing
    
    this.gameState.running = true;
    
    // Make all symbols visible before spinning
    for (const reel of this.reels) {
      for (const symbol of reel.symbols) {
        symbol.visible = true;
      }
    }
    
    // Start spinning animation for each reel with proper delays
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      
      // Random number of rotations plus offset based on reel position
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      
      // Calculate time based on reel index for sequential stopping
      const time = 2500 + i * 600 + extra * 600;
      
      tweenTo(
        r,
        'position',
        target,
        time,
        backout(0.5),
        undefined,
        i === this.reels.length - 1 ? () => {
          // All reels stopped
          this.gameState.running = false;
          
          // Ensure only the correct symbols are visible per reel when stopped
          for (const reel of this.reels) {
            for (let j = 0; j < reel.symbols.length; j++) {
              const symbol = reel.symbols[j];
              // Calculate if this symbol should be in the visible area
              const slotHeight = SYMBOL_SIZE + SYMBOL_GAP;
              const symbolPosition = ((reel.position + j) % reel.symbols.length) * slotHeight;
              symbol.visible = symbolPosition >= 0 && symbolPosition < SYMBOL_TO_SHOW * slotHeight;
            }
          }
          
          // Here you might want to check for wins before allowing another spin
          // this.checkWins();
        } : undefined
      );
    }
  }

  public update(delta: number): void {
    // Process all active tweens
    const now = Date.now();
    const remove = [];

    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
    
    // Update the slots
    const slotTextures = AssetPreloader.getTextures();
    
    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      
      // Skip update if the reel position hasn't changed
      if (r.position === r.prevPosition) continue;
      
      // Update blur filter based on speed
      const speed = Math.abs(r.position - r.prevPosition);
      r.blur.strengthY = speed * 8;
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
          symbol.visible = symbol.y >= 0 && symbol.y < SYMBOL_TO_SHOW * slotHeight;
        }
        
        // If symbol moves below visible area, recycle it to the top with new texture
        if (symbol.y < 0 && prevY > slotHeight) {
          // Swap in a new random texture
          symbol.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
          // Adjust scale to maintain proper sizing
          symbol.scale.x = symbol.scale.y = Math.min(
            SYMBOL_SIZE / symbol.width,
            SYMBOL_SIZE / symbol.height
          );
          // Center the symbol horizontally within the reel
          symbol.x = (REEL_WIDTH - symbol.width * symbol.scale.x) / 2;
        }
      }
    }
  }
}