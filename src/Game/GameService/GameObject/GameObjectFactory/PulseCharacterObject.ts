import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps, BodyGameObject, GameObjectPhysicsProps, GameObjectPhysicsHandles, isPhysicsProps } from "../GameObject";
import { Collider, ColliderDesc, ColliderHandle, RigidBodyDesc, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONObject } from "../../../../lib/netplayjs";
import { Character } from "../../Player/Character";


export interface PulseCharacterObjectPhysicsProps extends GameObjectPhysicsProps {
  r: number;
  density: number;
  friction: number;
  restitution: number;
}

export interface PulseCharacterObjectPhysicsHandles extends GameObjectPhysicsHandles {
  colliderHandle: ColliderHandle;
  rigidBodyHandle: RigidBodyHandle;
}



export interface PulseCharacterObjectProps extends GameObjectProps {
  physics: PulseCharacterObjectPhysicsProps | PulseCharacterObjectPhysicsHandles;
  color: string;
  mostRecentAttractFrame?: number;
}

export const PULSE_OBJ_ID = 'Pulse'
export const isPulseCharacterObject = (o: GameObject): o is PulseCharacterObject => {
  return o.id === PULSE_OBJ_ID
}

export default class PulseCharacterObject extends GameObject implements BodyGameObject { // extend something general?
  id = PULSE_OBJ_ID
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: RigidBodyHandle;
  mostRecentAttractFrame: number;
  color: string;
  
  constructor(props: PulseCharacterObjectProps){
    super();
    this.scene = props.scene;
    this.spawnFrame = props.spawnFrame ?? 0;
    this.mostRecentAttractFrame = props.mostRecentAttractFrame ?? 0; // not serializing because it's not very imporant. Just for animation: ;
    this.color = props.color

    if (isPhysicsProps(props.physics)) {
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
      color: this.color, // todo store team instead
      mostRecentAttractFrame: this.mostRecentAttractFrame, // todo retrieve from character instead
    }
  };

  static deserialize(value: any, scene: Scene): PulseCharacterObject {
    return new PulseCharacterObject({
      scene,
      spawnFrame: value['spawnFrame'],
      physics: {
        colliderHandle: value['colliderHandle'],
        rigidBodyHandle: value['rigidBodyHandle'],
      },
      color: value['color'],
      mostRecentAttractFrame: value['mostRecentAttractFrame'],
    })
  }

  createColliderAndRigidBody(props: PulseCharacterObjectPhysicsProps){
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

  render(c: CanvasRenderingContext2D, frame: number){
    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: xPosition, y: yPosition} = collider.translation(); 
    const radius = collider.radius()

    // ATTRACT ANIMATION
    if (frame <= this.mostRecentAttractFrame + 3) { // data passing tolerance
      const ATTRACT_RADIUS = 2.5
      const ANIMATION_PERIOD = 16
      const animationFrame = frame % ANIMATION_PERIOD
      const animationProgress = animationFrame / ANIMATION_PERIOD
      c.beginPath();

      c.arc(xPosition, yPosition, ATTRACT_RADIUS, 0, Math.PI * 2, true); // Outer circle
      const gradient = c.createRadialGradient(
        xPosition,
        yPosition,
        (ATTRACT_RADIUS*0.3)*(1 - (animationProgress)),

        xPosition,
        yPosition,
        (ATTRACT_RADIUS*0.8)*(1 - (animationProgress)),
      );
      console.log(animationProgress)
      gradient.addColorStop(0, `rgba(114, 180, 207, 0)`);
      gradient.addColorStop(0.5, `rgba(114, 180, 207, ${animationProgress*(2/3)})`);
      gradient.addColorStop(1, `rgba(114, 180, 207, 0)`);
      c.fillStyle = gradient;
      c.fill();
    }

    // After the attract ability, draw us above
    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true); // Outer circle
    c.fillStyle = this.color;
    c.fill();
  }
}
