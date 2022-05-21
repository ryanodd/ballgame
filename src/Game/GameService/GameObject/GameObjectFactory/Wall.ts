import { Collider, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps } from "../GameObject";

export interface WallProps extends GameObjectProps {
  w: number;
  h: number;
  rotation?: number;
}

export const WALL_OBJ = 'Wall'
export const isWallObject = (o: GameObject): o is Wall => {
  return o.id === WALL_OBJ
}
// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class Wall extends GameObject { // extend something general?
  id = WALL_OBJ;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: null = null;
  
  constructor(props: WallProps) {
    super();
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    this.colliderHandle = this.createCollider(props);
  }

  createCollider(props: WallProps){
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation((props.rotation ?? 0)*Math.PI/180)
    const returnColliderHandle = this.scene.world.createCollider(groundColliderDesc).handle;
    return returnColliderHandle;
  }

  // No tick

  render(c: CanvasRenderingContext2D ){
    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: halfX, y: halfY } = collider.halfExtents()
    const { x: xPosition, y: yPosition} = collider.translation();
    const rotation = collider.rotation()

    c.beginPath()
    c.fillStyle = 'rgb(60, 60, 60)';
    c.fillRect( xPosition - halfX, yPosition - halfY, halfX*2, halfY*2);
  }
}
