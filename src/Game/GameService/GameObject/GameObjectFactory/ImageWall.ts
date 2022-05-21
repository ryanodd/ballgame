import { Collider, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
// import { GRASS_IMAGE } from "../../../AssetService/assetService";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface PicWallProps extends GameObjectProps {
  w: number;
  h: number;
  rotation?: number;
}

// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class PicWall extends GameObject { // extend something general?
  scene: Scene;
  
  constructor(props: PicWallProps) {
    super();
    this.scene = props.scene;
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
