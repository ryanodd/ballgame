import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps } from "../GameObject";

export interface AttractGraphicProps extends GameObjectProps {
}

export const ATTRACT_GRAPHIC_OBJ = 'AttractGraphic'
export const isWallObject = (o: GameObject): o is AttractGraphic => {
  return o.id === ATTRACT_GRAPHIC_OBJ
}
// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class AttractGraphic extends GameObject { // extend something general?
  id = ATTRACT_GRAPHIC_OBJ;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: null = null;
  rigidBodyHandle: null = null;
  x: number;
  y: number;
  lifespanFrames = 30
  pulseRadius = 2
  
  constructor(props: AttractGraphicProps) {
    super();
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    this.x = props.x;
    this.y = props.y;
  }

  // No tick

  render(c: CanvasRenderingContext2D ){
    c.beginPath()
    c.fillStyle = 'rgb(60, 60, 60)';
  }
}
