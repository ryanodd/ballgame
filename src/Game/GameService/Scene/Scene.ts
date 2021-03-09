import CanvasService from "@/Game/CanvasService/CanvasService";
import { LogService } from "@/Game/LogService/LogService";
import { b2World } from "@/lib/Box2D/Box2D";
import { ContactListener } from "../CollisionListener/CollisionListener";
import GameObject from "../GameObject/GameObject";

export interface SceneProps {
  canvas: CanvasService;
  world: b2World;
  unitWidth: number;
  unitHeight: number;
  gameObjects: GameObject[];
}

export class Scene {
  canvas: CanvasService;
  world: b2World;
  unitWidth: number;
  unitHeight: number;
  gameObjects: GameObject[];

  constructor(props: SceneProps){
    this.canvas = props.canvas;
    this.world = props.world;
    this.unitWidth = props.unitWidth;
    this.unitHeight = props.unitHeight;
    this.gameObjects = props.gameObjects;

    this.setup();
  }

  setup() {
    this.world.SetContactListener(ContactListener);

    const xScaling = this.canvas.pixelWidth / this.unitWidth;
    const yScaling = this.canvas.pixelHeight / this.unitHeight;
    const squareScaling = Math.min(xScaling, yScaling);
    this.canvas.context.scale(squareScaling, squareScaling);
  }

  render() {
    this.renderBackground()
    this.renderGameObjects()
  }

  addGameObject(newObject: GameObject){
    this.gameObjects.push(newObject);
  }
  
  private renderGameObjects() {
    this.gameObjects.forEach(gameObject => {
      gameObject.render(this.canvas)
    })
  }

  private renderBackground() {
    const c = this.canvas.context;
    c.fillStyle = 'rgb(42, 43, 49)';
    c.fillRect(0, 0, this.canvas.pixelWidth, this.canvas.pixelHeight);
  }
}