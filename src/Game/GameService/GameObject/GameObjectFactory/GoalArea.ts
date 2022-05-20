import { ActiveEvents, Collider, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { Scene } from "../../Scene/Scene";
import GameObject, { BodyUserData, GameObjectProps } from "../GameObject";

export interface GoalAreaProps extends GameObjectProps {
  w: number;
  h: number;
  onGoal: () => void;
  ballColliders: ColliderHandle[];
  rotation?: number;
}

// At this moment this component is translating from corner origins to center origin for rapier
// I think I want to use corner positioning to make wall layout math easier
export default class GoalArea extends GameObject { // extend something general?
  scene: Scene;
  onGoal: () => void;
  ballColliders: ColliderHandle[];
  
  constructor(props: GoalAreaProps) {
    super();
    this.scene = props.scene;
    this.colliderHandle = this.createCollider(props);
    this.ballColliders = props.ballColliders;
    this.onGoal = props.onGoal
  }

  createCollider(props: GoalAreaProps){
    const groundColliderDesc = ColliderDesc.cuboid(props.w / 2, props.h / 2)
      .setTranslation(props.x + (props.w / 2), props.y + (props.h / 2))
      .setRotation((props.rotation ?? 0)*Math.PI/180)
      .setActiveEvents(ActiveEvents.COLLISION_EVENTS);

    // // Sensor: no collisions triggered, only collision detection
    // fixDef.isSensor = true;

    // bodyDef.type = b2BodyType.b2_staticBody;
    // const userData: BodyUserData = {
    //   gameObject: this,
    //   collisionType: CollisionType.GOAL,
    // }
    // bodyDef.userData = userData;

    const returnColliderHandle = this.scene.world.createCollider(groundColliderDesc).handle;
    return returnColliderHandle;
  }

  // No tick

  render(c: CanvasRenderingContext2D ){
    const collider = this.scene.world.getCollider(this.colliderHandle)
    const { x: halfX, y: halfY } = collider.halfExtents()
    const { x: xPosition, y: yPosition} = collider.translation();
    const rotation = collider.rotation()

    c.beginPath()
    c.fillStyle = 'rgb(24, 144, 255)';
    c.fillRect( xPosition - halfX, yPosition - halfY, halfX*2, halfY*2);
  }

  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean){
    if (started && this.ballColliders.includes(oppositeColliderHandle)) {
      this.onGoal()
    }
  }
}
