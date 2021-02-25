import { InputResult } from "@/Game/InputService/model/InputResult";
import CanvasService from "@/Game/CanvasService/CanvasService"
import { b2Fixture } from "@/lib/Box2D/Box2D";


export default abstract class GameObject {
  abstract fixture: b2Fixture;
  abstract tick(input: InputResult, msPassed: number): void;
  abstract render(canvas: CanvasService): void;
}