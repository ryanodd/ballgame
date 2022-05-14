import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2FixtureDef, b2PolygonShape, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { Collider, ColliderDesc } from "@dimforge/rapier2d";
import { CollisionType } from "../../CollisionListener/Collision";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface WallProps extends GameObjectProps {
  w: number;
  h: number;
}

export default class Wall extends GameObject { // extend something general?
  scene: Scene;
  collider: Collider;
  body: b2Body;
  
  constructor(props: WallProps){
    super();
    this.scene = props.scene;
    this.collider = this.createCollider(props);
  }

  createCollider(props: WallProps){
    const groundColliderDesc = ColliderDesc.cuboid(props.w, props.h);
    const returnCollider = this.scene.world.createCollider(groundColliderDesc);
    return returnCollider;
  }

  // No tick

  render(canvas: HTMLCanvasElement){
    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(209, 225, 235)';

    const { x: halfX, y: halfY } = this.collider.halfExtents()
    const { x: xPosition, y: yPosition} = this.collider.translation();
    const rotation = this.collider.rotation()

    c.translate( xPosition, yPosition ); // todo maybe correct this to account for center vs corner
    c.rotate(rotation*Math.PI/180);
    c.rect( -halfX, -halfY, halfX, halfY);
    c.fill();
  }
}
