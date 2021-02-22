export interface GamepadInputMapping {
  button1Index: number;
  button2Index: number;
  button3Index: number;
  button4Index: number;

  leftStickXAxisIndex: number;
  leftStickYAxisIndex: number;
  rightStickXAxisIndex: number;
  rightStickYAxisIndex: number;

  // Support button style trigger?
  leftTriggerAxisIndex: number;
  rightTriggerAxisIndex: number;
}

export interface InputConfig {
  primaryPlayerGamepadIndex: number;
  primaryPlayerInputMapping: GamepadInputMapping;
}