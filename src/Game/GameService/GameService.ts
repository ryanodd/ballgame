import { InputResult } from '@/Game/InputService/model/InputResult';
import CanvasController from '@/Game/CanvasService/CanvasService'
import InputController from '@/Game/InputService/InputService';
import { createScene1 } from './Scene/sceneFactory/Scene1';
import { LogService } from '@/Game/LogService/LogService';
import { Scene } from './Scene/Scene';
import { b2BodyDef, b2Fixture, b2FixtureDef, b2PolygonShape, b2World } from '@/lib/Box2D/Box2D';

export default class GameController {
  scene: Scene
  inputController: InputController
  previousTimestamp: number //type?
  
  constructor(){
    this.inputController = new InputController();
    this.previousTimestamp = 0;
    
    this.scene = createScene1();
    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  gameLoop(timestamp: number) {
    const msPassed = (timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
    const fps = Math.round(1000 / msPassed); // TODO pass this somewhere
    
    const input = this.inputController.getInput();

    this.tickGameObjects(input, msPassed)
    this.tickWorld(msPassed); // TODO verify - pass in correct ms.

    this.scene.render();

    // Aaaand request the next frame
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  tickGameObjects(input: InputResult, msPassed: number) {
    this.scene.gameObjects.forEach(gameObject => {
      gameObject.tick(input, msPassed)
    })
  }

  tickWorld(msPassed: number) {
    this.scene.world.Step((msPassed / 1000), 8 , 3);
	  //this.world.ClearForces();
  }
}