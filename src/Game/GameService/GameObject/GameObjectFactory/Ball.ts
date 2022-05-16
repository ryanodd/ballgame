import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2FixtureDef, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { Collider, ColliderDesc, ColliderHandle, RigidBody, RigidBodyDesc } from "@dimforge/rapier2d";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface BallProps extends GameObjectProps {
  r: number;
}

export default class Ball extends GameObject {
  scene: Scene;
  colliderHandle: ColliderHandle;
  body: b2Body;
  
  constructor(props: BallProps){
    super();
    this.scene = props.scene;
    this.colliderHandle = this.createCollider(props);
  }

  createCollider(props: BallProps){
    const rigidBodyDesc = RigidBodyDesc.newDynamic();
    const rigidBody = this.scene.world.createRigidBody(rigidBodyDesc);

    // Create a cuboid collider attached to the dynamic rigidBody.
    const colliderDesc = ColliderDesc.ball(props.r).setTranslation(props.x + props.r, props.y + props.r);
    const returnCollider = this.scene.world.createCollider(colliderDesc, rigidBody.handle).handle;
    
    return returnCollider;
  }

  // No tick

  render(canvas: HTMLCanvasElement){
    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(200, 0, 0)';

    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: xPosition, y: yPosition} = collider.translation(); 
    const radius = collider.radius()

    console.log(yPosition)
    
    c.beginPath();
    c.arc(xPosition, yPosition, radius, 0, Math.PI * 2, true); // Outer circle
    c.fill();
  }
}
