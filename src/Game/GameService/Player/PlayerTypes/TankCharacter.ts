import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";
import { store } from "../../../../../pages/_app";
import { SET_CHARACTER_DATA } from "../../../../redux/actions";
import { normalize } from "../../../../utils/math";
import { GamepadInputResult, isGamePadInputResult, KeyboardMouseInputResult } from "../../../InputService/model/InputResult";
import { GAME_FRAMERATE } from "../../constants";
import TankCharacterObject from "../../GameObject/GameObjectFactory/TankCharacterObject";
import { Character, CharacterProps, RESOURCE_GAIN_PER_FRAME } from "../Character";
import { CharacterType } from "../CharacterType";

// const THRUST_COST = 8 / GAME_FRAMERATE
// export const BULLET_COOLDOWN = 16
// export const BULLET_COST = 15
// const FAILED_ABILITY_COOLDOWN = 20

const RESOURCE_FILL_TICK_RATE = GAME_FRAMERATE / 2

export interface TankCharacterProps extends CharacterProps {
  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;

  HALF_WIDTH: number;
  HALF_LENGTH: number;
  // NOSE_WIDTH: number;
  // TAIL_LENGTH: number;

  x: number;
  y: number;
}

export class TankCharacter extends Character {
  characterType: CharacterType = CharacterType.Tank;

  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;

  HALF_WIDTH: number;
  HALF_LENGTH: number;

  TankObject: TankCharacterObject;

  constructor(props: TankCharacterProps) {
    super({ player: props.player, scene: props.scene })

    this.DENSITY = props.DENSITY;
    this.FRICTION = props.FRICTION;
    this.RESTITUTION = props.RESTITUTION;

    this.HALF_WIDTH = props.HALF_WIDTH;
    this.HALF_LENGTH = props.HALF_LENGTH;

    // this.mostRecentBulletFrame = -BULLET_COOLDOWN
    // this.mostRecentFailedAbilityFrame = -FAILED_ABILITY_COOLDOWN
    // this.mostRecentThrustFrame = -1

    this.TankObject = new TankCharacterObject({
      scene: props.scene,
      playerIndex: this.player.playerIndex,
      physics: {
        x: props.x,
        y: props.y,
        density: this.DENSITY,
        friction: this.FRICTION,
        restitution: this.RESTITUTION,
        halfWidth: this.HALF_WIDTH,
        halfLength: this.HALF_LENGTH,
      }
    });
    props.scene.addGameObject(this.TankObject);

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
          // mostRecentFailedAbilityFrame: this.mostRecentFailedAbilityFrame,
        }
      }
    })
  }

  tickMovement(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    this.handleMovement(input, frame);
  }

  // Detect input, do stuff
  tickAbilities(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    if (frame % RESOURCE_FILL_TICK_RATE === RESOURCE_FILL_TICK_RATE - 1) {
      this.adjustResourceMeter(RESOURCE_GAIN_PER_FRAME * RESOURCE_FILL_TICK_RATE)
    }

    // this.handleRepel(input, frame);
    // this.handleAttract(input, frame);
  }

  serialize(): any {
    return {
      ...super.serialize(),
      // mostRecentBulletFrame: this.mostRecentBulletFrame,
      // mostRecentThrustFrame: this.mostRecentThrustFrame,
    }
  }

  deserialize(value: any): void {
    super.deserialize(value)
    // this.mostRecentBulletFrame = value['mostRecentBulletFrame']
    // this.mostRecentThrustFrame = value['mostRecentThrustFrame']
  }

  handleMovement(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {

    const ROTATION_SPEED = Math.PI / 60 // is this being related to pi even a thing
    const ROTATION_SPEED_DAMPING_FACTOR = 1/70

    let rotationLeftForce = 0
    let rotationRightForce = 0

    const DRIVE_SPEED = 0.1
    let driveForce = 0

    const rigidBody = this.scene.world.getRigidBody(this.TankObject.rigidBodyHandles[0])
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
      driveForce = input.buttonUp ? DRIVE_SPEED : 0;
    }

    let angularForce = rotationLeftForce - rotationRightForce
    angularForce -= (angularVelocity * ROTATION_SPEED_DAMPING_FACTOR) // How does this work... If the subtraction isn't enough it spirals, but if the subtraction is low enough it doesn't matter what we subtract

    rigidBody.applyTorqueImpulse(angularForce, true)

    const ACCELERATION_DAMPING_FACTOR = 1 //not used
    const thrustImpulse = {
      x: -Math.sin(rotation) * driveForce,
      y: Math.cos(rotation) * driveForce,
    }  
    rigidBody.applyImpulse(thrustImpulse, true)
  }
}
