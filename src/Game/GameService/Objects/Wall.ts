import CanvasController from "@/Game/CanvasService/CanvasService";
import { InputResult } from "@/Game/InputService/model/InputResult";
import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2PolygonShape, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import GameObject from "./GameObject";

export interface WallProps {
  world: b2World;
  x: number;
  y: number;
  w: number;
  h: number;
  options: Object;
}

export default class Wall extends GameObject { // extend something general?
  fixture: b2Fixture
  
  constructor(props: WallProps){
    super();
    this.fixture = this.createFixture(props);
  }

  createFixture(props: WallProps){
    const bodyDef = new b2BodyDef();
    const fixDef = new b2FixtureDef();

    fixDef.density = 1.0;
    fixDef.friction = 1.0;
    fixDef.restitution = 0.5;
    
    fixDef.shape = new b2PolygonShape().SetAsBox(props.w / 2 , props.h / 2);
    
    bodyDef.position.Set(props.x + (props.w / 2) , props.y + (props.h / 2));
    
    // Were found in Ball sample code
    // bodyDef.linearDamping = 0.0;
    // bodyDef.angularDamping = 0.0;
    
    bodyDef.type = b2BodyType.b2_staticBody;
    bodyDef.userData = props.options;
    
    return props.world.CreateBody( bodyDef ).CreateFixture(fixDef);
  }

  tick(input: InputResult, msPassed: number){
    // Check input, change physics, whatevs

    // Not sure if msPassed is necessary here
  }

  render(canvas: CanvasController){
    const c = canvas.context;
    c.fillStyle = 'rgb(209, 225, 235)';

    const shape: b2PolygonShape = this.fixture.GetShape() as b2PolygonShape;
    const body: b2Body = this.fixture.GetBody();
    const position: b2Vec2 = body.GetPosition();

    const vertices: b2Vec2[] = shape.m_vertices.slice(0, 4);
    c.beginPath();
    
    vertices.forEach((vertex, i) => {
      const xPos = position.x + vertex.x;
      const yPos = position.y + vertex.y;
      if (i === 0){
        c.moveTo(xPos, yPos);
      }
      else{
        c.lineTo(xPos, yPos);
      }
    })
    c.fill();
  }
}