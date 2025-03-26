// Use REELCONFIG for the array of reels.
// Use ReelConfig for individual reel objects.

import { BlurFilter, Container, Sprite } from "pixi.js";

export type ReelConfig = {
  container: Container;
  symbols: Sprite[];
  position: number;
  prevPosition: number;
  blur: BlurFilter;
};

export type REELCONFIG = ReelConfig[]; 


export type SymbolId = 'hv1' | 'hv2' | 'hv3' | 'hv4' | 'lv1' | 'lv2' | 'lv3' | 'lv4';