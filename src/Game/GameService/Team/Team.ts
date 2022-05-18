
import { VueService } from "@/Game/VueService/VueService";
import { JSONValue } from "@/lib/netplayjs";
import { ConsoleLogger } from "@aws-amplify/core";
import Vue from "vue";
import { Character } from "../Player/Character";
import { Player } from "../Player/Player";

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
  }

  serialize(): JSONValue {
    return {
      score: this.score,
      characters: this.characters.map(character => character.serialize())
    }
  }

  deserialize(value: JSONValue) {
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
    if (this.teamIndex === 0) {
      VueService.setTeam1Score(this.score)
    }
    else if (this.teamIndex === 1) {
      VueService.setTeam2Score(this.score)
    }
  }
}
