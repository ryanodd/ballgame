import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2FixtureDef, b2PolygonShape, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { CollisionType } from "../../CollisionListener/Collision";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface ShipBulletProps extends GameObjectProps {
  w: number;
  h: number;
  angle: number;
}

export default class ShipBullet extends GameObject { // extend something general?
  scene: Scene;
  body: b2Body;
  lastShotTime: number;
  
  constructor(props: ShipBulletProps){
    super();
    this.scene = props.scene;
    this.body = this.createBody(props);
  }

  createBody(props: ShipBulletProps){
    const SHOOT_FORCE_MULTIPLIER = 1;
  
    const bodyDef = new b2BodyDef();
    const fixDef = new b2FixtureDef();

    fixDef.density = 1.0;
    fixDef.friction = 0.0;
    fixDef.restitution = 0.5;

    bodyDef.linearDamping = 0.0;
    bodyDef.angularDamping = 0.0;
    
    fixDef.shape = new b2PolygonShape().SetAsBox(props.w / 2 , props.h / 2);
    bodyDef.angle = props.angle;
    bodyDef.position.Set(props.x + (props.w / 2) , props.y + (props.h / 2));
    LogService.log(bodyDef.position.x)
    LogService.log(bodyDef.position.y)
    
    bodyDef.type = b2BodyType.b2_dynamicBody;
    const userData: BodyUserData = {
      gameObject: this,
      collisionType: CollisionType.BULLET,
    }
    bodyDef.userData = userData;
    
    const returnBody = this.scene.world.CreateBody( bodyDef );
    returnBody.CreateFixture(fixDef)

    // Before returning: add a huge force to this bullet
    const shootForceDirection = new b2Vec2(Math.cos(props.angle), Math.sin(props.angle)) 
    returnBody.ApplyLinearImpulseToCenter(shootForceDirection.SelfMul(SHOOT_FORCE_MULTIPLIER))

    return returnBody;
  }

  // No tick

  afterCollisionWithAny(){
    this.markedForDeletion = true;
  }

  render(canvas: HTMLCanvasElement){
    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(209, 225, 235)';

    const shape: b2PolygonShape = this.body.GetFixtureList().GetShape() as b2PolygonShape;
    const body: b2Body = this.body;
    const position: b2Vec2 = body.GetPosition();

    const vertices = shape.m_vertices;
    c.beginPath();
    for (let i = 0; i < shape.m_count; i++){
      const outputVec = new b2Vec2(0, 0);
      body.GetWorldPoint(vertices[i], outputVec);
      if (i === 0){
        c.moveTo(outputVec.x, outputVec.y);
      }
      else{
        c.lineTo(outputVec.x, outputVec.y);
      }
    }
    c.fill();
  }
}
