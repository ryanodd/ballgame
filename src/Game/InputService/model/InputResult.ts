
export const isGamePadInputResult = (input: GamepadInputResult | KeyboardMouseInputResult): input is GamepadInputResult => {
  return ('leftStickXAxis' in input)
}

export interface GamepadInputResult {
  button1: boolean;
  button2: boolean;
  button3: boolean;
  button4: boolean;

  leftStickXAxis: number; 
  leftStickYAxis: number;
  rightStickXAxis: number; 
  rightStickYAxis: number;

  // buttonRotateLeft: boolean;
  // buttonRotateRight: boolean;

  // Support button style trigger?
  leftTriggerAxis: number;
  rightTriggerAxis: number;
}

export interface KeyboardMouseInputResult {
  button1: boolean;
  button2: boolean;
  button3: boolean;
  button4: boolean;
  
  buttonUp: boolean;
  buttonRight: boolean;
  buttonDown: boolean;
  buttonLeft: boolean;

  buttonRotateLeft: boolean;
  buttonRotateRight: boolean;

  //mouseXAxis: number;
  //mouseYAxis: number; 

  // TODO mouse clicks? No need yet?
}
