import { ActiveEvents, ColliderDesc, ColliderHandle, RigidBody, RigidBodyDesc, RigidBodyHandle, Vector, Vector2 } from "@dimforge/rapier2d";
import { normalize } from "../../../../utils/math";
import { Scene } from "../../Scene/Scene";
import { CollisionGroups } from "../CollisionGroups";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps, isPhysicsProps } from "../GameObject";
import { isBallObject } from "./Ball";

export interface ShipBulletPhysicsProps extends GameObjectPhysicsProps {
  // w: number;
  // h: number;
  radius: number;
  initialVeloicty: Vector2
}

export interface ShipBulletPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
  collidedFrame: number;
}


export interface ShipBulletProps extends GameObjectProps {
  physics: ShipBulletPhysicsProps | ShipBulletPhysicsHandles;
}

export const SHIP_BULLET_OBJ_ID = 'ShipBullet'
export const isShipBulletObject = (o: GameObject): o is ShipBullet => {
  return o.id === SHIP_BULLET_OBJ_ID
}
// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class ShipBullet extends GameObject { // extend something general?
  id = SHIP_BULLET_OBJ_ID;
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[] = [];
  collidedFrame: number;

  constructor(props: ShipBulletProps) {
    super(props);
    if (isPhysicsProps(props.physics)) {
      const { collider, rigidBody } = this.createColliderAndRigidBody(props.physics)
      this.colliderHandles = [collider.handle];
      this.rigidBodyHandles = [rigidBody.handle]
      this.collidedFrame = -2
    }
    else {
      this.colliderHandles = props.physics.colliderHandles
      this.collidedFrame = props.physics.collidedFrame
    }
  }

  serialize(): any {
    return {
      ...super.serialize(),
      id: this.id,
      collidedFrame: this.collidedFrame,
    }
  };

  static deserialize(value: any, scene: Scene): ShipBullet {
    return new ShipBullet({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: value['rigidBodyHandles'],
        collidedFrame: value['collidedFrame'],
      },
    })
  }

  createColliderAndRigidBody(props: ShipBulletPhysicsProps) {
    const rigidBodyDesc = RigidBodyDesc.dynamic()
      .setCanSleep(false);
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    const groundColliderDesc = ColliderDesc.ball(props.radius)
      .setTranslation(props.x, props.y)
      .setDensity(3.0)
      .setActiveEvents(ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(CollisionGroups.SHIP_BULLET)
    
    const collider = this.scene.world.createCollider(groundColliderDesc, rigidBody.handle);

    // todo add ship's velocity
    rigidBody.setLinvel(props.initialVeloicty, true)
    return { collider, rigidBody };
  }

  tick(frame: number) {
    if (this.collidedFrame >= 0 && this.collidedFrame < frame) {
      this.markedForDeletion = true
    }
  }

  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean) {
    if (started) {
      if (this.collidedFrame < 0) {
        this.collidedFrame = this.scene.session.frame
      }
    }
  }

  render(c: CanvasRenderingContext2D) {
    const collider = this.scene.world.getCollider(this.colliderHandles[0])
    const { x: xPosition, y: yPosition } = collider.translation();
    const radius = collider.radius()
    const rotation = collider.rotation()

    c.save()
    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true);

    c.fillStyle = 'rgb(100, 100, 100)';
    c.fill();
    c.restore()
  }
}
