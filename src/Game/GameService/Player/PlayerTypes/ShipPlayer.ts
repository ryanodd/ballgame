// import { GamepadInputResult } from "@/Game/InputService/model/InputResult";
// import ShipBullet from "../../GameObject/GameObjectFactory/ShipBullet";
// import ShipPlayerObject from "../../GameObject/GameObjectFactory/ShipPlayerObject";
// import { MyInput } from "../../netplayjs/MyInput";
// import { Scene } from "../../Scene/Scene";
// import { Player, PlayerProps } from "../Player";

// export interface ShipPlayerProps extends PlayerProps {
//   DENSITY: number;
//   FRICTION: number;
//   RESTITUTION: number;
//   NOSE_LENGTH: number;
//   NOSE_WIDTH: number;
//   TAIL_LENGTH: number;
//   TAIL_WIDTH: number;
  
//   SHOOT_COST: number;
// }

// export class ShipPlayer extends Player {
//   DENSITY: number;
//   FRICTION: number;
//   RESTITUTION: number;
//   NOSE_LENGTH: number;
//   NOSE_WIDTH: number;
//   TAIL_LENGTH: number;
//   TAIL_WIDTH: number;

//   SHOOT_COST: number;

//   shipObject: ShipPlayerObject | undefined;
//   bulletObject: ShipBullet | undefined;

//   constructor(props: ShipPlayerProps){
//     super({
//       playerIndex: props.playerIndex,
//       netplayPlayerIndex: props.netplayPlayerIndex,
//       gamepadIndex: props.gamepadIndex
//     });

//     this.DENSITY = props.DENSITY;
//     this.FRICTION = props.FRICTION;
//     this.RESTITUTION = props.RESTITUTION;
//     this.NOSE_LENGTH = props.NOSE_LENGTH;
//     this.NOSE_WIDTH = props.NOSE_WIDTH;
//     this.TAIL_LENGTH = props.TAIL_LENGTH;
//     this.TAIL_WIDTH = props.TAIL_WIDTH;

//     this.SHOOT_COST = props.SHOOT_COST;
//   }

//   // Puts new player Game Objects (usually a single object) into the given Scene world.
//   createObjects(scene: Scene, x: number, y: number){
//     this.shipObject = new ShipPlayerObject({
//       scene: scene,
//       x: x,
//       y: y,
//       density: this.DENSITY,
//       friction: this.FRICTION,
//       restitution: this.RESTITUTION,
//       noseLength: this.NOSE_LENGTH,
//       noseWidth: this.NOSE_WIDTH,
//       tailLength: this.TAIL_LENGTH,
//       tailWidth: this.TAIL_WIDTH
//     })
//     scene.addGameObject(this.shipObject);
//   }

//   // Detect input, do stuff
//   tick(input: MyInput){
//     const playerInput = this.getInput(input) as GamepadInputResult
//     this.handleRotation(playerInput);
//     this.handleThrust(playerInput);
//     this.handleShoot(playerInput);
//   }

//   handleRotation(input: GamepadInputResult){
//     const xAxisInput = input.leftStickXAxis;
//     this.shipObject.handleRotation(xAxisInput)
//   }

//   handleThrust(input: GamepadInputResult){
//     if(input.button1){
//       this.shipObject.thrust();
//     }
//   }

//   handleShoot(input: GamepadInputResult){
//     if (this.bulletObject?.markedForDeletion){
//       this.bulletObject = undefined;
//     }
//     if(input.button2 &&! this.bulletObject && this.resourceMeter >= this.SHOOT_COST){
//       //this.setResourceMeter(this.resourceMeter - this.SHOOT_COST)
//       this.bulletObject = this.shipObject.createBullet();
//     }
//   }
// }
