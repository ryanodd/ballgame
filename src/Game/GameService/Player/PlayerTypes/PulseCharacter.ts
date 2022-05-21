import { RigidBody } from "@dimforge/rapier2d";
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

  tickMovement(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) { 
    this.handleMovement(input);
  }

  // Detect input, do stuff
  tickAbilities(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    this.handlePulse(input, frame);
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
      if (frame >= this.mostRecentPulseFrame + PULSE_COOLDOWN) {
        this.pulseBuffered = false
        this.mostRecentPulseFrame = frame

        this.scene?.gameObjects.forEach(gameObject => {
          if (gameObject.rigidBodyHandle !== null) {
            console.log(gameObject.rigidBodyHandle)
            const rigidBody = this.scene?.world.getRigidBody(gameObject.rigidBodyHandle)
            console.log(rigidBody)
            rigidBody?.applyImpulse({ x: 1, y: 1 }, true)
          }
        })
      }
      else if (frame + INPUT_BUFFER_FRAMES >= this.mostRecentPulseFrame + PULSE_COOLDOWN) {
        this.pulseBuffered = true
      }
    }
  }

  handleMovement(input: GamepadInputResult | KeyboardMouseInputResult){

    if (!this.pulseObject || this.pulseObject.colliderHandle === null || this.pulseObject.rigidBodyHandle === null) {
      return
    }

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
    

    const ACCELERATION_CONSTANT_X = 4.5;
    const ACCELERATION_CONSTANT_Y = 4.5;

    //const collider = this.scene?.world.getCollider(this.pulseObject.colliderHandle)
    const rigidBody = this.scene?.world.getRigidBody(this.pulseObject.rigidBodyHandle) as RigidBody
    const velocity = rigidBody?.linvel()

    let xInputForce = xAxisInput * ACCELERATION_CONSTANT_X;
    let yInputForce = yAxisInput * ACCELERATION_CONSTANT_Y;

    // top speed & quick turnaround
    // Makes force which tends velocity toward orignal input force AT SOME RATE. Is instant? Or does it take a few frames to turn around?
    // I call this strategy "VELOCITY CANCELLING": input/target velocity minus current velocity.
    xInputForce -= velocity.x
    yInputForce -= velocity.y

    // TODO Stop diagonal cheat. Need to enforce max radius or whatever you call it
    const impulseX = rigidBody.mass() * xInputForce; //disregard time factor. < ??what does this mean?
    const impulseY = rigidBody.mass() * yInputForce;
    const impulse = { x: impulseX, y: impulseY };
    
    rigidBody.applyImpulse(impulse, true)

    // // Example of slow turning I think?
    // //case MS_LEFT:  desiredVel = b2Max( vel.x - 0.1f, -5.0f ); break;
    // //case MS_STOP:  desiredVel = 0; break;
    // //case MS_RIGHT: desiredVel = b2Min( vel.x + 0.1f,  5.0f ); break;

    //this.pulseObject?.handleMovement(xAxisInput, yAxisInput);
  }
}
