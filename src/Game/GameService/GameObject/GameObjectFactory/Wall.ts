import { Collider, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
import { Scene } from "../../Scene/Scene";
import { CollisionGroups } from "../CollisionGroups";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps, isPhysicsProps } from "../GameObject";

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
}

export const WALL_OBJ_ID = 'Wall'
export const isWallObject = (o: GameObject): o is Wall => {
  return o.id === WALL_OBJ_ID
}
// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class Wall extends GameObject { // extend something general?
  id = WALL_OBJ_ID;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: null = null;
  
  constructor(props: WallProps) {
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

  serialize(): JSONValue {
    return {
      ...super.serialize(),
      id: this.id,
    }
  };

  static deserialize(value: any, scene: Scene): Wall {
    return new Wall({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandle: value['colliderHandle'],
        rigidBodyHandle: null,
      },
    })
  }

  createCollider(props: WallPhysicsProps){
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

    c.beginPath()
    c.fillStyle = 'rgb(60, 60, 60)';
    c.fillRect( xPosition - halfX, yPosition - halfY, halfX*2, halfY*2);
  }
}
