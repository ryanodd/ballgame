import { VueService, VueServicePlayer } from '@/Game/VueService/VueService';
import { NetplayPlayer, DefaultInput, Game, JSONValue } from '@/lib/netplayjs'
import { EventQueue, World } from '@dimforge/rapier2d';
import { MyInput, MyInputReader } from './netplayjs/MyInput';
import { PulsePlayer } from './Player/PlayerTypes/PulsePlayer';
import { Scene } from './Scene/Scene';
import { createScene1 } from './Scene/SceneFactory/Scene1';
import { Team } from './Team/Team';

export class SingleClientGame {
  static timestep = 1000 / 60;

  canvas = document.getElementById('game-canvas') as HTMLCanvasElement
  inputReader = new MyInputReader(
    this.canvas,
    false,
    {}
  );

  teams = [
    new Team({
      teamIndex: 0,
      players: [
        new PulsePlayer({
          playerIndex: 0,
          netplayPlayerIndex: 0, // host
          gamepadIndex: -1, // -1 is Keyboard/Mouse
    
          RADIUS: 0.240,
          DENSITY: 0.5,
          FRICTION: 0.5,
          RESTITUTION: 0.0
        })
      ],
    }),
    new Team({
      teamIndex: 1,
      players: [
        new PulsePlayer({
          playerIndex: 1,
          netplayPlayerIndex: 1, // client
          gamepadIndex: -1, // -1 is Keyboard/Mouse

          RADIUS: 0.240,
          DENSITY: 0.5,
          FRICTION: 0.5,
          RESTITUTION: 0.0
        }),
      ]
    }),
  ]

  scene: Scene = createScene1({ teams: this.teams, game: this });
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

  tick(playerInputs: Map<number, MyInput>) {
    this.tickWorld();
    this.tickPlayers(playerInputs)

    // this.scene.world.colliders.forEachCollider((collider) => {
    //   console.log(`x: ${collider.translation().x}, y: ${collider.translation().y}, hw: ${collider.halfExtents().x}, hh: ${collider.halfExtents().y}`)
    // })
  }

  draw(canvas: HTMLCanvasElement) {
    this.scene.render(canvas)
  }

  // Tick Players: Input handling, mostly
  tickPlayers(playerInputs: Map<number, MyInput>){
    this.teams.forEach(team => {
      team.players.forEach(player => {
        for (const [playerId, input] of playerInputs.entries()) {
          if (playerId === player.netplayPlayerIndex) {
            player.tick(input); // passes the inputs for a single CLIENT (multiple gamepads still possible) 
          }
        }
      })
    })
  }

  // Physics tick
  tickWorld() {
    const eventQueue = new EventQueue(true);
    this.scene.world.step(eventQueue);
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      this.scene.handleCollision(handle1, handle2, started)
    })
  }

  resetScene() {
    this.scene = createScene1({ teams: this.teams, game: this })
  }



  start() {
    const animate = (timestamp) => {
      
      const inputs: Map<number, MyInput> = new Map();
      
      this.teams.forEach(team => {
        team.players.forEach(player => {
          inputs.set(player.playerIndex, this.inputReader.getInput());
        })
      })
      
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
