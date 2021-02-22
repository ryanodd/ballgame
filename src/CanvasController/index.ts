import { GameState } from "@/GameController/model/gameState";
import { CanvasProperties } from "./model/CanvasProperties";

export default class CanvasController {
  static paint(gameState: GameState) {
    const canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;

    const displayWidth = canvas.getBoundingClientRect().width;
    const displayHeight = canvas.getBoundingClientRect().height;

    // For now our logical dimensions will equal our actual canvas dimensions
    canvas.width = displayWidth;
    canvas.height = displayHeight;

    const canvasProperties: CanvasProperties = {
      context: canvas.getContext('2d') as CanvasRenderingContext2D,
      width: canvas.width,
      height: canvas.height,
      displayWidth: canvas.getBoundingClientRect().width,
      displayHeight: canvas.getBoundingClientRect().height
    }

    this.renderBackground(canvasProperties, gameState);
    this.renderForeground(canvasProperties, gameState);
  }

  // Foreground Render Methods //
  ///////////////////////////////
  static renderForeground(canvasProps: CanvasProperties, gameState: GameState) {
    const c = canvasProps.context;
    c.fillStyle = 'rgb(200, 0, 0)';
    c.fillRect(gameState.primaryPlayerX, gameState.primaryPlayerY, 10, 10)
  }

  // Background Render Methods //
  ///////////////////////////////
  static renderBackground(canvasProps: CanvasProperties, gameState: GameState) {
    const c = canvasProps.context;
    c.fillStyle = 'rgb(42, 43, 49)';
    c.fillRect(0, 0, canvasProps.width, canvasProps.height);
  }
}