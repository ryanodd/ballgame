import { Collider, RigidBody } from "@dimforge/rapier2d";
import { store } from "../../../../../pages/_app";
import { JSONObject } from "../../../../lib/netplayjs";
import { SET_CHARACTER_DATA } from "../../../../redux/actions";
import { normalize } from "../../../../utils/math";
import { GamepadInputResult, isGamePadInputResult, KeyboardMouseInputResult } from "../../../InputService/model/InputResult";
import { isBallObject } from "../../GameObject/GameObjectFactory/Ball";
import PulseCharacterObject from "../../GameObject/GameObjectFactory/PulseCharacterObject";
import { RepelGraphic } from "../../GameObject/GameObjectFactory/RepelGraphic";
import { Character, CharacterProps, INPUT_BUFFER_FRAMES, RESOURCE_GAIN_PER_FRAME } from "../Character";

const ATTRACT_COOLDOWN = 0
const ATTRACT_COST = 9 / 60
const REPEL_COOLDOWN = 40
const REPEL_COST = 25
const FAILED_ABILITY_COOLDOWN = 60

export interface PulseCharacterProps extends CharacterProps {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;
  RADIUS: number;
  
  x: number;
  y: number;
}

export class PulseCharacter extends Character {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;
  RADIUS: number;

  pulseObject: PulseCharacterObject;
  mostRecentAttractFrame: number;
  mostRecentRepelFrame: number;
  repelBufferedFrame: number;
  mostRecentFailedAbilityFrame: number;

  constructor(props: PulseCharacterProps){
    super({player: props.player, scene: props.scene })

    this.DENSITY = props.DENSITY;
    this.FRICTION = props.FRICTION;
    this.RESTITUTION = props.RESTITUTION;
    this.RADIUS = props.RADIUS;
    this.mostRecentAttractFrame = -1
    // this.attractBuffered = false; // continuous input, not needed?
    this.mostRecentRepelFrame = -REPEL_COOLDOWN
    this.repelBufferedFrame = -INPUT_BUFFER_FRAMES;
    this.mostRecentFailedAbilityFrame = -FAILED_ABILITY_COOLDOWN;

    this.pulseObject = new PulseCharacterObject({
      scene: props.scene,
      playerIndex: this.player.playerIndex,
      physics: {
        x: props.x,
        y: props.y,
        r: this.RADIUS,
        density: this.DENSITY,
        friction: this.FRICTION,
        restitution: this.RESTITUTION,
      }
    });
    props.scene.addGameObject(this.pulseObject);

    store.dispatch({
      type: SET_CHARACTER_DATA,
      payload: {
        playerIndex: this.player.playerIndex,
        characterData: {
          playerIndex: this.player.playerIndex,
          netplayPlayerIndex: this.player.netplayPlayerIndex,
          teamIndex: this.player.teamIndex,
          gamepadIndex: this.player.gamepadIndex,
          inputConfig: this.player.inputConfig,
          mostRecentFailedAbilityFrame: this.mostRecentFailedAbilityFrame,
        }
      }
    })
  }

  tickMovement(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) { 
    this.handleMovement(input);
  }

  // Detect input, do stuff
  tickAbilities(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    const FILL_TICK_RATE = 60
    if (frame % FILL_TICK_RATE === FILL_TICK_RATE - 1) {
      this.resourceMeter = Math.min(this.resourceMeter + (RESOURCE_GAIN_PER_FRAME*FILL_TICK_RATE), 100)
    }

    this.handleRepel(input, frame);
    this.handleAttract(input, frame);
    store.dispatch({
      type: SET_CHARACTER_DATA,
      payload: {
        playerIndex: this.player.playerIndex,
        characterData: {
          resourceMeter: this.resourceMeter,
        }
      }
    })
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      mostRecentAttractFrame: this.mostRecentAttractFrame,
      mostRecentRepelFrame: this.mostRecentRepelFrame,
      repelBuffered: this.repelBufferedFrame,
    }
  }

  deserialize(value: any): void {
    super.deserialize(value)
    this.mostRecentAttractFrame = value['mostRecentAttractFrame']
    this.mostRecentRepelFrame = value['mostRecentRepelFrame']
    this.repelBufferedFrame = value['repelBufferedFrame']
  }

  handleAttract(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    const canPerformAttract = (
      (frame >= this.mostRecentAttractFrame + ATTRACT_COOLDOWN) &&
      (this.resourceMeter >= ATTRACT_COST)
    )
    const didInputAttract = (
      (isGamePadInputResult(input) && input.button1) ||
      (!isGamePadInputResult(input) && input.button1)
    )

    if (didInputAttract) {
      if (canPerformAttract) {
        this.doAttract(frame)
      }
    }
  }

  doAttract(frame: number) {
    this.mostRecentAttractFrame = frame
    this.resourceMeter -= ATTRACT_COST

    this.scene.gameObjects.forEach(gameObject => {
      if (isBallObject(gameObject)) {
        const IMPULSE_DISTANCE = 2.5
        const IMPULSE_MAGNITUDE = 0.1
        const otherCollider = this.scene.world.getCollider(gameObject.colliderHandle)
        const otherRigidBody = this.scene.world.getRigidBody(gameObject.rigidBodyHandle)
        const myCollider = this.scene.world.getCollider(this.pulseObject.colliderHandle)
        const xDiff = otherCollider.translation().x - myCollider.translation().x
        const yDiff = otherCollider.translation().y - myCollider.translation().y
        const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
        const closeness = Math.max(0, (IMPULSE_DISTANCE - distance)/IMPULSE_DISTANCE) // 0 to 1
        const normalizedDiff = normalize({ x: xDiff, y: yDiff })
        const impulseVector = {
          x: (-normalizedDiff.x * (0.25 + closeness/2) * IMPULSE_MAGNITUDE),
          y: (-normalizedDiff.y * (0.25 + closeness/2) * IMPULSE_MAGNITUDE),
        }
        otherRigidBody.applyImpulse(impulseVector, true)
      }
    })
  }
  
  handleRepel(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    const hasCooledDown = (frame >= this.mostRecentRepelFrame + REPEL_COOLDOWN)
    const hasEnoughResource = (this.resourceMeter >= REPEL_COST)
    const canPerformRepel = hasCooledDown && hasEnoughResource
    const didInputRepel = (
      (isGamePadInputResult(input) && input.button2) ||
      (!isGamePadInputResult(input) && input.button2)
    )

    if (didInputRepel && !canPerformRepel) {
      this.repelBufferedFrame = frame
      if (
        hasCooledDown && !hasEnoughResource &&
        (frame >= this.mostRecentFailedAbilityFrame + FAILED_ABILITY_COOLDOWN)
      ) {
        this.mostRecentFailedAbilityFrame = frame
        store.dispatch({
          type: SET_CHARACTER_DATA,
          payload: {
            playerIndex: this.player.playerIndex,
            characterData: {
              mostRecentFailedAbilityFrame: this.mostRecentFailedAbilityFrame,
            }
          } 
        })
      }
    }

    const isRepelBuffered = this.repelBufferedFrame + INPUT_BUFFER_FRAMES >= frame

    if ((didInputRepel || isRepelBuffered) && canPerformRepel) {
      this.doRepel(frame)
    }
  }

  doRepel(frame: number) {
    this.mostRecentRepelFrame = frame
    this.resourceMeter -= REPEL_COST
    const myCollider = this.scene?.world.getCollider(this.pulseObject?.colliderHandle) as Collider

    this.scene.addGameObject(new RepelGraphic({
      scene: this.scene,
      spawnFrame: frame,
      physics: {
        x: myCollider.translation().x,
        y: myCollider.translation().y,
      }
    }))

    this.scene?.gameObjects.forEach(gameObject => {
      if (isBallObject(gameObject)) {
        const IMPULSE_DISTANCE = 4
        const IMPULSE_MAGNITUDE = 7
        const otherCollider = this.scene.world.getCollider(gameObject.colliderHandle) as Collider
        const otherRigidBody = this.scene?.world.getRigidBody(gameObject.rigidBodyHandle) as RigidBody
        const xDiff = otherCollider.translation().x - myCollider.translation().x
        const yDiff = otherCollider.translation().y - myCollider.translation().y
        const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
        const closeness = Math.max(0, (IMPULSE_DISTANCE - distance)/IMPULSE_DISTANCE) // 0 to 1
        const normalizedDiff = normalize({ x: xDiff, y: yDiff })
        const impulseVector = {
          x: (normalizedDiff.x * closeness * IMPULSE_MAGNITUDE),
          y: (normalizedDiff.y * closeness * IMPULSE_MAGNITUDE),
        }
        otherRigidBody?.applyImpulse(impulseVector, true)
      }
    })
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
