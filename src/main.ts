import { Game } from './core/Game.ts'

(async() => {
    try {
        const game = new Game()
        await game.init()   
    } catch (error) {
        console.log("Failed to initialize game: ", error)
    }
})()