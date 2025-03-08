import { Game } from './core/Game'

(async() => {
    const game = new Game()
    await game.init()
})