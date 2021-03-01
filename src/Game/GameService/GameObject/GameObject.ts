import CanvasService from "@/Game/CanvasService/CanvasService"
import { b2Body } from "@/lib/Box2D/Box2D";
import { Scene } from "../Scene/Scene";


export default abstract class GameObject {
  abstract scene: Scene;
  abstract body: b2Body; // Should all objects have bodies? Can use sensor-bodies if no collisions wanted. But still unnecessary a lot of the time.

  abstract render(canvas: CanvasService): void;
  tick(){
    0; // so the compiler doesn't complain.
  }
}