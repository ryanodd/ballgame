import { defaultInputConfig } from "../../InputService/contants/InputConfigDefaults";
import { InputService } from "../../InputService/InputService";
import { InputConfig } from "../../InputService/model/InputConfig";
import { GamepadInputResult, KeyboardMouseInputResult } from "../../InputService/model/InputResult";
import { MyInput } from "../netplayjs/MyInput";
import { Character } from "./Character";

export interface PlayerProps {
  playerIndex: number;
  netplayPlayerIndex?: number;
  gamepadIndex: number;
  inputConfig?: InputConfig;
}

// A Player is everything that needs to be stored/done per-player.
export class Player {
  playerIndex: number; // in-game player e.g. "Player 1"
  character: Character | null = null;
  netplayPlayerIndex?: number; // client index
  gamepadIndex?: number; // index in the browser's 'GamePad' interface
  inputConfig?: InputConfig;

  constructor(props: PlayerProps){
    this.playerIndex = props.playerIndex;
    this.netplayPlayerIndex = props.netplayPlayerIndex;
    this.gamepadIndex = props.gamepadIndex;
    this.inputConfig = props.inputConfig;
  }
  
  // Detect input, do stuff
  tick(input: MyInput, frame: number) {
    this.character?.tick(this.getInput(input), frame)
    // VueService.setPlayerResourceMeter(this.playerIndex, this.character.resourceMeter); // the frontend service plants its dirty fingers everywhere
  }

  getInput(input: MyInput): GamepadInputResult | KeyboardMouseInputResult{
    if (this.gamepadIndex === -1) {
      return InputService.getKeyboardMouseInput(input, this.inputConfig ?? defaultInputConfig)
    } 
    return InputService.getGamepadInput(input, this.gamepadIndex, this.inputConfig ?? defaultInputConfig); 
  }

  setCharacter(character: Character | null) {
    this.character = character
  }
}
