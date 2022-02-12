import { DefaultInput, DefaultInputReader } from '@/lib/netplayjs'
import * as utils from '@/lib/netplayjs/utils'

export class MyInput extends DefaultInput {
   gamepads: Gamepad[] = []
}

export class MyInputReader extends DefaultInputReader {

  getInput(): MyInput {
    const input = new MyInput();

    // Stolen from super
    for (const key in this.PRESSED_KEYS) {
      if (this.PRESSED_KEYS[key]) input.pressed[key] = true;
    }
    if (this.mousePosition)
      input.mousePosition = utils.clone(this.mousePosition);
    input.touches = utils.clone(this.touches);
    for (const [name, control] of Object.entries(this.touchControls)) {
      input.touchControls = input.touchControls || {};
      input.touchControls[name] = utils.clone(control.getValue());
    }

    // New Stuff
    input.gamepads = navigator.getGamepads()

    return input;
  }
}
