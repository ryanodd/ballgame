import { store } from "../../../../../pages/_app";
import { SET_CHARACTER_DATA } from "../../../../redux/actions";
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

    let xAxisInput = 0
    let yAxisInput = 0

    if (isGamePadInputResult(input)) {
      xAxisInput = input.leftStickXAxis;
      yAxisInput = input.leftStickYAxis;
    }


    const ACCELERATION_CONSTANT_X = 4.5;
    const ACCELERATION_CONSTANT_Y = 4.5;
  }
}
