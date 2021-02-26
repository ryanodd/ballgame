import { InputConfig, GamepadInputMapping } from './model/InputConfig';
import { InputResult, PlayerInputResult } from './model/InputResult';
import { defaultInputConfig } from './contants/InputConfigDefaults';
import { noInputResult } from './contants/noInputResult';
import { LogService } from '../LogService/LogService';

export default class InputService {
  config: InputConfig;

  constructor(){
    this.config = defaultInputConfig;
  }

  getInput(): InputResult {
    const gamepads = navigator.getGamepads() as Gamepad[];
    const primaryPlayerInput = this.getPlayerInput(gamepads, this.config.primaryPlayerGamepadIndex, this.config.primaryPlayerInputMapping);
    if (!primaryPlayerInput) return noInputResult;
    const inputResult: InputResult = {
      primaryPlayerInput: primaryPlayerInput
    }
    return inputResult
  }

  getPlayerInput(gamepads: Gamepad[], gamepadIndex: number, mapping: GamepadInputMapping): PlayerInputResult | undefined {
    const gamepad: Gamepad = gamepads[gamepadIndex];

    if (!gamepad) {
      return
    }

    const leftStickMagnitude = Math.sqrt(Math.pow(Math.abs(gamepad.axes[mapping.leftStickXAxisIndex]), 2) + Math.pow(Math.abs(gamepad.axes[mapping.leftStickYAxisIndex]), 2));
    const rightStickMagnitude = Math.sqrt(Math.pow(Math.abs(gamepad.axes[mapping.rightStickXAxisIndex]), 2) + Math.pow(Math.abs(gamepad.axes[mapping.rightStickYAxisIndex]), 2));

    const isLeftStickDeadzoned = leftStickMagnitude < this.config.primaryPlayerLeftStickDeadzone;
    const isRightStickDeadzoned = rightStickMagnitude < this.config.primaryPlayerRightStickDeadzone;

    const detectedInput: PlayerInputResult = {
      button1: gamepad.buttons[mapping.button1Index].pressed,
      button2: gamepad.buttons[mapping.button2Index].pressed,
      button3: gamepad.buttons[mapping.button3Index].pressed,
      button4: gamepad.buttons[mapping.button4Index].pressed,
    
      leftStickXAxis: isLeftStickDeadzoned ? 0 : gamepad.axes[mapping.leftStickXAxisIndex],
      leftStickYAxis: isLeftStickDeadzoned ? 0 : -gamepad.axes[mapping.leftStickYAxisIndex],
      rightStickXAxis: isRightStickDeadzoned ? 0 : gamepad.axes[mapping.rightStickXAxisIndex],
      rightStickYAxis: isRightStickDeadzoned ? 0 : -gamepad.axes[mapping.rightStickYAxisIndex],
    
      // Support button style trigger?
      leftTriggerAxis: gamepad.axes[mapping.leftTriggerAxisIndex],
      rightTriggerAxis: gamepad.axes[mapping.rightTriggerAxisIndex],
    }
    return detectedInput;
  }
}
