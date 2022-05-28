import { InputConfig } from './model/InputConfig';
import { GamepadInputResult, KeyboardMouseInputResult } from './model/InputResult';
import { gamepadNoInputResult, keyboardMouseNoInputResult } from './contants/noInputResult';
import { MyInput } from '../GameService/netplayjs/MyInput';

// Applies config to raw input data to produce gameplay-usable inputs.
// TODO maybe? use this at the netplay-js layer (instead of Player layer) so simpler input is serialized

export class InputServiceImplementation {
  constructor() {
    0;
  }

  getGamepadInput(input: MyInput, gamepadIndex: number, config: InputConfig): GamepadInputResult {
    const gamepad = input.gamepads[gamepadIndex];
    if (gamepad === null) return gamepadNoInputResult;

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

  getKeyboardMouseInput(input: MyInput, config: InputConfig): KeyboardMouseInputResult {
    const mapping = config.keyboardMouseInputMapping;

    const detectedInput: KeyboardMouseInputResult = {
      button1: !!input.pressed[mapping.button1Key],
      button2: !!input.pressed[mapping.button2Key],
      button3: !!input.pressed[mapping.button3Key],
      button4: !!input.pressed[mapping.button4Key],
    
      buttonUp: !!input.pressed[mapping.buttonUpKey],
      buttonRight: !!input.pressed[mapping.buttonRightKey],
      buttonDown: !!input.pressed[mapping.buttonDownKey],
      buttonLeft: !!input.pressed[mapping.buttonLeftKey],
      buttonRotateLeft: !!input.pressed[mapping.buttonRotateLeftKey],
      buttonRotateRight: !!input.pressed[mapping.buttonRotateRightKey],
    }

    return detectedInput
  }
}

export const InputService = new InputServiceImplementation();
