import CanvasController from "@/Game/CanvasService/CanvasService";
import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2FixtureDef, b2PolygonShape, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { CollisionType } from "../../CollisionListener/Collision";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface WallProps extends GameObjectProps {
  w: number;
  h: number;
}

export default class Wall extends GameObject { // extend something general?
  scene: Scene;
  body: b2Body;
  
  constructor(props: WallProps){
    super();
    this.scene = props.scene;
    this.body = this.createBody(props);
  }

  createBody(props: WallProps){
    const bodyDef = new b2BodyDef();
    const fixDef = new b2FixtureDef();

    fixDef.density = 1.0;
    fixDef.friction = 0.0;
    fixDef.restitution = 0.5;
    
    fixDef.shape = new b2PolygonShape().SetAsBox(props.w / 2 , props.h / 2);
    
    bodyDef.position.Set(props.x + (props.w / 2) , props.y + (props.h / 2));
    
    // Were found in Ball sample code
    // bodyDef.linearDamping = 0.0;
    // bodyDef.angularDamping = 0.0;
    
    bodyDef.type = b2BodyType.b2_staticBody;
    const userData: BodyUserData = {
      gameObject: this,
      collisionType: CollisionType.DEFAULT,
    }
    bodyDef.userData = userData;
    
    const returnBody = this.scene.world.CreateBody( bodyDef );
    returnBody.CreateFixture(fixDef);
    return returnBody;
  }

  // No tick

  render(canvas: CanvasController){
    const c = canvas.context;
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