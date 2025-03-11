const NUM_REEL: number = 5;
const REEL_WIDTH: number = 180;
const REEL_GAP: number = 20;
const SYMBOL_SIZE: number = 120;
const SYMBOL_GAP: number = 30;
const SYMBOL_TO_SHOW: number = 3;
const TOTAL_REEL_HEIGHT: number =
  SYMBOL_TO_SHOW * (SYMBOL_SIZE + SYMBOL_GAP) + SYMBOL_GAP;
const TOTAL_REEL_WIDTH: number = NUM_REEL * (REEL_WIDTH + REEL_GAP) + REEL_GAP;

export {
  NUM_REEL,
  REEL_WIDTH,
  REEL_GAP,
  SYMBOL_GAP,
  SYMBOL_SIZE,
  SYMBOL_TO_SHOW,
  TOTAL_REEL_HEIGHT,
  TOTAL_REEL_WIDTH,
}
