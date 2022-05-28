import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps, BodyGameObject, GameObjectPhysicsProps, GameObjectPhysicsHandles, isPhysicsProps } from "../GameObject";
import { Collider, ColliderDesc, ColliderHandle, RigidBodyDesc, RigidBodyHandle, Vector2 } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
import { Character } from "../../Player/Character";
import { ShipCharacter } from "../../Player/PlayerTypes/ShipCharacter";
import { CollisionGroups } from "../CollisionGroups";
import { produceWithPatches } from "immer";

export interface ShipCharacterObjectPhysicsProps extends GameObjectPhysicsProps {
  halfWidth: number;
  halfLength: number;
  tailLength: number;

  density: number;
  friction: number;
  restitution: number;
}

export interface ShipCharacterObjectPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
}

export interface ShipCharacterObjectProps extends GameObjectProps {
  physics: ShipCharacterObjectPhysicsProps | ShipCharacterObjectPhysicsHandles;
  playerIndex: number
}

export const SHIP_OBJ_ID = 'Ship'
export const isShipCharacterObject = (o: GameObject): o is ShipCharacterObject => {
  return o.id === SHIP_OBJ_ID
}

export default class ShipCharacterObject extends GameObject implements BodyGameObject { // extend something general?
  id = SHIP_OBJ_ID
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
  playerIndex: number;

  constructor(props: ShipCharacterObjectProps) {
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

  static deserialize(value: any, scene: Scene): ShipCharacterObject {
    return new ShipCharacterObject({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: value['rigidBodyHandles'],
      },
      playerIndex: value['playerIndex'],
    })
  }

  createCollidersAndRigidBody(props: ShipCharacterObjectPhysicsProps) {
    const rigidBodyDesc = RigidBodyDesc.dynamic();
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    const points1 = new Float32Array([
      0, props.halfLength,
      -props.halfWidth, -props.halfLength,
      0, -(props.halfLength - props.tailLength),
    ])

    const points2 = new Float32Array([
      0, props.halfLength,
      props.halfWidth, -props.halfLength,
      0, -(props.halfLength - props.tailLength),
    ])

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc1 = (ColliderDesc.roundConvexHull(points1, 0.1) as ColliderDesc)
      .setTranslation(props.x, props.y)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
      .setCollisionGroups(CollisionGroups.SOLID_CHARACTERS)

    const colliderDesc2 = (ColliderDesc.roundConvexHull(points2, 0.1) as ColliderDesc)
      .setTranslation(props.x, props.y)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
      .setCollisionGroups(CollisionGroups.SOLID_CHARACTERS)

    const collider1 = this.scene.world.createCollider(colliderDesc1, rigidBody.handle);
    const collider2 = this.scene.world.createCollider(colliderDesc2, rigidBody.handle);
    return { colliders: [collider1, collider2], rigidBody };
  }

  render(c: CanvasRenderingContext2D, frame: number) {
    const collider1 = this.scene.world.getCollider(this.colliderHandles[0])
    const collider2 = this.scene.world.getCollider(this.colliderHandles[1])
    
    const { x: xPosition, y: yPosition } = collider1.translation()
    const rotation = collider1.rotation()
    const listOfVertices1 = collider1.vertices().map(v => v.valueOf())
    const listOfVertices2 = collider2.vertices().map(v => v.valueOf())

    const character = this.scene.characters[this.playerIndex] as ShipCharacter

    c.save()

    // Don't know of a better way to do this https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
    c.translate(xPosition, yPosition)
    c.rotate(rotation)
    c.translate(-xPosition, -yPosition)

    c.moveTo(xPosition, yPosition)
    c.beginPath()
    for (let x = 0; x < listOfVertices1.length; x += 2) {
      c.lineTo(xPosition + listOfVertices1[x], yPosition + listOfVertices1[x+1])
    }
    for (let x = 0; x < listOfVertices2.length; x += 2) {
      c.lineTo(xPosition + listOfVertices2[x], yPosition + listOfVertices2[x+1])
    }
    c.fillStyle = this.scene.teams[character.player.teamIndex].color;
    c.fill()
    c.restore()
  }
}
