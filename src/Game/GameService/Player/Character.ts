import { JSONObject } from "../../../lib/netplayjs";
import { GamepadInputResult, KeyboardMouseInputResult } from "../../InputService/model/InputResult";
import { MyInput } from "../netplayjs/MyInput";
import { Scene } from "../Scene/Scene";
import { Player } from "./Player";

export const INPUT_BUFFER_FRAMES = 10
export const RESOURCE_GAIN_PER_FRAME = 6 / 60

export interface CharacterProps {
  player: Player;
  scene: Scene;
}

export abstract class Character {
  resourceMeter: number;
  scene: Scene;
  player: Player;
  
  // 101 for rounding issues. I want fractional costs like 1/3 which is 33.33
  // So we'll use 101 and round down for displaying.
  // This is a character-wide rule for now.
  RESOURCE_METER_MAXIMUM = 100;
  RESOURCE_METER_BEGIN = 40;

  constructor(props: CharacterProps){
    this.resourceMeter = this.RESOURCE_METER_BEGIN;
    this.scene = props.scene
    this.player = props.player
    props.player.setCharacter(this)
  }
  
  // Detect input, do stuff
  abstract tickMovement(input: GamepadInputResult | KeyboardMouseInputResult, frame: number): void
  abstract tickAbilities(input: GamepadInputResult | KeyboardMouseInputResult, frame: number): void

  serialize(): JSONObject {
    return {
      resourceMeter: this.resourceMeter,
    }
  }

  deserialize(value: JSONObject) {
    this.resourceMeter = value['resourceMeter']
  }

  setResourceMeter(value: number){
    const newValue = Math.min(value, this.RESOURCE_METER_MAXIMUM);
    this.resourceMeter = newValue;
  }
}
