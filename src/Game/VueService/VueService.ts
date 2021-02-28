import Vue from "vue";

export interface VueServiceConfig {
  placeholder: string;
} 

// Information interface between the game (TS) and the UI elements (Vue) 
export class VueServiceImplementation {
  primaryPlayerResourceMeter: number; 
  constructor(config: VueServiceConfig){
    this.primaryPlayerResourceMeter = 101;
  }

  // SET BY GAME
  ////////////////
  setPrimaryPlayerResourceMeter(value: number){
    Vue.set(this, 'primaryPlayerResourceMeter', value);
  }
}

export const VueService = new VueServiceImplementation({placeholder: "uh ok"})