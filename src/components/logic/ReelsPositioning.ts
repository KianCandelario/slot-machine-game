import { GameState } from "../../core/Game.ts";
import { NUM_REEL } from "../../lib/reelconfig.ts";

type SymbolId = 'hv1' | 'hv2' | 'hv3' | 'hv4' | 'lv1' | 'lv2' | 'lv3' | 'lv4';

export class ReelsPositioning {
    private gameState: GameState;

    // predefined symbols for each reel
    private reelSet: SymbolId[][] = [
        [ "hv2", "lv3", "lv3", "hv1", "hv1", "lv1", "hv1", "hv4", "lv1", "hv3", "hv2", "hv3", "lv4", "hv4", "lv1", "hv2", "lv4", "lv1", "lv3", "hv2" ],
        [ "hv1", "lv2", "lv3", "lv2", "lv1", "lv1", "lv4", "lv1", "lv1", "hv4", "lv3", "hv2", "lv1", "lv3", "hv1", "lv1", "lv2", "lv4", "lv3", "lv2" ],
        [ "lv1", "hv2", "lv3", "lv4", "hv3", "hv2", "lv2", "hv2", "hv2", "lv1", "hv3", "lv1", "hv1", "lv2", "hv3", "hv2", "hv4", "hv1", "lv2", "lv4" ],
        [ "hv2", "lv2", "hv3", "lv2", "lv4", "lv4", "hv3", "lv2", "lv4", "hv1", "lv1", "hv1", "lv2", "hv3", "lv2", "lv3", "hv2", "lv1", "hv3", "lv2" ],
        [ "lv3", "lv4", "hv2", "hv3", "hv4", "hv1", "hv3", "hv2", "hv2", "hv4", "hv4", "hv2", "lv2", "hv4", "hv1", "lv2", "hv1", "lv2", "hv4", "lv4" ],
    ];

    private reelPositions: number[] = [];                // current position index for each reel
    private targetReelPositions: number[] = [];          // target position indices for each reel (predefined outcome)
    private finalScreen: SymbolId[][] = [[], [], []];    // final symbols to show on the screen

    constructor(gameState: GameState) {
        this.gameState = gameState;
        this.setInitialState();
    }

    // set initial state for all reels
    public setInitialState(): void {
        this.reelPositions = [];
        for (let i = 0; i < NUM_REEL; i++) {
            this.reelPositions.push(0);
        }
    }

    // generate a new random outcome for the next spin
    private generateRandomOutcome(): number[] {
         //const newPositions = [0, 11, 1, 10, 14];
          const newPositions = []
           for (let i = 0; i < NUM_REEL; i++) {
               // generate random position for each reel
               const randomPos = Math.floor(
                    Math.random() * this.reelSet[i].length
               );
               newPositions.push(randomPos);
           }
          return newPositions;
    }

    // prepare spin outcome (generate or use predetermined)
    public prepareSpinOutcome(): void {
        // generate a new random outcome if not already set
        if (
            this.targetReelPositions.every(
                (pos, i) => pos === this.reelPositions[i]
            )
        ) {
            this.targetReelPositions = this.generateRandomOutcome();
        }
    }

    // calculate and store the final screen based on target positions
    public calculateFinalScreen(): void {
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

    // update reel position after spin
    public updateReelPosition(reelIndex: number): void {
        this.reelPositions[reelIndex] = this.targetReelPositions[reelIndex];
    }

    // Getters
    public getReelPositions(): number[] {
        return this.reelPositions;
    }

    public getTargetReelPositions(): number[] {
        return this.targetReelPositions;
    }

    public getReelSet(): string[][] {
        return this.reelSet;
    }

    public getFinalScreen(): SymbolId[][] {
        return this.finalScreen;
    }
}