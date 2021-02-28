import CanvasController from "@/Game/CanvasService/CanvasService";
import { InputResult } from "@/Game/InputService/model/InputResult";
import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2FixtureDef, b2PolygonShape, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import GameObject from "../GameObject";

export interface ShipBulletProps {
  world: b2World;
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
  options: Record<string, any>;
}

export default class ShipBullet extends GameObject { // extend something general?
  body: b2Body;
  
  constructor(props: ShipBulletProps){
    super();
    this.body = this.createBody(props);
  }

  createBody(props: ShipBulletProps){
    const bodyDef = new b2BodyDef();
    const fixDef = new b2FixtureDef();

    fixDef.density = 1.0;
    fixDef.friction = 0.0;
    fixDef.restitution = 0.5;

    bodyDef.linearDamping = 0.0;
    bodyDef.angularDamping = 1.0;
    
    fixDef.shape = new b2PolygonShape().SetAsBox(props.w / 2 , props.h / 2);
    bodyDef.angle = props.angle;
    bodyDef.position.Set(props.x + (props.w / 2) , props.y + (props.h / 2));
    
    bodyDef.type = b2BodyType.b2_dynamicBody;
    bodyDef.userData = props.options;
    
    const returnBody = props.world.CreateBody( bodyDef );
    returnBody.CreateFixture(fixDef);
    return returnBody;
  }

  tick(input: InputResult){
    // Check input, change physics, whatevs

    // Not sure if msPassed is necessary here
  }

  render(canvas: CanvasController){
    const c = canvas.context;
    c.fillStyle = 'rgb(209, 225, 235)';

    const shape: b2PolygonShape = this.body.GetFixtureList().GetShape() as b2PolygonShape;
    const body: b2Body = this.body;
    const position: b2Vec2 = body.GetPosition();

    const vertices: b2Vec2[] = shape.m_vertices.slice(0, 4);
    c.beginPath();
    
    for (let i = 0; i < shape.m_count; i++){
      const xPos = position.x + vertices[i].x;
      const yPos = position.y + vertices[i].y;
      if (i === 0){
        c.moveTo(xPos, yPos);
      }
      else{
        c.lineTo(xPos, yPos);
      }
    }
      
    c.fill();
  }
}