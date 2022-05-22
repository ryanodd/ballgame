import { ColliderHandle, RigidBodyHandle } from "@dimforge/rapier2d";
import { Scene } from "../Scene/Scene";

export interface GameObjectProps {
  scene: Scene;

  x: number;
  y: number;
  spawnFrame?: number;
} 

export interface BodyGameObject extends GameObject {
  rigidBodyHandle: RigidBodyHandle
}

export default abstract class GameObject {
  abstract id: string;
  abstract scene: Scene;
  abstract colliderHandle: ColliderHandle | null;
  abstract rigidBodyHandle: RigidBodyHandle | null;
  abstract spawnFrame: number;
  readonly lifespanFrames: number | null = null;
  markedForDeletion: boolean = false;

  abstract render(c: CanvasRenderingContext2D, frame: number): void;
  tick(){
  }
  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean): void {
  }
}
