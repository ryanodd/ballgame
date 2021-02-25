import { GamepadInputMapping, InputConfig } from "../model/InputConfig"

const xboxOneInputMapping: GamepadInputMapping = {
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

export const defaultInputConfig: InputConfig = {
  primaryPlayerGamepadIndex: 0,
  primaryPlayerInputMapping: xboxOneInputMapping,
  primaryPlayerLeftStickDeadzone: 0.15,
  primaryPlayerRightStickDeadzone: 0.15,
}