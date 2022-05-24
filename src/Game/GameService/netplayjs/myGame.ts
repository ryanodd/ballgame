import { Player } from '../Player/Player';
import { MyInput } from './MyInput';
import { Session } from '../Session/Session';
import { DefaultInput, Game, JSONValue, NetplayPlayer, NetplayState, TouchControl } from '../../../lib/netplayjs';
import { Store } from 'redux';
import { defaultInputConfig } from '../../InputService/contants/InputConfigDefaults';
import { CharacterType } from '../Player/CharacterType';

export class MyGame extends NetplayState<DefaultInput> {
  
  static timestep = 1000 / 60;

  players: Player[]
  session: Session
  store: Store
  ended: boolean = false

  constructor(store: Store) {
    super()
    this.players = [
      new Player({
        playerIndex: 0,
        netplayPlayerIndex: 0, // host
        characterType: CharacterType.Pulse,
        teamIndex: 0,
      }),
      new Player({
        playerIndex: 1,
        netplayPlayerIndex: 1, // client
        characterType: CharacterType.Pulse,
        teamIndex: 1,
        // inputConfig: {
        //   ...defaultInputConfig,
        //   keyboardMouseInputMapping: {
        //     ...defaultInputConfig.keyboardMouseInputMapping,
        //     buttonLeftKey: 'a',
        //     buttonRightKey: 'd',
        //     buttonUpKey: 'w',
        //     buttonDownKey: 's',
        //   }
        // }
      })
    ]
    this.session = new Session({ players: this.players })
    this.store = store
  }

  serialize(): any {
    return {
      ...this.session.serialize(),
      ended: this.ended,
    }
  }

  deserialize(value: any): void {
    this.ended = value['ended']
    this.session.deserialize(value)
  }

  tick(playerInputs: Map<NetplayPlayer, MyInput>, frame: number) {
    if (this.session.ended) {
      this.ended = true
    }
    for (const [netplayPlayer, input] of playerInputs.entries()) {
      this.players.forEach(player => {
        if (netplayPlayer.getID() === player.netplayPlayerIndex) {
          player.tickMovement(input, frame)
        }
      })
      this.players.forEach(player => {
        if (netplayPlayer.getID() === player.netplayPlayerIndex) {
          player.tickAbilities(input, frame)
        }
      })
    }
    this.session.tick(frame)
  }

  draw(canvas: HTMLCanvasElement) {
    const c = canvas.getContext('2d');
    if (c !== null) {
      this.session.render(c)
    }
  }
}
