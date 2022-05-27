import { EventQueue, World } from '@dimforge/rapier2d';
import { JSONObject, JSONValue } from '../../lib/netplayjs';
import { defaultInputConfig } from '../InputService/contants/InputConfigDefaults';
import { MyInput, MyInputReader } from './netplayjs/MyInput';
import { CharacterType } from './Player/CharacterType';
import { Player } from './Player/Player';
import { Scene } from './Scene/Scene';
import { createScene1 } from './Scene/SceneFactory/Scene1';
import { Session } from './Session/Session';
import { Team } from './Team/Team';



export class SingleClientGame {
  static timestep = 1000 / 60;
  frame = 0;

  canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  inputReader = new MyInputReader(
    this.canvas,
    false,
    {}
  );

  players: Player[] = [
    new Player({
      playerIndex: 0,
      teamIndex: 0,
      //gamepadIndex: 0,
      characterType: CharacterType.Pulse,
      inputConfig: {
        ...defaultInputConfig,
        keyboardMouseInputMapping: {
          ...defaultInputConfig.keyboardMouseInputMapping,
          buttonUpKey: 'w',
          buttonRightKey: 'd',
          buttonDownKey: 's',
          buttonLeftKey: 'a',
          button1Key: 'f',
          button2Key: 'g',
        },
      }
    }),
    new Player({
      playerIndex: 1,
      teamIndex: 1,
      characterType: CharacterType.Pulse,
      inputConfig: {
        ...defaultInputConfig,
        keyboardMouseInputMapping: {
          ...defaultInputConfig.keyboardMouseInputMapping,
          button1Key: 'o',
          button2Key: 'p',
        },
      }
    })
  ]
  session: Session = new Session({ players: this.players })

  serialize(): any {
    return this.session.serialize()
  }

  deserialize(value: any): void {
    this.session.deserialize(value)
  }

  draw(canvas: HTMLCanvasElement) {
    const c = canvas.getContext('2d')
    if (c !== null) {
      this.session.render(c)
    }
  }

  start() {
    const tick = () => {
      this.players.forEach(player => {
        player.tickMovement(this.inputReader.getInput(), this.frame)
      })
      this.players.forEach(player => {
        player.tickAbilities(this.inputReader.getInput(), this.frame)
      })
      this.session.tick(this.frame)
      
      if (this.frame === 0) {
        requestAnimationFrame(animate);
      }

      this.frame++
      if (this.session.ended) {
        clearInterval(intervalHandle)
      }
    }
    const animate = (timestamp: number) => {
      this.draw(this.canvas);

      requestAnimationFrame(animate)
    };
    const intervalHandle = setInterval(tick, SingleClientGame.timestep)
  }
}
