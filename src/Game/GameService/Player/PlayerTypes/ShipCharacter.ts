import { store } from "../../../../../pages/_app";
import { SET_CHARACTER_DATA } from "../../../../redux/actions";
import { normalize } from "../../../../utils/math";
import { GamepadInputResult, isGamePadInputResult, KeyboardMouseInputResult } from "../../../InputService/model/InputResult";
import { GAME_FRAMERATE } from "../../constants";
import ShipBullet from "../../GameObject/GameObjectFactory/ShipBullet";
import ShipCharacterObject from "../../GameObject/GameObjectFactory/ShipCharacterObject";
import { Character, CharacterProps, RESOURCE_GAIN_PER_FRAME } from "../Character";
import { CharacterType } from "../CharacterType";

const THRUST_COST = 8 / GAME_FRAMERATE
export const BULLET_COOLDOWN = 16
export const BULLET_COST = 15
const FAILED_ABILITY_COOLDOWN = 20

const RESOURCE_FILL_TICK_RATE = GAME_FRAMERATE / 2

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
  characterType: CharacterType = CharacterType.Ship;

  DENSITY: number;
  FRICTION: number;
  RESTITUTION: number;

  HALF_WIDTH: number;
  HALF_LENGTH: number;
  NOSE_WIDTH: number;
  TAIL_LENGTH: number;

  shipObject: ShipCharacterObject;
  mostRecentFailedAbilityFrame: number;
  mostRecentBulletFrame: number;
  mostRecentThrustFrame: number;

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
    this.mostRecentBulletFrame = -BULLET_COOLDOWN
    this.mostRecentFailedAbilityFrame = -FAILED_ABILITY_COOLDOWN
    this.mostRecentThrustFrame = -1

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
    this.handleMovement(input, frame);
  }

  // Detect input, do stuff
  tickAbilities(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    if (frame % RESOURCE_FILL_TICK_RATE === RESOURCE_FILL_TICK_RATE - 1) {
      this.adjustResourceMeter(RESOURCE_GAIN_PER_FRAME * RESOURCE_FILL_TICK_RATE)
    }

    // this.handleRepel(input, frame);
    // this.handleAttract(input, frame);
    this.handleThrust(input, frame)
    this.handleBullet(input, frame)
  }

  serialize(): any {
    return {
      ...super.serialize(),
      mostRecentBulletFrame: this.mostRecentBulletFrame,
      mostRecentThrustFrame: this.mostRecentThrustFrame,
    }
  }

  deserialize(value: any): void {
    super.deserialize(value)
    this.mostRecentBulletFrame = value['mostRecentBulletFrame']
    this.mostRecentThrustFrame = value['mostRecentThrustFrame']
  }

  handleThrust(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    const canPerformAttract = (
      (this.resourceMeter >= THRUST_COST)
    )
    const didInputThrust = (
      (isGamePadInputResult(input) && input.rightTriggerAxis > 0) ||
      (!isGamePadInputResult(input) && input.buttonUp) 
    )

    if (didInputThrust) {
      if (canPerformAttract) {
        this.doThrust(frame)
      }
    }
  }

  doThrust(frame: number) {
    this.mostRecentThrustFrame = frame
    this.adjustResourceMeter(-THRUST_COST)

    const rigidBody = this.scene.world.getRigidBody(this.shipObject.rigidBodyHandles[0])
    const velocity = rigidBody.linvel()
    const rotation = rigidBody.rotation()

    const ACCELERATION_CONSTANT = 0.04
    const ACCELERATION_DAMPING_FACTOR = 1/200
    
    const thrustImpulse = {
      x: (ACCELERATION_CONSTANT * -Math.sin(rotation)) - (velocity.x*ACCELERATION_DAMPING_FACTOR),
      y: ACCELERATION_CONSTANT * Math.cos(rotation) - (velocity.y*ACCELERATION_DAMPING_FACTOR)
    }  
    rigidBody.applyImpulse(thrustImpulse, true)
  }


  handleBullet(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {
    const hasCooledDown = (frame >= this.mostRecentBulletFrame + BULLET_COOLDOWN)
    const hasEnoughResource = (this.resourceMeter >= BULLET_COST)
    const canPerformRepel = hasCooledDown && hasEnoughResource
    const didInputBullet = (
      (isGamePadInputResult(input) && input.button1) ||
      (!isGamePadInputResult(input) && input.button1)
    )

    // FAIL ANIMATION
    // if (didInputRepel && !canPerformRepel) {
    //   if (
    //     hasCooledDown &&
    //     (this.resourceMeter < BULLET_COST + (RESOURCE_GAIN_PER_FRAME * 2 * RESOURCE_FILL_TICK_RATE)) && // some tolerance for the common case where someone mashes the button just before they have enough
    //     (frame >= this.mostRecentFailedAbilityFrame + FAILED_ABILITY_COOLDOWN)
    //   ) {
    //     this.mostRecentFailedAbilityFrame = frame
    //     store.dispatch({
    //       type: SET_CHARACTER_DATA,
    //       payload: {
    //         playerIndex: this.player.playerIndex,
    //         characterData: {
    //           mostRecentFailedAbilityFrame: this.mostRecentFailedAbilityFrame,
    //         }
    //       }
    //     })
    //   }
    // }

    if ((didInputBullet) && canPerformRepel) {
      this.doBullet(frame)
    }
  }

  doBullet(frame: number) {
    this.mostRecentBulletFrame = frame
    this.adjustResourceMeter(-BULLET_COST)
    const myCollider = this.scene.world.getCollider(this.shipObject.colliderHandles[0])
    const myRigidBody = this.scene.world.getRigidBody(this.shipObject.rigidBodyHandles[0])
    const rotation = myCollider.rotation()


    const BULLET_RADIUS = 0.125
    const DISTANCE_FROM_SHIP_CENTER = 0.35 + BULLET_RADIUS + 0.01
    const shipNoseTranslation = {
      x: -Math.sin(rotation) * DISTANCE_FROM_SHIP_CENTER,
      y: Math.cos(rotation) * DISTANCE_FROM_SHIP_CENTER,
    }

    const SPEED = 20
    const initialVeloicty = {
      x: shipNoseTranslation.x*SPEED + myRigidBody.linvel().x,
      y: shipNoseTranslation.y*SPEED + myRigidBody.linvel().y
    }

    const RECOIL_FACTOR = 0.4
    myRigidBody.applyImpulse({
      x: -shipNoseTranslation.x*RECOIL_FACTOR,
      y: -shipNoseTranslation.y*RECOIL_FACTOR,
    }, true)
      //.setCollisionGroups(CollisionGroups.WALLS)

    this.scene.addGameObject(new ShipBullet({
      scene: this.scene,
      spawnFrame: frame,
      physics: {
        x: myCollider.translation().x + shipNoseTranslation.x,
        y: myCollider.translation().y + shipNoseTranslation.y,
        radius: BULLET_RADIUS,
        initialVeloicty,
      }
    }))
  }

  handleMovement(input: GamepadInputResult | KeyboardMouseInputResult, frame: number) {

    const ROTATION_SPEED = Math.PI / 60 // is this being related to pi even a thing
    const ROTATION_SPEED_DAMPING_FACTOR = 1/70

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
    angularForce -= (angularVelocity * ROTATION_SPEED_DAMPING_FACTOR) // How does this work... If the subtraction isn't enough it spirals, but if the subtraction is low enough it doesn't matter what we subtract

    rigidBody.applyTorqueImpulse(angularForce, true)
  }
}
