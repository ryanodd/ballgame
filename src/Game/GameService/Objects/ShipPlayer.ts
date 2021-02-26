import CanvasController from "@/Game/CanvasService/CanvasService";
import { InputResult } from "@/Game/InputService/model/InputResult";
import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2PolygonShape, b2Transform, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import GameObject from "./GameObject";

export interface ShipPlayerProps {
  world: b2World;
  x: number;
  y: number;
  
  noseLength: number;
  noseWidth: number;
  tailLength: number;
  tailWidth: number;

  options: Record<string, any>;
}

export default class ShipPlayer extends GameObject { // extend something general?
  body: b2Body
  
  constructor(props: ShipPlayerProps){
    super();
    this.body = this.createBody(props);
  }

  createBody(props: ShipPlayerProps){
    const bodyDef = new b2BodyDef();
    const fixADef = new b2FixtureDef;
    const fixBDef = new b2FixtureDef;
    
    fixADef.density = 2;
    fixADef.friction = 0.5;
    fixADef.restitution = 0.0;
    const shapeA = new b2PolygonShape();
    shapeA.Set([new b2Vec2(0, 0), new b2Vec2(props.noseLength, 0), new b2Vec2(props.noseLength, props.noseWidth / 2), new b2Vec2(-props.tailLength, props.tailWidth / 2)])
    fixADef.shape = shapeA;

    fixBDef.density = 2;
    fixBDef.friction = 0.5;
    fixBDef.restitution = 0.0;
    const shapeB = new b2PolygonShape();
    shapeB.Set([new b2Vec2(0, 0), new b2Vec2(props.noseLength, 0), new b2Vec2(props.noseLength, -props.noseWidth / 2), new b2Vec2(-props.tailLength, -props.tailWidth / 2)])
    LogService.log(shapeB);
    fixBDef.shape = shapeB;
    
    bodyDef.position.Set(props.x , props.y);
    bodyDef.linearDamping = 1.0;
    bodyDef.angularDamping = 0.0;
    bodyDef.type = b2BodyType.b2_dynamicBody;
    bodyDef.userData = props.options;
    
    const returnBody = props.world.CreateBody( bodyDef )
    returnBody.CreateFixture(fixADef)
    returnBody.CreateFixture(fixBDef);
    
    return returnBody;
  }

  tick(input: InputResult){
    const body: b2Body = this.body;
    const vel: b2Vec2 = body.GetLinearVelocity();

    const ROTATION_CONSTANT = 4;
    const ACCELERATION_CONSTANT = 0.025;

    const xInput = input.primaryPlayerInput.leftStickXAxis;
    const xInputForce = xInput * ROTATION_CONSTANT;
    const currentTorque = body.GetAngularVelocity()
    
    body.ApplyTorque(-xInputForce - currentTorque);

    const button1Input: boolean = input.primaryPlayerInput.button1
    if (button1Input){
      const rotation = body.GetTransform().GetRotation()
      const forceToApply: b2Vec2 = new b2Vec2(rotation.c * ACCELERATION_CONSTANT, rotation.s * ACCELERATION_CONSTANT);
      body.ApplyLinearImpulseToCenter(forceToApply);
    }
  }

  render(canvas: CanvasController){
    const c = canvas.context;
    c.fillStyle = 'rgb(126, 226, 151)';

    const body: b2Body = this.body;
    const position: b2Vec2 = body.GetPosition();

    const transformation: b2Transform = body.GetTransform()

    let fixture: b2Fixture = this.body.GetFixtureList();
    while (fixture !== null){
      const shape = fixture.GetShape() as b2PolygonShape;
      c.beginPath();
      const vertices = shape.m_vertices;
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
      
      fixture = fixture.m_next;
    }
  }
}