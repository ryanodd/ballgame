import { Collider, ColliderDesc, ColliderHandle, RigidBody, RigidBodyDesc, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONObject } from "../../../../lib/netplayjs";
import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectPhysicsHandles, GameObjectPhysicsProps, GameObjectProps } from "../GameObject";

export interface BallPhysicsProps extends GameObjectPhysicsProps {
  r: number;
  density: number;
  friction: number;
  restitution: number;
}

export interface BallPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandle: ColliderHandle;
  rigidBodyHandle: RigidBodyHandle;
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
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: RigidBodyHandle;
  
  constructor(props: BallProps){
    super();
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;

    if ('x' in props.physics) {
      const { collider, rigidBody } = this.createColliderAndRigidBody(props.physics);
      this.colliderHandle = collider.handle
      this.rigidBodyHandle = rigidBody.handle
    }
    else {
      this.colliderHandle = props.physics.colliderHandle
      this.rigidBodyHandle = props.physics.rigidBodyHandle
    }
  }

  serialize(): JSONObject {
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
        colliderHandle: value['colliderHandle'],
        rigidBodyHandle: value['rigidBodyHandle'],
      }
    })
  }

  createColliderAndRigidBody(props: BallPhysicsProps){
    const rigidBodyDesc = RigidBodyDesc.dynamic();
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = ColliderDesc.ball(props.r)
      .setTranslation(props.x + props.r, props.y + props.r)
      .setDensity(props.density)
      .setFriction(props.friction)
      .setRestitution(props.restitution)
    const collider = this.scene.world.createCollider(colliderDesc, rigidBody.handle);
    
    return { collider, rigidBody };
  }

  // No tick

  render(c: CanvasRenderingContext2D ){
    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: xPosition, y: yPosition} = collider.translation(); 
    const radius = collider.radius()
    const rotation = collider.rotation()
    
    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true);

    const gradient = c.createRadialGradient(
      xPosition+(Math.cos(rotation)*(radius/3)),
      yPosition+(Math.sin(rotation)*(radius/3)),
      radius/7,

      xPosition,
      yPosition,
      radius
    );
    gradient.addColorStop(0, 'rgb(255, 110, 124)');
    gradient.addColorStop(1, 'rgb(255, 51, 68)');
    c.fillStyle = gradient;
    c.fill();
  }
}
