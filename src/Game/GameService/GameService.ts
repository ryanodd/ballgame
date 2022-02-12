import CanvasService from '@/Game/CanvasService/CanvasService';
import { createScene1 } from './Scene/SceneFactory/Scene1';
import { LogService } from '@/Game/LogService/LogService';
import { Scene } from './Scene/Scene';
import { Player } from './Player/Player';
import { ShipPlayer } from './Player/PlayerTypes/ShipPlayer';
import { PulsePlayer } from './Player/PlayerTypes/PulsePlayer';
import { VueService, VueServicePlayer } from '../VueService/VueService';
import { gamepadNoInputResult } from '../InputService/contants/noInputResult';

export default class GameService {
  scene: Scene
  players: Player[]
  canvas: CanvasService
  previousTimestamp: number //type?
  
  constructor(){
    this.previousTimestamp = 0;
    this.players = [this.initPlayerOne()]
    this.canvas = new CanvasService([this.onClick]);
    this.scene = createScene1({canvas: this.canvas, players: this.players});
    
    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  onClick = (x: number, y: number) => {
    console.log (x, y)
  }

  gameLoop(timestamp: number) {
    const MS_PER_GAME_TICK = 17;
    const msPassed = (timestamp - this.previousTimestamp);
    
    // Physics runs out of sync with game (runs on msPassed). May need to change to frame-advance model like players/objects above 
    this.tickWorld(msPassed);

    //After world detects collisions, we may want to despawn some things
    this.deleteGameObjects();

    this.previousTimestamp = timestamp;
    const fps = Math.round(1000 / msPassed); // TODO pass this somewhere
    const enoughMsToReachExtraFrame: boolean = (((this.previousTimestamp % MS_PER_GAME_TICK) + (msPassed % MS_PER_GAME_TICK)) >= MS_PER_GAME_TICK)
    const frameAdvancesNeeded = Math.floor(msPassed / MS_PER_GAME_TICK) + (enoughMsToReachExtraFrame ? 1 : 0)

    for (let x = 0; x < frameAdvancesNeeded; x++){
      this.tickGameObjects()
      this.tickPlayers();
    }

    this.scene.render();

    // Aaaand request the next frame
    window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  // Tick non-input, non-physics things for GameObjects. currently there are none.
  tickGameObjects() {
    this.scene.gameObjects.forEach(gameObject => {
      gameObject.tick();
    })
  }

  // Tick Players: Input handling, mostly
  tickPlayers(){
    this.players.forEach(player => {
      player.tick();
    })
  }

  // Physics tick
  tickWorld(msPassed: number) {
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
    // const player = new PulsePlayer({
    //   playerIndex: 0,
    //   gamepadIndex: 0,

    //   RADIUS: 0.240,
    //   DENSITY: 0.5,
    //   FRICTION: 0.5,
    //   RESTITUTION: 0.0
    // });
    const playerIndex = 0;
    const player = new ShipPlayer({
      playerIndex: 0,
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
