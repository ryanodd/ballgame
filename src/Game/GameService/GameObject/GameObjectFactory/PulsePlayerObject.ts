import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { CollisionType } from "../../CollisionListener/Collision";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";
import Bezier from "bezierjs"

export interface PulsePlayerProps extends GameObjectProps {
  r: number;
  density: number;
  friction: number;
  restitution: number;
}

export default class PulsePlayerObject extends GameObject { // extend something general?
  scene: Scene;
  body: b2Body;
  props: PulsePlayerProps;
  
  constructor(props: PulsePlayerProps){
    super();
    this.scene = props.scene;
    this.body = this.createBody(props);
    this.props = props;
  }

  createBody = (props: PulsePlayerProps) => {
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
    const userData: BodyUserData = {
      gameObject: this,
      collisionType: CollisionType.DEFAULT,
    }
    bodyDef.userData = userData;
    
    const returnBody = this.scene.world.CreateBody(bodyDef);
    returnBody.CreateFixture(fixDef);
    return returnBody;
  }

  // No tick

  handleMovement(xAxisInput: number, yAxisInput: number){
    const body: b2Body = this.body;
    const vel: b2Vec2 = body.GetLinearVelocity();

    const ACCELERATION_CONSTANT_X = 3;
    const ACCELERATION_CONSTANT_Y = 3;

    // const FRICTION_I_THINK = 0.1
    // const TOP_SPEED_X = 5;
    // const TOP_SPEED_Y = 5;


    let xInputForce = xAxisInput * ACCELERATION_CONSTANT_X;
    let yInputForce = yAxisInput * ACCELERATION_CONSTANT_Y;

    // top speed & quick turnaround
    // Makes force which tends velocity toward orignal input force AT SOME RATE. Is instant? Or does it take a few frames to turn around?
    // I call this strategy "VELOCITY CANCELLING": input/target velocity minus current velocity.
    xInputForce -= vel.x
    yInputForce -= vel.y

    // Don't know how to scalar multiply yet
    const impulseX = body.GetMass() * xInputForce; //disregard time factor. < ??what does this mean?
    const impulseY = body.GetMass() * yInputForce;
    const impulse:  b2Vec2 = new b2Vec2(impulseX, impulseY);

    body.ApplyLinearImpulse(impulse, body.GetWorldCenter());

    // Example of slow turning I think?
    //case MS_LEFT:  desiredVel = b2Max( vel.x - 0.1f, -5.0f ); break;
    //case MS_STOP:  desiredVel = 0; break;
    //case MS_RIGHT: desiredVel = b2Min( vel.x + 0.1f,  5.0f ); break;
  }

  pulse(){
    const pulseRadiusBez = new Bezier(0,0, 0,0, 0,0, 0,0);
  }

  render(canvas: HTMLCanvasElement){
    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(126, 226, 151)';

    const shape: b2CircleShape = this.body.GetFixtureList().GetShape() as b2CircleShape;
    const body: b2Body = this.body;
    const position: b2Vec2 = body.GetPosition();

    c.beginPath();
    c.arc(position.x, position.y, shape.m_radius, 0, Math.PI * 2, true); // Outer circle
    c.fill();
  }
}
