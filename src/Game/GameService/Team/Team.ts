import { urlToHttpOptions } from "url";
import { store } from "../../../../pages/_app";
import { JSONValue } from "../../../lib/netplayjs";
import { SET_TEAM_DATA } from "../../../redux/actions";

export interface TeamProps {
  teamIndex: number;
  color: string; // used as fillStyle of the canvas
}

export class Team {
  teamIndex: number;
  score: number;
  color: string;

  constructor({teamIndex, color}: TeamProps) {
    this.teamIndex = teamIndex
    this.color = color;
    store.dispatch({
      type: SET_TEAM_DATA,
      payload: {
        teamIndex: this.teamIndex,
        teamData: {
          color: this.color,
        },
      }
    })
    this.score = 0;
    this.updateScore()
  }

  serialize(): any {
    return {
      score: this.score,
    }
  }

  deserialize(value: any) {
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
