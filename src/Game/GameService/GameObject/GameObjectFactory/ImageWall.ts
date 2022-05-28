import { ColliderDesc, ColliderHandle, RigidBody, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
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
  colliderHandles: ColliderHandle[];
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
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[] = [];

  constructor(props: ImageWallProps) {
    super(props);
    if (isPhysicsProps(props.physics)) {
      this.colliderHandles = [this.createCollider(props.physics)];
    }
    else {
      this.colliderHandles = props.physics.colliderHandles
    }
  }

  serialize(): any {
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
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: [],
      },
    })
  }

  createCollider(props: ImageWallPhysicsProps) {
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation((props.rotation ?? 0) * Math.PI / 180)
      .setCollisionGroups(CollisionGroups.WALLS)
    const returnColliderHandle = this.scene.world.createCollider(groundColliderDesc).handle;
    return returnColliderHandle;
  }

  // No tick

  render(c: CanvasRenderingContext2D) {
    const collider = this.scene.world.getCollider(this.colliderHandles[0])
    const { x: halfX, y: halfY } = collider.halfExtents()
    const { x: xPosition, y: yPosition } = collider.translation();
    const rotation = collider.rotation()

    c.save()
    // c.drawImage(GRASS_IMAGE, xPosition, yPosition, halfX*2, halfY*2);
    c.restore()
  }
}
