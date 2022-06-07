import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps, BodyGameObject, GameObjectPhysicsProps, GameObjectPhysicsHandles, isPhysicsProps } from "../GameObject";
import { Collider, ColliderDesc, ColliderHandle, RigidBodyDesc, RigidBodyHandle, Vector2 } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
import { Character } from "../../Player/Character";
import { TankCharacter } from "../../Player/PlayerTypes/TankCharacter";
import { CollisionGroups } from "../CollisionGroups";

export interface TankCharacterObjectPhysicsProps extends GameObjectPhysicsProps {
  density: number;
  friction: number;
  restitution: number;
}

export interface TankCharacterObjectPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
}

export interface TankCharacterObjectProps extends GameObjectProps {
  physics: TankCharacterObjectPhysicsProps | TankCharacterObjectPhysicsHandles;
  playerIndex: number
}

export const TANK_OBJ_ID = 'Tank'
export const isTankCharacterObject = (o: GameObject): o is TankCharacterObject => {
  return o.id === TANK_OBJ_ID
}

export default class TankCharacterObject extends GameObject implements BodyGameObject { // extend something general?
  id = TANK_OBJ_ID
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
  playerIndex: number;

  constructor(props: TankCharacterObjectProps) {
    super(props);
    this.playerIndex = props.playerIndex

    if (isPhysicsProps(props.physics)) {
      const { colliders, rigidBody } = this.createCollidersAndRigidBody(props.physics);
      this.colliderHandles = [colliders[0].handle, colliders[1].handle]
      this.rigidBodyHandles = [rigidBody.handle]
    }
    else {
      this.colliderHandles = props.physics.colliderHandles
      this.rigidBodyHandles = props.physics.rigidBodyHandles
    }
  }

  serialize(): any {
    return {
      ...super.serialize(),
      id: this.id,
      playerIndex: this.playerIndex,
    }
  };

  static deserialize(value: any, scene: Scene): TankCharacterObject {
    return new TankCharacterObject({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: value['rigidBodyHandles'],
      },
      playerIndex: value['playerIndex'],
    })
  }

  createCollidersAndRigidBody(props: TankCharacterObjectPhysicsProps) {
    const rigidBodyDesc = RigidBodyDesc.dynamic();
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    // // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = (ColliderDesc.cuboid(1, 1) as ColliderDesc)
      .setTranslation(props.x, props.y)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
      .setCollisionGroups(CollisionGroups.SOLID_CHARACTERS)

    const collider = this.scene.world.createCollider(colliderDesc, rigidBody.handle);
    return { colliders: [collider], rigidBody };
  }

  render(c: CanvasRenderingContext2D, frame: number) {
    const collider1 = this.scene.world.getCollider(this.colliderHandles[0])
    const collider2 = this.scene.world.getCollider(this.colliderHandles[1])
    
    const { x: xPosition, y: yPosition } = collider1.translation()
    const rotation = collider1.rotation()
    const listOfVertices1 = collider1.vertices().map(v => v.valueOf())
    const listOfVertices2 = collider2.vertices().map(v => v.valueOf())

    const character = this.scene.characters[this.playerIndex] as TankCharacter

    c.save()

    c.restore()
  }
}
