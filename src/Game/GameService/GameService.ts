import { createScene1 } from './Scene/SceneFactory/Scene1';
import { LogService } from '@/Game/LogService/LogService';
import { Scene } from './Scene/Scene';
import { Player } from './Player/Player';
import { ShipPlayer } from './Player/PlayerFactory.ts/ShipPlayer';
import { PulsePlayer } from './Player/PlayerFactory.ts/PulsePlayer';

export default class GameController {
  scene: Scene
  players: Player[]
  previousTimestamp: number //type?
  
  constructor(){
    this.previousTimestamp = 0;
    this.players = [this.initPlayerOne()]
    this.scene = createScene1({players: this.players});
    
    window.requestAnimationFrame(this.gameLoop.bind(this))
  }

  gameLoop(timestamp: number) {
    const MS_PER_GAME_TICK = 17;
    const msPassed = (timestamp - this.previousTimestamp);
    this.previousTimestamp = timestamp;
    const fps = Math.round(1000 / msPassed); // TODO pass this somewhere
    const enoughMsToReachExtraFrame: boolean = (((this.previousTimestamp % MS_PER_GAME_TICK) + (msPassed % MS_PER_GAME_TICK)) >= MS_PER_GAME_TICK)
    const frameAdvancesNeeded = Math.floor(msPassed / MS_PER_GAME_TICK) + (enoughMsToReachExtraFrame ? 1 : 0)

    for (let x = 0; x < frameAdvancesNeeded; x++){
      this.tickGameObjects()
      this.tickPlayers();
    }

    // Physics runs out of sync with game (runs on msPassed). May need to change to frame-advance model like players/objects above 
    this.tickWorld(msPassed);

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

  //Temporary. This don't belong here
  private initPlayerOne(): Player {
    return new PulsePlayer({
      playerIndex: 0,
      gamepadIndex: 0
    });
    // return new ShipPlayer({
    //   playerIndex: 0,
    //   gamepadIndex: 0
    // });
  }
}