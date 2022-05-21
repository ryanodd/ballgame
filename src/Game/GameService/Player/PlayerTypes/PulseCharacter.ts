import { Collider, RigidBody } from "@dimforge/rapier2d";
import { timeStamp } from "console";
import { JSONObject } from "../../../../lib/netplayjs";
import { normalize } from "../../../../utils/math";
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

  pulseObject: PulseCharacterObject | null;
  mostRecentPulseFrame: number;
  pulseBuffered: boolean;

  constructor(props: PulseCharacterProps){
    super({player: props.player})

    this.DENSITY = props.DENSITY;
    this.FRICTION = props.FRICTION;
    this.RESTITUTION = props.RESTITUTION;
    this.RADIUS = props.RADIUS;

    this.pulseObject = null;
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
          // TODO only affect ball.
          if (
            gameObject.colliderHandle !== null &&
            gameObject.rigidBodyHandle !== null &&
            this.pulseObject !== null &&
            gameObject.colliderHandle !== this.pulseObject?.colliderHandle
          ) {
            const otherCollider = this.scene?.world.getCollider(gameObject.colliderHandle) as Collider
            const otherRigidBody = this.scene?.world.getRigidBody(gameObject.rigidBodyHandle) as RigidBody
            const myCollider = this.scene?.world.getCollider(this.pulseObject?.colliderHandle) as Collider
            const IMPULSE_DISTANCE = 4
            const IMPULSE_MAGNITUDE = 8
            const xDiff = otherCollider.translation().x - myCollider.translation().x
            const yDiff = otherCollider.translation().y - myCollider.translation().y
            const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
            console.log(xDiff)
            console.log(yDiff)
            const closeness = Math.max(0, (IMPULSE_DISTANCE - distance)/IMPULSE_DISTANCE) // 0 to 1
            const normalizedDiff = normalize({ x: xDiff, y: yDiff })
            const impulseVector = {
              x: (normalizedDiff.x * closeness * IMPULSE_MAGNITUDE),
              y: (normalizedDiff.y * closeness * IMPULSE_MAGNITUDE),
            }
            console.log(impulseVector.x)
            console.log(impulseVector.y)
            otherRigidBody?.applyImpulse(impulseVector, true)
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
