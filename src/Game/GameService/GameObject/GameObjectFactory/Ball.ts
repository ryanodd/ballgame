import { Collider, ColliderDesc, ColliderHandle, RigidBody, RigidBodyDesc, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONObject, JSONValue } from "../../../../lib/netplayjs";
import { Scene } from "../../Scene/Scene";
import { CollisionGroups } from "../CollisionGroups";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps, isPhysicsProps } from "../GameObject";

export interface BallPhysicsProps extends GameObjectPhysicsProps {
  r: number;
  density: number;
  friction: number;
  restitution: number;
}

export interface BallPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
}


export interface BallProps extends GameObjectProps {
  physics: BallPhysicsProps | BallPhysicsHandles;
}


export const BALL_OBJ_ID = 'Ball'
export const isBallObject = (o: GameObject): o is Ball => {
  return o.id === BALL_OBJ_ID
}

export default class Ball extends GameObject {
  id = BALL_OBJ_ID;
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];

  constructor(props: BallProps) {
    super(props);

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
    }
  };

  static deserialize(value: any, scene: Scene): Ball {
    return new Ball({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandles: value['colliderHandles'],
        rigidBodyHandles: value['rigidBodyHandles'],
      }
    })
  }

  createColliderAndRigidBody(props: BallPhysicsProps) {
    const rigidBodyDesc = RigidBodyDesc.dynamic()
      .setCanSleep(false);
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = ColliderDesc.ball(props.r)
      .setTranslation(props.x, props.y)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
      .setCollisionGroups(CollisionGroups.BALL)
    const collider = this.scene.world.createCollider(colliderDesc, rigidBody.handle);

    return { collider, rigidBody };
  }

  // No tick

  render(c: CanvasRenderingContext2D) {
    const collider = this.scene.world.getCollider(this.colliderHandles[0])
    const { x: xPosition, y: yPosition } = collider.translation();
    const radius = collider.radius()
    const rotation = collider.rotation()

    c.save()
    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true);

    // TODO maybe try c.rotate(rotation) to avoid the COSing
    const gradient = c.createRadialGradient(
      xPosition + (Math.cos(rotation) * (radius / 3)),
      yPosition + (Math.sin(rotation) * (radius / 3)),
      radius / 7,

      xPosition,
      yPosition,
      radius
    );

    if (this.scene.session.scoringTeamIndex === null) {
      gradient.addColorStop(0, 'rgb(255, 110, 124)');
      gradient.addColorStop(1, 'rgb(255, 51, 68)');
    } else {
      const otherTeamIndex = (this.scene.session.scoringTeamIndex + 1) % 2 // assumes 2 teams
      gradient.addColorStop(0, this.scene.session.teams[otherTeamIndex].color);
      gradient.addColorStop(1, this.scene.session.teams[otherTeamIndex].color);
    }

    
    c.fillStyle = gradient;
    c.fill();
    c.restore()
  }
}
