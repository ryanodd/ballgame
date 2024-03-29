import { ColliderHandle, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
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
  colliderHandles: ColliderHandle[] = [];
  rigidBodyHandles: RigidBodyHandle[] = [];
  x: number;
  y: number;
  lifespanFrames = 13
  pulseRadius = 4

  constructor(props: RepelGraphicProps) {
    super(props)
    this.x = props.physics.x;
    this.y = props.physics.y;
  }

  serialize(): any {
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
    if (frame >= (this.spawnFrame + this.lifespanFrames)) {
      this.markedForDeletion = true
    }
  }

  render(c: CanvasRenderingContext2D, frame: number): void {
    const progress = ((frame - this.spawnFrame) / this.lifespanFrames)
    const radius = this.pulseRadius * progress
    const opacity = 1 - progress

    c.save()
    c.beginPath();
    c.arc(this.x, this.y, radius, 0, Math.PI * 2, true);

    const gradient = c.createRadialGradient(
      this.x,
      this.y,
      radius * (1 / 4),

      this.x,
      this.y,
      radius * (3 / 4),
    );
    const color = '245, 111, 27'
    gradient.addColorStop(0, `rgba(${color}, ${opacity / 3})`);
    gradient.addColorStop(0.8, `rgba(${color}, ${opacity})`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);
    c.fillStyle = gradient;
    c.fill();
    c.restore()
  }
}
