import { ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { JSONObject } from "../../../../lib/netplayjs";
// import { GRASS_IMAGE } from "../../../AssetService/assetService";
import { Scene } from "../../Scene/Scene";
import { CollisionGroups } from "../CollisionGroups";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps, isPhysicsProps } from "../GameObject";

export interface ImageWallPhysicsProps extends GameObjectPhysicsProps {
  w: number;
  h: number;
  rotation?: number;
}

export interface ImageWallPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandle: ColliderHandle;
}


export interface ImageWallProps extends GameObjectProps {
  physics: ImageWallPhysicsProps | ImageWallPhysicsHandles;
}

export const IMAGE_WALL_OBJ_ID = 'ImageWall'
export const isImageWallObject = (o: GameObject): o is ImageWall => {
  return o.id === IMAGE_WALL_OBJ_ID
}
// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class ImageWall extends GameObject { // extend something general?
  id = IMAGE_WALL_OBJ_ID;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: null = null;
  
  constructor(props: ImageWallProps) {
    super();
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    if (isPhysicsProps(props.physics)) {
      this.colliderHandle = this.createCollider(props.physics);
    }
    else {
      this.colliderHandle = props.physics.colliderHandle
    }
  }

  serialize(): JSONObject {
    return {
      ...super.serialize(),
      id: this.id,
    }
  };

  static deserialize(value: any, scene: Scene): ImageWall {
    return new ImageWall({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandle: value['colliderHandle'],
        rigidBodyHandle: null,
      },
    })
  }

  createCollider(props: ImageWallPhysicsProps){
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation((props.rotation ?? 0)*Math.PI/180)
      .setCollisionGroups(CollisionGroups.WALLS)
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
