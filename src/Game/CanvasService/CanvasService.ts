
export default class CanvasService {
  context: CanvasRenderingContext2D;
  pixelWidth: number;
  pixelHeight: number;
  displayWidth: number;
  displayHeight: number;
  clickListeners: {(x: number, y: number): void}[] = [];
  
  onClick = (e) => {
    console.log(this.displayWidth, this.displayHeight)
    this.clickListeners.forEach(listener => {
      listener(e.layerX, e.layerY)
    })
  }

  // This might belong in Input code
  addClickListener = (listener) => {
    this.clickListeners.push(listener)
  }

  constructor (clickListeners: {(x: number, y: number): void}[] = []){
    const canvas: HTMLCanvasElement = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.clickListeners = clickListeners
    canvas.addEventListener('click', this.onClick)
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D,
    
    this.displayWidth = canvas.getBoundingClientRect().width,
    this.displayHeight = canvas.getBoundingClientRect().height

    canvas.width = this.displayWidth;
    canvas.height = this.displayHeight;

    this.pixelWidth = canvas.width;
    this.pixelHeight = canvas.height;

    // flip canvas y-axis: to make box2d & canvas coordinate systems match y-direction (bottom-up)
    this.context.transform(1, 0, 0, -1, 0, canvas.height)
  }
}
