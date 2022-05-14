import { VueService, VueServicePlayer } from '@/Game/VueService/VueService';
import { NetplayPlayer, DefaultInput, Game, JSONValue } from '@/lib/netplayjs'
import { Player } from '../Player/Player';
import { ShipPlayer } from '../Player/PlayerTypes/ShipPlayer';
import { Scene } from '../Scene/Scene';
import { createScene1 } from '../Scene/SceneFactory/Scene1';
import { MyInput } from './MyInput';
import { MyRollbackWrapper } from './myRollbackWrapper';
import { decycle, retrocycle } from 'cycle'
import { PulsePlayer } from '../Player/PlayerTypes/PulsePlayer';
import { World } from '@dimforge/rapier2d';

export class MyGame extends Game {
  static timestep = 1000 / 60;

  // These are needed in the Game class but I want to override the behaviour that uses it.
  // The canvas should be 100% and 100%, not px width/height
  static canvasSize = { width: -1, height: -1 };

  scene: Scene = createScene1({players: []});
  previousTimestamp = 0

  someTestCopyOfThis = null

  serialize(): JSONValue {
    return { snapshot: this.scene.world.takeSnapshot().toString() }
  }

  deserialize(value: string): void {
    const { snapshot } = JSON.parse(value);
    this.scene.world = World.restoreSnapshot(snapshot);
  }

  tick(playerInputs: Map<NetplayPlayer, MyInput>) {
    const MS_PER_GAME_TICK = MyGame.timestep;
    this.tickWorld(MS_PER_GAME_TICK);
  }

  draw(canvas: HTMLCanvasElement) {
    this.scene.render(canvas)
  }


  // Physics tick
  tickWorld(msPassed: number) {
    this.scene.world.step();
  }
}

new MyRollbackWrapper(MyGame).start();
