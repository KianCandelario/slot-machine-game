import { Assets, Texture } from "pixi.js";

export class AssetPreloader {
    private static textures: Texture[] = [];

    public static async loadTextures(): Promise<void> {
        const texturePaths = [
            "../assets/japanese_theme/slot_symbols/masks/mask1.png",
            "../assets/japanese_theme/slot_symbols/masks/mask2.png",
            "../assets/japanese_theme/slot_symbols/masks/mask3.png",
            "../assets/japanese_theme/slot_symbols/masks/mask4.png",
            "../assets/japanese_theme/slot_symbols/others/bonus.png",
            "../assets/japanese_theme/slot_symbols/others/wild.png",
            "../assets/japanese_theme/slot_symbols/chars/9.png",
            "../assets/japanese_theme/slot_symbols/chars/10.png",
            "../assets/japanese_theme/slot_symbols/chars/A.png",
            "../assets/japanese_theme/slot_symbols/chars/J.png",
            "../assets/japanese_theme/slot_symbols/chars/K.png",
            "../assets/japanese_theme/slot_symbols/chars/Q.png",
        ];

        // Load the assets
        await Assets.load(texturePaths);

        // Create textures from the loaded assets
        this.textures = texturePaths.map(path => Texture.from(path));
    }

    public static getTextures(): Texture[] {
        return this.textures;
    }
}