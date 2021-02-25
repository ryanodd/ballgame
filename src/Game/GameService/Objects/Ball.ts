import CanvasController from "@/Game/CanvasService/CanvasService";
import { InputResult } from "@/Game/InputService/model/InputResult";
import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import GameObject from "./GameObject";

export interface BallProps {
  world: b2World;
  x: number;
  y: number;
  r: number;
  options: Object;
}

export default class Ball extends GameObject { // extend something general?
  fixture: b2Fixture
  
  constructor(props: BallProps){
    super();
    this.fixture = this.createFixture(props);
  }

  createFixture(props: BallProps){
    var body_def = new b2BodyDef();
    var fix_def = new b2FixtureDef;
    
    fix_def.density = 1.0;
    fix_def.friction = 0.2;
    fix_def.restitution = 0.8;
    
    var shape = new b2CircleShape(props.r);
    fix_def.shape = shape;
    
    body_def.position.Set(props.x , props.y);
    
    body_def.linearDamping = 0.8;
    body_def.angularDamping = 0.2;
    
    body_def.type = b2BodyType.b2_dynamicBody;
    body_def.userData = props.options;
    
    return props.world.CreateBody( body_def ).CreateFixture(fix_def);
  }

  tick(input: InputResult, msPassed: number){
    // Check input, change physics, whatevs

    // Not sure if msPassed is necessary here
  }

  render(canvas: CanvasController){
    const c = canvas.context;
    c.fillStyle = 'rgb(200, 0, 0)';

    const shape: b2CircleShape = this.fixture.GetShape() as b2CircleShape;
    const body: b2Body = this.fixture.GetBody();
    const position: b2Vec2 = body.GetPosition();

    c.beginPath();
    c.arc(position.x, position.y, shape.m_radius, 0, Math.PI * 2, true); // Outer circle
    c.fill();
  }
}