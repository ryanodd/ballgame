export interface PlayerInputResult {
  button1: boolean;
  button2: boolean;
  button3: boolean;
  button4: boolean;

  leftStickXAxis: number; 
  leftStickYAxis: number;
  rightStickXAxis: number; 
  rightStickYAxis: number;

  // Support button style trigger?
  leftTriggerAxis: number;
  rightTriggerAxis: number;
}

export interface InputResult {
  primaryPlayerInput: PlayerInputResult
}