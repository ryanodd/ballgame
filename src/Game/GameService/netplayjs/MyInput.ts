import { initScriptLoader } from "next/script";
import { store } from "../../../../pages/_app";
import { DefaultInput, DefaultInputReader, NetplayInput } from "../../../lib/netplayjs";
import { CLEAR_CLIENT_EVENTS } from "../../../redux/actions";
import { ClientEvent } from "../../../redux/reducer";

export class MyInput extends NetplayInput<MyInput> {
  pressed: { [key: string]: boolean } = {};
  gamepads: (Gamepad|null)[] = []
  clientEvents: ClientEvent[] = []
}

export class MyInputReader {

  PRESSED_KEYS: Record<string, boolean> = {};

  constructor() {
    document.addEventListener(
      "keydown",
      (event) => {
        this.PRESSED_KEYS[event.key] = true;
      },
      false
    );
    document.addEventListener(
      "keyup",
      (event) => {
        this.PRESSED_KEYS[event.key] = false;
      },
      false
    );
  }

  getInput(): MyInput {
    const input = new MyInput();

    // Stolen from DeafultInputReader
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
    input.clientEvents = store.getState().clientEvents
    if (input.clientEvents.length > 0) {
      store.dispatch({type: CLEAR_CLIENT_EVENTS, payload: {}})
    }
    return input;
  }
}
