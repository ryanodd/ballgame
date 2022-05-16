import { LogService } from "@/Game/LogService/LogService";
import { b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { World } from "@dimforge/rapier2d";
import Ball from "../../GameObject/GameObjectFactory/Ball";
import Wall from "../../GameObject/GameObjectFactory/Wall";
import { Player } from "../../Player/Player";
import { Scene } from "../Scene";

const SCENE_WIDTH = 16;
const SCENE_HEIGHT = 9;

const UI_HEIGHT = 1; // UI section on top 1/9th of game screen
const NON_UI_HEIGHT = SCENE_HEIGHT - UI_HEIGHT;

const ARENA_WIDTH = 15;
const ARENA_HEIGHT = 7.8;

const ARENA_HORIZONTAL_PADDING = (SCENE_WIDTH - ARENA_WIDTH) / 2;
const ARENA_VERTICAL_PADDING = (NON_UI_HEIGHT - ARENA_HEIGHT) / 2;

const WALL_THICKNESS = 0.1;

export interface Scene1Props {
  players: Player[];
}


export function createScene1(props: Scene1Props): Scene {
  const gravity = { x: 0.0, y: 0.0 };
  const world = new World(gravity)
  
  const returnScene: Scene = new Scene({
    world: world,
    unitWidth: SCENE_WIDTH,
    unitHeight: SCENE_HEIGHT,
    gameObjects: []
  });

  const player1: Player | undefined = props.players[0];
  if (player1){
    player1.createObjects(returnScene, 4, 4);
  }
  const player2: Player | undefined = props.players[1];
  if (player2){
    player2.createObjects(returnScene, 8, 4);
  }
  console.log(player2)

  returnScene.addGameObject(new Ball({
    scene: returnScene,
    x: 8,
    y: 7,
    r: 0.50
  }));

  // Top Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING + ARENA_HEIGHT,
    w: ARENA_WIDTH,
    h: WALL_THICKNESS,
  }));

  // Right Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH,
    y: ARENA_VERTICAL_PADDING,
    w: WALL_THICKNESS,
    h: ARENA_HEIGHT,
  }));

  // Bottom Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING,
    w: ARENA_WIDTH,
    h: WALL_THICKNESS,
  }));

  // Left Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING,
    y: ARENA_VERTICAL_PADDING,
    w: WALL_THICKNESS,
    h: ARENA_HEIGHT,
  }));

  return returnScene;
}
