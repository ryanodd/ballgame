import CanvasController from "@/Game/CanvasService/CanvasService";
import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2FixtureDef, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { CollisionType } from "../../CollisionListener/Collision";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface BallProps extends GameObjectProps {
  r: number;
}

export default class Ball extends GameObject {
  scene: Scene;
  body: b2Body;
  
  constructor(props: BallProps){
    super();
    this.scene = props.scene;
    this.body = this.createBody(props);
  }

  createBody(props: BallProps){
    const bodyDef = new b2BodyDef();
    const fixDef = new b2FixtureDef;
    
    fixDef.density = 1.0;
    fixDef.friction = 0.6;
    fixDef.restitution = 0.9;
    
    const shape = new b2CircleShape(props.r);
    fixDef.shape = shape;
    
    bodyDef.position.Set(props.x , props.y);
    
    bodyDef.linearDamping = 0.8;
    bodyDef.angularDamping = 1.0;
    
    bodyDef.type = b2BodyType.b2_dynamicBody;
    const userData: BodyUserData = {
      gameObject: this,
      collisionType: CollisionType.BALL,
    }
    bodyDef.userData = userData;
    
    const returnBody = this.scene.world.CreateBody(bodyDef);
    returnBody.CreateFixture(fixDef);
    return returnBody;
  }

  // No tick

  render(canvas: CanvasController){
    const c = canvas.context;
    c.fillStyle = 'rgb(200, 0, 0)';

    const shape: b2CircleShape = this.body.GetFixtureList().GetShape() as b2CircleShape;
    const body: b2Body = this.body;
    const position: b2Vec2 = body.GetPosition();

    c.beginPath();
    c.arc(position.x, position.y, shape.m_radius, 0, Math.PI * 2, true); // Outer circle
    c.fill();
  }
}