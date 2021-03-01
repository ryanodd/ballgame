import { GamepadInputResult } from "@/Game/InputService/model/InputResult";
import { VueService } from "@/Game/VueService/VueService";
import ShipBullet from "../../GameObject/GameObjectFactory/ShipBullet";
import ShipPlayerObject from "../../GameObject/GameObjectFactory/ShipPlayerObject";
import { Scene } from "../../Scene/Scene";
import { Player, PlayerProps } from "../Player";

export class ShipPlayer extends Player {
  shipObject: ShipPlayerObject | undefined;
  bulletObject: ShipBullet | undefined;

  constructor(props: PlayerProps){
    super(props);
    this.shipObject = undefined;
    this.bulletObject = undefined;
  }

  // Puts new player Game Objects (usually a single object) into the given Scene world.
  createObjects(scene: Scene, x: number, y: number){
    this.shipObject = new ShipPlayerObject({
      scene: scene,
      x: x,
      y: y,
      density: 2,
      friction: 0.5,
      restitution: 0.0,
      noseLength: 0.4,
      noseWidth: 0.1,
      tailLength: 0.12,
      tailWidth: 0.5,
      options: {}
    })
    scene.addGameObject(this.shipObject);
  }

  // Detect input, do stuff
  tick(){
    const input = this.getInput() as GamepadInputResult;
    this.handleRotation(input);
    this.handleThrust(input);
    this.handleShoot(input);
  }

  handleRotation(input: GamepadInputResult){
    const xAxisInput = input.leftStickXAxis;
    this.shipObject.handleRotation(xAxisInput)
  }

  handleThrust(input: GamepadInputResult){
    if(input.button1){
      this.shipObject.thrust();
    }
  }

  handleShoot(input: GamepadInputResult){
    if(input.button2 && !this.bulletObject){
      this.bulletObject = this.shipObject.createBullet();
    }
  }
}