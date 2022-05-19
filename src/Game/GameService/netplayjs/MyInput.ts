import { DefaultInput, DefaultInputReader } from "../../../lib/netplayjs";

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
    // if (this.mousePosition)
    //   input.mousePosition = utils.clone(this.mousePosition);
    // input.touches = utils.clone(this.touches);
    // for (const [name, control] of Object.entries(this.touchControls)) {
    //   input.touchControls = input.touchControls || {};
    //   input.touchControls[name] = utils.clone(control.getValue());
    // }

    // New Stuff
    // Theory: are the gamepad inputs being serialized as part of the gamestate?
    // ^ would their serialization cause any problems?
    input.gamepads = navigator.getGamepads()
    return input;
  }
}
