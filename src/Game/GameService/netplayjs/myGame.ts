import { VueService, VueServicePlayer } from '@/Game/VueService/VueService';
import * as autoserialize from "@/lib/netplayjs/autoserialize";
import { NetplayPlayer, DefaultInput, Game, RollbackWrapper, JSONValue, JSONObject } from '@/lib/netplayjs'
import { Player } from '../Player/Player';
import { ShipPlayer } from '../Player/PlayerTypes/ShipPlayer';
import { Scene } from '../Scene/Scene';
import { createScene1 } from '../Scene/SceneFactory/Scene1';
import { MyInput } from './MyInput';
import { MyRollbackWrapper } from './myRollbackWrapper';
import { decycle, retrocycle } from 'cycle'

export class MyGame extends Game {
  static timestep = 1000 / 60;

  // These are needed in the Game class but I want to override the behaviour that uses it.
  // The canvas should be 100% and 100%, not px width/height
  static canvasSize = { width: -1, height: -1 };

  players: Player[] = [this.initPlayerOne()]
  scene: Scene = createScene1({players: this.players});
  previousTimestamp = 0

   serialize(): JSONValue {
    return JSON.parse(JSON.stringify(decycle(this))) as JSONValue;
  }

  deserialize(value: JSONValue): void {
    // Deep copy hack.
    const copy = retrocycle(JSON.parse(JSON.stringify(value)));

    // Copy values into source.
    for (const [key, value] of Object.entries(copy)) {
      this[key] = copy[key];
    }
  }

  onClick = (x: number, y: number) => {
    console.log (x, y)
  }

  tick(playerInputs: Map<NetplayPlayer, MyInput>) {

    const MS_PER_GAME_TICK = MyGame.timestep;
    
    this.tickWorld(MS_PER_GAME_TICK);

    //After world detects collisions, we may want to despawn some things
    this.deleteGameObjects();

    const frameAdvancesNeeded = 1

    for (let x = 0; x < frameAdvancesNeeded; x++){
      this.tickGameObjects()
      this.tickPlayers(playerInputs);
    }
  }

  draw(canvas: HTMLCanvasElement) {
    this.scene.render(canvas)
  }

  // Tick non-input, non-physics things for GameObjects. currently there are none.
  tickGameObjects() {
    this.scene.gameObjects.forEach(gameObject => {
      gameObject.tick();
    })
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
  tickWorld(msPassed: number) {
    console.log(JSON.stringify(this.scene));
    this.scene.world.Step((msPassed / 1000), 8 , 3);
    //this.world.ClearForces();
  }

  deleteGameObjects() {
    for (let i = this.scene.gameObjects.length - 1; i >= 0; i--){
      const gameObject = this.scene.gameObjects[i];
      if (gameObject.markedForDeletion){
        this.scene.gameObjects.splice(i, 1);
        this.scene.world.DestroyBody(gameObject.body)
      }
    }
  }

  //Temporary. This don't belong here
  private initPlayerOne(): Player {
    const playerIndex = 0;
    const netplayPlayerIndex = 0;
    // const player = new PulsePlayer({
    //   playerIndex: 0,
    //   gamepadIndex: 0,

    //   RADIUS: 0.240,
    //   DENSITY: 0.5,
    //   FRICTION: 0.5,
    //   RESTITUTION: 0.0
    // });
    const player = new ShipPlayer({
      playerIndex,
      netplayPlayerIndex,
      gamepadIndex: 0,

      DENSITY: 2,
      FRICTION: 0.5,
      RESTITUTION: 0.0,
      NOSE_LENGTH: 0.4,
      NOSE_WIDTH: 0.1,
      TAIL_LENGTH: 0.12,
      TAIL_WIDTH: 0.5,
      
      SHOOT_COST: 5,
    });
    const uiState: VueServicePlayer = {
      index: playerIndex,
      resourceMeter: player.resourceMeter
    }
    VueService.addPlayer(uiState);
    return player;
  }

    //Temporary. This don't belong here
    private initPlayerTwo(): Player {
      const playerIndex = 0;
      const netplayPlayerIndex = 1;
      // const player = new PulsePlayer({
      //   playerIndex,
      //   netplayPlayerIndex,
      //   gamepadIndex: 0,
  
      //   RADIUS: 0.240,
      //   DENSITY: 0.5,
      //   FRICTION: 0.5,
      //   RESTITUTION: 0.0
      // });
      const player = new ShipPlayer({
        playerIndex,
        netplayPlayerIndex,
        gamepadIndex: 0,
  
        DENSITY: 2,
        FRICTION: 0.5,
        RESTITUTION: 0.0,
        NOSE_LENGTH: 0.4,
        NOSE_WIDTH: 0.1,
        TAIL_LENGTH: 0.12,
        TAIL_WIDTH: 0.5,
        
        SHOOT_COST: 5,
      });
      const uiState: VueServicePlayer = {
        index: playerIndex,
        resourceMeter: player.resourceMeter
      }
      VueService.addPlayer(uiState);
      return player;
    }
}

export class SimpleGame extends Game {
  static timestep = 1000 / 60;
  static canvasSize = { width: 600, height: 300 };

  aPos: { x: number; y: number } = { x: 100, y: 150 };
  bPos: { x: number; y: number } = { x: 500, y: 150 };

  tick(playerInputs: Map<NetplayPlayer, DefaultInput>): void {
    for (const [player, input] of playerInputs.entries()) {
      const vel = {
        x:
          (input.pressed["ArrowLeft"] ? -1 : 0) +
          (input.pressed["ArrowRight"] ? 1 : 0),
        y:
          (input.pressed["ArrowDown"] ? -1 : 0) +
          (input.pressed["ArrowUp"] ? 1 : 0),
      };
      if (player.getID() == 0) {
        this.aPos.x += vel.x * 5;
        this.aPos.y -= vel.y * 5;
      } else if (player.getID() == 1) {
        this.bPos.x += vel.x * 5;
        this.bPos.y -= vel.y * 5;
      }
    }
  }

  draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw circles for the characters.
    ctx.fillStyle = "red";
    ctx.fillRect(this.aPos.x - 5, this.aPos.y - 5, 10, 10);

    ctx.fillStyle = "blue";
    ctx.fillRect(this.bPos.x - 5, this.bPos.y - 5, 10, 10);
  }
}

new MyRollbackWrapper(MyGame).start();
