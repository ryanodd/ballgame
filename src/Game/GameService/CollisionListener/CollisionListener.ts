import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2Contact, b2ContactImpulse, b2ContactListener, b2Manifold, b2Transform } from "@/lib/Box2D/Box2D"
import GameObject from "../GameObject/GameObject";
import ShipBullet from "../GameObject/GameObjectFactory/ShipBullet";
import { CollisionType } from "./Collision"

class ContactListenerImplementation extends b2ContactListener{
 
  // BeginContact(contact: b2Contact){

  // }
 
  EndContact(contact: b2Contact) {
    const bodyA = contact.m_fixtureA.m_body;
    const bodyB = contact.m_fixtureB.m_body;
    
    if (this.isBodyOfCollisionType(bodyA, CollisionType.BULLET)){
      const bulletGameObject = this.getBodyGameObject(bodyA) as ShipBullet;
      bulletGameObject.afterCollisionWithAny();
    }
    if (this.isBodyOfCollisionType(bodyB, CollisionType.BULLET)){
      const bulletGameObject = this.getBodyGameObject(bodyB) as ShipBullet;
      bulletGameObject.afterCollisionWithAny();
    }
  }

  // PreSolve(contact: b2Contact, oldManifold: b2Manifold) {

  // }

  // PostSolve(contact: b2Contact, impulse: b2ContactImpulse) {

  // }

  isBodyOfCollisionType(body: b2Body, type: CollisionType): boolean {
    const bodyCollisionType = body.m_userData.collisionType;
    return (bodyCollisionType === type);  
  }

  getBodyGameObject(body: b2Body): GameObject {
    return body.m_userData.gameObject 
  }

  // private doesContactIncludeType(contact: b2Contact, collisionType: CollisionType) {
  // }
}

export const ContactListener = new ContactListenerImplementation();
