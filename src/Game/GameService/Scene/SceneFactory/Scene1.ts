import { World } from "@dimforge/rapier2d";
import Ball from "../../GameObject/GameObjectFactory/Ball";
import GoalArea from "../../GameObject/GameObjectFactory/GoalArea";
import Wall from "../../GameObject/GameObjectFactory/Wall";
import { Character } from "../../Player/Character";
import { Session } from "../../Session/Session";
import { Team } from "../../Team/Team";
import { Scene } from "../Scene";

const SCENE_WIDTH = 16;
const SCENE_HEIGHT = 9;

const UI_HEIGHT = 1; // UI section on top 1/9th of game screen
const NON_UI_HEIGHT = SCENE_HEIGHT - UI_HEIGHT;

const ARENA_WIDTH = 14.4; // Includes walls, but not net depth
const ARENA_HEIGHT = 7.8;

const NET_HEIGHT = 4;
const NET_DEPTH = 0.7; // Doesn't include back wall of net, only hollow area

const ARENA_HORIZONTAL_PADDING = (SCENE_WIDTH - ARENA_WIDTH) / 2; // Doesn't include net depth
const ARENA_VERTICAL_PADDING = (NON_UI_HEIGHT - ARENA_HEIGHT) / 2;

const NON_NET_HEIGHT = (ARENA_HEIGHT - NET_HEIGHT) / 2;

const WALL_THICKNESS = 0.1;

export interface Scene1Props {
  teams: Team[];
  session: Session;
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

  const character1: Character | undefined = props.teams[0].characters[0];
  if (character1){
    character1.createObjects(returnScene, 4, 4);
  }
  const character2: Character | undefined = props.teams[1].characters[0];
  if (character2){
    character2.createObjects(returnScene, 8, 4);
  }

  // Need to declare separately to give handle for collision tracking purposes.
  const ball = new Ball({
    scene: returnScene,
    x: 8,
    y: 7,
    r: 0.50,
    density: 0.8,
    friction: 0.6,
    restitution: 0.9,
  })
  returnScene.addGameObject(ball);

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
  // returnScene.addGameObject(new GoalArea({
  //   scene: returnScene,
  //   x: ARENA_HORIZONTAL_PADDING - NET_DEPTH + WALL_THICKNESS,
  //   y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
  //   w: NET_DEPTH,
  //   h: NET_HEIGHT
  // }));
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
  returnScene.addGameObject(new GoalArea({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING - NET_DEPTH,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
    w: WALL_THICKNESS,
    h: NET_HEIGHT,
    ballColliders: [
      ball.colliderHandle
    ],
    onGoal: () => {
      props.teams[1].onGoal();
      props.session.resetScene();
    }
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
  // returnScene.addGameObject(new GoalArea({
  //   scene: returnScene,
  //   x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
  //   y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
  //   w: NET_DEPTH,
  //   h: NET_HEIGHT
  // }));
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
  returnScene.addGameObject(new GoalArea({
    scene: returnScene,
    x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH + NET_DEPTH - WALL_THICKNESS,
    y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
    w: WALL_THICKNESS,
    h: NET_HEIGHT,
    ballColliders: [
      ball.colliderHandle
    ],
    onGoal: () => {
      props.teams[0].onGoal();
      props.session.resetScene();
    }
  }));

  return returnScene;
}
