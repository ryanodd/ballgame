import { World } from "@dimforge/rapier2d";
import Ball from "../../GameObject/GameObjectFactory/Ball";
import GoalArea from "../../GameObject/GameObjectFactory/GoalArea";
import Wall from "../../GameObject/GameObjectFactory/Wall";
import { createCharacterForPlayer } from "../../Player/CharacterType";
import { Player } from "../../Player/Player";
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
  players: Player[];
  session: Session;
}

export function createScene1(props: Scene1Props): Scene {
  const gravity = { x: 0.0, y: 0.0 };
  const world = new World(gravity)
  
  const returnScene: Scene = new Scene({
    world: world,
    unitWidth: SCENE_WIDTH,
    unitHeight: SCENE_HEIGHT,
    session: props.session,
    teams: props.teams,
    players: props.players,
  });

  let team1Count = 0
  let team2Count = 0
  props.players.forEach((player) => {
    // todo get config 4 tha chararacter
    if (player.teamIndex === 0) {
      const character = createCharacterForPlayer(player, returnScene, 2.8, 3.9 + (2 * team1Count))
      team1Count++
    }
    if (player.teamIndex === 1) {
      const character = createCharacterForPlayer(player, returnScene, 12.8, 3.9 + (2 * team2Count))
      team2Count++
    }
  })

  // Test Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    physics: {
      x: 2,
      y: 2,
      w: 1,
      h: WALL_THICKNESS,
    }
  }));

  returnScene.addGameObject(new Ball({
    scene: returnScene,
    physics: {
      x: 7.45,
      y: 3.65,
      r: 0.50,
      density: 0.8,
      friction: 0.6,
      restitution: 0.9,
    }
  }));

  //Right Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    physics: {
      x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH - WALL_THICKNESS,
      y: ARENA_VERTICAL_PADDING,
      w: WALL_THICKNESS,
      h: NON_NET_HEIGHT
    }
  }));

  returnScene.addGameObject(new GoalArea({
    scene: returnScene,
    teamIndex: 1,
    physics: {
      x: ARENA_HORIZONTAL_PADDING + ARENA_WIDTH + NET_DEPTH - WALL_THICKNESS,
      y: ARENA_VERTICAL_PADDING + NON_NET_HEIGHT,
      w: WALL_THICKNESS,
      h: NET_HEIGHT,
    },
  }));

  return returnScene;
}
