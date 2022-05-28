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

const ARENA_HORIZONTAL_PADDING = 0.1;
const ARENA_VERTICAL_PADDING = 0.1;
const WALL_THICKNESS = 0.1;

const ARENA_WIDTH_WITH_WALLS = SCENE_WIDTH - (2 * ARENA_HORIZONTAL_PADDING)
const ARENA_HEIGHT_WITH_WALLS = NON_UI_HEIGHT - (2 * ARENA_VERTICAL_PADDING)

const ARENA_WIDTH = ARENA_WIDTH_WITH_WALLS - (2 * WALL_THICKNESS)
const ARENA_HEIGHT = ARENA_HEIGHT_WITH_WALLS - (2 * WALL_THICKNESS)

const MOVING_WALL_COUNT = 4
const MOVING_WALL_GAP_HEIGHT = 3;

export interface Scene4Props {
  teams: Team[];
  players: Player[];
  session: Session;
}

export function createScene4(props: Scene4Props): Scene {
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

  props.players.forEach((player) => {
    // todo get config 4 tha chararacter
    if (player.teamIndex === 0) {
      const character = createCharacterForPlayer(player, returnScene, 3, 4)
    }
    if (player.teamIndex === 1) {
      const character = createCharacterForPlayer(player, returnScene, 13, 4)
    }
  })

  returnScene.addGameObject(new Ball({
    scene: returnScene,
    physics: {
      x: 8,
      y: 4,
      r: 0.50,
      density: 0.8,
      friction: 0.6,
      restitution: 0.9,
    }
  }))

  // Bottom Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    physics: {
      x: ARENA_HORIZONTAL_PADDING,
      y: ARENA_VERTICAL_PADDING,
      w: ARENA_WIDTH_WITH_WALLS,
      h: WALL_THICKNESS
    }
  }));

  // Top Wall
  returnScene.addGameObject(new Wall({
    scene: returnScene,
    physics: {
      x: ARENA_HORIZONTAL_PADDING,
      y: ARENA_VERTICAL_PADDING + WALL_THICKNESS + ARENA_HEIGHT,
      w: ARENA_WIDTH_WITH_WALLS,
      h: WALL_THICKNESS
    }
  }));

  //Left
  returnScene.addGameObject(new GoalArea({
    scene: returnScene,
    teamIndex: 0,
    physics: {
      x: ARENA_HORIZONTAL_PADDING,
      y: ARENA_VERTICAL_PADDING + WALL_THICKNESS,
      w: WALL_THICKNESS,
      h: ARENA_HEIGHT,
    },
  }));

  // Right
  returnScene.addGameObject(new GoalArea({
    scene: returnScene,
    teamIndex: 1,
    physics: {
      x: ARENA_HORIZONTAL_PADDING + WALL_THICKNESS + ARENA_WIDTH,
      y: ARENA_VERTICAL_PADDING + WALL_THICKNESS,
      w: WALL_THICKNESS,
      h: ARENA_HEIGHT,
    },
  }));

  for (let i = 1; i <= MOVING_WALL_COUNT; i++) {
    returnScene.addGameObject(new Wall({
      scene: returnScene,
      physics: {
        x: ARENA_HORIZONTAL_PADDING + WALL_THICKNESS + (
          (
            (ARENA_WIDTH / (MOVING_WALL_COUNT + 1)) * i
          )
          - (WALL_THICKNESS / 2)
        ),
        y: ARENA_VERTICAL_PADDING + WALL_THICKNESS,
        w: WALL_THICKNESS,
        h: (i % 2) === 0 ? 0 : (ARENA_HEIGHT) - MOVING_WALL_GAP_HEIGHT
      },
      variation: {
        direction: 'up',
        speed: i * (5 - i),
        distance: ((i % 2) === 0 ? 1 : -1) * (ARENA_HEIGHT - MOVING_WALL_GAP_HEIGHT),
      }
    }))
    returnScene.addGameObject(new Wall({
      scene: returnScene,
      physics: {
        x: ARENA_HORIZONTAL_PADDING + WALL_THICKNESS + (
          (
            (ARENA_WIDTH / (MOVING_WALL_COUNT + 1))
            * i
          )
          - (WALL_THICKNESS / 2)
        ),
        y: (i % 2) === 0 ? ARENA_VERTICAL_PADDING + WALL_THICKNESS + MOVING_WALL_GAP_HEIGHT : ARENA_VERTICAL_PADDING + WALL_THICKNESS + ARENA_HEIGHT,
        w: WALL_THICKNESS,
        h: (i % 2) === 0 ? ARENA_HEIGHT - MOVING_WALL_GAP_HEIGHT : 0
      },
      variation: {
        direction: 'down',
        speed: i * (5 - i),
        distance: ((i % 2) === 0 ? -1 : 1) * (ARENA_HEIGHT - MOVING_WALL_GAP_HEIGHT),
      }
    }))
  }

  return returnScene;
}