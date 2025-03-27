import { GlowFilter } from "pixi-filters";

export const glowFilter = new GlowFilter({
     distance: 15,
     outerStrength: 2,
     innerStrength: .5,
     color: 0xFFD700, // Golden glow
     quality: 0.5
 });