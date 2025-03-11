import { BlurFilter, ContainerChild, Container, Sprite } from "pixi.js";

export const REELCONFIG: {
  CONTAINER: Container<ContainerChild>;
  SYMBOLS: Sprite[];
  position: number;
  PREV_POSITION: number;
  BLUR: BlurFilter;
}[] = [];
