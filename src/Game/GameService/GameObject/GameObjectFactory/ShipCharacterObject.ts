import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps, BodyGameObject, GameObjectPhysicsProps, GameObjectPhysicsHandles, isPhysicsProps } from "../GameObject";
import { Collider, ColliderDesc, ColliderHandle, RigidBodyDesc, RigidBodyHandle, Vector2 } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
import { Character } from "../../Player/Character";
import { ShipCharacter } from "../../Player/PlayerTypes/ShipCharacter";
import { CollisionGroups } from "../CollisionGroups";

export interface ShipCharacterObjectPhysicsProps extends GameObjectPhysicsProps {
  halfWidth: number;
  halfLength: number;
  noseWidth: number;
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
      -props.noseWidth, props.halfLength,
      -props.halfWidth, -props.halfLength,
      0, -(props.halfLength - props.tailLength),
    ])

    const points2 = new Float32Array([
      0, props.halfLength,
      props.noseWidth, props.halfLength,
      props.halfWidth, -props.halfLength,
      0, -(props.halfLength - props.tailLength),
    ])

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc1 = (ColliderDesc.convexHull(points1) as ColliderDesc)
      .setTranslation(props.x, props.y)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
      .setCollisionGroups(CollisionGroups.SOLID_CHARACTERS)

    const colliderDesc2 = (ColliderDesc.convexHull(points2) as ColliderDesc)
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


    if (character.mostRecentThrustFrame === frame) {
      c.beginPath()
      c.fillStyle = 'rgba(255, 84, 59, 0.75)'

      const THRUST_TRIANGLE_HALF_WIDTH = 0.14
      const THRUST_TRIANGLE_LENGTH = 0.5

      c.lineTo(xPosition-THRUST_TRIANGLE_HALF_WIDTH, yPosition)
      c.lineTo(xPosition+THRUST_TRIANGLE_HALF_WIDTH, yPosition)
      c.lineTo(xPosition, yPosition-THRUST_TRIANGLE_LENGTH)
      c.fill()
      c.beginPath()
      c.fill()
    }


    c.fillStyle = this.scene.teams[character.player.teamIndex].color;

    c.beginPath()
    c.moveTo(xPosition, yPosition)
    const points = [
      {x: listOfVertices1[0], y: listOfVertices1[1]},
      {x: listOfVertices1[2], y: listOfVertices1[3]},
      {x: listOfVertices1[4], y: listOfVertices1[5]},
      {x: listOfVertices1[6], y: listOfVertices1[7]},
      {x: listOfVertices2[0], y: listOfVertices2[1]},
      {x: listOfVertices2[2], y: listOfVertices2[3]},
      {x: listOfVertices2[4], y: listOfVertices2[5]},
    ]
    for (let i = 0; i < points.length; i ++) {
      c.lineTo(xPosition + points[i].x, yPosition + points[i].y)
    }

    c.fill()

    c.restore()
  }
}
