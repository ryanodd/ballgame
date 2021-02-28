import CanvasService from "@/Game/CanvasService/CanvasService";
import { LogService } from "@/Game/LogService/LogService";
import { b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import Ball from "../../GameObject/GameObjectFactory/Ball";
import GoalArea from "../../GameObject/GameObjectFactory/GoalArea";
import PulsePlayer from "../../GameObject/GameObjectFactory/PulsePlayer";
import ShipPlayer from "../../GameObject/GameObjectFactory/ShipPlayer";
import Wall from "../../GameObject/GameObjectFactory/Wall";
import { Scene } from "../Scene";

const SCENE_WIDTH = 16;
const SCENE_HEIGHT = 9;

const UI_HEIGHT = 1; // UI section on top 1/9th of game screen
const NON_UI_HEIGHT = SCENE_HEIGHT - UI_HEIGHT;

const ARENA_WIDTH = 15; // Includes walls, but not net depth
const ARENA_HEIGHT = 7.8;

const NET_HEIGHT = 4;
const NET_DEPTH = 0.4; // Doesn't include back wall of net, only GoalArea

const ARENA_HORIZONTAL_PADDING = (SCENE_WIDTH - ARENA_WIDTH) / 2; // Doesn't include net depth
const ARENA_VERTICAL_PADDING = (NON_UI_HEIGHT - ARENA_HEIGHT) / 2;

const NON_NET_HEIGHT = (ARENA_HEIGHT - NET_HEIGHT) / 2;

const WALL_THICKNESS = 0.1;


export function createScene1(): Scene {
  const world = new b2World(new b2Vec2(0, 0))
  const canvas = new CanvasService();
  
  const pulsePlayer = new PulsePlayer({
    world: world,
    x: 4,
    y: 4,
    r: 0.240,
    density: 0.5,
    friction: 0.5,
    restitution: 0.0,
    options: {}
  })
  const shipPlayer = new ShipPlayer({
    world: world,
    x: 4,
    y: 4,
    density: 2,
    friction: 0.5,
    restitution: 0.0,
    noseLength: 0.4,
    noseWidth: 0.1,
    tailLength: 0.12,
    tailWidth: 0.5,
    options: {}
  })

  const ball = new Ball({world: world, x: 8, y: 7, r: 0.120, options: {}})


  // Bottom Wall
  const bottomWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING,
    w: ARENA_WIDTH,
    h: WALL_THICKNESS,
    options: {}
  })

  // Top Wall
  const topWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING + ARENA_HEIGHT - WALL_THICKNESS,
    w: ARENA_WIDTH,
    h: WALL_THICKNESS,
    options: {}
  })

  // Left Side
  const bottomLeftWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT,
    options: {}
  })
  const topLeftWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT,
    options: {}
  })
  const leftGoalArea = new GoalArea({
    world: world,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH + WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
    w: NET_DEPTH,
    h: NET_HEIGHT,
    options: {}
  })
  const bottomLeftGoalWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS,
    options: {}
  })
  const topLeftGoalWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS,
    options: {}
  })
  const backLeftGoalWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: WALL_THICKNESS,
    h: NET_HEIGHT + (WALL_THICKNESS * 2),
    options: {}
  })


  //Right Wall
  const bottomRightWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT,
    options: {}
  })
  const topRighttWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT,
    options: {}
  })
  const rightGoalArea = new GoalArea({
    world: world,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
    w: NET_DEPTH,
    h: NET_HEIGHT,
    options: {}
  })
  const bottomRightGoalWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS,
    options: {}
  })
  const topRightGoalWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS,
    options: {}
  })
  const backRightGoalWall = new Wall({
    world: world,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH + NET_DEPTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: WALL_THICKNESS,
    h: NET_HEIGHT + (WALL_THICKNESS * 2),
    options: {}
  })
  

  
  //LogService.log(wall1)

  const returnScene: Scene = new Scene({
    world: world,
    canvas: canvas,
    unitWidth: SCENE_WIDTH,
    unitHeight: SCENE_HEIGHT,
    gameObjects: [
      bottomWall,
      topWall,

      bottomLeftWall,
      topLeftWall,
      leftGoalArea,
      bottomLeftGoalWall,
      topLeftGoalWall,
      backLeftGoalWall,

      bottomRightWall,
      topRighttWall,
      rightGoalArea,
      bottomRightGoalWall,
      topRightGoalWall,
      backRightGoalWall,
      
      shipPlayer,
      ball,
    ]
  });
  return returnScene;
}