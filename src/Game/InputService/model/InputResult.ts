export interface GamepadInputResult {
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

export interface KeyboardMouseInputResult {
  key1: boolean;
  key2: boolean;
  key3: boolean;
  key4: boolean;
  
  mouseXAxis: number;
  mouseYAxis: number; 
}