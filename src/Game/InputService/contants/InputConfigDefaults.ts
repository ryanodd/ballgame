import { GamepadInputMapping, InputConfig, KeyboardMouseInputMapping } from "../model/InputConfig"

const defaultXboxOneInputMapping: GamepadInputMapping = {
  button1Index: 0,
  button2Index: 1,
  button3Index: 2,
  button4Index: 3,

  leftStickXAxisIndex: 0,
  leftStickYAxisIndex: 1,
  rightStickXAxisIndex: 2,
  rightStickYAxisIndex: 3,

  // Support button style trigger?
  leftTriggerAxisIndex: 4,
  rightTriggerAxisIndex: 5,
}

const defaultKeyboardMouseInputMapping: KeyboardMouseInputMapping = {
  button1Key: "Z",
  button2Key: "X",
  button3Key: "C",
  button4Key: "V",
  
  buttonUpKey: "ArrowUp",
  buttonRightKey: "ArrowRight",
  buttonDownKey: "ArrowDown",
  buttonLeftKey: "ArrowLeft",
}

export const defaultInputConfig: InputConfig = {
  gamepadInputMapping: defaultXboxOneInputMapping,
  keyboardMouseInputMapping: defaultKeyboardMouseInputMapping,
  leftStickDeadzone: 0.15,
  rightStickDeadzone: 0.15,
}
