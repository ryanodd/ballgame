import CanvasController from "@/Game/CanvasService/CanvasService";
import { InputResult } from "@/Game/InputService/model/InputResult";
import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import GameObject from "../GameObject";

export interface PulsePlayerProps {
  world: b2World;
  x: number;
  y: number;
  r: number;
  density: number;
  friction: number;
  restitution: number;
  options: Record<string, any>;
}

export default class PulsePlayer extends GameObject { // extend something general?
  body: b2Body;
  
  constructor(props: PulsePlayerProps){
    super();
    this.body = this.createBody(props);
  }

  createBody(props: PulsePlayerProps){
    const bodyDef = new b2BodyDef();
    const fixDef = new b2FixtureDef;
  
    fixDef.density = props.density;
    fixDef.friction = props.friction;
    fixDef.restitution = props.restitution;
    
    const shape = new b2CircleShape(props.r);
    fixDef.shape = shape;
    
    bodyDef.position.Set(props.x , props.y);
    
    bodyDef.linearDamping = 0.0;
    bodyDef.angularDamping = 0.0;
    
    bodyDef.type = b2BodyType.b2_dynamicBody;
    bodyDef.userData = props.options;
    
    const returnBody = props.world.CreateBody(bodyDef);
    returnBody.CreateFixture(fixDef);
    return returnBody;
  }

  tick(input: InputResult){
    const body: b2Body = this.body;
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
    // Makes force which tends velocity toward orignal input force AT SOME RATE. Is instant? Or does it take a few frames to turn around?
    xInputForce -= vel.x
    yInputForce -= vel.y

    // Don't know how to scalar multiply yet
    const impulseX = body.GetMass() * xInputForce; //disregard time factor. < ??what does this mean?
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

    const shape: b2CircleShape = this.body.GetFixtureList().GetShape() as b2CircleShape;
    const body: b2Body = this.body;
    const position: b2Vec2 = body.GetPosition();

    c.beginPath();
    c.arc(position.x, position.y, shape.m_radius, 0, Math.PI * 2, true); // Outer circle
    c.fill();
  }
}