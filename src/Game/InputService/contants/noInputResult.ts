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
  button1: false,
  button2: false,
  button3: false,
  button4: false,
  
  buttonUp: false,
  buttonRight: false,
  buttonDown: false,
  buttonLeft: false,
}
