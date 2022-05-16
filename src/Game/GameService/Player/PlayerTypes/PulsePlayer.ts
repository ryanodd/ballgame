import { GamepadInputResult, isGamePadInputResult, KeyboardMouseInputResult } from "@/Game/InputService/model/InputResult";
import PulsePlayerObject from "../../GameObject/GameObjectFactory/PulsePlayerObject";
import { MyInput } from "../../netplayjs/MyInput";
import { Scene } from "../../Scene/Scene";
import { Player, PlayerProps } from "../Player";

export interface PulsePlayerProps extends PlayerProps {
  // DENSITY: number;
  // FRICTION: number;
  // RESTITUTION: number;
  RADIUS: number;
}

export class PulsePlayer extends Player {
  // DENSITY: number;
  // FRICTION: number;
  // RESTITUTION: number;
  RADIUS: number;

  pulseObject: PulsePlayerObject | undefined;

  constructor(props: PulsePlayerProps){
    super({
      playerIndex: props.playerIndex,
      netplayPlayerIndex: props.netplayPlayerIndex,
      gamepadIndex: props.gamepadIndex
    });
    // this.DENSITY = props.DENSITY;
    // this.FRICTION = props.FRICTION;
    // this.RESTITUTION = props.RESTITUTION;
    this.RADIUS = props.RADIUS;

    this.pulseObject = undefined;
  }

  // Puts new player Game Objects (usually a single object) into the given Scene world.
  createObjects(scene: Scene, x: number, y: number){
    this.pulseObject = new PulsePlayerObject({
      scene: scene,
      x: x,
      y: y,
      r: this.RADIUS,
      // density: this.DENSITY,
      // friction: this.FRICTION,
      // restitution: this.RESTITUTION
    });
    scene.addGameObject(this.pulseObject);
  }

  // Detect input, do stuff
  tick(input: MyInput){
    this.handleMovement(this.getInput(input));
  }

  handleMovement(input: GamepadInputResult | KeyboardMouseInputResult){
    let xAxisInput = 0
    let yAxisInput = 0

    if (isGamePadInputResult(input)) {
      xAxisInput = input.leftStickXAxis;
      yAxisInput = input.leftStickYAxis;
    }
    else {
      console.log(input.buttonUp)
      if (input.buttonLeft) xAxisInput -= 1
      if (input.buttonRight) xAxisInput += 1
      if (input.buttonUp) yAxisInput += 1
      if (input.buttonDown) yAxisInput -= 1
    }
    
    this.pulseObject.handleMovement(xAxisInput, yAxisInput);
  }
}
