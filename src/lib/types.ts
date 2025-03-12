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