import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps, BodyGameObject } from "../GameObject";
import { Collider, ColliderDesc, ColliderHandle, RigidBodyDesc, RigidBodyHandle } from "@dimforge/rapier2d";

export interface PulseCharacterObjectProps extends GameObjectProps {
  r: number;
  density: number;
  friction: number;
  restitution: number;
}

export const PULSE_OBJ = 'Pulse'
export const isPulseCharacterObject = (o: GameObject): o is PulseCharacterObject => {
  return o.id === PULSE_OBJ
}

export default class PulseCharacterObject extends GameObject implements BodyGameObject { // extend something general?
  id = PULSE_OBJ
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: RigidBodyHandle;
  
  constructor(props: PulseCharacterObjectProps){
    super();
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    const { collider, rigidBody } = this.createColliderAndRigidBody(props);
    this.colliderHandle = collider.handle
    this.rigidBodyHandle = rigidBody.handle
  }

  createColliderAndRigidBody(props: PulseCharacterObjectProps){
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

  render(c: CanvasRenderingContext2D){
    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: xPosition, y: yPosition} = collider.translation(); 
    const radius = collider.radius()

    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true); // Outer circle
    c.fillStyle = 'rgb(126, 226, 151)';
    c.fill();
  }
}
