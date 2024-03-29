import { Collider, RigidBody } from "@dimforge/rapier2d";
import { store } from "../../../../../pages/_app";
import { JSONValue } from "../../../../lib/netplayjs";
import { SET_CHARACTER_DATA } from "../../../../redux/actions";
import { normalize } from "../../../../utils/math";
import { GamepadInputResult, isGamePadInputResult, KeyboardMouseInputResult } from "../../../InputService/model/InputResult";
import { GAME_FRAMERATE } from "../../constants";
import { isBallObject } from "../../GameObject/GameObjectFactory/Ball";
import PulseCharacterObject from "../../GameObject/GameObjectFactory/PulseCharacterObject";
import { RepelGraphic } from "../../GameObject/GameObjectFactory/RepelGraphic";
import { Character, CharacterProps, INPUT_BUFFER_FRAMES, RESOURCE_GAIN_PER_FRAME } from "../Character";
import { CharacterType } from "../CharacterType";

const ATTRACT_COOLDOWN = 0
const ATTRACT_COST = 25 / GAME_FRAMERATE
const REPEL_COOLDOWN = 25
const REPEL_COST = 35
const FAILED_ABILITY_COOLDOWN = 20

const RESOURCE_FILL_TICK_RATE = 30

export interface PulseCharacterProps extends CharacterProps {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;
  RADIUS: number;

  x: number;
  y: number;
}

export class PulseCharacter extends Character {
  characterType: CharacterType = CharacterType.Pulse;

  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;
  RADIUS: number;

  pulseObject: PulseCharacterObject;
  mostRecentAttractFrame: number;
  mostRecentRepelFrame: number;
  repelBufferedFrame: number;
  mostRecentFailedAbilityFrame: number;

  constructor(props: PulseCharacterProps) {
    super({ player: props.player, scene: props.scene })

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
          characterType: this.characterType,
          playerIndex: this.player.playerIndex,
          netplayPlayerIndex: this.player.netplayPlayerIndex,
          teamIndex: this.player.teamIndex,
          gamepadIndex: this.player.gamepadIndex,
          inputConfig: this.player.inputConfig,
          resourceMeter: this.resourceMeter,
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
    if (frame % RESOURCE_FILL_TICK_RATE === RESOURCE_FILL_TICK_RATE - 1) {
      this.adjustResourceMeter(RESOURCE_GAIN_PER_FRAME * RESOURCE_FILL_TICK_RATE)
    }

    this.handleRepel(input, frame);
    this.handleAttract(input, frame);
  }

  serialize(): any {
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
    this.adjustResourceMeter(-ATTRACT_COST)

    this.scene.gameObjects.forEach(gameObject => {
      if (isBallObject(gameObject)) {
        const IMPULSE_DISTANCE = 1.5
        const IMPULSE_MAGNITUDE = 0.06
        const otherCollider = this.scene.world.getCollider(gameObject.colliderHandles[0]) // careful with these. Assuming 1 collider. Where is a gameObject's 'center of gravity'?
        const otherRigidBody = this.scene.world.getRigidBody(gameObject.rigidBodyHandles[0]) // careful with these
        const myCollider = this.scene.world.getCollider(this.pulseObject.colliderHandles[0])
        const xDiff = otherCollider.translation().x - myCollider.translation().x
        const yDiff = otherCollider.translation().y - myCollider.translation().y
        const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
        const closeness = Math.max(0, (IMPULSE_DISTANCE - distance) / IMPULSE_DISTANCE) // 0 to 1
        const closenessFactor = closeness === 0 ? 0 : (0.25 + closeness / 2) // 0.25 to 0.75 (or just 0)
        const normalizedDiff = normalize({ x: xDiff, y: yDiff })
        const impulseVector = {
          x: (-normalizedDiff.x * closenessFactor * IMPULSE_MAGNITUDE),
          y: (-normalizedDiff.y * closenessFactor * IMPULSE_MAGNITUDE),
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
        hasCooledDown &&
        (this.resourceMeter < REPEL_COST + (RESOURCE_GAIN_PER_FRAME * 2 * RESOURCE_FILL_TICK_RATE)) && // some tolerance for the common case where someone mashes the button just before they have enough
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

    const isRepelBuffered = this.repelBufferedFrame + INPUT_BUFFER_FRAMES > frame

    if ((didInputRepel || isRepelBuffered) && canPerformRepel) {
      this.doRepel(frame)
    }
  }

  doRepel(frame: number) {
    this.mostRecentRepelFrame = frame
    this.adjustResourceMeter(-REPEL_COST)
    const myCollider = this.scene?.world.getCollider(this.pulseObject.colliderHandles[0]) as Collider

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
        const IMPULSE_DISTANCE = 3
        const IMPULSE_MAGNITUDE = 3
        const otherCollider = this.scene.world.getCollider(gameObject.colliderHandles[0]) // careful with these
        const otherRigidBody = this.scene?.world.getRigidBody(gameObject.rigidBodyHandles[0]) // careful with these
        const xDiff = otherCollider.translation().x - myCollider.translation().x
        const yDiff = otherCollider.translation().y - myCollider.translation().y
        const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
        const closeness = Math.max(0, (IMPULSE_DISTANCE - distance) / IMPULSE_DISTANCE) // 0 to 1
        const normalizedDiff = normalize({ x: xDiff, y: yDiff })
        const impulseVector = {
          x: (normalizedDiff.x * closeness * IMPULSE_MAGNITUDE),
          y: (normalizedDiff.y * closeness * IMPULSE_MAGNITUDE),
        }
        otherRigidBody?.applyImpulse(impulseVector, true)
      }
    })
  }

  handleMovement(input: GamepadInputResult | KeyboardMouseInputResult) {

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
        xAxisInput *= Math.cos(Math.PI / 4)
        yAxisInput *= Math.sin(Math.PI / 4)
      }
    }


    const ACCELERATION_CONSTANT_X = 2.7;
    const ACCELERATION_CONSTANT_Y = 2.7;

    //const collider = this.scene?.world.getCollider(this.pulseObject.colliderHandle)
    const rigidBody = this.scene?.world.getRigidBody(this.pulseObject.rigidBodyHandles[0]) as RigidBody
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
