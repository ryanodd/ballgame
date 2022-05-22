import GameObject from "../GameObject/GameObject";
import { ColliderHandle, EventQueue, World } from '@dimforge/rapier2d';
import { JSONObject } from "../../../lib/netplayjs";
import { Character } from "../Player/Character";
import { Team } from "../Team/Team";
import { Player } from "../Player/Player";
import { getGameObjectById } from "../GameObject/GameObjectType";
import { Session } from "../Session/Session";

export interface SceneProps {
  world: World;
  unitWidth: number;
  unitHeight: number;
  session: Session;
  players: Player[];
  teams: Team[];
}

export class Scene {
  world: World;
  unitWidth: number;
  unitHeight: number;
  gameObjects: GameObject[] = [];
  readonly session: Session;
  readonly characters: Character[] = [];
  readonly players: Player[];
  readonly teams: Team[];

  constructor(props: SceneProps){
    this.world = props.world;
    this.unitWidth = props.unitWidth;
    this.unitHeight = props.unitHeight;
    this.session = props.session;
    this.players = props.players;
    this.teams = props.teams;
  }

  serialize(): JSONObject {
    return {
      worldSnapshot: this.world.takeSnapshot().toString(),
      gameObjects: this.gameObjects.map(gameObject => gameObject.serialize()),
      characters: this.characters.map(character => character.serialize()),
    }
  }

  deserialize(value: JSONObject) {
    const worldSnapshot = value['worldSnapshot']
    const splitSnapshot = worldSnapshot.split(',')
    const array = new Uint8Array(splitSnapshot)
    this.world = World.restoreSnapshot(array);

    this.gameObjects = value['gameObjects'].map((gameObjectValue: JSONObject) => {
      return getGameObjectById(gameObjectValue['id']).deserialize(gameObjectValue, this)
    })

    this.characters.forEach((character, i) => {
      character.deserialize(value['characters'][i])
    })
  }

  tick(frame: number) {
    const eventQueue = new EventQueue(true);
    this.world.step(eventQueue);
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      this.handleCollision(handle1, handle2, started)
    })
    this.gameObjects.forEach((gameObject) => {
      gameObject.tick(frame)
    })
    this.gameObjects = this.gameObjects.filter((gameObject) => {
      return !gameObject.markedForDeletion
    })

  }

  render(c: CanvasRenderingContext2D, frame: number) {
    // Set rendering size to actual pixel size (to render at the best possible resolution)
    const canvasElementWidth = c.canvas.getBoundingClientRect().width
    const canvasElementHeight = c.canvas.getBoundingClientRect().height
    c.canvas.width = canvasElementWidth;
    c.canvas.height = canvasElementHeight;

    // flip canvas y-axis: to make box2d & canvas coordinate systems match y-direction (bottom-up)
    c.transform(1, 0, 0, -1, 0, c.canvas.height)

    // Scale so that we can use our own units when drawing with coordinates
    const xScaling = c.canvas.width / this.unitWidth;
    const yScaling = c.canvas.height / this.unitHeight;
    const squareScaling = Math.min(xScaling, yScaling);
    c.scale(squareScaling, squareScaling);

    this.renderBackground(c)
    this.renderGameObjects(c, frame)
  }

  addGameObject(newObject: GameObject){
    this.gameObjects.push(newObject);
  }

  addCharacter(newCharacter: Character) {
    this.characters.push(newCharacter);
  }

  handleCollision(colliderHandle1: ColliderHandle, colliderHandle2: ColliderHandle, started: boolean) {
    for (const gameObj of this.gameObjects) {
      if (gameObj.colliderHandle === colliderHandle1) {
        gameObj.handleCollision(colliderHandle2, started)
      }
      else if (gameObj.colliderHandle === colliderHandle2) {
        gameObj.handleCollision(colliderHandle1, started)
      }
    }
  }
  
  private renderGameObjects(c: CanvasRenderingContext2D, frame: number) {
    this.gameObjects.forEach(gameObject => {      
      gameObject.render(c, frame)
    })
  }

  private renderBackground(c: CanvasRenderingContext2D) {
    c.fillStyle = 'rgb(255, 255, 255)';
    c.fillRect(0, 0, c.canvas.width, c.canvas.height);
  }
}
