import { JSONObject } from "../../../../lib/netplayjs";
import { GamepadInputResult, isGamePadInputResult, KeyboardMouseInputResult } from "../../../InputService/model/InputResult";
import PulseCharacterObject from "../../GameObject/GameObjectFactory/PulseCharacterObject";
import { MyInput } from "../../netplayjs/MyInput";
import { Scene } from "../../Scene/Scene";
import { Character, CharacterProps, INPUT_BUFFER_FRAMES } from "../Character";
import { Player, PlayerProps } from "../Player";

const PULSE_COOLDOWN = 40

export interface PulseCharacterProps extends CharacterProps {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;
  RADIUS: number;
}

export class PulseCharacter extends Character {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;
  RADIUS: number;

  pulseObject: PulseCharacterObject | undefined;
  mostRecentPulseFrame: number;
  pulseBuffered: boolean;

  constructor(props: PulseCharacterProps){
    console.log(props.player)
    super({player: props.player})

    this.DENSITY = props.DENSITY;
    this.FRICTION = props.FRICTION;
    this.RESTITUTION = props.RESTITUTION;
    this.RADIUS = props.RADIUS;

    this.pulseObject = undefined;
    this.mostRecentPulseFrame = -PULSE_COOLDOWN
    this.pulseBuffered = false;
  }

  // Puts new player Game Objects (usually a single object) into the given Scene world.
  createObjects(scene: Scene, x: number, y: number){
    this.pulseObject = new PulseCharacterObject({
      scene: scene,
      x: x,
      y: y,
      r: this.RADIUS,
      density: this.DENSITY,
      friction: this.FRICTION,
      restitution: this.RESTITUTION
    });
    scene.addGameObject(this.pulseObject);
  }

  // Detect input, do stuff
  tick(input: GamepadInputResult | KeyboardMouseInputResult, frame: number){
    this.handlePulse(input, frame);
    this.handleMovement(input);
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      mostRecentPulseFrame: this.mostRecentPulseFrame,
      pulseBuffered: this.pulseBuffered,
    }
  }

  deserialize(value: any): void {
    super.deserialize(value)
    this.mostRecentPulseFrame = value['mostRecentPulseFrame']
    this.pulseBuffered = value['pulseBuffered']
  }

  handlePulse(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    if (
      (isGamePadInputResult(input) && input.button1) ||
      (!isGamePadInputResult(input) && input.button1) ||
      (this.pulseBuffered)
    ){
      console.log(frame)
      console.log(this.mostRecentPulseFrame)
      if (frame >= this.mostRecentPulseFrame + PULSE_COOLDOWN) {
        this.pulseBuffered = false
        this.pulseObject?.pulse();
        this.mostRecentPulseFrame = frame
      }
      else if (frame + INPUT_BUFFER_FRAMES >= this.mostRecentPulseFrame + PULSE_COOLDOWN) {
        this.pulseBuffered = true
      }
    }
  }

  handleMovement(input: GamepadInputResult | KeyboardMouseInputResult){
    let xAxisInput = 0
    let yAxisInput = 0

    if (isGamePadInputResult(input)) {
      xAxisInput = input.leftStickXAxis;
      yAxisInput = input.leftStickYAxis;
    }
    else {
      if (input.buttonLeft) xAxisInput -= 1
      if (input.buttonRight) xAxisInput += 1
      if (input.buttonUp) yAxisInput += 1
      if (input.buttonDown) yAxisInput -= 1
      if (xAxisInput !== 0 && yAxisInput !== 0) {
        xAxisInput *= Math.cos(Math.PI/4)
        yAxisInput *= Math.sin(Math.PI/4)
      }
    }
    
    this.pulseObject?.handleMovement(xAxisInput, yAxisInput);
  }
}
