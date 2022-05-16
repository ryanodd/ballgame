// import { VueService, VueServicePlayer } from '@/Game/VueService/VueService';
// import { NetplayPlayer, DefaultInput, Game, JSONValue } from '@/lib/netplayjs'
// import { Player } from '../Player/Player';
// import { ShipPlayer } from '../Player/PlayerTypes/ShipPlayer';
// import { Scene } from '../Scene/Scene';
// import { createScene1 } from '../Scene/SceneFactory/Scene1';
// import { MyInput } from './MyInput';
// import { MyRollbackWrapper } from './myRollbackWrapper';
// import { decycle, retrocycle } from 'cycle'
// import { PulsePlayer } from '../Player/PlayerTypes/PulsePlayer';

// export class MyGame extends Game {
//   static timestep = 1000 / 60;

//   // These are needed in the Game class but I want to override the behaviour that uses it.
//   // The canvas should be 100% and 100%, not px width/height
//   static canvasSize = { width: -1, height: -1 };

//   players: Player[] = [this.initPlayerOne()]
//   scene: Scene = createScene1({players: this.players});
//   previousTimestamp = 0

//   someTestCopyOfThis = null

//   serialize(): JSONValue {

//     // For any object/class reference that has been encountered at least once before,
//     // overwrite it with an object containing only { $ref: 'path/to/existing/reference' }
//     // this removes circular references and makes the game state convertable to json
//     const decycled = decycle(this)

//     if (this.someTestCopyOfThis === null) {
//       this.someTestCopyOfThis = JSON.parse(JSON.stringify(decycled)) as JSONValue;
//     } else {
//        console.warn(this.someTestCopyOfThis === JSON.parse(JSON.stringify(decycled)) as JSONValue)
//     }
//     return JSON.parse(JSON.stringify(decycled)) as JSONValue;
    
//   }

//   deserialize(value: string): void {

//     // we call this function to take a serialized game state and copy its data into ourselves
//     const recursiveCopySkippingRefs = (source: Record<string, any>, dest: any) => {
//       for (const [key, value] of Object.entries(source)) {
//         if (typeof value === 'object' && value !== null) {
//           if (source[key].$ref !== undefined){
//             // skip if a $ref entry exists in this object
//             continue
//           }
//           recursiveCopySkippingRefs(value, dest[key])
//         } else {
//           dest[key] = value;
//         }
//       }
//     }
    
//     // For any object/class reference that has been encountered at least once before,
//     // it has been overwritten with an object containing only { $ref: 'path/to/existing/reference' }
//     // this removes circular references and makes the game state convertable to json.
//     // Now we are taking this and using it to paste onto our game state,
//     // careful not to overwrite when a duplicate reference is marked with .$ref 
//     const objectWithRefsForDuplicateReferences = JSON.parse(JSON.stringify(value));
//     recursiveCopySkippingRefs(objectWithRefsForDuplicateReferences, this)

//     console.log(this)
//   }

//   tick(playerInputs: Map<NetplayPlayer, MyInput>) {
//     const MS_PER_GAME_TICK = MyGame.timestep;
    
//     this.tickWorld(MS_PER_GAME_TICK);

//     //After world detects collisions, we may want to despawn some things
//     this.deleteGameObjects();

//     const frameAdvancesNeeded = 1

//     for (let x = 0; x < frameAdvancesNeeded; x++){
//       this.tickGameObjects()
//       this.tickPlayers(playerInputs);
//     }
//   }

//   draw(canvas: HTMLCanvasElement) {
//     this.scene.render(canvas)
//   }

//   // Tick non-input, non-physics things for GameObjects. currently there are none.
//   tickGameObjects() {
//     this.scene.gameObjects.forEach(gameObject => {
//       gameObject.tick();
//     })
//   }

//   // Tick Players: Input handling, mostly
//   tickPlayers(playerInputs: Map<NetplayPlayer, MyInput>){
//     this.players.forEach(player => {
//       for (const [netplayPlayer, input] of playerInputs.entries()) {
//         if (netplayPlayer.getID() === player.netplayPlayerIndex) {
//           player.tick(input); // passes the inputs for a single CLIENT (multiple gamepads still possible) 
//         }
//       }
//     })
//   }

//   // Physics tick
//   tickWorld(msPassed: number) {
//     this.scene.world.Step((msPassed / 1000), 8 , 3);
//     //this.world.ClearForces();
//   }

//   deleteGameObjects() {
//     for (let i = this.scene.gameObjects.length - 1; i >= 0; i--){
//       const gameObject = this.scene.gameObjects[i];
//       if (gameObject.markedForDeletion){
//         this.scene.gameObjects.splice(i, 1);
//         this.scene.world.DestroyBody(gameObject.body)
//       }
//     }
//   }

//   //Temporary. This probably doesn't belong in this file
//   private initPlayerOne(): Player {
//     const playerIndex = 0;
//     const netplayPlayerIndex = 0;
//     const player = new PulsePlayer({
//       playerIndex,
//       netplayPlayerIndex,
//       gamepadIndex: 0,
      

//       RADIUS: 0.240,
//       DENSITY: 0.5,
//       FRICTION: 0.5,
//       RESTITUTION: 0.0
//     });
//     // const player = new ShipPlayer({
//     //   playerIndex,
//     //   netplayPlayerIndex,
//     //   gamepadIndex: 0,

//     //   DENSITY: 2,
//     //   FRICTION: 0.5,
//     //   RESTITUTION: 0.0,
//     //   NOSE_LENGTH: 0.4,
//     //   NOSE_WIDTH: 0.1,
//     //   TAIL_LENGTH: 0.12,
//     //   TAIL_WIDTH: 0.5,
      
//     //   SHOOT_COST: 5,
//     // });
//     const uiState: VueServicePlayer = {
//       index: playerIndex,
//       resourceMeter: player.resourceMeter
//     }
//     VueService.addPlayer(uiState);
//     return player;
//   }

//     //Temporary. This don't belong here
//     private initPlayerTwo(): Player {
//       const playerIndex = 0;
//       const netplayPlayerIndex = 1;
//       const player = new PulsePlayer({
//         playerIndex,
//         netplayPlayerIndex,
//         gamepadIndex: 0,
  
//         RADIUS: 0.240,
//         DENSITY: 0.5,
//         FRICTION: 0.5,
//         RESTITUTION: 0.0
//       });
//       // const player = new ShipPlayer({
//       //   playerIndex,
//       //   netplayPlayerIndex,
//       //   gamepadIndex: 0,
  
//       //   DENSITY: 2,
//       //   FRICTION: 0.5,
//       //   RESTITUTION: 0.0,
//       //   NOSE_LENGTH: 0.4,
//       //   NOSE_WIDTH: 0.1,
//       //   TAIL_LENGTH: 0.12,
//       //   TAIL_WIDTH: 0.5,
        
//       //   SHOOT_COST: 5,
//       // });
//       const uiState: VueServicePlayer = {
//         index: playerIndex,
//         resourceMeter: player.resourceMeter
//       }
//       VueService.addPlayer(uiState);
//       return player;
//     }
// }

// new MyRollbackWrapper(MyGame).start();
