import { Vector } from "@dimforge/rapier2d"

export const normalize = (v: Vector): Vector => {
  const magnitude = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
  return {
    x: v.x / magnitude,
    y: v.y / magnitude
  }
}
