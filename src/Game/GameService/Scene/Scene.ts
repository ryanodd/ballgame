import GameObject from "../GameObject/GameObject";
import { World } from '@dimforge/rapier2d'

export interface SceneProps {
  world: World;
  unitWidth: number;
  unitHeight: number;
  gameObjects: GameObject[];
}

export class Scene {
  world: World;
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
    //nothin yet
  }

  render(canvas: HTMLCanvasElement) {
    // Set rendering size to actual pixel size (to render at the best possible resolution)
    const canvasElementWidth = canvas.getBoundingClientRect().width
    const canvasElementHeight = canvas.getBoundingClientRect().height
    canvas.width = canvasElementWidth;
    canvas.height = canvasElementHeight;

    // flip canvas y-axis: to make box2d & canvas coordinate systems match y-direction (bottom-up)
    canvas.getContext('2d').transform(1, 0, 0, -1, 0, canvas.height)

    // Scale so that we can use our own units when drawing with coordinates
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
    console.log(this.gameObjects)
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
