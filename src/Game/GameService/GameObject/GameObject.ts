import { ColliderHandle, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONValue } from "../../../lib/netplayjs";
import { Scene } from "../Scene/Scene";

export const isPhysicsProps = (physics: GameObjectPhysicsProps | GameObjectPhysicsHandles): physics is GameObjectPhysicsProps => {
  return 'x' in physics
}

export interface GameObjectPhysicsProps {
  x: number;
  y: number;
}

export interface GameObjectPhysicsHandles {
  colliderHandles: ColliderHandle[];
  rigidBodyHandles: RigidBodyHandle[];
}

export interface GameObjectProps {
  physics?: GameObjectPhysicsProps | GameObjectPhysicsHandles;
  spawnFrame?: number // intended only to be used during deserializing construction
  scene: Scene;
}

export interface BodyGameObject extends GameObject {
  rigidBodyHandles: RigidBodyHandle[]
}

export default abstract class GameObject {
  abstract id: string;
  scene: Scene;
  spawnFrame: number;
  abstract colliderHandles: ColliderHandle[];
  abstract rigidBodyHandles: RigidBodyHandle[];
  markedForDeletion: boolean = false;

  constructor(props: GameObjectProps) {
    this.scene = props.scene
    this.spawnFrame = props.spawnFrame ?? props.scene.session.frame
  }

  serialize(): any  {
    return {
      colliderHandles: this.colliderHandles,
      rigidBodyHandles: this.rigidBodyHandles,
      spawnFrame: this.spawnFrame,
      markedForDeletion: this.markedForDeletion,
    }
  }

  abstract render(c: CanvasRenderingContext2D, frame: number): void;
  tick(frame: number){
  }
  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean): void {
  }
}
