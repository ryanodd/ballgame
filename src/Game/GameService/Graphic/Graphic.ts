

export type GraphicProps = {
  xPosition: number;
  yPosition: number;
} 

// Not part of the physics world. Just drawn to the canvas
// Todo draw in the foreground OR background? Code wouldn't be here but you know
export abstract class Graphic {
  xPosition: number;
  yPosition: number;
  markedForDeletion: boolean;

  constructor(props: GraphicProps) {
    this.xPosition = props.xPosition
    this.yPosition = props.yPosition
    this.markedForDeletion = false;
  }

  abstract draw(c: CanvasRenderingContext2D, frame: number): void
}
