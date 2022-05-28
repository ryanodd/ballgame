import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps, BodyGameObject, GameObjectPhysicsProps, GameObjectPhysicsHandles, isPhysicsProps } from "../GameObject";
import { Collider, ColliderDesc, ColliderHandle, RigidBodyDesc, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONValue } from "../../../../lib/netplayjs";
import { Character } from "../../Player/Character";
import { PulseCharacter } from "../../Player/PlayerTypes/PulseCharacter";
import { CollisionGroups } from "../CollisionGroups";

export interface PulseCharacterObjectPhysicsProps extends GameObjectPhysicsProps {
  r: number;
  density: number;
  friction: number;
  restitution: number;
}

export interface PulseCharacterObjectPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
}

export interface PulseCharacterObjectProps extends GameObjectProps {
  physics: PulseCharacterObjectPhysicsProps | PulseCharacterObjectPhysicsHandles;
  playerIndex: number
}

export const PULSE_OBJ_ID = 'Pulse'
export const isPulseCharacterObject = (o: GameObject): o is PulseCharacterObject => {
  return o.id === PULSE_OBJ_ID
}

export default class PulseCharacterObject extends GameObject implements BodyGameObject { // extend something general?
  id = PULSE_OBJ_ID
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
  playerIndex: number;

  constructor(props: PulseCharacterObjectProps) {
    super(props);
    this.playerIndex = props.playerIndex

    if (isPhysicsProps(props.physics)) {
      const { collider, rigidBody } = this.createColliderAndRigidBody(props.physics);
      this.colliderHandles = [collider.handle]
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

  static deserialize(value: any, scene: Scene): PulseCharacterObject {
    return new PulseCharacterObject({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: value['rigidBodyHandles'],
      },
      playerIndex: value['playerIndex'],
    })
  }

  createColliderAndRigidBody(props: PulseCharacterObjectPhysicsProps) {
    const rigidBodyDesc = RigidBodyDesc.dynamic();
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = ColliderDesc.ball(props.r)
      .setTranslation(props.x, props.y)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
      .setCollisionGroups(CollisionGroups.GHOST_CHARACTERS)
    const collider = this.scene.world.createCollider(colliderDesc, rigidBody.handle);

    return { collider, rigidBody };
  }

  render(c: CanvasRenderingContext2D, frame: number) {
    console.log(this.colliderHandles)
    const collider = this.scene.world.getCollider(this.colliderHandles[0])
    const { x: xPosition, y: yPosition } = collider.translation();
    const radius = collider.radius()

    const character = this.scene.characters[this.playerIndex] as PulseCharacter
    const mostRecentAttractFrame = character.mostRecentAttractFrame

    c.save()

    if (frame <= mostRecentAttractFrame) {
      const ATTRACT_RADIUS = 2.5
      const ANIMATION_PERIOD = 16
      const animationFrame = frame % ANIMATION_PERIOD
      const progress = animationFrame / ANIMATION_PERIOD
      c.beginPath();

      const TRANSLATION = 0.5 // adjust based on radius.... 7r = 1.37t, 2.5r = .5t

      c.arc(xPosition, yPosition, ATTRACT_RADIUS, 0, Math.PI * 2, true); // Outer circle
      const gradient = c.createRadialGradient(
        xPosition,
        yPosition,
        TRANSLATION - ((progress) * TRANSLATION),

        xPosition,
        yPosition,
        ATTRACT_RADIUS - ((progress) * TRANSLATION),
      );
      const color = '114, 180, 207'
      const opacityDelta = 0.4 // must be < 0.5
      const opacityModifier = progress * opacityDelta
      gradient.addColorStop(0, `rgba(${color}, 0)`);
      gradient.addColorStop(0.125, `rgba(${color}, ${opacityDelta - opacityModifier})`);
      gradient.addColorStop(0.25, `rgba(${color}, 0)`);
      gradient.addColorStop(0.375, `rgba(${color}, ${2 * opacityDelta - opacityModifier})`);
      gradient.addColorStop(0.5, `rgba(${color}, 0)`);
      gradient.addColorStop(0.625, `rgba(${color}, ${opacityDelta + opacityModifier})`);
      gradient.addColorStop(0.75, `rgba(${color}, 0)`);
      gradient.addColorStop(0.875, `rgba(${color}, ${0 + opacityModifier})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      c.fillStyle = gradient;
      c.fill();
    }

    // After the attract ability, draw us above
    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true); // Outer circle
    c.fillStyle = this.scene.teams[character.player.teamIndex].color;
    c.fill();
    c.restore()
  }
}
