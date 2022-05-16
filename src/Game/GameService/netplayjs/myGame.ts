import { VueService, VueServicePlayer } from '@/Game/VueService/VueService';
import { NetplayPlayer, DefaultInput, Game, JSONValue } from '@/lib/netplayjs'
import { Player } from '../Player/Player';
import { Scene } from '../Scene/Scene';
import { createScene1 } from '../Scene/SceneFactory/Scene1';
import { MyInput } from './MyInput';
import { MyRollbackWrapper } from './myRollbackWrapper';
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
    return {
      snapshot: this.scene.world.takeSnapshot().toString()
    } as JSONValue;
  }

  deserialize(value: JSONValue): void {
    const snapshot = value['snapshot']
    const splitSnapshot = snapshot.split(',')
    const array = new Uint8Array(splitSnapshot)
    this.scene.world = World.restoreSnapshot(array);
  }

  tick(playerInputs: Map<NetplayPlayer, MyInput>) {
    const MS_PER_GAME_TICK = MyGame.timestep;
    this.tickWorld(MS_PER_GAME_TICK);

    // log
    this.scene.world.colliders.forEachCollider((collider) => {
      if (collider.translation().x !== 8)
      console.log(collider.translation().y)
    })
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
