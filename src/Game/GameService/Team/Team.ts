import { store } from "../../../../pages/_app";
import { JSONObject } from "../../../lib/netplayjs";
import { SET_TEAM_DATA } from "../../../redux/actions";
import { Character } from "../Player/Character";

export interface TeamProps {
  teamIndex: number;
}

export class Team {
  teamIndex: number;
  score: number;

  constructor({teamIndex}: TeamProps) {
    this.teamIndex = teamIndex
    this.score = 0;
    this.updateScore()
  }

  serialize(): JSONObject {
    return {
      score: this.score,
    }
  }

  deserialize(value: JSONObject) {
    this.score = value['score']
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
