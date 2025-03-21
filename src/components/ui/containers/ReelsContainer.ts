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
import gsap from "gsap";

export class ReelsContainer extends Component {
     private reels: REELCONFIG = [];
     private gameState: GameState;

     // predefined symbols for each reel
     private reelSet: string[][] = [
          [ "hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2" ],
          [ "hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2" ],
          [ "lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4" ],
          [ "hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2" ],
          [ "lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4" ],
     ];

     private reelPositions: number[] = []; // current position index for each reel
     private targetReelPositions: number[] = []; // target position indices for each reel (predefined outcome)
     private finalScreen: string[][] = [[], [], []]; // final symbols to show on the screen
     private symbolCodeMap = new Map<Sprite, string>(); // map to track which symbol sprite corresponds to which symbol code
     private textureMap = new Map<string, Texture>(); // map of symbol codes to textures
     private symbolsInitialized = false; // Flag to track if symbols have been initialized with final results

     constructor(gameState: GameState) {
          super();
          this.gameState = gameState;
     }

     public async init(): Promise<void> {
          await AssetPreloader.loadAllAssets();
          const slotTextures = AssetPreloader.getTextures();

          // mapping between symbol codes and textures
          // high value symbols (masks)
          this.textureMap.set("hv1", slotTextures[0]); // mask1 (red angry man)
          this.textureMap.set("hv2", slotTextures[1]); // mask2 (white wolf)
          this.textureMap.set("hv3", slotTextures[2]); // mask3 (red angry demon)
          this.textureMap.set("hv4", slotTextures[3]); // mask4 (kinda cute looking face)

          // low value symbols (card values)
          this.textureMap.set("lv1", slotTextures[6]); // 9
          this.textureMap.set("lv2", slotTextures[7]); // 10
          this.textureMap.set("lv3", slotTextures[8]); // A
          this.textureMap.set("lv4", slotTextures[9]); // j

          // position the reels container
          this.position.set(10, 90);

          // initialize reel positions
          this.setInitialState();

          // initialize target positions - determined before spin
          this.targetReelPositions = [...this.reelPositions];

          // create all reels
          for (let i = 0; i < NUM_REEL; i++) {
               // create a container for this reel
               const reelContainer = new Container();
               reelContainer.position.set(i * (REEL_WIDTH + REEL_GAP), 5);
               this.addChild(reelContainer);

               // create the reel configuration object
               const reel: ReelConfig = {
                    container: reelContainer,
                    symbols: [],
                    position: 0,
                    prevPosition: 0,
                    blur: new BlurFilter(),
               };

               // set up blur filter (initially disabled)
               reel.blur.strengthX = 0;
               reel.blur.strengthY = 0;
               reelContainer.filters = [reel.blur];

               // create the symbols for the reel
               for (let j = 0; j < NUM_SYMBOLS; j++) {
                    // get the symbol from the reel set based on initial position
                    const symbolIdx =
                         (this.reelPositions[i] + j) % this.reelSet[i].length;
                    const symbolCode = this.reelSet[i][symbolIdx];
                    const symbolTexture =
                         this.textureMap.get(symbolCode) || slotTextures[0]; // Fallback to first texture

                    // create a new sprite with the symbol texture
                    const symbol = new Sprite(symbolTexture);
                    this.symbolCodeMap.set(symbol, symbolCode);

                    // scale the symbol to fit within the designated space
                    symbol.anchor.set(0.5);
                    const maxWidth = SYMBOL_SIZE;
                    const maxHeight = SYMBOL_SIZE;
                    const scaleX = maxWidth / symbol.width;
                    const scaleY = maxHeight / symbol.height;
                    const scale = Math.min(scaleX, scaleY);
                    symbol.scale.set(scale);

                    // position the symbol in the center of its area
                    symbol.x = REEL_WIDTH / 2;
                    symbol.y = j * (SYMBOL_SIZE + SYMBOL_GAP) + SYMBOL_SIZE / 2;

                    // only show symbols that are within the visible area
                    symbol.visible = j < SYMBOL_TO_SHOW;

                    // add to the reel container
                    reelContainer.addChild(symbol);
                    reel.symbols.push(symbol);
               }

               this.reels.push(reel);
          }
     }

     // set initial state for all reels
     private setInitialState(): void {
          this.reelPositions = [];
          for (let i = 0; i < NUM_REEL; i++) {
               this.reelPositions.push(0);
          }
     }

     // generate a new random outcome for the next spin
     private generateRandomOutcome(): number[] {
          const newPositions = [];
          for (let i = 0; i < NUM_REEL; i++) {
               // generate random position for each reel
               const randomPos = Math.floor(
                    Math.random() * this.reelSet[i].length
               );
               newPositions.push(randomPos);
          }
          return newPositions;
     }

     // calculate and store the final screen based on target positions
     private calculateFinalScreen(): void {
          this.finalScreen = [
            [], 
            [], 
            []
          ];

          for (let col = 0; col < this.targetReelPositions.length; col++) {
               const reelStop = this.targetReelPositions[col];
               for (let row = 0; row < 3; row++) {
                    let idx = (reelStop + row) % this.reelSet[col].length;
                    this.finalScreen[row][col] = this.reelSet[col][idx];
               }
          }

          // display final screen for debugging
          console.log("Screen:");
          for (let row = 0; row < this.finalScreen.length; row++) {
               console.log(this.finalScreen[row].join(" "));
          }
     }

     // prepare symbols with final textures before spinning
     private prepareSymbolsWithFinalTextures(): void {
          // prepare all reels with their final symbols but only show them at the appropriate time
          for (let i = 0; i < this.reels.length; i++) {
               const reel = this.reels[i];

               // for the visible symbols (0, 1, 2), set the final textures based on predetermined outcome
               for (let j = 0; j < SYMBOL_TO_SHOW; j++) {
                    const symbolCode = this.finalScreen[j][i];
                    // we'll apply this texture to the symbol that will be in position j after the reel stops
                    const symbol = reel.symbols[j];

                    // store the final symbol code for later reference
                    this.symbolCodeMap.set(symbol, symbolCode);
               }
          }

          this.symbolsInitialized = true;
     }

     public startSpin(): void {
          if (this.gameState.running) return; // if already spinning, do nothing

          this.gameState.running = true;

          // generate a new random outcome if not already set
          if (
               this.targetReelPositions.every(
                    (pos, i) => pos === this.reelPositions[i]
               )
          ) {
               this.targetReelPositions = this.generateRandomOutcome();
          }

          // calculate the final screen based on target positions
          this.calculateFinalScreen();

          // prepare the symbols with their final textures
          this.prepareSymbolsWithFinalTextures();

          // make all symbols visible before spinning starts
          for (const reel of this.reels) {
               for (const symbol of reel.symbols) {
                    symbol.visible = true;
               }
          }

          // start the spin animation for each reel with sequential delays
          for (let i = 0; i < this.reels.length; i++) {
               const reel = this.reels[i];

               // apply blur effect during spinning
               gsap.to(reel.blur, {
                    strengthY: 17,
                    duration: 0.5,
               });

               // calculate final position
               const spinAmount = 5 + i; // base number of complete rotations (more for later reels)
               const totalSymbols = this.reelSet[i].length;

               // target position = current position + full rotations + extra to reach target
               let targetPosition = reel.position + spinAmount * totalSymbols;

               // calculate additional offset to reach the target position
               const currentIndex = this.reelPositions[i];
               const targetIndex = this.targetReelPositions[i];
               const offset =
                    (targetIndex - currentIndex + totalSymbols) % totalSymbols;
               targetPosition += offset;

               // GSAP animation
               gsap.to(reel, {
                    position: targetPosition,
                    duration: 2 + i * 0.5, // sequential timing: first reel stops first
                    ease: "power3.inOut",
                    onUpdate: () => {
                         // position updates will be handled in the main update method
                    },
                    onComplete: () => {
                         // remove blur when the reel stops
                         gsap.to(reel.blur, {
                              strengthY: 0,
                              duration: 0.2,
                         });

                         // update the position to match the target
                         this.reelPositions[i] = this.targetReelPositions[i];

                         // update the visible symbols for this reel
                         this.updateVisibleSymbolsForReel(i);

                         // if this is the last reel, update the game state
                         if (i === this.reels.length - 1) {
                              this.gameState.running = false;
                              this.symbolsInitialized = false; // Reset for next spin
                         }
                    },
               });
          }
     }

     // update the visible symbols for a specific reel
     private updateVisibleSymbolsForReel(reelIndex: number): void {
          const reel = this.reels[reelIndex];

          // update the visible symbols (top 3)
          for (let j = 0; j < SYMBOL_TO_SHOW; j++) {
               const symbol = reel.symbols[j];
               const symbolCode = this.finalScreen[j][reelIndex];
               const symbolTexture =
                    this.textureMap.get(symbolCode) ||
                    AssetPreloader.getTextures()[0];

               // update the texture
               symbol.texture = symbolTexture;
               this.symbolCodeMap.set(symbol, symbolCode);

               // recalculate scale to maintain proper sizing
               const maxWidth = SYMBOL_SIZE;
               const maxHeight = SYMBOL_SIZE;
               const scaleX = maxWidth / symbol.texture.width;
               const scaleY = maxHeight / symbol.texture.height;
               const scale = Math.min(scaleX, scaleY);
               symbol.scale.set(scale);

               // position in the center of the symbol area
               symbol.x = REEL_WIDTH / 2;
               symbol.y = j * (SYMBOL_SIZE + SYMBOL_GAP) + SYMBOL_SIZE / 2;

               symbol.visible = true;
          }

          // hide symbols outside the visible area
          for (let j = SYMBOL_TO_SHOW; j < reel.symbols.length; j++) {
               reel.symbols[j].visible = false;
          }
     }

     // game loop update method (generated)
     public update(delta: number): void {
          // skip updates if not running
          if (!this.gameState.running) return;

          for (let i = 0; i < this.reels.length; i++) {
               const reel = this.reels[i];

               // skip update if the reel position hasn't changed
               if (reel.position === reel.prevPosition) continue;

               // update previous position
               reel.prevPosition = reel.position;

               // total height of a single symbol slot (including gap)
               const slotHeight = SYMBOL_SIZE + SYMBOL_GAP;

               // calculate how far along the spin we are (0 to 1)
               // 1 means the target position is reached
               const targetPosition = this.reels[i].position;
               const progress =
                    1 - (targetPosition - Math.floor(targetPosition));

               // if we're in the last 10% of the spin, start showing correct symbols
               const finalApproachThreshold = 0.9;
               const isInFinalApproach = progress > finalApproachThreshold;

               // update symbol positions
               for (let j = 0; j < reel.symbols.length; j++) {
                    const symbol = reel.symbols[j];
                    const prevY = symbol.y;

                    // calculate new Y position based on reel position
                    symbol.y =
                         ((reel.position + j) % reel.symbols.length) *
                              slotHeight +
                         50;

                    // control visibility - only show symbols in the visible area
                    symbol.visible =
                         symbol.y >= 0 &&
                         symbol.y < SYMBOL_TO_SHOW * slotHeight;

                    // approaching the final state, update symbols to match the final outcome
                    if (
                         isInFinalApproach &&
                         symbol.visible &&
                         this.symbolsInitialized
                    ) {
                         const visibleRow = Math.floor(symbol.y / slotHeight);
                         if (visibleRow >= 0 && visibleRow < SYMBOL_TO_SHOW) {
                              const symbolCode =
                                   this.finalScreen[visibleRow][i];
                              const symbolTexture =
                                   this.textureMap.get(symbolCode) ||
                                   AssetPreloader.getTextures()[0];

                              // only update if the texture isn't already correct
                              if (symbol.texture !== symbolTexture) {
                                   symbol.texture = symbolTexture;
                                   this.symbolCodeMap.set(symbol, symbolCode);

                                   // recalculate scale
                                   const maxWidth = SYMBOL_SIZE;
                                   const maxHeight = SYMBOL_SIZE;
                                   const scaleX =
                                        maxWidth / symbol.texture.width;
                                   const scaleY =
                                        maxHeight / symbol.texture.height;
                                   const scale = Math.min(scaleX, scaleY);
                                   symbol.scale.set(scale);
                              }
                         }
                    }
                    // handle recycling of symbols that move out of view
                    else if (symbol.y < 0 && prevY > 0) {
                         // if not in final approach, use the next symbol in sequence
                         // calculate which symbol should be shown
                         const reelIndex = i;
                         const totalSymbols = this.reelSet[reelIndex].length;

                         // get position in the reel from the total reel position
                         const reelPosition =
                              Math.floor(reel.position) % totalSymbols;

                         // calculate which symbol index this would be
                         const symbolIndex = (reelPosition + j) % totalSymbols;
                         const symbolCode =
                              this.reelSet[reelIndex][symbolIndex];
                         const symbolTexture =
                              this.textureMap.get(symbolCode) ||
                              AssetPreloader.getTextures()[0];

                         // update the symbol
                         symbol.texture = symbolTexture;
                         this.symbolCodeMap.set(symbol, symbolCode);

                         // recalculate scale to maintain proper sizing
                         const maxWidth = SYMBOL_SIZE;
                         const maxHeight = SYMBOL_SIZE;
                         const scaleX = maxWidth / symbol.texture.width;
                         const scaleY = maxHeight / symbol.texture.height;
                         const scale = Math.min(scaleX, scaleY);
                         symbol.scale.set(scale);
                    }
               }
          }
     }
}
