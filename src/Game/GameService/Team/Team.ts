
import { VueService } from "@/Game/VueService/VueService";
import { ConsoleLogger } from "@aws-amplify/core";
import Vue from "vue";
import { Player } from "../Player/Player";

export interface TeamProps {
  teamIndex: number;
  players: Player[];
}

export class Team {
  teamIndex: number;
  players: Player[];
  score: number;

  constructor({teamIndex, players}: TeamProps) {
    this.teamIndex = teamIndex
    this.players = players
    this.score = 0;
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
    console.log(this.teamIndex)
    if (this.teamIndex === 0) {
      VueService.setTeam1Score(this.score)
    }
    else if (this.teamIndex === 1) {
      VueService.setTeam2Score(this.score)
    }
  }
}
