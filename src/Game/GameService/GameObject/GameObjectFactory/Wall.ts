import { LogService } from "@/Game/LogService/LogService";
import { b2Body, b2BodyDef, b2BodyType, b2FixtureDef, b2PolygonShape, b2Vec2, b2World } from "@/lib/Box2D/Box2D";
import { Collider, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface WallProps extends GameObjectProps {
  w: number;
  h: number;
  rotation: number;
}

// At this moment this component is translating from corner origins to center origin for rapier
// still unsure what rapier is using so i;ll just try this out 
export default class Wall extends GameObject { // extend something general?
  scene: Scene;
  colliderHandle: ColliderHandle;
  body: b2Body;
  
  constructor(props: WallProps) {
    super();
    this.scene = props.scene;
    this.colliderHandle = this.createCollider(props);
  }

  createCollider(props: WallProps){
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation(props.rotation*Math.PI/180)
    const returnColliderHandle = this.scene.world.createCollider(groundColliderDesc).handle;
    return returnColliderHandle;
  }

  // No tick

  render(canvas: HTMLCanvasElement){
    const c = canvas.getContext('2d');
    c.fillStyle = 'rgb(209, 225, 235)';

    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: halfX, y: halfY } = collider.halfExtents()
    const { x: xPosition, y: yPosition} = collider.translation();
    const rotation = collider.rotation()

    c.translate( xPosition, yPosition); // todo maybe correct this to account for center vs corner
    c.rotate(rotation);
    c.rect( -halfX, -halfY, halfX*2, halfY*2);
    c.fill();
  }
}
