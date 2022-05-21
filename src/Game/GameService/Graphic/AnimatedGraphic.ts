import { Graphic, GraphicProps } from "./Graphic";


export type AnimatedGraphicProps = {
  firstFrame: number,
}  & GraphicProps

// Not part of the physics world. Just drawn to the canvas
// Todo draw in the foreground OR background? Code wouldn't be here but you know
export abstract class AnimatedGraphic extends Graphic {
  firstFrame: number;
  abstract lifespanFrames: number;

  constructor(props: AnimatedGraphicProps) {
    super(props)
    this.firstFrame = props.firstFrame
  }

  abstract draw(c: CanvasRenderingContext2D, frame: number): void
}
