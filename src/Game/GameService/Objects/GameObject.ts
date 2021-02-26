import { InputResult } from "@/Game/InputService/model/InputResult";
import CanvasService from "@/Game/CanvasService/CanvasService"
import { b2Body } from "@/lib/Box2D/Box2D";


export default abstract class GameObject {
  abstract body: b2Body;
  abstract tick(input: InputResult): void;
  abstract render(canvas: CanvasService): void;
}