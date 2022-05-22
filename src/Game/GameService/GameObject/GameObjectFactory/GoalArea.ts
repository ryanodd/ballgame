import { ActiveEvents, ColliderDesc, ColliderHandle } from "@dimforge/rapier2d";
import { Scene } from "../../Scene/Scene";
import GameObject, { GameObjectProps } from "../GameObject";

export interface GoalAreaProps extends GameObjectProps {
  w: number;
  h: number;
  color: string;
  onGoal: () => void;
  ballColliders: ColliderHandle[];
  rotation?: number;
}

export const GOAL_AREA_OBJ = 'GoalArea'
export const isGoalAreaObject = (o: GameObject): o is GoalArea => {
  return o.id === GOAL_AREA_OBJ
}
export default class GoalArea extends GameObject { // extend something general?
  id = GOAL_AREA_OBJ;
  color: string;
  scene: Scene;
  spawnFrame: number;
  colliderHandle: ColliderHandle;
  rigidBodyHandle: null = null;

  onGoal: () => void;
  ballColliders: ColliderHandle[];
  
  constructor(props: GoalAreaProps) {
    super();
    this.scene = props.scene;
    this.color = props.color;
    this.spawnFrame = props.spawnFrame ?? 0;
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
    c.fillStyle = this.color;
    c.fillRect( xPosition - halfX, yPosition - halfY, halfX*2, halfY*2);
  }

  handleCollision(oppositeColliderHandle: ColliderHandle, started: boolean){
    if (started && this.ballColliders.includes(oppositeColliderHandle)) {
      this.onGoal()
    }
  }
}
