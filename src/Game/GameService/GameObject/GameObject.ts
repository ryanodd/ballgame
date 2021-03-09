import CanvasService from "@/Game/CanvasService/CanvasService"
import { b2Body } from "@/lib/Box2D/Box2D";
import { CollisionType } from "../CollisionListener/Collision";
import { Scene } from "../Scene/Scene";


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

  abstract render(canvas: CanvasService): void;
  tick(){
    0; // so the compiler doesn't complain.
  }
}