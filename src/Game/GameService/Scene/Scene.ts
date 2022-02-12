import { b2World } from "@/lib/Box2D/Box2D";
import { ContactListener } from "../CollisionListener/CollisionListener";
import GameObject from "../GameObject/GameObject";

export interface SceneProps {
  world: b2World;
  unitWidth: number;
  unitHeight: number;
  gameObjects: GameObject[];
}

export class Scene {
  world: b2World;
  unitWidth: number;
  unitHeight: number;
  gameObjects: GameObject[];

  constructor(props: SceneProps){
    this.world = props.world;
    this.unitWidth = props.unitWidth;
    this.unitHeight = props.unitHeight;
    this.gameObjects = props.gameObjects;

    this.setup();
  }

  setup() {
    this.world.SetContactListener(ContactListener);
  }

  render(canvas: HTMLCanvasElement) {
    const xScaling = canvas.width / this.unitWidth;
    const yScaling = canvas.height / this.unitHeight;
    const squareScaling = Math.min(xScaling, yScaling);
    canvas.getContext('2d').scale(squareScaling, squareScaling);

    this.renderBackground(canvas)
    this.renderGameObjects(canvas)
  }

  addGameObject(newObject: GameObject){
    this.gameObjects.push(newObject);
  }
  
  private renderGameObjects(canvas: HTMLCanvasElement) {
    this.gameObjects.forEach(gameObject => {
      gameObject.render(canvas)
    })
  }

  private renderBackground(canvas: HTMLCanvasElement) {
    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(42, 43, 49)';
    c.fillRect(0, 0, canvas.width, canvas.height);
  }
}
