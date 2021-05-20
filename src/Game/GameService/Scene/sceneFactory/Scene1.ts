import CanvasService from "@/Game/CanvasService/CanvasService";
import { LogService } from "@/Game/LogService/LogService";
import { b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import Ball from "../../GameObject/GameObjectFactory/Ball";
import GoalArea from "../../GameObject/GameObjectFactory/GoalArea";
import PulsePlayer from "../../GameObject/GameObjectFactory/PulsePlayerObject";
import ShipPlayer from "../../GameObject/GameObjectFactory/ShipPlayerObject";
import Wall from "../../GameObject/GameObjectFactory/Wall";
import { Player } from "../../Player/Player";
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

export interface Scene1Props {
  canvas: CanvasService;
  players: Player[];
}


export function createScene1(props: Scene1Props): Scene {
  const world = new b2World(new b2Vec2(0, 0))
  
  const returnScene: Scene = new Scene({
    world: world,
    canvas: props.canvas,
    unitWidth: SCENE_WIDTH,
    unitHeight: SCENE_HEIGHT,
    gameObjects: []
  });
  const player1: Player | undefined = props.players[0];
  if (player1){
    player1.createObjects(returnScene, 4, 4);
  }

  returnScene.addGameObject(new Ball({
    scene: returnScene,
    x: 8,
    y: 7,
    r: 0.120
  }));


  // Bottom Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING,
    w: ARENA_WIDTH,
    h: WALL_THICKNESS
  }));

  // Top Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING + ARENA_HEIGHT - WALL_THICKNESS,
    w: ARENA_WIDTH,
    h: WALL_THICKNESS
  }));

  // Left Side
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT
  }));
  returnScene.addGameObject(new GoalArea({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH + WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
    w: NET_DEPTH,
    h: NET_HEIGHT
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: WALL_THICKNESS,
    h: NET_HEIGHT + (WALL_THICKNESS * 2)
  }));


  //Right Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: WALL_THICKNESS,
    h: NON_NET_HEIGHT
  }));
  returnScene.addGameObject(new GoalArea({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
    w: NET_DEPTH,
    h: NET_HEIGHT
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT + NET_HEIGHT,
    w: NET_DEPTH + WALL_THICKNESS,
    h: WALL_THICKNESS
  }));
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH + NET_DEPTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT - WALL_THICKNESS,
    w: WALL_THICKNESS,
    h: NET_HEIGHT + (WALL_THICKNESS * 2)
  }));
  return returnScene;
}