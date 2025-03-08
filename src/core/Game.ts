import { Application } from 'pixi.js'
import { initDevtools } from '@pixi/devtools'

export class Game {
  private app: Application

  constructor() {
    this.app = new Application()
  }

  public async init(): Promise<void> {
    initDevtools({ app: this.app })

    await this.app.init({
      resizeTo: window,
      backgroundColor: 0x000000
    })
    this.app.canvas.style.position = 'absolute'


    
  }
}