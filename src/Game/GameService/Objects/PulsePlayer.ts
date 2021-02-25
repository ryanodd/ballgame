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

export default class PulsePlayer extends GameObject { // extend something general?
  fixture: b2Fixture
  
  constructor(props: BallProps){
    super();
    this.fixture = this.createFixture(props);
  }

  createFixture(props: BallProps){
    var body_def = new b2BodyDef();
    var fix_def = new b2FixtureDef;
    
    fix_def.density = 1.0;
    fix_def.friction = 0.5;
    fix_def.restitution = 0.5;
    
    var shape = new b2CircleShape(props.r);
    fix_def.shape = shape;
    
    body_def.position.Set(props.x , props.y);
    
    body_def.linearDamping = 0.0;
    body_def.angularDamping = 0.0;
    
    body_def.type = b2BodyType.b2_dynamicBody;
    body_def.userData = props.options;
    
    return props.world.CreateBody( body_def ).CreateFixture(fix_def);
  }

  tick(input: InputResult, msPassed: number){
    const body: b2Body = this.fixture.GetBody();
    const vel: b2Vec2 = body.GetLinearVelocity();

    const ACCELERATION_CONSTANT_X = 5;
    const ACCELERATION_CONSTANT_Y = 5;

    const FRICTION_I_THINK = 0.1

    const TOP_SPEED_X = 5;
    const TOP_SPEED_Y = 5;

    const xInput = input.primaryPlayerInput.leftStickXAxis;
    const yInput = input.primaryPlayerInput.leftStickYAxis;
    let xInputForce = xInput * ACCELERATION_CONSTANT_X;
    let yInputForce = yInput * ACCELERATION_CONSTANT_Y;

    // top speed & quick turnaround
    xInputForce -= vel.x
    yInputForce -= vel.y

    // Don't know how to scalar multiply yet
    const impulseX = body.GetMass() * xInputForce; //disregard time factor
    const impulseY = body.GetMass() * yInputForce;
    const impulse:  b2Vec2 = new b2Vec2(impulseX, impulseY);

    body.ApplyLinearImpulse(impulse, body.GetWorldCenter());
    //case MS_LEFT:  desiredVel = b2Max( vel.x - 0.1f, -5.0f ); break;
    //case MS_STOP:  desiredVel = 0; break;
    //case MS_RIGHT: desiredVel = b2Min( vel.x + 0.1f,  5.0f ); break;
  }

  render(canvas: CanvasController){
    const c = canvas.context;
    c.fillStyle = 'rgb(126, 226, 151)';

    const shape: b2CircleShape = this.fixture.GetShape() as b2CircleShape;
    const body: b2Body = this.fixture.GetBody();
    const position: b2Vec2 = body.GetPosition();

    c.beginPath();
    c.arc(position.x, position.y, shape.m_radius, 0, Math.PI * 2, true); // Outer circle
    c.fill();
  }
}