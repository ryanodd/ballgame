import { defaultInputConfig } from "@/Game/InputService/contants/InputConfigDefaults";
import { InputService } from "@/Game/InputService/InputService";
import { InputConfig } from "@/Game/InputService/model/InputConfig";
import { GamepadInputResult, KeyboardMouseInputResult } from "@/Game/InputService/model/InputResult";
import { VueService } from "@/Game/VueService/VueService";
import { JSONValue, NetplayPlayer } from "@/lib/netplayjs";
import { MyInput } from "../netplayjs/MyInput";
import { Scene } from "../Scene/Scene";
import { Player } from "./Player";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CharacterProps {
  player: Player;
}

export abstract class Character {
  resourceMeter: number;
  
  // 101 for rounding issues. I want fractional costs like 1/3 which is 33.33
  // So we'll use 101 and round down for displaying.
  // This is a character-wide rule for now.
  RESOURCE_METER_MAXIMUM = 101;
  RESOURCE_METER_BEGIN = 50;
  

  constructor(props: CharacterProps){
    this.resourceMeter = this.RESOURCE_METER_BEGIN;
    props.player.setCharacter(this)
  }

  abstract createObjects(scene: Scene, x: number, y: number);
  
  // Detect input, do stuff
  abstract tick(input: GamepadInputResult | KeyboardMouseInputResult): void

  serialize(): JSONValue {
    return {
      resourceMeter: this.resourceMeter,
    }
  }

  deserialize(value: JSONValue) {
    this.resourceMeter = value['resourceMeter']
  }

  setResourceMeter(value: number){
    const newValue = Math.min(value, this.RESOURCE_METER_MAXIMUM);
    this.resourceMeter = newValue;
  }
}
