import Vue from "vue";

export interface VueServiceConfig {
  placeholder: string;
} 

export interface VueServicePlayer {
  index: number;
  resourceMeter: number;
}

export interface VueServiceState {
  playerDict: Record<number, VueServicePlayer>;
} 

// Information interface between the game (TS) and the UI elements (Vue) 
export class VueServiceImplementation {
  state: VueServiceState; 
  constructor(config: VueServiceConfig){
    this.state = {
      playerDict: {}
    };
  }

  // SET BY GAME
  ////////////////
  addPlayer(playerState: VueServicePlayer){
    Vue.set(this.state.playerDict, playerState.index, playerState);
  }

  setPlayerResourceMeter(playerIndex: number, value: number){
    Vue.set(this.state.playerDict[playerIndex], 'resourceMeter', value);
  }
}

export const VueService = new VueServiceImplementation({placeholder: "uh ok"})