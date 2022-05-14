import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2FixtureDef, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { Collider, ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier2d";
import { CollisionType } from "../../CollisionListener/Collision";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface BallProps extends GameObjectProps {
  r: number;
}

export default class Ball extends GameObject {
  scene: Scene;
  collider: Collider;
  body: b2Body;
  
  constructor(props: BallProps){
    super();
    this.scene = props.scene;
    this.collider = this.createCollider(props);
  }

  createCollider(props: BallProps){
    const rigidBodyDesc = RigidBodyDesc.newDynamic().setTranslation(0.0, 1.0);
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = ColliderDesc.cuboid(0.5, 0.5);
    const returnCollider = this.scene.world.createCollider(colliderDesc, rigidBody.handle);
    
    return returnCollider;
  }

  // No tick

  render(canvas: HTMLCanvasElement){
    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(200, 0, 0)';

    const { x: xPosition, y: yPosition} = this.collider.translation(); 
    const radius = this.collider.radius()

    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true); // Outer circle
    c.fill();
  }
}
