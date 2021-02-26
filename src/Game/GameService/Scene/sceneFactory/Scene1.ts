import CanvasService from "@/Game/CanvasService/CanvasService";
import { LogService } from "@/Game/LogService/LogService";
import { b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import Ball from "../../Objects/Ball";
import PulsePlayer from "../../Objects/PulsePlayer";
import ShipPlayer from "../../Objects/ShipPlayer";
import Wall from "../../Objects/Wall";
import { Scene } from "../Scene";

export function createScene1(): Scene {
  const world = new b2World(new b2Vec2(0, 0))
  const canvas = new CanvasService();
  
  //const pulsePlayer = new PulsePlayer({world: world, x: 4, y: 4, r: 0.240, options: {}})
  const shipPlayer = new ShipPlayer({world: world, x: 4, y: 4, noseLength: 0.4, noseWidth: 0.1, tailLength: 0.12, tailWidth: 0.5, options: {}})
  const ball = new Ball({world: world, x: 8, y: 7, r: 0.120, options: {}})

  const wall1 = new Wall({world: world, x: 0.50, y: 0.10, w: 15.00, h: 0.10, options: {}})
  const wall2 = new Wall({world: world, x: 0.50, y: 0.10, w: 0.10, h: 8.80, options: {}})
  const wall3 = new Wall({world: world, x: 0.50, y: 8.80, w: 15.00, h: 0.10, options: {}})
  const wall4 = new Wall({world: world, x: 15.40, y: 0.10, w: 0.10, h: 8.80, options: {}})
  
  //LogService.log(wall1)

  const returnScene: Scene = new Scene({
    world: world,
    canvas: canvas,
    unitWidth: 16,
    unitHeight: 9,
    gameObjects: [shipPlayer, ball, wall1, wall2, wall3, wall4]
  });
  return returnScene;
}