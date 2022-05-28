import { ActiveEvents, ColliderDesc, ColliderHandle, RigidBodyHandle, World } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
import { Scene } from "../../Scene/Scene";
import { CollisionGroups } from "../CollisionGroups";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps, isPhysicsProps } from "../GameObject";
import { isBallObject } from "./Ball";

export interface GoalAreaPhysicsProps extends GameObjectPhysicsProps {
  w: number;
  h: number;
  rotation?: number;
}

export interface GoalAreaPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
}

export interface GoalAreaProps extends GameObjectProps {
  physics: GoalAreaPhysicsProps | GoalAreaPhysicsHandles;
  teamIndex: number,
}

export const GOAL_AREA_OBJ_ID = 'GoalArea'
export const isGoalAreaObject = (o: GameObject): o is GoalArea => {
  return o.id === GOAL_AREA_OBJ_ID
}
export default class GoalArea extends GameObject { // extend something general?
  id = GOAL_AREA_OBJ_ID;

  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[] = [];

  teamIndex: number;

  constructor(props: GoalAreaProps) {
    super(props);
    this.teamIndex = props.teamIndex;

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
      teamIndex: this.teamIndex,
    }
  };

  static deserialize(value: any, scene: Scene): GoalArea {
    return new GoalArea({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: [],
      },
      teamIndex: value['teamIndex'],
    })
  }

  createCollider(props: GoalAreaPhysicsProps) {
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation((props.rotation ?? 0) * Math.PI / 180)
      .setActiveEvents(ActiveEvents.COLLISION_EVENTS)
      .setCollisionGroups(CollisionGroups.WALLS)

    // // Sensor: no collisions triggered, only collision detection
    // fixDef.isSensor = true;

    // bodyDef.type = b2BodyType.b2_staticBody;
    // const userData: BodyUserData = {
    //   gameObject: this,
    //   collisionType: CollisionType.GOAL,
    // }
    // bodyDef.userData = userData;

    const returnColliderHandle = this.scene.world.createCollider(groundColliderDesc).handle;
    return returnColliderHandle;
  }

  // No tick

  render(c: CanvasRenderingContext2D) {
    const collider = this.scene.world.getCollider(this.colliderHandles[0])
    const { x: halfX, y: halfY } = collider.halfExtents()
    const { x: xPosition, y: yPosition } = collider.translation();
    const rotation = collider.rotation()

    const color = this.scene.teams[this.teamIndex].color;

    c.save()
    c.beginPath()
    c.fillStyle = color;
    c.fillRect(xPosition - halfX, yPosition - halfY, halfX * 2, halfY * 2);
    c.restore()
  }

  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean) {
    const otherGameObject = this.scene.gameObjects.find((gameObject) => {
      return gameObject.colliderHandles.includes(oppositeColliderHandle)
    })
    if (started && otherGameObject && isBallObject(otherGameObject)) {
      this.scene.session.onGoalAgainst(this.teamIndex)
    }
  }
}
