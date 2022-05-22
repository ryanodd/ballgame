import { ColliderHandle, RigidBodyHandle } from "@dimforge/rapier2d";
import { JSONObject } from "../../../lib/netplayjs";
import { Scene } from "../Scene/Scene";

export interface GameObjectPhysicsProps {
  x: number;
  y: number;
}

export interface GameObjectPhysicsHandles {
  colliderHandle: ColliderHandle | null;
  rigidBodyHandle: RigidBodyHandle | null;
}

export interface GameObjectProps {
  physics?: GameObjectPhysicsProps | GameObjectPhysicsHandles;
  scene: Scene;
  spawnFrame?: number;
}

export interface BodyGameObject extends GameObject {
  rigidBodyHandle: RigidBodyHandle
}

export default abstract class GameObject {
  abstract id: string;
  abstract scene: Scene;
  abstract colliderHandle: ColliderHandle | null;
  abstract rigidBodyHandle: RigidBodyHandle | null;
  abstract spawnFrame: number;
  markedForDeletion: boolean = false;

  serialize(): JSONObject  {
    return {
      colliderHandle: this.colliderHandle,
      rigidBodyHandle: this.rigidBodyHandle,
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
