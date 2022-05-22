import { JSONObject } from "../../../../lib/netplayjs";
import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps } from "../GameObject";

export interface RepelGraphicProps extends GameObjectProps {
  physics: GameObjectPhysicsProps
}

export const REPEL_GRAPHIC_OBJ_ID = 'RepelGraphic'
export const isWallObject = (o: GameObject): o is RepelGraphic => {
  return o.id === REPEL_GRAPHIC_OBJ_ID
}

export class RepelGraphic extends GameObject {
  id = REPEL_GRAPHIC_OBJ_ID;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: null = null;
  rigidBodyHandle: null = null;
  x: number;
  y: number;
  lifespanFrames = 15
  pulseRadius = 4

  constructor(props: RepelGraphicProps) {
    super()
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    this.x = props.physics.x;
    this.y = props.physics.y;
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      id: this.id,
      x: this.x,
      y: this.y,
    }
  };

  static deserialize(value: any, scene: Scene): RepelGraphic {
    return new RepelGraphic({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        x: value['x'],
        y: value['y'],
      },
    })
  }

  tick(frame: number) {
    console.log(`frame: ${frame}, spawn: ${this.spawnFrame}, life: ${this.lifespanFrames}`)
    if (frame >= (this.spawnFrame + this.lifespanFrames - 1)) {
      console.log('marking for deletions')
      this.markedForDeletion = true
    }
  }

  render(c: CanvasRenderingContext2D, frame: number): void {
    const progress = ((frame - this.spawnFrame) / this.lifespanFrames)
    const radius = this.pulseRadius * progress
    const opacity = 1 - progress

    c.beginPath();
    c.arc(this.x, this.y, radius, 0, Math.PI * 2, true);

    const gradient = c.createRadialGradient(
      this.x,
      this.y,
      radius*(1/4),

      this.x,
      this.y,
      radius*(3/4),
    );
    //console.log(`radius: ${radius}, x: ${this.x}, y: ${this.y}`)
    gradient.addColorStop(0, `rgba(242, 193, 56, ${opacity/3})`);
    gradient.addColorStop(0.8, `rgba(242, 193, 56, ${opacity})`);
    gradient.addColorStop(1, `rgba(242, 193, 56, 0)`);
    c.fillStyle = gradient;
    c.fill();
  }
}
