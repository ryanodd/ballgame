// import { LogService } from "@/Game/LogService/LogService";
// import { b2Body, b2BodyDef, b2BodyType, b2CircleShape, b2Fixture, b2FixtureDef, b2PolygonShape, b2Transform, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
// import { CollisionType } from "../../CollisionListener/Collision";
// import { Scene } from "../../Scene/Scene";
// import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";
// import ShipBullet from "./ShipBullet";

// export interface ShipPlayerProps extends GameObjectProps {
//   noseLength: number;
//   noseWidth: number;
//   tailLength: number;
//   tailWidth: number;

//   density: number;
//   friction: number;
//   restitution: number;
// }

// export default class ShipPlayerObject extends GameObject { // extend something general?
//   scene: Scene;
//   body: b2Body
//   props: ShipPlayerProps;
  
//   constructor(props: ShipPlayerProps){
//     super();
//     this.scene = props.scene;
//     this.body = this.createBody(props);
//     this.props = props;
//   }

//   createBody(props: ShipPlayerProps){
//     const bodyDef = new b2BodyDef();
//     const fixADef = new b2FixtureDef;
//     const fixBDef = new b2FixtureDef;
    
//     fixADef.density = props.density;
//     fixADef.friction = props.friction;
//     fixADef.restitution = props.restitution;

//     const shapeA = new b2PolygonShape();
//     shapeA.Set([
//       new b2Vec2(0, 0),
//       new b2Vec2(props.noseLength, 0),
//       new b2Vec2(props.noseLength, props.noseWidth / 2),
//       new b2Vec2(-props.tailLength, props.tailWidth / 2)
//     ])
//     fixADef.shape = shapeA;

//     fixBDef.density = props.density;
//     fixBDef.friction = props.friction;
//     fixBDef.restitution = props.restitution;

//     const shapeB = new b2PolygonShape();
//     shapeB.Set([
//       new b2Vec2(0, 0),
//       new b2Vec2(props.noseLength, 0),
//       new b2Vec2(props.noseLength, -props.noseWidth / 2),
//       new b2Vec2(-props.tailLength, -props.tailWidth / 2)
//     ])
//     fixBDef.shape = shapeB;
    
//     bodyDef.position.Set(props.x , props.y);
//     bodyDef.linearDamping = 1.0;
//     bodyDef.angularDamping = 0.0;
//     bodyDef.type = b2BodyType.b2_dynamicBody;
//     const userData: BodyUserData = {
//       gameObject: this,
//       collisionType: CollisionType.DEFAULT,
//     }
//     bodyDef.userData = userData;
    
//     const returnBody = this.scene.world.CreateBody( bodyDef )
//     returnBody.CreateFixture(fixADef)
//     returnBody.CreateFixture(fixBDef);
    
//     return returnBody;
//   }

//   //No tick function needed

//   handleRotation(rotationAxisInput: number){
//     const ROTATION_CONSTANT = 4;

//     const body: b2Body = this.body;
  
//     const rotationAxisForce = rotationAxisInput * ROTATION_CONSTANT;
//     const currentTorque = body.GetAngularVelocity() //max speed, quick decleration.
    
//     body.ApplyTorque(-rotationAxisForce - currentTorque);
//   }

//   thrust(){
//     const ACCELERATION_CONSTANT = 0.025;

//     const body: b2Body = this.body;
//     const rotation = body.GetTransform().GetRotation()
//     const forceToApply: b2Vec2 = new b2Vec2(rotation.c * ACCELERATION_CONSTANT, rotation.s * ACCELERATION_CONSTANT);
//     body.ApplyLinearImpulseToCenter(forceToApply);
//   }

//   createBullet(): ShipBullet {
//     const BULLET_WIDTH = 0.25;
//     const BULLET_HEIGHT = 0.2;
//     const BULLET_SEPARATION = 0.1; // Hack so the bullet don't collide with the ship

//     const noseTipShapePositionOutput = new b2Vec2(0, 0);
//     this.body.GetWorldPoint(new b2Vec2(this.props.noseLength + BULLET_SEPARATION, -(BULLET_HEIGHT / 2)), noseTipShapePositionOutput) 

//     LogService.log(noseTipShapePositionOutput)
//     const bulletObject = new ShipBullet({
//       scene: this.scene,
//       x: noseTipShapePositionOutput.x,
//       y: noseTipShapePositionOutput.y,
//       w: 0.25,
//       h: 0.2,
//       angle: this.body.GetAngle(),
//     });
//     this.scene.addGameObject(bulletObject);
//     return bulletObject;
//   }

//   render(c: CanvasRenderingContext2D ){
//     const c = canvas.getContext('2d');
//     c.fillStyle = 'rgb(126, 226, 151)';

//     const body: b2Body = this.body;
//     const position: b2Vec2 = body.GetPosition();

//     const transformation: b2Transform = body.GetTransform()

//     let fixture: b2Fixture = this.body.GetFixtureList();
//     while (fixture !== null){
//       const shape = fixture.GetShape() as b2PolygonShape;
//       c.beginPath();
//       const vertices = shape.m_vertices;
//       for (let i = 0; i < shape.m_count; i++){
//         const outputVec = new b2Vec2(0, 0);
//         body.GetWorldPoint(vertices[i], outputVec);
//         if (i === 0){
//           c.moveTo(outputVec.x, outputVec.y);
//         }
//         else{
//           c.lineTo(outputVec.x, outputVec.y);
//         }
//       }
//       c.fill();
      
//       fixture = fixture.m_next;
//     }
//   }
// }
