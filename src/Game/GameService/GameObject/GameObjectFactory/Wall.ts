import { Collider, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface WallProps extends GameObjectProps {
  w: number;
  h: number;
  rotation?: number;
}

// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class Wall extends GameObject { // extend something general?
  scene: Scene;
  
  constructor(props: WallProps) {
    super();
    this.scene = props.scene;
    this.colliderHandle = this.createCollider(props);
  }

  createCollider(props: WallProps){
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation((props.rotation ?? 0)*Math.PI/180)
    const returnColliderHandle = this.scene.world.createCollider(groundColliderDesc).handle;
    return returnColliderHandle;
  }

  // No tick

  render(c: CanvasRenderingContext2D ){
    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: halfX, y: halfY } = collider.halfExtents()
    const { x: xPosition, y: yPosition} = collider.translation();
    const rotation = collider.rotation()

    c.fillStyle = 'rgb(209, 225, 235)';
    c.fillRect( xPosition - halfX, yPosition - halfY, halfX*2, halfY*2);
  }
}
