import { AnimatedGraphic, AnimatedGraphicProps } from "./AnimatedGraphic";
import { Graphic, GraphicProps } from "./Graphic";

export type PulseGraphicProps = {
} & AnimatedGraphicProps

export class PulseGraphic extends AnimatedGraphic {
  lifespanFrames = 30
  pulseRadius = 2

  constructor(props: PulseGraphicProps) {
    super(props)
  }

  draw(c: CanvasRenderingContext2D, frame: number): void {
    const radius = this.pulseRadius * ((frame - this.firstFrame) / this.lifespanFrames)
    const gradient = c.createRadialGradient(
      this.xPosition,
      this.yPosition,
      radius/7,

      this.xPosition,
      this.yPosition,
      radius
    );
    gradient.addColorStop(0, 'rgb(0, 0, 255)');
    gradient.addColorStop(1, 'rgb(0, 0, 0)');
    c.fillStyle = gradient;
    c.fill();

    if (frame >= this.firstFrame + this.lifespanFrames - 1) {
      this.markedForDeletion = true
    }
  }
}
