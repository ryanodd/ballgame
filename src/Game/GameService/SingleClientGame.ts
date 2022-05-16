import { VueService, VueServicePlayer } from '@/Game/VueService/VueService';
import { NetplayPlayer, DefaultInput, Game, JSONValue } from '@/lib/netplayjs'
import { World } from '@dimforge/rapier2d';
import { MyInput, MyInputReader } from './netplayjs/MyInput';
import { Scene } from './Scene/Scene';
import { createScene1 } from './Scene/SceneFactory/Scene1';

export class SingleClientGame {
  static timestep = 1000 / 60;

  canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  inputReader = new MyInputReader(
    this.canvas,
    false,
    {}
  );

  scene: Scene = createScene1({players: []});

  tick(playerInputs: Map<NetplayPlayer, MyInput>) {
    const MS_PER_GAME_TICK = SingleClientGame.timestep;
    this.tickWorld(MS_PER_GAME_TICK);
  }

  draw(canvas: HTMLCanvasElement) {
    this.scene.render(canvas)
  }

  // Physics tick
  tickWorld(msPassed: number) {
    this.scene.world.step();
  }

  start() {
    const animate = (timestamp) => {
      
      const inputs: Map<NetplayPlayer, MyInput> = new Map();
      
      // TODO populate this map ^

      this.tick(inputs)

      // Draw state to canvas.
      this.draw(this.canvas);

      // Request another frame.
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

new SingleClientGame().start();
