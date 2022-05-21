import { EventQueue, World } from '@dimforge/rapier2d';
import { JSONObject } from '../../lib/netplayjs';
import { defaultInputConfig } from '../InputService/contants/InputConfigDefaults';
import { MyInput, MyInputReader } from './netplayjs/MyInput';
import { Player } from './Player/Player';
import { Scene } from './Scene/Scene';
import { createScene1 } from './Scene/SceneFactory/Scene1';
import { Session } from './Session/Session';
import { Team } from './Team/Team';



export class SingleClientGame {
  static timestep = 1000 / 60;
  frame = 1;

  canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  inputReader = new MyInputReader(
    this.canvas,
    false,
    {}
  );

  players: Player[] = [
    new Player({
      playerIndex: 0,
      gamepadIndex: -1, // -1 is Keyboard/Mouse
      inputConfig: {
        ...defaultInputConfig,
        keyboardMouseInputMapping: {
          ...defaultInputConfig.keyboardMouseInputMapping,
          buttonUpKey: 'w',
          buttonRightKey: 'd',
          buttonDownKey: 's',
          buttonLeftKey: 'a',
        },
      }
    }),
    new Player({
      playerIndex: 1,
      gamepadIndex: -1, // -1 is Keyboard/Mouse
    })
  ]
  session: Session = new Session({ players: this.players })

  serialize(): JSONObject {
    return this.session.serialize()
  }

  deserialize(value: JSONObject): void {
    this.session.deserialize(value)
  }

  draw(canvas: HTMLCanvasElement) {
    const c = canvas.getContext('2d')
    if (c !== null) {
      this.session.scene.render(c)
    }
  }

  start() {
    const tick = () => {
      this.players.forEach(player => {
        player.tick(this.inputReader.getInput(), this.frame)
      })
      this.session.tick()
      this.frame++
    }
    const animate = (timestamp: number) => {
      this.draw(this.canvas);

      requestAnimationFrame(animate)
    };
    setInterval(tick, SingleClientGame.timestep)
    requestAnimationFrame(animate);
  }
}
