import { GlowFilter } from "pixi-filters";

export const glowFilter = new GlowFilter({
     distance: 10,
     outerStrength: 3,
     innerStrength: 0,
     quality: 2,
     alpha: 1,
     knockout: false
})