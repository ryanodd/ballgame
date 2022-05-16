import { VueService, VueServicePlayer } from '@/Game/VueService/VueService';
import { NetplayPlayer, DefaultInput, Game, JSONValue } from '@/lib/netplayjs'
import { Player } from '../Player/Player';
import { Scene } from '../Scene/Scene';
import { createScene1 } from '../Scene/SceneFactory/Scene1';
import { MyInput } from './MyInput';
import { MyRollbackWrapper } from './myRollbackWrapper';
import { World } from '@dimforge/rapier2d';
import { PulsePlayer } from '../Player/PlayerTypes/PulsePlayer';
import { defaultInputConfig } from '@/Game/InputService/contants/InputConfigDefaults';

export class MyGame extends Game {
  static timestep = 1000 / 60;

  // These are needed in the Game class but I want to override the behaviour that uses it.
  // The canvas should be 100% and 100%, not px width/height
  static canvasSize = { width: -1, height: -1 };

  players = [
    new PulsePlayer({
      playerIndex: 0,
      netplayPlayerIndex: 0, // host
      gamepadIndex: -1, // -1 is Keyboard/Mouse

      RADIUS: 0.240,
      // DENSITY: 0.5,
      // FRICTION: 0.5,
      // RESTITUTION: 0.0
    }),
    new PulsePlayer({
      playerIndex: 1,
      netplayPlayerIndex: 1, // client
      gamepadIndex: -1, // -1 is Keyboard/Mouse
      inputConfig: {
        keyboardMouseInputMapping: {
          buttonUpKey: "W",
          buttonRightKey: "D",
          buttonDownKey: "S",
          buttonLeftKey: "A",
          ...defaultInputConfig.keyboardMouseInputMapping
        },
        ...defaultInputConfig
      },

      RADIUS: 0.240,
      // DENSITY: 0.5,
      // FRICTION: 0.5,
      // RESTITUTION: 0.0
    }),
  ]

  scene: Scene = createScene1({ players: this.players });
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
    this.tickWorld();
    this.tickPlayers(playerInputs)

    this.scene.world.colliders.forEachCollider((collider) => {
      console.log(`x: ${collider.translation().x}, y: ${collider.translation().y}, hw: ${collider.halfExtents().x}, hh: ${collider.halfExtents().y}`)
    })
  }

  draw(canvas: HTMLCanvasElement) {
    this.scene.render(canvas)
  }

  // Tick Players: Input handling, mostly
  tickPlayers(playerInputs: Map<NetplayPlayer, MyInput>){
    this.players.forEach(player => {
      for (const [netplayPlayer, input] of playerInputs.entries()) {
        if (netplayPlayer.getID() === player.netplayPlayerIndex) {
          player.tick(input); // passes the inputs for a single CLIENT (multiple gamepads still possible) 
        }
      }
    })
  }

  // Physics tick
  tickWorld() {
    this.scene.world.step();
  }
}

new MyRollbackWrapper(MyGame).start();
