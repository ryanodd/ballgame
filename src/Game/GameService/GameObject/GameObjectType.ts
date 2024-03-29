import GameObject from "./GameObject";
import Ball, { BALL_OBJ_ID } from "./GameObjectFactory/Ball";
import GoalArea, { GOAL_AREA_OBJ_ID } from "./GameObjectFactory/GoalArea";
import ImageWall, { IMAGE_WALL_OBJ_ID } from "./GameObjectFactory/ImageWall";
import PulseCharacterObject, { PULSE_OBJ_ID } from "./GameObjectFactory/PulseCharacterObject";
import { RepelGraphic, REPEL_GRAPHIC_OBJ_ID } from "./GameObjectFactory/RepelGraphic";
import ShipBullet, { SHIP_BULLET_OBJ_ID } from "./GameObjectFactory/ShipBullet";
import ShipCharacterObject, { SHIP_OBJ_ID } from "./GameObjectFactory/ShipCharacterObject";
import Wall, { WALL_OBJ_ID } from "./GameObjectFactory/Wall";

export const getGameObjectById = (gameObjectId: string) => {
  if (gameObjectId === BALL_OBJ_ID) return Ball
  if (gameObjectId === GOAL_AREA_OBJ_ID) return GoalArea
  if (gameObjectId === IMAGE_WALL_OBJ_ID) return ImageWall
  if (gameObjectId === PULSE_OBJ_ID) return PulseCharacterObject
  if (gameObjectId === REPEL_GRAPHIC_OBJ_ID) return RepelGraphic
  if (gameObjectId === WALL_OBJ_ID) return Wall
  if (gameObjectId === SHIP_OBJ_ID) return ShipCharacterObject
  if (gameObjectId === SHIP_BULLET_OBJ_ID) return ShipBullet
  throw new Error(`Invalid game object type: ${gameObjectId}`)
}
