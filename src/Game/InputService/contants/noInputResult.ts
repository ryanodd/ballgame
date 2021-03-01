import { GamepadInputResult, KeyboardMouseInputResult } from "../model/InputResult";

export const gamepadNoInputResult: GamepadInputResult = {
  button1: false,
  button2: false,
  button3: false,
  button4: false,

  leftStickXAxis: 0,
  leftStickYAxis: 0,
  rightStickXAxis: 0,
  rightStickYAxis: 0,

  leftTriggerAxis: 0,
  rightTriggerAxis: 0,
}

export const keyboardMouseNoInputResult: KeyboardMouseInputResult = {
  key1: false,
  key2: false,
  key3: false,
  key4: false,

  mouseXAxis: 0,
  mouseYAxis: 0,
}