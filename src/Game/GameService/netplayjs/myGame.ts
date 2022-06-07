import { Player } from '../Player/Player';
import { MyInput } from './MyInput';
import { Session } from '../Session/Session';
import {NetplayPlayer, NetplayState, TouchControl } from '../../../lib/netplayjs';
import { Store } from 'redux';
import { defaultInputConfig } from '../../InputService/contants/InputConfigDefaults';
import { CharacterType } from '../Player/CharacterType';
import { GAME_FRAMERATE } from '../constants';

export class MyGame extends NetplayState<MyInput> {
  
  static timestep = 1000 / GAME_FRAMERATE;

  players: Player[]
  session: Session
  store: Store
  ended: boolean = false

  constructor(sessionSeed: string, store: Store) {
    super()
    this.players = [
      new Player({
        playerIndex: 0,
        netplayPlayerIndex: 0, // host
        characterType: CharacterType.Ship,
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
    this.session = new Session({ players: this.players, sessionSeed})
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
      console.log(input)
      input.clientEvents.forEach((clientEvent) => {
        this.session.handleClientEvent(clientEvent)
      })
      if (this.session.shouldTickPlayersThisFrame()) {
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
