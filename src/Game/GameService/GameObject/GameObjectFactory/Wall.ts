import RAPIER, { Collider, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
import { Scene } from "../../Scene/Scene";
import { CollisionGroups } from "../CollisionGroups";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps, isPhysicsProps } from "../GameObject";

export interface WallVariationProps {
  distance: number;
  speed: number;
  direction: 'up' | 'right' | 'down' | 'left';
}

export interface WallPhysicsProps extends GameObjectPhysicsProps {
  w: number;
  h: number;
  rotation?: number;
}

export interface WallPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandle: ColliderHandle;
}

export interface WallProps extends GameObjectProps {
  physics: WallPhysicsProps | WallPhysicsHandles;
  variation?: WallVariationProps
}

export const WALL_OBJ_ID = 'Wall'
export const isWallObject = (o: GameObject): o is Wall => {
  return o.id === WALL_OBJ_ID
}
// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class Wall extends GameObject { // extend something general?
  id = WALL_OBJ_ID;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: null = null;
  variation: WallVariationProps | null;

  constructor(props: WallProps) {
    super(props);
    this.variation = props.variation ?? null

    if (isPhysicsProps(props.physics)) {
      this.colliderHandle = this.createCollider(props.physics);
    }
    else {
      this.colliderHandle = props.physics.colliderHandle
    }
  }

  serialize(): any {
    return {
      ...super.serialize(),
      id: this.id,
      variation: this.variation,
    }
  };

  static deserialize(value: any, scene: Scene): Wall {
    return new Wall({
      scene,
      spawnFrame: value['spawnFrame'],
      variation: value['variation'],
      physics: {
        colliderHandle: value['colliderHandle'],
        rigidBodyHandle: null,
      },
    })
  }

  createCollider(props: WallPhysicsProps) {
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation((props.rotation ?? 0) * Math.PI / 180)
      .setCollisionGroups(CollisionGroups.WALLS)
    const returnColliderHandle = this.scene.world.createCollider(groundColliderDesc).handle;
    return returnColliderHandle;
  }

  tick(frame: number) {
    if (this.variation !== null) {
      const time = 600 / this.variation.speed
      const distancePerFrame = this.variation.distance / time
      const frameChunk = Math.floor((frame - this.spawnFrame) / time)
      const lengthModifier = ((frameChunk % 2) === 0) ? distancePerFrame : -distancePerFrame;

      const collider = this.scene.world.getCollider(this.colliderHandle)
      const { x: halfX, y: halfY } = collider.halfExtents()
      const { x: xPosition, y: yPosition } = collider.translation();

      if (this.variation.direction === 'up') {
        collider.setShape(new RAPIER.Cuboid(halfX, Math.max(0, halfY + (lengthModifier / 2))))
        collider.setTranslation({ x: xPosition, y: yPosition + (lengthModifier / 2) })
      } else if (this.variation.direction === 'right') {
        collider.setShape(new RAPIER.Cuboid(Math.max(0, halfX + (lengthModifier / 2)), halfY))
        collider.setTranslation({ x: xPosition + (lengthModifier / 2), y: yPosition })
      } else if (this.variation.direction === 'down') {
        collider.setShape(new RAPIER.Cuboid(halfX, Math.max(0, halfY + (lengthModifier / 2))))
        collider.setTranslation({ x: xPosition, y: yPosition - (lengthModifier / 2) })
      } else if (this.variation.direction === 'left') {
        collider.setShape(new RAPIER.Cuboid(Math.max(0, halfX + (lengthModifier / 2)), halfY))
        collider.setTranslation({ x: xPosition - (lengthModifier / 2), y: yPosition })
      }
    }
  }

  render(c: CanvasRenderingContext2D) {
    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: halfX, y: halfY } = collider.halfExtents()
    const { x: xPosition, y: yPosition } = collider.translation();
    const rotation = collider.rotation()

    c.save()
    c.beginPath()
    c.fillStyle = 'rgb(60, 60, 60)';
    c.fillRect(xPosition - halfX, yPosition - halfY, halfX * 2, halfY * 2);
    c.restore()
  }
}
