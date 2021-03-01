import { GamepadInputResult } from "@/Game/InputService/model/InputResult";
import { VueService } from "@/Game/VueService/VueService";
import PulsePlayerObject from "../../GameObject/GameObjectFactory/PulsePlayerObject";
import { Scene } from "../../Scene/Scene";
import { Player, PlayerProps } from "../Player";

export class PulsePlayer extends Player {
  pulseObject: PulsePlayerObject | undefined;

  constructor(props: PlayerProps){
    super(props);
    this.pulseObject = undefined;
  }

  // Puts new player Game Objects (usually a single object) into the given Scene world.
  createObjects(scene: Scene, x: number, y: number){
    this.pulseObject = new PulsePlayerObject({
      scene: scene,
      x: x,
      y: y,
      r: 0.240,
      density: 0.5,
      friction: 0.5,
      restitution: 0.0,
      options: {}
    });
    scene.addGameObject(this.pulseObject);
  }

  // Detect input, do stuff
  tick(){
    const input = this.getInput() as GamepadInputResult;
    this.handleMovement(input);
  }

  handleMovement(input: GamepadInputResult){
    const xAxisInput = input.leftStickXAxis;
    const yAxisInput = input.leftStickYAxis;
    this.pulseObject.handleMovement(xAxisInput, yAxisInput);
  }
}