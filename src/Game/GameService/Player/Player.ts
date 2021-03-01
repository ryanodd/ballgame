import { defaultInputConfig } from "@/Game/InputService/contants/InputConfigDefaults";
import { InputService } from "@/Game/InputService/InputService";
import { GamepadInputResult, KeyboardMouseInputResult } from "@/Game/InputService/model/InputResult";
import { VueService } from "@/Game/VueService/VueService";
import { Scene } from "../Scene/Scene";

export interface PlayerProps {
  playerIndex: number;
  gamepadIndex: number;
}

export abstract class Player {
  playerIndex: number;
  gamepadIndex: number;
  resourceMeter: number;
  
  // 101 for rounding issues. I want fractional costs like 1/3 which is 33.33
  // So we'll use 101 and round down for displaying.
  // This is a character-wide rule for now.
  RESOURCE_METER_MAXIMUM = 101;
  RESOURCE_METER_BEGIN = 50;
  

  constructor(props: PlayerProps){
    this.playerIndex = props.playerIndex;
    this.gamepadIndex = props.gamepadIndex;
    this.resourceMeter = this.RESOURCE_METER_BEGIN;
  }

  abstract createObjects(scene: Scene, x: number, y: number);
  // Detect input, do stuff
  abstract tick();

  getInput(): GamepadInputResult | KeyboardMouseInputResult{
    // TODO if (this.gamepadIndex === -1) get keyboard & mouse 
    return InputService.getGamepadInput(this.gamepadIndex, defaultInputConfig); // TODO store input config in.... ConfigService? or Player.. 
  }

  setResourceMeter(value: number){
    const newValue = Math.max(value, this.RESOURCE_METER_MAXIMUM);

    VueService.primaryPlayerResourceMeter = newValue; // the frontend service plants its dirty fingers everywhere
    this.resourceMeter = newValue;
  }
}