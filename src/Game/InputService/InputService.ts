import { InputConfig, GamepadInputMapping } from './model/InputConfig';
import { GamepadInputResult, KeyboardMouseInputResult } from './model/InputResult';
import { defaultInputConfig } from './contants/InputConfigDefaults';
import { LogService } from '../LogService/LogService';
import { gamepadNoInputResult, keyboardMouseNoInputResult } from './contants/noInputResult';

export class InputServiceImplementation {
  constructor(){
  }

  getGamepadInput(gamepadIndex: number, config: InputConfig): GamepadInputResult {
    const gamepad: Gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return gamepadNoInputResult;

    const mapping = config.gamepadInputMapping;
    
    const leftStickMagnitude = Math.sqrt(Math.pow(Math.abs(gamepad.axes[mapping.leftStickXAxisIndex]), 2) + Math.pow(Math.abs(gamepad.axes[mapping.leftStickYAxisIndex]), 2));
    const rightStickMagnitude = Math.sqrt(Math.pow(Math.abs(gamepad.axes[mapping.rightStickXAxisIndex]), 2) + Math.pow(Math.abs(gamepad.axes[mapping.rightStickYAxisIndex]), 2));

    const isLeftStickDeadzoned = leftStickMagnitude < config.leftStickDeadzone;
    const isRightStickDeadzoned = rightStickMagnitude < config.rightStickDeadzone;

    const detectedInput: GamepadInputResult = {
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

  getKeyboardMouseInput(config): KeyboardMouseInputResult {
    //const mapping = config.keyboardMouseInputMapping;
    return keyboardMouseNoInputResult;
  }
}

export const InputService = new InputServiceImplementation();