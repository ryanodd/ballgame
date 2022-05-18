import { NetplayPlayer, Game, JSONValue } from '@/lib/netplayjs'
import { Player } from '../Player/Player';
import { MyInput } from './MyInput';
import { MyRollbackWrapper } from './myRollbackWrapper';
import { Session } from '../Session/Session';

export class MyGame extends Game {
  static timestep = 1000 / 60;

  // These are needed in the Game class but I want to override the behaviour that uses it.
  // The canvas should be 100% and 100%, not px width/height
  static canvasSize = { width: -1, height: -1 };

  players: Player[] = [
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
  session: Session = new Session({ players: this.players })

  someTestCopyOfThis = null

  serialize(): JSONValue {
    return this.session.serialize()
  }

  deserialize(value: JSONValue): void {
    this.session.deserialize(value)
  }

  tick(playerInputs: Map<NetplayPlayer, MyInput>) {
    for (const [netplayPlayer, input] of playerInputs.entries()) {
      this.players.forEach(player => {
        if (netplayPlayer.getID() === player.netplayPlayerIndex) {
          player.tick(input)
        }
      })
    }
    this.session.tick()
  }

  draw(canvas: HTMLCanvasElement) {
    this.session.scene.render(canvas)
  }
}

new MyRollbackWrapper(MyGame).start();
