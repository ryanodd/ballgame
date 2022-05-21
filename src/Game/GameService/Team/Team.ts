import { store } from "../../../../pages/_app";
import { JSONObject } from "../../../lib/netplayjs";
import { SET_TEAM_DATA } from "../../../redux/actions";
import { Character } from "../Player/Character";

export interface TeamProps {
  teamIndex: number;
  characters: Character[];
}

export class Team {
  teamIndex: number;
  characters: Character[];
  score: number;

  constructor({teamIndex, characters}: TeamProps) {
    this.teamIndex = teamIndex
    this.characters = characters
    this.score = 0;
    this.updateScore()
  }

  serialize(): JSONObject {
    return {
      score: this.score,
      characters: this.characters.map(character => character.serialize())
    }
  }

  deserialize(value: JSONObject) {
    this.score = value['score']
    this.characters.forEach((character, i) => {
      character.deserialize(value['characters'][i])
    })
    this.updateScore()
  }

  onGoal() {
    this.score += 1
    this.updateScore()
  }
  reset() {
    this.score = 0
    this.updateScore()
  }
  updateScore() {
    store.dispatch({type: SET_TEAM_DATA, payload: {
      teamIndex: this.teamIndex,
      teamData: { score: this.score }
    }})
  }
}
