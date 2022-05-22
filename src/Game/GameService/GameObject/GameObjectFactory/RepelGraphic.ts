import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps } from "../GameObject";

export interface RepelGraphicProps extends GameObjectProps {
}

export const REPEL_GRAPHIC_OBJ = 'RepelGraphic'
export const isWallObject = (o: GameObject): o is RepelGraphic => {
  return o.id === REPEL_GRAPHIC_OBJ
}

export class RepelGraphic extends GameObject {
  id = REPEL_GRAPHIC_OBJ;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: null = null;
  rigidBodyHandle: null = null;
  x: number;
  y: number;
  lifespanFrames = 30
  pulseRadius = 2

  constructor(props: RepelGraphicProps) {
    super()
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    this.x = props.x;
    this.y = props.y;
  }

  render(c: CanvasRenderingContext2D, frame: number): void {
    const radius = this.pulseRadius * ((frame - this.spawnFrame) / this.lifespanFrames)
    const gradient = c.createRadialGradient(
      this.x,
      this.y,
      radius/7,

      this.x,
      this.y,
      radius
    );
    gradient.addColorStop(0, 'rgb(0, 0, 255)');
    gradient.addColorStop(1, 'rgb(0, 0, 0)');
    c.fillStyle = gradient;
    c.fill();

    if (frame >= this.spawnFrame + this.lifespanFrames - 1) {
      this.markedForDeletion = true
    }
  }
}
