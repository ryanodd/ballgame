import { b2Body } from "@/lib/Box2D/Box2D";
import { CollisionType } from "../CollisionListener/Collision";
import { Scene } from "../Scene/Scene";

// This is used in place of 'any' for arbitrary data we want to attach to a b2 body.
// The arbitrary data is needed because collisions trigger callbacks only with access to this arbitrary data.
export interface BodyUserData {
  gameObject: GameObject;
  collisionType: CollisionType;
}

export interface GameObjectProps {
  scene: Scene;

  x: number;
  y: number;
} 

export default abstract class GameObject {
  abstract scene: Scene;
  abstract body: b2Body; // Should all objects have bodies? Can use sensor-bodies if no collisions wanted. But still unnecessary a lot of the time.
  markedForDeletion = false;

  abstract render(canvas: HTMLCanvasElement): void;
  tick(){
    0; // so the compiler doesn't complain.
  }
}
