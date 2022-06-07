import { Scene } from "../Scene/Scene"
import { Character } from "./Character"
import { Player } from "./Player"
import { PulseCharacter } from "./PlayerTypes/PulseCharacter"
import { ShipCharacter } from "./PlayerTypes/ShipCharacter"
import { TankCharacter } from "./PlayerTypes/TankCharacter"

export enum CharacterType {
  Pulse = 'Pulse',
  Ship = 'Ship',
  Tank = 'Tank',
}

export const createCharacterForPlayer = (player: Player, scene: Scene, x: number, y: number): Character => {
  if (player.characterType === CharacterType.Pulse) {
    const character = new PulseCharacter({
      player: player,
      scene: scene,
      x,
      y,
      RADIUS: 0.15,
      DENSITY: 0.5,
      FRICTION: 0.5,
      RESTITUTION: 0.0,
    })
    scene.addCharacter(character)
    return character
  }
  if (player.characterType === CharacterType.Ship) {
    const character = new ShipCharacter({
      player: player,
      scene: scene,
      x,
      y,
      HALF_WIDTH: 0.3,
      HALF_LENGTH: 0.35,
      NOSE_WIDTH: 0.02,
      TAIL_LENGTH: 0.15,
      DENSITY: 2,
      FRICTION: 0.5,
      RESTITUTION: 0.0,
    })
    scene.addCharacter(character)
    return character
  }
  if (player.characterType === CharacterType.Tank) {
    const character = new TankCharacter({
      player: player,
      scene: scene,
      x,
      y,
      DENSITY: 2,
      FRICTION: 0.5,
      RESTITUTION: 0.0,
    })
    scene.addCharacter(character)
    return character
  }
  throw Error('Invalid Character Type')
}
