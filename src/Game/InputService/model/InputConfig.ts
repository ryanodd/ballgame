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

export interface KeyboardMouseInputMapping {
  button1Key: number;
  button2Key: number;
  button3Key: number;
  button4Key: number;
}

export interface InputConfig {
  gamepadInputMapping: GamepadInputMapping;
  keyboardMouseInputMapping: KeyboardMouseInputMapping;
  leftStickDeadzone: number;
  rightStickDeadzone: number;
}