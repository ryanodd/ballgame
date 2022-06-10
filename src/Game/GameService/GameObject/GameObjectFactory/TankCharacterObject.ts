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

  halfWidth: number;
  halfLength: number;
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
      this.colliderHandles = [colliders[0].handle]
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
    const rigidBodyDesc = RigidBodyDesc.dynamic()
      .setLinearDamping(5)
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    // // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = (ColliderDesc.cuboid(props.halfWidth, props.halfLength) as ColliderDesc)
      .setTranslation(props.x, props.y)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
      .setCollisionGroups(CollisionGroups.SOLID_CHARACTERS)

    const collider = this.scene.world.createCollider(colliderDesc, rigidBody.handle);
    return { colliders: [collider], rigidBody };
  }

  render(c: CanvasRenderingContext2D, frame: number) {
    const collider = this.scene.world.getCollider(this.colliderHandles[0])
    
    const WHEELS_HALF_WIDTH = 0.1
    const WHEELS_EXTRA_LENGTH = 0.12
    const FILL = 'rgb(60, 60, 60)'

    const { x: halfWidth, y: halfLength } = collider.halfExtents()
    const { x: xPosition, y: yPosition } = collider.translation();
    const rotation = collider.rotation()

    const character = this.scene.characters[this.playerIndex] as TankCharacter

    c.save()

    c.translate(xPosition, yPosition)
    c.rotate(rotation)
    c.translate(-xPosition, -yPosition)
    
    c.strokeStyle = this.scene.teams[character.player.teamIndex].color;
    c.lineCap = "round"
    c.lineWidth = WHEELS_HALF_WIDTH;
    c.beginPath()
    c.moveTo(
      xPosition - halfWidth,
      yPosition + halfLength + WHEELS_EXTRA_LENGTH - WHEELS_HALF_WIDTH
    )
    c.lineTo(
      xPosition - halfWidth,
      yPosition - halfLength - WHEELS_EXTRA_LENGTH + WHEELS_HALF_WIDTH
    )
    c.stroke()

    c.beginPath()
    c.moveTo(
      xPosition + halfWidth,
      yPosition + halfLength + WHEELS_EXTRA_LENGTH - WHEELS_HALF_WIDTH
    )
    c.lineTo(
      xPosition + halfWidth,
      yPosition - halfLength - WHEELS_EXTRA_LENGTH + WHEELS_HALF_WIDTH
    )
    c.stroke()

    c.fillStyle = this.scene.teams[character.player.teamIndex].color;
    c.fillRect(xPosition - halfWidth, yPosition - halfLength, halfWidth * 2, halfLength * 2);

    c.restore()
  }
}
