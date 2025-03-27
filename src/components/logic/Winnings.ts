import { SymbolId } from "../../lib/types";

const PAYTABLE: Record<SymbolId, [number, number, number]> = {
    "hv1": [10, 20, 50],
    "hv2": [5, 10, 20],
    "hv3": [5, 10, 15],
    "hv4": [5, 10, 15],
    "lv1": [2, 5, 10],
    "lv2": [1, 2, 5],
    "lv3": [1, 2, 3],
    "lv4": [1, 2, 3]
};


// payline visualization
/*
[0,0] [0,1] [0,2] [0,3] [0,4]
[1,0] [1,1] [1,2] [1,3] [1,4]
[2,0] [2,1] [2,2] [2,3] [2,4]
*/

export const PAYLINES: number[][][] = [
    // Payline 1: Middle row straight
    [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]],
    // Payline 2: Top row straight
    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
    // Payline 3: Bottom row straight
    [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
    // Payline 4: V shape starting 
    [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]],
    // Payline 5: V shape starting 
    [[2, 0], [2, 1], [1, 2], [0, 3], [0, 4]],
    // Payline 6: X shape
    [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]],
    // Payline 7: Reverse X shape
    [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]]
];

export class WinChecker {
     private checkPayline(screen: SymbolId[][], payline: number[][]): {symbol: SymbolId, count: number} | null {
          let matchingSymbol: SymbolId | null = null;
          let count = 0;
     
          for (const [row, col] of payline) {
               let currentSymbol = screen[row][col];
     
               if (matchingSymbol === null) {
                    matchingSymbol = currentSymbol;
                    count = 1;
               }
               else if (currentSymbol === matchingSymbol) {
                    count++;
               }
               else {
                    break;
               }
          }
     
          return count >= 3 ? { symbol: matchingSymbol!, count } : null;
     }
    
    public calculateWins(screen: SymbolId[][]): { 
        total: number, 
        wins: { 
            payline: number, symbol: SymbolId, count: number, payout: number 
        }[] 
    } {
        const wins: { 
            payline: number, 
            symbol: SymbolId, 
            count: number, 
            payout: number 
        }[] = [];
        let total = 0;
    
        // check each payline
        for (let i = 0; i < PAYLINES.length; i++) {
            const payline = PAYLINES[i];
            const result = this.checkPayline(screen, payline);
    
            if (result !== null) {
                const { symbol, count } = result;
    
                // determine which payout to use (3, 4, or 5 of a kind)
                let payout = 0;
                if (count === 5) {
                    payout = PAYTABLE[symbol][2];
                } else if (count === 4) {
                    payout = PAYTABLE[symbol][1];
                } else {
                    payout = PAYTABLE[symbol][0];
                }
    
                wins.push({
                    payline: i + 1, // paylines are 1-indexed
                    symbol,
                    count: count,
                    payout
                });
    
                total += payout;
            }
        }
    
        return { total, wins };
    }
}