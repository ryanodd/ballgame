import { ColliderHandle } from "@dimforge/rapier2d";
import { Scene } from "../Scene/Scene";

// This is used in place of 'any' for arbitrary data we want to attach to a b2 body.
// The arbitrary data is needed because collisions trigger callbacks only with access to this arbitrary data.
export interface BodyUserData {
  gameObject: GameObject;
}

export interface GameObjectProps {
  scene: Scene;

  x: number;
  y: number;
} 

export default abstract class GameObject {
  abstract scene: Scene;
  colliderHandle: ColliderHandle | null = null;
  markedForDeletion = false;

  abstract render(canvas: HTMLCanvasElement): void;
  tick(){
    0; // so the compiler doesn't complain.
  }
  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean): void {
    0;// so the compiler doesn't complain.
  }
}
