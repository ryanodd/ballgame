import { InputResult } from '@/InputService/model/InputResult';
import GraphicsController from '@/CanvasController'
import InputController from '@/InputService';
import { GameState } from './model/gameState';
import { initialGameState } from './constants/initialGameState';

export default class GameController {
  gameState: GameState
  inputController: InputController
  previousTimestamp: number //type?
  
  constructor(){
    this.gameState = initialGameState;
    this.inputController = new InputController();  
    this.previousTimestamp = 0;
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp: number) {
    const msPassed = (timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
    const fps = Math.round(1000 / msPassed); // TODO pass this somewhere

    const input = this.inputController.getInput();
    this.processFrame(input);

    GraphicsController.paint(this.gameState);

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  processFrame(input: InputResult) {
    if (input.primaryPlayerInput.leftStickXAxis < -0.2){
      this.gameState.primaryPlayerX -= 1;
    }
    if (input.primaryPlayerInput.leftStickXAxis > 0.2){
      this.gameState.primaryPlayerX += 1;
    }
    if (input.primaryPlayerInput.leftStickYAxis < -0.2){
      this.gameState.primaryPlayerY -= 1;
    }
    if (input.primaryPlayerInput.leftStickYAxis > 0.2){
      this.gameState.primaryPlayerY += 1;
    }
  }
}