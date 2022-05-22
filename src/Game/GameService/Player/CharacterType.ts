import { Scene } from "../Scene/Scene"
import { Character } from "./Character"
import { Player } from "./Player"
import { PulseCharacter } from "./PlayerTypes/PulseCharacter"

export enum CharacterType {
  Pulse = 'Pulse',
}

export const createCharacterForPlayer = (player: Player, scene: Scene, x: number, y: number): Character => {
  if (player.characterType === CharacterType.Pulse) {
    const character = new PulseCharacter({
      player: player,
      scene: scene,
      x,
      y,
      RADIUS: 0.240,
      DENSITY: 0.5,
      FRICTION: 0.5,
      RESTITUTION: 0.0,
    })
    scene.addCharacter(character)
    return character
  }
  throw Error('Invalid Character Type')
}
