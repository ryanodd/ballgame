import { store } from "../../../../pages/_app";
import { JSONObject, JSONValue } from "../../../lib/netplayjs";
import { SET_CHARACTER_DATA } from "../../../redux/actions";
import { GamepadInputResult, KeyboardMouseInputResult } from "../../InputService/model/InputResult";
import { GAME_FRAMERATE } from "../constants";
import { MyInput } from "../netplayjs/MyInput";
import { Scene } from "../Scene/Scene";
import { CharacterType } from "./CharacterType";
import { Player } from "./Player";

export const INPUT_BUFFER_FRAMES = 5
export const RESOURCE_GAIN_PER_FRAME = 10 / GAME_FRAMERATE

export interface CharacterProps {
  player: Player;
  scene: Scene;
}

export abstract class Character {
  abstract characterType: CharacterType;
  resourceMeter: number;
  scene: Scene;
  player: Player;

  // 101 for rounding issues. I want fractional costs like 1/3 which is 33.33
  // So we'll use 101 and round down for displaying.
  // This is a character-wide rule for now.
  RESOURCE_METER_MAXIMUM = 100;
  RESOURCE_METER_BEGIN = 40;

  constructor(props: CharacterProps) {
    this.resourceMeter = this.RESOURCE_METER_BEGIN;
    this.scene = props.scene
    this.player = props.player
    props.player.setCharacter(this)
  }

  // Detect input, do stuff
  abstract tickMovement(input: GamepadInputResult | KeyboardMouseInputResult, frame: number): void
  abstract tickAbilities(input: GamepadInputResult | KeyboardMouseInputResult, frame: number): void

  serialize(): any {
    return {
      resourceMeter: this.resourceMeter,
    }
  }

  deserialize(value: any) {
    this.resourceMeter = value['resourceMeter']
  }

  adjustResourceMeter(adjustmentValue: number) {
    const newValue = Math.min(this.resourceMeter+adjustmentValue, this.RESOURCE_METER_MAXIMUM);
    this.resourceMeter = Math.max(0, newValue);
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
}
