import { Player } from '../Player/Player';
import { MyInput } from './MyInput';
import { Session } from '../Session/Session';
import { DefaultInput, Game, JSONObject, NetplayPlayer, NetplayState, TouchControl } from '../../../lib/netplayjs';
import { Store } from 'redux';

export class MyGame extends NetplayState<DefaultInput> {
  
  static timestep = 1000 / 60;

  players: Player[]
  session: Session
  store: Store


  constructor(store: Store) {
    super()
    this.players = [
      new Player({
        playerIndex: 0,
        netplayPlayerIndex: 0, // host
        gamepadIndex: -1, // -1 is Keyboard/Mouse
      }),
      new Player({
        playerIndex: 1,
        netplayPlayerIndex: 1, // client
        gamepadIndex: -1, // -1 is Keyboard/Mouse
      })
    ]
    this.session = new Session({ players: this.players })
    this.store = store
  }

  serialize(): JSONObject {
    return this.session.serialize()
  }

  deserialize(value: JSONObject): void {
    this.session.deserialize(value)
  }

  tick(playerInputs: Map<NetplayPlayer, MyInput>, frame: number) {
    for (const [netplayPlayer, input] of playerInputs.entries()) {
      this.players.forEach(player => {
        if (netplayPlayer.getID() === player.netplayPlayerIndex) {
          player.tick(input, frame)
        }
      })
    }
    this.session.tick()
  }

  draw(canvas: HTMLCanvasElement) {
    const c = canvas.getContext('2d');
    if (c !== null) {
      this.session.scene.render(c)
    }
  }
}
