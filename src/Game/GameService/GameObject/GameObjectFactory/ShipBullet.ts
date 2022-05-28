import { ActiveEvents, ColliderDesc, ColliderHandle, RigidBody, RigidBodyDesc, RigidBodyHandle } from "@dimforge/rapier2d";
import { Scene } from "../../Scene/Scene";
import { CollisionGroups } from "../CollisionGroups";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps, isPhysicsProps } from "../GameObject";
import { isBallObject } from "./Ball";

export interface ShipBulletPhysicsProps extends GameObjectPhysicsProps {
  // w: number;
  // h: number;
  rotation: number;
}

export interface ShipBulletPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
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

  constructor(props: ShipBulletProps) {
    super(props);
    if (isPhysicsProps(props.physics)) {
      const { collider, rigidBody } = this.createColliderAndRigidBody(props.physics)
      this.colliderHandles = [collider.handle];
      this.rigidBodyHandles = [rigidBody.handle]
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

  static deserialize(value: any, scene: Scene): ShipBullet {
    return new ShipBullet({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: value['rigidBodyHandles'],
      },
    })
  }

  createColliderAndRigidBody(props: ShipBulletPhysicsProps) {
    const rigidBodyDesc = RigidBodyDesc.dynamic()
      .setCanSleep(false);
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    const RADIUS = 0.07
    const DISTANCE_FROM_SHIP_CENTER = 0.5
    const shipNoseTranslation = {
      x: -Math.sin(props.rotation) * DISTANCE_FROM_SHIP_CENTER,
      y: Math.cos(props.rotation) * DISTANCE_FROM_SHIP_CENTER,
    }
    console.log(shipNoseTranslation)

    const groundColliderDesc = ColliderDesc.ball(RADIUS)
      .setTranslation(props.x + shipNoseTranslation.x, props.y + shipNoseTranslation.y)
      // .setSensor(true)
      .setActiveEvents(ActiveEvents.COLLISION_EVENTS)
      //.setCollisionGroups(CollisionGroups.WALLS)
    const collider = this.scene.world.createCollider(groundColliderDesc, rigidBody.handle);

    const SPEED = 10
    rigidBody.setLinvel({ x: shipNoseTranslation.x*SPEED, y: shipNoseTranslation.y*SPEED}, true)
    return { collider, rigidBody };
  }

  // No tick

  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean) {
    const otherGameObject = this.scene.gameObjects.find((gameObject) => {
      return gameObject.colliderHandles.includes(oppositeColliderHandle)
    })
    if (started && otherGameObject) {
      this.markedForDeletion = true
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
