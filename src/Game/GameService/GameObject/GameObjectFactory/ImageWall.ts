import { ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
// import { GRASS_IMAGE } from "../../../AssetService/assetService";
import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps } from "../GameObject";

export interface PicWallProps extends GameObjectProps {
  w: number;
  h: number;
  rotation?: number;
}

export const PIC_WALL_OBJ = 'PicWall'
export const isPicWallObject = (o: GameObject): o is PicWall => {
  return o.id === PIC_WALL_OBJ
}
// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class PicWall extends GameObject { // extend something general?
  id = PIC_WALL_OBJ;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: null = null;
  
  constructor(props: PicWallProps) {
    super();
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    this.colliderHandle = this.createCollider(props);
  }

  createCollider(props: PicWallProps){
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

    // c.drawImage(GRASS_IMAGE, xPosition, yPosition, halfX*2, halfY*2);
  }
}
