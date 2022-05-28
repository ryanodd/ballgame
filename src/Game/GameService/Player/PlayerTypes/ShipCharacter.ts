import { store } from "../../../../../pages/_app";
import { SET_CHARACTER_DATA } from "../../../../redux/actions";
import { normalize } from "../../../../utils/math";
import { GamepadInputResult, isGamePadInputResult, KeyboardMouseInputResult } from "../../../InputService/model/InputResult";
import ShipCharacterObject from "../../GameObject/GameObjectFactory/ShipCharacterObject";
import { Character, CharacterProps, RESOURCE_GAIN_PER_FRAME } from "../Character";

// const ATTRACT_COOLDOWN = 0
// const ATTRACT_COST = 20 / 60
// const REPEL_COOLDOWN = 25
// const REPEL_COST = 40
const FAILED_ABILITY_COOLDOWN = 20

const RESOURCE_FILL_TICK_RATE = 30

export interface ShipCharacterProps extends CharacterProps {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;

  HALF_WIDTH: number;
  HALF_LENGTH: number;
  NOSE_WIDTH: number;
  TAIL_LENGTH: number;

  x: number;
  y: number;
}

export class ShipCharacter extends Character {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;

  HALF_WIDTH: number;
  HALF_LENGTH: number;
  NOSE_WIDTH: number;
  TAIL_LENGTH: number;

  shipObject: ShipCharacterObject;
  mostRecentFailedAbilityFrame: number;

  constructor(props: ShipCharacterProps) {
    super({ player: props.player, scene: props.scene })

    this.DENSITY = props.DENSITY;
    this.FRICTION = props.FRICTION;
    this.RESTITUTION = props.RESTITUTION;
    this.HALF_WIDTH = props.HALF_WIDTH;
    this.HALF_LENGTH = props.HALF_LENGTH;
    this.NOSE_WIDTH = props.NOSE_WIDTH;
    this.TAIL_LENGTH = props.TAIL_LENGTH;

    // this.mostRecentAttractFrame = -1
    // // this.attractBuffered = false; // continuous input, not needed?
    // this.mostRecentRepelFrame = -REPEL_COOLDOWN
    // this.repelBufferedFrame = -INPUT_BUFFER_FRAMES;
    this.mostRecentFailedAbilityFrame = -FAILED_ABILITY_COOLDOWN;

    this.shipObject = new ShipCharacterObject({
      scene: props.scene,
      playerIndex: this.player.playerIndex,
      physics: {
        x: props.x,
        y: props.y,
        halfWidth: props.HALF_WIDTH,
        halfLength: props.HALF_LENGTH,
        noseWidth: props.NOSE_WIDTH,
        tailLength: props.TAIL_LENGTH,
        density: this.DENSITY,
        friction: this.FRICTION,
        restitution: this.RESTITUTION,
      }
    });
    props.scene.addGameObject(this.shipObject);

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
      this.resourceMeter = Math.min(this.resourceMeter + (RESOURCE_GAIN_PER_FRAME * RESOURCE_FILL_TICK_RATE), 100)
    }

    // this.handleRepel(input, frame);
    // this.handleAttract(input, frame);
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

  serialize(): any {
    return {
      ...super.serialize(),
    }
  }

  deserialize(value: any): void {
    super.deserialize(value)
  }

  handleMovement(input: GamepadInputResult | KeyboardMouseInputResult) {

    const ROTATION_SPEED = Math.PI / 250 // is this being related to pi even a thing

    let rotationLeftForce = 0
    let rotationRightForce = 0

    const rigidBody = this.scene.world.getRigidBody(this.shipObject.rigidBodyHandles[0])
    const velocity = rigidBody.linvel()
    const angularVelocity = rigidBody.angvel()
    const rotation = rigidBody.rotation()

    if (isGamePadInputResult(input)) {
      // rotationLeftForce = input.leftStickXAxis;
      // rotationRightForce = input.leftStickYAxis;
    }
    else {
      rotationLeftForce = input.buttonRotateLeft ? ROTATION_SPEED : 0;
      rotationRightForce = input.buttonRotateRight ? ROTATION_SPEED : 0;
    }

    let angularForce = rotationLeftForce - rotationRightForce
    angularForce -= (angularVelocity / 400) // How does this work... If the subtraction isn't enough it spirals, but if the subtraction is low enough it doesn't matter what we subtract

    rigidBody.applyTorqueImpulse(angularForce, true)

    const ACCELERATION_CONSTANT = 0.013

    let thrustFactor = isGamePadInputResult(input) ? input.rightTriggerAxis : (input.buttonUp ? 1 : 0)
    thrustFactor *= ACCELERATION_CONSTANT
    const thrustImpulse = {
      x: (thrustFactor * -Math.sin(rotation)) - (velocity.x/1000),
      y: thrustFactor * Math.cos(rotation) - (velocity.y/1000)}  
    rigidBody.applyImpulse(thrustImpulse, true)
  }
}
